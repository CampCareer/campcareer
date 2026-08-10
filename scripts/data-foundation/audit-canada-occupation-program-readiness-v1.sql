-- Canada occupation -> programs Phase 3 readiness audit v1
-- Read-only. Designed to answer four publication questions:
-- 1) Are all 80 target occupations represented and manually reviewed?
-- 2) Does each occupation have at least one Tier A/B publishable relationship?
-- 3) Why are approved relationships still held from publication?
-- 4) Which institutions still contain the largest candidate-review queues?
--
-- Keep the classification logic synchronized with src/lib/programs/ca-publish-policy.ts.
-- For richer duplicate classification and current readiness reporting, prefer v2.

with program_state as (
  select
    c.id as program_catalog_id,
    c.institution_id,
    c.institution_name,
    c.title,
    c.credential_type,
    c.official_program_url,
    c.source_url,
    c.source_as_of,
    c.collected_at,
    c.source_status,
    p.matched_dli_number,
    p.international_students_eligible,
    p.international_program_admission_status,
    p.ircc_program_eligible,
    case
      when nullif(btrim(c.title),'') is null then 'missing_title'
      when nullif(btrim(c.institution_id),'') is null then 'missing_institution'
      when nullif(btrim(c.source_url),'') is null then 'missing_source'
      when c.source_as_of is null and c.collected_at is null then 'missing_source_date'
      when nullif(btrim(p.matched_dli_number),'') is null then 'missing_dli'
      when p.international_students_eligible is not true then 'international_ineligible'
      when lower(coalesce(c.source_status,'')) like '%excluded_%' then 'excluded_non_core'
      when lower(coalesce(c.source_status,'')) like '%suspended%' then 'suspended'
      when lower(coalesce(c.source_status,'')) like '%not_accepting%' then 'not_accepting'
      when lower(coalesce(c.source_status,'')) like '%pending_review%' then 'pending_review'
      when lower(coalesce(c.source_status,'')) like '%cancelled%' then 'cancelled'
      when lower(coalesce(c.source_status,'')) like '%legacy_%' then 'legacy'
      when lower(coalesce(c.source_status,'')) like '%one_time_delivery_closed%' then 'closed_delivery'
      when lower(coalesce(c.source_status,'')) like '%parent_program_multiple_credentials%' then 'ambiguous_parent'
      when lower(coalesce(p.international_program_admission_status,'')) like '%not_assessed_non_core%' then 'admission_non_core'
      when nullif(btrim(p.international_program_admission_status),'') is null then 'admission_unverified'
      when lower(coalesce(p.international_program_admission_status,'')) ~ '(not_yet_verified|not verified|should_be_checked|dli_and_study_permit_eligibility_not_verified)'
        or (
          (lower(coalesce(p.international_program_admission_status,'')) like '%intake%'
           or lower(coalesce(p.international_program_admission_status,'')) like '%availability%')
          and
          (lower(coalesce(p.international_program_admission_status,'')) like '%check%'
           or lower(coalesce(p.international_program_admission_status,'')) like '%separate%')
        ) then 'admission_unverified'
      when lower(coalesce(p.international_program_admission_status,'')) ~ '(suspended|cancelled|not_accepting|not currently|not_current|unavailable|closed|not_yet_open|not yet open|restricted_not_open|temporarily_paused|not_eligible_for_study_permit|legacy_program)'
        then 'admission_closed_or_restricted'
      else null
    end as hold_reason,
    case
      when p.ircc_program_eligible is true then 'eligible'
      when p.ircc_program_eligible is false then 'ineligible'
      else 'unknown'
    end as pgwp_state
  from public.program_catalog_ca_staging c
  left join public.program_pgwp_ca_staging p on p.program_catalog_id = c.id
), classified as (
  select
    *,
    case
      when hold_reason is not null then 'C'
      when nullif(btrim(official_program_url),'') is not null then 'A'
      else 'B'
    end as publication_tier
  from program_state
), occupation_rollup as (
  select
    o.canonical_career_id,
    count(*) as total_links,
    count(*) filter (where o.review_status='approved') as approved_links,
    count(*) filter (where o.review_status='candidate') as candidate_links,
    count(*) filter (where o.review_status='rejected') as rejected_links,
    count(*) filter (where o.review_status='approved' and c.publication_tier='A') as tier_a_links,
    count(*) filter (where o.review_status='approved' and c.publication_tier='B') as tier_b_links,
    count(*) filter (where o.review_status='approved' and c.publication_tier='C') as held_links,
    count(*) filter (where o.review_status='approved' and c.publication_tier='A' and c.pgwp_state='eligible') as tier_a_pgwp_eligible_links,
    count(*) filter (where o.review_status='approved' and c.publication_tier='A' and c.pgwp_state='unknown') as tier_a_pgwp_unknown_links
  from public.program_occupation_ca_staging o
  join classified c on c.program_catalog_id=o.program_catalog_id
  group by o.canonical_career_id
)
select
  'occupation_summary' as audit_section,
  canonical_career_id as key,
  jsonb_build_object(
    'total_links',total_links,
    'approved_links',approved_links,
    'candidate_links',candidate_links,
    'rejected_links',rejected_links,
    'tier_a_links',tier_a_links,
    'tier_b_links',tier_b_links,
    'held_links',held_links,
    'tier_a_pgwp_eligible_links',tier_a_pgwp_eligible_links,
    'tier_a_pgwp_unknown_links',tier_a_pgwp_unknown_links
  ) as metrics
