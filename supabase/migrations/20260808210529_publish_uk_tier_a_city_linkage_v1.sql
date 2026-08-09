-- Complete UK Tier A city linkage using verified official institution locations.
-- Preserve legacy offering anchors for provenance, but do not publish them as city membership.
-- Programme membership requires a verified offering explicitly assigned to a verified official campus/location.

with locations(
  legacy_provider_id,
  location_key,
  location_name,
  city,
  region,
  address_line,
  postal_code,
  official_url,
  record_scope
) as (
  values
    ('queen-s-university-belfast','main-belfast','Main Belfast location','Belfast','Northern Ireland','University Road, Belfast','BT7 1NN','https://www.qub.ac.uk/','verified_institution_location'),
    ('aston-university','birmingham-campus','Birmingham Campus','Birmingham','West Midlands','Aston Triangle, Birmingham','B4 7ET','https://www.aston.ac.uk/about/visit','verified_campus_location'),
    ('university-of-birmingham','edgbaston','Edgbaston Campus','Birmingham','West Midlands','Edgbaston, Birmingham','B15 2TT','https://www.birmingham.ac.uk/contact/directions','verified_campus_location'),
    ('university-of-bristol','clifton','Clifton Campus','Bristol','South West',null,null,'https://www.bristol.ac.uk/maps/','verified_campus_location'),
    ('university-of-cambridge','old-schools','Cambridge city university location','Cambridge','South East','The Old Schools, Trinity Lane, Cambridge','CB2 1TN','https://www.cam.ac.uk/about-the-university/contact-the-university','verified_institution_location'),
    ('university-of-edinburgh','central-area','Central Campus - George Square','Edinburgh','Scotland','George Square, Edinburgh',null,'https://www.ed.ac.uk/visit/tours/student-led','verified_campus_location'),
    ('university-of-glasgow','gilmorehill','Gilmorehill Campus','Glasgow','Scotland',null,null,'https://www.gla.ac.uk/explore/campuses/gilmorehill/','verified_campus_location'),
    ('university-of-strathclyde','glasgow-city-centre','Glasgow City Centre Campus','Glasgow','Scotland',null,null,'https://www.strath.ac.uk/contactus/','verified_campus_location'),
    ('london-school-of-economics-and-political-science','lse-campus','LSE Campus','London','London','Houghton Street, London','WC2A 2AE','https://www.lse.ac.uk/lse-information/campus-map','verified_campus_location'),
    ('university-of-manchester','oxford-road','Oxford Road Campus','Manchester','North West','Oxford Road, Manchester','M13 9PL','https://www.manchester.ac.uk/about/our-campus/index.htm','verified_campus_location'),
    ('university-of-oxford','wellington-square','Oxford city university location','Oxford','South East','University Offices, Wellington Square, Oxford','OX1 2JD','https://www.ox.ac.uk/about/contact-us','verified_institution_location')
),
resolved as (
  select l.*,ii.institution_id,g.id as geography_id
  from locations l
  join catalog.institution_identifiers ii
    on ii.identifier_system='UK_PROVIDER_ID' and ii.identifier_value=l.legacy_provider_id
  join catalog.institutions i
    on i.id=ii.institution_id and i.country_code='UK' and i.status='active'
  join core.geographies g
    on g.country_code='UK'
   and g.geography_type='city'
   and g.canonical_geography_id is null
   and g.status='active'
   and lower(g.name)=lower(l.city)
)
insert into catalog.campuses(
  id,institution_id,name,city,locality,region,country_code,
  geography_id,locality_geography_id,address_line,postal_code,
  official_url,source_url,source_checked_at,metadata,status
)
select
  md5('uk_city_phase3_location:' || r.legacy_provider_id || ':' || r.location_key)::uuid,
  r.institution_id,r.location_name,r.city,r.city,r.region,'UK',
  r.geography_id,r.geography_id,r.address_line,r.postal_code,
  r.official_url,r.official_url,now(),
  jsonb_build_object(
    'record_scope',r.record_scope,
    'location_quality','verified_official',
    'source_tier','institution_official',
    'location_key',r.location_key,
    'legacy_provider_id',r.legacy_provider_id,
    'normalization_batch','uk_city_linkage_v1',
    'programme_assignment_verified',false
  ),
  'active'
