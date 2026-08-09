-- Keep the Canada canonical programme cohort synchronized with the latest
-- source-status verification in program_catalog_ca_staging.
--
-- This migration intentionally does not hard-code the active/inactive/unknown
-- split because programme verification can legitimately change after the base
-- canonicalization migration. It fails closed on key coverage and requires the
-- canonical cohort to match the current staging snapshot exactly.

with src as (
  select
    s.institution_id as program_catalog_id,
    lower(regexp_replace(btrim(s.title),'\s+',' ','g')) as normalized_title,
    coalesce(lower(btrim(s.credential_type)),'') as normalized_credential,
    coalesce(lower(btrim(s.program_code)),'') as normalized_program_code,
    case
      when s.source_status ~ '^(excluded_|cancelled|suspended|not_accepting|not_currently|one_time_delivery_closed|admissions_suspended|legacy_program_not_accepting)'
        or s.source_status in ('official_link_verified_no_current_offering','official_program_page_international_ineligible_2026')
        then 'inactive'
      when s.source_status ~ '^pending_review'
        or s.source_status ~ '^legacy_program_pre_'
        or s.source_status ~ '^starts_fall_2027'
        then 'unknown'
      else 'active'
    end as row_status
  from public.program_catalog_ca_staging s
), desired as (
  select
    program_catalog_id || ':' || md5(normalized_title || chr(31) || normalized_credential || chr(31) || normalized_program_code) as canonical_key,
    case
      when bool_or(row_status='active') then 'active'
      when bool_or(row_status='unknown') then 'unknown'
      else 'inactive'
    end as desired_status
  from src
  group by program_catalog_id, normalized_title, normalized_credential, normalized_program_code
), targets as (
  select p.id as programme_id, d.desired_status
  from desired d
  join catalog.programme_identifiers pi
    on pi.identifier_system='CA_PROGRAM_CANONICAL_KEY'
   and pi.identifier_value=d.canonical_key
  join catalog.programmes p on p.id=pi.programme_id
  join catalog.institutions i on i.id=p.institution_id and i.country_code='CA'
)
update catalog.programmes p
set status=t.desired_status, updated_at=now()
from targets t
where p.id=t.programme_id
  and p.status is distinct from t.desired_status;

do $$
declare
  desired_count integer;
  canonical_count integer;
  missing_key_count integer;
  mismatch_count integer;
  source_identity_count integer;
  active_institution_count integer;
  legacy_active_count integer;
