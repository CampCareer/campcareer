-- Publish the U.S. Tier A city institution/programme linkage read model.
-- City membership is accepted only from canonical catalog.campuses.geography_id.
-- Programme membership is accepted only from canonical programme_offerings.campus_id.
-- Do not infer programme delivery from institution presence alone.

create table if not exists public.city_directory_us_v1 (
  city_id uuid primary key,
  country_code text not null,
  slug text not null unique,
  name text not null,
  region text not null,
  scope_kind text,
  latitude numeric,
  longitude numeric,
  linked_campus_count integer not null default 0,
  linked_institution_count integer not null default 0,
  linked_program_count integer not null default 0,
  source_system text,
  source_record_key text,
  updated_at timestamptz not null default now()
);

alter table public.city_directory_us_v1 enable row level security;
revoke all on public.city_directory_us_v1 from anon, authenticated;
grant select on public.city_directory_us_v1 to service_role;

create table if not exists public.city_institution_directory_us_v1 (
  city_id uuid not null,
  campus_id uuid not null,
  institution_id uuid not null,
  institution_name text not null,
  institution_type text,
  website_url text,
  institution_slug text,
  us_unit_id text,
  campus_name text not null,
  locality text,
  region text not null,
  linkage_basis text not null default 'catalog.campuses.geography_id',
  primary key (city_id, campus_id)
);

create index if not exists city_institution_directory_us_v1_city_idx
  on public.city_institution_directory_us_v1 (city_id, institution_name);

alter table public.city_institution_directory_us_v1 enable row level security;
revoke all on public.city_institution_directory_us_v1 from anon, authenticated;
grant select on public.city_institution_directory_us_v1 to service_role;

create table if not exists public.city_programme_directory_us_v1 (
  city_id uuid not null,
  programme_id uuid not null,
  institution_id uuid not null,
  campus_count integer not null default 0,
  linkage_basis text not null default 'catalog.programme_offerings.campus_id',
  primary key (city_id, programme_id)
);

create index if not exists city_programme_directory_us_v1_programme_idx
  on public.city_programme_directory_us_v1 (programme_id, city_id);

alter table public.city_programme_directory_us_v1 enable row level security;
revoke all on public.city_programme_directory_us_v1 from anon, authenticated;
grant select on public.city_programme_directory_us_v1 to service_role;

truncate table public.city_programme_directory_us_v1;
truncate table public.city_institution_directory_us_v1;
truncate table public.city_directory_us_v1;

insert into public.city_directory_us_v1 (
  city_id, country_code, slug, name, region, scope_kind, latitude, longitude,
  linked_campus_count, linked_institution_count, linked_program_count,
  source_system, source_record_key, updated_at
)
select
  g.id,
  g.country_code,
  g.slug,
  g.name,
  g.region_code,
  g.scope_kind,
  g.latitude,
  g.longitude,
  count(distinct c.id) filter (
    where c.status='active' and i.status='active'
  )::integer,
  count(distinct c.institution_id) filter (
    where c.status='active' and i.status='active'
  )::integer,
  count(distinct po.programme_id) filter (
    where c.status='active'
      and i.status='active'
      and p.status='active'
      and po.enrolment_status not in ('closed','suspended')
  )::integer,
  'core.geographies',
  g.code,
  now()
from core.geographies g
left join catalog.campuses c
  on c.geography_id=g.id
 and c.country_code='US'
left join catalog.institutions i
  on i.id=c.institution_id
 and i.country_code='US'
left join catalog.programme_offerings po on po.campus_id=c.id
left join catalog.programmes p on p.id=po.programme_id
where g.country_code='US'
  and g.geography_type='city'
  and g.canonical_geography_id is null
  and g.status='active'
  and g.slug is not null
  and coalesce(g.metadata->>'publication_tier','')='A'
group by g.id, g.country_code, g.slug, g.name, g.region_code, g.scope_kind,
         g.latitude, g.longitude, g.code;

insert into public.city_institution_directory_us_v1 (
  city_id, campus_id, institution_id, institution_name, institution_type,
  website_url, institution_slug, us_unit_id, campus_name, locality, region, linkage_basis
)
select
  c.geography_id,
  c.id,
  i.id,
  i.canonical_name,
  coalesce(i.institution_kind, i.institution_type),
  i.website_url,
  i.slug,
  unit.identifier_value,
  c.name,
  coalesce(c.locality, c.city),
  c.region,
  'catalog.campuses.geography_id'
from catalog.campuses c
join catalog.institutions i on i.id=c.institution_id
join core.geographies g on g.id=c.geography_id
left join lateral (
  select ii.identifier_value
  from catalog.institution_identifiers ii
  where ii.institution_id=i.id
    and ii.identifier_system='US_UNIT_ID'
  order by ii.created_at asc
  limit 1
) unit on true
where c.country_code='US'
  and c.status='active'
  and i.country_code='US'
  and i.status='active'
  and g.country_code='US'
  and g.geography_type='city'
  and g.canonical_geography_id is null
  and g.status='active'
  and coalesce(g.metadata->>'publication_tier','')='A';

insert into public.city_programme_directory_us_v1 (
  city_id, programme_id, institution_id, campus_count, linkage_basis
)
select
  c.geography_id,
  po.programme_id,
  p.institution_id,
  count(distinct c.id)::integer,
  'catalog.programme_offerings.campus_id'
from catalog.campuses c
join core.geographies g on g.id=c.geography_id
join catalog.programme_offerings po on po.campus_id=c.id
join catalog.programmes p on p.id=po.programme_id
join catalog.institutions i on i.id=p.institution_id
where c.country_code='US'
  and c.status='active'
  and g.country_code='US'
  and g.geography_type='city'
  and g.canonical_geography_id is null
  and g.status='active'
  and coalesce(g.metadata->>'publication_tier','')='A'
  and i.country_code='US'
  and i.status='active'
  and p.status='active'
  and po.enrolment_status not in ('closed','suspended')
group by c.geography_id, po.programme_id, p.institution_id;

update public.city_directory_us_v1 d
set linked_program_count=counts.program_count,
    updated_at=now()
from (
  select city_id,count(*)::integer as program_count
  from public.city_programme_directory_us_v1
  group by city_id
) counts
where d.city_id=counts.city_id;

update public.city_directory_us_v1 d
set linked_program_count=0,
    updated_at=now()
where not exists (
  select 1 from public.city_programme_directory_us_v1 p where p.city_id=d.city_id
);

do $$
begin
  if (select count(*) from public.city_directory_us_v1) <> 8 then
    raise exception 'US Tier A city linkage contract expected 8 cities';
  end if;

  if exists (
    select 1
    from public.city_directory_us_v1 d
    where d.linked_campus_count <> (
      select count(*) from public.city_institution_directory_us_v1 x where x.city_id=d.city_id
    )
  ) then
    raise exception 'US Tier A city campus linkage counts are inconsistent';
  end if;

  if exists (
    select 1
    from public.city_institution_directory_us_v1
    where us_unit_id is null or institution_slug is null
  ) then
    raise exception 'US Tier A institution linkage requires US_UNIT_ID and canonical institution slug';
  end if;
end $$;
