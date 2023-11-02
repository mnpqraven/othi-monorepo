import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client/web";
import { env } from "../env.mjs";

const client = createClient({
  url: env.DB_URL,
  authToken: env.DB_AUTH_TOKEN,
});

/** database instance
 * @usage server only */
export const db = drizzle(client);
