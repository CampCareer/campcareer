create temporary table _security_target_views on commit drop as
select
  c.oid as view_oid,
  n.nspname as view_schema,
  c.relname as view_name
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relkind = 'v'
  and coalesce(c.reloptions, array[]::text[]) @> array['security_invoker=false'];

create temporary table _security_view_deps on commit drop as
select distinct
  tv.view_oid,
  tv.view_schema,
  tv.view_name,
  bn.nspname as base_schema,
  b.relname as base_table,
  b.oid as base_oid,
  a.attname
from _security_target_views tv
join pg_rewrite r on r.ev_class = tv.view_oid
join pg_depend d
  on d.classid = 'pg_rewrite'::regclass
 and d.objid = r.oid
 and d.refclassid = 'pg_class'::regclass
join pg_class b
  on b.oid = d.refobjid
 and b.relkind in ('r', 'p')
join pg_namespace bn on bn.oid = b.relnamespace
left join pg_attribute a
  on a.attrelid = b.oid
 and a.attnum = d.refobjsubid
 and a.attnum > 0
 and not a.attisdropped;

do $$
declare
  rec record;
  column_list text;
begin
  for rec in
    select distinct base_schema
    from _security_view_deps
  loop
    execute format(
      'grant usage on schema %I to anon, authenticated',
      rec.base_schema
    );
  end loop;

  for rec in
    select
      base_schema,
      base_table,
      base_oid,
      string_agg(distinct quote_ident(attname), ', ' order by quote_ident(attname))
        filter (where attname is not null) as referenced_columns
    from _security_view_deps
    group by base_schema, base_table, base_oid
  loop
    column_list := rec.referenced_columns;

    if column_list is null then
      execute format(
        'grant select on table %I.%I to anon, authenticated',
        rec.base_schema,
        rec.base_table
      );
    else
      execute format(
        'grant select (%s) on table %I.%I to anon, authenticated',
        column_list,
        rec.base_schema,
        rec.base_table
      );
    end if;

    if not (select relrowsecurity from pg_class where oid = rec.base_oid) then
      execute format(
        'alter table %I.%I enable row level security',
        rec.base_schema,
        rec.base_table
      );
    end if;

    if not exists (
      select 1
      from pg_policy p
      where p.polrelid = rec.base_oid
        and p.polname = 'public_view_select'
    ) then
      execute format(
        'create policy %I on %I.%I for select to anon, authenticated using (true)',
        'public_view_select',
        rec.base_schema,
        rec.base_table
      );
    end if;
  end loop;

  for rec in
    select view_schema, view_name
    from _security_target_views
  loop
    execute format(
      'alter view %I.%I set (security_invoker = true)',
      rec.view_schema,
      rec.view_name
    );
  end loop;
end
$$;

alter function public.handle_new_user() set search_path = '';
revoke execute on function public.handle_new_user() from public, anon, authenticated, service_role;
revoke execute on function public.rls_auto_enable() from public, anon, authenticated, service_role;

alter default privileges for role postgres in schema public
  revoke execute on functions from public;
alter default privileges for role postgres in schema public
  revoke execute on functions from anon, authenticated;

drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

drop policy if exists "users_manage_own_preferences" on public.user_preferences;
create policy "users_manage_own_preferences"
on public.user_preferences
for all
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

drop policy if exists "assessments_claim_own" on public.assessments;
create policy "assessments_claim_own"
on public.assessments
for update
to authenticated
using (user_id is null)
with check (user_id = (select auth.uid()));

drop policy if exists "assessments_insert" on public.assessments;
create policy "assessments_insert"
on public.assessments
for insert
to anon, authenticated
with check (user_id is null or user_id = (select auth.uid()));

drop policy if exists "assessments_select_own" on public.assessments;
create policy "assessments_select_own"
on public.assessments
for select
to authenticated
using (user_id = (select auth.uid()));

do $$
declare
  rec record;
begin
  for rec in
    select
      n.nspname as schema_name,
      c.relname as table_name,
      p.polname as policy_name
    from pg_policy p
    join pg_class c on c.oid = p.polrelid
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'ingest'
      and p.polcmd in ('a', 'w')
      and (
        coalesce(pg_get_expr(p.polqual, p.polrelid), '') like '%auth.role()%service_role%'
        or coalesce(pg_get_expr(p.polwithcheck, p.polrelid), '') like '%auth.role()%service_role%'
      )
  loop
    execute format(
      'drop policy %I on %I.%I',
      rec.policy_name,
      rec.schema_name,
      rec.table_name
    );
  end loop;
end
$$;
