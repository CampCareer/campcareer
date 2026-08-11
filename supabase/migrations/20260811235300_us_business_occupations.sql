-- United States business occupation cohort: 8 canonical careers.
-- BLS 2024 employment/pay and 2024-2034 projections plus H-1B/PERM and CPA boundaries checked 2026-08-12.

insert into public.country_occupation_profiles (
  profile_key,country_code,canonical_career_id,official_title,official_code_system,official_code_version,
  official_unit_group_code,currency,registration_required,registration_authority,registration_url,
  publication_status,source_checked_at,updated_at
) values
  ('US:accountant','US','accountant','Accountants and Auditors — accountant scope','SOC','SOC 2018','13-2011','USD',false,null,null,'profile_ready','2026-08-12',now()),
  ('US:financial-analyst','US','financial-analyst','Financial and Investment Analysts','SOC','SOC 2018','13-2051','USD',false,null,null,'profile_ready','2026-08-12',now()),
  ('US:business-analyst','US','business-analyst','Management Analysts — business-analysis proxy','SOC','SOC 2018','13-1111','USD',false,null,null,'profile_ready','2026-08-12',now()),
  ('US:supply-chain-analyst','US','supply-chain-analyst','Logisticians — supply-chain analysis proxy','SOC','SOC 2018','13-1081','USD',false,null,null,'profile_ready','2026-08-12',now()),
  ('US:human-resources-specialist','US','human-resources-specialist','Human Resources Specialists','SOC','SOC 2018','13-1071','USD',false,null,null,'profile_ready','2026-08-12',now()),
  ('US:marketing-specialist','US','marketing-specialist','Market Research Analysts and Marketing Specialists','SOC','SOC 2018','13-1161','USD',false,null,null,'profile_ready','2026-08-12',now()),
  ('US:auditor','US','auditor','Accountants and Auditors — auditor scope','SOC','SOC 2018','13-2011','USD',false,null,null,'profile_ready','2026-08-12',now()),
  ('US:project-manager','US','project-manager','Project Management Specialists','SOC','SOC 2018','13-1082','USD',false,null,null,'profile_ready','2026-08-12',now())
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
  ('US:accountant','2026-08-12',1579800,null,81680,0,0,0,0,6,8,5,5,5,29,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','SOC 2018 13-2011 Accountants and Auditors, constrained here to the accountant scope. The national BLS series combines accountants and auditors.',
    'shortage_note','BLS growth and replacement openings are demand indicators, not a formal federal shortage designation; 0/20.',
    'salary_method','BLS May 2024 Accountants and Auditors median annual wage is USD 81,680; US v1 USD 75,000-99,999 band earns 8/10.',
    'growth_basis','BLS projects the combined 13-2011 series to grow 4.6 percent from 2024 to 2034; US v1 4 to under 7 percent band earns 5/10.',
    'visa_basis','A specific accountant position may support H-1B only when it independently requires a bachelor degree or equivalent in a specific specialty; PERM remains employer/labor-certification based; 5/10.',
    'entry_basis','BLS lists a bachelor degree as typical entry education; 6/15.',
    'entry_burden_basis','Generic accountants do not need one nationwide personal licence. CPA licensure is state-based and applies to particular public-accounting responsibilities; generic burden 5/5.'
  ),'2026-08-12'),
  ('US:financial-analyst','2026-08-12',368500,null,101350,0,0,0,0,6,10,5,5,5,31,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','SOC 2018 13-2051 Financial and Investment Analysts. Personal Financial Advisors 13-2052 and Financial Risk Specialists 13-2054 remain separate.',
    'shortage_note','No federal shortage designation is inferred from BLS growth or openings; 0/20.',
    'salary_method','BLS 2024 median annual wage is USD 101,350; at least USD 100,000 earns 10/10.',
    'growth_basis','BLS projects 5.7 percent growth from 2024 to 2034; US v1 4 to under 7 percent band earns 5/10.',
    'visa_basis','Degree-specific finance positions may support H-1B or PERM only when the actual duties, degree relationship and employer filing independently qualify; 5/10.',
    'entry_basis','BLS lists bachelor-level entry; 6/15.',
    'entry_burden_basis','No universal occupational licence for the generic Financial Analyst occupation; regulated securities/advisory functions are separate activity-specific boundaries; 5/5.'
  ),'2026-08-12'),
  ('US:business-analyst','2026-08-12',1075100,null,101190,0,0,0,0,5,10,8,5,5,33,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','Business Analyst has no single exact BLS detailed title. SOC 2018 13-1111 Management Analysts is used as the closest national business-process and organizational-analysis proxy.',
    'shortage_note','The 8.8 percent BLS proxy growth rate is not converted into formal shortage status; 0/20.',
    'salary_method','BLS 2024 Management Analysts median annual wage is USD 101,190. It is used only as the declared Business Analyst proxy; 10/10.',
    'growth_basis','BLS projects Management Analysts to grow 8.8 percent from 2024 to 2034; US v1 7 to under 10 percent band earns 8/10.',
    'visa_basis','A business-analysis position receives only conditional H-1B/PERM credit because the title alone does not establish a degree in a specific specialty; 5/10.',
    'entry_basis','BLS lists a bachelor degree and less than five years of related work experience as typical; 5/15.',
    'entry_burden_basis','No universal statutory Business Analyst licence; 5/5.'
  ),'2026-08-12'),
  ('US:supply-chain-analyst','2026-08-12',241000,null,80880,0,0,0,0,6,8,10,5,5,34,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','SOC 2018 13-1081 Logisticians is used as the closest national Supply Chain Analyst proxy because BLS defines Logisticians as analyzing and coordinating an organization''s supply chain.',
    'shortage_note','The strong BLS growth projection is demand evidence and not a federal shortage designation; 0/20.',
    'salary_method','BLS 2024 Logisticians median annual wage is USD 80,880; declared proxy, 8/10 salary band.',
    'growth_basis','BLS projects Logisticians to grow 16.7 percent from 2024 to 2034; US v1 at least 10 percent earns 10/10.',
    'visa_basis','Degree-specific supply-chain/logistics positions may support H-1B or PERM when the actual position and filing qualify; occupation title alone is insufficient; 5/10.',
    'entry_basis','BLS lists bachelor-level entry; 6/15.',
    'entry_burden_basis','No universal statutory licence for the generic occupation; 5/5.'
  ),'2026-08-12'),
  ('US:human-resources-specialist','2026-08-12',944300,null,72910,0,0,0,0,6,6,5,5,5,27,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','SOC 2018 13-1071 Human Resources Specialists.',
    'shortage_note','Large replacement openings and employer demand are not formal federal shortage designations; 0/20.',
    'salary_method','BLS May 2024 median annual wage is USD 72,910; US v1 USD 60,000-74,999 band earns 6/10.',
    'growth_basis','BLS projects 6.2 percent growth from 2024 to 2034; US v1 4 to under 7 percent band earns 5/10.',
    'visa_basis','Some degree-specific HR positions may qualify for H-1B or PERM, but the occupational title does not itself prove a specific-specialty degree requirement; 5/10 conditional credit.',
    'entry_basis','BLS lists bachelor-level entry; 6/15.',
    'entry_burden_basis','No nationwide statutory HR licence; 5/5.'
  ),'2026-08-12'),
  ('US:marketing-specialist','2026-08-12',941700,null,76950,0,0,0,0,6,8,5,5,5,29,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','SOC 2018 13-1161 Market Research Analysts and Marketing Specialists. The BLS national series combines both title families.',
    'shortage_note','BLS demand and openings are not converted into a federal shortage designation; 0/20.',
    'salary_method','BLS May 2024 median annual wage is USD 76,950; US v1 USD 75,000-99,999 band earns 8/10.',
    'growth_basis','BLS table 1.2 reports 6.7 percent growth from 2024 to 2034; US v1 4 to under 7 percent band earns 5/10.',
    'visa_basis','Marketing positions receive only conditional professional-visa credit because H-1B depends on the particular job requiring a bachelor degree in a specific specialty; PERM is employer-led; 5/10.',
    'entry_basis','BLS lists bachelor-level entry; 6/15.',
    'entry_burden_basis','No universal statutory Marketing Specialist licence; 5/5.'
  ),'2026-08-12'),
  ('US:auditor','2026-08-12',1579800,null,81680,0,0,0,0,6,8,5,5,4,28,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','SOC 2018 13-2011 Accountants and Auditors, constrained here to auditor work. BLS does not publish an auditor-only national employment/pay/projection series.',
    'shortage_note','No auditor-specific federal shortage designation is inferred; 0/20.',
    'salary_method','BLS May 2024 combined Accountants and Auditors median annual wage is USD 81,680; shared series, 8/10.',
    'growth_basis','BLS projects combined 13-2011 growth of 4.6 percent from 2024 to 2034; 5/10 growth band.',
    'visa_basis','Degree-specific audit positions may support H-1B or PERM only where the actual filing qualifies; 5/10.',
    'entry_basis','BLS lists bachelor-level entry; 6/15.',
    'entry_burden_basis','Auditing is not universally licensed across internal or operational roles, but state CPA licensure is required for specific public-accounting/SEC-reporting responsibilities; conditional burden 4/5.'
  ),'2026-08-12'),
  ('US:project-manager','2026-08-12',1046300,null,100750,0,0,0,0,6,10,5,5,5,31,'career-opportunity-us-v1','provisional',jsonb_build_object(
    'classification_scope','SOC 2018 13-1082 Project Management Specialists, used for the cross-industry Business-category Project Manager scope. Construction Managers and discipline-specific technical managers remain separate.',
    'shortage_note','Projected growth and replacement openings are not formal federal shortage designations; 0/20.',
    'salary_method','BLS May 2024 median annual wage is USD 100,750; at least USD 100,000 earns 10/10.',
    'growth_basis','BLS projects 5.6 percent growth from 2024 to 2034; US v1 4 to under 7 percent band earns 5/10.',
    'visa_basis','Project-management positions receive conditional H-1B/PERM credit only when the specific job independently establishes the required specialty-degree relationship and employer filing; 5/10.',
    'entry_basis','BLS lists bachelor-level entry; 6/15.',
    'entry_burden_basis','No universal statutory Project Manager licence; 5/5.'
  ),'2026-08-12')
