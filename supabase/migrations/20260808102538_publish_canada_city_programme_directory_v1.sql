-- Canonical Canada city-programme read index for city pages and City Compare.

create table if not exists public.city_programme_directory_ca_v1 (
  city_id uuid not null,
  programme_id uuid not null,
  institution_id uuid not null,
  campus_count integer not null default 0,
  primary key (city_id, programme_id)
);

create index if not exists city_programme_directory_ca_v1_programme_idx
  on public.city_programme_directory_ca_v1 (programme_id, city_id);

alter table public.city_programme_directory_ca_v1 enable row level security;
revoke all on public.city_programme_directory_ca_v1 from anon, authenticated;
grant select on public.city_programme_directory_ca_v1 to service_role;

truncate table public.city_programme_directory_ca_v1;

insert into public.city_programme_directory_ca_v1 (
  city_id, programme_id, institution_id, campus_count
)
select
  c.geography_id,
  po.programme_id,
  p.institution_id,
  count(distinct c.id)::integer
from catalog.campuses c
join core.geographies g on g.id=c.geography_id
join catalog.programme_offerings po on po.campus_id=c.id
join catalog.programmes p on p.id=po.programme_id
join catalog.institutions i on i.id=p.institution_id
where c.country_code='CA'
  and c.status='active'
  and g.country_code='CA'
  and g.geography_type='city'
  and g.canonical_geography_id is null
  and g.status='active'
  and i.country_code='CA'
  and coalesce(po.enrolment_status,'active') <> 'inactive'
group by c.geography_id,po.programme_id,p.institution_id;

update public.city_directory_ca_v1 d
set linked_program_count = counts.program_count,
    updated_at = now()
from (
  select city_id,count(*)::integer program_count
  from public.city_programme_directory_ca_v1
  group by city_id
) counts
where d.city_id=counts.city_id;

update public.city_directory_ca_v1 d
set linked_program_count=0,
    updated_at=now()
where not exists (
  select 1 from public.city_programme_directory_ca_v1 p where p.city_id=d.city_id
);
