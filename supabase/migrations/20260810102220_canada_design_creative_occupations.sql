-- Canada Design & Creative occupation cohort: 8 canonical careers.
-- Current 2026 Express Entry occupation categories do not include the NOCs in this cohort.

insert into public.country_occupation_profiles (
  profile_key,country_code,canonical_career_id,official_title,official_code_system,official_code_version,
  official_unit_group_code,currency,registration_required,registration_authority,registration_url,
  publication_status,source_checked_at,updated_at
) values
  ('CA:graphic-designer','CA','graphic-designer','Graphic designers and illustrators — Graphic Designer','NOC','2021 Version 1.0','52120','CAD',false,null,null,'profile_ready','2026-08-10',now()),
  ('CA:ux-designer','CA','ux-designer','Graphic designers and illustrators — User Experience Designer','NOC','2021 Version 1.0','52120','CAD',false,null,null,'profile_ready','2026-08-10',now()),
  ('CA:multimedia-designer','CA','multimedia-designer','Graphic designers and illustrators — Multimedia Designer','NOC','2021 Version 1.0','52120','CAD',false,null,null,'profile_ready','2026-08-10',now()),
  ('CA:animator','CA','animator','Graphic designers and illustrators — Animator - animated films','NOC','2021 Version 1.0','52120','CAD',false,null,null,'profile_ready','2026-08-10',now()),
  ('CA:interior-designer','CA','interior-designer','Interior designers and interior decorators — Interior Designer','NOC','2021 Version 1.0','52121','CAD',true,'Provincial interior design institutes and associations','https://www.jobbank.gc.ca/marketreport/requirements/5759/ca','profile_ready','2026-08-10',now()),
  ('CA:film-editor','CA','film-editor','Producers, directors, choreographers and related occupations — Film Editor','NOC','2021 Version 1.0','51120','CAD',false,null,null,'profile_ready','2026-08-10',now()),
  ('CA:architect','CA','architect','Architects','NOC','2021 Version 1.0','21200','CAD',true,'Provincial architectural regulatory bodies','https://www.jobbank.gc.ca/marketreport/requirements/17867/ca','profile_ready','2026-08-10',now()),
  ('CA:web-designer','CA','web-designer','Web designers','NOC','2021 Version 1.0','21233','CAD',false,null,null,'profile_ready','2026-08-10',now())
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
  ('CA:graphic-designer','2025-11-19',null,31.25,0,0,0,0,14,6,0,0,4,24,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Graphic Designer is an official title within broader NOC 52120 Graphic designers and illustrators.','shortage_note','COPS classifies NOC 52120 as STRONG RISK OF SURPLUS over 2024-2033, so no shortage credit is awarded.','visa_basis','NOC 52120 is not in a current 2026 Express Entry occupation category.','entry_level_basis','College or university design study plus a portfolio is the normal route.','salary_method','Job Bank Graphic Designer national median hourly wage CAD 31.25 earns 6/10.','employment_scope','The broader NOC employment count is shared with illustration, UX, multimedia and animation titles and is not published as a graphic-designer-only total.'),'2026-08-10'),
  ('CA:ux-designer','2025-11-19',null,31.25,0,0,0,0,14,6,0,0,5,25,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','User Experience Designer is an explicit example title inside NOC 52120, not NOC 21233 Web designers.','shortage_note','COPS classifies NOC 52120 as STRONG RISK OF SURPLUS over 2024-2033, so no shortage credit is awarded.','visa_basis','NOC 52120 is not in a current 2026 Express Entry occupation category.','salary_method','Job Bank User Experience Designer national median hourly wage CAD 31.25 earns 6/10.','employment_scope','No shared NOC employment total is presented as a UX-only count.'),'2026-08-10'),
  ('CA:multimedia-designer','2025-11-19',null,31.25,0,0,0,0,14,6,0,0,5,25,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Multimedia Designer uses multimedia and interactive-media design titles within NOC 52120.','shortage_note','COPS classifies NOC 52120 as STRONG RISK OF SURPLUS over 2024-2033, so no shortage credit is awarded.','visa_basis','NOC 52120 is not in a current 2026 Express Entry occupation category.','salary_method','Job Bank multimedia graphic-design national median hourly wage CAD 31.25 earns 6/10.','employment_scope','No shared NOC employment total is presented as a multimedia-designer-only count.'),'2026-08-10'),
  ('CA:animator','2025-11-19',null,31.25,0,0,0,0,12,6,0,0,4,22,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Animator - animated films is an explicit title within NOC 52120 Graphic designers and illustrators.','shortage_note','COPS classifies NOC 52120 as STRONG RISK OF SURPLUS over 2024-2033, so no shortage credit is awarded.','visa_basis','NOC 52120 is not in a current 2026 Express Entry occupation category.','entry_level_basis','Formal art/design or multimedia training and a strong portfolio are normally required, so entry credit is conservative.','salary_method','Job Bank Animator - animated films national median hourly wage CAD 31.25 earns 6/10.','employment_scope','The broad NOC employment total is not presented as animator-only.'),'2026-08-10'),
  ('CA:interior-designer','2025-11-19',null,28.85,0,0,0,0,10,4,0,0,2,16,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Interior Designer is a title within NOC 52121 Interior designers and interior decorators.','shortage_note','COPS projects NOC 52121 to remain BALANCED nationally over 2024-2033.','visa_basis','NOC 52121 is not in a current 2026 Express Entry occupation category.','registration_basis','Job Bank states protected interior-designer titles require provincial certification in all provinces except Prince Edward Island; NCIDQ may also be required.','salary_method','Job Bank Interior Designer national median hourly wage CAD 28.85 earns 4/10.','employment_scope','The 32,900-worker NOC total also includes interior decorators and is not published as an Interior Designer-only count.'),'2026-08-10'),
  ('CA:film-editor','2025-11-19',null,41.03,0,0,0,0,8,10,0,0,4,22,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Film Editor is an explicit title within broader NOC 51120 Producers, directors, choreographers and related occupations.','shortage_note','COPS classifies NOC 51120 as MODERATE RISK OF SURPLUS over 2024-2033, so no shortage credit is awarded.','visa_basis','NOC 51120 is not in a current 2026 Express Entry occupation category.','entry_level_basis','Job Bank usually requires relevant post-secondary study plus technical or production experience.','salary_method','Job Bank Film Editor national median hourly wage CAD 41.03 earns 10/10.','employment_scope','The broader NOC employment total is not presented as film-editor-only.'),'2026-08-10'),
  ('CA:architect','2025-11-19',26900,38.94,0,0,0,0,8,8,0,0,1,17,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Architect maps directly to NOC 21200 Architects.','shortage_note','COPS projects NOC 21200 to remain BALANCED nationally over 2024-2033.','visa_basis','NOC 21200 is not present in the current 2026 Express Entry STEM occupation table.','registration_basis','Accredited education or the RAIC route, supervised internship, registration examination and provincial registration are required.','salary_method','Current Job Bank Architect national median hourly wage CAD 38.94 earns 8/10.','employment_scope','Job Bank/COPS reports 26,900 workers in 2023.'),'2026-08-10'),
  ('CA:web-designer','2025-11-19',13100,33.65,0,0,0,0,10,6,0,0,5,21,'career-opportunity-ca-v1','provisional',
    jsonb_build_object('classification_scope','Web Designer maps directly to NOC 21233 Web designers.','shortage_note','COPS projects NOC 21233 to remain BALANCED nationally over 2024-2033.','visa_basis','NOC 21233 is not present in the current 2026 Express Entry STEM occupation table.','registration_basis','Job Bank records Web Designer as not regulated in Canada.','entry_level_basis','A bachelor degree or college programme plus graphic-design experience is normally required.','salary_method','Job Bank Web Designer national median hourly wage CAD 33.65 earns 6/10.','employment_scope','Job Bank/COPS reports 13,100 workers in 2023.'),'2026-08-10')
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
  ('CA:graphic-designer','52120','Graphic designers and illustrators — Graphic Designer',null,false,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=52120&version=2021.0','2026-08-10'),
  ('CA:ux-designer','52120','Graphic designers and illustrators — User Experience Designer',null,false,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=52120&version=2021.0','2026-08-10'),
  ('CA:multimedia-designer','52120','Graphic designers and illustrators — Multimedia Designer',null,false,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=52120&version=2021.0','2026-08-10'),
  ('CA:animator','52120','Graphic designers and illustrators — Animator - animated films',null,false,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=52120&version=2021.0','2026-08-10'),
  ('CA:interior-designer','52121','Interior designers and interior decorators — Interior Designer',null,false,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=52121&version=2021.0','2026-08-10'),
  ('CA:film-editor','51120','Producers, directors, choreographers and related occupations — Film Editor',null,false,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=51120&version=2021.0','2026-08-10'),
  ('CA:architect','21200','Architects',null,false,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=21200&version=2021.0','2026-08-10'),
  ('CA:web-designer','21233','Web designers',null,false,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=21233&version=2021.0','2026-08-10')
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
  ('CA:graphic-designer','job_search','Job Bank — Graphic Designer in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/5703/ca','official_job_board',null,1,'2026-08-10'),
  ('CA:ux-designer','job_search','Job Bank — User Experience Designer in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/26533/ca','official_job_board',null,1,'2026-08-10'),
  ('CA:multimedia-designer','job_search','Job Bank — Graphic Designer - Multimedia in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/5728/ca','official_job_board',null,1,'2026-08-10'),
  ('CA:animator','job_search','Job Bank — Animator - Animated Films in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/5683/ca','official_job_board',null,1,'2026-08-10'),
  ('CA:interior-designer','job_search','Job Bank — Interior Designer in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/5759/ca','official_job_board',null,1,'2026-08-10'),
  ('CA:film-editor','job_search','Job Bank — Film Editor in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/5379/ca','official_job_board',null,1,'2026-08-10'),
  ('CA:architect','job_search','Job Bank — Architect in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/17867/ca','official_job_board',null,1,'2026-08-10'),
  ('CA:web-designer','job_search','Job Bank — Web Designer in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/17898/ca','official_job_board',null,1,'2026-08-10'),
  ('CA:interior-designer','source','Job Bank — Interior Designer requirements','https://www.jobbank.gc.ca/marketreport/requirements/5759/ca','official_regulator_context',null,2,'2026-08-10'),
  ('CA:architect','source','Job Bank — Architect requirements','https://www.jobbank.gc.ca/marketreport/requirements/17867/ca','official_regulator_context',null,2,'2026-08-10'),
  ('CA:web-designer','source','Job Bank — Web Designer requirements','https://www.jobbank.gc.ca/marketreport/requirements/17898/ca','official_regulator_context',null,2,'2026-08-10'),
  ('CA:graphic-designer','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,2,'2026-08-10'),
  ('CA:ux-designer','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,2,'2026-08-10'),
  ('CA:multimedia-designer','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,2,'2026-08-10'),
  ('CA:animator','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,2,'2026-08-10'),
  ('CA:interior-designer','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,3,'2026-08-10'),
  ('CA:film-editor','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,2,'2026-08-10'),
  ('CA:architect','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,3,'2026-08-10'),
  ('CA:web-designer','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,3,'2026-08-10')
on conflict (profile_key,link_type,url) do update set
  label=excluded.label,
  provider_type=excluded.provider_type,
  region_code=excluded.region_code,
  sort_order=excluded.sort_order,
  source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_program_links (profile_key,program_ref,relation_type,source_checked_at) values
  ('CA:graphic-designer','ca-program:179','direct','2026-08-10'),
  ('CA:graphic-designer','ca-program:1214','direct','2026-08-10'),
  ('CA:ux-designer','ca-program:84','direct','2026-08-10'),
  ('CA:ux-designer','ca-program:2078','direct','2026-08-10'),
  ('CA:multimedia-designer','ca-program:198','direct','2026-08-10'),
  ('CA:multimedia-designer','ca-program:1248','direct','2026-08-10'),
  ('CA:animator','ca-program:94','direct','2026-08-10'),
  ('CA:animator','ca-program:1125','direct','2026-08-10'),
  ('CA:interior-designer','ca-program:180','direct','2026-08-10'),
  ('CA:interior-designer','ca-program:1343','direct','2026-08-10'),
  ('CA:film-editor','ca-program:238','direct','2026-08-10'),
  ('CA:architect','ca-program:6653','direct','2026-08-10'),
  ('CA:web-designer','ca-program:1643','direct','2026-08-10')
on conflict (profile_key,program_ref) do update set
  relation_type=excluded.relation_type,
  source_checked_at=excluded.source_checked_at;
