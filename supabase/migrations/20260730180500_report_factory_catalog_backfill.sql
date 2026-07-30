-- Backfill the canonical Report Factory model from the legacy public datasets.
-- Source tables are reclassified in the following migration, not deleted here.

-- One migration-level source snapshot preserves the legacy row lineage.
insert into evidence.sources(source_key,organisation_name,source_name,source_type,canonical_url,active)
values ('legacy-public-schema-20260730','CampCareer','Legacy public schema cutover 2026-07-30','internal','supabase://public-schema/2026-07-30',true)
on conflict (source_key) do update set active=true,updated_at=now();

insert into evidence.source_snapshots(source_id,source_url,content_sha256,data_as_of,retrieved_at,snapshot_status,metadata)
select id,'supabase://public-schema/2026-07-30','legacy-public-schema-20260730','2026-07-30',now(),'captured',
       jsonb_build_object('purpose','canonical cutover','review_status','review_required')
from evidence.sources where source_key='legacy-public-schema-20260730'
on conflict do nothing;

-- Cities become shared geographies.
insert into core.geographies(country_code,geography_type,code,name,region_code,latitude,longitude,metadata)
select 'AU','city',city_slug,name,state,null,null,jsonb_build_object('legacy_table','cities_au') from public.cities_au
union all select 'CA','city',city_slug,name,province,null,null,jsonb_build_object('legacy_table','cities_ca') from public.cities_ca
union all select 'IE','city',city_slug,name,region,null,null,jsonb_build_object('legacy_table','cities_ie') from public.cities_ie
union all select 'UK','city',city_slug,name,region,null,null,jsonb_build_object('legacy_table','cities_uk') from public.cities_uk
union all select 'US','city',city_slug,name,state,null,null,jsonb_build_object('legacy_table','cities_us') from public.cities_us
on conflict do nothing;

insert into catalog.legacy_entity_map(legacy_schema,legacy_table,legacy_key,entity_type,entity_id,metadata)
select 'public','cities_au',c.id::text,'geography',g.id,jsonb_build_object('country','AU')
from public.cities_au c join core.geographies g on g.country_code='AU' and g.geography_type='city' and lower(g.name)=lower(c.name) and coalesce(g.region_code,'')=coalesce(c.state,'')
union all
select 'public','cities_ca',c.id::text,'geography',g.id,jsonb_build_object('country','CA')
from public.cities_ca c join core.geographies g on g.country_code='CA' and g.geography_type='city' and lower(g.name)=lower(c.name) and coalesce(g.region_code,'')=coalesce(c.province,'')
union all
select 'public','cities_ie',c.id::text,'geography',g.id,jsonb_build_object('country','IE')
from public.cities_ie c join core.geographies g on g.country_code='IE' and g.geography_type='city' and lower(g.name)=lower(c.name) and coalesce(g.region_code,'')=coalesce(c.region,'')
union all
select 'public','cities_uk',c.id::text,'geography',g.id,jsonb_build_object('country','UK')
from public.cities_uk c join core.geographies g on g.country_code='UK' and g.geography_type='city' and lower(g.name)=lower(c.name) and coalesce(g.region_code,'')=coalesce(c.region,'')
union all
select 'public','cities_us',c.id::text,'geography',g.id,jsonb_build_object('country','US')
from public.cities_us c join core.geographies g on g.country_code='US' and g.geography_type='city' and lower(g.name)=lower(c.name) and coalesce(g.region_code,'')=coalesce(c.state,'')
on conflict (legacy_schema,legacy_table,legacy_key,entity_type) do update set entity_id=excluded.entity_id,metadata=excluded.metadata,migrated_at=now();

