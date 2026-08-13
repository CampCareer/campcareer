-- Freeze the final 30-point cross-country methodology for US Carpenter.
-- Relative salary remains unchanged. Employment momentum becomes actual 5-year
-- employment CAGR excess vs all employment; projected growth becomes projected
-- CAGR excess vs all occupations. Preserve v3 and create a v4 snapshot.

create or replace function public.career_foundation_component_score(
  p_component_key text,
  p_normalized_value numeric,
  p_formula_version text,
  p_availability text
)
returns numeric
language sql
immutable
parallel safe
set search_path = pg_catalog
as $$
  select case
    when p_availability <> 'available' or p_normalized_value is null then null::numeric
    when p_formula_version not in (
      'career-opportunity-v2-foundation',
      'career-opportunity-v3-foundation',
      'career-opportunity-v4-foundation'
    ) then null::numeric
    when p_component_key = 'relative_salary'
      then round(greatest(0::numeric, least(10::numeric, 5::numeric + ((p_normalized_value - 1::numeric) * 10::numeric))), 2)
    when p_component_key = 'projected_growth' and p_formula_version in ('career-opportunity-v2-foundation','career-opportunity-v3-foundation')
      then round(greatest(0::numeric, least(10::numeric, 5::numeric + (p_normalized_value / 2::numeric))), 2)
    when p_component_key = 'employment_momentum' and p_formula_version in ('career-opportunity-v2-foundation','career-opportunity-v3-foundation')
      then round(greatest(0::numeric, least(10::numeric, 5::numeric + ((p_normalized_value - 1::numeric) * 5::numeric))), 2)
    when p_component_key in ('projected_growth','employment_momentum') and p_formula_version = 'career-opportunity-v4-foundation'
      then round(greatest(0::numeric, least(10::numeric, 5::numeric + (p_normalized_value * 2.5::numeric))), 2)
    when p_formula_version = 'career-opportunity-v2-foundation' and p_component_key = 'entry_accessibility'
      then round(greatest(0::numeric, least(15::numeric, p_normalized_value)), 2)
    when p_formula_version in ('career-opportunity-v3-foundation','career-opportunity-v4-foundation') and p_component_key = 'shortage_signal'
      then round(greatest(0::numeric, least(20::numeric, p_normalized_value)), 2)
    when p_formula_version in ('career-opportunity-v3-foundation','career-opportunity-v4-foundation') and p_component_key = 'vacancy_intensity'
      then round(greatest(0::numeric, least(15::numeric, p_normalized_value)), 2)
    when p_formula_version in ('career-opportunity-v3-foundation','career-opportunity-v4-foundation') and p_component_key = 'industry_diversity'
      then round(greatest(0::numeric, least(5::numeric, p_normalized_value)), 2)
    when p_formula_version in ('career-opportunity-v3-foundation','career-opportunity-v4-foundation') and p_component_key = 'entry_accessibility'
      then round(greatest(0::numeric, least(15::numeric, p_normalized_value)), 2)
    when p_formula_version in ('career-opportunity-v3-foundation','career-opportunity-v4-foundation') and p_component_key = 'visa_accessibility'
      then round(greatest(0::numeric, least(10::numeric, p_normalized_value)), 2)
    when p_formula_version in ('career-opportunity-v3-foundation','career-opportunity-v4-foundation') and p_component_key = 'entry_burden'
      then round(greatest(0::numeric, least(5::numeric, p_normalized_value)), 2)
    else null::numeric
  end
$$;

revoke all on function public.career_foundation_component_score(text,numeric,text,text)
from public, anon, authenticated;
grant execute on function public.career_foundation_component_score(text,numeric,text,text)
to service_role;

insert into public.career_official_sources
(source_key, authority, title, url, source_type, last_verified_on, notes)
values
('us-bls-cps-aa-2020','U.S. Bureau of Labor Statistics','CPS annual averages 2020: employed persons by detailed occupation','https://www.bls.gov/cps/aa2020/cpsaat11.htm','official_primary','2026-08-13','Official CPS household annual-average detailed occupation employment. Used as the 5-year actual employment momentum start point.'),
('us-bls-cps-aa-2025','U.S. Bureau of Labor Statistics','CPS annual averages 2025: employed people by detailed occupation','https://www.bls.gov/cps/cpsaat11.htm','official_primary','2026-08-13','Official CPS household annual-average detailed occupation employment. Used as the 5-year actual employment momentum end point.')
on conflict (source_key) do update set authority=excluded.authority,title=excluded.title,url=excluded.url,source_type=excluded.source_type,last_verified_on=excluded.last_verified_on,notes=excluded.notes;

