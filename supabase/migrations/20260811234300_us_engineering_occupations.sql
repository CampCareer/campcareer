-- United States engineering occupation cohort: 8 canonical careers.
-- BLS 2024 employment/pay and 2024-2034 projections, O*NET manufacturing scope, H-1B/PERM and PE boundaries checked 2026-08-12.

insert into public.country_occupation_profiles (
  profile_key,country_code,canonical_career_id,official_title,official_code_system,official_code_version,
  official_unit_group_code,currency,registration_required,registration_authority,registration_url,
  publication_status,source_checked_at,updated_at
) values
  ('US:civil-engineer','US','civil-engineer','Civil Engineers','SOC','SOC 2018','17-2051','USD',false,null,null,'profile_ready','2026-08-12',now()),
  ('US:mechanical-engineer','US','mechanical-engineer','Mechanical Engineers','SOC','SOC 2018','17-2141','USD',false,null,null,'profile_ready','2026-08-12',now()),
  ('US:electrical-engineer','US','electrical-engineer','Electrical Engineers','SOC','SOC 2018','17-2071','USD',false,null,null,'profile_ready','2026-08-12',now()),
  ('US:manufacturing-engineer','US','manufacturing-engineer','Manufacturing Engineers — O*NET 17-2112.03; BLS parent 17-2112 proxy','SOC','SOC 2018','17-2112','USD',false,null,null,'profile_ready','2026-08-12',now()),
  ('US:industrial-engineer','US','industrial-engineer','Industrial Engineers','SOC','SOC 2018','17-2112','USD',false,null,null,'profile_ready','2026-08-12',now()),
  ('US:chemical-engineer','US','chemical-engineer','Chemical Engineers','SOC','SOC 2018','17-2041','USD',false,null,null,'profile_ready','2026-08-12',now()),
  ('US:environmental-engineer','US','environmental-engineer','Environmental Engineers','SOC','SOC 2018','17-2081','USD',false,null,null,'profile_ready','2026-08-12',now()),
  ('US:engineering-technician','US','engineering-technician','Engineering Technologists and Technicians, Except Drafters, All Other — broad proxy','SOC','SOC 2018','17-3029','USD',false,null,null,'profile_ready','2026-08-12',now())
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
  ('US:civil-engineer','2026-08-12',368900,null,99590,0,0,0,0,6,8,5,5,4,28,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','SOC 2018 17-2051 Civil Engineers.',
    'shortage_note','BLS growth and openings are demand indicators, not a formal federal shortage designation; 0/20.',
    'salary_method','BLS May 2024 median annual wage is USD 99,590; US v1 USD 75,000-99,999 band earns 8/10.',
    'growth_basis','BLS projects 5 percent growth from 2024 to 2034; US v1 4-6 percent band earns 5/10.',
    'visa_basis','Engineering can fit H-1B only when the specific position requires a bachelor degree or equivalent in the specific specialty; PERM remains employer/labor-certification based; 5/10.',
    'entry_basis','BLS reports bachelor-level entry; 6/15.',
    'entry_burden_basis','Licensure is not required for entry-level civil engineers, but state PE licensure is typically required for services directly to the public; conditional burden 4/5.'
  ),'2026-08-12'),
  ('US:mechanical-engineer','2026-08-12',293100,null,102320,0,0,0,0,6,10,8,5,4,33,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','SOC 2018 17-2141 Mechanical Engineers.',
    'shortage_note','No federal engineering shortage list is used; 0/20.',
    'salary_method','BLS May 2024 median annual wage is USD 102,320; 10/10 salary band.',
    'growth_basis','BLS projects 9 percent growth from 2024 to 2034; US v1 7-9 percent band earns 8/10.',
    'visa_basis','Degree-specific mechanical-engineering positions may support H-1B or PERM only when the filing independently qualifies; 5/10.',
    'entry_basis','BLS reports bachelor-level entry; 6/15.',
    'entry_burden_basis','Entry-level licensure is not universal, but all states and DC require licensure for engineers selling services to the public; 4/5.'
  ),'2026-08-12'),
  ('US:electrical-engineer','2026-08-12',192000,null,111910,0,0,0,0,6,10,8,5,4,33,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','SOC 2018 17-2071 Electrical Engineers. Electronics Engineers, Except Computer 17-2072 are excluded.',
    'shortage_note','No formal federal shortage designation is inferred from growth or openings; 0/20.',
    'salary_method','BLS May 2024 median annual wage is USD 111,910; 10/10 salary band.',
    'growth_basis','BLS projects 7 percent growth from 2024 to 2034; US v1 7-9 percent band earns 8/10.',
    'visa_basis','H-1B and PERM remain conditional on the specific degree relationship, duties and employer filing; 5/10.',
    'entry_basis','BLS reports at least bachelor-level entry in a related engineering field; 6/15.',
    'entry_burden_basis','State PE requirements can apply to regulated public-practice work but are not universal across all private-industry entry roles; 4/5.'
  ),'2026-08-12'),
  ('US:manufacturing-engineer','2026-08-12',351100,null,101140,0,0,0,0,6,10,10,5,4,35,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','O*NET 17-2112.03 Manufacturing Engineers is the exact detailed occupation. BLS publishes national wage/projection data at parent SOC 17-2112 Industrial Engineers, so those metrics are an explicit proxy rather than an exact title census.',
    'shortage_note','O*NET Bright Outlook and BLS parent growth are demand signals, not a federal shortage designation; 0/20.',
    'salary_method','BLS May 2024 Industrial Engineers parent median annual wage is USD 101,140; declared proxy, 10/10.',
    'growth_basis','BLS projects parent SOC 17-2112 to grow 11 percent from 2024 to 2034; declared proxy, 10/10.',
    'visa_basis','A degree-specific manufacturing-engineering role can support H-1B or PERM only when the particular filing qualifies; 5/10.',
    'entry_basis','O*NET places Manufacturing Engineers in Job Zone Four and commonly bachelor-level preparation; 6/15.',
    'entry_burden_basis','No universal federal licence; state PE requirements can apply at regulated professional-practice boundaries; 4/5.'
  ),'2026-08-12'),
  ('US:industrial-engineer','2026-08-12',351100,null,101140,0,0,0,0,6,10,10,5,4,35,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','SOC 2018 17-2112 Industrial Engineers.',
    'shortage_note','Strong projected demand is not converted into a national shortage designation; 0/20.',
    'salary_method','BLS May 2024 median annual wage is USD 101,140; 10/10 salary band.',
    'growth_basis','BLS projects 11 percent growth from 2024 to 2034; maximum 10/10 growth band.',
    'visa_basis','Professional H-1B or permanent employer sponsorship is job- and filing-specific; 5/10.',
    'entry_basis','BLS reports bachelor-level entry in industrial engineering or a related field; 6/15.',
    'entry_burden_basis','No universal licence across all employment; PE rules may apply to regulated services; 4/5.'
  ),'2026-08-12'),
  ('US:chemical-engineer','2026-08-12',21600,null,121860,0,0,0,0,6,10,2,5,4,27,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','SOC 2018 17-2041 Chemical Engineers.',
    'shortage_note','No formal national shortage designation is asserted; 0/20.',
    'salary_method','BLS May 2024 median annual wage is USD 121,860; 10/10 salary band.',
    'growth_basis','BLS projects 3 percent growth from 2024 to 2034; US v1 1-3 percent band earns 2/10.',
    'visa_basis','Degree-specific chemical-engineering positions may support H-1B or PERM when the filing meets federal requirements; 5/10.',
    'entry_basis','BLS reports bachelor-level chemical-engineering or related-field entry; 6/15.',
    'entry_burden_basis','No single federal licence; state PE requirements can apply to regulated professional services; 4/5.'
  ),'2026-08-12'),
  ('US:environmental-engineer','2026-08-12',39400,null,104170,0,0,0,0,6,10,5,5,4,30,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','SOC 2018 17-2081 Environmental Engineers.',
    'shortage_note','Environmental demand context is not treated as federal shortage status; 0/20.',
    'salary_method','BLS May 2024 median annual wage is USD 104,170; 10/10 salary band.',
    'growth_basis','BLS projects 4 percent growth from 2024 to 2034; US v1 4-6 percent band earns 5/10.',
    'visa_basis','H-1B and PERM remain conditional on the specific professional role and employer filing; 5/10.',
    'entry_basis','BLS reports bachelor-level environmental engineering or related-field entry; 6/15.',
    'entry_burden_basis','PE licensure can apply to public-practice or signoff responsibilities but is not universal for every entry role; 4/5.'
  ),'2026-08-12'),
  ('US:engineering-technician','2026-08-12',67300,null,77390,0,0,0,0,10,8,2,2,5,27,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','Canonical Engineering Technician spans multiple disciplines. SOC 2018 17-3029 Engineering Technologists and Technicians, Except Drafters, All Other is used as a broad national proxy; discipline-specific technician series are not rolled in.',
    'shortage_note','Replacement openings and broad technician demand do not create shortage status; 0/20.',
    'salary_method','BLS 2024 median annual wage for 17-3029 is USD 77,390; 8/10 salary band.',
    'growth_basis','BLS projects 17-3029 to grow 1.5 percent from 2024 to 2034; US v1 1-3 percent band earns 2/10.',
    'visa_basis','The broad proxy normally has associate-degree entry and generally does not fit the degree-specific H-1B model; permanent sponsorship remains case-specific; 2/10.',
    'entry_basis','BLS assigns associate-degree entry to 17-3029; 10/15.',
    'entry_burden_basis','No universal engineering-technician licence; 5/5.'
  ),'2026-08-12')
