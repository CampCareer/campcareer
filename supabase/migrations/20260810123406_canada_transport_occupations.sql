-- Canada Transport occupation cohort: final 8 canonical careers.
-- Current 2026 Express Entry Transport category includes NOC 72404, 72600 and 72410 from this cohort.
-- COPS 2024-2033: 72600 strong shortage; 73300, 72404 and 72410 moderate shortage; 13201, 72602, 72603 and 70012 balance.

insert into public.country_occupation_profiles (
  profile_key,country_code,canonical_career_id,official_title,official_code_system,official_code_version,
  official_unit_group_code,currency,registration_required,registration_authority,registration_url,
  publication_status,source_checked_at,updated_at
) values
  ('CA:truck-driver','CA','truck-driver','Transport truck drivers','NOC','2021 Version 1.0','73300','CAD',true,'Provincial and territorial commercial driver licensing authorities','https://www.jobbank.gc.ca/marketreport/requirements/296484/ca','profile_ready','2026-08-10',now()),
  ('CA:logistics-coordinator','CA','logistics-coordinator','Production and transportation logistics coordinators','NOC','2021 Version 1.0','13201','CAD',false,null,'https://www.jobbank.gc.ca/marketreport/requirements/296538/ca','profile_ready','2026-08-10',now()),
  ('CA:aircraft-maintenance-technician','CA','aircraft-maintenance-technician','Aircraft mechanics and aircraft inspectors — Aircraft Maintenance Technician','NOC','2021 Version 1.0','72404','CAD',true,'Transport Canada — AME licensing for certifying maintenance','https://tc.canada.ca/en/aviation/licensing-aircraft-maintenance-engineers-ames/obtaining-aircraft-maintenance-engineer-ame-licence','profile_ready','2026-08-10',now()),
  ('CA:commercial-pilot','CA','commercial-pilot','Air pilots, flight engineers and flying instructors — Commercial Pilot','NOC','2021 Version 1.0','72600','CAD',true,'Transport Canada','https://www.jobbank.gc.ca/marketreport/requirements/18144/ca','profile_ready','2026-08-10',now()),
  ('CA:marine-engineer','CA','marine-engineer','Engineer officers, water transport','NOC','2021 Version 1.0','72603','CAD',true,'Transport Canada','https://www.jobbank.gc.ca/marketreport/requirements/3702/ca','profile_ready','2026-08-10',now()),
  ('CA:deck-officer','CA','deck-officer','Deck officers, water transport','NOC','2021 Version 1.0','72602','CAD',true,'Transport Canada','https://www.jobbank.gc.ca/marketreport/requirements/3660/ca','profile_ready','2026-08-10',now()),
  ('CA:warehouse-manager','CA','warehouse-manager','Facility operation and maintenance managers — Warehouse Manager','NOC','2021 Version 1.0','70012','CAD',false,null,'https://www.jobbank.gc.ca/marketreport/requirements/24357/ca','profile_ready','2026-08-10',now()),
  ('CA:automotive-service-technician','CA','automotive-service-technician','Automotive service technicians, truck and bus mechanics and mechanical repairers — Automotive Service Technician','NOC','2021 Version 1.0','72410','CAD',true,'Provincial and territorial apprenticeship and trade certification authorities','https://www.jobbank.gc.ca/marketreport/requirements/14799/ca','profile_ready','2026-08-10',now())
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
  ('CA:truck-driver','2025-11-19',null,26.42,15,0,0,0,15,4,0,0,2,36,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Truck Driver maps directly to NOC 73300 Transport truck drivers.','shortage_note','COPS classifies NOC 73300 as MODERATE RISK OF SHORTAGE over 2024-2033, earning 15/20.','visa_basis','NOC 73300 is not listed in the current Express Entry Transport occupations category.','registration_basis','Commercial vehicle licence class and endorsements are regulated provincially and territorially.','salary_method','Job Bank national median hourly wage CAD 26.42 earns 4/10.','program_gap','The reviewed Commercial Driver programme is not currently available to international students, so no public programme link is added.'),'2026-08-10'),
  ('CA:logistics-coordinator','2025-11-19',null,29.49,0,0,0,0,15,4,0,0,5,24,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Logistics Coordinator maps directly to NOC 13201 Production and transportation logistics coordinators.','shortage_note','COPS projects NOC 13201 to remain BALANCED nationally over 2024-2033.','visa_basis','NOC 13201 is not listed in a current Express Entry occupation category.','registration_basis','Job Bank records Logistics Coordinator as not regulated in Canada.','salary_method','Job Bank national median hourly wage CAD 29.49 earns 4/10.','program_basis','Reviewed supply-chain common-pathway programmes are published as related rather than direct.'),'2026-08-10'),
  ('CA:aircraft-maintenance-technician','2025-11-19',null,39.00,15,0,0,0,13,8,0,10,2,48,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Aircraft Maintenance Technician is represented within NOC 72404 Aircraft mechanics and aircraft inspectors.','shortage_note','COPS classifies NOC 72404 as MODERATE RISK OF SHORTAGE over 2024-2033, earning 15/20.','visa_basis','NOC 72404 is in the current Express Entry Transport occupations category, earning 10/10.','registration_basis','Transport Canada AME licensing is required to sign maintenance releases and certify airworthiness.','salary_method','Job Bank national median hourly wage CAD 39.00 earns 8/10.','entry_level_basis','Aircraft-maintenance college or apprenticeship training plus substantial on-the-job training is normally required.'),'2026-08-10'),
  ('CA:commercial-pilot','2025-11-19',null,52.00,20,0,0,0,8,10,0,10,1,49,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Commercial Pilot is represented within NOC 72600 Air pilots, flight engineers and flying instructors.','shortage_note','COPS classifies NOC 72600 as STRONG RISK OF SHORTAGE over 2024-2033, earning 20/20.','visa_basis','NOC 72600 is in the current Express Entry Transport occupations category, earning 10/10.','registration_basis','Commercial flying requires Transport Canada pilot licensing and applicable ratings or endorsements.','salary_method','Job Bank national median hourly wage CAD 52.00 earns 10/10.','entry_level_basis','Commercial licensing requires certified flight training and more than 200 flight hours; ATPL requires more than 1,500 hours.'),'2026-08-10'),
  ('CA:marine-engineer','2025-11-19',null,37.00,0,0,0,0,8,8,0,0,1,17,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Marine Engineer maps to NOC 72603 Engineer officers, water transport.','shortage_note','COPS projects NOC 72603 to remain BALANCED nationally over 2024-2033.','visa_basis','NOC 72603 is not listed in the current Express Entry Transport occupations category.','registration_basis','Officer duties require a Transport Canada marine engineer certificate of competency.','salary_method','Job Bank national median hourly wage CAD 37.00 earns 8/10.','program_gap','Reviewed direct marine-engineering programmes do not currently clear the public international-programme publication gate.'),'2026-08-10'),
  ('CA:deck-officer','2025-11-19',null,41.36,0,0,0,0,10,10,0,0,1,21,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Deck Officer maps directly to NOC 72602 Deck officers, water transport.','shortage_note','COPS projects NOC 72602 to remain BALANCED nationally over 2024-2033.','visa_basis','NOC 72602 is not listed in the current Express Entry Transport occupations category.','registration_basis','Officer duties require a Transport Canada deck officer certificate of competency.','salary_method','Job Bank national median hourly wage CAD 41.36 earns 10/10.','program_gap','Reviewed marine-navigation programmes are not currently in the public Canada programme set.'),'2026-08-10'),
  ('CA:warehouse-manager','2025-11-19',null,45.20,0,0,0,0,3,10,0,0,5,18,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Warehouse Manager is represented through the warehouse facility-operation scope within broader NOC 70012 Facility operation and maintenance managers.','shortage_note','COPS projects NOC 70012 to remain BALANCED nationally over 2024-2033.','visa_basis','NOC 70012 is not listed in a current Express Entry occupation category.','registration_basis','Job Bank records Warehouse Manager as not regulated in Canada.','salary_method','Job Bank Warehouse Manager national median hourly wage CAD 45.20 earns 10/10.','entry_level_basis','Relevant post-secondary study or equivalent experience plus several years of supervisory experience are normally required, so entry credit is low.'),'2026-08-10'),
  ('CA:automotive-service-technician','2025-11-19',null,29.89,15,0,0,0,15,4,0,10,2,46,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Automotive Service Technician is represented within NOC 72410 Automotive service technicians, truck and bus mechanics and mechanical repairers.','shortage_note','COPS classifies NOC 72410 as MODERATE RISK OF SHORTAGE over 2024-2033, earning 15/20.','visa_basis','NOC 72410 is in the current Express Entry Transport occupations category, earning 10/10.','registration_basis','Automotive Service Technician trade certification is compulsory in five provinces and voluntary elsewhere; Red Seal endorsement is available.','salary_method','Job Bank national median hourly wage CAD 29.89 earns 4/10.','program_caveat','The selected RRC Automotive Technician diploma is publicly available to international students but currently PGWP-ineligible.'),'2026-08-10')
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
  ('CA:truck-driver','73300','Transport truck drivers',null,false,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=73300&version=2021.0','2026-08-10'),
  ('CA:logistics-coordinator','13201','Production and transportation logistics coordinators',null,false,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=13201&version=2021.0','2026-08-10'),
  ('CA:aircraft-maintenance-technician','72404','Aircraft mechanics and aircraft inspectors',null,true,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=72404&version=2021.0','2026-08-10'),
  ('CA:commercial-pilot','72600','Air pilots, flight engineers and flying instructors',null,true,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=72600&version=2021.0','2026-08-10'),
  ('CA:marine-engineer','72603','Engineer officers, water transport',null,false,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=72603&version=2021.0','2026-08-10'),
  ('CA:deck-officer','72602','Deck officers, water transport',null,false,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=72602&version=2021.0','2026-08-10'),
  ('CA:warehouse-manager','70012','Facility operation and maintenance managers — Warehouse Manager',null,false,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=70012&version=2021.0','2026-08-10'),
  ('CA:automotive-service-technician','72410','Automotive service technicians, truck and bus mechanics and mechanical repairers',null,true,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=72410&version=2021.0','2026-08-10')
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
  ('CA:truck-driver','job_search','Job Bank — Transport Truck Driver in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/296484/ca','official_job_board',null,1,'2026-08-10'),
  ('CA:logistics-coordinator','job_search','Job Bank — Logistics Coordinator in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/296538/ca','official_job_board',null,1,'2026-08-10'),
  ('CA:aircraft-maintenance-technician','job_search','Job Bank — Aircraft Maintenance Technician in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/7562/ca','official_job_board',null,1,'2026-08-10'),
  ('CA:commercial-pilot','job_search','Job Bank — Commercial Airline Pilot in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/18144/ca','official_job_board',null,1,'2026-08-10'),
  ('CA:marine-engineer','job_search','Job Bank — Marine Engineer Officer in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/3702/ca','official_job_board',null,1,'2026-08-10'),
  ('CA:deck-officer','job_search','Job Bank — Deck Officer in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/3660/ca','official_job_board',null,1,'2026-08-10'),
  ('CA:warehouse-manager','job_search','Job Bank — Warehouse Manager in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/24357/ca','official_job_board',null,1,'2026-08-10'),
  ('CA:automotive-service-technician','job_search','Job Bank — Automotive Service Technician in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/14799/ca','official_job_board',null,1,'2026-08-10')
on conflict (profile_key,link_type,url) do update set
  label=excluded.label,
  provider_type=excluded.provider_type,
  region_code=excluded.region_code,
  sort_order=excluded.sort_order,
  source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_program_links (profile_key,program_ref,relation_type,source_checked_at) values
  ('CA:logistics-coordinator','ca-program:256','related','2026-08-10'),
  ('CA:logistics-coordinator','ca-program:3525','related','2026-08-10'),
  ('CA:aircraft-maintenance-technician','ca-program:2011','direct','2026-08-10'),
  ('CA:aircraft-maintenance-technician','ca-program:3429','direct','2026-08-10'),
  ('CA:commercial-pilot','ca-program:2909','direct','2026-08-10'),
  ('CA:commercial-pilot','ca-program:4092','direct','2026-08-10'),
  ('CA:warehouse-manager','ca-program:256','related','2026-08-10'),
  ('CA:warehouse-manager','ca-program:3525','related','2026-08-10'),
  ('CA:automotive-service-technician','ca-program:3443','direct','2026-08-10')
on conflict (profile_key,program_ref) do update set
  relation_type=excluded.relation_type,
  source_checked_at=excluded.source_checked_at;