insert into public.career_raw_observations (
  observation_key, profile_key, mapping_key, source_key, metric_key,
  reference_period, as_of_date, raw_value, unit, availability, reason,
  directness, mapping_quality, proxy_reason, source_type, quality,
  confidence, last_verified_on, explanation
)
values
('us-carpenter-cps-employment-2020','US:carpenter','US:carpenter:SOC:47-2031','us-bls-cps-aa-2020','actual_employment','2020 annual average','2020-12-31',to_jsonb(1114000),'persons','available',null,'direct','high',null,'official_primary','medium',0.850,'2026-08-13','BLS CPS annual averages report 1.114 million employed Carpenters in 2020. CPS is used for actual employment momentum because BLS cautions against OEWS time-series analysis.'),
('us-all-cps-employment-2020','US:carpenter',null,'us-bls-cps-aa-2020','actual_all_employment','2020 annual average','2020-12-31',to_jsonb(147795000),'persons','available',null,'direct','not_applicable',null,'official_primary','high',0.980,'2026-08-13','BLS CPS annual averages report 147.795 million total employed people in 2020, used as the same-source national benchmark.'),
('us-carpenter-cps-employment-2025','US:carpenter','US:carpenter:SOC:47-2031','us-bls-cps-aa-2025','actual_employment','2025 annual average','2025-12-31',to_jsonb(1178000),'persons','available',null,'direct','high',null,'official_primary','medium',0.850,'2026-08-13','BLS CPS annual averages report 1.178 million employed Carpenters in 2025.'),
('us-all-cps-employment-2025','US:carpenter',null,'us-bls-cps-aa-2025','actual_all_employment','2025 annual average','2025-12-31',to_jsonb(163493000),'persons','available',null,'direct','not_applicable',null,'official_primary','high',0.980,'2026-08-13','BLS CPS annual averages report 163.493 million total employed people in 2025, used as the same-source national benchmark.'),
('us-carpenter-projected-employment-2024-2034','US:carpenter','US:carpenter:SOC:47-2031','us-bls-ep-2024-2034','projected_employment_levels','2024-2034','2024-01-01',jsonb_build_object('employment_2024',959000,'employment_2034',1002100,'years',10),'persons','available',null,'direct','high',null,'official_primary','high',0.980,'2026-08-13','BLS National Employment Matrix projects Carpenter employment from 959,000 in 2024 to 1,002,100 in 2034.'),
('us-all-projected-employment-2024-2034','US:carpenter',null,'us-bls-ep-2024-2034','projected_all_employment_levels','2024-2034','2024-01-01',jsonb_build_object('employment_2024',169956100,'employment_2034',175167900,'years',10),'persons','available',null,'direct','not_applicable',null,'official_primary','high',0.990,'2026-08-13','BLS National Employment Matrix projects total all-occupations employment from 169.9561 million in 2024 to 175.1679 million in 2034.')
on conflict (observation_key) do update set profile_key=excluded.profile_key,mapping_key=excluded.mapping_key,source_key=excluded.source_key,metric_key=excluded.metric_key,reference_period=excluded.reference_period,as_of_date=excluded.as_of_date,raw_value=excluded.raw_value,unit=excluded.unit,availability=excluded.availability,reason=excluded.reason,directness=excluded.directness,mapping_quality=excluded.mapping_quality,proxy_reason=excluded.proxy_reason,source_type=excluded.source_type,quality=excluded.quality,confidence=excluded.confidence,last_verified_on=excluded.last_verified_on,explanation=excluded.explanation;

