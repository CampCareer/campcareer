-- United Kingdom health occupation cohort: 8 canonical careers.
-- SOC 2020 mappings, Health and Care Worker visa access, statutory registration,
-- NHS/Skills for Care workforce evidence and verified UK programme pathways checked 2026-08-10.

insert into public.country_occupation_profiles (
  profile_key,country_code,canonical_career_id,official_title,official_code_system,official_code_version,
  official_unit_group_code,currency,registration_required,registration_authority,registration_url,
  publication_status,source_checked_at,updated_at
) values
  ('UK:registered-nurse','UK','registered-nurse','Registered nursing professionals — registered nurse roll-up excluding midwifery','SOC','SOC 2020','2232-2237','GBP',true,'Nursing and Midwifery Council','https://www.nmc.org.uk/registration/joining-the-register/','profile_ready','2026-08-10',now()),
  ('UK:midwife','UK','midwife','Midwifery nurses','SOC','SOC 2020','2231','GBP',true,'Nursing and Midwifery Council','https://www.nmc.org.uk/registration/joining-the-register/','profile_ready','2026-08-10',now()),
  ('UK:care-worker','UK','care-worker','Care workers and home carers','SOC','SOC 2020','6135','GBP',false,null,null,'profile_ready','2026-08-10',now()),
  ('UK:physiotherapist','UK','physiotherapist','Physiotherapists','SOC','SOC 2020','2221','GBP',true,'Health and Care Professions Council','https://www.hcpc-uk.org/registration/getting-on-the-register/international-applications/','profile_ready','2026-08-10',now()),
  ('UK:medical-laboratory-technician','UK','medical-laboratory-technician','Laboratory technicians — medical laboratory technician scope','SOC','SOC 2020','3111','GBP',false,null,null,'profile_ready','2026-08-10',now()),
  ('UK:radiographer','UK','radiographer','Medical radiographers','SOC','SOC 2020','2254','GBP',true,'Health and Care Professions Council','https://www.hcpc-uk.org/registration/getting-on-the-register/international-applications/','profile_ready','2026-08-10',now()),
  ('UK:pharmacist','UK','pharmacist','Pharmacists','SOC','SOC 2020','2251','GBP',true,'General Pharmaceutical Council (Great Britain) / Pharmaceutical Society of Northern Ireland','https://www.pharmacyregulation.org/students-and-trainees/pharmacist-education-and-training/courses-and-qualifications-pharmacists','profile_ready','2026-08-10',now()),
  ('UK:occupational-therapist','UK','occupational-therapist','Occupational therapists','SOC','SOC 2020','2222','GBP',true,'Health and Care Professions Council','https://www.hcpc-uk.org/registration/getting-on-the-register/international-applications/','profile_ready','2026-08-10',now())
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
  profile_key,as_of_date,employment_total,median_hourly_earnings,annualised_median_salary,
  shortage_component,vacancy_intensity_component,employer_diversity_component,vacancy_trend_component,
  entry_level_component,salary_component,growth_component,visa_component,entry_burden_component,
  opportunity_score,score_methodology_version,score_status,score_evidence,source_checked_at
) values
  ('UK:registered-nurse','2026-08-10',null,null,null,20,0,0,0,10,0,0,10,1,41,'career-opportunity-uk-v1','provisional',
    jsonb_build_object('classification_scope','Registered Nurse is a canonical roll-up of SOC 2232 Community nurses, 2233 Specialist nurses, 2234 Nurse practitioners, 2235 Mental health nurses, 2236 Children''s nurses and 2237 Other nursing professionals. SOC 2231 Midwifery nurses is excluded.','shortage_note','NHS England projects major nursing workforce gaps, including at least 37,000 FTE community-nurse shortfall and more than 17,000 FTE combined mental-health and learning-disability nursing shortfall by 2036/37; maximum 20/20 shortage credit.','visa_basis','SOC 2232-2237 are explicitly eligible Health and Care Worker occupations; 10/10 visa credit.','salary_method','The component is left at zero because the six SOC groups have materially different ONS ASHE medians and no defensible weighted roll-up is currently stored.','entry_basis','NMC-approved degree and Registered Nurse degree-apprenticeship routes provide structured entry, but this is a degree-level regulated profession.','entry_burden_basis','NMC registration is mandatory and internationally trained applicants may need qualification, English and Test of Competence evidence.'),'2026-08-10'),
  ('UK:midwife','2026-08-10',null,null,39327,5,0,0,0,8,6,0,10,1,30,'career-opportunity-uk-v1','provisional',
    jsonb_build_object('classification_scope','Canonical Midwife maps directly to SOC 2231 Midwifery nurses.','shortage_note','NHS workforce planning supports expanded nursing and midwifery training, but the reviewed evidence is less occupation-specific than for nursing subfields; conservative 5/20.','visa_basis','SOC 2231 is explicitly eligible for the Health and Care Worker visa; 10/10.','salary_method','ONS ASHE 2025 provisional national median salary is GBP 39,327; UK v1 salary band 6/10.','entry_basis','The NMC-regulated Skills England Midwife integrated degree apprenticeship is Level 6 and typically 48 months.','entry_burden_basis','NMC registration is mandatory and the protected title requires an approved registration route.'),'2026-08-10'),
  ('UK:care-worker','2026-08-10',null,null,21487,20,0,0,0,15,0,0,3,5,43,'career-opportunity-uk-v1','provisional',
    jsonb_build_object('classification_scope','Canonical Care Worker maps to SOC 6135 Care workers and home carers.','shortage_note','Skills for Care reports a 6.2% vacancy rate in England adult social care in 2025/26, around 96,000 vacancies and roughly three times the wider-economy rate; 20/20.','visa_basis','From 22 July 2025 new overseas Health and Care Worker applications for care workers closed. Limited in-country/transitional routes remain, so visa credit is reduced to 3/10.','salary_method','ONS ASHE 2025 provisional national median salary is GBP 21,487; UK v1 salary component 0/10.','entry_basis','Skills England Level 2 Adult Care Worker apprenticeship provides a highly accessible structured route; 15/15.','entry_burden_basis','There is no single UK-wide statutory professional register for the generic care-worker occupation; 5/5 entry-burden accessibility credit.'),'2026-08-10'),
  ('UK:physiotherapist','2026-08-10',null,null,37917,0,0,0,0,8,6,0,10,1,25,'career-opportunity-uk-v1','provisional',
    jsonb_build_object('classification_scope','Canonical Physiotherapist maps directly to SOC 2221.','shortage_note','NHS England expands AHP training but does not identify physiotherapy among the greatest projected AHP shortfalls in the reviewed plan; no direct shortage credit.','visa_basis','SOC 2221 is explicitly eligible for the Health and Care Worker visa; 10/10.','salary_method','ONS ASHE 2025 provisional national median salary is GBP 37,917; UK v1 salary band 6/10.','entry_basis','HCPC-approved degree routes and the Level 6 Physiotherapist apprenticeship provide structured entry, typically requiring degree-level study.','entry_burden_basis','HCPC registration is mandatory to use the protected title Physiotherapist; 1/5 accessibility credit.'),'2026-08-10'),
  ('UK:medical-laboratory-technician','2026-08-10',77000,null,26861,0,0,0,0,12,2,0,10,4,28,'career-opportunity-uk-v1','provisional',
    jsonb_build_object('classification_scope','Canonical Medical Laboratory Technician is constrained to technician work within SOC 3111 Laboratory technicians and does not represent the separately regulated Biomedical Scientist profession.','shortage_note','MAC Temporary Shortage List Stage 2 reports 77,000 employees in 2025, limited historical and future shortage evidence and recommends no future TSL access; 0/20.','visa_basis','SOC 3111 remains eligible for the Health and Care Worker visa and current TSL; current access earns 10/10. The ISL concession is narrower and requires at least three years related experience.','salary_method','ONS ASHE 2025 provisional national median salary is GBP 26,861; UK v1 salary band 2/10.','entry_basis','Skills England Level 3 Laboratory Technician apprenticeship is an approved structured technician route; 12/15.','entry_burden_basis','The generic Laboratory Technician occupation is not an HCPC-regulated profession; 4/5 accessibility credit.'),'2026-08-10'),
  ('UK:radiographer','2026-08-10',null,null,44324,15,0,0,0,8,10,0,10,1,44,'career-opportunity-uk-v1','provisional',
    jsonb_build_object('classification_scope','Canonical Radiographer maps directly to SOC 2254 Medical radiographers and covers diagnostic and therapeutic radiography.','shortage_note','NHS England identifies diagnostic radiographers among the AHP professions with the greatest projected shortfalls and calls for expansion in diagnostic and therapeutic radiography training; 15/20.','visa_basis','SOC 2254 is explicitly eligible for the Health and Care Worker visa; 10/10.','salary_method','ONS ASHE 2025 provisional national median salary is GBP 44,324; UK v1 salary band 10/10.','entry_basis','Skills England Level 6 Diagnostic and Therapeutic Radiographer apprenticeships provide regulated degree-level entry routes.','entry_burden_basis','HCPC registration is mandatory for protected radiographer titles; 1/5 accessibility credit.'),'2026-08-10'),
  ('UK:pharmacist','2026-08-10',null,null,47508,10,0,0,0,6,10,0,10,1,37,'career-opportunity-uk-v1','provisional',
    jsonb_build_object('classification_scope','Canonical Pharmacist maps directly to SOC 2251.','shortage_note','NHS England estimates pharmacist education intake needs to grow by 31-55% and targets nearly 50% expansion by 2031/32; conservative workforce-shortfall credit 10/20 rather than treating training need as current list-based shortage.','visa_basis','SOC 2251 is explicitly eligible for the Health and Care Worker visa; 10/10.','salary_method','ONS ASHE 2025 provisional national median salary is GBP 47,508; UK v1 salary band 10/10.','entry_basis','The standard Great Britain route begins with a GPhC-accredited MPharm, usually four years, followed by foundation training and registration requirements; 6/15.','entry_burden_basis','Statutory pharmacist registration applies through GPhC in Great Britain or PSNI in Northern Ireland; 1/5 accessibility credit.'),'2026-08-10'),
  ('UK:occupational-therapist','2026-08-10',null,null,37201,15,0,0,0,8,6,0,10,1,40,'career-opportunity-uk-v1','provisional',
    jsonb_build_object('classification_scope','Canonical Occupational Therapist maps directly to SOC 2222.','shortage_note','NHS England identifies occupational therapists among the allied-health professions with the greatest projected workforce shortfalls; 15/20.','visa_basis','SOC 2222 is explicitly eligible for the Health and Care Worker visa; 10/10.','salary_method','ONS ASHE 2025 provisional national median salary is GBP 37,201; UK v1 salary band 6/10.','entry_basis','HCPC-approved degree routes and the Level 6 Occupational Therapist apprenticeship provide structured entry.','entry_burden_basis','HCPC registration is mandatory to use the protected Occupational Therapist title; 1/5 accessibility credit.'),'2026-08-10')
