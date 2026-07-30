create temporary table _field_outcomes_ca on commit drop as
select gen_random_uuid() evidence_id,f.id legacy_id,f.field_name,
       v.metric_key,v.metric_value,v.unit,f.source,f.updated_at
from public.field_earnings_ca f
cross join lateral (
  values ('median_earnings',f.median_earnings::numeric,'CAD'::text),
         ('employment_rate',f.employment_rate::numeric,'ratio'::text)
) v(metric_key,metric_value,unit)
where v.metric_value is not null;

insert into evidence.metric_observations(
  id,metric_key,scope_type,scope_id,value,unit,source_snapshot_id,evidence_kind,confidence,
  methodology,assumptions,review_status,reviewed_at
)
select s.evidence_id,s.metric_key,'field','CA:'||s.field_name,
       to_jsonb(s.metric_value),s.unit,ss.id,'observed','medium','Legacy field outcome import',
       jsonb_build_object('legacy_table','field_earnings_ca','legacy_id',s.legacy_id,'legacy_source',s.source),
       'review_required',s.updated_at
from _field_outcomes_ca s
join evidence.sources es on es.source_key='legacy-public-schema-20260730'
join evidence.source_snapshots ss on ss.source_id=es.id and ss.content_sha256='legacy-public-schema-20260730';

insert into labour.outcome_observations(
  country_code,field_name,cohort_type,metric_key,value,unit,evidence_id,review_status
)
select 'CA',field_name,'all',metric_key,metric_value,unit,evidence_id,'review_required'
from _field_outcomes_ca;