insert into public.career_normalized_metrics (
  normalized_metric_key, profile_key, metric_key, input_observation_refs,
  normalized_value, normalized_unit, formula_version, availability, reason,
  directness, mapping_quality, proxy_reason, source_type, quality, confidence,
  explanation
)
values
('US:carpenter:employment_momentum_excess_cagr_pp_v1','US:carpenter','employment_momentum_excess_cagr_pp',array['us-carpenter-cps-employment-2020','us-carpenter-cps-employment-2025','us-all-cps-employment-2020','us-all-cps-employment-2025'],-0.9159141007264449,'percentage_points_per_year','normalize-employment-momentum-v1','available',null,'direct','high',null,'official_primary','medium',0.850,'Carpenter 2020-2025 CPS employment CAGR is about 1.1235%/yr versus 2.0394%/yr for total employment. Excess actual CAGR = -0.9159 percentage points/year.'),
('US:carpenter:projected_growth_excess_cagr_pp_v1','US:carpenter','projected_growth_excess_cagr_pp',array['us-carpenter-projected-employment-2024-2034','us-all-projected-employment-2024-2034'],0.1380834031287748,'percentage_points_per_year','normalize-projected-growth-v1','available',null,'direct','high',null,'official_primary','high',0.980,'Carpenter projected 2024-2034 CAGR is about 0.4406%/yr versus 0.3025%/yr for all occupations. Excess projected CAGR = +0.1381 percentage points/year.')
on conflict (normalized_metric_key) do update set profile_key=excluded.profile_key,metric_key=excluded.metric_key,input_observation_refs=excluded.input_observation_refs,normalized_value=excluded.normalized_value,normalized_unit=excluded.normalized_unit,formula_version=excluded.formula_version,availability=excluded.availability,reason=excluded.reason,directness=excluded.directness,mapping_quality=excluded.mapping_quality,proxy_reason=excluded.proxy_reason,source_type=excluded.source_type,quality=excluded.quality,confidence=excluded.confidence,explanation=excluded.explanation,calculated_at=now();

insert into public.career_normalized_metric_inputs
(normalized_metric_key, observation_key, input_role, usage_type)
values
('US:carpenter:employment_momentum_excess_cagr_pp_v1','us-carpenter-cps-employment-2020','occupation_start_employment','input'),
('US:carpenter:employment_momentum_excess_cagr_pp_v1','us-carpenter-cps-employment-2025','occupation_end_employment','input'),
('US:carpenter:employment_momentum_excess_cagr_pp_v1','us-all-cps-employment-2020','country_start_employment','benchmark'),
('US:carpenter:employment_momentum_excess_cagr_pp_v1','us-all-cps-employment-2025','country_end_employment','benchmark'),
('US:carpenter:projected_growth_excess_cagr_pp_v1','us-carpenter-projected-employment-2024-2034','occupation_projection','input'),
('US:carpenter:projected_growth_excess_cagr_pp_v1','us-all-projected-employment-2024-2034','country_projection_benchmark','benchmark')
on conflict do nothing;

insert into public.career_opportunity_score_snapshots
(snapshot_key, profile_key, as_of_date, formula_version, required_component_keys, explanation)
values
('US:carpenter:2026-08-13:v4','US:carpenter','2026-08-13','career-opportunity-v4-foundation',array['shortage_signal','vacancy_intensity','industry_diversity','employment_momentum','entry_accessibility','relative_salary','projected_growth','visa_accessibility','entry_burden'],'Final Opportunity Score methodology v1 reference snapshot. Employment Momentum uses 5-year actual occupation employment CAGR minus same-source national employment CAGR; Projected Growth uses official projection CAGR minus same-period all-occupations projection CAGR; Relative Salary remains same-country median wage ratio.')
on conflict (snapshot_key) do update set formula_version=excluded.formula_version,required_component_keys=excluded.required_component_keys,explanation=excluded.explanation;

insert into public.career_score_components (
  snapshot_key, profile_key, component_key, raw_input_refs, normalized_metric_refs,
  normalized_value, formula_version, availability, directness, mapping_quality,
  proxy_reason, source_type, quality, confidence, explanation, reason, evidence_status
)
select
  'US:carpenter:2026-08-13:v4', profile_key, component_key, raw_input_refs, normalized_metric_refs,
  normalized_value, 'career-opportunity-v4-foundation', availability, directness, mapping_quality,
  proxy_reason, source_type, quality, confidence, explanation, reason, evidence_status
from public.career_score_components
where snapshot_key='US:carpenter:2026-08-12:v3'
  and component_key not in ('employment_momentum','projected_growth')
on conflict (snapshot_key, component_key) do update set raw_input_refs=excluded.raw_input_refs,normalized_metric_refs=excluded.normalized_metric_refs,normalized_value=excluded.normalized_value,formula_version=excluded.formula_version,availability=excluded.availability,directness=excluded.directness,mapping_quality=excluded.mapping_quality,proxy_reason=excluded.proxy_reason,source_type=excluded.source_type,calculated_at=now(),quality=excluded.quality,confidence=excluded.confidence,explanation=excluded.explanation,reason=excluded.reason,evidence_status=excluded.evidence_status;

