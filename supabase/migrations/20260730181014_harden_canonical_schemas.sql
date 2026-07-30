revoke all on schema ingest from public,anon,authenticated;
revoke all privileges on all tables in schema ingest from anon,authenticated;
revoke all privileges on all sequences in schema ingest from anon,authenticated;

grant usage on schema ingest to service_role;
grant all privileges on all tables in schema ingest to service_role;
grant usage,select on all sequences in schema ingest to service_role;

revoke all on schema core,catalog,taxonomy,evidence,labour,reporting from public,anon,authenticated;
revoke all privileges on all tables in schema core,catalog,taxonomy,evidence,labour,reporting from anon,authenticated;
revoke all privileges on all sequences in schema core,catalog,taxonomy,evidence,labour,reporting from anon,authenticated;

grant usage on schema core,catalog,taxonomy,evidence,labour,reporting to service_role;
grant all privileges on all tables in schema core,catalog,taxonomy,evidence,labour,reporting to service_role;
grant usage,select on all sequences in schema core,catalog,taxonomy,evidence,labour,reporting to service_role;