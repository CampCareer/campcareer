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
  and e.scope_id = 'SG'
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

revoke all on public.study_destination_metric_sg_v1 from anon, authenticated;
grant select on public.study_destination_metric_sg_v1 to service_role;
