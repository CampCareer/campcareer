-- UK institution identity QA: promote the official UK Provider Reference Number
-- (UKPRN) alongside the legacy CampCareer provider slug used by older imports.
--
-- Primary cross-UK source: Discover Uni institution profiles. The institution
-- detail route is keyed by the 8-digit UKPRN. HESA documents UKPRN as the
-- UKRLP-allocated unique provider identifier used across England, Scotland,
-- Wales and Northern Ireland.
--
-- HESA current-provider reference:
-- https://www.hesa.ac.uk/collection/provider-tools/all_hesa_providers
-- Discover Uni provider profiles:
-- https://discoveruni.gov.uk/
--
-- IMPORTANT: UK_PROVIDER_ID is retained as a legacy deterministic join key for
-- the existing courses_uk import. It is not an official regulatory identifier.

with identity_rows(legacy_provider_id, ukprn) as (
  values
    ('aston-university', '10007759'),
    ('brunel-university-london', '10000961'),
    ('cardiff-university', '10007814'),
    ('city-university-of-london', '10001478'),
    ('coventry-university', '10001726'),
    ('durham-university', '10007143'),
    ('heriot-watt-university', '10007764'),
    ('imperial-college-london', '10003270'),
    ('king-s-college-london', '10003645'),
    ('lancaster-university', '10007768'),
    ('london-school-of-economics-and-political-science', '10004063'),
    ('loughborough-university', '10004113'),
    ('newcastle-university', '10007799'),
    ('nottingham-trent-university', '10004797'),
    ('queen-mary-university-of-london', '10007775'),
    ('queen-s-university-belfast', '10005343'),
    ('royal-holloway-university-of-london', '10005553'),
    ('swansea-university', '10007855'),
    ('ulster-university', '10007807'),
    ('university-college-london', '10007784'),
    ('university-of-aberdeen', '10007783'),
    ('university-of-bath', '10007850'),
    ('university-of-birmingham', '10006840'),
    ('university-of-bradford', '10007785'),
    ('university-of-bristol', '10007786'),
    ('university-of-cambridge', '10007788'),
    ('university-of-east-anglia', '10007789'),
    ('university-of-edinburgh', '10007790'),
    ('university-of-essex', '10007791'),
    ('university-of-exeter', '10007792'),
    ('university-of-glasgow', '10007794'),
    ('university-of-hertfordshire', '10007147'),
    ('university-of-kent', '10007150'),
    ('university-of-leeds', '10007795'),
    ('university-of-leicester', '10007796'),
    ('university-of-liverpool', '10006842'),
    ('university-of-manchester', '10007798'),
    ('university-of-nottingham', '10007154'),
    ('university-of-oxford', '10007774'),
    ('university-of-plymouth', '10007801'),
    ('university-of-reading', '10007802'),
    ('university-of-salford', '10007156'),
    ('university-of-sheffield', '10007157'),
    ('university-of-southampton', '10007158'),
    ('university-of-st-andrews', '10007803'),
    ('university-of-strathclyde', '10007805'),
    ('university-of-surrey', '10007160'),
    ('university-of-sussex', '10007806'),
    ('university-of-warwick', '10007163'),
    ('university-of-york', '10007167')
)
insert into catalog.institution_identifiers(
  institution_id,
  identifier_system,
  identifier_value,
  source_url
)
select
  legacy.institution_id,
  'UK_UKPRN',
  source.ukprn,
  'https://discoveruni.gov.uk/institution-details/' || source.ukprn || '/'
from identity_rows source
join catalog.institution_identifiers legacy
  on legacy.identifier_system = 'UK_PROVIDER_ID'
 and legacy.identifier_value = source.legacy_provider_id
join catalog.institutions i
  on i.id = legacy.institution_id
 and i.country_code = 'UK'
on conflict (identifier_system, identifier_value)
do update set
  institution_id = excluded.institution_id,
  source_url = excluded.source_url;

create or replace view public.institution_identity_uk_v1
with (security_invoker = true) as
select
  i.id as institution_id,
  i.country_code,
  i.slug,
  i.canonical_name,
  official.identifier_value as ukprn,
  official.source_url as ukprn_source_url,
  legacy.identifier_value as legacy_provider_id
from catalog.institutions i
join catalog.institution_identifiers official
  on official.institution_id = i.id
 and official.identifier_system = 'UK_UKPRN'
left join catalog.institution_identifiers legacy
  on legacy.institution_id = i.id
 and legacy.identifier_system = 'UK_PROVIDER_ID'
where i.country_code = 'UK'
  and i.status <> 'inactive'
  and i.slug is not null;

comment on view public.institution_identity_uk_v1 is
  'Service-role UK institution identity read model. UK_UKPRN is the official 8-digit UKRLP provider identifier; legacy_provider_id is retained only for deterministic historical import joins.';

revoke all on public.institution_identity_uk_v1 from public, anon, authenticated;
grant select on public.institution_identity_uk_v1 to service_role;

