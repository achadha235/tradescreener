import prisma from "@/database";
import { NextRequest, NextResponse } from "next/server";
import { Queue } from "bullmq";

import { v4 as uuidv4 } from "uuid";
import { decrypt } from "../auth";
import { redis } from "../redis";
import { sendSlackMessage } from "../slack";

const queue = new Queue("stockScreener", { connection: redis });
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
      ip: user?.id || request.ip,
      ...(user ? { userId: user.id } : {}),
      screenerData: {
        status: "pending",
        userRequest: data,
      },
    },
  });

  await queue.add("createScreener", screenerRequest);

  let userString = "*User*: Anonymous";
  if (user) {
    userString = "*Email*: " + user.email + "\n*User ID*: `" + user.id + "`";
  }

  sendSlackMessage(
    "New prompt submitted:\n" +
      userString +
      "\n" +
      "> " +
      data.screenerPrompt +
      "\n*Link:* " +
      process.env.NEXT_PUBLIC_APP_URL +
      "/screener/" +
      screenerRequest.id,
    true
  );

  return NextResponse.json({ success: true, screener: screenerRequest });
}
