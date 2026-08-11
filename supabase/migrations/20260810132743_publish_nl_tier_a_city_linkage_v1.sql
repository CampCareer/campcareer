-- Netherlands city Phase 3: verified institution/location linkage for the five Tier A cities.
-- Existing DUO registered-address rows and legacy listed-campus rows remain available as source/history records,
-- but publication read models use only the official-location batch introduced here.
-- Programme delivery is not inferred. City programme rows appear only when a verified programme offering has an explicit campus_id.

with x(provider_slug, location_key, campus_name, city_slug, city_name, region_code, address_line, postal_code, source_url, record_scope, location_quality) as (
  values
    ('university-of-amsterdam','roeterseiland-eb','Roeterseiland Campus — Economics and Business','amsterdam','Amsterdam','NH','Roetersstraat 11','1018 WB','https://www.uva.nl/en/about-the-uva/organisation/faculties/faculty-of-economics-and-business/contact-and-location/contact-and-location.html','verified_teaching_campus','verified_official'),
    ('vrije-universiteit-amsterdam','vu-main','VU Campus — Main Building','amsterdam','Amsterdam','NH','De Boelelaan 1105','1081 HV','https://vu.nl/en/about-vu/more-about/contact','verified_teaching_campus','verified_official'),
    ('maastricht-university','fse-paul-henri-spaaklaan','Faculty of Science and Engineering — Paul-Henri Spaaklaan','maastricht','Maastricht','LI','Paul-Henri Spaaklaan 1','6229 EN','https://www.maastrichtuniversity.nl/education/bachelor/programmes/data-science-and-artificial-intelligence/contact','verified_teaching_location','verified_official_programme_location'),
    ('erasmus-university-rotterdam','woudestein','Campus Woudestein','rotterdam','Rotterdam','ZH','Burgemeester Oudlaan 50','3062 PA','https://www.eur.nl/en/campus/locations/campus-woudestein','verified_teaching_campus','verified_official'),
    ('university-of-groningen','zernike-bernoulliborg','Zernike Campus — Bernoulliborg','groningen','Groningen','GR','Nijenborgh 9','9747 AG','https://www.rug.nl/fse/education/sse/contact-and-staff?lang=en','verified_teaching_campus','verified_official'),
    ('eindhoven-university-of-technology','tue-campus','TU/e Campus','eindhoven','Eindhoven','NB','De Zaale','5612 AJ','https://research.tue.nl/en/organisations/eindhoven-university-of-technology/','verified_university_campus','verified_official_university_address')
), resolved as (
  select x.*, i.id as institution_id, g.id as geography_id, ii.identifier_value as brin_code, ii.source_url as brin_source_url
  from x
  join catalog.institutions i on i.country_code='NL' and i.status='active' and i.slug=x.provider_slug
  join catalog.institution_identifiers ii on ii.institution_id=i.id and ii.identifier_system='NL_BRIN'
  join core.geographies g on g.country_code='NL' and g.status='active' and g.slug=x.city_slug and g.metadata->>'publication_tier'='A'
)
insert into catalog.campuses(
  id,institution_id,name,city,locality,region,country_code,geography_id,locality_geography_id,
  address_line,postal_code,official_url,source_url,source_checked_at,metadata,status
)
select
  md5('nl_city_phase3:'||provider_slug||':'||location_key)::uuid,
  institution_id,campus_name,city_name,city_name,region_code,'NL',geography_id,geography_id,
  address_line,postal_code,source_url,source_url,now(),
  jsonb_build_object(
    'record_scope',record_scope,
    'location_quality',location_quality,
    'source_tier','institution_official',
    'location_key',location_key,
    'brin_code',brin_code,
    'brin_source_url',brin_source_url,
    'normalization_batch','nl_city_linkage_v1',
    'programme_assignment_verified',false,
    'coordinate_precision','not_asserted',
    'coverage_note','Verified official Tier A institution location; does not imply exhaustive Dutch HBO/provider coverage or programme delivery.'
  ),
  'active'
from resolved
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
  status='active',
  updated_at=now();

