import type { Config } from "drizzle-kit";
import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

export default {
  schema: "schema/*",
  out: "drizzle",
  driver: "turso",
  dbCredentials: {
    url: z.string().parse(process.env.DB_URL),
    authToken: process.env.DB_AUTH_TOKEN,
  },
} satisfies Config;
