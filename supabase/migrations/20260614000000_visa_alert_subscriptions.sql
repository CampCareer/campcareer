-- Migration: visa-policy alert email subscriptions
--
-- Captures opt-in subscriptions for "email me when this country/field's visa
-- policy changes". Anonymous visitors can INSERT only (no SELECT) — the same
-- privacy posture as the leads table. Double opt-in is supported by the schema
-- (confirmed flag + unsubscribe_token) but the confirm/send logic is a TODO in
-- the app layer; nothing here sends mail.
--
-- REVIEW BEFORE RUNNING. Wrapped in a transaction.

BEGIN;

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email             TEXT        NOT NULL,
  country           TEXT,                                  -- CountryCode | 'all' | null
  field             TEXT,                                  -- major slug or free-text field | null
  locale            TEXT,                                  -- 'en' | 'ko'
  source_path       TEXT,                                  -- where they subscribed from
  consent_at        TIMESTAMPTZ,                           -- explicit consent timestamp (GDPR)
  confirmed         BOOLEAN     NOT NULL DEFAULT FALSE,    -- double opt-in (set true after email confirm)
  unsubscribe_token UUID        NOT NULL DEFAULT gen_random_uuid(),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- One subscription per (email, country, field); a repeat insert is a duplicate.
  CONSTRAINT subscriptions_unique_target UNIQUE (email, country, field)
);

CREATE UNIQUE INDEX IF NOT EXISTS subscriptions_unsubscribe_token_idx
  ON public.subscriptions (unsubscribe_token);
CREATE INDEX IF NOT EXISTS subscriptions_email_idx ON public.subscriptions (email);

-- ── RLS: anon may INSERT only (cannot read others' subscriptions) ──────────
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Drop any pre-existing policies (idempotent re-run) without hard-coding names.
DO $$
DECLARE pol_name text;
BEGIN
  FOR pol_name IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'subscriptions'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.subscriptions', pol_name);
  END LOOP;
END$$;

-- Insert-only for anon + authenticated. No SELECT/UPDATE/DELETE policy is
-- created, so those are denied to anon/authenticated (service role bypasses RLS
-- for the future confirm/send/unsubscribe worker).
CREATE POLICY "subscriptions_anon_insert"
  ON public.subscriptions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

COMMIT;

-- Post-flight sanity check (run after COMMIT):
-- SELECT policyname, cmd FROM pg_policies WHERE tablename = 'subscriptions';
