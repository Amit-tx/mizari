const { neon } = require('@neondatabase/serverless');
const { execSync } = require('child_process');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("DATABASE_URL is missing. Please define it in .env.local");
  process.exit(1);
}

const sql = neon(dbUrl);

async function run() {
  console.log("⚠️ WARNING: This will completely delete all tables and data, and recreate the database from scratch!");
  console.log("Dropping all existing tables...");

  const tables = [
    'theme_purchases',
    'marketplace_transactions',
    'marketplace_themes',
    'creator_balances',
    'click_logs',
    'wishes',
    'links',
    'profiles',
    'users'
  ];

  for (const t of tables) {
    try {
      console.log(`Dropping table "${t}"...`);
      await sql.query(`DROP TABLE IF EXISTS "${t}" CASCADE`);
    } catch (e) {
      console.warn(`Failed to drop "${t}": ${e.message}`);
    }
  }

  console.log("Database cleared! Recreating tables using drizzle-kit...");

  try {
    // Run drizzle-kit push to create all tables from scratch
    execSync('npx drizzle-kit push', { stdio: 'inherit' });
    console.log("✅ Database reset and recreated successfully!");
  } catch (e) {
    console.error("❌ Failed to push schema using drizzle-kit:", e.message);
  }
}

run();