on conflict (profile_key,as_of_date) do update set
  employment_total=excluded.employment_total,
  median_hourly_earnings=excluded.median_hourly_earnings,
  annualised_median_salary=excluded.annualised_median_salary,
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
  ('UK:registered-nurse','2232','Registered community nurses',null,true,true,1,'https://www.gov.uk/health-care-worker-visa/your-job','2026-08-10'),
  ('UK:registered-nurse','2233','Registered specialist nurses',null,true,true,2,'https://www.gov.uk/health-care-worker-visa/your-job','2026-08-10'),
  ('UK:registered-nurse','2234','Registered nurse practitioners',null,true,true,3,'https://www.gov.uk/health-care-worker-visa/your-job','2026-08-10'),
  ('UK:registered-nurse','2235','Registered mental health nurses',null,true,true,4,'https://www.gov.uk/health-care-worker-visa/your-job','2026-08-10'),
  ('UK:registered-nurse','2236','Registered children''s nurses',null,true,true,5,'https://www.gov.uk/health-care-worker-visa/your-job','2026-08-10'),
  ('UK:registered-nurse','2237','Other registered nursing professionals',null,true,true,6,'https://www.gov.uk/health-care-worker-visa/your-job','2026-08-10'),
  ('UK:midwife','2231','Midwifery nurses',null,true,true,1,'https://www.gov.uk/health-care-worker-visa/your-job','2026-08-10'),
  ('UK:care-worker','6135','Care workers and home carers',null,true,true,1,'https://www.gov.uk/health-care-worker-visa/your-job','2026-08-10'),
  ('UK:physiotherapist','2221','Physiotherapists',null,true,true,1,'https://www.gov.uk/health-care-worker-visa/your-job','2026-08-10'),
  ('UK:medical-laboratory-technician','3111','Laboratory technicians — medical laboratory technician scope',null,true,true,1,'https://www.gov.uk/health-care-worker-visa/your-job','2026-08-10'),
  ('UK:radiographer','2254','Medical radiographers',null,true,true,1,'https://www.gov.uk/health-care-worker-visa/your-job','2026-08-10'),
  ('UK:pharmacist','2251','Pharmacists',null,true,true,1,'https://www.gov.uk/health-care-worker-visa/your-job','2026-08-10'),
  ('UK:occupational-therapist','2222','Occupational therapists',null,true,true,1,'https://www.gov.uk/health-care-worker-visa/your-job','2026-08-10')
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
  ('UK:registered-nurse','entry_program','Skills England — Registered Nurse degree apprenticeship','https://skillsengland.education.gov.uk/apprenticeship-standards/st0781','official_training',null,1,'2026-08-10'),
  ('UK:registered-nurse','source','NMC — Joining the register','https://www.nmc.org.uk/registration/joining-the-register/','official_regulator',null,2,'2026-08-10'),
  ('UK:registered-nurse','source','Home Office — Health and Care Worker eligible jobs','https://www.gov.uk/health-care-worker-visa/your-job','official_immigration',null,3,'2026-08-10'),
  ('UK:registered-nurse','source','NHS England — Long Term Workforce Plan','https://www.england.nhs.uk/long-read/nhs-long-term-workforce-plan-2/','official_workforce',null,4,'2026-08-10'),
  ('UK:midwife','entry_program','Skills England — Midwife integrated degree apprenticeship','https://skillsengland.education.gov.uk/apprenticeships/st0948-v2-0','official_training',null,1,'2026-08-10'),
  ('UK:midwife','entry_program','City St George''s — Midwifery','https://www.citystgeorges.ac.uk/prospective-students/courses/undergraduate/midwifery','university_program',null,2,'2026-08-10'),
  ('UK:midwife','source','NMC — Joining the register','https://www.nmc.org.uk/registration/joining-the-register/','official_regulator',null,3,'2026-08-10'),
  ('UK:midwife','source','Home Office — Health and Care Worker eligible jobs','https://www.gov.uk/health-care-worker-visa/your-job','official_immigration',null,4,'2026-08-10'),
  ('UK:midwife','source','NHS England — Long Term Workforce Plan','https://www.england.nhs.uk/long-read/nhs-long-term-workforce-plan-2/','official_workforce',null,5,'2026-08-10'),
  ('UK:care-worker','entry_program','Skills England — Adult Care Worker apprenticeship','https://skillsengland.education.gov.uk/apprenticeships/st0005','official_training',null,1,'2026-08-10'),
  ('UK:care-worker','source','GOV.UK — Overseas health and social care recruitment guidance','https://www.gov.uk/government/publications/applying-for-health-and-social-care-jobs-in-the-uk-from-abroad/part-1-applying-for-health-and-social-care-jobs-in-the-uk-from-abroad','official_immigration',null,2,'2026-08-10'),
  ('UK:care-worker','source','Home Office — Health and Care Worker eligible jobs','https://www.gov.uk/health-care-worker-visa/your-job','official_immigration',null,3,'2026-08-10'),
  ('UK:care-worker','source','Skills for Care — 2025/26 workforce vacancy update','https://www.skillsforcare.org.uk/news-and-events/news/adult-social-care-vacancy-rate-falls-to-lowest-level-in-a-decade-as-workforce-grows','official_workforce',null,4,'2026-08-10'),
  ('UK:physiotherapist','entry_program','Skills England — Physiotherapist apprenticeship','https://skillsengland.education.gov.uk/apprenticeships/st0519','official_training',null,1,'2026-08-10'),
  ('UK:physiotherapist','entry_program','Brunel University London — Physiotherapy','https://www.brunel.ac.uk/study/courses/physiotherapy-bsc','university_program',null,2,'2026-08-10'),
  ('UK:physiotherapist','source','HCPC — International applications','https://www.hcpc-uk.org/registration/getting-on-the-register/international-applications/','official_regulator',null,3,'2026-08-10'),
  ('UK:physiotherapist','source','Home Office — Health and Care Worker eligible jobs','https://www.gov.uk/health-care-worker-visa/your-job','official_immigration',null,4,'2026-08-10'),
  ('UK:medical-laboratory-technician','entry_program','Skills England — Laboratory Technician apprenticeship','https://skillsengland.education.gov.uk/apprenticeships/st0248','official_training',null,1,'2026-08-10'),
  ('UK:medical-laboratory-technician','source','Home Office — Health and Care Worker eligible jobs','https://www.gov.uk/health-care-worker-visa/your-job','official_immigration',null,2,'2026-08-10'),
  ('UK:medical-laboratory-technician','source','Home Office — Immigration Salary List','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-immigration-salary-list','official_immigration',null,3,'2026-08-10'),
  ('UK:medical-laboratory-technician','source','MAC — Temporary Shortage List Stage 2','https://www.gov.uk/government/publications/temporary-shortage-list-stage-2-report/temporary-shortage-list-stage-2-report-accessible','official_shortage',null,4,'2026-08-10'),
  ('UK:radiographer','entry_program','Skills England — Diagnostic Radiographer apprenticeship','https://skillsengland.education.gov.uk/apprenticeships/st0619-v2-0','official_training',null,1,'2026-08-10'),
  ('UK:radiographer','entry_program','Skills England — Therapeutic Radiographer apprenticeship','https://skillsengland.education.gov.uk/apprenticeships/st0620-v2-0','official_training',null,2,'2026-08-10'),
  ('UK:radiographer','entry_program','City St George''s — Therapeutic Radiography and Oncology','https://www.citystgeorges.ac.uk/prospective-students/courses/undergraduate/therapeutic-radiography','university_program',null,3,'2026-08-10'),
  ('UK:radiographer','entry_program','City St George''s — Diagnostic Radiography','https://www.citystgeorges.ac.uk/prospective-students/courses/undergraduate/radiography-diagnostic-imaging','university_program',null,4,'2026-08-10'),
  ('UK:radiographer','source','HCPC — International applications','https://www.hcpc-uk.org/registration/getting-on-the-register/international-applications/','official_regulator',null,5,'2026-08-10'),
  ('UK:radiographer','source','Home Office — Health and Care Worker eligible jobs','https://www.gov.uk/health-care-worker-visa/your-job','official_immigration',null,6,'2026-08-10'),
  ('UK:radiographer','source','NHS England — Long Term Workforce Plan','https://www.england.nhs.uk/long-read/nhs-long-term-workforce-plan-2/','official_workforce',null,7,'2026-08-10'),
  ('UK:pharmacist','entry_program','GPhC — Courses and qualifications for pharmacists','https://www.pharmacyregulation.org/students-and-trainees/pharmacist-education-and-training/courses-and-qualifications-pharmacists','official_training',null,1,'2026-08-10'),
  ('UK:pharmacist','entry_program','Cardiff University — Pharmacy','https://www.cardiff.ac.uk/study/undergraduate/courses/2026/pharmacy-mpharm','university_program',null,2,'2026-08-10'),
  ('UK:pharmacist','source','Home Office — Health and Care Worker eligible jobs','https://www.gov.uk/health-care-worker-visa/your-job','official_immigration',null,3,'2026-08-10'),
  ('UK:pharmacist','source','NHS England — Long Term Workforce Plan','https://www.england.nhs.uk/long-read/nhs-long-term-workforce-plan-2/','official_workforce',null,4,'2026-08-10'),
  ('UK:occupational-therapist','entry_program','Skills England — Occupational Therapist apprenticeship','https://skillsengland.education.gov.uk/apprenticeships/st0517','official_training',null,1,'2026-08-10'),
  ('UK:occupational-therapist','entry_program','City St George''s — Occupational Therapy','https://www.citystgeorges.ac.uk/prospective-students/courses/undergraduate/occupational-therapy','university_program',null,2,'2026-08-10'),
  ('UK:occupational-therapist','source','HCPC — International applications','https://www.hcpc-uk.org/registration/getting-on-the-register/international-applications/','official_regulator',null,3,'2026-08-10'),
  ('UK:occupational-therapist','source','Home Office — Health and Care Worker eligible jobs','https://www.gov.uk/health-care-worker-visa/your-job','official_immigration',null,4,'2026-08-10'),
  ('UK:occupational-therapist','source','NHS England — Long Term Workforce Plan','https://www.england.nhs.uk/long-read/nhs-long-term-workforce-plan-2/','official_workforce',null,5,'2026-08-10')
