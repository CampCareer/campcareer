-- The result bookmark is intentionally separate from the legacy study-pathway
-- shortlist. It holds only a validated country/career selection and the
-- evidence recency needed to resume a decision; no free text or sensitive
-- personalisation answers are copied here.

begin;

create table public.saved_career_results (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  country_code text not null check (country_code ~ '^[A-Z]{2}$'),
  occupation_id text not null check (occupation_id ~ '^[a-z0-9][a-z0-9-]{1,118}$'),
  personalised boolean not null default false,
  evidence_checked_at date,
  next_action text not null check (next_action in ('review_registration', 'review_evidence')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, country_code, occupation_id)
);

create index saved_career_results_user_updated_idx
  on public.saved_career_results (user_id, updated_at desc);

alter table public.saved_career_results enable row level security;
revoke all on table public.saved_career_results from anon;
grant select, insert, update, delete on table public.saved_career_results to authenticated;

create policy "users_manage_own_saved_career_results"
  on public.saved_career_results for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

comment on table public.saved_career_results is
  'Private, validated country-and-career result bookmarks for resuming a CampCareer decision.';

commit;
