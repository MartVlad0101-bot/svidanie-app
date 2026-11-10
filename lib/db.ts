import { Pool } from 'pg';

const globalForPg = globalThis as unknown as { pool: Pool | undefined };

export function getPool() {
  if (!globalForPg.pool) {
    globalForPg.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: Number(process.env.PG_POOL_MAX) || 3,
      ssl: process.env.PG_SSL === 'require' ? { rejectUnauthorized: false } : false,
    });
  }
  return globalForPg.pool;
}