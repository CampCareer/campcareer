-- Standard country-card metrics for Australia.
-- Keep the original point observations and add explicit display ranges plus
-- ranking values so the same contract can be reused across launch countries.

insert into evidence.sources (
  source_key,
  organisation_name,
  source_name,
  source_type,
  canonical_url,
  country_code,
  active
)
values (
  'country-profile:au:abs-employee-earnings-hours-2025-05',
  'Australian Bureau of Statistics',
  'Employee Earnings and Hours, Australia, May 2025',
  'government_dataset',
  'https://www.abs.gov.au/statistics/labour/earnings-and-working-conditions/employee-earnings-and-hours-australia/may-2025',
  'AU',
  true
)
on conflict (source_key) do update
set organisation_name = excluded.organisation_name,
    source_name = excluded.source_name,
    source_type = excluded.source_type,
    canonical_url = excluded.canonical_url,
    country_code = excluded.country_code,
    active = true,
    updated_at = now();

insert into evidence.source_snapshots (
  source_id,
  source_url,
  published_at,
  data_as_of,
  retrieved_at,
  snapshot_status,
  metadata
)
select
  s.id,
  s.canonical_url,
  date '2025-05-01',
  date '2025-05-01',
  timestamptz '2026-08-05 18:30:00+00',
  'captured',
  jsonb_build_object(
    'table', 'Table 2: Distribution and composition of weekly total cash earnings',
    'population', 'full_time_persons',
    'measure', 'first_quartile_median_third_quartile'
  )
from evidence.sources s
where s.source_key = 'country-profile:au:abs-employee-earnings-hours-2025-05'
  and not exists (
    select 1
    from evidence.source_snapshots ss
    where ss.source_id = s.id
      and ss.source_url = s.canonical_url
      and ss.data_as_of = date '2025-05-01'
  );

delete from evidence.metric_observations
where scope_type = 'country'
  and scope_id = 'AU'
  and metric_key in (
    'full_time_annual_earnings_range',
    'student_living_cost_monthly_range'
  );

with salary_snapshot as (
  select ss.id
  from evidence.source_snapshots ss
  join evidence.sources s on s.id = ss.source_id
  where s.source_key = 'country-profile:au:abs-employee-earnings-hours-2025-05'
    and ss.data_as_of = date '2025-05-01'
  order by ss.retrieved_at desc
  limit 1
), living_snapshot as (
  select ss.id
  from evidence.source_snapshots ss
  join evidence.sources s on s.id = ss.source_id
  where s.source_key = 'country-profile:au:five-city-sharehouse-living-cost-v1'
  order by ss.data_as_of desc nulls last, ss.retrieved_at desc
  limit 1
)
insert into evidence.metric_observations (
  metric_key,
  scope_type,
  scope_id,
  value,
  unit,
  source_snapshot_id,
  evidence_kind,
  confidence,
  methodology,
  assumptions,
  effective_from,
  review_status,
  reviewed_at,
  reviewer_note
)
select
  'full_time_annual_earnings_range',
  'country',
  'AU',
  jsonb_build_object(
    'low', 74048,
    'high', 133120,
    'ranking_value', 98124,
    'currency', 'AUD',
    'weekly_low', 1424,
    'weekly_median', 1887,
    'weekly_high', 2560,
    'basis', 'middle_50_percent_full_time_persons',
    'measure_type', 'interquartile_range',
    'annualisation', 'weekly_x_52'
  ),
  'AUD/year',
  salary_snapshot.id,
  'calculated',
  'high',
  'ABS first quartile, median and third quartile weekly total cash earnings for full-time persons, annualised by multiplying each value by 52.',
  jsonb_build_object(
    'population', 'full_time_persons',
    'gross_or_net', 'gross',
    'annualisation_weeks', 52,
    'ranking_measure', 'median'
  ),
  date '2025-05-01',
  'verified',
  timestamptz '2026-08-05 18:30:00+00',
  'Country-card salary range and ranking value.'
from salary_snapshot
union all
select
  'student_living_cost_monthly_range',
  'country',
  'AU',
  jsonb_build_object(
    'low', 1692.62,
    'high', 1942.76,
    'ranking_value', 1816.90,
    'currency', 'AUD',
    'scenario', 'one_student_sharehouse',
    'city_count', 5,
    'basis', 'five_city_student_scenario',
    'measure_type', 'scenario_range'
  ),
  'AUD/month',
  living_snapshot.id,
  'calculated',
  'medium',
  'Minimum, average and maximum of the verified controlled monthly living-cost profiles for Adelaide, Brisbane, Melbourne, Perth and Sydney.',
  jsonb_build_object(
    'population', 'one_international_student',
    'housing', 'one_room_in_sharehouse',
    'included', jsonb_build_array('housing', 'food', 'transport', 'utilities', 'phone_and_internet', 'basic_personal_costs'),
    'excluded', jsonb_build_array('tuition', 'visa_fees', 'airfare', 'scholarships', 'employment_income'),
    'ranking_measure', 'five_city_average'
  ),
  date '2025-01-01',
  'verified',
  timestamptz '2026-08-05 18:30:00+00',
  'Country-card student living-cost range and ranking value.'
from living_snapshot;
