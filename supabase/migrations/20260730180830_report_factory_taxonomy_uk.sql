create temporary table _occupation_uk on commit drop as
select gen_random_uuid() occupation_id,x.occupation_en canonical_name,x.occupation_ko name_ko,
       'SOC'::text identifier_system,'2020'::text identifier_version,x.soc_code identifier_value,x.source_url
from (
  select distinct on (soc_code) occupation_en,occupation_ko,soc_code,source_url
  from public.occupations_uk
  where soc_code is not null
  order by soc_code,last_verified desc nulls last,id
) x;

insert into taxonomy.occupations(id,country_code,canonical_name,name_ko,status,metadata)
select occupation_id,'UK',canonical_name,name_ko,'active',jsonb_build_object('canonicalised_at','2026-07-30')
from _occupation_uk;

insert into taxonomy.occupation_identifiers(occupation_id,identifier_system,identifier_version,identifier_value,source_url)
select occupation_id,identifier_system,identifier_version,identifier_value,source_url
from _occupation_uk
on conflict do nothing;

insert into catalog.legacy_entity_map(legacy_schema,legacy_table,legacy_key,entity_type,entity_id,metadata)
select 'public','occupations_uk',o.id::text,'occupation',oi.occupation_id,jsonb_build_object('country','UK')
from public.occupations_uk o
join taxonomy.occupation_identifiers oi
  on oi.identifier_system='SOC' and oi.identifier_value=o.soc_code
on conflict (legacy_schema,legacy_table,legacy_key,entity_type)
do update set entity_id=excluded.entity_id,metadata=excluded.metadata,migrated_at=now();