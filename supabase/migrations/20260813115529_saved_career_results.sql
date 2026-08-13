begin;

create table public.saved_career_results (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  country_code text not null check (country_code ~ '^[A-Z]{2}$'),
  career_id text not null check (career_id ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint saved_career_results_user_country_career_unique unique (user_id, country_code, career_id)
);

revoke all privileges on table public.saved_career_results from anon, authenticated;
grant select, insert, update, delete on table public.saved_career_results to authenticated;

alter table public.saved_career_results enable row level security;

create policy "users_select_own_saved_career_results"
on public.saved_career_results for select to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "users_insert_own_saved_career_results"
on public.saved_career_results for insert to authenticated
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "users_update_own_saved_career_results"
on public.saved_career_results for update to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "users_delete_own_saved_career_results"
on public.saved_career_results for delete to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

commit;
