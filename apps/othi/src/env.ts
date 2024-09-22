import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";

export const env = createEnv({
  server: {
    NEXTAUTH_SECRET: z.string(),
    OTHI_GITHUB_ID: z.string(),
    OTHI_GITHUB_SECRET: z.string(),
    UPLOADTHING_TOKEN: z.string(),
    NEXTAUTH_URL: z.string().default("http://localhost:4004"),
  },
  client: {},
  experimental__runtimeEnv: {},
});
