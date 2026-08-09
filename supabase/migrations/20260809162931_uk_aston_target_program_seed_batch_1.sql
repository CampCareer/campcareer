with aston as (
  select institution_id, ukprn
  from public.institution_identity_uk_v1
  where canonical_name = 'Aston University'
), rows(source_program_key, source_program_name, title, qualification_title, native_level_code, canonical_level, field_category, duration_months, study_mode, official_program_url, legacy_course_id) as (
  values
  ('computer-science-bsc','Computer Science','Computer Science','BSc (Hons)','6','BACHELOR','Computer Science',36,'Full-time; optional placement year','https://www.aston.ac.uk/study/courses/computer-science-bsc',26::bigint),
  ('cybersecurity-bsc','Cybersecurity','Cybersecurity','BSc (Hons)','6','BACHELOR','Cybersecurity',48,'Full-time; compulsory placement year','https://www.aston.ac.uk/study/courses/cybersecurity-bsc/september-2026',null::bigint),
  ('electronic-engineering-and-computer-science-beng','Electronic Engineering and Computer Science','Electronic Engineering and Computer Science','BEng (Hons)','6','BACHELOR','Electronic Engineering and Computer Science',36,'Full-time; optional placement year','https://www.aston.ac.uk/study/courses/electronic-engineering-and-computer-science-beng',null::bigint),
  ('electronic-engineering-and-computer-science-meng','Electronic Engineering and Computer Science','Electronic Engineering and Computer Science','MEng (Hons)','7','INTEGRATED_MASTER','Electronic Engineering and Computer Science',48,'Full-time; optional placement route','https://www.aston.ac.uk/study/courses/electronic-engineering-and-computer-science-meng/september-2026',null::bigint),
  ('mechanical-engineering-beng','Mechanical Engineering','Mechanical Engineering','BEng (Hons)','6','BACHELOR','Mechanical Engineering',36,'Full-time; optional placement year','https://www.aston.ac.uk/study/courses/mechanical-engineering-beng/september-2026',null::bigint),
  ('mechanical-engineering-msc','Mechanical Engineering','Mechanical Engineering','MSc','7','MASTER','Mechanical Engineering',12,'Full-time; professional practice extension available','https://www.aston.ac.uk/study/courses/mechanical-engineering-msc/september-2026',null::bigint),
  ('civil-engineering-meng','Civil Engineering','Civil Engineering','MEng (Hons)','7','INTEGRATED_MASTER','Civil Engineering',60,'Full-time; compulsory placement year','https://www.aston.ac.uk/study/courses/civil-engineering-meng/september-2026',null::bigint),
  ('civil-infrastructure-engineering-msc','Civil Infrastructure Engineering','Civil Infrastructure Engineering','MSc','7','MASTER','Civil Engineering',12,'Full-time; professional practice extension available','https://www.aston.ac.uk/study/courses/civil-infrastructure-engineering-msc/september-2026',null::bigint),
  ('finance-bsc','Finance','Finance','BSc (Hons)','6','BACHELOR','Finance',48,'Full-time; integrated placement year; international students may request opt-out','https://www.aston.ac.uk/study/courses/finance-bsc/september-2026',159::bigint),
  ('finance-msc','Finance','Finance','MSc','7','MASTER','Finance',12,'Full-time','https://www.aston.ac.uk/study/courses/finance-msc/september-2026',null::bigint)
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
  'Aston University', r.source_program_key, 'Aston University', a.institution_id, a.ukprn,
  a.institution_id, a.institution_id, 'direct_award',
  r.source_program_name, r.title, r.qualification_title, 'FHEQ', r.native_level_code,
  r.canonical_level, 'degree', r.field_category, 'Birmingham', 'Aston University', r.duration_months,
  r.study_mode, r.official_program_url,
  'https://www.gov.uk/what-different-qualification-levels-mean/list-of-qualification-levels',
  date '2026-08-09', 'official_program_and_international_evidence_collected', 'C', r.legacy_course_id
from rows r cross join aston a
on conflict (source_name, source_program_key) do update set
  institution_name=excluded.institution_name,
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
  programme_type=excluded.programme_type,
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
  select id
  from public.institution_student_sponsor_uk_staging
  where source_sponsor_key='aston-university|birmingham|student'
    and match_status='matched'
), program_evidence(source_program_key, intake_label, international_source_url) as (
  values
  ('computer-science-bsc','September 2026','https://www.aston.ac.uk/study/courses/computer-science-bsc'),
  ('cybersecurity-bsc','September 2026','https://www.aston.ac.uk/study/courses/cybersecurity-bsc/september-2026'),
  ('electronic-engineering-and-computer-science-beng','September 2026','https://www.aston.ac.uk/study/courses/electronic-engineering-and-computer-science-beng'),
  ('electronic-engineering-and-computer-science-meng','September 2026','https://www.aston.ac.uk/study/courses/electronic-engineering-and-computer-science-meng/september-2026'),
  ('mechanical-engineering-beng','September 2026','https://www.aston.ac.uk/study/courses/mechanical-engineering-beng/september-2026'),
  ('mechanical-engineering-msc','September 2026','https://www.aston.ac.uk/study/courses/mechanical-engineering-msc/september-2026'),
  ('civil-engineering-meng','September 2026','https://www.aston.ac.uk/study/courses/civil-engineering-meng/september-2026'),
  ('civil-infrastructure-engineering-msc','September 2026; January 2027; April 2027','https://www.aston.ac.uk/study/courses/civil-infrastructure-engineering-msc/september-2026'),
  ('finance-bsc','September 2026','https://www.aston.ac.uk/study/courses/finance-bsc/september-2026'),
  ('finance-msc','September 2026','https://www.aston.ac.uk/study/courses/finance-msc/september-2026')
)
insert into public.program_international_uk_staging (
  program_catalog_id, student_sponsor_record_id, student_sponsor_eligible,
  international_students_eligible, cas_eligibility, international_admission_status,
  visa_context, intake_label, admission_source_url, international_source_url,
  sponsor_source_url, source_as_of, verification_status, rule_notes, verified_at
)
select
  p.id, s.id, true, true, null,
  'current_application_route_visible',
  'Aston is a current Student-route sponsor; programme-level CAS issuance has not yet been verified.',
  e.intake_label, e.international_source_url, e.international_source_url,
  'https://www.gov.uk/government/publications/register-of-licensed-sponsors-students',
  date '2026-08-09',
  'official_program_international_section_verified_cas_unverified',
  'Programme page shows a current Apply/Clearing route or Apply action and international-student course evidence. Student-sponsor status is institution-level only; CAS remains unknown pending Phase 3 verification.',
  now()
