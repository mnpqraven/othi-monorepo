import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const authEnv = createEnv({
  server: {
    NEXTAUTH_SECRET: z.string(),
    OTHI_GITHUB_ID: z.string(),
    OTHI_GITHUB_SECRET: z.string(),
    GITHUB_ID: z.string(),
    GITHUB_SECRET: z.string(),
    AUTH_GITHUB_IDENT: z.coerce.number(),
  },
  client: {},
  experimental__runtimeEnv: process.env,
});
