-- Canada Education & Social occupation cohort: 8 canonical careers.
-- Current 2026 Express Entry: 41220, 41221 and 42202 are Education-category occupations;
-- 41300, 41301 and 42201 are Healthcare and social services-category occupations.

insert into public.country_occupation_profiles (
  profile_key,country_code,canonical_career_id,official_title,official_code_system,official_code_version,
  official_unit_group_code,currency,registration_required,registration_authority,registration_url,
  publication_status,source_checked_at,updated_at
) values
  ('CA:early-childhood-teacher','CA','early-childhood-teacher','Early childhood educators within Early childhood educators and assistants','NOC','2021 Version 1.0','42202','CAD',true,'Provincial and territorial early childhood education regulators','https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=42202&version=2021.0','profile_ready','2026-08-09',now()),
  ('CA:primary-school-teacher','CA','primary-school-teacher','Elementary school and kindergarten teachers','NOC','2021 Version 1.0','41221','CAD',true,'Provincial and territorial teacher certification authorities','https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=41221&version=2021.0','profile_ready','2026-08-09',now()),
  ('CA:secondary-school-teacher','CA','secondary-school-teacher','Secondary school teachers','NOC','2021 Version 1.0','41220','CAD',true,'Provincial and territorial teacher certification authorities','https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=41220&version=2021.0','profile_ready','2026-08-09',now()),
  ('CA:special-education-teacher','CA','special-education-teacher','School-based special education teachers (elementary and secondary)','NOC','2021 Version 1.0','41220/41221','CAD',true,'Provincial and territorial teacher certification authorities','https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=41221&version=2021.0','profile_ready','2026-08-09',now()),
  ('CA:social-worker','CA','social-worker','Social workers','NOC','2021 Version 1.0','41300','CAD',true,'Provincial and territorial social work regulatory bodies','https://www.casw-acts.ca/en/regulation-association-education/regulatory-bodies','profile_ready','2026-08-09',now()),
  ('CA:youth-worker','CA','youth-worker','Child and youth workers within Social and community service workers','NOC','2021 Version 1.0','42201','CAD',false,null,null,'profile_ready','2026-08-09',now()),
  ('CA:community-worker','CA','community-worker','Social and community service workers','NOC','2021 Version 1.0','42201','CAD',false,null,null,'profile_ready','2026-08-09',now()),
  ('CA:counsellor','CA','counsellor','Therapists in counselling and related specialized therapies','NOC','2021 Version 1.0','41301','CAD',true,'Provincial counselling and psychotherapy regulators where applicable','https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=41301&version=2021.0','profile_ready','2026-08-09',now())
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
  ('CA:early-childhood-teacher','2025-11-19',null,22.30,20,0,0,0,15,2,0,10,3,50,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Canonical Early Childhood Teacher uses the early childhood educator scope within broader NOC 42202 Early childhood educators and assistants.','shortage_note','Reviewed COPS evidence classifies NOC 42202 as STRONG RISK OF SHORTAGE over 2024-2033, earning 20/20.','visa_basis','NOC 42202 is in the current Express Entry Education occupations category, earning 10/10.','registration_basis','Early childhood educator licensing or certification is required or usually required across Canadian jurisdictions.','salary_method','Job Bank national median hourly wage CAD 22.30 earns 2/10.','employment_scope','The broader NOC also includes assistants, so no educator-only employment total is published.'),'2026-08-09'),
  ('CA:primary-school-teacher','2025-11-19',null,43.27,15,0,0,0,12,10,0,10,2,49,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Primary School Teacher maps to NOC 41221 Elementary school and kindergarten teachers.','shortage_note','Reviewed COPS evidence classifies NOC 41221 as MODERATE RISK OF SHORTAGE, earning 15/20.','visa_basis','NOC 41221 is in the current Express Entry Education occupations category.','registration_basis','A provincial teaching certificate is required.','salary_method','Job Bank national median hourly wage CAD 43.27 earns 10/10.'),'2026-08-09'),
  ('CA:secondary-school-teacher','2025-11-19',null,45.67,15,0,0,0,12,10,0,10,2,49,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Secondary School Teacher maps directly to NOC 41220 Secondary school teachers.','shortage_note','Reviewed COPS evidence classifies NOC 41220 as MODERATE RISK OF SHORTAGE, earning 15/20.','visa_basis','NOC 41220 is in the current Express Entry Education occupations category.','registration_basis','A provincial teaching certificate is required.','salary_method','Job Bank national median hourly wage CAD 45.67 earns 10/10.'),'2026-08-09'),
  ('CA:special-education-teacher','2025-11-19',null,null,15,0,0,0,10,0,0,10,1,36,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Canonical Special Education Teacher spans school-based titles in NOC 41220 and NOC 41221; NOC 42203 instructors of persons with disabilities is deliberately excluded.','shortage_note','Both school-teacher NOCs carry MODERATE RISK OF SHORTAGE, so 15/20 is retained without blending employment totals.','visa_basis','Both NOC 41220 and 41221 are in the current Express Entry Education occupations category.','registration_basis','Provincial teacher certification plus additional special-education training is required.','salary_method','No synthetic median wage is calculated across elementary and secondary teacher NOCs, so salary is unscored.'),'2026-08-09'),
  ('CA:social-worker','2025-11-19',null,38.46,20,0,0,0,12,8,0,10,2,52,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Social Worker maps directly to NOC 41300 Social workers.','shortage_note','Reviewed COPS evidence classifies NOC 41300 as STRONG RISK OF SHORTAGE, earning 20/20.','visa_basis','NOC 41300 is in the current Express Entry Healthcare and social services category.','registration_basis','Social-work title and practice regulation is provincial or territorial; registration is mandatory to practise in several jurisdictions.','salary_method','Job Bank national median hourly wage CAD 38.46 earns 8/10.'),'2026-08-09'),
  ('CA:youth-worker','2025-11-19',null,26.00,20,0,0,0,15,4,0,10,4,53,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Youth Worker uses child and youth worker titles within broader NOC 42201 Social and community service workers.','shortage_note','Reviewed COPS evidence classifies NOC 42201 as STRONG RISK OF SHORTAGE, earning 20/20.','visa_basis','NOC 42201 is in the current Express Entry Healthcare and social services category.','registration_basis','No single national Youth Worker licence; some social-service roles may have provincial membership requirements.','salary_method','Shared NOC 42201 Job Bank national median hourly wage CAD 26.00 earns 4/10.','employment_scope','No broader NOC employment total is presented as youth-worker-only.'),'2026-08-09'),
  ('CA:community-worker','2025-11-19',null,26.00,20,0,0,0,15,4,0,10,4,53,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Community Worker is represented by community-service titles within NOC 42201 Social and community service workers.','shortage_note','Reviewed COPS evidence classifies NOC 42201 as STRONG RISK OF SHORTAGE, earning 20/20.','visa_basis','NOC 42201 is in the current Express Entry Healthcare and social services category.','registration_basis','No single national Community Worker licence; requirements vary by role and province.','salary_method','Shared NOC 42201 Job Bank national median hourly wage CAD 26.00 earns 4/10.','employment_scope','No broader NOC employment total is presented as community-worker-only.'),'2026-08-09'),
  ('CA:counsellor','2025-11-19',null,34.00,15,0,0,0,10,6,0,10,2,43,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Canonical Counsellor uses counselling-therapy titles within NOC 41301 Therapists in counselling and related specialized therapies, not career-counsellor NOC 41321.','shortage_note','Reviewed COPS evidence classifies NOC 41301 as MODERATE RISK OF SHORTAGE, earning 15/20.','visa_basis','NOC 41301 is in the current Express Entry Healthcare and social services category.','registration_basis','Counselling and psychotherapy regulation varies by jurisdiction; regulated registration applies in specified provinces and for specified psychotherapy activities.','salary_method','Job Bank registered clinical counsellor national median hourly wage CAD 34.00 earns 6/10.'),'2026-08-09')
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
  ('CA:early-childhood-teacher','42202','Early childhood educators and assistants — educator scope',null,true,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=42202&version=2021.0','2026-08-09'),
  ('CA:primary-school-teacher','41221','Elementary school and kindergarten teachers',null,true,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=41221&version=2021.0','2026-08-09'),
  ('CA:secondary-school-teacher','41220','Secondary school teachers',null,true,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=41220&version=2021.0','2026-08-09'),
  ('CA:special-education-teacher','41220','Secondary school teachers — special education teacher title',null,true,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=41220&version=2021.0','2026-08-09'),
  ('CA:special-education-teacher','41221','Elementary school and kindergarten teachers — special education teacher title',null,true,true,2,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=41221&version=2021.0','2026-08-09'),
  ('CA:social-worker','41300','Social workers',null,true,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=41300&version=2021.0','2026-08-09'),
  ('CA:youth-worker','42201','Social and community service workers — child and youth worker title',null,true,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=42201&version=2021.0','2026-08-09'),
  ('CA:community-worker','42201','Social and community service workers — community worker scope',null,true,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=42201&version=2021.0','2026-08-09'),
  ('CA:counsellor','41301','Therapists in counselling and related specialized therapies',null,true,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=41301&version=2021.0','2026-08-09')
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
  ('CA:early-childhood-teacher','job_search','Job Bank — Early Childhood Educator in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/5189/ca','official_job_board',null,1,'2026-08-09'),
  ('CA:primary-school-teacher','job_search','Job Bank — Primary School Teacher in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/4714/ca','official_job_board',null,1,'2026-08-09'),
  ('CA:secondary-school-teacher','job_search','Job Bank — Secondary School Teacher in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/15904/ca','official_job_board',null,1,'2026-08-09'),
  ('CA:special-education-teacher','job_search','Job Bank — Special Education Teacher - Primary School in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/2217/ca','official_job_board',null,1,'2026-08-09'),
  ('CA:social-worker','job_search','Job Bank — Social Worker in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/23025/ca','official_job_board',null,1,'2026-08-09'),
  ('CA:youth-worker','job_search','Job Bank — Youth Worker in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/5097/ca','official_job_board',null,1,'2026-08-09'),
  ('CA:community-worker','job_search','Job Bank — Community and Social Services Worker in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/5112/ca','official_job_board',null,1,'2026-08-09'),
  ('CA:counsellor','job_search','Job Bank — Registered Clinical Counsellor in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/2271/ca','official_job_board',null,1,'2026-08-09'),
  ('CA:social-worker','source','CASW — Social work regulatory bodies','https://www.casw-acts.ca/en/regulation-association-education/regulatory-bodies','official_professional_body',null,1,'2026-08-09'),
  ('CA:early-childhood-teacher','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,2,'2026-08-09'),
  ('CA:primary-school-teacher','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,2,'2026-08-09'),
  ('CA:secondary-school-teacher','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,2,'2026-08-09'),
  ('CA:special-education-teacher','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,2,'2026-08-09'),
  ('CA:social-worker','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,2,'2026-08-09'),
  ('CA:youth-worker','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,2,'2026-08-09'),
  ('CA:community-worker','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,2,'2026-08-09'),
  ('CA:counsellor','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,2,'2026-08-09')
on conflict (profile_key,link_type,url) do update set
  label=excluded.label,
  provider_type=excluded.provider_type,
  sort_order=excluded.sort_order,
  source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_program_links (profile_key,program_ref,relation_type,source_checked_at) values
  ('CA:early-childhood-teacher','ca-program:1178','direct','2026-08-09'),
  ('CA:early-childhood-teacher','ca-program:1413','direct','2026-08-09'),
  ('CA:primary-school-teacher','ca-program:6581','direct','2026-08-09'),
  ('CA:secondary-school-teacher','ca-program:6536','direct','2026-08-09'),
  ('CA:special-education-teacher','ca-program:5925','related','2026-08-09'),
  ('CA:social-worker','ca-program:4084','related','2026-08-09'),
  ('CA:youth-worker','ca-program:2080','direct','2026-08-09'),
  ('CA:youth-worker','ca-program:2084','direct','2026-08-09'),
  ('CA:community-worker','ca-program:1293','direct','2026-08-09'),
  ('CA:community-worker','ca-program:1545','direct','2026-08-09'),
  ('CA:counsellor','ca-program:4397','direct','2026-08-09')
on conflict (profile_key,program_ref) do update set
  relation_type=excluded.relation_type,
  source_checked_at=excluded.source_checked_at;
