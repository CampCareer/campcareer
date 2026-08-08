-- Finalize remaining occupation-priority Fanshawe programmes and relation quality using current official open-program and programme pages checked 2026-08-08.
with verified(program_code, official_program_url) as (
  values
    ('ANI1','https://www.fanshawec.ca/programs/ani1-animation/next'),
    ('BID1','https://www.fanshawec.ca/programs/bid1-honours-bachelor-interior-design/next'),
    ('BPM4','https://www.fanshawec.ca/programs/bpm4-baking-and-pastry-arts-management/next'),
    ('BRJ6','https://www.fanshawec.ca/programs/brj6-journalism-multimedia/current'),
    ('BRT3','https://www.fanshawec.ca/programs/brt3-broadcasting-television-and-film-production/next'),
    ('CLM9','https://www.fanshawec.ca/programs/clm9-culinary-management/next'),
    ('CYW4','https://www.fanshawec.ca/programs/cyw4-child-and-youth-care/current'),
    ('FNM2','https://www.fanshawec.ca/programs/fnm2-nutrition-and-food-service-management/next'),
    ('FPO2','https://www.fanshawec.ca/programs/fpo2-food-processing-operational-leadership/current'),
    ('HTN1','https://www.fanshawec.ca/programs/htn1-horticulture-technician/current'),
    ('IDP3','https://www.fanshawec.ca/programs/idp3-interactive-media-design/current')
), verified_catalog as (
  update public.program_catalog_ca_staging c
  set official_program_url=v.official_program_url,
      source_status='official_program_page_verified_international_open_2026_27',
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  from verified v
  where c.institution_name='Fanshawe College' and c.program_code=v.program_code
  returning c.id,c.program_code
), verified_pgwp as (
  update public.program_pgwp_ca_staging p
  set international_students_eligible=true,
      international_program_admission_status='official_program_page_international_open_2026_27',
      verified_at=now()
  where p.program_catalog_id in (select id from verified_catalog)
  returning p.program_catalog_id
), held(program_code, official_program_url, source_status, admission_status) as (
  values
    ('FPD1','https://www.fanshawec.ca/programs/fpd1-food-processing-product-development/current','international_not_accepting_current_future_intake_2026','international_latest_listed_intake_closed_no_future_open_intake'),
    ('GRD1','https://www.fanshawec.ca/programs/grd1-graphic-design/current','international_not_accepting_current_future_intake_2026','international_september_2026_closed'),
    ('VTT1','https://www.fanshawec.ca/programs/vtt1-veterinary-technician/current','international_not_accepting_current_future_intake_2026','international_september_2026_closed'),
    ('SEP2','https://www.fanshawec.ca/programs/sep2-event-planning/current','pending_review_online_only_non_campus_2026_27','program_currently_fully_online_only_not_campus_study')
), held_catalog as (
  update public.program_catalog_ca_staging c
  set official_program_url=h.official_program_url,
      source_status=h.source_status,
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  from held h
  where c.institution_name='Fanshawe College' and c.program_code=h.program_code
  returning c.id,c.program_code
), held_pgwp as (
  update public.program_pgwp_ca_staging p
  set international_program_admission_status=h.admission_status,
      verified_at=now()
  from held_catalog c join held h on h.program_code=c.program_code
  where p.program_catalog_id=c.id
  returning p.program_catalog_id
), duplicate_bls4 as (
  update public.program_catalog_ca_staging c
  set source_status='legacy_duplicate_shadow_current_coded_program',
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  where c.id=1990 and c.institution_name='Fanshawe College'
  returning c.id
), duplicate_bls4_pgwp as (
  update public.program_pgwp_ca_staging p
  set international_students_eligible=false,
      international_program_admission_status='duplicate_shadow_of_fanshawe_bls4',
      verified_at=now()
  where p.program_catalog_id in (select id from duplicate_bls4)
  returning p.program_catalog_id
), bah1 as (
  update public.program_catalog_ca_staging c
  set program_code='BAH1',
      official_program_url='https://www.fanshawec.ca/programs/bah1-business-administration-human-resources/current',
      source_status='international_not_available_domestic_only_2026',
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  where c.id=1992 and c.institution_name='Fanshawe College'
  returning c.id
), bah1_pgwp as (
  update public.program_pgwp_ca_staging p
  set international_students_eligible=false,
      international_program_admission_status='current_program_domestic_applicants_only_2026',
      verified_at=now()
  where p.program_catalog_id in (select id from bah1)
  returning p.program_catalog_id
), reject_brj as (
  update public.program_occupation_ca_staging o
  set review_status='rejected',
      match_basis='manual',
      relation_type=null,
      source_checked_at=now(),
      reviewed_at=now(),
      reviewer_note='Rejected: Journalism-Multimedia prepares journalists/reporters and media storytellers, not the Multimedia Designer occupation.'
  from public.program_catalog_ca_staging c
  where o.program_catalog_id=c.id and c.institution_name='Fanshawe College' and c.program_code='BRJ6'
    and o.canonical_career_id='multimedia-designer'
  returning o.program_catalog_id
), direct_relations as (
  update public.program_occupation_ca_staging o
  set review_status='approved',
      match_basis='manual',
      relation_type='direct',
      source_checked_at=now(),
      reviewed_at=now(),
      reviewer_note='Reviewed against current Fanshawe programme scope and career outcomes.'
  from public.program_catalog_ca_staging c
  where o.program_catalog_id=c.id and c.institution_name='Fanshawe College'
    and ((c.program_code='ANI1' and o.canonical_career_id='animator')
      or (c.program_code='BID1' and o.canonical_career_id='interior-designer')
      or (c.program_code='BPM4' and o.canonical_career_id='baker')
      or (c.program_code='CYW4' and o.canonical_career_id='youth-worker')
      or (c.program_code='HTN1' and o.canonical_career_id='horticulturist'))
  returning o.program_catalog_id
), pathway_relations as (
  update public.program_occupation_ca_staging o
  set review_status='approved',
      match_basis='manual',
      relation_type='common_pathway',
      source_checked_at=now(),
      reviewed_at=now(),
      reviewer_note='Reviewed as a common education pathway rather than a one-to-one occupational credential.'
  from public.program_catalog_ca_staging c
  where o.program_catalog_id=c.id and c.institution_name='Fanshawe College'
    and ((c.program_code='BRT3' and o.canonical_career_id='film-editor')
      or (c.program_code='CLM9' and o.canonical_career_id='chef')
      or (c.program_code='IDP3' and o.canonical_career_id='multimedia-designer'))
  returning o.program_catalog_id
)
update public.program_occupation_ca_staging o
set review_status='approved',
    match_basis='manual',
    relation_type='related',
    source_checked_at=now(),
    reviewed_at=now(),
    reviewer_note='Related programme, but the programme title/outcomes are broader or adjacent to the target occupation.'
from public.program_catalog_ca_staging c
where o.program_catalog_id=c.id and c.institution_name='Fanshawe College'
  and ((c.program_code='FNM2' and o.canonical_career_id='hospitality-supervisor')
    or (c.program_code='FPO2' and o.canonical_career_id='food-technologist'));
