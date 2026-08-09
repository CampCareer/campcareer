-- Singapore Autonomous University Explorer / Detail publication read models.
--
-- Institution identity and official primary locations publish independently of
-- the separate Singapore programme collection pipeline. Zero canonical
-- programmes therefore means CampCareer has not populated that catalogue yet.

create or replace view public.institution_explorer_sg_v1
with (security_invoker = true) as
select
  i.id as institution_id,
  i.country_code,
  i.slug,
  i.canonical_name,
  i.institution_kind,
  i.ownership_type,
  i.website_url,
  coalesce(programmes.program_count, 0)::integer as program_count,
  coalesce(locations.location_count, 0)::integer as campus_count,
  coalesce(locations.city_count, 0)::integer as city_count,
  coalesce(locations.city_names, array[]::text[]) as city_names
from catalog.institutions i
left join lateral (
  select count(*)::integer as program_count
  from catalog.programmes p
  where p.institution_id = i.id
    and p.status = 'active'
) programmes on true
left join lateral (
  select
    count(*)::integer as location_count,
    count(distinct l.city_name)::integer as city_count,
    coalesce(array_agg(distinct l.city_name order by l.city_name)
      filter (where l.city_name is not null), array[]::text[]) as city_names
  from public.institution_location_sg_v1 l
  where l.institution_id = i.id
) locations on true
where i.country_code = 'SG'
  and i.status <> 'inactive'
  and i.slug is not null;

revoke all on public.institution_explorer_sg_v1 from public, anon, authenticated;
grant select on public.institution_explorer_sg_v1 to service_role;

create or replace view public.institution_detail_sg_v1
with (security_invoker = true) as
select
  i.id as institution_id,
  i.country_code,
  i.slug,
  i.canonical_name,
  i.institution_kind,
  i.ownership_type,
  i.website_url,
  i.status,
  coalesce(programmes.program_count, 0)::integer as program_count,
  coalesce(locations.location_count, 0)::integer as campus_count,
  coalesce(locations.city_count, 0)::integer as city_count,
  coalesce(locations.city_names, array[]::text[]) as city_names,
  null::text as cricos_provider_code,
  null::text as cricos_source_url,
  coalesce(locations.campus_locations, '[]'::jsonb) as campus_locations,
  '[]'::jsonb as study_areas,
  '[]'::jsonb as programme_types,
  '[]'::jsonb as programme_preview
from catalog.institutions i
left join lateral (
  select count(*)::integer as program_count
  from catalog.programmes p
  where p.institution_id = i.id
    and p.status = 'active'
) programmes on true
left join lateral (
  select
    count(*)::integer as location_count,
    count(distinct l.city_name)::integer as city_count,
    coalesce(array_agg(distinct l.city_name order by l.city_name)
      filter (where l.city_name is not null), array[]::text[]) as city_names,
    coalesce(
      jsonb_agg(
        jsonb_build_object(
          'id', l.campus_id,
          'name', l.name,
          'city', l.city_name,
          'citySlug', l.city_slug,
          'reportedCity', l.reported_city,
          'region', l.region,
          'address', l.address_line,
          'postalCode', l.postal_code,
          'officialUrl', l.official_url
        ) order by l.campus_id
      ),
      '[]'::jsonb
    ) as campus_locations
  from public.institution_location_sg_v1 l
  where l.institution_id = i.id
) locations on true
where i.country_code = 'SG'
  and i.status <> 'inactive'
  and i.slug is not null;

revoke all on public.institution_detail_sg_v1 from public, anon, authenticated;
grant select on public.institution_detail_sg_v1 to service_role;

do $$
declare
  explorer_count integer;
  detail_count integer;
  detail_without_location integer;
  nonzero_program_count integer;
begin
  select count(*) into explorer_count from public.institution_explorer_sg_v1;
  select count(*) into detail_count from public.institution_detail_sg_v1;

  if explorer_count <> 6 or detail_count <> 6 then
    raise exception 'Expected SG Explorer/Detail counts 6/6, found %/%', explorer_count, detail_count;
  end if;

  select count(*) into detail_without_location
  from public.institution_detail_sg_v1
  where campus_count < 1 or jsonb_array_length(campus_locations) < 1;

  if detail_without_location > 0 then
    raise exception 'Found % SG detail rows without official location', detail_without_location;
  end if;

  select count(*) into nonzero_program_count
  from public.institution_detail_sg_v1
  where program_count <> 0 or jsonb_array_length(programme_preview) <> 0;

  if nonzero_program_count > 0 then
    raise exception 'SG program catalogue expected pending; found % non-zero rows', nonzero_program_count;
  end if;
end $$;
