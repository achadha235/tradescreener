import { getUser } from "./getUser";

export async function getRequestUser(request) {
  const user = await getUser(request);
  return user;
}
