with leicester as (
  select institution_id, ukprn from public.institution_identity_uk_v1 where slug='university-of-leicester'
)
insert into public.institution_student_sponsor_uk_staging (
  source_name,source_sponsor_key,sponsor_name,town_city,sponsor_type,sponsor_status,route,
  immigration_compliance,institution_id,ukprn,match_status,match_basis,source_url,source_as_of
)
select
  'University of Leicester Student visa guidance','university-of-leicester|leicester|student-self-evidence',
  'University of Leicester','Leicester','Higher Education Institution (HEI)','Student sponsor - track record','Student',
  'institution_official_student_route_sponsor_and_cas_guidance',l.institution_id,l.ukprn,'matched',
  'official_institution_statement_plus_ukprn_identity','https://le.ac.uk/study/international-students/applying-for-visa',date '2026-08-09'
from leicester l
on conflict (source_name,source_sponsor_key) do update set
  sponsor_name=excluded.sponsor_name,town_city=excluded.town_city,sponsor_type=excluded.sponsor_type,
  sponsor_status=excluded.sponsor_status,route=excluded.route,immigration_compliance=excluded.immigration_compliance,
  institution_id=excluded.institution_id,ukprn=excluded.ukprn,match_status=excluded.match_status,
  match_basis=excluded.match_basis,source_url=excluded.source_url,source_as_of=excluded.source_as_of;

with rows(slug,source_name,source_program_key,source_program_name,title,qualification_title,field_category,city,campus,duration_months,official_program_url) as (
  values
  ('ulster-university','Ulster University','computer-science-beng-41242-2026','Computer Science','Computer Science','BEng (Hons)','Computer Science and Cloud Computing','Belfast','Belfast campus',36,'https://www.ulster.ac.uk/courses/202627/computer-science-41242'),
  ('university-of-leicester','University of Leicester','creative-computing-foundation-year-bsc-g993-2026','Creative Computing with Foundation Year','Creative Computing with Foundation Year','BSc','Creative Computing and Multimedia Design','Leicester','University of Leicester',48,'https://le.ac.uk/courses/creative-computing-with-foundation-year-bsc/2026')
)
insert into public.program_catalog_uk_staging (
  source_name,source_program_key,institution_name,institution_id,ukprn,awarding_institution_id,delivery_institution_id,
  provider_relationship,source_program_name,title,qualification_title,native_framework,native_level_code,canonical_level,
  programme_type,field_category,city,campus,duration_months,study_mode,official_program_url,official_qualification_url,
  source_as_of,collection_status,verification_tier
)
select r.source_name,r.source_program_key,i.canonical_name,i.institution_id,i.ukprn,i.institution_id,i.institution_id,
  'direct_award',r.source_program_name,r.title,r.qualification_title,'FHEQ','6','BACHELOR','degree',r.field_category,
  r.city,r.campus,r.duration_months,'Full-time',r.official_program_url,
  'https://www.gov.uk/what-different-qualification-levels-mean/list-of-qualification-levels',date '2026-08-09',
  'official_2026_digital_program_and_career_evidence_collected','C'
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

with rows(source_name,source_program_key,sponsor_key,admission_status,intake_label,international_source_url,rule_notes) as (
  values
  ('Ulster University','computer-science-beng-41242-2026','ulster-university|belfast|student-self-evidence','current_2026_international_only_course_application_path_visible_exact_deadline_not_verified','September 2026','https://www.ulster.ac.uk/courses/202627/computer-science-41242','Ulster states this exact 2026/27 BEng is only available to international students and provides an international application route. Exact deadline is not inferred.'),
  ('University of Leicester','creative-computing-foundation-year-bsc-g993-2026','university-of-leicester|leicester|student-self-evidence','current_2026_apply_route_visible_exact_deadline_not_verified','September 2026','https://le.ac.uk/courses/creative-computing-with-foundation-year-bsc/2026','Leicester publishes 2026 international tuition and a current Apply now route for the exact course. Exact closing date is not inferred.')
)
insert into public.program_international_uk_staging (
  program_catalog_id,student_sponsor_record_id,student_sponsor_eligible,international_students_eligible,cas_eligibility,
  international_admission_status,visa_context,intake_label,admission_source_url,international_source_url,
  sponsor_source_url,source_as_of,verification_status,rule_notes,verified_at
)
select p.id,s.id,true,true,null,r.admission_status,
  'Institution-level Student-route sponsorship is verified. Exact programme-level CAS remains unverified and is not inferred from application eligibility.',
  r.intake_label,p.official_program_url,r.international_source_url,s.source_url,date '2026-08-09',
  'official_2026_international_application_and_sponsor_evidence_verified_cas_unverified',r.rule_notes,now()
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

with links(source_name,source_program_key,canonical_career_id,match_pattern,reviewer_note) as (
  values
  ('Ulster University','computer-science-beng-41242-2026','cloud-engineer','Computer Science BEng -> Cloud Engineer','Ulster explicitly lists Cloud Engineer among graduate roles and teaches cloud computing and operating systems.'),
  ('University of Leicester','creative-computing-foundation-year-bsc-g993-2026','multimedia-designer','Creative Computing with Foundation Year BSc -> Multimedia Designer','Leicester explicitly lists Multimedia designer among current sector roles for this exact course.')
)
insert into public.program_occupation_uk_staging (
  program_catalog_id,canonical_career_id,rule_version,match_basis,match_pattern,review_status,relation_type,
  source_checked_at,reviewer_note,reviewed_at
)
select p.id,l.canonical_career_id,'uk-phase2-v1','official_program_career_evidence',l.match_pattern,'approved','direct_career_path',
  date '2026-08-09',l.reviewer_note,now()
from links l
join public.program_catalog_uk_staging p on p.source_name=l.source_name and p.source_program_key=l.source_program_key
on conflict (program_catalog_id,canonical_career_id) do update set
  rule_version=excluded.rule_version,match_basis=excluded.match_basis,match_pattern=excluded.match_pattern,
  review_status=excluded.review_status,relation_type=excluded.relation_type,source_checked_at=excluded.source_checked_at,
  reviewer_note=excluded.reviewer_note,reviewed_at=excluded.reviewed_at;