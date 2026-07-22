-- A private, durable starting point for the My Plan goal setup flow.
-- Saved universities and courses remain independent bookmarks; goal options are
-- a snapshot so a user's plan does not lose context if a bookmark is removed.

begin;

create table public.plan_goal_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  country text not null default 'AU' check (country = 'AU'),
  target_occupation_code text not null default '' check (char_length(target_occupation_code) <= 80),
  target_occupation_title text not null default '' check (char_length(target_occupation_title) <= 180),
  target_study_concept_slug text not null default '' check (char_length(target_study_concept_slug) <= 120),
  target_study_concept_label text not null default '' check (char_length(target_study_concept_label) <= 180),
  target_intake_month date,
  plan_title text not null default 'My Australia pathway' check (char_length(plan_title) between 1 and 160),
  strategy text not null default '' check (char_length(strategy) <= 500),
  setup_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.plan_goal_options (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  position smallint not null check (position between 1 and 3),
  source_type text not null check (source_type in ('saved_university', 'saved_course')),
  source_reference text not null check (char_length(source_reference) between 1 and 160),
  title text not null default '' check (char_length(title) <= 240),
  provider_name text not null default '' check (char_length(provider_name) <= 240),
  field_name text not null default '' check (char_length(field_name) <= 180),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, position),
  unique (user_id, source_type, source_reference)
);

create index plan_goal_options_user_created_idx
  on public.plan_goal_options (user_id, created_at desc);

grant select, insert, update, delete on public.plan_goal_profiles to authenticated;
grant select, insert, update, delete on public.plan_goal_options to authenticated;

alter table public.plan_goal_profiles enable row level security;
alter table public.plan_goal_options enable row level security;

create policy "users read own plan goal profile"
  on public.plan_goal_profiles for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "users insert own plan goal profile"
  on public.plan_goal_profiles for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "users update own plan goal profile"
  on public.plan_goal_profiles for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "users delete own plan goal profile"
  on public.plan_goal_profiles for delete to authenticated
  using ((select auth.uid()) = user_id);

create policy "users read own plan goal options"
  on public.plan_goal_options for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "users insert own plan goal options"
  on public.plan_goal_options for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "users update own plan goal options"
  on public.plan_goal_options for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy "users delete own plan goal options"
  on public.plan_goal_options for delete to authenticated
  using ((select auth.uid()) = user_id);

commit;
