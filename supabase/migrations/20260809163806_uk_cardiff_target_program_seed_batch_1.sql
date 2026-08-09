with cardiff as (
  select institution_id, ukprn
  from public.institution_identity_uk_v1
  where canonical_name='Cardiff University'
), rows(source_program_key, source_program_name, title, qualification_title, native_level_code, canonical_level, field_category, duration_months, study_mode, official_program_url, legacy_course_id) as (
  values
  ('computer-science-bsc','Computer Science','Computer Science','BSc','6','BACHELOR','Computer Science',36,'Full-time','https://www.cardiff.ac.uk/study/undergraduate/courses/2026/computer-science-bsc',22::bigint),
  ('ai-cyber-security-msc','AI + Cyber Security','AI + Cyber Security','MSc','7','MASTER','Cybersecurity',12,'Full-time','https://www.cardiff.ac.uk/study/postgraduate/taught/courses/course/ai-plus-cyber-security-msc',null::bigint),
  ('cyber-security-msc','Cyber Security','Cyber Security','MSc','7','MASTER','Cybersecurity',12,'Full-time','https://www.cardiff.ac.uk/study/postgraduate/taught/courses/course/cyber-security-msc-full-time-1-year',null::bigint),
  ('ai-data-science-msc','AI + Data Science','AI + Data Science','MSc','7','MASTER','Data Science',12,'Full-time','https://www.cardiff.ac.uk/study/postgraduate/taught/courses/course/ai-plus-data-science-msc',null::bigint),
  ('data-science-and-analytics-msc','Data Science and Analytics','Data Science and Analytics','MSc','7','MASTER','Data Science and Analytics',12,'Full-time; September start','https://www.cardiff.ac.uk/study/postgraduate/taught/courses/course/data-science-and-analytics-msc-full-time-september-start',null::bigint),
  ('electrical-and-electronic-engineering-meng','Electrical and Electronic Engineering','Electrical and Electronic Engineering','MEng','7','INTEGRATED_MASTER','Electrical and Electronic Engineering',48,'Full-time','https://www.cardiff.ac.uk/study/undergraduate/courses/2026/electrical-and-electronic-engineering-meng',null::bigint),
  ('civil-and-environmental-engineering-meng','Civil and Environmental Engineering','Civil and Environmental Engineering','MEng','7','INTEGRATED_MASTER','Civil and Environmental Engineering',48,'Full-time','https://www.cardiff.ac.uk/study/undergraduate/courses/2026/civil-and-environmental-engineering-meng',null::bigint),
  ('mechanical-engineering-meng','Mechanical Engineering','Mechanical Engineering','MEng','7','INTEGRATED_MASTER','Mechanical Engineering',48,'Full-time','https://www.cardiff.ac.uk/study/undergraduate/courses/2026/mechanical-engineering-meng',null::bigint),
  ('pharmacy-mpharm','Pharmacy','Pharmacy','MPharm','7','INTEGRATED_MASTER','Pharmacy',48,'Full-time','https://www.cardiff.ac.uk/study/undergraduate/courses/2026/pharmacy-mpharm',null::bigint),
  ('bachelor-of-nursing-adult-autumn-intake-bn','Bachelor of Nursing (Adult) Autumn Intake','Bachelor of Nursing (Adult) Autumn Intake','BN (Hons)','6','BACHELOR','Adult Nursing',36,'Full-time; clinical placements','https://www.cardiff.ac.uk/study/undergraduate/courses/2026/bachelor-of-nursing-adult-autumn-intake-bn',149::bigint),
  ('architecture-bsc','Architecture','Architecture','BSc','6','BACHELOR','Architecture',36,'Full-time','https://www.cardiff.ac.uk/study/undergraduate/courses/2026/architecture-bsc',null::bigint)
)
insert into public.program_catalog_uk_staging (
  source_name, source_program_key, institution_name, institution_id, ukprn,
  awarding_institution_id, delivery_institution_id, provider_relationship,
  source_program_name, title, qualification_title, native_framework, native_level_code,
  canonical_level, programme_type, field_category, city, campus, duration_months,
  study_mode, official_program_url, official_qualification_url, source_as_of,
  collection_status, verification_tier, legacy_course_id
)
select
  'Cardiff University', r.source_program_key, 'Cardiff University', c.institution_id, c.ukprn,
  c.institution_id, c.institution_id, 'direct_award',
  r.source_program_name, r.title, r.qualification_title, 'FHEQ', r.native_level_code,
  r.canonical_level, 'degree', r.field_category, 'Cardiff', 'Cardiff University', r.duration_months,
  r.study_mode, r.official_program_url,
  'https://www.gov.uk/what-different-qualification-levels-mean/list-of-qualification-levels',
  date '2026-08-09', 'official_2026_program_evidence_collected', 'C', r.legacy_course_id
from rows r cross join cardiff c
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
  verification_tier=excluded.verification_tier,
  legacy_course_id=excluded.legacy_course_id;

with sponsor as (
  select id from public.institution_student_sponsor_uk_staging
  where source_sponsor_key='cardiff-university|cardiff|student' and match_status='matched'
), normal_programmes as (
  select id, official_program_url, source_program_key
  from public.program_catalog_uk_staging
  where source_name='Cardiff University'
    and source_program_key <> 'bachelor-of-nursing-adult-autumn-intake-bn'
)
insert into public.program_international_uk_staging (
  program_catalog_id, student_sponsor_record_id, student_sponsor_eligible,
  international_students_eligible, cas_eligibility, international_admission_status,
  visa_context, intake_label, admission_source_url, international_source_url,
  sponsor_source_url, source_as_of, verification_status, rule_notes, verified_at
)
select
  p.id, s.id, true, true, null,
  'current_2026_program_international_entry_evidence_visible_admission_window_not_yet_verified',
  'Cardiff is a current Student-route sponsor; exact programme-level CAS issuance remains unverified.',
  case when p.source_program_key in ('ai-cyber-security-msc','cyber-security-msc','ai-data-science-msc','data-science-and-analytics-msc') then '28 September 2026' else 'September 2026' end,
  p.official_program_url, p.official_program_url,
  'https://www.gov.uk/government/publications/register-of-licensed-sponsors-students',
  date '2026-08-09',
  'official_2026_program_and_international_entry_evidence_verified_cas_unverified',
  'Official course page is for 2026 entry and includes international qualification and/or Student-visa requirements. This does not by itself prove the exact current admissions window or CAS issuance.',
  now()
