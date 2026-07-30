insert into catalog.programme_fees(
  offering_id,fee_type,amount,currency_code,billing_basis,student_market,evidence_id,effective_from,effective_to
)
select om.entity_id,'tuition',(f.value->>'amountAud')::numeric,'AUD','annual','international',mo.id,
       case when jsonb_typeof(f.value->'year')='number' then make_date((f.value->>'year')::integer,1,1) else f.effective_from end,
       case
         when f.effective_to is null then null
         when f.effective_to >= (case when jsonb_typeof(f.value->'year')='number' then make_date((f.value->>'year')::integer,1,1) else f.effective_from end)
           then f.effective_to
         else null
       end
from public.program_page_facts_au f
join catalog.legacy_entity_map om
  on om.legacy_schema='public' and om.legacy_table='courses_au' and om.legacy_key=f.course_id::text and om.entity_type='offering'
join evidence.metric_observations mo
  on mo.assumptions->>'legacy_fact_id'=f.id::text
where f.field_key='annual_tuition_aud'
  and f.review_status='verified'
  and jsonb_typeof(f.value->'amountAud')='number';

insert into catalog.programme_requirements(
  offering_id,requirement_type,requirement_text,structured_value,evidence_id,effective_from,effective_to,review_status
)
select om.entity_id,
       case f.field_key when 'english_requirement' then 'english' when 'entry_requirements' then 'academic' else 'other' end,
       case when jsonb_typeof(f.value)='string' then f.value#>>'{}' else f.value::text end,
       f.value,mo.id,f.effective_from,
       case when f.effective_to is not null and f.effective_from is not null and f.effective_to < f.effective_from then null else f.effective_to end,
       case f.review_status when 'verified' then 'verified' when 'stale' then 'stale' when 'rejected' then 'rejected' else 'review_required' end
from public.program_page_facts_au f
join catalog.legacy_entity_map om
  on om.legacy_schema='public' and om.legacy_table='courses_au' and om.legacy_key=f.course_id::text and om.entity_type='offering'
join evidence.metric_observations mo
  on mo.assumptions->>'legacy_fact_id'=f.id::text
where f.field_key in ('english_requirement','entry_requirements');