-- Ireland QQI private higher-education provider cohort v1.
--
-- Source: QQI Quality and Monitoring Review library. QQI currently classifies
-- these providers as Sector = Private HE, Provider type = Private HEI.
-- https://www.qqi.ie/what-we-do/quality-assurance-education-training/reviews
--
-- This migration intentionally stores a source-backed reviewed-provider name,
-- not a fabricated QQI provider code. A numeric provider-code layer can be added
-- later from QQI open data when a stable provider-code extract is ingested.

insert into catalog.institutions(
  country_code,canonical_name,institution_type,website_url,status,slug,
  institution_kind,ownership_type
)
select 'IE','Griffith College','education_provider','https://www.griffith.ie/',
       'active','griffith-college','college','private'
where not exists (
  select 1 from catalog.institutions
  where country_code='IE' and slug='griffith-college'
);

create temp table ie_private_merge_map(
  parent_slug text not null,
  alias_slug text not null
) on commit drop;

insert into ie_private_merge_map values
  ('griffith-college','griffith-college-dublin'),
  ('griffith-college','griffith-college-cork'),
  ('griffith-college','griffith-college-limerick');

update catalog.programmes p
set institution_id=parent.id,updated_at=now()
from ie_private_merge_map m
join catalog.institutions parent
  on parent.country_code='IE' and parent.slug=m.parent_slug
join catalog.institutions alias
  on alias.country_code='IE' and alias.slug=m.alias_slug
where p.institution_id=alias.id;

create temp table ie_private_campus_resolution on commit drop as
with involved as (
  select distinct parent.id as parent_id,parent.id as institution_id,0 as preference
  from ie_private_merge_map m
  join catalog.institutions parent
    on parent.country_code='IE' and parent.slug=m.parent_slug
  union all
  select parent.id,alias.id,1
  from ie_private_merge_map m
  join catalog.institutions parent
    on parent.country_code='IE' and parent.slug=m.parent_slug
  join catalog.institutions alias
    on alias.country_code='IE' and alias.slug=m.alias_slug
), candidates as (
  select inv.parent_id,c.id as campus_id,
         first_value(c.id) over (
           partition by inv.parent_id,lower(coalesce(c.name,'')),lower(coalesce(c.city,''))
           order by inv.preference,c.id
         ) as target_campus_id
  from involved inv
  join catalog.campuses c on c.institution_id=inv.institution_id
)
select distinct parent_id,campus_id,target_campus_id from candidates;

update catalog.programme_offerings po
set campus_id=r.target_campus_id
from ie_private_campus_resolution r
where po.campus_id=r.campus_id and r.campus_id<>r.target_campus_id;

update catalog.programme_accreditations pa
set campus_id=r.target_campus_id
from ie_private_campus_resolution r
where pa.campus_id=r.campus_id and r.campus_id<>r.target_campus_id;

update catalog.campus_identifiers ci
set campus_id=r.target_campus_id
from ie_private_campus_resolution r
where ci.campus_id=r.campus_id and r.campus_id<>r.target_campus_id;

delete from catalog.campuses c
using ie_private_campus_resolution r
where c.id=r.campus_id and r.campus_id<>r.target_campus_id;

update catalog.campuses c
set institution_id=r.parent_id,updated_at=now()
from ie_private_campus_resolution r
where c.id=r.target_campus_id;

update catalog.institution_identifiers ii
set institution_id=parent.id
from ie_private_merge_map m
join catalog.institutions parent
  on parent.country_code='IE' and parent.slug=m.parent_slug
join catalog.institutions alias
  on alias.country_code='IE' and alias.slug=m.alias_slug
where ii.institution_id=alias.id;

update catalog.legacy_entity_map lem
set entity_id=parent.id,
    metadata=coalesce(lem.metadata,'{}'::jsonb)||jsonb_build_object(
      'institution_normalization','ie_qqi_private_parent_v1',
      'normalized_parent_slug',m.parent_slug
    ),
    migrated_at=now()
from ie_private_merge_map m
join catalog.institutions parent
  on parent.country_code='IE' and parent.slug=m.parent_slug
join catalog.institutions alias
  on alias.country_code='IE' and alias.slug=m.alias_slug
where lem.entity_type='institution' and lem.entity_id=alias.id;

update catalog.institutions alias
set status='inactive',updated_at=now()
from ie_private_merge_map m
where alias.country_code='IE' and alias.slug=m.alias_slug;

create temp table ie_qqi_private_profiles(
  slug text primary key,
  qqi_provider_name text not null,
  institution_kind text not null,
  website_url text not null
) on commit drop;

