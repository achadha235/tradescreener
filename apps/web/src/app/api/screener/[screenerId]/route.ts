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
  console.log("params", params);
  const id = params["screenerId"];
  const screener = await prisma.screener.findUniqueOrThrow({
    where: { id },
  });

  return NextResponse.json({ screener });
}
