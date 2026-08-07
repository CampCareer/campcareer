-- Australia Welder profile for the shared country occupation foundation.
-- CampCareer rolls the canonical welder intent to OSCA 3311 Structural Steel and Welding
-- Trades Workers so the current OSCA scope aligns with JSA's published ANZSCO 3223
-- employment, earnings, vacancy and projection series.

insert into public.country_occupation_profiles (
  profile_key, country_code, canonical_career_id, official_title,
  official_code_system, official_code_version, official_unit_group_code,
  currency, registration_required, registration_authority, registration_url,
  publication_status, source_checked_at, updated_at
) values (
  'AU:welder', 'AU', 'welder', 'Welder',
  'OSCA', '2024 v1.0', '3311', 'AUD', false,
  'State and territory work health and safety regulators; project and employer welding requirements',
  'https://www.safeworkaustralia.gov.au/safety-topic/industry-and-business/construction/working-construction-site',
  'profile_ready', '2026-08-07', now()
)
on conflict (profile_key) do update set
  official_title = excluded.official_title,
  official_code_system = excluded.official_code_system,
  official_code_version = excluded.official_code_version,
  official_unit_group_code = excluded.official_unit_group_code,
  currency = excluded.currency,
  registration_required = excluded.registration_required,
  registration_authority = excluded.registration_authority,
  registration_url = excluded.registration_url,
  publication_status = excluded.publication_status,
  source_checked_at = excluded.source_checked_at,
  updated_at = now();

insert into public.country_occupation_metric_snapshots (
  profile_key, as_of_date, employment_total, median_weekly_earnings,
  median_hourly_earnings, annualised_median_salary,
  all_occupations_median_weekly, part_time_share_pct, female_share_pct,
  median_age, average_full_time_hours, vacancies_three_month_avg,
  vacancy_period, vacancy_yoy_pct, employment_growth_5y_pct,
  employment_growth_10y_pct, shortage_component,
  vacancy_intensity_component, employer_diversity_component,
  vacancy_trend_component, entry_level_component, salary_component,
  growth_component, visa_component, entry_burden_component,
  opportunity_score, score_methodology_version, score_status,
  score_evidence, source_checked_at
) values (
  'AU:welder', '2026-05-01', 79100, 1688, 44, 87776,
  1852, 4, 1, 39, 46, 1428, '2026-05-01', 1.0,
  2.9, 7.5, 20, 15, 5, 5, 13, 4, 5, 10, 3, 80,
  'career-opportunity-v1', 'provisional',
  jsonb_build_object(
    'vacancy_intensity_pct', 1.81,
    'salary_premium_pct', -8.86,
    'employer_diversity_basis', 'Curated coverage of shipbuilding, defence, resources, heavy engineering and rail employers; replace with posting-level unique-employer data when available.',
    'entry_level_basis', 'MEM31925 is specifically developed for apprentices and must be undertaken through a Training Contract or formal trade-recognition assessment process.',
    'entry_burden_basis', 'A multi-year fabrication apprenticeship and Certificate III trade training are the standard entry route. There is no single national welder licence; White Card and other task- or site-specific requirements apply where relevant.',
    'scope_note', 'CampCareer welder rolls up OSCA 331131 Metal Fabricator, 331132 Pressure Welder and 331133 Welder (First Class), aligned to JSA ANZSCO 3223 Structural Steel and Welding Trades Workers for dated labour-market metrics.',
    'shortage_note', 'The 2025 Occupation Shortage List records all three mapped occupations in shortage nationally. Metal Fabricator and Welder (First Class) are in shortage in all eight states and territories; Pressure Welder has mixed jurisdiction ratings.',
    'vacancy_data_provenance', 'May 2026 JSA Internet Vacancy Index values were captured from an indexed current representation tied to the official JSA ANZSCO 3223 series because the source workbook row was not machine-readable through the available tools.',
    'projection_data_provenance', 'May 2025 to May 2035 JSA employment projection values were captured from an indexed current representation tied to the official JSA ANZSCO 3223 projection series because the source workbook was not machine-readable through the available tools.',
    'indexed_extraction_reference', 'https://nwivisas.com/australia/occupations/welder-first-class-322313',
    'score_note', 'Provisional until the IVI and employment-projection workbook rows are directly machine-ingested and posting-level employer and apprentice-entry evidence is available.'
  ),
  '2026-08-07'
)
on conflict (profile_key, as_of_date) do update set
  employment_total = excluded.employment_total,
  median_weekly_earnings = excluded.median_weekly_earnings,
  median_hourly_earnings = excluded.median_hourly_earnings,
  annualised_median_salary = excluded.annualised_median_salary,
  all_occupations_median_weekly = excluded.all_occupations_median_weekly,
  part_time_share_pct = excluded.part_time_share_pct,
  female_share_pct = excluded.female_share_pct,
  median_age = excluded.median_age,
  average_full_time_hours = excluded.average_full_time_hours,
  vacancies_three_month_avg = excluded.vacancies_three_month_avg,
  vacancy_period = excluded.vacancy_period,
  vacancy_yoy_pct = excluded.vacancy_yoy_pct,
  employment_growth_5y_pct = excluded.employment_growth_5y_pct,
  employment_growth_10y_pct = excluded.employment_growth_10y_pct,
  shortage_component = excluded.shortage_component,
  vacancy_intensity_component = excluded.vacancy_intensity_component,
  employer_diversity_component = excluded.employer_diversity_component,
  vacancy_trend_component = excluded.vacancy_trend_component,
  entry_level_component = excluded.entry_level_component,
  salary_component = excluded.salary_component,
  growth_component = excluded.growth_component,
  visa_component = excluded.visa_component,
  entry_burden_component = excluded.entry_burden_component,
  opportunity_score = excluded.opportunity_score,
  score_methodology_version = excluded.score_methodology_version,
  score_status = excluded.score_status,
  score_evidence = excluded.score_evidence,
  source_checked_at = excluded.source_checked_at;

