-- Run this in your Neon SQL Editor.
-- Every statement uses IF NOT EXISTS / safe defaults so it's safe to run multiple times.

-- profiles: all potentially missing columns
ALTER TABLE "profiles"
  ADD COLUMN IF NOT EXISTS "theme_backdrop"       varchar(30)              DEFAULT 'glass-light' NOT NULL,
  ADD COLUMN IF NOT EXISTS "theme_rotate_interval" varchar(20)             DEFAULT 'none'        NOT NULL,
  ADD COLUMN IF NOT EXISTS "last_theme_rotated_at" timestamp with time zone,
  ADD COLUMN IF NOT EXISTS "views"                integer                   DEFAULT 0             NOT NULL,
  ADD COLUMN IF NOT EXISTS "referrals"            integer                   DEFAULT 0             NOT NULL,
  ADD COLUMN IF NOT EXISTS "daily_active_days"    integer                   DEFAULT 0             NOT NULL,
  ADD COLUMN IF NOT EXISTS "last_active_at"       timestamp with time zone,
  ADD COLUMN IF NOT EXISTS "xp"                   integer                   DEFAULT 0             NOT NULL,
  ADD COLUMN IF NOT EXISTS "prestige"             integer                   DEFAULT 0             NOT NULL,
  ADD COLUMN IF NOT EXISTS "show_wishes"          integer                   DEFAULT 1             NOT NULL;

-- links: missing product columns
ALTER TABLE "links"
  ADD COLUMN IF NOT EXISTS "is_product"           integer  DEFAULT 0  NOT NULL,
  ADD COLUMN IF NOT EXISTS "price"                varchar(30) DEFAULT '',
  ADD COLUMN IF NOT EXISTS "discount"             varchar(30) DEFAULT '',
  ADD COLUMN IF NOT EXISTS "product_image"        text        DEFAULT '';

-- theme_purchases
CREATE TABLE IF NOT EXISTS "theme_purchases" (
  "id"                  serial PRIMARY KEY,
  "user_id"             integer NOT NULL REFERENCES "users"("id") ON DELETE cascade,
  "theme_id"            varchar(64) NOT NULL,
  "purchased_at"        timestamp with time zone DEFAULT now() NOT NULL
);

-- click_logs (anti-spam / rate-limit)
CREATE TABLE IF NOT EXISTS "click_logs" (
  "id"          serial PRIMARY KEY,
  "visitor_ip"  varchar(64) NOT NULL,
  "target_id"   integer     NOT NULL,
  "target_type" varchar(20) NOT NULL,
  "created_at"  timestamp with time zone DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "click_logs_ip_target_idx"
  ON "click_logs" ("visitor_ip", "target_id", "target_type");

-- marketplace_themes
CREATE TABLE IF NOT EXISTS "marketplace_themes" (
  "id"             serial PRIMARY KEY,
  "creator_id"     integer NOT NULL REFERENCES "users"("id") ON DELETE cascade,
  "name"           varchar(128) NOT NULL,
  "bg_color"       varchar(30)  DEFAULT '#fafafa'    NOT NULL,
  "text_color"     varchar(30)  DEFAULT '#1a1a2e'    NOT NULL,
  "bg_image"       text         DEFAULT '',
  "button_style"   varchar(30)  DEFAULT 'rounded-xl' NOT NULL,
  "backdrop_style" varchar(30)  DEFAULT 'glass-light' NOT NULL,
  "price"          integer      DEFAULT 49            NOT NULL,
  "sales_count"    integer      DEFAULT 0             NOT NULL,
  "status"         varchar(20)  DEFAULT 'active'      NOT NULL,
  "created_at"     timestamp with time zone DEFAULT now() NOT NULL
);

-- marketplace_themes: add missing columns if table already existed without them
ALTER TABLE "marketplace_themes"
  ADD COLUMN IF NOT EXISTS "button_style"   varchar(30) DEFAULT 'rounded-xl'  NOT NULL,
  ADD COLUMN IF NOT EXISTS "backdrop_style" varchar(30) DEFAULT 'glass-light' NOT NULL,
  ADD COLUMN IF NOT EXISTS "sales_count"    integer     DEFAULT 0              NOT NULL,
  ADD COLUMN IF NOT EXISTS "status"         varchar(20) DEFAULT 'active'       NOT NULL;

-- marketplace_transactions
CREATE TABLE IF NOT EXISTS "marketplace_transactions" (
  "id"               serial PRIMARY KEY,
  "theme_id"         integer NOT NULL REFERENCES "marketplace_themes"("id") ON DELETE cascade,
  "buyer_id"         integer NOT NULL REFERENCES "users"("id") ON DELETE cascade,
  "order_id"         varchar(128),
  "total_amount"     integer DEFAULT 0 NOT NULL,
  "creator_earnings" integer DEFAULT 0 NOT NULL,
  "platform_fee"     integer DEFAULT 0 NOT NULL,
  "status"           varchar(20) DEFAULT 'pending' NOT NULL,
  "created_at"       timestamp with time zone DEFAULT now() NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS "mktx_order_id_unique_idx"
  ON "marketplace_transactions" ("order_id")
  WHERE "order_id" IS NOT NULL;

-- creator_balances
CREATE TABLE IF NOT EXISTS "creator_balances" (
  "id"                  serial PRIMARY KEY,
  "user_id"             integer NOT NULL REFERENCES "users"("id") ON DELETE cascade,
  "total_earned"        integer DEFAULT 0   NOT NULL,
  "pending_withdrawal"  integer DEFAULT 0   NOT NULL,
  "paid_out"            integer DEFAULT 0   NOT NULL,
  "upi_id"              varchar(128) DEFAULT '',
  "updated_at"          timestamp with time zone DEFAULT now() NOT NULL
);
