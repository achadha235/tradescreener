import prisma from "@screener/db";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { Novu } from "@novu/node";
import { encrypt } from "../auth";

const novu = new Novu(process.env.NOVU_API_KEY as string);

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const data = await request.json();

  const email = data.email;
  const screenerId = data.screenerId;

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email_verified: false,
      id: "usr_" + uuidv4(),
      email,
    },
  });

  const screener = await prisma.screener.findFirst({
    where: { id: screenerId },
    include: { user: true },
  });

  if (!screener) {
    return NextResponse.json({ success: false });
  }

  await novu.subscribers.identify(user.id, {
    email: user.email,
  });

  if (user && screener && screener.user?.id !== user.id) {
    await prisma.screener.update({
      where: { id: screenerId },
      data: { user: { connect: { id: user.id } } },
    });
  }

  const token = encrypt(user, process.env.JWT_SECRET as string);

  return NextResponse.json({ success: true, token });
}
