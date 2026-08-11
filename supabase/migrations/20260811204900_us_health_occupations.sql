-- United States health occupation cohort: 8 canonical careers.
-- SOC 2018 mappings, BLS May 2024 pay/employment, 2024-2034 projections, state licensing, and Schedule A checked 2026-08-11.

insert into public.country_occupation_profiles (
  profile_key,country_code,canonical_career_id,official_title,official_code_system,official_code_version,
  official_unit_group_code,currency,registration_required,registration_authority,registration_url,
  publication_status,source_checked_at,updated_at
) values
  ('US:registered-nurse','US','registered-nurse','Registered Nurses','SOC','SOC 2018','29-1141','USD',true,'State boards of nursing','https://www.bls.gov/ooh/healthcare/registered-nurses.htm','profile_ready','2026-08-11',now()),
  ('US:midwife','US','midwife','Nurse Midwives','SOC','SOC 2018','29-1161','USD',true,'State boards of nursing / APRN regulators','https://www.bls.gov/ooh/healthcare/nurse-anesthetists-nurse-midwives-and-nurse-practitioners.htm','profile_ready','2026-08-11',now()),
  ('US:care-worker','US','care-worker','Home Health and Personal Care Aides','SOC','SOC 2018','31-1120','USD',false,null,null,'profile_ready','2026-08-11',now()),
  ('US:physiotherapist','US','physiotherapist','Physical Therapists','SOC','SOC 2018','29-1123','USD',true,'State physical therapy licensing boards','https://www.bls.gov/ooh/healthcare/physical-therapists.htm','profile_ready','2026-08-11',now()),
  ('US:medical-laboratory-technician','US','medical-laboratory-technician','Clinical Laboratory Technologists and Technicians — technician scope','SOC','SOC 2018','29-2010','USD',false,null,null,'profile_ready','2026-08-11',now()),
  ('US:radiographer','US','radiographer','Radiologic Technologists and Technicians','SOC','SOC 2018','29-2034','USD',false,null,null,'profile_ready','2026-08-11',now()),
  ('US:pharmacist','US','pharmacist','Pharmacists','SOC','SOC 2018','29-1051','USD',true,'State boards of pharmacy','https://www.bls.gov/ooh/healthcare/pharmacists.htm','profile_ready','2026-08-11',now()),
  ('US:occupational-therapist','US','occupational-therapist','Occupational Therapists','SOC','SOC 2018','29-1122','USD',true,'State occupational therapy licensing boards','https://www.bls.gov/ooh/healthcare/occupational-therapists.htm','profile_ready','2026-08-11',now())
on conflict (profile_key) do update set
  official_title=excluded.official_title,official_code_system=excluded.official_code_system,official_code_version=excluded.official_code_version,
  official_unit_group_code=excluded.official_unit_group_code,currency=excluded.currency,registration_required=excluded.registration_required,
  registration_authority=excluded.registration_authority,registration_url=excluded.registration_url,publication_status=excluded.publication_status,
  source_checked_at=excluded.source_checked_at,updated_at=now();

