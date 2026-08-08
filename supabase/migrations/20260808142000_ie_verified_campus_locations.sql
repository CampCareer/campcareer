-- Ireland verified campus/location quality for the initial publication cohort.
--
-- Sources are institution-owned current campus/location/contact pages.
-- This migration adds source-backed display locations for all 17 HEA-listed
-- programme-relevant institutions plus the six QQI private HEIs normalized in
-- the preceding migration. Existing Qualifax-derived programme-offering anchor
-- rows remain untouched and continue to carry all offering FKs.
--
-- The publication view prefers verified official locations for an institution
-- and falls back to the legacy Qualifax anchor layer only when no verified
-- official location has been curated.

with location_rows(
  institution_slug,
  location_key,
  display_name,
  city,
  region,
  postal_code,
  official_url,
  source_url
) as (
values
  ('atlantic-technological-university', 'connemara', 'ATU Connemara', 'Letterfrack', 'Co. Galway', null, 'https://studenthub.atu.ie/helpdesk', 'https://studenthub.atu.ie/helpdesk'),
  ('atlantic-technological-university', 'donegal-letterkenny', 'ATU Donegal Letterkenny', 'Letterkenny', 'Co. Donegal', null, 'https://studenthub.atu.ie/helpdesk', 'https://studenthub.atu.ie/helpdesk'),
  ('atlantic-technological-university', 'donegal-killybegs', 'ATU Donegal Killybegs', 'Killybegs', 'Co. Donegal', null, 'https://studenthub.atu.ie/helpdesk', 'https://studenthub.atu.ie/helpdesk'),
  ('atlantic-technological-university', 'galway-dublin-road', 'ATU Galway City - Dublin Road', 'Galway', 'Co. Galway', null, 'https://studenthub.atu.ie/helpdesk', 'https://studenthub.atu.ie/helpdesk'),
  ('atlantic-technological-university', 'galway-wellpark-road', 'ATU Galway City - Wellpark Road', 'Galway', 'Co. Galway', null, 'https://studenthub.atu.ie/helpdesk', 'https://studenthub.atu.ie/helpdesk'),
  ('atlantic-technological-university', 'mayo', 'ATU Mayo', 'Castlebar', 'Co. Mayo', null, 'https://studenthub.atu.ie/helpdesk', 'https://studenthub.atu.ie/helpdesk'),
  ('atlantic-technological-university', 'mountbellew', 'ATU Mountbellew', 'Mountbellew', 'Co. Galway', null, 'https://studenthub.atu.ie/helpdesk', 'https://studenthub.atu.ie/helpdesk'),
  ('atlantic-technological-university', 'sligo', 'ATU Sligo', 'Sligo', 'Co. Sligo', null, 'https://studenthub.atu.ie/helpdesk', 'https://studenthub.atu.ie/helpdesk'),
  ('atlantic-technological-university', 'st-angelas', 'ATU St Angela''s', 'Sligo', 'Co. Sligo', null, 'https://studenthub.atu.ie/helpdesk', 'https://studenthub.atu.ie/helpdesk'),
  ('dublin-city-university', 'glasnevin', 'DCU Glasnevin Campus', 'Dublin', 'Dublin', null, 'https://www.dcu.ie/travel-to-dcu/getting-to-campus', 'https://www.dcu.ie/travel-to-dcu/getting-to-campus'),
  ('dublin-city-university', 'st-patricks', 'DCU St Patrick''s Campus', 'Dublin', 'Dublin', null, 'https://www.dcu.ie/travel-to-dcu/getting-to-campus', 'https://www.dcu.ie/travel-to-dcu/getting-to-campus'),
  ('dublin-city-university', 'all-hallows', 'DCU All Hallows Campus', 'Dublin', 'Dublin', null, 'https://www.dcu.ie/travel-to-dcu/getting-to-campus', 'https://www.dcu.ie/travel-to-dcu/getting-to-campus'),
  ('dublin-city-university', 'alpha', 'DCU Alpha', 'Dublin', 'Dublin', null, 'https://www.dcu.ie/travel-to-dcu/getting-to-campus', 'https://www.dcu.ie/travel-to-dcu/getting-to-campus'),
  ('dublin-city-university', 'sports', 'DCU Sports Campus', 'Dublin', 'Dublin', null, 'https://www.dcu.ie/travel-to-dcu/getting-to-campus', 'https://www.dcu.ie/travel-to-dcu/getting-to-campus'),
  ('dublin-city-university', 'morton-stadium', 'DCU Morton Stadium', 'Dublin', 'Dublin', null, 'https://www.dcu.ie/travel-to-dcu/getting-to-campus', 'https://www.dcu.ie/travel-to-dcu/getting-to-campus'),
  ('institute-of-art-design-and-technology', 'dun-laoghaire', 'IADT Dún Laoghaire Campus', 'Dún Laoghaire', 'Dublin', 'A96 KH79', 'https://iadt.ie/about/', 'https://iadt.ie/about/'),
  ('dundalk-institute-of-technology', 'dundalk', 'DkIT Campus', 'Dundalk', 'Co. Louth', 'A91 K584', 'https://www.dkit.ie/about/campus', 'https://www.dkit.ie/about/campus'),
  ('mary-immaculate-college', 'limerick', 'MIC Limerick Campus', 'Limerick', 'Co. Limerick', 'V94 VN26', 'https://www.mic.ul.ie/contact', 'https://www.mic.ul.ie/contact'),
  ('mary-immaculate-college', 'thurles', 'MIC St Patrick''s Campus, Thurles', 'Thurles', 'Co. Tipperary', 'E41 C424', 'https://www.mic.ul.ie/contact', 'https://www.mic.ul.ie/contact'),
  ('maynooth-university', 'maynooth', 'Maynooth University Campus', 'Maynooth', 'Co. Kildare', null, 'https://www.maynoothuniversity.ie/location', 'https://www.maynoothuniversity.ie/location'),
  ('maynooth-university', 'kilkenny', 'Maynooth University Kilkenny Campus', 'Kilkenny', 'Co. Kilkenny', null, 'https://www.maynoothuniversity.ie/kilkennycampus/about-us', 'https://www.maynoothuniversity.ie/kilkennycampus/about-us'),
  ('munster-technological-university', 'bishopstown', 'MTU Bishopstown Campus', 'Cork', 'Co. Cork', 'T12 P928', 'https://www.mtu.ie/contact-us/', 'https://www.mtu.ie/contact-us/'),
  ('munster-technological-university', 'kerry-north', 'MTU Kerry North Campus', 'Tralee', 'Co. Kerry', 'V92 HD4V', 'https://www.mtu.ie/contact-us/', 'https://www.mtu.ie/contact-us/'),
  ('munster-technological-university', 'kerry-south', 'MTU Kerry South Campus', 'Tralee', 'Co. Kerry', 'V92 CX88', 'https://www.mtu.ie/contact-us/', 'https://www.mtu.ie/contact-us/'),
  ('munster-technological-university', 'crawford', 'MTU Crawford College of Art & Design', 'Cork', 'Co. Cork', 'T12 XK25', 'https://www.mtu.ie/contact-us/', 'https://www.mtu.ie/contact-us/'),
  ('munster-technological-university', 'cork-school-of-music', 'MTU Cork School of Music', 'Cork', 'Co. Cork', 'T12 E9HY', 'https://www.mtu.ie/contact-us/', 'https://www.mtu.ie/contact-us/'),
  ('munster-technological-university', 'nmci', 'National Maritime College of Ireland', 'Ringaskiddy', 'Co. Cork', 'P43 XV65', 'https://www.mtu.ie/contact-us/', 'https://www.mtu.ie/contact-us/'),
  ('national-college-of-art-and-design', 'thomas-street', 'NCAD Thomas Street Campus', 'Dublin', 'Dublin', 'D08 K521', 'https://www.ncad.ie/study-at-ncad/contact-us/', 'https://www.ncad.ie/study-at-ncad/contact-us/'),
  ('rcsi-university-of-medicine-and-health-sciences', 'dublin-city-centre', 'RCSI Dublin City Centre Campus', 'Dublin', 'Dublin', null, 'https://www.rcsi.com/dublin/student-life/life-on-campus/our-campus', 'https://www.rcsi.com/dublin/student-life/life-on-campus/our-campus'),
  ('south-east-technological-university', 'waterford-cork-road', 'Cork Road Campus', 'Waterford', 'Co. Waterford', 'X91 K0EK', 'https://www.setu.ie/about/setu-campuses/waterford-campuses/visiting-the-waterford-campuses', 'https://www.setu.ie/about/setu-campuses/waterford-campuses/visiting-the-waterford-campuses'),
  ('south-east-technological-university', 'waterford-college-street', 'College Street Campus', 'Waterford', 'Co. Waterford', 'X91 Y074', 'https://www.setu.ie/about/setu-campuses/waterford-campuses/visiting-the-waterford-campuses', 'https://www.setu.ie/about/setu-campuses/waterford-campuses/visiting-the-waterford-campuses'),
  ('south-east-technological-university', 'waterford-granary', 'Granary Campus', 'Waterford', 'Co. Waterford', 'X91 FF86', 'https://www.setu.ie/about/setu-campuses/waterford-campuses/visiting-the-waterford-campuses', 'https://www.setu.ie/about/setu-campuses/waterford-campuses/visiting-the-waterford-campuses'),
  ('south-east-technological-university', 'waterford-west', 'West Campus', 'Waterford', 'Co. Waterford', null, 'https://www.setu.ie/about/setu-campuses/waterford-campuses/visiting-the-waterford-campuses', 'https://www.setu.ie/about/setu-campuses/waterford-campuses/visiting-the-waterford-campuses'),
  ('south-east-technological-university', 'waterford-applied-technology', 'Applied Technology Campus', 'Waterford', 'Co. Waterford', 'X91 TX03', 'https://www.setu.ie/about/setu-campuses/waterford-campuses/visiting-the-waterford-campuses', 'https://www.setu.ie/about/setu-campuses/waterford-campuses/visiting-the-waterford-campuses'),
  ('south-east-technological-university', 'carlow-kilkenny-road', 'Kilkenny Road Campus', 'Carlow', 'Co. Carlow', 'R93 V960', 'https://www.setu.ie/about/setu-campuses/carlow-campus/visiting-the-carlow-campus', 'https://www.setu.ie/about/setu-campuses/carlow-campus/visiting-the-carlow-campus'),
  ('south-east-technological-university', 'carlow-south-sports', 'South Sports Campus', 'Carlow', 'Co. Carlow', 'R93 AYW9', 'https://www.setu.ie/about/setu-campuses/carlow-campus/visiting-the-carlow-campus', 'https://www.setu.ie/about/setu-campuses/carlow-campus/visiting-the-carlow-campus'),
  ('south-east-technological-university', 'wexford-summerhill', 'Summerhill Road Campus', 'Wexford', 'Co. Wexford', 'Y35 KA07', 'https://www.setu.ie/about/setu-campuses/visiting-the-wexford-campuses', 'https://www.setu.ie/about/setu-campuses/visiting-the-wexford-campuses'),
  ('south-east-technological-university', 'wexford-hill-street', 'Hill Street Campus', 'Wexford', 'Co. Wexford', null, 'https://www.setu.ie/about/setu-campuses/visiting-the-wexford-campuses', 'https://www.setu.ie/about/setu-campuses/visiting-the-wexford-campuses'),
  ('technological-university-dublin', 'grangegorman', 'Grangegorman Campus', 'Dublin', 'Dublin', 'D07 H6K8', 'https://www.tudublin.ie/explore/our-campuses/', 'https://www.tudublin.ie/explore/our-campuses/'),
  ('technological-university-dublin', 'aungier-street', 'Aungier Street Campus', 'Dublin', 'Dublin', 'D02 HW71', 'https://www.tudublin.ie/explore/our-campuses/', 'https://www.tudublin.ie/explore/our-campuses/'),
  ('technological-university-dublin', 'bolton-street', 'Bolton Street Campus', 'Dublin', 'Dublin', 'D01 K822', 'https://www.tudublin.ie/explore/our-campuses/', 'https://www.tudublin.ie/explore/our-campuses/'),
  ('technological-university-dublin', 'blanchardstown', 'Blanchardstown Campus', 'Dublin', 'Dublin', 'D15 YV78', 'https://www.tudublin.ie/explore/our-campuses/', 'https://www.tudublin.ie/explore/our-campuses/'),
  ('technological-university-dublin', 'tallaght', 'Tallaght Campus', 'Dublin', 'Dublin', 'D24 FKT9', 'https://www.tudublin.ie/explore/our-campuses/', 'https://www.tudublin.ie/explore/our-campuses/'),
  ('technological-university-of-the-shannon', 'athlone', 'Athlone Campus', 'Athlone', 'Co. Westmeath', 'N37 HD68', 'https://tus.ie/campuses/', 'https://tus.ie/campuses/'),
  ('technological-university-of-the-shannon', 'clare-street', 'Clare Street Campus', 'Limerick', 'Co. Limerick', null, 'https://tus.ie/campuses/', 'https://tus.ie/campuses/'),
  ('technological-university-of-the-shannon', 'clonmel', 'Clonmel Digital Campus', 'Clonmel', 'Co. Tipperary', null, 'https://tus.ie/campuses/', 'https://tus.ie/campuses/'),
  ('technological-university-of-the-shannon', 'coonagh', 'Coonagh Campus', 'Limerick', 'Co. Limerick', null, 'https://tus.ie/campuses/', 'https://tus.ie/campuses/'),
  ('technological-university-of-the-shannon', 'ennis', 'Ennis Campus', 'Ennis', 'Co. Clare', null, 'https://tus.ie/campuses/', 'https://tus.ie/campuses/'),
  ('technological-university-of-the-shannon', 'moylish', 'Moylish Campus', 'Limerick', 'Co. Limerick', 'V94 EC5T', 'https://tus.ie/campuses/', 'https://tus.ie/campuses/'),
  ('technological-university-of-the-shannon', 'thurles', 'Thurles Campus', 'Thurles', 'Co. Tipperary', null, 'https://tus.ie/campuses/', 'https://tus.ie/campuses/'),
  ('trinity-college-dublin', 'college-green', 'Trinity College Dublin Campus', 'Dublin', 'Dublin', null, 'https://www.tcd.ie/study/international/visit/', 'https://www.tcd.ie/study/international/visit/'),
  ('university-college-cork', 'main', 'UCC Main Campus', 'Cork', 'Co. Cork', 'T12 K8AF', 'https://www.ucc.ie/en/sustainability-institute/contactus/maincampusucc/', 'https://www.ucc.ie/en/sustainability-institute/contactus/maincampusucc/'),
  ('university-college-cork', 'western', 'UCC Western Campus', 'Cork', 'Co. Cork', null, 'https://www.ucc.ie/en/build/buildings/westerncampus/', 'https://www.ucc.ie/en/build/buildings/westerncampus/'),
  ('university-college-cork', 'north-mall', 'UCC North Mall Campus', 'Cork', 'Co. Cork', null, 'https://www.ucc.ie/en/ornithology/howtofindus/', 'https://www.ucc.ie/en/ornithology/howtofindus/'),
  ('university-college-dublin', 'belfield', 'UCD Belfield Campus', 'Dublin', 'Dublin', null, 'https://www.ucd.ie/strategy/ourstrategicinitiatives/physicaldigitalcampuses/', 'https://www.ucd.ie/strategy/ourstrategicinitiatives/physicaldigitalcampuses/'),
  ('university-college-dublin', 'blackrock', 'UCD Blackrock Campus', 'Blackrock', 'Dublin', null, 'https://www.ucd.ie/strategy/ourstrategicinitiatives/physicaldigitalcampuses/', 'https://www.ucd.ie/strategy/ourstrategicinitiatives/physicaldigitalcampuses/'),
  ('university-college-dublin', 'lyons-farm', 'UCD Lyons Farm', null, 'Dublin / Kildare', null, 'https://www.ucd.ie/strategy/ourstrategicinitiatives/physicaldigitalcampuses/', 'https://www.ucd.ie/strategy/ourstrategicinitiatives/physicaldigitalcampuses/'),
  ('university-of-galway', 'main', 'University of Galway Main Campus', 'Galway', 'Co. Galway', null, 'https://www.universityofgalway.ie/about-us/who-we-are/the-campus/', 'https://www.universityofgalway.ie/about-us/who-we-are/the-campus/'),
  ('university-of-limerick', 'main', 'University of Limerick Campus', 'Limerick', 'Co. Limerick', 'V94 T9PX', 'https://www.campuslife.ul.ie/visitorservices/index.jsp?n=294&p=103', 'https://www.campuslife.ul.ie/visitorservices/index.jsp?n=294&p=103'),
  ('dublin-business-school', 'aungier-street', 'Dublin Business School City Centre Campus', 'Dublin', 'Dublin', 'D02 WC04', 'https://students.dbs.ie/search', 'https://students.dbs.ie/search'),
  ('griffith-college', 'dublin', 'Griffith College Dublin Main Campus', 'Dublin', 'Dublin', null, 'https://www.griffith.ie/about/our-locations', 'https://www.griffith.ie/about/our-locations'),
  ('griffith-college', 'cork', 'Griffith College Cork Campus', 'Cork', 'Co. Cork', null, 'https://www.griffith.ie/about/our-locations', 'https://www.griffith.ie/about/our-locations'),
  ('griffith-college', 'limerick', 'Griffith College Limerick Campus', 'Limerick', 'Co. Limerick', null, 'https://www.griffith.ie/about/our-locations', 'https://www.griffith.ie/about/our-locations'),
  ('national-college-of-ireland', 'mayor-square', 'NCI Mayor Square Campus', 'Dublin', 'Dublin', 'D01 K6W2', 'https://ncisupporthub.ncirl.ie/hc/en-ie/articles/6666938481692-Where-is-the-NCI-campus-located', 'https://ncisupporthub.ncirl.ie/hc/en-ie/articles/6666938481692-Where-is-the-NCI-campus-located'),
  ('national-college-of-ireland', 'spencer-dock', 'NCI Spencer Dock Campus', 'Dublin', 'Dublin', 'D01 N6P6', 'https://ncisupporthub.ncirl.ie/hc/en-ie/articles/6666938481692-Where-is-the-NCI-campus-located', 'https://ncisupporthub.ncirl.ie/hc/en-ie/articles/6666938481692-Where-is-the-NCI-campus-located'),
  ('cct-college-dublin', 'westmoreland-street', 'CCT College Dublin Campus', 'Dublin', 'Dublin', 'D02 HK35', 'https://www.cct.ie/student-experience/campus-facilities-resources/', 'https://www.cct.ie/student-experience/campus-facilities-resources/'),
  ('hibernia-college', 'dublin', 'Hibernia College Dublin', 'Dublin', 'Dublin', null, 'https://hiberniacollege.com/contact-us/', 'https://hiberniacollege.com/contact-us/'),
  ('hibernia-college', 'westport', 'Hibernia College Technical Hub', 'Westport', 'Co. Mayo', 'F28 PW83', 'https://hiberniacollege.com/contact-us/', 'https://hiberniacollege.com/contact-us/'),
  ('open-training-college', 'goatstown', 'Open Training College', 'Dublin', 'Dublin', 'D14 P9E4', 'https://opentrainingcollege.com/contact-us/', 'https://opentrainingcollege.com/contact-us/')
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
        and source.city is not null
        and lower(g.name)=lower(source.city)
      order by g.id
      limit 1
    ) as geography_id
  from location_rows source
  join catalog.institutions i
    on i.country_code='IE'
   and i.slug=source.institution_slug
   and i.status<>'inactive'
)
insert into catalog.campuses(
  id,
  institution_id,
  name,
  city,
  region,
  country_code,
  status,
  geography_id,
  locality,
  locality_geography_id,
  address_line,
  postal_code,
  official_url,
  source_url,
  source_checked_at,
  metadata,
  created_at,
  updated_at
)
select
  gen_random_uuid(),
  r.institution_id,
  r.display_name,
  r.city,
  r.region,
  'IE',
  'active',
  r.geography_id,
  r.city,
  r.geography_id,
  null,
  r.postal_code,
  r.official_url,
  r.source_url,
  now(),
  jsonb_build_object(
    'record_scope','official_institution_location',
    'location_quality','verified_official',
    'display_policy','preferred',
    'source_kind','institution_official_site',
    'location_key',r.location_key,
    'normalization_batch','ie_verified_locations_v1'
  ),
  now(),
  now()
