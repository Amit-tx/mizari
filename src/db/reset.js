require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

async function createThemePurchasesTable() {
  const sql = neon(process.env.DATABASE_URL);
  
  console.log('Creating theme_purchases table...');
  await sql`
    CREATE TABLE IF NOT EXISTS "theme_purchases" (
      "id" SERIAL PRIMARY KEY,
      "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
      "theme_id" VARCHAR(64) NOT NULL,
      "price_paid" INTEGER DEFAULT 0 NOT NULL,
      "order_id" VARCHAR(128),
      "payment_id" VARCHAR(128),
      "status" VARCHAR(20) DEFAULT 'pending' NOT NULL,
      "purchased_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
  `;
  
  // Index for fast lookup
  await sql`CREATE INDEX IF NOT EXISTS idx_theme_purchases_user_id ON "theme_purchases"("user_id");`;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS idx_theme_purchases_user_theme ON "theme_purchases"("user_id", "theme_id") WHERE status = 'paid';`;
  
  console.log('✅ theme_purchases table created!');
  
  const tables = await sql`SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public' ORDER BY tablename;`;
  console.log('All tables:', tables.map(t => t.tablename).join(', '));
}

createThemePurchasesTable().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
