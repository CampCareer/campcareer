with city_st_georges as (
  select institution_id, ukprn
  from public.institution_identity_uk_v1
  where canonical_name = 'City St George''s, University of London'
), rows(source_program_key, source_program_name, title, qualification_title, native_level_code, canonical_level, field_category, campus, duration_months, study_mode, official_program_url, admission_status, verification_status, rule_notes) as (
  values
  ('midwifery-bmid-hons','Midwifery','Midwifery','BMid (Hons)','6','BACHELOR','Midwifery','Clerkenwell campus',36,'Full-time','https://www.citystgeorges.ac.uk/prospective-students/courses/undergraduate/midwifery','open_through_clearing_2026','official_2026_clearing_and_international_entry_evidence_verified_cas_unverified','Official 2026/27 page states Clearing is available where places remain, September 2026 start, international entry guidance and international tuition. CAS remains programme-level unverified.'),
  ('diagnostic-radiography-bsc-hons','Diagnostic Radiography','Diagnostic Radiography','BSc (Hons)','6','BACHELOR','Diagnostic Radiography','Clerkenwell or Tooting campus',36,'Full-time','https://www.citystgeorges.ac.uk/prospective-students/courses/undergraduate/radiography-diagnostic-imaging','late_application_discretionary_after_ucas_deadline','official_2026_program_and_international_entry_evidence_verified_cas_unverified','Official 2026/27 page states international tuition and qualifications. Applications after the main UCAS deadline are considered at the University''s discretion; exact current availability is not inferred.'),
  ('therapeutic-radiography-bsc-hons','Therapeutic Radiography','Therapeutic Radiography and Oncology','BSc (Hons)','6','BACHELOR','Therapeutic Radiography','Clerkenwell or Tooting campus',36,'Full-time','https://www.citystgeorges.ac.uk/prospective-students/courses/undergraduate/therapeutic-radiography','open_through_clearing_2026','official_2026_clearing_and_international_entry_evidence_verified_cas_unverified','Official 2026/27 page exposes Clearing links for the programme and international entry guidance. CAS remains programme-level unverified.'),
  ('occupational-therapy-bsc-hons','Occupational Therapy','Occupational Therapy','BSc (Hons)','6','BACHELOR','Occupational Therapy','Tooting campus',36,'Full-time','https://www.citystgeorges.ac.uk/prospective-students/courses/undergraduate/occupational-therapy','open_through_clearing_2026','official_2026_clearing_and_international_entry_evidence_verified_cas_unverified','Official 2026/27 page states the course is open through Clearing, gives international tuition and international qualification guidance, and leads to professional occupational therapy practice.'),
  ('physiotherapy-bsc-hons','Physiotherapy','Physiotherapy','BSc (Hons)','6','BACHELOR','Physiotherapy','Tooting campus',36,'Full-time','https://www.citystgeorges.ac.uk/prospective-students/courses/undergraduate/physiotherapy/2026','current_2026_apply_route_visible_exact_window_not_yet_verified','official_2026_program_and_international_entry_evidence_verified_cas_unverified','Official 2026/27 page has a current Apply control, international qualification guidance and international tuition. Exact current admissions window is not promoted beyond the visible apply route.')
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
  'City St George''s, University of London', r.source_program_key,
  'City St George''s, University of London', c.institution_id, c.ukprn,
  c.institution_id, c.institution_id, 'direct_award',
  r.source_program_name, r.title, r.qualification_title, 'FHEQ', r.native_level_code,
  r.canonical_level, 'degree', r.field_category, 'London', r.campus, r.duration_months,
  r.study_mode, r.official_program_url,
  'https://www.gov.uk/what-different-qualification-levels-mean/list-of-qualification-levels',
  date '2026-08-09', 'official_2026_program_evidence_collected', 'C'
from rows r cross join city_st_georges c
on conflict (source_name, source_program_key) do update set
  institution_id=excluded.institution_id,
  ukprn=excluded.ukprn,
  awarding_institution_id=excluded.awarding_institution_id,
  delivery_institution_id=excluded.delivery_institution_id,
  provider_relationship=excluded.provider_relationship,
  source_program_name=excluded.source_program_name,
  title=excluded.title,
  qualification_title=excluded.qualification_title,
  native_framework=excluded.native_framework,
  native_level_code=excluded.native_level_code,
  canonical_level=excluded.canonical_level,
  field_category=excluded.field_category,
  city=excluded.city,
  campus=excluded.campus,
  duration_months=excluded.duration_months,
  study_mode=excluded.study_mode,
  official_program_url=excluded.official_program_url,
  official_qualification_url=excluded.official_qualification_url,
  source_as_of=excluded.source_as_of,
  collection_status=excluded.collection_status,
  verification_tier=excluded.verification_tier;

with sponsor as (
  select id
  from public.institution_student_sponsor_uk_staging
  where source_sponsor_key='city-st-georges-university-of-london|london|student'
    and match_status='matched'
), rows(source_program_key, admission_status, verification_status, rule_notes) as (
  values
  ('midwifery-bmid-hons','open_through_clearing_2026','official_2026_clearing_and_international_entry_evidence_verified_cas_unverified','Official 2026/27 page states Clearing is available where places remain, with international entry guidance and fees. CAS is not inferred from sponsor status.'),
  ('diagnostic-radiography-bsc-hons','late_application_discretionary_after_ucas_deadline','official_2026_program_and_international_entry_evidence_verified_cas_unverified','Official page states applications after the main UCAS deadline are considered at City St George''s discretion; exact current vacancy status is not inferred.'),
  ('therapeutic-radiography-bsc-hons','open_through_clearing_2026','official_2026_clearing_and_international_entry_evidence_verified_cas_unverified','Official 2026/27 page exposes Clearing for the programme and international entry guidance. CAS remains unverified.'),
  ('occupational-therapy-bsc-hons','open_through_clearing_2026','official_2026_clearing_and_international_entry_evidence_verified_cas_unverified','Official 2026/27 page states applications are open through Clearing and shows international fees and qualifications. CAS remains unverified.'),
  ('physiotherapy-bsc-hons','current_2026_apply_route_visible_exact_window_not_yet_verified','official_2026_program_and_international_entry_evidence_verified_cas_unverified','Official 2026/27 page has Apply now plus international qualifications and fees; exact current admission window is not inferred.')
)
insert into public.program_international_uk_staging (
  program_catalog_id, student_sponsor_record_id, student_sponsor_eligible,
  international_students_eligible, cas_eligibility, international_admission_status,
  visa_context, intake_label, admission_source_url, international_source_url,
  sponsor_source_url, source_as_of, verification_status, rule_notes, verified_at
)
select
  p.id, s.id, true, true, null, r.admission_status,
  'City St George''s is listed on the 2026-08-07 UKVI Student sponsor register as a Student Sponsor - Track Record. Programme-level CAS issuance remains unverified.',
  'September 2026', p.official_program_url, p.official_program_url,
  'https://www.gov.uk/government/publications/register-of-licensed-sponsors-students',
  date '2026-08-09', r.verification_status, r.rule_notes, now()
from rows r
join public.program_catalog_uk_staging p
  on p.source_name='City St George''s, University of London' and p.source_program_key=r.source_program_key
cross join sponsor s
on conflict (program_catalog_id) do update set
  student_sponsor_record_id=excluded.student_sponsor_record_id,
  student_sponsor_eligible=excluded.student_sponsor_eligible,
  international_students_eligible=excluded.international_students_eligible,
  cas_eligibility=excluded.cas_eligibility,
  international_admission_status=excluded.international_admission_status,
  visa_context=excluded.visa_context,
  intake_label=excluded.intake_label,
  admission_source_url=excluded.admission_source_url,
  international_source_url=excluded.international_source_url,
  sponsor_source_url=excluded.sponsor_source_url,
  source_as_of=excluded.source_as_of,
  verification_status=excluded.verification_status,
  rule_notes=excluded.rule_notes,
  verified_at=excluded.verified_at;

with links(source_program_key, canonical_career_id, match_basis, relation_type, match_pattern, reviewer_note) as (
  values
  ('midwifery-bmid-hons','midwife','official_program_title_and_professional_evidence','professional_registration_pathway','Midwifery BMid -> Midwife','Official course page states graduates are qualified to practise as a midwife and the programme is built around professional midwifery practice.'),
  ('diagnostic-radiography-bsc-hons','radiographer','official_program_title_and_professional_evidence','professional_registration_pathway','Diagnostic Radiography BSc -> Radiographer','Official course page states graduates qualify to practise as Diagnostic Radiographers and are eligible to apply for HCPC registration.'),
  ('therapeutic-radiography-bsc-hons','radiographer','official_program_title_and_professional_evidence','professional_registration_pathway','Therapeutic Radiography BSc -> Radiographer','Official course page directly trains therapeutic radiographers for radiotherapy practice.'),
  ('occupational-therapy-bsc-hons','occupational-therapist','official_program_title_and_professional_evidence','professional_registration_pathway','Occupational Therapy BSc -> Occupational Therapist','Programme title and professional practice curriculum directly match occupational therapy.'),
  ('physiotherapy-bsc-hons','physiotherapist','official_program_title_and_professional_evidence','professional_registration_pathway','Physiotherapy BSc -> Physiotherapist','Official course page states graduates are eligible to apply for HCPC registration and Chartered Society of Physiotherapy membership.')
)
insert into public.program_occupation_uk_staging (
  program_catalog_id, canonical_career_id, rule_version, match_basis, match_pattern,
  review_status, relation_type, source_checked_at, reviewer_note, reviewed_at
)
select
  p.id, l.canonical_career_id, 'uk-phase2-v1', l.match_basis, l.match_pattern,
  'approved', l.relation_type, date '2026-08-09', l.reviewer_note, now()
from links l
join public.program_catalog_uk_staging p
  on p.source_name='City St George''s, University of London' and p.source_program_key=l.source_program_key
on conflict (program_catalog_id, canonical_career_id) do update set
  rule_version=excluded.rule_version,
  match_basis=excluded.match_basis,
  match_pattern=excluded.match_pattern,
  review_status=excluded.review_status,
  relation_type=excluded.relation_type,
  source_checked_at=excluded.source_checked_at,
  reviewer_note=excluded.reviewer_note,
  reviewed_at=excluded.reviewed_at;