-- Canada Technology occupation cohort: 8 canonical careers.
-- Current 2026 Express Entry STEM category includes NOC 21220 Cybersecurity specialists from this cohort; the other seven NOCs receive no visa score.

insert into public.country_occupation_profiles (
  profile_key,country_code,canonical_career_id,official_title,official_code_system,official_code_version,
  official_unit_group_code,currency,registration_required,registration_authority,registration_url,
  publication_status,source_checked_at,updated_at
) values
  ('CA:software-developer','CA','software-developer','Software developers and programmers','NOC','2021 Version 1.0','21232','CAD',false,null,null,'profile_ready','2026-08-09',now()),
  ('CA:data-analyst','CA','data-analyst','Database analysts and data administrators','NOC','2021 Version 1.0','21223','CAD',false,null,null,'profile_ready','2026-08-09',now()),
  ('CA:data-engineer','CA','data-engineer','Data scientists','NOC','2021 Version 1.0','21211','CAD',false,null,null,'profile_ready','2026-08-09',now()),
  ('CA:cybersecurity-analyst','CA','cybersecurity-analyst','Cybersecurity specialists','NOC','2021 Version 1.0','21220','CAD',false,null,null,'profile_ready','2026-08-09',now()),
  ('CA:network-administrator','CA','network-administrator','Computer network and web technicians','NOC','2021 Version 1.0','22220','CAD',false,null,null,'profile_ready','2026-08-09',now()),
  ('CA:cloud-engineer','CA','cloud-engineer','Software engineers and designers','NOC','2021 Version 1.0','21231','CAD',false,null,null,'profile_ready','2026-08-09',now()),
  ('CA:database-administrator','CA','database-administrator','Database analysts and data administrators','NOC','2021 Version 1.0','21223','CAD',false,null,null,'profile_ready','2026-08-09',now()),
  ('CA:ict-support-technician','CA','ict-support-technician','User support technicians','NOC','2021 Version 1.0','22221','CAD',false,null,null,'profile_ready','2026-08-09',now())
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
  ('CA:software-developer','2025-11-19',155700,48.08,0,0,0,0,13,10,0,0,5,28,'career-opportunity-ca-v1','provisional',
    jsonb_build_object(
      'classification_scope','Canonical Software Developer uses NOC 21232 Software developers and programmers; employment is the NOC unit-group count.',
      'shortage_note','COPS projects NOC 21232 to remain balanced nationally over 2024-2033.',
      'visa_basis','NOC 21232 is not in the current Express Entry STEM occupations category.',
      'salary_method','Exact Job Bank Software Developer national median hourly wage CAD 48.08 earns 10/10.',
      'vacancy_scope','Current Job Bank postings are point-in-time and do not earn vacancy-intensity or trend credit.'
    ),'2026-08-09'),
  ('CA:data-analyst','2025-11-19',null,40.87,0,0,0,0,10,10,0,0,5,25,'career-opportunity-ca-v1','provisional',
    jsonb_build_object(
      'classification_scope','Canonical Data Analyst maps to NOC 21223, which also contains database analysts and data administrators; broader employment is not used as a title-specific total.',
      'shortage_note','COPS projects NOC 21223 to remain balanced nationally over 2024-2033.',
      'visa_basis','NOC 21223 is not in the current Express Entry STEM occupations category.',
      'salary_method','Exact Job Bank Data Analyst national median hourly wage CAD 40.87 earns 10/10.'
    ),'2026-08-09'),
  ('CA:data-engineer','2025-11-19',null,46.15,0,0,0,0,8,10,0,0,5,23,'career-opportunity-ca-v1','provisional',
    jsonb_build_object(
      'classification_scope','Data Engineer is an official title within broader NOC 21211 Data scientists; broader employment is not used as a title-specific total.',
      'shortage_note','COPS projects NOC 21211 to remain balanced nationally over 2024-2033.',
      'visa_basis','NOC 21211 is not in the current Express Entry STEM occupations category.',
      'entry_level_basis','The occupation is treated as university-heavy and technically specialized, so entry-level credit is conservative.',
      'salary_method','Exact Job Bank Data Engineer national median hourly wage CAD 46.15 earns 10/10.'
    ),'2026-08-09'),
  ('CA:cybersecurity-analyst','2025-11-19',31800,49.52,15,0,0,0,13,10,0,10,5,53,'career-opportunity-ca-v1','provisional',
    jsonb_build_object(
      'classification_scope','Canonical Cybersecurity Analyst maps directly to NOC 21220 Cybersecurity specialists.',
      'shortage_note','COPS classifies NOC 21220 as MODERATE RISK OF SHORTAGE nationally over 2024-2033, earning 15/20.',
      'visa_basis','NOC 21220 is included in the current Express Entry STEM occupations category, earning 10/10.',
      'salary_method','Exact Job Bank Cybersecurity Analyst national median hourly wage CAD 49.52 earns 10/10.',
      'vacancy_scope','Point-in-time advertised jobs are not converted into vacancy-intensity or trend scores.'
    ),'2026-08-09'),
  ('CA:network-administrator','2025-11-19',null,36.00,0,0,0,0,15,8,0,0,4,27,'career-opportunity-ca-v1','provisional',
    jsonb_build_object(
      'classification_scope','Network Administrator is an official title within broader NOC 22220 Computer network and web technicians; broader employment is not used as a title-specific total.',
      'shortage_note','COPS projects NOC 22220 to remain balanced nationally over 2024-2033.',
      'visa_basis','NOC 22220 is not in the current Express Entry STEM occupations category.',
      'entry_burden_basis','College-entry routes are common, but Job Bank identifies a Saskatchewan registration requirement, so burden credit is 4/5.',
      'salary_method','Exact Job Bank Network Administrator national median hourly wage CAD 36.00 earns 8/10.'
    ),'2026-08-09'),
  ('CA:cloud-engineer','2025-11-19',null,56.49,0,0,0,0,10,10,0,0,4,24,'career-opportunity-ca-v1','provisional',
    jsonb_build_object(
      'classification_scope','Cloud Engineer is an official title within broader NOC 21231 Software engineers and designers; broader employment is not used as a cloud-only total.',
      'shortage_note','COPS projects NOC 21231 to remain balanced nationally over 2024-2033.',
      'visa_basis','NOC 21231 is not in the current Express Entry STEM occupations category.',
      'entry_burden_basis','Engineering-title and professional-practice rules can vary by province and duties; the canonical cloud role is not treated as universally licensed.',
      'salary_method','Exact Job Bank Cloud Engineer national median hourly wage CAD 56.49 earns 10/10.'
    ),'2026-08-09'),
  ('CA:database-administrator','2025-11-19',null,40.87,0,0,0,0,10,10,0,0,5,25,'career-opportunity-ca-v1','provisional',
    jsonb_build_object(
      'classification_scope','Database Administrator is an official title within NOC 21223; broader employment is not used as a DBA-only total.',
      'shortage_note','COPS projects NOC 21223 to remain balanced nationally over 2024-2033.',
      'visa_basis','NOC 21223 is not in the current Express Entry STEM occupations category.',
      'program_basis','The direct NSCC IT Database Administration program is currently closed, so only the currently available BCIT Database Option is linked as related.',
      'salary_method','Exact Job Bank Database Administrator national median hourly wage CAD 40.87 earns 10/10.'
    ),'2026-08-09'),
  ('CA:ict-support-technician','2025-11-19',119200,31.47,0,0,0,0,15,6,0,0,5,26,'career-opportunity-ca-v1','provisional',
    jsonb_build_object(
      'classification_scope','Information technology support technician is an official title within NOC 22221 User support technicians; the NOC unit group is close enough for the employment total to be retained with scope caveat.',
      'shortage_note','COPS projects NOC 22221 to remain balanced nationally over 2024-2033.',
      'visa_basis','NOC 22221 is not in the current Express Entry STEM occupations category.',
      'salary_method','Exact Job Bank IT Support Technician national median hourly wage CAD 31.47 earns 6/10.'
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
  ('CA:software-developer','21232','Software developers and programmers',null,false,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=21232&version=2021.0','2026-08-09'),
  ('CA:data-analyst','21223','Database analysts and data administrators',null,false,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=21223&version=2021.0','2026-08-09'),
  ('CA:data-engineer','21211','Data scientists',null,false,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=21211&version=2021.0','2026-08-09'),
  ('CA:cybersecurity-analyst','21220','Cybersecurity specialists',null,true,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=21220&version=2021.0','2026-08-09'),
  ('CA:network-administrator','22220','Computer network and web technicians',null,false,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=22220&version=2021.0','2026-08-09'),
  ('CA:cloud-engineer','21231','Software engineers and designers',null,false,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=21231&version=2021.0','2026-08-09'),
  ('CA:database-administrator','21223','Database analysts and data administrators',null,false,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=21223&version=2021.0','2026-08-09'),
  ('CA:ict-support-technician','22221','User support technicians',null,false,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=22221&version=2021.0','2026-08-09')
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
  ('CA:software-developer','job_search','Job Bank — Software Developer in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/22548/ca','official_job_board',null,1,'2026-08-09'),
  ('CA:software-developer','source','COPS — Software developers and programmers','https://occupations.esdc.gc.ca/sppc-cops/occupationsummarydetail.jsp?lang=eng&tid=91','official_labour_market',null,1,'2026-08-09'),
  ('CA:software-developer','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,2,'2026-08-09'),
  ('CA:data-analyst','job_search','Job Bank — Data Analyst in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/17882/ca','official_job_board',null,1,'2026-08-09'),
  ('CA:data-analyst','source','COPS — Database analysts and data administrators','https://occupations.esdc.gc.ca/sppc-cops/occupationsummarydetail.jsp?lang=eng&tid=88','official_labour_market',null,1,'2026-08-09'),
  ('CA:data-analyst','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,2,'2026-08-09'),
  ('CA:data-engineer','job_search','Job Bank — Data Engineer in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/24510/ca','official_job_board',null,1,'2026-08-09'),
  ('CA:data-engineer','source','COPS — Data scientists','https://occupations.esdc.gc.ca/sppc-cops/occupationsummarydetail.jsp?lang=eng&tid=84','official_labour_market',null,1,'2026-08-09'),
  ('CA:data-engineer','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,2,'2026-08-09'),
  ('CA:cybersecurity-analyst','job_search','Job Bank — Cybersecurity Analyst in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/296427/ca','official_job_board',null,1,'2026-08-09'),
  ('CA:cybersecurity-analyst','source','COPS — Cybersecurity specialists','https://occupations.esdc.gc.ca/sppc-cops/occupationsummarydetail.jsp?lang=eng&tid=85','official_labour_market',null,1,'2026-08-09'),
  ('CA:cybersecurity-analyst','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,2,'2026-08-09'),
  ('CA:network-administrator','job_search','Job Bank — Network Administrator in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/3749/ca','official_job_board',null,1,'2026-08-09'),
  ('CA:network-administrator','source','COPS — Computer network and web technicians','https://occupations.esdc.gc.ca/sppc-cops/occupationsummarydetail.jsp?lang=eng&tid=118','official_labour_market',null,1,'2026-08-09'),
  ('CA:network-administrator','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,2,'2026-08-09'),
  ('CA:cloud-engineer','job_search','Job Bank — Cloud Engineer in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/296308/ca','official_job_board',null,1,'2026-08-09'),
  ('CA:cloud-engineer','source','COPS — Software engineers and designers','https://occupations.esdc.gc.ca/sppc-cops/occupationsummarydetail.jsp?lang=eng&tid=90','official_labour_market',null,1,'2026-08-09'),
  ('CA:cloud-engineer','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,2,'2026-08-09'),
  ('CA:database-administrator','job_search','Job Bank — Database Administrator in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/17875/ca','official_job_board',null,1,'2026-08-09'),
  ('CA:database-administrator','source','COPS — Database analysts and data administrators','https://occupations.esdc.gc.ca/sppc-cops/occupationsummarydetail.jsp?lang=eng&tid=88','official_labour_market',null,1,'2026-08-09'),
  ('CA:database-administrator','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,2,'2026-08-09'),
  ('CA:ict-support-technician','job_search','Job Bank — IT Support Technician in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/296677/ca','official_job_board',null,1,'2026-08-09'),
  ('CA:ict-support-technician','source','COPS — User support technicians','https://occupations.esdc.gc.ca/sppc-cops/occupationsummarydetail.jsp?lang=eng&tid=119','official_labour_market',null,1,'2026-08-09'),
  ('CA:ict-support-technician','source','IRCC — current category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,2,'2026-08-09')
on conflict (profile_key,link_type,url) do update set
  label=excluded.label,
  provider_type=excluded.provider_type,
  sort_order=excluded.sort_order,
  source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_program_links (profile_key,program_ref,relation_type,source_checked_at) values
  ('CA:software-developer','ca-program:31','direct','2026-08-09'),
  ('CA:software-developer','ca-program:1392','direct','2026-08-09'),
  ('CA:data-analyst','ca-program:147','direct','2026-08-09'),
  ('CA:data-analyst','ca-program:1330','direct','2026-08-09'),
  ('CA:data-engineer','ca-program:3438','direct','2026-08-09'),
  ('CA:cybersecurity-analyst','ca-program:1172','direct','2026-08-09'),
  ('CA:cybersecurity-analyst','ca-program:2024','direct','2026-08-09'),
  ('CA:network-administrator','ca-program:150','direct','2026-08-09'),
  ('CA:network-administrator','ca-program:2022','direct','2026-08-09'),
  ('CA:cloud-engineer','ca-program:1163','direct','2026-08-09'),
  ('CA:cloud-engineer','ca-program:2275','direct','2026-08-09'),
  ('CA:database-administrator','ca-program:124','related','2026-08-09'),
  ('CA:ict-support-technician','ca-program:1395','direct','2026-08-09'),
  ('CA:ict-support-technician','ca-program:2227','direct','2026-08-09')
on conflict (profile_key,program_ref) do update set
  relation_type=excluded.relation_type,
  source_checked_at=excluded.source_checked_at;
