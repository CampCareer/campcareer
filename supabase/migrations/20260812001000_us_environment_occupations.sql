-- United States environment occupation cohort: 8 canonical careers.
-- BLS 2024 employment/pay and 2024-2034 projections, current O*NET scopes, and H-1B/PERM boundaries checked 2026-08-12.

insert into public.country_occupation_profiles (
  profile_key,country_code,canonical_career_id,official_title,official_code_system,official_code_version,
  official_unit_group_code,currency,registration_required,registration_authority,registration_url,
  publication_status,source_checked_at,updated_at
) values
  ('US:environmental-scientist','US','environmental-scientist','Environmental Scientists and Specialists, Including Health','SOC','SOC 2018','19-2041','USD',false,null,null,'profile_ready','2026-08-12',now()),
  ('US:agronomist','US','agronomist','Soil and Plant Scientists — agronomist scope','SOC','SOC 2018','19-1013','USD',false,null,null,'profile_ready','2026-08-12',now()),
  ('US:farm-manager','US','farm-manager','Farmers, Ranchers, and Other Agricultural Managers — farm-manager scope','SOC','SOC 2018','11-9013','USD',false,null,null,'profile_ready','2026-08-12',now()),
  ('US:forestry-technician','US','forestry-technician','Forest and Conservation Technicians — forestry-technician scope','SOC','SOC 2018','19-4071','USD',false,null,null,'profile_ready','2026-08-12',now()),
  ('US:food-technologist','US','food-technologist','Food Scientists and Technologists — food-technologist scope','SOC','SOC 2018','19-1012','USD',false,null,null,'profile_ready','2026-08-12',now()),
  ('US:sustainability-specialist','US','sustainability-specialist','Sustainability Specialists — O*NET 13-1199.05; BLS parent 13-1199 proxy','SOC','SOC 2018','13-1199','USD',false,null,null,'profile_ready','2026-08-12',now()),
  ('US:horticulturist','US','horticulturist','Soil and Plant Scientists — professional horticulture proxy','SOC','SOC 2018','19-1013','USD',false,null,null,'profile_ready','2026-08-12',now()),
  ('US:animal-science-technician','US','animal-science-technician','Agricultural Technicians — animal-science technician proxy','SOC','SOC 2018','19-4012','USD',false,null,null,'profile_ready','2026-08-12',now())
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
  ('US:environmental-scientist','2026-08-12',90300,null,80060,0,0,0,0,6,8,5,5,5,29,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','SOC 2018 19-2041 Environmental Scientists and Specialists, Including Health. O*NET currently lists Environmental Scientist among reported titles.',
    'shortage_note','BLS growth and replacement openings are demand indicators, not a formal federal shortage designation; 0/20.',
    'salary_method','BLS May 2024 median annual wage is USD 80,060; US v1 USD 75,000-99,999 band earns 8/10.',
    'growth_basis','BLS projects 4.4 percent growth from 2024 to 2034; US v1 4 to under 7 percent band earns 5/10.',
    'visa_basis','A degree-specific environmental-science position may support H-1B only when the actual job independently requires a bachelor degree or equivalent in a specific specialty; PERM remains employer/labor-certification based; 5/10.',
    'entry_basis','BLS lists bachelor-level entry in environmental science or a related natural science; 6/15.',
    'entry_burden_basis','No universal occupational licence applies to the generic profession; work-specific certifications or environmental-health credentials can apply; 5/5.'
  ),'2026-08-12'),
  ('US:agronomist','2026-08-12',20700,null,71410,0,0,0,0,6,6,5,5,5,27,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','SOC 2018 19-1013 Soil and Plant Scientists, constrained to the agronomist scope. O*NET currently lists Agronomist among reported job titles.',
    'shortage_note','O*NET Bright Outlook and BLS growth are demand signals, not a federal shortage designation; 0/20.',
    'salary_method','BLS May 2024 Soil and Plant Scientists median annual wage is USD 71,410; the shared national series earns 6/10.',
    'growth_basis','BLS projects Soil and Plant Scientists to grow 5.4 percent from 2024 to 2034; 5/10.',
    'visa_basis','Degree-specific agronomy or crop/soil-science positions may support H-1B or PERM when the actual duties, specialty-degree relationship and employer filing independently qualify; 5/10.',
    'entry_basis','BLS lists bachelor-level entry for Soil and Plant Scientists; 6/15.',
    'entry_burden_basis','Agronomist is not one universally licensed occupation; voluntary agronomy credentials and activity-specific pesticide rules remain separate; 5/5.'
  ),'2026-08-12'),
  ('US:farm-manager','2026-08-12',836100,null,87980,0,0,0,0,12,8,0,2,5,27,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','SOC 2018 11-9013 Farmers, Ranchers, and Other Agricultural Managers, constrained here to the Farm Manager scope.',
    'shortage_note','Large replacement openings do not establish a federal shortage designation, and projected employment is declining; 0/20.',
    'salary_method','BLS May 2024 median annual wage is USD 87,980; US v1 USD 75,000-99,999 band earns 8/10.',
    'growth_basis','BLS projects a 1.3 percent employment decline from 2024 to 2034; nonpositive growth earns 0/10.',
    'visa_basis','BLS lists high-school entry plus substantial related experience rather than a specific bachelor-degree norm, so generic H-1B specialty-occupation fit is weak; PERM remains employer-led; 2/10.',
    'entry_basis','BLS lists high school plus five years or more of related work experience; accessible formal education but substantial experience lowers the entry score to 12/15.',
    'entry_burden_basis','No universal personal Farm Manager licence; activity-specific agricultural, pesticide, animal-health, environmental and safety rules remain separate; 5/5.'
  ),'2026-08-12'),
  ('US:forestry-technician','2026-08-12',33800,null,54310,0,0,0,0,10,4,0,2,5,21,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','SOC 2018 19-4071 Forest and Conservation Technicians. O*NET currently lists Forestry Technician among reported job titles, so the role is not promoted to Forester 19-1032.',
    'shortage_note','Replacement openings and forestry demand are not converted into formal shortage status; 0/20.',
    'salary_method','BLS 2024 median annual wage is USD 54,310; US v1 USD 50,000-59,999 band earns 4/10.',
    'growth_basis','BLS projects a 3.2 percent decline from 2024 to 2034; 0/10 growth component.',
    'visa_basis','BLS lists associate-level entry, so generic H-1B specialty-occupation fit is weak; employer-led PERM remains possible when the filing independently qualifies; 2/10.',
    'entry_basis','BLS lists an associate degree as typical entry; 10/15.',
    'entry_burden_basis','No universal federal technician licence; field tasks may require agency, employer or state activity-specific credentials; 5/5.'
  ),'2026-08-12'),
  ('US:food-technologist','2026-08-12',15200,null,85310,0,0,0,0,6,8,5,5,5,29,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','SOC 2018 19-1012 Food Scientists and Technologists, constrained to Food Technologist. O*NET currently lists Food Technologist among reported titles.',
    'shortage_note','BLS growth and O*NET Bright Outlook are demand indicators and do not establish a formal federal shortage designation; 0/20.',
    'salary_method','BLS May 2024 median annual wage is USD 85,310; US v1 USD 75,000-99,999 band earns 8/10.',
    'growth_basis','BLS projects 6.5 percent growth from 2024 to 2034; US v1 4 to under 7 percent band earns 5/10.',
    'visa_basis','A degree-specific Food Technologist position may support H-1B or PERM when the actual position and employer filing independently qualify; 5/10.',
    'entry_basis','BLS lists bachelor-level entry in food science or a related agricultural/life-science field; 6/15.',
    'entry_burden_basis','No universal personal Food Technologist licence; food-safety and facility obligations are separate from generic occupational registration; 5/5.'
  ),'2026-08-12'),
  ('US:sustainability-specialist','2026-08-12',1205700,null,81270,0,0,0,0,6,8,2,5,5,26,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','O*NET 13-1199.05 Sustainability Specialists is the detailed occupation. BLS does not publish standalone 13-1199.05 national metrics, so parent SOC 13-1199 Business Operations Specialists, All Other is an explicit proxy for employment, pay and projections.',
    'shortage_note','O*NET Bright Outlook is not converted into a federal shortage designation; 0/20.',
    'salary_method','BLS 2024 parent SOC 13-1199 median annual wage is USD 81,270; explicit parent proxy, 8/10.',
    'growth_basis','BLS projects parent SOC 13-1199 to grow 3.0 percent from 2024 to 2034; explicit proxy, 2/10.',
    'visa_basis','A sustainability role may support H-1B only when the actual job independently requires a bachelor degree or equivalent in a specific specialty; PERM remains employer-led; 5/10.',
    'entry_basis','BLS parent 13-1199 lists bachelor-level entry; 6/15.',
    'entry_burden_basis','No universal statutory Sustainability Specialist licence; employer-valued environmental, energy, carbon or reporting credentials remain voluntary or role-specific; 5/5.'
  ),'2026-08-12'),
  ('US:horticulturist','2026-08-12',20700,null,71410,0,0,0,0,6,6,5,5,5,27,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','SOC 2018 19-1013 Soil and Plant Scientists is used as the closest professional/scientific Horticulturist proxy. O*NET lists Horticulture Specialist among reported titles and covers trees, shrubs, nursery stock, crop production and plant growth.',
    'shortage_note','General horticulture labor pressure and O*NET Bright Outlook do not establish a federal horticulturist shortage; 0/20.',
    'salary_method','BLS May 2024 Soil and Plant Scientists median annual wage is USD 71,410; declared professional-horticulture proxy, 6/10.',
    'growth_basis','BLS projects Soil and Plant Scientists to grow 5.4 percent from 2024 to 2034; declared proxy, 5/10.',
    'visa_basis','Degree-specific scientific horticulture positions may support H-1B or PERM when the actual duties and employer filing qualify; landscaping and general nursery labor are not assumed to fit; 5/10.',
    'entry_basis','The professional proxy has bachelor-level entry; 6/15.',
    'entry_burden_basis','No universal personal Horticulturist licence; pesticide and other commercial plant-health rules are activity-specific; 5/5.'
  ),'2026-08-12'),
  ('US:animal-science-technician','2026-08-12',18600,null,46790,0,0,0,0,10,2,5,2,5,24,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','SOC 2018 19-4012 Agricultural Technicians is used as a declared Animal Science Technician proxy. O*NET explicitly includes assisting with animal breeding and nutrition and collecting animal samples, but the BLS series also includes plant and other agricultural technician work.',
    'shortage_note','Projected growth is treated as demand evidence, not a formal federal shortage designation; 0/20.',
    'salary_method','BLS May 2024 Agricultural Technicians median annual wage is USD 46,790; declared proxy, below USD 50,000 earns 2/10.',
    'growth_basis','BLS projects Agricultural Technicians to grow 4.3 percent from 2024 to 2034; declared proxy, 5/10.',
    'visa_basis','BLS lists associate-level entry, so generic H-1B specialty-occupation fit is weak; PERM remains employer-led when a specific filing independently qualifies; 2/10.',
    'entry_basis','BLS lists associate-degree entry for Agricultural Technicians; 10/15.',
    'entry_burden_basis','No universal occupational licence; laboratory, animal-welfare, biosecurity and institutional research controls are setting-specific rather than a national personal register; 5/5.'
  ),'2026-08-12')
