-- Canonical reference backfill: sources, geographies, institutions and campuses.

insert into evidence.sources(source_key,organisation_name,source_name,source_type,canonical_url,active)
values ('legacy-public-schema-20260730','CampCareer','Legacy public schema cutover 2026-07-30','internal','supabase://public-schema/2026-07-30',true)
on conflict (source_key) do update set active=true,updated_at=now();

insert into evidence.source_snapshots(source_id,source_url,content_sha256,data_as_of,retrieved_at,snapshot_status,metadata)
select id,'supabase://public-schema/2026-07-30','legacy-public-schema-20260730','2026-07-30',now(),'captured',jsonb_build_object('purpose','canonical cutover','review_status','review_required')
from evidence.sources where source_key='legacy-public-schema-20260730'
on conflict do nothing;

insert into core.geographies(country_code,geography_type,code,name,region_code,latitude,longitude,metadata)
select 'AU','city',city_slug,name,state,null::numeric,null::numeric,jsonb_build_object('legacy_table','cities_au') from public.cities_au
union all select 'CA','city',city_slug,name,province,null::numeric,null::numeric,jsonb_build_object('legacy_table','cities_ca') from public.cities_ca
union all select 'IE','city',city_slug,name,region,null::numeric,null::numeric,jsonb_build_object('legacy_table','cities_ie') from public.cities_ie
union all select 'UK','city',city_slug,name,region,null::numeric,null::numeric,jsonb_build_object('legacy_table','cities_uk') from public.cities_uk
union all select 'US','city',city_slug,name,state,null::numeric,null::numeric,jsonb_build_object('legacy_table','cities_us') from public.cities_us
union all select 'NL','city',null::text,city,province,lat,lng,jsonb_build_object('legacy_table','colleges_nl') from public.colleges_nl where city is not null
on conflict do nothing;

insert into catalog.legacy_entity_map(legacy_schema,legacy_table,legacy_key,entity_type,entity_id,metadata)
select 'public','cities_au',c.id::text,'geography',g.id,jsonb_build_object('country','AU') from public.cities_au c join core.geographies g on g.country_code='AU' and g.geography_type='city' and lower(g.name)=lower(c.name) and coalesce(g.region_code,'')=coalesce(c.state,'')
union all select 'public','cities_ca',c.id::text,'geography',g.id,jsonb_build_object('country','CA') from public.cities_ca c join core.geographies g on g.country_code='CA' and g.geography_type='city' and lower(g.name)=lower(c.name) and coalesce(g.region_code,'')=coalesce(c.province,'')
union all select 'public','cities_ie',c.id::text,'geography',g.id,jsonb_build_object('country','IE') from public.cities_ie c join core.geographies g on g.country_code='IE' and g.geography_type='city' and lower(g.name)=lower(c.name) and coalesce(g.region_code,'')=coalesce(c.region,'')
union all select 'public','cities_uk',c.id::text,'geography',g.id,jsonb_build_object('country','UK') from public.cities_uk c join core.geographies g on g.country_code='UK' and g.geography_type='city' and lower(g.name)=lower(c.name) and coalesce(g.region_code,'')=coalesce(c.region,'')
union all select 'public','cities_us',c.id::text,'geography',g.id,jsonb_build_object('country','US') from public.cities_us c join core.geographies g on g.country_code='US' and g.geography_type='city' and lower(g.name)=lower(c.name) and coalesce(g.region_code,'')=coalesce(c.state,'')
on conflict (legacy_schema,legacy_table,legacy_key,entity_type) do update set entity_id=excluded.entity_id,metadata=excluded.metadata,migrated_at=now();

insert into catalog.institutions(country_code,canonical_name,institution_type,website_url,status)
select 'AU',name,school_type,website_url,'active' from public.colleges_au
union all select 'CA',name,school_type,coalesce(website_url,website),'active' from public.colleges_ca
union all select 'IE',name,school_type,website_url,'active' from public.colleges_ie
union all select 'UK',name,school_type,website_url,'active' from public.colleges_uk
union all select 'US',name,school_type,website_url,'active' from public.colleges_us
union all select 'NL',name,'university',website,'active' from public.colleges_nl
on conflict do nothing;

insert into catalog.institution_identifiers(institution_id,identifier_system,identifier_value,source_url)
select i.id,'AU_PROVIDER_ID',c.institution_id,c.website_url from public.colleges_au c join catalog.institutions i on i.country_code='AU' and lower(i.canonical_name)=lower(c.name)
union all select i.id,'CA_PROVIDER_ID',c.institution_id,coalesce(c.website_url,c.website) from public.colleges_ca c join catalog.institutions i on i.country_code='CA' and lower(i.canonical_name)=lower(c.name)
union all select i.id,'IE_PROVIDER_ID',c.institution_id,c.website_url from public.colleges_ie c join catalog.institutions i on i.country_code='IE' and lower(i.canonical_name)=lower(c.name)
union all select i.id,'UK_PROVIDER_ID',c.institution_id,c.website_url from public.colleges_uk c join catalog.institutions i on i.country_code='UK' and lower(i.canonical_name)=lower(c.name)
union all select i.id,'US_UNIT_ID',c.unit_id,c.website_url from public.colleges_us c join catalog.institutions i on i.country_code='US' and lower(i.canonical_name)=lower(c.name)
union all select i.id,'NL_PROVIDER_ID',c.institution_id,c.website from public.colleges_nl c join catalog.institutions i on i.country_code='NL' and lower(i.canonical_name)=lower(c.name)
on conflict (identifier_system,identifier_value) do update set institution_id=excluded.institution_id,source_url=excluded.source_url;

