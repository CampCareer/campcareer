begin;

revoke all privileges on table public.saved_pathways from anon, authenticated;
grant select, insert, update, delete on table public.saved_pathways to authenticated;

commit;
