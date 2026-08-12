-- Ireland health occupation cohort: 8 canonical careers.
-- SOC 2010 mappings, current employment-permit access, statutory registration and SOLAS shortage evidence checked 2026-08-10.

insert into public.country_occupation_profiles (
  profile_key,country_code,canonical_career_id,official_title,official_code_system,official_code_version,
  official_unit_group_code,currency,registration_required,registration_authority,registration_url,
  publication_status,source_checked_at,updated_at
) values
  ('IE:registered-nurse','IE','registered-nurse','Registered Nurses','SOC','SOC 2010','2231','EUR',true,'Nursing and Midwifery Board of Ireland','https://www.nmbi.ie/Registration','profile_ready','2026-08-10',now()),
  ('IE:midwife','IE','midwife','Registered Midwives','SOC','SOC 2010','2232','EUR',true,'Nursing and Midwifery Board of Ireland','https://www.nmbi.ie/Registration','profile_ready','2026-08-10',now()),
  ('IE:care-worker','IE','care-worker','Care workers and home carers','SOC','SOC 2010','6145','EUR',false,null,null,'profile_ready','2026-08-10',now()),
  ('IE:physiotherapist','IE','physiotherapist','Physiotherapist','SOC','SOC 2010','2221','EUR',true,'CORU Physiotherapists Registration Board','https://coru.ie/health-and-social-care-professionals/registration/','profile_ready','2026-08-10',now()),
  ('IE:medical-laboratory-technician','IE','medical-laboratory-technician','Medical and dental technicians — medical laboratory technician scope','SOC','SOC 2010','3218','EUR',false,null,null,'profile_ready','2026-08-10',now()),
  ('IE:radiographer','IE','radiographer','Radiographers — diagnostic and therapeutic radiography scope','SOC','SOC 2010','2217','EUR',true,'CORU Radiographers Registration Board','https://coru.ie/health-and-social-care-professionals/registration/','profile_ready','2026-08-10',now()),
  ('IE:pharmacist','IE','pharmacist','Pharmacist / Industrial Pharmacist','SOC','SOC 2010','2213','EUR',true,'Pharmaceutical Society of Ireland','https://www.psi.ie/registration/pharmacists','profile_ready','2026-08-10',now()),
  ('IE:occupational-therapist','IE','occupational-therapist','Occupational Therapist','SOC','SOC 2010','2222','EUR',true,'CORU Occupational Therapists Registration Board','https://coru.ie/health-and-social-care-professionals/registration/','profile_ready','2026-08-10',now())
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
  ('IE:registered-nurse','2026-08-10',null,null,null,20,0,0,0,8,0,0,10,1,39,'career-opportunity-ie-v1','provisional',jsonb_build_object('classification_scope','SOC 2010 2231 Registered Nurses. Midwifery is excluded and represented separately under 2232.','shortage_note','SOLAS National Skills Bulletin 2025 identifies nurses as a current healthcare skills shortage; 20/20.','visa_basis','Registered Nurses are explicitly listed under SOC 2231 on the Critical Skills Occupations List effective 13 May 2026; 10/10.','salary_method','No comparable current Irish occupation-level median series is normalised in this layer, so salary remains unscored.','entry_basis','NMBI-approved pre-registration nursing education provides a structured degree-level route; 8/15.','entry_burden_basis','NMBI registration is legally mandatory to practise as a nurse; 1/5 accessibility credit.'),'2026-08-10'),
  ('IE:midwife','2026-08-10',null,null,null,0,0,0,0,8,0,0,10,1,19,'career-opportunity-ie-v1','provisional',jsonb_build_object('classification_scope','SOC 2010 2232 Registered Midwives. This is a distinct profession from nursing.','shortage_note','SOLAS 2025 healthcare summary names nurses, not midwives separately, as the direct shortage finding; no inferred shortage points.','visa_basis','Registered Midwives are explicitly listed under SOC 2232 on the current Critical Skills Occupations List; 10/10.','salary_method','No comparable current occupation-level median series is normalised; 0/10.','entry_basis','NMBI pre-registration midwifery standards define a structured professional programme with clinical practice; 8/15.','entry_burden_basis','NMBI registration in the Midwives Division is mandatory; 1/5.'),'2026-08-10'),
  ('IE:care-worker','2026-08-10',null,null,null,20,0,0,0,15,0,0,6,4,45,'career-opportunity-ie-v1','provisional',jsonb_build_object('classification_scope','SOC 2010 6145 Care workers and home carers. CORU-regulated Social Care Worker is a separate profession.','shortage_note','SOLAS National Skills Bulletin 2025 identifies care workers as a labour shortage; 20/20.','visa_basis','Care workers and home carers have a dedicated General Employment Permit route subject to current qualification, remuneration, LMNT and quota rules; 6/10.','salary_method','The occupation-specific permit remuneration floor is not a median salary and is not converted into salary score.','entry_basis','QQI Level 5 Healthcare Support is a common structured entry route and is referenced in permit qualification requirements; 15/15.','entry_burden_basis','Generic Care Worker is not a protected professional title, although permit applicants face qualification requirements; 4/5.'),'2026-08-10'),
  ('IE:physiotherapist','2026-08-10',null,null,null,0,0,0,0,6,0,0,10,1,17,'career-opportunity-ie-v1','provisional',jsonb_build_object('classification_scope','SOC 2010 2221 Physiotherapist.','shortage_note','SOLAS 2025 says shortage evidence for some therapist occupations is inconclusive due to small employment levels; 0/20.','visa_basis','Physiotherapist is explicitly listed in the current Critical Skills Occupations List; 10/10.','salary_method','No comparable occupation-level median series is normalised; 0/10.','entry_basis','CORU-approved professional qualifications provide the structured route to registration; 6/15.','entry_burden_basis','Physiotherapist is a protected title requiring CORU registration; 1/5.'),'2026-08-10'),
  ('IE:medical-laboratory-technician','2026-08-10',null,null,null,0,0,0,0,8,0,0,6,4,18,'career-opportunity-ie-v1','provisional',jsonb_build_object('classification_scope','Canonical Medical Laboratory Technician is constrained to SOC 2010 3218 Medical and dental technicians, medical-laboratory technical scope. It is not the CORU-regulated Medical Scientist profession.','shortage_note','No Medical Scientist shortage evidence is borrowed for the technician scope; 0/20.','visa_basis','The current Critical Skills list only names specified SOC 3218 employments such as prosthetists, orthotists and respiratory physiologists, not generic medical laboratory technicians. General Employment Permit accessibility may apply where the job is otherwise eligible; 6/10.','salary_method','No exact current technician median is normalised; 0/10.','entry_basis','Technical laboratory roles commonly require relevant laboratory education or employer-recognised competence, but no single universal professional programme is asserted; 8/15.','entry_burden_basis','The generic technician title is not the protected CORU Medical Scientist title; 4/5.'),'2026-08-10'),
  ('IE:radiographer','2026-08-10',null,null,null,0,0,0,0,6,0,0,10,1,17,'career-opportunity-ie-v1','provisional',jsonb_build_object('classification_scope','SOC 2010 2217 Radiographers, covering diagnostic and therapeutic radiography scopes while keeping the protected titles distinct in regulation.','shortage_note','No separate radiographer shortage finding is published in the reviewed SOLAS 2025 healthcare summary; 0/20.','visa_basis','Radiographers and radiation therapists are explicitly listed under SOC 2217 on the current Critical Skills Occupations List; 10/10.','salary_method','No comparable current occupation-level median is normalised; 0/10.','entry_basis','CORU-approved radiography qualifications provide the professional entry route; 6/15.','entry_burden_basis','Radiographer and Radiation Therapist are protected titles requiring CORU registration; 1/5.'),'2026-08-10'),
  ('IE:pharmacist','2026-08-10',null,null,null,0,0,0,0,4,0,0,10,1,15,'career-opportunity-ie-v1','provisional',jsonb_build_object('classification_scope','SOC 2010 2213 Pharmacist / Industrial Pharmacist.','shortage_note','CSEP eligibility is not treated as a separate pharmacist shortage finding; 0/20.','visa_basis','Pharmacist and Industrial Pharmacist are explicitly listed on the current Critical Skills Occupations List; 10/10.','salary_method','No comparable current occupation-level median series is normalised; 0/10.','entry_basis','The Irish route is a PSI-accredited five-year integrated MPharm including experiential learning; 4/15.','entry_burden_basis','PSI registration is mandatory to practise as a pharmacist; 1/5.'),'2026-08-10'),
  ('IE:occupational-therapist','2026-08-10',null,null,null,0,0,0,0,6,0,0,10,1,17,'career-opportunity-ie-v1','provisional',jsonb_build_object('classification_scope','SOC 2010 2222 Occupational Therapist.','shortage_note','SOLAS 2025 describes therapist shortage evidence as inconclusive rather than establishing an occupation-specific shortage; 0/20.','visa_basis','Occupational Therapist is explicitly listed on the current Critical Skills Occupations List; 10/10.','salary_method','No comparable current occupation-level median series is normalised; 0/10.','entry_basis','CORU-approved professional qualifications provide the structured route to registration; 6/15.','entry_burden_basis','Occupational Therapist is a protected title requiring CORU registration; 1/5.'),'2026-08-10')
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