create or replace view public.city_institution_directory_nl_v1 with (security_invoker=true) as
select
  g.id as city_id,
  g.slug as city_slug,
  g.name as city_name,
  c.id as campus_id,
  c.name as campus_name,
  c.city as campus_city,
  c.region as campus_region,
  c.address_line,
  c.postal_code,
  c.source_url as location_source_url,
  c.source_checked_at as location_source_checked_at,
  c.metadata->>'record_scope' as record_scope,
  c.metadata->>'location_quality' as location_quality,
  i.id as institution_id,
  i.canonical_name as institution_name,
  i.slug as institution_slug,
  i.website_url,
  ii.identifier_value as brin_code,
  ii.source_url as brin_source_url,
  'official_location_evidence'::text as linkage_basis
from core.geographies g
join catalog.campuses c on c.geography_id=g.id and c.country_code='NL' and c.status='active' and c.metadata->>'normalization_batch'='nl_city_linkage_v1'
join catalog.institutions i on i.id=c.institution_id and i.country_code='NL' and i.status='active'
join catalog.institution_identifiers ii on ii.institution_id=i.id and ii.identifier_system='NL_BRIN'
where g.country_code='NL'
  and g.status='active'
  and g.metadata->>'publication_tier'='A';
revoke all on public.city_institution_directory_nl_v1 from public,anon,authenticated;
grant select on public.city_institution_directory_nl_v1 to service_role;

create or replace view public.city_programme_directory_nl_v1 with (security_invoker=true) as
select
  d.city_id,
  d.city_slug,
  d.campus_id,
  d.campus_name,
  d.institution_id,
  d.institution_name,
  p.id as programme_id,
  p.canonical_title as programme_title,
  p.programme_type,
  po.id as offering_id,
  po.delivery_mode,
  po.intake_label,
  po.enrolment_status,
  po.source_url as offering_source_url,
  po.source_checked_at as offering_source_checked_at,
  po.verification_status,
  'verified_programme_offerings.campus_id'::text as linkage_basis
from public.city_institution_directory_nl_v1 d
join catalog.campuses c on c.id=d.campus_id
join catalog.programme_offerings po on po.campus_id=c.id and po.verification_status='verified' and po.source_url is not null
join catalog.programmes p on p.id=po.programme_id and p.status='active' and p.institution_id=d.institution_id
where c.metadata->>'programme_assignment_verified'='true';
revoke all on public.city_programme_directory_nl_v1 from public,anon,authenticated;
grant select on public.city_programme_directory_nl_v1 to service_role;

create or replace view public.city_directory_nl_v1 with (security_invoker=true) as
select
  g.id as city_id,
  g.country_code,
  g.slug,
  g.name,
  g.region_code as region,
  g.scope_kind,
  g.metadata->>'study_destination_scope' as study_destination_scope,
  count(distinct d.campus_id)::integer as linked_campus_count,
  count(distinct d.institution_id)::integer as linked_institution_count,
  count(distinct p.programme_id)::integer as linked_program_count,
  'research_university_core_hbo_pending'::text as institution_coverage_status,
  case when count(distinct p.programme_id)>0 then 'verified_partial' else 'verification_pending' end::text as programme_coverage_status
from core.geographies g
left join public.city_institution_directory_nl_v1 d on d.city_id=g.id
left join public.city_programme_directory_nl_v1 p on p.city_id=g.id
where g.country_code='NL'
  and g.geography_type='city'
  and g.status='active'
  and g.canonical_geography_id is null
  and g.metadata->>'publication_tier'='A'
group by g.id,g.country_code,g.slug,g.name,g.region_code,g.scope_kind,g.metadata;
revoke all on public.city_directory_nl_v1 from public,anon,authenticated;
grant select on public.city_directory_nl_v1 to service_role;

do $$
begin
  if (select count(*) from public.city_directory_nl_v1) <> 5 then
    raise exception 'NL city directory expected 5 Tier A rows';
  end if;
  if (select count(*) from public.city_institution_directory_nl_v1) <> 6 then
    raise exception 'NL institution directory expected 6 verified initial location anchors';
  end if;
  if exists(select 1 from public.city_directory_nl_v1 where linked_campus_count=0 or linked_institution_count=0) then
    raise exception 'NL Tier A city missing verified institution/location linkage';
  end if;
  if exists(select 1 from public.city_programme_directory_nl_v1) then
    raise exception 'NL city programme directory must remain empty until explicit offering campus_id evidence is written';
  end if;
  if exists(select 1 from public.city_directory_nl_v1 where institution_coverage_status <> 'research_university_core_hbo_pending') then
    raise exception 'NL institution coverage disclosure contract failed';
  end if;
end $$;
