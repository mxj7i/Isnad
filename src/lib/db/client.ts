import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

export type IsnadDb = ReturnType<typeof drizzle<typeof schema>>;

const globalForDatabase = globalThis as typeof globalThis & {
  isnadPool?: Pool;
  isnadDb?: IsnadDb;
};

export function getDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is required to use the Isnad database connection.",
    );
  }

  return databaseUrl;
}

export function getPool(): Pool {
  if (!globalForDatabase.isnadPool) {
    globalForDatabase.isnadPool = new Pool({
      connectionString: getDatabaseUrl(),
      max: 5,
    });
  }

  return globalForDatabase.isnadPool;
}

export function getDb(): IsnadDb {
  if (!globalForDatabase.isnadDb) {
    globalForDatabase.isnadDb = drizzle(getPool(), { schema });
  }

  return globalForDatabase.isnadDb;
}