on conflict (profile_key,as_of_date) do update set
  employment_total=excluded.employment_total,median_hourly_earnings=excluded.median_hourly_earnings,annualised_median_salary=excluded.annualised_median_salary,
  shortage_component=excluded.shortage_component,vacancy_intensity_component=excluded.vacancy_intensity_component,employer_diversity_component=excluded.employer_diversity_component,vacancy_trend_component=excluded.vacancy_trend_component,
  entry_level_component=excluded.entry_level_component,salary_component=excluded.salary_component,growth_component=excluded.growth_component,visa_component=excluded.visa_component,entry_burden_component=excluded.entry_burden_component,
  opportunity_score=excluded.opportunity_score,score_methodology_version=excluded.score_methodology_version,score_status=excluded.score_status,score_evidence=excluded.score_evidence,source_checked_at=excluded.source_checked_at;

delete from public.country_occupation_specialisations where profile_key in (
  'US:environmental-scientist','US:agronomist','US:farm-manager','US:forestry-technician','US:food-technologist','US:sustainability-specialist','US:horticulturist','US:animal-science-technician'
);
insert into public.country_occupation_specialisations (
  profile_key,official_code,official_title,shortage_rating,visa_eligible,included_in_rollup,sort_order,source_url,source_checked_at
) values
  ('US:environmental-scientist','19-2041','Environmental Scientists and Specialists, Including Health',null,true,true,1,'https://www.onetonline.org/link/summary/19-2041.00','2026-08-12'),
  ('US:agronomist','19-1013','Soil and Plant Scientists — agronomist scope',null,true,true,1,'https://www.onetonline.org/link/summary/19-1013.00','2026-08-12'),
  ('US:farm-manager','11-9013','Farmers, Ranchers, and Other Agricultural Managers — farm-manager scope',null,true,true,1,'https://www.bls.gov/ooh/management/farmers-ranchers-and-other-agricultural-managers.htm','2026-08-12'),
  ('US:forestry-technician','19-4071','Forest and Conservation Technicians — forestry-technician scope',null,true,true,1,'https://www.onetonline.org/link/summary/19-4071.00','2026-08-12'),
  ('US:food-technologist','19-1012','Food Scientists and Technologists — food-technologist scope',null,true,true,1,'https://www.onetonline.org/link/summary/19-1012.00','2026-08-12'),
  ('US:sustainability-specialist','13-1199.05','Sustainability Specialists — BLS parent 13-1199 metric proxy',null,true,true,1,'https://www.onetonline.org/link/summary/13-1199.05','2026-08-12'),
  ('US:horticulturist','19-1013','Soil and Plant Scientists — professional horticulture proxy',null,true,true,1,'https://www.onetonline.org/link/summary/19-1013.00','2026-08-12'),
  ('US:animal-science-technician','19-4012','Agricultural Technicians — animal-science technician proxy',null,true,true,1,'https://www.onetonline.org/link/summary/19-4012.00','2026-08-12');

