import prisma from "@screener/db";
import { NextRequest, NextResponse } from "next/server";
import { Queue } from "bullmq";
import Redis, { RedisOptions } from "ioredis";
const redis = new Redis("redis://localhost:6380");
import { v4 as uuidv4 } from "uuid";

const myQueue = new Queue("stockScreener", { connection: redis });
// POST handler: Create a new API key for a user
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const data = await request.json();
  const { email } = data;
  // Step 1: Create or find the user with prisma
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      id: "usr_" + uuidv4(),
      email,
    },
  });

  // Step 2: Create a new screener request with prisma
  const screenerRequest = await prisma.screener.create({
    data: {
      id: "scr_" + uuidv4(),
      screenerData: {
        status: "pending",
        userRequest: data,
      },
      userId: user.id,
    },
  });

  await myQueue.add("createScreener", screenerRequest);

  return NextResponse.json({ success: true, screener: screenerRequest });
}
