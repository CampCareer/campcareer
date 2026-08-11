delete from public.country_occupation_links
where profile_key in ('NZ:chef','NZ:cook','NZ:hotel-manager','NZ:restaurant-manager','NZ:baker','NZ:tourism-manager','NZ:event-planner','NZ:hospitality-supervisor');

insert into public.country_occupation_links (profile_key,link_type,label,url,provider_type,region_code,sort_order,source_checked_at) values
('NZ:chef','entry_program','Tahatū — Chef','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00575-chef','government_career_service',null,1,'2026-08-11'),
('NZ:chef','source','ABS — ANZSCO 3513 Chefs','https://www.abs.gov.au/statistics/classifications/anzsco-australian-and-new-zealand-standard-classification-occupations/2021/browse-classification/3/35/351/3513','official_classification',null,2,'2026-08-11'),
('NZ:chef','source','Immigration New Zealand — NOL occupations used for an AEWV','https://www.immigration.govt.nz/work/requirements-for-work-visas/green-list-occupations-qualifications-and-skills/national-occupation-list-occupations-used-for-an-aewv/','official_migration',null,3,'2026-08-11'),
('NZ:chef','source','Immigration New Zealand — Green List Appendix 13','https://www.immigration.govt.nz/opsmanual/89117.htm','official_migration',null,4,'2026-08-11'),
('NZ:cook','entry_program','Tahatū — Cook','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00580-cook','government_career_service',null,1,'2026-08-11'),
('NZ:cook','source','ABS — ANZSCO 3514 Cooks','https://www.abs.gov.au/statistics/classifications/anzsco-australian-and-new-zealand-standard-classification-occupations/2021/browse-classification/3/35/351/3514','official_classification',null,2,'2026-08-11'),
('NZ:cook','source','Immigration New Zealand — Green List Appendix 13','https://www.immigration.govt.nz/opsmanual/89117.htm','official_migration',null,3,'2026-08-11'),
('NZ:hotel-manager','entry_program','Tahatū — Accommodation Manager','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00048-accommodation-manager','government_career_service',null,1,'2026-08-11'),
('NZ:hotel-manager','source','ABS — ANZSCO 1413 Hotel and Motel Managers','https://www.abs.gov.au/statistics/classifications/anzsco-australian-and-new-zealand-standard-classification-occupations/2021/browse-classification/1/14/141/1413','official_classification',null,2,'2026-08-11'),
('NZ:hotel-manager','source','Immigration New Zealand — Green List Appendix 13','https://www.immigration.govt.nz/opsmanual/89117.htm','official_migration',null,3,'2026-08-11'),
('NZ:restaurant-manager','entry_program','Tahatū — Restaurant Manager','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00045-restaurant-manager','government_career_service',null,1,'2026-08-11'),
('NZ:restaurant-manager','source','ABS — ANZSCO 1411 Cafe and Restaurant Managers','https://www.abs.gov.au/statistics/classifications/anzsco-australian-and-new-zealand-standard-classification-occupations/2021/browse-classification/1/14/141/1411','official_classification',null,2,'2026-08-11'),
('NZ:restaurant-manager','source','Immigration New Zealand — Green List Appendix 13','https://www.immigration.govt.nz/opsmanual/89117.htm','official_migration',null,3,'2026-08-11'),
('NZ:baker','entry_program','Tahatū — Baker','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00861-baker','government_career_service',null,1,'2026-08-11'),
('NZ:baker','source','ABS — ANZSCO 3511 Bakers and Pastrycooks','https://www.abs.gov.au/statistics/classifications/anzsco-australian-and-new-zealand-standard-classification-occupations/2021/browse-classification/3/35/351/3511','official_classification',null,2,'2026-08-11'),
('NZ:baker','source','Immigration New Zealand — Green List Appendix 13','https://www.immigration.govt.nz/opsmanual/89117.htm','official_migration',null,3,'2026-08-11'),
('NZ:tourism-manager','entry_program','Tahatū — Travel Agent (tourism-management feeder proxy)','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00648-travel-agent','government_career_service',null,1,'2026-08-11'),
('NZ:tourism-manager','source','ABS — ANZSCO 1421 Retail Managers / 142116 Travel Agency Manager','https://www.abs.gov.au/statistics/classifications/anzsco-australian-and-new-zealand-standard-classification-occupations/2021/browse-classification/1/14/142/1421','official_classification',null,2,'2026-08-11'),
('NZ:tourism-manager','source','Immigration New Zealand — Green List Appendix 13','https://www.immigration.govt.nz/opsmanual/89117.htm','official_migration',null,3,'2026-08-11'),
('NZ:event-planner','entry_program','Tahatū — Event Manager','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00089-event-manager','government_career_service',null,1,'2026-08-11'),
('NZ:event-planner','source','ABS — ANZSCO 1493 Conference and Event Organisers','https://www.abs.gov.au/statistics/classifications/anzsco-australian-and-new-zealand-standard-classification-occupations/2021/browse-classification/1/14/149/1493','official_classification',null,2,'2026-08-11'),
('NZ:event-planner','source','Immigration New Zealand — Green List Appendix 13','https://www.immigration.govt.nz/opsmanual/89117.htm','official_migration',null,3,'2026-08-11'),
('NZ:hospitality-supervisor','entry_program','Tahatū — Food Service Worker Supervisor','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00576-food-service-worker-supervisor','government_career_service',null,1,'2026-08-11'),
('NZ:hospitality-supervisor','source','Immigration New Zealand — NOL occupations used for an AEWV','https://www.immigration.govt.nz/work/requirements-for-work-visas/green-list-occupations-qualifications-and-skills/national-occupation-list-occupations-used-for-an-aewv/','official_migration',null,2,'2026-08-11'),
('NZ:hospitality-supervisor','source','Immigration New Zealand — Green List Appendix 13','https://www.immigration.govt.nz/opsmanual/89117.htm','official_migration',null,3,'2026-08-11')
on conflict (profile_key,link_type,url) do update set label=excluded.label,provider_type=excluded.provider_type,region_code=excluded.region_code,sort_order=excluded.sort_order,source_checked_at=excluded.source_checked_at;

delete from public.country_occupation_program_links
where profile_key in ('NZ:chef','NZ:cook','NZ:hotel-manager','NZ:restaurant-manager','NZ:baker','NZ:tourism-manager','NZ:event-planner','NZ:hospitality-supervisor')
  and program_ref like 'nz-program:%';

insert into public.country_occupation_program_links (profile_key,program_ref,relation_type,source_checked_at)
select 'NZ:'||poc.canonical_career_id,'nz-program:'||poc.programme_id::text,'direct','2026-08-11'
from public.program_occupation_canonical_nz_v1 poc
join public.program_catalog_canonical_nz_v1 pc using (programme_id)
where poc.canonical_career_id in ('chef','cook','hotel-manager','restaurant-manager','baker','tourism-manager','event-planner','hospitality-supervisor')
  and pc.verification_tier = 'A'
  and pc.international_students_eligible is true
  and pc.code_signatory_status = 'confirmed'
  and coalesce(pc.canonical_admission_state,'') <> 'closed'
on conflict (profile_key,program_ref) do update set relation_type=excluded.relation_type,source_checked_at=excluded.source_checked_at;