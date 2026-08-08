-- Normalize existing Australian campus city strings onto stable canonical geography IDs.
-- Raw ingest/public compatibility city strings remain untouched in this phase.

-- 1) Prepare canonical ABS Significant Urban Area records used by current campuses.
with state_map(state_abbr, abs_region_code) as (
  values ('NSW','1'),('VIC','2'),('QLD','3'),('SA','4'),('WA','5'),('TAS','6'),('NT','7'),('ACT','8')
), relevant_names as (
  select distinct c.city as name
  from catalog.campuses c
  where c.country_code='AU' and c.status='active' and c.city is not null
  union all select 'Sunshine Coast'
)
update core.geographies g
set slug = regexp_replace(regexp_replace(lower(g.name), '[^a-z0-9]+', '-', 'g'), '(^-|-$)', '', 'g'),
    scope_kind = 'metro',
    status = 'active',
    updated_at = now()
from state_map sm
where g.country_code='AU'
  and g.geography_type='city'
  and g.region_code=sm.abs_region_code
  and g.metadata->>'source_id'='au-abs-32180ds0004-v1'
  and exists (select 1 from relevant_names rn where lower(rn.name)=lower(g.name));

-- 2) Ensure official city records sit under their state/territory geography.
with state_map(state_abbr, abs_region_code, state_name) as (
  values
    ('NSW','1','New South Wales'),('VIC','2','Victoria'),('QLD','3','Queensland'),
    ('SA','4','South Australia'),('WA','5','Western Australia'),('TAS','6','Tasmania'),
    ('NT','7','Northern Territory'),('ACT','8','Australian Capital Territory')
)
update core.geographies city
set parent_id = region.id,
    updated_at = now()
from state_map sm
join core.geographies region
  on region.country_code='AU'
 and region.geography_type='region'
 and region.code=sm.abs_region_code
where city.country_code='AU'
  and city.geography_type='city'
  and city.region_code=sm.abs_region_code
  and city.metadata->>'source_id'='au-abs-32180ds0004-v1';

-- 3) Convert legacy duplicate city rows into redirect/alias records pointing to ABS canonical cities.
with state_map(state_abbr, abs_region_code) as (
  values ('NSW','1'),('VIC','2'),('QLD','3'),('SA','4'),('WA','5'),('TAS','6'),('NT','7'),('ACT','8')
), matches as (
  select legacy.id as legacy_id, official.id as official_id
  from core.geographies legacy
  join state_map sm on sm.state_abbr=legacy.region_code
  join core.geographies official
    on official.country_code='AU'
   and official.geography_type='city'
   and official.region_code=sm.abs_region_code
   and lower(official.name)=lower(legacy.name)
   and official.metadata->>'source_id'='au-abs-32180ds0004-v1'
  where legacy.country_code='AU'
    and legacy.geography_type='city'
    and legacy.metadata->>'legacy_table'='cities_au'
)
update core.geographies legacy
set geography_type='other',
    canonical_geography_id=matches.official_id,
    scope_kind='legacy_alias',
    status='deprecated',
    updated_at=now()
from matches
where legacy.id=matches.legacy_id;

-- 4) Keep current small-city records canonical where the ABS SUA subset has no matching row yet.
with state_map(state_abbr, abs_region_code) as (
  values ('NSW','1'),('VIC','2'),('QLD','3'),('SA','4'),('WA','5'),('TAS','6'),('NT','7'),('ACT','8')
)
update core.geographies city
set slug=regexp_replace(regexp_replace(lower(city.name), '[^a-z0-9]+', '-', 'g'), '(^-|-$)', '', 'g'),
    scope_kind='city',
    status='active',
    parent_id=region.id,
    canonical_geography_id=null,
    updated_at=now()
from state_map sm
join core.geographies region
  on region.country_code='AU'
 and region.geography_type='region'
 and region.code=sm.abs_region_code
where city.country_code='AU'
  and city.geography_type='city'
  and city.metadata->>'legacy_table'='cities_au'
  and city.region_code=sm.state_abbr
  and city.name in ('Armidale','Bathurst','Lismore');

-- 5) Sippy Downs is a locality inside the Sunshine Coast city/metro geography.
with sunshine as (
  select id
  from core.geographies
  where country_code='AU'
    and geography_type='city'
    and name='Sunshine Coast'
    and region_code='3'
    and metadata->>'source_id'='au-abs-32180ds0004-v1'
  limit 1
)
update core.geographies locality
set geography_type='locality',
    slug='sippy-downs',
    scope_kind='locality',
    parent_id=sunshine.id,
    canonical_geography_id=null,
    status='active',
    updated_at=now()
from sunshine
where locality.country_code='AU'
  and locality.metadata->>'legacy_table'='cities_au'
  and locality.name='Sippy Downs'
  and locality.region_code='QLD';

