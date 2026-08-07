-- Backfill canonical programme records for official CRICOS courses added after the July canonical migration.

create temporary table _new_au_programmes on commit drop as
select
  c.id as course_id,
  gen_random_uuid() as programme_id,
  ii.institution_id,
  c.title,
  c.aqf_level,
  c.course_type,
  c.broad_field,
  c.field_name,
  case when c.duration_years is null then null else round(c.duration_years * 12)::integer end as duration_months,
  c.cricos_status,
  c.course_code,
  c.cricos_url,
  c.tuition_fee_aud
from ingest.courses_au c
join catalog.institution_identifiers ii
  on ii.identifier_system = 'AU_PROVIDER_ID'
 and ii.identifier_value = c.institution_id
left join catalog.legacy_entity_map m
  on m.legacy_schema = 'public'
 and m.legacy_table = 'courses_au'
 and m.legacy_key = c.id::text
 and m.entity_type = 'programme'
where m.entity_id is null;

insert into catalog.programmes (
  id,institution_id,canonical_title,qualification_level_id,programme_type,field_code,field_name,default_duration_months,status
)
select
  n.programme_id,n.institution_id,n.title,ql.id,n.course_type,n.broad_field,n.field_name,n.duration_months,
  case n.cricos_status when 'active' then 'active' when 'expired' then 'inactive' else 'unknown' end
from _new_au_programmes n
left join core.qualification_frameworks qf
  on qf.country_code='AU' and qf.framework_code='AQF'
left join core.qualification_levels ql
  on ql.framework_id=qf.id and ql.level_code=n.aqf_level::text;

insert into catalog.legacy_entity_map (legacy_schema,legacy_table,legacy_key,entity_type,entity_id,metadata)
select 'public','courses_au',course_id::text,'programme',programme_id,jsonb_build_object('country','AU','source','official_cricos_2026_08')
from _new_au_programmes
on conflict (legacy_schema,legacy_table,legacy_key,entity_type)
do update set entity_id=excluded.entity_id,metadata=excluded.metadata,migrated_at=now();

insert into catalog.programme_identifiers (programme_id,identifier_system,identifier_value,source_url)
select programme_id,'LEGACY_COURSES_AU_ID',course_id::text,cricos_url
from _new_au_programmes
on conflict (identifier_system,identifier_value)
do update set programme_id=excluded.programme_id,source_url=excluded.source_url;

insert into catalog.programme_identifiers (programme_id,identifier_system,identifier_value,source_url)
select programme_id,'CRICOS_COURSE_CODE',course_code,cricos_url
from _new_au_programmes
where course_code is not null and btrim(course_code)<>''
on conflict (identifier_system,identifier_value)
do update set programme_id=excluded.programme_id,source_url=excluded.source_url;

insert into catalog.programme_accreditations (
  programme_id,authority_name,authority_url,accreditation_type,status,status_text,last_checked_at,review_status
)
select
  programme_id,'CRICOS',cricos_url,'international_student_registration',
  case cricos_status when 'active' then 'approved' when 'expired' then 'expired' else 'unknown' end,
  cricos_status,now(),'verified'
from _new_au_programmes
on conflict do nothing;
