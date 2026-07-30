create temporary table _occupation_ca on commit drop as
select gen_random_uuid() occupation_id,x.occupation_en canonical_name,x.occupation_ko name_ko,
       'NOC'::text identifier_system,'2021'::text identifier_version,x.noc_code identifier_value
from (
  select distinct on (noc_code) occupation_en,occupation_ko,noc_code
  from public.occupations_ca
  where noc_code is not null
  order by noc_code,last_verified desc nulls last,id
) x;

insert into taxonomy.occupations(id,country_code,canonical_name,name_ko,status,metadata)
select occupation_id,'CA',canonical_name,name_ko,'active',jsonb_build_object('canonicalised_at','2026-07-30')
from _occupation_ca;

insert into taxonomy.occupation_identifiers(occupation_id,identifier_system,identifier_version,identifier_value)
select occupation_id,identifier_system,identifier_version,identifier_value
from _occupation_ca
on conflict do nothing;

insert into catalog.legacy_entity_map(legacy_schema,legacy_table,legacy_key,entity_type,entity_id,metadata)
select 'public','occupations_ca',o.id::text,'occupation',oi.occupation_id,jsonb_build_object('country','CA')
from public.occupations_ca o
join taxonomy.occupation_identifiers oi
  on oi.identifier_system='NOC' and oi.identifier_value=o.noc_code
on conflict (legacy_schema,legacy_table,legacy_key,entity_type)
do update set entity_id=excluded.entity_id,metadata=excluded.metadata,migrated_at=now();