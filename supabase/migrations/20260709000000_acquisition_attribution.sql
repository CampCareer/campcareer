-- Acquisition attribution for decision briefs, email leads, and affiliate exits.
-- All writes go through server routes/actions using the service role. Visitors
-- never receive SELECT access to event or subscription-attribution records.

BEGIN;

CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  session_id TEXT,
  path TEXT,
  first_path TEXT,
  utm JSONB NOT NULL DEFAULT '{}'::jsonb,
  context JSONB NOT NULL DEFAULT '{}'::jsonb,
  referer TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS analytics_events_event_created_idx
  ON public.analytics_events (event_name, created_at DESC);
CREATE INDEX IF NOT EXISTS analytics_events_session_created_idx
  ON public.analytics_events (session_id, created_at DESC)
  WHERE session_id IS NOT NULL;

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.subscriptions
  ADD COLUMN IF NOT EXISTS acquisition_session_id TEXT,
  ADD COLUMN IF NOT EXISTS first_path TEXT,
  ADD COLUMN IF NOT EXISTS utm JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS decision_context JSONB NOT NULL DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS subscriptions_acquisition_session_idx
  ON public.subscriptions (acquisition_session_id)
  WHERE acquisition_session_id IS NOT NULL;

COMMIT;
