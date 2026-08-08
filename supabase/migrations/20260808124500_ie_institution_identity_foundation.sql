-- Ireland Institution identity foundation.
--
-- Primary public-system source:
-- Higher Education Authority (HEA) current Higher Education Institutions list.
-- https://hea.ie/higher-education-institutions/
--
-- QQI's Irish Register of Qualifications is the national source for quality-assured
-- providers outside the HEA-funded cohort. A later migration will add QQI provider
-- identities for the remaining FET/private-provider cohort; this migration does not
-- invent QQI provider codes from legacy names.
--
-- Important modelling repair: four technological universities were imported as
-- multiple institution rows representing campus groups. Programs, campuses and
-- legacy identities are consolidated under the current university parent while the
-- historical rows are retained as inactive aliases.

insert into catalog.institutions(country_code,canonical_name,institution_type,website_url,status,slug,institution_kind,ownership_type)
select 'IE','Atlantic Technological University','education_provider','https://www.atu.ie/','active','atlantic-technological-university','university','public'
where not exists (select 1 from catalog.institutions where country_code='IE' and slug='atlantic-technological-university');

insert into catalog.institutions(country_code,canonical_name,institution_type,website_url,status,slug,institution_kind,ownership_type)
select 'IE','Technological University of the Shannon: Midlands Midwest','education_provider','https://tus.ie/','active','technological-university-of-the-shannon','university','public'
where not exists (select 1 from catalog.institutions where country_code='IE' and slug='technological-university-of-the-shannon');

create temp table ie_institution_merge_map(parent_slug text not null,alias_slug text not null) on commit drop;
insert into ie_institution_merge_map(parent_slug,alias_slug) values
('atlantic-technological-university','atu-donegal-campuses'),
('atlantic-technological-university','atu-galway-campuses'),
('atlantic-technological-university','atu-mayo-campus'),
('atlantic-technological-university','atu-sligo-campus'),
('atlantic-technological-university','atu-st-angela-s'),
('munster-technological-university','mtu-cork-campuses'),
('munster-technological-university','mtu-crawford-college-of-art-and-design-cork'),
('munster-technological-university','mtu-kerry-campus'),
('munster-technological-university','mtu-munster-technological-university'),
('south-east-technological-university','setu-carlow-campus'),
('south-east-technological-university','setu-waterford-campus'),
('south-east-technological-university','setu-wexford-campus'),
('technological-university-of-the-shannon','tus-athlone-campus'),
('technological-university-of-the-shannon','tus-clonmel-campus'),
('technological-university-of-the-shannon','tus-limerick-campuses'),
('technological-university-of-the-shannon','tus-technological-university-of-the-shannon'),
('technological-university-of-the-shannon','tus-thurles-campus'),
('university-of-galway','nui-galway');

update catalog.programmes p
set institution_id=parent.id,updated_at=now()
from ie_institution_merge_map m
join catalog.institutions parent on parent.country_code='IE' and parent.slug=m.parent_slug
join catalog.institutions alias on alias.country_code='IE' and alias.slug=m.alias_slug
where p.institution_id=alias.id;

-- Resolve campus duplicates before moving institution ownership. Existing parent
-- campuses win; otherwise the lowest UUID becomes the stable canonical campus.
create temp table ie_campus_resolution on commit drop as
with involved as (
  select distinct parent.id as parent_id,parent.id as institution_id,0 as preference
  from ie_institution_merge_map m
  join catalog.institutions parent on parent.country_code='IE' and parent.slug=m.parent_slug
  union all
  select parent.id,alias.id,1
  from ie_institution_merge_map m
  join catalog.institutions parent on parent.country_code='IE' and parent.slug=m.parent_slug
  join catalog.institutions alias on alias.country_code='IE' and alias.slug=m.alias_slug
), candidates as (
  select inv.parent_id,c.id as campus_id,c.name,c.city,inv.preference,
         first_value(c.id) over (
           partition by inv.parent_id,lower(coalesce(c.name,'')),lower(coalesce(c.city,''))
           order by inv.preference,c.id
         ) as target_campus_id
  from involved inv
  join catalog.campuses c on c.institution_id=inv.institution_id
)
select distinct parent_id,campus_id,target_campus_id
from candidates;

update catalog.programme_offerings po
set campus_id=r.target_campus_id
from ie_campus_resolution r
where po.campus_id=r.campus_id and r.campus_id<>r.target_campus_id;

update catalog.programme_accreditations pa
set campus_id=r.target_campus_id
from ie_campus_resolution r
where pa.campus_id=r.campus_id and r.campus_id<>r.target_campus_id;

