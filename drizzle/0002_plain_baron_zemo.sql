CREATE TABLE "click_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"visitor_ip" varchar(128) NOT NULL,
	"target_id" integer NOT NULL,
	"target_type" varchar(20) NOT NULL,
	"referrer" varchar(255) DEFAULT 'direct' NOT NULL,
	"device" varchar(50) DEFAULT 'desktop' NOT NULL,
	"browser" varchar(50) DEFAULT 'unknown' NOT NULL,
	"country" varchar(50) DEFAULT 'unknown' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "creator_balances" (
	"user_id" integer PRIMARY KEY NOT NULL,
	"total_earned" integer DEFAULT 0 NOT NULL,
	"pending_withdrawal" integer DEFAULT 0 NOT NULL,
	"paid_out" integer DEFAULT 0 NOT NULL,
	"upi_id" varchar(128) DEFAULT ''
);
--> statement-breakpoint
CREATE TABLE "marketplace_themes" (
	"id" serial PRIMARY KEY NOT NULL,
	"creator_id" integer NOT NULL,
	"name" varchar(128) NOT NULL,
	"price" integer DEFAULT 49 NOT NULL,
	"bg_color" varchar(30) DEFAULT '#fafafa' NOT NULL,
	"text_color" varchar(30) DEFAULT '#1a1a2e' NOT NULL,
	"bg_image" text DEFAULT '',
	"button_style" varchar(30) DEFAULT 'rounded-xl' NOT NULL,
	"backdrop_style" varchar(30) DEFAULT 'glass-light' NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"sales_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "marketplace_transactions" (
	"id" serial PRIMARY KEY NOT NULL,
	"theme_id" integer NOT NULL,
	"buyer_id" integer NOT NULL,
	"order_id" varchar(128),
	"total_amount" integer DEFAULT 0 NOT NULL,
	"creator_earnings" integer DEFAULT 0 NOT NULL,
	"platform_fee" integer DEFAULT 0 NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "theme_purchases" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"theme_id" varchar(64) NOT NULL,
	"price_paid" integer DEFAULT 0 NOT NULL,
	"order_id" varchar(128),
	"payment_id" varchar(128),
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"purchased_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "links" ADD COLUMN "scheduled_start" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "links" ADD COLUMN "scheduled_end" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "links" ADD COLUMN "product_category" varchar(100) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "links" ADD COLUMN "is_sensitive" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "theme_backdrop" varchar(30) DEFAULT 'glass-light' NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "theme_rotate_interval" varchar(20) DEFAULT 'none' NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "last_theme_rotated_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "views" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "referrals" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "daily_active_days" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "last_active_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "xp" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "prestige" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "guestbook_style" varchar(30) DEFAULT 'tanabata' NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "guestbook_heading" varchar(100) DEFAULT 'Guestbook' NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "reaction_like" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "reaction_love" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "reaction_haha" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "reaction_wow" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "reaction_sad" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "reaction_fire" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "announcement_text" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "announcement_link" text DEFAULT '';--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "announcement_active" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "announcement_color" varchar(30) DEFAULT '#FF6B6B' NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "birthday" varchar(10) DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "profiles" ADD COLUMN "enable_dynamic_theme" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "creator_balances" ADD CONSTRAINT "creator_balances_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplace_themes" ADD CONSTRAINT "marketplace_themes_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplace_transactions" ADD CONSTRAINT "marketplace_transactions_theme_id_marketplace_themes_id_fk" FOREIGN KEY ("theme_id") REFERENCES "public"."marketplace_themes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marketplace_transactions" ADD CONSTRAINT "marketplace_transactions_buyer_id_users_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "theme_purchases" ADD CONSTRAINT "theme_purchases_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;