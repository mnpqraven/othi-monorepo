import { createEnv } from "@t3-oss/env-nextjs";
import { Z_BOOLEAN } from "./helperschemas";

export const debugEnv = createEnv({
  server: {
    DEBUG_AUTH: Z_BOOLEAN.default("1"),
  },
  client: {},
  experimental__runtimeEnv: {},
});
