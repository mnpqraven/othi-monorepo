import type { Config } from "drizzle-kit";
import { z } from "zod";
import { env } from "./env";

export default {
  schema: "schema/*",
  out: "drizzle",
  driver: "turso",
  dbCredentials: {
    url: z.string().parse(env.DB_URL),
    authToken: env.DB_AUTH_TOKEN,
  },
  verbose: true,
} satisfies Config;
