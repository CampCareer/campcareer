with approved(slug,region_code,bundesland_name,ags) as (
  values
    ('berlin','BE','Berlin','11000000'),
    ('munich','BY','Bayern','09162000'),
    ('hamburg','HH','Hamburg','02000000'),
    ('aachen','NW','Nordrhein-Westfalen','05334002'),
    ('bonn','NW','Nordrhein-Westfalen','05314000'),
    ('dresden','SN','Sachsen','14612000'),
    ('heidelberg','BW','Baden-Württemberg','08221000'),
    ('karlsruhe','BW','Baden-Württemberg','08212000'),
    ('tuebingen','BW','Baden-Württemberg','08416041')
)
update core.geographies g
set scope_kind='city',
    region_code=a.region_code,
    status='active',
    metadata=coalesce(g.metadata,'{}'::jsonb)||jsonb_build_object(
      'de_city_normalization_v1',true,
      'publication_tier','A',
      'public_slug',a.slug,
      'bundesland_code',a.region_code,
      'bundesland_name',a.bundesland_name,
      'study_destination_scope','destatis_gvisys_municipality',
      'official_municipality_code_ags',a.ags,
      'scope_standard','Destatis GV-ISys',
      'scope_source_url','https://www.destatis.de/DE/Themen/Laender-Regionen/Regionales/Gemeindeverzeichnis/_inhalt.html',
      'population_geography_contract','destatis_gvisys_municipality',
      'campus_membership_contract','phase_3_explicit_location_evidence_required'
    ),
    updated_at=now()
from approved a
where g.country_code='DE'
  and g.geography_type='city'
  and g.canonical_geography_id is null
  and g.slug=a.slug;

insert into core.geography_aliases(
  geography_id,country_code,alias,alias_normalized,region_code,alias_type,source_system,source_url
)
select id,'DE',name,lower(regexp_replace(trim(name),'\s+',' ','g')),region_code,
       'canonical_name','core.geographies',
       'https://www.destatis.de/DE/Themen/Laender-Regionen/Regionales/Gemeindeverzeichnis/_inhalt.html'
from core.geographies
where country_code='DE'
  and slug in ('berlin','munich','hamburg','aachen','bonn','dresden','heidelberg','karlsruhe','tuebingen')
on conflict do nothing;

insert into core.geography_aliases(
  geography_id,country_code,alias,alias_normalized,region_code,alias_type,source_system,source_url
)
select id,'DE',slug,lower(slug),region_code,'slug','core.geographies',
       'https://www.destatis.de/DE/Themen/Laender-Regionen/Regionales/Gemeindeverzeichnis/_inhalt.html'
from core.geographies
where country_code='DE'
  and slug in ('berlin','munich','hamburg','aachen','bonn','dresden','heidelberg','karlsruhe','tuebingen')
on conflict do nothing;
