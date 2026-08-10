insert into public.institution_student_sponsor_uk_staging (
  source_name, source_sponsor_key, sponsor_name, town_city, additional_locations,
  sponsor_type, sponsor_status, route, immigration_compliance,
  institution_id, ukprn, match_status, match_basis, source_url, source_as_of
)
values (
  'City of Glasgow College visa guidance', 'city-of-glasgow-college|glasgow|student-self-evidence',
  'City of Glasgow College', 'Glasgow', 'City Campus; Riverside Campus',
  'Publicly funded college', 'Student visa sponsorship evidenced by college CAS guidance', 'Student',
  'institution_official_student_visa_and_cas_guidance', null, null, 'candidate',
  'official_provider_identity_not_yet_in_canonical_institution_catalog',
  'https://www.cityofglasgowcollege.ac.uk/international-students/visa-requirements', date '2026-08-09'
)
on conflict (source_name, source_sponsor_key) do update set
  sponsor_name=excluded.sponsor_name, town_city=excluded.town_city,
  additional_locations=excluded.additional_locations, sponsor_type=excluded.sponsor_type,
  sponsor_status=excluded.sponsor_status, route=excluded.route,
  immigration_compliance=excluded.immigration_compliance,
  match_status=excluded.match_status, match_basis=excluded.match_basis,
  source_url=excluded.source_url, source_as_of=excluded.source_as_of;

insert into public.program_catalog_uk_staging (
  source_name, source_program_key, institution_name, institution_id, ukprn,
  awarding_institution_id, delivery_institution_id, provider_relationship,
  source_program_name, title, qualification_title, native_framework, native_level_code,
  canonical_level, programme_type, field_category, city, campus, duration_months,
  study_mode, official_program_url, official_qualification_url, source_as_of,
  collection_status, verification_tier
)
values (
  'City of Glasgow College', 'pre-cadet-shipping-maritime-operations-fast-track-scqf6-2026',
  'City of Glasgow College', null, null, null, null, 'unknown',
  'Level 6 Pre-Cadet Shipping And Maritime Operations (fast-track) Access',
  'Pre-Cadet Shipping and Maritime Operations (Fast Track)', 'NQ / Access', 'SCQF', '6',
  'BELOW_DEGREE', 'access', 'Nautical Studies and Marine Engineering', 'Glasgow',
  'Riverside Campus', 5, 'Full-time',
  'https://www.cityofglasgowcollege.ac.uk/courses/nq-shipping-and-maritime-operations-pre-cadet-fast-track-scqf-level-6-2026-08-24',
  'https://scqf.org.uk/about-the-framework/interactive-framework/', date '2026-08-09',
  'official_2026_vocational_access_program_evidence_collected_provider_identity_pending', 'C'
)
on conflict (source_name, source_program_key) do update set
  institution_name=excluded.institution_name, institution_id=excluded.institution_id, ukprn=excluded.ukprn,
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
  where source_sponsor_key='city-of-glasgow-college|glasgow|student-self-evidence'
), programme as (
  select id, official_program_url from public.program_catalog_uk_staging
  where source_name='City of Glasgow College' and source_program_key='pre-cadet-shipping-maritime-operations-fast-track-scqf6-2026'
)
insert into public.program_international_uk_staging (
  program_catalog_id, student_sponsor_record_id, student_sponsor_eligible,
  international_students_eligible, cas_eligibility, international_admission_status,
  visa_context, intake_label, intake_start_date, admission_source_url, international_source_url,
  sponsor_source_url, source_as_of, verification_status, rule_notes, verified_at
)
select p.id, s.id, true, true, null, 'open_apply_now_2026_international_students_welcome',
  'The exact SCQF 6 course states Applications from International Students Welcome. College visa guidance supports the Student Visa route and CAS after successful application; exact programme-level CAS remains unverified.',
  '24 August 2026', date '2026-08-24', p.official_program_url, p.official_program_url,
  'https://www.cityofglasgowcollege.ac.uk/international-students/visa-requirements', date '2026-08-09',
  'official_2026_open_international_access_program_verified_cas_unverified',
  'This is an access/pre-cadet course, not an officer qualification. It progresses into sponsored cadetships covering Deck and Marine Engineering streams.', now()
from programme p cross join sponsor s
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

with links(canonical_career_id, match_pattern, reviewer_note) as (
  values
  ('deck-officer','Pre-Cadet Shipping and Maritime Operations -> sponsored Deck cadetship -> Deck Officer','College states the course introduces the Deck officer stream and is an access route into sponsored Diploma cadetships. This is progression evidence, not a direct officer qualification.'),
  ('marine-engineer','Pre-Cadet Shipping and Maritime Operations -> sponsored Marine Engineering cadetship -> Marine Engineer','College states the course introduces Marine Engineering and progresses into sponsored cadetships. This is progression evidence, not a direct Marine Engineer qualification.')
)
insert into public.program_occupation_uk_staging (
  program_catalog_id, canonical_career_id, rule_version, match_basis, match_pattern,
  review_status, relation_type, source_checked_at, reviewer_note, reviewed_at
)
select p.id, l.canonical_career_id, 'uk-phase2-v1', 'official_program_progression_evidence', l.match_pattern,
  'approved', 'progression_pathway', date '2026-08-09', l.reviewer_note, now()
from links l
cross join lateral (
  select id from public.program_catalog_uk_staging
  where source_name='City of Glasgow College' and source_program_key='pre-cadet-shipping-maritime-operations-fast-track-scqf6-2026'
) p
on conflict (program_catalog_id, canonical_career_id) do update set
  rule_version=excluded.rule_version, match_basis=excluded.match_basis, match_pattern=excluded.match_pattern,
  review_status=excluded.review_status, relation_type=excluded.relation_type,
  source_checked_at=excluded.source_checked_at, reviewer_note=excluded.reviewer_note, reviewed_at=excluded.reviewed_at;