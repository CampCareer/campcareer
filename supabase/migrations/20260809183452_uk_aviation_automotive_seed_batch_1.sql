with providers(source_name,source_sponsor_key,sponsor_name,town_city,sponsor_type,sponsor_status,source_url) as (
  values
  ('University of South Wales visa guidance','university-of-south-wales|pontypridd|student-self-evidence','University of South Wales','Pontypridd','Higher Education Institution (HEI)','Student visa sponsor with CAS process','https://www.southwales.ac.uk/international/visas-and-pre-arrival/visa-applications/'),
  ('Kingston University CAS guidance','kingston-university|kingston-upon-thames|student-self-evidence','Kingston University London','Kingston upon Thames','Higher Education Institution (HEI)','Student visa sponsor with CAS process','https://www.kingston.ac.uk/study/international-students/visas-immigration-and-cas/confirmation-of-acceptance-for-studies')
)
insert into public.institution_student_sponsor_uk_staging (
  source_name,source_sponsor_key,sponsor_name,town_city,sponsor_type,sponsor_status,route,immigration_compliance,
  institution_id,ukprn,match_status,match_basis,source_url,source_as_of
)
select p.source_name,p.source_sponsor_key,p.sponsor_name,p.town_city,p.sponsor_type,p.sponsor_status,'Student',
  'institution_official_student_visa_and_cas_guidance',null,null,'candidate',
  'official_provider_identity_not_yet_in_canonical_institution_catalog',p.source_url,date '2026-08-09'
from providers p
on conflict (source_name,source_sponsor_key) do update set
  sponsor_name=excluded.sponsor_name,town_city=excluded.town_city,sponsor_type=excluded.sponsor_type,
  sponsor_status=excluded.sponsor_status,route=excluded.route,immigration_compliance=excluded.immigration_compliance,
  match_status=excluded.match_status,match_basis=excluded.match_basis,source_url=excluded.source_url,source_as_of=excluded.source_as_of;

with rows(source_name,source_program_key,institution_name,provider_relationship,source_program_name,title,qualification_title,native_framework,native_level_code,canonical_level,programme_type,field_category,city,campus,duration_months,official_program_url,official_qualification_url) as (
  values
  ('University of South Wales','aircraft-maintenance-engineering-bsc-h402-2026','University of South Wales','direct_award','Aircraft Maintenance Engineering','Aircraft Maintenance Engineering','BSc (Hons)','FHEQ','6','BACHELOR','degree','Aircraft Maintenance Engineering','Pontypridd','Pontypridd Campus',36,'https://www.southwales.ac.uk/courses/bsc-hons-aircraft-maintenance-engineering/','https://www.caa.co.uk/commercial-industry/aircraft/airworthiness/engineer-licences/'),
  ('Kingston University London','aviation-operations-commercial-pilot-training-bsc-2026','Kingston University London','direct_award','Aviation Operations with Commercial Pilot Training','Aviation Operations with Commercial Pilot Training','BSc (Hons)','FHEQ','6','BACHELOR','degree','Commercial Pilot Training and Aviation Operations','Kingston upon Thames','Kingston University',36,'https://www.kingston.ac.uk/study/undergraduate/aviation-operations-with-commercial-pilot-training-bsc-hons','https://www.caa.co.uk/commercial-industry/pilot-licences/'),
  ('Leicester College','light-vehicle-maintenance-repair-level3-p00229-2026','Leicester College','other','IMI Light Vehicle Maintenance and Repair Diploma Level 3','Light Vehicle Maintenance and Repair','IMI Level 3 Diploma','RQF','3','BELOW_DEGREE','vocational','Light Vehicle Maintenance and Repair','Leicester','Abbey Park Campus',12,'https://leicestercollege.ac.uk/courses/further-education/qualification/motor-vehicle-maintenance-and-repair-diploma-level-3-p00229-2026-27','https://tide.theimi.org.uk/learn/qualifications')
)
insert into public.program_catalog_uk_staging (
  source_name,source_program_key,institution_name,institution_id,ukprn,awarding_institution_id,delivery_institution_id,
  provider_relationship,source_program_name,title,qualification_title,native_framework,native_level_code,canonical_level,
  programme_type,field_category,city,campus,duration_months,study_mode,official_program_url,official_qualification_url,
  source_as_of,collection_status,verification_tier
)
select r.source_name,r.source_program_key,r.institution_name,null,null,null,null,r.provider_relationship,
  r.source_program_name,r.title,r.qualification_title,r.native_framework,r.native_level_code,r.canonical_level,
  r.programme_type,r.field_category,r.city,r.campus,r.duration_months,'Full-time',r.official_program_url,r.official_qualification_url,
  date '2026-08-09','official_2026_program_evidence_collected_provider_identity_pending','C'