on conflict (profile_key,as_of_date) do update set
  employment_total=excluded.employment_total,median_hourly_earnings=excluded.median_hourly_earnings,annualised_median_salary=excluded.annualised_median_salary,
  shortage_component=excluded.shortage_component,vacancy_intensity_component=excluded.vacancy_intensity_component,employer_diversity_component=excluded.employer_diversity_component,vacancy_trend_component=excluded.vacancy_trend_component,
  entry_level_component=excluded.entry_level_component,salary_component=excluded.salary_component,growth_component=excluded.growth_component,visa_component=excluded.visa_component,entry_burden_component=excluded.entry_burden_component,
  opportunity_score=excluded.opportunity_score,score_methodology_version=excluded.score_methodology_version,score_status=excluded.score_status,score_evidence=excluded.score_evidence,source_checked_at=excluded.source_checked_at;

delete from public.country_occupation_specialisations where profile_key in ('US:civil-engineer','US:mechanical-engineer','US:electrical-engineer','US:manufacturing-engineer','US:industrial-engineer','US:chemical-engineer','US:environmental-engineer','US:engineering-technician');
insert into public.country_occupation_specialisations (profile_key,official_code,official_title,shortage_rating,visa_eligible,included_in_rollup,sort_order,source_url,source_checked_at) values
  ('US:civil-engineer','17-2051','Civil Engineers',null,true,true,1,'https://www.bls.gov/ooh/architecture-and-engineering/civil-engineers.htm','2026-08-12'),
  ('US:mechanical-engineer','17-2141','Mechanical Engineers',null,true,true,1,'https://www.bls.gov/ooh/architecture-and-engineering/mechanical-engineers.htm','2026-08-12'),
  ('US:electrical-engineer','17-2071','Electrical Engineers',null,true,true,1,'https://www.bls.gov/ooh/architecture-and-engineering/electrical-and-electronics-engineers.htm','2026-08-12'),
  ('US:manufacturing-engineer','17-2112.03','Manufacturing Engineers — O*NET detailed occupation; BLS metrics use parent 17-2112',null,true,true,1,'https://www.onetonline.org/link/details/17-2112.03','2026-08-12'),
  ('US:industrial-engineer','17-2112','Industrial Engineers',null,true,true,1,'https://www.bls.gov/ooh/architecture-and-engineering/industrial-engineers.htm','2026-08-12'),
  ('US:chemical-engineer','17-2041','Chemical Engineers',null,true,true,1,'https://www.bls.gov/ooh/architecture-and-engineering/chemical-engineers.htm','2026-08-12'),
  ('US:environmental-engineer','17-2081','Environmental Engineers',null,true,true,1,'https://www.bls.gov/ooh/architecture-and-engineering/environmental-engineers.htm','2026-08-12'),
  ('US:engineering-technician','17-3029','Engineering Technologists and Technicians, Except Drafters, All Other — broad proxy',null,true,true,1,'https://www.bls.gov/emp/tables/occupational-projections-and-characteristics.htm','2026-08-12');

