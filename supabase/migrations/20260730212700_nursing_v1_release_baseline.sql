-- Final released Australia Nursing ROI Focus Report 2026 v1.0 baseline.

insert into reporting.report_releases(
  product_id,release_version,analysis_run_id,status,release_date,
  source_baseline_hash,model_baseline_hash,manuscript_hash,approval_note,approved_at
)
select p.id,'1.0',
       (
         select r.id
         from reporting.analysis_runs r
         join reporting.methodology_versions m on m.id=r.methodology_version_id
         where r.product_id=p.id
           and m.methodology_key='au-nursing-roi-model'
           and m.version='0.7'
           and r.input_hash='368ef6ab6071234ea376d0fb83060bd62bc50b7759727a502e4795253ec22704'
           and r.output_hash='abdb8a741efe654c9a7f7f38f2e2dbbfca2836bc6e60d1dd60aac7d7979b900c'
         order by r.created_at desc
         limit 1
       ),
       'released','2026-07-30',
       '368ef6ab6071234ea376d0fb83060bd62bc50b7759727a502e4795253ec22704',
       'abdb8a741efe654c9a7f7f38f2e2dbbfca2836bc6e60d1dd60aac7d7979b900c',
       '2399ed5d10bbe721de34bc17e2ec3a1cdec791656c21f794454dc9f580140b76',
       'A. Final Release Approved. Public Preview and Sale-ready approved. Final PDF bytes are protected; numeric, table, chart and ordering changes were zero.',
       '2026-07-30T12:00:00Z'
from reporting.products p
where p.product_key='au-nursing-roi-focus-2026-v1'
on conflict (product_id,release_version) do update
set analysis_run_id=excluded.analysis_run_id,
    status=excluded.status,
    release_date=excluded.release_date,
    source_baseline_hash=excluded.source_baseline_hash,
    model_baseline_hash=excluded.model_baseline_hash,
    manuscript_hash=excluded.manuscript_hash,
    approval_note=excluded.approval_note,
    approved_at=excluded.approved_at;

