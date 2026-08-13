-- Extend the earlier career-result bookmark migration without recreating its
-- table. The release branch already owns `saved_career_results.career_id`;
-- this migration adds the richer resume contract used by the current Home UI.

begin;

alter table public.saved_career_results
  add column if not exists occupation_id text,
  add column if not exists personalised boolean not null default false,
  add column if not exists evidence_checked_at date,
  add column if not exists next_action text not null default 'review_evidence';

update public.saved_career_results
set occupation_id = career_id
where occupation_id is null;

alter table public.saved_career_results
  alter column occupation_id set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'saved_career_results_user_country_occupation_unique'
  ) then
    alter table public.saved_career_results
      add constraint saved_career_results_user_country_occupation_unique
      unique (user_id, country_code, occupation_id);
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'saved_career_results_occupation_id_format_check'
  ) then
    alter table public.saved_career_results
      add constraint saved_career_results_occupation_id_format_check
      check (occupation_id ~ '^[a-z0-9][a-z0-9-]{1,118}$');
  end if;
  if not exists (
    select 1 from pg_constraint
    where conname = 'saved_career_results_next_action_check'
  ) then
    alter table public.saved_career_results
      add constraint saved_career_results_next_action_check
      check (next_action in ('review_registration', 'review_evidence'));
  end if;
end;
$$;

create index if not exists saved_career_results_user_updated_idx
  on public.saved_career_results (user_id, updated_at desc);

alter table public.saved_career_results enable row level security;
revoke all on table public.saved_career_results from anon;
grant select, insert, update, delete on table public.saved_career_results to authenticated;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'saved_career_results'
      and policyname = 'users_manage_own_saved_career_results'
  ) then
    create policy "users_manage_own_saved_career_results"
      on public.saved_career_results for all to authenticated
      using ((select auth.uid()) = user_id)
      with check ((select auth.uid()) = user_id);
  end if;
end;
$$;

comment on table public.saved_career_results is
  'Private, validated country-and-career result bookmarks for resuming a CampCareer decision.';

commit;
