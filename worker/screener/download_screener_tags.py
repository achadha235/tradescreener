## Scrapy spider to download tags from the screener website for intrino
## IntrinioScreenerTagsSpider
## Usage: scrapy crawl IntrinioScreenerTagsSpider -o screener_tags.csv

import scrapy
import re
from bs4 import BeautifulSoup
from screener.screener import screener_filter_tags
import pandas as pd

USER_AGENT = "Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"


def is_data_tag_link(s):
    return re.search("/data-tag/", s) is not None


def is_data_tags_list_link(s):
    return re.search("/data-tags/", s) is not None


data_tags_start_urls = list(
    map(
        lambda x: "https://data.intrinio.com/data-tag/" + x.split(":")[0].strip(),
        screener_filter_tags.split(", "),
    )
)


class IntrinioScreenerTagsSpider(scrapy.Spider):
    name = "intrinioscreenertagsspider"
    start_urls = data_tags_start_urls

    custom_settings = {"DOWNLOAD_DELAY": 0.5}  # 2 seconds of delay

    def parse(self, response):
        print("Parsing...")
        result = {}
        soup = BeautifulSoup(response.text, "html.parser")
        details_element = soup.find("div", {"id": "details"})
        details_df = pd.read_html(str(details_element))[0]

        definitions_element = soup.find("div", {"id": "definition"})
        if definitions_element:
            definitions_paras = definitions_element.find_all("p")
            definition = ". ".join(list(map(lambda x: x.text, definitions_paras)))
            result["definition"] = definition

        result["name"] = soup.find("h1").text

        def get_detail(detail_name):
            try:
                return details_df.loc[details_df[0] == detail_name][1].iloc[0]
            except:
                return ""

        result["tag"] = get_detail("Intrinio Tag")
        result["statements"] = get_detail("Statements")
        result["templates"] = get_detail("Templates")
        result["type"] = get_detail("Type")
        result["units"] = get_detail("Units")
        result["historical"] = get_detail("Historical?") == "Yes"
        result["screenable"] = get_detail("Screenable?") == "Yes"
        return result

    def start_requests(self):
        for url in self.start_urls:
            yield scrapy.Request(
                url=url,
                callback=self.parse,
                headers={
                    "User-Agent": USER_AGENT,
                    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                },
            )
