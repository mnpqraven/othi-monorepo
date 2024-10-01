import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

console.log(process.env);

export const env = createEnv({
  server: {
    NEXTAUTH_SECRET: z.string(),
    OTHI_GITHUB_ID: z.string(),
    OTHI_GITHUB_SECRET: z.string(),
    GITHUB_IDENT: z
      .string({ message: "must be string" })
      .transform((e) => {
        console.log("debug", e);
        return e;
      })
      .or(z.number({ message: "must be number" }))
      .pipe(z.coerce.number({ message: "throw on coercion" })),
  },
  client: {},
  experimental__runtimeEnv: {},
});