from resolved r
where not exists (
  select 1
  from catalog.campuses existing
  where existing.institution_id=r.institution_id
    and existing.country_code='IE'
    and existing.metadata->>'normalization_batch'='ie_verified_locations_v1'
    and existing.metadata->>'location_key'=r.location_key
);

create or replace view public.institution_location_ie_v1
with (security_invoker=true) as
with verified as (
  select
    c.id as campus_id,
    c.institution_id,
    c.name,
    g.name as city_name,
    g.slug as city_slug,
    c.locality as reported_locality,
    c.city as source_city,
    c.region,
    c.address_line,
    c.postal_code,
    c.official_url,
    c.source_url,
    c.source_checked_at,
    c.metadata
  from catalog.campuses c
  join catalog.institutions i
    on i.id=c.institution_id
   and i.country_code='IE'
   and i.status<>'inactive'
  left join core.geographies g
    on g.id=coalesce(c.locality_geography_id,c.geography_id)
   and g.country_code='IE'
   and g.geography_type='city'
   and g.status='active'
  where c.status<>'inactive'
    and c.metadata->>'normalization_batch'='ie_verified_locations_v1'
    and c.metadata->>'record_scope'='official_institution_location'
    and c.metadata->>'location_quality'='verified_official'
),
fallback as (
  select
    c.id as campus_id,
    c.institution_id,
    c.name,
    g.name as city_name,
    g.slug as city_slug,
    c.locality as reported_locality,
    c.city as source_city,
    c.region,
    c.address_line,
    c.postal_code,
    c.official_url,
    c.source_url,
    c.source_checked_at,
    c.metadata
  from catalog.campuses c
  join catalog.institutions i
    on i.id=c.institution_id
   and i.country_code='IE'
   and i.status<>'inactive'
  left join core.geographies g
    on g.id=coalesce(c.locality_geography_id,c.geography_id)
   and g.country_code='IE'
   and g.geography_type='city'
   and g.status='active'
  where c.status<>'inactive'
    and c.metadata->>'normalization_batch'='ie_institution_locations_v1'
    and c.metadata->>'record_scope'='legacy_offering_anchor'
    and not exists (
      select 1
      from verified v
      where v.institution_id=c.institution_id
    )
)
select * from verified
union all
select * from fallback;

