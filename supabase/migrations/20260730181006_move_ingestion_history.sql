alter table public.data_source_runs set schema evidence;
alter table evidence.data_source_runs rename to ingestion_runs;

grant usage on schema ingest to service_role;
grant all privileges on all tables in schema ingest to service_role;
grant usage,select on all sequences in schema ingest to service_role;
grant all privileges on table evidence.ingestion_runs to service_role;

comment on schema ingest is 'Raw and source-shaped datasets retained for reproducible canonical imports; applications must read canonical schemas instead.';
comment on table evidence.ingestion_runs is 'Immutable source retrieval and import run history.';