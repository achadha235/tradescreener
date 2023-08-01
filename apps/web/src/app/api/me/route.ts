import { NextRequest, NextResponse } from "next/server";
import { getRequestUser } from "../getRequestUser";

// POST handler: Create a new API key for a user
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const user = await getRequestUser(request);
  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  return NextResponse.json({ user });
}
