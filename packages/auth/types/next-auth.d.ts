/* eslint-disable @typescript-eslint/no-unused-vars */
import { JWT } from "next-auth/jwt";
import type { DefaultSession } from "next-auth";

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
