-- Normalize the approved UK Tier A city geographies for stable public routes.
-- Preserve existing UUIDs. This migration normalizes the city entities only;
-- existing legacy campus links remain discovery evidence until Phase 3 verifies them.

with approved(code, public_slug, education_nation, study_scope, boundary_label, scope_note) as (
  values
    ('london-uk', 'london', 'England', 'greater_london', 'Greater London administrative area', 'London is the Greater London study destination. Campus inclusion requires an address or other explicit location evidence within Greater London; legacy London labels are not authoritative.'),
    ('manchester-uk', 'manchester', 'England', 'named_city', 'City of Manchester local authority', 'Use the City of Manchester scope. Do not infer Greater Manchester membership or include Salford or other neighbouring authorities without explicit evidence.'),
    ('birmingham-uk', 'birmingham', 'England', 'named_city', 'Birmingham local authority', 'Use the Birmingham named-city scope. Do not infer West Midlands metropolitan-area membership without explicit evidence.'),
    ('edinburgh-uk', 'edinburgh', 'Scotland', 'named_city', 'City of Edinburgh council area', 'Use the City of Edinburgh named-city scope. Do not infer neighbouring council-area membership without explicit evidence.'),
    ('glasgow-uk', 'glasgow', 'Scotland', 'named_city', 'Glasgow City council area', 'Use the Glasgow named-city scope. Do not infer Greater Glasgow or neighbouring council-area membership without explicit evidence.'),
    ('cardiff-uk', 'cardiff', 'Wales', 'named_city', 'Cardiff local authority', 'Use the Cardiff named-city scope. Do not infer wider South Wales membership without explicit evidence.'),
    ('belfast-uk', 'belfast', 'Northern Ireland', 'named_city', 'Belfast local government district', 'Use the Belfast named-city scope. Do not infer wider Belfast metropolitan-area membership without explicit evidence.'),
    ('oxford-uk', 'oxford', 'England', 'named_city', 'Oxford local authority', 'Use the Oxford named-city scope. Do not infer Oxfordshire-wide membership without explicit evidence.'),
    ('cambridge-uk', 'cambridge', 'England', 'named_city', 'Cambridge local authority', 'Use the Cambridge named-city scope. Do not infer Cambridgeshire-wide membership without explicit evidence.'),
    ('bristol-uk', 'bristol', 'England', 'named_city', 'Bristol, City of local authority', 'Use the Bristol named-city scope. Do not infer the wider West of England study market without explicit evidence.')
)
update core.geographies g
set slug = a.public_slug,
    scope_kind = 'city',
    status = 'active',
    metadata = coalesce(g.metadata, '{}'::jsonb) || jsonb_build_object(
      'uk_city_normalization_v1', true,
      'publication_tier', 'A',
      'public_slug', a.public_slug,
      'education_nation', a.education_nation,
      'study_destination_scope', a.study_scope,
      'scope_boundary_label', a.boundary_label,
      'scope_note', a.scope_note,
      'campus_membership_contract', 'phase_3_explicit_location_evidence_required'
    ),
    updated_at = now()
from approved a
where g.country_code = 'UK'
  and g.geography_type = 'city'
  and g.canonical_geography_id is null
  and g.code = a.code;

insert into core.geography_aliases (
  geography_id, country_code, alias, alias_normalized, region_code,
  alias_type, source_system, source_url
)
select
  g.id,
  'UK',
  g.name,
  lower(regexp_replace(trim(g.name), '\s+', ' ', 'g')),
  g.region_code,
  'canonical_name',
  'core.geographies',
  null
from core.geographies g
where g.country_code = 'UK'
  and g.geography_type = 'city'
  and g.canonical_geography_id is null
  and g.code in (
    'london-uk','manchester-uk','birmingham-uk','edinburgh-uk','glasgow-uk',
    'cardiff-uk','belfast-uk','oxford-uk','cambridge-uk','bristol-uk'
  )
on conflict do nothing;

insert into core.geography_aliases (
  geography_id, country_code, alias, alias_normalized, region_code,
  alias_type, source_system, source_url
)
select
  g.id,
  'UK',
  c.name,
  lower(regexp_replace(trim(c.name), '\s+', ' ', 'g')),
  g.region_code,
  'source',
  'public.cities_uk',
  null
from public.cities_uk c
join core.geographies g
  on g.country_code = 'UK'
 and g.geography_type = 'city'
 and g.canonical_geography_id is null
 and g.code = c.city_slug
where c.city_slug in (
  'london-uk','manchester-uk','birmingham-uk','edinburgh-uk','glasgow-uk',
  'cardiff-uk','belfast-uk','oxford-uk','cambridge-uk','bristol-uk'
)
on conflict do nothing;

insert into core.geography_aliases (
  geography_id, country_code, alias, alias_normalized, region_code,
  alias_type, source_system, source_url
)
select
  g.id,
  'UK',
  c.city_slug,
  lower(trim(c.city_slug)),
  g.region_code,
  'slug',
  'public.cities_uk',
  null
from public.cities_uk c
join core.geographies g
  on g.country_code = 'UK'
 and g.geography_type = 'city'
 and g.canonical_geography_id is null
 and g.code = c.city_slug
where c.city_slug in (
  'london-uk','manchester-uk','birmingham-uk','edinburgh-uk','glasgow-uk',
  'cardiff-uk','belfast-uk','oxford-uk','cambridge-uk','bristol-uk'
)
on conflict do nothing;

insert into core.geography_aliases (
  geography_id, country_code, alias, alias_normalized, region_code,
  alias_type, source_system, source_url
)
select
  g.id,
  'UK',
  g.slug,
  lower(trim(g.slug)),
  g.region_code,
  'slug',
  'core.geographies',
  null
from core.geographies g
where g.country_code = 'UK'
  and g.geography_type = 'city'
  and g.canonical_geography_id is null
  and g.code in (
    'london-uk','manchester-uk','birmingham-uk','edinburgh-uk','glasgow-uk',
    'cardiff-uk','belfast-uk','oxford-uk','cambridge-uk','bristol-uk'
  )
on conflict do nothing;

do $$
declare
  normalized_count integer;
begin
  select count(*) into normalized_count
  from core.geographies g
  where g.country_code = 'UK'
    and g.geography_type = 'city'
    and g.canonical_geography_id is null
    and g.code in (
      'london-uk','manchester-uk','birmingham-uk','edinburgh-uk','glasgow-uk',
      'cardiff-uk','belfast-uk','oxford-uk','cambridge-uk','bristol-uk'
    )
    and g.scope_kind = 'city'
    and g.status = 'active'
    and g.slug is not null
    and g.metadata->>'publication_tier' = 'A'
    and g.metadata->>'campus_membership_contract' = 'phase_3_explicit_location_evidence_required';

  if normalized_count <> 10 then
    raise exception 'UK Tier A city normalization expected 10 rows, found %', normalized_count;
  end if;
end $$;
