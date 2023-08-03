// import { getUserId } from "@/pages/api/auth/[auth0]";
import { NextRequest } from "next/server";

export async function getUser(request: NextRequest) {
  return null;
  // const newHeaders = {};
  // request.headers.forEach((value, key) => {
  //   newHeaders[key] = value;
  // });
  // const result = await axios.get(`${process.env.AUTH0_BASE_URL}/api/auth/me`, {
  //   headers: newHeaders,
  // });
  // const auth0User = result.data;
  // if (!auth0User.email) {
  //   return null;
  // }
  // const user = await prisma.user.findUniqueOrThrow({
  //   where: { id: getUserId(auth0User.email) },
  // });
  // return user;
}