insert into public.country_occupation_metric_snapshots (
  profile_key,as_of_date,employment_total,median_hourly_earnings,annualised_median_salary,
  shortage_component,vacancy_intensity_component,employer_diversity_component,vacancy_trend_component,
  entry_level_component,salary_component,growth_component,visa_component,entry_burden_component,
  opportunity_score,score_methodology_version,score_status,score_evidence,source_checked_at
) values
  ('US:registered-nurse','2026-08-11',3391000,null,93600,20,0,0,0,8,8,5,10,1,52,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','SOC 2018 29-1141 Registered Nurses. Advanced practice roles including nurse midwives remain separate canonical occupations.',
    'shortage_note','20 CFR 656.5 Schedule A Group I expressly covers professional nurses and states that sufficient U.S. workers are not available for Schedule A occupations; 20/20.',
    'salary_method','BLS May 2024 national median annual wage is USD 93,600. US v1 salary band USD 75,000–99,999 earns 8/10.',
    'growth_basis','BLS projects 5 percent employment growth from 2024 to 2034. US v1 growth band 4–6 percent earns 5/10.',
    'visa_basis','Professional nurses have Schedule A Group I labor-certification treatment when the regulatory conditions are met; state licensure and all other immigration requirements still apply; 10/10.',
    'entry_basis','BLS recognizes bachelor, associate and approved diploma nursing pathways before licensure; 8/15.',
    'entry_burden_basis','Registered nurses must be licensed by the state of intended practice; 1/5.'
  ),'2026-08-11'),
  ('US:midwife','2026-08-11',8600,null,128790,0,0,0,0,4,10,10,5,1,30,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','SOC 2018 29-1161 Nurse Midwives, an advanced-practice nursing occupation distinct from Registered Nurses 29-1141.',
    'shortage_note','BLS projects strong growth, but this cohort does not convert growth into a formal national shortage designation for Nurse Midwives; 0/20.',
    'salary_method','BLS May 2024 national median annual wage is USD 128,790. US v1 salary band at least USD 100,000 earns 10/10.',
    'growth_basis','BLS projects 11 percent employment growth from 2024 to 2034. US v1 growth band at least 10 percent earns 10/10.',
    'visa_basis','Graduate-level nurse-midwife positions may support H-1B or permanent employer sponsorship only when the specific filing satisfies the federal requirements. No separate automatic Schedule A treatment is asserted for the nurse-midwife title here; 5/10.',
    'entry_basis','BLS treats Nurse Midwives as APRNs requiring graduate education after RN preparation; 4/15.',
    'entry_burden_basis','Practice requires state nursing/APRN authority and applicable certification; 1/5.'
  ),'2026-08-11'),
  ('US:care-worker','2026-08-11',4347700,null,34900,0,0,0,0,15,2,10,2,4,33,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','SOC 2018 31-1120 Home Health and Personal Care Aides is used as the U.S. canonical care-worker scope.',
    'shortage_note','BLS projects very high growth, but the projection is a demand indicator rather than a formal federal shortage-occupation designation; 0/20.',
    'salary_method','BLS May 2024 national median annual wage is USD 34,900. US v1 salary band below USD 50,000 earns 2/10.',
    'growth_basis','BLS projects 17 percent employment growth from 2024 to 2034. US v1 growth band at least 10 percent earns 10/10.',
    'visa_basis','The occupation generally does not fit the degree-specific H-1B model. Permanent employer sponsorship can exist only through the ordinary labor-certification process and no occupation-targeted route is asserted; 2/10.',
    'entry_basis','BLS says high school is typical and some positions require no formal educational credential; 15/15.',
    'entry_burden_basis','There is no single nationwide licence, although certified home-health/hospice settings and some states impose training or certification requirements; 4/5.'
  ),'2026-08-11'),
  ('US:physiotherapist','2026-08-11',267200,null,101020,20,0,0,0,2,10,10,10,1,53,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','SOC 2018 29-1123 Physical Therapists. The canonical CampCareer title Physiotherapist is mapped to the U.S. Physical Therapist title.',
    'shortage_note','20 CFR 656.5 Schedule A Group I expressly covers physical therapists meeting the licensing-exam qualification condition; 20/20.',
    'salary_method','BLS May 2024 national median annual wage is USD 101,020. US v1 salary band at least USD 100,000 earns 10/10.',
    'growth_basis','BLS projects 11 percent employment growth from 2024 to 2034. US v1 growth band at least 10 percent earns 10/10.',
    'visa_basis','Physical therapists have Schedule A Group I labor-certification treatment when the worker has the qualifications necessary for the licensing examination in the intended state; 10/10.',
    'entry_basis','BLS says entrants need a Doctor of Physical Therapy degree; 2/15.',
    'entry_burden_basis','All states require physical therapists to be licensed; 1/5.'
  ),'2026-08-11'),
  ('US:medical-laboratory-technician','2026-08-11',351200,null,61890,0,0,0,0,8,6,2,5,3,24,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','Canonical Medical Laboratory Technician is constrained to the technician side of the BLS SOC 2018 29-2010 combined Clinical Laboratory Technologists and Technicians series.',
    'shortage_note','No Schedule A shortage credit is borrowed from nursing or physical therapy and BLS projections are not treated as a formal shortage list; 0/20.',
    'salary_method','BLS May 2024 combined 29-2010 median annual wage is USD 61,890. US v1 salary band USD 60,000–74,999 earns 6/10.',
    'growth_basis','BLS projects the combined occupation to grow 2 percent from 2024 to 2034. US v1 growth band 1–3 percent earns 2/10.',
    'visa_basis','Specific degree-level laboratory positions may support H-1B or permanent employer sponsorship where all role and filing requirements are met; this is not automatic for every technician job; 5/10.',
    'entry_basis','BLS notes technicians sometimes qualify with an associate degree even though the combined occupation typically lists bachelor-level entry; 8/15.',
    'entry_burden_basis','Some states require laboratory technologists and technicians to be licensed, but there is no universal nationwide licence; 3/5.'
  ),'2026-08-11'),
  ('US:radiographer','2026-08-11',228000,null,77660,0,0,0,0,10,8,5,5,2,30,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','SOC 2018 29-2034 Radiologic Technologists and Technicians. MRI Technologists 29-2035 are excluded from this canonical profile.',
    'shortage_note','BLS projected growth is not treated as a formal national shortage designation; 0/20.',
    'salary_method','BLS May 2024 median annual wage for Radiologic Technologists and Technicians is USD 77,660. US v1 salary band USD 75,000–99,999 earns 8/10.',
    'growth_basis','BLS projects 4 percent employment growth from 2024 to 2034. US v1 growth band 4–6 percent earns 5/10.',
    'visa_basis','A qualifying degree-specific radiologic technologist position may support H-1B or permanent employer sponsorship, but eligibility is job-specific and not guaranteed by the occupation title; 5/10.',
    'entry_basis','BLS says an associate degree is typical for radiologic technologists; 10/15.',
    'entry_burden_basis','BLS says most states require radiologic technologists to be licensed or certified; requirements are state-based rather than universal federal registration; 2/5.'
  ),'2026-08-11'),
  ('US:pharmacist','2026-08-11',335100,null,137480,0,0,0,0,2,10,5,5,1,23,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','SOC 2018 29-1051 Pharmacists.',
    'shortage_note','BLS pay and growth data do not establish a formal federal shortage designation for Pharmacists; 0/20.',
    'salary_method','BLS May 2024 national median annual wage is USD 137,480. US v1 salary band at least USD 100,000 earns 10/10.',
    'growth_basis','BLS projects 5 percent employment growth from 2024 to 2034. US v1 growth band 4–6 percent earns 5/10.',
    'visa_basis','Pharmacist positions may support H-1B or permanent employer sponsorship when the specific job and filing meet federal requirements; no occupation-targeted fast track is asserted; 5/10.',
    'entry_basis','BLS says pharmacists typically need a Doctor of Pharmacy degree; 2/15.',
    'entry_burden_basis','Every state requires pharmacists to be licensed; 1/5.'
  ),'2026-08-11'),
  ('US:occupational-therapist','2026-08-11',160000,null,98340,0,0,0,0,4,8,10,5,1,28,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','SOC 2018 29-1122 Occupational Therapists.',
    'shortage_note','The 14 percent BLS projection is not converted into a formal national shortage designation; 0/20.',
    'salary_method','BLS May 2024 national median annual wage is USD 98,340. US v1 salary band USD 75,000–99,999 earns 8/10.',
    'growth_basis','BLS projects 14 percent employment growth from 2024 to 2034. US v1 growth band at least 10 percent earns 10/10.',
    'visa_basis','Degree-specific Occupational Therapist positions may support H-1B or permanent employer sponsorship if the specific filing satisfies federal requirements; 5/10.',
    'entry_basis','BLS says Occupational Therapists typically need a master degree; 4/15.',
    'entry_burden_basis','All states require Occupational Therapists to be licensed; 1/5.'
  ),'2026-08-11')