insert into public.country_occupation_specialisations (
  profile_key, official_code, official_title, legacy_code_system,
  legacy_code_version, legacy_code, shortage_rating, visa_eligible,
  included_in_rollup, sort_order, source_url, source_checked_at
) values
  ('AU:welder', '331131', 'Metal Fabricator', 'ANZSCO', '2013 v1.3', '322311', 5, true, true, 1,
   'https://www.abs.gov.au/statistics/classifications/osca-occupation-standard-classification-australia/2024-version-1-0/browse-classification/3/33/331/3311/331131', '2026-08-07'),
  ('AU:welder', '331132', 'Pressure Welder', 'ANZSCO', '2013 v1.3', '322312', 5, true, true, 2,
   'https://www.abs.gov.au/statistics/classifications/osca-occupation-standard-classification-australia/2024-version-1-0/browse-classification/3/33/331/3311/331132', '2026-08-07'),
  ('AU:welder', '331133', 'Welder (First Class)', 'ANZSCO', '2013 v1.3', '322313', 5, true, true, 3,
   'https://www.abs.gov.au/statistics/classifications/osca-occupation-standard-classification-australia/2024-version-1-0/browse-classification/3/33/331/3311/331133', '2026-08-07')
on conflict (profile_key, official_code) do update set
  official_title = excluded.official_title,
  legacy_code_system = excluded.legacy_code_system,
  legacy_code_version = excluded.legacy_code_version,
  legacy_code = excluded.legacy_code,
  shortage_rating = excluded.shortage_rating,
  visa_eligible = excluded.visa_eligible,
  included_in_rollup = excluded.included_in_rollup,
  sort_order = excluded.sort_order,
  source_url = excluded.source_url,
  source_checked_at = excluded.source_checked_at;

insert into public.country_occupation_region_metrics (
  profile_key, region_code, as_of_date, shortage_rating, vacancy_count, source_url
) values
  ('AU:welder', 'WA', '2026-05-01', 3, 404, 'https://www.jobsandskills.gov.au/data/internet-vacancy-index'),
  ('AU:welder', 'QLD', '2026-05-01', 3, 395, 'https://www.jobsandskills.gov.au/data/internet-vacancy-index'),
  ('AU:welder', 'NSW', '2026-05-01', 3, 264, 'https://www.jobsandskills.gov.au/data/internet-vacancy-index'),
  ('AU:welder', 'VIC', '2026-05-01', 3, 214, 'https://www.jobsandskills.gov.au/data/internet-vacancy-index'),
  ('AU:welder', 'SA', '2026-05-01', 3, 119, 'https://www.jobsandskills.gov.au/data/internet-vacancy-index'),
  ('AU:welder', 'TAS', '2026-05-01', 3, 16, 'https://www.jobsandskills.gov.au/data/internet-vacancy-index'),
  ('AU:welder', 'NT', '2026-05-01', 3, 13, 'https://www.jobsandskills.gov.au/data/internet-vacancy-index'),
  ('AU:welder', 'ACT', '2026-05-01', 3, 4, 'https://www.jobsandskills.gov.au/data/internet-vacancy-index')
on conflict (profile_key, region_code, as_of_date) do update set
  shortage_rating = excluded.shortage_rating,
  vacancy_count = excluded.vacancy_count,
  source_url = excluded.source_url;