begin
  with src as (
    select
      s.institution_id as program_catalog_id,
      lower(regexp_replace(btrim(s.title),'\s+',' ','g')) as normalized_title,
      coalesce(lower(btrim(s.credential_type)),'') as normalized_credential,
      coalesce(lower(btrim(s.program_code)),'') as normalized_program_code,
      case
        when s.source_status ~ '^(excluded_|cancelled|suspended|not_accepting|not_currently|one_time_delivery_closed|admissions_suspended|legacy_program_not_accepting)'
          or s.source_status in ('official_link_verified_no_current_offering','official_program_page_international_ineligible_2026')
          then 'inactive'
        when s.source_status ~ '^pending_review'
          or s.source_status ~ '^legacy_program_pre_'
          or s.source_status ~ '^starts_fall_2027'
          then 'unknown'
        else 'active'
      end as row_status
    from public.program_catalog_ca_staging s
  ), desired as (
    select
      program_catalog_id || ':' || md5(normalized_title || chr(31) || normalized_credential || chr(31) || normalized_program_code) as canonical_key,
      case
        when bool_or(row_status='active') then 'active'
        when bool_or(row_status='unknown') then 'unknown'
        else 'inactive'
      end as desired_status
    from src
    group by program_catalog_id, normalized_title, normalized_credential, normalized_program_code
  )
  select count(*) into desired_count from desired;

  select count(*) into canonical_count from public.program_catalog_canonical_ca_v1;
  if desired_count<>6634 or canonical_count<>6634 then
    raise exception 'Expected 6634 staged/canonical Canadian programme groups, found desired % canonical %',desired_count,canonical_count;
  end if;

  with src as (
    select
      s.institution_id as program_catalog_id,
      lower(regexp_replace(btrim(s.title),'\s+',' ','g')) as normalized_title,
      coalesce(lower(btrim(s.credential_type)),'') as normalized_credential,
      coalesce(lower(btrim(s.program_code)),'') as normalized_program_code
    from public.program_catalog_ca_staging s
  ), desired as (
    select
      program_catalog_id || ':' || md5(normalized_title || chr(31) || normalized_credential || chr(31) || normalized_program_code) as canonical_key
    from src
    group by program_catalog_id,normalized_title,normalized_credential,normalized_program_code
  )
  select count(*) into missing_key_count
  from desired d
  left join catalog.programme_identifiers pi
    on pi.identifier_system='CA_PROGRAM_CANONICAL_KEY'
   and pi.identifier_value=d.canonical_key
  where pi.id is null;

  if missing_key_count<>0 then
    raise exception 'Found % Canadian staged programme groups without canonical keys',missing_key_count;
  end if;

  with src as (
    select
      s.institution_id as program_catalog_id,
      lower(regexp_replace(btrim(s.title),'\s+',' ','g')) as normalized_title,
      coalesce(lower(btrim(s.credential_type)),'') as normalized_credential,
      coalesce(lower(btrim(s.program_code)),'') as normalized_program_code,
      case
        when s.source_status ~ '^(excluded_|cancelled|suspended|not_accepting|not_currently|one_time_delivery_closed|admissions_suspended|legacy_program_not_accepting)'
          or s.source_status in ('official_link_verified_no_current_offering','official_program_page_international_ineligible_2026') then 'inactive'
        when s.source_status ~ '^pending_review'
          or s.source_status ~ '^legacy_program_pre_'
          or s.source_status ~ '^starts_fall_2027' then 'unknown'
        else 'active'
      end as row_status
    from public.program_catalog_ca_staging s
  ), desired as (
    select
      program_catalog_id || ':' || md5(normalized_title || chr(31) || normalized_credential || chr(31) || normalized_program_code) as canonical_key,
      case when bool_or(row_status='active') then 'active' when bool_or(row_status='unknown') then 'unknown' else 'inactive' end as desired_status
    from src
    group by program_catalog_id,normalized_title,normalized_credential,normalized_program_code
  )
  select count(*) into mismatch_count
  from desired d
  join catalog.programme_identifiers pi
    on pi.identifier_system='CA_PROGRAM_CANONICAL_KEY'
   and pi.identifier_value=d.canonical_key
  join catalog.programmes p on p.id=pi.programme_id
  where p.status is distinct from d.desired_status;

  if mismatch_count<>0 then
    raise exception 'Found % Canadian canonical programme statuses out of sync with staging',mismatch_count;
  end if;

  select count(*) into source_identity_count
  from catalog.programme_identifiers pi
  join catalog.programmes p on p.id=pi.programme_id
  join catalog.institutions i on i.id=p.institution_id and i.country_code='CA'
  where pi.identifier_system='CA_PROGRAM_CATALOG_SOURCE_HASH';

  if source_identity_count<>6638 then
    raise exception 'Expected 6638 Canadian programme source identities, found %',source_identity_count;
  end if;

  select count(distinct institution_id) into active_institution_count
  from public.program_catalog_canonical_ca_v1
  where status='active';

  if active_institution_count<>49 then
    raise exception 'Expected active Canadian canonical programmes across all 49 catalog institutions, found %',active_institution_count;
  end if;

  select count(*) into legacy_active_count
  from catalog.programmes p
  join catalog.programme_identifiers legacy
    on legacy.programme_id=p.id
   and legacy.identifier_system='LEGACY_COURSES_CA_ID'
  join catalog.institutions i on i.id=p.institution_id and i.country_code='CA'
  where p.status='active';

  if legacy_active_count<>0 then
    raise exception 'Found % active legacy Canadian programmes after status sync',legacy_active_count;
  end if;
end $$;