from occupation_rollup
order by canonical_career_id;

-- Coverage headline.
with program_state as (
  select c.id as program_catalog_id,c.official_program_url,
    case
      when nullif(btrim(p.matched_dli_number),'') is null then 'missing_dli'
      when p.international_students_eligible is not true then 'international_ineligible'
      when lower(coalesce(c.source_status,'')) like '%excluded_%' then 'excluded_non_core'
      when lower(coalesce(c.source_status,'')) like '%suspended%' then 'suspended'
      when lower(coalesce(c.source_status,'')) like '%not_accepting%' then 'not_accepting'
      when lower(coalesce(c.source_status,'')) like '%pending_review%' then 'pending_review'
      when lower(coalesce(c.source_status,'')) like '%cancelled%' then 'cancelled'
      when lower(coalesce(c.source_status,'')) like '%legacy_%' then 'legacy'
      when nullif(btrim(p.international_program_admission_status),'') is null then 'admission_unverified'
      when lower(coalesce(p.international_program_admission_status,'')) ~ '(not_yet_verified|not verified|should_be_checked|dli_and_study_permit_eligibility_not_verified)'
        or (((lower(coalesce(p.international_program_admission_status,'')) like '%intake%') or (lower(coalesce(p.international_program_admission_status,'')) like '%availability%'))
            and ((lower(coalesce(p.international_program_admission_status,'')) like '%check%') or (lower(coalesce(p.international_program_admission_status,'')) like '%separate%'))) then 'admission_unverified'
      when lower(coalesce(p.international_program_admission_status,'')) ~ '(suspended|cancelled|not_accepting|not currently|not_current|unavailable|closed|not_yet_open|not yet open|restricted_not_open|temporarily_paused|not_eligible_for_study_permit|legacy_program)' then 'admission_closed_or_restricted'
      else null end hold_reason
  from public.program_catalog_ca_staging c
  left join public.program_pgwp_ca_staging p on p.program_catalog_id=c.id
), rollup as (
  select o.canonical_career_id,
    count(*) filter(where o.review_status='approved') approved_links,
    count(*) filter(where o.review_status='approved' and ps.hold_reason is null and nullif(btrim(ps.official_program_url),'') is not null) tier_a_links,
    count(*) filter(where o.review_status='approved' and ps.hold_reason is null and nullif(btrim(ps.official_program_url),'') is null) tier_b_links
  from public.program_occupation_ca_staging o
  join program_state ps on ps.program_catalog_id=o.program_catalog_id
  group by o.canonical_career_id
)
select
  count(*) as target_careers,
  count(*) filter(where approved_links>0) as careers_with_approved_relationship,
  count(*) filter(where tier_a_links>0) as careers_with_tier_a,
  count(*) filter(where tier_a_links=0 and tier_b_links>0) as careers_tier_b_only,
  count(*) filter(where tier_a_links=0 and tier_b_links=0) as careers_held_only
