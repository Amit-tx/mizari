-- Migration: add all columns and tables missing from the initial schema.
-- Run this once against your Neon production DB.
-- Safe to run multiple times — every statement uses IF NOT EXISTS / IF NOT EXISTS column checks.

-- ─── 1. profiles: missing columns ────────────────────────────────────────────
ALTER TABLE "profiles"
  ADD COLUMN IF NOT EXISTS "theme_backdrop" text DEFAULT '',
  ADD COLUMN IF NOT EXISTS "xp" integer DEFAULT 0 NOT NULL,
  ADD COLUMN IF NOT EXISTS "prestige" integer DEFAULT 0 NOT NULL,
  ADD COLUMN IF NOT EXISTS "daily_active_days" integer DEFAULT 0 NOT NULL,
  ADD COLUMN IF NOT EXISTS "last_active_at" timestamp with time zone,
  ADD COLUMN IF NOT EXISTS "referrals" integer DEFAULT 0 NOT NULL;

-- ─── 2. theme_purchases table ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "theme_purchases" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" integer NOT NULL REFERENCES "users"("id") ON DELETE cascade,
  "theme_id" varchar(100) NOT NULL,
  "price" integer DEFAULT 0 NOT NULL,
  "status" varchar(20) DEFAULT 'pending' NOT NULL,
  "razorpay_order_id" varchar(128),
  "razorpay_payment_id" varchar(128),
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- ─── 3. click_logs table (IP-based rate-limit / bot guard) ───────────────────
CREATE TABLE IF NOT EXISTS "click_logs" (
  "id" serial PRIMARY KEY NOT NULL,
  "visitor_ip" varchar(64) NOT NULL,
  "target_id" integer NOT NULL,
  "target_type" varchar(20) NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "click_logs_visitor_target_idx"
  ON "click_logs" ("visitor_ip", "target_id", "target_type");

-- ─── 4. marketplace_themes table ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "marketplace_themes" (
  "id" serial PRIMARY KEY NOT NULL,
  "creator_id" integer NOT NULL REFERENCES "users"("id") ON DELETE cascade,
  "name" varchar(100) NOT NULL,
  "description" text DEFAULT '',
  "price" integer DEFAULT 49 NOT NULL,
  "status" varchar(20) DEFAULT 'active' NOT NULL,
  "bg_color" varchar(30) DEFAULT '#fafafa' NOT NULL,
  "text_color" varchar(30) DEFAULT '#1a1a2e' NOT NULL,
  "bg_image" text DEFAULT '',
  "categories" text DEFAULT '[]' NOT NULL,
  "sales_count" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- ─── 5. creator_balances table ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "creator_balances" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" integer NOT NULL REFERENCES "users"("id") ON DELETE cascade,
  "total_earned" integer DEFAULT 0 NOT NULL,
  "pending_withdrawal" integer DEFAULT 0 NOT NULL,
  "paid_out" integer DEFAULT 0 NOT NULL,
  "upi_id" varchar(100) DEFAULT '' NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- ─── 6. marketplace_transactions table ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS "marketplace_transactions" (
  "id" serial PRIMARY KEY NOT NULL,
  "theme_id" integer NOT NULL REFERENCES "marketplace_themes"("id") ON DELETE cascade,
  "buyer_id" integer NOT NULL REFERENCES "users"("id") ON DELETE cascade,
  "order_id" varchar(128),
  "total_amount" integer DEFAULT 0 NOT NULL,
  "creator_earnings" integer DEFAULT 0 NOT NULL,
  "platform_fee" integer DEFAULT 0 NOT NULL,
  "status" varchar(20) DEFAULT 'pending' NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Prevent double-payout on the same Razorpay order
CREATE UNIQUE INDEX IF NOT EXISTS "marketplace_transactions_order_id_unique_idx"
  ON "marketplace_transactions" ("order_id")
  WHERE "order_id" IS NOT NULL;
