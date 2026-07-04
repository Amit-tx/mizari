-- Run this in your Neon SQL Editor after deploying the updated code.
-- Safe to run multiple times — uses IF NOT EXISTS throughout.

-- Stores up to 5 rotating announcement banner messages as a JSON array
-- of { text, link } objects, e.g. '[{"text":"Sale live!","link":""}]'.
-- Existing single announcement_text/announcement_link columns are left
-- in place for backward compatibility and are no longer written to by
-- new code, but old data isn't lost.
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "announcement_messages" text NOT NULL DEFAULT '[]';
