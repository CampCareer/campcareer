-- Sweden Cities Phase 2: normalize the six approved Tier A city geographies to SCB municipality scope.
-- Preserve existing UUIDs/slugs and do not create expansion candidates.

with approved(city_name, public_slug, expected_uuid, region_code, region_name, municipality_code, boundary_label, scope_note) as (
  values
    ('Stockholm','stockholm','e4d6e0f8-deaf-4486-4754-ed037331583b'::uuid,'01','Stockholms län','0180','Stockholm Municipality (Stockholms kommun)','Use Stockholm municipality as the public study-destination boundary; do not silently expand to the wider Stockholm urban or county area.'),
    ('Gothenburg','gothenburg','cc9590ad-543b-455a-f11b-f5db185bfbd0'::uuid,'14','Västra Götalands län','1480','Gothenburg Municipality (Göteborgs kommun)','Use Göteborg municipality as the public study-destination boundary while retaining Gothenburg as the English product label.'),
    ('Uppsala','uppsala','9671b5ed-f7ea-5120-a56f-66c62ffbcc18'::uuid,'03','Uppsala län','0380','Uppsala Municipality (Uppsala kommun)','Use Uppsala municipality as the public study-destination boundary.'),
    ('Lund','lund','c437d6de-abe4-2121-9228-43edb71afa74'::uuid,'12','Skåne län','1281','Lund Municipality (Lunds kommun)','Use Lund municipality as the public study-destination boundary.'),
    ('Linköping','linkoping','3f7f5dad-7fe0-9cf5-296b-a020fc829775'::uuid,'05','Östergötlands län','0580','Linköping Municipality (Linköpings kommun)','Use Linköping municipality as the public study-destination boundary.'),
    ('Umeå','umea','b6afd97c-c5c5-1736-dbb4-63afe4a8d8c1'::uuid,'24','Västerbottens län','2480','Umeå Municipality (Umeå kommun)','Use Umeå municipality as the public study-destination boundary.')
)
update core.geographies g
set slug=a.public_slug,
    geography_type='city',
    scope_kind='city',
    region_code=a.region_code,
    status='active',
    metadata=coalesce(g.metadata,'{}'::jsonb) || jsonb_build_object(
      'se_city_normalization_v1',true,
      'publication_tier','A',
      'public_slug',a.public_slug,
      'region_code',a.region_code,
      'region_name',a.region_name,
      'scb_municipality_code',a.municipality_code,
      'study_destination_scope','scb_municipality',
      'scope_boundary_label',a.boundary_label,
      'scope_note',a.scope_note,
      'scope_standard','Statistics Sweden municipality codes 2026',
      'scope_source_url','https://www.scb.se/en/finding-statistics/regional-statistics/regional-divisions/counties-and-municipalities/counties-and-municipalities-in-numerical-order/',
      'population_geography_contract','scb_municipality',
      'campus_membership_contract','phase_3_explicit_location_evidence_required'
    ),
    updated_at=now()
from approved a
where g.id=a.expected_uuid
  and g.country_code='SE'
  and g.geography_type='city'
  and g.canonical_geography_id is null
  and g.name=a.city_name;

insert into core.geography_aliases(geography_id,country_code,alias,alias_normalized,region_code,alias_type,source_system,source_url)
select g.id,'SE',g.name,lower(regexp_replace(trim(g.name),'\s+',' ','g')),g.region_code,'canonical_name','core.geographies','https://www.scb.se/en/finding-statistics/regional-statistics/regional-divisions/counties-and-municipalities/counties-and-municipalities-in-numerical-order/'
from core.geographies g
where g.country_code='SE' and g.canonical_geography_id is null and g.slug in ('stockholm','gothenburg','uppsala','lund','linkoping','umea')
on conflict do nothing;

