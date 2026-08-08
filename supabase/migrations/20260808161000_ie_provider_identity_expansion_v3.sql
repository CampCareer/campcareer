-- Ireland source-backed provider identity expansion v3.
--
-- This cohort covers three high-impact provider-level records that should not be
-- forced into the HEA / private-HEI / ETB-centre identity buckets:
--   * IOB: current official trading name; recognised college of UCD.
--   * SOLAS: national FET authority and QQI programme provider.
--   * The Open College: QQI programme provider with its current official brand.
--
-- Sources:
-- IOB: https://iob.ie/info/ucd and https://iob.ie/
-- SOLAS: https://www.solas.ie/about/ and QQI QSearch programme PG22036
-- The Open College: QQI QSearch programme PG17256 and official website.
--
-- No numeric provider code is invented. Existing Qualifax identifiers remain
-- import keys and continue to resolve the same canonical institution UUID.

create temp table ie_provider_expansion_v3(
  legacy_slug text primary key,
  canonical_slug text not null,
  canonical_name text not null,
  institution_kind text not null,
  ownership_type text not null,
  website_url text not null,
  identity_system text not null,
  identity_value text not null,
  identity_source_url text not null,
  expected_programs integer not null
) on commit drop;

insert into ie_provider_expansion_v3 values
  (
    'institute-of-banking',
    'iob',
    'IOB',
    'college',
    'private_nonprofit',
    'https://iob.ie/',
    'IE_OFFICIAL_PROVIDER_NAME',
    'IOB',
    'https://iob.ie/info/ucd',
    33
  ),
  (
    'solas',
    'solas',
    'SOLAS',
    'other',
    'public',
    'https://www.solas.ie/',
    'IE_QQI_PROVIDER_NAME',
    'Solas',
    'https://qsearch.qqi.ie/WebPart/ProgrammeDetails?programmeCode=PG22036',
    20
  ),
  (
    'open-college',
    'open-college',
    'The Open College',
    'other',
    'private',
    'https://www.theopencollege.com/',
    'IE_QQI_PROVIDER_NAME',
    'The Open College',
    'https://qsearch.qqi.ie/WebPart/ProgrammeDetails?programmeCode=PG17256',
    13
  );

-- Fail closed before a current-brand slug update.
do $$
declare
  missing_source_count integer;
  collision_count integer;
begin
  select count(*)
  into missing_source_count
  from ie_provider_expansion_v3 p
  left join catalog.institutions i
    on i.country_code='IE' and i.slug=p.legacy_slug
  where i.id is null;

  if missing_source_count>0 then
    raise exception 'Ireland provider expansion is missing % expected legacy institutions',missing_source_count;
  end if;

  select count(*)
  into collision_count
  from ie_provider_expansion_v3 p
  join catalog.institutions source
    on source.country_code='IE' and source.slug=p.legacy_slug
  join catalog.institutions target
    on target.country_code='IE' and target.slug=p.canonical_slug
  where source.id<>target.id;

  if collision_count>0 then
    raise exception 'Found % Ireland provider canonical-slug collisions',collision_count;
  end if;
end $$;

update catalog.institutions i
set
  slug=p.canonical_slug,
  canonical_name=p.canonical_name,
  institution_kind=p.institution_kind,
  ownership_type=p.ownership_type,
  website_url=p.website_url,
  status='active',
  updated_at=now()
from ie_provider_expansion_v3 p
where i.country_code='IE'
  and i.slug=p.legacy_slug;

insert into catalog.institution_identifiers(
  institution_id,identifier_system,identifier_value,source_url
)
select
  i.id,
  p.identity_system,
  p.identity_value,
  p.identity_source_url
from ie_provider_expansion_v3 p
join catalog.institutions i
  on i.country_code='IE'
 and i.slug=p.canonical_slug
 and i.status<>'inactive'
on conflict(identifier_system,identifier_value)
do update set
  institution_id=excluded.institution_id,
  source_url=excluded.source_url;

create or replace view public.institution_identity_ie_provider_v1
with (security_invoker=true) as
select
  i.id as institution_id,
  i.country_code,
  i.slug,
  i.canonical_name,
  i.institution_kind,
  i.ownership_type,
  i.website_url,
  official.identifier_system as identity_system,
  official.identifier_value as official_provider_name,
  official.source_url as identity_source_url,
  coalesce(
    array_agg(distinct legacy.identifier_value order by legacy.identifier_value)
      filter(where legacy.identifier_value is not null),
    array[]::text[]
  ) as legacy_provider_ids
from catalog.institutions i
join catalog.institution_identifiers official
  on official.institution_id=i.id
 and official.identifier_system in ('IE_OFFICIAL_PROVIDER_NAME','IE_QQI_PROVIDER_NAME')
left join catalog.institution_identifiers legacy
  on legacy.institution_id=i.id
 and legacy.identifier_system in ('IE_PROVIDER_ID','IE_LEGACY_COLLEGE_NAME')
where i.country_code='IE'
  and i.status<>'inactive'
  and i.slug is not null
group by
  i.id,i.country_code,i.slug,i.canonical_name,i.institution_kind,
  i.ownership_type,i.website_url,
  official.identifier_system,official.identifier_value,official.source_url;

comment on view public.institution_identity_ie_provider_v1 is
  'Service-role Ireland source-backed provider identity cohort for provider-level records outside the HEA/private-HEI/FET-centre buckets. No legacy import key is presented as an official provider code.';

revoke all on public.institution_identity_ie_provider_v1 from public,anon,authenticated;
grant select on public.institution_identity_ie_provider_v1 to service_role;

do $$
declare
  identity_count integer;
  cohort_program_count integer;
  active_program_count integer;
  mismatch_count integer;
  bad_source_count integer;
begin
  select count(*) into identity_count
  from public.institution_identity_ie_provider_v1;
  if identity_count<>3 then
    raise exception 'Expected 3 Ireland provider identities in expansion v3, found %',identity_count;
  end if;

  select count(*) into mismatch_count
  from ie_provider_expansion_v3 expected
  join catalog.institutions i
    on i.country_code='IE' and i.slug=expected.canonical_slug
  left join lateral (
    select count(*)::integer as program_count
    from catalog.programmes p
    where p.institution_id=i.id and p.status='active'
  ) programmes on true
  where programmes.program_count<>expected.expected_programs;

  if mismatch_count>0 then
    raise exception 'Found % Ireland provider expansion programme-count mismatches',mismatch_count;
  end if;

  select count(*) into cohort_program_count
  from catalog.programmes p
  join catalog.institutions i on i.id=p.institution_id
  join catalog.institution_identifiers ii
    on ii.institution_id=i.id
   and ii.identifier_system in ('IE_OFFICIAL_PROVIDER_NAME','IE_QQI_PROVIDER_NAME')
  where i.country_code='IE' and p.status='active';

  if cohort_program_count<>66 then
    raise exception 'Expected 66 active programmes across IOB, SOLAS and The Open College, found %',cohort_program_count;
  end if;

  select count(*) into active_program_count
  from catalog.programmes p
  join catalog.institutions i on i.id=p.institution_id
  where i.country_code='IE' and p.status='active';

  if active_program_count<>2876 then
    raise exception 'Expected all 2876 Irish active programmes to remain connected after provider expansion v3, found %',active_program_count;
  end if;

  select count(*) into bad_source_count
  from public.institution_identity_ie_provider_v1
  where website_url !~ '^https://'
     or identity_source_url !~ '^https://';

  if bad_source_count>0 then
    raise exception 'Found % Ireland provider identities without HTTPS official provenance',bad_source_count;
  end if;
end $$;
