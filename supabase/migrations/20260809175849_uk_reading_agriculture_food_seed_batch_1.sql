with reading as (
  select institution_id, ukprn from public.institution_identity_uk_v1 where slug='university-of-reading'
)
insert into public.institution_student_sponsor_uk_staging (
  source_name, source_sponsor_key, sponsor_name, town_city, sponsor_type, sponsor_status, route,
  immigration_compliance, institution_id, ukprn, match_status, match_basis, source_url, source_as_of
)
select
  'University of Reading student visa and CAS guidance',
  'university-of-reading|reading|student-self-evidence',
  'University of Reading','Reading','Higher Education Institution (HEI)','Licensed Student Route Visa sponsor','Student',
  'institution_official_student_sponsor_and_cas_guidance', r.institution_id, r.ukprn,
  'matched','official_institution_statement_plus_ukprn_identity',
  'https://www.reading.ac.uk/admissions/university-of-reading-additional-tuition-fee-payment-requirement',
  date '2026-08-09'
from reading r
on conflict (source_name, source_sponsor_key) do update set
  sponsor_name=excluded.sponsor_name, town_city=excluded.town_city, sponsor_type=excluded.sponsor_type,
  sponsor_status=excluded.sponsor_status, route=excluded.route,
  immigration_compliance=excluded.immigration_compliance, institution_id=excluded.institution_id,
  ukprn=excluded.ukprn, match_status=excluded.match_status, match_basis=excluded.match_basis,
  source_url=excluded.source_url, source_as_of=excluded.source_as_of;

with reading as (
  select institution_id, ukprn from public.institution_identity_uk_v1 where slug='university-of-reading'
), rows(source_program_key, source_program_name, title, qualification_title, field_category, duration_months, official_program_url) as (
  values
  ('agriculture-bsc-d400-2026','Agriculture','Agriculture','BSc','Agriculture',36,'https://www.reading.ac.uk/ready-to-study/study/2026/agriculture-ug/bsc-agriculture'),
  ('food-technology-bioprocessing-bsc-d622-2026','Food Technology with Bioprocessing','Food Technology with Bioprocessing','BSc','Food Technology',36,'https://www.reading.ac.uk/ready-to-study/study/2026/food-and-nutrition-ug/bsc-food-technology-with-bioprocessing')
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
  'University of Reading', r.source_program_key, 'University of Reading', u.institution_id, u.ukprn,
  u.institution_id, u.institution_id, 'direct_award', r.source_program_name, r.title, r.qualification_title,
  'FHEQ','6','BACHELOR','degree',r.field_category,'Reading','Whiteknights / University of Reading',r.duration_months,
  'Full-time',r.official_program_url,
  'https://www.gov.uk/what-different-qualification-levels-mean/list-of-qualification-levels',
  date '2026-08-09','official_2026_clearing_program_evidence_collected','C'
from rows r cross join reading u
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
  where source_sponsor_key='university-of-reading|reading|student-self-evidence' and match_status='matched'
), programmes as (
  select id, official_program_url from public.program_catalog_uk_staging
  where source_name='University of Reading'
    and source_program_key in ('agriculture-bsc-d400-2026','food-technology-bioprocessing-bsc-d622-2026')
)
insert into public.program_international_uk_staging (
  program_catalog_id, student_sponsor_record_id, student_sponsor_eligible,
  international_students_eligible, cas_eligibility, international_admission_status,
  visa_context, intake_label, intake_start_date, admission_source_url, international_source_url,
  sponsor_source_url, source_as_of, verification_status, rule_notes, verified_at
)
select p.id, s.id, true, true, null,
  'open_through_clearing_2026_international_direct_apply_visible',
  'University of Reading is a licensed Student Route Visa sponsor. International Clearing guidance says eligible international applicants can apply directly and the University issues CAS after an unconditional Clearing offer; exact programme-level CAS remains unverified.',
  '2026/27', null, p.official_program_url,
  'https://www.reading.ac.uk/clearing/international-applicants',
  'https://www.reading.ac.uk/admissions/university-of-reading-additional-tuition-fee-payment-requirement',
  date '2026-08-09',
  'official_2026_clearing_international_and_sponsor_evidence_verified_cas_unverified',
  'The exact course is listed for 2026/27 and available in Clearing with an international fee. General University CAS guidance is not promoted to programme-level CAS eligibility.',
  now()
from programmes p cross join sponsor s
on conflict (program_catalog_id) do update set
  student_sponsor_record_id=excluded.student_sponsor_record_id,
  student_sponsor_eligible=excluded.student_sponsor_eligible,
  international_students_eligible=excluded.international_students_eligible,
  cas_eligibility=excluded.cas_eligibility,
  international_admission_status=excluded.international_admission_status,
  visa_context=excluded.visa_context, intake_label=excluded.intake_label,
  intake_start_date=excluded.intake_start_date, admission_source_url=excluded.admission_source_url,
  international_source_url=excluded.international_source_url, sponsor_source_url=excluded.sponsor_source_url,
  source_as_of=excluded.source_as_of, verification_status=excluded.verification_status,
  rule_notes=excluded.rule_notes, verified_at=excluded.verified_at;

with links(source_program_key, canonical_career_id, match_basis, relation_type, match_pattern, reviewer_note) as (
  values
  ('agriculture-bsc-d400-2026','agronomist','official_program_career_evidence','direct_career_path','Agriculture BSc -> Agronomist','Reading states recent Agriculture graduates have entered agronomy and the course includes Crop Agronomy.'),
  ('agriculture-bsc-d400-2026','farm-manager','official_program_career_evidence','direct_career_path','Agriculture BSc -> Farm Manager','Reading states the degree prepares students for management roles or to manage their own farming enterprise, and includes Farm Business Management.'),
  ('agriculture-bsc-d400-2026','horticulturist','official_program_career_evidence','direct_career_path','Agriculture BSc -> Horticulturist','Reading explicitly lists horticulture among recent graduate destinations and offers Horticultural Science specialisation.'),
  ('food-technology-bioprocessing-bsc-d622-2026','food-technologist','official_program_title_and_professional_evidence','direct_career_path','Food Technology with Bioprocessing BSc -> Food Technologist','Reading explicitly describes the course as a route to becoming a food technologist and notes IFST professional recognition.')
)
insert into public.program_occupation_uk_staging (
  program_catalog_id, canonical_career_id, rule_version, match_basis, match_pattern,
  review_status, relation_type, source_checked_at, reviewer_note, reviewed_at
)
select p.id, l.canonical_career_id, 'uk-phase2-v1', l.match_basis, l.match_pattern,
  'approved', l.relation_type, date '2026-08-09', l.reviewer_note, now()
from links l
join public.program_catalog_uk_staging p
  on p.source_name='University of Reading' and p.source_program_key=l.source_program_key
on conflict (program_catalog_id, canonical_career_id) do update set
  rule_version=excluded.rule_version, match_basis=excluded.match_basis, match_pattern=excluded.match_pattern,
  review_status=excluded.review_status, relation_type=excluded.relation_type,
  source_checked_at=excluded.source_checked_at, reviewer_note=excluded.reviewer_note, reviewed_at=excluded.reviewed_at;