-- Canada Registered Nurse occupation profile.
-- Canonical scope maps to NOC 2021 31301 Registered nurses and registered psychiatric nurses.

insert into public.country_occupation_profiles (
  profile_key,country_code,canonical_career_id,official_title,official_code_system,official_code_version,
  official_unit_group_code,currency,registration_required,registration_authority,registration_url,
  publication_status,source_checked_at,updated_at
) values (
  'CA:registered-nurse','CA','registered-nurse','Registered nurses and registered psychiatric nurses','NOC','2021 Version 1.0','31301','CAD',true,
  'Provincial and territorial nursing regulators','https://www.ccrnr.ca/registered-nurses','profile_ready','2026-08-09',now()
)
on conflict (profile_key) do update set
  official_title=excluded.official_title,official_code_system=excluded.official_code_system,
  official_code_version=excluded.official_code_version,official_unit_group_code=excluded.official_unit_group_code,
  currency=excluded.currency,registration_required=excluded.registration_required,
  registration_authority=excluded.registration_authority,registration_url=excluded.registration_url,
  publication_status=excluded.publication_status,source_checked_at=excluded.source_checked_at,updated_at=now();

insert into public.country_occupation_metric_snapshots (
  profile_key,as_of_date,employment_total,median_weekly_earnings,median_hourly_earnings,annualised_median_salary,
  all_occupations_median_weekly,part_time_share_pct,female_share_pct,median_age,average_full_time_hours,
  vacancies_three_month_avg,vacancy_period,vacancy_yoy_pct,employment_growth_5y_pct,employment_growth_10y_pct,
  shortage_component,vacancy_intensity_component,employer_diversity_component,vacancy_trend_component,
  entry_level_component,salary_component,growth_component,visa_component,entry_burden_component,
  opportunity_score,score_methodology_version,score_status,score_evidence,source_checked_at
) values (
  'CA:registered-nurse','2025-11-19',363100,null,43.27,null,null,null,null,null,null,
  null,null,null,null,null,20,0,0,0,13,10,0,10,2,55,'career-opportunity-ca-v1','provisional',
  jsonb_build_object(
    'classification_scope','NOC 31301 includes Registered Nurses and Registered Psychiatric Nurses; the canonical profile is Registered Nurse and preserves this unit-group scope caveat.',
    'labour_scope','Job Bank national median wage is CAD 43.27/hour, updated 2025-11-19. COPS reports about 363,100 workers in the NOC 31301 unit group in 2023.',
    'shortage_note','COPS classifies NOC 31301 as STRONG RISK OF SHORTAGE nationally for 2024-2033.',
    'visa_basis','NOC 31301 is listed in the current Express Entry healthcare and social services occupations category.',
    'entry_level_basis','Approved Canadian entry-to-practice nursing degrees provide a structured graduate route; international-student direct BScN programmes are present in the verified Canada catalogue.',
    'entry_burden_basis','Provincial or territorial registration is mandatory; outside Quebec RN applicants must pass NCLEX-RN and meet regulator-specific requirements.',
    'salary_method','Canada v1 exact Job Bank national median hourly wage band; CAD 43.27/hour earns 10/10.',
    'vacancy_scope','Current Job Bank advertised-job counts are point-in-time and are not treated as a three-month vacancy series.'
  ),'2026-08-09'
)
on conflict (profile_key,as_of_date) do update set
  employment_total=excluded.employment_total,median_hourly_earnings=excluded.median_hourly_earnings,
  shortage_component=excluded.shortage_component,vacancy_intensity_component=excluded.vacancy_intensity_component,
  employer_diversity_component=excluded.employer_diversity_component,vacancy_trend_component=excluded.vacancy_trend_component,
  entry_level_component=excluded.entry_level_component,salary_component=excluded.salary_component,growth_component=excluded.growth_component,
  visa_component=excluded.visa_component,entry_burden_component=excluded.entry_burden_component,
  opportunity_score=excluded.opportunity_score,score_methodology_version=excluded.score_methodology_version,
  score_status=excluded.score_status,score_evidence=excluded.score_evidence,source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_specialisations (
  profile_key,official_code,official_title,shortage_rating,visa_eligible,included_in_rollup,sort_order,source_url,source_checked_at
) values (
  'CA:registered-nurse','31301','Registered nurses and registered psychiatric nurses',null,true,true,1,
  'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=31301&version=2021.0','2026-08-09'
)
on conflict (profile_key,official_code) do update set
  official_title=excluded.official_title,visa_eligible=excluded.visa_eligible,included_in_rollup=excluded.included_in_rollup,
  sort_order=excluded.sort_order,source_url=excluded.source_url,source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_links (profile_key,link_type,label,url,provider_type,region_code,sort_order,source_checked_at) values
  ('CA:registered-nurse','job_search','Job Bank — Registered Nurse in Canada','https://www.jobbank.gc.ca/marketreport/wages-occupation/993/ca','official_job_board',null,1,'2026-08-09'),
  ('CA:registered-nurse','source','CCRNR — Registered Nurses','https://www.ccrnr.ca/registered-nurses','official_regulator_network',null,1,'2026-08-09'),
  ('CA:registered-nurse','source','IRCC — Express Entry category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,2,'2026-08-09')
on conflict (profile_key,link_type,url) do update set label=excluded.label,provider_type=excluded.provider_type,sort_order=excluded.sort_order,source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_program_links (profile_key,program_ref,relation_type,source_checked_at) values
  ('CA:registered-nurse','ca-program:2060','direct','2026-08-09'),
  ('CA:registered-nurse','ca-program:3540','direct','2026-08-09')
on conflict (profile_key,program_ref) do update set relation_type=excluded.relation_type,source_checked_at=excluded.source_checked_at;
