-- Spain Cities Phase 3: provider expansion, verified teaching-location representatives, strict programme-to-city linkage, and private read models.

insert into catalog.institutions(country_code,canonical_name,institution_type,website_url,status,slug,institution_kind,ownership_type)
values
  ('ES','Universitat de València','university','https://www.uv.es/','active','universitat-de-valencia','university','public'),
  ('ES','Universitat Politècnica de València','university','https://www.upv.es/','active','universitat-politecnica-de-valencia','university','public'),
  ('ES','Universidad de Granada','university','https://www.ugr.es/','active','universidad-de-granada','university','public')
on conflict do nothing;

insert into catalog.institution_identifiers(institution_id,identifier_system,identifier_value,source_url)
select i.id,'ES_OFFICIAL_UNIVERSITY_NAME',i.canonical_name,
       case i.canonical_name
         when 'Universitat de València' then 'https://www.uv.es/'
         when 'Universitat Politècnica de València' then 'https://www.upv.es/'
         when 'Universidad de Granada' then 'https://www.ugr.es/'
       end
from catalog.institutions i
where i.country_code='ES' and i.canonical_name in ('Universitat de València','Universitat Politècnica de València','Universidad de Granada')
on conflict do nothing;

with locations(institution_name,city_slug,campus_name,address_line,postal_code,official_url,programme_assignment_verified) as (
  values
    ('Universidad Autónoma de Madrid','madrid','Campus de Cantoblanco','Calle Einstein, 5','28049','https://www.uam.es/uam/vida-universitaria/campus',true),
    ('Universidad Complutense de Madrid','madrid','Campus de Moncloa / Ciudad Universitaria','Avda. Complutense, s/n','28040','https://www.ucm.es/english/campuses',true),
    ('Universitat de Barcelona','barcelona','Barcelona teaching-location representative','Gran Via de les Corts Catalanes, 585','08007','https://web.ub.edu/en/contact',true),
    ('Universitat Politècnica de Catalunya','barcelona','Campus Nord','Carrer Jordi Girona, 1-3','08034','https://www.upc.edu/en/the-upc/campuses-and-broader-presence',true),
    ('Universitat de València','valencia','Campus de Blasco Ibáñez','Av. Blasco Ibáñez, 23','46010','https://www.uv.es/uvweb/college/en/university/organisational-structure/campus/-blasco-ibanez-campus-1285853774445.html',false),
    ('Universitat Politècnica de València','valencia','Campus de Vera','Camino de Vera, s/n','46022','https://www.upv.es/otros/como-llegar-upv/campus-vera/index-en.html',false),
    ('Universidad de Sevilla','sevilla','Campus Ramón y Cajal — Facultad de Derecho','C/ Enramadilla, 18-20','41018','https://www.us.es/centros/facultad-de-derecho',true),
    ('Universidad de Granada','granada','Granada city campus network','Granada',null,'https://www.ugr.es/universidad/campus',false),
    ('Universidad de Málaga','malaga','Campus de Teatinos','Bulevar Louis Pasteur, 25','29010','https://www.uma.es/conoce-la-uma/info/7033/teatinos?set_language=en',true),
    ('Euskal Herriko Unibertsitatea (EHU)','bilbao','Escuela de Ingeniería de Bilbao — Edificio I','Plaza Ingeniero Torres Quevedo, 1','48013','https://www.ehu.eus/en/web/bilboko-ingeniaritza-eskola/the_faculty/location-and-contact',false)
)
insert into catalog.campuses(institution_id,name,city,region,country_code,geography_id,locality,locality_geography_id,address_line,postal_code,official_url,source_url,source_checked_at,metadata,status)
select i.id,l.campus_name,g.name,g.metadata->>'region_name','ES',g.id,g.name,g.id,l.address_line,l.postal_code,l.official_url,l.official_url,now(),
       jsonb_build_object(
         'source_tier','institution_official',
         'record_scope','verified_teaching_location_representative',
         'source_system','UNIVERSITY_OFFICIAL_TEACHING_LOCATION',
         'location_quality','verified_official_institution_city',
         'normalization_batch','es_city_linkage_v1',
         'campus_inventory_complete',false,
         'programme_assignment_verified',l.programme_assignment_verified,
         'city_membership_contract','phase_2_ine_municipality'
       ),'active'