-- 6) Point campus rows with exact ABS city matches at the canonical city IDs.
with state_map(state_abbr, abs_region_code) as (
  values ('NSW','1'),('VIC','2'),('QLD','3'),('SA','4'),('WA','5'),('TAS','6'),('NT','7'),('ACT','8')
), official as (
  select g.id, g.name, sm.state_abbr
  from core.geographies g
  join state_map sm on sm.abs_region_code=g.region_code
  where g.country_code='AU'
    and g.geography_type='city'
    and g.metadata->>'source_id'='au-abs-32180ds0004-v1'
)
update catalog.campuses c
set geography_id=official.id,
    city=official.name,
    metadata=c.metadata || jsonb_build_object(
      'city_normalization_method','abs_sua_exact',
      'city_normalized_at','2026-08-07',
      'original_city',c.city
    ),
    updated_at=now()
from official
where c.country_code='AU'
  and c.status='active'
  and c.region=official.state_abbr
  and lower(c.city)=lower(official.name);

-- 7) Resolve the three small-city campuses to their stable canonical geography rows.
update catalog.campuses c
set geography_id=g.id,
    city=g.name,
    metadata=c.metadata || jsonb_build_object(
      'city_normalization_method','stable_city_fallback',
      'city_normalized_at','2026-08-07',
      'original_city',c.city,
      'canonical_source_status','ABS SUA match not present in current core subset'
    ),
    updated_at=now()
from core.geographies g
where c.country_code='AU'
  and c.status='active'
  and g.country_code='AU'
  and g.geography_type='city'
  and g.metadata->>'legacy_table'='cities_au'
  and g.name in ('Armidale','Bathurst','Lismore')
  and lower(c.city)=lower(g.name)
  and c.region=g.region_code;

-- 8) Resolve Sippy Downs as locality + Sunshine Coast city.
with sunshine as (
  select id, name
  from core.geographies
  where country_code='AU' and geography_type='city' and name='Sunshine Coast' and region_code='3'
    and metadata->>'source_id'='au-abs-32180ds0004-v1'
  limit 1
), sippy as (
  select id, name
  from core.geographies
  where country_code='AU' and geography_type='locality' and name='Sippy Downs' and region_code='QLD'
  limit 1
)
update catalog.campuses c
set geography_id=sunshine.id,
    city=sunshine.name,
    locality=sippy.name,
    locality_geography_id=sippy.id,
    metadata=c.metadata || jsonb_build_object(
      'city_normalization_method','locality_to_parent_city',
      'city_normalized_at','2026-08-07',
      'original_city','Sippy Downs'
    ),
    updated_at=now()
from sunshine, sippy
where c.country_code='AU'
  and c.status='active'
  and c.region='QLD'
  and c.city='Sippy Downs';

-- 9) Register source names and legacy slugs as aliases without duplicating geography rows.
with legacy as (
  select g.*
  from core.geographies g
  where g.country_code='AU' and g.metadata->>'legacy_table'='cities_au'
), resolved as (
  select
    l.id,
    case
      when l.geography_type='locality' then l.id
      else coalesce(l.canonical_geography_id,l.id)
    end as target_id,
    l.name,
    l.code,
    l.region_code,
    l.geography_type
  from legacy l
), aliases as (
  select target_id, name as alias, lower(regexp_replace(trim(name), '\s+', ' ', 'g')) as alias_normalized,
         region_code, case when geography_type='locality' then 'locality' else 'legacy' end as alias_type
  from resolved
  union all
  select target_id, code as alias, lower(code) as alias_normalized,
         region_code, 'slug' as alias_type
  from resolved
  where code is not null
)
insert into core.geography_aliases (
  geography_id,country_code,alias,alias_normalized,region_code,alias_type,source_system,source_url
)
select target_id,'AU',alias,alias_normalized,region_code,alias_type,'ingest.cities_au',null
from aliases
on conflict do nothing;

-- 10) Register canonical names and slugs for every city currently used by an Australian campus.
with used_city as (
  select distinct g.id, g.name, g.slug, c.region
  from catalog.campuses c
  join core.geographies g on g.id=c.geography_id
  where c.country_code='AU' and c.status='active' and g.geography_type='city'
), aliases as (
  select id as geography_id, name as alias,
         lower(regexp_replace(trim(name), '\s+', ' ', 'g')) as alias_normalized,
         region as region_code, 'canonical_name' as alias_type
  from used_city
  union all
  select id, slug, lower(slug), region, 'slug'
  from used_city where slug is not null
)
insert into core.geography_aliases (
  geography_id,country_code,alias,alias_normalized,region_code,alias_type,source_system,source_url
)
select geography_id,'AU',alias,alias_normalized,region_code,alias_type,'core.geographies',null
from aliases
on conflict do nothing;

-- 11) Guardrails: every active AU campus must resolve to a canonical city.
do $$
begin
  if exists (
    select 1
    from catalog.campuses c
    left join core.geographies g on g.id=c.geography_id
    where c.country_code='AU' and c.status='active'
      and (c.geography_id is null or g.geography_type<>'city' or g.status<>'active')
  ) then
    raise exception 'Australia campus city normalization incomplete';
  end if;

  if exists (
    select 1
    from catalog.campuses c
    where c.country_code='AU' and c.status='active' and c.city='Sippy Downs'
  ) then
    raise exception 'Sippy Downs must resolve as Sunshine Coast city + locality';
  end if;
end $$;
