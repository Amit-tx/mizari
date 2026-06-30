require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

async function rebuildDatabase() {
  const sql = neon(process.env.DATABASE_URL);
  console.log('Starting complete database rebuild...\n');

  // Step 1: Drop ALL tables in correct order (foreign keys)
  console.log('Step 1: Dropping all existing tables...');
  await sql`DROP TABLE IF EXISTS wishes CASCADE;`;
  await sql`DROP TABLE IF EXISTS links CASCADE;`;
  await sql`DROP TABLE IF EXISTS profiles CASCADE;`;
  await sql`DROP TABLE IF EXISTS users CASCADE;`;
  await sql`DROP TABLE IF EXISTS "__drizzle_migrations" CASCADE;`;
  console.log('  ✅ All old tables dropped.\n');

  // Step 2: Create Users table (NEW schema - clean, no username/bio/theme)
  console.log('Step 2: Creating users table (new schema)...');
  await sql`
    CREATE TABLE "users" (
      "id" SERIAL PRIMARY KEY,
      "email" VARCHAR(255) NOT NULL UNIQUE,
      "password_hash" TEXT,
      "delete_token" VARCHAR(255),
      "delete_token_expires_at" TIMESTAMP WITH TIME ZONE,
      "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
  `;
  console.log('  ✅ Users table created.\n');

  // Step 3: Create Profiles table
  console.log('Step 3: Creating profiles table...');
  await sql`
    CREATE TABLE "profiles" (
      "id" SERIAL PRIMARY KEY,
      "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
      "username" VARCHAR(64) NOT NULL UNIQUE,
      "profile_type" VARCHAR(30) DEFAULT 'personal' NOT NULL,
      "bio" TEXT DEFAULT '',
      "avatar_url" TEXT DEFAULT '',
      "theme_type" VARCHAR(30) DEFAULT 'light' NOT NULL,
      "theme_bg_color" VARCHAR(30) DEFAULT '#fafafa' NOT NULL,
      "theme_text_color" VARCHAR(30) DEFAULT '#1a1a2e' NOT NULL,
      "theme_bg_image" TEXT DEFAULT '',
      "theme_button_style" VARCHAR(30) DEFAULT 'rounded-xl' NOT NULL,
      "likes" INTEGER DEFAULT 0 NOT NULL,
      "show_wishes" INTEGER DEFAULT 1 NOT NULL,
      "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
  `;
  console.log('  ✅ Profiles table created.\n');

  // Step 4: Create Links table (NEW schema - profile_id instead of user_id)
  console.log('Step 4: Creating links table (new schema with profile_id)...');
  await sql`
    CREATE TABLE "links" (
      "id" SERIAL PRIMARY KEY,
      "profile_id" INTEGER NOT NULL REFERENCES "profiles"("id") ON DELETE CASCADE,
      "title" VARCHAR(255) NOT NULL,
      "url" TEXT NOT NULL,
      "icon" TEXT,
      "order" INTEGER DEFAULT 0 NOT NULL,
      "clicks" INTEGER DEFAULT 0 NOT NULL,
      "is_product" INTEGER DEFAULT 0 NOT NULL,
      "price" VARCHAR(30) DEFAULT '',
      "discount" VARCHAR(30) DEFAULT '',
      "product_image" TEXT DEFAULT ''
    );
  `;
  console.log('  ✅ Links table created.\n');

  // Step 5: Create Wishes table
  console.log('Step 5: Creating wishes table...');
  await sql`
    CREATE TABLE "wishes" (
      "id" SERIAL PRIMARY KEY,
      "profile_id" INTEGER NOT NULL REFERENCES "profiles"("id") ON DELETE CASCADE,
      "sender" VARCHAR(100) DEFAULT 'Anonymous' NOT NULL,
      "text" TEXT NOT NULL,
      "color" VARCHAR(20) DEFAULT '#FFD6E0' NOT NULL,
      "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
    );
  `;
  console.log('  ✅ Wishes table created.\n');

  // Step 6: Final verification
  console.log('Step 6: Verifying...');
  const tables = await sql`
    SELECT tablename FROM pg_catalog.pg_tables 
    WHERE schemaname = 'public' ORDER BY tablename;
  `;
  console.log('  Tables:', tables.map(t => t.tablename).join(', '));

  const usersCols = await sql`
    SELECT column_name FROM information_schema.columns 
    WHERE table_name='users' ORDER BY ordinal_position;
  `;
  console.log('  Users columns:', usersCols.map(c => c.column_name).join(', '));

  const linksCols = await sql`
    SELECT column_name FROM information_schema.columns 
    WHERE table_name='links' ORDER BY ordinal_position;
  `;
  console.log('  Links columns:', linksCols.map(c => c.column_name).join(', '));

  console.log('\n🎉 DATABASE REBUILD COMPLETE! Signup will now work perfectly.');
}

rebuildDatabase().then(() => process.exit(0)).catch(e => { console.error('FATAL ERROR:', e); process.exit(1); });
