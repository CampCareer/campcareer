-- United States technology occupation cohort: 8 canonical careers.
-- SOC 2018 mappings/proxies, BLS 2024 employment/pay and 2024-2034 projections, H-1B/PERM boundaries checked 2026-08-11.

insert into public.country_occupation_profiles (
  profile_key,country_code,canonical_career_id,official_title,official_code_system,official_code_version,
  official_unit_group_code,currency,registration_required,registration_authority,registration_url,
  publication_status,source_checked_at,updated_at
) values
  ('US:software-developer','US','software-developer','Software Developers','SOC','SOC 2018','15-1252','USD',false,null,null,'profile_ready','2026-08-11',now()),
  ('US:data-analyst','US','data-analyst','Data Scientists — data-analytics proxy','SOC','SOC 2018','15-2051','USD',false,null,null,'profile_ready','2026-08-11',now()),
  ('US:data-engineer','US','data-engineer','Database Architects — data-engineering / architecture proxy','SOC','SOC 2018','15-1243','USD',false,null,null,'profile_ready','2026-08-11',now()),
  ('US:cybersecurity-analyst','US','cybersecurity-analyst','Information Security Analysts','SOC','SOC 2018','15-1212','USD',false,null,null,'profile_ready','2026-08-11',now()),
  ('US:network-administrator','US','network-administrator','Network and Computer Systems Administrators','SOC','SOC 2018','15-1244','USD',false,null,null,'profile_ready','2026-08-11',now()),
  ('US:cloud-engineer','US','cloud-engineer','Computer Network Architects — cloud-infrastructure proxy','SOC','SOC 2018','15-1241','USD',false,null,null,'profile_ready','2026-08-11',now()),
  ('US:database-administrator','US','database-administrator','Database Administrators','SOC','SOC 2018','15-1242','USD',false,null,null,'profile_ready','2026-08-11',now()),
  ('US:ict-support-technician','US','ict-support-technician','Computer User Support Specialists','SOC','SOC 2018','15-1232','USD',false,null,null,'profile_ready','2026-08-11',now())
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
  ('US:software-developer','2026-08-11',1693800,null,133080,0,0,0,0,6,10,10,5,5,36,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','SOC 2018 15-1252 Software Developers.',
    'shortage_note','No federal technology shortage list is used for this cohort. BLS growth/openings are demand indicators, not a formal shortage designation; 0/20.',
    'salary_method','BLS May 2024 median annual wage is USD 133,080. US v1 salary band at least USD 100,000 earns 10/10.',
    'growth_basis','BLS Employment Projections reports 15.8 percent growth from 2024 to 2034. US v1 growth band at least 10 percent earns 10/10.',
    'visa_basis','H-1B can apply only where the specific role is a specialty occupation requiring the relevant bachelor degree or equivalent; PERM remains employer/labor-certification based; 5/10.',
    'entry_basis','BLS says a bachelor degree in computer/information technology or a related field is typical; 6/15.',
    'entry_burden_basis','No universal statutory occupational licence; 5/5.'
  ),'2026-08-11'),
  ('US:data-analyst','2026-08-11',245900,null,112590,0,0,0,0,6,10,10,5,5,36,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','Canonical Data Analyst is broader than one SOC. SOC 2018 15-2051 Data Scientists is used as the closest national quantitative analytics proxy; the metrics are not an exact census of every Data Analyst title.',
    'shortage_note','The 33.5 percent BLS proxy growth rate is not converted into a formal shortage designation; 0/20.',
    'salary_method','BLS May 2024 Data Scientists median annual wage is USD 112,590. It is used only as the declared analytics proxy; 10/10 salary band.',
    'growth_basis','BLS Data Scientists proxy growth is 33.5 percent from 2024 to 2034; US v1 growth band at least 10 percent earns 10/10.',
    'visa_basis','Degree-specific analytics positions may support H-1B or PERM only when the actual duties and degree relationship satisfy federal requirements; 5/10.',
    'entry_basis','BLS says Data Scientists typically need at least a bachelor degree in mathematics, statistics, computer science or a related field; 6/15.',
    'entry_burden_basis','No universal statutory occupational licence; 5/5.'
  ),'2026-08-11'),
  ('US:data-engineer','2026-08-11',66900,null,135980,0,0,0,0,5,10,8,5,5,33,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','Data Engineer has no single exact BLS detailed title. SOC 2018 15-1243 Database Architects is used as the closest data-infrastructure and architecture proxy.',
    'shortage_note','BLS proxy growth is demand evidence and is not a formal federal shortage designation; 0/20.',
    'salary_method','BLS May 2024 Database Architects median annual wage is USD 135,980. It is used only as the declared data-engineering proxy; 10/10.',
    'growth_basis','BLS projects Database Architects to grow 8.7 percent from 2024 to 2034. US v1 7–9 percent band earns 8/10.',
    'visa_basis','Professional data-infrastructure positions can support H-1B or PERM only where the specific filing independently qualifies; 5/10.',
    'entry_basis','BLS reports bachelor-level entry for Database Architects and less than five years of related experience as typical; 5/15.',
    'entry_burden_basis','No universal statutory occupational licence; 5/5.'
  ),'2026-08-11'),
  ('US:cybersecurity-analyst','2026-08-11',182800,null,124910,0,0,0,0,5,10,10,5,5,35,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','SOC 2018 15-1212 Information Security Analysts.',
    'shortage_note','BLS projects very strong demand but does not designate Information Security Analysts as a federal shortage occupation; 0/20.',
    'salary_method','BLS May 2024 median annual wage is USD 124,910; 10/10 salary band.',
    'growth_basis','BLS projects 28.5 percent growth from 2024 to 2034; US v1 growth band at least 10 percent earns 10/10.',
    'visa_basis','A cybersecurity position may support H-1B when it independently meets specialty-occupation requirements; PERM is employer/labor-certification based; 5/10.',
    'entry_basis','BLS reports bachelor-level entry and less than five years of related work experience as typical; 5/15.',
    'entry_burden_basis','No universal statutory occupational licence; 5/5.'
  ),'2026-08-11'),
  ('US:network-administrator','2026-08-11',331500,null,96800,0,0,0,0,6,8,0,5,5,24,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','SOC 2018 15-1244 Network and Computer Systems Administrators.',
    'shortage_note','Replacement openings are not treated as shortage evidence; 0/20.',
    'salary_method','BLS May 2024 median annual wage is USD 96,800. US v1 USD 75,000–99,999 band earns 8/10.',
    'growth_basis','BLS projects a 4.2 percent decline from 2024 to 2034. US v1 non-positive growth earns 0/10.',
    'visa_basis','Some degree-specific network-administrator roles may qualify for H-1B, but occupation title alone is insufficient; PERM remains case-specific; 5/10.',
    'entry_basis','BLS says a bachelor degree in a related computer/information field is typical; 6/15.',
    'entry_burden_basis','No universal statutory occupational licence; 5/5.'
  ),'2026-08-11'),
  ('US:cloud-engineer','2026-08-11',179200,null,130390,0,0,0,0,4,10,10,5,5,34,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','Cloud Engineer has no exact BLS detailed title. SOC 2018 15-1241 Computer Network Architects is used as the closest cloud/network-infrastructure design proxy; BLS explicitly discusses cloud infrastructure in this occupation.',
    'shortage_note','Cloud-related BLS demand is not converted into a federal shortage designation; 0/20.',
    'salary_method','BLS May 2024 Computer Network Architects median annual wage is USD 130,390. It is used only as the declared cloud-infrastructure proxy; 10/10.',
    'growth_basis','BLS projects Computer Network Architects to grow 11.9 percent from 2024 to 2034; 10/10 growth.',
    'visa_basis','Degree-specific cloud infrastructure positions may support H-1B or PERM only when the particular filing meets federal requirements; 5/10.',
    'entry_basis','BLS reports bachelor-level education plus five years or more of related experience as typical for Computer Network Architects; 4/15.',
    'entry_burden_basis','No universal statutory occupational licence; 5/5.'
  ),'2026-08-11'),
  ('US:database-administrator','2026-08-11',78000,null,104620,0,0,0,0,6,10,0,5,5,26,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','SOC 2018 15-1242 Database Administrators. Database Architects 15-1243 are kept separate and are used only as the Data Engineer proxy.',
    'shortage_note','No formal federal shortage designation is asserted; 0/20.',
    'salary_method','BLS May 2024 median annual wage is USD 104,620; 10/10 salary band.',
    'growth_basis','BLS projects a 0.7 percent decline from 2024 to 2034. US v1 non-positive growth earns 0/10.',
    'visa_basis','Degree-specific DBA positions may support H-1B or PERM when the actual role and filing meet federal requirements; 5/10.',
    'entry_basis','BLS says a bachelor degree in computer and information technology or a related field is typical; 6/15.',
    'entry_burden_basis','No universal statutory occupational licence; vendor certification may be employer-required; 5/5.'
  ),'2026-08-11'),
  ('US:ict-support-technician','2026-08-11',729500,null,60340,0,0,0,0,12,6,0,2,5,25,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','SOC 2018 15-1232 Computer User Support Specialists, used for the canonical ICT Support Technician scope.',
    'shortage_note','Large replacement openings do not create formal shortage status; 0/20.',
    'salary_method','BLS May 2024 median annual wage is USD 60,340. US v1 USD 60,000–74,999 band earns 6/10.',
    'growth_basis','BLS projects a 3.7 percent decline from 2024 to 2034. US v1 non-positive growth earns 0/10.',
    'visa_basis','The occupation generally does not fit a degree-specific H-1B model. Permanent employer sponsorship can exist only through the applicable case-specific process; 2/10.',
    'entry_basis','BLS says some college is typical and high school plus relevant IT certifications may also qualify; 12/15.',
    'entry_burden_basis','No universal statutory occupational licence; 5/5.'
  ),'2026-08-11')
