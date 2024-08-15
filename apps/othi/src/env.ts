import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";

export const env = createEnv({
  server: {
    // EDGE_CONFIG: z.string().url(),
  },
  client: {
    // NEXT_PUBLIC_HOST_HSR: z.string().url(),
    // NEXT_PUBLIC_HOST_NAS_WS: z.string().url(),
  },
  experimental__runtimeEnv: {
    // NEXT_PUBLIC_HOST_HSR: process.env.NEXT_PUBLIC_HOST_HSR,
    // NEXT_PUBLIC_HOST_NAS_WS: process.env.NEXT_PUBLIC_HOST_NAS_WS,
  },
});
