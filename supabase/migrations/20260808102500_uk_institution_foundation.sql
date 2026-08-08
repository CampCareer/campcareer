-- UK Institutions foundation for the existing CampCareer programme-linked cohort.
--
-- Provider identity reference: HESA current providers / UKPRN provider tools.
-- https://www.hesa.ac.uk/collection/provider-tools/all_hesa_providers
-- UK-wide course/provider publication context: Discover Uni, operated by the
-- four UK higher-education funding and regulatory bodies.
-- https://discoveruni.gov.uk/information-providers/
--
-- The existing UK_PROVIDER_ID values are legacy CampCareer provider slugs, not
-- official UKPRNs. They are used only as deterministic migration join keys and
-- are not exposed as regulatory identifiers.

with source_rows(legacy_provider_id, canonical_name, slug, website_url) as (
  values
    ('aston-university', 'Aston University', 'aston-university', 'https://www.aston.ac.uk/'),
    ('brunel-university-london', 'Brunel University of London', 'brunel-university-of-london', 'https://www.brunel.ac.uk/'),
    ('cardiff-university', 'Cardiff University', 'cardiff-university', 'https://www.cardiff.ac.uk/'),
    ('city-university-of-london', 'City St George''s, University of London', 'city-st-georges-university-of-london', 'https://www.citystgeorges.ac.uk/'),
    ('coventry-university', 'Coventry University', 'coventry-university', 'https://www.coventry.ac.uk/'),
    ('durham-university', 'Durham University', 'durham-university', 'https://www.durham.ac.uk/'),
    ('heriot-watt-university', 'Heriot-Watt University', 'heriot-watt-university', 'https://www.hw.ac.uk/'),
    ('imperial-college-london', 'Imperial College London', 'imperial-college-london', 'https://www.imperial.ac.uk/'),
    ('king-s-college-london', 'King''s College London', 'king-s-college-london', 'https://www.kcl.ac.uk/'),
    ('lancaster-university', 'Lancaster University', 'lancaster-university', 'https://www.lancaster.ac.uk/'),
    ('london-school-of-economics-and-political-science', 'London School of Economics and Political Science', 'london-school-of-economics-and-political-science', 'https://www.lse.ac.uk/'),
    ('loughborough-university', 'Loughborough University', 'loughborough-university', 'https://www.lboro.ac.uk/'),
    ('newcastle-university', 'Newcastle University', 'newcastle-university', 'https://www.ncl.ac.uk/'),
    ('nottingham-trent-university', 'Nottingham Trent University', 'nottingham-trent-university', 'https://www.ntu.ac.uk/'),
    ('queen-mary-university-of-london', 'Queen Mary University of London', 'queen-mary-university-of-london', 'https://www.qmul.ac.uk/'),
    ('queen-s-university-belfast', 'Queen''s University Belfast', 'queen-s-university-belfast', 'https://www.qub.ac.uk/'),
    ('royal-holloway-university-of-london', 'Royal Holloway, University of London', 'royal-holloway-university-of-london', 'https://www.royalholloway.ac.uk/'),
    ('swansea-university', 'Swansea University', 'swansea-university', 'https://www.swansea.ac.uk/'),
    ('ulster-university', 'Ulster University', 'ulster-university', 'https://www.ulster.ac.uk/'),
    ('university-college-london', 'University College London', 'university-college-london', 'https://www.ucl.ac.uk/'),
    ('university-of-aberdeen', 'University of Aberdeen', 'university-of-aberdeen', 'https://www.abdn.ac.uk/'),
    ('university-of-bath', 'University of Bath', 'university-of-bath', 'https://www.bath.ac.uk/'),
    ('university-of-birmingham', 'University of Birmingham', 'university-of-birmingham', 'https://www.birmingham.ac.uk/'),
    ('university-of-bradford', 'University of Bradford', 'university-of-bradford', 'https://www.bradford.ac.uk/'),
    ('university-of-bristol', 'University of Bristol', 'university-of-bristol', 'https://www.bristol.ac.uk/'),
    ('university-of-cambridge', 'University of Cambridge', 'university-of-cambridge', 'https://www.cam.ac.uk/'),
    ('university-of-east-anglia', 'University of East Anglia', 'university-of-east-anglia', 'https://www.uea.ac.uk/'),
    ('university-of-edinburgh', 'University of Edinburgh', 'university-of-edinburgh', 'https://www.ed.ac.uk/'),
    ('university-of-essex', 'University of Essex', 'university-of-essex', 'https://www.essex.ac.uk/'),
    ('university-of-exeter', 'University of Exeter', 'university-of-exeter', 'https://www.exeter.ac.uk/'),
    ('university-of-glasgow', 'University of Glasgow', 'university-of-glasgow', 'https://www.gla.ac.uk/'),
    ('university-of-hertfordshire', 'University of Hertfordshire', 'university-of-hertfordshire', 'https://www.herts.ac.uk/'),
    ('university-of-kent', 'University of Kent', 'university-of-kent', 'https://www.kent.ac.uk/'),
    ('university-of-leeds', 'University of Leeds', 'university-of-leeds', 'https://www.leeds.ac.uk/'),
    ('university-of-leicester', 'University of Leicester', 'university-of-leicester', 'https://le.ac.uk/'),
    ('university-of-liverpool', 'University of Liverpool', 'university-of-liverpool', 'https://www.liverpool.ac.uk/'),
    ('university-of-manchester', 'University of Manchester', 'university-of-manchester', 'https://www.manchester.ac.uk/'),
    ('university-of-nottingham', 'University of Nottingham', 'university-of-nottingham', 'https://www.nottingham.ac.uk/'),
    ('university-of-oxford', 'University of Oxford', 'university-of-oxford', 'https://www.ox.ac.uk/'),
    ('university-of-plymouth', 'University of Plymouth', 'university-of-plymouth', 'https://www.plymouth.ac.uk/'),
    ('university-of-reading', 'University of Reading', 'university-of-reading', 'https://www.reading.ac.uk/'),
    ('university-of-salford', 'University of Salford', 'university-of-salford', 'https://www.salford.ac.uk/'),
    ('university-of-sheffield', 'University of Sheffield', 'university-of-sheffield', 'https://www.sheffield.ac.uk/'),
    ('university-of-southampton', 'University of Southampton', 'university-of-southampton', 'https://www.southampton.ac.uk/'),
    ('university-of-st-andrews', 'University of St Andrews', 'university-of-st-andrews', 'https://www.st-andrews.ac.uk/'),
    ('university-of-strathclyde', 'University of Strathclyde', 'university-of-strathclyde', 'https://www.strath.ac.uk/'),
    ('university-of-surrey', 'University of Surrey', 'university-of-surrey', 'https://www.surrey.ac.uk/'),
    ('university-of-sussex', 'University of Sussex', 'university-of-sussex', 'https://www.sussex.ac.uk/'),
    ('university-of-warwick', 'University of Warwick', 'university-of-warwick', 'https://warwick.ac.uk/'),
    ('university-of-york', 'University of York', 'university-of-york', 'https://www.york.ac.uk/')
)
update catalog.institutions i
set
  canonical_name = s.canonical_name,
  slug = s.slug,
  website_url = s.website_url,
  institution_kind = 'university',
  -- UK universities in this cohort are independent legal entities. Do not
  -- reuse the legacy `public` value as a literal ownership claim.
  ownership_type = null,
  updated_at = now()
