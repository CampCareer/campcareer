-- CampCareer Campus value pipeline foundation v1
--
-- Additive only. This migration wires the existing canonical catalogue,
-- evidence and labour schemas into the Campus product contract without
-- replacing the historical ROI views.

-- ---------------------------------------------------------------------------
-- Canonical Career <-> Programme identity
-- ---------------------------------------------------------------------------

alter table public.country_occupation_program_links
  add column if not exists programme_id uuid
  references catalog.programmes(id) on delete set null;

create index if not exists country_occupation_program_links_programme_idx
  on public.country_occupation_program_links(programme_id)
  where programme_id is not null;

create unique index if not exists country_occupation_program_links_canonical_uidx
  on public.country_occupation_program_links(profile_key, programme_id, relation_type)
  where programme_id is not null;

comment on column public.country_occupation_program_links.programme_id is
  'Canonical catalog.programmes UUID. program_ref remains as a compatibility/audit reference during migration.';

-- ---------------------------------------------------------------------------
-- Methodology registration
-- ---------------------------------------------------------------------------

insert into reporting.methodology_versions(
  methodology_key,
  version,
  status,
  description,
  specification,
  approved_at
)
values (
  'campus-roi-score',
  '1',
  'approved',
  'Relative programme value within a comparable country x field x qualification level x student-market cohort.',
  jsonb_build_object(
    'earnings_weight', 0.45,
    'employment_weight', 0.30,
    'affordability_weight', 0.25,
    'minimum_complete_rows', 5,
    'minimum_providers', 3,
    'missing_data_treatment', 'exclude',
    'external_rankings_in_score', false,
    'living_cost_in_score', false,
    'english_requirement_in_score', false
  ),
  now()
)
on conflict (methodology_key, version) do update
set description = excluded.description,
    specification = excluded.specification,
    status = excluded.status,
    approved_at = coalesce(reporting.methodology_versions.approved_at, excluded.approved_at);

insert into reporting.ranking_models(
  model_key,
  version,
  methodology_version_id,
  country_code,
  status
)
select
  'campus-roi-score',
  '1',
  mv.id,
  null,
  'approved'
from reporting.methodology_versions mv
where mv.methodology_key = 'campus-roi-score'
  and mv.version = '1'
on conflict (model_key, version) do update
set methodology_version_id = excluded.methodology_version_id,
    status = excluded.status;

insert into reporting.ranking_weights(
  ranking_model_id,
  metric_key,
  weight,
  minimum_confidence,
  missing_data_treatment
)
select rm.id, weights.metric_key, weights.weight, 'medium', 'exclude'
from reporting.ranking_models rm
cross join (values
  ('graduate_earnings', 0.45::numeric),
  ('graduate_employment', 0.30::numeric),
  ('affordability', 0.25::numeric)
) as weights(metric_key, weight)
where rm.model_key = 'campus-roi-score'
  and rm.version = '1'
on conflict (ranking_model_id, metric_key) do update
set weight = excluded.weight,
    minimum_confidence = excluded.minimum_confidence,
    missing_data_treatment = excluded.missing_data_treatment;

-- ---------------------------------------------------------------------------
-- Server-only Campus value input read model
-- ---------------------------------------------------------------------------
--
-- The view intentionally exposes inputs, not a pre-computed score. Cohort
-- readiness and percentile scoring live in application code so the exact peer
-- cohort is explicit and testable. Only verified canonical evidence enters the
-- input view.

