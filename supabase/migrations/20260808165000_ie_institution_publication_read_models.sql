-- Ireland Institution publication read models.
--
-- Publication is deliberately limited to institutions with a source-backed
-- current identity established by the preceding HEA / QQI / FET / provider
-- migrations. Legacy-name-only institutions remain in the canonical catalogue
-- but are not exposed through the Ireland Institution Explorer yet.

create or replace view public.institution_publication_ie_v1
with (security_invoker=true) as
select distinct
  i.id as institution_id,
  i.country_code,
  i.slug,
  i.canonical_name,
  official.identifier_system as identity_system,
  official.identifier_value as identity_value,
  official.source_url as identity_source_url
from catalog.institutions i
join lateral (
  select ii.identifier_system,ii.identifier_value,ii.source_url
  from catalog.institution_identifiers ii
  where ii.institution_id=i.id
    and ii.identifier_system in (
      'IE_HEA_LISTED_HEI_NAME',
      'IE_QQI_REVIEWED_PRIVATE_HEI_NAME',
      'IE_QQI_PRIVATE_HEI_NAME',
      'IE_QQI_CENTRE_NAME',
      'IE_QQI_PROVIDER_NAME',
      'IE_OFFICIAL_PROVIDER_NAME'
    )
  order by case ii.identifier_system
    when 'IE_HEA_LISTED_HEI_NAME' then 1
    when 'IE_QQI_REVIEWED_PRIVATE_HEI_NAME' then 2
    when 'IE_QQI_PRIVATE_HEI_NAME' then 3
    when 'IE_QQI_CENTRE_NAME' then 4
    when 'IE_QQI_PROVIDER_NAME' then 5
    when 'IE_OFFICIAL_PROVIDER_NAME' then 6
    else 99 end,
    ii.identifier_value
  limit 1
) official on true
where i.country_code='IE'
  and i.status<>'inactive'
  and i.slug is not null;

comment on view public.institution_publication_ie_v1 is
  'Service-role Ireland publication cohort. Only current institutions with source-backed HEA/QQI/official provider identity are eligible for public Institution routes.';
revoke all on public.institution_publication_ie_v1 from public,anon,authenticated;
grant select on public.institution_publication_ie_v1 to service_role;

create or replace view public.institution_explorer_ie_v1
with (security_invoker=true) as
select
  i.id as institution_id,
  i.country_code,
  i.slug,
  i.canonical_name,
  i.institution_kind,
  i.ownership_type,
  i.website_url,
  coalesce(programmes.program_count,0)::integer as program_count,
  coalesce(loc.location_count,0)::integer as campus_count,
  coalesce(loc.city_count,0)::integer as city_count,
  coalesce(loc.city_names,array[]::text[]) as city_names
from catalog.institutions i
join public.institution_publication_ie_v1 published
  on published.institution_id=i.id
left join lateral (
  select count(*)::integer as program_count
  from catalog.programmes p
  where p.institution_id=i.id and p.status='active'
) programmes on true
left join lateral (
  select
    count(*)::integer as location_count,
    count(distinct coalesce(l.city_name,l.reported_locality,l.source_city))::integer as city_count,
    coalesce(
      array_agg(distinct coalesce(l.city_name,l.reported_locality,l.source_city)
        order by coalesce(l.city_name,l.reported_locality,l.source_city))
        filter(where coalesce(l.city_name,l.reported_locality,l.source_city) is not null),
      array[]::text[]
    ) as city_names
  from public.institution_location_ie_v1 l
  where l.institution_id=i.id
) loc on true
where i.country_code='IE' and i.status<>'inactive';

comment on view public.institution_explorer_ie_v1 is
  'Service-role Ireland Institution Explorer read model using the source-backed publication cohort and verified-first location layer.';
revoke all on public.institution_explorer_ie_v1 from public,anon,authenticated;
grant select on public.institution_explorer_ie_v1 to service_role;

create or replace view public.institution_detail_ie_v1
with (security_invoker=true) as
select
  i.id as institution_id,
  i.country_code,
  i.slug,
  i.canonical_name,
  i.institution_kind,
  i.ownership_type,
  i.website_url,
  i.status,
  coalesce(programmes.program_count,0)::integer as program_count,
  coalesce(loc.location_count,0)::integer as campus_count,
  coalesce(loc.city_count,0)::integer as city_count,
  coalesce(loc.city_names,array[]::text[]) as city_names,
  null::text as cricos_provider_code,
  null::text as cricos_source_url,
  coalesce(loc.location_preview,'[]'::jsonb) as campus_locations,
  coalesce(programmes.study_areas,'[]'::jsonb) as study_areas,
  coalesce(programmes.programme_types,'[]'::jsonb) as programme_types,
  coalesce(programmes.programme_preview,'[]'::jsonb) as programme_preview,
  published.identity_system,
  published.identity_value,
  published.identity_source_url,
  operator.organization_name as operator_name,
  operator.organization_website_url as operator_website_url,
  operator.relationship_source_url as operator_source_url
from catalog.institutions i
join public.institution_publication_ie_v1 published
  on published.institution_id=i.id
