create table public.career_foundation_profiles (
  profile_key text primary key,
  country_code text not null check (country_code ~ '^[A-Z]{2}$'),
  canonical_occupation_id text not null,
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  decision_ready boolean not null default false,
  decision_readiness_reason text not null check (btrim(decision_readiness_reason) <> ''),
  source_checked_on date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (country_code, canonical_occupation_id)
);

create table public.career_official_sources (
  source_key text primary key,
  authority text not null,
  title text not null,
  url text not null,
  source_type text not null check (source_type in ('official_primary','official_service','government_aggregator')),
  last_verified_on date not null,
  notes text,
  created_at timestamptz not null default now()
);

create table public.career_occupation_mappings (
  mapping_key text primary key,
  profile_key text not null references public.career_foundation_profiles(profile_key) on delete cascade,
  canonical_occupation_id text not null,
  country_code text not null check (country_code ~ '^[A-Z]{2}$'),
  official_taxonomy text not null,
  official_taxonomy_version text not null,
  official_code text not null,
  official_title text not null,
  mapping_relation text not null check (mapping_relation in ('exact','broader','narrower','composite','proxy')),
  mapping_quality text not null check (mapping_quality in ('high','medium','low')),
  rationale text not null check (btrim(rationale) <> ''),
  source_key text not null references public.career_official_sources(source_key),
  source_url text not null,
  verified_on date not null,
  is_primary boolean not null default false,
  created_at timestamptz not null default now(),
  unique (profile_key, official_taxonomy, official_code),
  check (canonical_occupation_id <> ''),
  check (country_code = split_part(profile_key, ':', 1))
);

create unique index career_occupation_mappings_one_primary_idx on public.career_occupation_mappings(profile_key) where is_primary;

create table public.career_raw_observations (
  observation_key text primary key,
  profile_key text not null references public.career_foundation_profiles(profile_key) on delete cascade,
  mapping_key text references public.career_occupation_mappings(mapping_key),
  source_key text not null references public.career_official_sources(source_key),
  metric_key text not null,
  reference_period text not null,
  as_of_date date,
  raw_value jsonb,
  unit text,
  availability text not null check (availability in ('available','unavailable')),
  reason text,
  directness text not null check (directness in ('direct','proxy')),
  mapping_quality text not null check (mapping_quality in ('high','medium','low','not_applicable')),
  proxy_reason text,
  source_type text not null check (source_type in ('official_primary','official_service','government_aggregator')),
  quality text not null check (quality in ('high','medium','low')),
  confidence numeric(4,3) not null check (confidence >= 0 and confidence <= 1),
  last_verified_on date not null,
  collected_at timestamptz not null default now(),
  explanation text not null check (btrim(explanation) <> ''),
  check ((availability = 'available' and raw_value is not null) or (availability = 'unavailable' and raw_value is null and btrim(coalesce(reason, '')) <> '')),
  check (directness <> 'proxy' or btrim(coalesce(proxy_reason, '')) <> '')
);

create index career_raw_observations_profile_metric_idx on public.career_raw_observations(profile_key, metric_key, as_of_date desc);
create index career_raw_observations_source_idx on public.career_raw_observations(source_key);

create table public.career_normalized_metrics (
  normalized_metric_key text primary key,
  profile_key text not null references public.career_foundation_profiles(profile_key) on delete cascade,
  metric_key text not null,
  input_observation_refs text[] not null check (cardinality(input_observation_refs) > 0),
  normalized_value numeric,
  normalized_unit text,
  formula_version text not null,
  availability text not null check (availability in ('available','unavailable')),
  reason text,
  directness text not null check (directness in ('direct','proxy')),
  mapping_quality text not null check (mapping_quality in ('high','medium','low','not_applicable')),
  proxy_reason text,
  source_type text not null check (source_type in ('official_primary','official_service','government_aggregator')),
  calculated_at timestamptz not null default now(),
  quality text not null check (quality in ('high','medium','low')),
  confidence numeric(4,3) not null check (confidence >= 0 and confidence <= 1),
  explanation text not null check (btrim(explanation) <> ''),
  check ((availability = 'available' and normalized_value is not null) or (availability = 'unavailable' and normalized_value is null and btrim(coalesce(reason, '')) <> '')),
  check (directness <> 'proxy' or btrim(coalesce(proxy_reason, '')) <> '')
);

create index career_normalized_metrics_profile_metric_idx on public.career_normalized_metrics(profile_key, metric_key);

create or replace function public.career_foundation_component_max(p_component_key text)
returns numeric language sql immutable parallel safe as $$
  select case p_component_key
    when 'shortage_signal' then 20::numeric when 'vacancy_intensity' then 15::numeric when 'industry_diversity' then 5::numeric
    when 'employment_momentum' then 10::numeric when 'entry_accessibility' then 15::numeric when 'relative_salary' then 10::numeric
    when 'projected_growth' then 10::numeric when 'visa_accessibility' then 10::numeric when 'entry_burden' then 5::numeric
    else null::numeric end
$$;

create or replace function public.career_foundation_component_score(p_component_key text, p_normalized_value numeric, p_formula_version text, p_availability text)
returns numeric language sql immutable parallel safe as $$
  select case
    when p_availability <> 'available' or p_normalized_value is null then null::numeric
    when p_formula_version <> 'career-opportunity-v2-foundation' then null::numeric
    when p_component_key = 'relative_salary' then round(greatest(0::numeric, least(10::numeric, 5::numeric + ((p_normalized_value - 1::numeric) * 10::numeric))), 2)
    when p_component_key = 'projected_growth' then round(greatest(0::numeric, least(10::numeric, 5::numeric + (p_normalized_value / 2::numeric))), 2)
    when p_component_key = 'employment_momentum' then round(greatest(0::numeric, least(10::numeric, 5::numeric + ((p_normalized_value - 1::numeric) * 5::numeric))), 2)
    when p_component_key = 'entry_accessibility' then round(greatest(0::numeric, least(15::numeric, p_normalized_value)), 2)
    else null::numeric end
