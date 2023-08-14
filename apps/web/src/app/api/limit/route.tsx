import prisma from "@/database";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "../auth";

// POST handler: Create a new API key for a user
export async function GET(request: NextRequest, { params }) {
  const authToken = request.headers.get("Authorization");
  let userDataToken;
  try {
    userDataToken = decrypt(
      authToken as string,
      process.env.JWT_SECRET as string
    );
  } catch (error) {
    // pass
  }

  const ip = request.ip;

  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  const countIp = await prisma.screener.count({
    where: {
      ip: ip,
      createdAt: {
        gte: oneDayAgo,
      },
    },
  });

  let countUserId = 0;
  let user: any = null;
  if (userDataToken) {
    countUserId = await prisma.screener.count({
      where: {
        ip: userDataToken.id,
        createdAt: {
          gte: oneDayAgo,
        },
      },
    });
    user = await prisma.user.findUnique({ where: { id: userDataToken.id } });
  }

  let plan: string | null = null;
  if (user) {
    plan = "Basic";
  } else if (user?.plan === "Pro") {
    plan = "Pro";
  }

  let billingPeriod = user?.data?.billingPeriod;

  return NextResponse.json({
    usage: countUserId + countIp,
    limit: 3,
    user: user,
    plan,
    billingPeriod,
  });
}