do $$
declare
  official_count integer;
  legacy_count integer;
  invalid_ukprn_count integer;
  missing_official_count integer;
  orphan_official_count integer;
  duplicate_institution_count integer;
  duplicate_value_count integer;
  wrong_source_count integer;
  active_program_count integer;
  city_identity_ok boolean;
  brunel_identity_ok boolean;
begin
  select count(*)
  into official_count
  from catalog.institution_identifiers ii
  join catalog.institutions i on i.id = ii.institution_id
  where ii.identifier_system = 'UK_UKPRN'
    and i.country_code = 'UK';

  if official_count <> 50 then
    raise exception 'Expected 50 UK_UKPRN identities, found %', official_count;
  end if;

  select count(*)
  into legacy_count
  from catalog.institution_identifiers ii
  join catalog.institutions i on i.id = ii.institution_id
  where ii.identifier_system = 'UK_PROVIDER_ID'
    and i.country_code = 'UK';

  if legacy_count <> 50 then
    raise exception 'Expected 50 legacy UK provider identities, found %', legacy_count;
  end if;

  select count(*)
  into invalid_ukprn_count
  from catalog.institution_identifiers ii
  join catalog.institutions i on i.id = ii.institution_id
  where ii.identifier_system = 'UK_UKPRN'
    and i.country_code = 'UK'
    and ii.identifier_value !~ '^[0-9]{8}$';

  if invalid_ukprn_count > 0 then
    raise exception 'Found % invalid UKPRN values', invalid_ukprn_count;
  end if;

  select count(*)
  into missing_official_count
  from catalog.institution_identifiers legacy
  join catalog.institutions i on i.id = legacy.institution_id
  left join catalog.institution_identifiers official
    on official.institution_id = i.id
   and official.identifier_system = 'UK_UKPRN'
  where legacy.identifier_system = 'UK_PROVIDER_ID'
    and i.country_code = 'UK'
    and official.id is null;

  if missing_official_count > 0 then
    raise exception 'Found % legacy UK providers without official UKPRN identity', missing_official_count;
  end if;

  select count(*)
  into orphan_official_count
  from catalog.institution_identifiers official
  join catalog.institutions i on i.id = official.institution_id
  left join catalog.institution_identifiers legacy
    on legacy.institution_id = i.id
   and legacy.identifier_system = 'UK_PROVIDER_ID'
  where official.identifier_system = 'UK_UKPRN'
    and i.country_code = 'UK'
    and legacy.id is null;

  if orphan_official_count > 0 then
    raise exception 'Found % UKPRNs without legacy provider identity', orphan_official_count;
  end if;

  select count(*) - count(distinct ii.institution_id)
  into duplicate_institution_count
  from catalog.institution_identifiers ii
  join catalog.institutions i on i.id = ii.institution_id
  where ii.identifier_system = 'UK_UKPRN'
    and i.country_code = 'UK';

  if duplicate_institution_count > 0 then
    raise exception 'Found % duplicate UKPRN assignments by institution', duplicate_institution_count;
  end if;

  select count(*) - count(distinct ii.identifier_value)
  into duplicate_value_count
  from catalog.institution_identifiers ii
  join catalog.institutions i on i.id = ii.institution_id
  where ii.identifier_system = 'UK_UKPRN'
    and i.country_code = 'UK';

  if duplicate_value_count > 0 then
    raise exception 'Found % duplicated UKPRN values', duplicate_value_count;
  end if;

  select count(*)
  into wrong_source_count
  from catalog.institution_identifiers ii
  join catalog.institutions i on i.id = ii.institution_id
  where ii.identifier_system = 'UK_UKPRN'
    and i.country_code = 'UK'
    and ii.source_url is distinct from
      ('https://discoveruni.gov.uk/institution-details/' || ii.identifier_value || '/');

  if wrong_source_count > 0 then
    raise exception 'Found % UKPRN identities without canonical Discover Uni source URLs', wrong_source_count;
  end if;

  select count(*)
  into active_program_count
  from catalog.programmes p
  join catalog.institutions i on i.id = p.institution_id
  join catalog.institution_identifiers official
    on official.institution_id = i.id
   and official.identifier_system = 'UK_UKPRN'
  where i.country_code = 'UK'
    and p.status = 'active';

  if active_program_count <> 185 then
    raise exception 'Expected 185 active programmes across UKPRN-mapped institutions, found %', active_program_count;
  end if;

  select exists (
    select 1
    from public.institution_identity_uk_v1 v
    where v.ukprn = '10001478'
      and v.slug = 'city-st-georges-university-of-london'
      and v.legacy_provider_id = 'city-university-of-london'
  ) into city_identity_ok;

  if not city_identity_ok then
    raise exception 'City St George''s successor identity did not preserve the legacy City provider join';
  end if;

  select exists (
    select 1
    from public.institution_identity_uk_v1 v
    where v.ukprn = '10000961'
      and v.slug = 'brunel-university-of-london'
      and v.legacy_provider_id = 'brunel-university-london'
  ) into brunel_identity_ok;

  if not brunel_identity_ok then
    raise exception 'Brunel current identity did not preserve the legacy provider join';
  end if;
end $$;
