BEGIN;

-- UK universities / higher education institutions
CREATE TABLE IF NOT EXISTS public.colleges_uk (
  institution_id    TEXT         NOT NULL PRIMARY KEY,
  name              TEXT         NOT NULL,
  city              TEXT,
  region            TEXT,
  median_earnings   NUMERIC,
  tuition           NUMERIC,
  qs_rank           SMALLINT,
  website           TEXT,
  synced_at         TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_colleges_uk_region ON public.colleges_uk(region);

COMMENT ON TABLE  public.colleges_uk IS 'UK universities and higher education institutions';
COMMENT ON COLUMN public.colleges_uk.region IS 'ITL1 region code (TLC-TLN)';
COMMENT ON COLUMN public.colleges_uk.median_earnings IS 'Median graduate earnings from HESA/LEO';

COMMIT;
