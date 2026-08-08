-- New Zealand Tier A university identity foundation.
--
-- The initial NZ publication cohort is the eight state-funded universities
-- recognised by the Ministry of Education / Universities New Zealand.
-- Official provider identity is the NZQA Education Organisation number,
-- described by NZQA as the unique provider number (also Ministry of Education
-- number / provider code). Polytechnic expansion is intentionally separate
-- because the 2026 vocational-sector restructure is still being normalised.

with source_rows(
  provider_number,
  slug,
  canonical_name,
  website_url,
  source_url
) as (
  values
    ('7001', 'university-of-auckland', 'University of Auckland', 'https://www.auckland.ac.nz/', 'https://www.nzqa.govt.nz/providers/details.do?providerId=700122001'),
    ('7008', 'auckland-university-of-technology', 'Auckland University of Technology', 'https://www.aut.ac.nz/', 'https://www.nzqa.govt.nz/providers/details.do?providerId=700800001'),
    ('7002', 'university-of-waikato', 'University of Waikato', 'https://www.waikato.ac.nz/', 'https://www.nzqa.govt.nz/providers/details.do?providerId=700277001'),
    ('7003', 'massey-university', 'Massey University', 'https://www.massey.ac.nz/', 'https://www.nzqa.govt.nz/providers/details.do?providerId=700311001'),
    ('7004', 'victoria-university-of-wellington', 'Victoria University of Wellington', 'https://www.wgtn.ac.nz/', 'https://www.nzqa.govt.nz/providers/details.do?providerId=700493001'),
    ('7005', 'university-of-canterbury', 'University of Canterbury', 'https://www.canterbury.ac.nz/', 'https://www.nzqa.govt.nz/providers/details.do?providerId=700571001'),
    ('7006', 'lincoln-university', 'Lincoln University', 'https://www.lincoln.ac.nz/', 'https://www.nzqa.govt.nz/providers/details.do?providerId=700642001'),
    ('7007', 'university-of-otago', 'University of Otago', 'https://www.otago.ac.nz/', 'https://www.nzqa.govt.nz/providers/details.do?providerId=700726001')
)
insert into catalog.institutions(
  id,
  country_code,
  canonical_name,
  institution_type,
  website_url,
  status,
  slug,
  institution_kind,
  ownership_type
)
select
  md5('nz:moe-provider:' || provider_number)::uuid,
  'NZ',
  canonical_name,
  'university',
  website_url,
  'active',
  slug,
  'university',
  'public'
from source_rows
on conflict (country_code, slug) where slug is not null
do update set
  canonical_name = excluded.canonical_name,
  institution_type = excluded.institution_type,
  website_url = excluded.website_url,
  status = excluded.status,
  institution_kind = excluded.institution_kind,
  ownership_type = excluded.ownership_type,
  updated_at = now();

with source_rows(provider_number, slug, source_url) as (
  values
    ('7001', 'university-of-auckland', 'https://www.nzqa.govt.nz/providers/details.do?providerId=700122001'),
    ('7008', 'auckland-university-of-technology', 'https://www.nzqa.govt.nz/providers/details.do?providerId=700800001'),
    ('7002', 'university-of-waikato', 'https://www.nzqa.govt.nz/providers/details.do?providerId=700277001'),
    ('7003', 'massey-university', 'https://www.nzqa.govt.nz/providers/details.do?providerId=700311001'),
    ('7004', 'victoria-university-of-wellington', 'https://www.nzqa.govt.nz/providers/details.do?providerId=700493001'),
    ('7005', 'university-of-canterbury', 'https://www.nzqa.govt.nz/providers/details.do?providerId=700571001'),
    ('7006', 'lincoln-university', 'https://www.nzqa.govt.nz/providers/details.do?providerId=700642001'),
    ('7007', 'university-of-otago', 'https://www.nzqa.govt.nz/providers/details.do?providerId=700726001')
)
insert into catalog.institution_identifiers(
  institution_id,
  identifier_system,
  identifier_value,
  source_url
)
select
  i.id,
  'NZ_MOE_PROVIDER_NUMBER',
  s.provider_number,
  s.source_url
from source_rows s
join catalog.institutions i
  on i.country_code = 'NZ'
 and i.slug = s.slug
on conflict (identifier_system, identifier_value)
do update set
  institution_id = excluded.institution_id,
  source_url = excluded.source_url;

create or replace view public.institution_identity_nz_v1
with (security_invoker = true) as
select
  i.id as institution_id,
  i.country_code,
  i.slug,
  i.canonical_name,
  official.identifier_value as provider_number,
  official.source_url as provider_source_url
from catalog.institutions i
join catalog.institution_identifiers official
  on official.institution_id = i.id
 and official.identifier_system = 'NZ_MOE_PROVIDER_NUMBER'
where i.country_code = 'NZ'
  and i.status <> 'inactive'
  and i.slug is not null;

comment on view public.institution_identity_nz_v1 is
  'Service-role New Zealand university identity read model. NZ_MOE_PROVIDER_NUMBER is the NZQA Education Organisation number / Ministry of Education provider code.';

revoke all on public.institution_identity_nz_v1 from public, anon, authenticated;
grant select on public.institution_identity_nz_v1 to service_role;

do $$
declare
  institution_count integer;
  identity_count integer;
  invalid_provider_count integer;
  duplicate_provider_count integer;
  bad_website_count integer;
  bad_classification_count integer;
begin
  select count(*) into institution_count
  from catalog.institutions
  where country_code = 'NZ'
    and status <> 'inactive';

  if institution_count <> 8 then
    raise exception 'Expected 8 active NZ Tier A universities, found %', institution_count;
  end if;

  select count(*) into identity_count
  from public.institution_identity_nz_v1;

  if identity_count <> 8 then
    raise exception 'Expected 8 NZ provider identities, found %', identity_count;
  end if;

  select count(*) into invalid_provider_count
  from public.institution_identity_nz_v1
  where provider_number !~ '^[0-9]{4}$'
     or provider_source_url !~ '^https://www[.]nzqa[.]govt[.]nz/providers/details[.]do[?]providerId=';

  if invalid_provider_count > 0 then
    raise exception 'Found % invalid NZ provider identities', invalid_provider_count;
  end if;

  select count(*) into duplicate_provider_count
  from (
    select provider_number
    from public.institution_identity_nz_v1
    group by provider_number
    having count(*) > 1
  ) d;

  if duplicate_provider_count > 0 then
    raise exception 'Found % duplicate NZ provider numbers', duplicate_provider_count;
  end if;

  select count(*) into bad_website_count
  from catalog.institutions
  where country_code = 'NZ'
    and status <> 'inactive'
    and (website_url is null or website_url !~ '^https://');

  if bad_website_count > 0 then
    raise exception 'Found % NZ universities without HTTPS official websites', bad_website_count;
  end if;

  select count(*) into bad_classification_count
  from catalog.institutions
  where country_code = 'NZ'
    and status <> 'inactive'
    and (
      institution_kind is distinct from 'university'
      or ownership_type is distinct from 'public'
    );

  if bad_classification_count > 0 then
    raise exception 'Found % NZ universities without source-backed university/public classification', bad_classification_count;
  end if;
end $$;