from resolved r
on conflict (id) do update set
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

create table if not exists public.city_directory_uk_v1 (
  city_id uuid primary key,
  country_code text not null,
  slug text not null unique,
  name text not null,
  region text not null,
  education_nation text not null,
  scope_kind text not null,
  study_destination_scope text not null,
  linked_campus_count integer not null default 0,
  linked_institution_count integer not null default 0,
  linked_program_count integer not null default 0,
  programme_coverage_status text not null default 'verification_pending',
  updated_at timestamptz not null default now()
);

alter table public.city_directory_uk_v1 enable row level security;
revoke all on public.city_directory_uk_v1 from public, anon, authenticated;
grant select on public.city_directory_uk_v1 to service_role;

create table if not exists public.city_institution_directory_uk_v1 (
  city_id uuid not null,
  campus_id uuid not null,
  institution_id uuid not null,
  institution_name text not null,
  institution_slug text not null,
  ukprn text not null,
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
  primary key (city_id,campus_id)
);

create index if not exists city_institution_directory_uk_v1_city_idx
  on public.city_institution_directory_uk_v1(city_id,institution_name);
create index if not exists city_institution_directory_uk_v1_institution_idx
  on public.city_institution_directory_uk_v1(institution_id,city_id);

alter table public.city_institution_directory_uk_v1 enable row level security;
revoke all on public.city_institution_directory_uk_v1 from public, anon, authenticated;
grant select on public.city_institution_directory_uk_v1 to service_role;

create table if not exists public.city_programme_directory_uk_v1 (
  city_id uuid not null,
  programme_id uuid not null,
  institution_id uuid not null,
  offering_count integer not null default 0,
  linkage_basis text not null default 'verified_programme_offerings.campus_id',
  primary key(city_id,programme_id)
);

create index if not exists city_programme_directory_uk_v1_programme_idx
  on public.city_programme_directory_uk_v1(programme_id,city_id);

alter table public.city_programme_directory_uk_v1 enable row level security;
revoke all on public.city_programme_directory_uk_v1 from public, anon, authenticated;
grant select on public.city_programme_directory_uk_v1 to service_role;

truncate table public.city_programme_directory_uk_v1;
truncate table public.city_institution_directory_uk_v1;
truncate table public.city_directory_uk_v1;

with tier as (
  select g.id,g.country_code,g.slug,g.name,g.region_code,g.scope_kind,g.metadata
  from core.geographies g
  where g.country_code='UK'
    and g.geography_type='city'
    and g.canonical_geography_id is null
    and g.status='active'
    and g.metadata->>'publication_tier'='A'
),
eligible_locations as (
  select t.id as city_id,c.id as campus_id,c.institution_id
  from tier t
  join catalog.campuses c
    on c.country_code='UK'
   and c.status='active'
   and c.metadata->>'location_quality'='verified_official'
   and c.source_url is not null
   and ((t.slug='london' and c.region='London') or (t.slug<>'london' and c.geography_id=t.id))
  join catalog.institutions i
    on i.id=c.institution_id
   and i.country_code='UK'
   and i.status='active'
   and i.slug is not null
   and i.website_url is not null
  where exists (
    select 1 from catalog.institution_identifiers ii
    where ii.institution_id=i.id
      and ii.identifier_system='UK_UKPRN'
      and ii.identifier_value ~ '^[0-9]{8}$'
  )
)
insert into public.city_directory_uk_v1(
  city_id,country_code,slug,name,region,education_nation,scope_kind,
  study_destination_scope,linked_campus_count,linked_institution_count,
  linked_program_count,programme_coverage_status,updated_at
)
select
  t.id,t.country_code,t.slug,t.name,t.region_code,t.metadata->>'education_nation',
  t.scope_kind,t.metadata->>'study_destination_scope',
  count(distinct e.campus_id)::integer,count(distinct e.institution_id)::integer,
  0,'verification_pending',now()
from tier t
left join eligible_locations e on e.city_id=t.id
group by t.id,t.country_code,t.slug,t.name,t.region_code,t.scope_kind,t.metadata;

