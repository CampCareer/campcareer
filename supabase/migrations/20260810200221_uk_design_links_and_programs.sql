insert into public.country_occupation_specialisations (profile_key,official_code,official_title,shortage_rating,visa_eligible,included_in_rollup,sort_order,source_url,source_checked_at) values
('UK:graphic-designer','2142/99','Graphic and multimedia designers n.e.c. — graphic designer scope',null,true,true,1,'https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0625','2026-08-10'),
('UK:ux-designer','2141/02','UI and UX designers and researchers',null,true,true,1,'https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0470','2026-08-10'),
('UK:multimedia-designer','2142/99','Graphic and multimedia designers n.e.c. — multimedia designer scope',null,true,true,1,'https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0625','2026-08-10'),
('UK:animator','2142/01','Multimedia animators',null,true,true,1,'https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0488','2026-08-10'),
('UK:interior-designer','3421/00','Interior designers',null,false,true,1,'https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC1361','2026-08-10'),
('UK:film-editor','3416/03','Broadcasting and entertainment editors — film editor scope',null,false,true,1,'https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0933','2026-08-10'),
('UK:architect','2451/01','Architects excluding landscape',null,true,true,1,'https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0533','2026-08-10'),
('UK:web-designer','2141/03','Web designers',null,true,true,1,'https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0625','2026-08-10')
on conflict (profile_key,official_code) do update set official_title=excluded.official_title,shortage_rating=excluded.shortage_rating,visa_eligible=excluded.visa_eligible,included_in_rollup=excluded.included_in_rollup,sort_order=excluded.sort_order,source_url=excluded.source_url,source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_links (profile_key,link_type,label,url,provider_type,region_code,sort_order,source_checked_at) values
('UK:graphic-designer','entry_program','Skills England — Creative Digital Design Professional','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0625','official_training',null,1,'2026-08-10'),
('UK:ux-designer','entry_program','Skills England — Digital User Experience Professional','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0470','official_training',null,1,'2026-08-10'),
('UK:multimedia-designer','entry_program','Skills England — Creative Digital Design Professional','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0625','official_training',null,1,'2026-08-10'),
('UK:animator','entry_program','Skills England — Junior Animator','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0488','official_training',null,1,'2026-08-10'),
('UK:interior-designer','entry_program','Skills England — Interior Designer','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC1361','official_training',null,1,'2026-08-10'),
('UK:film-editor','entry_program','Skills England — Post Production Engineer','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0933','official_training',null,1,'2026-08-10'),
('UK:architect','entry_program','Skills England — Architect','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0533','official_training',null,1,'2026-08-10'),
('UK:web-designer','entry_program','Skills England — Creative Digital Design Professional','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0625','official_training',null,1,'2026-08-10'),
('UK:graphic-designer','source','Home Office — Appendix Skilled Occupations','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','official_immigration',null,2,'2026-08-10'),
('UK:ux-designer','source','Home Office — Appendix Skilled Occupations','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','official_immigration',null,2,'2026-08-10'),
('UK:multimedia-designer','source','Home Office — Appendix Skilled Occupations','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','official_immigration',null,2,'2026-08-10'),
('UK:animator','source','Home Office — Appendix Skilled Occupations','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','official_immigration',null,2,'2026-08-10'),
('UK:interior-designer','source','Home Office — Appendix Skilled Occupations','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','official_immigration',null,2,'2026-08-10'),
('UK:film-editor','source','Home Office — Appendix Skilled Occupations','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','official_immigration',null,2,'2026-08-10'),
('UK:architect','source','Architects Registration Board — Registration facts','https://arb.org.uk/architect-information/applying-for-registration-for-the-first-time/registration-the-facts/','official_regulator',null,2,'2026-08-10'),
('UK:web-designer','source','Home Office — Appendix Skilled Occupations','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','official_immigration',null,2,'2026-08-10'),
('UK:graphic-designer','source','UK Government — Entry-level hiring snapshot','https://www.gov.uk/government/publications/entry-level-hiring-in-the-uk-a-snapshot','official_labour',null,3,'2026-08-10')
on conflict (profile_key,link_type,url) do update set label=excluded.label,provider_type=excluded.provider_type,region_code=excluded.region_code,sort_order=excluded.sort_order,source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_program_links (profile_key,program_ref,relation_type,source_checked_at) values
('UK:animator','uk-program:dd1aa240-aeb3-481c-817e-6a68c71c670f','direct','2026-08-10'),
('UK:architect','uk-program:f7f17bb6-ffae-d808-a363-eddf25b5468f','progression','2026-08-10'),
('UK:film-editor','uk-program:3d6fd3dd-bc0e-2879-4d47-2c653821ef53','direct','2026-08-10'),
('UK:graphic-designer','uk-program:4d13860d-09b9-9ba9-e0f9-d5e0727111f9','direct','2026-08-10'),
('UK:interior-designer','uk-program:f03cb1bf-df03-0fe0-c4dc-64d1319b3cdf','direct','2026-08-10'),
('UK:multimedia-designer','uk-program:1cae92ac-ac2c-60bd-3e7c-64a9a0d7dcb8','direct','2026-08-10'),
('UK:ux-designer','uk-program:1611511e-6c28-2598-0a87-8941cdaaf6b8','direct','2026-08-10'),
('UK:web-designer','uk-program:7e7dadd5-1276-1c94-b15f-87a34a9d4669','direct','2026-08-10')
on conflict (profile_key,program_ref) do update set relation_type=excluded.relation_type,source_checked_at=excluded.source_checked_at;