on conflict (profile_key,as_of_date) do update set
  employment_total=excluded.employment_total,median_hourly_earnings=excluded.median_hourly_earnings,annualised_median_salary=excluded.annualised_median_salary,
  shortage_component=excluded.shortage_component,vacancy_intensity_component=excluded.vacancy_intensity_component,employer_diversity_component=excluded.employer_diversity_component,vacancy_trend_component=excluded.vacancy_trend_component,
  entry_level_component=excluded.entry_level_component,salary_component=excluded.salary_component,growth_component=excluded.growth_component,visa_component=excluded.visa_component,entry_burden_component=excluded.entry_burden_component,
  opportunity_score=excluded.opportunity_score,score_methodology_version=excluded.score_methodology_version,score_status=excluded.score_status,score_evidence=excluded.score_evidence,source_checked_at=excluded.source_checked_at;

delete from public.country_occupation_specialisations where profile_key in ('US:software-developer','US:data-analyst','US:data-engineer','US:cybersecurity-analyst','US:network-administrator','US:cloud-engineer','US:database-administrator','US:ict-support-technician');
insert into public.country_occupation_specialisations (profile_key,official_code,official_title,shortage_rating,visa_eligible,included_in_rollup,sort_order,source_url,source_checked_at) values
  ('US:software-developer','15-1252','Software Developers',null,true,true,1,'https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm','2026-08-11'),
  ('US:data-analyst','15-2051','Data Scientists — data-analytics proxy',null,true,true,1,'https://www.bls.gov/ooh/math/data-scientists.htm','2026-08-11'),
  ('US:data-engineer','15-1243','Database Architects — data-engineering / architecture proxy',null,true,true,1,'https://www.bls.gov/ooh/computer-and-information-technology/database-administrators.htm','2026-08-11'),
  ('US:cybersecurity-analyst','15-1212','Information Security Analysts',null,true,true,1,'https://www.bls.gov/ooh/computer-and-information-technology/information-security-analysts.htm','2026-08-11'),
  ('US:network-administrator','15-1244','Network and Computer Systems Administrators',null,true,true,1,'https://www.bls.gov/ooh/computer-and-information-technology/network-and-computer-systems-administrators.htm','2026-08-11'),
  ('US:cloud-engineer','15-1241','Computer Network Architects — cloud-infrastructure proxy',null,true,true,1,'https://www.bls.gov/ooh/computer-and-information-technology/computer-network-architects.htm','2026-08-11'),
  ('US:database-administrator','15-1242','Database Administrators',null,true,true,1,'https://www.bls.gov/ooh/computer-and-information-technology/database-administrators.htm','2026-08-11'),
  ('US:ict-support-technician','15-1232','Computer User Support Specialists',null,true,true,1,'https://www.bls.gov/ooh/computer-and-information-technology/computer-support-specialists.htm','2026-08-11');

