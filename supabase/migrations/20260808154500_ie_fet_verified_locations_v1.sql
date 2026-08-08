-- Ireland verified official locations for the QQI FET centre cohort v1.
--
-- Requires the earlier IE location publication layer. These rows use the same
-- verified batch so public.institution_location_ie_v1 automatically prefers
-- them over Qualifax-derived offering anchors for the eight curated centres.
-- Programme offerings remain attached to their legacy anchor campus rows.

with location_rows(
  institution_slug,
  location_key,
  display_name,
  city,
  region,
  address_line,
  postal_code,
  official_url,
  source_url
) as (
values
  (
    'cavan-institute','block-a','Cavan Institute Block A','Cavan','Co. Cavan',
    'Cathedral Road, Drumalee','H12 E426',
    'https://www.cavaninstitute.ie/campus-map','https://www.cavaninstitute.ie/campus-map'
  ),
  (
    'cavan-institute','block-b','Cavan Institute Block B','Cavan','Co. Cavan',
    'Hampton Court, Cootehill Road, Drumalee','H12 DY64',
    'https://www.cavaninstitute.ie/campus-map','https://www.cavaninstitute.ie/campus-map'
  ),
  (
    'cavan-institute','block-d','Cavan Institute Block D','Cavan','Co. Cavan',
    'Cavan Institute Further Education and Training Campus, Dublin Road','H12 FW53',
    'https://www.cavaninstitute.ie/campus-map','https://www.cavaninstitute.ie/campus-map'
  ),
  (
    'cavan-institute','block-e-workshop','Cavan Institute Block E Workshop','Cavan','Co. Cavan',
    'Ballinagh Road','H12 V3H3',
    'https://www.cavaninstitute.ie/campus-map','https://www.cavaninstitute.ie/campus-map'
  ),
  (
    'monaghan-institute','education-campus','Monaghan Institute Education Campus','Monaghan','Co. Monaghan',
    'Armagh Road, Monaghan Town','H18 FY94',
    'https://monaghaninstitute.ie/contact-us/','https://monaghaninstitute.ie/contact-us/'
  ),
  (
    'cork-college-of-fet-morrison-s-island','morrisons-island','Morrison’s Island Campus','Cork','Co. Cork',
    'Morrison’s Island, Cork City','T12 H685',
    'https://morrisonsislandcampus.ie/connect-with-us/','https://morrisonsislandcampus.ie/connect-with-us/'
  ),
  (
    'cork-college-of-fet-douglas-street','sawmill-street','Douglas Street Campus','Cork','Co. Cork',
    'Sawmill Street, Cork City','T12 DW32',
    'https://douglasstreetcampus.ie/connect-with-us/','https://douglasstreetcampus.ie/connect-with-us/'
  ),
  (
    'cork-college-of-fet-mallow','west-end','Mallow Campus','Mallow','Co. Cork',
    'West End, Mallow','P51 P732',
    'https://mallowcampus.ie/connect-with-us/','https://mallowcampus.ie/connect-with-us/'
  ),
  (
    'drogheda-institute-of-further-education','the-twenties','Drogheda Institute of Further Education','Drogheda','Co. Louth',
    'The Twenties','A92 V586',
    'https://www.dife.ie/','https://www.dife.ie/'
  ),
  (
    'dunboyne-college-of-further-education','business-park','Dunboyne College of Further Education','Dunboyne','Co. Meath',
    'Dunboyne Business Park','A86 FH01',
    'https://dunboynecollege.ie/contact-us/','https://dunboynecollege.ie/contact-us/'
  ),
  (
    'fiaich-institute-of-fet','dublin-road','Ó Fiaich Institute of Further Education','Dundalk','Co. Louth',
    'Dublin Road','A91 WK75',
    'https://ofi.ie/contact/','https://ofi.ie/contact/'
  )
),
resolved as (
  select
    source.*,
    i.id as institution_id,
    (
      select g.id
      from core.geographies g
      where g.country_code='IE'
        and g.geography_type='city'
        and g.status='active'
        and lower(g.name)=lower(source.city)
      order by g.id
      limit 1
    ) as geography_id
  from location_rows source
  join catalog.institutions i
    on i.country_code='IE'
   and i.slug=source.institution_slug
   and i.status<>'inactive'
  join catalog.institution_identifiers centre
    on centre.institution_id=i.id
   and centre.identifier_system='IE_QQI_CENTRE_NAME'
)
insert into catalog.campuses(
  id,institution_id,name,city,region,country_code,status,
  geography_id,locality,locality_geography_id,address_line,postal_code,
  official_url,source_url,source_checked_at,metadata,created_at,updated_at
)
select
  gen_random_uuid(),r.institution_id,r.display_name,r.city,r.region,'IE','active',
  r.geography_id,r.city,r.geography_id,r.address_line,r.postal_code,
  r.official_url,r.source_url,now(),
  jsonb_build_object(
    'record_scope','official_institution_location',
    'location_quality','verified_official',
    'display_policy','preferred',
    'source_kind','institution_official_site',
    'location_key',r.location_key,
    'normalization_batch','ie_verified_locations_v1',
    'cohort','qqi_fet_centre_v1'
  ),
  now(),now()
