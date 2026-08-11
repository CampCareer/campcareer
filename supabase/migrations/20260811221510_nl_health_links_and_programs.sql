delete from public.country_occupation_links
where profile_key in ('NL:registered-nurse','NL:midwife','NL:care-worker','NL:physiotherapist','NL:medical-lab-tech','NL:radiographer','NL:pharmacist','NL:occupational-therapist');

insert into public.country_occupation_links (profile_key,link_type,label,url,provider_type,region_code,sort_order,source_checked_at) values
('NL:registered-nurse','entry_program','Studiekeuze123 — Verpleegkunde','https://www.studiekeuze123.nl/studies/39283-verpleegkunde-hbo-bachelor','official_study_information',null,1,'2026-08-11'),
('NL:registered-nurse','source','BIG-register — Registration','https://www.bigregister.nl/registratie','official_regulation',null,2,'2026-08-11'),
('NL:registered-nurse','source','UWV — Structureel kansrijke beroepen','https://www.uwv.nl/nl/arbeidsmarktinformatie/kansen-beroep/ruim-140-structureel-kansrijke-beroepen','official_labour_market',null,3,'2026-08-11'),
('NL:registered-nurse','source','UWV — Spanningsindicator Q1 2026','https://www.uwv.nl/nl/arbeidsmarktinformatie/trends-ontwikkelingen/spanningsindicator-arbeidsmarkt-koelt-verder-af','official_labour_market',null,4,'2026-08-11'),
('NL:midwife','entry_program','Studiekeuze123 — Verloskunde','https://www.studiekeuze123.nl/studies/34134-verloskunde-hbo-bachelor','official_study_information',null,1,'2026-08-11'),
('NL:midwife','source','BIG-register — Registration','https://www.bigregister.nl/registratie','official_regulation',null,2,'2026-08-11'),
('NL:midwife','source','UWV — Blijvende tekorten door maatschappelijke uitdagingen','https://www.uwv.nl/nl/arbeidsmarktinformatie/trends-ontwikkelingen/blijvende-tekorten-maatschappelijke-uitdagingen','official_labour_market',null,3,'2026-08-11'),
('NL:care-worker','entry_program','KiesMBO — Verzorgende IG','https://www.kiesmbo.nl/opleidingen/zorg-en-welzijn/zorg/verzorgende-ig','official_education_service',null,1,'2026-08-11'),
('NL:care-worker','source','BIG-register — Article 34 occupations','https://www.bigregister.nl/registratie/overige-beroepen','official_regulation',null,2,'2026-08-11'),
('NL:care-worker','source','UWV — Structureel kansrijke beroepen','https://www.uwv.nl/nl/arbeidsmarktinformatie/kansen-beroep/ruim-140-structureel-kansrijke-beroepen','official_labour_market',null,3,'2026-08-11'),
('NL:care-worker','source','UWV — Spanningsindicator Q1 2026','https://www.uwv.nl/nl/arbeidsmarktinformatie/trends-ontwikkelingen/spanningsindicator-arbeidsmarkt-koelt-verder-af','official_labour_market',null,4,'2026-08-11'),
('NL:physiotherapist','entry_program','Studiekeuze123 — Fysiotherapie','https://www.studiekeuze123.nl/studies/34570-opleiding-tot-fysiotherapeut-hbo-bachelor','official_study_information',null,1,'2026-08-11'),
('NL:physiotherapist','source','BIG-register — Registration','https://www.bigregister.nl/registratie','official_regulation',null,2,'2026-08-11'),
('NL:physiotherapist','source','UWV — Spanningsindicator Q1 2026','https://www.uwv.nl/nl/arbeidsmarktinformatie/trends-ontwikkelingen/spanningsindicator-arbeidsmarkt-koelt-verder-af','official_labour_market',null,3,'2026-08-11'),
('NL:physiotherapist','source','UWV — Krapte neemt verder toe','https://www.uwv.nl/nl/arbeidsmarktinformatie/trends-ontwikkelingen/krapte-neemt-nog-verder-toe-in-32-beroepen','official_labour_market',null,4,'2026-08-11'),
('NL:medical-lab-tech','entry_program','KiesMBO — Biologisch medisch analist','https://www.kiesmbo.nl/opleidingen/produceren-installeren-en-energie-techniek/procesindustrie-en-laboratoria/biologisch-medisch-analist','official_education_service',null,1,'2026-08-11'),
('NL:medical-lab-tech','source','UWV — Kansrijke beroepen op verschillende niveaus','https://www.uwv.nl/nl/nieuws/overal-kansrijke-beroepen-op-verschillende-niveaus','official_labour_market',null,2,'2026-08-11'),
('NL:radiographer','entry_program','Studiekeuze123 — Medisch Beeldvormende en Radiotherapeutische Technieken','https://www.studiekeuze123.nl/studies/34561-medisch-beeldvormende-en-radiotherapeutische-technieken-hbo-bachelor','official_study_information',null,1,'2026-08-11'),
('NL:radiographer','source','BIG-register — Article 34 occupations','https://www.bigregister.nl/registratie/overige-beroepen','official_regulation',null,2,'2026-08-11'),
('NL:radiographer','source','UWV — Kansrijke beroepen hbo/wo','https://www.uwv.nl/nl/arbeidsmarktinformatie/kansen-beroep/kansrijke-beroepen-hbo-wo','official_labour_market',null,3,'2026-08-11'),
('NL:pharmacist','entry_program','Studiekeuze123 — Farmacie','https://www.studiekeuze123.nl/studies/66157-farmacie-wo-master','official_study_information',null,1,'2026-08-11'),
('NL:pharmacist','source','BIG-register — Registration','https://www.bigregister.nl/registratie','official_regulation',null,2,'2026-08-11'),
('NL:pharmacist','source','UWV — Blijvende tekorten door maatschappelijke uitdagingen','https://www.uwv.nl/nl/arbeidsmarktinformatie/trends-ontwikkelingen/blijvende-tekorten-maatschappelijke-uitdagingen','official_labour_market',null,3,'2026-08-11'),
('NL:occupational-therapist','entry_program','Studiekeuze123 — Ergotherapie','https://www.studiekeuze123.nl/studies/34574-opleiding-voor-ergotherapie-hbo-bachelor','official_study_information',null,1,'2026-08-11'),
('NL:occupational-therapist','source','BIG-register — Article 34 occupations','https://www.bigregister.nl/registratie/overige-beroepen','official_regulation',null,2,'2026-08-11'),
('NL:occupational-therapist','source','UWV — Kansrijke beroepen hbo/wo','https://www.uwv.nl/nl/arbeidsmarktinformatie/kansen-beroep/kansrijke-beroepen-hbo-wo','official_labour_market',null,3,'2026-08-11'),
('NL:registered-nurse','source','IND — Highly Skilled Migrant','https://ind.nl/en/residence-permits/work/highly-skilled-migrant','official_migration',null,10,'2026-08-11'),
('NL:registered-nurse','source','IND — 2026 required income amounts','https://ind.nl/en/required-amounts-income-requirements','official_migration',null,11,'2026-08-11'),
('NL:midwife','source','IND — Highly Skilled Migrant','https://ind.nl/en/residence-permits/work/highly-skilled-migrant','official_migration',null,10,'2026-08-11'),
('NL:midwife','source','IND — 2026 required income amounts','https://ind.nl/en/required-amounts-income-requirements','official_migration',null,11,'2026-08-11'),
('NL:care-worker','source','IND — Single Permit GVVA','https://ind.nl/en/residence-permits/work/single-permit-gvva','official_migration',null,10,'2026-08-11'),
('NL:physiotherapist','source','IND — Highly Skilled Migrant','https://ind.nl/en/residence-permits/work/highly-skilled-migrant','official_migration',null,10,'2026-08-11'),
('NL:physiotherapist','source','IND — 2026 required income amounts','https://ind.nl/en/required-amounts-income-requirements','official_migration',null,11,'2026-08-11'),
('NL:medical-lab-tech','source','IND — Single Permit GVVA','https://ind.nl/en/residence-permits/work/single-permit-gvva','official_migration',null,10,'2026-08-11'),
('NL:radiographer','source','IND — Highly Skilled Migrant','https://ind.nl/en/residence-permits/work/highly-skilled-migrant','official_migration',null,10,'2026-08-11'),
('NL:radiographer','source','IND — 2026 required income amounts','https://ind.nl/en/required-amounts-income-requirements','official_migration',null,11,'2026-08-11'),
('NL:pharmacist','source','IND — Highly Skilled Migrant','https://ind.nl/en/residence-permits/work/highly-skilled-migrant','official_migration',null,10,'2026-08-11'),
('NL:pharmacist','source','IND — 2026 required income amounts','https://ind.nl/en/required-amounts-income-requirements','official_migration',null,11,'2026-08-11'),
('NL:occupational-therapist','source','IND — Highly Skilled Migrant','https://ind.nl/en/residence-permits/work/highly-skilled-migrant','official_migration',null,10,'2026-08-11'),
('NL:occupational-therapist','source','IND — 2026 required income amounts','https://ind.nl/en/required-amounts-income-requirements','official_migration',null,11,'2026-08-11')
on conflict (profile_key,link_type,url) do update set label=excluded.label,provider_type=excluded.provider_type,region_code=excluded.region_code,sort_order=excluded.sort_order,source_checked_at=excluded.source_checked_at;

delete from public.country_occupation_program_links
where profile_key in ('NL:registered-nurse','NL:midwife','NL:care-worker','NL:physiotherapist','NL:medical-lab-tech','NL:radiographer','NL:pharmacist','NL:occupational-therapist')
  and program_ref like 'nl-program:%';

insert into public.country_occupation_program_links (profile_key,program_ref,relation_type,source_checked_at)
select
  'NL:'||poc.canonical_career_id,
  'nl-program:'||poc.programme_id::text,
  case when poc.normalized_relation_type='direct' then 'direct' else 'related' end,
  '2026-08-11'
from public.program_occupation_canonical_nl_v1 poc
join public.program_catalog_canonical_nl_v1 pc using (programme_id)
where poc.canonical_career_id in ('registered-nurse','midwife','care-worker','physiotherapist','medical-lab-tech','radiographer','pharmacist','occupational-therapist')
  and pc.verification_tier='A'
  and pc.international_students_eligible is true
  and pc.student_sponsor_eligible is true
  and coalesce(pc.canonical_admission_state,'') <> 'closed'
on conflict (profile_key,program_ref) do update set relation_type=excluded.relation_type,source_checked_at=excluded.source_checked_at;
