import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const hostsEnv = createEnv({
  server: {},
  client: {
    NEXT_PUBLIC_HOST_HSR: z.string(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_HOST_HSR: process.env.NEXT_PUBLIC_HOST_HSR,
  },
});
