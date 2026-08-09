with rows(slug,source_name,source_program_key,source_program_name,title,qualification_title,native_framework,native_level_code,canonical_level,programme_type,field_category,city,campus,duration_months,official_program_url) as (
  values
  ('lancaster-university','Lancaster University','ecology-conservation-msci-c184-2026','Ecology and Conservation','Ecology and Conservation','MSci (Hons)','FHEQ','7','INTEGRATED_MASTER','degree','Ecology, Conservation and Sustainability','Lancaster','Lancaster University',48,'https://www.lancaster.ac.uk/study/undergraduate/courses/ecology-and-conservation-msci-hons-c184/2026/'),
  ('university-of-reading','University of Reading','primary-pgce-special-educational-needs-2vd7-2026','Primary PGCE with Special Educational Needs (SEN)','Primary PGCE with Special Educational Needs (SEN)','PGCE','FHEQ','7','POSTGRADUATE_CERTIFICATE','teacher_training','Special Educational Needs Teacher Training','Reading','Institute of Education / mainstream and special-school placements',10,'https://www.reading.ac.uk/ready-to-study/study/2026/education-pg/pgce-primary-special-educational-needs')
)
insert into public.program_catalog_uk_staging (
  source_name,source_program_key,institution_name,institution_id,ukprn,awarding_institution_id,delivery_institution_id,
  provider_relationship,source_program_name,title,qualification_title,native_framework,native_level_code,canonical_level,
  programme_type,field_category,city,campus,duration_months,study_mode,official_program_url,official_qualification_url,
  source_as_of,collection_status,verification_tier
)
select r.source_name,r.source_program_key,i.canonical_name,i.institution_id,i.ukprn,i.institution_id,i.institution_id,
  'direct_award',r.source_program_name,r.title,r.qualification_title,r.native_framework,r.native_level_code,r.canonical_level,
  r.programme_type,r.field_category,r.city,r.campus,r.duration_months,'Full-time',r.official_program_url,
  'https://www.gov.uk/what-different-qualification-levels-mean/list-of-qualification-levels',date '2026-08-09',
  'official_2026_program_career_and_admission_evidence_collected','C'
from rows r join public.institution_identity_uk_v1 i on i.slug=r.slug
on conflict (source_name,source_program_key) do update set
  institution_id=excluded.institution_id,ukprn=excluded.ukprn,awarding_institution_id=excluded.awarding_institution_id,
  delivery_institution_id=excluded.delivery_institution_id,provider_relationship=excluded.provider_relationship,
  source_program_name=excluded.source_program_name,title=excluded.title,qualification_title=excluded.qualification_title,
  native_framework=excluded.native_framework,native_level_code=excluded.native_level_code,canonical_level=excluded.canonical_level,
  programme_type=excluded.programme_type,field_category=excluded.field_category,city=excluded.city,campus=excluded.campus,
  duration_months=excluded.duration_months,study_mode=excluded.study_mode,official_program_url=excluded.official_program_url,
  official_qualification_url=excluded.official_qualification_url,source_as_of=excluded.source_as_of,
  collection_status=excluded.collection_status,verification_tier=excluded.verification_tier;

with rows(source_name,source_program_key,sponsor_key,international_students_eligible,admission_status,intake_label,international_source_url,rule_notes) as (
  values
  ('Lancaster University','ecology-conservation-msci-c184-2026','lancaster-university|lancaster|student',true,'open_through_clearing_2026_international_fee_visible','2026/27','https://www.lancaster.ac.uk/study/undergraduate/courses/ecology-and-conservation-msci-hons-c184/2026/','Lancaster lists Clearing vacancies for this exact 2026 course, publishes a 2026/27 international fee, and provides Student visa/CAS guidance. Exact programme-level CAS remains unverified.'),
  ('University of Reading','primary-pgce-special-educational-needs-2vd7-2026','university-of-reading|reading|student-self-evidence',true,'closed_no_longer_taking_2026_27_applications','2026/27','https://www.reading.ac.uk/ready-to-study/study/2026/education-pg/pgce-primary-special-educational-needs','Reading explicitly states this 2026/27 PGCE is closed and no longer taking applications. The exact course publishes an international student fee and international English support, so international programme eligibility is retained while admission is closed.')
)
insert into public.program_international_uk_staging (
  program_catalog_id,student_sponsor_record_id,student_sponsor_eligible,international_students_eligible,cas_eligibility,
  international_admission_status,visa_context,intake_label,admission_source_url,international_source_url,
  sponsor_source_url,source_as_of,verification_status,rule_notes,verified_at
)
select p.id,s.id,true,r.international_students_eligible,null,r.admission_status,
  'Institution-level Student sponsorship and CAS processes are verified. Exact programme-level CAS remains unverified and null.',
  r.intake_label,p.official_program_url,r.international_source_url,s.source_url,date '2026-08-09',
  'official_2026_international_program_and_current_admission_evidence_verified_cas_unverified',r.rule_notes,now()
from rows r
join public.program_catalog_uk_staging p on p.source_name=r.source_name and p.source_program_key=r.source_program_key
join public.institution_student_sponsor_uk_staging s on s.source_sponsor_key=r.sponsor_key and s.match_status='matched'
on conflict (program_catalog_id) do update set
  student_sponsor_record_id=excluded.student_sponsor_record_id,student_sponsor_eligible=excluded.student_sponsor_eligible,
  international_students_eligible=excluded.international_students_eligible,cas_eligibility=excluded.cas_eligibility,
  international_admission_status=excluded.international_admission_status,visa_context=excluded.visa_context,
  intake_label=excluded.intake_label,admission_source_url=excluded.admission_source_url,
  international_source_url=excluded.international_source_url,sponsor_source_url=excluded.sponsor_source_url,
  source_as_of=excluded.source_as_of,verification_status=excluded.verification_status,
  rule_notes=excluded.rule_notes,verified_at=excluded.verified_at;

with links(source_name,source_program_key,canonical_career_id,match_basis,relation_type,match_pattern,reviewer_note) as (
  values
  ('Lancaster University','ecology-conservation-msci-c184-2026','sustainability-specialist','official_program_career_evidence','direct_career_path','Ecology and Conservation MSci -> Environmental Sustainability Specialist','Lancaster explicitly lists Environmental Sustainability Specialist among graduate roles from this course.'),
  ('University of Reading','primary-pgce-special-educational-needs-2vd7-2026','special-education-teacher','official_program_professional_status_evidence','professional_registration_pathway','Primary PGCE with SEN -> QTS -> Special Education Teacher','Reading states the pathway awards QTS and qualifies graduates to teach children aged 5 to 11 with disabilities, including placements in special schools and mainstream settings with specialist resources.')
)
insert into public.program_occupation_uk_staging (
  program_catalog_id,canonical_career_id,rule_version,match_basis,match_pattern,review_status,relation_type,
  source_checked_at,reviewer_note,reviewed_at
)
select p.id,l.canonical_career_id,'uk-phase2-v1',l.match_basis,l.match_pattern,'approved',l.relation_type,
  date '2026-08-09',l.reviewer_note,now()
from links l join public.program_catalog_uk_staging p on p.source_name=l.source_name and p.source_program_key=l.source_program_key
on conflict (program_catalog_id,canonical_career_id) do update set
  rule_version=excluded.rule_version,match_basis=excluded.match_basis,match_pattern=excluded.match_pattern,
  review_status=excluded.review_status,relation_type=excluded.relation_type,source_checked_at=excluded.source_checked_at,
  reviewer_note=excluded.reviewer_note,reviewed_at=excluded.reviewed_at;