-- Recover Irish programmes whose legacy provider identifier was null or absent.

insert into catalog.institutions(country_code,canonical_name,institution_type,status)
select distinct 'IE',trim(c.college_name),'education_provider','active'
from ingest.courses_ie c
left join catalog.legacy_entity_map m
  on m.legacy_schema='public' and m.legacy_table='courses_ie' and m.legacy_key=c.id::text and m.entity_type='programme'
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

insert into catalog.campuses(institution_id,name,city,country_code,status)
select distinct i.id,coalesce(nullif(trim(c.city),''),'Main')||' listed campus',nullif(trim(c.city),''),'IE','active'
from ingest.courses_ie c
join catalog.institutions i on i.country_code='IE' and lower(i.canonical_name)=lower(trim(c.college_name))
left join catalog.campuses ca on ca.institution_id=i.id
where ca.id is null and nullif(trim(c.college_name),'') is not null
on conflict do nothing;

insert into catalog.programmes(
  id,institution_id,canonical_title,qualification_level_id,programme_type,field_code,field_name,
  default_duration_months,status
)
select md5('courses_ie:'||c.id::text)::uuid,i.id,c.title,ql.id,c.course_type,c.cao_code,c.field_name,
       case when c.duration_years is null then null else round(c.duration_years*12)::integer end,'active'
from ingest.courses_ie c
join catalog.institutions i on i.country_code='IE' and lower(i.canonical_name)=lower(trim(c.college_name))
left join catalog.legacy_entity_map m
  on m.legacy_schema='public' and m.legacy_table='courses_ie' and m.legacy_key=c.id::text and m.entity_type='programme'
left join core.qualification_frameworks qf on qf.country_code='IE' and qf.framework_code='NFQ'
left join core.qualification_levels ql on ql.framework_id=qf.id and ql.level_code=c.nfq_level::text
where m.entity_id is null
on conflict (id) do nothing;

insert into catalog.programme_offerings(
  id,programme_id,campus_id,market,intake_label,duration_months,enrolment_status,source_url
)
select md5('courses_ie:offering:'||c.id::text)::uuid,md5('courses_ie:'||c.id::text)::uuid,
       (select ca.id from catalog.campuses ca where ca.institution_id=i.id order by ca.created_at,ca.id limit 1),
       'international','Legacy imported offering',
       case when c.duration_years is null then null else round(c.duration_years*12)::integer end,
       'unknown',c.qualifax_url
from ingest.courses_ie c
join catalog.institutions i on i.country_code='IE' and lower(i.canonical_name)=lower(trim(c.college_name))
left join catalog.legacy_entity_map m
  on m.legacy_schema='public' and m.legacy_table='courses_ie' and m.legacy_key=c.id::text and m.entity_type='offering'
where m.entity_id is null
on conflict (id) do nothing;

insert into catalog.legacy_entity_map(legacy_schema,legacy_table,legacy_key,entity_type,entity_id,metadata)
select 'public','courses_ie',c.id::text,'programme',md5('courses_ie:'||c.id::text)::uuid,
       jsonb_build_object('country','IE','repair','unmatched_provider')
from ingest.courses_ie c
left join catalog.legacy_entity_map m
  on m.legacy_schema='public' and m.legacy_table='courses_ie' and m.legacy_key=c.id::text and m.entity_type='programme'
where m.entity_id is null and nullif(trim(c.college_name),'') is not null
union all
select 'public','courses_ie',c.id::text,'offering',md5('courses_ie:offering:'||c.id::text)::uuid,
       jsonb_build_object('country','IE','repair','unmatched_provider')
from ingest.courses_ie c
left join catalog.legacy_entity_map m
  on m.legacy_schema='public' and m.legacy_table='courses_ie' and m.legacy_key=c.id::text and m.entity_type='offering'
where m.entity_id is null and nullif(trim(c.college_name),'') is not null
on conflict (legacy_schema,legacy_table,legacy_key,entity_type)
do update set entity_id=excluded.entity_id,metadata=excluded.metadata,migrated_at=now();

insert into catalog.programme_identifiers(programme_id,identifier_system,identifier_value,source_url)
select md5('courses_ie:'||c.id::text)::uuid,'LEGACY_COURSES_IE_ID',c.id::text,c.qualifax_url
from ingest.courses_ie c
join catalog.legacy_entity_map m
  on m.legacy_schema='public' and m.legacy_table='courses_ie' and m.legacy_key=c.id::text and m.entity_type='programme'
where m.entity_id=md5('courses_ie:'||c.id::text)::uuid
on conflict (identifier_system,identifier_value)
do update set programme_id=excluded.programme_id,source_url=excluded.source_url;

insert into taxonomy.programme_concepts(programme_id,concept_id,relation_type,confidence)
select p.id,c.id,'primary','medium'
from catalog.programmes p
cross join taxonomy.study_concepts c
where c.concept_key='nursing'
  and not exists (select 1 from taxonomy.programme_concepts pc where pc.programme_id=p.id and pc.concept_id=c.id)
  and (lower(p.canonical_title) like '%nurs%' or lower(coalesce(p.field_name,'')) like '%nurs%')
on conflict do nothing;