on conflict (profile_key,as_of_date) do update set
  employment_total=excluded.employment_total,median_hourly_earnings=excluded.median_hourly_earnings,annualised_median_salary=excluded.annualised_median_salary,
  shortage_component=excluded.shortage_component,vacancy_intensity_component=excluded.vacancy_intensity_component,employer_diversity_component=excluded.employer_diversity_component,vacancy_trend_component=excluded.vacancy_trend_component,
  entry_level_component=excluded.entry_level_component,salary_component=excluded.salary_component,growth_component=excluded.growth_component,visa_component=excluded.visa_component,entry_burden_component=excluded.entry_burden_component,
  opportunity_score=excluded.opportunity_score,score_methodology_version=excluded.score_methodology_version,score_status=excluded.score_status,score_evidence=excluded.score_evidence,source_checked_at=excluded.source_checked_at;

delete from public.country_occupation_specialisations where profile_key in (
  'US:accountant','US:financial-analyst','US:business-analyst','US:supply-chain-analyst','US:human-resources-specialist','US:marketing-specialist','US:auditor','US:project-manager'
);
insert into public.country_occupation_specialisations (
  profile_key,official_code,official_title,shortage_rating,visa_eligible,included_in_rollup,sort_order,source_url,source_checked_at
) values
  ('US:accountant','13-2011','Accountants and Auditors — accountant scope',null,true,true,1,'https://www.bls.gov/ooh/business-and-financial/accountants-and-auditors.htm','2026-08-12'),
  ('US:financial-analyst','13-2051','Financial and Investment Analysts',null,true,true,1,'https://www.bls.gov/ooh/business-and-financial/financial-analysts.htm','2026-08-12'),
  ('US:business-analyst','13-1111','Management Analysts — business-analysis proxy',null,true,true,1,'https://www.bls.gov/ooh/business-and-financial/management-analysts.htm','2026-08-12'),
  ('US:supply-chain-analyst','13-1081','Logisticians — supply-chain analysis proxy',null,true,true,1,'https://www.bls.gov/ooh/business-and-financial/logisticians.htm','2026-08-12'),
  ('US:human-resources-specialist','13-1071','Human Resources Specialists',null,true,true,1,'https://www.bls.gov/ooh/business-and-financial/human-resources-specialists.htm','2026-08-12'),
  ('US:marketing-specialist','13-1161','Market Research Analysts and Marketing Specialists',null,true,true,1,'https://www.bls.gov/ooh/business-and-financial/market-research-analysts.htm','2026-08-12'),
  ('US:auditor','13-2011','Accountants and Auditors — auditor scope',null,true,true,1,'https://www.bls.gov/ooh/business-and-financial/accountants-and-auditors.htm','2026-08-12'),
  ('US:project-manager','13-1082','Project Management Specialists',null,true,true,1,'https://www.bls.gov/ooh/business-and-financial/project-management-specialists.htm','2026-08-12');