$$;

create table public.career_opportunity_score_snapshots (
  snapshot_key text primary key,
  profile_key text not null references public.career_foundation_profiles(profile_key) on delete cascade,
  as_of_date date not null,
  formula_version text not null,
  required_component_keys text[] not null,
  explanation text not null check (btrim(explanation) <> ''),
  created_at timestamptz not null default now(),
  unique (profile_key, as_of_date, formula_version),
  check (cardinality(required_component_keys) = 9)
);

create table public.career_score_components (
  snapshot_key text not null references public.career_opportunity_score_snapshots(snapshot_key) on delete cascade,
  profile_key text not null references public.career_foundation_profiles(profile_key) on delete cascade,
  component_key text not null,
  raw_input_refs text[] not null check (cardinality(raw_input_refs) > 0),
  normalized_metric_refs text[] not null default '{}',
  normalized_value numeric,
  formula_version text not null,
  availability text not null check (availability in ('available','unavailable')),
  directness text not null check (directness in ('direct','proxy')),
  mapping_quality text not null check (mapping_quality in ('high','medium','low','not_applicable')),
  proxy_reason text,
  source_type text not null check (source_type in ('official_primary','official_service','government_aggregator')),
  calculated_at timestamptz not null default now(),
  quality text not null check (quality in ('high','medium','low')),
  confidence numeric(4,3) not null check (confidence >= 0 and confidence <= 1),
  explanation text not null check (btrim(explanation) <> ''),
  reason text,
  max_score numeric generated always as (public.career_foundation_component_max(component_key)) stored,
  score_value numeric generated always as (public.career_foundation_component_score(component_key, normalized_value, formula_version, availability)) stored,
  primary key (snapshot_key, component_key),
  check (max_score is not null),
  check (availability <> 'unavailable' or (score_value is null and btrim(coalesce(reason, '')) <> '')),
  check (availability <> 'available' or score_value is not null),
  check (score_value is null or (score_value >= 0 and score_value <= max_score)),
  check (directness <> 'proxy' or btrim(coalesce(proxy_reason, '')) <> '')
);

create index career_score_components_profile_idx on public.career_score_components(profile_key, snapshot_key);

