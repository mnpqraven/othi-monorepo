import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    GITHUB_IDENT: z.coerce.number(),
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