delete from public.country_occupation_links where profile_key in (
  'US:accountant','US:financial-analyst','US:business-analyst','US:supply-chain-analyst','US:human-resources-specialist','US:marketing-specialist','US:auditor','US:project-manager'
);
insert into public.country_occupation_links (
  profile_key,link_type,label,url,provider_type,region_code,sort_order,source_checked_at
) values
  ('US:accountant','source','BLS — Accountants and Auditors','https://www.bls.gov/ooh/business-and-financial/accountants-and-auditors.htm','government',null,1,'2026-08-12'),
  ('US:accountant','source','DOL FLAG — H-1B specialty occupations','https://flag.dol.gov/programs/LCA','government',null,2,'2026-08-12'),
  ('US:accountant','source','DOL — Permanent Labor Certification','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','government',null,3,'2026-08-12'),
  ('US:financial-analyst','source','BLS — Financial Analysts','https://www.bls.gov/ooh/business-and-financial/financial-analysts.htm','government',null,1,'2026-08-12'),
  ('US:financial-analyst','source','DOL FLAG — H-1B specialty occupations','https://flag.dol.gov/programs/LCA','government',null,2,'2026-08-12'),
  ('US:financial-analyst','source','DOL — Permanent Labor Certification','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','government',null,3,'2026-08-12'),
  ('US:business-analyst','source','BLS — Management Analysts proxy','https://www.bls.gov/ooh/business-and-financial/management-analysts.htm','government',null,1,'2026-08-12'),
  ('US:business-analyst','source','DOL FLAG — H-1B specialty occupations','https://flag.dol.gov/programs/LCA','government',null,2,'2026-08-12'),
  ('US:business-analyst','source','DOL — Permanent Labor Certification','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','government',null,3,'2026-08-12'),
  ('US:supply-chain-analyst','source','BLS — Logisticians proxy','https://www.bls.gov/ooh/business-and-financial/logisticians.htm','government',null,1,'2026-08-12'),
  ('US:supply-chain-analyst','source','DOL FLAG — H-1B specialty occupations','https://flag.dol.gov/programs/LCA','government',null,2,'2026-08-12'),
  ('US:supply-chain-analyst','source','DOL — Permanent Labor Certification','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','government',null,3,'2026-08-12'),
  ('US:human-resources-specialist','source','BLS — Human Resources Specialists','https://www.bls.gov/ooh/business-and-financial/human-resources-specialists.htm','government',null,1,'2026-08-12'),
  ('US:human-resources-specialist','source','DOL FLAG — H-1B specialty occupations','https://flag.dol.gov/programs/LCA','government',null,2,'2026-08-12'),
  ('US:human-resources-specialist','source','DOL — Permanent Labor Certification','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','government',null,3,'2026-08-12'),
  ('US:marketing-specialist','source','BLS — Market Research Analysts and Marketing Specialists','https://www.bls.gov/ooh/business-and-financial/market-research-analysts.htm','government',null,1,'2026-08-12'),
  ('US:marketing-specialist','source','DOL FLAG — H-1B specialty occupations','https://flag.dol.gov/programs/LCA','government',null,2,'2026-08-12'),
  ('US:marketing-specialist','source','DOL — Permanent Labor Certification','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','government',null,3,'2026-08-12'),
  ('US:auditor','source','BLS — Accountants and Auditors','https://www.bls.gov/ooh/business-and-financial/accountants-and-auditors.htm','government',null,1,'2026-08-12'),
  ('US:auditor','source','DOL FLAG — H-1B specialty occupations','https://flag.dol.gov/programs/LCA','government',null,2,'2026-08-12'),
  ('US:auditor','source','DOL — Permanent Labor Certification','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','government',null,3,'2026-08-12'),
  ('US:project-manager','source','BLS — Project Management Specialists','https://www.bls.gov/ooh/business-and-financial/project-management-specialists.htm','government',null,1,'2026-08-12'),
  ('US:project-manager','source','DOL FLAG — H-1B specialty occupations','https://flag.dol.gov/programs/LCA','government',null,2,'2026-08-12'),
  ('US:project-manager','source','DOL — Permanent Labor Certification','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','government',null,3,'2026-08-12');

delete from public.country_occupation_program_links where profile_key in (
  'US:accountant','US:financial-analyst','US:business-analyst','US:supply-chain-analyst','US:human-resources-specialist','US:marketing-specialist','US:auditor','US:project-manager'
);
insert into public.country_occupation_program_links (profile_key,program_ref,relation_type,source_checked_at) values
  ('US:accountant','utaustin-bba-accounting','direct','2026-08-12'),
  ('US:auditor','utaustin-bba-accounting','direct','2026-08-12'),
  ('US:business-analyst','umich-bse-industrial-operations-engineering','related','2026-08-12'),
  ('US:business-analyst','uw-bs-informatics','related','2026-08-12'),
  ('US:business-analyst','wisc-ba-information-science','related','2026-08-12'),
  ('US:financial-analyst','utaustin-bba-accounting','related','2026-08-12'),
  ('US:project-manager','umich-bse-industrial-operations-engineering','related','2026-08-12'),
  ('US:supply-chain-analyst','psu-bs-supply-chain-information-systems','direct','2026-08-12'),
  ('US:supply-chain-analyst','umich-bse-industrial-operations-engineering','related','2026-08-12');
