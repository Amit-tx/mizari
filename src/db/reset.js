require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

async function createTables() {
  console.log('Connecting to Neon Database...');
  const sql = neon(process.env.DATABASE_URL);

  console.log('Creating database tables...');
  try {
    // 1. Create Users Table
    await sql`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" SERIAL PRIMARY KEY,
        "email" VARCHAR(255) NOT NULL UNIQUE,
        "password_hash" TEXT,
        "delete_token" VARCHAR(255),
        "delete_token_expires_at" TIMESTAMP WITH TIME ZONE,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `;
    console.log('Users table created.');

    // 2. Create Profiles Table
    await sql`
      CREATE TABLE IF NOT EXISTS "profiles" (
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
    console.log('Profiles table created.');

    // 3. Create Links Table
    await sql`
      CREATE TABLE IF NOT EXISTS "links" (
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
    console.log('Links table created.');

    // 4. Create Wishes Table
    await sql`
      CREATE TABLE IF NOT EXISTS "wishes" (
        "id" SERIAL PRIMARY KEY,
        "profile_id" INTEGER NOT NULL REFERENCES "profiles"("id") ON DELETE CASCADE,
        "sender" VARCHAR(100) DEFAULT 'Anonymous' NOT NULL,
        "text" TEXT NOT NULL,
        "color" VARCHAR(20) DEFAULT '#FFD6E0' NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      );
    `;
    console.log('Wishes table created.');

    console.log('SUCCESS: All tables successfully created on Neon Database!');
  } catch (error) {
    console.error('Error creating database tables:', error);
  }
}

createTables().then(() => process.exit(0));
