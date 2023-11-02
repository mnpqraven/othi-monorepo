import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    SECRET: z.string(),
  },
  client: {
    NEXT_PUBLIC_KEY: z.string(),
  },
  // For Next.js >= 13.4.4, you only need to destructure client variables:
  experimental__runtimeEnv: {
    NEXT_PUBLIC_KEY: process.env.NEXT_PUBLIC_KEY,
  },
});