on conflict (profile_key,as_of_date) do update set
  employment_total=excluded.employment_total,median_hourly_earnings=excluded.median_hourly_earnings,annualised_median_salary=excluded.annualised_median_salary,
  shortage_component=excluded.shortage_component,vacancy_intensity_component=excluded.vacancy_intensity_component,employer_diversity_component=excluded.employer_diversity_component,vacancy_trend_component=excluded.vacancy_trend_component,
  entry_level_component=excluded.entry_level_component,salary_component=excluded.salary_component,growth_component=excluded.growth_component,visa_component=excluded.visa_component,entry_burden_component=excluded.entry_burden_component,
  opportunity_score=excluded.opportunity_score,score_methodology_version=excluded.score_methodology_version,score_status=excluded.score_status,score_evidence=excluded.score_evidence,source_checked_at=excluded.source_checked_at;

delete from public.country_occupation_specialisations where profile_key in ('US:registered-nurse','US:midwife','US:care-worker','US:physiotherapist','US:medical-laboratory-technician','US:radiographer','US:pharmacist','US:occupational-therapist');
insert into public.country_occupation_specialisations (profile_key,official_code,official_title,shortage_rating,visa_eligible,included_in_rollup,sort_order,source_url,source_checked_at) values
  ('US:registered-nurse','29-1141','Registered Nurses',null,true,true,1,'https://www.bls.gov/ooh/healthcare/registered-nurses.htm','2026-08-11'),
  ('US:midwife','29-1161','Nurse Midwives',null,true,true,1,'https://www.bls.gov/ooh/healthcare/nurse-anesthetists-nurse-midwives-and-nurse-practitioners.htm','2026-08-11'),
  ('US:care-worker','31-1120','Home Health and Personal Care Aides',null,true,true,1,'https://www.bls.gov/ooh/healthcare/home-health-aides-and-personal-care-aides.htm','2026-08-11'),
  ('US:physiotherapist','29-1123','Physical Therapists',null,true,true,1,'https://www.bls.gov/ooh/healthcare/physical-therapists.htm','2026-08-11'),
  ('US:medical-laboratory-technician','29-2010','Clinical Laboratory Technologists and Technicians — technician scope',null,true,true,1,'https://www.bls.gov/ooh/healthcare/clinical-laboratory-technologists-and-technicians.htm','2026-08-11'),
  ('US:radiographer','29-2034','Radiologic Technologists and Technicians',null,true,true,1,'https://www.bls.gov/ooh/healthcare/radiologic-technologists.htm','2026-08-11'),
  ('US:pharmacist','29-1051','Pharmacists',null,true,true,1,'https://www.bls.gov/ooh/healthcare/pharmacists.htm','2026-08-11'),
  ('US:occupational-therapist','29-1122','Occupational Therapists',null,true,true,1,'https://www.bls.gov/ooh/healthcare/occupational-therapists.htm','2026-08-11');