insert into public.country_occupation_specialisations (profile_key,official_code,official_title,shortage_rating,visa_eligible,included_in_rollup,sort_order,source_url,source_checked_at) values
  ('IE:registered-nurse','2231','Registered Nurses',null,true,true,1,'https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/employment-permit-eligibility/highly-skilled-eligible-occupations-list/','2026-08-10'),
  ('IE:midwife','2232','Registered Midwives',null,true,true,1,'https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/employment-permit-eligibility/highly-skilled-eligible-occupations-list/','2026-08-10'),
  ('IE:care-worker','6145','Care workers and home carers',null,true,true,1,'https://enterprise.gov.ie/en/publications/employment-permits-checklists.html','2026-08-10'),
  ('IE:physiotherapist','2221','Physiotherapist',null,true,true,1,'https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/employment-permit-eligibility/highly-skilled-eligible-occupations-list/','2026-08-10'),
  ('IE:medical-laboratory-technician','3218','Medical and dental technicians — medical laboratory technician scope',null,true,true,1,'https://www.cso.ie/en/releasesandpublications/ep/p-cp11eoi/cp11eoi/bgn/','2026-08-10'),
  ('IE:radiographer','2217','Radiographers — diagnostic and therapeutic radiography scope',null,true,true,1,'https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/employment-permit-eligibility/highly-skilled-eligible-occupations-list/','2026-08-10'),
  ('IE:pharmacist','2213','Pharmacist / Industrial Pharmacist',null,true,true,1,'https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/employment-permit-eligibility/highly-skilled-eligible-occupations-list/','2026-08-10'),
  ('IE:occupational-therapist','2222','Occupational Therapist',null,true,true,1,'https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/employment-permit-eligibility/highly-skilled-eligible-occupations-list/','2026-08-10')
