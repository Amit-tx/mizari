-- Prevents duplicate marketplace transactions (and double creator payouts)
-- if verify-payment is ever called twice for the same Razorpay order.
-- Partial index (WHERE order_id IS NOT NULL) so it doesn't choke on
-- rows that predate this constraint and have a NULL order_id.
--
-- IMPORTANT: run this manually against your Neon DB (not via `drizzle-kit
-- push`, since your migration history is currently out of sync with the
-- live schema for the marketplace_* tables). Before running, check for
-- existing duplicates first:
--
--   SELECT order_id, COUNT(*) FROM marketplace_transactions
--   WHERE order_id IS NOT NULL GROUP BY order_id HAVING COUNT(*) > 1;
--
-- If that returns rows, resolve/dedupe them before applying this index.

CREATE UNIQUE INDEX IF NOT EXISTS "marketplace_transactions_order_id_unique_idx"
  ON "marketplace_transactions" ("order_id")
  WHERE "order_id" IS NOT NULL;
