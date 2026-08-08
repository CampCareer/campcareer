-- Canada Programs Phase 2 completion: explicit Tilesetter apprenticeship pathway.
-- SkilledTradesBC lists Trowel Trades Training Association in Surrey as a designated
-- non-public training provider for Tilesetter Levels 1, 2 and 3 through September 2030.
-- DLI/study-permit eligibility is intentionally not inferred. The row remains Tier C
-- until official international-student eligibility evidence is available.

with next_catalog_id as (
  select coalesce(max(id),0) + 1 as id from public.program_catalog_ca_staging
), inserted as (
  insert into public.program_catalog_ca_staging (
    id, source_name, source_program_key, institution_name, institution_id,
    title, credential_type, education_level, field_name, language,
    province, city, official_program_url, source_url, source_as_of, source_status
  )
  select
    n.id,
    'SkilledTradesBC',
    'tilesetter-apprenticeship-ttta-surrey',
    'Trowel Trades Training Association',
    'trowel-trades-training-association',
    'Tilesetter Apprenticeship Technical Training (Levels 1-3)',
    'Red Seal apprenticeship technical training',
    'Apprenticeship',
    'Tilesetting',
    'English',
    'British Columbia',
    'Surrey',
    'https://skilledtradesbc.ca/tilesetter',
    'https://skilledtradesbc.ca/training-providers/non-public-approved-training-providers',
    date '2026-08-08',
    'official_skilledtradesbc_designated_training_provider_dli_not_verified'
  from next_catalog_id n
  on conflict (source_name, source_program_key) do update
    set institution_name=excluded.institution_name,
        institution_id=excluded.institution_id,
        title=excluded.title,
        credential_type=excluded.credential_type,
        education_level=excluded.education_level,
        field_name=excluded.field_name,
        language=excluded.language,
        province=excluded.province,
        city=excluded.city,
        official_program_url=excluded.official_program_url,
        source_url=excluded.source_url,
        source_as_of=excluded.source_as_of,
        source_status=excluded.source_status
  returning id, source_program_key, institution_id, credential_type, education_level
), next_pgwp_id as (
  select coalesce(max(id),0) + 1 as id from public.program_pgwp_ca_staging
), pgwp_inserted as (
  insert into public.program_pgwp_ca_staging (
    id, program_catalog_id, institution_id, source_program_key, credential_type,
    education_level, matched_dli_number, matched_campus,
    institution_offers_pgwp_eligible_programs, international_students_eligible,
    pgwp_rule_category, field_of_study_required, cip_code, field_of_study_eligible,
    ircc_program_eligible, pgwp_program_status, source_url, source_as_of,
    verified_at, international_program_admission_status, rule_notes
  )
  select
    p.id,
    i.id,
    i.institution_id,
    i.source_program_key,
    i.credential_type,
    i.education_level,
    null,
    'Surrey',
    null,
    null,
    'apprenticeship_dli_and_pgwp_not_verified',
    null,
    null,
    null,
    null,
    'dli_and_pgwp_not_verified_apprenticeship_pathway',
    'https://skilledtradesbc.ca/training-providers/non-public-approved-training-providers',
    date '2026-08-08',
    now(),
    'dli_and_study_permit_eligibility_not_verified',
    'Official SkilledTradesBC trade and provider evidence confirms the Tilesetter apprenticeship training pathway. No DLI or study-permit eligibility is inferred; keep non-publishable until separately verified.'
  from inserted i cross join next_pgwp_id p
  on conflict (program_catalog_id) do update
    set institution_id=excluded.institution_id,
        source_program_key=excluded.source_program_key,
        credential_type=excluded.credential_type,
        education_level=excluded.education_level,
        matched_dli_number=null,
        international_students_eligible=null,
        pgwp_rule_category=excluded.pgwp_rule_category,
        ircc_program_eligible=null,
        pgwp_program_status=excluded.pgwp_program_status,
        source_url=excluded.source_url,
        source_as_of=excluded.source_as_of,
        verified_at=excluded.verified_at,
        international_program_admission_status=excluded.international_program_admission_status,
        rule_notes=excluded.rule_notes
  returning program_catalog_id
)
insert into public.program_occupation_ca_staging (
  program_catalog_id, canonical_career_id, relation_type, match_basis,
  rule_version, review_status, source_checked_at, reviewer_note, reviewed_at
)
select
  p.program_catalog_id,
  'wall-floor-tiler',
  'direct',
  'manual',
  'v1',
  'approved',
  date '2026-08-08',
  'Official SkilledTradesBC evidence confirms Tilesetter apprenticeship technical training. Relationship is direct; international publishability remains held pending DLI/study-permit verification.',
  now()
from pgwp_inserted p
on conflict (program_catalog_id, canonical_career_id) do update
set relation_type=excluded.relation_type,
    match_basis=excluded.match_basis,
    rule_version=excluded.rule_version,
    review_status=excluded.review_status,
    source_checked_at=excluded.source_checked_at,
    reviewer_note=excluded.reviewer_note,
    reviewed_at=excluded.reviewed_at;
