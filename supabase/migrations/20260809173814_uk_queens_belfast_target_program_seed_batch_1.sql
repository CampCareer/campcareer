with queens as (
  select institution_id, ukprn
  from public.institution_identity_uk_v1
  where slug='queen-s-university-belfast'
), rows(source_program_key, source_program_name, title, qualification_title, native_level_code, canonical_level, field_category, duration_months, study_mode, official_program_url) as (
  values
  ('social-work-bsw-l500','Social Work','Social Work','BSW','6','BACHELOR','Social Work',36,'Full-time','https://www.qub.ac.uk/courses/undergraduate/2026/social-work-bsw-l500/'),
  ('media-broadcast-production-ba-p310','Media and Broadcast Production','Media and Broadcast Production','BA','6','BACHELOR','Media Production',36,'Full-time','https://www.qub.ac.uk/courses/undergraduate/2026/media-broadcast-production-ba-p310/'),
  ('software-engineering-meng-g602','Software Engineering','Software Engineering','MEng','7','INTEGRATED_MASTER','Software Engineering',48,'Full-time','https://www.qub.ac.uk/courses/undergraduate/2026/software-engineering-meng-g602/'),
  ('midwifery-bsc-b720','Midwifery','Midwifery','BSc','6','BACHELOR','Midwifery',36,'Full-time','https://www.qub.ac.uk/courses/undergraduate/2026/midwifery-bsc-b720/'),
  ('pharmacy-mpharm-b230','Pharmacy','Pharmacy','MPharm','7','INTEGRATED_MASTER','Pharmacy',48,'Full-time','https://www.qub.ac.uk/courses/undergraduate/2026/pharmacy-mpharm-b230/')
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
  'Queen''s University Belfast', r.source_program_key, 'Queen''s University Belfast', q.institution_id, q.ukprn,
  q.institution_id, q.institution_id, 'direct_award',
  r.source_program_name, r.title, r.qualification_title, 'FHEQ', r.native_level_code,
  r.canonical_level, 'degree', r.field_category, 'Belfast', 'Queen''s University Belfast', r.duration_months,
  r.study_mode, r.official_program_url,
  'https://www.gov.uk/what-different-qualification-levels-mean/list-of-qualification-levels',
  date '2026-08-09', 'official_2026_program_evidence_collected', 'C'
from rows r cross join queens q
on conflict (source_name, source_program_key) do update set
  institution_id=excluded.institution_id, ukprn=excluded.ukprn,
  awarding_institution_id=excluded.awarding_institution_id, delivery_institution_id=excluded.delivery_institution_id,
  provider_relationship=excluded.provider_relationship, source_program_name=excluded.source_program_name,
  title=excluded.title, qualification_title=excluded.qualification_title, native_framework=excluded.native_framework,
  native_level_code=excluded.native_level_code, canonical_level=excluded.canonical_level,
  field_category=excluded.field_category, city=excluded.city, campus=excluded.campus,
  duration_months=excluded.duration_months, study_mode=excluded.study_mode,
  official_program_url=excluded.official_program_url, official_qualification_url=excluded.official_qualification_url,
  source_as_of=excluded.source_as_of, collection_status=excluded.collection_status, verification_tier=excluded.verification_tier;

with sponsor as (
  select id from public.institution_student_sponsor_uk_staging
  where source_sponsor_key='queens-university-belfast|belfast|student' and match_status='matched'
), rows(source_program_key, admission_status, verification_status, rule_notes) as (
  values
  ('social-work-bsw-l500','closed_after_2026_01_14_deadline','official_2026_program_international_path_and_closed_deadline_verified_cas_unverified','Queen''s states applications after 14 January 2026 will not be considered for this professional Social Work course. International applicant guidance is present; CAS is not inferred.'),
  ('media-broadcast-production-ba-p310','post_2026_06_30_clearing_vacancy_not_verified','official_2026_program_international_fee_and_application_evidence_verified_cas_unverified','Queen''s lists international tuition and says international applications are normally considered until 30 June 2026, after which applicants enter Clearing. Current vacancy is not inferred.'),
  ('software-engineering-meng-g602','post_2026_06_30_clearing_vacancy_not_verified','official_2026_program_international_fee_and_application_evidence_verified_cas_unverified','Queen''s lists international tuition and says international applications are normally considered until 30 June 2026, after which applicants enter Clearing. Current vacancy is not inferred.'),
  ('midwifery-bsc-b720','closed_after_2026_01_28_international_deadline','official_2026_program_professional_and_international_deadline_verified_cas_unverified','Queen''s states the international UCAS deadline for 2026 entry was 28 January 2026. Programme leads to NMC registered midwife status. CAS is not inferred.'),
  ('pharmacy-mpharm-b230','closed_after_2026_01_28_international_deadline','official_2026_program_professional_and_international_deadline_verified_cas_unverified','Queen''s states the international UCAS deadline for 2026 entry was 28 January 2026. MPharm is professionally accredited. CAS is not inferred.')
)
insert into public.program_international_uk_staging (
  program_catalog_id, student_sponsor_record_id, student_sponsor_eligible,
  international_students_eligible, cas_eligibility, international_admission_status,
  visa_context, intake_label, admission_source_url, international_source_url,
  sponsor_source_url, source_as_of, verification_status, rule_notes, verified_at
)
select p.id, s.id, true, true, null, r.admission_status,
  'Queen''s University Belfast is matched to the 2026-08-07 UKVI Student sponsor register as a Student Sponsor - Track Record. Programme-level CAS issuance remains unverified.',
  'September 2026', p.official_program_url, p.official_program_url,
  'https://www.gov.uk/government/publications/register-of-licensed-sponsors-students',
  date '2026-08-09', r.verification_status, r.rule_notes, now()
from rows r
join public.program_catalog_uk_staging p on p.source_name='Queen''s University Belfast' and p.source_program_key=r.source_program_key
cross join sponsor s
on conflict (program_catalog_id) do update set
  student_sponsor_record_id=excluded.student_sponsor_record_id,
  student_sponsor_eligible=excluded.student_sponsor_eligible,
  international_students_eligible=excluded.international_students_eligible,
  cas_eligibility=excluded.cas_eligibility,
  international_admission_status=excluded.international_admission_status,
  visa_context=excluded.visa_context, intake_label=excluded.intake_label,
  admission_source_url=excluded.admission_source_url, international_source_url=excluded.international_source_url,
  sponsor_source_url=excluded.sponsor_source_url, source_as_of=excluded.source_as_of,
  verification_status=excluded.verification_status, rule_notes=excluded.rule_notes, verified_at=excluded.verified_at;

with links(source_program_key, canonical_career_id, match_basis, relation_type, match_pattern, reviewer_note) as (
  values
  ('social-work-bsw-l500','social-worker','official_program_title_and_professional_evidence','professional_registration_pathway','Social Work BSW -> Social Worker','Queen''s describes this as a professional Social Work qualification accredited by the Northern Ireland Social Care Council.'),
  ('media-broadcast-production-ba-p310','film-editor','official_program_curriculum_evidence','direct_skill_pathway','Media and Broadcast Production -> Film/Video Editor','The 2026 course includes Editing for Screen and repeated video editing/post-production practice within a vocational media-production degree.'),
  ('software-engineering-meng-g602','software-developer','official_program_career_evidence','direct_career_path','Software Engineering -> Software Developer','Queen''s explicitly lists Software Developer among careers open to graduates.'),
  ('software-engineering-meng-g602','web-designer','official_program_career_evidence','direct_career_path','Software Engineering -> Web Designer','Queen''s explicitly lists Web Designer among careers open to graduates.'),
  ('software-engineering-meng-g602','project-manager','official_program_career_evidence','direct_career_path','Software Engineering -> Project Manager','Queen''s explicitly lists Project Manager among careers open to graduates.'),
  ('midwifery-bsc-b720','midwife','official_program_title_and_professional_evidence','professional_registration_pathway','Midwifery BSc -> Midwife','Queen''s states the course enables practice as an NMC registered midwife.'),
  ('pharmacy-mpharm-b230','pharmacist','official_program_title_and_professional_evidence','professional_registration_pathway','Pharmacy MPharm -> Pharmacist','Queen''s MPharm meets professional accreditation standards for initial pharmacist education and training.')
)
insert into public.program_occupation_uk_staging (
  program_catalog_id, canonical_career_id, rule_version, match_basis, match_pattern,
  review_status, relation_type, source_checked_at, reviewer_note, reviewed_at
)
select p.id, l.canonical_career_id, 'uk-phase2-v1', l.match_basis, l.match_pattern,
  'approved', l.relation_type, date '2026-08-09', l.reviewer_note, now()
from links l
join public.program_catalog_uk_staging p on p.source_name='Queen''s University Belfast' and p.source_program_key=l.source_program_key
on conflict (program_catalog_id, canonical_career_id) do update set
  rule_version=excluded.rule_version, match_basis=excluded.match_basis, match_pattern=excluded.match_pattern,
  review_status=excluded.review_status, relation_type=excluded.relation_type,
  source_checked_at=excluded.source_checked_at, reviewer_note=excluded.reviewer_note, reviewed_at=excluded.reviewed_at;