-- Migration: visa-alert send layer (Phase E)
--
-- Builds on 20260614000000_visa_alert_subscriptions.sql. Adds the columns and
-- the idempotency table the double-opt-in confirm/unsubscribe flow and the
-- policy-change broadcast worker need. No mail is sent by SQL; the app layer
-- (Next.js server actions / route handlers) does the sending via Resend.
--
-- Posture:
--   * Hard deletes are never used. Unsubscribe = set unsubscribed_at (soft).
--   * "Active subscriber" = confirmed = TRUE AND unsubscribed_at IS NULL.
--   * notifications_sent enforces "send a given broadcast at most once per
--     subscription" via UNIQUE (subscription_id, broadcast_key).
--   * RLS: anon has no access to notifications_sent (service role only). The
--     subscriptions insert-only anon policy from the prior migration is kept.
--
-- REVIEW BEFORE RUNNING. Wrapped in a transaction.

BEGIN;

-- ── subscriptions: double opt-in + soft unsubscribe timestamps ─────────────
ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS confirmed_at    TIMESTAMPTZ,  -- set when the user clicks the confirm link
  ADD COLUMN IF NOT EXISTS unsubscribed_at TIMESTAMPTZ;  -- set on unsubscribe (soft; row is kept)

-- Fast lookup of active subscribers for a country broadcast.
CREATE INDEX IF NOT EXISTS subscriptions_active_country_idx
  ON public.subscriptions (country)
  WHERE confirmed = TRUE AND unsubscribed_at IS NULL;

-- ── notifications_sent: per-subscription, per-broadcast idempotency ────────
CREATE TABLE IF NOT EXISTS public.notifications_sent (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID        NOT NULL REFERENCES public.subscriptions (id) ON DELETE CASCADE,
  broadcast_key   TEXT        NOT NULL,                 -- stable id for a policy change, e.g. 'uk-graduate-route-2027'
  sent_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- The same broadcast is delivered at most once per subscription.
  CONSTRAINT notifications_sent_unique UNIQUE (subscription_id, broadcast_key)
);

CREATE INDEX IF NOT EXISTS notifications_sent_broadcast_key_idx
  ON public.notifications_sent (broadcast_key);

-- ── RLS: notifications_sent is service-role only (no anon policy) ──────────
ALTER TABLE public.notifications_sent ENABLE ROW LEVEL SECURITY;

-- Drop any pre-existing policies (idempotent re-run) without hard-coding names.
DO $$
DECLARE pol_name text;
BEGIN
  FOR pol_name IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'notifications_sent'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.notifications_sent', pol_name);
  END LOOP;
END$$;
-- No policy created → anon/authenticated denied all access. Service role
-- (used by the broadcast worker) bypasses RLS.

COMMIT;

-- Post-flight sanity checks (run after COMMIT):
-- SELECT column_name FROM information_schema.columns
--   WHERE table_name = 'subscriptions' AND column_name IN ('confirmed_at','unsubscribed_at');  -- expect 2
-- SELECT to_regclass('public.notifications_sent');  -- expect the table