update catalog.campus_identifiers ci
set campus_id=r.target_campus_id
from ie_campus_resolution r
where ci.campus_id=r.campus_id and r.campus_id<>r.target_campus_id;

delete from catalog.campuses c
using ie_campus_resolution r
where c.id=r.campus_id and r.campus_id<>r.target_campus_id;

update catalog.campuses c
set institution_id=r.parent_id,updated_at=now()
from ie_campus_resolution r
where c.id=r.target_campus_id;

update catalog.institution_identifiers ii
set institution_id=parent.id
from ie_institution_merge_map m
join catalog.institutions parent on parent.country_code='IE' and parent.slug=m.parent_slug
join catalog.institutions alias on alias.country_code='IE' and alias.slug=m.alias_slug
where ii.institution_id=alias.id;

update catalog.legacy_entity_map lem
set entity_id=parent.id,
    metadata=coalesce(lem.metadata,'{}'::jsonb)||jsonb_build_object('institution_normalization','ie_current_parent_v1','normalized_parent_slug',m.parent_slug),
    migrated_at=now()
from ie_institution_merge_map m
join catalog.institutions parent on parent.country_code='IE' and parent.slug=m.parent_slug
join catalog.institutions alias on alias.country_code='IE' and alias.slug=m.alias_slug
where lem.entity_type='institution' and lem.entity_id=alias.id;

update catalog.institutions alias
set status='inactive',updated_at=now()
from ie_institution_merge_map m
where alias.country_code='IE' and alias.slug=m.alias_slug;

update catalog.institutions
set canonical_name='Institute of Art, Design and Technology',website_url='https://iadt.ie/',institution_kind='other',ownership_type='public',updated_at=now()
where country_code='IE' and slug='institute-of-art-design-and-technology';
update catalog.institutions
set canonical_name='Dundalk Institute of Technology',website_url='https://www.dkit.ie/',institution_kind='other',ownership_type='public',updated_at=now()
where country_code='IE' and slug='dundalk-institute-of-technology';
update catalog.institutions
set canonical_name='National College of Art and Design',updated_at=now()
where country_code='IE' and slug='national-college-of-art-and-design';

create temp table ie_hea_profiles(slug text primary key,hea_listed_name text not null,institution_kind text not null,ownership_type text not null,website_url text not null) on commit drop;
insert into ie_hea_profiles values
('atlantic-technological-university','Atlantic Technological University','university','public','https://www.atu.ie/'),
('dublin-city-university','Dublin City University','university','public','https://www.dcu.ie/'),
('institute-of-art-design-and-technology','Dun Laoghaire Institute of Art and Design & Technology','other','public','https://iadt.ie/'),
('dundalk-institute-of-technology','Dundalk Institute of Technology','other','public','https://www.dkit.ie/'),
('mary-immaculate-college','Mary Immaculate College','college','public','https://www.mic.ul.ie/'),
('maynooth-university','Maynooth University','university','public','https://www.maynoothuniversity.ie/'),
('munster-technological-university','Munster Technological University','university','public','https://www.mtu.ie/'),
('national-college-of-art-and-design','National College of Art & Design','college','public','https://www.ncad.ie/'),
('rcsi-university-of-medicine-and-health-sciences','RCSI University of Medicine and Health Sciences','university','private','https://www.rcsi.com/'),
('south-east-technological-university','South East Technological University','university','public','https://www.setu.ie/'),
('technological-university-dublin','Technological University Dublin','university','public','https://www.tudublin.ie/'),
('technological-university-of-the-shannon','Technological University Shannon: Midlands Midwest','university','public','https://tus.ie/'),
('trinity-college-dublin','Trinity College Dublin','university','public','https://www.tcd.ie/'),
('university-college-cork','University College Cork','university','public','https://www.ucc.ie/'),
('university-college-dublin','University College Dublin','university','public','https://www.ucd.ie/'),
('university-of-galway','University of Galway','university','public','https://www.universityofgalway.ie/'),
('university-of-limerick','University of Limerick','university','public','https://www.ul.ie/');

update catalog.institutions i
set website_url=p.website_url,institution_kind=p.institution_kind,ownership_type=p.ownership_type,status='active',updated_at=now()
from ie_hea_profiles p where i.country_code='IE' and i.slug=p.slug;

