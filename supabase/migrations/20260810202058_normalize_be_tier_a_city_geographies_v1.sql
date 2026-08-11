-- Belgium Cities Phase 2: normalize the exact six Tier A study destinations in place.
with approved(slug,region_code,region_name,refnis_region_code,refnis_code,population_scope,population_label) as (
  values
    ('brussels','BRU','Brussels-Capital Region','04000',null::text,'statbel_brussels_capital_region','Brussels-Capital Region'),
    ('ghent','VLG','Flemish Region','02000','44021','statbel_refnis_municipality','Gent municipality'),
    ('leuven','VLG','Flemish Region','02000','24062','statbel_refnis_municipality','Leuven municipality'),
    ('antwerp','VLG','Flemish Region','02000','11002','statbel_refnis_municipality','Antwerpen municipality'),
    ('louvain-la-neuve','WAL','Walloon Region','03000','25121','statbel_ottignies_louvain_la_neuve_municipality','Ottignies-Louvain-la-Neuve municipality'),
    ('liege','WAL','Walloon Region','03000','62063','statbel_refnis_municipality','Liège municipality')
)
update core.geographies g
set scope_kind='city', region_code=a.region_code, status='active',
    metadata=coalesce(g.metadata,'{}'::jsonb)||jsonb_build_object(
      'be_city_normalization_v1',true,'publication_tier','A','public_slug',a.slug,
      'region_name',a.region_name,'refnis_region_code',a.refnis_region_code,
      'study_destination_scope',case when a.slug='brussels' then 'brussels_capital_region' when a.slug='louvain-la-neuve' then 'louvain_la_neuve_study_destination' else 'statbel_refnis_municipality' end,
      'population_geography_contract',a.population_scope,'population_geography_label',a.population_label,
      'official_refnis_code',a.refnis_code,'scope_standard','Statbel REFNIS 2025',
      'scope_source_url','https://statbel.fgov.be/fr/open-data/code-refnis-0',
      'campus_membership_contract','phase_3_explicit_location_evidence_required',
      'public_destination_not_municipality',(a.slug in ('brussels','louvain-la-neuve'))
    ), updated_at=now()
from approved a
where g.country_code='BE' and g.geography_type='city' and g.canonical_geography_id is null and g.slug=a.slug;

insert into core.geography_aliases(geography_id,country_code,alias,alias_normalized,region_code,alias_type,source_system,source_url)
select g.id,'BE',g.name,lower(regexp_replace(trim(g.name),'\s+',' ','g')),g.region_code,'canonical_name','core.geographies','https://statbel.fgov.be/fr/open-data/code-refnis-0'
from core.geographies g
where g.country_code='BE' and g.slug in ('brussels','ghent','leuven','antwerp','louvain-la-neuve','liege')
  and not exists(select 1 from core.geography_aliases ga where ga.geography_id=g.id and ga.alias_type='canonical_name' and ga.alias_normalized=lower(regexp_replace(trim(g.name),'\s+',' ','g')));

insert into core.geography_aliases(geography_id,country_code,alias,alias_normalized,region_code,alias_type,source_system,source_url)
select g.id,'BE',g.slug,lower(g.slug),g.region_code,'slug','core.geographies','https://statbel.fgov.be/fr/open-data/code-refnis-0'
from core.geographies g
where g.country_code='BE' and g.slug in ('brussels','ghent','leuven','antwerp','louvain-la-neuve','liege')
  and not exists(select 1 from core.geography_aliases ga where ga.geography_id=g.id and ga.alias_type='slug' and ga.alias_normalized=lower(g.slug));

do $$ begin
  if (select count(*) from core.geographies where country_code='BE' and status='active' and metadata->>'publication_tier'='A') <> 6 then raise exception 'BE Phase 2 expected exactly 6 Tier A geographies'; end if;
  if exists(select 1 from core.geographies where country_code='BE' and metadata->>'publication_tier'='A' and (scope_kind<>'city' or region_code is null or metadata->>'population_geography_contract' is null)) then raise exception 'BE Phase 2 geography contract incomplete'; end if;
end $$;
