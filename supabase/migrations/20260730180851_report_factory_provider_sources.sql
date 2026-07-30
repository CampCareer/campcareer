insert into evidence.sources(source_key,organisation_name,source_name,source_type,canonical_url,country_code,active)
select distinct 'provider-page:'||md5(source_url),'Course provider','Official programme page','provider',source_url,'AU',true
from public.program_page_facts_au
where source_url is not null
on conflict (source_key)
do update set canonical_url=excluded.canonical_url,active=true,updated_at=now();

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