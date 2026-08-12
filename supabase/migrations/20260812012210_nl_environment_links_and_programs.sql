-- Netherlands Environment source/provenance and reviewed canonical programme links.
-- Source rows deliberately separate labour-market, study, regulation, policy and immigration evidence.

delete from public.country_occupation_links
where profile_key in (
  'NL:environmental-scientist','NL:agronomist','NL:farm-manager','NL:forestry-technician',
  'NL:food-technologist','NL:sustainability-specialist','NL:horticulturist','NL:animal-science-technician'
);

insert into public.country_occupation_links (
  profile_key,link_type,label,url,provider_type,region_code,sort_order,source_checked_at
) values
-- Environmental Scientist
('NL:environmental-scientist','entry_program','Studiekeuze123 — Milieukunde','https://www.studiekeuze123.nl/studies/34284-milieukunde-hbo-bachelor','official_study_information',null,1,'2026-08-12'),
('NL:environmental-scientist','entry_program','KiesMBO — Onderzoeker leefomgeving','https://www.kiesmbo.nl/opleidingen/groen/groen/onderzoeker-leefomgeving','official_vocational_information',null,2,'2026-08-12'),
('NL:environmental-scientist','source','UWV — Kansrijke beroepen hbo/wo','https://www.uwv.nl/nl/arbeidsmarktinformatie/kansen-beroep/kansrijke-beroepen-hbo-wo','official_labour_market',null,3,'2026-08-12'),
('NL:environmental-scientist','source','UWV — Beroepen voor toekomstbestendige landbouw','https://www.uwv.nl/nl/arbeidsmarktinformatie/sector/klimaat/beroepen-toekomstbestendige-landbouw','official_labour_market',null,4,'2026-08-12'),
('NL:environmental-scientist','source','Rijksoverheid — Nationale Klimaatadaptatiestrategie 2026 context','https://www.rijksoverheid.nl/actueel/nieuws/2026/05/29/volgende-stap-om-nederland-weerbaar-te-houden-bij-klimaatverandering','official_policy',null,5,'2026-08-12'),
('NL:environmental-scientist','source','ILO — ISCO-08 classification','https://isco.ilo.org/en/isco-08/','official_classification',null,6,'2026-08-12'),
('NL:environmental-scientist','source','IND — Highly Skilled Migrant','https://ind.nl/en/residence-permits/work/highly-skilled-migrant','official_migration',null,10,'2026-08-12'),
('NL:environmental-scientist','source','IND — 2026 required income amounts','https://ind.nl/en/required-amounts-income-requirements','official_migration',null,11,'2026-08-12'),

-- Agronomist
('NL:agronomist','entry_program','Studiekeuze123 — Tuinbouw en Akkerbouw','https://www.studiekeuze123.nl/studies/34868-tuinbouw-en-akkerbouw-hbo-bachelor','official_study_information',null,1,'2026-08-12'),
('NL:agronomist','source','UWV — Beroepen voor toekomstbestendige landbouw','https://www.uwv.nl/nl/arbeidsmarktinformatie/sector/klimaat/beroepen-toekomstbestendige-landbouw','official_labour_market',null,2,'2026-08-12'),
('NL:agronomist','source','UWV — Agrarisch en groen','https://www.uwv.nl/nl/arbeidsmarktinformatie/sector/agrarisch-groen','official_labour_market',null,3,'2026-08-12'),
('NL:agronomist','source','RVO — Bewijs van vakbekwaamheid chemische bestrijdingsmiddelen','https://www.rvo.nl/onderwerpen/bestrijdingsmiddelen/bewijs-van-vakbekwaamheid','official_regulation',null,4,'2026-08-12'),
('NL:agronomist','source','ILO — ISCO-08 classification','https://isco.ilo.org/en/isco-08/','official_classification',null,5,'2026-08-12'),
('NL:agronomist','source','IND — Highly Skilled Migrant','https://ind.nl/en/residence-permits/work/highly-skilled-migrant','official_migration',null,10,'2026-08-12'),
('NL:agronomist','source','IND — 2026 required income amounts','https://ind.nl/en/required-amounts-income-requirements','official_migration',null,11,'2026-08-12'),

