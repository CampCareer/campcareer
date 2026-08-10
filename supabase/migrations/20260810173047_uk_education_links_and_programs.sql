-- United Kingdom Education cohort: official scopes, entry/source links and verified canonical programme linkage.
insert into public.country_occupation_specialisations (profile_key,official_code,official_title,shortage_rating,visa_eligible,included_in_rollup,sort_order,source_url,source_checked_at) values
('UK:early-childhood-teacher','2315','Nursery education teaching professionals — early years teacher scope',null,true,true,1,'https://skillsengland.education.gov.uk/apprenticeships/st1077-v1-1','2026-08-10'),
('UK:primary-school-teacher','2314','Primary education teaching professionals',null,true,true,1,'https://getintoteaching.education.gov.uk/train-to-be-a-teacher/what-is-qts','2026-08-10'),
('UK:secondary-school-teacher','2313','Secondary education teaching professionals',null,true,true,1,'https://getintoteaching.education.gov.uk/train-to-be-a-teacher/what-is-qts','2026-08-10'),
('UK:special-education-teacher','2316','Special and additional needs education teaching professionals',null,true,true,1,'https://getintoteaching.education.gov.uk/train-to-be-a-teacher/what-is-qts','2026-08-10'),
('UK:social-worker','2461','Social workers',null,true,true,1,'https://www.regulated-professions.service.gov.uk/professions/social-worker-3','2026-08-10'),
('UK:youth-worker','2464','Youth work professionals',null,true,true,1,'https://skillsengland.education.gov.uk/apprenticeships/st0522-v1-1','2026-08-10'),
('UK:community-worker','3221/01','Community workers',null,false,true,1,'https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0906','2026-08-10'),
('UK:counsellor','3224','Counsellors',null,false,true,1,'https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC1192','2026-08-10')
on conflict (profile_key,official_code) do update set official_title=excluded.official_title,shortage_rating=excluded.shortage_rating,visa_eligible=excluded.visa_eligible,included_in_rollup=excluded.included_in_rollup,sort_order=excluded.sort_order,source_url=excluded.source_url,source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_links (profile_key,link_type,label,url,provider_type,region_code,sort_order,source_checked_at) values
('UK:early-childhood-teacher','entry_program','Skills England — Early Years Teacher degree apprenticeship','https://skillsengland.education.gov.uk/apprenticeships/st1077-v1-1','official_training',null,1,'2026-08-10'),
('UK:early-childhood-teacher','source','Home Office — Appendix Skilled Occupations','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','official_immigration',null,2,'2026-08-10'),
('UK:primary-school-teacher','entry_program','Skills England — Teacher Degree Apprenticeship','https://skillsengland.education.gov.uk/apprenticeship-standards/st1502','official_training',null,1,'2026-08-10'),
('UK:primary-school-teacher','source','DfE — Qualified Teacher Status','https://getintoteaching.education.gov.uk/train-to-be-a-teacher/what-is-qts','official_regulation',null,2,'2026-08-10'),
('UK:primary-school-teacher','source','Home Office — Appendix Skilled Occupations','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','official_immigration',null,3,'2026-08-10'),
('UK:secondary-school-teacher','entry_program','Skills England — Teacher Degree Apprenticeship','https://skillsengland.education.gov.uk/apprenticeship-standards/st1502','official_training',null,1,'2026-08-10'),
('UK:secondary-school-teacher','source','DfE — Teacher demand and postgraduate trainee need','https://explore-education-statistics.service.gov.uk/find-statistics/teacher-demand-and-postgraduate-trainee-need/2026-27','official_shortage',null,2,'2026-08-10'),
('UK:secondary-school-teacher','source','Home Office — Appendix Skilled Occupations','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','official_immigration',null,3,'2026-08-10'),
('UK:special-education-teacher','entry_program','Skills England — Teacher Degree Apprenticeship','https://skillsengland.education.gov.uk/apprenticeship-standards/st1502','official_training',null,1,'2026-08-10'),
('UK:special-education-teacher','source','DfE — School workforce in England 2025','https://explore-education-statistics.service.gov.uk/find-statistics/school-workforce-in-england/2025','official_shortage',null,2,'2026-08-10'),
('UK:special-education-teacher','source','Home Office — Appendix Skilled Occupations','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','official_immigration',null,3,'2026-08-10'),
('UK:social-worker','entry_program','Skills England — Social Worker integrated degree apprenticeship','https://skillsengland.education.gov.uk/apprenticeships/st0510-v2-0','official_training',null,1,'2026-08-10'),
('UK:social-worker','source','GOV.UK — Social Worker regulated profession','https://www.regulated-professions.service.gov.uk/professions/social-worker-3','official_regulation',null,2,'2026-08-10'),
('UK:social-worker','source','DfE — Children’s social work workforce 2025','https://explore-education-statistics.service.gov.uk/find-statistics/children-s-social-work-workforce/2025','official_shortage',null,3,'2026-08-10'),
('UK:social-worker','source','Home Office — Health and Care Worker eligible jobs','https://www.gov.uk/health-care-worker-visa/your-job','official_immigration',null,4,'2026-08-10'),
('UK:youth-worker','entry_program','Skills England — Youth Worker degree apprenticeship','https://skillsengland.education.gov.uk/apprenticeships/st0522-v1-1','official_training',null,1,'2026-08-10'),
('UK:youth-worker','source','Home Office — Appendix Skilled Occupations','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','official_immigration',null,2,'2026-08-10'),
('UK:community-worker','entry_program','Skills England — Youth Support Worker','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0906','official_training',null,1,'2026-08-10'),
('UK:community-worker','source','Home Office — Appendix Skilled Occupations','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','official_immigration',null,2,'2026-08-10'),
('UK:community-worker','source','Home Office — Current Temporary Shortage List','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-worker','official_immigration',null,3,'2026-08-10'),
('UK:counsellor','entry_program','Skills England — Counsellor Level 4 occupation','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC1192','official_training',null,1,'2026-08-10'),
('UK:counsellor','source','Home Office — Appendix Skilled Occupations','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','official_immigration',null,2,'2026-08-10'),
('UK:counsellor','source','Home Office — Current Temporary Shortage List','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-worker','official_immigration',null,3,'2026-08-10')
on conflict (profile_key,link_type,url) do update set label=excluded.label,provider_type=excluded.provider_type,region_code=excluded.region_code,sort_order=excluded.sort_order,source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_program_links (profile_key,program_ref,relation_type,source_checked_at) values
('UK:youth-worker','uk-program:01137e51-7937-29d8-599c-9468d121e11c','progression','2026-08-10')
on conflict (profile_key,program_ref) do update set relation_type=excluded.relation_type,source_checked_at=excluded.source_checked_at;
