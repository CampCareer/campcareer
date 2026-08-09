with providers(slug,source_name,source_sponsor_key,sponsor_name,town_city,sponsor_status,source_url) as (
  values
  ('university-of-york','University of York CAS guidance','university-of-york|york|student-self-evidence','University of York','York','Student visa sponsor with CAS process','https://www.york.ac.uk/students/studying/student-visa/cas/'),
  ('university-of-strathclyde','University of Strathclyde CAS guidance','university-of-strathclyde|glasgow|student-self-evidence','University of Strathclyde','Glasgow','Higher Education Provider with a track record of compliance','https://www.strath.ac.uk/professionalservices/studentexperience/admissions/confirmationofacceptanceforstudiescas/'),
  ('ulster-university','Ulster University Student visa and CAS guidance','ulster-university|belfast|student-self-evidence','Ulster University','Belfast','Student sponsor with CAS process','https://www.ulster.ac.uk/global/apply/visas-and-immigration/i-need-a-tier-4-visa')
)
insert into public.institution_student_sponsor_uk_staging (
  source_name,source_sponsor_key,sponsor_name,town_city,sponsor_type,sponsor_status,route,
  immigration_compliance,institution_id,ukprn,match_status,match_basis,source_url,source_as_of
)
select p.source_name,p.source_sponsor_key,p.sponsor_name,p.town_city,'Higher Education Institution (HEI)',p.sponsor_status,'Student',
  'institution_official_student_visa_and_cas_guidance',i.institution_id,i.ukprn,'matched',
  'official_institution_statement_plus_ukprn_identity',p.source_url,date '2026-08-09'
from providers p join public.institution_identity_uk_v1 i on i.slug=p.slug
on conflict (source_name,source_sponsor_key) do update set
  sponsor_name=excluded.sponsor_name,town_city=excluded.town_city,sponsor_type=excluded.sponsor_type,
  sponsor_status=excluded.sponsor_status,route=excluded.route,immigration_compliance=excluded.immigration_compliance,
  institution_id=excluded.institution_id,ukprn=excluded.ukprn,match_status=excluded.match_status,
  match_basis=excluded.match_basis,source_url=excluded.source_url,source_as_of=excluded.source_as_of;

with rows(slug,source_name,source_program_key,source_program_name,title,qualification_title,native_framework,native_level_code,canonical_level,field_category,city,campus,duration_months,official_program_url) as (
  values
  ('university-of-york','University of York','human-centred-interactive-technologies-msc-2026','Human-Centred Interactive Technologies','Human-Centred Interactive Technologies','MSc','FHEQ','7','MASTER','User Experience and Human-Computer Interaction','York','University of York',12,'https://www.york.ac.uk/study/postgraduate-taught/courses/msc-human-centred-interactive-technologies/'),
  ('university-of-strathclyde','University of Strathclyde','information-management-msc-2026','Information Management','Information Management','MSc','SCQF','11','MASTER','Information Management','Glasgow','Glasgow city-centre campus',12,'https://www.strath.ac.uk/courses/postgraduatetaught/informationmanagement/'),
  ('ulster-university','Ulster University','computing-technologies-bsc-g500-2026','Computing Technologies','Computing Technologies','BSc (Hons)','FHEQ','6','BACHELOR','Computing Technologies','Belfast','Belfast campus',48,'https://www.ulster.ac.uk/courses/202627/computing-technologies-41239')
)
insert into public.program_catalog_uk_staging (
  source_name,source_program_key,institution_name,institution_id,ukprn,awarding_institution_id,delivery_institution_id,
  provider_relationship,source_program_name,title,qualification_title,native_framework,native_level_code,canonical_level,
  programme_type,field_category,city,campus,duration_months,study_mode,official_program_url,official_qualification_url,
  source_as_of,collection_status,verification_tier
)
select r.source_name,r.source_program_key,i.canonical_name,i.institution_id,i.ukprn,i.institution_id,i.institution_id,
  'direct_award',r.source_program_name,r.title,r.qualification_title,r.native_framework,r.native_level_code,r.canonical_level,
  'degree',r.field_category,r.city,r.campus,r.duration_months,'Full-time',r.official_program_url,
  case when r.native_framework='SCQF' then 'https://scqf.org.uk/about-the-framework/interactive-framework/' else 'https://www.gov.uk/what-different-qualification-levels-mean/list-of-qualification-levels' end,
  date '2026-08-09','official_2026_digital_program_evidence_collected','C'
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

