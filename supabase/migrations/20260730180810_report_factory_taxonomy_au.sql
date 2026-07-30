create temporary table _occupation_au on commit drop as
select gen_random_uuid() occupation_id,x.occupation_en canonical_name,x.occupation_ko name_ko,
       'ANZSCO'::text identifier_system,x.identifier_version,x.identifier_value,x.source_url
from (
  select distinct on (coalesce(anzsco_v13,anzsco_code)) occupation_en,occupation_ko,
         case when anzsco_v13 is not null then 'v1.3' else null end identifier_version,
         coalesce(anzsco_v13,anzsco_code) identifier_value,source_url
  from public.occupations_au
  where coalesce(anzsco_v13,anzsco_code) is not null
  order by coalesce(anzsco_v13,anzsco_code),last_verified desc nulls last,id
) x;

insert into taxonomy.occupations(id,country_code,canonical_name,name_ko,status,metadata)
select occupation_id,'AU',canonical_name,name_ko,'active',jsonb_build_object('canonicalised_at','2026-07-30')
from _occupation_au;

insert into taxonomy.occupation_identifiers(occupation_id,identifier_system,identifier_version,identifier_value,source_url)
select occupation_id,identifier_system,identifier_version,identifier_value,source_url
from _occupation_au
on conflict do nothing;

insert into catalog.legacy_entity_map(legacy_schema,legacy_table,legacy_key,entity_type,entity_id,metadata)
select 'public','occupations_au',o.id::text,'occupation',oi.occupation_id,jsonb_build_object('country','AU')
from public.occupations_au o
join taxonomy.occupation_identifiers oi
  on oi.identifier_system='ANZSCO' and oi.identifier_value=coalesce(o.anzsco_v13,o.anzsco_code)
on conflict (legacy_schema,legacy_table,legacy_key,entity_type)
do update set entity_id=excluded.entity_id,metadata=excluded.metadata,migrated_at=now();