comment on view public.institution_location_ie_v1 is
  'Service-role Ireland location read model. Prefers institution-owned verified campus/location records for the HEA + major QQI publication cohort and falls back to Qualifax-derived legacy anchors only when no verified official location exists.';

revoke all on public.institution_location_ie_v1 from public,anon,authenticated;
grant select on public.institution_location_ie_v1 to service_role;

do $$
declare
  verified_location_count integer;
  verified_institution_count integer;
  hea_verified_count integer;
  qqi_private_verified_count integer;
  duplicate_location_key_count integer;
  invalid_source_count integer;
  verified_offering_anchor_count integer;
  active_offering_count integer;
  legacy_anchor_offering_count integer;
  displayed_institution_count integer;
begin
  select count(*),count(distinct c.institution_id)
  into verified_location_count,verified_institution_count
  from catalog.campuses c
  join catalog.institutions i on i.id=c.institution_id
  where i.country_code='IE'
    and i.status<>'inactive'
    and c.status<>'inactive'
    and c.metadata->>'normalization_batch'='ie_verified_locations_v1'
    and c.metadata->>'record_scope'='official_institution_location'
    and c.metadata->>'location_quality'='verified_official';

  if verified_location_count<>69 or verified_institution_count<>23 then
    raise exception
      'Expected 69 verified official Irish locations across 23 institutions; found % across %',
      verified_location_count,verified_institution_count;
  end if;

  select count(distinct v.institution_id)
  into hea_verified_count
  from public.institution_identity_ie_v1 identity
  join public.institution_location_ie_v1 v
    on v.institution_id=identity.institution_id
  where v.metadata->>'location_quality'='verified_official';

  if hea_verified_count<>17 then
    raise exception 'Expected verified locations for all 17 HEA identity institutions, found %',hea_verified_count;
  end if;

  select count(distinct v.institution_id)
  into qqi_private_verified_count
  from public.institution_identity_ie_private_v1 identity
  join public.institution_location_ie_v1 v
    on v.institution_id=identity.institution_id
  where v.metadata->>'location_quality'='verified_official';

  if qqi_private_verified_count<>6 then
    raise exception 'Expected verified locations for all 6 QQI private HEIs, found %',qqi_private_verified_count;
  end if;

  select count(*)-count(distinct (c.institution_id,c.metadata->>'location_key'))
  into duplicate_location_key_count
  from catalog.campuses c
  join catalog.institutions i on i.id=c.institution_id
  where i.country_code='IE'
    and c.metadata->>'normalization_batch'='ie_verified_locations_v1';

  if duplicate_location_key_count>0 then
    raise exception 'Found % duplicate verified Irish location keys',duplicate_location_key_count;
  end if;

  select count(*)
  into invalid_source_count
  from catalog.campuses c
  join catalog.institutions i on i.id=c.institution_id
  where i.country_code='IE'
    and c.metadata->>'normalization_batch'='ie_verified_locations_v1'
    and (
      c.source_url is null or c.source_url !~ '^https://'
      or c.official_url is null or c.official_url !~ '^https://'
    );

  if invalid_source_count>0 then
    raise exception 'Found % verified Irish locations without HTTPS official provenance',invalid_source_count;
  end if;

  select
    count(*),
    count(*) filter(
      where anchor.metadata->>'normalization_batch'='ie_institution_locations_v1'
        and anchor.metadata->>'record_scope'='legacy_offering_anchor'
    ),
    count(*) filter(
      where anchor.metadata->>'normalization_batch'='ie_verified_locations_v1'
        and anchor.metadata->>'record_scope'='official_institution_location'
    )
  into active_offering_count,legacy_anchor_offering_count,verified_offering_anchor_count
  from catalog.programme_offerings po
  join catalog.programmes p on p.id=po.programme_id
  join catalog.institutions i on i.id=p.institution_id
  join catalog.campuses anchor on anchor.id=po.campus_id
  where i.country_code='IE' and p.status='active';

  if active_offering_count<>2876 or legacy_anchor_offering_count<>2876 or verified_offering_anchor_count<>0 then
    raise exception
      'Irish offering anchors changed unexpectedly; offerings %, legacy %, verified %',
      active_offering_count,legacy_anchor_offering_count,verified_offering_anchor_count;
  end if;

  select count(distinct institution_id)
  into displayed_institution_count
  from public.institution_location_ie_v1;

  if displayed_institution_count<>183 then
    raise exception 'Expected display locations for all 183 active Irish institutions, found %',displayed_institution_count;
  end if;
end $$;
