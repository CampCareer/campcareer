-- Normalize verified CRICOS Greater Melbourne locations onto the canonical Melbourne city ID.
-- Also correct the prior Sydney locality mapping by requiring NSW membership when refreshing city indexes.

create temporary table _melbourne_cricos_locations on commit drop as
select
  l.provider_code,
  l.location_name,
  l.city as official_city,
  l.state as official_state,
  l.postcode,
  ii.institution_id,
  concat_ws('|',l.provider_code,l.location_name,coalesce(l.state,''),coalesce(l.postcode,'')) as location_key
from ingest.cricos_locations_au l
join catalog.institution_identifiers ii
  on ii.identifier_system='AU_CRICOS_PROVIDER_CODE'
 and ii.identifier_value=l.provider_code
where upper(btrim(coalesce(l.state,'')))='VIC'
  and upper(btrim(coalesce(l.city,''))) in (
    'MELBOURNE','EAST MELBOURNE','SOUTHBANK','DOCKLANDS','FOOTSCRAY','SUNSHINE','ST ALBANS',
    'POINT COOK','WERRIBEE','PARKVILLE','BRUNSWICK','FITZROY','BUNDOORA','DONVALE','RICHMOND',
    'HAWTHORN','WANTIRNA','BURWOOD','BOX HILL','CAULFIELD EAST','CHADSTONE','PRAHRAN','FRANKSTON',
    'CLAYTON','BERWICK'
  );

with melbourne as (
  select id
  from core.geographies
  where country_code='AU'
    and geography_type='city'
    and slug='melbourne'
    and canonical_geography_id is null
    and status='active'
  limit 1
)
update catalog.campuses c
set city='Melbourne',
    geography_id=m.id,
    locality=initcap(nullif(btrim(s.official_city),'')),
    metadata=(c.metadata - 'greater_sydney_v1') || jsonb_build_object(
      'greater_sydney_v1',false,
      'greater_melbourne_v1',true
    ),
    updated_at=now()
from _melbourne_cricos_locations s
join catalog.campus_identifiers ci
  on ci.identifier_system='AU_CRICOS_LOCATION_KEY'
 and ci.identifier_value=s.location_key
cross join melbourne m
where c.id=ci.campus_id;

update ingest.courses_au
set verified_city_ids='{}'::uuid[],
    verified_city_slugs='{}'::text[],
    verified_delivery_locations='[]'::jsonb,
    location_source_resource='4cd2de02-8ba3-4eb2-bac2-fe272cae3f5f',
    location_source_last_modified=(select max(source_last_modified) from ingest.cricos_course_locations_au),
    location_verified_at=now();

with location_rows as (
  select
    c.id as course_id,
    cl.provider_code,
    cl.course_code,
    cl.location_name,
    l.city as official_city,
    l.state as official_state,
    l.postcode,
    cp.id as campus_id,
    cp.geography_id as city_id,
    g.slug as city_slug,
    g.name as canonical_city_name
  from ingest.courses_au c
  join ingest.cricos_course_locations_au cl
    on cl.provider_code=c.cricos_code and cl.course_code=c.course_code
  join ingest.cricos_locations_au l
    on l.provider_code=cl.provider_code
   and l.location_name=cl.location_name
   and coalesce(upper(l.state),'')=coalesce(upper(cl.location_state),'')
   and coalesce(upper(l.city),'')=coalesce(upper(cl.location_city),'')
  join catalog.campus_identifiers ci
    on ci.identifier_system='AU_CRICOS_LOCATION_KEY'
   and ci.identifier_value=concat_ws('|',l.provider_code,l.location_name,coalesce(l.state,''),coalesce(l.postcode,''))
  join catalog.campuses cp on cp.id=ci.campus_id
  left join core.geographies g on g.id=cp.geography_id
  where c.cricos_status='active'
), aggregated as (
  select
    course_id,
    coalesce(array_agg(distinct city_id order by city_id) filter(where city_id is not null),'{}'::uuid[]) as city_ids,
    coalesce(array_agg(distinct city_slug order by city_slug) filter(where city_slug is not null),'{}'::text[]) as city_slugs,
    jsonb_agg(
      jsonb_build_object(
        'providerCode',provider_code,
        'courseCode',course_code,
        'locationName',location_name,
        'locality',official_city,
        'state',official_state,
        'postcode',postcode,
        'campusId',campus_id,
        'cityId',city_id,
        'citySlug',city_slug,
        'canonicalCity',canonical_city_name,
        'source','CRICOS Course Locations'
      ) order by official_state,official_city,location_name
    ) as locations
  from location_rows
  group by course_id
)
update ingest.courses_au c
set verified_city_ids=a.city_ids,
    verified_city_slugs=a.city_slugs,
    verified_delivery_locations=a.locations,
    location_verified_at=now()
from aggregated a
where c.id=a.course_id;

with target_cities as (
  select id
  from core.geographies
  where country_code='AU'
    and geography_type='city'
    and slug in ('sydney','melbourne')
    and canonical_geography_id is null
    and status='active'
)
delete from public.city_institution_directory_au_v1 d
using target_cities t
where d.city_id=t.id;

insert into public.city_institution_directory_au_v1 (
  city_id,campus_id,institution_id,institution_name,institution_type,website_url,campus_name,locality,region,legacy_provider_id
)
select
  c.geography_id,c.id,i.id,i.canonical_name,i.institution_type,i.website_url,c.name,c.locality,c.region,legacy.identifier_value
from catalog.campuses c
join catalog.institutions i on i.id=c.institution_id
left join lateral (
  select ii.identifier_value
  from catalog.institution_identifiers ii
  where ii.institution_id=i.id and ii.identifier_system='AU_PROVIDER_ID'
  order by ii.valid_to nulls first,ii.created_at desc
  limit 1
) legacy on true
join core.geographies g on g.id=c.geography_id
where c.country_code='AU'
  and c.status='active'
  and c.metadata->>'source_system'='AU_CRICOS_LOCATIONS'
  and g.country_code='AU'
  and g.slug in ('sydney','melbourne')
  and g.canonical_geography_id is null
  and g.status='active';

with counts as (
  select
    c.geography_id as city_id,
    count(*)::int as campus_count,
    count(distinct c.institution_id)::int as institution_count
  from catalog.campuses c
  join core.geographies g on g.id=c.geography_id
  where c.country_code='AU'
    and c.status='active'
    and c.metadata->>'source_system'='AU_CRICOS_LOCATIONS'
    and g.country_code='AU'
    and g.slug in ('sydney','melbourne')
    and g.canonical_geography_id is null
    and g.status='active'
  group by c.geography_id
)
update public.city_directory_au_v1 d
set linked_campus_count=x.campus_count,
    linked_institution_count=x.institution_count,
    updated_at=now()
from counts x
where d.city_id=x.city_id;
