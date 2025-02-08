import { drizzle } from "drizzle-orm/libsql";
import { createClient, LibsqlError } from "@libsql/client";
import { env } from "env";
import * as schema from "./schema";

const client = createClient({
  url: env.DB_URL,
  authToken: env.DB_AUTH_TOKEN,
});

/** database instance
 * @usage server only */
export const db = drizzle(client, { schema });

export { LibsqlError };
