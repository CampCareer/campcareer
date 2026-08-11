-- United Kingdom technology occupation cohort: 8 canonical careers.
-- SOC 2020 mappings, current Home Office Skilled Worker / TSL access,
-- MAC IT-professions and July 2026 TSL evidence, and Skills England entry routes checked 2026-08-10.

insert into public.country_occupation_profiles (
  profile_key,country_code,canonical_career_id,official_title,official_code_system,official_code_version,
  official_unit_group_code,currency,registration_required,registration_authority,registration_url,
  publication_status,source_checked_at,updated_at
) values
  ('UK:software-developer','UK','software-developer','Programmers and software development professionals — software developer scope','SOC','SOC 2020','2134','GBP',false,null,null,'profile_ready','2026-08-10',now()),
  ('UK:data-analyst','UK','data-analyst','Data analysts','SOC','SOC 2020','3544','GBP',false,null,null,'profile_ready','2026-08-10',now()),
  ('UK:data-engineer','UK','data-engineer','IT business analysts, architects and systems designers — data engineer scope','SOC','SOC 2020','2133','GBP',false,null,null,'profile_ready','2026-08-10',now()),
  ('UK:cybersecurity-analyst','UK','cybersecurity-analyst','Cyber security professionals','SOC','SOC 2020','2135','GBP',false,null,null,'profile_ready','2026-08-10',now()),
  ('UK:network-administrator','UK','network-administrator','IT operations technicians — network and systems administrator scope','SOC','SOC 2020','3131','GBP',false,null,null,'profile_ready','2026-08-10',now()),
  ('UK:cloud-engineer','UK','cloud-engineer','Information technology professionals n.e.c. — DevOps and cloud-infrastructure scope','SOC','SOC 2020','2139','GBP',false,null,null,'profile_ready','2026-08-10',now()),
  ('UK:database-administrator','UK','database-administrator','Database administrators and web content technicians — database administrator scope','SOC','SOC 2020','3133','GBP',false,null,null,'profile_ready','2026-08-10',now()),
  ('UK:ict-support-technician','UK','ict-support-technician','IT user support technicians','SOC','SOC 2020','3132','GBP',false,null,null,'profile_ready','2026-08-10',now())
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
  ('UK:software-developer','2026-08-10',null,28.05,54700,5,0,0,0,12,10,0,5,5,37,'career-opportunity-uk-v1','provisional',
    jsonb_build_object('classification_scope','Canonical Software Developer maps to software developer work within SOC 2134 Programmers and software development professionals.','shortage_note','The MAC 2025 IT review concludes professional IT shortages are not broadly acute, while identifying software engineering and development skills among roles employers can find difficult to source domestically; limited 5/20 shortage credit.','visa_basis','SOC 2134 is RQF 6+ and eligible for the standard Skilled Worker route, but has no current targeted TSL or ISL treatment; 5/10 visa credit.','salary_method','Current Home Office standard going rate is GBP 54,700 / GBP 28.05 per hour; UK v1 salary band earns 10/10.','entry_basis','Skills England Level 4 Software Developer apprenticeship provides a structured employer-based entry route.','entry_burden_basis','Software development is not statutorily regulated; no universal occupational licence is required.'),'2026-08-10'),
  ('UK:data-analyst','2026-08-10',89000,17.90,34900,10,0,0,0,12,4,0,10,5,41,'career-opportunity-uk-v1','provisional',
    jsonb_build_object('classification_scope','Canonical Data Analyst maps directly to SOC 3544 Data analysts.','shortage_note','MAC July 2026 reports mixed quantitative evidence but stronger stakeholder evidence of emerging skills-based recruitment pressures and recommends 18-month TSL access; moderate 10/20.','visa_basis','SOC 3544 is on the current Temporary Shortage List for certificates of sponsorship issued before 31 December 2026; targeted route earns 10/10.','salary_method','Current Home Office standard going rate is GBP 34,900 / GBP 17.90 per hour; UK v1 salary band earns 4/10.','entry_basis','Skills England Level 4 Data Analyst apprenticeship and Level 3 Data Technician progression provide structured entry.','entry_burden_basis','Data analysis is not a statutorily regulated occupation; 5/5 accessibility credit.'),'2026-08-10'),
  ('UK:data-engineer','2026-08-10',null,28.15,54900,5,0,0,0,10,10,0,5,5,35,'career-opportunity-uk-v1','provisional',
    jsonb_build_object('classification_scope','Canonical Data Engineer maps to the Data engineers sub-unit within SOC 2133 IT business analysts, architects and systems designers.','shortage_note','The MAC IT review identifies rapidly changing digital skills needs but does not establish an acute occupation-wide shortage for SOC 2133; limited 5/20 credit.','visa_basis','SOC 2133 is RQF 6+ and eligible for the standard Skilled Worker route without current targeted TSL or ISL treatment; 5/10.','salary_method','Current Home Office standard going rate is GBP 54,900 / GBP 28.15 per hour; UK v1 salary band earns 10/10.','entry_basis','Skills England Level 5 Data Engineer apprenticeship is an approved higher-technical route.','entry_burden_basis','Data engineering is not statutorily regulated; 5/5 accessibility credit.'),'2026-08-10'),
  ('UK:cybersecurity-analyst','2026-08-10',null,24.87,48500,5,0,0,0,13,10,0,5,5,38,'career-opportunity-uk-v1','provisional',
    jsonb_build_object('classification_scope','Canonical Cybersecurity Analyst maps to SOC 2135 Cyber security professionals.','shortage_note','The MAC IT review recognises globally scarce specialist capabilities and fast-changing IT skills but does not find broad acute professional-IT shortages; limited 5/20.','visa_basis','SOC 2135 is RQF 6+ and eligible for the standard Skilled Worker route, with no current targeted TSL or ISL treatment; 5/10.','salary_method','Current Home Office standard going rate is GBP 48,500 / GBP 24.87 per hour; UK v1 salary band earns 10/10.','entry_basis','Skills England provides a Level 3 Cyber Security Technician route and Level 6 Cyber Security Technical Professional progression; 13/15.','entry_burden_basis','No single statutory cyber-security licence exists, although security clearance and role-specific certifications may apply; 5/5.'),'2026-08-10'),
  ('UK:network-administrator','2026-08-10',null,18.05,35200,0,0,0,0,12,6,0,10,5,33,'career-opportunity-uk-v1','provisional',
    jsonb_build_object('classification_scope','Canonical Network Administrator is constrained to Network and systems administrators within SOC 3131 IT operations technicians, avoiding overlap with professional IT network SOC 2137.','shortage_note','SOC 3131 is on the interim TSL and progressed to Stage 2, but the July 2026 final report does not publish an occupation-specific recommendation for 3131; shortage remains 0/20.','visa_basis','SOC 3131 remains on the current Temporary Shortage List for certificates of sponsorship issued before 31 December 2026; 10/10.','salary_method','Current Home Office standard going rate is GBP 35,200 / GBP 18.05 per hour; UK v1 salary band earns 6/10.','entry_basis','Skills England Level 4 Network Engineer explicitly includes Network administrator among typical job titles; 12/15.','entry_burden_basis','Network administration is not statutorily regulated; 5/5 accessibility credit.'),'2026-08-10'),
  ('UK:cloud-engineer','2026-08-10',null,26.82,52300,5,0,0,0,12,10,0,5,5,37,'career-opportunity-uk-v1','provisional',
    jsonb_build_object('classification_scope','Canonical Cloud Engineer is scoped to DevOps and cloud-infrastructure work within SOC 2139 Information technology professionals n.e.c.','shortage_note','The MAC IT review notes strong growth in DevOps job-title demand and emergence of cloud technologies, while finding professional IT shortages overall are not exceptionally acute; limited 5/20.','visa_basis','SOC 2139 is RQF 6+ and eligible for the standard Skilled Worker route without current targeted TSL or ISL treatment; 5/10.','salary_method','Current Home Office standard going rate is GBP 52,300 / GBP 26.82 per hour; UK v1 salary band earns 10/10.','entry_basis','Skills England Level 4 DevOps Engineer standard explicitly uses a cloud-infrastructure-focused perspective; 12/15.','entry_burden_basis','Cloud engineering is not statutorily regulated; 5/5 accessibility credit.'),'2026-08-10'),
  ('UK:database-administrator','2026-08-10',46000,17.74,34600,10,0,0,0,12,4,0,10,5,41,'career-opportunity-uk-v1','provisional',
    jsonb_build_object('classification_scope','Canonical Database Administrator is constrained to the Database administrators job-title scope within SOC 3133 Database administrators and web content technicians.','shortage_note','MAC July 2026 reports mixed historical evidence but stronger specific recruitment difficulty and rising demand linked to technological change, AI and emerging technologies; recommends 18-month TSL access; 10/20.','visa_basis','SOC 3133 is on the current Temporary Shortage List for certificates of sponsorship issued before 31 December 2026; 10/10.','salary_method','Current Home Office standard going rate is GBP 34,600 / GBP 17.74 per hour; UK v1 salary band earns 4/10.','entry_basis','Skills England Level 3 Data Technician pathway includes Database administrators as a mapped sub-unit, with higher-level information-management progression also available; 12/15.','entry_burden_basis','Database administration is not statutorily regulated; 5/5 accessibility credit.'),'2026-08-10'),
  ('UK:ict-support-technician','2026-08-10',null,17.13,33400,0,0,0,0,15,4,0,10,5,34,'career-opportunity-uk-v1','provisional',
    jsonb_build_object('classification_scope','Canonical ICT Support Technician maps directly to SOC 3132 IT user support technicians.','shortage_note','SOC 3132 remains on the interim TSL and progressed to Stage 2, but no occupation-specific final recommendation is published in the July 2026 MAC report; shortage remains 0/20.','visa_basis','SOC 3132 remains on the current Temporary Shortage List for certificates of sponsorship issued before 31 December 2026; 10/10.','salary_method','Current Home Office standard going rate is GBP 33,400 / GBP 17.13 per hour; UK v1 salary band earns 4/10.','entry_basis','Skills England Level 3 Digital Support Technician and Information Communications Technician routes offer accessible work-based entry; 15/15.','entry_burden_basis','IT user support is not statutorily regulated; 5/5 accessibility credit.'),'2026-08-10')
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
  ('UK:software-developer','2134','Software developers',null,true,true,1,'https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','2026-08-10'),
  ('UK:data-analyst','3544','Data analysts',null,true,true,1,'https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-worker','2026-08-10'),
  ('UK:data-engineer','2133/03','Data engineers',null,true,true,1,'https://skillsengland.education.gov.uk/occupations/OCC1386-v1-0','2026-08-10'),
  ('UK:cybersecurity-analyst','2135','Cyber security professionals',null,true,true,1,'https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','2026-08-10'),
  ('UK:network-administrator','3131/02','Network and systems administrators',null,true,true,1,'https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0127','2026-08-10'),
  ('UK:cloud-engineer','2139/01','DevOps engineers — cloud-infrastructure scope',null,true,true,1,'https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0825','2026-08-10'),
  ('UK:database-administrator','3133/01','Database administrators',null,true,true,1,'https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0795','2026-08-10'),
  ('UK:ict-support-technician','3132','IT user support technicians',null,true,true,1,'https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0120b','2026-08-10')
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
  ('UK:software-developer','entry_program','Skills England — Software Developer','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0116','official_training',null,1,'2026-08-10'),
  ('UK:software-developer','source','Home Office — Appendix Skilled Occupations','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','official_immigration',null,2,'2026-08-10'),
  ('UK:software-developer','source','MAC — Professionals in IT and engineering review','https://www.gov.uk/government/publications/professionals-in-it-and-engineering-review/professionals-in-it-and-engineering-accessible','official_shortage',null,3,'2026-08-10'),
  ('UK:data-analyst','entry_program','Skills England — Data Analyst','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0118','official_training',null,1,'2026-08-10'),
  ('UK:data-analyst','source','Home Office — Temporary Shortage List','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-worker','official_immigration',null,2,'2026-08-10'),
  ('UK:data-analyst','source','MAC — Temporary Shortage List Stage 2','https://www.gov.uk/government/publications/temporary-shortage-list-stage-2-report/temporary-shortage-list-stage-2-report-accessible','official_shortage',null,3,'2026-08-10'),
  ('UK:data-engineer','entry_program','Skills England — Data Engineer','https://skillsengland.education.gov.uk/occupations/OCC1386-v1-0','official_training',null,1,'2026-08-10'),
  ('UK:data-engineer','source','Home Office — Appendix Skilled Occupations','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','official_immigration',null,2,'2026-08-10'),
  ('UK:data-engineer','source','MAC — Professionals in IT and engineering review','https://www.gov.uk/government/publications/professionals-in-it-and-engineering-review/professionals-in-it-and-engineering-accessible','official_shortage',null,3,'2026-08-10'),
  ('UK:cybersecurity-analyst','entry_program','Skills England — Cyber Security Technician','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0865','official_training',null,1,'2026-08-10'),
  ('UK:cybersecurity-analyst','source','Home Office — Appendix Skilled Occupations','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','official_immigration',null,2,'2026-08-10'),
  ('UK:cybersecurity-analyst','source','MAC — Professionals in IT and engineering review','https://www.gov.uk/government/publications/professionals-in-it-and-engineering-review/professionals-in-it-and-engineering-accessible','official_shortage',null,3,'2026-08-10'),
  ('UK:network-administrator','entry_program','Skills England — Network Engineer','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0127','official_training',null,1,'2026-08-10'),
  ('UK:network-administrator','source','Home Office — Temporary Shortage List','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-worker','official_immigration',null,2,'2026-08-10'),
  ('UK:network-administrator','source','MAC — Temporary Shortage List Stage 2','https://www.gov.uk/government/publications/temporary-shortage-list-stage-2-report/temporary-shortage-list-stage-2-report-accessible','official_shortage',null,3,'2026-08-10'),
  ('UK:cloud-engineer','entry_program','Skills England — DevOps Engineer','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0825','official_training',null,1,'2026-08-10'),
  ('UK:cloud-engineer','source','Home Office — Appendix Skilled Occupations','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','official_immigration',null,2,'2026-08-10'),
  ('UK:cloud-engineer','source','MAC — Professionals in IT and engineering review','https://www.gov.uk/government/publications/professionals-in-it-and-engineering-review/professionals-in-it-and-engineering-accessible','official_shortage',null,3,'2026-08-10'),
  ('UK:database-administrator','entry_program','Skills England — Data Technician','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0795','official_training',null,1,'2026-08-10'),
  ('UK:database-administrator','source','Home Office — Temporary Shortage List','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-worker','official_immigration',null,2,'2026-08-10'),
  ('UK:database-administrator','source','MAC — Temporary Shortage List Stage 2','https://www.gov.uk/government/publications/temporary-shortage-list-stage-2-report/temporary-shortage-list-stage-2-report-accessible','official_shortage',null,3,'2026-08-10'),
  ('UK:ict-support-technician','entry_program','Skills England — Digital Support Technician','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0120b','official_training',null,1,'2026-08-10'),
  ('UK:ict-support-technician','source','Home Office — Temporary Shortage List','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-worker','official_immigration',null,2,'2026-08-10'),
  ('UK:ict-support-technician','source','MAC — Temporary Shortage List Stage 2','https://www.gov.uk/government/publications/temporary-shortage-list-stage-2-report/temporary-shortage-list-stage-2-report-accessible','official_shortage',null,3,'2026-08-10')
