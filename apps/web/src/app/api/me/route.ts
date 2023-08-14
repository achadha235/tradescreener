import prisma from "@/database";
import { NextRequest, NextResponse } from "next/server";
import { getUser } from "../getUser";
import { decrypt } from "../auth";
import { isNil } from "lodash";

// POST handler: Create a new API key for a user
export async function GET(request: NextRequest, { params }) {
  const authToken = request.headers.get("Authorization");
  if (
    !authToken ||
    isNil(authToken) ||
    authToken === "null" ||
    authToken?.trim().length === 0
  ) {
    return NextResponse.json({ user: null, error: null });
  }

  try {
    const userDataToken = decrypt(authToken, process.env.JWT_SECRET as string);
    const user = await prisma.user.findUnique({
      where: { id: userDataToken.id },
    });
    return NextResponse.json({ user, error: null });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ user: null, error });
  }
}
