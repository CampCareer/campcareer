insert into evidence.metric_observations(
  id,metric_key,scope_type,scope_id,value,unit,source_snapshot_id,evidence_kind,confidence,
  methodology,assumptions,review_status,reviewed_at
)
select md5('field_earnings_ie:'||f.id::text||':median_earnings')::uuid,
       'median_earnings','field','IE:'||f.field_name||':'||coalesce(f.nfq_level::text,'all'),
       to_jsonb(f.median_earnings::numeric),'EUR',ss.id,'observed','medium','Legacy field outcome import',
       jsonb_build_object('legacy_table','field_earnings_ie','legacy_id',f.id,'legacy_source',f.source),
       'review_required',f.updated_at
from public.field_earnings_ie f
join evidence.sources es on es.source_key='legacy-public-schema-20260730'
join evidence.source_snapshots ss on ss.source_id=es.id and ss.content_sha256='legacy-public-schema-20260730'
where f.median_earnings is not null;

insert into labour.outcome_observations(
  country_code,field_name,qualification_level_id,cohort_type,metric_key,value,unit,evidence_id,review_status
)
select 'IE',f.field_name,ql.id,'all','median_earnings',f.median_earnings::numeric,'EUR',
       md5('field_earnings_ie:'||f.id::text||':median_earnings')::uuid,'review_required'
from public.field_earnings_ie f
left join core.qualification_frameworks qf on qf.country_code='IE' and qf.framework_code='NFQ'
left join core.qualification_levels ql on ql.framework_id=qf.id and ql.level_code=f.nfq_level::text
where f.median_earnings is not null;

insert into evidence.metric_observations(
  id,metric_key,scope_type,scope_id,value,unit,source_snapshot_id,evidence_kind,confidence,
  methodology,assumptions,review_status,reviewed_at
)
select md5('field_earnings_ie:'||f.id::text||':employment_rate')::uuid,
       'employment_rate','field','IE:'||f.field_name||':'||coalesce(f.nfq_level::text,'all'),
       to_jsonb(f.employment_rate::numeric),'ratio',ss.id,'observed','medium','Legacy field outcome import',
       jsonb_build_object('legacy_table','field_earnings_ie','legacy_id',f.id,'legacy_source',f.source),
       'review_required',f.updated_at
from public.field_earnings_ie f
join evidence.sources es on es.source_key='legacy-public-schema-20260730'
join evidence.source_snapshots ss on ss.source_id=es.id and ss.content_sha256='legacy-public-schema-20260730'
where f.employment_rate is not null;

insert into labour.outcome_observations(
  country_code,field_name,qualification_level_id,cohort_type,metric_key,value,unit,evidence_id,review_status
)
select 'IE',f.field_name,ql.id,'all','employment_rate',f.employment_rate::numeric,'ratio',
       md5('field_earnings_ie:'||f.id::text||':employment_rate')::uuid,'review_required'
from public.field_earnings_ie f
left join core.qualification_frameworks qf on qf.country_code='IE' and qf.framework_code='NFQ'
left join core.qualification_levels ql on ql.framework_id=qf.id and ql.level_code=f.nfq_level::text
where f.employment_rate is not null;