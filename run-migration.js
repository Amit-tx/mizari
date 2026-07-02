const { neon } = require('@neondatabase/serverless');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local if present (local fallback)
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.log("DATABASE_URL is missing. Skipping database migration.");
  process.exit(0);
}

const sql = neon(dbUrl);

async function run() {
  console.log("Running manual migrations on Neon database...");

  const queries = [
    // Click logs additions
    "ALTER TABLE click_logs ADD COLUMN IF NOT EXISTS referrer varchar(255) DEFAULT 'direct' NOT NULL",
    "ALTER TABLE click_logs ADD COLUMN IF NOT EXISTS device varchar(50) DEFAULT 'desktop' NOT NULL",
    "ALTER TABLE click_logs ADD COLUMN IF NOT EXISTS browser varchar(50) DEFAULT 'unknown' NOT NULL",
    "ALTER TABLE click_logs ADD COLUMN IF NOT EXISTS country varchar(50) DEFAULT 'unknown' NOT NULL",

    // Links additions
    "ALTER TABLE links ADD COLUMN IF NOT EXISTS scheduled_start timestamp with time zone",
    "ALTER TABLE links ADD COLUMN IF NOT EXISTS scheduled_end timestamp with time zone",
    "ALTER TABLE links ADD COLUMN IF NOT EXISTS product_category varchar(100) DEFAULT '' NOT NULL",
    "ALTER TABLE links ADD COLUMN IF NOT EXISTS is_sensitive integer DEFAULT 0 NOT NULL",

    // Profiles additions
    "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS guestbook_style varchar(30) DEFAULT 'tanabata' NOT NULL",
    "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS guestbook_heading varchar(100) DEFAULT 'Guestbook' NOT NULL",
    "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS reaction_like integer DEFAULT 0 NOT NULL",
    "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS reaction_love integer DEFAULT 0 NOT NULL",
    "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS reaction_haha integer DEFAULT 0 NOT NULL",
    "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS reaction_wow integer DEFAULT 0 NOT NULL",
    "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS reaction_sad integer DEFAULT 0 NOT NULL",
    "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS reaction_fire integer DEFAULT 0 NOT NULL",
    "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS announcement_text text DEFAULT ''",
    "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS announcement_link text DEFAULT ''",
    "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS announcement_active integer DEFAULT 0 NOT NULL",
    "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS announcement_color varchar(30) DEFAULT '#FF6B6B' NOT NULL",
    "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS birthday varchar(10) DEFAULT '' NOT NULL",
    "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS enable_dynamic_theme integer DEFAULT 0 NOT NULL"
  ];

  for (const q of queries) {
    try {
      console.log(`Running: ${q}`);
      await sql.query(q);
    } catch (e) {
      console.warn(`Error running query: ${q}. Msg: ${e.message}`);
    }
  }

  console.log("Manual migrations completed successfully!");
}

run();
