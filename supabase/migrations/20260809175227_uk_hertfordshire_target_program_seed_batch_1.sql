with herts as (
  select institution_id, ukprn from public.institution_identity_uk_v1 where slug='university-of-hertfordshire'
)
insert into public.institution_student_sponsor_uk_staging (
  source_name, source_sponsor_key, sponsor_name, town_city, sponsor_type, sponsor_status, route,
  immigration_compliance, institution_id, ukprn, match_status, match_basis, source_url, source_as_of
)
select
  'University of Hertfordshire student visa guidance',
  'university-of-hertfordshire|hatfield|student-self-evidence',
  'University of Hertfordshire','Hatfield','Higher Education Institution (HEI)','Student Sponsor licence','Student',
  'institution_official_student_sponsor_licence_and_cas_guidance', h.institution_id, h.ukprn,
  'matched','official_institution_statement_plus_ukprn_identity',
  'https://ask.herts.ac.uk/student-visa-responsibilities', date '2026-08-09'
from herts h
on conflict (source_name, source_sponsor_key) do update set
  sponsor_name=excluded.sponsor_name, town_city=excluded.town_city, sponsor_type=excluded.sponsor_type,
  sponsor_status=excluded.sponsor_status, route=excluded.route,
  immigration_compliance=excluded.immigration_compliance, institution_id=excluded.institution_id,
  ukprn=excluded.ukprn, match_status=excluded.match_status, match_basis=excluded.match_basis,
  source_url=excluded.source_url, source_as_of=excluded.source_as_of;

with herts as (
  select institution_id, ukprn from public.institution_identity_uk_v1 where slug='university-of-hertfordshire'
), rows(source_program_key, source_program_name, title, qualification_title, canonical_level, field_category, campus, duration_months, official_program_url) as (
  values
  ('graphic-design-ba-hons-2026','Graphic Design','Graphic Design','BA (Hons)','BACHELOR','Graphic Design','College Lane Campus',36,'https://www.herts.ac.uk/courses/undergraduate/graphic-design'),
  ('interior-architecture-design-ba-hons-2026','Interior Architecture and Design','Interior Architecture and Design','BA (Hons)','BACHELOR','Interior Design','College Lane Campus',36,'https://www.herts.ac.uk/courses/undergraduate/ba-hons-interior-architecture-and-design'),
  ('three-d-animation-visual-effects-ba-hons-2027','3D Animation and Visual Effects','3D Animation and Visual Effects','BA (Hons)','BACHELOR','Animation and Visual Effects','College Lane Campus',36,'https://www.herts.ac.uk/courses/undergraduate/ba-hons-3d-animation-and-visual-effects'),
  ('digital-marketing-msc-2026','Digital Marketing','Digital Marketing','MSc','MASTER','Digital Marketing','de Havilland Campus',12,'https://www.herts.ac.uk/courses/postgraduate-masters/msc-digital-marketing'),
  ('human-resource-management-ma-2026','Human Resource Management','Human Resource Management','MA','MASTER','Human Resource Management','de Havilland Campus',12,'https://www.herts.ac.uk/courses/postgraduate-masters/human-resource-management')
)
insert into public.program_catalog_uk_staging (
  source_name, source_program_key, institution_name, institution_id, ukprn,
  awarding_institution_id, delivery_institution_id, provider_relationship,
  source_program_name, title, qualification_title, native_framework, native_level_code,
  canonical_level, programme_type, field_category, city, campus, duration_months,
  study_mode, official_program_url, official_qualification_url, source_as_of,
  collection_status, verification_tier
)
select
  'University of Hertfordshire', r.source_program_key, 'University of Hertfordshire', h.institution_id, h.ukprn,
  h.institution_id, h.institution_id, 'direct_award', r.source_program_name, r.title, r.qualification_title,
  'FHEQ', case when r.canonical_level='MASTER' then '7' else '6' end,
  r.canonical_level, 'degree', r.field_category, 'Hatfield', r.campus, r.duration_months,
  'Full-time', r.official_program_url,
  'https://www.gov.uk/what-different-qualification-levels-mean/list-of-qualification-levels',
  date '2026-08-09', 'official_current_or_next_cycle_program_evidence_collected', 'C'
from rows r cross join herts h
on conflict (source_name, source_program_key) do update set
  institution_id=excluded.institution_id, ukprn=excluded.ukprn,
  awarding_institution_id=excluded.awarding_institution_id, delivery_institution_id=excluded.delivery_institution_id,
  provider_relationship=excluded.provider_relationship, source_program_name=excluded.source_program_name,
  title=excluded.title, qualification_title=excluded.qualification_title,
  native_framework=excluded.native_framework, native_level_code=excluded.native_level_code,
  canonical_level=excluded.canonical_level, programme_type=excluded.programme_type,
  field_category=excluded.field_category, city=excluded.city, campus=excluded.campus,
  duration_months=excluded.duration_months, study_mode=excluded.study_mode,
  official_program_url=excluded.official_program_url, official_qualification_url=excluded.official_qualification_url,
  source_as_of=excluded.source_as_of, collection_status=excluded.collection_status,
  verification_tier=excluded.verification_tier;

