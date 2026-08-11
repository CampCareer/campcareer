-- Sweden Cities Phase 3: publish Tier A institution and source-city-matched programme linkage.
-- Existing fast-path campus IDs are not trusted on their own. Programme rows are accepted only when the official
-- Sweden staging city matches the normalized SCB municipality and the same UKÄ-backed institution has a verified city location.

update catalog.campuses c
set name=i.canonical_name || ' — ' || g.name || ' location',
    city=g.name,
    locality=g.name,
    geography_id=g.id,
    locality_geography_id=g.id,
    source_checked_at=now(),
    metadata=coalesce(c.metadata,'{}'::jsonb) || jsonb_build_object(
      'normalization_batch','se_city_linkage_v1',
      'record_scope','verified_city_study_location',
      'location_quality','verified_official_city',
      'programme_assignment_verified',true,
      'programme_location_evidence','official_programme_source_city_matches_verified_institution_city',
      'campus_inventory_complete',false,
      'source_tier','official_institution_or_authority'
    ),
    updated_at=now()
from catalog.institutions i
join catalog.institution_identifiers ii on ii.institution_id=i.id and ii.identifier_system='SE_UKA_UNIVERSITY_NAME'
join core.geographies g on g.country_code='SE' and g.metadata->>'publication_tier'='A'
where c.institution_id=i.id
  and i.country_code='SE'
  and i.status='active'
  and c.status='active'
  and lower(trim(c.city))=lower(trim(g.name))
  and coalesce(c.source_url,c.official_url,i.website_url) is not null;

update catalog.programme_offerings po
set campus_id=c.id,updated_at=now()
from public.program_catalog_se_staging s
join core.geographies g on g.country_code='SE' and g.metadata->>'publication_tier'='A' and lower(trim(g.name))=lower(trim(s.city))
join catalog.campuses c on c.institution_id=s.institution_id and c.geography_id=g.id and c.status='active' and c.metadata->>'normalization_batch'='se_city_linkage_v1'
where po.source_system='SE_UNIVERSITYADMISSIONS'
  and po.source_record_key=s.source_name||':'||s.source_program_key
  and po.verification_status='verified'
  and s.verification_tier='A'
  and s.official_program_url is not null;

create or replace view public.city_institution_directory_se_v1 with (security_invoker=true) as
select g.id city_id,
       g.slug city_slug,
       g.name city_name,
       g.region_code,
       g.metadata->>'region_name' region_name,
       g.metadata->>'scb_municipality_code' municipality_code,
       i.id institution_id,
       i.canonical_name institution_name,
       i.slug institution_slug,
       i.website_url,
       ii.identifier_value authority_identifier,
       ii.source_url authority_source_url,
       c.id campus_id,
       c.name campus_name,
       c.address_line,
       c.postal_code,
       coalesce(c.source_url,c.official_url,i.website_url) location_source_url,
       c.metadata->>'record_scope' record_scope,
       c.metadata->>'location_quality' location_quality
from core.geographies g
join catalog.campuses c on c.geography_id=g.id and c.status='active'
join catalog.institutions i on i.id=c.institution_id and i.status='active'
join catalog.institution_identifiers ii on ii.institution_id=i.id and ii.identifier_system='SE_UKA_UNIVERSITY_NAME'
where g.country_code='SE'
  and g.metadata->>'publication_tier'='A'
  and c.metadata->>'normalization_batch'='se_city_linkage_v1'
  and c.metadata->>'location_quality'='verified_official_city';

create or replace view public.city_programme_directory_se_v1 with (security_invoker=true) as
select g.id city_id,
       g.slug city_slug,
       g.name city_name,
       i.id institution_id,
       i.canonical_name institution_name,
       i.slug institution_slug,
       c.id campus_id,
       c.name campus_name,
       pr.id programme_id,
       pr.canonical_title programme_title,
       pr.programme_type,
       pr.field_name,
       po.id offering_id,
       po.market,
       po.delivery_mode,
       po.enrolment_status,
       po.source_url offering_source_url,
       s.official_program_url,
       s.international_source_url,
       s.source_program_key,
       s.verification_tier
from catalog.programme_offerings po
join public.program_catalog_se_staging s on po.source_system='SE_UNIVERSITYADMISSIONS' and po.source_record_key=s.source_name||':'||s.source_program_key
join catalog.programmes pr on pr.id=po.programme_id and pr.status='active' and pr.institution_id=s.institution_id
join catalog.institutions i on i.id=pr.institution_id and i.status='active'
join catalog.campuses c on c.id=po.campus_id and c.institution_id=i.id and c.status='active'
join core.geographies g on g.id=c.geography_id and g.country_code='SE' and g.metadata->>'publication_tier'='A'
where po.verification_status='verified'
  and s.verification_tier='A'
  and s.official_program_url is not null
  and lower(trim(s.city))=lower(trim(g.name))
  and c.metadata->>'normalization_batch'='se_city_linkage_v1'
  and coalesce((c.metadata->>'programme_assignment_verified')::boolean,false) is true;

create or replace view public.city_directory_se_v1 with (security_invoker=true) as
select g.id city_id,
       g.slug,
       g.name,
       g.region_code,
       g.metadata->>'region_name' region_name,
       g.metadata->>'scb_municipality_code' municipality_code,
       g.metadata->>'study_destination_scope' study_destination_scope,
       count(distinct ci.campus_id)::integer linked_campus_count,
       count(distinct ci.institution_id)::integer linked_institution_count,
       count(distinct cp.programme_id)::integer linked_program_count,
       'selected_university_core_full_hei_coverage_pending'::text institution_coverage_status,
       case when count(distinct cp.programme_id)>0 then 'verified_partial' else 'verification_pending' end::text programme_coverage_status
from core.geographies g
left join public.city_institution_directory_se_v1 ci on ci.city_id=g.id
left join public.city_programme_directory_se_v1 cp on cp.city_id=g.id
where g.country_code='SE' and g.metadata->>'publication_tier'='A'
group by g.id,g.slug,g.name,g.region_code,g.metadata;

revoke all on public.city_institution_directory_se_v1 from public,anon,authenticated;
revoke all on public.city_programme_directory_se_v1 from public,anon,authenticated;
revoke all on public.city_directory_se_v1 from public,anon,authenticated;
grant select on public.city_institution_directory_se_v1 to service_role;
grant select on public.city_programme_directory_se_v1 to service_role;
grant select on public.city_directory_se_v1 to service_role;

do $$
declare anchor_n integer; programme_n integer; city_n integer; bad_city integer;
begin
  select count(*) into anchor_n from public.city_institution_directory_se_v1;
  if anchor_n<>10 then raise exception 'SE Tier A verified university locations expected 10 rows, found %',anchor_n; end if;

  select count(*) into programme_n from public.city_programme_directory_se_v1;
  if programme_n<>271 then raise exception 'SE Tier A programme linkage expected 271 rows, found %',programme_n; end if;

  select count(*) into city_n from public.city_directory_se_v1;
  if city_n<>6 then raise exception 'SE city directory expected 6 rows, found %',city_n; end if;

  select count(*) into bad_city from public.city_directory_se_v1
  where linked_campus_count<1 or linked_institution_count<1 or linked_program_count<1 or programme_coverage_status<>'verified_partial';
  if bad_city<>0 then raise exception 'Every SE Tier A city must have verified university/location/programme linkage'; end if;
end $$;