from locations l
join catalog.institutions i on i.country_code='ES' and i.canonical_name=l.institution_name and i.status='active'
join core.geographies g on g.country_code='ES' and g.slug=l.city_slug and g.metadata->>'publication_tier'='A' and g.canonical_geography_id is null
on conflict do nothing;

with assignment(institution_name,source_city,campus_name) as (
  values
    ('Universidad Autónoma de Madrid','Madrid','Campus de Cantoblanco'),
    ('Universidad Complutense de Madrid','Madrid','Campus de Moncloa / Ciudad Universitaria'),
    ('Universitat de Barcelona','Barcelona','Barcelona teaching-location representative'),
    ('Universitat Politècnica de Catalunya','Barcelona','Campus Nord'),
    ('Universidad de Sevilla','Sevilla','Campus Ramón y Cajal — Facultad de Derecho'),
    ('Universidad de Málaga','Málaga','Campus de Teatinos')
)
update catalog.programme_offerings po
set campus_id=c.id,updated_at=now()
from public.program_catalog_es_staging s
join assignment a on a.institution_name=s.institution_name and a.source_city=s.city
join catalog.institutions i on i.id=s.institution_id and i.country_code='ES' and i.canonical_name=a.institution_name
join catalog.campuses c on c.institution_id=i.id and c.name=a.campus_name and c.city=s.city and c.country_code='ES' and c.status='active'
join catalog.programmes p on p.institution_id=i.id and p.status='active'
where po.programme_id=p.id
  and po.source_system='ES_RUCT_OFFICIAL'
  and po.verification_status='verified'
  and po.source_record_key=s.source_name||':'||s.source_program_key
  and s.verification_tier='A'
  and s.collection_status='official_current_program_verified'
  and s.official_program_url is not null;

create or replace view public.city_institution_directory_es_v1 with (security_invoker=true) as
select g.id city_id,g.slug city_slug,g.name city_name,g.region_code,g.metadata->>'region_name' region_name,g.code municipality_code,
       i.id institution_id,i.canonical_name institution_name,i.slug institution_slug,i.website_url,
       ii.identifier_system authority_identifier_system,ii.identifier_value authority_identifier,ii.source_url authority_source_url,
       'official_name_identity_ruct_code_pending'::text identifier_maturity,
       c.id campus_id,c.name campus_name,c.address_line,c.postal_code,coalesce(c.source_url,c.official_url,i.website_url) location_source_url,
       c.metadata->>'record_scope' record_scope,c.metadata->>'location_quality' location_quality,
       coalesce((c.metadata->>'programme_assignment_verified')::boolean,false) programme_assignment_verified
from core.geographies g
join catalog.campuses c on c.geography_id=g.id and c.status='active'
join catalog.institutions i on i.id=c.institution_id and i.status='active' and i.country_code='ES'
join catalog.institution_identifiers ii on ii.institution_id=i.id and ii.identifier_system='ES_OFFICIAL_UNIVERSITY_NAME'
where g.country_code='ES' and g.metadata->>'publication_tier'='A'
  and c.metadata->>'normalization_batch'='es_city_linkage_v1'
  and c.metadata->>'location_quality'='verified_official_institution_city';

create or replace view public.city_programme_directory_es_v1 with (security_invoker=true) as
select g.id city_id,g.slug city_slug,g.name city_name,i.id institution_id,i.canonical_name institution_name,i.slug institution_slug,
       c.id campus_id,c.name campus_name,pr.id programme_id,pr.canonical_title programme_title,pr.programme_type,pr.field_name,
       s.degree_level source_degree_level,po.id offering_id,po.market,po.delivery_mode,po.enrolment_status,po.source_url offering_source_url,
       s.official_program_url,s.international_source_url,s.source_program_key,s.verification_tier,s.collection_status
