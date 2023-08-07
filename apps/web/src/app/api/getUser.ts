// import { getUserId } from "@/pages/api/auth/[auth0]";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./auth";
import prisma from "@/database";

export async function getUser(request: NextRequest) {
  const authToken = request.headers.get("Authorization");

  if (!authToken) {
    console.log("No auth token");
    return null;
  }

  try {
    console.log("Decrypting user....");
    const decryptUser = decrypt(authToken, process.env.JWT_SECRET as string);
    console.log("Decrypted user: ", decryptUser);
    const user = await prisma.user.findFirst({
      where: { id: decryptUser.id },
    });
    console.log("Found user: ", user);
    return user;
  } catch (error) {
    return null;
  }
}