left join lateral (
  select
    count(*)::integer as location_count,
    count(distinct coalesce(l.city_name,l.reported_locality,l.source_city))::integer as city_count,
    coalesce(
      array_agg(distinct coalesce(l.city_name,l.reported_locality,l.source_city)
        order by coalesce(l.city_name,l.reported_locality,l.source_city))
        filter(where coalesce(l.city_name,l.reported_locality,l.source_city) is not null),
      array[]::text[]
    ) as city_names,
    (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id',x.campus_id,
        'name',x.name,
        'city',x.city_name,
        'citySlug',x.city_slug,
        'reportedCity',coalesce(x.reported_locality,x.source_city),
        'region',x.region,
        'address',x.address_line,
        'postalCode',x.postal_code,
        'officialUrl',x.official_url
      ) order by coalesce(x.city_name,x.reported_locality,x.source_city,''),coalesce(x.name,''),x.campus_id),'[]'::jsonb)
      from (
        select * from public.institution_location_ie_v1 l2
        where l2.institution_id=i.id
        order by coalesce(l2.city_name,l2.reported_locality,l2.source_city,''),coalesce(l2.name,''),l2.campus_id
        limit 24
      ) x
    ) as location_preview
  from public.institution_location_ie_v1 l
  where l.institution_id=i.id
) loc on true
left join lateral (
  select
    count(*)::integer as program_count,
    (
      select coalesce(jsonb_agg(jsonb_build_object('name',areas.field_name,'count',areas.program_count)
        order by areas.program_count desc,areas.field_name),'[]'::jsonb)
      from (
        select p2.field_name,count(*)::integer as program_count
        from catalog.programmes p2
        where p2.institution_id=i.id and p2.status='active'
          and nullif(btrim(p2.field_name),'') is not null
        group by p2.field_name
        order by count(*) desc,p2.field_name
        limit 8
      ) areas
    ) as study_areas,
    (
      select coalesce(jsonb_agg(jsonb_build_object('name',types.programme_type,'count',types.program_count)
        order by types.program_count desc,types.programme_type),'[]'::jsonb)
      from (
        select p3.programme_type,count(*)::integer as program_count
        from catalog.programmes p3
        where p3.institution_id=i.id and p3.status='active'
          and nullif(btrim(p3.programme_type),'') is not null
        group by p3.programme_type
        order by count(*) desc,p3.programme_type
        limit 8
      ) types
    ) as programme_types,
    (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id',preview.id,
        'legacyProgramId',null,
        'title',preview.canonical_title,
        'programmeType',preview.programme_type,
        'fieldName',preview.field_name
      ) order by preview.canonical_title,preview.id),'[]'::jsonb)
      from (
        select p4.id,p4.canonical_title,p4.programme_type,p4.field_name
        from catalog.programmes p4
        where p4.institution_id=i.id and p4.status='active'
          and nullif(btrim(p4.canonical_title),'') is not null
        order by p4.canonical_title,p4.id
        limit 12
      ) preview
    ) as programme_preview
  from catalog.programmes p
  where p.institution_id=i.id and p.status='active'
) programmes on true
left join lateral (
  select organization_name,organization_website_url,relationship_source_url
  from public.institution_operator_ie_v1 op
  where op.institution_id=i.id and op.relationship_type='operated_by'
  order by op.organization_name
  limit 1
) operator on true
where i.country_code='IE' and i.status<>'inactive';

comment on view public.institution_detail_ie_v1 is
  'Service-role Ireland Institution Detail read model with verified-first locations, source-backed identity provenance and optional ETB operator relationship.';
revoke all on public.institution_detail_ie_v1 from public,anon,authenticated;
grant select on public.institution_detail_ie_v1 to service_role;

do $$
declare
  publication_count integer;
  publication_program_count integer;
  explorer_count integer;
  detail_count integer;
  missing_identity_source_count integer;
  active_program_count integer;
begin
  select count(*) into publication_count from public.institution_publication_ie_v1;
  if publication_count<>42 then
    raise exception 'Expected 42 source-backed Irish Institutions in publication cohort, found %',publication_count;
  end if;

  select count(*) into publication_program_count
  from catalog.programmes p
  join public.institution_publication_ie_v1 published on published.institution_id=p.institution_id
  where p.status='active';
  if publication_program_count<>2509 then
    raise exception 'Expected 2509 active programmes across Ireland publication cohort, found %',publication_program_count;
  end if;

  select count(*) into explorer_count from public.institution_explorer_ie_v1;
  select count(*) into detail_count from public.institution_detail_ie_v1;
  if explorer_count<>42 or detail_count<>42 then
    raise exception 'Expected 42 Ireland Explorer and Detail rows; explorer %, detail %',explorer_count,detail_count;
  end if;

  select count(*) into missing_identity_source_count
  from public.institution_detail_ie_v1
  where identity_value is null or identity_source_url is null or identity_source_url !~ '^https://';
  if missing_identity_source_count>0 then
    raise exception 'Found % published Irish Institution profiles without source-backed identity provenance',missing_identity_source_count;
  end if;

  select count(*) into active_program_count
  from catalog.programmes p
  join catalog.institutions i on i.id=p.institution_id
  where i.country_code='IE' and p.status='active';
  if active_program_count<>2876 then
    raise exception 'Ireland publication read models changed programme ownership; expected 2876, found %',active_program_count;
  end if;
end $$;
