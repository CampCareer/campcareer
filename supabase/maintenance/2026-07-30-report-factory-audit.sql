-- Read-only audit for the CampCareer Report Factory schema cutover.

select table_schema,count(*)::integer as table_count
from information_schema.tables
where table_type='BASE TABLE'
  and table_schema in ('public','core','catalog','taxonomy','ingest','evidence','labour','reporting','retired')
group by table_schema
order by table_schema;

select i.country_code,
       count(distinct i.id)::bigint as institutions,
       count(p.id)::bigint as programmes,
       count(o.id)::bigint as offerings
from catalog.institutions i
left join catalog.programmes p on p.institution_id=i.id
left join catalog.programme_offerings o on o.programme_id=p.id
group by i.country_code
order by i.country_code;

select legacy_table,entity_type,count(*)::bigint as mapped_rows
from catalog.legacy_entity_map
where legacy_table in ('courses_au','courses_ca','courses_ie','courses_uk')
  and entity_type in ('programme','offering')
group by legacy_table,entity_type
order by legacy_table,entity_type;

select 'catalog.programme_fees' as object,count(*)::bigint as rows from catalog.programme_fees
union all select 'catalog.programme_requirements',count(*) from catalog.programme_requirements
union all select 'catalog.programme_accreditations',count(*) from catalog.programme_accreditations
union all select 'evidence.sources',count(*) from evidence.sources
union all select 'evidence.source_snapshots',count(*) from evidence.source_snapshots
union all select 'evidence.metric_observations',count(*) from evidence.metric_observations
union all select 'labour.outcome_observations',count(*) from labour.outcome_observations
union all select 'taxonomy.study_concepts',count(*) from taxonomy.study_concepts
union all select 'taxonomy.occupations',count(*) from taxonomy.occupations
union all select 'taxonomy.programme_concepts',count(*) from taxonomy.programme_concepts
union all select 'taxonomy.concept_occupations',count(*) from taxonomy.concept_occupations
order by object;

select table_schema,table_name
from information_schema.tables
where table_type='BASE TABLE' and table_schema='public'
order by table_name;

select schemaname,matviewname
from pg_matviews
where schemaname in ('public','retired')
order by schemaname,matviewname;

select count(*)::bigint as programmes_without_institution
from catalog.programmes p
left join catalog.institutions i on i.id=p.institution_id
where i.id is null;

select count(*)::bigint as offerings_without_programme
from catalog.programme_offerings o
left join catalog.programmes p on p.id=o.programme_id
where p.id is null;

select count(*)::bigint as metrics_without_source_snapshot
from evidence.metric_observations e
left join evidence.source_snapshots s on s.id=e.source_snapshot_id
where s.id is null;