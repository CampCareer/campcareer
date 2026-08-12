delete from public.country_occupation_links
where profile_key in ('NL:early-childhood-teacher','NL:primary-school-teacher','NL:secondary-school-teacher','NL:special-education-teacher','NL:social-worker','NL:youth-worker','NL:community-worker','NL:counsellor');

insert into public.country_occupation_links (profile_key,link_type,label,url,provider_type,region_code,sort_order,source_checked_at) values
('NL:early-childhood-teacher','entry_program','Studiekeuze123 — Pedagogisch Educatief Professional','https://www.studiekeuze123.nl/studies/80142-pedagogisch-educatief-professional-hbo-associate-degree','official_study_information',null,1,'2026-08-12'),
('NL:early-childhood-teacher','source','UWV — Sociaal werk, jeugdzorg en kinderopvang','https://www.uwv.nl/nl/arbeidsmarktinformatie/sector/sociaal-jeugd-kinderopvang','official_labour_market',null,2,'2026-08-12'),
('NL:early-childhood-teacher','source','Rijksoverheid — Opleiding en ondersteuning medewerkers kinderopvang','https://www.rijksoverheid.nl/themas/familie-zorg-en-gezondheid/kinderopvang/opleiding-en-ondersteuning-medewerkers-kinderopvang','official_regulation',null,3,'2026-08-12'),
('NL:early-childhood-teacher','source','Rijksoverheid — Taaleis kinderopvang','https://www.rijksoverheid.nl/themas/familie-zorg-en-gezondheid/kinderopvang/taaleis-kinderopvang','official_regulation',null,4,'2026-08-12'),
('NL:primary-school-teacher','entry_program','Studiekeuze123 — Leraar Basisonderwijs (Pabo)','https://www.studiekeuze123.nl/studies/34808-lerarenopleiding-basisonderwijs-hbo-bachelor','official_study_information',null,1,'2026-08-12'),
('NL:primary-school-teacher','source','UWV — Onderwijs','https://www.uwv.nl/nl/arbeidsmarktinformatie/sector/onderwijs','official_labour_market',null,2,'2026-08-12'),
('NL:primary-school-teacher','source','UWV — Spanningsindicator Q1 2026','https://www.uwv.nl/nl/arbeidsmarktinformatie/trends-ontwikkelingen/spanningsindicator-arbeidsmarkt-koelt-verder-af','official_labour_market',null,3,'2026-08-12'),
('NL:primary-school-teacher','source','DUO — Werken als leraar met buitenlands diploma','https://duo.nl/particulier/buitenlands-diploma-in-nederland/werken-als-leraar.jsp','official_regulation',null,4,'2026-08-12'),
('NL:secondary-school-teacher','entry_program','Studiekeuze123 — Lerarenopleiding 2e graad Pedagogiek','https://www.studiekeuze123.nl/studies/35204-lerarenopleiding-2e-graad-pedagogiek-hbo-bachelor','official_study_information',null,1,'2026-08-12'),
('NL:secondary-school-teacher','source','UWV — Lerarentekorten houden aan','https://www.uwv.nl/nl/arbeidsmarktinformatie/sector/onderwijs/lerarentekorten-houden-aan','official_labour_market',null,2,'2026-08-12'),
('NL:secondary-school-teacher','source','Rijksoverheid — Leraar voortgezet onderwijs','https://www.rijksoverheid.nl/vraag-en-antwoord/werken-in-het-onderwijs/leraar-voortgezet-onderwijs','official_regulation',null,3,'2026-08-12'),
('NL:secondary-school-teacher','source','DUO — Werken als leraar met buitenlands diploma','https://duo.nl/particulier/buitenlands-diploma-in-nederland/werken-als-leraar.jsp','official_regulation',null,4,'2026-08-12'),
('NL:special-education-teacher','entry_program','Studiekeuze123 — Leraar Basisonderwijs (Pabo)','https://www.studiekeuze123.nl/studies/34808-lerarenopleiding-basisonderwijs-hbo-bachelor','official_study_information',null,1,'2026-08-12'),
('NL:special-education-teacher','source','Rijksoverheid — Leraar speciaal onderwijs','https://www.rijksoverheid.nl/vraag-en-antwoord/werken-in-het-onderwijs/leraar-speciaal-onderwijs','official_regulation',null,2,'2026-08-12'),
('NL:special-education-teacher','source','UWV — Onderwijs','https://www.uwv.nl/nl/arbeidsmarktinformatie/sector/onderwijs','official_labour_market',null,3,'2026-08-12'),
('NL:special-education-teacher','source','DUO — Werken als leraar met buitenlands diploma','https://duo.nl/particulier/buitenlands-diploma-in-nederland/werken-als-leraar.jsp','official_regulation',null,4,'2026-08-12'),
('NL:social-worker','entry_program','Studiekeuze123 — Social Work','https://www.studiekeuze123.nl/studies/34116-social-work-hbo-bachelor','official_study_information',null,1,'2026-08-12'),
('NL:social-worker','source','UWV — Kansen voor zij-instromers in sociaal werk en jeugdzorg','https://www.uwv.nl/nl/arbeidsmarktinformatie/sector/sociaal-jeugd-kinderopvang/kansen-zij-instromers-sociaal-werk-jeugdzorg','official_labour_market',null,2,'2026-08-12'),
('NL:social-worker','source','UWV — Krapte neemt nog verder toe in 32 beroepen','https://www.uwv.nl/nl/arbeidsmarktinformatie/trends-ontwikkelingen/krapte-neemt-nog-verder-toe-in-32-beroepen','official_labour_market',null,3,'2026-08-12'),
('NL:youth-worker','entry_program','Studiekeuze123 — Social Work','https://www.studiekeuze123.nl/studies/34116-social-work-hbo-bachelor','official_study_information',null,1,'2026-08-12'),
('NL:youth-worker','source','UWV — Sociaal werk, jeugdzorg en kinderopvang','https://www.uwv.nl/nl/arbeidsmarktinformatie/sector/sociaal-jeugd-kinderopvang','official_labour_market',null,2,'2026-08-12'),
('NL:youth-worker','source','Rijksoverheid — Kwaliteit jeugdhulp','https://www.rijksoverheid.nl/themas/familie-zorg-en-gezondheid/jeugdhulp/kwaliteit-jeugdhulp','official_regulation',null,3,'2026-08-12'),
('NL:youth-worker','source','SKJ — Registratie','https://skjeugd.nl/professionals/registratie/','official_regulation',null,4,'2026-08-12'),
('NL:community-worker','entry_program','Studiekeuze123 — Social Work','https://www.studiekeuze123.nl/studies/34116-social-work-hbo-bachelor','official_study_information',null,1,'2026-08-12'),
('NL:community-worker','source','UWV — Kansen voor zij-instromers in sociaal werk en jeugdzorg','https://www.uwv.nl/nl/arbeidsmarktinformatie/sector/sociaal-jeugd-kinderopvang/kansen-zij-instromers-sociaal-werk-jeugdzorg','official_labour_market',null,2,'2026-08-12'),
('NL:counsellor','entry_program','Studiekeuze123 — Toegepaste Psychologie','https://www.studiekeuze123.nl/studies/34507-toegepaste-psychologie-hbo-bachelor','official_study_information',null,1,'2026-08-12'),
('NL:counsellor','source','UWV — Krapte neemt nog verder toe in 32 beroepen','https://www.uwv.nl/nl/arbeidsmarktinformatie/trends-ontwikkelingen/krapte-neemt-nog-verder-toe-in-32-beroepen','official_labour_market',null,2,'2026-08-12'),
('NL:early-childhood-teacher','source','IND — Single Permit GVVA','https://ind.nl/en/residence-permits/work/single-permit-gvva','official_migration',null,10,'2026-08-12'),
('NL:primary-school-teacher','source','IND — Highly Skilled Migrant','https://ind.nl/en/residence-permits/work/highly-skilled-migrant','official_migration',null,10,'2026-08-12'),
('NL:secondary-school-teacher','source','IND — Highly Skilled Migrant','https://ind.nl/en/residence-permits/work/highly-skilled-migrant','official_migration',null,10,'2026-08-12'),
('NL:special-education-teacher','source','IND — Highly Skilled Migrant','https://ind.nl/en/residence-permits/work/highly-skilled-migrant','official_migration',null,10,'2026-08-12'),
('NL:social-worker','source','IND — Single Permit GVVA','https://ind.nl/en/residence-permits/work/single-permit-gvva','official_migration',null,10,'2026-08-12'),
('NL:youth-worker','source','IND — Single Permit GVVA','https://ind.nl/en/residence-permits/work/single-permit-gvva','official_migration',null,10,'2026-08-12'),
('NL:community-worker','source','IND — Single Permit GVVA','https://ind.nl/en/residence-permits/work/single-permit-gvva','official_migration',null,10,'2026-08-12'),
('NL:counsellor','source','IND — Single Permit GVVA','https://ind.nl/en/residence-permits/work/single-permit-gvva','official_migration',null,10,'2026-08-12'),
('NL:primary-school-teacher','source','IND — 2026 required income amounts','https://ind.nl/en/required-amounts-income-requirements','official_migration',null,11,'2026-08-12'),
('NL:secondary-school-teacher','source','IND — 2026 required income amounts','https://ind.nl/en/required-amounts-income-requirements','official_migration',null,11,'2026-08-12'),
('NL:special-education-teacher','source','IND — 2026 required income amounts','https://ind.nl/en/required-amounts-income-requirements','official_migration',null,11,'2026-08-12')
on conflict (profile_key,link_type,url) do update set label=excluded.label,provider_type=excluded.provider_type,region_code=excluded.region_code,sort_order=excluded.sort_order,source_checked_at=excluded.source_checked_at;

delete from public.country_occupation_program_links
where profile_key in ('NL:early-childhood-teacher','NL:primary-school-teacher','NL:secondary-school-teacher','NL:special-education-teacher','NL:social-worker','NL:youth-worker','NL:community-worker','NL:counsellor')
  and program_ref like 'nl-program:%';

insert into public.country_occupation_program_links (profile_key,program_ref,relation_type,source_checked_at)
select
  'NL:'||poc.canonical_career_id,
  'nl-program:'||poc.programme_id::text,
  case when poc.normalized_relation_type='direct' then 'direct' else 'related' end,
  '2026-08-12'
from public.program_occupation_canonical_nl_v1 poc
join public.program_catalog_canonical_nl_v1 pc using (programme_id)
where poc.canonical_career_id in ('early-childhood-teacher','primary-school-teacher','secondary-school-teacher','special-education-teacher','social-worker','youth-worker','community-worker','counsellor')
  and pc.verification_tier='A'
  and pc.international_students_eligible is true
  and pc.student_sponsor_eligible is true
  and coalesce(pc.canonical_admission_state,'') <> 'closed'
on conflict (profile_key,program_ref) do update set relation_type=excluded.relation_type,source_checked_at=excluded.source_checked_at;
