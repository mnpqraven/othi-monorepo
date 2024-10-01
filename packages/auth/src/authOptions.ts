/* eslint-disable @typescript-eslint/require-await */

import GithubProvider from "next-auth/providers/github";
import type { NextAuthOptions } from "next-auth";
import { env } from "env";

export const authOptions: NextAuthOptions = {
  secret: env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV !== "production",
  pages: {
    signIn: "/whoami",
  },
  providers: [
    GithubProvider({
      clientId: env.OTHI_GITHUB_ID,
      clientSecret: env.OTHI_GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) token.access_token = account.access_token;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.access_token = token.access_token;
      return session;
    },
  },
};
