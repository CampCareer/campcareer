with rows(source_program_key,source_program_name,title,qualification_title,field_category,campus,official_program_url) as (
  values
  ('electrical-engineering-nc-scqf6-2026','Electrical Engineering','Electrical Engineering','NC','Electrical Engineering','Riverside Campus','https://www.cityofglasgowcollege.ac.uk/courses/nc-electrical-engineering-scqf-level-6-2026-08-24'),
  ('health-social-care-nc-scqf6-2026','Health and Social Care','Health and Social Care','NC','Health and Social Care','City Campus','https://www.cityofglasgowcollege.ac.uk/courses/nc-health-and-social-care-scqf-level-6-2026-08-24')
)
insert into public.program_catalog_uk_staging (
  source_name,source_program_key,institution_name,institution_id,ukprn,awarding_institution_id,delivery_institution_id,
  provider_relationship,source_program_name,title,qualification_title,native_framework,native_level_code,canonical_level,
  programme_type,field_category,city,campus,duration_months,study_mode,official_program_url,official_qualification_url,
  source_as_of,collection_status,verification_tier
)
select
  'City of Glasgow College',r.source_program_key,'City of Glasgow College',null,null,null,null,'unknown',
  r.source_program_name,r.title,r.qualification_title,'SCQF','6','BELOW_DEGREE','vocational',r.field_category,
  'Glasgow',r.campus,12,'Full-time',r.official_program_url,'https://scqf.org.uk/about-the-framework/interactive-framework/',
  date '2026-08-09','official_2026_vocational_program_evidence_collected_provider_identity_pending','C'
from rows r
on conflict (source_name,source_program_key) do update set
  source_program_name=excluded.source_program_name,title=excluded.title,qualification_title=excluded.qualification_title,
  native_framework=excluded.native_framework,native_level_code=excluded.native_level_code,canonical_level=excluded.canonical_level,
  programme_type=excluded.programme_type,field_category=excluded.field_category,city=excluded.city,campus=excluded.campus,
  duration_months=excluded.duration_months,study_mode=excluded.study_mode,official_program_url=excluded.official_program_url,
  official_qualification_url=excluded.official_qualification_url,source_as_of=excluded.source_as_of,
  collection_status=excluded.collection_status,verification_tier=excluded.verification_tier;

with sponsor as (
  select id from public.institution_student_sponsor_uk_staging
  where source_sponsor_key='city-of-glasgow-college|glasgow|student-self-evidence'
), programmes as (
  select id,official_program_url from public.program_catalog_uk_staging
  where source_name='City of Glasgow College' and source_program_key in (
    'electrical-engineering-nc-scqf6-2026','health-social-care-nc-scqf6-2026'
  )
)
insert into public.program_international_uk_staging (
  program_catalog_id,student_sponsor_record_id,student_sponsor_eligible,international_students_eligible,cas_eligibility,
  international_admission_status,visa_context,intake_label,intake_start_date,admission_source_url,international_source_url,
  sponsor_source_url,source_as_of,verification_status,rule_notes,verified_at
)
select p.id,s.id,true,true,null,'course_full_waiting_list_only_2026',
  'City of Glasgow College welcomes international applicants on SCQF 6+ courses and publishes Student visa/CAS guidance. These exact courses are full and waiting-list only; exact programme-level CAS remains null.',
  '24 August 2026',date '2026-08-24',p.official_program_url,p.official_program_url,
  'https://www.cityofglasgowcollege.ac.uk/international-students/visa-requirements',date '2026-08-09',
  'official_2026_international_vocational_program_waiting_list_verified_cas_unverified',
  'International eligibility is visible, but no open seat is inferred because the exact course page says COURSE FULL - WAITING LIST ONLY.',now()
from programmes p cross join sponsor s
on conflict (program_catalog_id) do update set
  student_sponsor_record_id=excluded.student_sponsor_record_id,student_sponsor_eligible=excluded.student_sponsor_eligible,
  international_students_eligible=excluded.international_students_eligible,cas_eligibility=excluded.cas_eligibility,
  international_admission_status=excluded.international_admission_status,visa_context=excluded.visa_context,
  intake_label=excluded.intake_label,intake_start_date=excluded.intake_start_date,admission_source_url=excluded.admission_source_url,
  international_source_url=excluded.international_source_url,sponsor_source_url=excluded.sponsor_source_url,
  source_as_of=excluded.source_as_of,verification_status=excluded.verification_status,rule_notes=excluded.rule_notes,verified_at=excluded.verified_at;

with links(source_program_key,canonical_career_id,match_basis,relation_type,match_pattern,reviewer_note) as (
  values
  ('electrical-engineering-nc-scqf6-2026','engineering-technician','official_program_title_and_career_evidence','direct_career_path','Electrical Engineering NC -> Engineering Technician','City of Glasgow explicitly describes the NC as technician-level training and a qualification supporting progression to technician or apprentice employment in electrical engineering.'),
  ('health-social-care-nc-scqf6-2026','care-worker','official_program_career_and_curriculum_evidence','direct_career_path','Health and Social Care NC -> Care Worker','City of Glasgow states the course provides knowledge and skills for a career in the care sector and explicitly teaches the roles and responsibilities of the care worker.')
)
insert into public.program_occupation_uk_staging (
  program_catalog_id,canonical_career_id,rule_version,match_basis,match_pattern,review_status,relation_type,
  source_checked_at,reviewer_note,reviewed_at
)
select p.id,l.canonical_career_id,'uk-phase2-v1',l.match_basis,l.match_pattern,'approved',l.relation_type,
  date '2026-08-09',l.reviewer_note,now()
from links l
join public.program_catalog_uk_staging p on p.source_name='City of Glasgow College' and p.source_program_key=l.source_program_key
on conflict (program_catalog_id,canonical_career_id) do update set
  rule_version=excluded.rule_version,match_basis=excluded.match_basis,match_pattern=excluded.match_pattern,
  review_status=excluded.review_status,relation_type=excluded.relation_type,source_checked_at=excluded.source_checked_at,
  reviewer_note=excluded.reviewer_note,reviewed_at=excluded.reviewed_at;