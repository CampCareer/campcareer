insert into public.country_occupation_specialisations (profile_key,official_code,official_title,shortage_rating,visa_eligible,included_in_rollup,sort_order,source_url,source_checked_at) values
('NZ:carpenter','331212','Carpenter',null,true,true,1,'https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00737-carpenter','2026-08-10'),
('NZ:electrician','341111','Electrician (General)',null,true,true,1,'https://www.immigration.govt.nz/opsmanual/89117.htm','2026-08-10'),
('NZ:plumber','334111','Plumber (General)',null,true,true,1,'https://www.immigration.govt.nz/opsmanual/89117.htm','2026-08-10'),
('NZ:wall-floor-tiler','333411','Wall and Floor Tiler',null,true,true,1,'https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00741-wall-and-floor-tiler','2026-08-10'),
('NZ:welder','322313','Welder',null,true,true,1,'https://www.immigration.govt.nz/opsmanual/89117.htm','2026-08-10'),
('NZ:bricklayer','331111','Bricklayer',null,true,true,1,'https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00735-brick-and-blocklayer','2026-08-10'),
('NZ:hvac-technician','342111','Airconditioning and Refrigeration Mechanic',null,true,true,1,'https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00826-heat-pump-refrigeration-and-air-conditioning-technician','2026-08-10'),
('NZ:construction-manager','133111','Construction Project Manager',null,true,true,1,'https://www.immigration.govt.nz/opsmanual/89117.htm','2026-08-10')
on conflict (profile_key,official_code) do update set official_title=excluded.official_title,shortage_rating=excluded.shortage_rating,visa_eligible=excluded.visa_eligible,included_in_rollup=excluded.included_in_rollup,sort_order=excluded.sort_order,source_url=excluded.source_url,source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_links (profile_key,link_type,label,url,provider_type,region_code,sort_order,source_checked_at) values
('NZ:carpenter','entry_program','Tahatū — Carpentry and joinery apprenticeships','https://tahatu.govt.nz/study-and-training/explore-study-and-training/0403-building-and-construction/040311/11-apprenticeships-in-carpentry-and-joinery','official_training',null,1,'2026-08-10'),
('NZ:electrician','entry_program','Tahatū — Electrical engineering apprenticeships','https://tahatu.govt.nz/study-and-training/explore-study-and-training/0313-electrical-and-electronic-engineering-and-technology/031301/11-apprenticeships-in-electrical-engineering','official_training',null,1,'2026-08-10'),
('NZ:plumber','entry_program','Tahatū — Plumbing, gasfitting and drainlaying apprenticeships','https://tahatu.govt.nz/study-and-training/explore-study-and-training/0403-building-and-construction/040327/11-apprenticeships-in-plumbing-gasfitting-and-drainlaying','official_training',null,1,'2026-08-10'),
('NZ:wall-floor-tiler','entry_program','Tahatū — Wall and Floor Tiler','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00741-wall-and-floor-tiler','official_training',null,1,'2026-08-10'),
('NZ:welder','entry_program','Tahatū — Welding and metalwork apprenticeships','https://tahatu.govt.nz/study-and-training/explore-study-and-training/0307-mechanical-and-industrial-engineering-and-technology/030704/11-apprenticeships-in-welding-and-metalwork','official_training',null,1,'2026-08-10'),
('NZ:bricklayer','entry_program','Tahatū — Brick and blocklayer','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00735-brick-and-blocklayer','official_training',null,1,'2026-08-10'),
('NZ:hvac-technician','entry_program','Tahatū — Refrigeration, heating and air-conditioning apprenticeships','https://tahatu.govt.nz/study-and-training/explore-study-and-training/0313-electrical-and-electronic-engineering-and-technology/031315/11-apprenticeships-in-refrigeration-heating-and-air-conditioning','official_training',null,1,'2026-08-10'),
('NZ:construction-manager','entry_program','Tahatū — Construction Manager','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00038-construction-manager','official_training',null,1,'2026-08-10'),
('NZ:carpenter','source','Licensed Building Practitioners — Carpentry licensing','https://www.lbp.govt.nz/become-an-lbp/licensing-classes/','official_regulator',null,2,'2026-08-10'),
('NZ:electrician','source','Immigration New Zealand — Green List','https://www.immigration.govt.nz/opsmanual/89117.htm','official_immigration',null,2,'2026-08-10'),
('NZ:electrician','source','Electrical Workers Registration Board — overseas-trained electrician','https://www.ewrb.govt.nz/registration/registration-overseas-trained-pathway/electrician/','official_regulator',null,3,'2026-08-10'),
('NZ:plumber','source','Immigration New Zealand — Green List','https://www.immigration.govt.nz/opsmanual/89117.htm','official_immigration',null,2,'2026-08-10'),
('NZ:plumber','source','PGDB — overseas qualifications registration','https://www.pgdb.co.nz/apply_for_registration/register_with_overseas_qualifications','official_regulator',null,3,'2026-08-10'),
('NZ:wall-floor-tiler','source','Immigration New Zealand — NOL occupations used for AEWV','https://www.immigration.govt.nz/work/requirements-for-work-visas/green-list-occupations-qualifications-and-skills/national-occupation-list-occupations-used-for-an-aewv/','official_immigration',null,2,'2026-08-10'),
('NZ:welder','source','Immigration New Zealand — Green List','https://www.immigration.govt.nz/opsmanual/89117.htm','official_immigration',null,2,'2026-08-10'),
('NZ:bricklayer','source','Licensed Building Practitioners — Brick and Blocklaying','https://www.lbp.govt.nz/about-us/regulations-rules-and-procedures/rules-of-the-board/schedule-1-licence-class-competencies/bricklaying-and-blocklaying-licence-class-competencies/','official_regulator',null,2,'2026-08-10'),
('NZ:hvac-technician','source','Electrical Workers Registration Board — Electrical Service Technician','https://www.ewrb.govt.nz/registration/registration-overseas-trained-pathway/electrical-service-technician/','official_regulator',null,2,'2026-08-10'),
('NZ:hvac-technician','source','Immigration New Zealand — SMC Trades and Technician pathway from 24 August 2026','https://www.immigration.govt.nz/live/resident-visas-to-live-in-new-zealand/skilled-residence-pathways-in-new-zealand/skilled-migrant-category-pathway-to-residence/eligible-roles-for-the-smc-trades-and-technician-pathway-august-2026/','official_immigration',null,3,'2026-08-10'),
('NZ:construction-manager','source','Immigration New Zealand — Green List','https://www.immigration.govt.nz/opsmanual/89117.htm','official_immigration',null,2,'2026-08-10')
on conflict (profile_key,link_type,url) do update set label=excluded.label,provider_type=excluded.provider_type,region_code=excluded.region_code,sort_order=excluded.sort_order,source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_program_links (profile_key,program_ref,relation_type,source_checked_at) values
('NZ:construction-manager','nz-program:d784bade-a956-9d8a-1dad-9dda49548dc9','direct','2026-08-10'),
('NZ:construction-manager','nz-program:220963bf-9272-0deb-df24-cfd01f49a7bf','related','2026-08-10')
on conflict (profile_key,program_ref) do update set relation_type=excluded.relation_type,source_checked_at=excluded.source_checked_at;
