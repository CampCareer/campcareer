delete from public.country_occupation_links
where profile_key in ('NL:accountant','NL:financial-analyst','NL:business-analyst','NL:supply-chain-analyst','NL:human-resources-specialist','NL:marketing-specialist','NL:auditor','NL:project-manager');

insert into public.country_occupation_links (profile_key,link_type,label,url,provider_type,region_code,sort_order,source_checked_at) values
('NL:accountant','entry_program','Studiekeuze123 — Accountancy','https://www.studiekeuze123.nl/studies/34406-accountancy-hbo-bachelor','official_study_information',null,1,'2026-08-12'),
('NL:accountant','source','UWV — Kansrijke beroepen hbo/wo','https://www.uwv.nl/nl/arbeidsmarktinformatie/kansen-beroep/kansrijke-beroepen-hbo-wo','official_labour_market',null,2,'2026-08-12'),
('NL:accountant','source','NBA — Protected accountant title','https://www.nba.nl/over-nba/lidmaatschap/accountantstitel/','official_regulation',null,3,'2026-08-12'),
('NL:financial-analyst','entry_program','Studiekeuze123 — Finance & Control','https://www.studiekeuze123.nl/studies/35520-finance-control-hbo-bachelor','official_study_information',null,1,'2026-08-12'),
('NL:financial-analyst','source','UWV — Kansrijke beroepen hbo/wo','https://www.uwv.nl/nl/arbeidsmarktinformatie/kansen-beroep/kansrijke-beroepen-hbo-wo','official_labour_market',null,2,'2026-08-12'),
('NL:business-analyst','entry_program','Studiekeuze123 — Bedrijfskunde','https://www.studiekeuze123.nl/studies/34035-bedrijfskunde-hbo-bachelor','official_study_information',null,1,'2026-08-12'),
('NL:business-analyst','source','UWV — Structureel kansrijke beroepen','https://www.uwv.nl/nl/arbeidsmarktinformatie/kansen-beroep/ruim-140-structureel-kansrijke-beroepen','official_labour_market',null,2,'2026-08-12'),
('NL:supply-chain-analyst','entry_program','Studiekeuze123 — Logistics Management','https://www.studiekeuze123.nl/studies/35522-logistics-management-hbo-bachelor','official_study_information',null,1,'2026-08-12'),
('NL:supply-chain-analyst','source','UWV — Kansrijke beroepen','https://www.uwv.nl/nl/arbeidsmarktinformatie/kansen-beroep/kansrijke-beroepen','official_labour_market',null,2,'2026-08-12'),
('NL:supply-chain-analyst','source','UWV — Structureel kansrijke beroepen','https://www.uwv.nl/nl/arbeidsmarktinformatie/kansen-beroep/ruim-140-structureel-kansrijke-beroepen','official_labour_market',null,3,'2026-08-12'),
('NL:human-resources-specialist','entry_program','Studiekeuze123 — Human Resource Management','https://www.studiekeuze123.nl/studies/34609-human-resource-management-hbo-bachelor','official_study_information',null,1,'2026-08-12'),
('NL:human-resources-specialist','source','UWV — Kansrijke beroepen','https://www.uwv.nl/nl/arbeidsmarktinformatie/kansen-beroep/kansrijke-beroepen','official_labour_market',null,2,'2026-08-12'),
('NL:marketing-specialist','entry_program','Studiekeuze123 — Commerciele Economie','https://www.studiekeuze123.nl/studies/34402-commerciele-economie-hbo-bachelor','official_study_information',null,1,'2026-08-12'),
('NL:marketing-specialist','source','UWV — Kansrijke beroepen hbo/wo','https://www.uwv.nl/nl/arbeidsmarktinformatie/kansen-beroep/kansrijke-beroepen-hbo-wo','official_labour_market',null,2,'2026-08-12'),
('NL:auditor','entry_program','Studiekeuze123 — Accountancy','https://www.studiekeuze123.nl/studies/34406-accountancy-hbo-bachelor','official_study_information',null,1,'2026-08-12'),
('NL:auditor','source','NBA — Protected accountant title','https://www.nba.nl/over-nba/lidmaatschap/accountantstitel/','official_regulation',null,2,'2026-08-12'),
('NL:auditor','source','AFM — External accountant register requirements','https://www.afm.nl/nl-nl/sector/accountantsorganisaties/begrippen','official_regulation',null,3,'2026-08-12'),
('NL:auditor','source','UWV — Kansrijke beroepen hbo/wo','https://www.uwv.nl/nl/arbeidsmarktinformatie/kansen-beroep/kansrijke-beroepen-hbo-wo','official_labour_market',null,4,'2026-08-12'),
('NL:project-manager','entry_program','Studiekeuze123 — Bedrijfskunde','https://www.studiekeuze123.nl/studies/34035-bedrijfskunde-hbo-bachelor','official_study_information',null,1,'2026-08-12'),
('NL:project-manager','source','UWV — Kansrijke beroepen 2026','https://www.uwv.nl/nl/arbeidsmarktinformatie/kansen-beroep/kansrijke-beroepen','official_labour_market',null,2,'2026-08-12'),
('NL:accountant','source','IND — Highly Skilled Migrant','https://ind.nl/en/residence-permits/work/highly-skilled-migrant','official_migration',null,10,'2026-08-12'),
('NL:financial-analyst','source','IND — Highly Skilled Migrant','https://ind.nl/en/residence-permits/work/highly-skilled-migrant','official_migration',null,10,'2026-08-12'),
('NL:business-analyst','source','IND — Highly Skilled Migrant','https://ind.nl/en/residence-permits/work/highly-skilled-migrant','official_migration',null,10,'2026-08-12'),
('NL:supply-chain-analyst','source','IND — Single Permit GVVA','https://ind.nl/en/residence-permits/work/single-permit-gvva','official_migration',null,10,'2026-08-12'),
('NL:human-resources-specialist','source','IND — Highly Skilled Migrant','https://ind.nl/en/residence-permits/work/highly-skilled-migrant','official_migration',null,10,'2026-08-12'),
('NL:marketing-specialist','source','IND — Highly Skilled Migrant','https://ind.nl/en/residence-permits/work/highly-skilled-migrant','official_migration',null,10,'2026-08-12'),
('NL:auditor','source','IND — Highly Skilled Migrant','https://ind.nl/en/residence-permits/work/highly-skilled-migrant','official_migration',null,10,'2026-08-12'),
('NL:project-manager','source','IND — Highly Skilled Migrant','https://ind.nl/en/residence-permits/work/highly-skilled-migrant','official_migration',null,10,'2026-08-12'),
('NL:accountant','source','IND — 2026 required income amounts','https://ind.nl/en/required-amounts-income-requirements','official_migration',null,11,'2026-08-12'),
('NL:financial-analyst','source','IND — 2026 required income amounts','https://ind.nl/en/required-amounts-income-requirements','official_migration',null,11,'2026-08-12'),
('NL:business-analyst','source','IND — 2026 required income amounts','https://ind.nl/en/required-amounts-income-requirements','official_migration',null,11,'2026-08-12'),
('NL:human-resources-specialist','source','IND — 2026 required income amounts','https://ind.nl/en/required-amounts-income-requirements','official_migration',null,11,'2026-08-12'),
('NL:marketing-specialist','source','IND — 2026 required income amounts','https://ind.nl/en/required-amounts-income-requirements','official_migration',null,11,'2026-08-12'),
('NL:auditor','source','IND — 2026 required income amounts','https://ind.nl/en/required-amounts-income-requirements','official_migration',null,11,'2026-08-12'),
('NL:project-manager','source','IND — 2026 required income amounts','https://ind.nl/en/required-amounts-income-requirements','official_migration',null,11,'2026-08-12')
on conflict (profile_key,link_type,url) do update set label=excluded.label,provider_type=excluded.provider_type,region_code=excluded.region_code,sort_order=excluded.sort_order,source_checked_at=excluded.source_checked_at;

delete from public.country_occupation_program_links
where profile_key in ('NL:accountant','NL:financial-analyst','NL:business-analyst','NL:supply-chain-analyst','NL:human-resources-specialist','NL:marketing-specialist','NL:auditor','NL:project-manager')
  and program_ref like 'nl-program:%';

insert into public.country_occupation_program_links (profile_key,program_ref,relation_type,source_checked_at)
select
  'NL:'||poc.canonical_career_id,
  'nl-program:'||poc.programme_id::text,
  case when poc.normalized_relation_type='direct' then 'direct' else 'related' end,
  '2026-08-12'
from public.program_occupation_canonical_nl_v1 poc
join public.program_catalog_canonical_nl_v1 pc using (programme_id)
where poc.canonical_career_id in ('accountant','financial-analyst','business-analyst','supply-chain-analyst','human-resources-specialist','marketing-specialist','auditor','project-manager')
  and pc.verification_tier='A'
  and pc.international_students_eligible is true
  and pc.student_sponsor_eligible is true
  and coalesce(pc.canonical_admission_state,'') <> 'closed'
on conflict (profile_key,program_ref) do update set relation_type=excluded.relation_type,source_checked_at=excluded.source_checked_at;
