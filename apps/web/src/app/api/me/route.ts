import prisma from "@/database";
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "../getUser";
import { decrypt } from "../auth";

// POST handler: Create a new API key for a user
export async function GET(request: NextRequest, { params }) {
  const authToken = request.headers.get("Authorization");
  if (!authToken) {
    return NextResponse.json({ user: null });
  }

  try {
    const userDataToken = decrypt(authToken, process.env.JWT_SECRET as string);
    const user = await prisma.user.findFirst({
      where: { id: userDataToken.id },
    });
    return NextResponse.json({ user, error: null });
  } catch (error) {
    return NextResponse.json({ user: null, error });
  }
}
