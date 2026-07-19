-- Official links are user-saved evidence, not a CampCareer endorsement. They
-- power the Verify step while keeping external approval separate from activity.
create table if not exists public.programme_evidence (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  programme_key text not null check (char_length(programme_key) between 2 and 180),
  evidence_type text not null check (evidence_type in ('course', 'registration', 'fees', 'admission')),
  official_url text not null check (char_length(official_url) <= 500 and official_url ~ '^https://'),
  note text not null default '' check (char_length(note) <= 600),
  created_at timestamptz not null default now(),
  unique (user_id, programme_key, evidence_type)
);

create index if not exists programme_evidence_user_programme_idx on public.programme_evidence (user_id, programme_key, created_at desc);
alter table public.programme_evidence enable row level security;
grant select on public.programme_evidence to authenticated;
create policy "users read own programme evidence" on public.programme_evidence for select to authenticated using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
