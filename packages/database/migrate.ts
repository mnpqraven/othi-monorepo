import { migrate } from "drizzle-orm/libsql/migrator";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client/web";
import dotenv from "dotenv";

dotenv.config();

// automatically run needed migrations on the database
const client = createClient({
  url: process.env["DB_URL"] as string,
  authToken: process.env["DB_AUTH_TOKEN"],
});

const db = drizzle(client);

console.log("migrating db...");

try {
  migrate(db, { migrationsFolder: "drizzle" });

  console.log("migration completed");
} catch (e) {
  console.error(e);
}