insert into catalog.institution_identifiers(institution_id,identifier_system,identifier_value,source_url)
select i.id,'IE_HEA_LISTED_HEI_NAME',p.hea_listed_name,'https://hea.ie/higher-education-institutions/'
from ie_hea_profiles p join catalog.institutions i on i.country_code='IE' and i.slug=p.slug
on conflict (identifier_system,identifier_value)
do update set institution_id=excluded.institution_id,source_url=excluded.source_url;

create or replace view public.institution_identity_ie_v1 with (security_invoker=true) as
select i.id as institution_id,i.country_code,i.slug,i.canonical_name,i.institution_kind,i.ownership_type,i.website_url,
       hea.identifier_value as hea_listed_name,hea.source_url as hea_source_url,
       coalesce(array_agg(distinct legacy.identifier_value order by legacy.identifier_value) filter(where legacy.identifier_value is not null),array[]::text[]) as legacy_provider_ids
from catalog.institutions i
join catalog.institution_identifiers hea on hea.institution_id=i.id and hea.identifier_system='IE_HEA_LISTED_HEI_NAME'
left join catalog.institution_identifiers legacy on legacy.institution_id=i.id and legacy.identifier_system in ('IE_PROVIDER_ID','IE_LEGACY_COLLEGE_NAME')
where i.country_code='IE' and i.status<>'inactive' and i.slug is not null
group by i.id,i.country_code,i.slug,i.canonical_name,i.institution_kind,i.ownership_type,i.website_url,hea.identifier_value,hea.source_url;
comment on view public.institution_identity_ie_v1 is 'Service-role Ireland HEA-listed Institution identity read model. HEA membership is source-backed; legacy provider IDs remain historical import keys and are not presented as official regulatory codes.';
revoke all on public.institution_identity_ie_v1 from public,anon,authenticated;
grant select on public.institution_identity_ie_v1 to service_role;

do $$
declare
  active_programs integer; active_institutions integer; hea_identity_count integer; hea_website_count integer;
  active_alias_count integer; programme_parent_failures integer; offering_count integer; parent_counts jsonb;
begin
  select count(*) into active_programs from catalog.programmes p join catalog.institutions i on i.id=p.institution_id where i.country_code='IE' and p.status='active';
  if active_programs<>2876 then raise exception 'Expected 2876 active Irish programmes after institution normalization, found %',active_programs; end if;
  select count(*) into active_institutions from catalog.institutions where country_code='IE' and status<>'inactive';
  if active_institutions<>185 then raise exception 'Expected 185 active Irish institutions after current-parent consolidation, found %',active_institutions; end if;
  select count(*) into hea_identity_count from public.institution_identity_ie_v1;
  if hea_identity_count<>17 then raise exception 'Expected 17 HEA-listed programme-relevant institutions in the IE identity view, found %',hea_identity_count; end if;
  select count(*) into hea_website_count from public.institution_identity_ie_v1 where website_url like 'https://%';
  if hea_website_count<>17 then raise exception 'Expected official websites for all 17 HEA-listed programme-relevant institutions, found %',hea_website_count; end if;
  select count(*) into active_alias_count from ie_institution_merge_map m join catalog.institutions i on i.country_code='IE' and i.slug=m.alias_slug where i.status<>'inactive';
  if active_alias_count>0 then raise exception 'Found % technological-university/legacy aliases still active',active_alias_count; end if;
  select count(*) into programme_parent_failures from catalog.programmes p join catalog.institutions i on i.id=p.institution_id where i.country_code='IE' and p.status='active' and i.status='inactive';
  if programme_parent_failures>0 then raise exception 'Found % active Irish programmes still attached to inactive institution aliases',programme_parent_failures; end if;
  select count(*) into offering_count from catalog.programme_offerings po join catalog.programmes p on p.id=po.programme_id join catalog.institutions i on i.id=p.institution_id where i.country_code='IE' and p.status='active';
  if offering_count<>2876 then raise exception 'Expected 2876 Irish programme offerings to remain connected, found %',offering_count; end if;
  select jsonb_object_agg(slug,program_count) into parent_counts from (select i.slug,count(*)::integer program_count from catalog.institutions i join catalog.programmes p on p.institution_id=i.id and p.status='active' where i.country_code='IE' and i.slug in ('atlantic-technological-university','munster-technological-university','south-east-technological-university','technological-university-of-the-shannon') group by i.slug) x;
  if parent_counts is distinct from jsonb_build_object('atlantic-technological-university',336,'munster-technological-university',125,'south-east-technological-university',234,'technological-university-of-the-shannon',193) then raise exception 'Unexpected TU programme totals after consolidation: %',parent_counts; end if;
end $$;
