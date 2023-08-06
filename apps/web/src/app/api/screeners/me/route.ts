import prisma from "@/database";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "../../auth";

// POST handler: Create a new API key for a user
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  // fetch all screeners

  const authToken = request.headers.get("Authorization");

  if (!authToken) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const user = decrypt(authToken, process.env.JWT_SECRET as string);

    const screeners = await prisma.screener.findMany({
      where: { userId: user.id },
    });

    return NextResponse.json({ screeners });
  } catch (error) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // if (!user) {
  //   return new NextResponse("Unauthorized", { status: 401 });
  // }
}
