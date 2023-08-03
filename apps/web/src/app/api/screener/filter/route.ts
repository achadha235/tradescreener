import { NextRequest, NextResponse } from "next/server";
import fetchForCondition from "./fetchForCondition";
import * as dfd from "danfojs-node";
import { isNil, range, uniq } from "lodash";
import { stringify } from "csv-stringify";
import { resolve } from "path";

async function produceCSV(
  result,
  filterConditions: {
    clauses: { field: string; operator: string; value: string }[];
  }
) {
  return new Promise((resolve, reject) => {
    const columns: string[] = [
      "ticker",
      "name",
      ...uniq(filterConditions.clauses.map((clause) => clause.field)).filter(
        (c) => c !== "country"
      ),
    ];
    stringify(
      result?.filter((r) => !isNil(r.ticker)) || [],
      {
        header: true,
        columns: columns,
      },
      function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
}

// POST handler: Create a new API key for a user
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const filterConditions = await request.json();
  const result = await fetchForCondition(JSON.stringify(filterConditions));
  const csv = await produceCSV(result, filterConditions);
  return NextResponse.json({ success: true, result: csv });
}
