-- Finland Cities Phase 2: normalize the eight approved Tier A city geographies to Statistics Finland municipality scope.
with approved(city_name, public_slug, expected_uuid, region_code, region_name, municipality_code, boundary_label, scope_note) as (
  values
    ('Helsinki','helsinki','eb9c8342-163f-e3c5-ca1e-23cf76938c91'::uuid,'01','Uusimaa','091','Helsinki municipality (091)','Use Helsinki municipality as the public study-destination boundary; do not silently expand to the wider Helsinki metropolitan area.'),
    ('Espoo','espoo','60510b8a-c4ab-1d7f-1abc-90270af5245f'::uuid,'01','Uusimaa','049','Espoo municipality (049)','Use Espoo municipality as a separate public destination from Helsinki.'),
    ('Tampere','tampere','443698de-bc8c-0a8a-d8ee-ac77086282d0'::uuid,'06','Pirkanmaa','837','Tampere municipality (837)','Use Tampere municipality as the public study-destination boundary.'),
    ('Turku','turku','c6a48a8c-0b16-3163-1e8f-91ec0abdd2c6'::uuid,'02','Southwest Finland','853','Turku municipality (853)','Use Turku municipality as the public study-destination boundary.'),
    ('Oulu','oulu','3cf5e5e2-6a8f-7e48-6d90-0bf791a8b75d'::uuid,'17','North Ostrobothnia','564','Oulu municipality (564)','Use Oulu municipality as the public study-destination boundary.'),
    ('Jyväskylä','jyvaskyla','24ea3a45-4c77-ba92-1804-64a00f68d986'::uuid,'13','Central Finland','179','Jyväskylä municipality (179)','Use Jyväskylä municipality as the public study-destination boundary.'),
    ('Lappeenranta','lappeenranta','36761127-801c-4a2b-b363-ece52dbbc590'::uuid,'09','South Karelia','405','Lappeenranta municipality (405)','Use Lappeenranta municipality as the public study-destination boundary.'),
    ('Joensuu','joensuu','6b2aaafc-ba15-e3a9-3f4e-da2608ed8415'::uuid,'12','North Karelia','167','Joensuu municipality (167)','Use Joensuu municipality as the public study-destination boundary.')
)
update core.geographies g
set slug=a.public_slug, geography_type='city', code=a.municipality_code, scope_kind='city', region_code=a.region_code, status='active',
    metadata=coalesce(g.metadata,'{}'::jsonb) || jsonb_build_object(
      'fi_city_normalization_v1',true,'publication_tier','A','publication_status','approved_not_indexed','public_slug',a.public_slug,
      'region_code',a.region_code,'region_name',a.region_name,'statistics_finland_municipality_code',a.municipality_code,
      'study_destination_scope','statistics_finland_municipality','scope_boundary_label',a.boundary_label,'scope_note',a.scope_note,
      'scope_standard','Statistics Finland Municipalities 2026','scope_source_url','https://stat.fi/en/luokitukset/kunta/kunta_1_20260101',
      'population_geography_contract','statistics_finland_municipality','campus_membership_contract','phase_3_explicit_location_evidence_required'),
    updated_at=now()
from approved a
where g.id=a.expected_uuid and g.country_code='FI' and g.geography_type='city' and g.canonical_geography_id is null and g.name=a.city_name;

insert into core.geography_aliases(geography_id,country_code,alias,alias_normalized,region_code,alias_type,source_system,source_url)
select g.id,'FI',g.name,lower(regexp_replace(trim(g.name),'\s+',' ','g')),g.region_code,'canonical_name','Statistics Finland','https://stat.fi/en/luokitukset/kunta/kunta_1_20260101'
from core.geographies g where g.country_code='FI' and g.canonical_geography_id is null and g.slug in ('helsinki','espoo','tampere','turku','oulu','jyvaskyla','lappeenranta','joensuu') on conflict do nothing;

insert into core.geography_aliases(geography_id,country_code,alias,alias_normalized,region_code,alias_type,source_system,source_url)
select g.id,'FI',g.slug,lower(trim(g.slug)),g.region_code,'slug','core.geographies','https://stat.fi/en/luokitukset/kunta/kunta_1_20260101'
from core.geographies g where g.country_code='FI' and g.canonical_geography_id is null and g.slug in ('helsinki','espoo','tampere','turku','oulu','jyvaskyla','lappeenranta','joensuu') on conflict do nothing;

