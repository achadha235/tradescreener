import prisma from "@screener/db";
import { NextRequest, NextResponse } from "next/server";

// POST handler: Create a new API key for a user
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  if (request.url) {
    //pass
  }

  const screeners = await prisma.screener.findMany();
  const filtered = screeners.filter((screener: any) => {
    return screener.screenerData.status === "completed";
  });

  return NextResponse.json({ screeners: filtered });
}
