-- United Kingdom business occupation cohort: profiles and scores.
-- Current Home Office / MAC / Skills England evidence checked 2026-08-10.

insert into public.country_occupation_profiles (
  profile_key,country_code,canonical_career_id,official_title,official_code_system,official_code_version,
  official_unit_group_code,currency,registration_required,registration_authority,registration_url,
  publication_status,source_checked_at,updated_at
) values
  ('UK:accountant','UK','accountant','Chartered and certified accountants — financial accountant scope','SOC','SOC 2020','2421','GBP',false,null,null,'profile_ready','2026-08-10',now()),
  ('UK:financial-analyst','UK','financial-analyst','Finance and investment analysts and advisers — financial analyst scope','SOC','SOC 2020','2422','GBP',false,null,null,'profile_ready','2026-08-10',now()),
  ('UK:business-analyst','UK','business-analyst','Management consultants and business analysts — business analyst scope','SOC','SOC 2020','2431','GBP',false,null,null,'profile_ready','2026-08-10',now()),
  ('UK:supply-chain-analyst','UK','supply-chain-analyst','Buyers and procurement officers — supply-chain analyst scope','SOC','SOC 2020','3551','GBP',false,null,null,'profile_ready','2026-08-10',now()),
  ('UK:human-resources-specialist','UK','human-resources-specialist','Human resources and industrial relations officers — HR specialist scope','SOC','SOC 2020','3571','GBP',false,null,null,'profile_ready','2026-08-10',now()),
  ('UK:marketing-specialist','UK','marketing-specialist','Advertising and marketing associate professionals — marketing specialist scope','SOC','SOC 2020','3554','GBP',false,null,null,'profile_ready','2026-08-10',now()),
  ('UK:auditor','UK','auditor','Chartered and certified accountants — auditor scope','SOC','SOC 2020','2421','GBP',true,'Financial Reporting Council / recognised supervisory bodies','https://www.gov.uk/find-licences/become-a-registered-auditor','profile_ready','2026-08-10',now()),
  ('UK:project-manager','UK','project-manager','Business and financial project management professionals','SOC','SOC 2020','2440','GBP',false,null,null,'profile_ready','2026-08-10',now())
on conflict (profile_key) do update set
  official_title=excluded.official_title, official_code_system=excluded.official_code_system,
  official_code_version=excluded.official_code_version, official_unit_group_code=excluded.official_unit_group_code,
  currency=excluded.currency, registration_required=excluded.registration_required,
  registration_authority=excluded.registration_authority, registration_url=excluded.registration_url,
  publication_status=excluded.publication_status, source_checked_at=excluded.source_checked_at, updated_at=now();

