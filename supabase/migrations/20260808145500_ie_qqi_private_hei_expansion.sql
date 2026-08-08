-- Ireland QQI Private HEI identity expansion v2.
--
-- This expands the source-backed private higher-education cohort after the
-- initial six-provider foundation. QQI case-study/review material explicitly
-- classifies these providers as Private HEI. City College Dublin uses the
-- current QQI focused-review source that records the City Education Group name
-- transition to City College Dublin.
--
-- No numeric QQI provider code is invented here. Legacy Qualifax provider/name
-- identifiers remain historical import keys. Current official website/brand
-- names are normalized independently from those legacy keys.

create temp table ie_qqi_private_expansion(
  legacy_slug text primary key,
  canonical_slug text not null,
  canonical_name text not null,
  qqi_provider_name text not null,
  website_url text not null,
  qqi_source_url text not null
) on commit drop;

insert into ie_qqi_private_expansion values
  (
    'irish-college-of-humanities-and-applied-sciences-limited',
    'irish-college-of-humanities-and-applied-sciences',
    'Irish College of Humanities and Applied Sciences',
    'Irish College of Humanities and Applied Sciences',
    'https://ichas.ie/',
    'https://www.qqi.ie/what-we-do/case-studies'
  ),
  (
    'city-college-dublin',
    'city-college-dublin',
    'City College Dublin',
    'City College Dublin',
    'https://citycollegedublin.ie/',
    'https://www.qqi.ie/sites/default/files/2025-12/post-arc-final_ceg-focused-review-report_post-arc_1.pdf'
  ),
  (
    'galway-business-school',
    'galway-business-school',
    'Galway Business School',
    'Galway Business School',
    'https://www.galwaybusinessschool.ie/',
    'https://www.qqi.ie/what-we-do/case-studies'
  ),
  (
    'innopharma-labs-ltd',
    'innopharma-education',
    'Innopharma Education',
    'Innopharma Education',
    'https://www.innopharmaeducation.com/',
    'https://www.qqi.ie/what-we-do/case-studies'
  ),
  (
    'dorset-college',
    'dorset-college',
    'Dorset College',
    'Dorset College',
    'https://dorset.ie/',
    'https://www.qqi.ie/what-we-do/case-studies'
  ),
  (
    'ibat-college-dublin',
    'ibat-college-dublin',
    'IBAT College Dublin',
    'IBAT College Dublin',
    'https://www.ibat.ie/',
    'https://www.qqi.ie/what-we-do/case-studies'
  ),
  (
    'iicp-education-and-training',
    'iicp-college',
    'IICP College',
    'IICP College',
    'https://iicp.ie/',
    'https://www.qqi.ie/what-we-do/case-studies'
  ),
  (
    'icd-business-school',
    'icd-business-school',
    'ICD Business School',
    'ICD Business School',
    'https://icd.ie/',
    'https://www.qqi.ie/what-we-do/case-studies'
  );

-- Fail closed before changing slugs: a current target slug may not belong to a
-- different Irish institution.
do $$
declare
  collision_count integer;
begin
  select count(*)
  into collision_count
  from ie_qqi_private_expansion p
  join catalog.institutions target
    on target.country_code='IE'
   and target.slug=p.canonical_slug
  join catalog.institutions source
    on source.country_code='IE'
   and source.slug=p.legacy_slug
  where target.id<>source.id;

  if collision_count>0 then
    raise exception 'Found % Ireland QQI private canonical-slug collisions',collision_count;
  end if;
end $$;

update catalog.institutions i
set
  slug=p.canonical_slug,
  canonical_name=p.canonical_name,
  website_url=p.website_url,
  institution_kind='college',
  ownership_type='private',
  status='active',
  updated_at=now()
from ie_qqi_private_expansion p
where i.country_code='IE'
  and i.slug=p.legacy_slug;

insert into catalog.institution_identifiers(
  institution_id,identifier_system,identifier_value,source_url
)
select
  i.id,
  'IE_QQI_PRIVATE_HEI_NAME',
  p.qqi_provider_name,
  p.qqi_source_url
from ie_qqi_private_expansion p
join catalog.institutions i
  on i.country_code='IE'
 and i.slug=p.canonical_slug
 and i.status<>'inactive'
on conflict(identifier_system,identifier_value)
do update set
  institution_id=excluded.institution_id,
  source_url=excluded.source_url;

