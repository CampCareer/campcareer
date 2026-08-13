-- Norway Cities Phase 3 read models.
-- Programme delivery requires exact NO_STUDYINNORWAY source key, institution, verified study-location representative and municipality-source-city agreement.
create or replace view public.city_institution_directory_no_v1 with (security_invoker=true) as
select g.id city_id,g.slug city_slug,g.name city_name,g.region_code,g.metadata->>'region_name' region_name,g.code municipality_code,
       i.id institution_id,i.canonical_name institution_name,i.slug institution_slug,i.website_url,
       ii.identifier_system authority_identifier_system,ii.identifier_value authority_identifier,ii.source_url authority_source_url,
       'provisional_nokut_name_identity'::text identifier_maturity,
       c.id campus_id,c.name campus_name,c.address_line,c.postal_code,coalesce(c.source_url,c.official_url,i.website_url) location_source_url,
       c.metadata->>'record_scope' record_scope,c.metadata->>'location_quality' location_quality
from core.geographies g
join catalog.campuses c on c.geography_id=g.id and c.status='active'
join catalog.institutions i on i.id=c.institution_id and i.status='active' and i.country_code='NO'
join catalog.institution_identifiers ii on ii.institution_id=i.id and ii.identifier_system='NO_NOKUT_UNIVERSITY_NAME'
where g.country_code='NO' and g.metadata->>'publication_tier'='A'
  and c.metadata->>'normalization_batch'='no_city_linkage_v1'
  and c.metadata->>'location_quality'='verified_official_institution_city';

create or replace view public.city_programme_directory_no_v1 with (security_invoker=true) as
select g.id city_id,g.slug city_slug,g.name city_name,
       i.id institution_id,i.canonical_name institution_name,i.slug institution_slug,
       c.id campus_id,c.name campus_name,
       pr.id programme_id,pr.canonical_title programme_title,pr.programme_type,pr.field_name,
       s.degree_level source_degree_level,po.id offering_id,po.market,po.delivery_mode,po.enrolment_status,po.source_url offering_source_url,
       s.authority_program_url official_program_url,s.institution_program_url,s.source_program_key,s.verification_tier,s.collection_status
from catalog.programme_offerings po
join public.program_catalog_no_staging s
  on po.source_system='NO_STUDYINNORWAY' and po.source_record_key=s.source_name||':'||s.source_program_key
join catalog.programmes pr
  on pr.id=po.programme_id and pr.status='active' and pr.institution_id=s.institution_id
join catalog.institutions i
  on i.id=pr.institution_id and i.status='active' and i.country_code='NO'
join catalog.campuses c
  on c.id=po.campus_id and c.institution_id=i.id and c.status='active'
join core.geographies g
  on g.id=c.geography_id and g.country_code='NO' and g.metadata->>'publication_tier'='A'
where po.verification_status='verified'
  and s.verification_tier='A'
  and s.collection_status in ('authority_catalogue_verified','authority_program_verified')
  and s.authority_program_url is not null
  and lower(trim(s.city))=lower(trim(g.name))
  and c.metadata->>'normalization_batch'='no_city_linkage_v1'
  and coalesce((c.metadata->>'programme_assignment_verified')::boolean,false) is true;

create or replace view public.city_directory_no_v1 with (security_invoker=true) as
select g.id city_id,g.slug,g.name,g.region_code,g.metadata->>'region_name' region_name,g.code municipality_code,
       g.metadata->>'study_destination_scope' study_destination_scope,
       count(distinct ci.campus_id)::integer linked_campus_count,
       count(distinct ci.institution_id)::integer linked_institution_count,
       count(distinct cp.programme_id)::integer linked_program_count,
       'selected_nokut_university_core_full_hei_coverage_pending'::text institution_coverage_status,
       'provisional_nokut_name_identity'::text institution_identifier_maturity,
       case when count(distinct cp.programme_id)>0 then 'verified_partial' else 'verification_pending' end::text programme_coverage_status
from core.geographies g
left join public.city_institution_directory_no_v1 ci on ci.city_id=g.id
left join public.city_programme_directory_no_v1 cp on cp.city_id=g.id
where g.country_code='NO' and g.metadata->>'publication_tier'='A'
group by g.id,g.slug,g.name,g.region_code,g.code,g.metadata;

revoke all on public.city_institution_directory_no_v1 from public,anon,authenticated;
revoke all on public.city_programme_directory_no_v1 from public,anon,authenticated;
revoke all on public.city_directory_no_v1 from public,anon,authenticated;
grant select on public.city_institution_directory_no_v1 to service_role;
grant select on public.city_programme_directory_no_v1 to service_role;
grant select on public.city_directory_no_v1 to service_role;

do $$
declare anchor_n integer; programme_n integer; city_n integer; bad_city integer; mismatch_n integer; excluded_n integer;
begin
  select count(*) into anchor_n from public.city_institution_directory_no_v1;
  if anchor_n<>6 then raise exception 'NO Tier A verified study locations expected 6 rows, found %',anchor_n; end if;

  select count(*) into programme_n from public.city_programme_directory_no_v1;
  if programme_n<>97 then raise exception 'NO Tier A programme linkage expected 97 rows, found %',programme_n; end if;

  select count(*) into city_n from public.city_directory_no_v1;
  if city_n<>5 then raise exception 'NO city directory expected 5 rows, found %',city_n; end if;

  select count(*) into bad_city from public.city_directory_no_v1
  where linked_campus_count<1 or linked_institution_count<1 or linked_program_count<1 or programme_coverage_status<>'verified_partial';
  if bad_city<>0 then raise exception 'Every NO Tier A city must have verified location/institution/programme linkage'; end if;

  select count(*) into mismatch_n
  from public.city_programme_directory_no_v1 cp
  join public.program_catalog_no_staging s on s.source_program_key=cp.source_program_key and s.institution_id=cp.institution_id
  where lower(trim(s.city))<>lower(trim(cp.city_name));
  if mismatch_n<>0 then raise exception 'NO programme source-city mismatch detected'; end if;

  select count(*) into excluded_n from public.city_directory_no_v1 where slug not in ('oslo','trondheim','stavanger','as','tromso');
  if excluded_n<>0 then raise exception 'Excluded Norway city leaked into Tier A read model'; end if;
end $$;
