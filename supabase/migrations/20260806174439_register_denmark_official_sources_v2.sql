insert into evidence.sources (
  source_key, organisation_name, source_name, source_type, canonical_url, country_code, active, updated_at
)
values
  ('cc_dk_dst_earnings_2024_v2', 'Statistics Denmark', 'Structure of Earnings 2024', 'government_dataset', 'https://www.dst.dk/da/Statistik/udgivelser/NytHtml?cid=51150', 'DK', true, now()),
  ('cc_dk_studyindenmark_budget_2026_v2', 'Study in Denmark', 'International student monthly budget', 'provider', 'https://studyindenmark.dk/live-in-denmark/bank-budget', 'DK', true, now()),
  ('cc_dk_siri_higher_education_2026_v2', 'Danish Agency for International Recruitment and Integration', 'Higher educational programmes 2026', 'regulator', 'https://nyidanmark.dk/en-GB/You-want-to-apply/Study/Higher-Education', 'DK', true, now()),
  ('cc_dk_lifeindenmark_minimum_wage_2026_v2', 'Ministry of Employment and Gender Equality', 'Pay and minimum-wage treatment', 'regulator', 'https://lifeindenmark.borger.dk/working/work-rights/working-conditions/pay', 'DK', true, now()),
  ('cc_dk_aau_tuition_2026_v2', 'Aalborg University', 'Bachelor tuition fees 2026', 'provider', 'https://www.en.aau.dk/education/apply/bachelor/finance-and-fees', 'DK', true, now())
on conflict (source_key) do update set
  organisation_name = excluded.organisation_name,
  source_name = excluded.source_name,
  source_type = excluded.source_type,
  canonical_url = excluded.canonical_url,
  country_code = excluded.country_code,
  active = true,
  updated_at = now();

with snapshot_data(source_key, source_url, published_at, data_as_of, valid_from, metadata) as (
  values
    ('cc_dk_dst_earnings_2024_v2', 'https://www.dst.dk/da/Statistik/udgivelser/NytHtml?cid=51150', date '2025-09-29', date '2024-12-31', date '2024-12-31', '{"statbank_table":"https://www.statbank.dk/LONS20","national_median_standardised_hourly":286.63,"standard_month_hours":160.33,"national_average_monthly":51675,"population":"employees excluding trainees and employees under 18"}'::jsonb),
    ('cc_dk_studyindenmark_budget_2026_v2', 'https://studyindenmark.dk/live-in-denmark/bank-budget', null::date, date '2026-08-06', date '2026-08-06', '{"monthly_low":8450,"monthly_high":13600,"rent_low":3000,"rent_high":6500,"insurance":300,"streaming":200,"books_low":400,"books_high":650,"mobile_phone":250,"food_low":2000,"food_high":3500,"transport":300,"personal_expenses":2000,"tuition_excluded":true}'::jsonb),
    ('cc_dk_siri_higher_education_2026_v2', 'https://nyidanmark.dk/en-GB/You-want-to-apply/Study/Higher-Education', null::date, date '2026-01-01', date '2026-01-01', '{"maintenance_requirement_monthly":7426,"maintenance_requirement_12_months":89112,"student_work_hours_monthly":90,"summer_full_time_months":["June","July","August"],"processing_fee":3060,"fee_currency":"DKK"}'::jsonb),
    ('cc_dk_lifeindenmark_minimum_wage_2026_v2', 'https://lifeindenmark.borger.dk/working/work-rights/working-conditions/pay', date '2026-06-29', date '2026-06-29', date '2026-06-29', '{"statutory_national_minimum_wage":false,"collective_agreements_primary":true,"individual_negotiation_possible":true}'::jsonb),
    ('cc_dk_aau_tuition_2026_v2', 'https://www.en.aau.dk/education/apply/bachelor/finance-and-fees', null::date, date '2026-08-01', date '2026-08-01', '{"academic_year":2026,"two_semesters":true,"economics_business_administration_annual":55600,"engineering_biotechnology_energy_annual":115700,"student_type":"non-EU/EEA bachelor student"}'::jsonb)
)
insert into evidence.source_snapshots (
  source_id, source_url, content_sha256, published_at, data_as_of, retrieved_at, valid_from, snapshot_status, metadata
)
select
  s.id,
  d.source_url,
  encode(digest(d.source_key || '|' || d.data_as_of::text || '|' || d.metadata::text, 'sha256'), 'hex'),
  d.published_at,
  d.data_as_of,
  now(),
  d.valid_from,
  'captured',
  d.metadata || jsonb_build_object('captured_for', 'campcareer_batch_3_denmark_2026_08_06', 'country_code', 'DK')
from snapshot_data d
join evidence.sources s on s.source_key = d.source_key
on conflict (source_id, content_sha256) where content_sha256 is not null do update set
  source_url = excluded.source_url,
  published_at = excluded.published_at,
  data_as_of = excluded.data_as_of,
  retrieved_at = excluded.retrieved_at,
  valid_from = excluded.valid_from,
  snapshot_status = 'captured',
  metadata = excluded.metadata;
