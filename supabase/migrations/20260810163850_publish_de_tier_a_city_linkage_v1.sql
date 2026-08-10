with x(provider_slug,k,n,city_slug,city,region,address_line,postal_code,url) as (values
('freie-universitaet-berlin','dahlem','Dahlem Campus','berlin','Berlin','Berlin','Habelschwerdter Allee 45 / Fabeckstraße 23-25','14195','https://www.fu-berlin.de/en/redaktion/orientierung/dahlem/index.html'),
('humboldt-universitaet-zu-berlin','mitte','Campus Mitte','berlin','Berlin','Berlin','Unter den Linden 6','10099','https://www.hu-berlin.de/en/about/campus/campus-mitte/sites'),
('technische-universitaet-berlin','charlottenburg','Main Campus Charlottenburg','berlin','Berlin','Berlin','Straße des 17. Juni 135','10623','https://www.tu.berlin/en/about/campuses-and-offices/berlin'),
('ludwig-maximilians-universitaet-munich','geschwister-scholl','Campus Geschwister-Scholl-Platz','munich','Munich','Bayern','Geschwister-Scholl-Platz 1','80539','https://www.standorte.lmu.de/en/campus-geschwister-scholl-platz/'),
('technical-university-of-munich','munich-city','TUM Munich City Campus','munich','Munich','Bayern','Arcisstraße 21','80333','https://www.tum.de/en/about-tum/locations/munich'),
('rwth-aachen-university','templergraben','RWTH Central Campus (Templergraben)','aachen','Aachen','Nordrhein-Westfalen','Templergraben 55','52062','https://www.rwth-aachen.de/cms/root/Die-RWTH/Kontakt-Anreise/RWTH-Navigator/~cxcq/Maps-Gebaeude/lidx/1/'),
('university-of-bonn','central','Central Bonn Campus','bonn','Bonn','Nordrhein-Westfalen','Regina-Pacis-Weg 3','53113','https://www.uni-bonn.de/en/university/about-the-university/locations-1/locations?set_language=en'),
('technische-universitaet-dresden','suedvorstadt','TUD Campus Südvorstadt','dresden','Dresden','Sachsen',null,null,'https://tu-dresden.de/tu-dresden/campus/standorte?set_language=en'),
('universitaet-hamburg','von-melle-park','Von-Melle-Park Main Campus','hamburg','Hamburg','Hamburg',null,null,'https://www.uni-hamburg.de/en/uhh/standorte-uni-hamburg.html'),
('heidelberg-university','neuenheimer-feld','Neuenheimer Feld Campus','heidelberg','Heidelberg','Baden-Württemberg','Im Neuenheimer Feld','69120','https://www.uni-heidelberg.de/en/university/locations-and-how-to-get-there'),
('karlsruhe-institute-of-technology','south','KIT Campus South','karlsruhe','Karlsruhe','Baden-Württemberg','Kaiserstraße 12','76131','https://www.kit.edu/kit/english/directions.php'),
('university-of-tuebingen','wilhelmstrasse','Wilhelmstraße / Neue Aula Campus','tuebingen','Tübingen','Baden-Württemberg','Geschwister-Scholl-Platz','72074','https://uni-tuebingen.de/en/university/how-to-get-here/maps/')),
r as (
  select x.*,i.id institution_id,g.id geography_id,ii.identifier_value verified_domain,ii.source_url identity_source_url
  from x
  join catalog.institutions i on i.country_code='DE' and i.status='active' and i.slug=x.provider_slug
  join catalog.institution_identifiers ii on ii.institution_id=i.id and ii.identifier_system='DE_HRK_VERIFIED_DOMAIN'
  join core.geographies g on g.country_code='DE' and g.slug=x.city_slug and g.metadata->>'publication_tier'='A' and g.status='active'
)
insert into catalog.campuses(id,institution_id,name,city,locality,region,country_code,geography_id,locality_geography_id,address_line,postal_code,official_url,source_url,source_checked_at,metadata,status)
select md5('de_city_phase3:'||provider_slug||':'||k)::uuid,institution_id,n,city,city,region,'DE',geography_id,geography_id,address_line,postal_code,url,url,now(),
  jsonb_build_object('record_scope','verified_teaching_campus','location_quality','verified_official','source_tier','institution_official','location_key',k,'verified_domain',verified_domain,'identity_source_url',identity_source_url,'normalization_batch','de_city_linkage_v1','programme_assignment_verified',false,'coordinate_precision','not_asserted'),
  'active'
