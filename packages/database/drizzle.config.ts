import type { Config } from "drizzle-kit";
import { env } from "env";

export default {
  schema: "schema/*",
  out: "drizzle",
  driver: "turso",
  dbCredentials: {
    url: env.DB_URL,
    authToken: env.DB_AUTH_TOKEN,
  },
  verbose: true,
  dialect: "sqlite",
} satisfies Config;
