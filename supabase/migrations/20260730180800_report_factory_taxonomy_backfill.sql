-- Canonical occupation identities and first report taxonomy.

create temporary table _occupation_stage (
  occupation_id uuid not null,
  country_code text not null,
  canonical_name text not null,
  name_ko text,
  identifier_system text not null,
  identifier_version text,
  identifier_value text not null,
  source_url text
) on commit drop;

insert into _occupation_stage
select gen_random_uuid(),'AU',x.occupation_en,x.occupation_ko,'ANZSCO',x.identifier_version,x.identifier_value,x.source_url
from (
  select distinct on (coalesce(anzsco_v13,anzsco_code)) occupation_en,occupation_ko,
         case when anzsco_v13 is not null then 'v1.3' else null end identifier_version,
         coalesce(anzsco_v13,anzsco_code) identifier_value,source_url
  from public.occupations_au
  where coalesce(anzsco_v13,anzsco_code) is not null
  order by coalesce(anzsco_v13,anzsco_code),last_verified desc nulls last,id
) x;

insert into _occupation_stage
select gen_random_uuid(),'CA',x.occupation_en,x.occupation_ko,'NOC','2021',x.noc_code,null
from (
  select distinct on (noc_code) occupation_en,occupation_ko,noc_code
  from public.occupations_ca where noc_code is not null
  order by noc_code,last_verified desc nulls last,id
) x;

insert into _occupation_stage
select gen_random_uuid(),'UK',x.occupation_en,x.occupation_ko,'SOC','2020',x.soc_code,x.source_url
from (
  select distinct on (soc_code) occupation_en,occupation_ko,soc_code,source_url
  from public.occupations_uk where soc_code is not null
  order by soc_code,last_verified desc nulls last,id
) x;

insert into taxonomy.occupations(id,country_code,canonical_name,name_ko,status,metadata)
select occupation_id,country_code,canonical_name,name_ko,'active',jsonb_build_object('canonicalised_at','2026-07-30')
from _occupation_stage;

insert into taxonomy.occupation_identifiers(occupation_id,identifier_system,identifier_version,identifier_value,source_url)
select occupation_id,identifier_system,identifier_version,identifier_value,source_url
from _occupation_stage
on conflict do nothing;

insert into catalog.legacy_entity_map(legacy_schema,legacy_table,legacy_key,entity_type,entity_id,metadata)
select 'public','occupations_au',o.id::text,'occupation',oi.occupation_id,jsonb_build_object('country','AU')
from public.occupations_au o
join taxonomy.occupation_identifiers oi on oi.identifier_system='ANZSCO' and oi.identifier_value=coalesce(o.anzsco_v13,o.anzsco_code)
union all
select 'public','occupations_ca',o.id::text,'occupation',oi.occupation_id,jsonb_build_object('country','CA')
from public.occupations_ca o
join taxonomy.occupation_identifiers oi on oi.identifier_system='NOC' and oi.identifier_value=o.noc_code
union all
select 'public','occupations_uk',o.id::text,'occupation',oi.occupation_id,jsonb_build_object('country','UK')
from public.occupations_uk o
join taxonomy.occupation_identifiers oi on oi.identifier_system='SOC' and oi.identifier_value=o.soc_code
on conflict (legacy_schema,legacy_table,legacy_key,entity_type)
do update set entity_id=excluded.entity_id,metadata=excluded.metadata,migrated_at=now();

insert into taxonomy.study_concepts(concept_key,slug,concept_type,canonical_name,name_ko,status,metadata)
values ('nursing','nursing','study_field','Nursing','간호학','active',jsonb_build_object('first_report_vertical',true))
on conflict (concept_key)
do update set canonical_name=excluded.canonical_name,name_ko=excluded.name_ko,status='active',updated_at=now();

insert into taxonomy.programme_concepts(programme_id,concept_id,relation_type,confidence)
select p.id,c.id,'primary','medium'
from catalog.programmes p
cross join taxonomy.study_concepts c
where c.concept_key='nursing'
  and (lower(p.canonical_title) like '%nurs%' or lower(coalesce(p.field_name,'')) like '%nurs%')
on conflict (programme_id,concept_id)
do update set relation_type='primary',confidence='medium';

insert into taxonomy.concept_occupations(concept_id,occupation_id,relation_type,confidence)
select c.id,o.id,'common','medium'
from taxonomy.study_concepts c
cross join taxonomy.occupations o
where c.concept_key='nursing' and lower(o.canonical_name) like '%nurs%'
on conflict (concept_id,occupation_id)
do update set relation_type='common',confidence='medium';