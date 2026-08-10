with swansea as (
  select institution_id, ukprn from public.institution_identity_uk_v1 where slug='swansea-university'
)
insert into public.institution_student_sponsor_uk_staging (
  source_name, source_sponsor_key, sponsor_name, town_city, additional_locations,
  sponsor_type, sponsor_status, route, immigration_compliance,
  institution_id, ukprn, match_status, match_basis, source_url, source_as_of
)
select
  'Swansea University student compliance guidance',
  'swansea-university|swansea|student-self-evidence', 'Swansea University', 'Swansea', null,
  'Higher Education Institution (HEI)', 'Student Sponsor - Track Record', 'Student',
  'institution_official_current_sponsor_statement', s.institution_id, s.ukprn, 'matched',
  'official_institution_statement_plus_ukprn_identity',
  'https://hwb.swansea.ac.uk/international/student-compliance-services/uk-graduate-route-visa-gr/', date '2026-08-09'
from swansea s
on conflict (source_name, source_sponsor_key) do update set
  sponsor_name=excluded.sponsor_name, town_city=excluded.town_city,
  sponsor_type=excluded.sponsor_type, sponsor_status=excluded.sponsor_status,
  route=excluded.route, immigration_compliance=excluded.immigration_compliance,
  institution_id=excluded.institution_id, ukprn=excluded.ukprn,
  match_status=excluded.match_status, match_basis=excluded.match_basis,
  source_url=excluded.source_url, source_as_of=excluded.source_as_of;

with swansea as (
  select institution_id, ukprn from public.institution_identity_uk_v1 where slug='swansea-university'
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
  'Swansea University', 'environmental-science-climate-emergency-bsc-f770', 'Swansea University',
  s.institution_id, s.ukprn, s.institution_id, s.institution_id, 'direct_award',
  'Environmental Science and the Climate Emergency', 'Environmental Science and the Climate Emergency',
  'BSc (Hons)', 'FHEQ', '6', 'BACHELOR', 'degree', 'Environmental Science', 'Swansea',
  'Singleton Park Campus', 36, 'Full-time',
  'https://www.swansea.ac.uk/undergraduate/courses/biosciences-geography-physics/geography/bsc-environmental-science-and-the-climate-emergency/',
  'https://www.gov.uk/what-different-qualification-levels-mean/list-of-qualification-levels',
  date '2026-08-09', 'official_2026_program_and_clearing_evidence_collected', 'C'
from swansea s
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
  where source_sponsor_key='swansea-university|swansea|student-self-evidence' and match_status='matched'
), programme as (
  select id, official_program_url from public.program_catalog_uk_staging
  where source_name='Swansea University' and source_program_key='environmental-science-climate-emergency-bsc-f770'
)
insert into public.program_international_uk_staging (
  program_catalog_id, student_sponsor_record_id, student_sponsor_eligible,
  international_students_eligible, cas_eligibility, international_admission_status,
  visa_context, intake_label, admission_source_url, international_source_url,
  sponsor_source_url, source_as_of, verification_status, rule_notes, verified_at
)
select p.id, s.id, true, true, null,
  'open_through_clearing_2026_international_direct_apply_visible',
  'Swansea University states on its current compliance guidance that it is a UKVI Licensed Student Sponsor - Track Record. Its international application guidance describes CAS after offer conditions and deposit; exact programme-level CAS issuance remains unverified.',
  'September 2026', p.official_program_url, p.official_program_url,
  'https://hwb.swansea.ac.uk/international/student-compliance-services/uk-graduate-route-visa-gr/',
  date '2026-08-09', 'official_2026_clearing_international_entry_and_sponsor_evidence_verified_cas_unverified',
  'Official programme page is in the current 2026 Clearing vacancy set, exposes an international direct-application path and international fee. CAS remains null because sponsor status and general CAS guidance do not prove programme-level CAS issuance.', now()
from programme p cross join sponsor s
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

insert into public.program_occupation_uk_staging (
  program_catalog_id, canonical_career_id, rule_version, match_basis, match_pattern,
  review_status, relation_type, source_checked_at, reviewer_note, reviewed_at
)
select p.id, 'environmental-scientist', 'uk-phase2-v1', 'official_program_title_and_career_evidence',
  'Environmental Science and the Climate Emergency -> Environmental Scientist', 'approved', 'direct_discipline',
  date '2026-08-09',
  'The degree is explicitly Environmental Science and prepares graduates for environmental management, environmental consultancy, research, laboratory work and data analysis.', now()
from public.program_catalog_uk_staging p
where p.source_name='Swansea University' and p.source_program_key='environmental-science-climate-emergency-bsc-f770'
on conflict (program_catalog_id, canonical_career_id) do update set
  rule_version=excluded.rule_version, match_basis=excluded.match_basis,
  match_pattern=excluded.match_pattern, review_status=excluded.review_status,
  relation_type=excluded.relation_type, source_checked_at=excluded.source_checked_at,
  reviewer_note=excluded.reviewer_note, reviewed_at=excluded.reviewed_at;