delete from public.country_occupation_links where profile_key in ('US:civil-engineer','US:mechanical-engineer','US:electrical-engineer','US:manufacturing-engineer','US:industrial-engineer','US:chemical-engineer','US:environmental-engineer','US:engineering-technician');
insert into public.country_occupation_links (profile_key,link_type,label,url,provider_type,region_code,sort_order,source_checked_at) values
  ('US:civil-engineer','source','BLS — Civil Engineers','https://www.bls.gov/ooh/architecture-and-engineering/civil-engineers.htm','government',null,1,'2026-08-12'),
  ('US:civil-engineer','source','DOL — H-1B Specialty Workers','https://www.dol.gov/agencies/eta/foreign-labor/programs/h-1b','government',null,2,'2026-08-12'),
  ('US:civil-engineer','source','DOL — Permanent Labor Certification','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','government',null,3,'2026-08-12'),
  ('US:mechanical-engineer','source','BLS — Mechanical Engineers','https://www.bls.gov/ooh/architecture-and-engineering/mechanical-engineers.htm','government',null,1,'2026-08-12'),
  ('US:mechanical-engineer','source','DOL — H-1B Specialty Workers','https://www.dol.gov/agencies/eta/foreign-labor/programs/h-1b','government',null,2,'2026-08-12'),
  ('US:mechanical-engineer','source','DOL — Permanent Labor Certification','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','government',null,3,'2026-08-12'),
  ('US:electrical-engineer','source','BLS — Electrical Engineers','https://www.bls.gov/ooh/architecture-and-engineering/electrical-and-electronics-engineers.htm','government',null,1,'2026-08-12'),
  ('US:electrical-engineer','source','DOL — H-1B Specialty Workers','https://www.dol.gov/agencies/eta/foreign-labor/programs/h-1b','government',null,2,'2026-08-12'),
  ('US:electrical-engineer','source','DOL — Permanent Labor Certification','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','government',null,3,'2026-08-12'),
  ('US:manufacturing-engineer','source','O*NET — Manufacturing Engineers 17-2112.03','https://www.onetonline.org/link/details/17-2112.03','government',null,1,'2026-08-12'),
  ('US:manufacturing-engineer','source','BLS — Industrial Engineers parent metrics','https://www.bls.gov/ooh/architecture-and-engineering/industrial-engineers.htm','government',null,2,'2026-08-12'),
  ('US:manufacturing-engineer','source','DOL — H-1B Specialty Workers','https://www.dol.gov/agencies/eta/foreign-labor/programs/h-1b','government',null,3,'2026-08-12'),
  ('US:manufacturing-engineer','source','DOL — Permanent Labor Certification','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','government',null,4,'2026-08-12'),
  ('US:industrial-engineer','source','BLS — Industrial Engineers','https://www.bls.gov/ooh/architecture-and-engineering/industrial-engineers.htm','government',null,1,'2026-08-12'),
  ('US:industrial-engineer','source','DOL — H-1B Specialty Workers','https://www.dol.gov/agencies/eta/foreign-labor/programs/h-1b','government',null,2,'2026-08-12'),
  ('US:industrial-engineer','source','DOL — Permanent Labor Certification','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','government',null,3,'2026-08-12'),
  ('US:chemical-engineer','source','BLS — Chemical Engineers','https://www.bls.gov/ooh/architecture-and-engineering/chemical-engineers.htm','government',null,1,'2026-08-12'),
  ('US:chemical-engineer','source','DOL — H-1B Specialty Workers','https://www.dol.gov/agencies/eta/foreign-labor/programs/h-1b','government',null,2,'2026-08-12'),
  ('US:chemical-engineer','source','DOL — Permanent Labor Certification','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','government',null,3,'2026-08-12'),
  ('US:environmental-engineer','source','BLS — Environmental Engineers','https://www.bls.gov/ooh/architecture-and-engineering/environmental-engineers.htm','government',null,1,'2026-08-12'),
  ('US:environmental-engineer','source','DOL — H-1B Specialty Workers','https://www.dol.gov/agencies/eta/foreign-labor/programs/h-1b','government',null,2,'2026-08-12'),
  ('US:environmental-engineer','source','DOL — Permanent Labor Certification','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','government',null,3,'2026-08-12'),
  ('US:engineering-technician','source','BLS — Occupational projections 17-3029','https://www.bls.gov/emp/tables/occupational-projections-and-characteristics.htm','government',null,1,'2026-08-12'),
  ('US:engineering-technician','source','DOL — H-1B Specialty Workers','https://www.dol.gov/agencies/eta/foreign-labor/programs/h-1b','government',null,2,'2026-08-12'),
  ('US:engineering-technician','source','DOL — Permanent Labor Certification','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','government',null,3,'2026-08-12');

insert into public.country_occupation_program_links (profile_key,program_ref,relation_type,source_checked_at) values
  ('US:civil-engineer','umich-bse-civil-engineering','direct','2026-08-12'),
  ('US:civil-engineer','utaustin-bs-civil-engineering','direct','2026-08-12'),
  ('US:civil-engineer','uw-bs-civil-engineering','direct','2026-08-12'),
  ('US:environmental-engineer','wisc-bs-environmental-engineering','direct','2026-08-12'),
  ('US:industrial-engineer','umich-bse-industrial-operations-engineering','direct','2026-08-12'),
  ('US:manufacturing-engineer','psu-bs-mechanical-engineering','related','2026-08-12'),
  ('US:manufacturing-engineer','umich-bse-industrial-operations-engineering','related','2026-08-12'),
  ('US:mechanical-engineer','psu-bs-mechanical-engineering','direct','2026-08-12')
on conflict (profile_key,program_ref) do update set relation_type=excluded.relation_type,source_checked_at=excluded.source_checked_at;
