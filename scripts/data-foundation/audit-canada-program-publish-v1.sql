-- Canada Programs publish-policy audit v1
-- Read-only. Mirrors src/lib/programs/ca-publish-policy.ts.
-- Admission status must be verified at program level before Tier A/B publication.

with joined as (
  select
    c.id,c.source_name,c.source_program_key,c.institution_name,c.institution_id,c.title,
    c.credential_type,c.education_level,c.field_name,c.province,c.city,c.duration_years,
    c.tuition_fee_cad,c.program_code,c.official_program_url,c.source_url,c.source_as_of,
    c.source_status,c.collected_at,p.matched_dli_number,p.international_students_eligible,
    p.international_program_admission_status,p.ircc_program_eligible,p.pgwp_rule_category,
    p.pgwp_program_status,p.cip_code,p.verified_at
  from public.program_catalog_ca_staging c
  left join public.program_pgwp_ca_staging p on p.program_catalog_id=c.id
), decisions as (
  select *,
    case
      when nullif(btrim(title),'') is null then 'missing_title'
      when nullif(btrim(institution_id),'') is null then 'missing_institution'
      when nullif(btrim(source_url),'') is null then 'missing_source'
      when source_as_of is null and collected_at is null then 'missing_source_date'
      when nullif(btrim(matched_dli_number),'') is null then 'missing_dli'
      when international_students_eligible is not true then 'international_ineligible'
      when lower(coalesce(source_status,'')) like '%excluded_%' then 'excluded_non_core'
      when lower(coalesce(source_status,'')) like '%suspended%' then 'suspended'
      when lower(coalesce(source_status,'')) like '%not_accepting%' then 'not_accepting'
      when lower(coalesce(source_status,'')) like '%pending_review%' then 'pending_review'
      when lower(coalesce(source_status,'')) like '%cancelled%' then 'cancelled'
      when lower(coalesce(source_status,'')) like '%legacy_%' then 'legacy'
      when lower(coalesce(source_status,'')) like '%one_time_delivery_closed%' then 'closed_delivery'
      when lower(coalesce(source_status,'')) like '%parent_program_multiple_credentials%' then 'ambiguous_parent'
      when lower(coalesce(international_program_admission_status,'')) like '%not_assessed_non_core%' then 'admission_non_core'
      when nullif(btrim(international_program_admission_status),'') is null then 'admission_unverified'
      when lower(coalesce(international_program_admission_status,'')) ~ '(not_yet_verified|not verified|should_be_checked|dli_and_study_permit_eligibility_not_verified)'
        or ((lower(coalesce(international_program_admission_status,'')) like '%intake%'
             or lower(coalesce(international_program_admission_status,'')) like '%availability%')
            and (lower(coalesce(international_program_admission_status,'')) like '%check%'
                 or lower(coalesce(international_program_admission_status,'')) like '%separate%'))
        then 'admission_unverified'
      when lower(coalesce(international_program_admission_status,'')) ~ '(suspended|cancelled|not_accepting|not currently|not_current|unavailable|closed|restricted_not_open|temporarily_paused|not_eligible_for_study_permit|legacy_program)'
        then 'admission_closed_or_restricted'
      else null
    end as hold_reason,
    case when ircc_program_eligible is true then 'eligible' when ircc_program_eligible is false then 'ineligible' else 'unknown' end as pgwp_state
  from joined
), classified as (
  select *,case when hold_reason is not null then 'C' when nullif(btrim(official_program_url),'') is not null then 'A' else 'B' end as publication_tier
  from decisions
)
select publication_tier,pgwp_state,count(*) as program_rows,
       count(*) filter(where official_program_url is not null) as with_program_url,
       count(*) filter(where duration_years is not null) as with_duration,
       count(*) filter(where tuition_fee_cad is not null) as with_tuition,
       count(*) filter(where city is not null) as with_city,
       count(*) filter(where cip_code is not null) as with_cip
from classified
group by publication_tier,pgwp_state
order by publication_tier,pgwp_state;

with joined as (
  select c.*,p.matched_dli_number,p.international_students_eligible,p.international_program_admission_status
  from public.program_catalog_ca_staging c
  left join public.program_pgwp_ca_staging p on p.program_catalog_id=c.id
), holds as (
  select case
      when nullif(btrim(title),'') is null then 'missing_title'
      when nullif(btrim(institution_id),'') is null then 'missing_institution'
      when nullif(btrim(source_url),'') is null then 'missing_source'
      when source_as_of is null and collected_at is null then 'missing_source_date'
      when nullif(btrim(matched_dli_number),'') is null then 'missing_dli'
      when international_students_eligible is not true then 'international_ineligible'
      when lower(coalesce(source_status,'')) like '%excluded_%' then 'excluded_non_core'
      when lower(coalesce(source_status,'')) like '%suspended%' then 'suspended'
      when lower(coalesce(source_status,'')) like '%not_accepting%' then 'not_accepting'
      when lower(coalesce(source_status,'')) like '%pending_review%' then 'pending_review'
      when lower(coalesce(source_status,'')) like '%cancelled%' then 'cancelled'
      when lower(coalesce(source_status,'')) like '%legacy_%' then 'legacy'
      when lower(coalesce(source_status,'')) like '%one_time_delivery_closed%' then 'closed_delivery'
      when lower(coalesce(source_status,'')) like '%parent_program_multiple_credentials%' then 'ambiguous_parent'
      when lower(coalesce(international_program_admission_status,'')) like '%not_assessed_non_core%' then 'admission_non_core'
      when nullif(btrim(international_program_admission_status),'') is null then 'admission_unverified'
      when lower(coalesce(international_program_admission_status,'')) ~ '(not_yet_verified|not verified|should_be_checked|dli_and_study_permit_eligibility_not_verified)'
        or ((lower(coalesce(international_program_admission_status,'')) like '%intake%'
             or lower(coalesce(international_program_admission_status,'')) like '%availability%')
            and (lower(coalesce(international_program_admission_status,'')) like '%check%'
                 or lower(coalesce(international_program_admission_status,'')) like '%separate%'))
        then 'admission_unverified'
      when lower(coalesce(international_program_admission_status,'')) ~ '(suspended|cancelled|not_accepting|not currently|not_current|unavailable|closed|restricted_not_open|temporarily_paused|not_eligible_for_study_permit|legacy_program)'
        then 'admission_closed_or_restricted'
      else null
    end as hold_reason
  from joined
)
select hold_reason,count(*) as program_rows
from holds
where hold_reason is not null
group by hold_reason
order by program_rows desc,hold_reason;