from source_rows s
join catalog.institution_identifiers ii
  on ii.identifier_system = 'UK_PROVIDER_ID'
 and ii.identifier_value = s.legacy_provider_id
where i.id = ii.institution_id
  and i.country_code = 'UK';

-- UK detail read model. Keep this separate from the AU/CA v1 while UK source
-- normalization is being completed; all data still comes from the same
-- canonical catalog institutions/programmes/campuses tables.
create or replace view public.institution_detail_uk_v1
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
  coalesce(ex.program_count, 0)::integer as program_count,
  coalesce(ex.campus_count, 0)::integer as campus_count,
  coalesce(ex.city_count, 0)::integer as city_count,
  coalesce(ex.city_names, array[]::text[]) as city_names,
  null::text as cricos_provider_code,
  null::text as cricos_source_url,
  coalesce(campuses.campus_locations, '[]'::jsonb) as campus_locations,
  coalesce(programmes.study_areas, '[]'::jsonb) as study_areas,
  coalesce(programmes.programme_types, '[]'::jsonb) as programme_types,
  coalesce(programmes.programme_preview, '[]'::jsonb) as programme_preview
from catalog.institutions i
left join public.institution_explorer_v1 ex
  on ex.institution_id = i.id
left join lateral (
  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', locations.id,
        'name', locations.name,
        'city', locations.city_name,
        'citySlug', locations.city_slug,
        'reportedCity', locations.reported_city,
        'region', locations.region,
        'address', locations.address_line,
        'postalCode', locations.postal_code,
        'officialUrl', locations.official_url
      )
      order by
        coalesce(locations.city_name, locations.reported_city, ''),
        coalesce(locations.name, ''),
        locations.id
    ),
    '[]'::jsonb
  ) as campus_locations
  from (
    select
      c.id,
      c.name,
      g.name as city_name,
      g.slug as city_slug,
      coalesce(nullif(btrim(c.city), ''), nullif(btrim(c.locality), '')) as reported_city,
      c.region,
      c.address_line,
      c.postal_code,
      c.official_url
    from catalog.campuses c
    left join core.geographies g
      on g.id = coalesce(c.locality_geography_id, c.geography_id)
     and g.geography_type = 'city'
     and g.status = 'active'
    where c.institution_id = i.id
      and c.status <> 'inactive'
    order by
      coalesce(g.name, c.city, c.locality, ''),
      coalesce(c.name, ''),
      c.id
    limit 24
  ) locations
) campuses on true
left join lateral (
  select
    (
      select coalesce(
        jsonb_agg(
          jsonb_build_object('name', areas.field_name, 'count', areas.program_count)
          order by areas.program_count desc, areas.field_name
        ),
        '[]'::jsonb
      )
      from (
        select p.field_name, count(*)::integer as program_count
        from catalog.programmes p
        where p.institution_id = i.id
          and p.status = 'active'
          and nullif(btrim(p.field_name), '') is not null
        group by p.field_name
        order by program_count desc, p.field_name
        limit 8
      ) areas
    ) as study_areas,
    (
      select coalesce(
        jsonb_agg(
          jsonb_build_object('name', types.programme_type, 'count', types.program_count)
          order by types.program_count desc, types.programme_type
        ),
        '[]'::jsonb
      )
      from (
        select p.programme_type, count(*)::integer as program_count
        from catalog.programmes p
        where p.institution_id = i.id
          and p.status = 'active'
          and nullif(btrim(p.programme_type), '') is not null
        group by p.programme_type
        order by program_count desc, p.programme_type
        limit 8
      ) types
    ) as programme_types,
    (
      select coalesce(
        jsonb_agg(
          jsonb_build_object(
            'id', preview.id,
            'legacyProgramId', null,
            'title', preview.canonical_title,
            'programmeType', preview.programme_type,
            'fieldName', preview.field_name
          )
          order by preview.canonical_title, preview.id
        ),
        '[]'::jsonb
      )
      from (
        select p.id, p.canonical_title, p.programme_type, p.field_name
        from catalog.programmes p
        where p.institution_id = i.id
          and p.status = 'active'
          and nullif(btrim(p.canonical_title), '') is not null
        order by p.canonical_title, p.id
        limit 12
      ) preview
    ) as programme_preview
) programmes on true
where i.status <> 'inactive'
  and i.slug is not null
  and i.country_code = 'UK';

