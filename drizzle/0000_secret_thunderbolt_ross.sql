CREATE TABLE "links" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"url" text NOT NULL,
	"icon" text,
	"order" integer DEFAULT 0 NOT NULL,
	"clicks" integer DEFAULT 0 NOT NULL,
	"is_product" integer DEFAULT 0 NOT NULL,
	"price" varchar(30) DEFAULT '',
	"discount" varchar(30) DEFAULT '',
	"product_image" text DEFAULT ''
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"username" varchar(64) NOT NULL,
	"profile_type" varchar(30) DEFAULT 'personal' NOT NULL,
	"bio" text DEFAULT '',
	"avatar_url" text DEFAULT '',
	"theme_type" varchar(30) DEFAULT 'light' NOT NULL,
	"theme_bg_color" varchar(30) DEFAULT '#fafafa' NOT NULL,
	"theme_text_color" varchar(30) DEFAULT '#1a1a2e' NOT NULL,
	"theme_bg_image" text DEFAULT '',
	"theme_button_style" varchar(30) DEFAULT 'rounded-xl' NOT NULL,
	"likes" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text,
	"delete_token" varchar(255),
	"delete_token_expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "wishes" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" integer NOT NULL,
	"sender" varchar(100) DEFAULT 'Anonymous' NOT NULL,
	"text" text NOT NULL,
	"color" varchar(20) DEFAULT '#FFD6E0' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "links" ADD CONSTRAINT "links_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishes" ADD CONSTRAINT "wishes_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;