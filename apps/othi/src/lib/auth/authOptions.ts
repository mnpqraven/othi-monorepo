/* eslint-disable @typescript-eslint/require-await */
import GithubProvider from "next-auth/providers/github";
import type { NextAuthOptions } from "next-auth";
import { env } from "@othi/env";
import { serverSignIn } from "./action";

export const authOptions: NextAuthOptions = {
  secret: env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  providers: [
    GithubProvider({
      clientId: env.OTHI_GITHUB_ID,
      clientSecret: env.OTHI_GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ account }) {
      if (account) await serverSignIn(account);
      return true;
    },
    async redirect({ baseUrl }) {
      return baseUrl;
    },
  },
};