insert into public.country_occupation_metric_snapshots (
  profile_key,as_of_date,employment_total,median_hourly_earnings,annualised_median_salary,
  shortage_component,vacancy_intensity_component,employer_diversity_component,vacancy_trend_component,
  entry_level_component,salary_component,growth_component,visa_component,entry_burden_component,
  opportunity_score,score_methodology_version,score_status,score_evidence,source_checked_at
) values
  ('UK:accountant','2026-08-10',null,25.23,49200,0,0,0,0,12,10,0,5,4,31,'career-opportunity-uk-v1','provisional',jsonb_build_object('classification_scope','SOC 2421 / 2421/02 qualified financial-accounting scope.','shortage_note','No targeted shortage evidence used; 0/20.','visa_basis','Standard RQF 6+ Skilled Worker route; 5/10.','salary_method','Home Office going rate GBP 49,200 / GBP 25.23; 10/10.','entry_basis','Degree, Level 6 and professional pathways; 12/15.','entry_burden_basis','Substantial professional training commonly required; 4/5.'),'2026-08-10'),
  ('UK:financial-analyst','2026-08-10',null,23.49,45800,0,0,0,0,8,10,0,5,5,28,'career-opportunity-uk-v1','provisional',jsonb_build_object('classification_scope','SOC 2422 financial-analyst scope.','shortage_note','No targeted shortage finding; 0/20.','visa_basis','Standard RQF 6+ Skilled Worker route; 5/10.','salary_method','Home Office going rate GBP 45,800 / GBP 23.49; 10/10.','entry_basis','Degree and Level 6 financial-services routes; 8/15.','entry_burden_basis','No universal licence; 5/5.'),'2026-08-10'),
  ('UK:business-analyst','2026-08-10',null,25.74,50200,0,0,0,0,12,10,0,5,5,32,'career-opportunity-uk-v1','provisional',jsonb_build_object('classification_scope','SOC 2431/01 professional Business analysts and consultants; excludes TSL-listed 3549/02 Business systems analysts.','shortage_note','No occupation-specific shortage points; 0/20.','visa_basis','Standard RQF 6+ Skilled Worker route; 5/10.','salary_method','Home Office going rate GBP 50,200 / GBP 25.74; 10/10.','entry_basis','Level 4 Business Analyst route; 12/15.','entry_burden_basis','No statutory licence; 5/5.'),'2026-08-10'),
  ('UK:supply-chain-analyst','2026-08-10',null,18.21,35500,0,0,0,0,12,6,0,3,5,26,'career-opportunity-uk-v1','provisional',jsonb_build_object('classification_scope','SOC 3551 procurement and supplier-analysis scope.','shortage_note','No occupation-specific shortage points; 0/20.','visa_basis','SOC 3551 is not on current TSL and is generally limited to qualifying pre-22 July 2025 Skilled Worker continuity; 3/10.','salary_method','Home Office going rate GBP 35,500 / GBP 18.21; 6/10.','entry_basis','Level 3 and Level 4 procurement pathways; 12/15.','entry_burden_basis','No statutory licence; 5/5.'),'2026-08-10'),
  ('UK:human-resources-specialist','2026-08-10',null,17.13,33400,0,0,0,0,15,4,0,10,5,34,'career-opportunity-uk-v1','provisional',jsonb_build_object('classification_scope','SOC 3571 / 3571/02 HR adviser-specialist scope.','shortage_note','Current TSL access is not treated as proof of shortage; 0/20.','visa_basis','Current Temporary Shortage List access through qualifying CoS before 31 December 2026; 10/10.','salary_method','Home Office going rate GBP 33,400 / GBP 17.13; 4/10.','entry_basis','Level 3 HR Support and Level 5 People Professional; 15/15.','entry_burden_basis','No statutory licence; 5/5.'),'2026-08-10'),
  ('UK:marketing-specialist','2026-08-10',180000,17.13,33400,0,0,0,0,15,4,0,10,5,34,'career-opportunity-uk-v1','provisional',jsonb_build_object('classification_scope','SOC 3554 marketing-specialist scope.','shortage_note','MAC July 2026 recommends no future TSL access and says historical evidence points away from shortage; 0/20.','visa_basis','Current Temporary Shortage List access through qualifying CoS before 31 December 2026; 10/10.','salary_method','Home Office going rate GBP 33,400 / GBP 17.13; 4/10.','entry_basis','Level 3 Multi-channel Marketer and Level 4 Marketing Executive; 15/15.','entry_burden_basis','No statutory licence; 5/5.'),'2026-08-10'),
  ('UK:auditor','2026-08-10',null,25.23,49200,0,0,0,0,8,10,0,5,1,24,'career-opportunity-uk-v1','provisional',jsonb_build_object('classification_scope','SOC 2421 qualified-accountant audit scope.','shortage_note','No targeted shortage evidence; 0/20.','visa_basis','Standard RQF 6+ Skilled Worker route; 5/10.','salary_method','Home Office going rate GBP 49,200 / GBP 25.23; 10/10.','entry_basis','Level 7 Internal Audit and recognised accountancy/audit routes; 8/15.','entry_burden_basis','Statutory audit requires qualification, experience and recognised supervisory-body registration; 1/5.'),'2026-08-10'),
  ('UK:project-manager','2026-08-10',null,28.97,56500,0,0,0,0,12,10,0,5,5,32,'career-opportunity-uk-v1','provisional',jsonb_build_object('classification_scope','SOC 2440 business and financial project management scope.','shortage_note','No occupation-wide shortage points; 0/20.','visa_basis','Standard RQF 6+ Skilled Worker route; 5/10.','salary_method','Home Office going rate GBP 56,500 / GBP 28.97; 10/10.','entry_basis','Level 4 Associate Project Manager and Level 6 Project Manager; 12/15.','entry_burden_basis','No statutory licence; 5/5.'),'2026-08-10')
on conflict (profile_key,as_of_date) do update set
  employment_total=excluded.employment_total, median_hourly_earnings=excluded.median_hourly_earnings,
  annualised_median_salary=excluded.annualised_median_salary, shortage_component=excluded.shortage_component,
  vacancy_intensity_component=excluded.vacancy_intensity_component, employer_diversity_component=excluded.employer_diversity_component,
  vacancy_trend_component=excluded.vacancy_trend_component, entry_level_component=excluded.entry_level_component,
  salary_component=excluded.salary_component, growth_component=excluded.growth_component, visa_component=excluded.visa_component,
  entry_burden_component=excluded.entry_burden_component, opportunity_score=excluded.opportunity_score,
  score_methodology_version=excluded.score_methodology_version, score_status=excluded.score_status,
  score_evidence=excluded.score_evidence, source_checked_at=excluded.source_checked_at;
