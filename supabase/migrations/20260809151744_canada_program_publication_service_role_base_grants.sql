-- Allow the server-only Supabase service role to execute the security-invoker
-- Canada programme publication view while keeping browser roles blocked.
--
-- ca_program_publication_v1 reads these staging relations directly. With
-- security_invoker=true, the caller must have SELECT on the underlying
-- relations as well as the view itself.

grant select on table public.program_catalog_ca_staging to service_role;
grant select on table public.program_pgwp_ca_staging to service_role;

revoke all privileges on table public.program_catalog_ca_staging from anon, authenticated;
revoke all privileges on table public.program_pgwp_ca_staging from anon, authenticated;
