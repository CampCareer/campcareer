-- New Zealand city Phase 3: verified teaching-campus linkage for the five Tier A cities.
-- Provider presence never implies programme delivery. Canonical NZ programme coverage remains pending.

with x(provider_slug,k,n,city_slug,city,region,address_line,postal_code,url) as (values
('university-of-auckland','city','City Campus','auckland','Auckland','Auckland','Princes Street, Auckland Central',null,'https://www.auckland.ac.nz/en/on-campus/our-campuses/campus-locations0/city-campus.html'),
('auckland-university-of-technology','city','AUT City Campus','auckland','Auckland','Auckland','55 Wellesley Street East, Auckland Central','1010','https://www.aut.ac.nz/about/campuses-and-locations/city-campus'),
('massey-university','auckland','Auckland Campus','auckland','Auckland','Auckland','East Precinct, Dairy Flat Highway, Albany, Auckland','0632','https://www.massey.ac.nz/student-life/campus-guides-maps/auckland-campus-maps-transport-and-parking/'),
('university-of-canterbury','ilam','Ilam Campus','christchurch','Christchurch','Canterbury','Ilam, Christchurch',null,'https://www.canterbury.ac.nz/about-uc/our-campus-and-environment/our-campuses'),
('university-of-otago','christchurch','University of Otago, Christchurch','christchurch','Christchurch','Canterbury','2 Riccarton Avenue, Christchurch','8011','https://www.otago.ac.nz/christchurch/about'),
('university-of-waikato','hamilton','Hamilton Campus','hamilton','Hamilton','Waikato','Entry 1, Knighton Road, Hamilton','3240','https://www.waikato.ac.nz/about/campus/hamilton/'),
('victoria-university-of-wellington','kelburn','Kelburn Campus','wellington','Wellington','Wellington','Kelburn Parade, Wellington',null,'https://www.wgtn.ac.nz/about/campuses-facilities/campuses/kelburn'),
('massey-university','wellington','Wellington Pukeahu Campus','wellington','Wellington','Wellington',null,null,'https://www.massey.ac.nz/study/study-on-campus/study-on-the-wellington-campus/'),
('university-of-otago','wellington','University of Otago, Wellington','wellington','Wellington','Wellington','23A Mein Street, Newtown, Wellington South','6021','https://www.otago.ac.nz/wellington/about'),
('university-of-otago','dunedin','Dunedin Main Campus','dunedin','Dunedin','Otago',null,null,'https://www.otago.ac.nz/about/campuses')),
r as (
  select x.*,i.id institution_id,g.id geography_id,ii.identifier_value provider_number,ii.source_url provider_source_url
  from x
  join catalog.institutions i on i.country_code='NZ' and i.status='active' and i.slug=x.provider_slug
  join catalog.institution_identifiers ii on ii.institution_id=i.id and ii.identifier_system='NZ_MOE_PROVIDER_NUMBER'
  join core.geographies g on g.country_code='NZ' and g.slug=x.city_slug and g.metadata->>'publication_tier'='A' and g.status='active'
)
insert into catalog.campuses(id,institution_id,name,city,locality,region,country_code,geography_id,locality_geography_id,address_line,postal_code,official_url,source_url,source_checked_at,metadata,status)
select md5('nz_city_phase3:'||provider_slug||':'||k)::uuid,institution_id,n,city,city,region,'NZ',geography_id,geography_id,address_line,postal_code,url,url,now(),
  jsonb_build_object('record_scope','verified_teaching_campus','location_quality','verified_official','source_tier','institution_official','location_key',k,'provider_number',provider_number,'provider_source_url',provider_source_url,'normalization_batch','nz_city_linkage_v1','programme_assignment_verified',false,'coordinate_precision','not_asserted'),
  'active'
from r
on conflict(id) do update set
  name=excluded.name,city=excluded.city,locality=excluded.locality,region=excluded.region,geography_id=excluded.geography_id,locality_geography_id=excluded.locality_geography_id,address_line=excluded.address_line,postal_code=excluded.postal_code,official_url=excluded.official_url,source_url=excluded.source_url,source_checked_at=excluded.source_checked_at,metadata=excluded.metadata,status='active',updated_at=now();

