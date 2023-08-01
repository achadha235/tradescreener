import prisma from "@screener/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const data = await request.json();
  const screener = await prisma.screener.findUniqueOrThrow({
    where: { id: params["screenerId"] },
  });

  await prisma.screener.update({
    where: { id: params["screenerId"] },
    data: {
      screenerData: {
        ...(screener.screenerData as any),
        status: "completed",
        ...data,
      },
    },
  });

  return NextResponse.json({ success: true });
}
