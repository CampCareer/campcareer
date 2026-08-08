-- Ireland location quality foundation.
--
-- Qualifax is Ireland's national learners' database hosted by QQI. The current
-- Irish catalogue was imported from course-level Qualifax data and its campus
-- rows are programme-offering anchors, not verified physical campus inventory.
--
-- This migration therefore preserves every remaining anchor, marks it explicitly
-- as fallback-only, cleans only harmless trailing punctuation/whitespace, and
-- links an existing geography only when the cleaned locality is an exact match.
-- It deliberately does not invent new city geographies from strings such as
-- "Dublin 2", "Dublin City Centre" or neighbourhood names.

update catalog.campuses c
set
  locality = nullif(regexp_replace(trim(coalesce(c.city,'')), '[,[:space:]]+$', ''),''),
  source_url = coalesce(
    c.source_url,
    (
      select min(po.source_url)
      from catalog.programme_offerings po
      where po.campus_id=c.id
        and po.source_url like 'https://%'
    )
  ),
  source_checked_at = coalesce(c.source_checked_at,now()),
  metadata = coalesce(c.metadata,'{}'::jsonb)||jsonb_build_object(
    'record_scope','legacy_offering_anchor',
    'location_quality','legacy_qualifax_reported',
    'display_policy','fallback_only',
    'source_kind','qualifax_course_import',
    'normalization_batch','ie_institution_locations_v1'
  ),
  updated_at=now()
from catalog.institutions i
where c.institution_id=i.id
  and i.country_code='IE'
  and i.status<>'inactive'
  and c.status<>'inactive';

-- Exact-match only: do not coerce neighbourhoods, postal districts or ambiguous
-- locality strings into a city. Existing normalized geography remains preferred.
update catalog.campuses c
set
  locality_geography_id=coalesce(c.locality_geography_id,g.id),
  geography_id=coalesce(c.geography_id,g.id),
  updated_at=now()
from catalog.institutions i,
     core.geographies g
where c.institution_id=i.id
  and i.country_code='IE'
  and i.status<>'inactive'
  and c.status<>'inactive'
  and c.metadata->>'normalization_batch'='ie_institution_locations_v1'
  and g.country_code='IE'
  and g.geography_type='city'
  and g.status='active'
  and lower(g.name)=lower(c.locality);

create or replace view public.institution_location_ie_v1
with (security_invoker=true) as
select
  c.id as campus_id,
  c.institution_id,
  c.name,
  g.name as city_name,
  g.slug as city_slug,
  c.locality as reported_locality,
  c.city as source_city,
  c.region,
  c.address_line,
  c.postal_code,
  c.official_url,
  c.source_url,
  c.source_checked_at,
  c.metadata
from catalog.campuses c
join catalog.institutions i
  on i.id=c.institution_id
 and i.country_code='IE'
 and i.status<>'inactive'
left join core.geographies g
  on g.id=coalesce(c.locality_geography_id,c.geography_id)
 and g.country_code='IE'
 and g.geography_type='city'
 and g.status='active'
where c.status<>'inactive'
  and c.metadata->>'normalization_batch'='ie_institution_locations_v1'
  and c.metadata->>'record_scope'='legacy_offering_anchor';

comment on view public.institution_location_ie_v1 is
  'Service-role Ireland fallback location read model. Rows are Qualifax-derived legacy programme-offering anchors, not a claim of complete physical campus inventory.';

revoke all on public.institution_location_ie_v1 from public,anon,authenticated;
grant select on public.institution_location_ie_v1 to service_role;

do $$
declare
  anchor_count integer;
  offering_count integer;
  anchored_offering_count integer;
  unsafe_city_insert_count integer;
  source_backed_count integer;
begin
  select count(*) into anchor_count
  from public.institution_location_ie_v1;
  if anchor_count<>235 then
    raise exception 'Expected 235 Irish legacy location anchors after institution consolidation, found %',anchor_count;
  end if;

  select count(*),
         count(*) filter(where c.metadata->>'record_scope'='legacy_offering_anchor' and c.metadata->>'normalization_batch'='ie_institution_locations_v1')
  into offering_count,anchored_offering_count
  from catalog.programme_offerings po
  join catalog.programmes p on p.id=po.programme_id
  join catalog.institutions i on i.id=p.institution_id
  join catalog.campuses c on c.id=po.campus_id
  where i.country_code='IE' and p.status='active';

  if offering_count<>2876 or anchored_offering_count<>2876 then
    raise exception 'Expected all 2876 Irish offerings to retain explicit legacy anchors; offerings %, anchors %',offering_count,anchored_offering_count;
  end if;

  -- This foundation must not create geography rows from messy locality strings.
  select count(*) into unsafe_city_insert_count
  from core.geographies g
  where g.country_code='IE'
    and g.metadata->>'normalization_batch'='ie_institution_locations_v1';
  if unsafe_city_insert_count<>0 then
    raise exception 'Ireland anchor foundation unexpectedly created % geography rows',unsafe_city_insert_count;
  end if;

  select count(*) into source_backed_count
  from public.institution_location_ie_v1
  where source_url like 'https://%';
  if source_backed_count=0 then
    raise exception 'Expected at least one Irish location anchor to retain a source URL';
  end if;
end $$;
