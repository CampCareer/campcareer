-- Recover legacy IE/UK programmes whose provider identifier was missing or null.

insert into catalog.institutions(country_code,canonical_name,institution_type,status)
select distinct 'IE',trim(c.college_name),'education_provider','active'
from ingest.courses_ie c
left join catalog.legacy_entity_map m
  on m.legacy_schema='public' and m.legacy_table='courses_ie' and m.legacy_key=c.id::text and m.entity_type='programme'
where m.entity_id is null and nullif(trim(c.college_name),'') is not null
union
select distinct 'UK',trim(c.college_name),'education_provider','active'
from ingest.courses_uk c
left join catalog.legacy_entity_map m
  on m.legacy_schema='public' and m.legacy_table='courses_uk' and m.legacy_key=c.id::text and m.entity_type='programme'
where m.entity_id is null and nullif(trim(c.college_name),'') is not null
on conflict do nothing;

insert into catalog.institution_identifiers(institution_id,identifier_system,identifier_value)
select distinct i.id,
       case when c.institution_id is null then 'IE_LEGACY_COLLEGE_NAME' else 'IE_PROVIDER_ID' end,
       case when c.institution_id is null then lower(trim(c.college_name)) else c.institution_id end
from ingest.courses_ie c
join catalog.institutions i on i.country_code='IE' and lower(i.canonical_name)=lower(trim(c.college_name))
left join catalog.legacy_entity_map m
  on m.legacy_schema='public' and m.legacy_table='courses_ie' and m.legacy_key=c.id::text and m.entity_type='programme'
where m.entity_id is null and nullif(trim(c.college_name),'') is not null
on conflict (identifier_system,identifier_value)
do update set institution_id=excluded.institution_id;

insert into catalog.institution_identifiers(institution_id,identifier_system,identifier_value)
select distinct i.id,'UK_PROVIDER_ID',c.institution_id
from ingest.courses_uk c
join catalog.institutions i on i.country_code='UK' and lower(i.canonical_name)=lower(trim(c.college_name))
left join catalog.legacy_entity_map m
  on m.legacy_schema='public' and m.legacy_table='courses_uk' and m.legacy_key=c.id::text and m.entity_type='programme'
where m.entity_id is null and c.institution_id is not null
on conflict (identifier_system,identifier_value)
do update set institution_id=excluded.institution_id;

insert into catalog.campuses(institution_id,name,city,country_code,status)
select distinct i.id,coalesce(nullif(trim(c.city),''),'Main')||' listed campus',nullif(trim(c.city),''),'IE','active'
from ingest.courses_ie c
join catalog.institutions i on i.country_code='IE' and lower(i.canonical_name)=lower(trim(c.college_name))
left join catalog.campuses ca on ca.institution_id=i.id
where ca.id is null and nullif(trim(c.college_name),'') is not null
on conflict do nothing;

insert into catalog.campuses(institution_id,name,country_code,status)
select distinct i.id,'Main listed campus','UK','active'
from ingest.courses_uk c
join catalog.institutions i on i.country_code='UK' and lower(i.canonical_name)=lower(trim(c.college_name))
left join catalog.campuses ca on ca.institution_id=i.id
where ca.id is null and nullif(trim(c.college_name),'') is not null
on conflict do nothing;

create temporary table _missing_programmes (
  programme_id uuid not null,
  offering_id uuid not null,
  evidence_id uuid not null,
  legacy_table text not null,
  legacy_key text not null,
  country_code text not null,
  institution_id uuid not null,
  title text not null,
  qualification_level_id uuid,
  programme_type text,
  field_code text,
  field_name text,
  duration_months integer,
  source_url text,
  fee_amount numeric,
  currency_code text not null
) on commit drop;

insert into _missing_programmes
select gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),'courses_ie',c.id::text,'IE',i.id,c.title,ql.id,c.course_type,c.cao_code,c.field_name,
       case when c.duration_years is null then null else round(c.duration_years*12)::integer end,
       c.qualifax_url,null,'EUR'
from ingest.courses_ie c
join catalog.institutions i on i.country_code='IE' and lower(i.canonical_name)=lower(trim(c.college_name))
left join catalog.legacy_entity_map m
  on m.legacy_schema='public' and m.legacy_table='courses_ie' and m.legacy_key=c.id::text and m.entity_type='programme'