delete from public.country_occupation_links where profile_key in ('US:software-developer','US:data-analyst','US:data-engineer','US:cybersecurity-analyst','US:network-administrator','US:cloud-engineer','US:database-administrator','US:ict-support-technician');
insert into public.country_occupation_links (profile_key,link_type,label,url,provider_type,region_code,sort_order,source_checked_at) values
  ('US:software-developer','source','BLS Occupational Outlook Handbook — Software Developers','https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm','official_labor',null,1,'2026-08-11'),
  ('US:software-developer','source','DOL — H-1B Specialty Occupation LCA','https://flag.dol.gov/programs/LCA','official_immigration',null,2,'2026-08-11'),
  ('US:software-developer','source','DOL — Permanent Labor Certification (PERM)','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','official_immigration',null,3,'2026-08-11'),
  ('US:data-analyst','source','BLS Occupational Outlook Handbook — Data Scientists proxy','https://www.bls.gov/ooh/math/data-scientists.htm','official_labor',null,1,'2026-08-11'),
  ('US:data-analyst','source','DOL — H-1B Specialty Occupation LCA','https://flag.dol.gov/programs/LCA','official_immigration',null,2,'2026-08-11'),
  ('US:data-analyst','source','DOL — Permanent Labor Certification (PERM)','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','official_immigration',null,3,'2026-08-11'),
  ('US:data-engineer','source','BLS Occupational Outlook Handbook — Database Architects proxy','https://www.bls.gov/ooh/computer-and-information-technology/database-administrators.htm','official_labor',null,1,'2026-08-11'),
  ('US:data-engineer','source','DOL — H-1B Specialty Occupation LCA','https://flag.dol.gov/programs/LCA','official_immigration',null,2,'2026-08-11'),
  ('US:data-engineer','source','DOL — Permanent Labor Certification (PERM)','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','official_immigration',null,3,'2026-08-11'),
  ('US:cybersecurity-analyst','source','BLS Occupational Outlook Handbook — Information Security Analysts','https://www.bls.gov/ooh/computer-and-information-technology/information-security-analysts.htm','official_labor',null,1,'2026-08-11'),
  ('US:cybersecurity-analyst','source','DOL — H-1B Specialty Occupation LCA','https://flag.dol.gov/programs/LCA','official_immigration',null,2,'2026-08-11'),
  ('US:cybersecurity-analyst','source','DOL — Permanent Labor Certification (PERM)','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','official_immigration',null,3,'2026-08-11'),
  ('US:network-administrator','source','BLS Occupational Outlook Handbook — Network and Computer Systems Administrators','https://www.bls.gov/ooh/computer-and-information-technology/network-and-computer-systems-administrators.htm','official_labor',null,1,'2026-08-11'),
  ('US:network-administrator','source','DOL — H-1B Specialty Occupation LCA','https://flag.dol.gov/programs/LCA','official_immigration',null,2,'2026-08-11'),
  ('US:network-administrator','source','DOL — Permanent Labor Certification (PERM)','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','official_immigration',null,3,'2026-08-11'),
  ('US:cloud-engineer','source','BLS Occupational Outlook Handbook — Computer Network Architects proxy','https://www.bls.gov/ooh/computer-and-information-technology/computer-network-architects.htm','official_labor',null,1,'2026-08-11'),
  ('US:cloud-engineer','source','DOL — H-1B Specialty Occupation LCA','https://flag.dol.gov/programs/LCA','official_immigration',null,2,'2026-08-11'),
  ('US:cloud-engineer','source','DOL — Permanent Labor Certification (PERM)','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','official_immigration',null,3,'2026-08-11'),
  ('US:database-administrator','source','BLS Occupational Outlook Handbook — Database Administrators','https://www.bls.gov/ooh/computer-and-information-technology/database-administrators.htm','official_labor',null,1,'2026-08-11'),
  ('US:database-administrator','source','DOL — H-1B Specialty Occupation LCA','https://flag.dol.gov/programs/LCA','official_immigration',null,2,'2026-08-11'),
  ('US:database-administrator','source','DOL — Permanent Labor Certification (PERM)','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','official_immigration',null,3,'2026-08-11'),
  ('US:ict-support-technician','source','BLS Occupational Outlook Handbook — Computer User Support Specialists','https://www.bls.gov/ooh/computer-and-information-technology/computer-support-specialists.htm','official_labor',null,1,'2026-08-11'),
  ('US:ict-support-technician','source','DOL — Permanent Labor Certification (PERM)','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','official_immigration',null,2,'2026-08-11');

