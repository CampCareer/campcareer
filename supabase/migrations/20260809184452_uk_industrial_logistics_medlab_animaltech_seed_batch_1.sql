with provider_rows(source_name,source_sponsor_key,sponsor_name,town_city,sponsor_type,sponsor_status,source_url) as (
  values
  ('University of Huddersfield Student visa guidance','university-of-huddersfield|huddersfield|student-self-evidence','University of Huddersfield','Huddersfield','Higher Education Institution (HEI)','Student sponsor with CAS process','https://www.hud.ac.uk/international/immigration/before-you-arrive/student-visa/'),
  ('University of Westminster Student visa guidance','university-of-westminster|london|student-self-evidence','University of Westminster','London','Higher Education Institution (HEI)','Licensed sponsor with a track record of compliance','https://www.westminster.ac.uk/international/visas-and-advice/visas'),
  ('University of Nottingham CAS guidance','university-of-nottingham|nottingham|student-self-evidence','University of Nottingham','Nottingham','Higher Education Institution (HEI)','Student sponsor with CAS process','https://www.nottingham.ac.uk/fabs/finance/frequentlyaskedquestions/cas-deposits.aspx')
)
insert into public.institution_student_sponsor_uk_staging (
  source_name,source_sponsor_key,sponsor_name,town_city,sponsor_type,sponsor_status,route,immigration_compliance,
  institution_id,ukprn,match_status,match_basis,source_url,source_as_of
)
select p.source_name,p.source_sponsor_key,p.sponsor_name,p.town_city,p.sponsor_type,p.sponsor_status,'Student',
  'institution_official_student_visa_and_cas_guidance',i.institution_id,i.ukprn,
  case when i.institution_id is null then 'candidate' else 'matched' end,
  case when i.institution_id is null then 'official_provider_identity_not_yet_in_canonical_institution_catalog' else 'official_institution_statement_plus_ukprn_identity' end,
  p.source_url,date '2026-08-09'
from provider_rows p
left join public.institution_identity_uk_v1 i on lower(i.canonical_name)=lower(p.sponsor_name)
on conflict (source_name,source_sponsor_key) do update set
  sponsor_name=excluded.sponsor_name,town_city=excluded.town_city,sponsor_type=excluded.sponsor_type,
  sponsor_status=excluded.sponsor_status,route=excluded.route,immigration_compliance=excluded.immigration_compliance,
  institution_id=excluded.institution_id,ukprn=excluded.ukprn,match_status=excluded.match_status,
  match_basis=excluded.match_basis,source_url=excluded.source_url,source_as_of=excluded.source_as_of;

with rows(source_name,source_program_key,institution_name,canonical_slug,provider_relationship,source_program_name,title,qualification_title,native_framework,native_level_code,canonical_level,programme_type,field_category,city,campus,duration_months,official_program_url) as (
  values
  ('University of Nottingham','industrial-engineering-operations-management-msc-2026','University of Nottingham','university-of-nottingham','direct_award','Industrial Engineering and Operations Management','Industrial Engineering and Operations Management','MSc','FHEQ','7','MASTER','degree','Industrial Engineering and Operations Management','Nottingham','University Park / Jubilee Campus',12,'https://www.nottingham.ac.uk/pgstudy/course/taught/industrial-engineering-and-operations-management-msc'),
  ('University of Westminster','logistics-supply-chain-management-msc-2026','University of Westminster',null,'direct_award','Logistics and Supply Chain Management','Logistics and Supply Chain Management','MSc','FHEQ','7','MASTER','degree','Logistics and Supply Chain Management','London','Marylebone Campus',12,'https://www.westminster.ac.uk/business-and-management-courses/2026-27/september/full-time/logistics-and-supply-chain-management-msc'),
  ('University of Huddersfield','biomedicine-bsc-2026','University of Huddersfield',null,'direct_award','Biomedicine','Biomedicine','BSc (Hons)','FHEQ','6','BACHELOR','degree','Biomedicine and Laboratory Sciences','Huddersfield','Queensgate Campus',36,'https://courses.hud.ac.uk/2026-27/undergraduate/biomedicine-bsc-hons/'),
  ('Bishop Burton College','applied-animal-health-welfare-fdsc-2026','Bishop Burton College',null,'other','Applied Animal Health and Welfare','Applied Animal Health and Welfare','FdSc / HTQ Vet Technician (Livestock)','FHEQ','5','FOUNDATION_DEGREE','degree','Animal Health and Welfare / Livestock Veterinary Technician','Bishop Burton','Bishop Burton Campus',24,'https://www.bishopburton.ac.uk/degree-level-courses/study/view-all-courses/fdsc-applied-animal-health-and-welfare')
)
insert into public.program_catalog_uk_staging (
  source_name,source_program_key,institution_name,institution_id,ukprn,awarding_institution_id,delivery_institution_id,
  provider_relationship,source_program_name,title,qualification_title,native_framework,native_level_code,canonical_level,
  programme_type,field_category,city,campus,duration_months,study_mode,official_program_url,official_qualification_url,
  source_as_of,collection_status,verification_tier
)
select r.source_name,r.source_program_key,r.institution_name,i.institution_id,i.ukprn,i.institution_id,i.institution_id,
  r.provider_relationship,r.source_program_name,r.title,r.qualification_title,r.native_framework,r.native_level_code,r.canonical_level,
  r.programme_type,r.field_category,r.city,r.campus,r.duration_months,'Full-time',r.official_program_url,
  'https://www.gov.uk/what-different-qualification-levels-mean/list-of-qualification-levels',date '2026-08-09',
  case when i.institution_id is null then 'official_2026_program_evidence_collected_provider_identity_pending' else 'official_2026_program_evidence_collected' end,'C'
