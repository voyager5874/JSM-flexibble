import { AuthOptions } from "next-auth";
import Google from "next-auth/providers/google";
import { createUser, findUserInDB } from "@/grafbase/database.actions";
import jsonwebtoken from "jsonwebtoken";
import { JWT } from "next-auth/jwt";

export const authOptions: AuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  jwt: {
    encode: ({ secret, token }) => {
      return jsonwebtoken.sign(
        {
          ...token,
          iss: "next-auth",
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
        },
        secret
      );
    },
    decode: ({ secret, token }) => {
      const decoded = jsonwebtoken.verify(token!, secret);
      return decoded as JWT;
    },
  },
  callbacks: {
    session: async ({ session }) => {
      const email = session.user?.email!;
      try {
        const databaseUserData = await findUserInDB(email);
        return {
          ...session,
          user: {
            ...session.user,
            ...databaseUserData.user,
          },
        };
      } catch (err) {
        const message = err instanceof Error ? err?.message : "";
        console.error("Error retrieving user data from db: ", message);
        return session;
      }
    },
    signIn: async ({ user }) => {
      try {
        const res = await findUserInDB(user?.email!);
        if (res.user)
          if (!res.user) {
            await createUser({
              name: user.name!,
              email: user.email!,
              avatarUrl: user.image,
            });
          }
        return true;
      } catch (err) {
        console.log("authOptions/signIn callback/error", err);
        return false;
      }
    },
  },
};
