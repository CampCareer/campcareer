-- Canonical programme, offering and tuition backfill.

create temporary table _programme_stage (
  programme_id uuid not null,
  offering_id uuid not null,
  evidence_id uuid not null,
  legacy_table text not null,
  legacy_key text not null,
  country_code text not null,
  institution_id uuid not null,
  canonical_title text not null,
  qualification_level_id uuid,
  programme_type text,
  field_code text,
  field_name text,
  duration_months integer,
  status text not null,
  source_url text,
  fee_amount numeric,
  currency_code text not null
) on commit drop;

insert into _programme_stage
select gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),'courses_au',c.id::text,'AU',ii.institution_id,c.title,ql.id,c.course_type,c.broad_field,c.field_name,
       case when c.duration_years is null then null else round(c.duration_years*12)::integer end,
       case c.cricos_status when 'active' then 'active' when 'expired' then 'inactive' else 'unknown' end,
       coalesce(c.official_course_url,c.cricos_url),c.tuition_fee_aud,'AUD'
from public.courses_au c
join catalog.institution_identifiers ii on ii.identifier_system='AU_PROVIDER_ID' and ii.identifier_value=c.institution_id
left join core.qualification_frameworks qf on qf.country_code='AU' and qf.framework_code='AQF'
left join core.qualification_levels ql on ql.framework_id=qf.id and ql.level_code=c.aqf_level::text;

insert into _programme_stage
select gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),'courses_ca',c.id::text,'CA',ii.institution_id,c.title,null,c.credential_type,c.noc_code,c.field_name,
       case when c.duration_years is null then null else round(c.duration_years*12)::integer end,'active',null,c.tuition_fee_cad,'CAD'
from public.courses_ca c
join catalog.institution_identifiers ii on ii.identifier_system='CA_PROVIDER_ID' and ii.identifier_value=c.institution_id;

insert into _programme_stage
select gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),'courses_uk',c.id::text,'UK',ii.institution_id,c.title,null,c.credential_type,null,c.field_name,
       case when c.duration_years is null then null else round(c.duration_years*12)::integer end,'active',null,c.tuition_fee_gbp,'GBP'
from public.courses_uk c
join catalog.institution_identifiers ii on ii.identifier_system='UK_PROVIDER_ID' and ii.identifier_value=c.institution_id;

insert into _programme_stage
select gen_random_uuid(),gen_random_uuid(),gen_random_uuid(),'courses_ie',c.id::text,'IE',ii.institution_id,c.title,ql.id,c.course_type,c.cao_code,c.field_name,
       case when c.duration_years is null then null else round(c.duration_years*12)::integer end,'active',c.qualifax_url,null,'EUR'
from public.courses_ie c
join catalog.institution_identifiers ii on ii.identifier_system='IE_PROVIDER_ID' and ii.identifier_value=c.institution_id
left join core.qualification_frameworks qf on qf.country_code='IE' and qf.framework_code='NFQ'
left join core.qualification_levels ql on ql.framework_id=qf.id and ql.level_code=c.nfq_level::text;

insert into catalog.programmes(id,institution_id,canonical_title,qualification_level_id,programme_type,field_code,field_name,default_duration_months,status)
select programme_id,institution_id,canonical_title,qualification_level_id,programme_type,field_code,field_name,duration_months,status
from _programme_stage;

insert into catalog.legacy_entity_map(legacy_schema,legacy_table,legacy_key,entity_type,entity_id,metadata)
select 'public',legacy_table,legacy_key,'programme',programme_id,jsonb_build_object('country',country_code)
from _programme_stage
on conflict (legacy_schema,legacy_table,legacy_key,entity_type)
do update set entity_id=excluded.entity_id,metadata=excluded.metadata,migrated_at=now();

insert into catalog.programme_identifiers(programme_id,identifier_system,identifier_value,source_url)
select programme_id,'LEGACY_'||upper(legacy_table)||'_ID',legacy_key,source_url
from _programme_stage
on conflict (identifier_system,identifier_value)
do update set programme_id=excluded.programme_id,source_url=excluded.source_url;

insert into catalog.programme_identifiers(programme_id,identifier_system,identifier_value,source_url)
select s.programme_id,'CRICOS_COURSE_CODE',c.course_code,s.source_url
from _programme_stage s
join public.courses_au c on s.legacy_table='courses_au' and s.legacy_key=c.id::text
where c.course_code is not null and c.course_code<>''
on conflict (identifier_system,identifier_value)
do update set programme_id=excluded.programme_id,source_url=excluded.source_url;

insert into catalog.programme_identifiers(programme_id,identifier_system,identifier_value,source_url)
select s.programme_id,'CA_PROVIDER_COURSE_CODE',c.institution_id||':'||c.course_code,s.source_url
from _programme_stage s
join public.courses_ca c on s.legacy_table='courses_ca' and s.legacy_key=c.id::text
where c.course_code is not null and c.course_code<>''
on conflict do nothing;

insert into catalog.programme_offerings(id,programme_id,campus_id,market,intake_label,duration_months,enrolment_status,source_url)
select s.offering_id,s.programme_id,
       (select c.id from catalog.campuses c where c.institution_id=s.institution_id order by c.created_at,c.id limit 1),
       'international','Legacy imported offering',s.duration_months,'unknown',s.source_url
from _programme_stage s;

insert into catalog.legacy_entity_map(legacy_schema,legacy_table,legacy_key,entity_type,entity_id,metadata)
select 'public',legacy_table,legacy_key,'offering',offering_id,jsonb_build_object('country',country_code)
from _programme_stage
on conflict (legacy_schema,legacy_table,legacy_key,entity_type)
do update set entity_id=excluded.entity_id,metadata=excluded.metadata,migrated_at=now();

insert into evidence.metric_observations(id,metric_key,scope_type,scope_id,value,unit,source_snapshot_id,evidence_kind,confidence,methodology,assumptions,review_status)
select s.evidence_id,'annual_tuition','programme',s.programme_id::text,
       jsonb_build_object('amount',s.fee_amount,'currency',s.currency_code,'billing_basis','annual'),s.currency_code,
       ss.id,'observed','medium','Imported from legacy course catalogue',
       jsonb_build_object('legacy_table',s.legacy_table,'legacy_key',s.legacy_key),'review_required'
from _programme_stage s
join evidence.sources es on es.source_key='legacy-public-schema-20260730'
join evidence.source_snapshots ss on ss.source_id=es.id and ss.content_sha256='legacy-public-schema-20260730'
where s.fee_amount is not null and s.fee_amount>0;

insert into catalog.programme_fees(offering_id,fee_type,amount,currency_code,billing_basis,student_market,evidence_id)
select offering_id,'tuition',fee_amount,currency_code,'annual','international',evidence_id
from _programme_stage
where fee_amount is not null and fee_amount>0;

insert into catalog.programme_accreditations(programme_id,authority_name,authority_url,accreditation_type,status,status_text,last_checked_at,review_status)
select s.programme_id,'CRICOS',c.cricos_url,'international_student_registration',
       case c.cricos_status when 'active' then 'approved' when 'expired' then 'expired' else 'unknown' end,
       c.cricos_status,c.cricos_last_seen_at,'review_required'
from _programme_stage s
join public.courses_au c on s.legacy_table='courses_au' and s.legacy_key=c.id::text;