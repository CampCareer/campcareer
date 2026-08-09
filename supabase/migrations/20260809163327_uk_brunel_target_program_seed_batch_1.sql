with brunel as (
  select institution_id, ukprn
  from public.institution_identity_uk_v1
  where canonical_name = 'Brunel University of London'
), rows(source_program_key, source_program_name, title, qualification_title, native_level_code, canonical_level, field_category, duration_months, study_mode, official_program_url, legacy_course_id) as (
  values
  ('computer-science-bsc','Computer Science','Computer Science','BSc (Hons)','6','BACHELOR','Computer Science',36,'Full-time; placement option available','https://www.brunel.ac.uk/study/courses/computer-science-bsc',24::bigint),
  ('computer-science-software-engineering-bsc','Computer Science (Software Engineering)','Computer Science (Software Engineering)','BSc (Hons)','6','BACHELOR','Software Engineering',36,'Full-time; placement option available','https://www.brunel.ac.uk/study/courses/computer-science-software-engineering-bsc',null::bigint),
  ('computer-science-cybersecurity-bsc','Computer Science (Cybersecurity)','Computer Science (Cybersecurity)','BSc (Hons)','6','BACHELOR','Cybersecurity',36,'Full-time; placement option available','https://www.brunel.ac.uk/study/courses/computer-science-cybersecurity-bsc',null::bigint),
  ('computer-science-network-computing-bsc','Computer Science (Network Computing)','Computer Science (Network Computing)','BSc (Hons)','6','BACHELOR','Network Computing',36,'Full-time; placement option available','https://www.brunel.ac.uk/study/courses/computer-science-network-computing-bsc',null::bigint),
  ('mathematics-for-data-science-bsc','Mathematics for Data Science','Mathematics for Data Science','BSc (Hons)','6','BACHELOR','Data Science',36,'Full-time; placement option available','https://www.brunel.ac.uk/study/courses/mathematics-for-data-science-bsc',null::bigint),
  ('electronic-and-electrical-engineering-meng','Electronic and Electrical Engineering','Electronic and Electrical Engineering','MEng','7','INTEGRATED_MASTER','Electrical and Electronic Engineering',48,'Full-time; placement option available','https://www.brunel.ac.uk/study/courses/electronic-and-electrical-engineering-meng',null::bigint),
  ('civil-engineering-meng','Civil Engineering','Civil Engineering','MEng','7','INTEGRATED_MASTER','Civil Engineering',48,'Full-time; placement option available','https://www.brunel.ac.uk/study/courses/civil-engineering-meng',null::bigint),
  ('mechanical-engineering-beng','Mechanical Engineering','Mechanical Engineering','BEng (Hons)','6','BACHELOR','Mechanical Engineering',36,'Full-time; placement option available','https://www.brunel.ac.uk/study/courses/mechanical-engineering-beng',null::bigint),
  ('mechanical-engineering-meng','Mechanical Engineering','Mechanical Engineering','MEng','7','INTEGRATED_MASTER','Mechanical Engineering',48,'Full-time; placement option available','https://www.brunel.ac.uk/study/courses/mechanical-engineering-meng',null::bigint),
  ('physiotherapy-bsc','Physiotherapy','Physiotherapy','BSc (Hons)','6','BACHELOR','Physiotherapy',36,'Full-time; clinical placements','https://www.brunel.ac.uk/study/courses/physiotherapy-bsc',null::bigint),
  ('occupational-therapy-bsc','Occupational Therapy','Occupational Therapy','BSc (Hons)','6','BACHELOR','Occupational Therapy',36,'Full-time; clinical placements','https://www.brunel.ac.uk/study/courses/occupational-therapy-bsc',null::bigint),
  ('occupational-therapy-pre-registration-msci','Occupational Therapy (Pre-registration)','Occupational Therapy (Pre-registration)','MSci','7','INTEGRATED_MASTER','Occupational Therapy',48,'Full-time; clinical placements','https://www.brunel.ac.uk/study/courses/occupational-therapy-pre-registration-msci',null::bigint),
  ('finance-and-accounting-bsc','Finance and Accounting','Finance and Accounting','BSc (Hons)','6','BACHELOR','Accounting and Finance',36,'Full-time; placement option available','https://www.brunel.ac.uk/study/courses/finance-and-accounting-bsc',null::bigint),
  ('finance-and-accounting-msc','Finance and Accounting','Finance and Accounting','MSc','7','MASTER','Accounting and Finance',12,'Full-time; placement variants available','https://www.brunel.ac.uk/study/courses/finance-and-accounting-msc',null::bigint),
  ('finance-and-investment-msc','Finance and Investment','Finance and Investment','MSc','7','MASTER','Finance',12,'Full-time; placement variants available','https://www.brunel.ac.uk/study/courses/finance-and-investment-msc',null::bigint),
  ('accounting-and-business-management-msc','Accounting and Business Management','Accounting and Business Management','MSc','7','MASTER','Accounting and Business Management',12,'Full-time; January/September starts; placement variants available','https://www.brunel.ac.uk/study/courses/accounting-and-business-management-msc',null::bigint),
  ('business-computing-bsc','Business Computing','Business Computing','BSc (Hons)','6','BACHELOR','Business Computing',36,'Full-time; placement option available','https://www.brunel.ac.uk/study/courses/business-computing-bsc',null::bigint)
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
  'Brunel University of London', r.source_program_key, 'Brunel University of London', b.institution_id, b.ukprn,
  b.institution_id, b.institution_id, 'direct_award',
  r.source_program_name, r.title, r.qualification_title, 'FHEQ', r.native_level_code,
  r.canonical_level, 'degree', r.field_category, 'Uxbridge', 'Brunel University London', r.duration_months,
  r.study_mode, r.official_program_url,
  'https://www.gov.uk/what-different-qualification-levels-mean/list-of-qualification-levels',
  date '2026-08-09', 'official_program_and_international_fee_evidence_collected', 'C', r.legacy_course_id
from rows r cross join brunel b
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
  where source_sponsor_key='brunel-university-london|uxbridge|student'
    and match_status='matched'
)
insert into public.program_international_uk_staging (
  program_catalog_id, student_sponsor_record_id, student_sponsor_eligible,
  international_students_eligible, cas_eligibility, international_admission_status,
  visa_context, intake_label, admission_source_url, international_source_url,
  sponsor_source_url, source_as_of, verification_status, rule_notes, verified_at
)
select
  p.id, s.id, true, true, null,
  'current_2026_27_course_international_fee_visible_admission_window_not_yet_verified',
  'Brunel is a current Student-route sponsor; exact programme-level CAS/admission timing remains for Phase 3 verification.',
  case
    when p.source_program_key in ('finance-and-accounting-msc','accounting-and-business-management-msc') then 'January / September'
    else 'September'
  end,
  p.official_program_url, p.official_program_url,
  'https://www.gov.uk/government/publications/register-of-licensed-sponsors-students',
  date '2026-08-09',
  'official_2026_27_program_and_international_fee_verified_cas_unverified',
  'Exact course page identifies the 2026/27 programme and an international tuition fee. This supports programme-level international availability but does not by itself establish a currently open admissions window or unconditional CAS issuance.',
  now()
