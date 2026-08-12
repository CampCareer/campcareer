-- Publish Ireland Tier A city institution linkage from current HEA-recognised institutions and official campus/location evidence.
-- Existing Ireland programme offerings remain legacy_backfill + unverified and are not promoted to city delivery.

with providers(slug, website_url) as (
  values
    ('trinity-college-dublin','https://www.tcd.ie/'),
    ('university-college-dublin','https://www.ucd.ie/'),
    ('dublin-city-university','https://www.dcu.ie/'),
    ('technological-university-dublin','https://www.tudublin.ie/'),
    ('rcsi-university-of-medicine-and-health-sciences','https://www.rcsi.com/dublin/'),
    ('university-college-cork','https://www.ucc.ie/'),
    ('university-of-galway','https://www.universityofgalway.ie/'),
    ('university-of-limerick','https://www.ul.ie/'),
    ('mary-immaculate-college','https://www.mic.ul.ie/')
)
update catalog.institutions i
set website_url=p.website_url,
    updated_at=now()
from providers p
where i.country_code='IE'
  and i.status='active'
  and i.slug=p.slug;

insert into catalog.institution_identifiers(
  id,institution_id,identifier_system,identifier_value,source_url,valid_from,valid_to,created_at
)
select
  md5('ie_hea_recognised_entity:' || i.slug)::uuid,
  i.id,
  'IE_HEA_RECOGNISED_ENTITY',
  i.slug,
  'https://hea.ie/higher-education-institutions/',
  null,
  null,
  now()
from catalog.institutions i
where i.country_code='IE'
  and i.status='active'
  and i.slug in (
    'trinity-college-dublin','university-college-dublin','dublin-city-university',
    'technological-university-dublin','rcsi-university-of-medicine-and-health-sciences',
    'university-college-cork','university-of-galway','university-of-limerick','mary-immaculate-college'
  )
on conflict(identifier_system,identifier_value) do update set
  institution_id=excluded.institution_id,
  source_url=excluded.source_url;

with locations(
  provider_slug,location_key,location_name,city_slug,city,region,address_line,postal_code,official_url,record_scope
) as (
  values
    ('trinity-college-dublin','college-green','College Green campus','dublin','Dublin','Leinster','College Green, Dublin 2',null,'https://www.tcd.ie/study/contact/','verified_institution_location'),
    ('university-college-dublin','belfield','Belfield campus','dublin','Dublin','Leinster','Belfield, Dublin 4','D04 C1P1','https://www.ucd.ie/residences/contactus/','verified_campus_location'),
    ('dublin-city-university','glasnevin','Glasnevin campus','dublin','Dublin','Leinster','Glasnevin, Dublin 9',null,'https://www.dcu.ie/global/contact-us','verified_campus_location'),
    ('technological-university-dublin','grangegorman','Grangegorman campus','dublin','Dublin','Leinster','Grangegorman Lower, Dublin 7','D07 C972','https://www.tudublin.ie/explore/our-campuses/','verified_campus_location'),
    ('rcsi-university-of-medicine-and-health-sciences','st-stephens-green','St Stephen''s Green campus','dublin','Dublin','Leinster','123 St Stephen''s Green, Dublin 2',null,'https://www.rcsi.com/dublin/student-life/life-on-campus/our-campus','verified_campus_location'),
    ('university-college-cork','college-road','Main College Road campus','cork','Cork','Munster','College Road, Cork','T12 K8AF','https://www.ucc.ie/en/sustainability-institute/contactus/maincampusucc/','verified_campus_location'),
    ('university-of-galway','galway-city','Galway City campus','galway','Galway','Connacht',null,null,'https://www.universityofgalway.ie/about-us/contact-us/where-to-find-us.html','verified_campus_location'),
    ('university-of-limerick','main-limerick','University of Limerick campus','limerick','Limerick','Munster','University of Limerick, Limerick','V94 T9PX','https://pure.ul.ie/en/organisations/department-of-history-and-geography/','verified_institution_location'),
    ('mary-immaculate-college','limerick-campus','MIC Limerick campus','limerick','Limerick','Munster','South Circular Road, Limerick','V94 VN26','https://www.mic.ul.ie/life-at-mic/mic-limerick-campus','verified_campus_location')
),
resolved as (
  select l.*,i.id as institution_id,g.id as geography_id
  from locations l
  join catalog.institutions i
    on i.country_code='IE' and i.status='active' and i.slug=l.provider_slug
  join core.geographies g
    on g.country_code='IE'
   and g.geography_type='city'
   and g.canonical_geography_id is null
   and g.status='active'
   and g.metadata->>'publication_tier'='A'
   and g.slug=l.city_slug
  where exists (
    select 1 from catalog.institution_identifiers ii
    where ii.institution_id=i.id
      and ii.identifier_system='IE_HEA_RECOGNISED_ENTITY'
      and ii.source_url='https://hea.ie/higher-education-institutions/'
  )
)
insert into catalog.campuses(
  id,institution_id,name,city,locality,region,country_code,
  geography_id,locality_geography_id,address_line,postal_code,
  official_url,source_url,source_checked_at,metadata,status
)
select
  md5('ie_city_phase3_location:' || r.provider_slug || ':' || r.location_key)::uuid,
  r.institution_id,r.location_name,r.city,r.city,r.region,'IE',
  r.geography_id,r.geography_id,r.address_line,r.postal_code,
  r.official_url,r.official_url,now(),
  jsonb_build_object(
    'record_scope',r.record_scope,
    'location_quality','verified_official',
    'source_tier','institution_official',
    'location_key',r.location_key,
    'provider_slug',r.provider_slug,
    'normalization_batch','ie_city_linkage_v1',
    'programme_assignment_verified',false
  ),
  'active'
