delete from public.country_occupation_links
where profile_key in ('NZ:truck-driver','NZ:logistics-coordinator','NZ:aircraft-maintenance-technician','NZ:commercial-pilot','NZ:marine-engineer','NZ:deck-officer','NZ:warehouse-manager','NZ:automotive-service-technician');

insert into public.country_occupation_links (profile_key,link_type,label,url,provider_type,region_code,sort_order,source_checked_at) values
('NZ:truck-driver','entry_program','Tahatū — Heavy Truck Driver','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00980-heavy-truck-driver','government_career_service',null,1,'2026-08-11'),
('NZ:truck-driver','source','NZTA — Heavy vehicle licences','https://www.nzta.govt.nz/driver-licences/getting-a-licence/licences-by-vehicle-type/heavy-vehicles','official_regulator',null,2,'2026-08-11'),
('NZ:truck-driver','source','ABS — ANZSCO 7331 Truck Drivers / 733111 Truck Driver (General)','https://www.abs.gov.au/statistics/classifications/anzsco-australian-and-new-zealand-standard-classification-occupations/2022/browse-classification/7/73/733/7331','official_classification',null,3,'2026-08-11'),
('NZ:truck-driver','source','Immigration New Zealand — Green List Appendix 13','https://www.immigration.govt.nz/opsmanual/77204.htm','official_migration',null,4,'2026-08-11'),
('NZ:logistics-coordinator','entry_program','Tahatū — Logistics Specialist (includes Logistics Coordinator)','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00084-logistics-specialist','government_career_service',null,1,'2026-08-11'),
('NZ:logistics-coordinator','source','ABS — ANZSCO 133611 Supply and Distribution Manager (manager boundary only)','https://www.abs.gov.au/statistics/classifications/anzsco-australian-and-new-zealand-standard-classification-occupations/2022/browse-classification/1/13/133/1336','official_classification',null,2,'2026-08-11'),
('NZ:logistics-coordinator','source','Immigration New Zealand — Green List Appendix 13','https://www.immigration.govt.nz/opsmanual/77204.htm','official_migration',null,3,'2026-08-11'),
('NZ:aircraft-maintenance-technician','entry_program','Tahatū — Aircraft Maintenance Engineer','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00810-aircraft-maintenance-engineer','government_career_service',null,1,'2026-08-11'),
('NZ:aircraft-maintenance-technician','source','CAA New Zealand — Maintenance engineer licensing','https://www.aviation.govt.nz/licensing-and-certification/engineering/maintenance-engineer-licensing/','official_regulator',null,2,'2026-08-11'),
('NZ:aircraft-maintenance-technician','source','ABS — ANZSCO 3231 Aircraft Maintenance Engineers (323111/323112/323113)','https://www.abs.gov.au/statistics/classifications/anzsco-australian-and-new-zealand-standard-classification-occupations/2022/browse-classification/3/32/323/3231','official_classification',null,3,'2026-08-11'),
('NZ:aircraft-maintenance-technician','source','Immigration New Zealand — Green List Appendix 13','https://www.immigration.govt.nz/opsmanual/77204.htm','official_migration',null,4,'2026-08-11'),
('NZ:commercial-pilot','entry_program','Tahatū — Pilot','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00973-pilot','government_career_service',null,1,'2026-08-11'),
('NZ:commercial-pilot','source','CAA New Zealand — Part 61 Subpart E Commercial Pilot Licences','https://www.aviation.govt.nz/rules/rule-part/part-61/subpart-e/','official_regulator',null,2,'2026-08-11'),
('NZ:commercial-pilot','source','ABS — ANZSCO 2311 Air Transport Professionals','https://www.abs.gov.au/statistics/classifications/anzsco-australian-and-new-zealand-standard-classification-occupations/2022/browse-classification/2/23/231/2311','official_classification',null,3,'2026-08-11'),
('NZ:commercial-pilot','source','Immigration New Zealand — Green List Appendix 13','https://www.immigration.govt.nz/opsmanual/77204.htm','official_migration',null,4,'2026-08-11'),
('NZ:marine-engineer','entry_program','Tahatū — Marine Engineer','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00996-marine-engineer','government_career_service',null,1,'2026-08-11'),
('NZ:marine-engineer','source','Maritime New Zealand — Getting certified','https://www.maritimenz.govt.nz/seafarers/getting-certified/','official_regulator',null,2,'2026-08-11'),
('NZ:marine-engineer','source','ABS — ANZSCO 2312 Marine Transport Professionals / 231212 Ship''s Engineer','https://www.abs.gov.au/statistics/classifications/anzsco-australian-and-new-zealand-standard-classification-occupations/2022/browse-classification/2/23/231/2312','official_classification',null,3,'2026-08-11'),
('NZ:marine-engineer','source','Immigration New Zealand — Green List Appendix 13','https://www.immigration.govt.nz/opsmanual/77204.htm','official_migration',null,4,'2026-08-11'),
('NZ:deck-officer','entry_program','Tahatū — Deckhand (maritime feeder/pay proxy)','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00993-deckhand','government_career_service',null,1,'2026-08-11'),
('NZ:deck-officer','source','Maritime New Zealand — Getting certified','https://www.maritimenz.govt.nz/seafarers/getting-certified/','official_regulator',null,2,'2026-08-11'),
('NZ:deck-officer','source','ABS — ANZSCO 2312 Marine Transport Professionals / 231214 Ship''s Officer','https://www.abs.gov.au/statistics/classifications/anzsco-australian-and-new-zealand-standard-classification-occupations/2022/browse-classification/2/23/231/2312','official_classification',null,3,'2026-08-11'),
('NZ:deck-officer','source','Immigration New Zealand — Green List Appendix 13','https://www.immigration.govt.nz/opsmanual/77204.htm','official_migration',null,4,'2026-08-11'),
('NZ:warehouse-manager','entry_program','Tahatū — Transportation, Storage and Distribution Manager','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00026-transportation-storage-and-distribution-manager','government_career_service',null,1,'2026-08-11'),
('NZ:warehouse-manager','source','ABS — ANZSCO 133611 Supply and Distribution Manager','https://www.abs.gov.au/statistics/classifications/anzsco-australian-and-new-zealand-standard-classification-occupations/2022/browse-classification/1/13/133/1336','official_classification',null,2,'2026-08-11'),
('NZ:warehouse-manager','source','Immigration New Zealand — Green List Appendix 13','https://www.immigration.govt.nz/opsmanual/77204.htm','official_migration',null,3,'2026-08-11'),
('NZ:automotive-service-technician','entry_program','Tahatū — Automotive Technician','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00813-automotive-technician','government_career_service',null,1,'2026-08-11'),
('NZ:automotive-service-technician','source','ABS — ANZSCO 3212 Motor Mechanics / 321211 Motor Mechanic (General)','https://www.abs.gov.au/statistics/classifications/anzsco-australian-and-new-zealand-standard-classification-occupations/2022/browse-classification/3/32/321/3212','official_classification',null,2,'2026-08-11'),
('NZ:automotive-service-technician','source','Immigration New Zealand — Green List Appendix 13','https://www.immigration.govt.nz/opsmanual/77204.htm','official_migration',null,3,'2026-08-11')
on conflict (profile_key,link_type,url) do update set label=excluded.label,provider_type=excluded.provider_type,region_code=excluded.region_code,sort_order=excluded.sort_order,source_checked_at=excluded.source_checked_at;

delete from public.country_occupation_program_links
where profile_key in ('NZ:truck-driver','NZ:logistics-coordinator','NZ:aircraft-maintenance-technician','NZ:commercial-pilot','NZ:marine-engineer','NZ:deck-officer','NZ:warehouse-manager','NZ:automotive-service-technician')
  and program_ref like 'nz-program:%';

insert into public.country_occupation_program_links (profile_key,program_ref,relation_type,source_checked_at)
select 'NZ:'||poc.canonical_career_id,'nz-program:'||poc.programme_id::text,'direct','2026-08-11'
from public.program_occupation_canonical_nz_v1 poc
join public.program_catalog_canonical_nz_v1 pc using (programme_id)
where poc.canonical_career_id in ('truck-driver','logistics-coordinator','aircraft-maintenance-technician','commercial-pilot','marine-engineer','deck-officer','warehouse-manager','automotive-service-technician')
  and pc.verification_tier = 'A'
  and pc.international_students_eligible is true
  and pc.code_signatory_status = 'confirmed'
  and coalesce(pc.canonical_admission_state,'') <> 'closed'
on conflict (profile_key,program_ref) do update set relation_type=excluded.relation_type,source_checked_at=excluded.source_checked_at;
