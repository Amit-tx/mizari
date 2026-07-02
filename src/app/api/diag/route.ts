import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users, profiles, links, wishes, clickLogs } from '@/db/schema';
import { sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET() {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    connection: 'unknown',
    errors: [],
    tables: {}
  };

  // Test raw connection
  try {
    await db.execute(sql`SELECT 1`);
    diagnostics.connection = 'connected';
  } catch (err: any) {
    diagnostics.connection = 'failed';
    diagnostics.errors.push({ step: 'raw_connection', message: err.message });
  }

  // Test each table query
  const tables = {
    users: () => db.select().from(users).limit(1),
    profiles: () => db.select().from(profiles).limit(1),
    links: () => db.select().from(links).limit(1),
    wishes: () => db.select().from(wishes).limit(1),
    clickLogs: () => db.select().from(clickLogs).limit(1)
  };

  for (const [name, query] of Object.entries(tables)) {
    try {
      const res = await query();
      diagnostics.tables[name] = { status: 'ok', count: res.length };
    } catch (err: any) {
      diagnostics.tables[name] = { status: 'error', message: err.message };
      diagnostics.errors.push({ step: `table_${name}`, message: err.message });
    }
  }

  return NextResponse.json(diagnostics);
}