from resolved r
where not exists (
  select 1
  from catalog.campuses existing
  where existing.institution_id=r.institution_id
    and existing.country_code='IE'
    and existing.metadata->>'normalization_batch'='ie_verified_locations_v1'
    and existing.metadata->>'location_key'=r.location_key
);

do $$
declare
  location_count integer;
  institution_count integer;
  invalid_source_count integer;
  duplicate_key_count integer;
  cohort_program_count integer;
  verified_anchor_count integer;
begin
  select count(*),count(distinct c.institution_id)
  into location_count,institution_count
  from catalog.campuses c
  join catalog.institutions i on i.id=c.institution_id
  where i.country_code='IE'
    and c.status<>'inactive'
    and c.metadata->>'normalization_batch'='ie_verified_locations_v1'
    and c.metadata->>'cohort'='qqi_fet_centre_v1';

  if location_count<>11 or institution_count<>8 then
    raise exception 'Expected 11 verified FET locations across 8 centres, found % across %',location_count,institution_count;
  end if;

  select count(*)
  into invalid_source_count
  from catalog.campuses c
  where c.metadata->>'cohort'='qqi_fet_centre_v1'
    and (
      c.source_url is null or c.source_url !~ '^https://'
      or c.official_url is null or c.official_url !~ '^https://'
    );

  if invalid_source_count>0 then
    raise exception 'Found % FET verified locations without HTTPS official provenance',invalid_source_count;
  end if;

  select count(*)-count(distinct (c.institution_id,c.metadata->>'location_key'))
  into duplicate_key_count
  from catalog.campuses c
  where c.metadata->>'cohort'='qqi_fet_centre_v1';

  if duplicate_key_count>0 then
    raise exception 'Found % duplicate FET verified location keys',duplicate_key_count;
  end if;

  select count(*)
  into cohort_program_count
  from catalog.programmes p
  join public.institution_identity_ie_fet_v1 identity
    on identity.institution_id=p.institution_id
  where p.status='active';

  if cohort_program_count<>66 then
    raise exception 'Expected 66 active programmes across verified FET centre cohort, found %',cohort_program_count;
  end if;

  select count(*)
  into verified_anchor_count
  from catalog.programme_offerings po
  join catalog.programmes p on p.id=po.programme_id
  join public.institution_identity_ie_fet_v1 identity
    on identity.institution_id=p.institution_id
  join catalog.campuses c on c.id=po.campus_id
  where p.status='active'
    and c.metadata->>'cohort'='qqi_fet_centre_v1';

  if verified_anchor_count<>0 then
    raise exception 'Found % FET programme offerings incorrectly moved onto verified display locations',verified_anchor_count;
  end if;
end $$;
