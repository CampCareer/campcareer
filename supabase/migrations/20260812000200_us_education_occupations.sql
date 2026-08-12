-- United States education occupation cohort: 8 canonical careers.
-- BLS 2024 employment/pay and 2024-2034 projections plus state licensing and H-1B/PERM boundaries checked 2026-08-12.

insert into public.country_occupation_profiles (
  profile_key,country_code,canonical_career_id,official_title,official_code_system,official_code_version,
  official_unit_group_code,currency,registration_required,registration_authority,registration_url,
  publication_status,source_checked_at,updated_at
) values
  ('US:early-childhood-teacher','US','early-childhood-teacher','Preschool Teachers, Except Special Education','SOC','SOC 2018','25-2011','USD',false,null,null,'profile_ready','2026-08-12',now()),
  ('US:primary-school-teacher','US','primary-school-teacher','Elementary School Teachers, Except Special Education','SOC','SOC 2018','25-2021','USD',false,null,null,'profile_ready','2026-08-12',now()),
  ('US:secondary-school-teacher','US','secondary-school-teacher','Secondary School Teachers, Except Special and Career/Technical Education','SOC','SOC 2018','25-2031','USD',false,null,null,'profile_ready','2026-08-12',now()),
  ('US:special-education-teacher','US','special-education-teacher','Special Education Teachers — BLS aggregate','SOC','SOC 2018','25-2050','USD',false,null,null,'profile_ready','2026-08-12',now()),
  ('US:social-worker','US','social-worker','Social Workers — BLS aggregate','SOC','SOC 2018','21-1020','USD',false,null,null,'profile_ready','2026-08-12',now()),
  ('US:youth-worker','US','youth-worker','Social and Human Service Assistants — youth-support proxy','SOC','SOC 2018','21-1093','USD',false,null,null,'profile_ready','2026-08-12',now()),
  ('US:community-worker','US','community-worker','Social and Human Service Assistants — community-support proxy','SOC','SOC 2018','21-1093','USD',false,null,null,'profile_ready','2026-08-12',now()),
  ('US:counsellor','US','counsellor','Substance Abuse, Behavioral Disorder, and Mental Health Counselors — counselling proxy','SOC','SOC 2018','21-1018','USD',false,null,null,'profile_ready','2026-08-12',now())
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
  ('US:early-childhood-teacher','2026-08-12',555100,null,37120,0,0,0,0,10,2,5,2,3,22,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','SOC 2018 25-2011 Preschool Teachers, Except Special Education.',
    'shortage_note','BLS growth and replacement openings are demand indicators, not a formal federal shortage designation; 0/20.',
    'salary_method','BLS May 2024 median annual wage is USD 37,120; US v1 below USD 50,000 earns 2/10.',
    'growth_basis','BLS projects 4 percent growth from 2024 to 2034; US v1 4-6 percent band earns 5/10.',
    'visa_basis','The national occupation typically has associate-degree entry, so generic H-1B specialty-occupation fit is weak; public-school preschool roles can require bachelor-level preparation but remain job-specific; 2/10.',
    'entry_basis','BLS lists associate-degree entry overall; 10/15.',
    'entry_burden_basis','Public-school preschool teachers must be state-licensed, while private/daycare settings vary; mixed-setting burden 3/5.'
  ),'2026-08-12'),
  ('US:primary-school-teacher','2026-08-12',1422700,null,62340,0,0,0,0,6,6,0,5,2,19,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','SOC 2018 25-2021 Elementary School Teachers, Except Special Education.',
    'shortage_note','Large replacement openings are not a federal shortage designation and national employment is projected to decline; 0/20.',
    'salary_method','BLS May 2024 median annual wage is USD 62,340; US v1 USD 60,000-74,999 band earns 6/10.',
    'growth_basis','BLS projects a 2 percent decline from 2024 to 2034; US v1 nonpositive growth earns 0/10.',
    'visa_basis','A teaching position can receive H-1B/PERM credit only when the employer filing, bachelor-level specific-specialty relationship and required state credential independently qualify; 5/10.',
    'entry_basis','BLS lists bachelor-level entry; 6/15.',
    'entry_burden_basis','All states require public-school elementary teachers to be licensed or certified; private-school rules differ; 2/5.'
  ),'2026-08-12'),
  ('US:secondary-school-teacher','2026-08-12',1094500,null,64580,0,0,0,0,6,6,0,5,2,19,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','SOC 2018 25-2031 Secondary School Teachers, Except Special and Career/Technical Education.',
    'shortage_note','Replacement openings do not create a national federal shortage designation; 0/20.',
    'salary_method','BLS May 2024 median annual wage is USD 64,580; 6/10 salary band.',
    'growth_basis','BLS projects about a 2 percent decline from 2024 to 2034; 0/10 growth credit.',
    'visa_basis','H-1B or PERM remains conditional on the specific subject-area degree requirement, employer filing and state teaching credential; 5/10.',
    'entry_basis','BLS lists bachelor-level entry; 6/15.',
    'entry_burden_basis','Public high-school teachers must hold state certification or licensure; private-school rules differ; 2/5.'
  ),'2026-08-12'),
  ('US:special-education-teacher','2026-08-12',559500,null,64270,0,0,0,0,6,6,0,5,2,19,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','BLS 25-2050 Special Education Teachers aggregate across preschool, kindergarten/elementary, middle, secondary and all-other detailed special-education occupations.',
    'shortage_note','Local staffing pressure and replacement openings are not promoted into federal national shortage status; 0/20.',
    'salary_method','BLS May 2024 aggregate median annual wage is USD 64,270; 6/10 salary band.',
    'growth_basis','BLS projects the aggregate to decline 1 percent from 2024 to 2034; 0/10.',
    'visa_basis','Degree-specific special-education teaching roles may support H-1B/PERM only when the actual employer filing and state licensure requirements are satisfied; 5/10.',
    'entry_basis','Bachelor degree is the standard public-school minimum; 6/15.',
    'entry_burden_basis','All states require public-school special-education teachers to be licensed for the grade level taught; private-school rules differ; 2/5.'
  ),'2026-08-12'),
  ('US:social-worker','2026-08-12',810900,null,61330,0,0,0,0,6,6,5,5,3,25,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','BLS 21-1020 Social Workers aggregate across child/family/school, healthcare, mental-health/substance-abuse and all-other social workers.',
    'shortage_note','BLS demand is not a formal national shortage designation; 0/20.',
    'salary_method','BLS May 2024 aggregate median annual wage is USD 61,330; 6/10.',
    'growth_basis','BLS projects 6 percent aggregate growth from 2024 to 2034; 5/10.',
    'visa_basis','Degree-specific social-work roles may support H-1B/PERM when the particular position and employer filing qualify; 5/10.',
    'entry_basis','Entry-level nonclinical roles commonly use a BSW while clinical roles require an MSW; 6/15.',
    'entry_burden_basis','All states license clinical social workers, while nonclinical licensing varies by state; mixed-scope burden 3/5.'
  ),'2026-08-12'),
  ('US:youth-worker','2026-08-12',449600,null,45120,0,0,0,0,15,2,5,2,5,29,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','No exact detailed BLS Youth Worker title exists; SOC 2018 21-1093 Social and Human Service Assistants is an explicit youth-support proxy.',
    'shortage_note','Proxy growth is not converted into shortage status; 0/20.',
    'salary_method','BLS May 2024 21-1093 median annual wage is USD 45,120; declared proxy, 2/10.',
    'growth_basis','BLS projects 21-1093 to grow 6 percent from 2024 to 2034; proxy 5/10.',
    'visa_basis','The proxy typically has high-school entry and therefore generally does not fit the degree-specific H-1B model; 2/10.',
    'entry_basis','BLS lists high-school diploma or equivalent for the proxy; 15/15.',
    'entry_burden_basis','No universal occupational licence; setting-specific safeguarding and background checks may apply; 5/5.'
  ),'2026-08-12'),
  ('US:community-worker','2026-08-12',449600,null,45120,0,0,0,0,15,2,5,2,5,29,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','Canonical Community Worker is broader than Community Health Worker; SOC 2018 21-1093 Social and Human Service Assistants is used as an explicit general community-support proxy.',
    'shortage_note','Proxy growth is not a formal shortage designation; 0/20.',
    'salary_method','BLS May 2024 21-1093 median annual wage is USD 45,120; declared proxy, 2/10.',
    'growth_basis','BLS projects 21-1093 to grow 6 percent from 2024 to 2034; proxy 5/10.',
    'visa_basis','The broad high-school-entry proxy generally does not fit the degree-specific H-1B model; 2/10.',
    'entry_basis','BLS lists high-school diploma or equivalent for 21-1093; 15/15.',
    'entry_burden_basis','No universal Community Worker licence; 5/5.'
  ),'2026-08-12'),
  ('US:counsellor','2026-08-12',483500,null,59190,0,0,0,0,4,4,10,5,2,25,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','Generic Counsellor has no single exact BLS detailed title; SOC 2018 21-1018 Substance Abuse, Behavioral Disorder, and Mental Health Counselors is used as an explicit therapeutic-counselling proxy.',
    'shortage_note','Strong projected demand does not establish a federal shortage designation; 0/20.',
    'salary_method','BLS May 2024 proxy median annual wage is USD 59,190; US v1 USD 50,000-59,999 band earns 4/10.',
    'growth_basis','BLS projects 17 percent growth from 2024 to 2034; proxy receives 10/10 growth credit.',
    'visa_basis','Graduate-degree mental-health counseling roles may support H-1B/PERM when the exact position, degree-specialty relationship, licence and employer filing qualify; 5/10.',
    'entry_basis','Mental-health counselors typically need a master degree and internship; 4/15.',
    'entry_burden_basis','Licensure varies by counseling specialty and state and is material for clinical practice; 2/5.'
  ),'2026-08-12')
