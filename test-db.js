const { neon } = require('@neondatabase/serverless');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error("DATABASE_URL is missing in .env.local");
  process.exit(1);
}

const sql = neon(dbUrl);

async function run() {
  console.log("Checking Neon Database schema tables...");
  
  const tables = [
    'users',
    'profiles',
    'links',
    'wishes',
    'click_logs',
    'creator_balances',
    'marketplace_themes',
    'marketplace_transactions',
    'theme_purchases'
  ];

  for (const t of tables) {
    try {
      const res = await sql.query(`SELECT count(*) FROM "${t}"`);
      console.log(`Table "${t}": EXISTS (${res[0].count} rows)`);
    } catch(e) {
      console.warn(`Table "${t}": ERROR: ${e.message}`);
    }
  }

  // Also check profiles columns
  try {
    const colRes = await sql.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'profiles'
    `);
    console.log("\nProfiles columns:");
    colRes.forEach(col => {
      console.log(` - ${col.column_name}: ${col.data_type}`);
    });
  } catch(e) {
    console.error("Failed to query profiles columns:", e.message);
  }
}

run();
