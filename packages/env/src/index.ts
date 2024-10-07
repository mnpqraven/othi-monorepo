import { createEnv } from "@t3-oss/env-nextjs";
import { authEnv } from "./auth";
import { storageEnv } from "./storage";
import { hostsEnv } from "./hosts";

export const env = createEnv({
  server: {},
  client: {},
  experimental__runtimeEnv: process.env,
  extends: [authEnv, storageEnv, hostsEnv],
});
