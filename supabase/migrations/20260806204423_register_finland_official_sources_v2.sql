insert into evidence.sources (
  source_key, organisation_name, source_name, source_type, canonical_url, country_code, active, updated_at
)
values
  ('cc_fi_statistics_earnings_2024_v2', 'Statistics Finland', 'Structure of earnings 2024', 'government_dataset', 'https://stat.fi/en/publication/cmfzekguk478y07uqsyc5xfpt', 'FI', true, now()),
  ('cc_fi_studyinfinland_costs_2026_v2', 'Finnish National Agency for Education', 'Fees and Cost of Living 2026', 'provider', 'https://www.studyinfinland.fi/funding-your-studies/fees-and-cost-living', 'FI', true, now()),
  ('cc_fi_migri_student_rules_2026_v2', 'Finnish Immigration Service', 'Student income and work requirements 2026', 'regulator', 'https://migri.fi/en/income-requirement-for-students', 'FI', true, now()),
  ('cc_fi_migri_processing_fees_2026_v2', 'Finnish Immigration Service', 'Processing fees and payment methods 2026', 'regulator', 'https://migri.fi/en/processing-fees-and-payment-methods', 'FI', true, now()),
  ('cc_fi_infofinland_minimum_wage_v2', 'InfoFinland', 'Wages and working hours', 'provider', 'https://infofinland.fi/work-and-enterprise/during-employment/wages-and-working-hours', 'FI', true, now()),
  ('cc_fi_tampere_tuition_2026_v2', 'Tampere University', 'Tuition fees for students admitted in 2026', 'provider', 'https://www.tuni.fi/en/tau/financial-matters/tuition-fees-and-scholarships', 'FI', true, now()),
  ('cc_fi_aalto_tuition_2026_v2', 'Aalto University', 'Scholarships and Tuition Fees', 'provider', 'https://www.aalto.fi/en/admission-services/scholarships-and-tuition-fees', 'FI', true, now())
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
    ('cc_fi_statistics_earnings_2024_v2', 'https://stat.fi/en/publication/cmfzekguk478y07uqsyc5xfpt', date '2026-06-08', date '2024-12-31', date '2024-12-31', '{"monthly_d1":2483,"monthly_median":3615,"monthly_d9":6119,"monthly_mean":4070,"population":"full-time wage and salary earners","secondary_release_url":"https://stat.fi/en/publication/cm1ks981cdm5107w7zeme1ot7"}'::jsonb),
    ('cc_fi_studyinfinland_costs_2026_v2', 'https://www.studyinfinland.fi/funding-your-studies/fees-and-cost-living', date '2026-06-04', date '2026-06-04', date '2026-06-04', '{"monthly_living_low":900,"monthly_living_high":1200,"official_tuition_context_low":8000,"official_tuition_context_high":20000,"tuition_excluded_from_living":true}'::jsonb),
    ('cc_fi_migri_student_rules_2026_v2', 'https://migri.fi/en/income-requirement-for-students', null::date, date '2026-08-06', date '2026-01-01', '{"maintenance_requirement_monthly":800,"maintenance_requirement_annual":9600,"average_work_hours_weekly":30,"degree_related_work_unrestricted":true,"average_period":"calendar_year"}'::jsonb),
    ('cc_fi_migri_processing_fees_2026_v2', 'https://migri.fi/en/processing-fees-and-payment-methods', date '2026-01-01', date '2026-01-01', date '2026-01-01', '{"first_study_permit_electronic_fee":600,"first_study_permit_paper_fee":750,"currency":"EUR"}'::jsonb),
    ('cc_fi_infofinland_minimum_wage_v2', 'https://infofinland.fi/work-and-enterprise/during-employment/wages-and-working-hours', null::date, date '2026-08-06', date '2026-08-06', '{"statutory_national_minimum_wage":false,"collective_agreements_primary":true,"normal_and_reasonable_pay_required_without_collective_agreement":true}'::jsonb),
    ('cc_fi_tampere_tuition_2026_v2', 'https://www.tuni.fi/en/tau/financial-matters/tuition-fees-and-scholarships', null::date, date '2026-08-01', date '2026-08-01', '{"admission_year":2026,"annual_low_category":10000,"annual_high_category":12000,"student_type":"non-EU/EEA/Swiss fee-liable student"}'::jsonb),
    ('cc_fi_aalto_tuition_2026_v2', 'https://www.aalto.fi/en/admission-services/scholarships-and-tuition-fees', null::date, date '2026-08-01', date '2026-08-01', '{"study_right_start":"on or after 2025-08-01","bachelor_business_technology":12000,"master_technology_multidisciplinary":17000,"master_art_architecture":20000,"student_type":"non-EU/EEA/Swiss fee-liable student"}'::jsonb)
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
  d.metadata || jsonb_build_object('captured_for', 'campcareer_batch_3_finland_2026_08_06', 'country_code', 'FI')
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
