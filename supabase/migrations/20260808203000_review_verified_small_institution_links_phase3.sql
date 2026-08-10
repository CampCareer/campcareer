-- Canada Programs Phase 3: occupation review for smaller institution batches whose
-- international programme state is already explicit. Publication remains separately gated.

-- Confederation Practical Nursing is an RPN pathway, not the registered-nurse target.
update public.program_occupation_ca_staging o
set review_status='rejected', relation_type=null, match_basis='manual',
    source_checked_at=date '2026-08-08',
    reviewer_note='Rejected in Phase 3: Practical Nursing is a distinct practical-nurse pathway and is not direct preparation for the registered-nurse target.',
    reviewed_at=now()
from public.program_catalog_ca_staging c
where o.program_catalog_id=c.id and o.review_status='candidate'
  and c.institution_name='Confederation College'
  and o.canonical_career_id='registered-nurse'
  and lower(c.title)='practical nursing';

-- Algonquin, College of New Caledonia, Confederation, Langara, RRC Polytech,
-- Selkirk and Vancouver Island University reviewed relationships.
update public.program_occupation_ca_staging o
set review_status='approved',
    relation_type=case
      -- Regulated professional engineer targets: technician/technology credentials are related only.
      when o.canonical_career_id in ('civil-engineer','electrical-engineer','mechanical-engineer') then 'related'
      -- Technician credentials are direct technician preparation.
      when o.canonical_career_id='engineering-technician' then 'direct'
      -- Regulated pharmacist target: assistant/technician or pre-pharmacy study is not pharmacist qualification.
      when o.canonical_career_id='pharmacist' and lower(c.title) like '%pharmacy technician%' then 'related'
      when o.canonical_career_id='pharmacist' and lower(c.title) like '%pharmacy assistant%' then 'related'
      when o.canonical_career_id='pharmacist' and lower(c.title) like '%entry to pharmacy%' then 'common_pathway'
      -- Nursing Practice in Canada is a bridging/upgrading pathway rather than an RN degree itself.
      when o.canonical_career_id='registered-nurse' and lower(c.title) like '%nursing practice in canada%' then 'related'
      -- Social-work certificate/diploma study is a pathway; it does not itself establish regulated social-worker status everywhere.
      when o.canonical_career_id='social-worker' then 'common_pathway'
      -- Supply chain / logistics programmes are common pathways to several management/analyst roles.
      when o.canonical_career_id in ('logistics-coordinator','supply-chain-analyst','warehouse-manager') then 'common_pathway'
      -- Hospitality, chef and tourism management programmes are occupational pathways rather than one-to-one licences.
      when o.canonical_career_id in ('chef','hospitality-supervisor','tourism-manager') then 'common_pathway'
      -- Computing Science is a broad pathway to software development.
      when o.canonical_career_id='software-developer' and lower(c.title) like 'computer science%' then 'common_pathway'
      -- Fine woodworking overlaps carpentry but is not a one-to-one carpentry credential.
      when o.canonical_career_id='carpenter' and lower(c.title) like '%fine woodworking%' then 'related'
      -- Nutrition/food-service management overlaps hospitality supervision but is narrower/different.
      when o.canonical_career_id='hospitality-supervisor' and lower(c.title) like '%nutrition and food service%' then 'related'
      else 'direct'
    end,
    match_basis='manual', source_checked_at=date '2026-08-08',
    reviewer_note=case
      when o.canonical_career_id in ('civil-engineer','electrical-engineer','mechanical-engineer')
        then 'Reviewed as related education: technician/technology study is relevant but does not itself confer the target regulated professional engineer title.'
      when o.canonical_career_id='pharmacist'
        then 'Reviewed conservatively: pharmacy assistant/technician or pre-pharmacy study is related/pathway education and does not itself qualify a graduate as a pharmacist.'
      when o.canonical_career_id='registered-nurse' and lower(c.title) like '%nursing practice in canada%'
        then 'Reviewed as a nursing bridging/upgrading pathway rather than a standalone registered-nurse degree credential.'
      when o.canonical_career_id='social-worker'
        then 'Reviewed as a social-work education pathway; regulated professional eligibility is jurisdiction-specific and is not inferred from this credential alone.'
      else 'Reviewed against current programme title, credential scope and target occupation; publication eligibility remains separately gated.'
    end,
    reviewed_at=now()
from public.program_catalog_ca_staging c
join public.program_pgwp_ca_staging p on p.program_catalog_id=c.id
where o.program_catalog_id=c.id and o.review_status='candidate'
  and c.institution_name in (
    'Algonquin College','College of New Caledonia','Confederation College','Langara College',
    'Red River College Polytechnic','Selkirk College','Vancouver Island University'
  )
  and (
    p.international_program_admission_status in (
      'school_pgwp_aligned_and_listed_for_international_intake',
      'planned_international_spaces_fall_2026',
      'international_next_available_september_2026',
      'international_next_available_september_2026_january_2027',
      'school_pgwp_aligned',
      'international_program_listed_but_pgwp_noneligible',
      'potentially_accepting_if_seat_available',
      'accepting_international_applications',
      'international_intake_listed_but_pgwp_noneligible'
    )
  )
  and not (
    c.institution_name='Confederation College'
    and o.canonical_career_id='registered-nurse'
    and lower(c.title)='practical nursing'
  );