insert into ie_qqi_private_profiles values
  ('dublin-business-school','Dublin Business School','other','https://www.dbs.ie/'),
  ('griffith-college','Griffith College','college','https://www.griffith.ie/'),
  ('national-college-of-ireland','National College of Ireland','college','https://www.ncirl.ie/'),
  ('cct-college-dublin','CCT College','college','https://www.cct.ie/'),
  ('hibernia-college','Hibernia College','college','https://hiberniacollege.com/'),
  ('open-training-college','The Open Training College','college','https://new.opentrainingcollege.com/');

update catalog.institutions i
set website_url=p.website_url,
    institution_kind=p.institution_kind,
    ownership_type='private',
    status='active',
    updated_at=now()
from ie_qqi_private_profiles p
where i.country_code='IE' and i.slug=p.slug;

insert into catalog.institution_identifiers(
  institution_id,identifier_system,identifier_value,source_url
)
select i.id,
       'IE_QQI_REVIEWED_PRIVATE_HEI_NAME',
       p.qqi_provider_name,
       'https://www.qqi.ie/what-we-do/quality-assurance-education-training/reviews'
from ie_qqi_private_profiles p
join catalog.institutions i
  on i.country_code='IE' and i.slug=p.slug
on conflict (identifier_system,identifier_value)
do update set institution_id=excluded.institution_id,
              source_url=excluded.source_url;

create or replace view public.institution_identity_ie_qqi_private_v1
with (security_invoker=true) as
select
  i.id as institution_id,
  i.country_code,
  i.slug,
  i.canonical_name,
  i.institution_kind,
  i.ownership_type,
  i.website_url,
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
 and qqi.identifier_system='IE_QQI_REVIEWED_PRIVATE_HEI_NAME'
left join catalog.institution_identifiers legacy
  on legacy.institution_id=i.id
 and legacy.identifier_system in ('IE_PROVIDER_ID','IE_LEGACY_COLLEGE_NAME')
where i.country_code='IE'
  and i.status<>'inactive'
  and i.slug is not null
group by i.id,i.country_code,i.slug,i.canonical_name,i.institution_kind,
         i.ownership_type,i.website_url,qqi.identifier_value,qqi.source_url;

comment on view public.institution_identity_ie_qqi_private_v1 is
  'Service-role Ireland QQI-reviewed private HEI identity cohort. QQI provider name/type is source-backed; legacy provider IDs are historical import keys, not official QQI codes.';

revoke all on public.institution_identity_ie_qqi_private_v1 from public,anon,authenticated;
grant select on public.institution_identity_ie_qqi_private_v1 to service_role;

do $$
declare
  private_identity_count integer;
  griffith_programs integer;
  active_alias_count integer;
  active_programs integer;
  offering_count integer;
  active_institutions integer;
begin
  select count(*) into private_identity_count
  from public.institution_identity_ie_qqi_private_v1;
  if private_identity_count<>6 then
    raise exception 'Expected 6 QQI-reviewed private HEIs in cohort v1, found %',private_identity_count;
  end if;

  select count(*) into griffith_programs
  from catalog.programmes p
  join catalog.institutions i on i.id=p.institution_id
  where i.country_code='IE' and i.slug='griffith-college' and p.status='active';
  if griffith_programs<>58 then
    raise exception 'Expected 58 Griffith College programmes after campus-entity consolidation, found %',griffith_programs;
  end if;

  select count(*) into active_alias_count
  from ie_private_merge_map m
  join catalog.institutions i on i.country_code='IE' and i.slug=m.alias_slug
  where i.status<>'inactive';
  if active_alias_count>0 then
    raise exception 'Found % Griffith campus aliases still active as institutions',active_alias_count;
  end if;

  select count(*) into active_programs
  from catalog.programmes p
  join catalog.institutions i on i.id=p.institution_id
  where i.country_code='IE' and p.status='active';
  if active_programs<>2876 then
    raise exception 'Expected 2876 active Irish programmes after QQI private HEI normalization, found %',active_programs;
  end if;

  select count(*) into offering_count
  from catalog.programme_offerings po
  join catalog.programmes p on p.id=po.programme_id
  join catalog.institutions i on i.id=p.institution_id
  where i.country_code='IE' and p.status='active';
  if offering_count<>2876 then
    raise exception 'Expected 2876 Irish programme offerings after QQI private HEI normalization, found %',offering_count;
  end if;

  select count(*) into active_institutions
  from catalog.institutions
  where country_code='IE' and status<>'inactive';
  if active_institutions<>183 then
    raise exception 'Expected 183 active Irish institutions after HEA and Griffith consolidation, found %',active_institutions;
  end if;
end $$;