from program_evidence e
join public.program_catalog_uk_staging p
  on p.source_name='Aston University' and p.source_program_key=e.source_program_key
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
  ('computer-science-bsc','software-developer','official_program_career_evidence','direct_career_path','Computer Science -> software developer / software engineer','Aston explicitly lists software engineer or developer among graduate roles.'),
  ('cybersecurity-bsc','cybersecurity-analyst','official_program_title_and_career_evidence','direct_career_path','Cybersecurity -> Cybersecurity Analyst','Programme title is Cybersecurity and Aston explicitly lists Cybersecurity Analyst / Information Security Analyst roles.'),
  ('electronic-engineering-and-computer-science-beng','electrical-engineer','official_program_discipline_evidence','related_discipline','Electronic Engineering and Computer Science -> electrical/electronic engineering','Programme explicitly combines electrical/electronic engineering with computing; retained as a related electrical-engineering pathway.'),
  ('electronic-engineering-and-computer-science-meng','electrical-engineer','official_program_discipline_evidence','related_discipline','Electronic Engineering and Computer Science -> electrical/electronic engineering','Integrated master explicitly develops electronic engineering and professional engineering practice.'),
  ('electronic-engineering-and-computer-science-meng','software-developer','official_program_career_evidence','direct_career_path','Electronic Engineering and Computer Science -> Software Engineer or Developer','Aston explicitly lists Software Engineer or Developer among graduate roles.'),
  ('mechanical-engineering-beng','mechanical-engineer','official_program_title_and_career_evidence','direct_career_path','Mechanical Engineering -> Mechanical Engineer','Programme title directly matches and Aston lists Graduate Mechanical Engineer roles.'),
  ('mechanical-engineering-msc','mechanical-engineer','official_program_title_and_career_evidence','direct_career_path','Mechanical Engineering -> Mechanical Engineer','Programme title directly matches the target career and is professionally accredited by IMechE.'),
  ('civil-engineering-meng','civil-engineer','official_program_title_and_career_evidence','direct_career_path','Civil Engineering -> Civil Engineer','Programme title directly matches the target career and is accredited by the Joint Board of Moderators.'),
  ('civil-infrastructure-engineering-msc','civil-engineer','official_program_discipline_evidence','direct_discipline','Civil Infrastructure Engineering -> Civil Engineer','Programme is explicitly a civil infrastructure engineering MSc preparing graduates for civil/structural engineering work.'),
  ('finance-bsc','financial-analyst','official_program_career_evidence','direct_career_path','Finance -> investment analyst / financial analyst','Aston describes investment-analysis and advanced financial-analysis outcomes for this finance degree.'),
  ('finance-msc','financial-analyst','official_program_career_evidence','direct_career_path','Finance -> Financial Analyst','Aston explicitly lists Financial Analyst among graduate roles.')
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
  on p.source_name='Aston University' and p.source_program_key=l.source_program_key
on conflict (program_catalog_id, canonical_career_id) do update set
  rule_version=excluded.rule_version,
  match_basis=excluded.match_basis,
  match_pattern=excluded.match_pattern,
  review_status=excluded.review_status,
  relation_type=excluded.relation_type,
  source_checked_at=excluded.source_checked_at,
  reviewer_note=excluded.reviewer_note,
  reviewed_at=excluded.reviewed_at;