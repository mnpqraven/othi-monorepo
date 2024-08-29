/* eslint-disable @typescript-eslint/require-await */

import GithubProvider from "next-auth/providers/github";
import type { NextAuthOptions, DefaultSession } from "next-auth";
// TODO: make types recognize this
// try installing next-auth globally and override the types on top level
import { JWT } from "next-auth/jwt";
import { env } from "../../env";

declare module "next-auth" {
  interface Session {
    user?: {
      /** The user's access token. */
      access_token?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    /** Respective provider's access token */
    access_token?: string;
  }
}
//

export const authOptions: NextAuthOptions = {
  secret: env.NEXTAUTH_SECRET,
  // debug: process.env.NODE_ENV !== "production",
  debug: false,
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
