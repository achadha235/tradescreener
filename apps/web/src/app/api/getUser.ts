// import { getUserId } from "@/pages/api/auth/[auth0]";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./auth";
import prisma from "@screener/db";

export async function getUser(request: NextRequest) {
  const authToken = request.headers.get("Authorization");

  if (!authToken) {
    return null;
  }

  try {
    const decryptUser = decrypt(authToken, process.env.JWT_SECRET as string);
    const user = await prisma.user.findFirst({
      where: { id: decryptUser.id },
    });

    return user;
  } catch (error) {
    return null;
  }
}
