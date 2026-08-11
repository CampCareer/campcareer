-- Norway Cities Phase 2: normalize the five approved Tier A city geographies to Statistics Norway municipality scope.
with approved(city_name, public_slug, expected_uuid, region_code, region_name, municipality_code, boundary_label, scope_note) as (
  values
    ('Oslo','oslo','55110fc1-3839-933e-44f8-2431fe3ee49a'::uuid,'03','Oslo','0301','Oslo municipality (0301)','Use Oslo municipality as the public study-destination boundary; do not silently expand to the wider Oslo region.'),
    ('Trondheim','trondheim','1d4bcfcd-8295-a397-3f6a-0703ad37431e'::uuid,'50','Trøndelag','5001','Trondheim municipality (5001)','Use Trondheim municipality as the public study-destination boundary.'),
    ('Stavanger','stavanger','5f9a2f1b-17b0-6c84-9eea-88b79c960f4b'::uuid,'11','Rogaland','1103','Stavanger municipality (1103)','Use Stavanger municipality as the public study-destination boundary.'),
    ('Ås','as','6d9bef46-17f2-9308-f3c2-89411c9c6f93'::uuid,'32','Akershus','3218','Ås municipality (3218)','Use Ås municipality as the public study-destination boundary; ASCII slug is routing-only.'),
    ('Tromsø','tromso','aa5fdce6-d7cc-5fb4-4102-215c839fa35d'::uuid,'55','Troms','5501','Tromsø municipality (5501)','Use Tromsø municipality as the public study-destination boundary; ASCII slug is routing-only.')
)
update core.geographies g
set slug=a.public_slug,
    geography_type='city',
    code=a.municipality_code,
    scope_kind='city',
    region_code=a.region_code,
    status='active',
    metadata=coalesce(g.metadata,'{}'::jsonb) || jsonb_build_object(
      'no_city_normalization_v1',true,
      'publication_tier','A',
      'publication_status','approved_not_indexed',
      'public_slug',a.public_slug,
      'region_code',a.region_code,
      'region_name',a.region_name,
      'statistics_norway_municipality_code',a.municipality_code,
      'study_destination_scope','statistics_norway_municipality',
      'scope_boundary_label',a.boundary_label,
      'scope_note',a.scope_note,
      'scope_standard','Statistics Norway Municipalities 2026',
      'scope_source_url','https://www.ssb.no/en/klass/klassifikasjoner/131',
      'population_geography_contract','statistics_norway_municipality',
      'campus_membership_contract','phase_3_explicit_location_evidence_required'
    ),
    updated_at=now()
from approved a
where g.id=a.expected_uuid
  and g.country_code='NO'
  and g.geography_type='city'
  and g.canonical_geography_id is null
  and g.name=a.city_name;

insert into core.geography_aliases(geography_id,country_code,alias,alias_normalized,region_code,alias_type,source_system,source_url)
select g.id,'NO',g.name,lower(regexp_replace(trim(g.name),'\s+',' ','g')),g.region_code,'canonical_name','Statistics Norway','https://www.ssb.no/en/klass/klassifikasjoner/131'
from core.geographies g
where g.country_code='NO' and g.canonical_geography_id is null and g.slug in ('oslo','trondheim','stavanger','as','tromso')
on conflict do nothing;

insert into core.geography_aliases(geography_id,country_code,alias,alias_normalized,region_code,alias_type,source_system,source_url)
select g.id,'NO',g.slug,lower(trim(g.slug)),g.region_code,'slug','core.geographies','https://www.ssb.no/en/klass/klassifikasjoner/131'
from core.geographies g
where g.country_code='NO' and g.canonical_geography_id is null and g.slug in ('oslo','trondheim','stavanger','as','tromso')
on conflict do nothing;

do $$
declare normalized_count integer; wrong_uuid integer; duplicate_count integer; unexpected_tier_a integer; bad_code integer; alias_count integer;
begin
  select count(*) into normalized_count
  from core.geographies g
  where g.country_code='NO' and g.geography_type='city' and g.canonical_geography_id is null
    and g.slug in ('oslo','trondheim','stavanger','as','tromso')
    and g.scope_kind='city' and g.status='active'
    and g.metadata->>'publication_tier'='A'
    and g.metadata->>'study_destination_scope'='statistics_norway_municipality'
    and g.metadata->>'statistics_norway_municipality_code'=g.code;
  if normalized_count<>5 then raise exception 'Norway Tier A normalization expected 5 rows, found %',normalized_count; end if;

  select count(*) into wrong_uuid
  from core.geographies g
  where g.country_code='NO' and g.slug in ('oslo','trondheim','stavanger','as','tromso')
    and not (
      (g.slug='oslo' and g.id='55110fc1-3839-933e-44f8-2431fe3ee49a'::uuid) or
      (g.slug='trondheim' and g.id='1d4bcfcd-8295-a397-3f6a-0703ad37431e'::uuid) or
      (g.slug='stavanger' and g.id='5f9a2f1b-17b0-6c84-9eea-88b79c960f4b'::uuid) or
      (g.slug='as' and g.id='6d9bef46-17f2-9308-f3c2-89411c9c6f93'::uuid) or
      (g.slug='tromso' and g.id='aa5fdce6-d7cc-5fb4-4102-215c839fa35d'::uuid)
    );
  if wrong_uuid<>0 then raise exception 'Norway Tier A UUID preservation contract failed'; end if;

  select count(*) into duplicate_count from (
    select slug from core.geographies
    where country_code='NO' and geography_type='city' and canonical_geography_id is null
      and slug in ('oslo','trondheim','stavanger','as','tromso')
    group by slug having count(*)<>1
  ) d;
  if duplicate_count<>0 then raise exception 'Norway Tier A canonical city duplicate contract failed'; end if;

  select count(*) into unexpected_tier_a
  from core.geographies g
  where g.country_code='NO' and g.geography_type='city' and g.canonical_geography_id is null
    and g.metadata->>'publication_tier'='A'
    and g.slug not in ('oslo','trondheim','stavanger','as','tromso');
  if unexpected_tier_a<>0 then raise exception 'Unexpected Norway Tier A geography detected'; end if;

  select count(*) into bad_code
  from core.geographies g
  where g.country_code='NO' and g.metadata->>'publication_tier'='A' and (
    (g.slug='oslo' and (g.code<>'0301' or g.region_code<>'03')) or
    (g.slug='trondheim' and (g.code<>'5001' or g.region_code<>'50')) or
    (g.slug='stavanger' and (g.code<>'1103' or g.region_code<>'11')) or
    (g.slug='as' and (g.code<>'3218' or g.region_code<>'32')) or
    (g.slug='tromso' and (g.code<>'5501' or g.region_code<>'55'))
  );
  if bad_code<>0 then raise exception 'Norway municipality/county-code contract failed'; end if;

  select count(*) into alias_count
  from core.geography_aliases a join core.geographies g on g.id=a.geography_id
  where g.country_code='NO' and g.metadata->>'publication_tier'='A';
  if alias_count<10 then raise exception 'Expected at least 10 Norway Tier A aliases, found %',alias_count; end if;
end $$;
