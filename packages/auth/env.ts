import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    NEXTAUTH_SECRET: z.string(),
    OTHI_GITHUB_ID: z.string(),
    OTHI_GITHUB_SECRET: z.string(),
    GITHUB_IDENT: z
      .number({ message: "must be number" })
      .or(z.string({ message: "must be string" }))
      .pipe(z.coerce.number({ message: "throw on coercion" })),
  },
  client: {},
  experimental__runtimeEnv: {},
});
