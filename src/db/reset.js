require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

async function resetDatabase() {
  console.log('Connecting to Neon Database...');
  const sql = neon(process.env.DATABASE_URL);

  console.log('Clearing legacy tables...');
  try {
    // Drop records from existing tables
    await sql`DELETE FROM links;`;
    await sql`DELETE FROM users;`;
    
    console.log('SUCCESS: Legacy tables cleared! Email is now free to register.');
  } catch (error) {
    console.error('Error clearing database:', error);
  }
}

resetDatabase().then(() => process.exit(0));