-- Institutions from all existing country catalogues.
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
select gen_random_uuid() as campus_id,'colleges_au'::text legacy_table,c.id::text legacy_key,i.id institution_id,coalesce(c.city,'Main')||' listed campus' name,c.city,c.state region,'AU' country_code,g.id geography_id
from public.colleges_au c join catalog.institutions i on i.country_code='AU' and lower(i.canonical_name)=lower(c.name) left join core.geographies g on g.country_code='AU' and g.geography_type='city' and lower(g.name)=lower(c.city) and coalesce(g.region_code,'')=coalesce(c.state,'')
union all select gen_random_uuid(),'colleges_ca',c.id::text,i.id,coalesce(c.city,'Main')||' listed campus',c.city,c.province,'CA',g.id from public.colleges_ca c join catalog.institutions i on i.country_code='CA' and lower(i.canonical_name)=lower(c.name) left join core.geographies g on g.country_code='CA' and g.geography_type='city' and lower(g.name)=lower(c.city) and coalesce(g.region_code,'')=coalesce(c.province,'')
union all select gen_random_uuid(),'colleges_ie',c.id::text,i.id,coalesce(c.city,'Main')||' listed campus',c.city,c.region,'IE',g.id from public.colleges_ie c join catalog.institutions i on i.country_code='IE' and lower(i.canonical_name)=lower(c.name) left join core.geographies g on g.country_code='IE' and g.geography_type='city' and lower(g.name)=lower(c.city) and coalesce(g.region_code,'')=coalesce(c.region,'')
union all select gen_random_uuid(),'colleges_uk',c.id::text,i.id,coalesce(c.city,'Main')||' listed campus',c.city,c.region,'UK',g.id from public.colleges_uk c join catalog.institutions i on i.country_code='UK' and lower(i.canonical_name)=lower(c.name) left join core.geographies g on g.country_code='UK' and g.geography_type='city' and lower(g.name)=lower(c.city) and coalesce(g.region_code,'')=coalesce(c.region,'')
union all select gen_random_uuid(),'colleges_us',c.id::text,i.id,coalesce(c.city,'Main')||' listed campus',c.city,c.state,'US',g.id from public.colleges_us c join catalog.institutions i on i.country_code='US' and lower(i.canonical_name)=lower(c.name) left join core.geographies g on g.country_code='US' and g.geography_type='city' and lower(g.name)=lower(c.city) and coalesce(g.region_code,'')=coalesce(c.state,'')
union all select gen_random_uuid(),'colleges_nl',c.id::text,i.id,coalesce(c.city,'Main')||' listed campus',c.city,c.province,'NL',null::uuid from public.colleges_nl c join catalog.institutions i on i.country_code='NL' and lower(i.canonical_name)=lower(c.name);

insert into catalog.campuses(id,institution_id,name,city,region,country_code,latitude,longitude,geography_id,status)
select s.campus_id,s.institution_id,s.name,s.city,s.region,s.country_code,
       case when s.legacy_table='colleges_ie' then c_ie.lat when s.legacy_table='colleges_nl' then c_nl.lat::double precision else null end,
       case when s.legacy_table='colleges_ie' then c_ie.lng when s.legacy_table='colleges_nl' then c_nl.lng::double precision else null end,
       s.geography_id,'active'
from _campus_stage s
left join public.colleges_ie c_ie on s.legacy_table='colleges_ie' and s.legacy_key=c_ie.id::text
left join public.colleges_nl c_nl on s.legacy_table='colleges_nl' and s.legacy_key=c_nl.id::text
on conflict do nothing;

insert into catalog.legacy_entity_map(legacy_schema,legacy_table,legacy_key,entity_type,entity_id)
select 'public',legacy_table,legacy_key,'campus',campus_id from _campus_stage
on conflict (legacy_schema,legacy_table,legacy_key,entity_type) do update set entity_id=excluded.entity_id,migrated_at=now();

-- Programme stage gives every legacy course a deterministic canonical programme and offering ID.
create temporary table _programme_stage on commit drop as
select gen_random_uuid() programme_id,gen_random_uuid() offering_id,gen_random_uuid() evidence_id,
       'courses_au'::text legacy_table,c.id::text legacy_key,'AU'::text country_code,ii.institution_id,
       c.title canonical_title,ql.id qualification_level_id,c.course_type programme_type,c.broad_field field_code,c.field_name,
       case when c.duration_years is null then null else round(c.duration_years*12)::integer end duration_months,
       case c.cricos_status when 'active' then 'active' when 'expired' then 'inactive' else 'unknown' end status,
       coalesce(c.official_course_url,c.cricos_url) source_url,c.tuition_fee_aud::numeric fee_amount,'AUD'::text currency_code
