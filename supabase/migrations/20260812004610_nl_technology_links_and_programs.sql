delete from public.country_occupation_links
where profile_key in ('NL:software-developer','NL:data-analyst','NL:data-engineer','NL:cybersecurity-analyst','NL:network-administrator','NL:cloud-engineer','NL:database-administrator','NL:ict-support-technician');

insert into public.country_occupation_links (profile_key,link_type,label,url,provider_type,region_code,sort_order,source_checked_at) values
('NL:software-developer','entry_program','Studiekeuze123 — Informatica (HBO bachelor)','https://www.studiekeuze123.nl/studies/34479-informatica-hbo-bachelor','official_study_information',null,1,'2026-08-12'),
('NL:software-developer','entry_program','Studiekeuze123 — Software Development (associate degree)','https://www.studiekeuze123.nl/studies/80130-software-development-hbo-associate-degree','official_study_information',null,2,'2026-08-12'),
('NL:software-developer','source','ILO — ISCO-08','https://isco.ilo.org/en/isco-08/','official_classification',null,3,'2026-08-12'),
('NL:software-developer','source','UWV — Kansrijke beroepen hbo/wo','https://www.uwv.nl/nl/arbeidsmarktinformatie/kansen-beroep/kansrijke-beroepen-hbo-wo','official_labour_market',null,4,'2026-08-12'),
('NL:data-analyst','entry_program','Studiekeuze123 — Applied Data Science & Artificial Intelligence','https://www.studiekeuze123.nl/studies/39309-applied-data-science-artificial-intelligence-hbo-bachelor','official_study_information',null,1,'2026-08-12'),
('NL:data-analyst','entry_program','Studiekeuze123 — Data Science (joint degree)','https://www.studiekeuze123.nl/studies/55018-data-science-joint-degree-wo-bachelor','official_study_information',null,2,'2026-08-12'),
('NL:data-analyst','source','UWV — Kansrijke beroepen hbo/wo','https://www.uwv.nl/nl/arbeidsmarktinformatie/kansen-beroep/kansrijke-beroepen-hbo-wo','official_labour_market',null,3,'2026-08-12'),
('NL:data-engineer','entry_program','Studiekeuze123 — Informatica (HBO bachelor)','https://www.studiekeuze123.nl/studies/34479-informatica-hbo-bachelor','official_study_information',null,1,'2026-08-12'),
('NL:data-engineer','entry_program','Studiekeuze123 — Applied Data Science & Artificial Intelligence','https://www.studiekeuze123.nl/studies/39309-applied-data-science-artificial-intelligence-hbo-bachelor','official_study_information',null,2,'2026-08-12'),
('NL:data-engineer','source','UWV — Veel vraag naar hoogopgeleide ICT’ers','https://www.uwv.nl/nl/arbeidsmarktinformatie/sector/ict/vraag-hoogopgeleide-ict-ers-specifieke-kennis','official_labour_market',null,3,'2026-08-12'),
('NL:cybersecurity-analyst','entry_program','Studiekeuze123 — ICT (HBO bachelor; Cyber Security & Cloud variants)','https://www.studiekeuze123.nl/studies/30020-hbo-ict-hbo-bachelor','official_study_information',null,1,'2026-08-12'),
('NL:cybersecurity-analyst','source','ILO — ISCO-08','https://isco.ilo.org/en/isco-08/','official_classification',null,2,'2026-08-12'),
('NL:cybersecurity-analyst','source','UWV — Kansrijke beroepen hbo/wo','https://www.uwv.nl/nl/arbeidsmarktinformatie/kansen-beroep/kansrijke-beroepen-hbo-wo','official_labour_market',null,3,'2026-08-12'),
('NL:cybersecurity-analyst','source','UWV — Structureel kansrijke beroepen','https://www.uwv.nl/nl/arbeidsmarktinformatie/kansen-beroep/ruim-140-structureel-kansrijke-beroepen','official_labour_market',null,4,'2026-08-12'),
('NL:network-administrator','entry_program','Studiekeuze123 — ICT (HBO bachelor)','https://www.studiekeuze123.nl/studies/30020-hbo-ict-hbo-bachelor','official_study_information',null,1,'2026-08-12'),
('NL:network-administrator','entry_program','Studiekeuze123 — ICT (associate degree)','https://www.studiekeuze123.nl/studies/80132-ict-hbo-associate-degree','official_study_information',null,2,'2026-08-12'),
('NL:network-administrator','source','ILO — ISCO-08','https://isco.ilo.org/en/isco-08/','official_classification',null,3,'2026-08-12'),
('NL:network-administrator','source','UWV — Structureel kansrijke beroepen','https://www.uwv.nl/nl/arbeidsmarktinformatie/kansen-beroep/ruim-140-structureel-kansrijke-beroepen','official_labour_market',null,4,'2026-08-12'),
('NL:cloud-engineer','entry_program','Studiekeuze123 — ICT (HBO bachelor; Cyber Security & Cloud variants)','https://www.studiekeuze123.nl/studies/30020-hbo-ict-hbo-bachelor','official_study_information',null,1,'2026-08-12'),
('NL:cloud-engineer','source','UWV — ICT beroepen','https://www.uwv.nl/nl/arbeidsmarktinformatie/sector/ict','official_labour_market',null,2,'2026-08-12'),
('NL:cloud-engineer','source','UWV — Structureel kansrijke beroepen','https://www.uwv.nl/nl/arbeidsmarktinformatie/kansen-beroep/ruim-140-structureel-kansrijke-beroepen','official_labour_market',null,3,'2026-08-12'),
('NL:database-administrator','entry_program','Studiekeuze123 — Informatica (HBO bachelor)','https://www.studiekeuze123.nl/studies/34479-informatica-hbo-bachelor','official_study_information',null,1,'2026-08-12'),
('NL:database-administrator','entry_program','Studiekeuze123 — Business IT & Management','https://www.studiekeuze123.nl/studies/39118-business-it-management-hbo-bachelor','official_study_information',null,2,'2026-08-12'),
('NL:database-administrator','source','ILO — ISCO-08','https://isco.ilo.org/en/isco-08/','official_classification',null,3,'2026-08-12'),
('NL:database-administrator','source','UWV — Veel vraag naar hoogopgeleide ICT’ers','https://www.uwv.nl/nl/arbeidsmarktinformatie/sector/ict/vraag-hoogopgeleide-ict-ers-specifieke-kennis','official_labour_market',null,4,'2026-08-12'),
('NL:ict-support-technician','entry_program','Studiekeuze123 — ICT (associate degree)','https://www.studiekeuze123.nl/studies/80132-ict-hbo-associate-degree','official_study_information',null,1,'2026-08-12'),
('NL:ict-support-technician','source','ILO — ISCO-08','https://isco.ilo.org/en/isco-08/','official_classification',null,2,'2026-08-12'),
('NL:ict-support-technician','source','UWV — ICT beroepen','https://www.uwv.nl/nl/arbeidsmarktinformatie/sector/ict','official_labour_market',null,3,'2026-08-12'),
('NL:software-developer','source','IND — Highly Skilled Migrant','https://ind.nl/en/residence-permits/work/highly-skilled-migrant','official_migration',null,10,'2026-08-12'),
('NL:data-analyst','source','IND — Highly Skilled Migrant','https://ind.nl/en/residence-permits/work/highly-skilled-migrant','official_migration',null,10,'2026-08-12'),
('NL:data-engineer','source','IND — Highly Skilled Migrant','https://ind.nl/en/residence-permits/work/highly-skilled-migrant','official_migration',null,10,'2026-08-12'),
('NL:cybersecurity-analyst','source','IND — Highly Skilled Migrant','https://ind.nl/en/residence-permits/work/highly-skilled-migrant','official_migration',null,10,'2026-08-12'),
('NL:network-administrator','source','IND — Highly Skilled Migrant','https://ind.nl/en/residence-permits/work/highly-skilled-migrant','official_migration',null,10,'2026-08-12'),
('NL:cloud-engineer','source','IND — Highly Skilled Migrant','https://ind.nl/en/residence-permits/work/highly-skilled-migrant','official_migration',null,10,'2026-08-12'),
('NL:database-administrator','source','IND — Highly Skilled Migrant','https://ind.nl/en/residence-permits/work/highly-skilled-migrant','official_migration',null,10,'2026-08-12'),
('NL:ict-support-technician','source','IND — Highly Skilled Migrant','https://ind.nl/en/residence-permits/work/highly-skilled-migrant','official_migration',null,10,'2026-08-12'),
('NL:software-developer','source','IND — 2026 required income amounts','https://ind.nl/en/required-amounts-income-requirements','official_migration',null,11,'2026-08-12'),
('NL:data-analyst','source','IND — 2026 required income amounts','https://ind.nl/en/required-amounts-income-requirements','official_migration',null,11,'2026-08-12'),
('NL:data-engineer','source','IND — 2026 required income amounts','https://ind.nl/en/required-amounts-income-requirements','official_migration',null,11,'2026-08-12'),
('NL:cybersecurity-analyst','source','IND — 2026 required income amounts','https://ind.nl/en/required-amounts-income-requirements','official_migration',null,11,'2026-08-12'),
('NL:network-administrator','source','IND — 2026 required income amounts','https://ind.nl/en/required-amounts-income-requirements','official_migration',null,11,'2026-08-12'),
('NL:cloud-engineer','source','IND — 2026 required income amounts','https://ind.nl/en/required-amounts-income-requirements','official_migration',null,11,'2026-08-12'),
('NL:database-administrator','source','IND — 2026 required income amounts','https://ind.nl/en/required-amounts-income-requirements','official_migration',null,11,'2026-08-12'),
('NL:ict-support-technician','source','IND — 2026 required income amounts','https://ind.nl/en/required-amounts-income-requirements','official_migration',null,11,'2026-08-12')
on conflict (profile_key,link_type,url) do update set label=excluded.label,provider_type=excluded.provider_type,region_code=excluded.region_code,sort_order=excluded.sort_order,source_checked_at=excluded.source_checked_at;

delete from public.country_occupation_program_links
where profile_key in ('NL:software-developer','NL:data-analyst','NL:data-engineer','NL:cybersecurity-analyst','NL:network-administrator','NL:cloud-engineer','NL:database-administrator','NL:ict-support-technician')
  and program_ref like 'nl-program:%';

insert into public.country_occupation_program_links (profile_key,program_ref,relation_type,source_checked_at)
select
  'NL:'||poc.canonical_career_id,
  'nl-program:'||poc.programme_id::text,
  case when poc.normalized_relation_type='direct' then 'direct' else 'related' end,
  '2026-08-12'
from public.program_occupation_canonical_nl_v1 poc
join public.program_catalog_canonical_nl_v1 pc using (programme_id)
where poc.canonical_career_id in ('software-developer','data-analyst','data-engineer','cybersecurity-analyst','network-administrator','cloud-engineer','database-administrator','ict-support-technician')
  and pc.verification_tier='A'
  and pc.international_students_eligible is true
  and pc.student_sponsor_eligible is true
  and coalesce(pc.canonical_admission_state,'') <> 'closed'
on conflict (profile_key,program_ref) do update set relation_type=excluded.relation_type,source_checked_at=excluded.source_checked_at;