from catalog.programme_offerings po
join public.program_catalog_es_staging s on po.source_system='ES_RUCT_OFFICIAL' and po.source_record_key=s.source_name||':'||s.source_program_key
join catalog.programmes pr on pr.id=po.programme_id and pr.status='active' and pr.institution_id=s.institution_id
join catalog.institutions i on i.id=pr.institution_id and i.status='active' and i.country_code='ES'
join catalog.campuses c on c.id=po.campus_id and c.institution_id=i.id and c.status='active'
join core.geographies g on g.id=c.geography_id and g.country_code='ES' and g.metadata->>'publication_tier'='A'
where po.verification_status='verified'
  and s.verification_tier='A'
  and s.collection_status='official_current_program_verified'
  and s.official_program_url is not null
  and lower(trim(s.city))=lower(trim(g.name))
  and c.metadata->>'normalization_batch'='es_city_linkage_v1'
  and coalesce((c.metadata->>'programme_assignment_verified')::boolean,false) is true;

create or replace view public.city_directory_es_v1 with (security_invoker=true) as
select g.id city_id,g.slug,g.name,g.region_code,g.metadata->>'region_name' region_name,g.code municipality_code,
       g.metadata->>'study_destination_scope' study_destination_scope,
       count(distinct ci.campus_id)::integer linked_campus_count,count(distinct ci.institution_id)::integer linked_institution_count,
       count(distinct cp.programme_id)::integer linked_program_count,
       'selected_public_university_core_provider_expansion_in_progress'::text institution_coverage_status,
       'official_name_identity_ruct_code_pending'::text institution_identifier_maturity,
       case when count(distinct cp.programme_id)>0 then 'verified_partial' else 'verification_pending' end::text programme_coverage_status
from core.geographies g
left join public.city_institution_directory_es_v1 ci on ci.city_id=g.id
left join public.city_programme_directory_es_v1 cp on cp.city_id=g.id
where g.country_code='ES' and g.metadata->>'publication_tier'='A'
group by g.id,g.slug,g.name,g.region_code,g.code,g.metadata;

revoke all on public.city_institution_directory_es_v1 from public,anon,authenticated;
revoke all on public.city_programme_directory_es_v1 from public,anon,authenticated;
revoke all on public.city_directory_es_v1 from public,anon,authenticated;
grant select on public.city_institution_directory_es_v1 to service_role;
grant select on public.city_programme_directory_es_v1 to service_role;
grant select on public.city_directory_es_v1 to service_role;

do $$
declare institution_n integer; location_n integer; programme_n integer; city_n integer; bad_city integer; mismatch_n integer; forbidden_n integer;
begin
  select count(*) into institution_n from catalog.institutions where country_code='ES' and status='active';
  if institution_n<>13 then raise exception 'ES provider expansion expected 13 active institutions, found %',institution_n; end if;
  select count(*) into location_n from public.city_institution_directory_es_v1;
  if location_n<>10 then raise exception 'ES Tier A verified teaching locations expected 10 rows, found %',location_n; end if;
  select count(*) into programme_n from public.city_programme_directory_es_v1;
  if programme_n<>97 then raise exception 'ES strict city programme linkage expected 97 rows, found %',programme_n; end if;
  select count(*) into city_n from public.city_directory_es_v1;
  if city_n<>7 then raise exception 'ES city directory expected 7 rows, found %',city_n; end if;
  select count(*) into bad_city from public.city_directory_es_v1 where linked_campus_count<1 or linked_institution_count<1;
  if bad_city<>0 then raise exception 'Every ES Tier A city must have verified institution/location linkage'; end if;
  select count(*) into mismatch_n from public.city_programme_directory_es_v1 cp join public.program_catalog_es_staging s on s.source_program_key=cp.source_program_key and s.institution_id=cp.institution_id where lower(trim(s.city))<>lower(trim(cp.city_name));
  if mismatch_n<>0 then raise exception 'ES programme source-city mismatch detected'; end if;
  select count(*) into forbidden_n from public.city_programme_directory_es_v1 where (city_slug='bilbao' and institution_name='Euskal Herriko Unibertsitatea (EHU)') or (city_slug='barcelona' and institution_name='Universitat Autònoma de Barcelona');
  if forbidden_n<>0 then raise exception 'ES locality-to-destination programme leakage detected'; end if;
end $$;
