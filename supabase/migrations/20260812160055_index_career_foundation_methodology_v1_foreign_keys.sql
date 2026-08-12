create index if not exists career_foundation_job_opportunities_source_idx
  on public.career_foundation_job_opportunities(source_key);

create index if not exists career_foundation_licensing_mapping_idx
  on public.career_foundation_licensing_evidence(mapping_key);

create index if not exists career_foundation_licensing_source_idx
  on public.career_foundation_licensing_evidence(source_key);

create index if not exists career_foundation_visa_pathways_source_idx
  on public.career_foundation_visa_pathways(source_key);
