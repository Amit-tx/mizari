const { neon } = require('@neondatabase/serverless');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const dbUrl = process.env.DATABASE_URL;
const sql = neon(dbUrl);

async function run() {
  try {
    const res = await sql.query('SELECT * FROM profiles');
    console.log("Profiles list:");
    res.forEach(p => {
      console.log(`- ID: ${p.id}, username: ${p.username}, guestbook_style: ${p.guestbook_style}, guestbook_heading: ${p.guestbook_heading}, birthday: ${p.birthday}, enable_dynamic_theme: ${p.enable_dynamic_theme}`);
    });
  } catch(e) {
    console.error("Error reading profiles:", e.message);
  }
}

run();