insert into public.career_score_components (
  snapshot_key, profile_key, component_key, raw_input_refs, normalized_metric_refs,
  normalized_value, formula_version, availability, directness, mapping_quality,
  proxy_reason, source_type, quality, confidence, explanation, reason, evidence_status
)
values
('US:carpenter:2026-08-13:v4','US:carpenter','employment_momentum',array['us-carpenter-cps-employment-2020','us-carpenter-cps-employment-2025','us-all-cps-employment-2020','us-all-cps-employment-2025'],array['US:carpenter:employment_momentum_excess_cagr_pp_v1'],-0.9159141007264449,'career-opportunity-v4-foundation','available','direct','high',null,'official_primary','medium',0.850,'Actual 5-year employment momentum: occupation CAGR minus same-source national employment CAGR. Score formula is clamp(5 + excess CAGR percentage-points/year × 2.5, 0, 10).',null,'derived'),
('US:carpenter:2026-08-13:v4','US:carpenter','projected_growth',array['us-carpenter-projected-employment-2024-2034','us-all-projected-employment-2024-2034'],array['US:carpenter:projected_growth_excess_cagr_pp_v1'],0.1380834031287748,'career-opportunity-v4-foundation','available','direct','high',null,'official_primary','high',0.980,'Projected growth: occupation projected CAGR minus same-period all-occupations projected CAGR. Score formula is clamp(5 + excess CAGR percentage-points/year × 2.5, 0, 10).',null,'derived')
on conflict (snapshot_key, component_key) do update set raw_input_refs=excluded.raw_input_refs,normalized_metric_refs=excluded.normalized_metric_refs,normalized_value=excluded.normalized_value,formula_version=excluded.formula_version,availability=excluded.availability,directness=excluded.directness,mapping_quality=excluded.mapping_quality,proxy_reason=excluded.proxy_reason,source_type=excluded.source_type,calculated_at=now(),quality=excluded.quality,confidence=excluded.confidence,explanation=excluded.explanation,reason=excluded.reason,evidence_status=excluded.evidence_status;

insert into public.career_score_component_metric_inputs(snapshot_key, component_key, normalized_metric_key, input_role)
select 'US:carpenter:2026-08-13:v4',component_key,normalized_metric_key,input_role
from public.career_score_component_metric_inputs
where snapshot_key='US:carpenter:2026-08-12:v3'
  and component_key not in ('employment_momentum','projected_growth')
on conflict do nothing;

insert into public.career_score_component_metric_inputs(snapshot_key, component_key, normalized_metric_key, input_role)
values
('US:carpenter:2026-08-13:v4','employment_momentum','US:carpenter:employment_momentum_excess_cagr_pp_v1','scored_metric'),
('US:carpenter:2026-08-13:v4','projected_growth','US:carpenter:projected_growth_excess_cagr_pp_v1','scored_metric')
on conflict do nothing;

insert into public.career_score_component_raw_inputs(snapshot_key, component_key, observation_key, input_role)
select 'US:carpenter:2026-08-13:v4',component_key,observation_key,input_role
from public.career_score_component_raw_inputs
where snapshot_key='US:carpenter:2026-08-12:v3'
  and component_key not in ('employment_momentum','projected_growth')
on conflict do nothing;

insert into public.career_score_component_raw_inputs(snapshot_key, component_key, observation_key, input_role)
values
('US:carpenter:2026-08-13:v4','employment_momentum','us-carpenter-cps-employment-2020','occupation_start_employment'),
('US:carpenter:2026-08-13:v4','employment_momentum','us-carpenter-cps-employment-2025','occupation_end_employment'),
('US:carpenter:2026-08-13:v4','employment_momentum','us-all-cps-employment-2020','country_start_employment'),
('US:carpenter:2026-08-13:v4','employment_momentum','us-all-cps-employment-2025','country_end_employment'),
('US:carpenter:2026-08-13:v4','projected_growth','us-carpenter-projected-employment-2024-2034','occupation_projection'),
('US:carpenter:2026-08-13:v4','projected_growth','us-all-projected-employment-2024-2034','country_projection_benchmark')
on conflict do nothing;

update public.career_foundation_profiles
set source_checked_on='2026-08-13',updated_at=now(),decision_ready=true,
    decision_readiness_reason='US Carpenter has all 9 Opportunity Score components evaluated under the final frozen methodology v1, including actual employment momentum, relative salary and projected CAGR growth. Personal work authorization and subnational requirements remain individual/location-specific.'
where profile_key='US:carpenter';