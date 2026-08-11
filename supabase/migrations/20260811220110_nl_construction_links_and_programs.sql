delete from public.country_occupation_links
where profile_key in ('NL:carpenter','NL:electrician','NL:plumber','NL:wall-floor-tiler','NL:welder','NL:bricklayer','NL:hvac-technician','NL:construction-manager');

insert into public.country_occupation_links (profile_key,link_type,label,url,provider_type,region_code,sort_order,source_checked_at) values
('NL:carpenter','entry_program','KiesMBO — Timmerman','https://www.kiesmbo.nl/opleidingen/bouwen-wonen-en-interieur/bouw/timmerman','official_education_service',null,1,'2026-08-11'),
('NL:carpenter','source','UWV — Kansrijke beroepen','https://www.uwv.nl/nl/arbeidsmarktinformatie/kansen-beroep/kansrijke-beroepen','official_labour_market',null,2,'2026-08-11'),
('NL:carpenter','source','UWV — Structureel kansrijke beroepen','https://www.uwv.nl/nl/arbeidsmarktinformatie/kansen-beroep/ruim-140-structureel-kansrijke-beroepen','official_labour_market',null,3,'2026-08-11'),
('NL:electrician','entry_program','KiesMBO — Monteur elektrotechnische installaties','https://www.kiesmbo.nl/opleidingen/produceren-installeren-en-energie-techniek/technische-installaties-en-systemen/monteur-elektrotechnische-installaties','official_education_service',null,1,'2026-08-11'),
('NL:electrician','source','UWV — Kansrijke beroepen, kies techniek','https://www.uwv.nl/nl/arbeidsmarktinformatie/kansen-beroep/kansrijke-beroepen-kies-techniek','official_labour_market',null,2,'2026-08-11'),
('NL:electrician','source','UWV — Spanningsindicator Q1 2026','https://www.uwv.nl/nl/arbeidsmarktinformatie/trends-ontwikkelingen/spanningsindicator-arbeidsmarkt-koelt-verder-af','official_labour_market',null,3,'2026-08-11'),
('NL:plumber','entry_program','KiesMBO — Monteur werktuigkundige installaties','https://www.kiesmbo.nl/opleidingen/produceren-installeren-en-energie-techniek/technische-installaties-en-systemen/monteur-werktuigkundige-installaties','official_education_service',null,1,'2026-08-11'),
('NL:plumber','source','UWV — Spanningsindicator Q1 2026','https://www.uwv.nl/nl/arbeidsmarktinformatie/trends-ontwikkelingen/spanningsindicator-arbeidsmarkt-koelt-verder-af','official_labour_market',null,2,'2026-08-11'),
('NL:plumber','source','Rijksoverheid — CO-vrij gas-installation safety','https://www.rijksoverheid.nl/vraag-en-antwoord/gezond-en-veilig-wonen/hoe-voorkom-ik-koolmonoxidevergiftiging-in-mijn-huis','official_regulation',null,3,'2026-08-11'),
('NL:wall-floor-tiler','entry_program','KiesMBO — Tegelzetter','https://www.kiesmbo.nl/opleidingen/bouwen-wonen-en-interieur/gespecialiseerde-aanneming/tegelzetter','official_education_service',null,1,'2026-08-11'),
('NL:wall-floor-tiler','source','UWV — Technici voor klimaatdoelen gebouwde omgeving','https://www.uwv.nl/nl/arbeidsmarktinformatie/sector/bouw/technici-nodig-klimaatdoelen-gebouwde-omgeving','official_labour_market',null,2,'2026-08-11'),
('NL:welder','entry_program','KiesMBO — Medewerker productietechniek (welding route)','https://www.kiesmbo.nl/opleidingen/produceren-installeren-en-energie-techniek/metaal-en-metalektro/medewerker-productietechniek','official_education_service',null,1,'2026-08-11'),
('NL:welder','source','UWV — Personeelstekorten industrie','https://www.uwv.nl/nl/arbeidsmarktinformatie/sector/industrie/tekorten-aan-personeel-en-middelen','official_labour_market',null,2,'2026-08-11'),
('NL:bricklayer','entry_program','KiesMBO — Metselaar','https://www.kiesmbo.nl/opleidingen/bouwen-wonen-en-interieur/bouw/metselaar','official_education_service',null,1,'2026-08-11'),
('NL:bricklayer','source','UWV — Kansrijke beroepen 2026','https://www.uwv.nl/nl/arbeidsmarktinformatie/kansen-beroep/kansrijke-beroepen','official_labour_market',null,2,'2026-08-11'),
('NL:hvac-technician','entry_program','KiesMBO — Monteur koude- en klimaatsystemen','https://www.kiesmbo.nl/opleidingen/produceren-installeren-en-energie-techniek/technische-installaties-en-systemen/monteur-koude-en-klimaatsystemen','official_education_service',null,1,'2026-08-11'),
('NL:hvac-technician','source','UWV — Kansrijke beroepen, kies techniek','https://www.uwv.nl/nl/arbeidsmarktinformatie/kansen-beroep/kansrijke-beroepen-kies-techniek','official_labour_market',null,2,'2026-08-11'),
('NL:hvac-technician','source','IPLO — BRL 200 requirements for technicians','https://iplo.nl/thema/lucht/ozon-en-f-gassen/certificering/eisen-natuurlijke-personen-monteurs/','official_regulation',null,3,'2026-08-11'),
('NL:construction-manager','entry_program','KiesMBO — Middenkaderfunctionaris Bouw','https://www.kiesmbo.nl/opleidingen/bouwen-wonen-en-interieur/bouw/middenkaderfunctionaris-bouw','official_education_service',null,1,'2026-08-11'),
('NL:construction-manager','entry_program','Studiekeuze123 — Built Environment associate degree','https://www.studiekeuze123.nl/studies/80154-built-environment-hbo-associate-degree','official_study_information',null,2,'2026-08-11'),
('NL:construction-manager','source','UWV — Kansrijke beroepen hbo/wo','https://www.uwv.nl/nl/arbeidsmarktinformatie/kansen-beroep/kansrijke-beroepen-hbo-wo','official_labour_market',null,3,'2026-08-11'),
('NL:construction-manager','source','UWV — Krapte neemt verder toe','https://www.uwv.nl/nl/arbeidsmarktinformatie/trends-ontwikkelingen/krapte-neemt-nog-verder-toe-in-32-beroepen','official_labour_market',null,4,'2026-08-11'),
('NL:carpenter','source','IND — Single Permit GVVA','https://ind.nl/en/residence-permits/work/single-permit-gvva','official_migration',null,10,'2026-08-11'),
('NL:electrician','source','IND — Single Permit GVVA','https://ind.nl/en/residence-permits/work/single-permit-gvva','official_migration',null,10,'2026-08-11'),
('NL:plumber','source','IND — Single Permit GVVA','https://ind.nl/en/residence-permits/work/single-permit-gvva','official_migration',null,10,'2026-08-11'),
('NL:wall-floor-tiler','source','IND — Single Permit GVVA','https://ind.nl/en/residence-permits/work/single-permit-gvva','official_migration',null,10,'2026-08-11'),
('NL:welder','source','IND — Single Permit GVVA','https://ind.nl/en/residence-permits/work/single-permit-gvva','official_migration',null,10,'2026-08-11'),
('NL:bricklayer','source','IND — Single Permit GVVA','https://ind.nl/en/residence-permits/work/single-permit-gvva','official_migration',null,10,'2026-08-11'),
('NL:hvac-technician','source','IND — Single Permit GVVA','https://ind.nl/en/residence-permits/work/single-permit-gvva','official_migration',null,10,'2026-08-11'),
('NL:construction-manager','source','IND — Highly Skilled Migrant','https://ind.nl/en/residence-permits/work/highly-skilled-migrant','official_migration',null,10,'2026-08-11'),
('NL:construction-manager','source','IND — 2026 required income amounts','https://ind.nl/en/required-amounts-income-requirements','official_migration',null,11,'2026-08-11')
on conflict (profile_key,link_type,url) do update set label=excluded.label,provider_type=excluded.provider_type,region_code=excluded.region_code,sort_order=excluded.sort_order,source_checked_at=excluded.source_checked_at;

delete from public.country_occupation_program_links
where profile_key in ('NL:carpenter','NL:electrician','NL:plumber','NL:wall-floor-tiler','NL:welder','NL:bricklayer','NL:hvac-technician','NL:construction-manager')
  and program_ref like 'nl-program:%';

insert into public.country_occupation_program_links (profile_key,program_ref,relation_type,source_checked_at)
select
  'NL:'||poc.canonical_career_id,
  'nl-program:'||poc.programme_id::text,
  case when poc.normalized_relation_type='direct' then 'direct' else 'related' end,
  '2026-08-11'
from public.program_occupation_canonical_nl_v1 poc
join public.program_catalog_canonical_nl_v1 pc using (programme_id)
where poc.canonical_career_id in ('carpenter','electrician','plumber','wall-floor-tiler','welder','bricklayer','hvac-technician','construction-manager')
  and pc.verification_tier='A'
  and pc.international_students_eligible is true
  and pc.student_sponsor_eligible is true
  and coalesce(pc.canonical_admission_state,'') <> 'closed'
on conflict (profile_key,program_ref) do update set relation_type=excluded.relation_type,source_checked_at=excluded.source_checked_at;