insert into public.country_occupation_links (
  profile_key, link_type, label, url, provider_type,
  region_code, sort_order, source_checked_at
) values
  ('AU:welder', 'job_search', 'SEEK — Welder jobs', 'https://www.seek.com.au/welder-jobs', 'private_job_board', null, 1, '2026-08-07'),
  ('AU:welder', 'job_search', 'Workforce Australia — Welder search', 'https://www.workforceaustralia.gov.au/individuals/jobs/search?searchText=welder', 'government_job_board', null, 2, '2026-08-07'),
  ('AU:welder', 'employer', 'Austal careers', 'https://careers.austal.com/', 'shipbuilding', 'WA', 1, '2026-08-07'),
  ('AU:welder', 'employer', 'BAE Systems Australia — Qualified Trades', 'https://careers.au.baesystems.com/jobs/Qualified-Trades', 'defence_shipbuilding', null, 2, '2026-08-07'),
  ('AU:welder', 'employer', 'Monadelphous — Trades careers', 'https://careers.monadelphous.com.au/careers/trades/', 'resources_engineering', null, 3, '2026-08-07'),
  ('AU:welder', 'employer', 'Civmec — Trade careers', 'https://www.civmec.com.au/make-your-big-move/', 'construction_manufacturing', null, 4, '2026-08-07'),
  ('AU:welder', 'employer', 'Downer — Apprentices and trades', 'https://downergroup.com/life-at-downer/young-professionals-hub/apprentices/', 'rail_infrastructure', null, 5, '2026-08-07'),
  ('AU:welder', 'entry_program', 'Australian Apprenticeships — Become an apprentice', 'https://www.apprenticeships.gov.au/apprentices', 'government_apprenticeship', null, 1, '2026-08-07'),
  ('AU:welder', 'entry_program', 'MIGAS — Engineering apprenticeships', 'https://www.migas.com.au/apprenticeships/engineering', 'apprenticeship_network', null, 2, '2026-08-07'),
  ('AU:welder', 'entry_program', 'Downer — Apprentices', 'https://downergroup.com/life-at-downer/young-professionals-hub/apprentices/', 'employer_apprenticeship', null, 3, '2026-08-07'),
  ('AU:welder', 'source', 'ABS OSCA 3311 Structural Steel and Welding Trades Workers', 'https://www.abs.gov.au/statistics/classifications/osca-occupation-standard-classification-australia/2024-version-1-0/browse-classification/3/33/331/3311', 'official_classification', null, 1, '2026-08-07'),
  ('AU:welder', 'source', 'Jobs and Skills Australia — Structural Steel and Welding Trades Workers profile', 'https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupations-anzsco/3223-structural-steel-and-welding-trades-workers', 'official_labour_market', null, 2, '2026-08-07'),
  ('AU:welder', 'source', 'Jobs and Skills Australia — Internet Vacancy Index', 'https://www.jobsandskills.gov.au/data/internet-vacancy-index', 'official_labour_market', null, 3, '2026-08-07'),
  ('AU:welder', 'source', 'Jobs and Skills Australia — Employment projections', 'https://www.jobsandskills.gov.au/data/employment-projections', 'official_labour_market', null, 4, '2026-08-07'),
  ('AU:welder', 'source', 'Jobs and Skills Australia — Occupation Shortage List', 'https://www.jobsandskills.gov.au/data/occupation-shortage', 'official_labour_market', null, 5, '2026-08-07'),
  ('AU:welder', 'source', 'National Training Register — MEM31925', 'https://training.gov.au/Training/Details/MEM31925', 'official_training', null, 6, '2026-08-07'),
  ('AU:welder', 'source', 'Safe Work Australia — Working on a construction site', 'https://www.safeworkaustralia.gov.au/safety-topic/industry-and-business/construction/working-construction-site', 'official_safety', null, 7, '2026-08-07'),
  ('AU:welder', 'source', 'Trades Recognition Australia — OSAP nominated occupations', 'https://www.tradesrecognitionaustralia.gov.au/osap-nominated-occupations-countries-and-sars', 'official_skills_assessment', null, 8, '2026-08-07'),
  ('AU:welder', 'source', 'Home Affairs — Skilled occupation list', 'https://immi.homeaffairs.gov.au/visas/working-in-australia/skill-occupation-list', 'official_visa', null, 9, '2026-08-07')
on conflict (profile_key, link_type, url) do update set
  label = excluded.label,
  provider_type = excluded.provider_type,
  region_code = excluded.region_code,
  sort_order = excluded.sort_order,
  source_checked_at = excluded.source_checked_at;

insert into public.country_occupation_program_links (
  profile_key, program_ref, relation_type, source_checked_at
) values
  ('AU:welder', 'au-vet:training-gov:MEM31925', 'direct', '2026-08-07')
on conflict (profile_key, program_ref) do update set
  relation_type = excluded.relation_type,
  source_checked_at = excluded.source_checked_at;
