import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client);

/**
 * Migration Guide:
 * To migrate to a school-hosted DB (MySQL/PostgreSQL):
 * 1. Change environment variables in .env (DB_HOST, DB_USER, etc.)
 * 2. Update drizzle.config.js dialect to 'mysql2' or 'postgresql'
 * 3. Replace this client with the appropriate driver (mysql2 or postgres)
 */
