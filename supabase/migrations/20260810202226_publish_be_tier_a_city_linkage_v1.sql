-- Belgium Cities Phase 3: verified university teaching-location linkage for the six Tier A destinations.
with x(provider_slug,k,n,city_slug,city,locality,address_line,postal_code,url) as (values
('universite-libre-de-bruxelles','solbosch','ULB Solbosch Campus','brussels','Brussels','Ixelles','Avenue Franklin D. Roosevelt 50','1050','https://www.ulb.be/en/maps-directions/solbosch'),
('vrije-universiteit-brussel','main-brussels','VUB Main Campus Brussels','brussels','Brussels','Elsene','Pleinlaan 2','1050','https://www.vub.be/en/about-vub/faculties-institutes-and-campuses/our-campuses/vub-main-campus-brussels'),
('universiteit-gent','ufo','UGent Campus UFO','ghent','Ghent','Ghent','Sint-Pietersnieuwstraat 33-35','9000','https://www.ugent.be/en/ghentuniv/hall-hiring/ufo.htm'),
('ku-leuven','group-t','KU Leuven Group T Campus','leuven','Leuven','Leuven','Andreas Vesaliusstraat 13','3000','https://www.kuleuven.be/english/campuses/group-t-leuven-campus/contact'),
('universiteit-antwerpen','stadscampus','University of Antwerp Stadscampus','antwerp','Antwerp','Antwerp','Prinsstraat 13','2000','https://www.uantwerpen.be/en/about-uantwerp/campuses/stadscampus/'),
('universite-catholique-de-louvain','louvain-la-neuve','UCLouvain Louvain-la-Neuve Campus','louvain-la-neuve','Louvain-la-Neuve','Louvain-la-Neuve','Place de l''Université 1','1348','https://www.uclouvain.be/en/sites/louvain-la-neuve/access-and-mobility'),
('universite-de-liege','sart-tilman-b4','ULiège Sart Tilman Campus — Amphithéâtres de l''Europe','liege','Liège','Liège','Boulevard du Rectorat 13','4000','https://www.campus.uliege.be/cms/c_1763578/en/b4-amphitheatres-of-europe')
), r as (
  select x.*,i.id institution_id,g.id geography_id,ii.identifier_value official_identity,ii.source_url identity_source_url,g.region_code
  from x
  join catalog.institutions i on i.country_code='BE' and i.status='active' and i.slug=x.provider_slug
  join catalog.institution_identifiers ii on ii.institution_id=i.id and ii.identifier_system='BE_OFFICIAL_UNIVERSITY_NAME'
  join core.geographies g on g.country_code='BE' and g.slug=x.city_slug and g.metadata->>'publication_tier'='A' and g.status='active'
)
insert into catalog.campuses(id,institution_id,name,city,locality,region,country_code,geography_id,locality_geography_id,address_line,postal_code,official_url,source_url,source_checked_at,metadata,status)
select md5('be_city_phase3:'||provider_slug||':'||k)::uuid,institution_id,n,city,locality,region_code,'BE',geography_id,geography_id,address_line,postal_code,url,url,now(),
  jsonb_build_object('record_scope','verified_teaching_campus','location_quality','verified_official','source_tier','institution_official','location_key',k,'official_identity',official_identity,'identity_source_url',identity_source_url,'normalization_batch','be_city_linkage_v1','programme_assignment_verified',false,'coordinate_precision','not_asserted','campus_inventory_complete',false,'brussels_region_membership_explicit',(city_slug='brussels')),
  'active'
from r
on conflict(id) do update set name=excluded.name,city=excluded.city,locality=excluded.locality,region=excluded.region,geography_id=excluded.geography_id,locality_geography_id=excluded.locality_geography_id,address_line=excluded.address_line,postal_code=excluded.postal_code,official_url=excluded.official_url,source_url=excluded.source_url,source_checked_at=excluded.source_checked_at,metadata=excluded.metadata,status='active',updated_at=now();