insert into core.geography_aliases(geography_id,country_code,alias,alias_normalized,region_code,alias_type,source_system,source_url)
select g.id,'SE',g.slug,lower(trim(g.slug)),g.region_code,'slug','core.geographies','https://www.scb.se/en/finding-statistics/regional-statistics/regional-divisions/counties-and-municipalities/counties-and-municipalities-in-numerical-order/'
from core.geographies g
where g.country_code='SE' and g.canonical_geography_id is null and g.slug in ('stockholm','gothenburg','uppsala','lund','linkoping','umea')
on conflict do nothing;

insert into core.geography_aliases(geography_id,country_code,alias,alias_normalized,region_code,alias_type,source_system,source_url)
select g.id,'SE','Göteborg','göteborg',g.region_code,'other','Statistics Sweden','https://www.scb.se/en/finding-statistics/regional-statistics/regional-divisions/counties-and-municipalities/counties-and-municipalities-in-numerical-order/'
from core.geographies g
where g.country_code='SE' and g.canonical_geography_id is null and g.slug='gothenburg'
on conflict do nothing;

do $$
declare normalized_count integer; duplicate_count integer; wrong_uuid integer; unexpected_tier_a integer; alias_count integer;
begin
  select count(*) into normalized_count
  from core.geographies g
  where g.country_code='SE' and g.geography_type='city' and g.canonical_geography_id is null
    and g.slug in ('stockholm','gothenburg','uppsala','lund','linkoping','umea')
    and g.scope_kind='city' and g.status='active'
    and g.metadata->>'publication_tier'='A'
    and g.metadata->>'study_destination_scope'='scb_municipality'
    and g.metadata->>'scb_municipality_code' is not null;
  if normalized_count<>6 then raise exception 'Sweden Tier A normalization expected 6 rows, found %',normalized_count; end if;

  select count(*) into wrong_uuid from core.geographies g
  where g.country_code='SE' and g.slug in ('stockholm','gothenburg','uppsala','lund','linkoping','umea') and not (
    (g.slug='stockholm' and g.id='e4d6e0f8-deaf-4486-4754-ed037331583b'::uuid) or
    (g.slug='gothenburg' and g.id='cc9590ad-543b-455a-f11b-f5db185bfbd0'::uuid) or
    (g.slug='uppsala' and g.id='9671b5ed-f7ea-5120-a56f-66c62ffbcc18'::uuid) or
    (g.slug='lund' and g.id='c437d6de-abe4-2121-9228-43edb71afa74'::uuid) or
    (g.slug='linkoping' and g.id='3f7f5dad-7fe0-9cf5-296b-a020fc829775'::uuid) or
    (g.slug='umea' and g.id='b6afd97c-c5c5-1736-dbb4-63afe4a8d8c1'::uuid)
  );
  if wrong_uuid<>0 then raise exception 'Sweden Tier A UUID preservation contract failed'; end if;

  select count(*) into duplicate_count from (
    select slug from core.geographies where country_code='SE' and geography_type='city' and canonical_geography_id is null
      and slug in ('stockholm','gothenburg','uppsala','lund','linkoping','umea') group by slug having count(*)<>1
  ) d;
  if duplicate_count<>0 then raise exception 'Sweden Tier A canonical city duplicate contract failed'; end if;

  select count(*) into unexpected_tier_a from core.geographies g
  where g.country_code='SE' and g.geography_type='city' and g.canonical_geography_id is null
    and g.metadata->>'publication_tier'='A' and g.slug not in ('stockholm','gothenburg','uppsala','lund','linkoping','umea');
  if unexpected_tier_a<>0 then raise exception 'Unexpected Sweden Tier A geography detected'; end if;

  select count(*) into alias_count from core.geography_aliases a join core.geographies g on g.id=a.geography_id
  where g.country_code='SE' and g.slug in ('stockholm','gothenburg','uppsala','lund','linkoping','umea') and a.alias_type in ('canonical_name','slug','other');
  if alias_count<13 then raise exception 'Expected at least 13 Sweden Tier A aliases, found %',alias_count; end if;
end $$;