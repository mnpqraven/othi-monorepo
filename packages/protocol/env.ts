import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DB_URL: z.string(),
    DB_AUTH_TOKEN: z.string(),
  },
  client: {
    NEXT_PUBLIC_WORKER_API: z.string(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_WORKER_API: process.env.NEXT_PUBLIC_WORKER_API,
  },
});