-- Farm Manager
('NL:farm-manager','entry_program','KiesMBO — Vakexpert teelt en groene technologie','https://www.kiesmbo.nl/opleidingen/groen/groen/vakexpert-teelt-en-groene-technologie','official_vocational_information',null,1,'2026-08-12'),
('NL:farm-manager','entry_program','Studiekeuze123 — Tuinbouw en Akkerbouw','https://www.studiekeuze123.nl/studies/34868-tuinbouw-en-akkerbouw-hbo-bachelor','official_study_information',null,2,'2026-08-12'),
('NL:farm-manager','source','UWV — Agrarisch en groen','https://www.uwv.nl/nl/arbeidsmarktinformatie/sector/agrarisch-groen','official_labour_market',null,3,'2026-08-12'),
('NL:farm-manager','source','UWV — Technologie verandert agrarisch en groen','https://www.uwv.nl/nl/arbeidsmarktinformatie/sector/agrarisch-groen/technologie-verandert-werk','official_labour_market',null,4,'2026-08-12'),
('NL:farm-manager','source','RVO — Bewijs van vakbekwaamheid chemische bestrijdingsmiddelen','https://www.rvo.nl/onderwerpen/bestrijdingsmiddelen/bewijs-van-vakbekwaamheid','official_regulation',null,5,'2026-08-12'),
('NL:farm-manager','source','ILO — ISCO-08 classification','https://isco.ilo.org/en/isco-08/','official_classification',null,6,'2026-08-12'),
('NL:farm-manager','source','IND — Single Permit GVVA','https://ind.nl/en/residence-permits/work/single-permit-gvva','official_migration',null,10,'2026-08-12'),

-- Forestry Technician
('NL:forestry-technician','entry_program','KiesMBO — Opzichter/uitvoerder groene ruimte','https://www.kiesmbo.nl/opleidingen/groen/groen/opzichteruitvoerder-groene-ruimte','official_vocational_information',null,1,'2026-08-12'),
('NL:forestry-technician','entry_program','KiesMBO — Beheerder/uitvoerder natuur, water en natuurrecreatie','https://www.kiesmbo.nl/opleidingen/groen/groen/beheerderuitvoerder-natuur-water-en-natuurrecreatie','official_vocational_information',null,2,'2026-08-12'),
('NL:forestry-technician','entry_program','Studiekeuze123 — Bos- en Natuurbeheer','https://www.studiekeuze123.nl/studies/34221-bos-en-natuurbeheer-hbo-bachelor','official_study_information',null,3,'2026-08-12'),
('NL:forestry-technician','source','UWV — Beroepen voor toekomstbestendige landbouw','https://www.uwv.nl/nl/arbeidsmarktinformatie/sector/klimaat/beroepen-toekomstbestendige-landbouw','official_labour_market',null,4,'2026-08-12'),
('NL:forestry-technician','source','ILO — ISCO-08 classification','https://isco.ilo.org/en/isco-08/','official_classification',null,5,'2026-08-12'),
('NL:forestry-technician','source','IND — Single Permit GVVA','https://ind.nl/en/residence-permits/work/single-permit-gvva','official_migration',null,10,'2026-08-12'),

