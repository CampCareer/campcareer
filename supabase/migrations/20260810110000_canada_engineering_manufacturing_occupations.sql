-- Canada Engineering & Manufacturing occupation cohort: 8 canonical careers.
-- Current STEM category includes 21300, 21301, 21310, 21321, 22300, 22301 and 22310 from this cohort.
-- Chemical engineers 21320 and industrial/manufacturing technologists and technicians 22302 are not in the current STEM table.

insert into public.country_occupation_profiles (
  profile_key,country_code,canonical_career_id,official_title,official_code_system,official_code_version,
  official_unit_group_code,currency,registration_required,registration_authority,registration_url,
  publication_status,source_checked_at,updated_at
) values
  ('CA:civil-engineer','CA','civil-engineer','Civil engineers','NOC','2021 Version 1.0','21300','CAD',true,'Provincial and territorial engineering regulators','https://engineerscanada.ca/become-an-engineer/overview-of-licensing-process','profile_ready','2026-08-09',now()),
  ('CA:mechanical-engineer','CA','mechanical-engineer','Mechanical engineers','NOC','2021 Version 1.0','21301','CAD',true,'Provincial and territorial engineering regulators','https://engineerscanada.ca/become-an-engineer/overview-of-licensing-process','profile_ready','2026-08-09',now()),
  ('CA:electrical-engineer','CA','electrical-engineer','Electrical and electronics engineers','NOC','2021 Version 1.0','21310','CAD',true,'Provincial and territorial engineering regulators','https://engineerscanada.ca/become-an-engineer/overview-of-licensing-process','profile_ready','2026-08-09',now()),
  ('CA:manufacturing-engineer','CA','manufacturing-engineer','Industrial and manufacturing engineers','NOC','2021 Version 1.0','21321','CAD',true,'Provincial and territorial engineering regulators','https://engineerscanada.ca/become-an-engineer/overview-of-licensing-process','profile_ready','2026-08-09',now()),
  ('CA:industrial-engineer','CA','industrial-engineer','Industrial and manufacturing engineers','NOC','2021 Version 1.0','21321','CAD',true,'Provincial and territorial engineering regulators','https://engineerscanada.ca/become-an-engineer/overview-of-licensing-process','profile_ready','2026-08-09',now()),
  ('CA:chemical-engineer','CA','chemical-engineer','Chemical engineers','NOC','2021 Version 1.0','21320','CAD',true,'Provincial and territorial engineering regulators','https://engineerscanada.ca/become-an-engineer/overview-of-licensing-process','profile_ready','2026-08-09',now()),
  ('CA:environmental-engineer','CA','environmental-engineer','Civil engineers','NOC','2021 Version 1.0','21300','CAD',true,'Provincial and territorial engineering regulators','https://engineerscanada.ca/become-an-engineer/overview-of-licensing-process','profile_ready','2026-08-09',now()),
  ('CA:engineering-technician','CA','engineering-technician','Engineering technologists and technicians (multi-NOC umbrella)','NOC','2021 Version 1.0','22300/22301/22302/22310','CAD',false,null,null,'profile_ready','2026-08-09',now())
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
  ('CA:civil-engineer','2025-11-19',null,48.56,15,0,0,0,12,10,0,10,2,49,'career-opportunity-ca-v1','provisional',
    jsonb_build_object(
      'classification_scope','Exact NOC 21300 Civil engineers.',
      'shortage_note','Reviewed Canada labour snapshot classifies NOC 21300 as MODERATE RISK OF SHORTAGE over the long-term projection period, earning 15/20.',
      'visa_basis','NOC 21300 is in the current Express Entry STEM occupations category, earning 10/10.',
      'registration_basis','Professional engineering practice and protected engineer title use are regulated by provincial and territorial engineering regulators.',
      'salary_method','Job Bank national median hourly wage CAD 48.56 earns 10/10.',
      'vacancy_scope','Current Job Bank postings are point-in-time and do not earn vacancy-intensity or trend credit.'
    ),'2026-08-09'),
  ('CA:mechanical-engineer','2025-11-19',null,45.67,15,0,0,0,12,10,0,10,2,49,'career-opportunity-ca-v1','provisional',
    jsonb_build_object(
      'classification_scope','Exact NOC 21301 Mechanical engineers.',
      'shortage_note','Reviewed Canada labour snapshot classifies NOC 21301 as MODERATE RISK OF SHORTAGE, earning 15/20.',
      'visa_basis','NOC 21301 is in the current Express Entry STEM occupations category.',
      'registration_basis','Professional engineering practice and engineer title use are regulated provincially and territorially.',
      'salary_method','Job Bank national median hourly wage CAD 45.67 earns 10/10.'
    ),'2026-08-09'),
  ('CA:electrical-engineer','2025-11-19',null,50.67,15,0,0,0,12,10,0,10,2,49,'career-opportunity-ca-v1','provisional',
    jsonb_build_object(
      'classification_scope','Exact NOC 21310 Electrical and electronics engineers.',
      'shortage_note','Reviewed Canada labour snapshot classifies NOC 21310 as MODERATE RISK OF SHORTAGE, earning 15/20.',
      'visa_basis','NOC 21310 is in the current Express Entry STEM occupations category.',
      'registration_basis','Professional engineering practice and engineer title use are regulated provincially and territorially.',
      'salary_method','Job Bank national median hourly wage CAD 50.67 earns 10/10.'
    ),'2026-08-09'),
  ('CA:manufacturing-engineer','2025-11-19',null,44.23,10,0,0,0,12,10,0,10,2,44,'career-opportunity-ca-v1','provisional',
    jsonb_build_object(
      'classification_scope','Canonical Manufacturing Engineer is narrower than combined NOC 21321 Industrial and manufacturing engineers.',
      'shortage_note','NOC 21321 has a moderate shortage signal; canonical shortage credit is capped at 10/20 because the evidence covers the combined unit group.',
      'visa_basis','NOC 21321 is in the current Express Entry STEM occupations category.',
      'registration_basis','Professional engineering practice and engineer title use are regulated provincially and territorially.',
      'salary_method','Shared NOC 21321 Job Bank national median hourly wage CAD 44.23 earns 10/10.'
    ),'2026-08-09'),
  ('CA:industrial-engineer','2025-11-19',null,44.23,10,0,0,0,12,10,0,10,2,44,'career-opportunity-ca-v1','provisional',
    jsonb_build_object(
      'classification_scope','Canonical Industrial Engineer is a title within combined NOC 21321 Industrial and manufacturing engineers.',
      'shortage_note','NOC 21321 has a moderate shortage signal; canonical shortage credit is capped at 10/20 because the evidence covers both industrial and manufacturing engineers.',
      'visa_basis','NOC 21321 is in the current Express Entry STEM occupations category.',
      'registration_basis','Professional engineering practice and engineer title use are regulated provincially and territorially.',
      'salary_method','Shared NOC 21321 Job Bank national median hourly wage CAD 44.23 earns 10/10.'
    ),'2026-08-09'),
  ('CA:chemical-engineer','2025-11-19',null,51.92,0,0,0,0,12,10,0,0,2,24,'career-opportunity-ca-v1','provisional',
    jsonb_build_object(
      'classification_scope','Exact NOC 21320 Chemical engineers.',
      'shortage_note','Reviewed Canada labour snapshot classifies NOC 21320 as BALANCE, so no shortage credit is awarded.',
      'visa_basis','NOC 21320 is not in the current Express Entry STEM occupations category.',
      'registration_basis','Professional engineering practice and engineer title use are regulated provincially and territorially.',
      'salary_method','Job Bank national median hourly wage CAD 51.92 earns 10/10.'
    ),'2026-08-09'),
  ('CA:environmental-engineer','2025-11-19',null,48.56,10,0,0,0,12,10,0,10,2,44,'career-opportunity-ca-v1','provisional',
    jsonb_build_object(
      'classification_scope','Environmental Engineer is a narrower official title within NOC 21300 Civil engineers.',
      'shortage_note','NOC 21300 has a moderate shortage signal; Environmental Engineer receives capped 10/20 shortage credit because the signal is broader than the canonical title.',
      'visa_basis','NOC 21300 is in the current Express Entry STEM occupations category.',
      'registration_basis','Professional engineering practice and engineer title use are regulated provincially and territorially.',
      'salary_method','Job Bank Environmental Engineer national median hourly wage CAD 48.56 earns 10/10.'
    ),'2026-08-09'),
  ('CA:engineering-technician','2025-11-19',null,null,10,0,0,0,15,0,0,7,4,36,'career-opportunity-ca-v1','provisional',
    jsonb_build_object(
      'classification_scope','Canonical Engineering Technician is a multi-NOC umbrella spanning 22300, 22301, 22302 and 22310; no single NOC is presented as the whole occupation.',
      'shortage_note','Reviewed national evidence is moderate shortage for 22300, 22301 and 22310 but balance for 22302, so umbrella shortage credit is capped at 10/20.',
      'visa_basis','Current STEM eligibility includes 22300, 22301 and 22310 but not 22302; umbrella visa credit is partial at 7/10.',
      'salary_method','No synthetic umbrella wage is calculated across unlike technician disciplines, so salary remains unscored.',
      'registration_basis','The umbrella is not treated as one nationally licensed P.Eng. occupation; technician and technologist certification rules vary by province and discipline.'
    ),'2026-08-09')
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
  ('CA:civil-engineer','21300','Civil engineers',null,true,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=21300&version=2021.0','2026-08-09'),
  ('CA:mechanical-engineer','21301','Mechanical engineers',null,true,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=21301&version=2021.0','2026-08-09'),
  ('CA:electrical-engineer','21310','Electrical and electronics engineers',null,true,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=21310&version=2021.0','2026-08-09'),
  ('CA:manufacturing-engineer','21321','Industrial and manufacturing engineers',null,true,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=21321&version=2021.0','2026-08-09'),
  ('CA:industrial-engineer','21321','Industrial and manufacturing engineers',null,true,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=21321&version=2021.0','2026-08-09'),
  ('CA:chemical-engineer','21320','Chemical engineers',null,false,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=21320&version=2021.0','2026-08-09'),
  ('CA:environmental-engineer','21300','Civil engineers — Environmental engineer title',null,true,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=21300&version=2021.0','2026-08-09'),
  ('CA:engineering-technician','22300','Civil engineering technologists and technicians',null,true,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=22300&version=2021.0','2026-08-09'),
  ('CA:engineering-technician','22301','Mechanical engineering technologists and technicians',null,true,true,2,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=22301&version=2021.0','2026-08-09'),
  ('CA:engineering-technician','22302','Industrial engineering and manufacturing technologists and technicians',null,false,true,3,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=22302&version=2021.0','2026-08-09'),
  ('CA:engineering-technician','22310','Electrical and electronics engineering technologists and technicians',null,true,true,4,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=22310&version=2021.0','2026-08-09')
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
  ('CA:civil-engineer','job_search','Job Bank — Civil Engineer in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/22376/ca','official_job_board',null,1,'2026-08-09'),
  ('CA:mechanical-engineer','job_search','Job Bank — Mechanical Engineer in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/2757/ca','official_job_board',null,1,'2026-08-09'),
  ('CA:electrical-engineer','job_search','Job Bank — Electrical Engineer in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/17815/ca','official_job_board',null,1,'2026-08-09'),
  ('CA:manufacturing-engineer','job_search','Job Bank — Industrial and Manufacturing Engineers in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/22441/ca','official_job_board',null,1,'2026-08-09'),
  ('CA:industrial-engineer','job_search','Job Bank — Industrial Engineer in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/22441/ca','official_job_board',null,1,'2026-08-09'),
  ('CA:chemical-engineer','job_search','Job Bank — Chemical Engineer in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/2789/ca','official_job_board',null,1,'2026-08-09'),
  ('CA:environmental-engineer','job_search','Job Bank — Environmental Engineer in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/22386/ca','official_job_board',null,1,'2026-08-09'),
  ('CA:engineering-technician','source','COPS — Canadian occupational projections','https://occupations.esdc.gc.ca/sppc-cops/','official_labour_market',null,1,'2026-08-09'),
  ('CA:civil-engineer','source','Engineers Canada — licensing process','https://engineerscanada.ca/become-an-engineer/overview-of-licensing-process','official_regulator_network',null,1,'2026-08-09'),
  ('CA:mechanical-engineer','source','Engineers Canada — licensing process','https://engineerscanada.ca/become-an-engineer/overview-of-licensing-process','official_regulator_network',null,1,'2026-08-09'),
  ('CA:electrical-engineer','source','Engineers Canada — licensing process','https://engineerscanada.ca/become-an-engineer/overview-of-licensing-process','official_regulator_network',null,1,'2026-08-09'),
  ('CA:manufacturing-engineer','source','Engineers Canada — licensing process','https://engineerscanada.ca/become-an-engineer/overview-of-licensing-process','official_regulator_network',null,1,'2026-08-09'),
  ('CA:industrial-engineer','source','Engineers Canada — licensing process','https://engineerscanada.ca/become-an-engineer/overview-of-licensing-process','official_regulator_network',null,1,'2026-08-09'),
  ('CA:chemical-engineer','source','Engineers Canada — licensing process','https://engineerscanada.ca/become-an-engineer/overview-of-licensing-process','official_regulator_network',null,1,'2026-08-09'),
  ('CA:environmental-engineer','source','Engineers Canada — licensing process','https://engineerscanada.ca/become-an-engineer/overview-of-licensing-process','official_regulator_network',null,1,'2026-08-09'),
  ('CA:civil-engineer','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,2,'2026-08-09'),
  ('CA:mechanical-engineer','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,2,'2026-08-09'),
  ('CA:electrical-engineer','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,2,'2026-08-09'),
  ('CA:manufacturing-engineer','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,2,'2026-08-09'),
  ('CA:industrial-engineer','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,2,'2026-08-09'),
  ('CA:chemical-engineer','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,2,'2026-08-09'),
  ('CA:environmental-engineer','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,2,'2026-08-09'),
  ('CA:engineering-technician','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,2,'2026-08-09')
on conflict (profile_key,link_type,url) do update set
  label=excluded.label,
  provider_type=excluded.provider_type,
  sort_order=excluded.sort_order,
  source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_program_links (profile_key,program_ref,relation_type,source_checked_at) values
  ('CA:civil-engineer','ca-program:193','direct','2026-08-09'),
  ('CA:mechanical-engineer','ca-program:5249','direct','2026-08-09'),
  ('CA:electrical-engineer','ca-program:5247','direct','2026-08-09'),
  ('CA:manufacturing-engineer','ca-program:5248','common_pathway','2026-08-09'),
  ('CA:industrial-engineer','ca-program:5248','direct','2026-08-09'),
  ('CA:chemical-engineer','ca-program:5243','direct','2026-08-09'),
  ('CA:environmental-engineer','ca-program:173','related','2026-08-09'),
  ('CA:engineering-technician','ca-program:69','direct','2026-08-09'),
  ('CA:engineering-technician','ca-program:70','direct','2026-08-09')
on conflict (profile_key,program_ref) do update set
  relation_type=excluded.relation_type,
  source_checked_at=excluded.source_checked_at;
