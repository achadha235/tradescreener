import prisma from "@/database";
import { NextRequest, NextResponse } from "next/server";

// POST handler: Create a new API key for a user
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  if (request.url) {
    //pass next js bug:this is needed to get nextjs to make the route dynamic
  }

  const screeners = await prisma.screener.findMany({
    orderBy: [{ createdAt: "desc" }],
    where: {
      screenerData: {
        path: ["status"],
        equals: "completed",
      },
    },
    take: 100,
  });

  return NextResponse.json({ screeners });
}