from resolved r
on conflict(id) do update set
  name=excluded.name,
  city=excluded.city,
  locality=excluded.locality,
  region=excluded.region,
  geography_id=excluded.geography_id,
  locality_geography_id=excluded.locality_geography_id,
  address_line=excluded.address_line,
  postal_code=excluded.postal_code,
  official_url=excluded.official_url,
  source_url=excluded.source_url,
  source_checked_at=excluded.source_checked_at,
  metadata=excluded.metadata,
  status=excluded.status,
  updated_at=now();

create table if not exists public.city_directory_ie_v1(
  city_id uuid primary key,
  country_code text not null,
  slug text not null unique,
  name text not null,
  region text not null,
  scope_kind text not null,
  study_destination_scope text not null,
  linked_campus_count integer not null default 0,
  linked_institution_count integer not null default 0,
  linked_program_count integer not null default 0,
  institution_coverage_status text not null default 'initial_verified_set',
  programme_coverage_status text not null default 'verification_pending',
  updated_at timestamptz not null default now()
);

alter table public.city_directory_ie_v1 enable row level security;
revoke all on public.city_directory_ie_v1 from public,anon,authenticated;
grant select on public.city_directory_ie_v1 to service_role;

create table if not exists public.city_institution_directory_ie_v1(
  city_id uuid not null,
  campus_id uuid not null,
  institution_id uuid not null,
  institution_name text not null,
  institution_slug text not null,
  provider_authority text not null,
  provider_source_url text not null,
  website_url text not null,
  campus_name text not null,
  campus_city text not null,
  region text not null,
  address_line text,
  postal_code text,
  location_source_url text not null,
  location_quality text not null,
  record_scope text not null,
  linkage_basis text not null default 'verified_official_location',
  primary key(city_id,campus_id)
);

create index if not exists city_institution_directory_ie_v1_city_idx
  on public.city_institution_directory_ie_v1(city_id,institution_name);
create index if not exists city_institution_directory_ie_v1_institution_idx
  on public.city_institution_directory_ie_v1(institution_id,city_id);

alter table public.city_institution_directory_ie_v1 enable row level security;
revoke all on public.city_institution_directory_ie_v1 from public,anon,authenticated;
grant select on public.city_institution_directory_ie_v1 to service_role;

create table if not exists public.city_programme_directory_ie_v1(
  city_id uuid not null,
  programme_id uuid not null,
  institution_id uuid not null,
  offering_count integer not null default 0,
  linkage_basis text not null default 'verified_programme_offerings.campus_id',
  primary key(city_id,programme_id)
);

create index if not exists city_programme_directory_ie_v1_programme_idx
  on public.city_programme_directory_ie_v1(programme_id,city_id);

alter table public.city_programme_directory_ie_v1 enable row level security;
revoke all on public.city_programme_directory_ie_v1 from public,anon,authenticated;
grant select on public.city_programme_directory_ie_v1 to service_role;

truncate table public.city_programme_directory_ie_v1;
truncate table public.city_institution_directory_ie_v1;
truncate table public.city_directory_ie_v1;

with tier as (
  select id,country_code,slug,name,region_code,scope_kind,metadata
  from core.geographies
  where country_code='IE'
    and geography_type='city'
    and canonical_geography_id is null
    and status='active'
    and metadata->>'publication_tier'='A'
),
eligible_locations as (
  select t.id as city_id,c.id as campus_id,c.institution_id
  from tier t
  join catalog.campuses c
    on c.country_code='IE'
   and c.status='active'
   and c.metadata->>'location_quality'='verified_official'
   and c.source_url is not null
   and c.geography_id=t.id
  join catalog.institutions i
    on i.id=c.institution_id
   and i.country_code='IE'
   and i.status='active'
   and i.slug is not null
   and i.website_url is not null
  where exists (
    select 1 from catalog.institution_identifiers ii
    where ii.institution_id=i.id
      and ii.identifier_system='IE_HEA_RECOGNISED_ENTITY'
      and ii.source_url='https://hea.ie/higher-education-institutions/'
  )
)
insert into public.city_directory_ie_v1(
  city_id,country_code,slug,name,region,scope_kind,study_destination_scope,
  linked_campus_count,linked_institution_count,linked_program_count,
  institution_coverage_status,programme_coverage_status,updated_at
)
select
  t.id,t.country_code,t.slug,t.name,t.region_code,t.scope_kind,
  t.metadata->>'study_destination_scope',
  count(distinct e.campus_id)::integer,
  count(distinct e.institution_id)::integer,
  0,'initial_verified_set','verification_pending',now()
