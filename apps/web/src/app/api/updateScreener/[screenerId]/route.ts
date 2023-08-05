import prisma from "@screener/db";
import { NextRequest, NextResponse } from "next/server";

import { analytics } from "@/app/api/tracking";
import { Novu } from "@novu/node";
import numeral from "numeral";
import { encrypt } from "../../auth";
const novu = new Novu(process.env.NOVU_API_KEY as string);

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const data = await request.json();
  let screener = await prisma.screener.findUniqueOrThrow({
    where: { id: params["screenerId"] },
    include: {
      user: true,
    },
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

  screener = await prisma.screener.findUniqueOrThrow({
    where: { id: params["screenerId"] },
    include: {
      user: true,
    },
  });

  const screenerData: any = screener.screenerData;
  const numTickers = numeral(screenerData["tickers"].length).format("0,0");
  const userPrompt = screenerData.userRequest.screenerPrompt;
  const screenerName = screenerData.name;

  if (screener.user) {
    const token = encrypt(screener.user!, process.env.JWT_SECRET as string);
    const screenerLink = new URL(
      "/screener/" + screener.id,
      process.env.NEXT_PUBLIC_APP_URL as string
    );
    screenerLink.searchParams.set("auth", token);
    screenerLink.searchParams.set("utm_medium", "email");
    screenerLink.searchParams.set("utm_campaign", "screener-ready");

    await novu.trigger("screener-ready", {
      to: {
        subscriberId: screener.user.id,
      },
      payload: {
        screener_prompt: userPrompt,
        ticker_num: numTickers,
        screener_name: screenerName,
        screener_url: screenerLink.toString(),
      },
    });

    analytics.track({
      event: "email sent",
      userId: screener.user?.id || "anonymous-user",
      properties: {
        screenerId: screener.id,
        screenerName: screenerName,
        createdAt: screener.createdAt,
        numTickers,
        userPrompt,
      },
    });
  }

  analytics.track({
    event: "screener completed",
    userId: screener.user?.id || "anonymous-user",
    properties: {
      screenerId: screener.id,
      screenerName: screenerName,
      createdAt: screener.createdAt,
      numTickers,
      userPrompt,
    },
  });

  return NextResponse.json({ success: true });
}