comment on view public.institution_detail_uk_v1 is
  'Service-role UK institution detail read model backed by canonical catalog institutions, programmes and campuses. No UK programme URL is invented before a UK programme-detail surface exists.';

revoke all on public.institution_detail_uk_v1 from public, anon, authenticated;
grant select on public.institution_detail_uk_v1 to service_role;

-- Publication gate: all existing programme-linked UK providers must normalize
-- exactly once and remain connected to at least one active canonical programme.
do $$
declare
  uk_provider_count integer;
  uk_missing_website_count integer;
  uk_bad_kind_count integer;
  uk_duplicate_slug_count integer;
  uk_without_program_count integer;
begin
  select count(*)
  into uk_provider_count
  from catalog.institution_identifiers ii
  join catalog.institutions i on i.id = ii.institution_id
  where ii.identifier_system = 'UK_PROVIDER_ID'
    and i.country_code = 'UK';

  if uk_provider_count <> 50 then
    raise exception 'Expected 50 existing UK provider identities, found %', uk_provider_count;
  end if;

  select count(*)
  into uk_missing_website_count
  from catalog.institution_identifiers ii
  join catalog.institutions i on i.id = ii.institution_id
  where ii.identifier_system = 'UK_PROVIDER_ID'
    and i.country_code = 'UK'
    and (i.website_url is null or i.website_url !~ '^https://');

  if uk_missing_website_count > 0 then
    raise exception 'UK institution normalization left % providers without an HTTPS official website', uk_missing_website_count;
  end if;

  select count(*)
  into uk_bad_kind_count
  from catalog.institution_identifiers ii
  join catalog.institutions i on i.id = ii.institution_id
  where ii.identifier_system = 'UK_PROVIDER_ID'
    and i.country_code = 'UK'
    and i.institution_kind is distinct from 'university';

  if uk_bad_kind_count > 0 then
    raise exception 'UK institution normalization left % providers without university kind', uk_bad_kind_count;
  end if;

  select count(*)
  into uk_duplicate_slug_count
  from (
    select i.slug
    from catalog.institutions i
    where i.country_code = 'UK'
      and i.status <> 'inactive'
    group by i.slug
    having count(*) > 1
  ) duplicates;

  if uk_duplicate_slug_count > 0 then
    raise exception 'UK institution normalization produced % duplicate slugs', uk_duplicate_slug_count;
  end if;

  select count(*)
  into uk_without_program_count
  from catalog.institution_identifiers ii
  join catalog.institutions i on i.id = ii.institution_id
  where ii.identifier_system = 'UK_PROVIDER_ID'
    and i.country_code = 'UK'
    and not exists (
      select 1
      from catalog.programmes p
      where p.institution_id = i.id
        and p.status = 'active'
    );

  if uk_without_program_count > 0 then
    raise exception 'UK publication cohort contains % institutions without active programmes', uk_without_program_count;
  end if;
end $$;
