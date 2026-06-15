-- ============================================================================
-- Degree Risk — Korean editorial columns on public.majors — 15 June 2026
--
-- Purpose
--   risk_summary (card summary) and ai_note (AI-exposure layer note) are stored
--   English-first as free text. This migration adds the *_ko "vessel" columns so
--   a human translation pass can localize all 50 rows. Values stay NULL here —
--   the app already falls back to the English originals when these are NULL, so
--   ko renders safely before the translation seed lands.
--
--   Korean values are seeded separately from docs/ko-editorial-export.csv (a
--   human translation, keyed by row_pk = majors.id). No data is changed here.
-- ============================================================================

ALTER TABLE public.majors
  ADD COLUMN IF NOT EXISTS risk_summary_ko text,
  ADD COLUMN IF NOT EXISTS ai_note_ko text;

COMMENT ON COLUMN public.majors.risk_summary_ko IS
  'Korean translation of risk_summary. NULL → app falls back to English risk_summary.';
COMMENT ON COLUMN public.majors.ai_note_ko IS
  'Korean translation of ai_note. NULL → app falls back to English ai_note.';
