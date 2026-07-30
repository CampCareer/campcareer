insert into evidence.metric_observations(
  id,metric_key,scope_type,scope_id,value,unit,source_snapshot_id,evidence_kind,confidence,
  methodology,assumptions,effective_from,effective_to,review_status,reviewed_at,reviewer_note
)
select gen_random_uuid(),f.field_key,'programme',m.entity_id::text,f.value,
       case when f.field_key='annual_tuition_aud' then 'AUD' else null end,
       ss.id,'observed',case when f.review_status='verified' then 'high' else 'medium' end,
       'Provider programme page extraction',jsonb_build_object('legacy_fact_id',f.id,'legacy_course_id',f.course_id),
       f.effective_from,f.effective_to,
       case f.review_status when 'verified' then 'verified' when 'stale' then 'stale' when 'rejected' then 'rejected' else 'review_required' end,
       f.reviewed_at,f.reviewer_note
from public.program_page_facts_au f
join catalog.legacy_entity_map m
  on m.legacy_schema='public' and m.legacy_table='courses_au' and m.legacy_key=f.course_id::text and m.entity_type='programme'
join evidence.sources s on s.source_key='provider-page:'||md5(f.source_url)
join evidence.source_snapshots ss
  on ss.source_id=s.id and ss.content_sha256=coalesce(f.source_content_hash,md5(f.source_url||':'||f.extracted_at::text));