on conflict (profile_key,official_code) do update set official_title=excluded.official_title,shortage_rating=excluded.shortage_rating,visa_eligible=excluded.visa_eligible,included_in_rollup=excluded.included_in_rollup,sort_order=excluded.sort_order,source_url=excluded.source_url,source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_links (profile_key,link_type,label,url,provider_type,region_code,sort_order,source_checked_at) values
  ('IE:registered-nurse','entry_program','NMBI — Nurse education and approved programme standards','https://www.nmbi.ie/Education','official_regulator',null,1,'2026-08-10'),
  ('IE:registered-nurse','source','NMBI — Registration','https://www.nmbi.ie/Registration','official_regulator',null,2,'2026-08-10'),
  ('IE:registered-nurse','source','SOLAS — Healthcare skills evidence','https://www.solas.ie/research-lp/skills-labour-market-research-slmru/career-guidance/healthcare/','official_labour',null,3,'2026-08-10'),
  ('IE:registered-nurse','source','DETE — Critical Skills Occupations List','https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/employment-permit-eligibility/highly-skilled-eligible-occupations-list/','official_immigration',null,4,'2026-08-10'),
  ('IE:midwife','entry_program','NMBI — Registered Midwife Programme Standards','https://www.nmbi.ie/Education/Standards-and-Requirements/Registered-Midwife-Programmes-Standards','official_regulator',null,1,'2026-08-10'),
  ('IE:midwife','source','NMBI — Register and Midwives Division','https://www.nmbi.ie/Registration/the-Register-and-Divisions','official_regulator',null,2,'2026-08-10'),
  ('IE:midwife','source','DETE — Critical Skills Occupations List','https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/employment-permit-eligibility/highly-skilled-eligible-occupations-list/','official_immigration',null,3,'2026-08-10'),
  ('IE:care-worker','entry_program','QQI — Healthcare Support Level 5 / Care Skills pathway','https://qsearch.qqi.ie/WebPart/AwardDetails?awardCode=5N2770','official_training',null,1,'2026-08-10'),
  ('IE:care-worker','source','SOLAS — Social and Care labour shortage evidence','https://www.solas.ie/research-lp/skills-labour-market-research-slmru/career-guidance/social-and-care/','official_labour',null,2,'2026-08-10'),
  ('IE:care-worker','source','DETE — Care Workers and Home Carers permit checklist','https://enterprise.gov.ie/en/publications/employment-permits-checklists.html','official_immigration',null,3,'2026-08-10'),
  ('IE:care-worker','source','DETE — 2026 employment-permit remuneration roadmap','https://enterprise.gov.ie/en/news-and-events/department-news/2025/december/20251202.html','official_immigration',null,4,'2026-08-10'),
  ('IE:physiotherapist','entry_program','CORU — Approved Qualifications','https://coru.ie/health-and-social-care-professionals/education/approved-qualifications/','official_regulator',null,1,'2026-08-10'),
  ('IE:physiotherapist','source','CORU — Statutory registration and protected titles','https://coru.ie/public-protection/public-information/','official_regulator',null,2,'2026-08-10'),
  ('IE:physiotherapist','source','DETE — Critical Skills Occupations List','https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/employment-permit-eligibility/highly-skilled-eligible-occupations-list/','official_immigration',null,3,'2026-08-10'),
  ('IE:physiotherapist','source','SOLAS — Healthcare skills evidence','https://www.solas.ie/research-lp/skills-labour-market-research-slmru/career-guidance/healthcare/','official_labour',null,4,'2026-08-10'),
  ('IE:medical-laboratory-technician','source','CSO — SOC 2010 health associate professional structure','https://www.cso.ie/en/releasesandpublications/ep/p-cp11eoi/cp11eoi/bgn/','official_classification',null,1,'2026-08-10'),
  ('IE:medical-laboratory-technician','source','DETE — Critical Skills Occupations List scope boundary','https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/employment-permit-eligibility/highly-skilled-eligible-occupations-list/','official_immigration',null,2,'2026-08-10'),
  ('IE:medical-laboratory-technician','source','CORU — Medical Scientist protected-title boundary','https://coru.ie/about-us/registration-boards/medical-scientists-registration-board/about-the-medical-scientists-registration-board/','official_regulator',null,3,'2026-08-10'),
  ('IE:radiographer','entry_program','CORU — Approved Qualifications','https://coru.ie/health-and-social-care-professionals/education/approved-qualifications/','official_regulator',null,1,'2026-08-10'),
  ('IE:radiographer','source','CORU — Protected radiographer titles','https://coru.ie/public-protection/enforcement/enforcement-faqs/','official_regulator',null,2,'2026-08-10'),
  ('IE:radiographer','source','DETE — Critical Skills Occupations List','https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/employment-permit-eligibility/highly-skilled-eligible-occupations-list/','official_immigration',null,3,'2026-08-10'),
  ('IE:pharmacist','entry_program','PSI — Becoming a Pharmacist','https://www.psi.ie/education-and-training/training-become-pharmacist-ireland/becoming-pharmacist','official_regulator',null,1,'2026-08-10'),
  ('IE:pharmacist','source','PSI — Pharmacist Registration','https://www.psi.ie/registration/pharmacists','official_regulator',null,2,'2026-08-10'),
  ('IE:pharmacist','source','DETE — Critical Skills Occupations List','https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/employment-permit-eligibility/highly-skilled-eligible-occupations-list/','official_immigration',null,3,'2026-08-10'),
  ('IE:occupational-therapist','entry_program','CORU — Approved Qualifications','https://coru.ie/health-and-social-care-professionals/education/approved-qualifications/','official_regulator',null,1,'2026-08-10'),
  ('IE:occupational-therapist','source','CORU — Statutory registration and protected titles','https://coru.ie/public-protection/public-information/','official_regulator',null,2,'2026-08-10'),
  ('IE:occupational-therapist','source','DETE — Critical Skills Occupations List','https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/employment-permit-eligibility/highly-skilled-eligible-occupations-list/','official_immigration',null,3,'2026-08-10'),
  ('IE:occupational-therapist','source','SOLAS — Healthcare skills evidence','https://www.solas.ie/research-lp/skills-labour-market-research-slmru/career-guidance/healthcare/','official_labour',null,4,'2026-08-10')
on conflict (profile_key,link_type,url) do update set label=excluded.label,provider_type=excluded.provider_type,region_code=excluded.region_code,sort_order=excluded.sort_order,source_checked_at=excluded.source_checked_at;
