-- Canada occupation -> programs Phase 3 readiness audit v2
-- Read-only. Supersedes v1 for current publication/admission and duplicate-identity checks.
-- Keep hold classification synchronized with src/lib/programs/ca-publish-policy.ts.

with program_state as (
  select
    c.id as program_catalog_id,
    c.institution_id,
    c.institution_name,
    c.title,
    c.credential_type,
    c.program_code,
    c.city,
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
  left join public.program_pgwp_ca_staging p on p.program_catalog_id=c.id
), classified as (
  select *,
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
    count(*) filter(where o.review_status='approved') as approved_links,
    count(*) filter(where o.review_status='candidate') as candidate_links,
    count(*) filter(where o.review_status='rejected') as rejected_links,
    count(*) filter(where o.review_status='approved' and c.publication_tier='A') as tier_a_links,
    count(*) filter(where o.review_status='approved' and c.publication_tier='B') as tier_b_links,
    count(*) filter(where o.review_status='approved' and c.publication_tier='C') as held_links,
    count(*) filter(where o.review_status='approved' and c.publication_tier='A' and c.pgwp_state='eligible') as tier_a_pgwp_eligible_links,
    count(*) filter(where o.review_status='approved' and c.publication_tier='A' and c.pgwp_state='unknown') as tier_a_pgwp_unknown_links
  from public.program_occupation_ca_staging o
  join classified c on c.program_catalog_id=o.program_catalog_id
  group by o.canonical_career_id
)
select
  'coverage_headline' as audit_section,
  'all_target_careers' as key,
  jsonb_build_object(
    'target_careers',count(*),
    'careers_with_approved_relationship',count(*) filter(where approved_links>0),
    'careers_with_tier_a',count(*) filter(where tier_a_links>0),
    'careers_tier_b_only',count(*) filter(where tier_a_links=0 and tier_b_links>0),
    'careers_held_only',count(*) filter(where tier_a_links=0 and tier_b_links=0),
    'candidate_links',sum(candidate_links),
    'approved_links',sum(approved_links),
    'rejected_links',sum(rejected_links)
  ) as metrics
from occupation_rollup;

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
select 'held_approved' as audit_section,ps.hold_reason as key,
       jsonb_build_object('approved_relationships',count(*),'careers',count(distinct o.canonical_career_id)) as metrics
from public.program_occupation_ca_staging o
join program_state ps on ps.program_catalog_id=o.program_catalog_id
where o.review_status='approved' and ps.hold_reason is not null
group by ps.hold_reason
order by count(*) desc,ps.hold_reason;

select 'candidate_queue' as audit_section,c.institution_name as key,
       jsonb_build_object(
         'candidate_links',count(*),
         'candidate_careers',count(distinct o.canonical_career_id),
         'candidate_programs',count(distinct o.program_catalog_id),
         'with_official_url',count(distinct o.program_catalog_id) filter(where c.official_program_url is not null)
       ) as metrics
from public.program_occupation_ca_staging o
join public.program_catalog_ca_staging c on c.id=o.program_catalog_id
where o.review_status='candidate'
group by c.institution_name
order by count(*) desc,c.institution_name;

-- Hard source-key duplicates remain errors.
select 'source_key_duplicate' as audit_section,
       source_name || ' / ' || source_program_key as key,
       jsonb_build_object('rows',count(*)) as metrics
from public.program_catalog_ca_staging
group by source_name,source_program_key
having count(*)>1
order by key;

-- Title/credential groups are classified instead of blindly treated as duplicates.
-- Different codes or cities are normally delivery/campus variants; legacy-only shadows are already resolved.
with base as (
  select
    institution_id,
    institution_name,
    lower(regexp_replace(trim(title),'\s+',' ','g')) as norm_title,
    lower(coalesce(credential_type,'')) as norm_credential,
    program_code,
    city,
    official_program_url,
    source_status,
    id
  from public.program_catalog_ca_staging
), groups as (
  select
    institution_id,
    institution_name,
    norm_title,
    norm_credential,
    count(*) as rows,
    count(*) filter(where lower(coalesce(source_status,'')) not like '%legacy_%') as nonlegacy_rows,
    count(distinct coalesce(nullif(program_code,''),'∅')) as program_code_variants,
    count(distinct coalesce(nullif(city,''),'∅')) as city_variants,
    count(distinct coalesce(nullif(official_program_url,''),'∅')) as url_variants,
    array_agg(id order by id) as program_catalog_ids,
    array_agg(coalesce(program_code,'∅') order by id) as program_codes,
    array_agg(coalesce(city,'∅') order by id) as cities
  from base
  group by institution_id,institution_name,norm_title,norm_credential
  having count(*)>1
)
select 'title_credential_identity_group' as audit_section,
       institution_name || ' / ' || norm_title || ' / ' || norm_credential as key,
       jsonb_build_object(
         'classification',case
           when nonlegacy_rows<=1 then 'resolved_legacy_shadow'
           when program_code_variants>1 or city_variants>1 then 'delivery_or_campus_variant'
           when url_variants=1 then 'probable_duplicate_same_url'
           else 'manual_review'
         end,
         'rows',rows,
         'nonlegacy_rows',nonlegacy_rows,
         'program_code_variants',program_code_variants,
         'city_variants',city_variants,
         'url_variants',url_variants,
         'program_catalog_ids',program_catalog_ids,
         'program_codes',program_codes,
         'cities',cities
       ) as metrics
from groups
order by
  case
    when nonlegacy_rows<=1 then 4
    when program_code_variants>1 or city_variants>1 then 3
    when url_variants=1 then 1
    else 2
  end,
  institution_name,norm_title;