delete from public.country_occupation_links where profile_key in ('US:registered-nurse','US:midwife','US:care-worker','US:physiotherapist','US:medical-laboratory-technician','US:radiographer','US:pharmacist','US:occupational-therapist');
insert into public.country_occupation_links (profile_key,link_type,label,url,provider_type,region_code,sort_order,source_checked_at) values
  ('US:registered-nurse','source','BLS Occupational Outlook Handbook — Registered Nurses','https://www.bls.gov/ooh/healthcare/registered-nurses.htm','official_labor',null,1,'2026-08-11'),
  ('US:registered-nurse','source','eCFR — 20 CFR 656.5 Schedule A','https://www.ecfr.gov/current/title-20/chapter-V/part-656/subpart-B/section-656.5','official_immigration',null,2,'2026-08-11'),
  ('US:midwife','source','BLS Occupational Outlook Handbook — Nurse Midwives','https://www.bls.gov/ooh/healthcare/nurse-anesthetists-nurse-midwives-and-nurse-practitioners.htm','official_labor',null,1,'2026-08-11'),
  ('US:midwife','source','DOL — H-1B Specialty Occupation LCA','https://flag.dol.gov/programs/LCA','official_immigration',null,2,'2026-08-11'),
  ('US:midwife','source','DOL — Permanent Labor Certification (PERM)','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','official_immigration',null,3,'2026-08-11'),
  ('US:care-worker','source','BLS Occupational Outlook Handbook — Home Health and Personal Care Aides','https://www.bls.gov/ooh/healthcare/home-health-aides-and-personal-care-aides.htm','official_labor',null,1,'2026-08-11'),
  ('US:care-worker','source','DOL — Permanent Labor Certification (PERM)','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','official_immigration',null,2,'2026-08-11'),
  ('US:physiotherapist','source','BLS Occupational Outlook Handbook — Physical Therapists','https://www.bls.gov/ooh/healthcare/physical-therapists.htm','official_labor',null,1,'2026-08-11'),
  ('US:physiotherapist','source','eCFR — 20 CFR 656.5 Schedule A','https://www.ecfr.gov/current/title-20/chapter-V/part-656/subpart-B/section-656.5','official_immigration',null,2,'2026-08-11'),
  ('US:medical-laboratory-technician','source','BLS Occupational Outlook Handbook — Clinical Laboratory Technologists and Technicians','https://www.bls.gov/ooh/healthcare/clinical-laboratory-technologists-and-technicians.htm','official_labor',null,1,'2026-08-11'),
  ('US:medical-laboratory-technician','source','DOL — H-1B Specialty Occupation LCA','https://flag.dol.gov/programs/LCA','official_immigration',null,2,'2026-08-11'),
  ('US:medical-laboratory-technician','source','DOL — Permanent Labor Certification (PERM)','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','official_immigration',null,3,'2026-08-11'),
  ('US:radiographer','source','BLS Occupational Outlook Handbook — Radiologic Technologists and Technicians','https://www.bls.gov/ooh/healthcare/radiologic-technologists.htm','official_labor',null,1,'2026-08-11'),
  ('US:radiographer','source','DOL — H-1B Specialty Occupation LCA','https://flag.dol.gov/programs/LCA','official_immigration',null,2,'2026-08-11'),
  ('US:radiographer','source','DOL — Permanent Labor Certification (PERM)','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','official_immigration',null,3,'2026-08-11'),
  ('US:pharmacist','source','BLS Occupational Outlook Handbook — Pharmacists','https://www.bls.gov/ooh/healthcare/pharmacists.htm','official_labor',null,1,'2026-08-11'),
  ('US:pharmacist','source','DOL — H-1B Specialty Occupation LCA','https://flag.dol.gov/programs/LCA','official_immigration',null,2,'2026-08-11'),
  ('US:pharmacist','source','DOL — Permanent Labor Certification (PERM)','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','official_immigration',null,3,'2026-08-11'),
  ('US:occupational-therapist','source','BLS Occupational Outlook Handbook — Occupational Therapists','https://www.bls.gov/ooh/healthcare/occupational-therapists.htm','official_labor',null,1,'2026-08-11'),
  ('US:occupational-therapist','source','DOL — H-1B Specialty Occupation LCA','https://flag.dol.gov/programs/LCA','official_immigration',null,2,'2026-08-11'),
  ('US:occupational-therapist','source','DOL — Permanent Labor Certification (PERM)','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','official_immigration',null,3,'2026-08-11');

delete from public.country_occupation_program_links where profile_key in ('US:registered-nurse','US:midwife','US:care-worker','US:physiotherapist','US:medical-laboratory-technician','US:radiographer','US:pharmacist','US:occupational-therapist');
insert into public.country_occupation_program_links (profile_key,program_ref,relation_type,source_checked_at) values
  ('US:registered-nurse','umich-bsn','direct','2026-08-11');