delete from public.country_occupation_program_links where profile_key in ('US:software-developer','US:data-analyst','US:data-engineer','US:cybersecurity-analyst','US:network-administrator','US:cloud-engineer','US:database-administrator','US:ict-support-technician');
insert into public.country_occupation_program_links (profile_key,program_ref,relation_type,source_checked_at) values
  ('US:software-developer','nyu-bs-computer-science','direct','2026-08-11'),
  ('US:data-analyst','uw-bs-informatics','related','2026-08-11'),
  ('US:data-analyst','wisc-bs-data-science','direct','2026-08-11'),
  ('US:data-analyst','wisc-ba-information-science','related','2026-08-11'),
  ('US:data-engineer','wisc-bs-data-science','related','2026-08-11'),
  ('US:cybersecurity-analyst','nyu-bs-computer-science','related','2026-08-11'),
  ('US:cybersecurity-analyst','psu-bs-cybersecurity-analytics-operations','direct','2026-08-11'),
  ('US:network-administrator','psu-bs-cybersecurity-analytics-operations','related','2026-08-11'),
  ('US:cloud-engineer','nyu-bs-computer-science','related','2026-08-11'),
  ('US:database-administrator','nyu-bs-computer-science','related','2026-08-11'),
  ('US:database-administrator','uw-bs-informatics','related','2026-08-11'),
  ('US:database-administrator','wisc-bs-data-science','related','2026-08-11');
