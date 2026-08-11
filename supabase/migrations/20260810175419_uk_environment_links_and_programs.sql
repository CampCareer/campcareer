insert into public.country_occupation_specialisations (profile_key,official_code,official_title,shortage_rating,visa_eligible,included_in_rollup,sort_order,source_url,source_checked_at) values
('UK:environmental-scientist','2152/04','Environmental scientists',null,true,true,1,'https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC1362','2026-08-10'),
('UK:agronomist','2112/01','Agricultural scientists — agronomist scope',null,true,true,1,'https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0761A','2026-08-10'),
('UK:farm-manager','1211','Managers and proprietors in agriculture and horticulture',null,false,true,1,'https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC1320','2026-08-10'),
('UK:forestry-technician','9112/01','Forest workers — forestry technician/craftsperson scope',null,false,true,1,'https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC1321A','2026-08-10'),
('UK:food-technologist','2129/06','Food technologists',null,true,true,1,'https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0198A','2026-08-10'),
('UK:sustainability-specialist','2152/05','Sustainability officers — sustainability specialist scope',null,true,true,1,'https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0748','2026-08-10'),
('UK:horticulturist','5112','Horticultural trades',null,false,true,1,'https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0018A','2026-08-10'),
('UK:animal-science-technician','3111','Laboratory technicians — animal technologist scope',null,true,true,1,'https://skillsengland.education.gov.uk/apprenticeships/st0058-v1-2?view=standard','2026-08-10')
on conflict (profile_key,official_code) do update set official_title=excluded.official_title,shortage_rating=excluded.shortage_rating,visa_eligible=excluded.visa_eligible,included_in_rollup=excluded.included_in_rollup,sort_order=excluded.sort_order,source_url=excluded.source_url,source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_links (profile_key,link_type,label,url,provider_type,region_code,sort_order,source_checked_at) values
('UK:environmental-scientist','entry_program','Skills England — Environmental Practitioner','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0778','official_training',null,1,'2026-08-10'),
('UK:agronomist','entry_program','Skills England — Agronomy and Precision Farming Adviser','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0761A','official_training',null,1,'2026-08-10'),
('UK:farm-manager','entry_program','Skills England — Assistant Farm Manager','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC1320','official_training',null,1,'2026-08-10'),
('UK:forestry-technician','entry_program','Skills England — Forest Craftsperson','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC1321A','official_training',null,1,'2026-08-10'),
('UK:food-technologist','entry_program','Skills England — Food Industry Technologist','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0198A','official_training',null,1,'2026-08-10'),
('UK:sustainability-specialist','entry_program','Skills England — Sustainability Business Specialist','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0748','official_training',null,1,'2026-08-10'),
('UK:horticulturist','entry_program','Skills England — Crop Technician','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0018A','official_training',null,1,'2026-08-10'),
('UK:animal-science-technician','entry_program','Skills England — Animal Technologist','https://skillsengland.education.gov.uk/apprenticeships/st0058-v1-2?view=standard','official_training',null,1,'2026-08-10'),
('UK:environmental-scientist','source','Home Office — Appendix Skilled Occupations','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','official_immigration',null,2,'2026-08-10'),
('UK:agronomist','source','Home Office — Immigration Salary List','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-immigration-salary-list','official_immigration',null,2,'2026-08-10'),
('UK:farm-manager','source','Home Office — Appendix Skilled Occupations','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','official_immigration',null,2,'2026-08-10'),
('UK:forestry-technician','source','Home Office — Appendix Skilled Occupations','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','official_immigration',null,2,'2026-08-10'),
('UK:food-technologist','source','Home Office — Appendix Skilled Occupations','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','official_immigration',null,2,'2026-08-10'),
('UK:sustainability-specialist','source','Home Office — Appendix Skilled Occupations','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','official_immigration',null,2,'2026-08-10'),
('UK:horticulturist','source','Home Office — Appendix Skilled Occupations','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','official_immigration',null,2,'2026-08-10'),
('UK:animal-science-technician','source','MAC — Temporary Shortage List Stage 2','https://www.gov.uk/government/publications/temporary-shortage-list-stage-2-report/temporary-shortage-list-stage-2-report-accessible','official_shortage',null,2,'2026-08-10')
on conflict (profile_key,link_type,url) do update set label=excluded.label,provider_type=excluded.provider_type,region_code=excluded.region_code,sort_order=excluded.sort_order,source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_program_links (profile_key,program_ref,relation_type,source_checked_at) values
('UK:agronomist','uk-program:003921de-2a12-3ae1-3cb9-dc9f58dc9692','direct','2026-08-10'),
('UK:environmental-scientist','uk-program:04d6da87-cb49-560b-5fff-32a862d13082','direct','2026-08-10'),
('UK:farm-manager','uk-program:003921de-2a12-3ae1-3cb9-dc9f58dc9692','direct','2026-08-10'),
('UK:food-technologist','uk-program:2f268342-0d5b-eb39-88b1-3832bef24ecb','direct','2026-08-10'),
('UK:horticulturist','uk-program:003921de-2a12-3ae1-3cb9-dc9f58dc9692','direct','2026-08-10'),
('UK:sustainability-specialist','uk-program:df7ff5ef-7ad3-8ddf-0c87-f98e26440316','direct','2026-08-10')
on conflict (profile_key,program_ref) do update set relation_type=excluded.relation_type,source_checked_at=excluded.source_checked_at;