with sponsor as (
  select id from public.institution_student_sponsor_uk_staging
  where source_sponsor_key='university-of-hertfordshire|hatfield|student-self-evidence' and match_status='matched'
), rows(source_program_key, intake_label, intake_start_date, admission_status, verification_status, rule_notes) as (
  values
  ('graphic-design-ba-hons-2026','September 2026',date '2026-09-29','open_2026_international_portal_and_clearing_visible','official_2026_international_application_and_clearing_evidence_verified_cas_unverified','Official course page says international applications are open, publishes a 2026 start, and exposes the international portal and Clearing.'),
  ('interior-architecture-design-ba-hons-2026','September 2026',date '2026-09-25','open_2026_international_portal_and_clearing_visible','official_2026_international_application_and_clearing_evidence_verified_cas_unverified','Official course page publishes 2026 entry and international application access, with current Clearing messaging.'),
  ('three-d-animation-visual-effects-ba-hons-2027','September 2027',date '2027-09-20','next_cycle_2027_international_application_path_visible','official_next_cycle_international_application_evidence_verified_cas_unverified','Official course page has international applications open and a published 2027 first-year start. The programme is not promoted as a 2026 intake.'),
  ('digital-marketing-msc-2026','September 2026',date '2026-09-21','open_2026_international_application_portal_visible','official_2026_international_application_evidence_verified_cas_unverified','Official MSc page publishes September 2026 full-time entry and an international application portal.'),
  ('human-resource-management-ma-2026','September 2026',date '2026-09-25','open_2026_international_application_portal_visible','official_2026_international_application_evidence_verified_cas_unverified','Official MA page states applications are open to international students and publishes September 2026 full-time entry.')
)
insert into public.program_international_uk_staging (
  program_catalog_id, student_sponsor_record_id, student_sponsor_eligible,
  international_students_eligible, cas_eligibility, international_admission_status,
  visa_context, intake_label, intake_start_date, admission_source_url, international_source_url,
  sponsor_source_url, source_as_of, verification_status, rule_notes, verified_at
)
select p.id, s.id, true, true, null, r.admission_status,
  'University of Hertfordshire states it holds a Student Sponsor licence and issues CAS to eligible applicants after offer conditions and required checks. CAS remains null at programme level until exact issuance evidence is established.',
  r.intake_label, r.intake_start_date, p.official_program_url, p.official_program_url,
  'https://www.herts.ac.uk/international/coming-to-the-uk/visa-application/student-visa',
  date '2026-08-09', r.verification_status, r.rule_notes, now()
from rows r
join public.program_catalog_uk_staging p on p.source_name='University of Hertfordshire' and p.source_program_key=r.source_program_key
cross join sponsor s
on conflict (program_catalog_id) do update set
  student_sponsor_record_id=excluded.student_sponsor_record_id,
  student_sponsor_eligible=excluded.student_sponsor_eligible,
  international_students_eligible=excluded.international_students_eligible,
  cas_eligibility=excluded.cas_eligibility, international_admission_status=excluded.international_admission_status,
  visa_context=excluded.visa_context, intake_label=excluded.intake_label, intake_start_date=excluded.intake_start_date,
  admission_source_url=excluded.admission_source_url, international_source_url=excluded.international_source_url,
  sponsor_source_url=excluded.sponsor_source_url, source_as_of=excluded.source_as_of,
  verification_status=excluded.verification_status, rule_notes=excluded.rule_notes, verified_at=excluded.verified_at;

with links(source_program_key, canonical_career_id, match_basis, relation_type, match_pattern, reviewer_note) as (
  values
  ('graphic-design-ba-hons-2026','graphic-designer','official_program_title_and_career_evidence','direct_career_path','Graphic Design BA -> Graphic Designer','The degree is explicitly Graphic Design, uses professional design practice and positions graduates for graphic-design careers.'),
  ('interior-architecture-design-ba-hons-2026','interior-designer','official_program_title_and_professional_evidence','direct_career_path','Interior Architecture and Design BA -> Interior Designer','The programme specialises in designing interior spaces and states graduates are eligible for associate membership of British interior-design professional bodies.'),
  ('three-d-animation-visual-effects-ba-hons-2027','animator','official_program_title_and_career_evidence','direct_career_path','3D Animation and Visual Effects BA -> Animator','The programme is explicitly 3D Animation and Visual Effects and describes itself as training animators for film, television and related production.'),
  ('digital-marketing-msc-2026','marketing-specialist','official_program_title_and_discipline_evidence','direct_discipline','Digital Marketing MSc -> Marketing Specialist','The specialist MSc develops advanced digital marketing strategy, campaign, analytics and communications skills for professional marketing roles.'),
  ('human-resource-management-ma-2026','human-resources-specialist','official_program_career_evidence','direct_career_path','Human Resource Management MA -> Human Resources Specialist','The CIPD-accredited MA explicitly prepares graduates for HRM practitioner and specialist consultant roles including recruitment specialist and HR manager.')
)
insert into public.program_occupation_uk_staging (
  program_catalog_id, canonical_career_id, rule_version, match_basis, match_pattern,
  review_status, relation_type, source_checked_at, reviewer_note, reviewed_at
)
select p.id, l.canonical_career_id, 'uk-phase2-v1', l.match_basis, l.match_pattern,
  'approved', l.relation_type, date '2026-08-09', l.reviewer_note, now()
from links l
join public.program_catalog_uk_staging p on p.source_name='University of Hertfordshire' and p.source_program_key=l.source_program_key
on conflict (program_catalog_id, canonical_career_id) do update set
  rule_version=excluded.rule_version, match_basis=excluded.match_basis, match_pattern=excluded.match_pattern,
  review_status=excluded.review_status, relation_type=excluded.relation_type,
  source_checked_at=excluded.source_checked_at, reviewer_note=excluded.reviewer_note, reviewed_at=excluded.reviewed_at;