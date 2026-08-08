-- Hold occupation-priority Conestoga rows with stale intake or current international-admission mismatch.
with held(title, official_program_url, source_status, admission_status) as (
  values
    ('Bachelor of Engineering - Sustainable Design Engineering', 'https://www.conestogac.on.ca/fulltime/bachelor-of-engineering-sustainable-design-engineering', 'pending_review_current_admission_restriction_2026', 'current_page_canadian_application_only_2026'),
    ('Big Data Solution Architecture (Optional Co-op)', 'https://www.conestogac.on.ca/fulltime/big-data-solution-architecture', 'not_accepting_current_2026', 'latest_listed_intake_may_2026_passed_no_future_intake_verified'),
    ('Blockchain Application Development', 'https://www.conestogac.on.ca/fulltime/blockchain-application-development', 'not_accepting_current_2026', 'latest_listed_intake_may_2026_passed_no_future_intake_verified'),
    ('Business Administration - Marketing', 'https://www.conestogac.on.ca/fulltime/business-administration-marketing', 'pending_review_current_admission_restriction_2026', 'current_2026_page_no_international_fee_or_verified_apply_path'),
    ('Business Administration - Marketing (Co-op)', 'https://www.conestogac.on.ca/fulltime/business-administration-marketing-co-op', 'pending_review_current_admission_restriction_2026', 'current_2026_page_no_international_fee_or_verified_apply_path'),
    ('Early Childhood Education Resource Consulting', 'https://www.conestogac.on.ca/fulltime/early-childhood-education-resource-consulting', 'pending_review_international_program_variant_required_2026', 'international_students_directed_to_separate_international_program')
), updated as (
  update public.program_catalog_ca_staging c
  set official_program_url=h.official_program_url,
      source_status=h.source_status,
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  from held h
  where c.institution_name='Conestoga College' and c.title=h.title
  returning c.id,c.title
)
update public.program_pgwp_ca_staging p
set international_program_admission_status=h.admission_status,
    verified_at=now()
from held h
join updated u on u.title=h.title
where p.program_catalog_id=u.id;
