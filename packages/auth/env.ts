import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NEXTAUTH_SECRET: z.string(),
    OTHI_GITHUB_ID: z.string(),
    OTHI_GITHUB_SECRET: z.string(),
    GITHUB_IDENT: z.number().or(z.string()).pipe(z.coerce.number()),
  },
  client: {},
  experimental__runtimeEnv: {},
});
