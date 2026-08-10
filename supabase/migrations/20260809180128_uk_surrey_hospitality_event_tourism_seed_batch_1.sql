with surrey as (
  select institution_id, ukprn from public.institution_identity_uk_v1 where slug='university-of-surrey'
)
insert into public.institution_student_sponsor_uk_staging (
  source_name, source_sponsor_key, sponsor_name, town_city, sponsor_type, sponsor_status, route,
  immigration_compliance, institution_id, ukprn, match_status, match_basis, source_url, source_as_of
)
select
  'University of Surrey CAS and Student visa guidance','university-of-surrey|guildford|student-self-evidence',
  'University of Surrey','Guildford','Higher Education Institution (HEI)','Student visa sponsor with CAS issuing procedure','Student',
  'institution_official_student_visa_and_cas_guidance',s.institution_id,s.ukprn,'matched',
  'official_institution_statement_plus_ukprn_identity',
  'https://www.surrey.ac.uk/international/visas-and-immigration/confirmation-of-acceptance-for-studies',date '2026-08-09'
from surrey s
on conflict (source_name,source_sponsor_key) do update set
  sponsor_name=excluded.sponsor_name,town_city=excluded.town_city,sponsor_type=excluded.sponsor_type,
  sponsor_status=excluded.sponsor_status,route=excluded.route,immigration_compliance=excluded.immigration_compliance,
  institution_id=excluded.institution_id,ukprn=excluded.ukprn,match_status=excluded.match_status,
  match_basis=excluded.match_basis,source_url=excluded.source_url,source_as_of=excluded.source_as_of;

with surrey as (
  select institution_id, ukprn from public.institution_identity_uk_v1 where slug='university-of-surrey'
), rows(source_program_key,source_program_name,title,qualification_title,field_category,duration_months,official_program_url) as (
  values
  ('international-hospitality-management-bsc-2026','International Hospitality Management','International Hospitality Management','BSc (Hons)','Hospitality Management',36,'https://www.surrey.ac.uk/clearing/international-hospitality-management'),
  ('international-event-management-bsc-2026','International Event Management','International Event Management','BSc (Hons)','Event Management',36,'https://www.surrey.ac.uk/clearing/international-event-management'),
  ('international-tourism-management-bsc-2026','International Tourism Management','International Tourism Management','BSc (Hons)','Tourism Management',36,'https://www.surrey.ac.uk/clearing/international-tourism-management')
)
insert into public.program_catalog_uk_staging (
  source_name,source_program_key,institution_name,institution_id,ukprn,awarding_institution_id,delivery_institution_id,
  provider_relationship,source_program_name,title,qualification_title,native_framework,native_level_code,canonical_level,
  programme_type,field_category,city,campus,duration_months,study_mode,official_program_url,official_qualification_url,
  source_as_of,collection_status,verification_tier
)
select
  'University of Surrey',r.source_program_key,'University of Surrey',s.institution_id,s.ukprn,s.institution_id,s.institution_id,
  'direct_award',r.source_program_name,r.title,r.qualification_title,'FHEQ','6','BACHELOR','degree',r.field_category,
  'Guildford','Stag Hill',r.duration_months,'Full-time',r.official_program_url,
  'https://www.gov.uk/what-different-qualification-levels-mean/list-of-qualification-levels',date '2026-08-09',
  'official_2026_clearing_program_evidence_collected','C'
from rows r cross join surrey s
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
  where source_sponsor_key='university-of-surrey|guildford|student-self-evidence' and match_status='matched'
), programmes as (
  select id,official_program_url from public.program_catalog_uk_staging
  where source_name='University of Surrey' and source_program_key in (
    'international-hospitality-management-bsc-2026','international-event-management-bsc-2026','international-tourism-management-bsc-2026'
  )
)
insert into public.program_international_uk_staging (
  program_catalog_id,student_sponsor_record_id,student_sponsor_eligible,international_students_eligible,cas_eligibility,
  international_admission_status,visa_context,intake_label,intake_start_date,admission_source_url,international_source_url,
  sponsor_source_url,source_as_of,verification_status,rule_notes,verified_at
)
select p.id,s.id,true,true,null,'open_through_clearing_2026_overseas_fee_visible',
  'University of Surrey publishes a Student visa and CAS issuing procedure. The exact 2026 course is in Clearing and publishes overseas tuition; programme-level CAS is not inferred before an individual unconditional offer.',
  'September 2026',null,p.official_program_url,p.official_program_url,
  'https://www.surrey.ac.uk/international/visas-and-immigration/confirmation-of-acceptance-for-studies',date '2026-08-09',
  'official_2026_clearing_international_and_sponsor_evidence_verified_cas_unverified',
  'Course is available in 2026 Clearing with an overseas fee. General Surrey CAS guidance remains separate from programme-level CAS eligibility.',now()
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
  ('international-hospitality-management-bsc-2026','hotel-manager','official_program_career_evidence','direct_career_path','International Hospitality Management BSc -> Hotel Manager','Surrey states graduates enter operational management roles running hotels around the world.'),
  ('international-hospitality-management-bsc-2026','restaurant-manager','official_program_career_evidence','direct_career_path','International Hospitality Management BSc -> Restaurant Manager','Surrey states graduates enter operational management roles running restaurants around the world.'),
  ('international-event-management-bsc-2026','event-planner','official_program_career_evidence','direct_career_path','International Event Management BSc -> Event Planner / Events Manager','Surrey describes the degree as preparation for professional event management and lists Events Manager, Events Coordinator and Events Executive graduate roles.'),
  ('international-tourism-management-bsc-2026','tourism-manager','official_program_title_and_career_evidence','direct_career_path','International Tourism Management BSc -> Tourism Manager','Surrey describes the degree as a foundation for senior managerial roles and strategic leadership in the tourism sector.')
)
insert into public.program_occupation_uk_staging (
  program_catalog_id,canonical_career_id,rule_version,match_basis,match_pattern,review_status,relation_type,
  source_checked_at,reviewer_note,reviewed_at
)
select p.id,l.canonical_career_id,'uk-phase2-v1',l.match_basis,l.match_pattern,'approved',l.relation_type,
  date '2026-08-09',l.reviewer_note,now()
from links l
join public.program_catalog_uk_staging p on p.source_name='University of Surrey' and p.source_program_key=l.source_program_key
on conflict (program_catalog_id,canonical_career_id) do update set
  rule_version=excluded.rule_version,match_basis=excluded.match_basis,match_pattern=excluded.match_pattern,
  review_status=excluded.review_status,relation_type=excluded.relation_type,source_checked_at=excluded.source_checked_at,
  reviewer_note=excluded.reviewer_note,reviewed_at=excluded.reviewed_at;