with rows(source_name,source_program_key,sponsor_key,admission_status,intake_label,intake_start_date,application_deadline,international_source_url,rule_notes) as (
  values
  ('University of York','human-centred-interactive-technologies-msc-2026','university-of-york|york|student-self-evidence','current_2026_application_form_visible_exact_admission_deadline_not_verified','September 2026',null::date,null::date,'https://www.york.ac.uk/study/postgraduate/courses/apply?course=DPMHCISHCI1&level=postgraduate','York has a live September 2026 application form for the MSc and a CAS request deadline of 2 September 2026. Exact programme admissions close date is not inferred from the CAS deadline.'),
  ('University of Strathclyde','information-management-msc-2026','university-of-strathclyde|glasgow|student-self-evidence','open_until_2026_08_14_for_standard_international_applicants_selected_country_deadline_passed','September 2026',null::date,date '2026-08-14','https://www.strath.ac.uk/studywithus/postgraduatetaught/applicationdeadlines/','Strathclyde publishes a 14 August 2026 deadline for most international applicants and a 31 July deadline for selected enhanced-readiness countries. Current date is within the standard deadline only.'),
  ('Ulster University','computing-technologies-bsc-g500-2026','ulster-university|belfast|student-self-evidence','current_2026_international_portal_visible_exact_deadline_not_verified','September 2026',null::date,null::date,'https://www.ulster.ac.uk/courses/202627/computing-technologies-41239','The exact 2026/27 course exposes an International Portal, international entry requirements and an international fee. Exact closing date is not inferred.')
)
insert into public.program_international_uk_staging (
  program_catalog_id,student_sponsor_record_id,student_sponsor_eligible,international_students_eligible,cas_eligibility,
  international_admission_status,visa_context,intake_label,intake_start_date,application_deadline,admission_source_url,
  international_source_url,sponsor_source_url,source_as_of,verification_status,rule_notes,verified_at
)
select p.id,s.id,true,true,null,r.admission_status,
  'Institution-level Student visa sponsorship and CAS process are verified from the provider. Exact programme-level CAS remains unverified and is not inferred.',
  r.intake_label,r.intake_start_date,r.application_deadline,p.official_program_url,r.international_source_url,s.source_url,
  date '2026-08-09','official_2026_international_application_and_sponsor_evidence_verified_cas_unverified',r.rule_notes,now()
from rows r
join public.program_catalog_uk_staging p on p.source_name=r.source_name and p.source_program_key=r.source_program_key
join public.institution_student_sponsor_uk_staging s on s.source_sponsor_key=r.sponsor_key and s.match_status='matched'
on conflict (program_catalog_id) do update set
  student_sponsor_record_id=excluded.student_sponsor_record_id,student_sponsor_eligible=excluded.student_sponsor_eligible,
  international_students_eligible=excluded.international_students_eligible,cas_eligibility=excluded.cas_eligibility,
  international_admission_status=excluded.international_admission_status,visa_context=excluded.visa_context,
  intake_label=excluded.intake_label,intake_start_date=excluded.intake_start_date,application_deadline=excluded.application_deadline,
  admission_source_url=excluded.admission_source_url,international_source_url=excluded.international_source_url,
  sponsor_source_url=excluded.sponsor_source_url,source_as_of=excluded.source_as_of,verification_status=excluded.verification_status,
  rule_notes=excluded.rule_notes,verified_at=excluded.verified_at;

with links(source_name,source_program_key,canonical_career_id,match_basis,relation_type,match_pattern,reviewer_note) as (
  values
  ('University of York','human-centred-interactive-technologies-msc-2026','ux-designer','official_program_title_and_career_evidence','direct_career_path','Human-Centred Interactive Technologies MSc -> UX Designer','York states the MSc prepares graduates for careers in user experience design and research industries and trains user-centred UX research/design methods.'),
  ('University of Strathclyde','information-management-msc-2026','database-administrator','official_program_career_evidence','direct_career_path','Information Management MSc -> Database Administrator','Strathclyde explicitly lists Database Administrator/Analyst (DBA) among graduate roles and teaches Database & Web Systems Development.'),
  ('Ulster University','computing-technologies-bsc-g500-2026','ict-support-technician','official_program_career_evidence','direct_career_path','Computing Technologies BSc -> ICT Support Technician','Ulster explicitly lists Technical Support and describes database administration and technical-support careers in IT departments; mapped to the canonical ICT support technician product career.')
)
insert into public.program_occupation_uk_staging (
  program_catalog_id,canonical_career_id,rule_version,match_basis,match_pattern,review_status,relation_type,
  source_checked_at,reviewer_note,reviewed_at
)
select p.id,l.canonical_career_id,'uk-phase2-v1',l.match_basis,l.match_pattern,'approved',l.relation_type,
  date '2026-08-09',l.reviewer_note,now()
from links l
join public.program_catalog_uk_staging p on p.source_name=l.source_name and p.source_program_key=l.source_program_key
on conflict (program_catalog_id,canonical_career_id) do update set
  rule_version=excluded.rule_version,match_basis=excluded.match_basis,match_pattern=excluded.match_pattern,
  review_status=excluded.review_status,relation_type=excluded.relation_type,source_checked_at=excluded.source_checked_at,
  reviewer_note=excluded.reviewer_note,reviewed_at=excluded.reviewed_at;