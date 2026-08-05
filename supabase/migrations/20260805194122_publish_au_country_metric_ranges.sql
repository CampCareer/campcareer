-- Publish the verified Australia country-card ranges through the existing
-- public reporting table. The canonical observations remain in evidence.*;
-- this table is the server-readable publication layer used by the website.

delete from public.report_metric_evidence_au
where scope_type = 'country'
  and scope_id = 'AU'
  and metric_key in (
    'full_time_annual_earnings_range',
    'student_living_cost_monthly_range'
  );

insert into public.report_metric_evidence_au (
  scope_type,
  scope_id,
  metric_key,
  value,
  source_name,
  source_url,
  data_as_of,
  last_verified_at,
  confidence,
  evidence_kind,
  review_status,
  created_at,
  updated_at
)
select
  observation.scope_type,
  observation.scope_id,
  observation.metric_key,
  observation.value,
  source.source_name,
  snapshot.source_url,
  coalesce(snapshot.data_as_of, observation.effective_from, current_date),
  coalesce(observation.reviewed_at, observation.updated_at, now()),
  observation.confidence,
  observation.evidence_kind,
  observation.review_status,
  observation.created_at,
  observation.updated_at
from evidence.metric_observations observation
join evidence.source_snapshots snapshot
  on snapshot.id = observation.source_snapshot_id
join evidence.sources source
  on source.id = snapshot.source_id
where observation.scope_type = 'country'
  and observation.scope_id = 'AU'
  and observation.review_status = 'verified'
  and observation.metric_key in (
    'full_time_annual_earnings_range',
    'student_living_cost_monthly_range'
  );
