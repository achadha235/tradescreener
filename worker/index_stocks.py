from dotenv import load_dotenv

load_dotenv()

import os
import json
import logging

import pandas as pd
from functools import cache
from tqdm import tqdm
from p_tqdm import p_map
from sqlalchemy import create_engine
import intrinio_sdk as intrinio

from scrapy import signals
from scrapy.crawler import CrawlerProcess
from scrapy.signalmanager import dispatcher

from screener.download_screener_tags import IntrinioScreenerTagsSpider
from screener.constants import screener_filter_tags

intrinio.ApiClient().set_api_key(os.getenv("INTRINIO_API_KEY"))
intrinio.ApiClient().allow_retries = True

logging.getLogger("snowflake.connector").setLevel(logging.WARNING)
logging.getLogger("asyncio").setLevel(logging.WARNING)

security_api = intrinio.SecurityApi()
securities_api = intrinio.SecurityApi()
companies_api = intrinio.CompanyApi()
fundamentals_api = intrinio.FundamentalsApi()


## Basic function to get datatags and fetch lists of tickers
@cache
def get_datatags(
    datatag_file_path=os.path.join(os.path.dirname(__file__), "datatags.json")
):
    with open(datatag_file_path) as file:
        return json.loads(file.read())


@cache
def get_enabled_screener_filters():
    return list(
        map(
            lambda x: list(map(lambda y: y.strip(), x.split(":"))),
            screener_filter_tags.split(", "),
        )
    )


@cache
def get_sp500_tickers():
    table = pd.read_html("https://en.wikipedia.org/wiki/List_of_S%26P_500_companies")
    df = table[0]
    return set(df["Symbol"].values)


@cache
def get_dowjones_tickers():
    table = pd.read_html("https://en.wikipedia.org/wiki/Dow_Jones_Industrial_Average")
    df = table[1]
    return set(df["Symbol"].values)


datatags = get_datatags()
enabled_screener_filters = get_enabled_screener_filters()

ACCOUNT = os.getenv("SNOWFLAKE_ACCOUNT", "uxa63006.us-east-1")
USER = os.getenv("SNOWFLAKE_USER", "abhi")
PASSWORD = os.getenv("SNOWFLAKE_PASSWORD")
DATABASE = os.getenv("SNOWFLAKE_DATABASE", "INTRINIOV2")
WAREHOUSE = os.getenv("SNOWFLAKE_WAREHOUSE", "PROD_WH")
SCHEMA = os.getenv("SNOWFLAKE_SCHEMA", "PUBLIC")
SNOWFLAKE_URL = f"snowflake://{USER}:{PASSWORD}@{ACCOUNT}/{DATABASE}/{SCHEMA}?warehouse={WAREHOUSE}&role=PUBLIC"
CHUNK_SIZE = os.getenv("SNOWFLAKE_CHUNK_SIZE", 50000)


def fetch_pandas_sqlalchemy(sql, index_col=None, **kwargs):
    """Read data from Intrinio Snowflake"""
    engine = create_engine(SNOWFLAKE_URL, connect_args={"insecure_mode": True})
    return pd.concat(
        [
            chunk
            for chunk in pd.read_sql_query(
                sql,
                engine,
                chunksize=kwargs.get("chunksize", CHUNK_SIZE),
                index_col=index_col,
                **kwargs,
            )
        ]
    )


def get_basic_stock_data(company_id):
    """Fetch basic data for a company given its Intrinio company ID"""
    company = companies_api.get_company(company_id)
    ticker = company.ticker
    description = company.long_description
    website = company.company_url
    name = company.name
    sector = company.sector
    industry_group = company.industry_group
    industry_category = company.industry_category

    stock_exchange = company.stock_exchange

    return {
        "company_id": company_id,
        "ticker": ticker,
        "name": name,
        "description": description,
        "website": website,
        "sector": sector,
        "industry_group": industry_group,
        "industry_category": industry_category,
        "stock_exchange": stock_exchange,
    }


def get_full_stock_data(company_id: str):
    """Fetches all the enabled datatags / screener filters for each company, as well as its membership in SP500 and Nasdaq"""
    try:
        data = get_basic_stock_data(company_id)
    except Exception as e:
        return None
    for [tag, type] in enabled_screener_filters:
        if tag in data:
            continue

        try:
            if type == "String":
                data[tag] = securities_api.get_security_data_point_text(company_id, tag)
            else:
                data[tag] = securities_api.get_security_data_point_number(
                    company_id, tag
                )
        except Exception as e:
            data[tag] = None
            if "No meaningful data" in e.body:
                pass
            else:
                pass

    data["is_sp500"] = data["ticker"] in get_sp500_tickers()
    data["is_dowjones"] = data["ticker"] in get_dowjones_tickers()
    return data


def get_all_trading_days():
    DEFAULT_START_DATE = "2022-01-01"
    query = f"""
        --begin-sql
        SELECT "DATE" FROM STOCK_PRICES_USCOMP_V2 
        WHERE "TICKER" = 'AAPL' AND "TYPE"='EOD' AND "FREQUENCY"='daily' AND "DATE" > '{DEFAULT_START_DATE}'
        ORDER BY "DATE" ASC
        --end-sql
    """
    data = fetch_pandas_sqlalchemy(query, index_col="date")
    return list(data.index)


def get_all_company_ids():
    """Fetches the list of tickers we should scan to build our index. This is a list of all active, non-delisted, US securities that are ordinary shares"""
    query = f"""
        --begin-sql
            select distinct(securities.id), securities.ticker, name, cik, exchange_code
            from companies
            join securities on companies.cik = securities.cik_id
            where active = true and delisted = false and exchange_code in ('USNASD', 'USNYSE', 'USOTC') and security_type = 'Ordinary Shares' and standardized_active = true
        --end-sql
    """

    data = fetch_pandas_sqlalchemy(query, index_col="id")
    return list(data.index)


## Runs the crawler to fetch all the screener filters avaliable on Intrinio
def spider_results():
    results = []

    def crawler_results(signal, sender, item, response, spider):
        results.append(item)

    dispatcher.connect(crawler_results, signal=signals.item_scraped)

    process = CrawlerProcess()
    process.crawl(IntrinioScreenerTagsSpider)
    process.start()
    return results


if __name__ == "__main__":
    output_dir = "./data"
    skipped = []

    ## Helper function to download data for a single company
    ## Ensures the program can be restarted without re-downloading data for all stocks again
    def download_stock_data(company_id):
        file_dir = os.path.join(output_dir, f"{company_id}.json")
        if os.path.exists(file_dir):
            return
        result = get_full_stock_data(company_id)
        if result is None:
            skipped.append(company_id)
            return
        with open(os.path.join(output_dir, f"{company_id}.json"), "w") as f:
            f.write(json.dumps(result, indent=2))

    r = p_map(download_stock_data, get_all_company_ids(), num_cpus=6)

    ## Log which tickers were skipped
    print("Skipped", skipped)
