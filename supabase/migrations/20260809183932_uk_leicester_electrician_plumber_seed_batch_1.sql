with rows(source_program_key,source_program_name,title,qualification_title,field_category,official_program_url) as (
  values
  ('t-level-building-services-electrical-p00790-2026','T Level Building Services Engineering - Electrical Installation Specialism','Building Services Engineering - Electrical Installation Specialism','T Level Level 3','Electrical Installation','https://leicestercollege.ac.uk/courses/further-education/qualification/t-level-building-services-engineering-electrical-installation-specialism-P00790-2026-27'),
  ('t-level-building-services-plumbing-p00791-2026','T Level Building Services Engineering - Plumbing and Heating Engineering Specialism','Building Services Engineering - Plumbing and Heating Engineering Specialism','T Level Level 3','Plumbing and Heating Engineering','https://leicestercollege.ac.uk/courses/further-education/qualification/t-level-building-services-engineering-plumbing-and-heating-engineering-specialism-P00791-2026-27')
)
insert into public.program_catalog_uk_staging (
  source_name,source_program_key,institution_name,institution_id,ukprn,awarding_institution_id,delivery_institution_id,
  provider_relationship,source_program_name,title,qualification_title,native_framework,native_level_code,canonical_level,
  programme_type,field_category,city,campus,duration_months,study_mode,official_program_url,source_as_of,collection_status,verification_tier
)
select 'Leicester College',r.source_program_key,'Leicester College',null,null,null,null,'other',r.source_program_name,r.title,r.qualification_title,
  'RQF','3','BELOW_DEGREE','vocational',r.field_category,'Leicester','Freemen''s Park Campus',24,'Full-time',r.official_program_url,
  date '2026-08-09','official_2026_vocational_program_evidence_collected_provider_identity_pending','C'
from rows r
on conflict (source_name,source_program_key) do update set
  source_program_name=excluded.source_program_name,title=excluded.title,qualification_title=excluded.qualification_title,
  native_framework=excluded.native_framework,native_level_code=excluded.native_level_code,canonical_level=excluded.canonical_level,
  programme_type=excluded.programme_type,field_category=excluded.field_category,city=excluded.city,campus=excluded.campus,
  duration_months=excluded.duration_months,study_mode=excluded.study_mode,official_program_url=excluded.official_program_url,
  source_as_of=excluded.source_as_of,collection_status=excluded.collection_status,verification_tier=excluded.verification_tier;

with programmes as (
  select id,official_program_url from public.program_catalog_uk_staging
  where source_name='Leicester College' and source_program_key in ('t-level-building-services-electrical-p00790-2026','t-level-building-services-plumbing-p00791-2026')
)
insert into public.program_international_uk_staging (
  program_catalog_id,student_sponsor_record_id,student_sponsor_eligible,international_students_eligible,cas_eligibility,
  international_admission_status,visa_context,intake_label,intake_start_date,admission_source_url,international_source_url,
  source_as_of,verification_status,rule_notes,verified_at
)
select p.id,null,null,null,null,'closed_for_primary_2026_applications_reserve_list_only_student_route_unresolved',
  'The exact 2026 vocational T Level is verified, but Leicester College Student-route sponsorship for this course is not established. Primary September applications are closed; reserve-list applications may be submitted.',
  '7 September 2026',date '2026-09-07',p.official_program_url,p.official_program_url,date '2026-08-09',
  'official_2026_vocational_program_reserve_list_verified_international_status_unresolved',
  'No international eligibility or CAS is inferred. The programme provides vocational threshold competence/progression toward the occupation rather than full occupational competence.',now()
from programmes p
on conflict (program_catalog_id) do update set
  student_sponsor_record_id=excluded.student_sponsor_record_id,student_sponsor_eligible=excluded.student_sponsor_eligible,
  international_students_eligible=excluded.international_students_eligible,cas_eligibility=excluded.cas_eligibility,
  international_admission_status=excluded.international_admission_status,visa_context=excluded.visa_context,
  intake_label=excluded.intake_label,intake_start_date=excluded.intake_start_date,admission_source_url=excluded.admission_source_url,
  international_source_url=excluded.international_source_url,source_as_of=excluded.source_as_of,
  verification_status=excluded.verification_status,rule_notes=excluded.rule_notes,verified_at=excluded.verified_at;

with rows(source_program_key,career_id,match_pattern,reviewer_note) as (
  values
  ('t-level-building-services-electrical-p00790-2026','electrician','Electrical Installation T Level -> apprenticeship / occupational competence -> Electrician','Leicester College explicitly states the course is designed to pursue a career as an Electrician; it provides threshold competence but not full proof of occupational competence, so this is stored as progression rather than a direct qualification.'),
  ('t-level-building-services-plumbing-p00791-2026','plumber','Plumbing and Heating T Level -> apprenticeship / occupational competence -> Plumber','Leicester College explicitly states the course is designed to pursue a career as a Plumber and provides the fundamental plumbing/heating occupational specialism; stored as progression because final occupational competence is not established by the T Level alone.')
)
insert into public.program_occupation_uk_staging (
  program_catalog_id,canonical_career_id,rule_version,match_basis,match_pattern,review_status,relation_type,
  source_checked_at,reviewer_note,reviewed_at
)
select p.id,r.career_id,'uk-phase2-v1','official_vocational_program_progression_evidence',r.match_pattern,'approved','progression_pathway',
  date '2026-08-09',r.reviewer_note,now()
from rows r join public.program_catalog_uk_staging p on p.source_name='Leicester College' and p.source_program_key=r.source_program_key
on conflict (program_catalog_id,canonical_career_id) do update set
  rule_version=excluded.rule_version,match_basis=excluded.match_basis,match_pattern=excluded.match_pattern,
  review_status=excluded.review_status,relation_type=excluded.relation_type,source_checked_at=excluded.source_checked_at,
  reviewer_note=excluded.reviewer_note,reviewed_at=excluded.reviewed_at;