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
    where exists (
      select 1
      from pg_policy p2
      where p2.polrelid = p.polrelid
        and p2.polname = 'public_view_select'
    )
      and p.polname <> 'public_view_select'
      and p.polcmd = 'r'
      and coalesce(pg_get_expr(p.polqual, p.polrelid), '') = 'true'
      and not exists (
        select 1
        from unnest(p.polroles) as role_oid
        where role_oid <> 0
          and role_oid not in (
            select oid
            from pg_roles
            where rolname in ('anon', 'authenticated')
          )
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