from rollup;

-- Approved relationships still held from publication, by reason.
with program_state as (
  select c.id as program_catalog_id,c.institution_name,
    case
      when nullif(btrim(p.matched_dli_number),'') is null then 'missing_dli'
      when p.international_students_eligible is not true then 'international_ineligible'
      when lower(coalesce(c.source_status,'')) like '%excluded_%' then 'excluded_non_core'
      when lower(coalesce(c.source_status,'')) like '%suspended%' then 'suspended'
      when lower(coalesce(c.source_status,'')) like '%not_accepting%' then 'not_accepting'
      when lower(coalesce(c.source_status,'')) like '%pending_review%' then 'pending_review'
      when lower(coalesce(c.source_status,'')) like '%cancelled%' then 'cancelled'
      when lower(coalesce(c.source_status,'')) like '%legacy_%' then 'legacy'
      when nullif(btrim(p.international_program_admission_status),'') is null then 'admission_unverified'
      when lower(coalesce(p.international_program_admission_status,'')) ~ '(not_yet_verified|not verified|should_be_checked|dli_and_study_permit_eligibility_not_verified)'
        or (((lower(coalesce(p.international_program_admission_status,'')) like '%intake%') or (lower(coalesce(p.international_program_admission_status,'')) like '%availability%'))
            and ((lower(coalesce(p.international_program_admission_status,'')) like '%check%') or (lower(coalesce(p.international_program_admission_status,'')) like '%separate%'))) then 'admission_unverified'
      when lower(coalesce(p.international_program_admission_status,'')) ~ '(suspended|cancelled|not_accepting|not currently|not_current|unavailable|closed|not_yet_open|not yet open|restricted_not_open|temporarily_paused|not_eligible_for_study_permit|legacy_program)' then 'admission_closed_or_restricted'
      else null end hold_reason
  from public.program_catalog_ca_staging c
  left join public.program_pgwp_ca_staging p on p.program_catalog_id=c.id
)
select ps.hold_reason,count(*) as approved_relationships,count(distinct o.canonical_career_id) as careers
from public.program_occupation_ca_staging o
join program_state ps on ps.program_catalog_id=o.program_catalog_id
where o.review_status='approved' and ps.hold_reason is not null
group by ps.hold_reason
order by approved_relationships desc,ps.hold_reason;

-- Candidate queue by institution. Candidates are never publication-eligible relationships.
select c.institution_name,
       count(*) as candidate_links,
       count(distinct o.canonical_career_id) as candidate_careers,
       count(distinct o.program_catalog_id) as candidate_programs
from public.program_occupation_ca_staging o
join public.program_catalog_ca_staging c on c.id=o.program_catalog_id
where o.review_status='candidate'
group by c.institution_name
order by candidate_links desc,c.institution_name;

-- Duplicate audit. Source keys must remain unique. Title+credential duplicates need manual
-- canonicalization because some are legitimate delivery/campus/major variants. Use v2 for classification.
select 'source_key_duplicate' as duplicate_type,source_name || ' / ' || source_program_key as duplicate_key,count(*) as rows
from public.program_catalog_ca_staging
group by source_name,source_program_key
having count(*)>1
union all
select 'normalized_title_credential_duplicate',institution_id || ' / ' || lower(regexp_replace(trim(title),'\s+',' ','g')) || ' / ' || lower(coalesce(credential_type,'')),count(*)
from public.program_catalog_ca_staging
group by institution_id,lower(regexp_replace(trim(title),'\s+',' ','g')),lower(coalesce(credential_type,''))
having count(*)>1
order by duplicate_type,rows desc,duplicate_key;
