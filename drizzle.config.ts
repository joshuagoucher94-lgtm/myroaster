import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    // Prefer direct/session URL for Drizzle Kit; pooler can fail DDL on some hosts.
    url: process.env.DATABASE_DIRECT_URL ?? process.env.DATABASE_URL ?? "",
  },
});
