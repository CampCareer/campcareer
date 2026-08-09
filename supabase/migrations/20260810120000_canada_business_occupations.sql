-- Canada Business occupation cohort: 8 canonical careers.
-- Current 2026 Express Entry occupation categories do not include these professional business NOCs.

insert into public.country_occupation_profiles (
  profile_key,country_code,canonical_career_id,official_title,official_code_system,official_code_version,
  official_unit_group_code,currency,registration_required,registration_authority,registration_url,
  publication_status,source_checked_at,updated_at
) values
  ('CA:accountant','CA','accountant','Financial auditors and accountants','NOC','2021 Version 1.0','11100','CAD',false,null,null,'profile_ready','2026-08-09',now()),
  ('CA:financial-analyst','CA','financial-analyst','Financial and investment analysts','NOC','2021 Version 1.0','11101','CAD',false,null,null,'profile_ready','2026-08-09',now()),
  ('CA:business-analyst','CA','business-analyst','Professional occupations in business management consulting','NOC','2021 Version 1.0','11201','CAD',false,null,null,'profile_ready','2026-08-09',now()),
  ('CA:supply-chain-analyst','CA','supply-chain-analyst','Professional occupations in business management consulting','NOC','2021 Version 1.0','11201','CAD',false,null,null,'profile_ready','2026-08-09',now()),
  ('CA:human-resources-specialist','CA','human-resources-specialist','Human resources professionals','NOC','2021 Version 1.0','11200','CAD',false,null,null,'profile_ready','2026-08-09',now()),
  ('CA:marketing-specialist','CA','marketing-specialist','Professional occupations in advertising, marketing and public relations','NOC','2021 Version 1.0','11202','CAD',false,null,null,'profile_ready','2026-08-09',now()),
  ('CA:auditor','CA','auditor','Financial auditors and accountants','NOC','2021 Version 1.0','11100','CAD',true,'Provincial and territorial CPA bodies','https://www.jobbank.gc.ca/marketreport/requirements/116/ca','profile_ready','2026-08-09',now()),
  ('CA:project-manager','CA','project-manager','Business and non-technical project management (multi-NOC scope)','NOC','2021 Version 1.0','11201/13100','CAD',false,null,null,'profile_ready','2026-08-09',now())
on conflict (profile_key) do update set
  official_title=excluded.official_title,
  official_code_system=excluded.official_code_system,
  official_code_version=excluded.official_code_version,
  official_unit_group_code=excluded.official_unit_group_code,
  currency=excluded.currency,
  registration_required=excluded.registration_required,
  registration_authority=excluded.registration_authority,
  registration_url=excluded.registration_url,
  publication_status=excluded.publication_status,
  source_checked_at=excluded.source_checked_at,
  updated_at=now();

