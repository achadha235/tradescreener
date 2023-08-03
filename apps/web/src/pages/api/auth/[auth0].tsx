// // import { handleAuth, handleCallback, handleLogin } from "@auth0/nextjs-auth0";
// // import prisma from "@screener/db";
// // import { v5 as uuidv5 } from "uuid";

// const NAMESPACE = "1b671a64-40d5-491e-99b0-da01ff1f3341"; // Random namespace ID, replace if you have a specific one
// export const getUserId = (email: string) => uuidv5(email, NAMESPACE); // Creates a deterministic UUID using UUIDv5

// const addOrUpdateUser = handleCallback({
//   afterCallback: async (req, res, session) => {
//     const { user } = session;
//     const id = getUserId(user.email);
//     await prisma.user.upsert({
//       where: { id },
//       update: {
//         name: user.name,
//         nickname: user.nickname,
//         picture: user.picture,
//         email: user.email,
//         email_verified: user.email_verified,
//         sub: user.sub,
//       },
//       create: {
//         id: id,
//         name: user.name,
//         nickname: user.nickname,
//         picture: user.picture,
//         email: user.email,
//         email_verified: user.email_verified,
//         sub: user.sub,
//       },
//     });
//     return session;
//   },
// });

// export default handleAuth({
//   async callback(req, res) {
//     try {
//       await addOrUpdateUser(req, res);
//     } catch (error: any) {
//       res.status(error.status || 500).end(error.message);
//     }
//   },
//   async login(req, res) {
//     let returnTo = "/dashboard";
//     if (req?.query?.redirect) {
//       const url = new URL(req.query.redirect as string);
//       returnTo = url.pathname + url.search;
//     }
//     const result = await handleLogin(req, res, {
//       returnTo,
//     });
//     return result;
//   },
// });

export default function Page() {
  return <div>Not Found</div>;
}