on conflict (profile_key,as_of_date) do update set
  employment_total=excluded.employment_total,median_hourly_earnings=excluded.median_hourly_earnings,annualised_median_salary=excluded.annualised_median_salary,
  shortage_component=excluded.shortage_component,vacancy_intensity_component=excluded.vacancy_intensity_component,employer_diversity_component=excluded.employer_diversity_component,vacancy_trend_component=excluded.vacancy_trend_component,
  entry_level_component=excluded.entry_level_component,salary_component=excluded.salary_component,growth_component=excluded.growth_component,visa_component=excluded.visa_component,entry_burden_component=excluded.entry_burden_component,
  opportunity_score=excluded.opportunity_score,score_methodology_version=excluded.score_methodology_version,score_status=excluded.score_status,score_evidence=excluded.score_evidence,source_checked_at=excluded.source_checked_at;

delete from public.country_occupation_specialisations where profile_key in (
  'US:early-childhood-teacher','US:primary-school-teacher','US:secondary-school-teacher','US:special-education-teacher','US:social-worker','US:youth-worker','US:community-worker','US:counsellor'
);
insert into public.country_occupation_specialisations (
  profile_key,official_code,official_title,shortage_rating,visa_eligible,included_in_rollup,sort_order,source_url,source_checked_at
) values
  ('US:early-childhood-teacher','25-2011','Preschool Teachers, Except Special Education',null,false,true,1,'https://www.bls.gov/ooh/education-training-and-library/preschool-teachers.htm','2026-08-12'),
  ('US:primary-school-teacher','25-2021','Elementary School Teachers, Except Special Education',null,true,true,1,'https://www.bls.gov/ooh/education-training-and-library/kindergarten-and-elementary-school-teachers.htm','2026-08-12'),
  ('US:secondary-school-teacher','25-2031','Secondary School Teachers, Except Special and Career/Technical Education',null,true,true,1,'https://www.bls.gov/ooh/education-training-and-library/high-school-teachers.htm','2026-08-12'),
  ('US:special-education-teacher','25-2050','Special Education Teachers — aggregate',null,true,true,1,'https://www.bls.gov/ooh/education-training-and-library/special-education-teachers.htm','2026-08-12'),
  ('US:social-worker','21-1020','Social Workers — aggregate',null,true,true,1,'https://www.bls.gov/ooh/community-and-social-service/social-workers.htm','2026-08-12'),
  ('US:youth-worker','21-1093','Social and Human Service Assistants — youth-support proxy',null,false,true,1,'https://www.bls.gov/ooh/community-and-social-service/social-and-human-service-assistants.htm','2026-08-12'),
  ('US:community-worker','21-1093','Social and Human Service Assistants — community-support proxy',null,false,true,1,'https://www.bls.gov/ooh/community-and-social-service/social-and-human-service-assistants.htm','2026-08-12'),
  ('US:counsellor','21-1018','Substance Abuse, Behavioral Disorder, and Mental Health Counselors — counselling proxy',null,true,true,1,'https://www.bls.gov/ooh/community-and-social-service/substance-abuse-behavioral-disorder-and-mental-health-counselors.htm','2026-08-12');