from public.courses_au c
join catalog.institution_identifiers ii on ii.identifier_system='AU_PROVIDER_ID' and ii.identifier_value=c.institution_id
left join core.qualification_frameworks qf on qf.country_code='AU' and qf.framework_code='AQF'
left join core.qualification_levels ql on ql.framework_id=qf.id and ql.level_code=c.aqf_level::text
union all
select gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),'courses_ca',c.id::text,'CA',ii.institution_id,c.title,null::uuid,c.credential_type,c.noc_code,c.field_name,case when c.duration_years is null then null else round(c.duration_years*12)::integer end,'active',null::text,c.tuition_fee_cad::numeric,'CAD'
from public.courses_ca c join catalog.institution_identifiers ii on ii.identifier_system='CA_PROVIDER_ID' and ii.identifier_value=c.institution_id
union all
select gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),'courses_uk',c.id::text,'UK',ii.institution_id,c.title,null::uuid,c.credential_type,null::text,c.field_name,case when c.duration_years is null then null else round(c.duration_years*12)::integer end,'active',null::text,c.tuition_fee_gbp::numeric,'GBP'
from public.courses_uk c join catalog.institution_identifiers ii on ii.identifier_system='UK_PROVIDER_ID' and ii.identifier_value=c.institution_id
union all
select gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),'courses_ie',c.id::text,'IE',ii.institution_id,c.title,ql.id,c.course_type,c.cao_code,c.field_name,case when c.duration_years is null then null else round(c.duration_years*12)::integer end,'active',c.qualifax_url,null::numeric,'EUR'
from public.courses_ie c
join catalog.institution_identifiers ii on ii.identifier_system='IE_PROVIDER_ID' and ii.identifier_value=c.institution_id
left join core.qualification_frameworks qf on qf.country_code='IE' and qf.framework_code='NFQ'
left join core.qualification_levels ql on ql.framework_id=qf.id and ql.level_code=c.nfq_level::text;

insert into catalog.programmes(id,institution_id,canonical_title,qualification_level_id,programme_type,field_code,field_name,default_duration_months,status)
select programme_id,institution_id,canonical_title,qualification_level_id,programme_type,field_code,field_name,duration_months,status from _programme_stage;

insert into catalog.legacy_entity_map(legacy_schema,legacy_table,legacy_key,entity_type,entity_id,metadata)
select 'public',legacy_table,legacy_key,'programme',programme_id,jsonb_build_object('country',country_code) from _programme_stage
on conflict (legacy_schema,legacy_table,legacy_key,entity_type) do update set entity_id=excluded.entity_id,metadata=excluded.metadata,migrated_at=now();

insert into catalog.programme_identifiers(programme_id,identifier_system,identifier_value,source_url)
select programme_id,'LEGACY_'||upper(legacy_table)||'_ID',legacy_key,source_url from _programme_stage
on conflict (identifier_system,identifier_value) do update set programme_id=excluded.programme_id,source_url=excluded.source_url;

insert into catalog.programme_identifiers(programme_id,identifier_system,identifier_value,source_url)
select s.programme_id,'CRICOS',c.cricos_code,s.source_url from _programme_stage s join public.courses_au c on s.legacy_table='courses_au' and s.legacy_key=c.id::text where c.cricos_code is not null and c.cricos_code<>''
on conflict (identifier_system,identifier_value) do update set programme_id=excluded.programme_id,source_url=excluded.source_url;

insert into catalog.programme_identifiers(programme_id,identifier_system,identifier_value,source_url)
select s.programme_id,'PROVIDER_COURSE_CODE',s.country_code||':'||c.institution_id||':'||c.course_code,s.source_url from _programme_stage s join public.courses_au c on s.legacy_table='courses_au' and s.legacy_key=c.id::text where c.course_code is not null
union all select s.programme_id,'PROVIDER_COURSE_CODE','CA:'||c.institution_id||':'||c.course_code,s.source_url from _programme_stage s join public.courses_ca c on s.legacy_table='courses_ca' and s.legacy_key=c.id::text where c.course_code is not null
union all select s.programme_id,'PROVIDER_COURSE_CODE','IE:'||c.institution_id||':'||coalesce(c.course_code,c.cao_code),s.source_url from _programme_stage s join public.courses_ie c on s.legacy_table='courses_ie' and s.legacy_key=c.id::text where coalesce(c.course_code,c.cao_code) is not null
on conflict (identifier_system,identifier_value) do update set programme_id=excluded.programme_id,source_url=excluded.source_url;

insert into catalog.programme_offerings(id,programme_id,campus_id,market,intake_label,duration_months,enrolment_status,source_url)
select s.offering_id,s.programme_id,
       (select c.id from catalog.campuses c where c.institution_id=s.institution_id order by c.created_at,c.id limit 1),
       'international','Legacy imported offering',s.duration_months,'unknown',s.source_url
from _programme_stage s;

