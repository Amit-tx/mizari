import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Use a mock connection string when DATABASE_URL is missing to prevent module import crashes.
const connectionString = process.env.DATABASE_URL || 'postgres://mock:mock@localhost:5432/mock';
const sql = neon(connectionString);
export const db = drizzle({ client: sql, schema });