insert into public.country_occupation_metric_snapshots (
  profile_key,as_of_date,employment_total,median_hourly_earnings,
  shortage_component,vacancy_intensity_component,employer_diversity_component,vacancy_trend_component,
  entry_level_component,salary_component,growth_component,visa_component,entry_burden_component,
  opportunity_score,score_methodology_version,score_status,score_evidence,source_checked_at
) values
  ('CA:accountant','2025-11-19',null,40.36,0,0,0,0,10,10,0,0,4,24,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Accountant is a title within NOC 11100 Financial auditors and accountants; broader employment is not used as an accountant-only total.','shortage_note','COPS projects NOC 11100 to remain BALANCED nationally over 2024-2033.','visa_basis','NOC 11100 is not in a current Express Entry occupation category.','registration_basis','Generic accounting work is not treated as universally licensed; protected CPA designation and public accounting practice are regulated.','salary_method','Exact Job Bank Accountant national median hourly wage CAD 40.36 earns 10/10.'),'2026-08-09'),
  ('CA:financial-analyst','2025-11-19',77000,43.27,0,0,0,0,8,10,0,0,4,22,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Financial Analyst maps to NOC 11101 Financial and investment analysts.','shortage_note','COPS projects NOC 11101 to remain BALANCED nationally over 2024-2033.','visa_basis','NOC 11101 is not in a current Express Entry occupation category.','entry_level_basis','University study is standard and Job Bank notes CFA or another recognized financial designation is usually required, so entry credit is conservative.','salary_method','Exact Job Bank Financial Analyst national median hourly wage CAD 43.27 earns 10/10.'),'2026-08-09'),
  ('CA:business-analyst','2025-11-19',null,44.10,0,0,0,0,10,10,0,0,5,25,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Business Analyst uses business-management analyst titles within broader NOC 11201 Professional occupations in business management consulting.','shortage_note','COPS projects NOC 11201 to remain BALANCED nationally over 2024-2033.','visa_basis','NOC 11201 is not in a current Express Entry occupation category.','salary_method','Exact Job Bank business-management analyst national median hourly wage CAD 44.10 earns 10/10.'),'2026-08-09'),
  ('CA:supply-chain-analyst','2025-11-19',null,44.10,0,0,0,0,10,10,0,0,5,25,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Supply Chain Process Analyst is an official Job Bank title within broader NOC 11201.','shortage_note','COPS projects NOC 11201 to remain BALANCED nationally over 2024-2033.','visa_basis','NOC 11201 is not in a current Express Entry occupation category.','program_basis','The selected supply-chain programme is a reviewed common pathway and is therefore published as related.','salary_method','Exact Job Bank Supply Chain Process Analyst national median hourly wage CAD 44.10 earns 10/10.'),'2026-08-09'),
  ('CA:human-resources-specialist','2025-11-19',126700,40.87,0,0,0,0,10,10,0,0,5,25,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Human Resources Specialist maps directly to NOC 11200 Human resources professionals.','shortage_note','COPS projects NOC 11200 to remain BALANCED nationally over 2024-2033.','visa_basis','NOC 11200 is not in a current Express Entry occupation category.','registration_basis','No single national licence; some employers may require CHRP or another professional designation.','salary_method','Exact Job Bank Human Resources Specialist national median hourly wage CAD 40.87 earns 10/10.'),'2026-08-09'),
  ('CA:marketing-specialist','2025-11-19',null,35.58,0,0,0,0,12,8,0,0,5,25,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Marketing Specialist maps to NOC 11202 Professional occupations in advertising, marketing and public relations.','shortage_note','Reviewed national evidence projects NOC 11202 to remain BALANCED over 2024-2033.','visa_basis','NOC 11202 is not in a current Express Entry occupation category.','salary_method','Exact Job Bank Marketing Specialist national median hourly wage CAD 35.58 earns 8/10.'),'2026-08-09'),
  ('CA:auditor','2025-11-19',null,40.36,0,0,0,0,6,10,0,0,4,20,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Auditor - Finance is a title within NOC 11100 Financial auditors and accountants; broader employment is not used as an auditor-only total.','shortage_note','COPS projects NOC 11100 to remain BALANCED nationally over 2024-2033.','visa_basis','NOC 11100 is not in a current Express Entry occupation category.','entry_level_basis','Job Bank states auditors require CPA-equivalent education, professional recognition and accounting experience, so entry credit is lower than generic Accountant.','salary_method','Exact Job Bank Auditor - Finance national median hourly wage CAD 40.36 earns 10/10.'),'2026-08-09'),
  ('CA:project-manager','2025-11-19',null,null,0,0,0,0,8,0,0,0,5,13,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Canonical Project Manager is represented as a business/non-technical multi-NOC scope using 11201 and 13100; sector-specific project roles are excluded.','shortage_note','Both reviewed component NOCs are BALANCED nationally over 2024-2033.','visa_basis','Neither component NOC is in a current Express Entry occupation category.','salary_method','No synthetic wage is calculated because Job Bank project-manager titles span materially different NOCs and wage levels.','program_basis','The selected generic Project Management programme is a reviewed common pathway and is published as related.'),'2026-08-09')
on conflict (profile_key,as_of_date) do update set
  employment_total=excluded.employment_total,
  median_hourly_earnings=excluded.median_hourly_earnings,
  shortage_component=excluded.shortage_component,
  vacancy_intensity_component=excluded.vacancy_intensity_component,
  employer_diversity_component=excluded.employer_diversity_component,
  vacancy_trend_component=excluded.vacancy_trend_component,
  entry_level_component=excluded.entry_level_component,
  salary_component=excluded.salary_component,
  growth_component=excluded.growth_component,
  visa_component=excluded.visa_component,
  entry_burden_component=excluded.entry_burden_component,
  opportunity_score=excluded.opportunity_score,
  score_methodology_version=excluded.score_methodology_version,
  score_status=excluded.score_status,
  score_evidence=excluded.score_evidence,
  source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_specialisations (
  profile_key,official_code,official_title,shortage_rating,visa_eligible,included_in_rollup,sort_order,source_url,source_checked_at
) values
  ('CA:accountant','11100','Financial auditors and accountants — Accountant title',null,false,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=11100&version=2021.0','2026-08-09'),
  ('CA:financial-analyst','11101','Financial and investment analysts',null,false,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=11101&version=2021.0','2026-08-09'),
  ('CA:business-analyst','11201','Professional occupations in business management consulting — business analyst titles',null,false,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=11201&version=2021.0','2026-08-09'),
  ('CA:supply-chain-analyst','11201','Professional occupations in business management consulting — supply chain process analyst title',null,false,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=11201&version=2021.0','2026-08-09'),
  ('CA:human-resources-specialist','11200','Human resources professionals',null,false,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=11200&version=2021.0','2026-08-09'),
  ('CA:marketing-specialist','11202','Professional occupations in advertising, marketing and public relations',null,false,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=11202&version=2021.0','2026-08-09'),
  ('CA:auditor','11100','Financial auditors and accountants — Auditor title',null,false,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=11100&version=2021.0','2026-08-09'),
  ('CA:project-manager','11201','Professional occupations in business management consulting — project-manager titles',null,false,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=11201&version=2021.0','2026-08-09'),
  ('CA:project-manager','13100','Administrative officers — project manager, non-technical title',null,false,true,2,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=13100&version=2021.0','2026-08-09')
on conflict (profile_key,official_code) do update set
  official_title=excluded.official_title,
  visa_eligible=excluded.visa_eligible,
  included_in_rollup=excluded.included_in_rollup,
  sort_order=excluded.sort_order,
  source_url=excluded.source_url,
  source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_links (
  profile_key,link_type,label,url,provider_type,region_code,sort_order,source_checked_at
) values
  ('CA:accountant','job_search','Job Bank — Accountant in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/113/ca','official_job_board',null,1,'2026-08-09'),
  ('CA:financial-analyst','job_search','Job Bank — Financial Analyst in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/12417/ca','official_job_board',null,1,'2026-08-09'),
  ('CA:business-analyst','job_search','Job Bank — Analyst, Business Management in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/287/ca','official_job_board',null,1,'2026-08-09'),
  ('CA:supply-chain-analyst','job_search','Job Bank — Supply Chain Process Analyst in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/25796/ca','official_job_board',null,1,'2026-08-09'),
  ('CA:human-resources-specialist','job_search','Job Bank — Human Resources Specialist in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/281/ca','official_job_board',null,1,'2026-08-09'),
  ('CA:marketing-specialist','job_search','Job Bank — Marketing Specialist in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/24727/ca','official_job_board',null,1,'2026-08-09'),
  ('CA:auditor','job_search','Job Bank — Auditor - Finance in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/116/ca','official_job_board',null,1,'2026-08-09'),
  ('CA:project-manager','source','Job Bank — Project Manager - Non-technical in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/25781/ca','official_job_board',null,1,'2026-08-09'),
  ('CA:project-manager','source','Job Bank — Business Analyst Project Manager in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/296424/ca','official_job_board',null,2,'2026-08-09'),
  ('CA:auditor','source','Job Bank — Auditor licensing and certification requirements','https://www.jobbank.gc.ca/marketreport/requirements/116/ca','official_regulator_context',null,1,'2026-08-09'),
  ('CA:accountant','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,2,'2026-08-09'),
  ('CA:financial-analyst','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,2,'2026-08-09'),
  ('CA:business-analyst','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,2,'2026-08-09'),
  ('CA:supply-chain-analyst','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,2,'2026-08-09'),
  ('CA:human-resources-specialist','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,2,'2026-08-09'),
  ('CA:marketing-specialist','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,2,'2026-08-09'),
  ('CA:auditor','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,2,'2026-08-09'),
  ('CA:project-manager','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,3,'2026-08-09')
on conflict (profile_key,link_type,url) do update set
  label=excluded.label,
  provider_type=excluded.provider_type,
  sort_order=excluded.sort_order,
  source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_program_links (profile_key,program_ref,relation_type,source_checked_at) values
  ('CA:accountant','ca-program:18','direct','2026-08-09'),
  ('CA:financial-analyst','ca-program:287','related','2026-08-09'),
  ('CA:business-analyst','ca-program:127','direct','2026-08-09'),
  ('CA:supply-chain-analyst','ca-program:256','related','2026-08-09'),
  ('CA:human-resources-specialist','ca-program:243','direct','2026-08-09'),
  ('CA:marketing-specialist','ca-program:306','direct','2026-08-09'),
  ('CA:auditor','ca-program:1324','direct','2026-08-09'),
  ('CA:project-manager','ca-program:234','related','2026-08-09')
on conflict (profile_key,program_ref) do update set
  relation_type=excluded.relation_type,
  source_checked_at=excluded.source_checked_at;