from rows r
on conflict (source_name,source_program_key) do update set
  institution_name=excluded.institution_name,provider_relationship=excluded.provider_relationship,
  source_program_name=excluded.source_program_name,title=excluded.title,qualification_title=excluded.qualification_title,
  native_framework=excluded.native_framework,native_level_code=excluded.native_level_code,canonical_level=excluded.canonical_level,
  programme_type=excluded.programme_type,field_category=excluded.field_category,city=excluded.city,campus=excluded.campus,
  duration_months=excluded.duration_months,study_mode=excluded.study_mode,official_program_url=excluded.official_program_url,
  official_qualification_url=excluded.official_qualification_url,source_as_of=excluded.source_as_of,
  collection_status=excluded.collection_status,verification_tier=excluded.verification_tier;

with rows(source_name,source_program_key,sponsor_key,student_sponsor_eligible,international_students_eligible,admission_status,intake_label,intake_start_date,international_source_url,rule_notes) as (
  values
  ('University of South Wales','aircraft-maintenance-engineering-bsc-h402-2026','university-of-south-wales|pontypridd|student-self-evidence',true,true,'open_through_clearing_2026_international_direct_apply_visible','September 2026',null::date,'https://www.southwales.ac.uk/courses/bsc-hons-aircraft-maintenance-engineering/','The exact course has 2026 Clearing places, international tuition, welcomes international applications and provides a September 2026 direct application route. USW can issue CAS after its CAS assessment process; exact programme-level CAS remains null.'),
  ('Kingston University London','aviation-operations-commercial-pilot-training-bsc-2026','kingston-university|kingston-upon-thames|student-self-evidence',true,true,'open_through_clearing_2026_international_fee_visible','September 2026',null::date,'https://www.kingston.ac.uk/study/undergraduate/aviation-operations-with-commercial-pilot-training-bsc-hons','The exact course is in 2026 Clearing, publishes international tuition and an international scholarship for September 2026. Kingston publishes a Student visa/CAS process; exact programme-level CAS remains null.')
)
insert into public.program_international_uk_staging (
  program_catalog_id,student_sponsor_record_id,student_sponsor_eligible,international_students_eligible,cas_eligibility,
  international_admission_status,visa_context,intake_label,intake_start_date,admission_source_url,international_source_url,
  sponsor_source_url,source_as_of,verification_status,rule_notes,verified_at
)
select p.id,s.id,r.student_sponsor_eligible,r.international_students_eligible,null,r.admission_status,
  'Provider-level Student visa sponsorship and CAS process are verified from official provider guidance. Provider canonical identity is still pending and exact programme-level CAS remains unverified.',
  r.intake_label,r.intake_start_date,p.official_program_url,r.international_source_url,s.source_url,date '2026-08-09',
  'official_2026_open_international_program_and_provider_sponsor_evidence_verified_cas_unverified',r.rule_notes,now()
