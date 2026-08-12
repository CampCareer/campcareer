insert into public.country_occupation_specialisations (profile_key,official_code,official_title,shortage_rating,visa_eligible,included_in_rollup,sort_order,source_url,source_checked_at) values
('NZ:accountant','221111','Accountant (General)',null,true,true,1,'https://www.abs.gov.au/ausstats/abs%40.nsf/Product%2BLookup/1220.0~2013%2C%2BVersion%2B1.3~Chapter~UNIT%2BGROUP%2B2211%2BAccountants','2026-08-11'),
('NZ:financial-analyst','221111','Accountant (General) — Financial Analyst specialisation',null,true,true,1,'https://www.abs.gov.au/ausstats/abs%40.nsf/Product%2BLookup/1220.0~2013%2C%2BVersion%2B1.3~Chapter~UNIT%2BGROUP%2B2211%2BAccountants','2026-08-11'),
('NZ:business-analyst','224711','Management Consultant — Business Analyst specialisation',null,true,true,1,'https://www.abs.gov.au/ausstats/abs%40.nsf/Product%2BLookup/1220.0~2013%2C%2BVersion%2B1.3~Chapter~UNIT%2BGROUP%2B2247%2BManagement%2Band%2BOrganisation%2BAnalysts','2026-08-11'),
('NZ:human-resources-specialist','223111','Human Resource Adviser',null,true,true,1,'https://www.abs.gov.au/ausstats/abs%40.nsf/Latestproducts/9F5272A98BA81C2ECA2584A8000E792C','2026-08-11'),
('NZ:marketing-specialist','225113','Marketing Specialist',null,true,true,1,'https://www.abs.gov.au/ausstats/abs%40.nsf/Lookup/E6F4C34AFF319B0CCA2584A8000E79C8%3Fopendocument','2026-08-11'),
('NZ:auditor','221213','External Auditor',null,true,true,1,'https://www.immigration.govt.nz/opsmanual/89117.htm','2026-08-11'),
('NZ:auditor','221214','Internal Auditor',null,true,true,2,'https://www.immigration.govt.nz/opsmanual/89117.htm','2026-08-11')
on conflict (profile_key,official_code) do update set official_title=excluded.official_title,shortage_rating=excluded.shortage_rating,visa_eligible=excluded.visa_eligible,included_in_rollup=excluded.included_in_rollup,sort_order=excluded.sort_order,source_url=excluded.source_url,source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_links (profile_key,link_type,label,url,provider_type,region_code,sort_order,source_checked_at) values
('NZ:accountant','entry_program','Tahatū — Accountant and Auditor','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00101-accountant-and-auditor','official_training',null,1,'2026-08-11'),
('NZ:financial-analyst','entry_program','Tahatū — Finance Analyst','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00104-finance-analyst','official_training',null,1,'2026-08-11'),
('NZ:business-analyst','entry_program','Tahatū — Business Analyst','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T01085-business-analyst','official_training',null,1,'2026-08-11'),
('NZ:supply-chain-analyst','entry_program','Tahatū — Logistics Specialist (closest supply-chain route)','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00084-logistics-specialist','official_training',null,1,'2026-08-11'),
('NZ:human-resources-specialist','entry_program','Tahatū — Human Resources Specialist','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00081-human-resources-specialist','official_training',null,1,'2026-08-11'),
('NZ:marketing-specialist','entry_program','Tahatū — Marketing Specialist','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00094-marketing-specialist','official_training',null,1,'2026-08-11'),
('NZ:auditor','entry_program','Tahatū — Accountant and Auditor','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00101-accountant-and-auditor','official_training',null,1,'2026-08-11'),
('NZ:project-manager','entry_program','Tahatū — Project Manager','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00087-project-manager','official_training',null,1,'2026-08-11'),
('NZ:accountant','source','Immigration New Zealand — SMC changes from 24 August 2026','https://www.immigration.govt.nz/live/resident-visas-to-live-in-new-zealand/skilled-residence-pathways-in-new-zealand/skilled-migrant-category-pathway-to-residence/2026-changes-to-the-skilled-migrant-category-resident-visa/','official_immigration',null,2,'2026-08-11'),
('NZ:financial-analyst','source','Immigration New Zealand — current Skilled Migrant Category','https://www.immigration.govt.nz/live/resident-visas-to-live-in-new-zealand/skilled-residence-pathways-in-new-zealand/skilled-migrant-category-pathway-to-residence/','official_immigration',null,2,'2026-08-11'),
('NZ:business-analyst','source','Immigration New Zealand — current Skilled Migrant Category','https://www.immigration.govt.nz/live/resident-visas-to-live-in-new-zealand/skilled-residence-pathways-in-new-zealand/skilled-migrant-category-pathway-to-residence/','official_immigration',null,2,'2026-08-11'),
('NZ:supply-chain-analyst','source','Stats NZ — National Occupation List transition','https://www.stats.govt.nz/methods/about-the-national-occupation-list','official_classification',null,2,'2026-08-11'),
('NZ:human-resources-specialist','source','Immigration New Zealand — current Skilled Migrant Category','https://www.immigration.govt.nz/live/resident-visas-to-live-in-new-zealand/skilled-residence-pathways-in-new-zealand/skilled-migrant-category-pathway-to-residence/','official_immigration',null,2,'2026-08-11'),
('NZ:marketing-specialist','source','Immigration New Zealand — current Skilled Migrant Category','https://www.immigration.govt.nz/live/resident-visas-to-live-in-new-zealand/skilled-residence-pathways-in-new-zealand/skilled-migrant-category-pathway-to-residence/','official_immigration',null,2,'2026-08-11'),
('NZ:auditor','source','Immigration New Zealand — Green List','https://www.immigration.govt.nz/opsmanual/89117.htm','official_immigration',null,2,'2026-08-11'),
('NZ:auditor','source','Financial Markets Authority — auditor licensing boundary','https://www.fma.govt.nz/business/services/auditors/','official_regulator',null,3,'2026-08-11'),
('NZ:project-manager','source','Immigration New Zealand — current Skilled Migrant Category','https://www.immigration.govt.nz/live/resident-visas-to-live-in-new-zealand/skilled-residence-pathways-in-new-zealand/skilled-migrant-category-pathway-to-residence/','official_immigration',null,2,'2026-08-11')
on conflict (profile_key,link_type,url) do update set label=excluded.label,provider_type=excluded.provider_type,region_code=excluded.region_code,sort_order=excluded.sort_order,source_checked_at=excluded.source_checked_at;

delete from public.country_occupation_program_links where profile_key in ('NZ:accountant','NZ:financial-analyst','NZ:business-analyst','NZ:supply-chain-analyst','NZ:human-resources-specialist','NZ:marketing-specialist','NZ:auditor','NZ:project-manager') and program_ref like 'nz-program:%';

insert into public.country_occupation_program_links (profile_key,program_ref,relation_type,source_checked_at)
select 'NZ:' || poc.canonical_career_id,
       'nz-program:' || poc.programme_id::text,
       poc.normalized_relation_type,
       '2026-08-11'::date
from public.program_occupation_canonical_nz_v1 poc
join public.program_catalog_canonical_nz_v1 pc using (programme_id)
where poc.canonical_career_id in ('accountant','financial-analyst','business-analyst','supply-chain-analyst','human-resources-specialist','marketing-specialist','auditor','project-manager')
  and pc.verification_tier = 'A'
  and pc.international_students_eligible is true
  and pc.code_signatory_status = 'confirmed'
  and coalesce(pc.canonical_admission_state,'') <> 'closed'
on conflict (profile_key,program_ref) do update set relation_type=excluded.relation_type,source_checked_at=excluded.source_checked_at;
