-- Ireland QQI Further Education and Training centre identity cohort v1.
--
-- QQI QSearch lists validated programmes separately from the centres that offer
-- them. These rows therefore remain CampCareer Institutions at centre/college
-- level; they are NOT collapsed into their parent Education and Training Board.
-- A later normalized relation layer can model centre -> ETB provider membership.
--
-- `IE_QQI_CENTRE_NAME` stores the source-backed QSearch centre name. It is not a
-- fabricated provider code. Existing IE legacy provider/name identities remain
-- deterministic import keys.

create temp table ie_qqi_fet_centres(
  slug text primary key,
  canonical_name text not null,
  qqi_centre_name text not null,
  website_url text not null,
  qqi_source_url text not null
) on commit drop;

insert into ie_qqi_fet_centres values
  (
    'cavan-institute',
    'Cavan Institute',
    'Cavan Institute',
    'https://www.cavaninstitute.ie/',
    'https://qsearch.qqi.ie/WebPart/ProgrammeDetails?programmeCode=PG16197'
  ),
  (
    'monaghan-institute',
    'Monaghan Institute',
    'Monaghan Institute',
    'https://monaghaninstitute.ie/',
    'https://qsearch.qqi.ie/WebPart/ProgrammeDetails?programmeCode=PG16197'
  ),
  (
    'cork-college-of-fet-morrison-s-island',
    'Cork College of FET Morrison’s Island Campus',
    'Cork College of FET Morrison''s Island Campus',
    'https://morrisonsislandcampus.ie/',
    'https://qsearch.qqi.ie/WebPart/ProgrammeDetails?programmeCode=PG16123'
  ),
  (
    'cork-college-of-fet-douglas-street',
    'Cork College of FET Douglas Street Campus',
    'Cork College of FET - Douglas Street Campus',
    'https://douglasstreetcampus.ie/',
    'https://qsearch.qqi.ie/WebPart/ProgrammeDetails?programmeCode=PG22377'
  ),
  (
    'cork-college-of-fet-mallow',
    'Cork College of FET Mallow Campus',
    'Cork College of FET Mallow Campus',
    'https://mallowcampus.ie/',
    'https://qsearch.qqi.ie/WebPart/ProgrammeDetails?programmeCode=PG21396'
  ),
  (
    'drogheda-institute-of-further-education',
    'Drogheda Institute of Further Education',
    'Drogheda Institute of Further Education',
    'https://www.dife.ie/',
    'https://qsearch.qqi.ie/WebPart/ProgrammeDetails?programmeCode=PG17156'
  ),
  (
    'dunboyne-college-of-further-education',
    'Dunboyne College of Further Education',
    'Dunboyne College of Further Education',
    'https://dunboynecollege.ie/',
    'https://qsearch.qqi.ie/WebPart/ProgrammeDetails?programmeCode=PG17156'
  ),
  (
    'fiaich-institute-of-fet',
    'Ó Fiaich Institute of Further Education',
    'O''Fiaich Institute of Further Education',
    'https://ofi.ie/',
    'https://qsearch.qqi.ie/WebPart/ProgrammeDetails?programmeCode=PG17156'
  );

-- Fail closed if an expected source institution is absent. This avoids silently
-- creating a second institution when a legacy slug changes upstream.
do $$
declare
  missing_count integer;
begin
  select count(*)
  into missing_count
  from ie_qqi_fet_centres source
  left join catalog.institutions i
    on i.country_code='IE'
   and i.slug=source.slug
  where i.id is null;

  if missing_count>0 then
    raise exception 'Missing % expected Irish FET centre institutions',missing_count;
  end if;
end $$;

update catalog.institutions i
set
  canonical_name=source.canonical_name,
  website_url=source.website_url,
  institution_kind='other',
  ownership_type='public',
  status='active',
  updated_at=now()
from ie_qqi_fet_centres source
where i.country_code='IE'
  and i.slug=source.slug;

insert into catalog.institution_identifiers(
  institution_id,
  identifier_system,
  identifier_value,
  source_url
)
select
  i.id,
  'IE_QQI_CENTRE_NAME',
  source.qqi_centre_name,
  source.qqi_source_url
