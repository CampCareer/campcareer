-- Migrate provider-page facts into source snapshots, metric evidence, fees and requirements.

insert into evidence.sources(source_key,organisation_name,source_name,source_type,canonical_url,country_code,active)
select distinct 'provider-page:'||md5(source_url),'Course provider','Official programme page','provider',source_url,'AU',true
from public.program_page_facts_au
where source_url is not null
on conflict (source_key) do update
set canonical_url=excluded.canonical_url,active=true,updated_at=now();

insert into evidence.source_snapshots(source_id,source_url,content_sha256,retrieved_at,valid_from,valid_to,snapshot_status,metadata)
select distinct on (s.id,coalesce(f.source_content_hash,md5(f.source_url||':'||f.extracted_at::text)))
       s.id,f.source_url,coalesce(f.source_content_hash,md5(f.source_url||':'||f.extracted_at::text)),f.extracted_at,
       f.effective_from,f.effective_to,
       case when f.review_status='stale' then 'superseded' when f.review_status='rejected' then 'failed' else 'captured' end,
       jsonb_build_object('legacy_table','program_page_facts_au')
from public.program_page_facts_au f
join evidence.sources s on s.source_key='provider-page:'||md5(f.source_url)
where f.source_url is not null
order by s.id,coalesce(f.source_content_hash,md5(f.source_url||':'||f.extracted_at::text)),f.extracted_at desc
on conflict do nothing;

create temporary table _programme_fact_stage on commit drop as
select gen_random_uuid() evidence_id,f.id legacy_fact_id,f.course_id,f.field_key,f.value,f.effective_from,f.effective_to,
       f.review_status,f.reviewed_at,f.reviewer_note,m.entity_id programme_id,om.entity_id offering_id,ss.id source_snapshot_id
from public.program_page_facts_au f
join catalog.legacy_entity_map m
  on m.legacy_schema='public' and m.legacy_table='courses_au' and m.legacy_key=f.course_id::text and m.entity_type='programme'
left join catalog.legacy_entity_map om
  on om.legacy_schema='public' and om.legacy_table='courses_au' and om.legacy_key=f.course_id::text and om.entity_type='offering'
join evidence.sources s on s.source_key='provider-page:'||md5(f.source_url)
join evidence.source_snapshots ss
  on ss.source_id=s.id and ss.content_sha256=coalesce(f.source_content_hash,md5(f.source_url||':'||f.extracted_at::text));

insert into evidence.metric_observations(id,metric_key,scope_type,scope_id,value,unit,source_snapshot_id,evidence_kind,confidence,methodology,assumptions,effective_from,effective_to,review_status,reviewed_at,reviewer_note)
select evidence_id,field_key,'programme',programme_id::text,value,
       case when field_key='annual_tuition_aud' then 'AUD' else null end,
       source_snapshot_id,'observed',case when review_status='verified' then 'high' else 'medium' end,
       'Provider programme page extraction',jsonb_build_object('legacy_fact_id',legacy_fact_id,'legacy_course_id',course_id),
       effective_from,effective_to,
       case review_status when 'verified' then 'verified' when 'stale' then 'stale' when 'rejected' then 'rejected' else 'review_required' end,
       reviewed_at,reviewer_note
from _programme_fact_stage;

insert into catalog.programme_fees(offering_id,fee_type,amount,currency_code,billing_basis,student_market,evidence_id,effective_from,effective_to)
select offering_id,'tuition',(value->>'amountAud')::numeric,'AUD','annual','international',evidence_id,
       case when value ? 'year' then make_date((value->>'year')::integer,1,1) else effective_from end,effective_to
from _programme_fact_stage
where field_key='annual_tuition_aud'
  and review_status='verified'
  and offering_id is not null
  and value ? 'amountAud'
  and (value->>'amountAud') ~ '^[0-9]+(\.[0-9]+)?$';

insert into catalog.programme_requirements(offering_id,requirement_type,requirement_text,structured_value,evidence_id,effective_from,effective_to,review_status)
select offering_id,
       case field_key when 'english_requirement' then 'english' when 'entry_requirements' then 'academic' else 'other' end,
       case when jsonb_typeof(value)='string' then value#>>'{}' else value::text end,
       value,evidence_id,effective_from,effective_to,
       case review_status when 'verified' then 'verified' when 'stale' then 'stale' when 'rejected' then 'rejected' else 'review_required' end
from _programme_fact_stage
where field_key in ('english_requirement','entry_requirements')
  and offering_id is not null;