delete from public.country_occupation_links where profile_key in (
  'US:environmental-scientist','US:agronomist','US:farm-manager','US:forestry-technician','US:food-technologist','US:sustainability-specialist','US:horticulturist','US:animal-science-technician'
);
insert into public.country_occupation_links (
  profile_key,link_type,label,url,provider_type,region_code,sort_order,source_checked_at
) values
  ('US:environmental-scientist','source','BLS — Environmental Scientists and Specialists','https://www.bls.gov/ooh/life-physical-and-social-science/environmental-scientists-and-specialists.htm','government',null,1,'2026-08-12'),
  ('US:environmental-scientist','source','DOL FLAG — H-1B specialty occupations','https://flag.dol.gov/programs/lca','government',null,2,'2026-08-12'),
  ('US:environmental-scientist','source','DOL — Permanent Labor Certification','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','government',null,3,'2026-08-12'),
  ('US:agronomist','source','BLS — Soil and Plant Scientists metrics','https://www.bls.gov/emp/tables/occupational-projections-and-characteristics.htm','government',null,1,'2026-08-12'),
  ('US:agronomist','source','DOL FLAG — H-1B specialty occupations','https://flag.dol.gov/programs/lca','government',null,2,'2026-08-12'),
  ('US:agronomist','source','DOL — Permanent Labor Certification','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','government',null,3,'2026-08-12'),
  ('US:farm-manager','source','BLS — Farmers, Ranchers, and Other Agricultural Managers','https://www.bls.gov/ooh/management/farmers-ranchers-and-other-agricultural-managers.htm','government',null,1,'2026-08-12'),
  ('US:farm-manager','source','DOL FLAG — H-1B specialty occupations','https://flag.dol.gov/programs/lca','government',null,2,'2026-08-12'),
  ('US:farm-manager','source','DOL — Permanent Labor Certification','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','government',null,3,'2026-08-12'),
  ('US:forestry-technician','source','BLS — Forest and Conservation Technicians metrics','https://www.bls.gov/emp/tables/occupational-projections-and-characteristics.htm','government',null,1,'2026-08-12'),
  ('US:forestry-technician','source','DOL FLAG — H-1B specialty occupations','https://flag.dol.gov/programs/lca','government',null,2,'2026-08-12'),
  ('US:forestry-technician','source','DOL — Permanent Labor Certification','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','government',null,3,'2026-08-12'),
  ('US:food-technologist','source','BLS — Agricultural and Food Scientists','https://www.bls.gov/ooh/life-physical-and-social-science/agricultural-and-food-scientists.htm','government',null,1,'2026-08-12'),
  ('US:food-technologist','source','DOL FLAG — H-1B specialty occupations','https://flag.dol.gov/programs/lca','government',null,2,'2026-08-12'),
  ('US:food-technologist','source','DOL — Permanent Labor Certification','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','government',null,3,'2026-08-12'),
  ('US:sustainability-specialist','source','BLS — Business Operations Specialists, All Other parent metrics','https://www.bls.gov/emp/tables/occupational-projections-and-characteristics.htm','government',null,1,'2026-08-12'),
  ('US:sustainability-specialist','source','DOL FLAG — H-1B specialty occupations','https://flag.dol.gov/programs/lca','government',null,2,'2026-08-12'),
  ('US:sustainability-specialist','source','DOL — Permanent Labor Certification','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','government',null,3,'2026-08-12'),
  ('US:horticulturist','source','BLS — Soil and Plant Scientists professional proxy metrics','https://www.bls.gov/emp/tables/occupational-projections-and-characteristics.htm','government',null,1,'2026-08-12'),
  ('US:horticulturist','source','DOL FLAG — H-1B specialty occupations','https://flag.dol.gov/programs/lca','government',null,2,'2026-08-12'),
  ('US:horticulturist','source','DOL — Permanent Labor Certification','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','government',null,3,'2026-08-12'),
  ('US:animal-science-technician','source','BLS — Agricultural Technicians metrics','https://www.bls.gov/ooh/life-physical-and-social-science/agricultural-and-food-science-technicians.htm','government',null,1,'2026-08-12'),
  ('US:animal-science-technician','source','DOL FLAG — H-1B specialty occupations','https://flag.dol.gov/programs/lca','government',null,2,'2026-08-12'),
  ('US:animal-science-technician','source','DOL — Permanent Labor Certification','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','government',null,3,'2026-08-12');

delete from public.country_occupation_program_links where profile_key in (
  'US:environmental-scientist','US:agronomist','US:farm-manager','US:forestry-technician','US:food-technologist','US:sustainability-specialist','US:horticulturist','US:animal-science-technician'
);
insert into public.country_occupation_program_links (profile_key,program_ref,relation_type,source_checked_at) values
  ('US:agronomist','umn-bs-plant-science','direct','2026-08-12'),
  ('US:environmental-scientist','umn-bs-forest-natural-resource-management','related','2026-08-12'),
  ('US:environmental-scientist','wisc-bs-environmental-engineering','related','2026-08-12'),
  ('US:farm-manager','umn-bs-plant-science','related','2026-08-12'),
  ('US:food-technologist','cornell-bs-food-science','direct','2026-08-12'),
  ('US:food-technologist','umn-bs-food-science','direct','2026-08-12'),
  ('US:forestry-technician','umn-bs-forest-natural-resource-management','related','2026-08-12'),
  ('US:horticulturist','umn-bs-plant-science','related','2026-08-12');
