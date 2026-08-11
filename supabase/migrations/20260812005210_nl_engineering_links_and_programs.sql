delete from public.country_occupation_links
where profile_key in ('NL:civil-engineer','NL:mechanical-engineer','NL:electrical-engineer','NL:manufacturing-engineer','NL:industrial-engineer','NL:chemical-engineer','NL:environmental-engineer','NL:engineering-technician');

insert into public.country_occupation_links (profile_key,link_type,label,url,provider_type,region_code,sort_order,source_checked_at) values
('NL:civil-engineer','entry_program','Studiekeuze123 — Civiele Techniek','https://www.studiekeuze123.nl/studies/34279-civiele-techniek-hbo-bachelor','official_study_information',null,1,'2026-08-12'),
('NL:civil-engineer','source','UWV — Kansrijke beroepen hbo/wo','https://www.uwv.nl/nl/arbeidsmarktinformatie/kansen-beroep/kansrijke-beroepen-hbo-wo','official_labour_market',null,2,'2026-08-12'),
('NL:mechanical-engineer','entry_program','Studiekeuze123 — Werktuigbouwkunde','https://www.studiekeuze123.nl/studies/34280-werktuigbouwkunde-hbo-bachelor','official_study_information',null,1,'2026-08-12'),
('NL:mechanical-engineer','source','UWV — Kansrijke beroepen hbo/wo','https://www.uwv.nl/nl/arbeidsmarktinformatie/kansen-beroep/kansrijke-beroepen-hbo-wo','official_labour_market',null,2,'2026-08-12'),
('NL:mechanical-engineer','source','UWV — Verduurzaming industrie vraagt om vakmensen','https://www.uwv.nl/nl/arbeidsmarktinformatie/sector/industrie/verduurzaming-vraagt-vakmensen','official_labour_market',null,3,'2026-08-12'),
('NL:electrical-engineer','entry_program','Studiekeuze123 — Elektrotechniek','https://www.studiekeuze123.nl/studies/34267-elektrotechniek-hbo-bachelor','official_study_information',null,1,'2026-08-12'),
('NL:electrical-engineer','source','UWV — Spanningsindicator Q1 2026','https://www.uwv.nl/nl/arbeidsmarktinformatie/trends-ontwikkelingen/spanningsindicator-arbeidsmarkt-koelt-verder-af','official_labour_market',null,2,'2026-08-12'),
('NL:electrical-engineer','source','UWV — Kansrijke beroepen hbo/wo','https://www.uwv.nl/nl/arbeidsmarktinformatie/kansen-beroep/kansrijke-beroepen-hbo-wo','official_labour_market',null,3,'2026-08-12'),
('NL:manufacturing-engineer','entry_program','Studiekeuze123 — Technische Bedrijfskunde','https://www.studiekeuze123.nl/studies/34421-technische-bedrijfskunde-hbo-bachelor','official_study_information',null,1,'2026-08-12'),
('NL:manufacturing-engineer','entry_program','Studiekeuze123 — Engineering','https://www.studiekeuze123.nl/studies/30107-engineering-hbo-bachelor','official_study_information',null,2,'2026-08-12'),
('NL:manufacturing-engineer','source','UWV — Verduurzaming industrie vraagt om vakmensen','https://www.uwv.nl/nl/arbeidsmarktinformatie/sector/industrie/verduurzaming-vraagt-vakmensen','official_labour_market',null,3,'2026-08-12'),
('NL:industrial-engineer','entry_program','Studiekeuze123 — Technische Bedrijfskunde','https://www.studiekeuze123.nl/studies/34421-technische-bedrijfskunde-hbo-bachelor','official_study_information',null,1,'2026-08-12'),
('NL:industrial-engineer','source','UWV — Kansrijke beroepen hbo/wo','https://www.uwv.nl/nl/arbeidsmarktinformatie/kansen-beroep/kansrijke-beroepen-hbo-wo','official_labour_market',null,2,'2026-08-12'),
('NL:industrial-engineer','source','UWV — Verduurzaming industrie vraagt om vakmensen','https://www.uwv.nl/nl/arbeidsmarktinformatie/sector/industrie/verduurzaming-vraagt-vakmensen','official_labour_market',null,3,'2026-08-12'),
('NL:chemical-engineer','entry_program','Studiekeuze123 — Chemische Technologie','https://www.studiekeuze123.nl/studies/34275-chemische-technologie-hbo-bachelor','official_study_information',null,1,'2026-08-12'),
('NL:chemical-engineer','source','UWV — Verduurzaming industrie vraagt om vakmensen','https://www.uwv.nl/nl/arbeidsmarktinformatie/sector/industrie/verduurzaming-vraagt-vakmensen','official_labour_market',null,2,'2026-08-12'),
('NL:environmental-engineer','entry_program','Studiekeuze123 — Milieukunde','https://www.studiekeuze123.nl/studies/34284-milieukunde-hbo-bachelor','official_study_information',null,1,'2026-08-12'),
('NL:environmental-engineer','source','UWV — Kansrijke beroepen hbo/wo','https://www.uwv.nl/nl/arbeidsmarktinformatie/kansen-beroep/kansrijke-beroepen-hbo-wo','official_labour_market',null,2,'2026-08-12'),
('NL:engineering-technician','entry_program','Studiekeuze123 — Engineering Associate Degree','https://www.studiekeuze123.nl/studies/80091-engineering-hbo-associate-degree','official_study_information',null,1,'2026-08-12'),
('NL:engineering-technician','source','UWV — Ruim 140 structureel kansrijke beroepen','https://www.uwv.nl/nl/arbeidsmarktinformatie/kansen-beroep/ruim-140-structureel-kansrijke-beroepen','official_labour_market',null,2,'2026-08-12'),
('NL:engineering-technician','source','UWV — Arbeidsmarktpositie mbo','https://www.uwv.nl/nl/arbeidsmarktinformatie/kansen-beroep/arbeidsmarktpositie-mbo-vergeleken','official_labour_market',null,3,'2026-08-12'),
('NL:civil-engineer','source','IND — Highly Skilled Migrant','https://ind.nl/en/residence-permits/work/highly-skilled-migrant','official_migration',null,10,'2026-08-12'),
('NL:mechanical-engineer','source','IND — Highly Skilled Migrant','https://ind.nl/en/residence-permits/work/highly-skilled-migrant','official_migration',null,10,'2026-08-12'),
('NL:electrical-engineer','source','IND — Highly Skilled Migrant','https://ind.nl/en/residence-permits/work/highly-skilled-migrant','official_migration',null,10,'2026-08-12'),
('NL:manufacturing-engineer','source','IND — Highly Skilled Migrant','https://ind.nl/en/residence-permits/work/highly-skilled-migrant','official_migration',null,10,'2026-08-12'),
('NL:industrial-engineer','source','IND — Highly Skilled Migrant','https://ind.nl/en/residence-permits/work/highly-skilled-migrant','official_migration',null,10,'2026-08-12'),
('NL:chemical-engineer','source','IND — Highly Skilled Migrant','https://ind.nl/en/residence-permits/work/highly-skilled-migrant','official_migration',null,10,'2026-08-12'),
('NL:environmental-engineer','source','IND — Highly Skilled Migrant','https://ind.nl/en/residence-permits/work/highly-skilled-migrant','official_migration',null,10,'2026-08-12'),
('NL:engineering-technician','source','IND — Single Permit GVVA','https://ind.nl/en/residence-permits/work/single-permit-gvva','official_migration',null,10,'2026-08-12'),
('NL:civil-engineer','source','IND — 2026 required income amounts','https://ind.nl/en/required-amounts-income-requirements','official_migration',null,11,'2026-08-12'),
('NL:mechanical-engineer','source','IND — 2026 required income amounts','https://ind.nl/en/required-amounts-income-requirements','official_migration',null,11,'2026-08-12'),
('NL:electrical-engineer','source','IND — 2026 required income amounts','https://ind.nl/en/required-amounts-income-requirements','official_migration',null,11,'2026-08-12'),
('NL:manufacturing-engineer','source','IND — 2026 required income amounts','https://ind.nl/en/required-amounts-income-requirements','official_migration',null,11,'2026-08-12'),
('NL:industrial-engineer','source','IND — 2026 required income amounts','https://ind.nl/en/required-amounts-income-requirements','official_migration',null,11,'2026-08-12'),
('NL:chemical-engineer','source','IND — 2026 required income amounts','https://ind.nl/en/required-amounts-income-requirements','official_migration',null,11,'2026-08-12'),
('NL:environmental-engineer','source','IND — 2026 required income amounts','https://ind.nl/en/required-amounts-income-requirements','official_migration',null,11,'2026-08-12')
on conflict (profile_key,link_type,url) do update set label=excluded.label,provider_type=excluded.provider_type,region_code=excluded.region_code,sort_order=excluded.sort_order,source_checked_at=excluded.source_checked_at;

delete from public.country_occupation_program_links
where profile_key in ('NL:civil-engineer','NL:mechanical-engineer','NL:electrical-engineer','NL:manufacturing-engineer','NL:industrial-engineer','NL:chemical-engineer','NL:environmental-engineer','NL:engineering-technician')
  and program_ref like 'nl-program:%';

insert into public.country_occupation_program_links (profile_key,program_ref,relation_type,source_checked_at)
select
  'NL:'||poc.canonical_career_id,
  'nl-program:'||poc.programme_id::text,
  case when poc.normalized_relation_type='direct' then 'direct' else 'related' end,
  '2026-08-12'
from public.program_occupation_canonical_nl_v1 poc
join public.program_catalog_canonical_nl_v1 pc using (programme_id)
where poc.canonical_career_id in ('civil-engineer','mechanical-engineer','electrical-engineer','manufacturing-engineer','industrial-engineer','chemical-engineer','environmental-engineer','engineering-technician')
  and pc.verification_tier='A'
  and pc.international_students_eligible is true
  and pc.student_sponsor_eligible is true
  and coalesce(pc.canonical_admission_state,'') <> 'closed'
on conflict (profile_key,program_ref) do update set relation_type=excluded.relation_type,source_checked_at=excluded.source_checked_at;
