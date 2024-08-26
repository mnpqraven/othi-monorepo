/* eslint-disable turbo/no-undeclared-env-vars */

import GithubProvider from "next-auth/providers/github";
import type { NextAuthOptions } from "next-auth";
import { env } from "@othi/env";
import { serverSignIn } from "./action";

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
    async signIn({ account }) {
      if (account) await serverSignIn(account);
      return true;
    },
    // TODO:
    // redirect({ baseUrl }) {
    //   return baseUrl;
    // },
  },
};