create temporary table _nursing_release_samples(j jsonb) on commit drop;
insert into _nursing_release_samples
select value from jsonb_array_elements($s$[{"Sample ID":"CS-NUR-001","Pathway ID":"P-NUR-BRN","Institution":"Queensland University of Technology","Course":"Bachelor of Nursing","CRICOS":"003501K","Campus City":"Brisbane","Duration (years)":3,"Tuition":130500,"Tuition Value Type":"Actual","Living Estimate / year":20320,"Allianz OSHC":2945,"Known Fixed Ancillary":0,"Result Status":"Draft Minimum Known Cost Result","Source Record IDs":"SR-NUR-0059; SR-NUR-0060; SR-NUR-0061; SR-NUR-0076; SR-NUR-0077; SR-NUR-0078; SR-NUR-0079; SR-NUR-0235; SR-NUR-0324; SR-NUR-0411"},{"Sample ID":"CS-NUR-002","Pathway ID":"P-NUR-BRN","Institution":"Monash University","Course":"Bachelor of Nursing","CRICOS":"075119J","Campus City":"Melbourne","Duration (years)":3,"Tuition":133800,"Tuition Value Type":"Actual","Living Estimate / year":22270,"Allianz OSHC":2945,"Known Fixed Ancillary":270,"Result Status":"Draft Minimum Known Cost Result","Source Record IDs":"SR-NUR-0240; SR-NUR-0241; SR-NUR-0242; SR-NUR-0243; SR-NUR-0244; SR-NUR-0233; SR-NUR-0328; SR-NUR-0366; SR-NUR-0412"},{"Sample ID":"CS-NUR-003","Pathway ID":"P-NUR-BRN","Institution":"Flinders University","Course":"Bachelor of Nursing (Preregistration)","CRICOS":"005195K","Campus City":"Adelaide","Duration (years)":3,"Tuition":132900,"Tuition Value Type":"Calculated total from approved annual tuition","Living Estimate / year":20310,"Allianz OSHC":2945,"Known Fixed Ancillary":77.9,"Result Status":"Draft Minimum Known Cost Result","Source Record IDs":"SR-NUR-0245; SR-NUR-0246; SR-NUR-0247; SR-NUR-0249; SR-NUR-0250; SR-NUR-0248; SR-NUR-0251; SR-NUR-0239; SR-NUR-0332; SR-NUR-0369; SR-NUR-0413"},{"Sample ID":"CS-NUR-004","Pathway ID":"P-NUR-DEN","Institution":"TAFE NSW","Course":"Diploma of Nursing HLT54121","CRICOS":"110160B","Campus City":"Sydney (Randwick)","Duration (years)":1.5,"Tuition":28930,"Tuition Value Type":"Estimate – Results Draft Base","Living Estimate / year":23310,"Allianz OSHC":1511,"Known Fixed Ancillary":0,"Result Status":"Draft Minimum Known Cost Result","Source Record IDs":"SR-NUR-0265; SR-NUR-0270; SR-NUR-0271; SR-NUR-0272; SR-NUR-0266; SR-NUR-0267; SR-NUR-0268; SR-NUR-0269; SR-NUR-0231; SR-NUR-0336; ; SR-NUR-0393; SR-NUR-0414"},{"Sample ID":"CS-NUR-005","Pathway ID":"P-NUR-DEN","Institution":"TAFE SA","Course":"Diploma of Nursing HLT54121","CRICOS":"111783G","Campus City":"Adelaide","Duration (years)":1.77,"Tuition":36960,"Tuition Value Type":"Actual","Living Estimate / year":20310,"Allianz OSHC":1953,"Known Fixed Ancillary":205,"Result Status":"Draft Minimum Known Cost Result","Source Record IDs":"SR-NUR-0070; SR-NUR-0085; SR-NUR-0086; SR-NUR-0087; SR-NUR-0088; SR-NUR-0071; SR-NUR-0239; SR-NUR-0340; SR-NUR-0373; SR-NUR-0415"},{"Sample ID":"CS-NUR-006","Pathway ID":"P-NUR-GRN","Institution":"The University of Queensland","Course":"Master of Nursing Graduate Entry","CRICOS":"069418D","Campus City":"Brisbane","Duration (years)":2,"Tuition":100064,"Tuition Value Type":"Actual total course","Living Estimate / year":20320,"Allianz OSHC":1953,"Known Fixed Ancillary":0,"Result Status":"Draft Minimum Known Cost Result","Source Record IDs":"SR-NUR-0090; SR-NUR-0091; SR-NUR-0092; SR-NUR-0093; SR-NUR-0095; SR-NUR-0235; SR-NUR-0344; SR-NUR-0416"},{"Sample ID":"CS-NUR-007","Pathway ID":"P-NUR-GRN","Institution":"University of Wollongong","Course":"Master of Nursing Pre-Registration","CRICOS":"108467A","Campus City":"Wollongong","Duration (years)":2,"Tuition":88740,"Tuition Value Type":"Actual","Living Estimate / year":23310,"Allianz OSHC":1953,"Known Fixed Ancillary":0,"Result Status":"Draft Minimum Known Cost Result","Source Record IDs":"SR-NUR-0096; SR-NUR-0097; SR-NUR-0098; SR-NUR-0103; SR-NUR-0099; SR-NUR-0286; SR-NUR-0348; SR-NUR-0417"}]$s$::jsonb);

with target_release as (
  select rr.id
  from reporting.report_releases rr
  join reporting.products p on p.id=rr.product_id
  where p.product_key='au-nursing-roi-focus-2026-v1'
    and rr.release_version='1.0'
)
insert into reporting.report_programmes(
  report_release_id,programme_id,offering_id,sample_key,pathway_key,display_order,role,metadata
)
select tr.id,p.id,
       (
         select o.id
         from catalog.programme_offerings o
         where o.programme_id=p.id
         order by o.valid_from desc nulls last,o.created_at desc
         limit 1
       ),
       j->>'Sample ID',j->>'Pathway ID',
       row_number() over (order by j->>'Sample ID')::smallint,
       'sample',j
from _nursing_release_samples
cross join target_release tr
join catalog.programme_identifiers pi
  on pi.identifier_system='CRICOS_COURSE_CODE'
 and pi.identifier_value=j->>'CRICOS'
join catalog.programmes p on p.id=pi.programme_id
on conflict (report_release_id,sample_key) do update
set programme_id=excluded.programme_id,
    offering_id=excluded.offering_id,
    pathway_key=excluded.pathway_key,
    display_order=excluded.display_order,
    role=excluded.role,
    metadata=excluded.metadata;

