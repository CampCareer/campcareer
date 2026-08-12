insert into public.country_occupation_specialisations (profile_key,official_code,official_title,shortage_rating,visa_eligible,included_in_rollup,sort_order,source_url,source_checked_at) values
('NZ:civil-engineer','233211','Civil Engineer',null,true,true,1,'https://www.immigration.govt.nz/opsmanual/89117.htm','2026-08-11'),
('NZ:mechanical-engineer','233512','Mechanical Engineer',null,true,true,1,'https://www.immigration.govt.nz/opsmanual/89117.htm','2026-08-11'),
('NZ:electrical-engineer','233311','Electrical Engineer',null,true,true,1,'https://www.immigration.govt.nz/opsmanual/89117.htm','2026-08-11'),
('NZ:manufacturing-engineer','233513','Production or Plant Engineer — manufacturing engineering scope',null,true,true,1,'https://www.immigration.govt.nz/opsmanual/89117.htm','2026-08-11'),
('NZ:industrial-engineer','233511','Industrial Engineer',null,true,true,1,'https://www.immigration.govt.nz/opsmanual/89117.htm','2026-08-11'),
('NZ:chemical-engineer','233111','Chemical Engineer',null,true,true,1,'https://www.immigration.govt.nz/opsmanual/89117.htm','2026-08-11'),
('NZ:environmental-engineer','233915','Environmental Engineer',null,true,true,1,'https://www.immigration.govt.nz/opsmanual/89117.htm','2026-08-11'),
('NZ:engineering-technician','312999','Building and Engineering Technicians nec — general engineering technician scope',null,true,true,1,'https://www.abs.gov.au/ausstats/abs%40.nsf/Product%2BLookup/1220.0~2013%2C%2BVersion%2B1.3~Chapter~UNIT%2BGROUP%2B3129%2BOther%2BBuilding%2Band%2BEngineering%2BTechnicians','2026-08-11')
on conflict (profile_key,official_code) do update set official_title=excluded.official_title,shortage_rating=excluded.shortage_rating,visa_eligible=excluded.visa_eligible,included_in_rollup=excluded.included_in_rollup,sort_order=excluded.sort_order,source_url=excluded.source_url,source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_links (profile_key,link_type,label,url,provider_type,region_code,sort_order,source_checked_at) values
('NZ:civil-engineer','entry_program','Tahatū — Civil Engineer','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00165-civil-engineer','official_training',null,1,'2026-08-11'),
('NZ:mechanical-engineer','entry_program','Tahatū — Mechanical Engineer','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00181-mechanical-engineer','official_training',null,1,'2026-08-11'),
('NZ:electrical-engineer','entry_program','Tahatū — Electrical Engineer','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00169-electrical-engineer','official_training',null,1,'2026-08-11'),
('NZ:manufacturing-engineer','entry_program','Tahatū — Manufacturing Engineer','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00178-manufacturing-engineer','official_training',null,1,'2026-08-11'),
('NZ:industrial-engineer','entry_program','Tahatū — Industrial Engineer','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00175-industrial-engineer','official_training',null,1,'2026-08-11'),
('NZ:chemical-engineer','entry_program','Tahatū — Chemical Engineer','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00164-chemical-engineer','official_training',null,1,'2026-08-11'),
('NZ:environmental-engineer','entry_program','Tahatū — Environmental Engineer','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00172-environmental-engineer','official_training',null,1,'2026-08-11'),
('NZ:engineering-technician','entry_program','Tahatū — Mechanical Engineering Technician (representative general route)','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00208-mechanical-engineering-technician','official_training',null,1,'2026-08-11'),
('NZ:civil-engineer','source','Immigration New Zealand — Green List','https://www.immigration.govt.nz/opsmanual/89117.htm','official_immigration',null,2,'2026-08-11'),
('NZ:mechanical-engineer','source','Immigration New Zealand — Green List','https://www.immigration.govt.nz/opsmanual/89117.htm','official_immigration',null,2,'2026-08-11'),
('NZ:electrical-engineer','source','Immigration New Zealand — Green List','https://www.immigration.govt.nz/opsmanual/89117.htm','official_immigration',null,2,'2026-08-11'),
('NZ:manufacturing-engineer','source','Immigration New Zealand — Green List','https://www.immigration.govt.nz/opsmanual/89117.htm','official_immigration',null,2,'2026-08-11'),
('NZ:industrial-engineer','source','Immigration New Zealand — Green List','https://www.immigration.govt.nz/opsmanual/89117.htm','official_immigration',null,2,'2026-08-11'),
('NZ:chemical-engineer','source','Immigration New Zealand — Green List','https://www.immigration.govt.nz/opsmanual/89117.htm','official_immigration',null,2,'2026-08-11'),
('NZ:environmental-engineer','source','Immigration New Zealand — Green List','https://www.immigration.govt.nz/opsmanual/89117.htm','official_immigration',null,2,'2026-08-11'),
('NZ:engineering-technician','source','Immigration New Zealand — SMC Trades and Technician pathway from 24 August 2026','https://www.immigration.govt.nz/live/resident-visas-to-live-in-new-zealand/skilled-residence-pathways-in-new-zealand/skilled-migrant-category-pathway-to-residence/eligible-roles-for-the-smc-trades-and-technician-pathway-august-2026/','official_immigration',null,2,'2026-08-11')
on conflict (profile_key,link_type,url) do update set label=excluded.label,provider_type=excluded.provider_type,region_code=excluded.region_code,sort_order=excluded.sort_order,source_checked_at=excluded.source_checked_at;

delete from public.country_occupation_program_links where profile_key in ('NZ:civil-engineer','NZ:mechanical-engineer','NZ:electrical-engineer','NZ:manufacturing-engineer','NZ:industrial-engineer','NZ:chemical-engineer','NZ:environmental-engineer','NZ:engineering-technician') and program_ref like 'nz-program:%';

insert into public.country_occupation_program_links (profile_key,program_ref,relation_type,source_checked_at)
select 'NZ:' || poc.canonical_career_id,
       'nz-program:' || poc.programme_id::text,
       poc.normalized_relation_type,
       '2026-08-11'::date
from public.program_occupation_canonical_nz_v1 poc
join public.program_catalog_canonical_nz_v1 pc using (programme_id)
where poc.canonical_career_id in ('civil-engineer','mechanical-engineer','electrical-engineer','manufacturing-engineer','industrial-engineer','chemical-engineer','environmental-engineer','engineering-technician')
  and pc.verification_tier = 'A'
  and pc.international_students_eligible is true
  and pc.code_signatory_status = 'confirmed'
  and coalesce(pc.canonical_admission_state,'') <> 'closed'
on conflict (profile_key,program_ref) do update set relation_type=excluded.relation_type,source_checked_at=excluded.source_checked_at;