-- Food Technologist
('NL:food-technologist','entry_program','Studiekeuze123 — Voedingsmiddelentechnologie','https://www.studiekeuze123.nl/studies/34856-voedingsmiddelentechnologie-hbo-bachelor','official_study_information',null,1,'2026-08-12'),
('NL:food-technologist','entry_program','KiesMBO — Vakexpert voeding, technologie en techniek','https://www.kiesmbo.nl/opleidingen/groen/voeding/vakexpert-voeding-technologie-en-techniek','official_vocational_information',null,2,'2026-08-12'),
('NL:food-technologist','source','UWV — Industrie','https://www.uwv.nl/nl/arbeidsmarktinformatie/sector/industrie','official_labour_market',null,3,'2026-08-12'),
('NL:food-technologist','source','NVWA — HACCP','https://www.nvwa.nl/onderwerpen/voedselveiligheid/haccp','official_regulation',null,4,'2026-08-12'),
('NL:food-technologist','source','NVWA — Voedselveiligheid Jaarplan 2026','https://www.nvwa.nl/over-de-nvwa/publicaties/jaarplan-2026/publieke-belangen/voedselveiligheid','official_regulation',null,5,'2026-08-12'),
('NL:food-technologist','source','NVWA — Registratie en erkenning levensmiddelenbedrijven','https://www.nvwa.nl/onderwerpen/voedselveiligheid/levensmiddelen-produceren-en-verhandelen/registratie-en-erkenning','official_regulation',null,6,'2026-08-12'),
('NL:food-technologist','source','ILO — ISCO-08 classification','https://isco.ilo.org/en/isco-08/','official_classification',null,7,'2026-08-12'),
('NL:food-technologist','source','IND — Highly Skilled Migrant','https://ind.nl/en/residence-permits/work/highly-skilled-migrant','official_migration',null,10,'2026-08-12'),
('NL:food-technologist','source','IND — 2026 required income amounts','https://ind.nl/en/required-amounts-income-requirements','official_migration',null,11,'2026-08-12'),

-- Sustainability Specialist
('NL:sustainability-specialist','entry_program','Studiekeuze123 — Milieukunde','https://www.studiekeuze123.nl/studies/34284-milieukunde-hbo-bachelor','official_study_information',null,1,'2026-08-12'),
('NL:sustainability-specialist','source','UWV — Kansrijke beroepen hbo/wo','https://www.uwv.nl/nl/arbeidsmarktinformatie/kansen-beroep/kansrijke-beroepen-hbo-wo','official_labour_market',null,2,'2026-08-12'),
('NL:sustainability-specialist','source','RVO — Corporate Sustainability Reporting Directive','https://www.rvo.nl/onderwerpen/csrd','official_policy',null,3,'2026-08-12'),
('NL:sustainability-specialist','source','RVO — ESRS Navigator','https://www.rvo.nl/onderwerpen/csrd-tool-esrs-navigator','official_policy',null,4,'2026-08-12'),
('NL:sustainability-specialist','source','Rijksoverheid — Duurzame energie','https://www.rijksoverheid.nl/themas/klimaat-milieu-en-natuur/duurzame-energie','official_policy',null,5,'2026-08-12'),
('NL:sustainability-specialist','source','Rijksoverheid — Duurzame economie','https://www.rijksoverheid.nl/themas/klimaat-milieu-en-natuur/duurzame-economie','official_policy',null,6,'2026-08-12'),
('NL:sustainability-specialist','source','IND — Highly Skilled Migrant','https://ind.nl/en/residence-permits/work/highly-skilled-migrant','official_migration',null,10,'2026-08-12'),
('NL:sustainability-specialist','source','IND — 2026 required income amounts','https://ind.nl/en/required-amounts-income-requirements','official_migration',null,11,'2026-08-12'),

-- Horticulturist
('NL:horticulturist','entry_program','KiesMBO — Vakexpert teelt en groene technologie','https://www.kiesmbo.nl/opleidingen/groen/groen/vakexpert-teelt-en-groene-technologie','official_vocational_information',null,1,'2026-08-12'),
('NL:horticulturist','entry_program','Studiekeuze123 — Tuinbouw en Akkerbouw','https://www.studiekeuze123.nl/studies/34868-tuinbouw-en-akkerbouw-hbo-bachelor','official_study_information',null,2,'2026-08-12'),
('NL:horticulturist','source','UWV — Kansen in agrarische en groene sector','https://www.uwv.nl/nl/arbeidsmarktinformatie/sector/agrarisch-groen/veel-kansen-werkzoekenden','official_labour_market',null,3,'2026-08-12'),
('NL:horticulturist','source','UWV — Technologie verandert agrarisch en groen','https://www.uwv.nl/nl/arbeidsmarktinformatie/sector/agrarisch-groen/technologie-verandert-werk','official_labour_market',null,4,'2026-08-12'),
('NL:horticulturist','source','UWV — Beroepen voor toekomstbestendige landbouw','https://www.uwv.nl/nl/arbeidsmarktinformatie/sector/klimaat/beroepen-toekomstbestendige-landbouw','official_labour_market',null,5,'2026-08-12'),
('NL:horticulturist','source','RVO — Bewijs van vakbekwaamheid chemische bestrijdingsmiddelen','https://www.rvo.nl/onderwerpen/bestrijdingsmiddelen/bewijs-van-vakbekwaamheid','official_regulation',null,6,'2026-08-12'),
('NL:horticulturist','source','ILO — ISCO-08 classification','https://isco.ilo.org/en/isco-08/','official_classification',null,7,'2026-08-12'),
('NL:horticulturist','source','IND — Single Permit GVVA','https://ind.nl/en/residence-permits/work/single-permit-gvva','official_migration',null,10,'2026-08-12'),

