-- United Kingdom engineering occupation cohort: 8 canonical careers.
-- SOC 2020 mappings, current Home Office Skilled Worker / TSL access,
-- MAC engineering-professions and July 2026 TSL evidence, and Skills England routes checked 2026-08-10.

insert into public.country_occupation_profiles (
  profile_key,country_code,canonical_career_id,official_title,official_code_system,official_code_version,
  official_unit_group_code,currency,registration_required,registration_authority,registration_url,
  publication_status,source_checked_at,updated_at
) values
  ('UK:civil-engineer','UK','civil-engineer','Civil engineers','SOC','SOC 2020','2121','GBP',false,null,null,'profile_ready','2026-08-10',now()),
  ('UK:mechanical-engineer','UK','mechanical-engineer','Mechanical engineers','SOC','SOC 2020','2122','GBP',false,null,null,'profile_ready','2026-08-10',now()),
  ('UK:electrical-engineer','UK','electrical-engineer','Electrical engineers','SOC','SOC 2020','2123','GBP',false,null,null,'profile_ready','2026-08-10',now()),
  ('UK:manufacturing-engineer','UK','manufacturing-engineer','Production and process engineers — manufacturing engineer scope','SOC','SOC 2020','2125','GBP',false,null,null,'profile_ready','2026-08-10',now()),
  ('UK:industrial-engineer','UK','industrial-engineer','Production and process engineers — industrial engineer scope','SOC','SOC 2020','2125','GBP',false,null,null,'profile_ready','2026-08-10',now()),
  ('UK:chemical-engineer','UK','chemical-engineer','Production and process engineers — chemical engineer scope','SOC','SOC 2020','2125','GBP',false,null,null,'profile_ready','2026-08-10',now()),
  ('UK:environmental-engineer','UK','environmental-engineer','Environment professionals — environmental and geo-environmental engineer scope','SOC','SOC 2020','2152','GBP',false,null,null,'profile_ready','2026-08-10',now()),
  ('UK:engineering-technician','UK','engineering-technician','Engineering technicians','SOC','SOC 2020','3113','GBP',false,null,null,'profile_ready','2026-08-10',now())
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
  ('UK:civil-engineer','2026-08-10',null,25.85,50400,10,0,0,0,8,10,0,5,5,38,'career-opportunity-uk-v1','provisional',
    jsonb_build_object('classification_scope','Canonical Civil Engineer maps to SOC 2020 2121 Civil engineers.','shortage_note','MAC engineering review finds engineering-professional vacancy rates persistently above other professional occupations and civil-engineering skills rising strongly in employer adverts; moderate 10/20.','visa_basis','SOC 2121 is an RQF 6+ occupation eligible for the standard Skilled Worker route without current targeted TSL or ISL treatment; 5/10.','salary_method','Current Home Office standard going rate is GBP 50,400 / GBP 25.85 per hour; UK v1 salary band earns 10/10.','entry_basis','Degree and degree-apprenticeship pathways provide structured professional entry, but civil engineering is not treated as direct-entry; 8/15.','entry_burden_basis','No single statutory UK civil-engineer licence is required for the generic role; professional registration is valuable but generally voluntary; 5/5 accessibility credit.'),'2026-08-10'),
  ('UK:mechanical-engineer','2026-08-10',null,24.00,46800,10,0,0,0,8,10,0,5,5,38,'career-opportunity-uk-v1','provisional',
    jsonb_build_object('classification_scope','Canonical Mechanical Engineer maps to SOC 2020 2122 Mechanical engineers.','shortage_note','MAC job-advert evidence places mechanical engineers and mechanical design engineers among the most frequently advertised engineering titles, alongside elevated engineering-professional vacancy rates; moderate 10/20.','visa_basis','SOC 2122 is RQF 6+ and eligible for the standard Skilled Worker route without targeted TSL or ISL treatment; 5/10.','salary_method','Current Home Office standard going rate is GBP 46,800 / GBP 24.00 per hour; UK v1 salary band earns 10/10.','entry_basis','Degree routes and Level 6 electro-mechanical engineering pathways provide structured professional entry; 8/15.','entry_burden_basis','The generic profession is not statutorily licensed; voluntary professional registration and role-specific competence may apply; 5/5.'),'2026-08-10'),
  ('UK:electrical-engineer','2026-08-10',null,30.10,58700,15,0,0,0,8,10,0,5,5,43,'career-opportunity-uk-v1','provisional',
    jsonb_build_object('classification_scope','Canonical Electrical Engineer maps to SOC 2020 2123 Electrical engineers.','shortage_note','MAC directly highlights insufficient electrical-engineer supply risk relative to current and future demand, with electrical engineers among the highest-volume advertised engineering titles; strong 15/20.','visa_basis','SOC 2123 is RQF 6+ and eligible for the standard Skilled Worker route without current targeted TSL or ISL treatment; 5/10.','salary_method','Current Home Office standard going rate is GBP 58,700 / GBP 30.10 per hour; UK v1 salary band earns 10/10.','entry_basis','Skills England Level 6 Electrical and Electronic Engineer and university degree routes provide structured professional entry; 8/15.','entry_burden_basis','No universal statutory licence applies to the generic profession, though safety-critical roles can impose additional competence requirements; 5/5.'),'2026-08-10'),
  ('UK:manufacturing-engineer','2026-08-10',null,23.08,45000,5,0,0,0,8,10,0,5,5,33,'career-opportunity-uk-v1','provisional',
    jsonb_build_object('classification_scope','Canonical Manufacturing Engineer is scoped to manufacturing-focused work within SOC 2020 2125 Production and process engineers, represented by the manufacturing/production n.e.c. sub-unit rather than the industrial or chemical sub-units.','shortage_note','MAC evidence supports elevated engineering demand and rising continuous-improvement skills, but does not isolate a severe manufacturing-engineer-specific shortage; limited 5/20.','visa_basis','SOC 2125 is RQF 6+ and eligible for the standard Skilled Worker route without current targeted TSL or ISL treatment; 5/10.','salary_method','Current Home Office standard going rate for SOC 2125 is GBP 45,000 / GBP 23.08 per hour; UK v1 salary band earns 10/10.','entry_basis','Skills England Level 6 Manufacturing Engineer provides structured degree-level entry; 8/15.','entry_burden_basis','Manufacturing engineering is not one statutorily licensed UK profession; 5/5 accessibility credit.'),'2026-08-10'),
  ('UK:industrial-engineer','2026-08-10',null,23.08,45000,5,0,0,0,8,10,0,5,5,33,'career-opportunity-uk-v1','provisional',
    jsonb_build_object('classification_scope','Canonical Industrial Engineer is constrained to SOC 2020 2125/03 Industrial and production engineers.','shortage_note','Industrial Engineer benefits from wider engineering demand and process-improvement pressures, but no standalone recurring official shortage series supports more than limited 5/20 credit.','visa_basis','SOC 2125 is RQF 6+ and eligible for the standard Skilled Worker route without targeted TSL or ISL treatment; 5/10.','salary_method','Current Home Office standard going rate for SOC 2125 is GBP 45,000 / GBP 23.08 per hour; UK v1 salary band earns 10/10.','entry_basis','Industrial/manufacturing engineering degrees and the Level 6 Manufacturing Engineer route provide structured professional entry; 8/15.','entry_burden_basis','Industrial engineering is not statutorily licensed as one profession; 5/5 accessibility credit.'),'2026-08-10'),
  ('UK:chemical-engineer','2026-08-10',null,23.08,45000,5,0,0,0,8,10,0,5,5,33,'career-opportunity-uk-v1','provisional',
    jsonb_build_object('classification_scope','Canonical Chemical Engineer is constrained to SOC 2020 2125/01 Chemical engineers.','shortage_note','Chemical Engineer sits inside broader production-and-process engineering demand, but the reviewed official evidence does not establish a severe occupation-specific current shortage; limited 5/20.','visa_basis','SOC 2125 is RQF 6+ and eligible for the standard Skilled Worker route without current targeted TSL or ISL treatment; 5/10.','salary_method','Current Home Office standard going rate for SOC 2125 is GBP 45,000 / GBP 23.08 per hour; UK v1 salary band earns 10/10.','entry_basis','Chemical-engineering degrees and the Level 6 Science Industry Process and Plant Engineer route provide structured professional entry; 8/15.','entry_burden_basis','No single statutory Chemical Engineer licence applies, though process-safety and regulated-sector requirements can be substantial; 5/5 accessibility credit.'),'2026-08-10'),
  ('UK:environmental-engineer','2026-08-10',null,19.08,37200,0,0,0,0,8,6,0,5,5,24,'career-opportunity-uk-v1','provisional',
    jsonb_build_object('classification_scope','Canonical Environmental Engineer is mapped to SOC 2020 2152/02 Environmental and geo-environmental engineers within Environment professionals, not Engineering professionals n.e.c.','shortage_note','No occupation-specific shortage points are inferred from broad green-transition or infrastructure demand alone; 0/20.','visa_basis','SOC 2152 is RQF 6+ and eligible for the standard Skilled Worker route without targeted TSL or ISL treatment; 5/10.','salary_method','Current Home Office standard going rate for SOC 2152 is GBP 37,200 / GBP 19.08 per hour; UK v1 salary band earns 6/10.','entry_basis','Environmental and engineering degree routes plus Level 6 environmental-practice pathways provide structured professional entry; 8/15.','entry_burden_basis','No single statutory UK licence applies to the generic environmental-engineer title; 5/5 accessibility credit.'),'2026-08-10'),
  ('UK:engineering-technician','2026-08-10',100000,21.79,42500,10,0,0,0,15,8,0,10,5,48,'career-opportunity-uk-v1','provisional',
    jsonb_build_object('classification_scope','Canonical Engineering Technician maps directly to SOC 2020 3113 Engineering technicians.','shortage_note','MAC July 2026 reports around 100,000 employees, some historical shortage evidence, pay growth marginally above the UK trend and expected future demand, and recommends 18-month TSL access; moderate 10/20.','visa_basis','SOC 3113 is on the current Temporary Shortage List for certificates of sponsorship issued before 31 December 2026; targeted access earns 10/10.','salary_method','Current Home Office standard going rate is GBP 42,500 / GBP 21.79 per hour; UK v1 salary band earns 8/10.','entry_basis','Approved Level 3 Engineering Technician pathways provide accessible work-based entry across multiple engineering specialisms; 15/15.','entry_burden_basis','The generic occupation is not universally licensed and voluntary EngTech registration is available; 5/5 accessibility credit.'),'2026-08-10')
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
  ('UK:civil-engineer','2121','Civil engineers',null,true,true,1,'https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','2026-08-10'),
  ('UK:mechanical-engineer','2122','Mechanical engineers',null,true,true,1,'https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','2026-08-10'),
  ('UK:electrical-engineer','2123','Electrical engineers',null,true,true,1,'https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','2026-08-10'),
  ('UK:manufacturing-engineer','2125/99','Production and process engineers n.e.c. — manufacturing engineer scope',null,true,true,1,'https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0025','2026-08-10'),
  ('UK:industrial-engineer','2125/03','Industrial and production engineers',null,true,true,1,'https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0025','2026-08-10'),
  ('UK:chemical-engineer','2125/01','Chemical engineers',null,true,true,1,'https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0473','2026-08-10'),
  ('UK:environmental-engineer','2152/02','Environmental and geo-environmental engineers',null,true,true,1,'https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0778','2026-08-10'),
  ('UK:engineering-technician','3113','Engineering technicians',null,true,true,1,'https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-worker','2026-08-10')
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
  ('UK:civil-engineer','entry_program','Skills England — Civil Engineer','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0417','official_training',null,1,'2026-08-10'),
  ('UK:civil-engineer','source','Home Office — Appendix Skilled Occupations','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','official_immigration',null,2,'2026-08-10'),
  ('UK:civil-engineer','source','MAC — Professionals in IT and engineering review','https://www.gov.uk/government/publications/professionals-in-it-and-engineering-review/professionals-in-it-and-engineering-accessible','official_shortage',null,3,'2026-08-10'),
  ('UK:mechanical-engineer','entry_program','Skills England — Electro-mechanical Engineer degree apprenticeship','https://skillsengland.education.gov.uk/apprenticeship-standards/st0672-v1-0','official_training',null,1,'2026-08-10'),
  ('UK:mechanical-engineer','source','Home Office — Appendix Skilled Occupations','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','official_immigration',null,2,'2026-08-10'),
  ('UK:mechanical-engineer','source','MAC — Professionals in IT and engineering review','https://www.gov.uk/government/publications/professionals-in-it-and-engineering-review/professionals-in-it-and-engineering-accessible','official_shortage',null,3,'2026-08-10'),
  ('UK:electrical-engineer','entry_program','Skills England — Electrical and Electronic Engineer degree apprenticeship','https://skillsengland.education.gov.uk/apprenticeships/st0024-v1-3','official_training',null,1,'2026-08-10'),
  ('UK:electrical-engineer','source','Home Office — Appendix Skilled Occupations','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','official_immigration',null,2,'2026-08-10'),
  ('UK:electrical-engineer','source','MAC — Professionals in IT and engineering review','https://www.gov.uk/government/publications/professionals-in-it-and-engineering-review/professionals-in-it-and-engineering-accessible','official_shortage',null,3,'2026-08-10'),
  ('UK:manufacturing-engineer','entry_program','Skills England — Manufacturing Engineer','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0025','official_training',null,1,'2026-08-10'),
  ('UK:manufacturing-engineer','source','Home Office — Appendix Skilled Occupations','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','official_immigration',null,2,'2026-08-10'),
  ('UK:manufacturing-engineer','source','MAC — Professionals in IT and engineering review','https://www.gov.uk/government/publications/professionals-in-it-and-engineering-review/professionals-in-it-and-engineering-accessible','official_shortage',null,3,'2026-08-10'),
  ('UK:industrial-engineer','entry_program','Skills England — Manufacturing Engineer','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0025','official_training',null,1,'2026-08-10'),
  ('UK:industrial-engineer','source','Home Office — Appendix Skilled Occupations','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','official_immigration',null,2,'2026-08-10'),
  ('UK:industrial-engineer','source','MAC — Professionals in IT and engineering review','https://www.gov.uk/government/publications/professionals-in-it-and-engineering-review/professionals-in-it-and-engineering-accessible','official_shortage',null,3,'2026-08-10'),
  ('UK:chemical-engineer','entry_program','Skills England — Science Industry Process and Plant Engineer','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0473','official_training',null,1,'2026-08-10'),
  ('UK:chemical-engineer','source','Home Office — Appendix Skilled Occupations','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','official_immigration',null,2,'2026-08-10'),
  ('UK:chemical-engineer','source','MAC — Professionals in IT and engineering review','https://www.gov.uk/government/publications/professionals-in-it-and-engineering-review/professionals-in-it-and-engineering-accessible','official_shortage',null,3,'2026-08-10'),
  ('UK:environmental-engineer','entry_program','Skills England — Environmental Practitioner','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0778','official_training',null,1,'2026-08-10'),
  ('UK:environmental-engineer','source','Home Office — Appendix Skilled Occupations','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','official_immigration',null,2,'2026-08-10'),
  ('UK:environmental-engineer','source','Skills England — Environmental and geo-environmental engineer sub-unit evidence','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0778','official_classification',null,3,'2026-08-10'),
  ('UK:engineering-technician','entry_program','Skills England — Engineering Technician','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0457E','official_training',null,1,'2026-08-10'),
  ('UK:engineering-technician','source','Home Office — Temporary Shortage List','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-worker','official_immigration',null,2,'2026-08-10'),
  ('UK:engineering-technician','source','MAC — Temporary Shortage List Stage 2','https://www.gov.uk/government/publications/temporary-shortage-list-stage-2-report/temporary-shortage-list-stage-2-report-accessible','official_shortage',null,3,'2026-08-10')
