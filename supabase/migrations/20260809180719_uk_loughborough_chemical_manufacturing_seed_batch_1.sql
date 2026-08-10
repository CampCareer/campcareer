with lboro as (
  select institution_id, ukprn from public.institution_identity_uk_v1 where slug='loughborough-university'
), rows(source_program_key,source_program_name,title,qualification_title,native_level_code,canonical_level,field_category,duration_months,official_program_url) as (
  values
  ('chemical-engineering-beng-h805-2026','Chemical Engineering','Chemical Engineering','BEng (Hons)','6','BACHELOR','Chemical Engineering',36,'https://course-archive.lboro.ac.uk/2026/undergraduate/courses/chemical-engineering-beng/index.html'),
  ('advanced-manufacturing-engineering-management-msc-2026','Advanced Manufacturing Engineering and Management','Advanced Manufacturing Engineering and Management','MSc','7','MASTER','Advanced Manufacturing Engineering',12,'https://www.lboro.ac.uk/study/postgraduate/masters-degrees/a-z/advanced-manufacturing-engineering-management/')
)
insert into public.program_catalog_uk_staging (
  source_name,source_program_key,institution_name,institution_id,ukprn,awarding_institution_id,delivery_institution_id,
  provider_relationship,source_program_name,title,qualification_title,native_framework,native_level_code,canonical_level,
  programme_type,field_category,city,campus,duration_months,study_mode,official_program_url,official_qualification_url,
  source_as_of,collection_status,verification_tier
)
select
  'Loughborough University',r.source_program_key,'Loughborough University',l.institution_id,l.ukprn,l.institution_id,l.institution_id,
  'direct_award',r.source_program_name,r.title,r.qualification_title,'FHEQ',r.native_level_code,r.canonical_level,'degree',
  r.field_category,'Loughborough','Loughborough campus',r.duration_months,'Full-time',r.official_program_url,
  'https://www.gov.uk/what-different-qualification-levels-mean/list-of-qualification-levels',date '2026-08-09',
  'official_2026_program_evidence_collected','C'
from rows r cross join lboro l
on conflict (source_name,source_program_key) do update set
  institution_id=excluded.institution_id,ukprn=excluded.ukprn,awarding_institution_id=excluded.awarding_institution_id,
  delivery_institution_id=excluded.delivery_institution_id,provider_relationship=excluded.provider_relationship,
  source_program_name=excluded.source_program_name,title=excluded.title,qualification_title=excluded.qualification_title,
  native_framework=excluded.native_framework,native_level_code=excluded.native_level_code,canonical_level=excluded.canonical_level,
  field_category=excluded.field_category,city=excluded.city,campus=excluded.campus,duration_months=excluded.duration_months,
  study_mode=excluded.study_mode,official_program_url=excluded.official_program_url,official_qualification_url=excluded.official_qualification_url,
  source_as_of=excluded.source_as_of,collection_status=excluded.collection_status,verification_tier=excluded.verification_tier;

with sponsor as (
  select id from public.institution_student_sponsor_uk_staging
  where source_sponsor_key='loughborough-university|loughborough|student' and match_status='matched'
), rows(source_program_key,admission_status,rule_notes) as (
  values
  ('chemical-engineering-beng-h805-2026','current_2026_program_international_fee_visible_admission_window_not_verified','The exact 2026 undergraduate course and international tuition are verified. Current application/Clearing availability is not established from the source used.'),
  ('advanced-manufacturing-engineering-management-msc-2026','open_2026_international_application_before_2026_08_24_deadline','Loughborough publishes a 24 August 2026 deadline for new international applications to September 2026 master programmes, so this programme is currently within the stated application window.')
)
insert into public.program_international_uk_staging (
  program_catalog_id,student_sponsor_record_id,student_sponsor_eligible,international_students_eligible,cas_eligibility,
  international_admission_status,visa_context,intake_label,intake_start_date,application_deadline,admission_source_url,
  international_source_url,sponsor_source_url,source_as_of,verification_status,rule_notes,verified_at
)
select p.id,s.id,true,true,null,r.admission_status,
  'Loughborough University is matched to current Student sponsor evidence and publishes Student visa/CAS guidance. Exact programme-level CAS remains unverified.',
  'September 2026',case when p.source_program_key='advanced-manufacturing-engineering-management-msc-2026' then date '2026-09-21' else null end,
  case when p.source_program_key='advanced-manufacturing-engineering-management-msc-2026' then date '2026-08-24' else null end,
  p.official_program_url,p.official_program_url,
  'https://www.lboro.ac.uk/services/student-services/topics/applying-for-student-visa-outside-of-uk/',date '2026-08-09',
  case when p.source_program_key='advanced-manufacturing-engineering-management-msc-2026'
    then 'official_2026_open_international_application_and_sponsor_evidence_verified_cas_unverified'
    else 'official_2026_international_program_and_sponsor_evidence_verified_admission_window_unverified_cas_unverified' end,
  r.rule_notes,now()
from rows r
join public.program_catalog_uk_staging p on p.source_name='Loughborough University' and p.source_program_key=r.source_program_key
cross join sponsor s
on conflict (program_catalog_id) do update set
  student_sponsor_record_id=excluded.student_sponsor_record_id,student_sponsor_eligible=excluded.student_sponsor_eligible,
  international_students_eligible=excluded.international_students_eligible,cas_eligibility=excluded.cas_eligibility,
  international_admission_status=excluded.international_admission_status,visa_context=excluded.visa_context,
  intake_label=excluded.intake_label,intake_start_date=excluded.intake_start_date,application_deadline=excluded.application_deadline,
  admission_source_url=excluded.admission_source_url,international_source_url=excluded.international_source_url,
  sponsor_source_url=excluded.sponsor_source_url,source_as_of=excluded.source_as_of,verification_status=excluded.verification_status,
  rule_notes=excluded.rule_notes,verified_at=excluded.verified_at;

with links(source_program_key,canonical_career_id,match_basis,relation_type,match_pattern,reviewer_note) as (
  values
  ('chemical-engineering-beng-h805-2026','chemical-engineer','official_program_title_and_professional_evidence','professional_engineering_pathway','Chemical Engineering BEng -> Chemical Engineer','Loughborough states the BEng provides the chemical engineering knowledge needed by industry and is IChemE accredited, putting graduates on a path toward professional chemical engineering practice.'),
  ('advanced-manufacturing-engineering-management-msc-2026','manufacturing-engineer','official_program_title_and_discipline_evidence','direct_discipline','Advanced Manufacturing Engineering and Management MSc -> Manufacturing Engineer','The MSc is explicitly focused on advanced manufacturing engineering, manufacturing processes and global manufacturing industries, preparing graduates for technology and management careers in manufacturing.')
)
insert into public.program_occupation_uk_staging (
  program_catalog_id,canonical_career_id,rule_version,match_basis,match_pattern,review_status,relation_type,
  source_checked_at,reviewer_note,reviewed_at
)
select p.id,l.canonical_career_id,'uk-phase2-v1',l.match_basis,l.match_pattern,'approved',l.relation_type,
  date '2026-08-09',l.reviewer_note,now()
from links l
join public.program_catalog_uk_staging p on p.source_name='Loughborough University' and p.source_program_key=l.source_program_key
on conflict (program_catalog_id,canonical_career_id) do update set
  rule_version=excluded.rule_version,match_basis=excluded.match_basis,match_pattern=excluded.match_pattern,
  review_status=excluded.review_status,relation_type=excluded.relation_type,source_checked_at=excluded.source_checked_at,
  reviewer_note=excluded.reviewer_note,reviewed_at=excluded.reviewed_at;