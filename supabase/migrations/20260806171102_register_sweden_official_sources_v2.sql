insert into evidence.sources (
  source_key, organisation_name, source_name, source_type, canonical_url, country_code, active, updated_at
)
values
  ('cc_se_scb_salary_2025_v2', 'Statistics Sweden', 'Salary dispersion by sector and sex 2025', 'government_dataset', 'https://www.scb.se/en/finding-statistics/statistics-by-subject-area/labour-market/wages-salaries-and-labour-costs/salary-structures-whole-economy/pong/tables-and-graphs/salary-dispersion-by-sector-and-sex-2025/', 'SE', true, now()),
  ('cc_se_migration_higher_education_2026_v2', 'Swedish Migration Agency', 'Higher-education residence permit rules 2026', 'regulator', 'https://www.migrationsverket.se/en/you-want-to-apply/study/higher-education.html', 'SE', true, now()),
  ('cc_se_work_environment_minimum_wage_v2', 'Swedish Work Environment Authority', 'Rights of posted workers — remuneration and collective agreements', 'regulator', 'https://www.av.se/en/work-environment-work-and-inspections/foreign-labour-in-sweden/posting-foreign-labour-in-sweden/the-rights-of-posted-workers/', 'SE', true, now()),
  ('cc_se_kth_student_budget_2026_v2', 'KTH Royal Institute of Technology', 'International student living-cost budget', 'provider', 'https://www.kth.se/en/studies/master/application-and-tuition-fees-for-master-s-studies-1.65817', 'SE', true, now()),
  ('cc_se_stockholm_tuition_2026_v2', 'Stockholm University', 'Tuition fees by subject area', 'provider', 'https://www.su.se/english/education/how-to-apply/costs-fees-and-scholarships', 'SE', true, now()),
  ('cc_se_kth_tuition_2026_27_v2', 'KTH Royal Institute of Technology', 'Tuition fees for academic year 2026/27', 'provider', 'https://intra.kth.se/utbildning/antagning/avgifter-och-betalning-1.65062', 'SE', true, now())
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
    ('cc_se_scb_salary_2025_v2', 'https://www.scb.se/en/finding-statistics/statistics-by-subject-area/labour-market/wages-salaries-and-labour-costs/salary-structures-whole-economy/pong/tables-and-graphs/salary-dispersion-by-sector-and-sex-2025/', date '2026-06-16', date '2025-12-31', date '2025-12-31', '{"monthly_q1":32000,"monthly_median":38300,"monthly_q3":48000,"monthly_mean":42900,"population":"employees across all sectors, both sexes, Sweden"}'::jsonb),
    ('cc_se_migration_higher_education_2026_v2', 'https://www.migrationsverket.se/en/you-want-to-apply/study/higher-education.html', date '2026-05-25', date '2026-06-11', date '2026-06-11', '{"maintenance_requirement_monthly":10656,"student_work_hours_weekly":15,"adult_application_fee":1500,"permit_rule_scope":"bachelor and master permits granted on or after 2026-06-11"}'::jsonb),
    ('cc_se_work_environment_minimum_wage_v2', 'https://www.av.se/en/work-environment-work-and-inspections/foreign-labour-in-sweden/posting-foreign-labour-in-sweden/the-rights-of-posted-workers/', date '2026-07-01', date '2026-08-06', date '2026-08-06', '{"statutory_national_minimum_wage":false,"collective_agreements_primary":true}'::jsonb),
    ('cc_se_kth_student_budget_2026_v2', 'https://www.kth.se/en/studies/master/application-and-tuition-fees-for-master-s-studies-1.65817', date '2026-04-28', date '2026-04-28', date '2026-04-28', '{"monthly_low":9450,"monthly_high":12350,"location":"Stockholm","population":"international master student","tuition_excluded":true}'::jsonb),
    ('cc_se_stockholm_tuition_2026_v2', 'https://www.su.se/english/education/how-to-apply/costs-fees-and-scholarships', date '2025-12-01', date '2026-08-06', date '2026-08-06', '{"humanities_social_sciences_law_annual":90000,"sciences_annual":140000,"student_type":"fee-liable non-EU/EEA/Swiss"}'::jsonb),
    ('cc_se_kth_tuition_2026_27_v2', 'https://intra.kth.se/utbildning/antagning/avgifter-och-betalning-1.65062', date '2026-04-01', date '2026-07-01', date '2026-07-01', '{"undergraduate_general_annual":141000,"advanced_general_annual":180000,"architecture_excluded":true,"academic_year":"2026/27"}'::jsonb)
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
  d.metadata || jsonb_build_object('captured_for', 'campcareer_batch_3_sweden_2026_08_06', 'country_code', 'SE')
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
