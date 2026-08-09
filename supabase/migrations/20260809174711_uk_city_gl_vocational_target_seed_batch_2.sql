with rows(source_program_key, source_program_name, title, qualification_title, native_level_code, canonical_level, programme_type, field_category, duration_months, study_mode, official_program_url) as (
  values
  ('professional-cookery-nq-scqf6-2026','Professional Cookery NQ','Professional Cookery','NQ','6','BELOW_DEGREE','vocational','Professional Cookery',12,'Full-time','https://www.cityofglasgowcollege.ac.uk/courses/nq-professional-cookery-scqf-level-6-2026-08-24'),
  ('bakery-nq-scqf6-2026','Bakery NQ','Bakery','NQ','6','BELOW_DEGREE','vocational','Bakery',12,'Full-time','https://www.cityofglasgowcollege.ac.uk/courses/nq-bakery-scqf-level-6-2026-08-24'),
  ('carpentry-joinery-nq-scqf6-2026','Carpentry and Joinery NQ','Carpentry and Joinery','NQ','6','BELOW_DEGREE','vocational','Carpentry and Joinery',12,'Full-time','https://www.cityofglasgowcollege.ac.uk/courses/nq-joinerynq-carpentry-and-joinery-scqf-level-6-2026-08-24'),
  ('professional-cookery-management-hnd-scqf8-2026','Professional Cookery with Management HND','Professional Cookery with Management','HND','8','DIPLOMA_HE','vocational_higher_education','Professional Cookery and Hospitality Management',24,'Full-time','https://www.cityofglasgowcollege.ac.uk/courses/hnd-professional-cookery-with-management-scqf-level-8-2026-08-24'),
  ('built-environment-hnc-scqf7-2026','Construction Technician within the Built Environment HNC','Construction Technician within the Built Environment','HNC','7','CERTIFICATE_HE','vocational_higher_education','Built Environment and Construction Management',12,'Full-time','https://www.cityofglasgowcollege.ac.uk/courses/hnc-built-environment-scqf-level-7-2026-08-24')
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
  'City of Glasgow College', r.source_program_key, 'City of Glasgow College', null, null,
  null, null, 'unknown', r.source_program_name, r.title, r.qualification_title,
  'SCQF', r.native_level_code, r.canonical_level, r.programme_type, r.field_category,
  'Glasgow', 'City Campus', r.duration_months, r.study_mode, r.official_program_url,
  'https://scqf.org.uk/about-the-framework/interactive-framework/', date '2026-08-09',
  'official_2026_vocational_program_evidence_collected_provider_identity_pending', 'C'
from rows r
on conflict (source_name, source_program_key) do update set
  source_program_name=excluded.source_program_name, title=excluded.title,
  qualification_title=excluded.qualification_title, native_framework=excluded.native_framework,
  native_level_code=excluded.native_level_code, canonical_level=excluded.canonical_level,
  programme_type=excluded.programme_type, field_category=excluded.field_category,
  city=excluded.city, campus=excluded.campus, duration_months=excluded.duration_months,
  study_mode=excluded.study_mode, official_program_url=excluded.official_program_url,
  official_qualification_url=excluded.official_qualification_url, source_as_of=excluded.source_as_of,
  collection_status=excluded.collection_status, verification_tier=excluded.verification_tier;

with sponsor as (
  select id from public.institution_student_sponsor_uk_staging
  where source_sponsor_key='city-of-glasgow-college|glasgow|student-self-evidence'
), rows(source_program_key, admission_status, verification_status, rule_notes) as (
  values
  ('professional-cookery-nq-scqf6-2026','course_full_waiting_list_only_2026','official_2026_international_vocational_program_waiting_list_verified_cas_unverified','The course is full and waiting-list only; international applications are explicitly welcomed, but no open seat is inferred.'),
  ('bakery-nq-scqf6-2026','course_full_waiting_list_only_2026','official_2026_international_vocational_program_waiting_list_verified_cas_unverified','The course is full and waiting-list only; international applications are explicitly welcomed, but no open seat is inferred.'),
  ('carpentry-joinery-nq-scqf6-2026','course_full_waiting_list_only_2026','official_2026_international_vocational_program_waiting_list_verified_cas_unverified','The course is full and waiting-list only; international applications are explicitly welcomed, but no open seat is inferred.'),
  ('professional-cookery-management-hnd-scqf8-2026','open_apply_2026_international_students_welcome','official_2026_open_international_vocational_he_program_verified_cas_unverified','Official page provides application links for the August 2026 intake and welcomes international students.'),
  ('built-environment-hnc-scqf7-2026','open_apply_2026_international_students_welcome','official_2026_open_international_vocational_he_program_verified_cas_unverified','Official page provides Apply Now for the August 2026 intake and welcomes international students.')
)
insert into public.program_international_uk_staging (
  program_catalog_id, student_sponsor_record_id, student_sponsor_eligible,
  international_students_eligible, cas_eligibility, international_admission_status,
  visa_context, intake_label, intake_start_date, admission_source_url, international_source_url,
  sponsor_source_url, source_as_of, verification_status, rule_notes, verified_at
)
select p.id, s.id, true, true, null, r.admission_status,
  'City of Glasgow College visa guidance supports the Student Visa route and CAS after successful application. Exact programme-level CAS remains unverified.',
  '24 August 2026', date '2026-08-24', p.official_program_url, p.official_program_url,
  'https://www.cityofglasgowcollege.ac.uk/international-students/visa-requirements',
  date '2026-08-09', r.verification_status, r.rule_notes, now()
from rows r
join public.program_catalog_uk_staging p on p.source_name='City of Glasgow College' and p.source_program_key=r.source_program_key
cross join sponsor s
on conflict (program_catalog_id) do update set
  student_sponsor_record_id=excluded.student_sponsor_record_id,
  student_sponsor_eligible=excluded.student_sponsor_eligible,
  international_students_eligible=excluded.international_students_eligible,
  cas_eligibility=excluded.cas_eligibility, international_admission_status=excluded.international_admission_status,
  visa_context=excluded.visa_context, intake_label=excluded.intake_label,
  intake_start_date=excluded.intake_start_date, admission_source_url=excluded.admission_source_url,
  international_source_url=excluded.international_source_url, sponsor_source_url=excluded.sponsor_source_url,
  source_as_of=excluded.source_as_of, verification_status=excluded.verification_status,
  rule_notes=excluded.rule_notes, verified_at=excluded.verified_at;

with links(source_program_key, canonical_career_id, match_basis, relation_type, match_pattern, reviewer_note) as (
  values
  ('professional-cookery-nq-scqf6-2026','chef','official_program_career_evidence','direct_career_path','Professional Cookery NQ -> Chef','Official course page says the programme prepares learners for work as a commis chef or trainee chef.'),
  ('professional-cookery-nq-scqf6-2026','cook','official_program_career_evidence','direct_career_path','Professional Cookery NQ -> Cook','Official course page explicitly lists cook as a career outcome.'),
  ('bakery-nq-scqf6-2026','baker','official_program_career_evidence','direct_career_path','Bakery NQ -> Baker','Official course page explicitly states it prepares learners for a career as a trainee baker or baker.'),
  ('carpentry-joinery-nq-scqf6-2026','carpenter','official_program_title_and_skill_evidence','direct_career_path','Carpentry and Joinery NQ -> Carpenter','Course is an SCQF 6 practical carpentry/joinery programme covering bench joinery, site joinery, carpentry, repair and maintenance.'),
  ('professional-cookery-management-hnd-scqf8-2026','hospitality-supervisor','official_program_career_evidence','direct_career_path','Professional Cookery with Management HND -> Hospitality Supervisor','Official course includes Hospitality Supervision and states graduates can progress to supervisory or junior management roles in catering, restaurants and hospitality.'),
  ('built-environment-hnc-scqf7-2026','construction-manager','official_program_career_evidence','direct_career_path','Built Environment HNC -> Construction Manager','Official course page states the HNC provides the basics needed to enter a career as a construction manager and can progress into Construction Management HND/degree study.')
)
insert into public.program_occupation_uk_staging (
  program_catalog_id, canonical_career_id, rule_version, match_basis, match_pattern,
  review_status, relation_type, source_checked_at, reviewer_note, reviewed_at
)
select p.id, l.canonical_career_id, 'uk-phase2-v1', l.match_basis, l.match_pattern,
  'approved', l.relation_type, date '2026-08-09', l.reviewer_note, now()
from links l
join public.program_catalog_uk_staging p on p.source_name='City of Glasgow College' and p.source_program_key=l.source_program_key
on conflict (program_catalog_id, canonical_career_id) do update set
  rule_version=excluded.rule_version, match_basis=excluded.match_basis, match_pattern=excluded.match_pattern,
  review_status=excluded.review_status, relation_type=excluded.relation_type,
  source_checked_at=excluded.source_checked_at, reviewer_note=excluded.reviewer_note, reviewed_at=excluded.reviewed_at;