-- Republish the Sydney city snapshot from verified CRICOS locations rather than representative legacy campuses.

with sydney as (
  select id from core.geographies
  where country_code='AU' and geography_type='city' and slug='sydney'
    and canonical_geography_id is null and status='active'
  limit 1
)
delete from public.city_institution_directory_au_v1 d
using sydney s
where d.city_id=s.id;

insert into public.city_institution_directory_au_v1 (
  city_id,campus_id,institution_id,institution_name,institution_type,website_url,campus_name,locality,region,legacy_provider_id
)
select
  c.geography_id,c.id,i.id,i.canonical_name,i.institution_type,i.website_url,c.name,c.locality,c.region,legacy.identifier_value
from catalog.campuses c
join catalog.institutions i on i.id=c.institution_id
left join catalog.institution_identifiers legacy
  on legacy.institution_id=i.id and legacy.identifier_system='AU_PROVIDER_ID'
where c.country_code='AU'
  and c.geography_id=(select id from core.geographies where country_code='AU' and geography_type='city' and slug='sydney' and canonical_geography_id is null and status='active' limit 1)
  and c.metadata->>'source_system'='AU_CRICOS_LOCATIONS';

update public.city_directory_au_v1 d
set linked_campus_count=x.campus_count,
    linked_institution_count=x.institution_count,
    updated_at=now()
from (
  select c.geography_id as city_id,count(*)::int as campus_count,count(distinct c.institution_id)::int as institution_count
  from catalog.campuses c
  where c.country_code='AU'
    and c.geography_id=(select id from core.geographies where country_code='AU' and geography_type='city' and slug='sydney' and canonical_geography_id is null and status='active' limit 1)
    and c.metadata->>'source_system'='AU_CRICOS_LOCATIONS'
  group by c.geography_id
) x
where d.city_id=x.city_id;