insert into catalog.legacy_entity_map(legacy_schema,legacy_table,legacy_key,entity_type,entity_id,metadata)
select 'public',legacy_table,legacy_key,'offering',offering_id,jsonb_build_object('country',country_code) from _programme_stage
on conflict (legacy_schema,legacy_table,legacy_key,entity_type) do update set entity_id=excluded.entity_id,metadata=excluded.metadata,migrated_at=now();

insert into evidence.metric_observations(id,metric_key,scope_type,scope_id,value,unit,source_snapshot_id,evidence_kind,confidence,methodology,assumptions,review_status)
select s.evidence_id,'annual_tuition','programme',s.programme_id::text,
       jsonb_build_object('amount',s.fee_amount,'currency',s.currency_code,'billing_basis','annual'),s.currency_code,
       ss.id,'observed','medium','Imported from legacy course catalogue',jsonb_build_object('legacy_table',s.legacy_table,'legacy_key',s.legacy_key),'review_required'
from _programme_stage s
cross join evidence.source_snapshots ss
join evidence.sources es on es.id=ss.source_id and es.source_key='legacy-public-schema-20260730'
where s.fee_amount is not null and s.fee_amount>0;

insert into catalog.programme_fees(offering_id,fee_type,amount,currency_code,billing_basis,student_market,evidence_id)
select offering_id,'tuition',fee_amount,currency_code,'annual','international',evidence_id from _programme_stage where fee_amount is not null and fee_amount>0;

-- Canonical occupation identities. Detailed source observations remain in ingest.
create temporary table _occupation_stage on commit drop as
select gen_random_uuid() occupation_id,'occupations_au'::text legacy_table,o.id::text legacy_key,'AU'::text country_code,
       o.occupation_en canonical_name,o.occupation_ko name_ko,'ANZSCO'::text identifier_system,
       case when o.anzsco_v13 is not null then 'v1.3' else null end identifier_version,coalesce(o.anzsco_v13,o.anzsco_code) identifier_value,o.source_url
from public.occupations_au o where coalesce(o.anzsco_v13,o.anzsco_code) is not null
union all
select gen_random_uuid(),'occupations_ca',o.id::text,'CA',o.occupation_en,o.occupation_ko,'NOC','2021',o.noc_code,null::text from public.occupations_ca o where o.noc_code is not null
union all
select gen_random_uuid(),'occupations_uk',o.id::text,'UK',o.occupation_en,o.occupation_ko,'SOC','2020',o.soc_code,o.source_url from public.occupations_uk o where o.soc_code is not null;

insert into taxonomy.occupations(id,country_code,canonical_name,name_ko,status,metadata)
select occupation_id,country_code,canonical_name,name_ko,'active',jsonb_build_object('legacy_table',legacy_table,'legacy_key',legacy_key) from _occupation_stage;
insert into taxonomy.occupation_identifiers(occupation_id,identifier_system,identifier_version,identifier_value,source_url)
select occupation_id,identifier_system,identifier_version,identifier_value,source_url from _occupation_stage
on conflict do nothing;
insert into catalog.legacy_entity_map(legacy_schema,legacy_table,legacy_key,entity_type,entity_id,metadata)
select 'public',legacy_table,legacy_key,'occupation',occupation_id,jsonb_build_object('country',country_code) from _occupation_stage
on conflict (legacy_schema,legacy_table,legacy_key,entity_type) do update set entity_id=excluded.entity_id,metadata=excluded.metadata,migrated_at=now();

-- Nursing is the first controlled report vertical.
insert into taxonomy.study_concepts(concept_key,slug,concept_type,canonical_name,name_ko,status,metadata)
values ('nursing','nursing','study_field','Nursing','간호학','active',jsonb_build_object('first_report_vertical',true))
on conflict (concept_key) do update set canonical_name=excluded.canonical_name,name_ko=excluded.name_ko,status='active',updated_at=now();

insert into taxonomy.programme_concepts(programme_id,concept_id,relation_type,confidence)
select p.id,c.id,'primary','medium'
from catalog.programmes p cross join taxonomy.study_concepts c
where c.concept_key='nursing' and (lower(p.canonical_title) like '%nurs%' or lower(coalesce(p.field_name,'')) like '%nurs%')
on conflict (programme_id,concept_id) do update set relation_type='primary',confidence='medium';

insert into taxonomy.concept_occupations(concept_id,occupation_id,relation_type,confidence)
select c.id,o.id,'common','medium'
from taxonomy.study_concepts c cross join taxonomy.occupations o
where c.concept_key='nursing' and lower(o.canonical_name) like '%nurs%'
on conflict (concept_id,occupation_id) do update set relation_type='common',confidence='medium';