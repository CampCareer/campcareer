-- Norway Cities Phase 3 data step: verify selected municipality study-location representatives.
-- This is not a complete physical-campus inventory. Programme publication additionally requires exact Study in Norway source-city agreement.
with verified_location(institution_name,city_slug,location_source_url) as (
  values
    ('University of Oslo','oslo','https://www.uio.no/english/'),
    ('OsloMet – Oslo Metropolitan University','oslo','https://www.oslomet.no/en/about/our-campuses'),
    ('Norwegian University of Science and Technology','trondheim','https://www.ntnu.edu/about-ntnu/campuses'),
    ('University of Stavanger','stavanger','https://www.uis.no/en/'),
    ('Norwegian University of Life Sciences','as','https://www.nmbu.no/en/about/contact-us'),
    ('UiT The Arctic University of Norway','tromso','https://en.uit.no/studiesteder/tromso')
)
update catalog.campuses c
set name=i.canonical_name || ' — ' || g.name || ' study location',
    city=g.name,
    locality=g.name,
    geography_id=g.id,
    locality_geography_id=g.id,
    source_url=v.location_source_url,
    source_checked_at=now(),
    metadata=coalesce(c.metadata,'{}'::jsonb) || jsonb_build_object(
      'normalization_batch','no_city_linkage_v1',
      'record_scope','verified_city_study_location_representative',
      'location_quality','verified_official_institution_city',
      'programme_assignment_verified',true,
      'programme_location_evidence','study_in_norway_source_city_matches_verified_institution_city',
      'campus_inventory_complete',false,
      'source_tier','official_institution',
      'institution_identifier_maturity','provisional_nokut_name_identity'
    ),
    updated_at=now()
from verified_location v
join catalog.institutions i
  on i.country_code='NO' and i.canonical_name=v.institution_name and i.status='active'
join catalog.institution_identifiers ii
  on ii.institution_id=i.id and ii.identifier_system='NO_NOKUT_UNIVERSITY_NAME'
join core.geographies g
  on g.country_code='NO' and g.slug=v.city_slug and g.metadata->>'publication_tier'='A'
where c.institution_id=i.id
  and c.status='active'
  and lower(trim(c.city))=lower(trim(g.name))
  and c.geography_id=g.id;

do $$
declare n integer; bad integer;
begin
  select count(*) into n
  from catalog.campuses c join catalog.institutions i on i.id=c.institution_id
  where i.country_code='NO' and c.status='active' and c.metadata->>'normalization_batch'='no_city_linkage_v1';
  if n<>6 then raise exception 'NO verified Tier A study locations expected 6, found %',n; end if;

  select count(*) into bad
  from catalog.campuses c
  join catalog.institutions i on i.id=c.institution_id
  join core.geographies g on g.id=c.geography_id
  where i.country_code='NO' and c.metadata->>'normalization_batch'='no_city_linkage_v1'
    and (g.metadata->>'publication_tier'<>'A'
      or coalesce((c.metadata->>'programme_assignment_verified')::boolean,false) is not true
      or coalesce((c.metadata->>'campus_inventory_complete')::boolean,true) is not false);
  if bad<>0 then raise exception 'NO verified study-location metadata contract failed'; end if;
end $$;
