-- Denmark Cities Phase 2: normalize the five approved Tier A city geographies to Statistics Denmark municipality scope.
-- Preserve existing UUIDs and leave Lyngby/Roskilde and discovered expansion cities untouched.

with approved(city_name, public_slug, region_code, region_name, municipality_code, boundary_label, scope_note) as (
  values
    ('Copenhagen','copenhagen','084','Region Hovedstaden','101','Copenhagen Municipality (Københavns Kommune)','Use Copenhagen Municipality as the public study-destination boundary. Do not silently expand to Greater Copenhagen or merge Frederiksberg.'),
    ('Frederiksberg','frederiksberg','084','Region Hovedstaden','147','Frederiksberg Municipality (Frederiksberg Kommune)','Use Frederiksberg Municipality as a separate public study destination. Do not merge it into Copenhagen Municipality.'),
    ('Odense','odense','083','Region Syddanmark','461','Odense Municipality (Odense Kommune)','Use Odense Municipality as the public study-destination boundary.'),
    ('Aarhus','aarhus','082','Region Midtjylland','751','Aarhus Municipality (Aarhus Kommune)','Use Aarhus Municipality as the public study-destination boundary.'),
    ('Aalborg','aalborg','081','Region Nordjylland','851','Aalborg Municipality (Aalborg Kommune)','Use Aalborg Municipality as the public study-destination boundary.')
)
update core.geographies g
set slug=a.public_slug,
    geography_type='city',
    scope_kind='city',
    region_code=a.region_code,
    status='active',
    metadata=coalesce(g.metadata,'{}'::jsonb) || jsonb_build_object(
      'dk_city_normalization_v1',true,
      'publication_tier','A',
      'public_slug',a.public_slug,
      'region_code',a.region_code,
      'region_name',a.region_name,
      'dst_municipality_code',a.municipality_code,
      'study_destination_scope','dst_municipality',
      'scope_boundary_label',a.boundary_label,
      'scope_note',a.scope_note,
      'scope_standard','Statistics Denmark regions, provinces and municipalities v1:2007-',
      'scope_source_url','https://www.dst.dk/da/Statistik/dokumentation/Nomenklaturer/NUTS',
      'population_geography_contract','dst_municipality',
      'campus_membership_contract','phase_3_explicit_location_evidence_required'
    ),
    updated_at=now()
from approved a
where g.country_code='DK'
  and g.geography_type='city'
  and g.canonical_geography_id is null
  and g.name=a.city_name;

insert into core.geography_aliases(geography_id,country_code,alias,alias_normalized,region_code,alias_type,source_system,source_url)
select g.id,'DK',g.name,lower(regexp_replace(trim(g.name),'\s+',' ','g')),g.region_code,'canonical_name','core.geographies','https://www.dst.dk/da/Statistik/dokumentation/Nomenklaturer/NUTS'
from core.geographies g
where g.country_code='DK' and g.canonical_geography_id is null and g.slug in ('copenhagen','frederiksberg','odense','aarhus','aalborg')
on conflict do nothing;

insert into core.geography_aliases(geography_id,country_code,alias,alias_normalized,region_code,alias_type,source_system,source_url)
select g.id,'DK',g.slug,lower(trim(g.slug)),g.region_code,'slug','core.geographies','https://www.dst.dk/da/Statistik/dokumentation/Nomenklaturer/NUTS'
from core.geographies g
where g.country_code='DK' and g.canonical_geography_id is null and g.slug in ('copenhagen','frederiksberg','odense','aarhus','aalborg')
on conflict do nothing;

insert into core.geography_aliases(geography_id,country_code,alias,alias_normalized,region_code,alias_type,source_system,source_url)
select g.id,'DK',case g.slug when 'copenhagen' then 'København' when 'aarhus' then 'Århus' when 'aalborg' then 'Ålborg' else g.name end,
       lower(case g.slug when 'copenhagen' then 'København' when 'aarhus' then 'Århus' when 'aalborg' then 'Ålborg' else g.name end),
       g.region_code,'other','Statistics Denmark','https://www.dst.dk/da/Statistik/dokumentation/Nomenklaturer/NUTS'
from core.geographies g
where g.country_code='DK' and g.canonical_geography_id is null and g.slug in ('copenhagen','aarhus','aalborg')
on conflict do nothing;

do $$
declare normalized_count integer; duplicate_count integer; tier_b_touched integer; alias_count integer;
begin
  select count(*) into normalized_count from core.geographies g
  where g.country_code='DK' and g.geography_type='city' and g.canonical_geography_id is null
    and g.slug in ('copenhagen','frederiksberg','odense','aarhus','aalborg') and g.scope_kind='city' and g.status='active'
    and g.metadata->>'publication_tier'='A' and g.metadata->>'study_destination_scope'='dst_municipality'
    and g.metadata->>'dst_municipality_code' is not null;
  if normalized_count<>5 then raise exception 'Denmark Tier A normalization expected 5 rows, found %',normalized_count; end if;

  select count(*) into duplicate_count from (
    select slug from core.geographies where country_code='DK' and geography_type='city' and canonical_geography_id is null
      and slug in ('copenhagen','frederiksberg','odense','aarhus','aalborg') group by slug having count(*)<>1
  ) d;
  if duplicate_count<>0 then raise exception 'Denmark Tier A canonical city duplicate contract failed'; end if;

  select count(*) into tier_b_touched from core.geographies g
  where g.country_code='DK' and g.slug in ('lyngby','roskilde') and coalesce((g.metadata->>'dk_city_normalization_v1')::boolean,false) is true;
  if tier_b_touched<>0 then raise exception 'Denmark Tier B geographies were unexpectedly normalized'; end if;

  select count(*) into alias_count from core.geography_aliases a join core.geographies g on g.id=a.geography_id
  where g.country_code='DK' and g.slug in ('copenhagen','frederiksberg','odense','aarhus','aalborg') and a.alias_type in ('canonical_name','slug','other');
  if alias_count<10 then raise exception 'Expected at least 10 Denmark Tier A aliases, found %',alias_count; end if;
end $$;