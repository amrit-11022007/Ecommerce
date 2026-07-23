/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { prisma } from "@/app/lib/database/prisma";

export const authOptions: AuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const username = credentials?.username;
        const password = credentials?.password;

        if (!username || !password) return null;

        const user = await prisma.users.findUnique({
          where: { username },
          select: {
            user_id: true,
            username: true,
            password: true,
          },
        });

        if (!user) return null;

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return null;

        return {
          id: user.user_id.toString(),
          name: user.username,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as any).id = token.id;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
