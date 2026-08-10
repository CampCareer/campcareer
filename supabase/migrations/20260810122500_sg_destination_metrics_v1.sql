-- Singapore bounded study-destination metric read model v1.
-- Metrics stay country-scoped and preserve their source-native JSON evidence.

create or replace view public.study_destination_metric_sg_v1
with (security_invoker = true) as
select
  e.scope_id as country_code,
  e.metric_key,
  e.value,
  e.source_name,
  e.source_url,
  e.data_as_of,
  e.last_verified_at,
  e.confidence,
  e.evidence_kind,
  e.review_status
from public.report_metric_evidence_country e
where e.scope_type = 'country'
  and upper(e.scope_id) = 'SG'
  and e.review_status = 'verified'
  and e.metric_key in (
    'country_population',
    'student_living_cost_monthly_range',
    'student_transport_reference',
    'student_work_hours_limit',
    'tuition_annual_low',
    'tuition_annual_high',
    'visa_application_fee',
    'employment_focus_sectors'
  );

comment on view public.study_destination_metric_sg_v1 is
  'Service-role bounded Singapore study-destination evidence. Values retain source-native caveats and country scope.';

revoke all on public.study_destination_metric_sg_v1 from public, anon, authenticated;
grant select on public.study_destination_metric_sg_v1 to service_role;

do $$
declare
  row_count integer;
  distinct_metric_count integer;
  missing_provenance_count integer;
  unverified_count integer;
  programme_count integer;
begin
  select count(*), count(distinct metric_key)
  into row_count, distinct_metric_count
  from public.study_destination_metric_sg_v1;

  if row_count <> 8 or distinct_metric_count <> 8 then
    raise exception 'Expected exactly 8 bounded SG study metrics, found % rows / % distinct keys', row_count, distinct_metric_count;
  end if;

  select count(*) into missing_provenance_count
  from public.study_destination_metric_sg_v1
  where source_url is null
     or source_url !~ '^https://'
     or source_name is null
     or data_as_of is null
     or last_verified_at is null;

  if missing_provenance_count > 0 then
    raise exception 'Found % SG study metrics without complete provenance', missing_provenance_count;
  end if;

  select count(*) into unverified_count
  from public.study_destination_metric_sg_v1
  where review_status is distinct from 'verified';

  if unverified_count > 0 then
    raise exception 'Found % non-verified rows in SG study metric publication view', unverified_count;
  end if;

  select linked_program_count into programme_count from public.study_destination_sg_v1;
  if programme_count <> 0 then
    raise exception 'SG programme coverage must remain pending until explicit offering evidence exists; found % programmes', programme_count;
  end if;
end $$;
