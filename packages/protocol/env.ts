import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NEXTAUTH_SECRET: z.string(),
    OTHI_GITHUB_ID: z.string(),
    OTHI_GITHUB_SECRET: z.string(),
    AUTH_GITHUB_IDENT: z.string(),
    DB_URL: z.string(),
    DB_AUTH_TOKEN: z.string(),
    EDGE_CONFIG: z.string(),
  },
  client: {
    NEXT_PUBLIC_HOST_NAS_WS: z.string(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_HOST_NAS_WS: process.env.NEXT_PUBLIC_HOST_NAS_WS,
  },
});