from tier t
left join eligible_locations e on e.city_id=t.id
group by t.id,t.country_code,t.slug,t.name,t.region_code,t.scope_kind,t.metadata;

with tier as (
  select id from core.geographies
  where country_code='IE'
    and geography_type='city'
    and canonical_geography_id is null
    and status='active'
    and metadata->>'publication_tier'='A'
),
eligible_locations as (
  select t.id as city_id,c.id as campus_id,c.institution_id,c.name as campus_name,
    coalesce(c.city,c.locality) as campus_city,c.region,c.address_line,c.postal_code,
    c.source_url,c.metadata->>'location_quality' as location_quality,
    c.metadata->>'record_scope' as record_scope
  from tier t
  join catalog.campuses c
    on c.country_code='IE'
   and c.status='active'
   and c.metadata->>'location_quality'='verified_official'
   and c.source_url is not null
   and c.geography_id=t.id
)
insert into public.city_institution_directory_ie_v1(
  city_id,campus_id,institution_id,institution_name,institution_slug,
  provider_authority,provider_source_url,website_url,campus_name,campus_city,
  region,address_line,postal_code,location_source_url,location_quality,record_scope,linkage_basis
)
select
  e.city_id,e.campus_id,i.id,i.canonical_name,i.slug,
  'Higher Education Authority','https://hea.ie/higher-education-institutions/',
  i.website_url,e.campus_name,e.campus_city,e.region,e.address_line,e.postal_code,
  e.source_url,e.location_quality,e.record_scope,'verified_official_location'
from eligible_locations e
join catalog.institutions i
  on i.id=e.institution_id
 and i.country_code='IE'
 and i.status='active'
 and i.slug is not null
 and i.website_url is not null
where exists (
  select 1 from catalog.institution_identifiers ii
  where ii.institution_id=i.id
    and ii.identifier_system='IE_HEA_RECOGNISED_ENTITY'
    and ii.source_url='https://hea.ie/higher-education-institutions/'
);

insert into public.city_programme_directory_ie_v1(
  city_id,programme_id,institution_id,offering_count,linkage_basis
)
select
  d.city_id,p.id,p.institution_id,count(distinct po.id)::integer,
  'verified_programme_offerings.campus_id'
from public.city_institution_directory_ie_v1 d
join catalog.campuses c on c.id=d.campus_id
join catalog.programme_offerings po
  on po.campus_id=c.id
 and po.verification_status='verified'
 and po.source_url is not null
join catalog.programmes p
  on p.id=po.programme_id
 and p.status='active'
 and p.institution_id=d.institution_id
where c.metadata->>'programme_assignment_verified'='true'
  and coalesce(po.enrolment_status,'open') not in ('closed','suspended')
group by d.city_id,p.id,p.institution_id;

update public.city_directory_ie_v1 d
set linked_program_count=x.program_count,
    programme_coverage_status=case when x.program_count>0 then 'verified' else 'verification_pending' end,
    updated_at=now()
from (
  select city_id,count(*)::integer as program_count
  from public.city_programme_directory_ie_v1
  group by city_id
) x
where d.city_id=x.city_id;

do $$
begin
  if (select count(*) from public.city_directory_ie_v1) <> 4 then
    raise exception 'IE Tier A city linkage contract expected exactly 4 cities';
  end if;

  if exists (
    select 1 from public.city_directory_ie_v1
    where linked_campus_count <= 0 or linked_institution_count <= 0
  ) then
    raise exception 'Every IE Tier A city must have at least one verified official institution location';
  end if;

  if (select count(*) from public.city_institution_directory_ie_v1) <> 9 then
    raise exception 'IE Phase 3 initial verified institution set expected exactly 9 city-campus rows';
  end if;

  if exists (
    select 1 from public.city_institution_directory_ie_v1
    where institution_slug is null
       or website_url is null
       or provider_authority <> 'Higher Education Authority'
       or provider_source_url is null
       or location_source_url is null
       or location_quality <> 'verified_official'
  ) then
    raise exception 'IE city institution linkage requires HEA authority, canonical slug, website and official location evidence';
  end if;

  if exists (select 1 from public.city_programme_directory_ie_v1) then
    raise exception 'IE Phase 3 programme directory must remain empty until explicit programme-to-campus verification exists';
  end if;
end $$;