from rows r left join public.institution_identity_uk_v1 i on i.slug=r.canonical_slug
on conflict (source_name,source_program_key) do update set
  institution_id=excluded.institution_id,ukprn=excluded.ukprn,awarding_institution_id=excluded.awarding_institution_id,
  delivery_institution_id=excluded.delivery_institution_id,provider_relationship=excluded.provider_relationship,
  source_program_name=excluded.source_program_name,title=excluded.title,qualification_title=excluded.qualification_title,
  native_framework=excluded.native_framework,native_level_code=excluded.native_level_code,canonical_level=excluded.canonical_level,
  programme_type=excluded.programme_type,field_category=excluded.field_category,city=excluded.city,campus=excluded.campus,
  duration_months=excluded.duration_months,study_mode=excluded.study_mode,official_program_url=excluded.official_program_url,
  official_qualification_url=excluded.official_qualification_url,source_as_of=excluded.source_as_of,
  collection_status=excluded.collection_status,verification_tier=excluded.verification_tier;

with rows(source_name,source_program_key,sponsor_key,student_sponsor_eligible,international_students_eligible,admission_status,intake_label,application_deadline,international_source_url,rule_notes) as (
  values
  ('University of Nottingham','industrial-engineering-operations-management-msc-2026','university-of-nottingham|nottingham|student-self-evidence',true,true,'current_2026_student_route_eligible_programme_application_window_not_verified','21 September 2026',null::date,'https://www.nottingham.ac.uk/pgstudy/course/taught/industrial-engineering-and-operations-management-msc','Nottingham publishes September 2026 full-time entry, international tuition and Student-route eligibility for the course. CAS deadlines extend into September, but the exact programme application deadline is not inferred.'),
  ('University of Westminster','logistics-supply-chain-management-msc-2026','university-of-westminster|london|student-self-evidence',true,true,'current_2026_full_time_international_programme_exact_deadline_not_verified','September 2026',null::date,'https://www.westminster.ac.uk/business-and-management-courses/2026-27/september/full-time/logistics-and-supply-chain-management-msc','Westminster publishes September 2026 full-time entry, international tuition and Student-visa sponsorship for eligible full-time courses. Exact closing date for this MSc is not inferred.'),
  ('University of Huddersfield','biomedicine-bsc-2026','university-of-huddersfield|huddersfield|student-self-evidence',true,true,'clearing_2026_available_primary_application_closed','September 2026',null::date,'https://courses.hud.ac.uk/2026-27/undergraduate/biomedicine-bsc-hons/','Huddersfield publishes 2026/27 international tuition and Clearing availability for the course and provides Student visa/CAS guidance. Primary applications are closed; Clearing is the current route.')
)
insert into public.program_international_uk_staging (
  program_catalog_id,student_sponsor_record_id,student_sponsor_eligible,international_students_eligible,cas_eligibility,
  international_admission_status,visa_context,intake_label,application_deadline,admission_source_url,international_source_url,
  sponsor_source_url,source_as_of,verification_status,rule_notes,verified_at
)
select p.id,s.id,r.student_sponsor_eligible,r.international_students_eligible,null,r.admission_status,
  'Provider-level Student visa sponsorship and CAS process are verified. Exact programme-level CAS remains unverified and null.',
  r.intake_label,r.application_deadline,p.official_program_url,r.international_source_url,s.source_url,date '2026-08-09',
  'official_2026_international_program_and_sponsor_evidence_verified_cas_unverified',r.rule_notes,now()