create or replace view public.city_institution_directory_nz_v1 with (security_invoker=true) as
select g.id city_id,c.id campus_id,i.id institution_id,i.canonical_name institution_name,i.slug institution_slug,
  ii.identifier_value provider_number,ii.source_url provider_source_url,i.website_url,c.name campus_name,
  coalesce(c.city,c.locality) campus_city,c.region,c.address_line,c.postal_code,c.source_url location_source_url,
  c.metadata->>'location_quality' location_quality,c.metadata->>'record_scope' record_scope,
  'verified_official_teaching_campus'::text linkage_basis
from core.geographies g
join catalog.campuses c on c.geography_id=g.id and c.country_code='NZ' and c.status='active' and c.metadata->>'normalization_batch'='nz_city_linkage_v1'
join catalog.institutions i on i.id=c.institution_id and i.country_code='NZ' and i.status='active'
join catalog.institution_identifiers ii on ii.institution_id=i.id and ii.identifier_system='NZ_MOE_PROVIDER_NUMBER'
where g.country_code='NZ' and g.status='active' and g.metadata->>'publication_tier'='A'
  and c.metadata->>'location_quality'='verified_official' and c.metadata->>'record_scope'='verified_teaching_campus';
revoke all on public.city_institution_directory_nz_v1 from public,anon,authenticated;
grant select on public.city_institution_directory_nz_v1 to service_role;

create or replace view public.city_programme_directory_nz_v1 with (security_invoker=true) as
select d.city_id,p.id programme_id,p.institution_id,count(distinct po.id)::integer offering_count,
  'verified_programme_offerings.campus_id'::text linkage_basis
from public.city_institution_directory_nz_v1 d
join catalog.campuses c on c.id=d.campus_id
join catalog.programme_offerings po on po.campus_id=c.id and po.verification_status='verified' and po.source_url is not null
join catalog.programmes p on p.id=po.programme_id and p.status='active' and p.institution_id=d.institution_id
where c.metadata->>'programme_assignment_verified'='true'
  and coalesce(po.enrolment_status,'open') not in ('closed','suspended')
group by d.city_id,p.id,p.institution_id;
revoke all on public.city_programme_directory_nz_v1 from public,anon,authenticated;
grant select on public.city_programme_directory_nz_v1 to service_role;

create or replace view public.city_directory_nz_v1 with (security_invoker=true) as
select g.id city_id,g.country_code,g.slug,g.name,g.region_code region,g.scope_kind,
  g.metadata->>'study_destination_scope' study_destination_scope,
  count(distinct d.campus_id)::integer linked_campus_count,
  count(distinct d.institution_id)::integer linked_institution_count,
  count(distinct p.programme_id)::integer linked_program_count,
  'initial_verified_set'::text institution_coverage_status,
  case when count(distinct p.programme_id)>0 then 'verified' else 'verification_pending' end::text programme_coverage_status
from core.geographies g
left join public.city_institution_directory_nz_v1 d on d.city_id=g.id
left join public.city_programme_directory_nz_v1 p on p.city_id=g.id
where g.country_code='NZ' and g.geography_type='city' and g.status='active' and g.canonical_geography_id is null and g.metadata->>'publication_tier'='A'
group by g.id,g.country_code,g.slug,g.name,g.region_code,g.scope_kind,g.metadata;
revoke all on public.city_directory_nz_v1 from public,anon,authenticated;
grant select on public.city_directory_nz_v1 to service_role;

do $$ begin
  if (select count(*) from public.city_directory_nz_v1)<>5 then raise exception 'NZ city directory expected 5'; end if;
  if (select count(*) from public.city_institution_directory_nz_v1)<>10 then raise exception 'NZ institution directory expected 10'; end if;
  if exists(select 1 from public.city_directory_nz_v1 where linked_campus_count=0 or linked_institution_count=0) then raise exception 'NZ Tier A city missing linkage'; end if;
  if exists(select 1 from public.city_programme_directory_nz_v1) then raise exception 'NZ programme directory must remain empty'; end if;
end $$;
