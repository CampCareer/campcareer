-- Spain Cities Phase 2: normalize the seven approved Tier A public study destinations to INE municipality scope.

do $$
declare existing_reuse integer; new_collision integer;
begin
  select count(*) into existing_reuse
  from core.geographies
  where country_code='ES' and geography_type='city' and canonical_geography_id is null
    and slug in ('madrid','barcelona','sevilla','malaga');
  if existing_reuse<>4 then raise exception 'Spain Phase 2 expected four reusable canonical city rows, found %', existing_reuse; end if;

  select count(*) into new_collision
  from core.geographies
  where country_code='ES' and canonical_geography_id is null
    and slug in ('valencia','granada','bilbao');
  if new_collision<>0 then raise exception 'Spain Phase 2 new Tier A slug collision detected'; end if;
end $$;

with approved(city_name, public_slug, region_code, region_name, municipality_code, official_municipality_name, scope_note) as (
  values
    ('Madrid','madrid','13','Madrid, Comunidad de','28079','Madrid','Use Madrid municipality as the public study-destination and population boundary; wider Comunidad de Madrid university activity requires separate teaching-location evidence.'),
    ('Barcelona','barcelona','09','Cataluña','08019','Barcelona','Use Barcelona municipality as the public population boundary; Cerdanyola del Vallès and other neighbouring teaching localities remain separate physical geographies.'),
    ('Sevilla','sevilla','01','Andalucía','41091','Sevilla','Use Sevilla municipality as the public study-destination and population boundary.'),
    ('Málaga','malaga','01','Andalucía','29067','Málaga','Use Málaga municipality as the public study-destination and population boundary.')
)
update core.geographies g
set geography_type='city', code=a.municipality_code, scope_kind='city', region_code=a.region_code, status='active',
    metadata=coalesce(g.metadata,'{}'::jsonb) || jsonb_build_object(
      'es_city_normalization_v1',true,
      'publication_tier','A',
      'publication_status','approved_not_indexed',
      'public_slug',a.public_slug,
      'region_code',a.region_code,
      'region_name',a.region_name,
      'ine_municipality_code',a.municipality_code,
      'ine_official_municipality_name',a.official_municipality_name,
      'study_destination_scope','ine_municipality',
      'population_geography_contract','ine_municipality',
      'scope_boundary_label',a.official_municipality_name || ' municipality (' || a.municipality_code || ')',
      'scope_note',a.scope_note,
      'scope_standard','INE municipality codes by province, reference 1 January 2026',
      'scope_source_url','https://www.ine.es/dyngs/INEbase/operacion.htm?c=Estadistica_C&cid=1254736177031&idp=1254734710990&menu=ultiDatos',
      'region_source_url','https://ine.es/daco/daco42/codmun/cod_ccaa.htm',
      'source_system','INE_MUNICIPAL_CODES_2026',
      'source_tier','government_official',
      'normalization_batch','es_cities_phase_2_v1',
      'campus_membership_contract','phase_3_explicit_location_evidence_required',
      'programme_coverage_status','verification_pending'),
    updated_at=now()
from approved a
where g.country_code='ES' and g.geography_type='city' and g.canonical_geography_id is null and g.slug=a.public_slug;

insert into core.geographies(country_code, geography_type, code, name, region_code, metadata, slug, scope_kind, status)
select 'ES','city',a.municipality_code,a.city_name,a.region_code,
       jsonb_build_object(
         'es_city_normalization_v1',true,
         'publication_tier','A',
         'publication_status','approved_not_indexed',
         'public_slug',a.public_slug,
         'region_code',a.region_code,
         'region_name',a.region_name,
         'ine_municipality_code',a.municipality_code,
         'ine_official_municipality_name',a.official_municipality_name,
         'study_destination_scope','ine_municipality',
         'population_geography_contract','ine_municipality',
         'scope_boundary_label',a.official_municipality_name || ' municipality (' || a.municipality_code || ')',
         'scope_note',a.scope_note,
         'scope_standard','INE municipality codes by province, reference 1 January 2026',
         'scope_source_url','https://www.ine.es/dyngs/INEbase/operacion.htm?c=Estadistica_C&cid=1254736177031&idp=1254734710990&menu=ultiDatos',
         'region_source_url','https://ine.es/daco/daco42/codmun/cod_ccaa.htm',
         'source_system','INE_MUNICIPAL_CODES_2026',
         'source_tier','government_official',
         'normalization_batch','es_cities_phase_2_v1',
         'campus_membership_contract','phase_3_explicit_location_evidence_required',
         'programme_coverage_status','verification_pending'),
       a.public_slug,'city','active'
from (values
  ('Valencia','valencia','10','Comunitat Valenciana','46250','València','Use València municipality as the public population boundary; Burjassot, Paterna and other neighbouring teaching localities remain separate physical geographies.'),
  ('Granada','granada','01','Andalucía','18087','Granada','Use Granada municipality as the public study-destination and population boundary; UGR teaching in Ceuta or Melilla is outside this city contract.'),
  ('Bilbao','bilbao','16','País Vasco','48020','Bilbao','Use Bilbao municipality as the public population boundary; Leioa remains a separate physical geography and must not be aliased into Bilbao.')
) as a(city_name, public_slug, region_code, region_name, municipality_code, official_municipality_name, scope_note);

