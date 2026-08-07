-- Materialize official CRICOS registered locations as canonical campuses.
-- Greater Sydney and Greater Melbourne membership use conservative locality whitelists
-- over the current official CRICOS snapshot. State membership is mandatory to prevent
-- cross-city locality collisions such as Richmond NSW vs Richmond VIC.

create temporary table _cricos_location_stage on commit drop as
select
  l.*,
  ii.institution_id,
  concat_ws('|',l.provider_code,l.location_name,coalesce(l.state,''),coalesce(l.postcode,'')) as location_key,
  upper(btrim(coalesce(l.state,'')))='NSW' and upper(btrim(coalesce(l.city,''))) in (
    'SYDNEY','MACQUARIE UNIVERSITY','PARRAMATTA','NORTH PARRAMATTA','NORTH SYDNEY','STRATHFIELD','BLACKTOWN',
    'SURRY HILLS','WATERLOO','CAMPERDOWN','MOSMAN','WESTMEAD','COBBITTY','CAMDEN','PADDINGTON','KENSINGTON',
    'HAYMARKET','MOORE PARK','LIVERPOOL','LOFTUS','ST LEONARDS','CASTLE HILL','ULTIMO','LILYFIELD','RANDWICK',
    'ENMORE','PETERSHAM','HORNSBY','BROOKVALE','RYDE','MEADOWBANK','LIDCOMBE','GRANVILLE','WETHERILL PARK',
    'MILLER','BANKSTOWN','PADSTOW','KOGARAH','CAMPBELLTOWN','CAMPBELTOWN','MACQUARIE FIELDS','KINGSWOOD',
    'RICHMOND','QUAKERS HILL','MOUNT DRUITT','BROADWAY','DARLINGHURST','WAHROONGA','LEURA'
  ) as is_greater_sydney,
  upper(btrim(coalesce(l.state,'')))='VIC' and upper(btrim(coalesce(l.city,''))) in (
    'MELBOURNE','EAST MELBOURNE','SOUTHBANK','DOCKLANDS','FOOTSCRAY','SUNSHINE','ST ALBANS',
    'POINT COOK','WERRIBEE','PARKVILLE','BRUNSWICK','FITZROY','BUNDOORA','DONVALE','RICHMOND',
    'HAWTHORN','WANTIRNA','BURWOOD','BOX HILL','CAULFIELD EAST','CHADSTONE','PRAHRAN','FRANKSTON',
    'CLAYTON','BERWICK'
  ) as is_greater_melbourne
from ingest.cricos_locations_au l
join catalog.institution_identifiers ii
  on ii.identifier_system='AU_CRICOS_PROVIDER_CODE'
 and ii.identifier_value=l.provider_code;

insert into catalog.campuses (
  institution_id,name,city,region,country_code,status,geography_id,locality,address_line,postal_code,source_url,source_checked_at,metadata
)
select
  s.institution_id,
  s.location_name,
  case
    when s.is_greater_sydney then 'Sydney'
    when s.is_greater_melbourne then 'Melbourne'
    else initcap(coalesce(nullif(btrim(s.city),''),'Unknown'))
  end,
  s.state,
  'AU',
  'active',
  g.id,
  case
    when s.is_greater_sydney or s.is_greater_melbourne then initcap(nullif(btrim(s.city),''))
    else null
  end,
  nullif(concat_ws(', ',nullif(btrim(s.address_line_1),''),nullif(btrim(s.address_line_2),''),nullif(btrim(s.address_line_3),''),nullif(btrim(s.address_line_4),'')),''),
  nullif(btrim(s.postcode),''),
  'https://data.gov.au/data/dataset/commonwealth-register-of-institutions-and-courses-for-overseas-students-cricos',
  now(),
  jsonb_build_object(
    'source_system','AU_CRICOS_LOCATIONS',
    'cricos_provider_code',s.provider_code,
    'cricos_location_key',s.location_key,
    'official_location_city',s.city,
    'official_location_state',s.state,
    'official_location_type',s.location_type,
    'source_resource_id',s.source_resource_id,
    'source_last_modified',s.source_last_modified,
    'greater_sydney_v1',s.is_greater_sydney,
    'greater_melbourne_v1',s.is_greater_melbourne
  )
from _cricos_location_stage s
left join core.geographies g
  on g.country_code='AU'
 and g.geography_type='city'
 and g.canonical_geography_id is null
 and g.status='active'
 and g.slug=case
   when s.is_greater_sydney then 'sydney'
   when s.is_greater_melbourne then 'melbourne'
   else null
 end
on conflict (institution_id,name,city)
do update set
  region=excluded.region,
  status='active',
  geography_id=coalesce(excluded.geography_id,catalog.campuses.geography_id),
  locality=coalesce(excluded.locality,catalog.campuses.locality),
  address_line=coalesce(excluded.address_line,catalog.campuses.address_line),
  postal_code=coalesce(excluded.postal_code,catalog.campuses.postal_code),
  source_url=excluded.source_url,
  source_checked_at=excluded.source_checked_at,
  metadata=catalog.campuses.metadata || excluded.metadata,
  updated_at=now();

insert into catalog.campus_identifiers (campus_id,identifier_system,identifier_value,source_url,valid_from)
select
  c.id,
  'AU_CRICOS_LOCATION_KEY',
  s.location_key,
  'https://data.gov.au/data/dataset/commonwealth-register-of-institutions-and-courses-for-overseas-students-cricos',
  date '2026-08-04'
from _cricos_location_stage s
join catalog.campuses c
  on c.institution_id=s.institution_id
 and c.name=s.location_name
 and c.city=case
   when s.is_greater_sydney then 'Sydney'
   when s.is_greater_melbourne then 'Melbourne'
   else initcap(coalesce(nullif(btrim(s.city),''),'Unknown'))
 end
on conflict (identifier_system,identifier_value)
do update set campus_id=excluded.campus_id,source_url=excluded.source_url,valid_from=excluded.valid_from;
