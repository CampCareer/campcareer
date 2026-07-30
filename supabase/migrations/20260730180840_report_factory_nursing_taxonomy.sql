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