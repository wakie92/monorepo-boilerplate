import { Pool } from "pg";

let pool: Pool | null = null;

export function createPgPool(): Pool {
  if (!process.env.DATABASE_URL) {
    throw new Error("Missing DATABASE_URL environment variable");
  }

  return new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
}

export function getPgPool(): Pool {
  if (!pool) {
    pool = createPgPool();
  }
  return pool;
}
