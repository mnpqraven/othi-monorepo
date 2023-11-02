import type { Config } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

export default {
  schema: "src/dbSchemas/*",
  out: "drizzle",
  driver: "turso",
  dbCredentials: {
    url: process.env["DB_URL"] as string,
    authToken: process.env["DB_AUTH_TOKEN"],
  },
} satisfies Config;