from public.program_catalog_uk_staging p
cross join sponsor s
where p.source_name='Brunel University of London'
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
  ('computer-science-bsc','software-developer','official_program_discipline_evidence','direct_discipline','Computer Science -> software development','Course teaches specification, design, coding, modification and testing of software solutions.'),
  ('computer-science-software-engineering-bsc','software-developer','official_program_title_evidence','direct_career_path','Software Engineering -> software developer','Software Engineering specialization directly prepares students to build and maintain software systems.'),
  ('computer-science-cybersecurity-bsc','cybersecurity-analyst','official_program_title_evidence','direct_career_path','Cybersecurity -> Cyber Security Analyst','Cybersecurity specialization directly matches the target career domain.'),
  ('computer-science-network-computing-bsc','network-administrator','official_program_title_and_discipline_evidence','direct_discipline','Network Computing -> Network Administrator','Network-computing specialization directly covers connected systems, networks, cloud, security and privacy.'),
  ('mathematics-for-data-science-bsc','data-analyst','official_program_career_evidence','direct_career_path','Mathematics for Data Science -> Data Analyst','Brunel explicitly describes demand for data analysts trained to interpret complex data sets.'),
  ('electronic-and-electrical-engineering-meng','electrical-engineer','official_program_title_evidence','direct_career_path','Electronic and Electrical Engineering -> Electrical Engineer','Programme directly develops advanced electrical and electronic systems engineering.'),
  ('civil-engineering-meng','civil-engineer','official_program_title_evidence','direct_career_path','Civil Engineering -> Civil Engineer','Programme title and overview directly describe the civil engineering profession.'),
  ('mechanical-engineering-beng','mechanical-engineer','official_program_title_evidence','direct_career_path','Mechanical Engineering -> Mechanical Engineer','Programme title directly matches the target engineering profession.'),
  ('mechanical-engineering-meng','mechanical-engineer','official_program_title_evidence','direct_career_path','Mechanical Engineering -> Mechanical Engineer','Integrated master is explicitly designed for careers in mechanical engineering.'),
  ('physiotherapy-bsc','physiotherapist','official_program_title_and_professional_evidence','direct_career_path','Physiotherapy -> Physiotherapist','Programme explicitly trains the next generation of physiotherapists and includes clinical preparation.'),
  ('occupational-therapy-bsc','occupational-therapist','official_program_title_and_professional_evidence','direct_career_path','Occupational Therapy -> Occupational Therapist','Programme title and practical professional training directly match occupational therapy.'),
  ('occupational-therapy-pre-registration-msci','occupational-therapist','official_program_title_and_professional_evidence','direct_career_path','Occupational Therapy pre-registration -> Occupational Therapist','Pre-registration integrated master is a direct professional occupational-therapy pathway.'),
  ('finance-and-accounting-bsc','accountant','official_program_title_and_accreditation_evidence','direct_career_path','Finance and Accounting -> Accountant','Programme explicitly supports careers in accountancy and is accredited by ACCA/CIMA/ICAEW.'),
  ('finance-and-accounting-msc','accountant','official_program_title_evidence','direct_career_path','Finance and Accounting -> Accountant','Programme explicitly targets careers in accountancy and financial management.'),
  ('finance-and-investment-msc','financial-analyst','official_program_discipline_evidence','direct_career_path','Finance and Investment -> Financial Analyst','Programme focuses on investment analysis, portfolio management, valuation and financial modelling.'),
  ('accounting-and-business-management-msc','accountant','official_program_career_evidence','direct_career_path','Accounting and Business Management -> Accountant','Programme develops technical accounting skills and professional accounting exemptions.'),
  ('accounting-and-business-management-msc','auditor','official_program_career_evidence','direct_career_path','Accounting and Business Management -> Auditor','Brunel explicitly lists Auditor among graduate job roles.'),
  ('accounting-and-business-management-msc','business-analyst','official_program_career_evidence','direct_career_path','Accounting and Business Management -> Business Analyst','Brunel explicitly lists Business analyst among graduate job roles.'),
  ('accounting-and-business-management-msc','financial-analyst','official_program_career_evidence','direct_career_path','Accounting and Business Management -> Financial Analyst','Brunel explicitly lists Financial analyst among graduate job roles.'),
  ('business-computing-bsc','software-developer','official_program_career_evidence','direct_career_path','Business Computing -> Software Developer','Brunel explicitly lists software developer as a graduate career.'),
  ('business-computing-bsc','business-analyst','official_program_career_evidence','direct_career_path','Business Computing -> Business Analyst','Brunel explicitly lists business analyst as a graduate career.')
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
  on p.source_name='Brunel University of London' and p.source_program_key=l.source_program_key
on conflict (program_catalog_id, canonical_career_id) do update set
  rule_version=excluded.rule_version,
  match_basis=excluded.match_basis,
  match_pattern=excluded.match_pattern,
  review_status=excluded.review_status,
  relation_type=excluded.relation_type,
  source_checked_at=excluded.source_checked_at,
  reviewer_note=excluded.reviewer_note,
  reviewed_at=excluded.reviewed_at;