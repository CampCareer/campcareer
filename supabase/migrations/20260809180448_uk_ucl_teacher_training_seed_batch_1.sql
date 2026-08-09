with ucl as (
  select institution_id, ukprn from public.institution_identity_uk_v1 where slug='university-college-london'
)
insert into public.institution_student_sponsor_uk_staging (
  source_name,source_sponsor_key,sponsor_name,town_city,sponsor_type,sponsor_status,route,
  immigration_compliance,institution_id,ukprn,match_status,match_basis,source_url,source_as_of
)
select
  'UCL Student visa and CAS guidance','university-college-london|london|student-self-evidence',
  'University College London','London','Higher Education Institution (HEI)','Licensed Student visa sponsor with CAS process','Student',
  'institution_official_student_visa_and_cas_guidance',u.institution_id,u.ukprn,'matched',
  'official_institution_statement_plus_ukprn_identity',
  'https://www.ucl.ac.uk/study/immigration-and-visas/student-visas/confirmation-acceptance-studies',date '2026-08-09'
from ucl u
on conflict (source_name,source_sponsor_key) do update set
  sponsor_name=excluded.sponsor_name,town_city=excluded.town_city,sponsor_type=excluded.sponsor_type,
  sponsor_status=excluded.sponsor_status,route=excluded.route,immigration_compliance=excluded.immigration_compliance,
  institution_id=excluded.institution_id,ukprn=excluded.ukprn,match_status=excluded.match_status,
  match_basis=excluded.match_basis,source_url=excluded.source_url,source_as_of=excluded.source_as_of;

with ucl as (
  select institution_id, ukprn from public.institution_identity_uk_v1 where slug='university-college-london'
), rows(source_program_key,source_program_name,title,qualification_title,field_category,official_program_url) as (
  values
  ('early-years-eyitt-mainstream-pgce-2026','Early Years Initial Teacher Training (EYITT) (Mainstream Route)','Early Years Initial Teacher Training (EYITT) (Mainstream Route)','PGCE','Early Years Teacher Training','https://www.ucl.ac.uk/prospective-students/graduate/teacher-training-programmes/early-years-initial-teacher-training-eyitt-mainstream-route-pgce'),
  ('primary-pgce-2026','Primary PGCE','Primary PGCE','PGCE','Primary Teacher Training','https://www.ucl.ac.uk/prospective-students/graduate/teacher-training-programmes/primary-pgce'),
  ('science-biology-pgce-2026','Science: Biology PGCE','Science: Biology PGCE','PGCE','Secondary Teacher Training','https://www.ucl.ac.uk/prospective-students/graduate/teacher-training-programmes/science-biology-pgce')
)
insert into public.program_catalog_uk_staging (
  source_name,source_program_key,institution_name,institution_id,ukprn,awarding_institution_id,delivery_institution_id,
  provider_relationship,source_program_name,title,qualification_title,native_framework,native_level_code,canonical_level,
  programme_type,field_category,city,campus,duration_months,study_mode,official_program_url,official_qualification_url,
  source_as_of,collection_status,verification_tier
)
select
  'University College London',r.source_program_key,'University College London',u.institution_id,u.ukprn,u.institution_id,u.institution_id,
  'direct_award',r.source_program_name,r.title,r.qualification_title,'FHEQ','7','POSTGRADUATE_CERTIFICATE','teacher_training',
  r.field_category,'London','UCL Institute of Education / London placements',12,'Full-time',r.official_program_url,
  'https://www.gov.uk/what-different-qualification-levels-mean/list-of-qualification-levels',date '2026-08-09',
  'official_2026_teacher_training_evidence_collected','C'
from rows r cross join ucl u
on conflict (source_name,source_program_key) do update set
  institution_id=excluded.institution_id,ukprn=excluded.ukprn,awarding_institution_id=excluded.awarding_institution_id,
  delivery_institution_id=excluded.delivery_institution_id,provider_relationship=excluded.provider_relationship,
  source_program_name=excluded.source_program_name,title=excluded.title,qualification_title=excluded.qualification_title,
  native_framework=excluded.native_framework,native_level_code=excluded.native_level_code,canonical_level=excluded.canonical_level,
  programme_type=excluded.programme_type,field_category=excluded.field_category,city=excluded.city,campus=excluded.campus,
  duration_months=excluded.duration_months,study_mode=excluded.study_mode,official_program_url=excluded.official_program_url,
  official_qualification_url=excluded.official_qualification_url,source_as_of=excluded.source_as_of,
  collection_status=excluded.collection_status,verification_tier=excluded.verification_tier;

