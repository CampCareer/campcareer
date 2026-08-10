with providers(slug,source_name,source_sponsor_key,sponsor_name,town_city,sponsor_status,source_url) as (
  values
  ('university-of-glasgow','University of Glasgow Student visa guidance','university-of-glasgow|glasgow|student-self-evidence','University of Glasgow','Glasgow','Student visa sponsor with CAS process','https://www.gla.ac.uk/international/support/visasandimmigration/applyingforastudentvisaoutsidetheuk/'),
  ('university-of-edinburgh','University of Edinburgh CAS guidance','university-of-edinburgh|edinburgh|student-self-evidence','University of Edinburgh','Edinburgh','Higher education provider with a track record of compliance','https://registryservices.ed.ac.uk/immigration/applying-for-visa/student-visa/requirements/confirmation-acceptance-studies')
)
insert into public.institution_student_sponsor_uk_staging (
  source_name,source_sponsor_key,sponsor_name,town_city,sponsor_type,sponsor_status,route,immigration_compliance,
  institution_id,ukprn,match_status,match_basis,source_url,source_as_of
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
  ('ulster-university','Ulster University','community-youth-work-bsc-l521-2026','Community Youth Work','Community Youth Work','BSc (Hons)','FHEQ','6','BACHELOR','Community Youth Work','Belfast','Belfast campus',36,'https://www.ulster.ac.uk/courses/202627/community-youth-work-41257'),
  ('university-of-glasgow','University of Glasgow','community-development-ba-xl35-2026','Community Development','Community Development','BA (Hons)','SCQF','10','BACHELOR','Community Development','Glasgow','Gilmorehill campus and work placement',48,'https://www.gla.ac.uk/undergraduate/2026/communitydevelopment/'),
  ('university-of-edinburgh','University of Edinburgh','counselling-interpersonal-dialogue-mcouns-2026','Counselling (Interpersonal Dialogue)','Counselling (Interpersonal Dialogue)','MCouns','SCQF','11','MASTER','Professional Counselling','Edinburgh','University of Edinburgh',24,'https://study.ed.ac.uk/programmes/postgraduate-taught/520-counselling-interpersonal-dialogue')
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
  date '2026-08-09','official_2026_social_community_program_evidence_collected','C'
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

with rows(source_name,source_program_key,sponsor_key,student_sponsor_eligible,international_students_eligible,admission_status,intake_label,application_deadline,international_source_url,rule_notes) as (
  values
  ('Ulster University','community-youth-work-bsc-l521-2026','ulster-university|belfast|student-self-evidence',true,true,'current_2026_international_portal_visible_exact_deadline_not_verified','September 2026',null::date,'https://www.ulster.ac.uk/courses/202627/community-youth-work-41257','Ulster exposes a 2026 International Portal, international entry requirements and international fees. Exact closing date is not inferred.'),
  ('University of Glasgow','community-development-ba-xl35-2026','university-of-glasgow|glasgow|student-self-evidence',true,null::boolean,'clearing_2026_visible_programme_level_student_visa_eligibility_not_explicit','September 2026',null::date,'https://www.gla.ac.uk/undergraduate/2026/communitydevelopment/','Glasgow lists the exact course in 2026 Clearing, provides international English requirements and general international fee coverage, but the course page does not explicitly establish that this work-based programme is Student-route eligible. Programme-level international eligibility remains unknown.'),
  ('University of Edinburgh','counselling-interpersonal-dialogue-mcouns-2026','university-of-edinburgh|edinburgh|student-self-evidence',true,true,'closed_after_2026_01_07_application_deadline','14 September 2026',date '2026-01-07','https://study.ed.ac.uk/programmes/postgraduate-taught/520-counselling-interpersonal-dialogue','Edinburgh describes this professional counselling qualification as specifically designed for international students, but the 2026 application deadline was 7 January 2026 and the programme is not currently open.')
)
insert into public.program_international_uk_staging (
  program_catalog_id,student_sponsor_record_id,student_sponsor_eligible,international_students_eligible,cas_eligibility,
  international_admission_status,visa_context,intake_label,application_deadline,admission_source_url,international_source_url,
  sponsor_source_url,source_as_of,verification_status,rule_notes,verified_at
)
select p.id,s.id,r.student_sponsor_eligible,r.international_students_eligible,null,r.admission_status,
  'Institution-level Student sponsorship/CAS process is verified where present. Programme-level CAS remains unverified and null.',
  r.intake_label,r.application_deadline,p.official_program_url,r.international_source_url,s.source_url,date '2026-08-09',
  'official_2026_social_community_international_evidence_reviewed_cas_unverified',r.rule_notes,now()
from rows r
join public.program_catalog_uk_staging p on p.source_name=r.source_name and p.source_program_key=r.source_program_key
join public.institution_student_sponsor_uk_staging s on s.source_sponsor_key=r.sponsor_key and s.match_status='matched'
on conflict (program_catalog_id) do update set
  student_sponsor_record_id=excluded.student_sponsor_record_id,student_sponsor_eligible=excluded.student_sponsor_eligible,
  international_students_eligible=excluded.international_students_eligible,cas_eligibility=excluded.cas_eligibility,
  international_admission_status=excluded.international_admission_status,visa_context=excluded.visa_context,
  intake_label=excluded.intake_label,application_deadline=excluded.application_deadline,admission_source_url=excluded.admission_source_url,
  international_source_url=excluded.international_source_url,sponsor_source_url=excluded.sponsor_source_url,
  source_as_of=excluded.source_as_of,verification_status=excluded.verification_status,rule_notes=excluded.rule_notes,verified_at=excluded.verified_at;

with links(source_name,source_program_key,canonical_career_id,match_basis,relation_type,match_pattern,reviewer_note) as (
  values
  ('Ulster University','community-youth-work-bsc-l521-2026','youth-worker','official_program_professional_qualification_and_career_evidence','professional_registration_pathway','Community Youth Work BSc -> Youth Worker','Ulster states the degree confers a professional Community Youth Work qualification and explicitly lists Area Youth Worker, Detached Youth Worker and related roles.'),
  ('University of Glasgow','community-development-ba-xl35-2026','community-worker','official_program_title_and_career_evidence','direct_career_path','Community Development BA -> Community Worker','Glasgow states the degree develops skills to work effectively with communities for social change and lists community regeneration, community arts, housing and related community-development careers.'),
  ('University of Edinburgh','counselling-interpersonal-dialogue-mcouns-2026','counsellor','official_program_professional_qualification_evidence','professional_registration_pathway','Counselling MCouns -> Counsellor','Edinburgh states this professionally validated qualification is designed for international students and qualifies graduates to practise as counsellors or therapists in the UK and comparable jurisdictions.')
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