import { NextRequest, NextResponse } from "next/server";
import { getUser } from "../getUser";

// POST handler: Create a new API key for a user
export async function GET(request: NextRequest, { params }) {
  console.log("Fetching user...");
  let user;
  try {
    user = await getUser(request);
  } catch (error) {
    console.error(error);
    user = null;
  }
  return NextResponse.json(user);
}
