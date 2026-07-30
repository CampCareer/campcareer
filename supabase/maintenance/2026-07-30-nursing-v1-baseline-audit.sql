-- Read-only verification for Australia Nursing v1.0 baseline migration.

with target_run as (
  select r.id
  from reporting.analysis_runs r
  join reporting.products p on p.id=r.product_id
  join reporting.methodology_versions m on m.id=r.methodology_version_id
  where p.product_key='au-nursing-roi-focus-2026-v1'
    and m.methodology_key='au-nursing-roi-model'
    and m.version='0.7'
    and r.input_hash='368ef6ab6071234ea376d0fb83060bd62bc50b7759727a502e4795253ec22704'
    and r.output_hash='abdb8a741efe654c9a7f7f38f2e2dbbfca2836bc6e60d1dd60aac7d7979b900c'
  order by r.created_at desc
  limit 1
),
target_release as (
  select rr.id
  from reporting.report_releases rr
  join reporting.products p on p.id=rr.product_id
  where p.product_key='au-nursing-roi-focus-2026-v1'
    and rr.release_version='1.0'
)
select metric,value,expected,
       case when value=expected then 'PASS' else 'FAIL' end result
from (
  select 'source_register_total' metric,
         (select count(*) from evidence.source_register_records where report_key='au-nursing-roi-focus-2026-v1')::bigint value,
         439::bigint expected
  union all
  select 'source_register_verified',
         (select count(*) from evidence.source_register_records where report_key='au-nursing-roi-focus-2026-v1' and verification_status='Verified'),
         426
  union all
  select 'source_register_approved',
         (select count(*) from evidence.source_register_records where report_key='au-nursing-roi-focus-2026-v1' and use_status='Approved for Use'),
         348
  union all
  select 'pathways',(select count(*) from reporting.analysis_pathways where analysis_run_id=(select id from target_run)),3
  union all
  select 'scenarios',(select count(*) from reporting.analysis_scenarios where analysis_run_id=(select id from target_run)),9
  union all
  select 'course_samples',(select count(*) from reporting.analysis_inputs where analysis_run_id=(select id from target_run) and input_key like 'course_sample:%'),7
  union all
  select 'scenario_inputs',(select count(*) from reporting.analysis_inputs where analysis_run_id=(select id from target_run) and input_key like 'SCN-NUR-%'),225
  union all
  select 'source_mappings',(select count(*) from reporting.analysis_inputs where analysis_run_id=(select id from target_run) and input_key like 'MAP-NUR-%'),423
  union all
  select 'formula_outputs',(select count(*) from reporting.analysis_outputs where analysis_run_id=(select id from target_run) and output_key like 'CALC-NUR-%'),189
  union all
  select 'summary_outputs',(select count(*) from reporting.analysis_outputs where analysis_run_id=(select id from target_run) and output_key like 'SUM-NUR-%'),9
  union all
  select 'release_programmes',(select count(*) from reporting.report_programmes where report_release_id=(select id from target_release)),7
  union all
  select 'release_artifacts',(select count(*) from reporting.report_artifacts where report_release_id=(select id from target_release)),9
  union all
  select 'monitoring_actions',(select count(*) from reporting.monitoring_actions where report_release_id=(select id from target_release)),5
  union all
  select 'programme_cricos_matches',
         (select count(distinct identifier_value) from catalog.programme_identifiers
          where identifier_system='CRICOS_COURSE_CODE'
            and identifier_value in ('003501K','075119J','005195K','110160B','111783G','069418D','108467A')),
         7
) q
order by metric;

select
  p.product_key,
  m.methodology_key,
  m.version methodology_version,
  r.status run_status,
  r.input_hash source_register_sha256,
  r.output_hash roi_model_sha256,
  rr.release_version,
  rr.status release_status,
  rr.source_baseline_hash,
  rr.model_baseline_hash,
  rr.manuscript_hash,
  a.content_sha256 final_pdf_sha256,
  a.page_count final_pdf_pages
from reporting.products p
join reporting.analysis_runs r on r.product_id=p.id
join reporting.methodology_versions m on m.id=r.methodology_version_id
join reporting.report_releases rr on rr.product_id=p.id and rr.analysis_run_id=r.id
left join reporting.report_artifacts a
  on a.report_release_id=rr.id and a.artifact_type='pdf'
where p.product_key='au-nursing-roi-focus-2026-v1'
  and rr.release_version='1.0';