with bilingual(slug,alias) as (values ('helsinki','Helsingfors'),('espoo','Esbo'),('turku','Åbo'))
insert into core.geography_aliases(geography_id,country_code,alias,alias_normalized,region_code,alias_type,source_system,source_url)
select g.id,'FI',b.alias,lower(trim(b.alias)),g.region_code,'other','Statistics Finland','https://stat.fi/en/luokitukset/kunta/kunta_1_20260101'
from bilingual b join core.geographies g on g.country_code='FI' and g.slug=b.slug and g.canonical_geography_id is null on conflict do nothing;

do $$
declare normalized_count integer; wrong_uuid integer; duplicate_count integer; unexpected_tier_a integer; bad_code integer; alias_count integer;
begin
  select count(*) into normalized_count from core.geographies g where g.country_code='FI' and g.geography_type='city' and g.canonical_geography_id is null and g.slug in ('helsinki','espoo','tampere','turku','oulu','jyvaskyla','lappeenranta','joensuu') and g.scope_kind='city' and g.status='active' and g.metadata->>'publication_tier'='A' and g.metadata->>'study_destination_scope'='statistics_finland_municipality' and g.metadata->>'statistics_finland_municipality_code'=g.code;
  if normalized_count<>8 then raise exception 'Finland Tier A normalization expected 8 rows, found %',normalized_count; end if;
  select count(*) into wrong_uuid from core.geographies g where g.country_code='FI' and g.slug in ('helsinki','espoo','tampere','turku','oulu','jyvaskyla','lappeenranta','joensuu') and not ((g.slug='helsinki' and g.id='eb9c8342-163f-e3c5-ca1e-23cf76938c91'::uuid) or (g.slug='espoo' and g.id='60510b8a-c4ab-1d7f-1abc-90270af5245f'::uuid) or (g.slug='tampere' and g.id='443698de-bc8c-0a8a-d8ee-ac77086282d0'::uuid) or (g.slug='turku' and g.id='c6a48a8c-0b16-3163-1e8f-91ec0abdd2c6'::uuid) or (g.slug='oulu' and g.id='3cf5e5e2-6a8f-7e48-6d90-0bf791a8b75d'::uuid) or (g.slug='jyvaskyla' and g.id='24ea3a45-4c77-ba92-1804-64a00f68d986'::uuid) or (g.slug='lappeenranta' and g.id='36761127-801c-4a2b-b363-ece52dbbc590'::uuid) or (g.slug='joensuu' and g.id='6b2aaafc-ba15-e3a9-3f4e-da2608ed8415'::uuid));
  if wrong_uuid<>0 then raise exception 'Finland Tier A UUID preservation contract failed'; end if;
  select count(*) into duplicate_count from (select slug from core.geographies where country_code='FI' and geography_type='city' and canonical_geography_id is null and slug in ('helsinki','espoo','tampere','turku','oulu','jyvaskyla','lappeenranta','joensuu') group by slug having count(*)<>1) d;
  if duplicate_count<>0 then raise exception 'Finland Tier A canonical city duplicate contract failed'; end if;
  select count(*) into unexpected_tier_a from core.geographies g where g.country_code='FI' and g.geography_type='city' and g.canonical_geography_id is null and g.metadata->>'publication_tier'='A' and g.slug not in ('helsinki','espoo','tampere','turku','oulu','jyvaskyla','lappeenranta','joensuu');
  if unexpected_tier_a<>0 then raise exception 'Unexpected Finland Tier A geography detected'; end if;
  select count(*) into bad_code from core.geographies g where g.country_code='FI' and g.metadata->>'publication_tier'='A' and ((g.slug='helsinki' and g.code<>'091') or (g.slug='espoo' and g.code<>'049') or (g.slug='tampere' and g.code<>'837') or (g.slug='turku' and g.code<>'853') or (g.slug='oulu' and g.code<>'564') or (g.slug='jyvaskyla' and g.code<>'179') or (g.slug='lappeenranta' and g.code<>'405') or (g.slug='joensuu' and g.code<>'167'));
  if bad_code<>0 then raise exception 'Finland municipality-code contract failed'; end if;
  select count(*) into alias_count from core.geography_aliases a join core.geographies g on g.id=a.geography_id where g.country_code='FI' and g.metadata->>'publication_tier'='A';
  if alias_count<19 then raise exception 'Expected at least 19 Finland Tier A aliases, found %',alias_count; end if;
end $$;