from r
on conflict(id) do update set
  name=excluded.name,city=excluded.city,locality=excluded.locality,region=excluded.region,geography_id=excluded.geography_id,locality_geography_id=excluded.locality_geography_id,address_line=excluded.address_line,postal_code=excluded.postal_code,official_url=excluded.official_url,source_url=excluded.source_url,source_checked_at=excluded.source_checked_at,metadata=excluded.metadata,status='active',updated_at=now();

create or replace view public.city_institution_directory_de_v1 with (security_invoker=true) as
select g.id city_id,c.id campus_id,i.id institution_id,i.canonical_name institution_name,i.slug institution_slug,
  ii.identifier_value verified_domain,ii.source_url identity_source_url,i.website_url,c.name campus_name,
  coalesce(c.city,c.locality) campus_city,c.region,c.address_line,c.postal_code,c.source_url location_source_url,
  c.metadata->>'location_quality' location_quality,c.metadata->>'record_scope' record_scope,
  'verified_official_teaching_campus'::text linkage_basis
from core.geographies g
join catalog.campuses c on c.geography_id=g.id and c.country_code='DE' and c.status='active' and c.metadata->>'normalization_batch'='de_city_linkage_v1'
join catalog.institutions i on i.id=c.institution_id and i.country_code='DE' and i.status='active'
join catalog.institution_identifiers ii on ii.institution_id=i.id and ii.identifier_system='DE_HRK_VERIFIED_DOMAIN'
where g.country_code='DE' and g.status='active' and g.metadata->>'publication_tier'='A'
  and c.metadata->>'location_quality'='verified_official' and c.metadata->>'record_scope'='verified_teaching_campus';
revoke all on public.city_institution_directory_de_v1 from public,anon,authenticated;
grant select on public.city_institution_directory_de_v1 to service_role;

create or replace view public.city_programme_directory_de_v1 with (security_invoker=true) as
select d.city_id,p.id programme_id,p.institution_id,count(distinct po.id)::integer offering_count,
  'verified_programme_offerings.campus_id'::text linkage_basis
from public.city_institution_directory_de_v1 d
join catalog.campuses c on c.id=d.campus_id
join catalog.programme_offerings po on po.campus_id=c.id and po.verification_status='verified' and po.source_url is not null
join catalog.programmes p on p.id=po.programme_id and p.status='active' and p.institution_id=d.institution_id
where c.metadata->>'programme_assignment_verified'='true'
  and coalesce(po.enrolment_status,'open') not in ('closed','suspended')
group by d.city_id,p.id,p.institution_id;
revoke all on public.city_programme_directory_de_v1 from public,anon,authenticated;
grant select on public.city_programme_directory_de_v1 to service_role;

create or replace view public.city_directory_de_v1 with (security_invoker=true) as
select g.id city_id,g.country_code,g.slug,g.name,g.region_code region,g.scope_kind,
  g.metadata->>'study_destination_scope' study_destination_scope,
  count(distinct d.campus_id)::integer linked_campus_count,
  count(distinct d.institution_id)::integer linked_institution_count,
  count(distinct p.programme_id)::integer linked_program_count,
  'initial_verified_set'::text institution_coverage_status,
  case when count(distinct p.programme_id)>0 then 'verified' else 'verification_pending' end::text programme_coverage_status
from core.geographies g
left join public.city_institution_directory_de_v1 d on d.city_id=g.id
left join public.city_programme_directory_de_v1 p on p.city_id=g.id
where g.country_code='DE' and g.geography_type='city' and g.status='active' and g.canonical_geography_id is null and g.metadata->>'publication_tier'='A'
group by g.id,g.country_code,g.slug,g.name,g.region_code,g.scope_kind,g.metadata;
revoke all on public.city_directory_de_v1 from public,anon,authenticated;
grant select on public.city_directory_de_v1 to service_role;

do $$ begin
  if (select count(*) from public.city_directory_de_v1)<>9 then raise exception 'DE city directory expected 9'; end if;
  if (select count(*) from public.city_institution_directory_de_v1)<>12 then raise exception 'DE institution directory expected 12'; end if;
  if (select count(distinct institution_id) from public.city_institution_directory_de_v1)<>12 then raise exception 'DE linked institutions expected 12'; end if;
  if exists(select 1 from public.city_directory_de_v1 where linked_campus_count=0 or linked_institution_count=0) then raise exception 'DE Tier A city missing linkage'; end if;
  if exists(select 1 from public.city_programme_directory_de_v1) then raise exception 'DE programme directory must remain empty until campus assignment evidence is explicit'; end if;
end $$;