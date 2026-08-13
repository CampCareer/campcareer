create table public.user_preferences (
  id uuid primary key references auth.users(id) on delete cascade,
  citizenship_country text,
  target_country text,
  target_occupation text,
  relevant_experience_years smallint,
  degree_level text,
  english_level text,
  study_path_available boolean,
  career_personalisation_completed_at timestamptz,
  updated_at timestamptz not null default now()
);

grant select, insert, update, delete on table public.user_preferences to authenticated;
alter table public.user_preferences enable row level security;

create policy "users_manage_own_preferences"
on public.user_preferences for all to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);
