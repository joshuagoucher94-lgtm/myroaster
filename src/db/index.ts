import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

function createDb() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required for database access.");
  }

  const client = postgres(databaseUrl, { max: 1, prepare: false });

  return drizzle(client, { schema });
}

let db: ReturnType<typeof createDb> | null = null;

export function getDb() {
  if (!db) {
    db = createDb();
  }

  return db;
}

export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}
