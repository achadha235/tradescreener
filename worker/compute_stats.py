## Routines to calculate stats on the raw data for the screener averages, medians etc. for each metric

import os
import json
import pandas as pd


# Directory where JSON files are stored
def build_screener_raw_index():
    dir_path = os.path.dirname(__file__, "..", "data")
    # Get list of all JSON files
    json_files = [
        pos_json for pos_json in os.listdir(dir_path) if pos_json.endswith(".json")
    ]

    # Empty list to store each DataFrame
    df_list = []

    # Iterate over JSON files and add each to the list as a DataFrame
    for index, js in enumerate(json_files):
        with open(os.path.join(dir_path, js)) as json_file:
            json_text = json.load(json_file)

        # Convert JSON to DataFrame
        df = pd.json_normalize(json_text)

        # Append DataFrame to list
        df_list.append(df)

    # Concatenate all the DataFrames in the list into one DataFrame
    final_df = pd.concat(df_list, ignore_index=True)
    final_df.to_csv("screener-index-raw.csv")


def load_raw_index():
    df = pd.read_csv("screener-index-raw.csv")
    all_sectors = set(df["sector"])
    all_industry_categories = set(df["industry_category"])
    all_industry_groups = set(df["industry_group"])

    sector_stats = {}
    industry_category_stats = {}
    industry_group_stats = {}

    def calculate_stats(df):
        res = {}
        if df.empty:
            return None

        for col in df.columns:
            if col == df.columns[0]:
                continue
            if not pd.api.types.is_numeric_dtype(df[col]):
                continue
            if pd.api.types.is_bool_dtype(df[col]):
                continue
            c = df[col]
            if (
                df[col].count() <= 2
            ):  # count() excludes NaNs, so this checks if there are any non-NaN values
                continue

            ## change quantiles based on std deviation ranges
            p = 0.05
            std = df[col].std()
            if std < 0.01:
                p = 0.01
            elif std <= 0.05:
                p = 0.05
            elif std <= 0.1:
                p = 0.1
            elif std <= 0.2:
                p = 0.2
            elif std <= 0.25:
                p = 0.2

            p5 = df[col].quantile(p)
            p95 = df[col].quantile(1.0 - p)
            df_filtered = df[(df[col] >= p5) & (df[col] <= p95)]

            num_filtered = df_filtered[col].count()
            res[col] = {
                "true_min": float(c.min()),
                "true_max": float(c.max()),
                "count": num_filtered,
            }

            if df_filtered[col].count() < 2:
                continue

            res[col].update(
                {
                    "mean": float(df_filtered[col].mean()),
                    "median": float(df_filtered[col].median()),
                    "std": float(df_filtered[col].std()),
                    "min": float(df_filtered[col].min()),
                    "max": float(df_filtered[col].max()),
                    "p5": float(p5),
                    "p95": float(p95),
                }
            )

        return res

    overall_stats = calculate_stats(df)

    sp500only = df[(df["is_sp500"] == True) | (df["is_dowjones"] == True)]
    index_overall_stats = calculate_stats(sp500only)
    for sector in all_sectors:
        sector_stats[sector] = calculate_stats(sp500only[sp500only["sector"] == sector])
    for industry_category in all_industry_categories:
        industry_category_stats[industry_category] = calculate_stats(
            sp500only[sp500only["industry_category"] == industry_category]
        )
    for industry_group in all_industry_groups:
        industry_group_stats[industry_group] = calculate_stats(
            sp500only[sp500only["industry_group"] == industry_group]
        )

    result = {
        "all": overall_stats,
        "all_index": index_overall_stats,
        "sector": sector_stats,
        "industry_category": industry_category_stats,
        "industry_group": industry_group_stats,
    }

    return result


res = load_raw_index()
with open("screener-index-stats.json", "w") as f:
    f.write(json.dumps(res, indent=4, default=str))
