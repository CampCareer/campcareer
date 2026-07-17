-- Store manually verified, current programme pages on the provider's own domain.
-- CRICOS remains the government registry source. It is not labelled as a
-- university programme page in the product.
--
-- This is a maintenance script because the linked project's migration history
-- predates the local migration history. It is idempotent and was applied to
-- the linked database on 2026-07-17.

alter table public.courses_au
  add column if not exists official_course_url text,
  add column if not exists official_url_status text not null default 'unverified',
  add column if not exists official_url_checked_at timestamptz,
  add column if not exists official_url_source text;

alter table public.courses_au
  drop constraint if exists courses_au_official_url_status_check;

alter table public.courses_au
  add constraint courses_au_official_url_status_check
  check (official_url_status in ('unverified', 'verified', 'review_needed', 'not_found', 'stale'));

create index if not exists courses_au_official_course_url_verified_idx
  on public.courses_au (official_url_checked_at desc)
  where official_course_url is not null and official_url_status = 'verified';

-- Verification after importing a batch:
-- select official_url_status, count(*) from public.courses_au
-- group by official_url_status order by official_url_status;