from rows r
join public.program_catalog_uk_staging p on p.source_name=r.source_name and p.source_program_key=r.source_program_key
join public.institution_student_sponsor_uk_staging s on s.source_sponsor_key=r.sponsor_key
on conflict (program_catalog_id) do update set
  student_sponsor_record_id=excluded.student_sponsor_record_id,student_sponsor_eligible=excluded.student_sponsor_eligible,
  international_students_eligible=excluded.international_students_eligible,cas_eligibility=excluded.cas_eligibility,
  international_admission_status=excluded.international_admission_status,visa_context=excluded.visa_context,
  intake_label=excluded.intake_label,application_deadline=excluded.application_deadline,admission_source_url=excluded.admission_source_url,
  international_source_url=excluded.international_source_url,sponsor_source_url=excluded.sponsor_source_url,
  source_as_of=excluded.source_as_of,verification_status=excluded.verification_status,rule_notes=excluded.rule_notes,verified_at=excluded.verified_at;

insert into public.program_international_uk_staging (
  program_catalog_id,student_sponsor_record_id,student_sponsor_eligible,international_students_eligible,cas_eligibility,
  international_admission_status,visa_context,intake_label,admission_source_url,international_source_url,
  source_as_of,verification_status,rule_notes,verified_at
)
select p.id,null,null,null,null,'current_september_2026_course_student_route_status_not_established',
  'The exact September 2026 Foundation Degree and HTQ Vet Technician (Livestock) award are verified. Student-route sponsorship and international eligibility for this provider/programme are not established from the official sources reviewed.',
  'September 2026',p.official_program_url,p.official_program_url,date '2026-08-09',
  'official_2026_program_verified_international_status_unresolved',
  'No international eligibility or CAS is inferred. Programme identity and occupation linkage remain independently usable for Phase 2.',now()
from public.program_catalog_uk_staging p
where p.source_name='Bishop Burton College' and p.source_program_key='applied-animal-health-welfare-fdsc-2026' -- gitleaks:allow (public course slug, not a credential)
on conflict (program_catalog_id) do update set
  student_sponsor_record_id=excluded.student_sponsor_record_id,student_sponsor_eligible=excluded.student_sponsor_eligible,
  international_students_eligible=excluded.international_students_eligible,cas_eligibility=excluded.cas_eligibility,
  international_admission_status=excluded.international_admission_status,visa_context=excluded.visa_context,
  intake_label=excluded.intake_label,admission_source_url=excluded.admission_source_url,
  international_source_url=excluded.international_source_url,source_as_of=excluded.source_as_of,
  verification_status=excluded.verification_status,rule_notes=excluded.rule_notes,verified_at=excluded.verified_at;

with links(source_name,source_program_key,canonical_career_id,match_basis,relation_type,match_pattern,reviewer_note) as (
  values
  ('University of Nottingham','industrial-engineering-operations-management-msc-2026','industrial-engineer','official_program_title_and_discipline_evidence','direct_discipline','Industrial Engineering and Operations Management MSc -> Industrial Engineer','The programme is explicitly an Industrial Engineering MSc and develops industrial engineering and operations management expertise for engineering-industry careers.'),
  ('University of Westminster','logistics-supply-chain-management-msc-2026','logistics-coordinator','official_program_career_evidence','direct_career_path','Logistics and Supply Chain Management MSc -> Logistics Coordinator','Westminster explicitly lists Logistics Coordinator among the graduate career options for the course.'),
  ('University of Huddersfield','biomedicine-bsc-2026','medical-laboratory-technician','official_program_career_evidence','direct_career_path','Biomedicine BSc -> Medical Laboratory Technician','Huddersfield lists Laboratory Technicians as career opportunities after the course and cites a graduate working as a Microbiology Medical Laboratory Technician.'),
  ('Bishop Burton College','applied-animal-health-welfare-fdsc-2026','animal-science-technician','official_program_award_and_title_evidence','direct_career_path','Applied Animal Health and Welfare FdSc -> HTQ Vet Technician (Livestock) -> Animal Science Technician','Bishop Burton states the programme awards the industry-recognised HTQ Vet Technician (Livestock) qualification and develops practical job-ready animal-health and livestock skills.')
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