on conflict (profile_key,link_type,url) do update set
  label=excluded.label,
  provider_type=excluded.provider_type,
  region_code=excluded.region_code,
  sort_order=excluded.sort_order,
  source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_program_links (profile_key,program_ref,relation_type,source_checked_at) values
  ('UK:midwife','uk-program:98e7f5bd-a54d-17e9-d36c-ae9b3f2675e2','progression','2026-08-10'),
  ('UK:physiotherapist','uk-program:8084d43b-ddf8-aef9-e6a2-c445e151de03','direct','2026-08-10'),
  ('UK:physiotherapist','uk-program:17124f58-e031-0480-c4ff-be715ec3639d','progression','2026-08-10'),
  ('UK:radiographer','uk-program:23bba4d5-57a4-18a7-03c4-dcde575ec946','progression','2026-08-10'),
  ('UK:radiographer','uk-program:d0a7ec34-6f0f-676b-7170-5975fa07fedc','progression','2026-08-10'),
  ('UK:pharmacist','uk-program:ff8e4adc-68eb-448d-6651-90047693a1ec','progression','2026-08-10'),
  ('UK:occupational-therapist','uk-program:3135336a-5311-90ae-8ce3-bea7385a2b3a','direct','2026-08-10'),
  ('UK:occupational-therapist','uk-program:68433072-5fac-1d60-2450-73d114d8e4e5','progression','2026-08-10')
on conflict (profile_key,program_ref) do update set
  relation_type=excluded.relation_type,
  source_checked_at=excluded.source_checked_at;