from rows r
join public.program_catalog_uk_staging p on p.source_name=r.source_name and p.source_program_key=r.source_program_key
join public.institution_student_sponsor_uk_staging s on s.source_sponsor_key=r.sponsor_key
on conflict (program_catalog_id) do update set
  student_sponsor_record_id=excluded.student_sponsor_record_id,student_sponsor_eligible=excluded.student_sponsor_eligible,
  international_students_eligible=excluded.international_students_eligible,cas_eligibility=excluded.cas_eligibility,
  international_admission_status=excluded.international_admission_status,visa_context=excluded.visa_context,
  intake_label=excluded.intake_label,intake_start_date=excluded.intake_start_date,admission_source_url=excluded.admission_source_url,
  international_source_url=excluded.international_source_url,sponsor_source_url=excluded.sponsor_source_url,
  source_as_of=excluded.source_as_of,verification_status=excluded.verification_status,
  rule_notes=excluded.rule_notes,verified_at=excluded.verified_at;

insert into public.program_international_uk_staging (
  program_catalog_id,student_sponsor_record_id,student_sponsor_eligible,international_students_eligible,cas_eligibility,
  international_admission_status,visa_context,intake_label,intake_start_date,admission_source_url,international_source_url,
  sponsor_source_url,source_as_of,verification_status,rule_notes,verified_at
)
select p.id,null,null,null,null,'current_2026_course_apply_route_visible_student_sponsorship_not_established',
  'The exact vocational course and 2026 application route are verified, but Leicester College Student-route sponsorship for this programme is not established from the official sources reviewed. International eligibility remains unknown.',
  '7 September 2026',date '2026-09-07',p.official_program_url,p.official_program_url,null,date '2026-08-09',
  'official_2026_vocational_program_verified_international_status_unresolved',
  'This is an exact IMI Level 3 automotive maintenance programme leading toward Motor Vehicle Technician work. No Student-route eligibility or CAS is inferred.',now()
from public.program_catalog_uk_staging p
where p.source_name='Leicester College' and p.source_program_key='light-vehicle-maintenance-repair-level3-p00229-2026'
on conflict (program_catalog_id) do update set
  student_sponsor_record_id=excluded.student_sponsor_record_id,student_sponsor_eligible=excluded.student_sponsor_eligible,
  international_students_eligible=excluded.international_students_eligible,cas_eligibility=excluded.cas_eligibility,
  international_admission_status=excluded.international_admission_status,visa_context=excluded.visa_context,
  intake_label=excluded.intake_label,intake_start_date=excluded.intake_start_date,admission_source_url=excluded.admission_source_url,
  international_source_url=excluded.international_source_url,sponsor_source_url=excluded.sponsor_source_url,
  source_as_of=excluded.source_as_of,verification_status=excluded.verification_status,
  rule_notes=excluded.rule_notes,verified_at=excluded.verified_at;

with links(source_name,source_program_key,canonical_career_id,match_basis,relation_type,match_pattern,reviewer_note) as (
  values
  ('University of South Wales','aircraft-maintenance-engineering-bsc-h402-2026','aircraft-maintenance-technician','official_program_title_professional_licence_and_career_evidence','professional_registration_pathway','Aircraft Maintenance Engineering BSc -> Part-66 maintenance licence -> Aircraft Maintenance Technician','USW explicitly trains for aircraft maintenance, is CAA accredited/EASA approved, counts toward an aircraft maintenance licence and prepares graduates to work directly on aircraft.'),
  ('Kingston University London','aviation-operations-commercial-pilot-training-bsc-2026','commercial-pilot','official_program_title_ATPL_and_career_evidence','professional_registration_pathway','Commercial Pilot Training BSc -> ATPL theory/flight training -> Commercial Pilot','Kingston explicitly prepares students for EASA/UK CAA ATPL theory and states graduates with the degree and frozen ATPL can apply for commercial-pilot employment.'),
  ('Leicester College','light-vehicle-maintenance-repair-level3-p00229-2026','automotive-service-technician','official_vocational_program_career_evidence','direct_career_path','IMI Level 3 Light Vehicle Maintenance and Repair -> Motor Vehicle Technician','Leicester College states the exact Level 3 programme develops advanced diagnostics and repair skills and supports progression into employment as a Motor Vehicle Technician.')
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