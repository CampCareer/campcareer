with herts as (
  select institution_id, ukprn from public.institution_identity_uk_v1 where slug='university-of-hertfordshire'
)
insert into public.program_catalog_uk_staging (
  source_name, source_program_key, institution_name, institution_id, ukprn,
  awarding_institution_id, delivery_institution_id, provider_relationship,
  source_program_name, title, qualification_title, native_framework, native_level_code,
  canonical_level, programme_type, field_category, city, campus, duration_months,
  study_mode, official_program_url, official_qualification_url, source_as_of,
  collection_status, verification_tier
)
select
  'University of Hertfordshire','supply-chain-logistics-management-msc-2026','University of Hertfordshire',
  h.institution_id,h.ukprn,h.institution_id,h.institution_id,'direct_award',
  'Supply Chain and Logistics Management','Supply Chain and Logistics Management','MSc','FHEQ','7','MASTER','degree',
  'Supply Chain and Logistics Management','Hatfield','University of Hertfordshire, Hatfield',12,'Full-time',
  'https://www.herts.ac.uk/courses/postgraduate-masters/supply-chain-management-and-logistics-management',
  'https://www.gov.uk/what-different-qualification-levels-mean/list-of-qualification-levels',date '2026-08-09',
  'official_2026_program_international_and_career_evidence_collected','C'
from herts h
on conflict (source_name, source_program_key) do update set
 institution_id=excluded.institution_id,ukprn=excluded.ukprn,awarding_institution_id=excluded.awarding_institution_id,
 delivery_institution_id=excluded.delivery_institution_id,provider_relationship=excluded.provider_relationship,
 source_program_name=excluded.source_program_name,title=excluded.title,qualification_title=excluded.qualification_title,
 native_framework=excluded.native_framework,native_level_code=excluded.native_level_code,canonical_level=excluded.canonical_level,
 field_category=excluded.field_category,city=excluded.city,campus=excluded.campus,duration_months=excluded.duration_months,
 study_mode=excluded.study_mode,official_program_url=excluded.official_program_url,
 official_qualification_url=excluded.official_qualification_url,source_as_of=excluded.source_as_of,
 collection_status=excluded.collection_status,verification_tier=excluded.verification_tier;

with sponsor as (
 select id from public.institution_student_sponsor_uk_staging
 where source_sponsor_key='university-of-hertfordshire|hatfield|student-self-evidence' and match_status='matched'
), programme as (
 select id, official_program_url from public.program_catalog_uk_staging
 where source_name='University of Hertfordshire' and source_program_key='supply-chain-logistics-management-msc-2026'
)
insert into public.program_international_uk_staging (
 program_catalog_id,student_sponsor_record_id,student_sponsor_eligible,international_students_eligible,cas_eligibility,
 international_admission_status,visa_context,intake_label,intake_start_date,admission_source_url,international_source_url,
 sponsor_source_url,source_as_of,verification_status,rule_notes,verified_at
)
select p.id,s.id,true,true,null,'open_2026_international_application_portal_visible',
 'University of Hertfordshire holds a Student Sponsor licence and issues CAS after eligible applicants satisfy offer and compliance conditions. Exact programme-level CAS remains unverified.',
 'September 2026',date '2026-09-23',p.official_program_url,p.official_program_url,
 'https://www.herts.ac.uk/international/coming-to-the-uk/visa-application/student-visa',date '2026-08-09',
 'official_2026_international_application_and_career_evidence_verified_cas_unverified',
 'Official MSc page states applications are open to international students, gives September 2026 full-time entry and international tuition, and lists target career outcomes.',now()
from programme p cross join sponsor s
on conflict (program_catalog_id) do update set
 student_sponsor_record_id=excluded.student_sponsor_record_id,student_sponsor_eligible=excluded.student_sponsor_eligible,
 international_students_eligible=excluded.international_students_eligible,cas_eligibility=excluded.cas_eligibility,
 international_admission_status=excluded.international_admission_status,visa_context=excluded.visa_context,
 intake_label=excluded.intake_label,intake_start_date=excluded.intake_start_date,admission_source_url=excluded.admission_source_url,
 international_source_url=excluded.international_source_url,sponsor_source_url=excluded.sponsor_source_url,
 source_as_of=excluded.source_as_of,verification_status=excluded.verification_status,rule_notes=excluded.rule_notes,verified_at=excluded.verified_at;

with links(canonical_career_id, match_pattern, reviewer_note) as (
 values
 ('supply-chain-analyst','Supply Chain and Logistics Management MSc -> Supply Chain Analyst','The official careers section explicitly lists Supply Chain Analyst.'),
 ('warehouse-manager','Supply Chain and Logistics Management MSc -> Warehouse Manager','The official careers section explicitly lists Warehouse Manager and the curriculum includes Storage and Warehouse Management.')
)
insert into public.program_occupation_uk_staging (
 program_catalog_id,canonical_career_id,rule_version,match_basis,match_pattern,review_status,relation_type,
 source_checked_at,reviewer_note,reviewed_at
)
select p.id,l.canonical_career_id,'uk-phase2-v1','official_program_career_evidence',l.match_pattern,'approved','direct_career_path',
 date '2026-08-09',l.reviewer_note,now()
from links l
cross join lateral (
 select id from public.program_catalog_uk_staging
 where source_name='University of Hertfordshire' and source_program_key='supply-chain-logistics-management-msc-2026'
) p
on conflict (program_catalog_id,canonical_career_id) do update set
 rule_version=excluded.rule_version,match_basis=excluded.match_basis,match_pattern=excluded.match_pattern,
 review_status=excluded.review_status,relation_type=excluded.relation_type,source_checked_at=excluded.source_checked_at,
 reviewer_note=excluded.reviewer_note,reviewed_at=excluded.reviewed_at;