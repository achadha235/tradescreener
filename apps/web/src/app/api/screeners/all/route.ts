import prisma from "@screener/db";
import { NextRequest, NextResponse } from "next/server";
import { Queue } from "bullmq";
import Redis, { RedisOptions } from "ioredis";
const redis = new Redis("redis://localhost:6380");
import { v4 as uuidv4 } from "uuid";

// POST handler: Create a new API key for a user
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  // fetch all screeners
  const screeners = await prisma.screener.findMany();
  const filtered = screeners.filter((screener: any) => {
    return screener.screenerData.status === "completed";
  });
  return NextResponse.json({ screeners: filtered });
}