insert into catalog.legacy_entity_map(legacy_schema,legacy_table,legacy_key,entity_type,entity_id,metadata)
select 'public','colleges_au',c.id::text,'institution',i.id,jsonb_build_object('provider_id',c.institution_id) from public.colleges_au c join catalog.institutions i on i.country_code='AU' and lower(i.canonical_name)=lower(c.name)
union all select 'public','colleges_ca',c.id::text,'institution',i.id,jsonb_build_object('provider_id',c.institution_id) from public.colleges_ca c join catalog.institutions i on i.country_code='CA' and lower(i.canonical_name)=lower(c.name)
union all select 'public','colleges_ie',c.id::text,'institution',i.id,jsonb_build_object('provider_id',c.institution_id) from public.colleges_ie c join catalog.institutions i on i.country_code='IE' and lower(i.canonical_name)=lower(c.name)
union all select 'public','colleges_uk',c.id::text,'institution',i.id,jsonb_build_object('provider_id',c.institution_id) from public.colleges_uk c join catalog.institutions i on i.country_code='UK' and lower(i.canonical_name)=lower(c.name)
union all select 'public','colleges_us',c.id::text,'institution',i.id,jsonb_build_object('unit_id',c.unit_id) from public.colleges_us c join catalog.institutions i on i.country_code='US' and lower(i.canonical_name)=lower(c.name)
union all select 'public','colleges_nl',c.id::text,'institution',i.id,jsonb_build_object('provider_id',c.institution_id) from public.colleges_nl c join catalog.institutions i on i.country_code='NL' and lower(i.canonical_name)=lower(c.name)
on conflict (legacy_schema,legacy_table,legacy_key,entity_type) do update set entity_id=excluded.entity_id,metadata=excluded.metadata,migrated_at=now();

create temporary table _campus_stage on commit drop as
select gen_random_uuid() campus_id,'colleges_au'::text legacy_table,c.id::text legacy_key,i.id institution_id,coalesce(c.city,'Main')||' listed campus' name,c.city,c.state region,'AU'::text country_code,g.id geography_id,null::numeric latitude,null::numeric longitude
from public.colleges_au c join catalog.institutions i on i.country_code='AU' and lower(i.canonical_name)=lower(c.name) left join core.geographies g on g.country_code='AU' and g.geography_type='city' and lower(g.name)=lower(c.city) and coalesce(g.region_code,'')=coalesce(c.state,'')
union all select gen_random_uuid(),'colleges_ca',c.id::text,i.id,coalesce(c.city,'Main')||' listed campus',c.city,c.province,'CA',g.id,null::numeric,null::numeric from public.colleges_ca c join catalog.institutions i on i.country_code='CA' and lower(i.canonical_name)=lower(c.name) left join core.geographies g on g.country_code='CA' and g.geography_type='city' and lower(g.name)=lower(c.city) and coalesce(g.region_code,'')=coalesce(c.province,'')
union all select gen_random_uuid(),'colleges_ie',c.id::text,i.id,coalesce(c.city,'Main')||' listed campus',c.city,c.region,'IE',g.id,c.lat::numeric,c.lng::numeric from public.colleges_ie c join catalog.institutions i on i.country_code='IE' and lower(i.canonical_name)=lower(c.name) left join core.geographies g on g.country_code='IE' and g.geography_type='city' and lower(g.name)=lower(c.city) and coalesce(g.region_code,'')=coalesce(c.region,'')
union all select gen_random_uuid(),'colleges_uk',c.id::text,i.id,coalesce(c.city,'Main')||' listed campus',c.city,c.region,'UK',g.id,null::numeric,null::numeric from public.colleges_uk c join catalog.institutions i on i.country_code='UK' and lower(i.canonical_name)=lower(c.name) left join core.geographies g on g.country_code='UK' and g.geography_type='city' and lower(g.name)=lower(c.city) and coalesce(g.region_code,'')=coalesce(c.region,'')
union all select gen_random_uuid(),'colleges_us',c.id::text,i.id,coalesce(c.city,'Main')||' listed campus',c.city,c.state,'US',g.id,null::numeric,null::numeric from public.colleges_us c join catalog.institutions i on i.country_code='US' and lower(i.canonical_name)=lower(c.name) left join core.geographies g on g.country_code='US' and g.geography_type='city' and lower(g.name)=lower(c.city) and coalesce(g.region_code,'')=coalesce(c.state,'')
union all select gen_random_uuid(),'colleges_nl',c.id::text,i.id,coalesce(c.city,'Main')||' listed campus',c.city,c.province,'NL',g.id,c.lat,c.lng from public.colleges_nl c join catalog.institutions i on i.country_code='NL' and lower(i.canonical_name)=lower(c.name) left join core.geographies g on g.country_code='NL' and g.geography_type='city' and lower(g.name)=lower(c.city) and coalesce(g.region_code,'')=coalesce(c.province,'');

insert into catalog.campuses(id,institution_id,name,city,region,country_code,latitude,longitude,geography_id,status)
select campus_id,institution_id,name,city,region,country_code,latitude,longitude,geography_id,'active' from _campus_stage
on conflict do nothing;

insert into catalog.legacy_entity_map(legacy_schema,legacy_table,legacy_key,entity_type,entity_id)
select 'public',legacy_table,legacy_key,'campus',campus_id from _campus_stage
on conflict (legacy_schema,legacy_table,legacy_key,entity_type) do update set entity_id=excluded.entity_id,migrated_at=now();