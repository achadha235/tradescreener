import prisma from "@screener/db";
import { NextRequest, NextResponse } from "next/server";

// POST handler: Create a new API key for a user
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const id = params["screenerId"];
  const screener = await prisma.screener.findUnique({
    where: { id },
  });

  if (!screener) {
    return NextResponse.json({ screener }, { status: 404 });
  }

  return NextResponse.json({ screener });
}