create or replace view public.city_institution_directory_be_v1 with (security_invoker=true) as
select g.id city_id,c.id campus_id,i.id institution_id,i.canonical_name institution_name,i.slug institution_slug,
  ii.identifier_value official_identity,ii.source_url identity_source_url,i.website_url,c.name campus_name,
  c.city campus_city,c.locality,c.region,c.address_line,c.postal_code,c.source_url location_source_url,
  c.metadata->>'location_quality' location_quality,c.metadata->>'record_scope' record_scope,
  'verified_official_teaching_campus'::text linkage_basis
from core.geographies g
join catalog.campuses c on c.geography_id=g.id and c.country_code='BE' and c.status='active' and c.metadata->>'normalization_batch'='be_city_linkage_v1'
join catalog.institutions i on i.id=c.institution_id and i.country_code='BE' and i.status='active'
join catalog.institution_identifiers ii on ii.institution_id=i.id and ii.identifier_system='BE_OFFICIAL_UNIVERSITY_NAME'
where g.country_code='BE' and g.status='active' and g.metadata->>'publication_tier'='A' and c.metadata->>'location_quality'='verified_official' and c.metadata->>'record_scope'='verified_teaching_campus';
revoke all on public.city_institution_directory_be_v1 from public,anon,authenticated;
grant select on public.city_institution_directory_be_v1 to service_role;

create or replace view public.city_programme_directory_be_v1 with (security_invoker=true) as
select d.city_id,p.id programme_id,p.institution_id,count(distinct po.id)::integer offering_count,
  'verified_programme_offerings.campus_id'::text linkage_basis
from public.city_institution_directory_be_v1 d
join catalog.campuses c on c.id=d.campus_id
join catalog.programme_offerings po on po.campus_id=c.id and po.verification_status='verified' and po.source_url is not null
join catalog.programmes p on p.id=po.programme_id and p.status='active' and p.institution_id=d.institution_id
where c.metadata->>'programme_assignment_verified'='true' and coalesce(po.enrolment_status,'open') not in ('closed','suspended')
group by d.city_id,p.id,p.institution_id;
revoke all on public.city_programme_directory_be_v1 from public,anon,authenticated;
grant select on public.city_programme_directory_be_v1 to service_role;

create or replace view public.city_directory_be_v1 with (security_invoker=true) as
select g.id city_id,g.country_code,g.slug,g.name,g.region_code region,g.scope_kind,
  g.metadata->>'study_destination_scope' study_destination_scope,
  g.metadata->>'population_geography_contract' population_geography_contract,
  g.metadata->>'population_geography_label' population_geography_label,
  count(distinct d.campus_id)::integer linked_campus_count,count(distinct d.institution_id)::integer linked_institution_count,
  count(distinct p.programme_id)::integer linked_program_count,'initial_verified_university_set'::text institution_coverage_status,
  case when count(distinct p.programme_id)>0 then 'verified' else 'verification_pending' end::text programme_coverage_status
from core.geographies g
left join public.city_institution_directory_be_v1 d on d.city_id=g.id
left join public.city_programme_directory_be_v1 p on p.city_id=g.id
where g.country_code='BE' and g.geography_type='city' and g.status='active' and g.canonical_geography_id is null and g.metadata->>'publication_tier'='A'
group by g.id,g.country_code,g.slug,g.name,g.region_code,g.scope_kind,g.metadata;
revoke all on public.city_directory_be_v1 from public,anon,authenticated;
grant select on public.city_directory_be_v1 to service_role;

do $$ begin
  if (select count(*) from public.city_directory_be_v1)<>6 then raise exception 'BE city directory expected 6'; end if;
  if (select count(*) from public.city_institution_directory_be_v1)<>7 then raise exception 'BE institution directory expected 7'; end if;
  if exists(select 1 from public.city_directory_be_v1 where linked_campus_count=0 or linked_institution_count=0) then raise exception 'BE Tier A city missing linkage'; end if;
  if exists(select 1 from public.city_programme_directory_be_v1) then raise exception 'BE programme directory must remain empty until explicit campus assignment evidence exists'; end if;
end $$;
