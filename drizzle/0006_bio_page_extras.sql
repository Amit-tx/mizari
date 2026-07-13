-- Run this in your Neon SQL Editor after deploying the updated code.
-- Safe to run multiple times — uses IF NOT EXISTS throughout.

-- Short italic tagline shown under the bio (e.g. "Knowledge That Makes Life Easier.")
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "tagline" text NOT NULL DEFAULT '';

-- Dual call-to-action buttons (primary = filled, secondary = outline)
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "cta_primary_text" varchar(60) NOT NULL DEFAULT '';
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "cta_primary_link" text NOT NULL DEFAULT '';
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "cta_secondary_text" varchar(60) NOT NULL DEFAULT '';
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "cta_secondary_link" text NOT NULL DEFAULT '';

-- Info Card: flexible label/value pairs, works for any profession
-- (Creator: Role/Focus/Mission, Doctor: Specialization/Experience/Clinic, etc.)
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "info_card_enabled" integer NOT NULL DEFAULT 0;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "info_card_title" varchar(60) NOT NULL DEFAULT 'Profile';
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "info_card_items" text NOT NULL DEFAULT '[]';

-- Dark "Let's get in touch" contact block (phone / email)
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "contact_enabled" integer NOT NULL DEFAULT 0;
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "contact_phone" varchar(30) NOT NULL DEFAULT '';
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "contact_email" varchar(255) NOT NULL DEFAULT '';