create table public.career_foundation_blockers (
  blocker_key text primary key,
  profile_key text not null references public.career_foundation_profiles(profile_key) on delete cascade,
  blocker_type text not null check (blocker_type in ('work_rights','visa','licensing','registration','safety_training','education_training')),
  severity text not null check (severity in ('hard','conditional','informational')),
  reason text not null check (btrim(reason) <> ''),
  source_key text not null references public.career_official_sources(source_key),
  official_source_url text not null,
  applicability_scope text not null check (btrim(applicability_scope) <> ''),
  last_verified_on date not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create index career_foundation_blockers_profile_idx on public.career_foundation_blockers(profile_key, active, blocker_type);

create table public.career_foundation_entry_points (
  entry_point_key text primary key,
  profile_key text not null references public.career_foundation_profiles(profile_key) on delete cascade,
  entry_type text not null check (entry_type in ('job_search','employer','apprenticeship','training','visa','licensing_check','source')),
  label text not null,
  provider text not null,
  url text not null,
  source_key text not null references public.career_official_sources(source_key),
  applicability_scope text not null,
  last_verified_on date not null,
  notes text,
  sort_order smallint not null default 0,
  created_at timestamptz not null default now()
);

create index career_foundation_entry_points_profile_idx on public.career_foundation_entry_points(profile_key, entry_type, sort_order);

alter table public.career_foundation_profiles enable row level security;
alter table public.career_official_sources enable row level security;
alter table public.career_occupation_mappings enable row level security;
alter table public.career_raw_observations enable row level security;
alter table public.career_normalized_metrics enable row level security;
alter table public.career_opportunity_score_snapshots enable row level security;
alter table public.career_score_components enable row level security;
alter table public.career_foundation_blockers enable row level security;
alter table public.career_foundation_entry_points enable row level security;

create policy career_foundation_profiles_public_read on public.career_foundation_profiles for select using (true);
create policy career_official_sources_public_read on public.career_official_sources for select using (true);
create policy career_occupation_mappings_public_read on public.career_occupation_mappings for select using (true);
create policy career_raw_observations_public_read on public.career_raw_observations for select using (true);
create policy career_normalized_metrics_public_read on public.career_normalized_metrics for select using (true);
create policy career_opportunity_score_snapshots_public_read on public.career_opportunity_score_snapshots for select using (true);
create policy career_score_components_public_read on public.career_score_components for select using (true);
create policy career_foundation_blockers_public_read on public.career_foundation_blockers for select using (true);
create policy career_foundation_entry_points_public_read on public.career_foundation_entry_points for select using (true);

grant select on public.career_foundation_profiles, public.career_official_sources, public.career_occupation_mappings, public.career_raw_observations, public.career_normalized_metrics, public.career_opportunity_score_snapshots, public.career_score_components, public.career_foundation_blockers, public.career_foundation_entry_points to anon, authenticated;
grant select, insert, update, delete on public.career_foundation_profiles, public.career_official_sources, public.career_occupation_mappings, public.career_raw_observations, public.career_normalized_metrics, public.career_opportunity_score_snapshots, public.career_score_components, public.career_foundation_blockers, public.career_foundation_entry_points to service_role;
revoke all on function public.career_foundation_component_max(text) from public, anon, authenticated;
revoke all on function public.career_foundation_component_score(text,numeric,text,text) from public, anon, authenticated;
grant execute on function public.career_foundation_component_max(text) to service_role;
grant execute on function public.career_foundation_component_score(text,numeric,text,text) to service_role;

insert into public.career_official_sources (source_key, authority, title, url, source_type, last_verified_on, notes) values
('us-soc-2018','U.S. Bureau of Labor Statistics','2018 Standard Occupational Classification','https://www.bls.gov/soc/2018/','official_primary','2026-08-12','Primary federal occupation taxonomy.'),
('us-onet-carpenters','U.S. Department of Labor / O*NET','O*NET OnLine: 47-2031.00 Carpenters','https://www.onetonline.org/link/summary/47-2031.00','official_primary','2026-08-12','Detailed occupation definition and apprenticeship-title linkage.'),
('us-bls-oews-2025','U.S. Bureau of Labor Statistics','National employment and wage data, May 2025','https://www.bls.gov/news.release/ocwage.t01.htm','official_primary','2026-08-12','Current national OEWS wage benchmark used for relative salary.'),
('us-bls-ep-2024-2034','U.S. Bureau of Labor Statistics','Occupational projections and worker characteristics, 2024-2034','https://www.bls.gov/emp/tables/occupational-projections-and-characteristics.htm','official_primary','2026-08-12','National Employment Matrix projections and annual openings.'),
('us-bls-ooh-carpenters','U.S. Bureau of Labor Statistics','Occupational Outlook Handbook: Carpenters','https://www.bls.gov/ooh/construction-and-extraction/carpenters.htm','official_primary','2026-08-12','Occupation duties, entry pathway, pay context and employer-industry shares.'),
('us-careeronestop','U.S. Department of Labor Employment and Training Administration','CareerOneStop Job Search','https://www.careeronestop.org/Toolkit/Jobs/find-jobs.aspx','official_service','2026-08-12','Government-sponsored job-search service. Listings are an entry point, not a comprehensive national vacancy statistic.'),
('us-apprenticeship-job-finder','U.S. Department of Labor','Apprenticeship Job Finder','https://www.apprenticeship.gov/apprenticeship-job-finder','official_primary','2026-08-12','Official apprenticeship opportunity search.'),
('us-dol-h2b','U.S. Department of Labor','H-2B Temporary Non-agricultural Program','https://www.dol.gov/agencies/eta/foreign-labor/programs/h-2b','official_primary','2026-08-12','Employer temporary-need foreign labor certification route.'),
('us-dol-perm','U.S. Department of Labor','Permanent Labor Certification','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','official_primary','2026-08-12','Employer-filed permanent labor certification route.'),
('us-osha-outreach','Occupational Safety and Health Administration','OSHA Outreach Training Program','https://www.osha.gov/training/outreach/','official_primary','2026-08-12','Federal OSHA states Outreach training is voluntary federally and is not a certification or license.')
on conflict (source_key) do update set authority=excluded.authority,title=excluded.title,url=excluded.url,source_type=excluded.source_type,last_verified_on=excluded.last_verified_on,notes=excluded.notes;

insert into public.career_foundation_profiles (profile_key,country_code,canonical_occupation_id,currency,decision_ready,decision_readiness_reason,source_checked_on) values
('US:carpenter','US','carpenter','USD',true,'Decision-ready because official occupation mapping, wage, employment/projections, entry requirements, visa/work-right constraints, jurisdiction-sensitive licensing guidance, an official job-search starting point, and a verified apprenticeship route are present. Score readiness is evaluated separately.','2026-08-12')
on conflict (profile_key) do update set country_code=excluded.country_code,canonical_occupation_id=excluded.canonical_occupation_id,currency=excluded.currency,decision_ready=excluded.decision_ready,decision_readiness_reason=excluded.decision_readiness_reason,source_checked_on=excluded.source_checked_on,updated_at=now();

insert into public.career_occupation_mappings (mapping_key,profile_key,canonical_occupation_id,country_code,official_taxonomy,official_taxonomy_version,official_code,official_title,mapping_relation,mapping_quality,rationale,source_key,source_url,verified_on,is_primary) values
('US:carpenter:SOC:47-2031','US:carpenter','carpenter','US','SOC','2018','47-2031','Carpenters','exact','high','The canonical Carpenter occupation matches the federal detailed SOC occupation Carpenters without broadening or narrowing the occupational scope.','us-soc-2018','https://www.bls.gov/soc/2018/','2026-08-12',true),
('US:carpenter:ONET:47-2031.00','US:carpenter','carpenter','US','O*NET-SOC','2026','47-2031.00','Carpenters','exact','high','O*NET 47-2031.00 is the current detailed occupation for Carpenters; deprecated Construction Carpenters and Rough Carpenters redirect to this code.','us-onet-carpenters','https://www.onetonline.org/link/summary/47-2031.00','2026-08-12',false)
on conflict (mapping_key) do update set official_taxonomy_version=excluded.official_taxonomy_version,official_title=excluded.official_title,mapping_relation=excluded.mapping_relation,mapping_quality=excluded.mapping_quality,rationale=excluded.rationale,source_key=excluded.source_key,source_url=excluded.source_url,verified_on=excluded.verified_on,is_primary=excluded.is_primary;

insert into public.career_raw_observations (observation_key,profile_key,mapping_key,source_key,metric_key,reference_period,as_of_date,raw_value,unit,availability,reason,directness,mapping_quality,proxy_reason,source_type,quality,confidence,last_verified_on,explanation) values
('us-carpenter-definition','US:carpenter','US:carpenter:ONET:47-2031.00','us-onet-carpenters','occupation_definition','O*NET updated 2026','2026-01-01',jsonb_build_object('code','47-2031.00','title','Carpenters','definition','Construct, erect, install, or repair structures and fixtures made of wood and comparable materials; includes building frameworks and related carpentry work.'),null,'available',null,'direct','high',null,'official_primary','high',0.990,'2026-08-12','Direct official occupation definition used to validate the canonical mapping.'),
('us-carpenter-median-hourly-wage-2025','US:carpenter','US:carpenter:SOC:47-2031','us-bls-oews-2025','median_hourly_wage','May 2025','2025-05-01',to_jsonb(29.12::numeric),'USD/hour','available',null,'direct','high',null,'official_primary','high',0.990,'2026-08-12','BLS OEWS national median hourly wage for Carpenters.'),
('us-all-occupations-median-hourly-wage-2025','US:carpenter',null,'us-bls-oews-2025','national_median_hourly_wage_benchmark','May 2025','2025-05-01',to_jsonb(24.51::numeric),'USD/hour','available',null,'direct','not_applicable',null,'official_primary','high',0.990,'2026-08-12','BLS OEWS median hourly wage for all U.S. occupations, used as the same-period national salary benchmark.'),
('us-carpenter-median-annual-wage-2025','US:carpenter','US:carpenter:SOC:47-2031','us-careeronestop','median_annual_wage','May 2025','2025-05-01',to_jsonb(60580::numeric),'USD/year','available',null,'direct','high',null,'official_service','high',0.960,'2026-08-12','CareerOneStop reports the May 2025 national median annual wage and identifies BLS OEWS as the wage source. The primary-score calculation uses the BLS hourly median instead.'),
('us-carpenter-employment-2024','US:carpenter','US:carpenter:SOC:47-2031','us-bls-ep-2024-2034','employment_total','2024 base year','2024-01-01',to_jsonb(959000::numeric),'workers','available',null,'direct','high',null,'official_primary','high',0.980,'2026-08-12','BLS National Employment Matrix employment base for the 2024-2034 projections. This projection universe is kept separate from OEWS employment estimates.'),
('us-carpenter-projected-employment-2034','US:carpenter','US:carpenter:SOC:47-2031','us-bls-ep-2024-2034','projected_employment_total','2034 projection','2034-01-01',to_jsonb(1002100::numeric),'workers','available',null,'direct','high',null,'official_primary','high',0.950,'2026-08-12','BLS projected Carpenter employment for 2034.'),
('us-carpenter-growth-2024-2034','US:carpenter','US:carpenter:SOC:47-2031','us-bls-ep-2024-2034','projected_growth_pct','2024-2034','2024-01-01',to_jsonb(4.5::numeric),'percent','available',null,'direct','high',null,'official_primary','high',0.950,'2026-08-12','BLS unrounded table value for projected Carpenter employment growth, 2024-2034.'),
('us-all-occupations-growth-2024-2034','US:carpenter',null,'us-bls-ep-2024-2034','national_projected_growth_benchmark_pct','2024-2034','2024-01-01',to_jsonb(3.1::numeric),'percent','available',null,'direct','not_applicable',null,'official_primary','high',0.950,'2026-08-12','BLS projected growth benchmark for total U.S. employment, 2024-2034.'),
('us-carpenter-annual-openings-2024-2034','US:carpenter','US:carpenter:SOC:47-2031','us-bls-ep-2024-2034','projected_annual_openings','2024-2034 annual average','2024-01-01',to_jsonb(74100::numeric),'openings/year','available',null,'direct','high',null,'official_primary','high',0.940,'2026-08-12','BLS projected annual openings, including growth and replacement needs; it is not a live vacancy count.'),
('us-all-occupations-annual-openings-2024-2034','US:carpenter',null,'us-bls-ep-2024-2034','national_projected_annual_openings_benchmark','2024-2034 annual average','2024-01-01',to_jsonb(18863300::numeric),'openings/year','available',null,'direct','not_applicable',null,'official_primary','high',0.940,'2026-08-12','BLS projected annual openings for total U.S. employment.'),
('us-all-occupations-employment-2024','US:carpenter',null,'us-bls-ep-2024-2034','national_employment_benchmark','2024 base year','2024-01-01',to_jsonb(169956100::numeric),'workers','available',null,'direct','not_applicable',null,'official_primary','high',0.980,'2026-08-12','BLS total employment base used to normalize annual openings intensity.'),
('us-carpenter-industry-shares-2024','US:carpenter','US:carpenter:SOC:47-2031','us-bls-ooh-carpenters','employer_industry_distribution','2024 employment','2024-01-01',jsonb_build_object('self_employed_pct',27,'residential_building_construction_pct',23,'nonresidential_building_construction_pct',12,'building_finishing_contractors_pct',12,'foundation_structure_exterior_contractors_pct',10,'published_top_share_coverage_pct',84),'percent shares','available',null,'direct','high',null,'official_primary','medium',0.850,'2026-08-12','BLS publishes major employer shares. The residual employment is not disaggregated on the OOH page, so this observation is not converted into a cross-country diversity score.'),
('us-carpenter-entry-education','US:carpenter','US:carpenter:SOC:47-2031','us-bls-ep-2024-2034','typical_entry_education','2024-2034 projections','2024-01-01',to_jsonb('High school diploma or equivalent'::text),null,'available',null,'direct','high',null,'official_primary','high',0.970,'2026-08-12','BLS typical education needed for entry.'),
('us-carpenter-related-experience','US:carpenter','US:carpenter:SOC:47-2031','us-bls-ep-2024-2034','related_work_experience','2024-2034 projections','2024-01-01',to_jsonb('None'::text),null,'available',null,'direct','high',null,'official_primary','high',0.970,'2026-08-12','BLS typical related work experience requirement.'),
('us-carpenter-on-job-training','US:carpenter','US:carpenter:SOC:47-2031','us-bls-ep-2024-2034','typical_on_job_training','2024-2034 projections','2024-01-01',to_jsonb('Apprenticeship'::text),null,'available',null,'direct','high',null,'official_primary','high',0.970,'2026-08-12','BLS typical post-employment training category is Apprenticeship.'),
('us-carpenter-shortage-signal','US:carpenter','US:carpenter:SOC:47-2031','us-bls-ep-2024-2034','national_shortage_signal','verified 2026-08-12','2026-08-12',null,null,'unavailable','No federal nationwide shortage-occupation designation suitable for a comparable Carpenter shortage score was identified. BLS growth and openings are demand indicators and are not re-labeled as a formal shortage finding.','direct','high',null,'official_primary','high',0.900,'2026-08-12','Missing shortage data is explicitly unavailable rather than scored as zero.'),
('us-carpenter-vacancy-statistic','US:carpenter','US:carpenter:SOC:47-2031','us-careeronestop','national_vacancy_intensity','verified 2026-08-12','2026-08-12',null,null,'unavailable','CareerOneStop provides live job listings, but no nationally comprehensive SOC-level vacancy statistical series with a stable coverage denominator and cross-country-comparable methodology was validated for this pilot.','direct','medium',null,'official_service','high',0.900,'2026-08-12','The job-search service is retained as an entry point, but listing counts are not promoted to a vacancy score.'),
('us-carpenter-h2b-conditions','US:carpenter','US:carpenter:SOC:47-2031','us-dol-h2b','h2b_work_route_conditions','verified 2026-08-12','2026-08-12',jsonb_build_object('occupation_targeted',false,'employer_required',true,'temporary_need_required',true,'temporary_need_types',jsonb_build_array('one-time occurrence','seasonal','peakload','intermittent')),null,'available',null,'direct','high',null,'official_primary','high',0.980,'2026-08-12','H-2B is an employer- and temporary-need route, not an occupation-specific Carpenter entitlement.'),
('us-carpenter-perm-conditions','US:carpenter','US:carpenter:SOC:47-2031','us-dol-perm','perm_work_route_conditions','verified 2026-08-12','2026-08-12',jsonb_build_object('occupation_targeted',false,'employer_files',true,'labor_certification_required_in_most_instances',true,'uscis_authorization_follows_dol_certification',true),null,'available',null,'direct','high',null,'official_primary','high',0.980,'2026-08-12','PERM is employer-filed and case-specific; it is not evidence that a Carpenter applicant will receive sponsorship or immigration approval.'),
('us-carpenter-federal-personal-license','US:carpenter','US:carpenter:SOC:47-2031','us-bls-ooh-carpenters','federal_personal_carpenter_license','verified 2026-08-12','2026-08-12',null,null,'unavailable','No single federal occupation-wide personal Carpenter license requirement is represented in the national BLS entry requirements. Contractor, trade, project, state, municipal, employer, and safety-training rules may still apply and must be checked for the intended location and work.','direct','high',null,'official_primary','medium',0.850,'2026-08-12','National absence is not converted into a low entry burden score because subnational requirements vary.'),
('us-carpenter-osha-outreach','US:carpenter','US:carpenter:SOC:47-2031','us-osha-outreach','osha_outreach_status','verified 2026-08-12','2026-08-12',jsonb_build_object('federal_requirement',false,'certification_or_license',false,'may_be_required_by_state_local_employer_union',true),null,'available',null,'direct','high',null,'official_primary','high',0.990,'2026-08-12','OSHA states its Outreach program is voluntary federally and is not a certification or license; other jurisdictions or employers may require it.')
on conflict (observation_key) do update set raw_value=excluded.raw_value,availability=excluded.availability,reason=excluded.reason,directness=excluded.directness,mapping_quality=excluded.mapping_quality,proxy_reason=excluded.proxy_reason,source_type=excluded.source_type,quality=excluded.quality,confidence=excluded.confidence,last_verified_on=excluded.last_verified_on,explanation=excluded.explanation;

insert into public.career_normalized_metrics (normalized_metric_key,profile_key,metric_key,input_observation_refs,normalized_value,normalized_unit,formula_version,availability,reason,directness,mapping_quality,proxy_reason,source_type,quality,confidence,explanation) values
('US:carpenter:relative_salary_ratio','US:carpenter','relative_salary_ratio',array['us-carpenter-median-hourly-wage-2025','us-all-occupations-median-hourly-wage-2025'],(select (select raw_value::text::numeric from public.career_raw_observations where observation_key='us-carpenter-median-hourly-wage-2025')/(select raw_value::text::numeric from public.career_raw_observations where observation_key='us-all-occupations-median-hourly-wage-2025')),'ratio','normalize-relative-salary-v1','available',null,'direct','high',null,'official_primary','high',0.980,'Occupation median hourly wage divided by the same-period all-occupations median hourly wage. Absolute USD salary bands are not used.'),
('US:carpenter:growth_excess_pp','US:carpenter','projected_growth_excess_pp',array['us-carpenter-growth-2024-2034','us-all-occupations-growth-2024-2034'],(select (select raw_value::text::numeric from public.career_raw_observations where observation_key='us-carpenter-growth-2024-2034')-(select raw_value::text::numeric from public.career_raw_observations where observation_key='us-all-occupations-growth-2024-2034')),'percentage_points','normalize-growth-v1','available',null,'direct','high',null,'official_primary','high',0.950,'Occupation projected growth minus the same-country all-occupations projected growth benchmark.'),
('US:carpenter:annual_openings_intensity_ratio','US:carpenter','annual_openings_intensity_ratio',array['us-carpenter-annual-openings-2024-2034','us-carpenter-employment-2024','us-all-occupations-annual-openings-2024-2034','us-all-occupations-employment-2024'],(select ((select raw_value::text::numeric from public.career_raw_observations where observation_key='us-carpenter-annual-openings-2024-2034')/(select raw_value::text::numeric from public.career_raw_observations where observation_key='us-carpenter-employment-2024'))/((select raw_value::text::numeric from public.career_raw_observations where observation_key='us-all-occupations-annual-openings-2024-2034')/(select raw_value::text::numeric from public.career_raw_observations where observation_key='us-all-occupations-employment-2024'))),'ratio','normalize-employment-momentum-v1','available',null,'direct','high',null,'official_primary','medium',0.900,'Projected annual openings per current employment divided by the corresponding all-occupations openings intensity. It measures employment momentum, not live vacancy intensity.'),
('US:carpenter:entry_accessibility_points','US:carpenter','entry_accessibility_points_15',array['us-carpenter-entry-education','us-carpenter-related-experience','us-carpenter-on-job-training'],(select (case (select raw_value #>> '{}' from public.career_raw_observations where observation_key='us-carpenter-entry-education') when 'No formal educational credential' then 9 when 'High school diploma or equivalent' then 7 when 'Postsecondary nondegree award' then 5 when 'Associate''s degree' then 4 when 'Bachelor''s degree' then 2 when 'Master''s degree' then 1 when 'Doctoral or professional degree' then 0 else 0 end)+(case (select raw_value #>> '{}' from public.career_raw_observations where observation_key='us-carpenter-related-experience') when 'None' then 3 when 'Less than 5 years' then 1 else 0 end)+(case (select raw_value #>> '{}' from public.career_raw_observations where observation_key='us-carpenter-on-job-training') when 'None' then 3 when 'Short-term on-the-job training' then 3 when 'Moderate-term on-the-job training' then 2 when 'Long-term on-the-job training' then 1 when 'Apprenticeship' then 0 else 0 end)),'points_of_15','normalize-entry-accessibility-v1','available',null,'proxy','medium','BLS qualitative education, experience and training categories are deterministically mapped to an ordinal accessibility rubric. The rubric is a CampCareer proxy and is not a BLS score.','official_primary','medium',0.750,'Deterministic rubric: education contributes up to 9, no related experience up to 3, and training burden up to 3. High school + no related experience + apprenticeship yields 10/15.')
on conflict (normalized_metric_key) do update set input_observation_refs=excluded.input_observation_refs,normalized_value=excluded.normalized_value,normalized_unit=excluded.normalized_unit,formula_version=excluded.formula_version,availability=excluded.availability,reason=excluded.reason,directness=excluded.directness,mapping_quality=excluded.mapping_quality,proxy_reason=excluded.proxy_reason,source_type=excluded.source_type,calculated_at=now(),quality=excluded.quality,confidence=excluded.confidence,explanation=excluded.explanation;

insert into public.career_opportunity_score_snapshots (snapshot_key,profile_key,as_of_date,formula_version,required_component_keys,explanation) values
('US:carpenter:2026-08-12:v2','US:carpenter','2026-08-12','career-opportunity-v2-foundation',array['shortage_signal','vacancy_intensity','industry_diversity','employment_momentum','entry_accessibility','relative_salary','projected_growth','visa_accessibility','entry_burden'],'The final Opportunity Score is calculated by the read view only when all nine required components have valid scores. Missing components therefore produce a null final score rather than zero-filled scoring.')
on conflict (snapshot_key) do update set required_component_keys=excluded.required_component_keys,explanation=excluded.explanation;

insert into public.career_score_components (snapshot_key,profile_key,component_key,raw_input_refs,normalized_metric_refs,normalized_value,formula_version,availability,directness,mapping_quality,proxy_reason,source_type,quality,confidence,explanation,reason) values
('US:carpenter:2026-08-12:v2','US:carpenter','shortage_signal',array['us-carpenter-shortage-signal'],'{}',null,'career-opportunity-v2-foundation','unavailable','direct','high',null,'official_primary','high',0.900,'A formal national shortage signal was not validated. Projected growth and openings are not substituted for a shortage designation.','No comparable nationwide Carpenter shortage designation was validated.'),
('US:carpenter:2026-08-12:v2','US:carpenter','vacancy_intensity',array['us-carpenter-vacancy-statistic'],'{}',null,'career-opportunity-v2-foundation','unavailable','direct','medium',null,'official_service','high',0.900,'Live job listings exist, but no validated comprehensive national vacancy statistic is promoted to a score.','CareerOneStop listing counts do not provide a stable nationally comprehensive denominator or cross-country-comparable vacancy methodology.'),
('US:carpenter:2026-08-12:v2','US:carpenter','industry_diversity',array['us-carpenter-industry-shares-2024'],'{}',null,'career-opportunity-v2-foundation','unavailable','direct','high',null,'official_primary','medium',0.800,'BLS publishes major employer shares, but the residual category is not disaggregated and a cross-country sector-normalization method has not been validated.','Industry shares are useful context, but the diversity score definition is not yet comparable across countries.'),
('US:carpenter:2026-08-12:v2','US:carpenter','employment_momentum',array['us-carpenter-annual-openings-2024-2034','us-carpenter-employment-2024','us-all-occupations-annual-openings-2024-2034','us-all-occupations-employment-2024'],array['US:carpenter:annual_openings_intensity_ratio'],(select normalized_value from public.career_normalized_metrics where normalized_metric_key='US:carpenter:annual_openings_intensity_ratio'),'career-opportunity-v2-foundation','available','direct','high',null,'official_primary','medium',0.900,'Employment momentum uses projected annual openings intensity relative to the U.S. all-occupations benchmark. It is explicitly distinct from live vacancy intensity.',null),
('US:carpenter:2026-08-12:v2','US:carpenter','entry_accessibility',array['us-carpenter-entry-education','us-carpenter-related-experience','us-carpenter-on-job-training'],array['US:carpenter:entry_accessibility_points'],(select normalized_value from public.career_normalized_metrics where normalized_metric_key='US:carpenter:entry_accessibility_points'),'career-opportunity-v2-foundation','available','proxy','medium','BLS qualitative education, experience and training categories are mapped to a transparent ordinal accessibility rubric; this is a CampCareer proxy, not a BLS score.','official_primary','medium',0.750,'High school entry, no related experience and apprenticeship training are converted through the documented proxy rubric.',null),
('US:carpenter:2026-08-12:v2','US:carpenter','relative_salary',array['us-carpenter-median-hourly-wage-2025','us-all-occupations-median-hourly-wage-2025'],array['US:carpenter:relative_salary_ratio'],(select normalized_value from public.career_normalized_metrics where normalized_metric_key='US:carpenter:relative_salary_ratio'),'career-opportunity-v2-foundation','available','direct','high',null,'official_primary','high',0.980,'Salary is scored from the occupation/all-occupations median hourly wage ratio, avoiding absolute USD bands for cross-country comparison.',null),
('US:carpenter:2026-08-12:v2','US:carpenter','projected_growth',array['us-carpenter-growth-2024-2034','us-all-occupations-growth-2024-2034'],array['US:carpenter:growth_excess_pp'],(select normalized_value from public.career_normalized_metrics where normalized_metric_key='US:carpenter:growth_excess_pp'),'career-opportunity-v2-foundation','available','direct','high',null,'official_primary','high',0.950,'Projected growth is scored as percentage-point performance above or below the same-country all-occupations benchmark.',null),
('US:carpenter:2026-08-12:v2','US:carpenter','visa_accessibility',array['us-carpenter-h2b-conditions','us-carpenter-perm-conditions'],'{}',null,'career-opportunity-v2-foundation','unavailable','direct','high',null,'official_primary','high',0.950,'Official routes exist, but they are employer-, case-, status- and temporary-need dependent and cannot be converted into a single occupation-level market-access score without personalisation.','No validated occupation-level visa accessibility metric independent of applicant and employer circumstances is available.'),
('US:carpenter:2026-08-12:v2','US:carpenter','entry_burden',array['us-carpenter-federal-personal-license','us-carpenter-osha-outreach'],'{}',null,'career-opportunity-v2-foundation','unavailable','direct','high',null,'official_primary','medium',0.850,'There is no single federal personal Carpenter licensing rule to score nationally, while state, municipal, contractor, employer and project requirements can materially change entry burden.','Subnational licensing and safety-training heterogeneity prevents a reliable single U.S. entry-burden score.')
on conflict (snapshot_key,component_key) do update set raw_input_refs=excluded.raw_input_refs,normalized_metric_refs=excluded.normalized_metric_refs,normalized_value=excluded.normalized_value,formula_version=excluded.formula_version,availability=excluded.availability,directness=excluded.directness,mapping_quality=excluded.mapping_quality,proxy_reason=excluded.proxy_reason,source_type=excluded.source_type,calculated_at=now(),quality=excluded.quality,confidence=excluded.confidence,explanation=excluded.explanation,reason=excluded.reason;

insert into public.career_foundation_blockers (blocker_key,profile_key,blocker_type,severity,reason,source_key,official_source_url,applicability_scope,last_verified_on) values
('US:carpenter:work-rights','US:carpenter','work_rights','hard','A foreign national must hold employment authorization applicable to the job. CampCareer does not infer an individual right to work from occupation data.','us-dol-perm','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','Foreign nationals who do not already have unrestricted U.S. work authorization; exact applicability depends on immigration status.','2026-08-12'),
('US:carpenter:visa-route','US:carpenter','visa','conditional','H-2B requires a qualifying employer temporary need; PERM is employer-filed and requires labor certification before immigration authorization in most cases. Neither route is a Carpenter-specific approval guarantee.','us-dol-h2b','https://www.dol.gov/agencies/eta/foreign-labor/programs/h-2b','Potential employer-sponsored routes only; applicant, employer, job, timing and immigration category determine applicability.','2026-08-12'),
('US:carpenter:licensing-local','US:carpenter','licensing','conditional','Do not treat the United States as having one nationwide Carpenter personal license rule. State, local, contractor, employer and project requirements must be checked for the intended work location.','us-bls-ooh-carpenters','https://www.bls.gov/ooh/construction-and-extraction/carpenters.htm','State, municipality, contractor role, project and employer specific.','2026-08-12'),
('US:carpenter:osha-outreach','US:carpenter','safety_training','conditional','OSHA 10/30 Outreach training is voluntary at the federal OSHA level and is not a certification or license, but states, municipalities, employers, unions or other organizations may require it.','us-osha-outreach','https://www.osha.gov/training/outreach/','Construction worksites; requirement depends on state, municipality, employer, union or project.','2026-08-12')
on conflict (blocker_key) do update set severity=excluded.severity,reason=excluded.reason,source_key=excluded.source_key,official_source_url=excluded.official_source_url,applicability_scope=excluded.applicability_scope,last_verified_on=excluded.last_verified_on,active=true;

insert into public.career_foundation_entry_points (entry_point_key,profile_key,entry_type,label,provider,url,source_key,applicability_scope,last_verified_on,notes,sort_order) values
('US:carpenter:job-search','US:carpenter','job_search','Search current Carpenter jobs','CareerOneStop','https://www.careeronestop.org/Toolkit/Jobs/find-jobs.aspx','us-careeronestop','Nationwide job-search starting point; individual postings have their own location and work-right requirements.','2026-08-12','Use as a job-search entry point. Do not treat listing counts as a comprehensive vacancy statistic.',1),
('US:carpenter:apprenticeship','US:carpenter','apprenticeship','Find Carpenter apprenticeship opportunities','Apprenticeship.gov','https://www.apprenticeship.gov/apprenticeship-job-finder','us-apprenticeship-job-finder','Nationwide search; availability varies by employer and location.','2026-08-12','O*NET lists approved Carpenter-related apprenticeship titles and BLS identifies apprenticeship as typical training.',2),
('US:carpenter:h2b','US:carpenter','visa','Review H-2B temporary non-agricultural requirements','U.S. Department of Labor','https://www.dol.gov/agencies/eta/foreign-labor/programs/h-2b','us-dol-h2b','Only qualifying employer temporary need; not occupation-targeted.','2026-08-12','Official route information only, not an eligibility or approval prediction.',3),
('US:carpenter:perm','US:carpenter','visa','Review permanent labor certification requirements','U.S. Department of Labor','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent','us-dol-perm','Employer-filed permanent labor certification process; case-specific.','2026-08-12','Official route information only, not an eligibility or approval prediction.',4),
('US:carpenter:osha','US:carpenter','licensing_check','Check OSHA Outreach status and local requirements','Occupational Safety and Health Administration','https://www.osha.gov/training/outreach/','us-osha-outreach','Federal OSHA guidance plus separate state/local/employer checks.','2026-08-12','OSHA Outreach is voluntary federally and not a license; other requirements may apply.',5)
on conflict (entry_point_key) do update set label=excluded.label,provider=excluded.provider,url=excluded.url,source_key=excluded.source_key,applicability_scope=excluded.applicability_scope,last_verified_on=excluded.last_verified_on,notes=excluded.notes,sort_order=excluded.sort_order;

create or replace view public.career_opportunity_score_calculated_v1 with (security_invoker=true) as
with component_rollup as (
  select s.snapshot_key,s.profile_key,s.as_of_date,s.formula_version,s.required_component_keys,s.explanation,
    count(c.component_key) filter (where c.component_key=any(s.required_component_keys))::integer as required_components_present,
    count(c.component_key) filter (where c.component_key=any(s.required_component_keys) and c.availability='available' and c.score_value is not null)::integer as scored_components,
    coalesce(sum(c.max_score) filter (where c.component_key=any(s.required_component_keys) and c.availability='available' and c.score_value is not null),0::numeric) as score_coverage_weight,
    sum(c.score_value) filter (where c.component_key=any(s.required_component_keys)) as score_sum,
    max(c.calculated_at) as calculation_timestamp
  from public.career_opportunity_score_snapshots s left join public.career_score_components c on c.snapshot_key=s.snapshot_key
  group by s.snapshot_key,s.profile_key,s.as_of_date,s.formula_version,s.required_component_keys,s.explanation
), evaluated as (
  select r.*,cardinality(r.required_component_keys) as required_component_count,
    (r.required_components_present=cardinality(r.required_component_keys) and r.scored_components=cardinality(r.required_component_keys)) as score_ready
  from component_rollup r
)
select e.snapshot_key,e.profile_key,e.as_of_date,e.formula_version,e.required_component_keys,e.required_component_count,e.required_components_present,e.scored_components,e.score_coverage_weight,e.score_ready,
  case when e.score_ready then round(e.score_sum,2) else null::numeric end as opportunity_score,
  p.decision_ready,(p.decision_ready and e.score_ready) as publish_ready,p.decision_readiness_reason,e.explanation,e.calculation_timestamp
from evaluated e join public.career_foundation_profiles p on p.profile_key=e.profile_key;

create or replace view public.career_foundation_result_v1 with (security_invoker=true) as
with latest as (
  select c.*,row_number() over (partition by c.profile_key order by c.as_of_date desc,c.snapshot_key desc) as row_rank
  from public.career_opportunity_score_calculated_v1 c
)
select p.profile_key,p.country_code,p.canonical_occupation_id,p.currency,p.source_checked_on,m.official_taxonomy,m.official_taxonomy_version,m.official_code,m.official_title,m.mapping_relation,m.mapping_quality,m.rationale as mapping_rationale,m.source_url as mapping_source_url,m.verified_on as mapping_verified_on,
  l.snapshot_key,l.as_of_date,l.formula_version,l.required_component_count,l.scored_components,l.score_coverage_weight,l.score_ready,l.opportunity_score,l.decision_ready,l.publish_ready,l.decision_readiness_reason,l.explanation as score_explanation,l.calculation_timestamp
from public.career_foundation_profiles p join latest l on l.profile_key=p.profile_key and l.row_rank=1 join public.career_occupation_mappings m on m.profile_key=p.profile_key and m.is_primary;

create or replace view public.career_foundation_rankable_v1 with (security_invoker=true) as
select * from public.career_foundation_result_v1 where score_ready=true and publish_ready=true and opportunity_score is not null;

grant select on public.career_opportunity_score_calculated_v1,public.career_foundation_result_v1,public.career_foundation_rankable_v1 to anon,authenticated,service_role;
comment on view public.career_foundation_rankable_v1 is 'Only score-ready foundation results are eligible for ranking or comparison. Decision-ready but score-incomplete records are intentionally excluded.';