create temporary table _nursing_artifacts(j jsonb) on commit drop;
insert into _nursing_artifacts
select value from jsonb_array_elements($a$[{"file_name":"Nursing_Source_Register_v0.7_Release_Gap_Closure.xlsx","artifact_type":"xlsx","content_sha256":"368ef6ab6071234ea376d0fb83060bd62bc50b7759727a502e4795253ec22704","byte_size":309578,"page_count":null,"status":"approved"},{"file_name":"Nursing_ROI_Model_v0.7_Final_Control_Updated_Draft.xlsx","artifact_type":"xlsx","content_sha256":"abdb8a741efe654c9a7f7f38f2e2dbbfca2836bc6e60d1dd60aac7d7979b900c","byte_size":261373,"page_count":null,"status":"approved"},{"file_name":"Australia_Nursing_ROI_Focus_Report_2026_Full_Manuscript_v0.8_RG06_Final_Disclosure_Candidate.docx","artifact_type":"docx","content_sha256":"2399ed5d10bbe721de34bc17e2ec3a1cdec791656c21f794454dc9f580140b76","byte_size":247289,"page_count":null,"status":"approved"},{"file_name":"CampCareer_Australia_Nursing_ROI_Focus_Report_2026_Final_v1.0.pdf","artifact_type":"pdf","content_sha256":"eb4e8f035804625b9960d94d30f3de568f30ead0116508369c212de5e0e70930","byte_size":12188918,"page_count":21,"status":"released"},{"file_name":"CampCareer_Nursing_Final_Release_PM_Review_v0.2.xlsx","artifact_type":"xlsx","content_sha256":"ad8cf78d21746b4a505dbb80fed6d47ae59d36b1143e466eef6fc9e1603c4b63","byte_size":22119,"page_count":null,"status":"approved"},{"file_name":"CampCareer_Nursing_Final_Release_PM_Decision_Memo_v0.2.docx","artifact_type":"docx","content_sha256":"ca4fdc75245ff55286b16122e7df8c34fe6551d699cd5e6df29c872de289c1bb","byte_size":43310,"page_count":null,"status":"approved"},{"file_name":"CampCareer_Nursing_Final_Release_Approval_Register_v0.1.xlsx","artifact_type":"xlsx","content_sha256":"7f3c74d37e4f3aef3f8f38bdf87c83a48fd36bde4faa2d507c20c22847bfa752","byte_size":13485,"page_count":null,"status":"approved"},{"file_name":"CampCareer_Australia_Report_2026_Project_Control_Board_v2.8.xlsx","artifact_type":"xlsx","content_sha256":"71e7461cd6df291a8cd5ceee03e67923047c6fe92ad2402534eecba93727f016","byte_size":55736,"page_count":null,"status":"approved"},{"file_name":"CampCareer_Nursing_Final_Release_Manifest_v1.0.xlsx","artifact_type":"manifest","content_sha256":"27bde28fe65ea145671eb787e11b80d3cbe63b689b6d5c1bcdd29157b7058165","byte_size":9021,"page_count":null,"status":"released"}]$a$::jsonb);

with target_release as (
  select rr.id
  from reporting.report_releases rr
  join reporting.products p on p.id=rr.product_id
  where p.product_key='au-nursing-roi-focus-2026-v1'
    and rr.release_version='1.0'
)
insert into reporting.report_artifacts(
  report_release_id,artifact_type,file_name,storage_path,content_sha256,
  byte_size,page_count,status
)
select tr.id,j->>'artifact_type',j->>'file_name',null,j->>'content_sha256',
       (j->>'byte_size')::bigint,
       nullif(j->>'page_count','')::integer,
       j->>'status'
from _nursing_artifacts
cross join target_release tr
on conflict (report_release_id,artifact_type,content_sha256) do update
set file_name=excluded.file_name,
    byte_size=excluded.byte_size,
    page_count=excluded.page_count,
    status=excluded.status;

