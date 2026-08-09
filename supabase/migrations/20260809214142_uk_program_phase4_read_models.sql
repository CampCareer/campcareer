-- UK Programs Phase 4.2-4.4 integration closeout.
--
-- The shared country_occupation_program_links table cannot be used yet because
-- country_occupation_profiles currently has no UK rows. Rather than fabricating
-- profile records, preserve the reviewed UK occupation relations in a canonical
-- programme read model keyed by the deterministic Phase 4 programme UUID.
--
-- Programme-level campus/city linkage also remains deliberately empty: the
-- current UK programme evidence does not establish a programme-specific campus.
-- Institution presence is not used as a proxy for programme delivery location.

create or replace view public.program_occupation_canonical_uk_v1
with (security_invoker=true) as
select
  c.programme_id,
  c.institution_id,
  c.institution_slug,
  c.institution_name,
  c.source_name,
  c.source_program_key,
  o.canonical_career_id,
  o.relation_type as source_relation_type,
  case
    when o.relation_type in ('direct_career_path','direct_discipline','direct_skill_pathway') then 'direct'
    when o.relation_type in ('professional_registration_pathway','professional_pathway_stage','professional_engineering_pathway') then 'progression'
    else 'related'
  end as normalized_relation_type,
  o.match_basis,
  o.match_pattern,
  o.rule_version,
  o.source_checked_at,
  o.reviewed_at,
  o.reviewer_note
from public.program_catalog_canonical_uk_v1 c
join public.program_catalog_uk_staging p
  on p.source_name=c.source_name
 and p.source_program_key=c.source_program_key
join public.program_occupation_uk_staging o
  on o.program_catalog_id=p.id
where o.review_status='approved'
  and p.verification_tier in ('A','B');

comment on view public.program_occupation_canonical_uk_v1 is
  'Service-role UK Phase 4 canonical Programme to Occupation relations. Uses the reviewed staging relations but exposes deterministic canonical programme UUIDs. Shared country occupation profile materialization is deferred because UK country_occupation_profiles is currently empty.';

revoke all on public.program_occupation_canonical_uk_v1 from public,anon,authenticated;
grant select on public.program_occupation_canonical_uk_v1 to service_role;

create or replace view public.program_explorer_uk_v1
with (security_invoker=true) as
select
  c.programme_id,
  c.institution_id,
  c.institution_slug,
  c.institution_name,
  c.canonical_title,
  c.qualification_title,
  c.canonical_level,
  c.programme_type,
  c.field_name,
  c.default_duration_months,
  c.study_mode,
  c.verification_tier,
  case when c.verification_tier='A' then 'publishable' else 'review' end as publication_status,
  (c.verification_tier='A') as indexable,
  c.international_students_eligible,
  c.student_sponsor_eligible,
  c.canonical_admission_state,
  c.intake_label,
  c.intake_start_date,
  c.application_deadline,
  po.enrolment_status,
  po.verification_status as offering_verification_status,
  null::uuid as campus_id,
  null::text as city_slug,
  null::text as city_name,
  coalesce((
    select array_agg(distinct r.canonical_career_id order by r.canonical_career_id)
    from public.program_occupation_canonical_uk_v1 r
    where r.programme_id=c.programme_id
  ),array[]::text[]) as canonical_career_ids,
  c.official_program_url
from public.program_catalog_canonical_uk_v1 c
join catalog.programme_offerings po
  on po.programme_id=c.programme_id
 and po.source_system='UK_PROGRAM_PHASE3_CANONICAL'
where c.verification_tier in ('A','B');

comment on view public.program_explorer_uk_v1 is
  'Service-role UK Phase 4 programme explorer read model. Tier A is publication-ready, Tier B remains review-only. Programme-specific city/campus fields stay null until evidence exists.';

revoke all on public.program_explorer_uk_v1 from public,anon,authenticated;
grant select on public.program_explorer_uk_v1 to service_role;

