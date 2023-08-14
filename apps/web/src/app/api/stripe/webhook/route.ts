import { Queue } from "bullmq";
import { NextRequest, NextResponse } from "next/server";
import { redis } from "../../redis";

const queue = new Queue("webhooks", { connection: redis });

// POST handler: Create a new API key for a user
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const data = await request.json();
  const enabledEventTypes = [
    // "customer.created",
    // "customer.updated",
    // "customer.subscription.updated",
    "checkout.session.completed",
  ];
  if (enabledEventTypes.includes(data.type)) {
    await queue.add("processWebhook", data);
  }
  return NextResponse.json({ success: true });
}
