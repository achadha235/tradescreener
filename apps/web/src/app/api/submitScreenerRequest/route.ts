import prisma from "@screener/db";
import { NextRequest, NextResponse } from "next/server";
import { Queue } from "bullmq";
import Redis, { RedisOptions } from "ioredis";
const redis = new Redis("redis://localhost:6380");
import { v4 as uuidv4 } from "uuid";
import { decrypt } from "../auth";

const myQueue = new Queue("stockScreener", { connection: redis });
// POST handler: Create a new API key for a user
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const data = await request.json();

  const authToken = request.headers.get("Authorization");
  let user;
  if (authToken) {
    try {
      user = decrypt(authToken, process.env.JWT_SECRET as string);
    } catch (err) {
      // pass;
    }
  }

  // Step 2: Create a new screener request with prisma
  const screenerRequest = await prisma.screener.create({
    data: {
      id: "scr_" + uuidv4(),
      ...(user ? { userId: user.id } : {}),
      screenerData: {
        status: "pending",
        userRequest: data,
      },
    },
  });

  await myQueue.add("createScreener", screenerRequest);

  return NextResponse.json({ success: true, screener: screenerRequest });
}