left join core.qualification_frameworks qf on qf.country_code='IE' and qf.framework_code='NFQ'
left join core.qualification_levels ql on ql.framework_id=qf.id and ql.level_code=c.nfq_level::text
where m.entity_id is null
union all
select gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),'courses_uk',c.id::text,'UK',i.id,c.title,null,c.credential_type,null,c.field_name,
       case when c.duration_years is null then null else round(c.duration_years*12)::integer end,
       null,c.tuition_fee_gbp,'GBP'
from ingest.courses_uk c
join catalog.institutions i on i.country_code='UK' and lower(i.canonical_name)=lower(trim(c.college_name))
left join catalog.legacy_entity_map m
  on m.legacy_schema='public' and m.legacy_table='courses_uk' and m.legacy_key=c.id::text and m.entity_type='programme'
where m.entity_id is null;

insert into catalog.programmes(id,institution_id,canonical_title,qualification_level_id,programme_type,field_code,field_name,default_duration_months,status)
select programme_id,institution_id,title,qualification_level_id,programme_type,field_code,field_name,duration_months,'active'
from _missing_programmes;

insert into catalog.programme_offerings(id,programme_id,campus_id,market,intake_label,duration_months,enrolment_status,source_url)
select p.offering_id,p.programme_id,
       (select c.id from catalog.campuses c where c.institution_id=p.institution_id order by c.created_at,c.id limit 1),
       'international','Legacy imported offering',p.duration_months,'unknown',p.source_url
from _missing_programmes p;

insert into catalog.legacy_entity_map(legacy_schema,legacy_table,legacy_key,entity_type,entity_id,metadata)
select 'public',legacy_table,legacy_key,'programme',programme_id,jsonb_build_object('country',country_code,'repair','unmatched_provider')
from _missing_programmes
union all
select 'public',legacy_table,legacy_key,'offering',offering_id,jsonb_build_object('country',country_code,'repair','unmatched_provider')
from _missing_programmes
on conflict (legacy_schema,legacy_table,legacy_key,entity_type)
do update set entity_id=excluded.entity_id,metadata=excluded.metadata,migrated_at=now();

insert into catalog.programme_identifiers(programme_id,identifier_system,identifier_value,source_url)
select programme_id,'LEGACY_'||upper(legacy_table)||'_ID',legacy_key,source_url
from _missing_programmes
on conflict (identifier_system,identifier_value)
do update set programme_id=excluded.programme_id,source_url=excluded.source_url;

insert into evidence.metric_observations(id,metric_key,scope_type,scope_id,value,unit,source_snapshot_id,evidence_kind,confidence,methodology,assumptions,review_status)
select p.evidence_id,'annual_tuition','programme',p.programme_id::text,
       jsonb_build_object('amount',p.fee_amount,'currency',p.currency_code,'billing_basis','annual'),p.currency_code,
       ss.id,'observed','medium','Recovered unmatched legacy programme',
       jsonb_build_object('legacy_table',p.legacy_table,'legacy_key',p.legacy_key),'review_required'
from _missing_programmes p
join evidence.sources es on es.source_key='legacy-public-schema-20260730'
join evidence.source_snapshots ss on ss.source_id=es.id and ss.content_sha256='legacy-public-schema-20260730'
where p.fee_amount is not null and p.fee_amount>0;

insert into catalog.programme_fees(offering_id,fee_type,amount,currency_code,billing_basis,student_market,evidence_id)
select offering_id,'tuition',fee_amount,currency_code,'annual','international',evidence_id
from _missing_programmes
where fee_amount is not null and fee_amount>0;

insert into taxonomy.programme_concepts(programme_id,concept_id,relation_type,confidence)
select p.id,c.id,'primary','medium'
from catalog.programmes p
cross join taxonomy.study_concepts c
where c.concept_key='nursing'
  and not exists (select 1 from taxonomy.programme_concepts pc where pc.programme_id=p.id and pc.concept_id=c.id)
  and (lower(p.canonical_title) like '%nurs%' or lower(coalesce(p.field_name,'')) like '%nurs%')
on conflict do nothing;