on conflict (profile_key,link_type,url) do update set
  label=excluded.label,
  provider_type=excluded.provider_type,
  region_code=excluded.region_code,
  sort_order=excluded.sort_order,
  source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_program_links (profile_key,program_ref,relation_type,source_checked_at) values
  ('UK:chemical-engineer','uk-program:85d29a01-c9a1-9d2d-2d54-23089c6b4f36','progression','2026-08-10'),
  ('UK:civil-engineer','uk-program:9f500856-212f-26e5-7e36-9c5deeedf78d','direct','2026-08-10'),
  ('UK:civil-engineer','uk-program:2ab009ae-7d2c-790e-8d0d-4d5b20a6dee3','direct','2026-08-10'),
  ('UK:civil-engineer','uk-program:71a8f882-cb13-f161-b814-ccb7e4dbe406','direct','2026-08-10'),
  ('UK:civil-engineer','uk-program:4a0383c1-34b7-aa5d-b022-31468015e14a','direct','2026-08-10'),
  ('UK:electrical-engineer','uk-program:56d858a1-43a0-a47b-322b-f0eb52858a8e','related','2026-08-10'),
  ('UK:electrical-engineer','uk-program:4773fb3d-69ac-4d73-8dd5-ddccca413a57','related','2026-08-10'),
  ('UK:electrical-engineer','uk-program:4ba56864-f928-c029-c39d-54e39bb60547','direct','2026-08-10'),
  ('UK:electrical-engineer','uk-program:f6c43334-3c48-0f72-7616-5a7a14485e8a','direct','2026-08-10'),
  ('UK:environmental-engineer','uk-program:4a0383c1-34b7-aa5d-b022-31468015e14a','direct','2026-08-10'),
  ('UK:industrial-engineer','uk-program:614cf66c-1a6b-4642-b2c4-8336cf3daf41','direct','2026-08-10'),
  ('UK:manufacturing-engineer','uk-program:7823d655-a620-df4d-319e-727e8f5b270d','direct','2026-08-10'),
  ('UK:mechanical-engineer','uk-program:c3754b9f-a9e5-1f44-4227-638eaf510f81','direct','2026-08-10'),
  ('UK:mechanical-engineer','uk-program:5fda2abd-c3fe-ca3f-019e-903a1e5b5dd5','direct','2026-08-10'),
  ('UK:mechanical-engineer','uk-program:134d4851-3f7e-4728-d770-8a56ad98183a','direct','2026-08-10'),
  ('UK:mechanical-engineer','uk-program:dfbcc543-f965-9909-e050-f0a5760d25ab','direct','2026-08-10'),
  ('UK:mechanical-engineer','uk-program:052356c4-ed40-f04a-a636-ded8c42a7529','direct','2026-08-10')
on conflict (profile_key,program_ref) do update set
  relation_type=excluded.relation_type,
  source_checked_at=excluded.source_checked_at;
