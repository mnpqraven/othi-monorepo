import { migrate } from "drizzle-orm/libsql/migrator";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client/web";
import { config } from "dotenv";
import { z } from "zod";

config();

// automatically run needed migrations on the database
const client = createClient({
  url: z.string().parse(process.env.DB_URL),
  authToken: z.string().parse(process.env.DB_AUTH_TOKEN),
});

const db = drizzle(client);

console.log("migrating db...");

try {
  void migrate(db, { migrationsFolder: "drizzle" });

  console.log("migration completed");
} catch (e) {
  console.error(e);
}