create or replace view public.institution_identity_ie_qqi_v1
with (security_invoker=true) as
select
  i.id as institution_id,
  i.country_code,
  i.slug,
  i.canonical_name,
  i.institution_kind,
  i.ownership_type,
  i.website_url,
  qqi.identifier_system as qqi_identity_system,
  qqi.identifier_value as qqi_provider_name,
  qqi.source_url as qqi_source_url,
  coalesce(
    array_agg(distinct legacy.identifier_value order by legacy.identifier_value)
      filter(where legacy.identifier_value is not null),
    array[]::text[]
  ) as legacy_provider_ids
from catalog.institutions i
join catalog.institution_identifiers qqi
  on qqi.institution_id=i.id
 and qqi.identifier_system in (
   'IE_QQI_REVIEWED_PRIVATE_HEI_NAME',
   'IE_QQI_PRIVATE_HEI_NAME'
 )
left join catalog.institution_identifiers legacy
  on legacy.institution_id=i.id
 and legacy.identifier_system in ('IE_PROVIDER_ID','IE_LEGACY_COLLEGE_NAME')
where i.country_code='IE'
  and i.status<>'inactive'
  and i.slug is not null
group by
  i.id,i.country_code,i.slug,i.canonical_name,i.institution_kind,
  i.ownership_type,i.website_url,
  qqi.identifier_system,qqi.identifier_value,qqi.source_url;

comment on view public.institution_identity_ie_qqi_v1 is
  'Service-role Ireland QQI Private HEI identity cohort combining reviewed-provider foundation identities with the source-backed expansion cohort. Legacy identifiers remain import keys, not official QQI provider codes.';

revoke all on public.institution_identity_ie_qqi_v1 from public,anon,authenticated;
grant select on public.institution_identity_ie_qqi_v1 to service_role;

do $$
declare
  new_identity_count integer;
  combined_identity_count integer;
  normalized_count integer;
  cohort_program_count integer;
  active_program_count integer;
  bad_website_count integer;
begin
  select count(*)
  into new_identity_count
  from catalog.institution_identifiers ii
  join catalog.institutions i on i.id=ii.institution_id
  where i.country_code='IE'
    and ii.identifier_system='IE_QQI_PRIVATE_HEI_NAME';

  if new_identity_count<>8 then
    raise exception 'Expected 8 Ireland QQI Private HEI expansion identities, found %',new_identity_count;
  end if;

  select count(*)
  into combined_identity_count
  from public.institution_identity_ie_qqi_v1;

  if combined_identity_count<>14 then
    raise exception 'Expected 14 combined QQI Private HEI identities after expansion, found %',combined_identity_count;
  end if;

  select count(*)
  into normalized_count
  from public.institution_identity_ie_qqi_v1
  where institution_kind='college'
    and ownership_type='private'
    and website_url like 'https://%';

  if normalized_count<>14 then
    raise exception 'Expected all 14 QQI Private HEIs to have source-backed type/ownership/website, found %',normalized_count;
  end if;

  select count(*)
  into cohort_program_count
  from catalog.programmes p
  join catalog.institutions i on i.id=p.institution_id
  join catalog.institution_identifiers ii
    on ii.institution_id=i.id
   and ii.identifier_system='IE_QQI_PRIVATE_HEI_NAME'
  where i.country_code='IE' and p.status='active';

  if cohort_program_count<>68 then
    raise exception 'Expected 68 active programmes in the 8-provider QQI Private HEI expansion, found %',cohort_program_count;
  end if;

  select count(*)
  into active_program_count
  from catalog.programmes p
  join catalog.institutions i on i.id=p.institution_id
  where i.country_code='IE' and p.status='active';

  if active_program_count<>2876 then
    raise exception 'Expected all 2876 Irish active programmes to remain connected after QQI Private HEI expansion, found %',active_program_count;
  end if;

  select count(*)
  into bad_website_count
  from catalog.institutions i
  join catalog.institution_identifiers ii
    on ii.institution_id=i.id
   and ii.identifier_system='IE_QQI_PRIVATE_HEI_NAME'
  where i.website_url is null or i.website_url !~ '^https://';

  if bad_website_count>0 then
    raise exception 'Found % expanded QQI Private HEIs without HTTPS official website',bad_website_count;
  end if;
end $$;