create or replace view public.campus_programme_value_inputs_v1
with (security_invoker = true) as
with primary_concepts as (
  select distinct on (pc.programme_id)
    pc.programme_id,
    sc.concept_key as field_key,
    sc.canonical_name as field_name
  from taxonomy.programme_concepts pc
  join taxonomy.study_concepts sc on sc.id = pc.concept_id
  where pc.relation_type = 'primary'
    and sc.status = 'active'
  order by pc.programme_id,
    case pc.confidence when 'high' then 3 when 'medium' then 2 else 1 end desc,
    sc.concept_key
),
cricos_identifiers as (
  select programme_id, max(identifier_value) as cricos_code
  from catalog.programme_identifiers
  where identifier_system = 'CRICOS_COURSE_CODE'
  group by programme_id
),
best_offerings as (
  select distinct on (o.programme_id)
    o.id as offering_id,
    o.programme_id,
    o.campus_id,
    o.market,
    o.duration_months,
    o.enrolment_status,
    o.source_url,
    o.source_checked_at
  from catalog.programme_offerings o
  where o.market in ('international', 'both')
    and o.enrolment_status <> 'closed'
    and o.verification_status = 'verified'
  order by o.programme_id,
    o.source_checked_at desc nulls last,
    o.updated_at desc,
    o.id
),
best_fees as (
  select distinct on (f.offering_id)
    f.offering_id,
    f.amount as annual_tuition,
    f.currency_code,
    f.evidence_id as fee_evidence_id,
    f.effective_from as fee_effective_from
  from catalog.programme_fees f
  where f.fee_type = 'tuition'
    and f.billing_basis = 'annual'
    and f.student_market in ('international', 'both')
  order by f.offering_id,
    f.effective_from desc nulls last,
    f.updated_at desc,
    f.id
),
best_english as (
  select distinct on (r.offering_id)
    r.offering_id,
    r.requirement_text as english_requirement_text,
    r.structured_value as english_requirement,
    r.evidence_id as english_evidence_id
  from catalog.programme_requirements r
  where r.requirement_type = 'english'
    and r.review_status = 'verified'
  order by r.offering_id,
    r.effective_from desc nulls last,
    r.updated_at desc,
    r.id
),
best_accreditation as (
  select distinct on (a.programme_id)
    a.programme_id,
    a.authority_name,
    a.authority_url,
    a.accreditation_type,
    a.status as accreditation_status,
    a.status_text,
    a.evidence_id as accreditation_evidence_id,
    a.last_checked_at
  from catalog.programme_accreditations a
  where a.review_status = 'verified'
    and a.status in ('approved', 'conditional')
  order by a.programme_id,
    case a.status when 'approved' then 2 else 1 end desc,
    a.last_checked_at desc nulls last,
    a.updated_at desc,
    a.id
),
ranked_outcomes as (
  select
    o.*,
    e.confidence as evidence_confidence,
    row_number() over (
      partition by o.institution_id, o.field_code, o.qualification_level_id, o.metric_key
      order by o.graduation_year desc nulls last,
        o.updated_at desc,
        o.created_at desc,
        o.id
    ) as rn
  from labour.outcome_observations o
  join evidence.metric_observations e on e.id = o.evidence_id
  where o.review_status = 'verified'
    and o.institution_id is not null
    and o.field_code is not null
    and o.qualification_level_id is not null
    and o.metric_key in ('median_earnings', 'employment_rate')
),
provider_outcomes as (
  select
    institution_id,
    field_code,
    qualification_level_id,
    max(value) filter (where metric_key = 'median_earnings' and rn = 1) as median_earnings,
    max(unit) filter (where metric_key = 'median_earnings' and rn = 1) as earnings_unit,
    (max(evidence_id::text) filter (where metric_key = 'median_earnings' and rn = 1))::uuid as earnings_evidence_id,
    max(evidence_confidence) filter (where metric_key = 'median_earnings' and rn = 1) as earnings_confidence,
    max(value) filter (where metric_key = 'employment_rate' and rn = 1) as employment_rate,
    max(unit) filter (where metric_key = 'employment_rate' and rn = 1) as employment_unit,
    (max(evidence_id::text) filter (where metric_key = 'employment_rate' and rn = 1))::uuid as employment_evidence_id,
    max(evidence_confidence) filter (where metric_key = 'employment_rate' and rn = 1) as employment_confidence
  from ranked_outcomes
  where rn = 1
  group by institution_id, field_code, qualification_level_id
)
select
  p.id as programme_id,
  i.id as institution_id,
  i.slug as institution_slug,
  i.canonical_name as institution_name,
  i.institution_kind,
  p.canonical_title as programme_title,
  ci.cricos_code,
  pc.field_key,
  pc.field_name,
  qf.framework_code as qualification_framework,
  ql.level_code as qualification_level_code,
  ql.label as qualification_level_label,
  bo.offering_id,
  bo.market as student_market,
  bo.enrolment_status,
  coalesce(bo.duration_months, p.default_duration_months) as duration_months,
  bo.source_url as offering_source_url,
  bo.source_checked_at as offering_source_checked_at,
  c.id as campus_id,
  c.name as campus_name,
  c.city,
  c.region,
  c.latitude,
  c.longitude,
  bf.annual_tuition,
  bf.currency_code,
  bf.fee_evidence_id,
  bf.fee_effective_from,
  po.median_earnings,
  po.earnings_unit,
  po.earnings_evidence_id,
  po.earnings_confidence,
  case
    when po.employment_unit = 'ratio' then po.employment_rate * 100
    else po.employment_rate
  end as employment_rate_pct,
  po.employment_evidence_id,
  po.employment_confidence,
  be.english_requirement_text,
  be.english_requirement,
  be.english_evidence_id,
  ba.authority_name as accreditation_authority,
  ba.authority_url as accreditation_authority_url,
  ba.accreditation_type,
  ba.accreditation_status,
  ba.status_text as accreditation_status_text,
  ba.accreditation_evidence_id,
  ba.last_checked_at as accreditation_checked_at,
  case
    when bf.annual_tuition > 0
      and coalesce(bo.duration_months, p.default_duration_months) > 0
      and po.median_earnings > 0
      and po.employment_rate > 0
    then true
    else false
  end as complete_value_input
from catalog.programmes p
join catalog.institutions i on i.id = p.institution_id
join primary_concepts pc on pc.programme_id = p.id
join core.qualification_levels ql on ql.id = p.qualification_level_id
join core.qualification_frameworks qf on qf.id = ql.framework_id
join best_offerings bo on bo.programme_id = p.id
left join catalog.campuses c on c.id = bo.campus_id
left join cricos_identifiers ci on ci.programme_id = p.id
left join best_fees bf on bf.offering_id = bo.offering_id
left join provider_outcomes po
  on po.institution_id = p.institution_id
 and po.field_code = pc.field_key
 and po.qualification_level_id = p.qualification_level_id
left join best_english be on be.offering_id = bo.offering_id
left join best_accreditation ba on ba.programme_id = p.id
where p.status = 'active'
  and i.status = 'active';

comment on view public.campus_programme_value_inputs_v1 is
  'Server-only canonical Campus score inputs. Percentile scoring/readiness are applied in application code by country x field x qualification x student-market cohort.';

revoke all on public.campus_programme_value_inputs_v1 from public, anon, authenticated;
grant select on public.campus_programme_value_inputs_v1 to service_role;
