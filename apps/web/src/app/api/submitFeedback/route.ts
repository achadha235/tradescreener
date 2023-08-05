import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "../auth";
import { sendSlackMessage } from "../slack";

// POST handler: Create a new API key for a user
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const data = await request.json();

  const authToken = request.headers.get("Authorization");
  let user;
  if (authToken) {
    try {
      user = decrypt(authToken, process.env.JWT_SECRET as string);
    } catch (err) {
      // pass;
    }
  }

  let userString = "*User*: Anonymous";
  if (user) {
    userString = "*Email*: " + user.email + "\n*User ID*: `" + user.id + "`";
  }

  sendSlackMessage(
    "User feedback:\n" +
      userString +
      "\n" +
      "*Rating*: " +
      data.rating +
      "/ 5" +
      "\n" +
      "> " +
      data.comment || "No comment provided"
  );

  return NextResponse.json({ success: true });
}
