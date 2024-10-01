import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DB_URL: z.string(),
    DB_AUTH_TOKEN: z.string(),
    NEXTAUTH_SECRET: z.string(),
    GITHUB_ID: z.string(),
    GITHUB_SECRET: z.string(),
  },
  client: {
    NEXT_PUBLIC_HOST_DB_CENTER: z.string().url(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_HOST_DB_CENTER: process.env.NEXT_PUBLIC_HOST_DB_CENTER,
  },
});