on conflict (profile_key,link_type,url) do update set
  label=excluded.label,
  provider_type=excluded.provider_type,
  region_code=excluded.region_code,
  sort_order=excluded.sort_order,
  source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_program_links (profile_key,program_ref,relation_type,source_checked_at) values
  ('UK:software-developer','uk-program:7e7dadd5-1276-1c94-b15f-87a34a9d4669','direct','2026-08-10'),
  ('UK:software-developer','uk-program:ea1cf170-e21a-d447-c259-295cd403c42e','direct','2026-08-10'),
  ('UK:data-analyst','uk-program:9a394047-6595-e613-16d1-b000ef51b69e','direct','2026-08-10'),
  ('UK:data-analyst','uk-program:3e9b3e10-9e9b-b5f1-88e3-580653c897fb','direct','2026-08-10'),
  ('UK:data-engineer','uk-program:b44ad204-2620-1121-ca0a-61eb9b2f9767','related','2026-08-10'),
  ('UK:cybersecurity-analyst','uk-program:54dc68b7-c18f-c42d-e343-1e2bfe0d853f','direct','2026-08-10'),
  ('UK:cybersecurity-analyst','uk-program:24ece78f-f68e-66f4-f2ad-8e0d7c40fb30','direct','2026-08-10'),
  ('UK:network-administrator','uk-program:d36c0912-f64d-fba2-d965-ac0a2607c83b','direct','2026-08-10'),
  ('UK:cloud-engineer','uk-program:0abefb6e-bd26-be4f-462a-d9bbfe29b688','direct','2026-08-10'),
  ('UK:database-administrator','uk-program:565132ac-b9c7-6c6f-0979-ff92b8029e20','direct','2026-08-10'),
  ('UK:ict-support-technician','uk-program:258710e8-84d2-55ce-30c9-94c34f8db43c','direct','2026-08-10')
on conflict (profile_key,program_ref) do update set
  relation_type=excluded.relation_type,
  source_checked_at=excluded.source_checked_at;