create or replace view public.program_detail_uk_v1
with (security_invoker=true) as
select
  e.*,
  c.source_name,
  c.source_program_key,
  c.source_program_name,
  c.native_framework,
  c.native_level_code,
  c.collection_status,
  c.official_qualification_url,
  c.international_admission_status,
  c.admission_source_url,
  c.international_source_url,
  c.sponsor_source_url,
  c.international_verification_status,
  c.verified_at,
  coalesce((
    select jsonb_agg(
      jsonb_build_object(
        'careerId',r.canonical_career_id,
        'relationType',r.normalized_relation_type,
        'sourceRelationType',r.source_relation_type,
        'matchBasis',r.match_basis,
        'sourceCheckedAt',r.source_checked_at
      ) order by r.canonical_career_id,r.source_relation_type
    )
    from public.program_occupation_canonical_uk_v1 r
    where r.programme_id=e.programme_id
  ),'[]'::jsonb) as occupation_relations
from public.program_explorer_uk_v1 e
join public.program_catalog_canonical_uk_v1 c
  on c.programme_id=e.programme_id;

comment on view public.program_detail_uk_v1 is
  'Service-role UK Phase 4 programme detail read model with source provenance and reviewed occupation relations.';

revoke all on public.program_detail_uk_v1 from public,anon,authenticated;
grant select on public.program_detail_uk_v1 to service_role;

create or replace view public.program_compare_uk_v1
with (security_invoker=true) as
select
  programme_id,
  institution_id,
  institution_slug,
  institution_name,
  canonical_title,
  qualification_title,
  canonical_level,
  programme_type,
  field_name,
  default_duration_months,
  study_mode,
  verification_tier,
  publication_status,
  indexable,
  international_students_eligible,
  student_sponsor_eligible,
  canonical_admission_state,
  intake_label,
  intake_start_date,
  application_deadline,
  enrolment_status,
  campus_id,
  city_slug,
  city_name,
  canonical_career_ids,
  official_program_url
from public.program_explorer_uk_v1;

comment on view public.program_compare_uk_v1 is
  'Service-role UK Phase 4 comparison projection. City/campus remain null rather than inferred from institution presence.';

revoke all on public.program_compare_uk_v1 from public,anon,authenticated;
grant select on public.program_compare_uk_v1 to service_role;

do $$
declare
  relation_count integer;
  relation_career_count integer;
  explorer_count integer;
  detail_count integer;
  compare_count integer;
  tier_a_count integer;
  tier_b_count integer;
  city_link_count integer;
  uk_profile_count integer;
  tier_c_leak_count integer;
begin
  select count(*),count(distinct canonical_career_id)
  into relation_count,relation_career_count
  from public.program_occupation_canonical_uk_v1;

  if relation_count<>90 or relation_career_count<>56 then
    raise exception 'Expected 90 canonical UK programme-occupation relations across 56 careers; found % / %',relation_count,relation_career_count;
  end if;

  select
    count(*),
    count(*) filter(where verification_tier='A'),
    count(*) filter(where verification_tier='B'),
    count(*) filter(where campus_id is not null or city_slug is not null)
  into explorer_count,tier_a_count,tier_b_count,city_link_count
  from public.program_explorer_uk_v1;

  if explorer_count<>76 or tier_a_count<>75 or tier_b_count<>1 then
    raise exception 'Expected UK explorer 76 rows (A75/B1); found % (A%/B%)',explorer_count,tier_a_count,tier_b_count;
  end if;

  if city_link_count<>0 then
    raise exception 'UK Phase 4 invariant failed: % programme city/campus links were inferred without programme-level evidence',city_link_count;
  end if;

  select count(*) into detail_count from public.program_detail_uk_v1;
  select count(*) into compare_count from public.program_compare_uk_v1;

  if detail_count<>76 or compare_count<>76 then
    raise exception 'Expected 76 UK detail / compare rows; found % / %',detail_count,compare_count;
  end if;

  select count(*) into uk_profile_count
  from public.country_occupation_profiles
  where country_code='UK';

  if uk_profile_count<>0 then
    raise notice 'UK country_occupation_profiles now has % rows; shared country_occupation_program_links can be materialized in a later sync without changing canonical programme identity',uk_profile_count;
  end if;

  select count(*) into tier_c_leak_count
  from public.program_occupation_canonical_uk_v1 r
  join public.program_catalog_uk_staging p
    on p.source_name=r.source_name
   and p.source_program_key=r.source_program_key
  where p.verification_tier='C';

  if tier_c_leak_count>0 then
    raise exception 'UK Phase 4 invariant failed: % Tier C occupation relations leaked into canonical read models',tier_c_leak_count;
  end if;
end $$;