from normal_programmes p cross join sponsor s
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

with sponsor as (
  select id from public.institution_student_sponsor_uk_staging
  where source_sponsor_key='cardiff-university|cardiff|student' and match_status='matched'
), nursing as (
  select id, official_program_url from public.program_catalog_uk_staging
  where source_name='Cardiff University' and source_program_key='bachelor-of-nursing-adult-autumn-intake-bn'
)
insert into public.program_international_uk_staging (
  program_catalog_id, student_sponsor_record_id, student_sponsor_eligible,
  international_students_eligible, cas_eligibility, international_admission_status,
  visa_context, intake_label, admission_source_url, international_source_url,
  sponsor_source_url, source_as_of, verification_status, rule_notes, verified_at
)
select
  n.id, s.id, true, true, null,
  'closed_to_overseas_applications_for_2026_27_entry',
  'Cardiff is a current Student-route sponsor; the programme is explicitly closed to overseas applications for 2026/27 entry.',
  'September 2026', n.official_program_url,
  'https://www.cardiff.ac.uk/study/undergraduate/funding/funding-your-healthcare-course/international-nursing-students-funding',
  'https://www.gov.uk/government/publications/register-of-licensed-sponsors-students',
  date '2026-08-09',
  'official_overseas_nursing_2026_27_closed_verified',
  'Cardiff states overseas students can study the Adult Nursing BN, but the programme is now closed to overseas applications for 2026/27 entry.',
  now()
from nursing n cross join sponsor s
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
  ('computer-science-bsc','software-developer','official_program_career_evidence','direct_career_path','Computer Science -> Software Engineer','Cardiff explicitly lists Software Engineer among graduate roles.'),
  ('computer-science-bsc','business-analyst','official_program_career_evidence','direct_career_path','Computer Science -> Business Analyst','Cardiff explicitly lists Business Analyst among graduate roles.'),
  ('ai-cyber-security-msc','cybersecurity-analyst','official_program_title_evidence','direct_career_path','AI + Cyber Security -> Cyber Security Analyst','Programme is explicitly designed around applied cyber security and AI-based defence.'),
  ('cyber-security-msc','cybersecurity-analyst','official_program_title_evidence','direct_career_path','Cyber Security -> Cyber Security Analyst','Programme directly targets security issues in communications and information systems.'),
  ('ai-data-science-msc','data-analyst','official_program_discipline_evidence','direct_discipline','AI + Data Science -> Data Analyst','Programme focuses on AI-driven data analysis and modelling.'),
  ('ai-data-science-msc','data-engineer','official_program_discipline_evidence','related_discipline','AI + Data Science -> Data Engineer','Programme explicitly includes data engineering in its stated skill focus.'),
  ('data-science-and-analytics-msc','data-analyst','official_program_title_evidence','direct_career_path','Data Science and Analytics -> Data Analyst','Programme directly trains analysis of large and complex datasets.'),
  ('electrical-and-electronic-engineering-meng','electrical-engineer','official_program_title_evidence','direct_career_path','Electrical and Electronic Engineering -> Electrical Engineer','Programme title and core curriculum directly match electrical/electronic engineering.'),
  ('civil-and-environmental-engineering-meng','civil-engineer','official_program_title_evidence','direct_career_path','Civil and Environmental Engineering -> Civil Engineer','Programme includes core civil engineering and professional engineering practice.'),
  ('civil-and-environmental-engineering-meng','environmental-engineer','official_program_title_evidence','direct_career_path','Civil and Environmental Engineering -> Environmental Engineer','Programme explicitly integrates environmental engineering with civil engineering.'),
  ('mechanical-engineering-meng','mechanical-engineer','official_program_title_evidence','direct_career_path','Mechanical Engineering -> Mechanical Engineer','Programme title directly matches the target profession.'),
  ('pharmacy-mpharm','pharmacist','official_program_title_and_professional_evidence','professional_registration_pathway','MPharm Pharmacy -> Pharmacist','Cardiff states the accredited MPharm leads, after foundation training, to pharmacist registration.'),
  ('bachelor-of-nursing-adult-autumn-intake-bn','registered-nurse','official_program_title_and_professional_evidence','professional_registration_pathway','Adult Nursing BN -> Registered Nurse','Programme leads to eligibility to apply for NMC professional registration as an adult nurse.'),
  ('architecture-bsc','architect','official_program_title_and_professional_evidence','professional_pathway_stage','Architecture BSc -> Architect','RIBA/ARB-accredited BSc is the first professional architecture stage and Cardiff states graduates commonly continue toward registered architect status.')
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
  on p.source_name='Cardiff University' and p.source_program_key=l.source_program_key
on conflict (program_catalog_id, canonical_career_id) do update set
  rule_version=excluded.rule_version,
  match_basis=excluded.match_basis,
  match_pattern=excluded.match_pattern,
  review_status=excluded.review_status,
  relation_type=excluded.relation_type,
  source_checked_at=excluded.source_checked_at,
  reviewer_note=excluded.reviewer_note,
  reviewed_at=excluded.reviewed_at;