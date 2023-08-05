import { URLSearchParams } from "url";

export default async function fetchForCondition(condition: string) {
  const results: any[] = [];
  const url = "https://api-v2.intrinio.com/securities/screen";
  let currentPage = 0;
  const params = {
    primary_only: "true",
    actively_traded: "true",
    conditions: condition,
    api_key: process.env.INTRINIO_API_KEY as string,
    page_number: currentPage.toString(),
    page_size: "1000",
  };
  const queryUrl = url + "?" + new URLSearchParams(params).toString();
  const response = await fetch(queryUrl, {
    method: "POST",
    body: condition,
  });

  const allData = await response.json();

  if (response.status !== 200) {
    return [];
  }

  for (const row of allData) {
    const security = row["security"];
    const data = row["data"];
    let newRow: any = {
      ticker: security["ticker"],
      name: security["name"],
      figi: security["figi"],
    };
    for (const d of data) {
      const val = d["number_value"] || d["text_value"];
      if (d["tag"] !== "country" && val) {
        newRow[d["tag"]] = val;
      }
    }
    results.push(newRow);
  }
  return results;
}
