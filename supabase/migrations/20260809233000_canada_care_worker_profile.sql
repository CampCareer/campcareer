-- Canada Care Worker profile; institutional frontline care maps to NOC 33102.
insert into public.country_occupation_profiles(profile_key,country_code,canonical_career_id,official_title,official_code_system,official_code_version,official_unit_group_code,currency,registration_required,registration_authority,registration_url,publication_status,source_checked_at,updated_at)
values('CA:care-worker','CA','care-worker','Nurse aides, orderlies and patient service associates','NOC','2021 Version 1.0','33102','CAD',false,null,null,'profile_ready','2026-08-09',now())
on conflict(profile_key) do update set official_title=excluded.official_title,official_unit_group_code=excluded.official_unit_group_code,registration_required=excluded.registration_required,registration_authority=excluded.registration_authority,registration_url=excluded.registration_url,publication_status=excluded.publication_status,source_checked_at=excluded.source_checked_at,updated_at=now();

insert into public.country_occupation_metric_snapshots(profile_key,as_of_date,employment_total,median_hourly_earnings,shortage_component,vacancy_intensity_component,employer_diversity_component,vacancy_trend_component,entry_level_component,salary_component,growth_component,visa_component,entry_burden_component,opportunity_score,score_methodology_version,score_status,score_evidence,source_checked_at)
values('CA:care-worker','2025-11-19',296900,24.00,20,0,0,0,15,2,0,10,4,51,'career-opportunity-ca-v1','provisional',jsonb_build_object('classification_scope','Canonical Care Worker uses NOC 33102 institutional patient/resident care, not home support NOC 44101.','shortage_note','COPS strong risk of shortage for NOC 33102.','visa_basis','Current IRCC healthcare and social services category includes NOC 33102.','program_basis','Approved direct international-open routes ca-program:1515 and ca-program:3503.'),'2026-08-09')
on conflict(profile_key,as_of_date) do update set employment_total=excluded.employment_total,median_hourly_earnings=excluded.median_hourly_earnings,shortage_component=excluded.shortage_component,entry_level_component=excluded.entry_level_component,salary_component=excluded.salary_component,visa_component=excluded.visa_component,entry_burden_component=excluded.entry_burden_component,opportunity_score=excluded.opportunity_score,score_evidence=excluded.score_evidence,source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_specialisations(profile_key,official_code,official_title,shortage_rating,visa_eligible,included_in_rollup,sort_order,source_url,source_checked_at)
values('CA:care-worker','33102','Nurse aides, orderlies and patient service associates',null,true,true,1,'https://noc.esdc.gc.ca/Structure/NOCProfile?GocTemplateCulture=en-CA&code=33102&version=2021.0','2026-08-09')
on conflict(profile_key,official_code) do update set official_title=excluded.official_title,visa_eligible=excluded.visa_eligible,source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_links(profile_key,link_type,label,url,provider_type,region_code,sort_order,source_checked_at) values
('CA:care-worker','job_search','Job Bank — Nurse Aide in Canada','https://www.jobbank.gc.ca/marketreport/summary-occupation/18350/ca','official_job_board',null,1,'2026-08-09'),
('CA:care-worker','source','IRCC — Express Entry category-based selection','https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/rounds-invitations/category-based-selection.html','official_immigration',null,1,'2026-08-09')
on conflict(profile_key,link_type,url) do update set label=excluded.label,provider_type=excluded.provider_type,source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_program_links(profile_key,program_ref,relation_type,source_checked_at) values
('CA:care-worker','ca-program:1515','direct','2026-08-09'),('CA:care-worker','ca-program:3503','direct','2026-08-09')
on conflict(profile_key,program_ref) do update set relation_type=excluded.relation_type,source_checked_at=excluded.source_checked_at;