delete from public.country_occupation_links where profile_key in (
  'US:early-childhood-teacher','US:primary-school-teacher','US:secondary-school-teacher','US:special-education-teacher','US:social-worker','US:youth-worker','US:community-worker','US:counsellor'
);
insert into public.country_occupation_links (
  profile_key,link_type,label,url,provider_type,region_code,sort_order,source_checked_at
) values
  ('US:early-childhood-teacher','source','BLS — Preschool Teachers','https://www.bls.gov/ooh/education-training-and-library/preschool-teachers.htm','government',null,1,'2026-08-12'),
  ('US:early-childhood-teacher','source','DOL FLAG — H-1B specialty occupations','https://flag.dol.gov/programs/LCA','government',null,2,'2026-08-12'),
  ('US:early-childhood-teacher','source','DOL — Permanent Labor Certification','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','government',null,3,'2026-08-12'),
  ('US:primary-school-teacher','source','BLS — Kindergarten and Elementary School Teachers','https://www.bls.gov/ooh/education-training-and-library/kindergarten-and-elementary-school-teachers.htm','government',null,1,'2026-08-12'),
  ('US:primary-school-teacher','source','DOL FLAG — H-1B specialty occupations','https://flag.dol.gov/programs/LCA','government',null,2,'2026-08-12'),
  ('US:primary-school-teacher','source','DOL — Permanent Labor Certification','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','government',null,3,'2026-08-12'),
  ('US:secondary-school-teacher','source','BLS — High School Teachers','https://www.bls.gov/ooh/education-training-and-library/high-school-teachers.htm','government',null,1,'2026-08-12'),
  ('US:secondary-school-teacher','source','DOL FLAG — H-1B specialty occupations','https://flag.dol.gov/programs/LCA','government',null,2,'2026-08-12'),
  ('US:secondary-school-teacher','source','DOL — Permanent Labor Certification','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','government',null,3,'2026-08-12'),
  ('US:special-education-teacher','source','BLS — Special Education Teachers','https://www.bls.gov/ooh/education-training-and-library/special-education-teachers.htm','government',null,1,'2026-08-12'),
  ('US:special-education-teacher','source','DOL FLAG — H-1B specialty occupations','https://flag.dol.gov/programs/LCA','government',null,2,'2026-08-12'),
  ('US:special-education-teacher','source','DOL — Permanent Labor Certification','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','government',null,3,'2026-08-12'),
  ('US:social-worker','source','BLS — Social Workers','https://www.bls.gov/ooh/community-and-social-service/social-workers.htm','government',null,1,'2026-08-12'),
  ('US:social-worker','source','DOL FLAG — H-1B specialty occupations','https://flag.dol.gov/programs/LCA','government',null,2,'2026-08-12'),
  ('US:social-worker','source','DOL — Permanent Labor Certification','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','government',null,3,'2026-08-12'),
  ('US:youth-worker','source','BLS — Social and Human Service Assistants proxy','https://www.bls.gov/ooh/community-and-social-service/social-and-human-service-assistants.htm','government',null,1,'2026-08-12'),
  ('US:youth-worker','source','DOL FLAG — H-1B specialty occupations','https://flag.dol.gov/programs/LCA','government',null,2,'2026-08-12'),
  ('US:youth-worker','source','DOL — Permanent Labor Certification','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','government',null,3,'2026-08-12'),
  ('US:community-worker','source','BLS — Social and Human Service Assistants proxy','https://www.bls.gov/ooh/community-and-social-service/social-and-human-service-assistants.htm','government',null,1,'2026-08-12'),
  ('US:community-worker','source','DOL FLAG — H-1B specialty occupations','https://flag.dol.gov/programs/LCA','government',null,2,'2026-08-12'),
  ('US:community-worker','source','DOL — Permanent Labor Certification','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','government',null,3,'2026-08-12'),
  ('US:counsellor','source','BLS — Mental Health and Behavioral Counselors proxy','https://www.bls.gov/ooh/community-and-social-service/substance-abuse-behavioral-disorder-and-mental-health-counselors.htm','government',null,1,'2026-08-12'),
  ('US:counsellor','source','DOL FLAG — H-1B specialty occupations','https://flag.dol.gov/programs/LCA','government',null,2,'2026-08-12'),
  ('US:counsellor','source','DOL — Permanent Labor Certification','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','government',null,3,'2026-08-12');

delete from public.country_occupation_program_links where profile_key in (
  'US:early-childhood-teacher','US:primary-school-teacher','US:secondary-school-teacher','US:special-education-teacher','US:social-worker','US:youth-worker','US:community-worker','US:counsellor'
);
insert into public.country_occupation_program_links (profile_key,program_ref,relation_type,source_checked_at) values
  ('US:social-worker','uw-basw-social-welfare','direct','2026-08-12'),
  ('US:youth-worker','uw-basw-social-welfare','related','2026-08-12'),
  ('US:community-worker','uw-basw-social-welfare','related','2026-08-12');
