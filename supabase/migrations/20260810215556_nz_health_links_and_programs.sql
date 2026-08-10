insert into public.country_occupation_specialisations (profile_key,official_code,official_title,shortage_rating,visa_eligible,included_in_rollup,sort_order,source_url,source_checked_at) values
('NZ:registered-nurse','254412','Registered Nurse (Aged Care)',null,true,true,1,'https://www.immigration.govt.nz/opsmanual/89117.htm','2026-08-10'),
('NZ:registered-nurse','254413','Registered Nurse (Child and Family Health)',null,true,true,2,'https://www.immigration.govt.nz/opsmanual/89117.htm','2026-08-10'),
('NZ:registered-nurse','254414','Registered Nurse (Community Health)',null,true,true,3,'https://www.immigration.govt.nz/opsmanual/89117.htm','2026-08-10'),
('NZ:registered-nurse','254415','Registered Nurse (Critical Care and Emergency)',null,true,true,4,'https://www.immigration.govt.nz/opsmanual/89117.htm','2026-08-10'),
('NZ:registered-nurse','254416','Registered Nurse (Developmental Disability)',null,true,true,5,'https://www.immigration.govt.nz/opsmanual/89117.htm','2026-08-10'),
('NZ:registered-nurse','254417','Registered Nurse (Disability and Rehabilitation)',null,true,true,6,'https://www.immigration.govt.nz/opsmanual/89117.htm','2026-08-10'),
('NZ:registered-nurse','254418','Registered Nurse (Medical)',null,true,true,7,'https://www.immigration.govt.nz/opsmanual/89117.htm','2026-08-10'),
('NZ:registered-nurse','254421','Registered Nurse (Medical Practice)',null,true,true,8,'https://www.immigration.govt.nz/opsmanual/89117.htm','2026-08-10'),
('NZ:registered-nurse','254422','Registered Nurse (Mental Health)',null,true,true,9,'https://www.immigration.govt.nz/opsmanual/89117.htm','2026-08-10'),
('NZ:registered-nurse','254423','Registered Nurse (Perioperative)',null,true,true,10,'https://www.immigration.govt.nz/opsmanual/89117.htm','2026-08-10'),
('NZ:registered-nurse','254424','Registered Nurse (Surgical)',null,true,true,11,'https://www.immigration.govt.nz/opsmanual/89117.htm','2026-08-10'),
('NZ:registered-nurse','254425','Registered Nurse (Paediatrics)',null,true,true,12,'https://www.immigration.govt.nz/opsmanual/89117.htm','2026-08-10'),
('NZ:registered-nurse','254499','Registered Nurses nec',null,true,true,13,'https://www.immigration.govt.nz/opsmanual/89117.htm','2026-08-10'),
('NZ:midwife','254111','Midwife',null,true,true,1,'https://www.immigration.govt.nz/opsmanual/89117.htm','2026-08-10'),
('NZ:care-worker','423313','Personal Care Assistant (Health Care Assistant)',null,true,true,1,'https://www.immigration.govt.nz/visas/care-workforce-work-to-residence-visa/','2026-08-10'),
('NZ:physiotherapist','252511','Physiotherapist',null,true,true,1,'https://www.immigration.govt.nz/opsmanual/89117.htm','2026-08-10'),
('NZ:medical-lab-tech','311213','Medical Laboratory Technician / Pre-Analytical Technician',null,true,true,1,'https://www.immigration.govt.nz/opsmanual/89117.htm','2026-08-10'),
('NZ:radiographer','251211','Medical Imaging Technologist',null,true,true,1,'https://www.immigration.govt.nz/opsmanual/89117.htm','2026-08-10'),
('NZ:pharmacist','251511','Hospital Pharmacist',null,true,true,1,'https://www.immigration.govt.nz/opsmanual/89117.htm','2026-08-10'),
('NZ:pharmacist','251512','Industrial Pharmacist',null,true,true,2,'https://www.immigration.govt.nz/opsmanual/89117.htm','2026-08-10'),
('NZ:pharmacist','251513','Retail Pharmacist',null,true,true,3,'https://www.immigration.govt.nz/opsmanual/89117.htm','2026-08-10'),
('NZ:occupational-therapist','252411','Occupational Therapist',null,true,true,1,'https://www.immigration.govt.nz/opsmanual/89117.htm','2026-08-10')
on conflict (profile_key,official_code) do update set official_title=excluded.official_title,shortage_rating=excluded.shortage_rating,visa_eligible=excluded.visa_eligible,included_in_rollup=excluded.included_in_rollup,sort_order=excluded.sort_order,source_url=excluded.source_url,source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_links (profile_key,link_type,label,url,provider_type,region_code,sort_order,source_checked_at) values
('NZ:registered-nurse','entry_program','Tahatū — Registered Nurse','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00454-registered-nurse','official_training',null,1,'2026-08-10'),
('NZ:registered-nurse','source','Nursing Council — Register as a nurse','https://www.nursingcouncil.org.nz/Public/NCNZ/nursing-section/Register_as_a_nurse.aspx','official_regulator',null,2,'2026-08-10'),
('NZ:registered-nurse','source','Immigration New Zealand — Green List','https://www.immigration.govt.nz/opsmanual/89117.htm','official_immigration',null,3,'2026-08-10'),
('NZ:midwife','entry_program','Tahatū — Bachelor degrees in Midwifery','https://tahatu.govt.nz/study-and-training/explore-study-and-training/0603-nursing-and-midwifery/060303/05-bachelors-degrees-in-midwifery','official_training',null,1,'2026-08-10'),
('NZ:midwife','source','Midwifery Council — overseas registered midwife','https://www.midwiferycouncil.health.nz/Public/Unpublished-or-Removed-content/Public/07.-I-want-to-be-a-midwife-Aotearoa--New-Zealand/3.-I-am-an-overseas-registered-midwife.aspx','official_regulator',null,2,'2026-08-10'),
('NZ:midwife','source','Immigration New Zealand — Green List','https://www.immigration.govt.nz/opsmanual/89117.htm','official_immigration',null,3,'2026-08-10'),
('NZ:care-worker','entry_program','Tahatū — Health Care Assistant','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00527-health-care-assistant','official_training',null,1,'2026-08-10'),
('NZ:care-worker','source','Immigration New Zealand — Care Workforce Work to Residence','https://www.immigration.govt.nz/visas/care-workforce-work-to-residence-visa/','official_immigration',null,2,'2026-08-10'),
('NZ:care-worker','source','Immigration New Zealand — care occupations recognised at higher skill level','https://www.immigration.govt.nz/work/requirements-for-work-visas/green-list-occupations-qualifications-and-skills/anzsco-occupations-recognised-at-a-higher-skill-level/','official_immigration',null,3,'2026-08-10'),
('NZ:physiotherapist','entry_program','Tahatū — Bachelor degrees in Physiotherapy','https://tahatu.govt.nz/study-and-training/explore-study-and-training/0617-rehabilitation-therapies/061701/05-bachelors-degrees-in-physiotherapy','official_training',null,1,'2026-08-10'),
('NZ:physiotherapist','source','Physiotherapy Board — registration','https://physioboard.org.nz/registering-in-aotearoa-new-zealand','official_regulator',null,2,'2026-08-10'),
('NZ:physiotherapist','source','Immigration New Zealand — Green List','https://www.immigration.govt.nz/opsmanual/89117.htm','official_immigration',null,3,'2026-08-10'),
('NZ:medical-lab-tech','entry_program','Tahatū — Medical Laboratory Pre-Analytical Technician','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00543-medical-laboratory-pre-analytical-technician','official_training',null,1,'2026-08-10'),
('NZ:medical-lab-tech','source','Medical Sciences Council — MLT registration','https://www.mscouncil.org.nz/pre-registration/overseas-trained-how-to-register/overseas-trained-registration-medical-laboratory-technician','official_regulator',null,2,'2026-08-10'),
('NZ:medical-lab-tech','source','Immigration New Zealand — Green List','https://www.immigration.govt.nz/opsmanual/89117.htm','official_immigration',null,3,'2026-08-10'),
('NZ:radiographer','entry_program','Tahatū — Medical Imaging Technologist','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00501-medical-imaging-technologist','official_training',null,1,'2026-08-10'),
('NZ:radiographer','source','Medical Radiation Technologists Board — overseas registration','https://www.mrtboard.org.nz/pre-registration/overseas-trained-how-to-register','official_regulator',null,2,'2026-08-10'),
('NZ:radiographer','source','Immigration New Zealand — Green List','https://www.immigration.govt.nz/opsmanual/89117.htm','official_immigration',null,3,'2026-08-10'),
('NZ:pharmacist','entry_program','Tahatū — Bachelor degrees in Pharmacy','https://tahatu.govt.nz/study-and-training/explore-study-and-training/0605-pharmacy-studies/060501/05-bachelors-degrees-in-pharmacy','official_training',null,1,'2026-08-10'),
('NZ:pharmacist','source','Pharmacy Council — registration routes','https://pharmacycouncil.org.nz/pharmacy_registries/i-want-to-register-as-a-pharmacist/','official_regulator',null,2,'2026-08-10'),
('NZ:pharmacist','source','Immigration New Zealand — Green List','https://www.immigration.govt.nz/opsmanual/89117.htm','official_immigration',null,3,'2026-08-10'),
('NZ:occupational-therapist','entry_program','Tahatū — Bachelor degrees in Occupational Therapy','https://tahatu.govt.nz/study-and-training/explore-study-and-training/0617-rehabilitation-therapies/061703/05-bachelors-degrees-in-occupational-therapy','official_training',null,1,'2026-08-10'),
('NZ:occupational-therapist','source','Ministry of Health — responsible authorities','https://www.health.govt.nz/regulation-legislation/health-practitioners/responsible-authorities','official_regulator',null,2,'2026-08-10'),
('NZ:occupational-therapist','source','Immigration New Zealand — Green List','https://www.immigration.govt.nz/opsmanual/89117.htm','official_immigration',null,3,'2026-08-10')
on conflict (profile_key,link_type,url) do update set label=excluded.label,provider_type=excluded.provider_type,region_code=excluded.region_code,sort_order=excluded.sort_order,source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_program_links (profile_key,program_ref,relation_type,source_checked_at)
select 'NZ:' || m.canonical_career_id,
       'nz-program:' || m.programme_id::text,
       m.normalized_relation_type,
       '2026-08-10'::date
from public.program_occupation_canonical_nz_v1 m
join public.program_catalog_canonical_nz_v1 c using (programme_id)
where m.canonical_career_id in ('registered-nurse','midwife','physiotherapist','pharmacist')
  and c.verification_tier = 'A'
  and c.international_students_eligible is true
  and c.code_signatory_status = 'confirmed'
  and coalesce(c.canonical_admission_state,'') <> 'closed'
on conflict (profile_key,program_ref) do update set relation_type=excluded.relation_type,source_checked_at=excluded.source_checked_at;