insert into evidence.claims(
  claim_key,claim_text,locale,claim_type,materiality,scope_type,scope_id,publication_status,valid_from
)
values
 ('nursing-v1:final-release-approved','Australia Nursing ROI Focus Report 2026 v1.0 is Final Released; Public Preview and Sale-ready are approved.','en','disclosure','material','report_release','1.0','approved','2026-07-30'),
 ('nursing-v1:controlled-financial-ordering','Controlled financial ordering: EN Diploma, Graduate-entry RN, RN Bachelor.','en','ranking','material','report_release','1.0','approved','2026-07-30'),
 ('nursing-v1:no-universal-ranking','No universal education-quality or personal-suitability ranking is approved.','en','disclosure','material','report_release','1.0','approved','2026-07-30'),
 ('nursing-v1:no-guarantee','The report does not guarantee cost, employment, income, registration, visa, migration or permanent-residence outcomes.','en','disclosure','material','report_release','1.0','approved','2026-07-30'),
 ('nursing-v1:post-release-monitoring','RG-06 and deferred external controls remain active as non-blocking post-release monitoring.','en','disclosure','supporting','report_release','1.0','approved','2026-07-30')
on conflict (claim_key) do update
set claim_text=excluded.claim_text,
    publication_status=excluded.publication_status,
    valid_from=excluded.valid_from,
    updated_at=now();

with target_release as (
  select rr.id
  from reporting.report_releases rr
  join reporting.products p on p.id=rr.product_id
  where p.product_key='au-nursing-roi-focus-2026-v1'
    and rr.release_version='1.0'
)
insert into reporting.release_claims(report_release_id,claim_id,publication_role)
select tr.id,c.id,
       case c.publication_status
         when 'approved' then 'included'
         when 'stale' then 'limitation'
         when 'prohibited' then 'excluded'
         else 'supporting'
       end
from evidence.claims c
cross join target_release tr
where c.claim_key like 'nursing-v1:%'
on conflict (report_release_id,claim_id) do update
set publication_role=excluded.publication_role;

create temporary table _nursing_monitoring(j jsonb) on commit drop;
insert into _nursing_monitoring
select value from jsonb_array_elements($m$[{"scope_type":"regulatory_control","scope_id":"RG-06-AHPRA-ARCHIVE","priority":"P1","control_type":"approved_program_archive","action_text":"Archive official Ahpra approved-program evidence for all seven controlled programmes.","trigger_condition":"Before material republication or when programme approval status changes.","status":"monitoring","owner":"Research / QA"},{"scope_type":"programme","scope_id":"003501K","priority":"P1","control_type":"reaccreditation_monitoring","action_text":"Monitor QUT Bachelor of Nursing reaccreditation status.","trigger_condition":"Official approval suspension, expiry or change is published.","status":"monitoring","owner":"Research"},{"scope_type":"programme","scope_id":"005195K","priority":"P0","control_type":"campus_approval_monitoring","action_text":"Resolve Flinders Adelaide City Campus approved-program campus match before claiming formal campus approval.","trigger_condition":"Official campus-specific approval evidence becomes available or a mismatch is confirmed.","status":"monitoring","owner":"Research / QA"},{"scope_type":"external_pending","scope_id":"EXTERNAL-PENDING-44","priority":"P2","control_type":"deferred_nonblocking_controls","action_text":"Retain and periodically review 44 deferred non-blocking external confirmations.","trigger_condition":"A source update materially changes a published claim or numeric input.","status":"monitoring","owner":"Research"},{"scope_type":"accessibility","scope_id":"REQA-OBS-001","priority":"P3","control_type":"tagged_pdf_housekeeping","action_text":"Improve tagged-PDF reading order in a future accessibility release.","trigger_condition":"Next PDF redesign or accessibility release.","status":"open","owner":"Design / QA"}]$m$::jsonb);

with target_release as (
  select rr.id
  from reporting.report_releases rr
  join reporting.products p on p.id=rr.product_id
  where p.product_key='au-nursing-roi-focus-2026-v1'
    and rr.release_version='1.0'
)
insert into reporting.monitoring_actions(
  report_release_id,scope_type,scope_id,priority,control_type,action_text,
  trigger_condition,status,owner
)
select tr.id,j->>'scope_type',j->>'scope_id',j->>'priority',j->>'control_type',
       j->>'action_text',j->>'trigger_condition',j->>'status',j->>'owner'
from _nursing_monitoring
cross join target_release tr
where not exists (
  select 1
  from reporting.monitoring_actions ma
  where ma.report_release_id=tr.id
    and ma.scope_type=j->>'scope_type'
    and ma.scope_id=j->>'scope_id'
    and ma.control_type=j->>'control_type'
);