-- Animal Science Technician
('NL:animal-science-technician','entry_program','KiesMBO — Proefdierverzorger','https://www.kiesmbo.nl/opleidingen/groen/dieren/proefdierverzorger','official_vocational_information',null,1,'2026-08-12'),
('NL:animal-science-technician','source','NVWA — Eisen voor instellingen die dierproeven doen of proefdieren fokken','https://www.nvwa.nl/onderwerpen/dier/dierproeven-voor-onderzoek/eisen-voor-instellingen-die-dierproeven-doen-of-proefdieren-fokken','official_regulation',null,2,'2026-08-12'),
('NL:animal-science-technician','source','NVWA — Inspectieresultaten dierproeven en proefdieren 2025','https://www.nvwa.nl/onderwerpen/dier/dierproeven-voor-onderzoek/inspectieresultaten/2025','official_regulation',null,3,'2026-08-12'),
('NL:animal-science-technician','source','NVWA — Bevoegdheden diergeneeskundigen','https://www.nvwa.nl/onderwerpen/dier/dieren-onderzoeken-en-behandelen/bevoegdheden-diergeneeskundige','official_regulation',null,4,'2026-08-12'),
('NL:animal-science-technician','source','Rijksoverheid — Regels dierproeven','https://www.rijksoverheid.nl/themas/klimaat-milieu-en-natuur/dierproeven/regels-dierproeven','official_regulation',null,5,'2026-08-12'),
('NL:animal-science-technician','source','ILO — ISCO-08 classification','https://isco.ilo.org/en/isco-08/','official_classification',null,6,'2026-08-12'),
('NL:animal-science-technician','source','IND — Single Permit GVVA','https://ind.nl/en/residence-permits/work/single-permit-gvva','official_migration',null,10,'2026-08-12')
on conflict (profile_key,link_type,url) do update set
  label=excluded.label,
  provider_type=excluded.provider_type,
  region_code=excluded.region_code,
  sort_order=excluded.sort_order,
  source_checked_at=excluded.source_checked_at;

-- Rebuild only canonical NL programme refs for this cohort.
delete from public.country_occupation_program_links
where profile_key in (
  'NL:environmental-scientist','NL:agronomist','NL:farm-manager','NL:forestry-technician',
  'NL:food-technologist','NL:sustainability-specialist','NL:horticulturist','NL:animal-science-technician'
)
  and program_ref like 'nl-program:%';

insert into public.country_occupation_program_links (profile_key,program_ref,relation_type,source_checked_at)
select
  'NL:'||poc.canonical_career_id,
  'nl-program:'||poc.programme_id::text,
  case when poc.normalized_relation_type='direct' then 'direct' else 'related' end,
  '2026-08-12'
from public.program_occupation_canonical_nl_v1 poc
join public.program_catalog_canonical_nl_v1 pc using (programme_id)
where poc.canonical_career_id in (
  'environmental-scientist','agronomist','farm-manager','forestry-technician',
  'food-technologist','sustainability-specialist','horticulturist','animal-science-technician'
)
  and pc.verification_tier='A'
  and pc.international_students_eligible is true
  and pc.student_sponsor_eligible is true
  and coalesce(pc.canonical_admission_state,'') <> 'closed'
on conflict (profile_key,program_ref) do update set
  relation_type=excluded.relation_type,
  source_checked_at=excluded.source_checked_at;