with sponsor as (
  select id from public.institution_student_sponsor_uk_staging
  where source_sponsor_key='university-college-london|london|student-self-evidence' and match_status='matched'
), rows(source_program_key,admission_status,rule_notes) as (
  values
  ('early-years-eyitt-mainstream-pgce-2026','closed_for_visa_required_applicants_after_2026_03_09','UCL lists overseas tuition and a September 2026 start, but applications for applicants requiring a visa closed 9 March 2026.'),
  ('primary-pgce-2026','closed_for_visa_required_applicants_after_2026_06_01','UCL lists overseas tuition and a September 2026 start, but applications for applicants requiring a visa closed 1 June 2026.'),
  ('science-biology-pgce-2026','closed_for_visa_required_applicants_after_2026_07_17','UCL lists overseas tuition, confirms the course is suitable for international students on a Student visa, and states visa-required applications closed 17 July 2026.')
)
insert into public.program_international_uk_staging (
  program_catalog_id,student_sponsor_record_id,student_sponsor_eligible,international_students_eligible,cas_eligibility,
  international_admission_status,visa_context,intake_label,intake_start_date,admission_source_url,international_source_url,
  sponsor_source_url,source_as_of,verification_status,rule_notes,verified_at
)
select p.id,s.id,true,true,null,r.admission_status,
  'UCL provides CAS as the Student visa sponsor after offer conditions are met. Current 2026 visa-required teacher-training deadlines are closed; exact programme-level CAS remains null.',
  'September 2026',null,p.official_program_url,p.official_program_url,
  'https://www.ucl.ac.uk/study/immigration-and-visas/student-visas/confirmation-acceptance-studies',date '2026-08-09',
  'official_2026_international_teacher_training_closed_deadline_verified_cas_unverified',r.rule_notes,now()
from rows r
join public.program_catalog_uk_staging p on p.source_name='University College London' and p.source_program_key=r.source_program_key
cross join sponsor s
on conflict (program_catalog_id) do update set
  student_sponsor_record_id=excluded.student_sponsor_record_id,student_sponsor_eligible=excluded.student_sponsor_eligible,
  international_students_eligible=excluded.international_students_eligible,cas_eligibility=excluded.cas_eligibility,
  international_admission_status=excluded.international_admission_status,visa_context=excluded.visa_context,
  intake_label=excluded.intake_label,intake_start_date=excluded.intake_start_date,admission_source_url=excluded.admission_source_url,
  international_source_url=excluded.international_source_url,sponsor_source_url=excluded.sponsor_source_url,
  source_as_of=excluded.source_as_of,verification_status=excluded.verification_status,rule_notes=excluded.rule_notes,verified_at=excluded.verified_at;

with links(source_program_key,canonical_career_id,match_basis,relation_type,match_pattern,reviewer_note) as (
  values
  ('early-years-eyitt-mainstream-pgce-2026','early-childhood-teacher','official_program_professional_status_evidence','professional_registration_pathway','EYITT PGCE -> Early Years Teacher Status -> Early Childhood Teacher','UCL states successful graduates are recommended for Early Years Teacher Status and specialise in teaching children aged 0-5.'),
  ('primary-pgce-2026','primary-school-teacher','official_program_title_and_teacher_training_evidence','professional_registration_pathway','Primary PGCE -> Primary School Teacher','UCL states the Primary PGCE develops the knowledge and classroom skills needed to become a primary teacher.'),
  ('science-biology-pgce-2026','secondary-school-teacher','official_program_title_and_teacher_training_evidence','professional_registration_pathway','Science Biology PGCE -> Secondary School Teacher','UCL states the Biology PGCE prepares students to teach the science curriculum to pupils aged 11-16 and Biology at A Level.')
)
insert into public.program_occupation_uk_staging (
  program_catalog_id,canonical_career_id,rule_version,match_basis,match_pattern,review_status,relation_type,
  source_checked_at,reviewer_note,reviewed_at
)
select p.id,l.canonical_career_id,'uk-phase2-v1',l.match_basis,l.match_pattern,'approved',l.relation_type,
  date '2026-08-09',l.reviewer_note,now()
from links l
join public.program_catalog_uk_staging p on p.source_name='University College London' and p.source_program_key=l.source_program_key
on conflict (program_catalog_id,canonical_career_id) do update set
  rule_version=excluded.rule_version,match_basis=excluded.match_basis,match_pattern=excluded.match_pattern,
  review_status=excluded.review_status,relation_type=excluded.relation_type,source_checked_at=excluded.source_checked_at,
  reviewer_note=excluded.reviewer_note,reviewed_at=excluded.reviewed_at;