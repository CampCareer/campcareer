-- Canada Environment & Agriculture occupation cohort: 8 canonical careers.
-- Current 2026 Express Entry occupation categories include NOC 32104 in Healthcare and social services;
-- the other NOCs in this cohort are not listed in a current occupation category.

insert into public.country_occupation_profiles (
  profile_key,country_code,canonical_career_id,official_title,official_code_system,official_code_version,
  official_unit_group_code,currency,registration_required,registration_authority,registration_url,
  publication_status,source_checked_at,updated_at
) values
  ('CA:environmental-scientist','CA','environmental-scientist','Biologists and related scientists — environmental biologist science scope','NOC','2021 Version 1.0','21110','CAD',true,'Provincial biology regulators in Alberta and British Columbia','https://www.jobbank.gc.ca/marketreport/requirements/2637/ca','profile_ready','2026-08-09',now()),
  ('CA:agronomist','CA','agronomist','Agricultural representatives, consultants and specialists — Agronomist','NOC','2021 Version 1.0','21112','CAD',true,'Provincial institutes of agrology','https://www.jobbank.gc.ca/marketreport/requirements/15316/ca','profile_ready','2026-08-09',now()),
  ('CA:farm-manager','CA','farm-manager','Managers in agriculture','NOC','2021 Version 1.0','80020','CAD',false,null,null,'profile_ready','2026-08-09',now()),
  ('CA:forestry-technician','CA','forestry-technician','Forestry technologists and technicians','NOC','2021 Version 1.0','22112','CAD',true,'Provincial forestry technologist and technician regulators','https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=22112&version=2021.0','profile_ready','2026-08-09',now()),
  ('CA:food-technologist','CA','food-technologist','Chemical technologists and technicians — Food Technologist','NOC','2021 Version 1.0','22100','CAD',true,'Provincial applied-science and engineering technology regulators where applicable','https://www.jobbank.gc.ca/marketreport/requirements/2942/ca','profile_ready','2026-08-09',now()),
  ('CA:sustainability-specialist','CA','sustainability-specialist','Natural and applied science policy researchers, consultants and program officers — Sustainability Specialist','NOC','2021 Version 1.0','41400','CAD',false,null,null,'profile_ready','2026-08-09',now()),
  ('CA:horticulturist','CA','horticulturist','Landscape and horticulture technicians and specialists — Horticulturist','NOC','2021 Version 1.0','22114','CAD',true,'Provincial skilled-trades and technologist authorities where applicable','https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=22114&version=2021.0','profile_ready','2026-08-09',now()),
  ('CA:animal-science-technician','CA','animal-science-technician','Animal health technologists and veterinary technicians','NOC','2021 Version 1.0','32104','CAD',true,'Provincial animal health technologist and veterinary technician associations','https://www.jobbank.gc.ca/marketreport/requirements/4227/ca','profile_ready','2026-08-09',now())
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
  ('CA:environmental-scientist','2025-11-19',null,40.00,0,0,0,0,10,10,0,0,3,23,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Environmental Scientist is represented through the Environmental Biologist science scope inside broader NOC 21110; the canonical title is not treated as identical to all biologists.','shortage_note','COPS projects NOC 21110 to remain BALANCED nationally over 2024-2033.','visa_basis','NOC 21110 is not listed in a current Express Entry occupation category.','registration_basis','Biologists are regulated in Alberta and British Columbia; other jurisdictions and environmental-science roles vary.','salary_method','Job Bank Environmental Biologist national median hourly wage CAD 40.00 earns 10/10.','employment_scope','The broader NOC employment total is not published as an Environmental Scientist-only count.'),'2026-08-09'),
  ('CA:agronomist','2025-11-19',null,40.00,0,0,0,0,8,10,0,0,2,20,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Agronomist is an official title within NOC 21112 Agricultural representatives, consultants and specialists.','shortage_note','COPS projects NOC 21112 to remain BALANCED nationally over 2024-2033.','visa_basis','NOC 21112 is not listed in a current Express Entry occupation category.','registration_basis','A bachelor or master degree is required and membership or eligibility for a provincial institute of agrology is usually required; Quebec membership is mandatory.','salary_method','Job Bank Agronomist national median hourly wage CAD 40.00 earns 10/10.','employment_scope','The broader NOC employment total is not published as an Agronomist-only count.'),'2026-08-09'),
  ('CA:farm-manager','2025-11-19',122400,30.00,0,0,0,0,10,6,0,0,4,20,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Farm Manager maps to NOC 80020 Managers in agriculture.','shortage_note','COPS projects NOC 80020 to remain BALANCED nationally over 2024-2033.','visa_basis','NOC 80020 is not listed in a current Express Entry occupation category.','registration_basis','No single national occupational licence; practical farm-management experience is central.','salary_method','Job Bank Farm Manager national median hourly wage CAD 30.00 earns 6/10.','employment_scope','Job Bank/COPS reports 122,400 workers in 2023 for NOC 80020.'),'2026-08-09'),
  ('CA:forestry-technician','2025-11-19',6200,32.97,0,0,0,0,10,6,0,0,3,19,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Forestry Technician maps directly to NOC 22112 Forestry technologists and technicians.','shortage_note','COPS projects NOC 22112 to remain BALANCED nationally over 2024-2033.','visa_basis','NOC 22112 is not listed in a current Express Entry occupation category.','registration_basis','Registration is required for forestry technologists or technicians in all provinces except Prince Edward Island and Manitoba; scaler licensing may also apply.','salary_method','Job Bank Forestry Technician national median hourly wage CAD 32.97 earns 6/10.','employment_scope','Job Bank/COPS reports 6,200 workers in 2023.'),'2026-08-09'),
  ('CA:food-technologist','2025-11-19',null,29.80,0,0,0,0,12,4,0,0,3,19,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Food Technologist is an official title within broader NOC 22100 Chemical technologists and technicians.','shortage_note','COPS projects NOC 22100 to remain BALANCED nationally over 2024-2033.','visa_basis','NOC 22100 is not listed in a current Express Entry occupation category.','registration_basis','National certification is available; the broader occupation is regulated in Alberta and Quebec and provincial technologist certification may be required by employers.','salary_method','Job Bank Food Technologist national median hourly wage CAD 29.80 earns 4/10.','employment_scope','The broader NOC employment total is not published as a Food Technologist-only count.'),'2026-08-09'),
  ('CA:sustainability-specialist','2025-11-19',null,43.27,0,0,0,0,10,10,0,0,5,25,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Sustainability Specialist is an official title within broader NOC 41400 Natural and applied science policy researchers, consultants and program officers.','shortage_note','COPS projects NOC 41400 to remain BALANCED nationally over 2024-2033.','visa_basis','NOC 41400 is not listed in a current Express Entry occupation category.','registration_basis','Job Bank does not treat Sustainability Specialist itself as a regulated occupation.','salary_method','Job Bank Sustainability Specialist national median hourly wage CAD 43.27 earns 10/10.','employment_scope','The broader NOC employment total is not published as a Sustainability Specialist-only count.'),'2026-08-09'),
  ('CA:horticulturist','2025-11-19',null,30.00,0,0,0,0,14,6,0,0,4,24,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Horticulturist is an official title within broader NOC 22114 Landscape and horticulture technicians and specialists.','shortage_note','COPS projects NOC 22114 to remain BALANCED nationally over 2024-2033.','visa_basis','NOC 22114 is not listed in a current Express Entry occupation category.','registration_basis','Landscape Horticulturist trade certification is available voluntarily and Red Seal endorsement is available; specific titles and pesticide work can be regulated provincially.','salary_method','Job Bank Horticulturist national median hourly wage CAD 30.00 earns 6/10.','employment_scope','The broader NOC employment total is not published as a Horticulturist-only count.'),'2026-08-09'),
  ('CA:animal-science-technician','2025-11-19',25800,23.00,15,0,0,0,12,2,0,10,3,42,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Animal Science Technician uses the canonical animal-health-technician alias and maps to NOC 32104 Animal health technologists and veterinary technicians.','shortage_note','COPS classifies NOC 32104 as MODERATE RISK OF SHORTAGE over 2024-2033, earning 15/20.','visa_basis','NOC 32104 is in the current Express Entry Healthcare and social services category, earning 10/10.','registration_basis','A two- or three-year animal health or veterinary technology program is required; registration is mandatory in some provinces and a national registration examination may apply.','salary_method','Job Bank Animal Health Technician national median hourly wage CAD 23.00 earns 2/10.','employment_scope','Job Bank/COPS reports 25,800 workers in 2023.'),'2026-08-09')
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
  ('CA:environmental-scientist','21110','Biologists and related scientists — environmental biologist science scope',null,false,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=21110&version=2021.0','2026-08-09'),
  ('CA:agronomist','21112','Agricultural representatives, consultants and specialists — Agronomist',null,false,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=21112&version=2021.0','2026-08-09'),
  ('CA:farm-manager','80020','Managers in agriculture — Farm Manager',null,false,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=80020&version=2021.0','2026-08-09'),
  ('CA:forestry-technician','22112','Forestry technologists and technicians',null,false,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=22112&version=2021.0','2026-08-09'),
  ('CA:food-technologist','22100','Chemical technologists and technicians — Food Technologist',null,false,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=22100&version=2021.0','2026-08-09'),
  ('CA:sustainability-specialist','41400','Natural and applied science policy researchers, consultants and program officers — Sustainability Specialist',null,false,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=41400&version=2021.0','2026-08-09'),
  ('CA:horticulturist','22114','Landscape and horticulture technicians and specialists — Horticulturist',null,false,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=22114&version=2021.0','2026-08-09'),
  ('CA:animal-science-technician','32104','Animal health technologists and veterinary technicians',null,true,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=32104&version=2021.0','2026-08-09')
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
  ('CA:environmental-scientist','job_search','Job Bank — Environmental Biologist in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/2637/ca','official_job_board',null,1,'2026-08-09'),
  ('CA:agronomist','job_search','Job Bank — Agronomist in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/15316/ca','official_job_board',null,1,'2026-08-09'),
  ('CA:farm-manager','job_search','Job Bank — Farm Manager in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/8785/ca','official_job_board',null,1,'2026-08-09'),
  ('CA:forestry-technician','job_search','Job Bank — Forestry Technician in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/17925/ca','official_job_board',null,1,'2026-08-09'),
  ('CA:food-technologist','job_search','Job Bank — Food Technologist in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/2942/ca','official_job_board',null,1,'2026-08-09'),
  ('CA:sustainability-specialist','job_search','Job Bank — Sustainability Specialist in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/296624/ca','official_job_board',null,1,'2026-08-09'),
  ('CA:horticulturist','job_search','Job Bank — Horticulturist in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/22558/ca','official_job_board',null,1,'2026-08-09'),
  ('CA:animal-science-technician','job_search','Job Bank — Animal Health Technician in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/4227/ca','official_job_board',null,1,'2026-08-09'),
  ('CA:environmental-scientist','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,2,'2026-08-09'),
  ('CA:agronomist','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,2,'2026-08-09'),
  ('CA:farm-manager','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,2,'2026-08-09'),
  ('CA:forestry-technician','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,2,'2026-08-09'),
  ('CA:food-technologist','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,2,'2026-08-09'),
  ('CA:sustainability-specialist','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,2,'2026-08-09'),
  ('CA:horticulturist','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,2,'2026-08-09'),
  ('CA:animal-science-technician','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,2,'2026-08-09')
on conflict (profile_key,link_type,url) do update set
  label=excluded.label,
  provider_type=excluded.provider_type,
  region_code=excluded.region_code,
  sort_order=excluded.sort_order,
  source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_program_links (profile_key,program_ref,relation_type,source_checked_at) values
  ('CA:environmental-scientist','ca-program:5867','related','2026-08-09'),
  ('CA:agronomist','ca-program:5492','related','2026-08-09'),
  ('CA:farm-manager','ca-program:5491','related','2026-08-09'),
  ('CA:forestry-technician','ca-program:2795','direct','2026-08-09'),
  ('CA:food-technologist','ca-program:98','direct','2026-08-09'),
  ('CA:sustainability-specialist','ca-program:206','related','2026-08-09'),
  ('CA:horticulturist','ca-program:2202','direct','2026-08-09'),
  ('CA:animal-science-technician','ca-program:1798','direct','2026-08-09'),
  ('CA:animal-science-technician','ca-program:2745','direct','2026-08-09')
on conflict (profile_key,program_ref) do update set
  relation_type=excluded.relation_type,
  source_checked_at=excluded.source_checked_at;
