-- Promote official CRICOS course-location relationships to verified offerings and course-level city indexes.

insert into catalog.programme_offerings (
  programme_id,campus_id,market,delivery_mode,intake_label,duration_months,enrolment_status,source_url,valid_from,
  source_system,source_record_key,verification_status,source_checked_at
)
select
  m.entity_id,
  ci.campus_id,
  'international',
  null,
  'CRICOS registered location',
  case when c.duration_years is null then null else round(c.duration_years*12)::integer end,
  'unknown',
  c.cricos_url,
  date '2026-08-04',
  'AU_CRICOS_COURSE_LOCATION',
  concat_ws('|',cl.provider_code,cl.course_code,cl.location_name,coalesce(cl.location_state,''),coalesce(cl.location_city,'')),
  'verified',
  now()
from ingest.courses_au c
join ingest.cricos_course_locations_au cl
  on cl.provider_code=c.cricos_code and cl.course_code=c.course_code
join ingest.cricos_locations_au l
  on l.provider_code=cl.provider_code
 and l.location_name=cl.location_name
 and coalesce(upper(l.state),'')=coalesce(upper(cl.location_state),'')
 and coalesce(upper(l.city),'')=coalesce(upper(cl.location_city),'')
join catalog.institution_identifiers ii
  on ii.identifier_system='AU_CRICOS_PROVIDER_CODE' and ii.identifier_value=cl.provider_code
join catalog.campus_identifiers ci
  on ci.identifier_system='AU_CRICOS_LOCATION_KEY'
 and ci.identifier_value=concat_ws('|',l.provider_code,l.location_name,coalesce(l.state,''),coalesce(l.postcode,''))
join catalog.legacy_entity_map m
  on m.legacy_schema='public' and m.legacy_table='courses_au' and m.legacy_key=c.id::text and m.entity_type='programme'
where c.cricos_status='active'
on conflict (source_system,source_record_key) where source_system is not null and source_record_key is not null
do update set
  programme_id=excluded.programme_id,
  campus_id=excluded.campus_id,
  market=excluded.market,
  intake_label=excluded.intake_label,
  duration_months=excluded.duration_months,
  source_url=excluded.source_url,
  valid_from=excluded.valid_from,
  verification_status='verified',
  source_checked_at=excluded.source_checked_at,
  updated_at=now();

update ingest.courses_au
set verified_city_ids='{}'::uuid[],
    verified_city_slugs='{}'::text[],
    verified_delivery_locations='[]'::jsonb,
    location_source_resource='4cd2de02-8ba3-4eb2-bac2-fe272cae3f5f',
    location_source_last_modified='2026-08-04T08:04:04.780467+00'::timestamptz,
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
