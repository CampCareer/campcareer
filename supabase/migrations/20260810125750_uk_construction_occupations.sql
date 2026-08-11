-- United Kingdom construction occupation cohort: 8 canonical careers.
-- SOC 2020 mappings, current Home Office Skilled Worker access, MAC July 2026 shortage review,
-- and Skills England entry routes verified 2026-08-10.

insert into public.country_occupation_profiles (
  profile_key,country_code,canonical_career_id,official_title,official_code_system,official_code_version,
  official_unit_group_code,currency,registration_required,registration_authority,registration_url,
  publication_status,source_checked_at,updated_at
) values
  ('UK:carpenter','UK','carpenter','Carpenters and joiners','SOC','SOC 2020','5316','GBP',false,null,null,'profile_ready','2026-08-10',now()),
  ('UK:electrician','UK','electrician','Electricians and electrical fitters','SOC','SOC 2020','5241','GBP',false,null,null,'profile_ready','2026-08-10',now()),
  ('UK:plumber','UK','plumber','Plumbers and heating and ventilating installers and repairers','SOC','SOC 2020','5315','GBP',false,null,null,'profile_ready','2026-08-10',now()),
  ('UK:wall-floor-tiler','UK','wall-floor-tiler','Floorers and wall tilers','SOC','SOC 2020','5322','GBP',false,null,null,'profile_ready','2026-08-10',now()),
  ('UK:welder','UK','welder','Welding trades','SOC','SOC 2020','5213','GBP',false,null,null,'profile_ready','2026-08-10',now()),
  ('UK:bricklayer','UK','bricklayer','Bricklayers','SOC','SOC 2020','5313','GBP',false,null,null,'profile_ready','2026-08-10',now()),
  ('UK:hvac-technician','UK','hvac-technician','Air-conditioning and refrigeration installers and repairers','SOC','SOC 2020','5225','GBP',false,null,null,'profile_ready','2026-08-10',now()),
  ('UK:construction-manager','UK','construction-manager','Construction project managers and related professionals — construction site/project management scope','SOC','SOC 2020','2455','GBP',false,null,null,'profile_ready','2026-08-10',now())
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
  ('UK:carpenter','2026-08-10',69000,17.13,33400,10,0,0,0,15,4,0,10,5,44,'career-opportunity-uk-v1','provisional',
    jsonb_build_object('classification_scope','Canonical Carpenter maps to SOC 2020 5316 Carpenters and joiners.','shortage_note','MAC Stage 2 reports mixed and limited historical shortage evidence but strong future demand and recommends 18-month TSL access; shortage credit is capped at 10/20.','visa_basis','SOC 5316 is currently on the Immigration Salary List for all jobs, with the current listed removal date 31 December 2026; targeted route earns 10/10.','salary_method','Current Home Office ASHE-based standard going rate is GBP 33,400 / GBP 17.13 per hour; UK v1 salary band earns 4/10.','entry_basis','Skills England Level 2 Carpentry and Joinery apprenticeship provides a structured employer-based route.','entry_burden_basis','The occupation is not nationally regulated by Skills England; trade training and site competence remain required.'),'2026-08-10'),
  ('UK:electrician','2026-08-10',124000,19.90,38800,15,0,0,0,14,6,0,10,3,48,'career-opportunity-uk-v1','provisional',
    jsonb_build_object('classification_scope','Canonical Electrician maps to SOC 2020 5241 Electricians and electrical fitters.','shortage_note','MAC describes historical shortage evidence as relatively strong, with elevated job adverts and substantial future demand; 15/20.','visa_basis','SOC 5241 is on the current Temporary Shortage List; targeted route earns 10/10.','salary_method','Current TSL standard going rate is GBP 38,800 / GBP 19.90 per hour; UK v1 salary band earns 6/10.','entry_basis','Skills England Level 3 Installation and Maintenance Electrician apprenticeship is approved for delivery.','entry_burden_basis','No single occupational licence is recorded by Skills England, but electrical safety, building regulation and competence requirements are material.'),'2026-08-10'),
  ('UK:plumber','2026-08-10',71000,19.54,38100,10,0,0,0,14,6,0,10,4,44,'career-opportunity-uk-v1','provisional',
    jsonb_build_object('classification_scope','Canonical Plumber maps to SOC 2020 5315 Plumbers and heating and ventilating installers and repairers.','shortage_note','MAC reports mixed historical shortage evidence but credible forward-looking shortage risk and recommends 18-month access; 10/20.','visa_basis','SOC 5315 is on the current Temporary Shortage List; targeted route earns 10/10.','salary_method','Current TSL standard going rate is GBP 38,100 / GBP 19.54 per hour; UK v1 salary band earns 6/10.','entry_basis','Skills England Level 3 Plumbing and Domestic Heating Technician provides a structured apprenticeship route.','entry_burden_basis','Generic plumbing is not treated as one universal licence, but specialist gas, heating and other activities can carry additional competence requirements.'),'2026-08-10'),
  ('UK:wall-floor-tiler','2026-08-10',10000,17.13,33400,10,0,0,0,15,4,0,10,5,44,'career-opportunity-uk-v1','provisional',
    jsonb_build_object('classification_scope','Canonical Wall and Floor Tiler maps to SOC 2020 5322 Floorers and wall tilers.','shortage_note','MAC says historical shortage indicators are mixed but identifies a sizeable persistent supply-demand gap linked to housing and retrofit; 10/20.','visa_basis','SOC 5322 is on the current Temporary Shortage List; targeted route earns 10/10.','salary_method','Current TSL standard going rate is GBP 33,400 / GBP 17.13 per hour; UK v1 salary band earns 4/10.','entry_basis','Skills England Level 2 Wall and Floor Tiler apprenticeship is approved for delivery.','entry_burden_basis','Skills England treats the role as a technical occupation rather than a nationally regulated profession.'),'2026-08-10'),
  ('UK:welder','2026-08-10',46000,17.90,34900,20,0,0,0,15,4,0,10,5,54,'career-opportunity-uk-v1','provisional',
    jsonb_build_object('classification_scope','Canonical Welder maps to SOC 2020 5213 Welding trades.','shortage_note','MAC finds shortage evidence particularly in job adverts, with wage evidence above trend and future demand growth; maximum cohort shortage credit 20/20.','visa_basis','SOC 5213 is on the current Temporary Shortage List. The Immigration Salary List separately covers only experienced high-integrity pipe welders; generic profile visa credit is based on TSL access.','salary_method','Current TSL standard going rate is GBP 34,900 / GBP 17.90 per hour; UK v1 salary band earns 4/10.','entry_basis','Skills England Level 2 Welder apprenticeship is approved for delivery with progression to specialist plate or pipe welding.','entry_burden_basis','The occupation is not nationally regulated by Skills England, though project and sector certification can be demanding.'),'2026-08-10'),
  ('UK:bricklayer','2026-08-10',11000,17.13,33400,15,0,0,0,15,4,0,10,5,49,'career-opportunity-uk-v1','provisional',
    jsonb_build_object('classification_scope','Canonical Bricklayer maps directly to SOC 2020 5313 Bricklayers.','shortage_note','MAC assesses a moderate likelihood of shortage driven mainly by job advert and recent wage evidence; 15/20.','visa_basis','SOC 5313 is currently on the Immigration Salary List for all jobs, with the current listed removal date 31 December 2026; targeted route earns 10/10.','salary_method','Current Home Office ASHE-based standard going rate is GBP 33,400 / GBP 17.13 per hour; UK v1 salary band earns 4/10.','entry_basis','Skills England Level 2 Bricklayer apprenticeship is an approved structured entry route.','entry_burden_basis','Skills England does not classify Bricklayer as a regulated occupation.'),'2026-08-10'),
  ('UK:hvac-technician','2026-08-10',7000,21.08,41100,0,0,0,0,13,8,0,10,3,34,'career-opportunity-uk-v1','provisional',
    jsonb_build_object('classification_scope','Canonical HVAC Technician is constrained to SOC 2020 5225 Air-conditioning and refrigeration installers and repairers, excluding broader plumbing/heating SOC 5315.','shortage_note','MAC finds no signs of historical shortage and recommends no future TSL access despite substantial forecast demand; 0/20.','visa_basis','SOC 5225 remains on the current Temporary Shortage List, so current targeted access earns 10/10 despite the separate future recommendation.','salary_method','Current TSL standard going rate is GBP 41,100 / GBP 21.08 per hour; UK v1 salary band earns 8/10.','entry_basis','Skills England Level 3 Refrigeration Air Conditioning and Heat Pump Engineering Technician apprenticeship is approved for delivery.','entry_burden_basis','The apprenticeship requires F Gas and ODS Regulations Category 1 plus refrigeration qualifications, creating a meaningful competence burden even though Skills England labels the occupation itself unregulated.'),'2026-08-10'),
  ('UK:construction-manager','2026-08-10',null,22.72,44300,0,0,0,0,6,10,0,5,4,25,'career-opportunity-uk-v1','provisional',
    jsonb_build_object('classification_scope','Canonical Construction Manager uses SOC 2020 2455 Construction project managers and related professionals, aligned to Skills England Construction Site Management and excluding SOC 1122 production managers/directors.','shortage_note','No direct occupation-specific shortage component is awarded from general construction-sector demand alone.','visa_basis','SOC 2455 is RQF 6+ and eligible under the standard Skilled Worker route, but this scoped occupation has no current all-jobs TSL or ISL treatment; partial visa credit 5/10.','salary_method','Current Skilled Occupations standard going rate is GBP 44,300 / GBP 22.72 per hour; UK v1 salary band earns 10/10.','entry_basis','Skills England Construction Site Management is a Level 6 professional occupation with an approved degree apprenticeship; the role is not treated as direct-entry.','entry_burden_basis','There is no one statutory UK construction-manager licence, but degree-level preparation, experience and employer/professional competence requirements are substantial.'),'2026-08-10')
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
  ('UK:carpenter','5316','Carpenters and joiners',null,true,true,1,'https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-immigration-salary-list','2026-08-10'),
  ('UK:electrician','5241','Electricians and electrical fitters',null,true,true,1,'https://www.gov.uk/government/publications/skilled-worker-visa-temporary-shortage-list/skilled-worker-visa-temporary-shortage-list','2026-08-10'),
  ('UK:plumber','5315','Plumbers and heating and ventilating installers and repairers',null,true,true,1,'https://www.gov.uk/government/publications/skilled-worker-visa-temporary-shortage-list/skilled-worker-visa-temporary-shortage-list','2026-08-10'),
  ('UK:wall-floor-tiler','5322','Floorers and wall tilers',null,true,true,1,'https://www.gov.uk/government/publications/skilled-worker-visa-temporary-shortage-list/skilled-worker-visa-temporary-shortage-list','2026-08-10'),
  ('UK:welder','5213','Welding trades',null,true,true,1,'https://www.gov.uk/government/publications/skilled-worker-visa-temporary-shortage-list/skilled-worker-visa-temporary-shortage-list','2026-08-10'),
  ('UK:bricklayer','5313','Bricklayers',null,true,true,1,'https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-immigration-salary-list','2026-08-10'),
  ('UK:hvac-technician','5225','Air-conditioning and refrigeration installers and repairers',null,true,true,1,'https://www.gov.uk/government/publications/skilled-worker-visa-temporary-shortage-list/skilled-worker-visa-temporary-shortage-list','2026-08-10'),
  ('UK:construction-manager','2455','Construction project managers and related professionals — construction site/project management scope',null,true,true,1,'https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','2026-08-10')
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
  ('UK:carpenter','entry_program','Skills England — Carpentry and Joinery apprenticeship','https://skillsengland.education.gov.uk/apprenticeship-standards/ST0264','official_training',null,1,'2026-08-10'),
  ('UK:carpenter','source','Home Office — Immigration Salary List','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-immigration-salary-list','official_immigration',null,2,'2026-08-10'),
  ('UK:carpenter','source','MAC — Temporary Shortage List Stage 2','https://www.gov.uk/government/publications/temporary-shortage-list-stage-2-report/temporary-shortage-list-stage-2-report-accessible','official_shortage',null,3,'2026-08-10'),
  ('UK:electrician','entry_program','Skills England — Installation and Maintenance Electrician apprenticeship','https://skillsengland.education.gov.uk/apprenticeships/st0152-v1-2','official_training',null,1,'2026-08-10'),
  ('UK:electrician','source','Home Office — Temporary Shortage List','https://www.gov.uk/government/publications/skilled-worker-visa-temporary-shortage-list/skilled-worker-visa-temporary-shortage-list','official_immigration',null,2,'2026-08-10'),
  ('UK:electrician','source','MAC — Temporary Shortage List Stage 2','https://www.gov.uk/government/publications/temporary-shortage-list-stage-2-report/temporary-shortage-list-stage-2-report-accessible','official_shortage',null,3,'2026-08-10'),
  ('UK:plumber','entry_program','Skills England — Plumbing and Domestic Heating Technician','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0303G','official_training',null,1,'2026-08-10'),
  ('UK:plumber','source','Home Office — Temporary Shortage List','https://www.gov.uk/government/publications/skilled-worker-visa-temporary-shortage-list/skilled-worker-visa-temporary-shortage-list','official_immigration',null,2,'2026-08-10'),
  ('UK:plumber','source','MAC — Temporary Shortage List Stage 2','https://www.gov.uk/government/publications/temporary-shortage-list-stage-2-report/temporary-shortage-list-stage-2-report-accessible','official_shortage',null,3,'2026-08-10'),
  ('UK:wall-floor-tiler','entry_program','Skills England — Wall and Floor Tiler apprenticeship','https://skillsengland.education.gov.uk/apprenticeships/st0368-v1-4','official_training',null,1,'2026-08-10'),
  ('UK:wall-floor-tiler','source','Home Office — Temporary Shortage List','https://www.gov.uk/government/publications/skilled-worker-visa-temporary-shortage-list/skilled-worker-visa-temporary-shortage-list','official_immigration',null,2,'2026-08-10'),
  ('UK:wall-floor-tiler','source','MAC — Temporary Shortage List Stage 2','https://www.gov.uk/government/publications/temporary-shortage-list-stage-2-report/temporary-shortage-list-stage-2-report-accessible','official_shortage',null,3,'2026-08-10'),
  ('UK:welder','entry_program','Skills England — Welder','https://skillsengland.education.gov.uk/occupations/OCC0349','official_training',null,1,'2026-08-10'),
  ('UK:welder','source','Home Office — Temporary Shortage List','https://www.gov.uk/government/publications/skilled-worker-visa-temporary-shortage-list/skilled-worker-visa-temporary-shortage-list','official_immigration',null,2,'2026-08-10'),
  ('UK:welder','source','MAC — Temporary Shortage List Stage 2','https://www.gov.uk/government/publications/temporary-shortage-list-stage-2-report/temporary-shortage-list-stage-2-report-accessible','official_shortage',null,3,'2026-08-10'),
  ('UK:bricklayer','entry_program','Skills England — Bricklayer','https://skillsengland.education.gov.uk/occupations/OCC0095','official_training',null,1,'2026-08-10'),
  ('UK:bricklayer','source','Home Office — Immigration Salary List','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-immigration-salary-list','official_immigration',null,2,'2026-08-10'),
  ('UK:bricklayer','source','MAC — Temporary Shortage List Stage 2','https://www.gov.uk/government/publications/temporary-shortage-list-stage-2-report/temporary-shortage-list-stage-2-report-accessible','official_shortage',null,3,'2026-08-10'),
  ('UK:hvac-technician','entry_program','Skills England — Refrigeration Air Conditioning and Heat Pump Engineering Technician','https://skillsengland.education.gov.uk/apprenticeships/st0322-v1-3','official_training',null,1,'2026-08-10'),
  ('UK:hvac-technician','source','Home Office — Temporary Shortage List','https://www.gov.uk/government/publications/skilled-worker-visa-temporary-shortage-list/skilled-worker-visa-temporary-shortage-list','official_immigration',null,2,'2026-08-10'),
  ('UK:hvac-technician','source','MAC — Temporary Shortage List Stage 2','https://www.gov.uk/government/publications/temporary-shortage-list-stage-2-report/temporary-shortage-list-stage-2-report-accessible','official_shortage',null,3,'2026-08-10'),
  ('UK:construction-manager','entry_program','Skills England — Construction Site Management degree apprenticeship','https://skillsengland.education.gov.uk/apprenticeship-standards/st0047-v1-0','official_training',null,1,'2026-08-10'),
  ('UK:construction-manager','source','Home Office — Appendix Skilled Occupations','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','official_immigration',null,2,'2026-08-10')
on conflict (profile_key,link_type,url) do update set
  label=excluded.label,
  provider_type=excluded.provider_type,
  region_code=excluded.region_code,
  sort_order=excluded.sort_order,
  source_checked_at=excluded.source_checked_at;
