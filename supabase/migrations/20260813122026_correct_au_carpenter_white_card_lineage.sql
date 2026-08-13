update public.career_raw_observations
set source_key='au-training-cpcwhs1001',
    raw_value=jsonb_build_object('requirement','general construction induction training / white card','unit_code','CPCWHS1001','unit_title','Prepare to work safely in the construction industry','mandatory_for_construction_work',true),
    directness='direct',
    proxy_reason=null,
    confidence=0.98,
    explanation='CPCWHS1001 is the direct official White Card training source; this is safety certification rather than a Carpenter occupational licence.'
where observation_key='au-carpentry-white-card' and profile_key='AU:carpenter';

update public.career_foundation_licensing_evidence
set source_key='au-training-cpcwhs1001',
    official_source_url='https://training.gov.au/Training/Details/CPCWHS1001',
    evidence_quality='high',
    notes='CPCWHS1001 is the direct White Card training source; contractor-only licences remain separate.'
where evidence_key='AU:carpenter:white-card';
