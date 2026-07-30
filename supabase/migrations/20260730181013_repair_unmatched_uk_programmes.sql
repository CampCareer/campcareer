-- Recover UK programmes whose provider did not exist in the legacy college catalogue.

insert into catalog.institutions(country_code,canonical_name,institution_type,status)
select distinct 'UK',initcap(replace(c.institution_id,'-',' ')),'education_provider','active'
from ingest.courses_uk c
left join catalog.legacy_entity_map m
  on m.legacy_schema='public' and m.legacy_table='courses_uk' and m.legacy_key=c.id::text and m.entity_type='programme'
where m.entity_id is null and c.institution_id is not null
on conflict do nothing;

insert into catalog.institution_identifiers(institution_id,identifier_system,identifier_value)
select distinct i.id,'UK_PROVIDER_ID',c.institution_id
from ingest.courses_uk c
join catalog.institutions i
  on i.country_code='UK' and lower(i.canonical_name)=lower(initcap(replace(c.institution_id,'-',' ')))
left join catalog.legacy_entity_map m
  on m.legacy_schema='public' and m.legacy_table='courses_uk' and m.legacy_key=c.id::text and m.entity_type='programme'
where m.entity_id is null and c.institution_id is not null
on conflict (identifier_system,identifier_value)
do update set institution_id=excluded.institution_id;

insert into catalog.campuses(institution_id,name,country_code,status)
select distinct i.id,'Main listed campus','UK','active'
from ingest.courses_uk c
join catalog.institution_identifiers ii
  on ii.identifier_system='UK_PROVIDER_ID' and ii.identifier_value=c.institution_id
join catalog.institutions i on i.id=ii.institution_id
left join catalog.campuses ca on ca.institution_id=i.id
where ca.id is null
on conflict do nothing;

insert into catalog.programmes(
  id,institution_id,canonical_title,programme_type,field_name,default_duration_months,status
)
select md5('courses_uk:'||c.id::text)::uuid,ii.institution_id,c.title,c.credential_type,c.field_name,
       case when c.duration_years is null then null else round(c.duration_years*12)::integer end,'active'
from ingest.courses_uk c
join catalog.institution_identifiers ii
  on ii.identifier_system='UK_PROVIDER_ID' and ii.identifier_value=c.institution_id
left join catalog.legacy_entity_map m
  on m.legacy_schema='public' and m.legacy_table='courses_uk' and m.legacy_key=c.id::text and m.entity_type='programme'
where m.entity_id is null
on conflict (id) do nothing;

insert into catalog.programme_offerings(
  id,programme_id,campus_id,market,intake_label,duration_months,enrolment_status
)
select md5('courses_uk:offering:'||c.id::text)::uuid,md5('courses_uk:'||c.id::text)::uuid,
       (select ca.id from catalog.campuses ca where ca.institution_id=ii.institution_id order by ca.created_at,ca.id limit 1),
       'international','Legacy imported offering',
       case when c.duration_years is null then null else round(c.duration_years*12)::integer end,'unknown'
from ingest.courses_uk c
join catalog.institution_identifiers ii
  on ii.identifier_system='UK_PROVIDER_ID' and ii.identifier_value=c.institution_id
left join catalog.legacy_entity_map m
  on m.legacy_schema='public' and m.legacy_table='courses_uk' and m.legacy_key=c.id::text and m.entity_type='offering'
where m.entity_id is null
on conflict (id) do nothing;

insert into catalog.legacy_entity_map(legacy_schema,legacy_table,legacy_key,entity_type,entity_id,metadata)
select 'public','courses_uk',c.id::text,'programme',md5('courses_uk:'||c.id::text)::uuid,
       jsonb_build_object('country','UK','repair','unmatched_provider')
from ingest.courses_uk c
left join catalog.legacy_entity_map m
  on m.legacy_schema='public' and m.legacy_table='courses_uk' and m.legacy_key=c.id::text and m.entity_type='programme'
where m.entity_id is null
union all
select 'public','courses_uk',c.id::text,'offering',md5('courses_uk:offering:'||c.id::text)::uuid,
       jsonb_build_object('country','UK','repair','unmatched_provider')
from ingest.courses_uk c
left join catalog.legacy_entity_map m
  on m.legacy_schema='public' and m.legacy_table='courses_uk' and m.legacy_key=c.id::text and m.entity_type='offering'
where m.entity_id is null
on conflict (legacy_schema,legacy_table,legacy_key,entity_type)
do update set entity_id=excluded.entity_id,metadata=excluded.metadata,migrated_at=now();

insert into catalog.programme_identifiers(programme_id,identifier_system,identifier_value)
select md5('courses_uk:'||c.id::text)::uuid,'LEGACY_COURSES_UK_ID',c.id::text
from ingest.courses_uk c
join catalog.legacy_entity_map m
  on m.legacy_schema='public' and m.legacy_table='courses_uk' and m.legacy_key=c.id::text and m.entity_type='programme'
where m.entity_id=md5('courses_uk:'||c.id::text)::uuid
on conflict (identifier_system,identifier_value)
do update set programme_id=excluded.programme_id;

insert into evidence.metric_observations(
  id,metric_key,scope_type,scope_id,value,unit,source_snapshot_id,evidence_kind,confidence,
  methodology,assumptions,review_status
)
select md5('courses_uk:tuition:'||c.id::text)::uuid,'annual_tuition','programme',
       md5('courses_uk:'||c.id::text)::uuid::text,
       jsonb_build_object('amount',c.tuition_fee_gbp,'currency','GBP','billing_basis','annual'),'GBP',
       ss.id,'observed','medium','Recovered unmatched legacy programme',
       jsonb_build_object('legacy_table','courses_uk','legacy_key',c.id),'review_required'
from ingest.courses_uk c
join catalog.legacy_entity_map m
  on m.legacy_schema='public' and m.legacy_table='courses_uk' and m.legacy_key=c.id::text and m.entity_type='programme'
join evidence.sources es on es.source_key='legacy-public-schema-20260730'
join evidence.source_snapshots ss on ss.source_id=es.id and ss.content_sha256='legacy-public-schema-20260730'
where m.entity_id=md5('courses_uk:'||c.id::text)::uuid and c.tuition_fee_gbp is not null and c.tuition_fee_gbp>0
on conflict (id) do nothing;

insert into catalog.programme_fees(
  offering_id,fee_type,amount,currency_code,billing_basis,student_market,evidence_id
)
select md5('courses_uk:offering:'||c.id::text)::uuid,'tuition',c.tuition_fee_gbp,'GBP','annual','international',
       md5('courses_uk:tuition:'||c.id::text)::uuid
from ingest.courses_uk c
join catalog.legacy_entity_map m
  on m.legacy_schema='public' and m.legacy_table='courses_uk' and m.legacy_key=c.id::text and m.entity_type='offering'
where m.entity_id=md5('courses_uk:offering:'||c.id::text)::uuid and c.tuition_fee_gbp is not null and c.tuition_fee_gbp>0;

insert into taxonomy.programme_concepts(programme_id,concept_id,relation_type,confidence)
select p.id,c.id,'primary','medium'
from catalog.programmes p
cross join taxonomy.study_concepts c
where c.concept_key='nursing'
  and not exists (select 1 from taxonomy.programme_concepts pc where pc.programme_id=p.id and pc.concept_id=c.id)
  and (lower(p.canonical_title) like '%nurs%' or lower(coalesce(p.field_name,'')) like '%nurs%')
on conflict do nothing;