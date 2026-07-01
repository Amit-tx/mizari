require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

async function migrate() {
  const sql = neon(process.env.DATABASE_URL);
  
  console.log('Creating marketplace_themes table...');
  await sql`
    CREATE TABLE IF NOT EXISTS "marketplace_themes" (
      "id" SERIAL PRIMARY KEY,
      "creator_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
      "name" VARCHAR(128) NOT NULL,
      "price" INTEGER DEFAULT 49 NOT NULL,
      "bg_color" VARCHAR(30) DEFAULT '#fafafa' NOT NULL,
      "text_color" VARCHAR(30) DEFAULT '#1a1a2e' NOT NULL,
      "bg_image" TEXT DEFAULT '',
      "button_style" VARCHAR(30) DEFAULT 'rounded-xl' NOT NULL,
      "backdrop_style" VARCHAR(30) DEFAULT 'glass-light' NOT NULL,
      "status" VARCHAR(20) DEFAULT 'active' NOT NULL,
      "sales_count" INTEGER DEFAULT 0 NOT NULL,
      "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
  `;

  console.log('Creating marketplace_transactions table...');
  await sql`
    CREATE TABLE IF NOT EXISTS "marketplace_transactions" (
      "id" SERIAL PRIMARY KEY,
      "theme_id" INTEGER NOT NULL REFERENCES "marketplace_themes"("id") ON DELETE CASCADE,
      "buyer_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
      "order_id" VARCHAR(128),
      "total_amount" INTEGER DEFAULT 0 NOT NULL,
      "creator_earnings" INTEGER DEFAULT 0 NOT NULL,
      "platform_fee" INTEGER DEFAULT 0 NOT NULL,
      "status" VARCHAR(20) DEFAULT 'pending' NOT NULL,
      "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
  `;

  console.log('Creating creator_balances table...');
  await sql`
    CREATE TABLE IF NOT EXISTS "creator_balances" (
      "user_id" INTEGER PRIMARY KEY REFERENCES "users"("id") ON DELETE CASCADE,
      "total_earned" INTEGER DEFAULT 0 NOT NULL,
      "pending_withdrawal" INTEGER DEFAULT 0 NOT NULL,
      "paid_out" INTEGER DEFAULT 0 NOT NULL,
      "upi_id" VARCHAR(128) DEFAULT ''
    );
  `;
  
  console.log('✅ Marketplace tables created successfully!');
}

migrate().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