from ie_qqi_fet_centres source
join catalog.institutions i
  on i.country_code='IE'
 and i.slug=source.slug
 and i.status<>'inactive'
on conflict(identifier_system,identifier_value)
do update set
  institution_id=excluded.institution_id,
  source_url=excluded.source_url;

create or replace view public.institution_identity_ie_fet_v1
with (security_invoker=true) as
select
  i.id as institution_id,
  i.country_code,
  i.slug,
  i.canonical_name,
  i.institution_kind,
  i.ownership_type,
  i.website_url,
  centre.identifier_value as qqi_centre_name,
  centre.source_url as qqi_source_url,
  coalesce(
    array_agg(distinct legacy.identifier_value order by legacy.identifier_value)
      filter(where legacy.identifier_value is not null),
    array[]::text[]
  ) as legacy_provider_ids
from catalog.institutions i
join catalog.institution_identifiers centre
  on centre.institution_id=i.id
 and centre.identifier_system='IE_QQI_CENTRE_NAME'
left join catalog.institution_identifiers legacy
  on legacy.institution_id=i.id
 and legacy.identifier_system in ('IE_PROVIDER_ID','IE_LEGACY_COLLEGE_NAME')
where i.country_code='IE'
  and i.status<>'inactive'
  and i.slug is not null
group by
  i.id,i.country_code,i.slug,i.canonical_name,i.institution_kind,
  i.ownership_type,i.website_url,centre.identifier_value,centre.source_url;

comment on view public.institution_identity_ie_fet_v1 is
  'Service-role Ireland QQI FET centre identity cohort. Centre identity is source-backed by QSearch; parent ETB membership is intentionally not encoded as a repeated institution identifier.';

revoke all on public.institution_identity_ie_fet_v1 from public,anon,authenticated;
grant select on public.institution_identity_ie_fet_v1 to service_role;

do $$
declare
  identity_count integer;
  normalized_count integer;
  cohort_program_count integer;
  all_program_count integer;
  legacy_identity_count integer;
  invalid_source_count integer;
begin
  select count(*)
  into identity_count
  from public.institution_identity_ie_fet_v1;

  if identity_count<>8 then
    raise exception 'Expected 8 QQI FET centre identities in cohort v1, found %',identity_count;
  end if;

  select count(*)
  into normalized_count
  from public.institution_identity_ie_fet_v1
  where institution_kind='other'
    and ownership_type='public'
    and website_url like 'https://%';

  if normalized_count<>8 then
    raise exception 'Expected all 8 QQI FET centres to have public/type/website normalization, found %',normalized_count;
  end if;

  select count(*)
  into cohort_program_count
  from catalog.programmes p
  join public.institution_identity_ie_fet_v1 identity
    on identity.institution_id=p.institution_id
  where p.status='active';

  if cohort_program_count<>66 then
    raise exception 'Expected 66 active programmes across QQI FET centre cohort v1, found %',cohort_program_count;
  end if;

  select count(*)
  into all_program_count
  from catalog.programmes p
  join catalog.institutions i on i.id=p.institution_id
  where i.country_code='IE'
    and p.status='active';

  if all_program_count<>2876 then
    raise exception 'Expected all 2876 Irish active programmes to remain connected after FET centre identity normalization, found %',all_program_count;
  end if;

  select count(*)
  into legacy_identity_count
  from catalog.institution_identifiers legacy
  join public.institution_identity_ie_fet_v1 identity
    on identity.institution_id=legacy.institution_id
  where legacy.identifier_system in ('IE_PROVIDER_ID','IE_LEGACY_COLLEGE_NAME');

  if legacy_identity_count<8 then
    raise exception 'Expected legacy import identity preservation for all 8 QQI FET centres; found % legacy rows',legacy_identity_count;
  end if;

  select count(*)
  into invalid_source_count
  from catalog.institution_identifiers ii
  join catalog.institutions i on i.id=ii.institution_id
  where i.country_code='IE'
    and ii.identifier_system='IE_QQI_CENTRE_NAME'
    and (ii.source_url is null or ii.source_url !~ '^https://qsearch\.qqi\.ie/');

  if invalid_source_count>0 then
    raise exception 'Found % QQI FET centre identities without QSearch provenance',invalid_source_count;
  end if;
end $$;
