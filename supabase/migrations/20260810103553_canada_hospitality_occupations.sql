-- Canada Hospitality occupation cohort: 8 canonical careers.
-- Current 2026 Express Entry occupation categories do not include these eight NOCs.
-- COPS 2024-2033 projects moderate shortage only for Cooks (63200); the others are balanced.

insert into public.country_occupation_profiles (
  profile_key,country_code,canonical_career_id,official_title,official_code_system,official_code_version,
  official_unit_group_code,currency,registration_required,registration_authority,registration_url,
  publication_status,source_checked_at,updated_at
) values
  ('CA:chef','CA','chef','Chefs','NOC','2021 Version 1.0','62200','CAD',false,null,null,'profile_ready','2026-08-10',now()),
  ('CA:cook','CA','cook','Cooks','NOC','2021 Version 1.0','63200','CAD',false,null,null,'profile_ready','2026-08-10',now()),
  ('CA:hotel-manager','CA','hotel-manager','Accommodation service managers — Hotel Manager','NOC','2021 Version 1.0','60031','CAD',false,null,null,'profile_ready','2026-08-10',now()),
  ('CA:restaurant-manager','CA','restaurant-manager','Restaurant and food service managers','NOC','2021 Version 1.0','60030','CAD',false,null,null,'profile_ready','2026-08-10',now()),
  ('CA:baker','CA','baker','Bakers','NOC','2021 Version 1.0','63202','CAD',false,null,null,'profile_ready','2026-08-10',now()),
  ('CA:tourism-manager','CA','tourism-manager','Managers in customer and personal services — Tour Operator tourism-management scope','NOC','2021 Version 1.0','60040','CAD',false,null,null,'profile_ready','2026-08-10',now()),
  ('CA:event-planner','CA','event-planner','Conference and event planners','NOC','2021 Version 1.0','12103','CAD',false,null,null,'profile_ready','2026-08-10',now()),
  ('CA:hospitality-supervisor','CA','hospitality-supervisor','Food service supervisors','NOC','2021 Version 1.0','62020','CAD',false,null,null,'profile_ready','2026-08-10',now())
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
  ('CA:chef','2025-11-19',null,23.00,0,0,0,0,8,2,0,0,3,13,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Chef maps directly to NOC 62200 Chefs.','shortage_note','COPS projects NOC 62200 to remain BALANCED nationally over 2024-2033.','visa_basis','NOC 62200 is not listed in a current Express Entry occupation category.','registration_basis','Job Bank records Chef as not regulated nationally; CWC/CCC and Cook Red Seal pathways are available to qualified chefs.','salary_method','Job Bank national median hourly wage CAD 23.00 earns 2/10.','entry_basis','Several years of commercial food-preparation experience are normally required and senior chef roles add supervisory experience.'),'2026-08-10'),
  ('CA:cook','2025-11-19',null,18.00,15,0,0,0,15,2,0,0,4,36,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Cook maps directly to NOC 63200 Cooks.','shortage_note','COPS classifies NOC 63200 as MODERATE RISK OF SHORTAGE over 2024-2033, earning 15/20.','visa_basis','NOC 63200 is not listed in a current Express Entry occupation category.','registration_basis','Cook trade certification is voluntary across Canada and Red Seal endorsement is available.','salary_method','Job Bank national median hourly wage CAD 18.00 earns 2/10.','programme_caveat','The linked RRC Culinary Arts programme is internationally available but currently PGWP-noneligible in the Canada programme publication layer.'),'2026-08-10'),
  ('CA:hotel-manager','2025-11-19',null,38.00,0,0,0,0,8,8,0,0,4,20,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Hotel Manager is an explicit title within NOC 60031 Accommodation service managers.','shortage_note','COPS projects NOC 60031 to remain BALANCED nationally over 2024-2033.','visa_basis','NOC 60031 is not listed in a current Express Entry occupation category.','registration_basis','Job Bank records Hotel Manager as not regulated in Canada.','salary_method','Job Bank national median hourly wage CAD 38.00 earns 8/10.','entry_basis','Several years of accommodation-industry experience are usually required and large establishments normally expect relevant post-secondary study.'),'2026-08-10'),
  ('CA:restaurant-manager','2025-11-19',null,26.00,0,0,0,0,8,4,0,0,4,16,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Restaurant Manager maps directly to NOC 60030 Restaurant and food service managers.','shortage_note','COPS projects NOC 60030 to remain BALANCED nationally over 2024-2033.','visa_basis','NOC 60030 is not listed in a current Express Entry occupation category.','registration_basis','Job Bank records the occupation as not regulated; responsible beverage-service certification may be required by establishment.','salary_method','Job Bank national median hourly wage CAD 26.00 earns 4/10.','entry_basis','Several years of food-service experience including supervisory experience are required.'),'2026-08-10'),
  ('CA:baker','2025-11-19',null,17.50,0,0,0,0,14,2,0,0,4,20,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Baker maps directly to NOC 63202 Bakers.','shortage_note','COPS projects NOC 63202 to remain BALANCED nationally over 2024-2033.','visa_basis','NOC 63202 is not listed in a current Express Entry occupation category.','registration_basis','Baker trade certification is voluntary in participating jurisdictions and Red Seal endorsement is available.','salary_method','Job Bank national median hourly wage CAD 17.50 earns 2/10.','entry_basis','Apprenticeship, college baking training or several years of commercial baking experience are normal pathways.'),'2026-08-10'),
  ('CA:tourism-manager','2025-11-19',null,34.00,0,0,0,0,10,6,0,0,5,21,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Canada has no one exact private-sector NOC titled Tourism Manager; this profile uses the Tour Operator tourism-management scope within broader NOC 60040 Managers in customer and personal services. Government tourism-development managers in NOC 40011 are excluded.','shortage_note','COPS projects broader NOC 60040 to remain BALANCED nationally over 2024-2033.','visa_basis','NOC 60040 is not listed in a current Express Entry occupation category.','registration_basis','Job Bank records Tour Operator as not regulated in Canada.','salary_method','Job Bank Tour Operator national median hourly wage CAD 34.00 earns 6/10.','employment_scope','The broader NOC employment total is not presented as a Tourism Manager-only count.'),'2026-08-10'),
  ('CA:event-planner','2025-11-19',null,28.37,0,0,0,0,10,4,0,0,4,18,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Event Planner maps directly to NOC 12103 Conference and event planners.','shortage_note','COPS projects NOC 12103 to remain BALANCED nationally over 2024-2033.','visa_basis','NOC 12103 is not listed in a current Express Entry occupation category.','registration_basis','There is no single national Event Planner licence; event or conference certifications may be required by role.','salary_method','Job Bank national median hourly wage CAD 28.37 earns 4/10.','entry_basis','A related degree or diploma is usually required, though relevant hospitality, tourism or public-relations experience may substitute.'),'2026-08-10'),
  ('CA:hospitality-supervisor','2025-11-19',null,19.00,0,0,0,0,15,2,0,0,5,22,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Canonical Hospitality Supervisor is constrained through its Food Service Supervisor alias to NOC 62020 Food service supervisors.','shortage_note','COPS shows MODERATE recent shortage signs but projects BALANCE over 2024-2033, so the long-run shortage component remains 0.','visa_basis','NOC 62020 is not listed in a current Express Entry occupation category.','registration_basis','No single national professional licence applies; food-safety or responsible-service credentials can be employer- or province-specific.','salary_method','Job Bank national median hourly wage CAD 19.00 earns 2/10.','scope_note','Accommodation supervisors and hotel managers are not blended into this profile.'),'2026-08-10')
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
  ('CA:chef','62200','Chefs',null,false,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=62200&version=2021.0','2026-08-10'),
  ('CA:cook','63200','Cooks',null,false,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=63200&version=2021.0','2026-08-10'),
  ('CA:hotel-manager','60031','Accommodation service managers — Hotel Manager',null,false,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=60031&version=2021.0','2026-08-10'),
  ('CA:restaurant-manager','60030','Restaurant and food service managers',null,false,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=60030&version=2021.0','2026-08-10'),
  ('CA:baker','63202','Bakers',null,false,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=63202&version=2021.0','2026-08-10'),
  ('CA:tourism-manager','60040','Managers in customer and personal services — Tour Operator tourism-management scope',null,false,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=60040&version=2021.0','2026-08-10'),
  ('CA:event-planner','12103','Conference and event planners',null,false,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=12103&version=2021.0','2026-08-10'),
  ('CA:hospitality-supervisor','62020','Food service supervisors',null,false,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=62020&version=2021.0','2026-08-10')
on conflict (profile_key,official_code) do update set
  official_title=excluded.official_title,
  shortage_rating=excluded.shortage_rating,
  visa_eligible=excluded.visa_eligible,
  included_in_rollup=excluded.included_in_rollup,
  sort_order=excluded.sort_order,
  source_url=excluded.source_url,
  source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_links (
  profile_key,link_type,label,url,provider_type,region_code,sort_order,source_checked_at
) values
  ('CA:chef','job_search','Job Bank — Chef in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/16420/ca','official_job_board',null,1,'2026-08-10'),
  ('CA:cook','job_search','Job Bank — Cook in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/6225/ca','official_job_board',null,1,'2026-08-10'),
  ('CA:hotel-manager','job_search','Job Bank — Hotel Manager in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/12393/ca','official_job_board',null,1,'2026-08-10'),
  ('CA:restaurant-manager','job_search','Job Bank — Restaurant Manager in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/2031/ca','official_job_board',null,1,'2026-08-10'),
  ('CA:baker','job_search','Job Bank — Baker in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/22246/ca','official_job_board',null,1,'2026-08-10'),
  ('CA:tourism-manager','job_search','Job Bank — Tour Operator in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/27113/ca','official_job_board',null,1,'2026-08-10'),
  ('CA:event-planner','job_search','Job Bank — Event Planner in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/12546/ca','official_job_board',null,1,'2026-08-10'),
  ('CA:hospitality-supervisor','job_search','Job Bank — Food Service Supervisor in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/6005/ca','official_job_board',null,1,'2026-08-10')
on conflict (profile_key,link_type,url) do update set
  label=excluded.label,
  provider_type=excluded.provider_type,
  region_code=excluded.region_code,
  sort_order=excluded.sort_order,
  source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_program_links (profile_key,program_ref,relation_type,source_checked_at) values
  ('CA:chef','ca-program:2565','direct','2026-08-10'),
  ('CA:chef','ca-program:1403','related','2026-08-10'),
  ('CA:cook','ca-program:3471','direct','2026-08-10'),
  ('CA:hotel-manager','ca-program:3225','direct','2026-08-10'),
  ('CA:hotel-manager','ca-program:2960','related','2026-08-10'),
  ('CA:restaurant-manager','ca-program:2288','related','2026-08-10'),
  ('CA:restaurant-manager','ca-program:3225','related','2026-08-10'),
  ('CA:baker','ca-program:1347','direct','2026-08-10'),
  ('CA:baker','ca-program:1974','direct','2026-08-10'),
  ('CA:tourism-manager','ca-program:2288','related','2026-08-10'),
  ('CA:tourism-manager','ca-program:246','related','2026-08-10'),
  ('CA:event-planner','ca-program:2567','direct','2026-08-10'),
  ('CA:hospitality-supervisor','ca-program:3225','direct','2026-08-10'),
  ('CA:hospitality-supervisor','ca-program:2138','related','2026-08-10')
on conflict (profile_key,program_ref) do update set
  relation_type=excluded.relation_type,
  source_checked_at=excluded.source_checked_at;
