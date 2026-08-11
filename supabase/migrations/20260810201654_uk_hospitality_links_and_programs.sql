insert into public.country_occupation_specialisations (profile_key,official_code,official_title,shortage_rating,visa_eligible,included_in_rollup,sort_order,source_url,source_checked_at) values
('UK:chef','5434/00','Chefs',null,false,true,1,'https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0227','2026-08-10'),
('UK:cook','5435/00','Cooks',null,false,true,1,'https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0589','2026-08-10'),
('UK:hotel-manager','1221','Hotel and accommodation managers and proprietors',null,false,true,1,'https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','2026-08-10'),
('UK:restaurant-manager','1222/01','Cafe and restaurant managers and proprietors',null,false,true,1,'https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0229B','2026-08-10'),
('UK:baker','5432/01','Bakers',null,false,true,1,'https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0191A','2026-08-10'),
('UK:tourism-manager','1225','Travel agency managers and proprietors — tourism/travel management scope',null,false,true,1,'https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','2026-08-10'),
('UK:event-planner','3557','Events managers and organisers — event planner scope',null,false,true,1,'https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0229A','2026-08-10'),
('UK:hospitality-supervisor','9261/00','Bar and catering supervisors',null,false,true,1,'https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0230D','2026-08-10')
on conflict (profile_key,official_code) do update set official_title=excluded.official_title,shortage_rating=excluded.shortage_rating,visa_eligible=excluded.visa_eligible,included_in_rollup=excluded.included_in_rollup,sort_order=excluded.sort_order,source_url=excluded.source_url,source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_links (profile_key,link_type,label,url,provider_type,region_code,sort_order,source_checked_at) values
('UK:chef','entry_program','Skills England — Chef de Partie','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0227','official_training',null,1,'2026-08-10'),
('UK:cook','entry_program','Skills England — Production Chef','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0589','official_training',null,1,'2026-08-10'),
('UK:hotel-manager','entry_program','Skills England — Hospitality Manager, Front Office Management','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0229C','official_training',null,1,'2026-08-10'),
('UK:restaurant-manager','entry_program','Skills England — Hospitality Manager, Food & Beverage Service Management','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0229B','official_training',null,1,'2026-08-10'),
('UK:baker','entry_program','Skills England — Baker, Craft Baker','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0191A','official_training',null,1,'2026-08-10'),
('UK:tourism-manager','entry_program','Skills England — Travel Consultant','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0340','official_training',null,1,'2026-08-10'),
('UK:event-planner','entry_program','Skills England — Event Assistant','https://skillsengland.education.gov.uk/apprenticeships/st0168-v1-1','official_training',null,1,'2026-08-10'),
('UK:hospitality-supervisor','entry_program','Skills England — Hospitality Supervisor, Food & Beverage Supervisor','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0230D','official_training',null,1,'2026-08-10'),
('UK:chef','source','Home Office — Appendix Skilled Occupations','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','official_immigration',null,2,'2026-08-10'),
('UK:cook','source','Home Office — Appendix Skilled Occupations, Table 6','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','official_immigration',null,2,'2026-08-10'),
('UK:hotel-manager','source','Home Office — Appendix Skilled Occupations','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','official_immigration',null,2,'2026-08-10'),
('UK:restaurant-manager','source','Home Office — Appendix Skilled Occupations','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','official_immigration',null,2,'2026-08-10'),
('UK:baker','source','Home Office — Appendix Skilled Occupations','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','official_immigration',null,2,'2026-08-10'),
('UK:tourism-manager','source','Home Office — Appendix Skilled Occupations','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','official_immigration',null,2,'2026-08-10'),
('UK:event-planner','source','Home Office — Appendix Skilled Occupations','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','official_immigration',null,2,'2026-08-10'),
('UK:hospitality-supervisor','source','Home Office — Appendix Skilled Occupations, Table 6','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','official_immigration',null,2,'2026-08-10')
on conflict (profile_key,link_type,url) do update set label=excluded.label,provider_type=excluded.provider_type,region_code=excluded.region_code,sort_order=excluded.sort_order,source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_program_links (profile_key,program_ref,relation_type,source_checked_at) values
('UK:event-planner','uk-program:f5988612-a95f-2dca-ae54-dee1be4ad369','direct','2026-08-10'),
('UK:hotel-manager','uk-program:e6deefad-a4ca-6801-11d3-ef8fc07570d0','direct','2026-08-10'),
('UK:restaurant-manager','uk-program:e6deefad-a4ca-6801-11d3-ef8fc07570d0','direct','2026-08-10'),
('UK:tourism-manager','uk-program:23c7fc3c-1077-6460-7fe3-e71e75811469','direct','2026-08-10')
on conflict (profile_key,program_ref) do update set relation_type=excluded.relation_type,source_checked_at=excluded.source_checked_at;
