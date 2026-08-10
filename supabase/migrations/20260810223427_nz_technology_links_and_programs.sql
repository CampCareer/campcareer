insert into public.country_occupation_specialisations (profile_key,official_code,official_title,shortage_rating,visa_eligible,included_in_rollup,sort_order,source_url,source_checked_at) values
('NZ:software-developer','261312','Developer Programmer — Software Developer specialisation',null,true,true,1,'https://www.immigration.govt.nz/opsmanual/89117.htm','2026-08-10'),
('NZ:cybersecurity-analyst','262112','ICT Security Specialist — analyst scope',null,true,true,1,'https://www.immigration.govt.nz/opsmanual/89117.htm','2026-08-10'),
('NZ:network-administrator','263112','Network Administrator',null,true,true,1,'https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00122-computer-network-support-specialist','2026-08-10'),
('NZ:database-administrator','262111','Database Administrator',null,true,true,1,'https://www.immigration.govt.nz/opsmanual/89117.htm','2026-08-10'),
('NZ:ict-support-technician','313112','ICT Customer Support Officer / ICT Support Technician scope',null,true,true,1,'https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00123-information-technology-helpdesk-and-support-technician','2026-08-10')
on conflict (profile_key,official_code) do update set official_title=excluded.official_title,shortage_rating=excluded.shortage_rating,visa_eligible=excluded.visa_eligible,included_in_rollup=excluded.included_in_rollup,sort_order=excluded.sort_order,source_url=excluded.source_url,source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_links (profile_key,link_type,label,url,provider_type,region_code,sort_order,source_checked_at) values
('NZ:software-developer','entry_program','Tahatū — Software Developer','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00131-Software-developer','official_training',null,1,'2026-08-10'),
('NZ:data-analyst','entry_program','Tahatū — Data Analyst','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T01061-data-analyst','official_training',null,1,'2026-08-10'),
('NZ:data-engineer','entry_program','Tahatū — Data Warehousing Specialist (closest data-platform route)','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00128-data-warehousing-specialist','official_training',null,1,'2026-08-10'),
('NZ:cybersecurity-analyst','entry_program','Tahatū — Information Security Analyst','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00120-information-security-analyst','official_training',null,1,'2026-08-10'),
('NZ:network-administrator','entry_program','Tahatū — Computer Network Support Specialist','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00122-computer-network-support-specialist','official_training',null,1,'2026-08-10'),
('NZ:cloud-engineer','entry_program','Tahatū — Systems Administrator (related cloud-infrastructure route)','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00129-systems-administrator','official_training',null,1,'2026-08-10'),
('NZ:database-administrator','entry_program','Tahatū — Database Administrator','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00126-database-administrator','official_training',null,1,'2026-08-10'),
('NZ:ict-support-technician','entry_program','Tahatū — IT Helpdesk and Support Technician','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00123-information-technology-helpdesk-and-support-technician','official_training',null,1,'2026-08-10'),
('NZ:software-developer','source','Immigration New Zealand — Green List','https://www.immigration.govt.nz/opsmanual/89117.htm','official_immigration',null,2,'2026-08-10'),
('NZ:data-analyst','source','Immigration New Zealand — NOL occupations used for AEWV','https://www.immigration.govt.nz/work/requirements-for-work-visas/green-list-occupations-qualifications-and-skills/national-occupation-list-occupations-used-for-an-aewv/','official_immigration',null,2,'2026-08-10'),
('NZ:data-engineer','source','Immigration New Zealand — NOL occupations used for AEWV','https://www.immigration.govt.nz/work/requirements-for-work-visas/green-list-occupations-qualifications-and-skills/national-occupation-list-occupations-used-for-an-aewv/','official_immigration',null,2,'2026-08-10'),
('NZ:cybersecurity-analyst','source','Immigration New Zealand — Green List','https://www.immigration.govt.nz/opsmanual/89117.htm','official_immigration',null,2,'2026-08-10'),
('NZ:network-administrator','source','Immigration New Zealand — Green List','https://www.immigration.govt.nz/opsmanual/89117.htm','official_immigration',null,2,'2026-08-10'),
('NZ:cloud-engineer','source','Immigration New Zealand — NOL occupations used for AEWV','https://www.immigration.govt.nz/work/requirements-for-work-visas/green-list-occupations-qualifications-and-skills/national-occupation-list-occupations-used-for-an-aewv/','official_immigration',null,2,'2026-08-10'),
('NZ:database-administrator','source','Immigration New Zealand — Green List','https://www.immigration.govt.nz/opsmanual/89117.htm','official_immigration',null,2,'2026-08-10'),
('NZ:ict-support-technician','source','Immigration New Zealand — NOL occupations used for AEWV','https://www.immigration.govt.nz/work/requirements-for-work-visas/green-list-occupations-qualifications-and-skills/national-occupation-list-occupations-used-for-an-aewv/','official_immigration',null,2,'2026-08-10')
on conflict (profile_key,link_type,url) do update set label=excluded.label,provider_type=excluded.provider_type,region_code=excluded.region_code,sort_order=excluded.sort_order,source_checked_at=excluded.source_checked_at;

delete from public.country_occupation_program_links where profile_key in ('NZ:software-developer','NZ:data-analyst','NZ:data-engineer','NZ:cybersecurity-analyst','NZ:network-administrator','NZ:cloud-engineer','NZ:database-administrator','NZ:ict-support-technician') and program_ref like 'nz-program:%';

insert into public.country_occupation_program_links (profile_key,program_ref,relation_type,source_checked_at)
select 'NZ:' || poc.canonical_career_id,
       'nz-program:' || poc.programme_id::text,
       poc.normalized_relation_type,
       '2026-08-10'::date
from public.program_occupation_canonical_nz_v1 poc
join public.program_catalog_canonical_nz_v1 pc using (programme_id)
where poc.canonical_career_id in ('software-developer','data-analyst','data-engineer','cybersecurity-analyst','network-administrator','cloud-engineer','database-administrator','ict-support-technician')
  and pc.verification_tier = 'A'
  and pc.international_students_eligible is true
  and pc.code_signatory_status = 'confirmed'
  and coalesce(pc.canonical_admission_state,'') <> 'closed'
on conflict (profile_key,program_ref) do update set relation_type=excluded.relation_type,source_checked_at=excluded.source_checked_at;