insert into core.geography_aliases(geography_id,country_code,alias,alias_normalized,region_code,alias_type,source_system,source_url)
select g.id,'ES',g.name,lower(regexp_replace(trim(g.name),'\s+',' ','g')),g.region_code,'canonical_name','INE_MUNICIPAL_CODES_2026','https://www.ine.es/dyngs/INEbase/operacion.htm?c=Estadistica_C&cid=1254736177031&idp=1254734710990&menu=ultiDatos'
from core.geographies g
where g.country_code='ES' and g.canonical_geography_id is null and g.slug in ('madrid','barcelona','valencia','sevilla','granada','malaga','bilbao')
on conflict do nothing;

insert into core.geography_aliases(geography_id,country_code,alias,alias_normalized,region_code,alias_type,source_system,source_url)
select g.id,'ES',g.slug,lower(trim(g.slug)),g.region_code,'slug','core.geographies','https://www.ine.es/dyngs/INEbase/operacion.htm?c=Estadistica_C&cid=1254736177031&idp=1254734710990&menu=ultiDatos'
from core.geographies g
where g.country_code='ES' and g.canonical_geography_id is null and g.slug in ('madrid','barcelona','valencia','sevilla','granada','malaga','bilbao')
on conflict do nothing;

insert into core.geography_aliases(geography_id,country_code,alias,alias_normalized,region_code,alias_type,source_system,source_url)
select g.id,'ES','València','valència',g.region_code,'source','INE_MUNICIPAL_CODES_2026','https://www.ine.es/dyngs/INEbase/operacion.htm?c=Estadistica_C&cid=1254736177031&idp=1254734710990&menu=ultiDatos'
from core.geographies g
where g.country_code='ES' and g.canonical_geography_id is null and g.slug='valencia'
on conflict do nothing;

do $$
declare normalized_count integer; unexpected_tier_a integer; bad_code integer; preserved_localities integer; alias_count integer;
begin
  select count(*) into normalized_count
  from core.geographies g
  where g.country_code='ES' and g.geography_type='city' and g.canonical_geography_id is null
    and g.slug in ('madrid','barcelona','valencia','sevilla','granada','malaga','bilbao')
    and g.scope_kind='city' and g.status='active'
    and g.metadata->>'publication_tier'='A'
    and g.metadata->>'publication_status'='approved_not_indexed'
    and g.metadata->>'study_destination_scope'='ine_municipality'
    and g.metadata->>'population_geography_contract'='ine_municipality'
    and g.metadata->>'ine_municipality_code'=g.code
    and g.metadata->>'programme_coverage_status'='verification_pending';
  if normalized_count<>7 then raise exception 'Spain Tier A normalization expected 7 rows, found %', normalized_count; end if;

  select count(*) into unexpected_tier_a
  from core.geographies g
  where g.country_code='ES' and g.geography_type='city' and g.canonical_geography_id is null
    and g.metadata->>'publication_tier'='A'
    and g.slug not in ('madrid','barcelona','valencia','sevilla','granada','malaga','bilbao');
  if unexpected_tier_a<>0 then raise exception 'Unexpected Spain Tier A geography detected'; end if;

  select count(*) into bad_code
  from core.geographies g
  where g.country_code='ES' and g.metadata->>'publication_tier'='A'
    and ((g.slug='madrid' and (g.code<>'28079' or g.region_code<>'13'))
      or (g.slug='barcelona' and (g.code<>'08019' or g.region_code<>'09'))
      or (g.slug='valencia' and (g.code<>'46250' or g.region_code<>'10'))
      or (g.slug='sevilla' and (g.code<>'41091' or g.region_code<>'01'))
      or (g.slug='granada' and (g.code<>'18087' or g.region_code<>'01'))
      or (g.slug='malaga' and (g.code<>'29067' or g.region_code<>'01'))
      or (g.slug='bilbao' and (g.code<>'48020' or g.region_code<>'16')));
  if bad_code<>0 then raise exception 'Spain INE municipality/region-code contract failed'; end if;

  select count(*) into preserved_localities
  from core.geographies g
  where g.country_code='ES' and g.canonical_geography_id is null
    and g.slug in ('cerdanyola-del-valles','leioa','cadiz','ciudad-real')
    and coalesce(g.metadata->>'publication_tier','')<>'A';
  if preserved_localities<>4 then raise exception 'Spain locality/later-candidate separation contract failed'; end if;

  select count(*) into alias_count
  from core.geography_aliases a join core.geographies g on g.id=a.geography_id
  where g.country_code='ES' and g.metadata->>'publication_tier'='A';
  if alias_count<15 then raise exception 'Expected at least 15 Spain Tier A aliases, found %', alias_count; end if;
end $$;
