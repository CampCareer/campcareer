insert into public.country_occupation_specialisations (profile_key,official_code,official_title,shortage_rating,visa_eligible,included_in_rollup,sort_order,source_url,source_checked_at) values
('NZ:environmental-scientist','234313','Environmental Research Scientist (Environmental Scientist)',null,true,true,1,'https://www.immigration.govt.nz/opsmanual/89117.htm','2026-08-11'),
('NZ:agronomist','234112','Agricultural Scientist — Agronomist specialisation',null,true,true,1,'https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00217-soil-and-plant-scientist','2026-08-11'),
('NZ:farm-manager','121313','Dairy Cattle Farmer (Dairy Cattle Farm Manager) — dairy-only Tier 2 subset',null,true,false,1,'https://www.immigration.govt.nz/opsmanual/89117.htm','2026-08-11'),
('NZ:forestry-technician','311413','Life Science Technician — Forestry Technician specialisation',null,true,true,1,'https://www.abs.gov.au/ausstats/abs%40.nsf/Product%2BLookup/1220.0~2013%2C%2BVersion%2B1.3~Chapter~UNIT%2BGROUP%2B3114%2BScience%2BTechnicians','2026-08-11'),
('NZ:food-technologist','234212','Food Technologist',null,true,true,1,'https://www.immigration.govt.nz/opsmanual/89117.htm','2026-08-11'),
('NZ:animal-science-technician','311111','Agricultural Technician — animal science/husbandry scope',null,true,true,1,'https://www.abs.gov.au/ausstats/abs%40.nsf/lookup/8CDFE94EE815FF95CA2584A8000E7938?opendocument=','2026-08-11')
on conflict (profile_key,official_code) do update set official_title=excluded.official_title,shortage_rating=excluded.shortage_rating,visa_eligible=excluded.visa_eligible,included_in_rollup=excluded.included_in_rollup,sort_order=excluded.sort_order,source_url=excluded.source_url,source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_links (profile_key,link_type,label,url,provider_type,region_code,sort_order,source_checked_at) values
('NZ:environmental-scientist','entry_program','Tahatū — Environmental Scientist','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00238-environmental-scientist','official_training',null,1,'2026-08-11'),
('NZ:environmental-scientist','source','Immigration New Zealand — Green List','https://www.immigration.govt.nz/opsmanual/89117.htm','official_immigration',null,2,'2026-08-11'),
('NZ:agronomist','entry_program','Tahatū — Soil and Plant Scientist (closest agronomy route)','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00217-soil-and-plant-scientist','official_training',null,1,'2026-08-11'),
('NZ:farm-manager','entry_program','Tahatū — Farmer and Farm Manager','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00033-farmer-and-farm-manager','official_training',null,1,'2026-08-11'),
('NZ:farm-manager','source','Immigration New Zealand — Green List dairy-only Tier 2 boundary','https://www.immigration.govt.nz/opsmanual/89117.htm','official_immigration',null,2,'2026-08-11'),
('NZ:forestry-technician','entry_program','Tahatū — Forest and Conservation Technician','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00274-forest-and-conservation-technician','official_training',null,1,'2026-08-11'),
('NZ:forestry-technician','source','ANZSCO 1.3 — Science Technicians','https://www.abs.gov.au/ausstats/abs%40.nsf/Product%2BLookup/1220.0~2013%2C%2BVersion%2B1.3~Chapter~UNIT%2BGROUP%2B3114%2BScience%2BTechnicians','official_classification',null,2,'2026-08-11'),
('NZ:food-technologist','entry_program','Tahatū — Food Scientist and Technologist','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00216-food-scientist-and-technologist','official_training',null,1,'2026-08-11'),
('NZ:food-technologist','source','Immigration New Zealand — Green List','https://www.immigration.govt.nz/opsmanual/89117.htm','official_immigration',null,2,'2026-08-11'),
('NZ:sustainability-specialist','entry_program','Tahatū — Sustainability Specialist','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00098-Sustainability-specialist','official_training',null,1,'2026-08-11'),
('NZ:sustainability-specialist','source','Immigration New Zealand — NOL occupations used for AEWV','https://www.immigration.govt.nz/work/requirements-for-work-visas/green-list-occupations-qualifications-and-skills/national-occupation-list-occupations-used-for-an-aewv/','official_immigration',null,2,'2026-08-11'),
('NZ:horticulturist','entry_program','Tahatū — Nursery Grower (closest broad horticulture route)','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T01062-nursery-grower','official_training',null,1,'2026-08-11'),
('NZ:animal-science-technician','entry_program','Tahatū — Agricultural Technician','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00263-agricultural-technician','official_training',null,1,'2026-08-11'),
('NZ:animal-science-technician','source','ANZSCO 1.3 — Agricultural Technicians','https://www.abs.gov.au/ausstats/abs%40.nsf/lookup/8CDFE94EE815FF95CA2584A8000E7938?opendocument=','official_classification',null,2,'2026-08-11')
on conflict (profile_key,link_type,url) do update set label=excluded.label,provider_type=excluded.provider_type,region_code=excluded.region_code,sort_order=excluded.sort_order,source_checked_at=excluded.source_checked_at;

delete from public.country_occupation_program_links where profile_key in ('NZ:environmental-scientist','NZ:agronomist','NZ:farm-manager','NZ:forestry-technician','NZ:food-technologist','NZ:sustainability-specialist','NZ:horticulturist','NZ:animal-science-technician') and program_ref like 'nz-program:%';

insert into public.country_occupation_program_links (profile_key,program_ref,relation_type,source_checked_at)
select 'NZ:' || poc.canonical_career_id,
       'nz-program:' || poc.programme_id::text,
       poc.normalized_relation_type,
       '2026-08-11'::date
from public.program_occupation_canonical_nz_v1 poc
join public.program_catalog_canonical_nz_v1 pc using (programme_id)
where poc.canonical_career_id in ('environmental-scientist','agronomist','farm-manager','forestry-technician','food-technologist','sustainability-specialist','horticulturist','animal-science-technician')
  and pc.verification_tier = 'A'
  and pc.international_students_eligible is true
  and pc.code_signatory_status = 'confirmed'
  and coalesce(pc.canonical_admission_state,'') <> 'closed'
on conflict (profile_key,program_ref) do update set relation_type=excluded.relation_type,source_checked_at=excluded.source_checked_at;
