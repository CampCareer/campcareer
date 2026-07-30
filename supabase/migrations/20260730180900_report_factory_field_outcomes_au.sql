create temporary table _field_outcomes_au on commit drop as
select gen_random_uuid() evidence_id,f.id legacy_id,f.field_name,ql.id qualification_level_id,
       v.metric_key,v.metric_value,v.unit,f.source,f.updated_at
from public.field_earnings_au f
left join core.qualification_frameworks qf on qf.country_code='AU' and qf.framework_code='AQF'
left join core.qualification_levels ql on ql.framework_id=qf.id and ql.level_code=f.aqf_level::text
cross join lateral (
  values ('median_earnings',f.median_earnings::numeric,'AUD'::text),
         ('employment_rate',f.employment_rate::numeric,'ratio'::text)
) v(metric_key,metric_value,unit)
where v.metric_value is not null;

insert into evidence.metric_observations(
  id,metric_key,scope_type,scope_id,value,unit,source_snapshot_id,evidence_kind,confidence,
  methodology,assumptions,review_status,reviewed_at
)
select s.evidence_id,s.metric_key,'field','AU:'||s.field_name||':'||coalesce(s.qualification_level_id::text,'all'),
       to_jsonb(s.metric_value),s.unit,ss.id,'observed','medium','Legacy field outcome import',
       jsonb_build_object('legacy_table','field_earnings_au','legacy_id',s.legacy_id,'legacy_source',s.source),
       'review_required',s.updated_at
from _field_outcomes_au s
join evidence.sources es on es.source_key='legacy-public-schema-20260730'
join evidence.source_snapshots ss on ss.source_id=es.id and ss.content_sha256='legacy-public-schema-20260730';

insert into labour.outcome_observations(
  country_code,field_name,qualification_level_id,cohort_type,metric_key,value,unit,evidence_id,review_status
)
select 'AU',field_name,qualification_level_id,'all',metric_key,metric_value,unit,evidence_id,'review_required'
from _field_outcomes_au;