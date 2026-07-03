-- Run this in your Neon SQL Editor after deploying the updated code.
-- Safe to run multiple times — uses IF NOT EXISTS throughout.

-- profile_reactions: tracks each visitor's single active reaction per
-- profile (keyed by hashed IP), so the server — not the client — is the
-- source of truth for "has this visitor already reacted, and with what".
CREATE TABLE IF NOT EXISTS "profile_reactions" (
  "id"            serial PRIMARY KEY,
  "profile_id"    integer     NOT NULL REFERENCES "profiles"("id") ON DELETE cascade,
  "visitor_hash"  varchar(64) NOT NULL,
  "reaction_type" varchar(20) NOT NULL,
  "created_at"    timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at"    timestamp with time zone DEFAULT now() NOT NULL
);

-- One active reaction per visitor per profile.
CREATE UNIQUE INDEX IF NOT EXISTS "profile_reactions_profile_visitor_idx"
  ON "profile_reactions" ("profile_id", "visitor_hash");
