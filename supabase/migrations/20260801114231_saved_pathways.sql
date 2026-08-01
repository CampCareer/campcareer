begin;

create table public.saved_pathways (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  country_code text not null,
  field_slug text not null,
  status_slug text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint saved_pathways_user_country_field_unique unique (user_id, country_code, field_slug)
);

grant select, insert, update, delete on public.saved_pathways to authenticated;
alter table public.saved_pathways enable row level security;

create policy "users_select_own_saved_pathways" on public.saved_pathways for select to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "users_insert_own_saved_pathways" on public.saved_pathways for insert to authenticated
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "users_update_own_saved_pathways" on public.saved_pathways for update to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy "users_delete_own_saved_pathways" on public.saved_pathways for delete to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

commit;