with tier as (
  select id,slug
  from core.geographies
  where country_code='UK'
    and geography_type='city'
    and canonical_geography_id is null
    and status='active'
    and metadata->>'publication_tier'='A'
),
eligible_locations as (
  select
    t.id as city_id,c.id as campus_id,c.institution_id,c.name as campus_name,
    coalesce(c.city,c.locality) as campus_city,c.region,c.address_line,c.postal_code,
    c.source_url,c.metadata->>'location_quality' as location_quality,
    c.metadata->>'record_scope' as record_scope
  from tier t
  join catalog.campuses c
    on c.country_code='UK'
   and c.status='active'
   and c.metadata->>'location_quality'='verified_official'
   and c.source_url is not null
   and ((t.slug='london' and c.region='London') or (t.slug<>'london' and c.geography_id=t.id))
)
insert into public.city_institution_directory_uk_v1(
  city_id,campus_id,institution_id,institution_name,institution_slug,ukprn,
  website_url,campus_name,campus_city,region,address_line,postal_code,
  location_source_url,location_quality,record_scope,linkage_basis
)
select
  e.city_id,e.campus_id,i.id,i.canonical_name,i.slug,ukprn.identifier_value,
  i.website_url,e.campus_name,e.campus_city,e.region,e.address_line,e.postal_code,
  e.source_url,e.location_quality,e.record_scope,
  case when t.slug='london' and e.campus_city<>'London'
    then 'verified_official_location_within_greater_london'
    else 'verified_official_location'
  end
from eligible_locations e
join tier t on t.id=e.city_id
join catalog.institutions i
  on i.id=e.institution_id
 and i.country_code='UK'
 and i.status='active'
 and i.slug is not null
 and i.website_url is not null
join lateral (
  select ii.identifier_value
  from catalog.institution_identifiers ii
  where ii.institution_id=i.id
    and ii.identifier_system='UK_UKPRN'
    and ii.identifier_value ~ '^[0-9]{8}$'
  order by ii.created_at asc
  limit 1
) ukprn on true;

insert into public.city_programme_directory_uk_v1(
  city_id,programme_id,institution_id,offering_count,linkage_basis
)
select
  d.city_id,p.id,p.institution_id,count(distinct po.id)::integer,
  'verified_programme_offerings.campus_id'
from public.city_institution_directory_uk_v1 d
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
  and po.enrolment_status not in ('closed','suspended')
group by d.city_id,p.id,p.institution_id;

update public.city_directory_uk_v1 d
set linked_program_count=x.program_count,
    programme_coverage_status=case when x.program_count>0 then 'verified' else 'verification_pending' end,
    updated_at=now()
from (
  select city_id,count(*)::integer program_count
  from public.city_programme_directory_uk_v1
  group by city_id
) x
where d.city_id=x.city_id;

do $$
begin
  if (select count(*) from public.city_directory_uk_v1) <> 10 then
    raise exception 'UK Tier A city linkage contract expected exactly 10 cities';
  end if;

  if exists (
    select 1 from public.city_directory_uk_v1
    where linked_campus_count <= 0 or linked_institution_count <= 0
  ) then
    raise exception 'Every UK Tier A city must have at least one verified official institution location';
  end if;

  if exists (
    select 1 from public.city_institution_directory_uk_v1
    where ukprn !~ '^[0-9]{8}$'
      or institution_slug is null
      or website_url is null
      or location_source_url is null
      or location_quality <> 'verified_official'
  ) then
    raise exception 'UK city institution linkage requires UKPRN, canonical slug, website and verified official location evidence';
  end if;

  if exists (
    select 1
    from public.city_institution_directory_uk_v1 d
    join public.city_directory_uk_v1 c on c.city_id=d.city_id
    where c.slug='manchester' and d.institution_slug='university-of-salford'
  ) then
    raise exception 'Manchester city scope must not absorb University of Salford';
  end if;

  if exists (
    select 1
    from public.city_programme_directory_uk_v1 d
    join catalog.programme_offerings po on po.programme_id=d.programme_id
    join catalog.campuses c on c.id=po.campus_id
    where po.verification_status <> 'verified'
       or po.source_url is null
       or c.metadata->>'programme_assignment_verified' <> 'true'
  ) then
    raise exception 'UK city programme linkage must be explicit and verified';
  end if;
end $$;
