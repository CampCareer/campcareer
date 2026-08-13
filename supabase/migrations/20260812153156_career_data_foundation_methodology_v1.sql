-- Career Data Foundation methodology v1 reference implementation for US × Carpenter.
-- This migration preserves the v2 pilot snapshot and adds a v3 snapshot using the
-- cross-country methodology agreed on 2026-08-12.

alter table public.career_score_components
  add column if not exists evidence_status text not null default 'direct_verified'
  check (evidence_status in (
    'direct_verified',
    'derived',
    'proxy',
    'fallback',
    'no_evidence_found',
    'confirmed_not_shortage',
    'insufficient_industry_coverage'
  ));

update public.career_score_components
set evidence_status = 'proxy'
where directness = 'proxy' and evidence_status = 'direct_verified';

create table if not exists public.career_normalized_metric_inputs (
  normalized_metric_key text not null references public.career_normalized_metrics(normalized_metric_key) on delete cascade,
  observation_key text not null references public.career_raw_observations(observation_key) on delete restrict,
  input_role text not null check (btrim(input_role) <> ''),
  usage_type text not null default 'input' check (usage_type in ('input','benchmark','policy_evidence','fallback_evidence')),
  input_weight numeric,
  created_at timestamptz not null default now(),
  primary key (normalized_metric_key, observation_key, input_role)
);

create index if not exists career_normalized_metric_inputs_observation_idx
  on public.career_normalized_metric_inputs(observation_key);

create table if not exists public.career_score_component_metric_inputs (
  snapshot_key text not null,
  component_key text not null,
  normalized_metric_key text not null references public.career_normalized_metrics(normalized_metric_key) on delete restrict,
  input_role text not null check (btrim(input_role) <> ''),
  created_at timestamptz not null default now(),
  primary key (snapshot_key, component_key, normalized_metric_key, input_role),
  foreign key (snapshot_key, component_key)
    references public.career_score_components(snapshot_key, component_key)
    on delete cascade
);

create index if not exists career_score_component_metric_inputs_metric_idx
  on public.career_score_component_metric_inputs(normalized_metric_key);

create table if not exists public.career_score_component_raw_inputs (
  snapshot_key text not null,
  component_key text not null,
  observation_key text not null references public.career_raw_observations(observation_key) on delete restrict,
  input_role text not null check (btrim(input_role) <> ''),
  created_at timestamptz not null default now(),
  primary key (snapshot_key, component_key, observation_key, input_role),
  foreign key (snapshot_key, component_key)
    references public.career_score_components(snapshot_key, component_key)
    on delete cascade
);

create index if not exists career_score_component_raw_inputs_observation_idx
  on public.career_score_component_raw_inputs(observation_key);

create table if not exists public.career_foundation_licensing_evidence (
  evidence_key text primary key,
  profile_key text not null references public.career_foundation_profiles(profile_key) on delete cascade,
  mapping_key text references public.career_occupation_mappings(mapping_key) on delete set null,
  jurisdiction_code text not null,
  jurisdiction_name text not null,
  jurisdiction_level text not null check (jurisdiction_level in ('national','state','province','territory','city','local')),
  requirement_type text not null check (requirement_type in ('occupational_license','contractor_license','certification','registration','safety_training')),
  mandatory boolean not null,
  applies_to text not null check (applies_to in ('employee','self_employed','contractor','business','mixed')),
  authority text not null,
  source_key text not null references public.career_official_sources(source_key),
  official_source_url text not null,
  verified_on date not null,
  cost_amount numeric,
  cost_currency text,
  expected_duration_days integer,
  exceptions text,
  evidence_quality text not null check (evidence_quality in ('high','medium','low')),
  notes text,
  created_at timestamptz not null default now(),
  check (cost_amount is null or cost_amount >= 0),
  check (expected_duration_days is null or expected_duration_days >= 0)
);

create index if not exists career_foundation_licensing_profile_idx
  on public.career_foundation_licensing_evidence(profile_key, jurisdiction_level, applies_to);

create table if not exists public.career_foundation_visa_pathways (
  pathway_key text primary key,
  profile_key text not null references public.career_foundation_profiles(profile_key) on delete cascade,
  route_role text not null check (route_role in ('primary','secondary')),
  pathway_name text not null,
  source_key text not null references public.career_official_sources(source_key),
  official_source_url text not null,
  occupation_applicability_points smallint not null check (occupation_applicability_points between 0 and 3),
  employer_dependency_points smallint not null check (employer_dependency_points between 0 and 3),
  eligibility_burden_points smallint not null check (eligibility_burden_points between 0 and 2),
  long_term_pathway_points smallint not null check (long_term_pathway_points between 0 and 2),
  used_for_primary_score boolean not null default false,
  applicability_scope text not null check (btrim(applicability_scope) <> ''),
  last_verified_on date not null,
  notes text,
  created_at timestamptz not null default now(),
  check (
    occupation_applicability_points
    + employer_dependency_points
    + eligibility_burden_points
    + long_term_pathway_points <= 10
  )
);

create unique index if not exists career_foundation_visa_primary_score_idx
  on public.career_foundation_visa_pathways(profile_key)
  where used_for_primary_score;

create table if not exists public.career_foundation_job_opportunities (
  opportunity_key text primary key,
  profile_key text not null references public.career_foundation_profiles(profile_key) on delete cascade,
  source_key text not null references public.career_official_sources(source_key),
  title text not null,
  employer text not null,
  location_text text not null,
  posted_on date,
  application_deadline date,
  source_name text not null,
  listing_url text not null,
  apply_url text not null,
  last_checked_on date not null,
  status text not null check (status in ('active','expired','unknown')),
  relation_quality text not null check (relation_quality in ('exact','related')),
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists career_foundation_job_opportunities_profile_idx
  on public.career_foundation_job_opportunities(profile_key, status, last_checked_on desc);

alter table public.career_normalized_metric_inputs enable row level security;
alter table public.career_score_component_metric_inputs enable row level security;
alter table public.career_score_component_raw_inputs enable row level security;
alter table public.career_foundation_licensing_evidence enable row level security;
alter table public.career_foundation_visa_pathways enable row level security;
alter table public.career_foundation_job_opportunities enable row level security;

drop policy if exists career_normalized_metric_inputs_public_read on public.career_normalized_metric_inputs;
create policy career_normalized_metric_inputs_public_read
  on public.career_normalized_metric_inputs for select using (true);
drop policy if exists career_score_component_metric_inputs_public_read on public.career_score_component_metric_inputs;
create policy career_score_component_metric_inputs_public_read
  on public.career_score_component_metric_inputs for select using (true);
drop policy if exists career_score_component_raw_inputs_public_read on public.career_score_component_raw_inputs;
create policy career_score_component_raw_inputs_public_read
  on public.career_score_component_raw_inputs for select using (true);
drop policy if exists career_foundation_licensing_evidence_public_read on public.career_foundation_licensing_evidence;
create policy career_foundation_licensing_evidence_public_read
  on public.career_foundation_licensing_evidence for select using (true);
drop policy if exists career_foundation_visa_pathways_public_read on public.career_foundation_visa_pathways;
create policy career_foundation_visa_pathways_public_read
  on public.career_foundation_visa_pathways for select using (true);
drop policy if exists career_foundation_job_opportunities_public_read on public.career_foundation_job_opportunities;
create policy career_foundation_job_opportunities_public_read
  on public.career_foundation_job_opportunities for select using (true);

grant select on
  public.career_normalized_metric_inputs,
  public.career_score_component_metric_inputs,
  public.career_score_component_raw_inputs,
  public.career_foundation_licensing_evidence,
  public.career_foundation_visa_pathways,
  public.career_foundation_job_opportunities
to anon, authenticated;

grant select, insert, update, delete on
  public.career_normalized_metric_inputs,
  public.career_score_component_metric_inputs,
  public.career_score_component_raw_inputs,
  public.career_foundation_licensing_evidence,
  public.career_foundation_visa_pathways,
  public.career_foundation_job_opportunities
to service_role;

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
    when p_formula_version not in ('career-opportunity-v2-foundation','career-opportunity-v3-foundation') then null::numeric
    when p_component_key = 'relative_salary'
      then round(greatest(0::numeric, least(10::numeric, 5::numeric + ((p_normalized_value - 1::numeric) * 10::numeric))), 2)
    when p_component_key = 'projected_growth'
      then round(greatest(0::numeric, least(10::numeric, 5::numeric + (p_normalized_value / 2::numeric))), 2)
    when p_component_key = 'employment_momentum'
      then round(greatest(0::numeric, least(10::numeric, 5::numeric + ((p_normalized_value - 1::numeric) * 5::numeric))), 2)
    when p_formula_version = 'career-opportunity-v2-foundation' and p_component_key = 'entry_accessibility'
      then round(greatest(0::numeric, least(15::numeric, p_normalized_value)), 2)
    when p_formula_version = 'career-opportunity-v3-foundation' and p_component_key = 'shortage_signal'
      then round(greatest(0::numeric, least(20::numeric, p_normalized_value)), 2)
    when p_formula_version = 'career-opportunity-v3-foundation' and p_component_key = 'vacancy_intensity'
      then round(greatest(0::numeric, least(15::numeric, p_normalized_value)), 2)
    when p_formula_version = 'career-opportunity-v3-foundation' and p_component_key = 'industry_diversity'
      then round(greatest(0::numeric, least(5::numeric, p_normalized_value)), 2)
    when p_formula_version = 'career-opportunity-v3-foundation' and p_component_key = 'entry_accessibility'
      then round(greatest(0::numeric, least(15::numeric, p_normalized_value)), 2)
    when p_formula_version = 'career-opportunity-v3-foundation' and p_component_key = 'visa_accessibility'
      then round(greatest(0::numeric, least(10::numeric, p_normalized_value)), 2)
    when p_formula_version = 'career-opportunity-v3-foundation' and p_component_key = 'entry_burden'
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
('us-careeronestop-nlx-carpenter','U.S. Department of Labor Employment and Training Administration','CareerOneStop Job Finder: Carpenter, United States','https://www.careeronestop.org/Toolkit/Jobs/find-jobs-results.aspx?keyword=Carpenter&location=UNITED%20STATES&radius=','official_service','2026-08-12','NLx-backed live job-search result. Used as fallback vacancy evidence and live discovery, not as a clean 90-day distinct vacancy numerator.'),
('us-ny-statejobs','State of New York','StateJobsNY public vacancies','https://statejobs.ny.gov/public/','official_service','2026-08-12','Official New York State public job vacancy service.'),
('us-hawaii-civil-service','State of Hawaii','State of Hawaii Civil Service Jobs','https://www.governmentjobs.com/careers/hawaii','official_service','2026-08-12','Official State of Hawaii civil service recruitment service hosted on NEOGOV.'),
('us-ca-cslb-c5','California Contractors State License Board','C-5 Framing and Rough Carpentry Contractor classification','https://www.cslb.ca.gov/about_us/library/licensing_classifications/Licensing_Classifications_Detail.aspx?Class=C-5','official_primary','2026-08-12','California contractor classification evidence. It is a contractor/business rule, not a nationwide employee Carpenter occupational license.'),
('us-nyc-hic','New York City Department of Consumer and Worker Protection','Home Improvement Contractor License','https://www.nyc.gov/site/dca/businesses/license-checklist-home-improvement-contractor.page','official_primary','2026-08-12','NYC contractor/business licensing evidence for residential home-improvement work; not a nationwide employee Carpenter license.')
on conflict (source_key) do update set authority=excluded.authority,title=excluded.title,url=excluded.url,source_type=excluded.source_type,last_verified_on=excluded.last_verified_on,notes=excluded.notes;

insert into public.career_raw_observations (
  observation_key, profile_key, mapping_key, source_key, metric_key,
  reference_period, as_of_date, raw_value, unit, availability, reason,
  directness, mapping_quality, proxy_reason, source_type, quality,
  confidence, last_verified_on, explanation
)
values
('us-carpenter-vacancy-fallback-2026-08-12','US:carpenter','US:carpenter:SOC:47-2031','us-careeronestop-nlx-carpenter','vacancy_fallback_evidence','current listing inventory checked 2026-08-12; persistence sampled across recent 90-day window','2026-08-12',jsonb_build_object('current_results_count',1980,'clean_distinct_90_day_numerator',false,'geographic_spread','multiple states','recent_examples_present',true,'persistence_class','repeated_across_multiple_periods','source_quality','government_job_portal'),'listing evidence','available',null,'direct','high',null,'official_service','medium',0.700,'2026-08-12','CareerOneStop/NLx showed a broad current Carpenter listing inventory across multiple states and recent posting dates. The count is not treated as a clean distinct 90-day national vacancy numerator.'),
('us-carpenter-apprenticeship-paid-training','US:carpenter','US:carpenter:SOC:47-2031','us-bls-ooh-carpenters','apprenticeship_earning_structure','current BLS Occupational Outlook Handbook checked 2026-08-12','2026-08-12',jsonb_build_object('structured_training',true,'paid_on_the_job_training',true,'employment_linked',true,'typical_program_multi_year',true),'training structure','available',null,'direct','high',null,'official_primary','high',0.950,'2026-08-12','BLS describes Carpenter apprenticeships as combining technical instruction with paid on-the-job training, so duration is not treated as years of unpaid pre-employment burden.'),
('us-carpenter-ca-contractor-license-c5','US:carpenter','US:carpenter:SOC:47-2031','us-ca-cslb-c5','subnational_contractor_license','verified 2026-08-12','2026-08-12',jsonb_build_object('jurisdiction','California','classification','C-5 Framing and Rough Carpentry Contractor','applies_to','contractor','employee_occupational_license_evidence',false),'regulatory evidence','available',null,'direct','high',null,'official_primary','high',0.980,'2026-08-12','California publishes a C-5 contractor classification for framing and rough carpentry. This evidence concerns contractor licensing and is not generalized to employee Carpenters nationwide.'),
('us-carpenter-nyc-home-improvement-contractor-license','US:carpenter','US:carpenter:SOC:47-2031','us-nyc-hic','subnational_contractor_license','verified 2026-08-12','2026-08-12',jsonb_build_object('jurisdiction','New York City','requirement','Home Improvement Contractor License','applies_to','contractor_or_business','employee_occupational_license_evidence',false),'regulatory evidence','available',null,'direct','high',null,'official_primary','high',0.980,'2026-08-12','NYC requires a Home Improvement Contractor license for covered residential home-improvement contracting. This is contractor/business evidence, not a general employee Carpenter occupational license.')
on conflict (observation_key) do update set profile_key=excluded.profile_key,mapping_key=excluded.mapping_key,source_key=excluded.source_key,metric_key=excluded.metric_key,reference_period=excluded.reference_period,as_of_date=excluded.as_of_date,raw_value=excluded.raw_value,unit=excluded.unit,availability=excluded.availability,reason=excluded.reason,directness=excluded.directness,mapping_quality=excluded.mapping_quality,proxy_reason=excluded.proxy_reason,source_type=excluded.source_type,quality=excluded.quality,confidence=excluded.confidence,last_verified_on=excluded.last_verified_on,explanation=excluded.explanation;

insert into public.career_foundation_licensing_evidence (
  evidence_key, profile_key, mapping_key, jurisdiction_code, jurisdiction_name,
  jurisdiction_level, requirement_type, mandatory, applies_to, authority,
  source_key, official_source_url, verified_on, cost_amount, cost_currency,
  expected_duration_days, exceptions, evidence_quality, notes
)
values
('US:carpenter:CA:C5-contractor','US:carpenter','US:carpenter:SOC:47-2031','US-CA','California','state','contractor_license',true,'contractor','California Contractors State License Board','us-ca-cslb-c5','https://www.cslb.ca.gov/about_us/library/licensing_classifications/Licensing_Classifications_Detail.aspx?Class=C-5','2026-08-12',null,'USD',null,'Does not establish a general employee Carpenter occupational-license requirement.','high','Stored separately so contractor licensing is not deducted from the general employee Entry Burden score.'),
('US:carpenter:NYC:HIC-contractor','US:carpenter','US:carpenter:SOC:47-2031','US-NY-NYC','New York City','city','contractor_license',true,'contractor','New York City Department of Consumer and Worker Protection','us-nyc-hic','https://www.nyc.gov/site/dca/businesses/license-checklist-home-improvement-contractor.page','2026-08-12',100,'USD',null,'Covered residential home-improvement contracting; employee and exempt subcontractor situations are not generalized as licensed Carpenter employment.','high','Subnational contractor/business rule retained as a user warning, not a nationwide employee occupational-license rule.'),
('US:carpenter:US:OSHA-outreach','US:carpenter','US:carpenter:SOC:47-2031','US','United States','national','safety_training',false,'employee','Occupational Safety and Health Administration','us-osha-outreach','https://www.osha.gov/training/outreach','2026-08-12',null,'USD',null,'Some states, municipalities, employers, unions or projects may require Outreach training even though federal OSHA describes the program as voluntary and not a certification.','high','Safety training remains a separate decision requirement and does not become a federal Carpenter occupational license.')
on conflict (evidence_key) do update set mandatory=excluded.mandatory,applies_to=excluded.applies_to,authority=excluded.authority,source_key=excluded.source_key,official_source_url=excluded.official_source_url,verified_on=excluded.verified_on,cost_amount=excluded.cost_amount,cost_currency=excluded.cost_currency,expected_duration_days=excluded.expected_duration_days,exceptions=excluded.exceptions,evidence_quality=excluded.evidence_quality,notes=excluded.notes;

insert into public.career_foundation_visa_pathways (
  pathway_key, profile_key, route_role, pathway_name, source_key,
  official_source_url, occupation_applicability_points, employer_dependency_points,
  eligibility_burden_points, long_term_pathway_points, used_for_primary_score,
  applicability_scope, last_verified_on, notes
)
values
('US:carpenter:H2B','US:carpenter','primary','H-2B Temporary Non-agricultural Program','us-dol-h2b','https://www.dol.gov/agencies/eta/foreign-labor/programs/h-2b',2,1,2,0,true,'Employer-sponsored temporary non-agricultural work where the employer can establish a qualifying temporary need; not Carpenter-specific and not a visa guarantee.','2026-08-12','Primary representative work pathway. Its own long-term score is 0 because H-2B is temporary; the separate verified PERM route supplies conditional long-term evidence at the component level.'),
('US:carpenter:PERM','US:carpenter','secondary','Permanent Labor Certification (PERM)','us-dol-perm','https://www.dol.gov/agencies/eta/foreign-labor/programs/permanent',2,1,1,2,false,'Employer-filed permanent labor-certification route that can apply to a permanent Carpenter role when statutory and labor-market requirements are met.','2026-08-12','Secondary long-term route. It is case-specific and employer-filed, so it supports long-term pathway evidence without being added as a second visa score.')
on conflict (pathway_key) do update set route_role=excluded.route_role,pathway_name=excluded.pathway_name,source_key=excluded.source_key,official_source_url=excluded.official_source_url,occupation_applicability_points=excluded.occupation_applicability_points,employer_dependency_points=excluded.employer_dependency_points,eligibility_burden_points=excluded.eligibility_burden_points,long_term_pathway_points=excluded.long_term_pathway_points,used_for_primary_score=excluded.used_for_primary_score,applicability_scope=excluded.applicability_scope,last_verified_on=excluded.last_verified_on,notes=excluded.notes;

insert into public.career_foundation_job_opportunities (
  opportunity_key, profile_key, source_key, title, employer, location_text,
  posted_on, application_deadline, source_name, listing_url, apply_url,
  last_checked_on, status, relation_quality, notes
)
values
('US:carpenter:NY:216138','US:carpenter','us-ny-statejobs','Trades Specialist - Carpenter','New York State Office of Mental Health','Albany, NY','2026-05-15','2026-11-25','StateJobsNY','https://statejobs.ny.gov/public/vacancyDetailsView.cfm?id=216138','https://statejobs.ny.gov/public/vacancyDetailsView.cfm?id=216138','2026-08-12','active','exact','Official public vacancy, still within the published application window when checked.'),
('US:carpenter:HI:26-0120','US:carpenter','us-hawaii-civil-service','Carpenter I - Oahu','State of Hawaii','Oahu, HI','2026-03-14',null,'State of Hawaii Civil Service Jobs','https://www.governmentjobs.com/careers/hawaii/jobs/5264153-0/carpenter-i-oahu','https://www.governmentjobs.com/careers/hawaii/jobs/5264153-0/carpenter-i-oahu','2026-08-12','active','exact','Continuous official state recruitment when checked; may close once sufficient applications are received.')
on conflict (opportunity_key) do update set title=excluded.title,employer=excluded.employer,location_text=excluded.location_text,posted_on=excluded.posted_on,application_deadline=excluded.application_deadline,source_name=excluded.source_name,listing_url=excluded.listing_url,apply_url=excluded.apply_url,last_checked_on=excluded.last_checked_on,status=excluded.status,relation_quality=excluded.relation_quality,notes=excluded.notes;

insert into public.career_foundation_entry_points (
  entry_point_key, profile_key, entry_type, label, provider, url, source_key,
  applicability_scope, last_verified_on, notes, sort_order
)
values
('us-carpenter-job-statejobsny-216138','US:carpenter','employer','Trades Specialist - Carpenter — Albany, NY','New York State Office of Mental Health','https://statejobs.ny.gov/public/vacancyDetailsView.cfm?id=216138','us-ny-statejobs','Current official Carpenter vacancy in Albany, New York; verify closing status before applying.','2026-08-12','Live example is shown for practical application access and is not itself the Vacancy Score numerator.',15),
('us-carpenter-job-hawaii-26-0120','US:carpenter','employer','Carpenter I — Oahu, HI','State of Hawaii','https://www.governmentjobs.com/careers/hawaii/jobs/5264153-0/carpenter-i-oahu','us-hawaii-civil-service','Continuous official state Carpenter recruitment on Oahu; verify current availability before applying.','2026-08-12','Live example is shown for practical application access and is not itself the Vacancy Score numerator.',16)
on conflict (entry_point_key) do update set label=excluded.label,provider=excluded.provider,url=excluded.url,source_key=excluded.source_key,applicability_scope=excluded.applicability_scope,last_verified_on=excluded.last_verified_on,notes=excluded.notes,sort_order=excluded.sort_order;

insert into public.career_normalized_metrics (
  normalized_metric_key, profile_key, metric_key, input_observation_refs,
  normalized_value, normalized_unit, formula_version, availability, reason,
  directness, mapping_quality, proxy_reason, source_type, quality, confidence,
  explanation
)
values
('US:carpenter:shortage_points_v1','US:carpenter','shortage_points_20',array['us-carpenter-shortage-signal'],0,'points','normalize-shortage-v1','available','Sufficient official-source review did not validate a nationwide or subnational official Carpenter shortage designation usable under the v1 cross-country shortage method.','proxy','high','CampCareer applies the agreed no_evidence_found fallback: absence of a validated official shortage assessment after documented review scores 0 without asserting confirmed non-shortage.','official_primary','medium',0.750,'Status is no_evidence_found, not confirmed_not_shortage. Growth, annual openings and live vacancies are not relabeled as shortage.'),
('US:carpenter:vacancy_points_v1','US:carpenter','vacancy_points_15',array['us-carpenter-vacancy-fallback-2026-08-12'],4,'points','normalize-vacancy-v1','available','A clean nationally comprehensive distinct 90-day vacancy numerator was not available, so the score uses the agreed fallback evidence rubric.','proxy','medium','CareerOneStop/NLx provides current broad listing evidence but not a clean 90-day distinct national vacancy count. v1 assigns low intensity (3) plus repeated-period persistence (1), capped below the government-job-portal maximum.','official_service','medium',0.650,'Fallback vacancy score = low intensity 3 + persistence 1 = 4/15. The displayed current listing inventory is not divided by employment as if it were a clean 90-day numerator.'),
('US:carpenter:industry_diversity_points_v1','US:carpenter','industry_diversity_points_5',array['us-carpenter-industry-shares-2024'],0,'points','normalize-industry-diversity-v1','available','The published major-share coverage is 84%, but the source mixes self-employment status with construction subindustries and cannot yet be mapped to a defensible common broad-sector HHI without inventing residual allocation.','proxy','medium','CampCareer v1 uses the agreed conservative insufficient_industry_coverage fallback instead of fabricating a cross-country HHI from non-comparable categories.','official_primary','medium',0.700,'Status is insufficient_industry_coverage. This 0 does not mean observed employment is proven to be maximally concentrated.'),
('US:carpenter:entry_accessibility_points_v2','US:carpenter','entry_accessibility_points_15',array['us-carpenter-entry-education','us-carpenter-related-experience','us-carpenter-on-job-training','us-carpenter-apprenticeship-paid-training'],14,'points','normalize-entry-accessibility-v2','available',null,'proxy','high','CampCareer converts official typical-entry categories into the frozen v1 accessibility rubric. The score is not a BLS score.','official_primary','high',0.900,'High school entry = 7, no related experience = 3, paid employment-linked apprenticeship = 4. Training duration is not treated as unpaid pre-employment time when earning and employment begin during apprenticeship.'),
('US:carpenter:visa_accessibility_points_v1','US:carpenter','visa_accessibility_points_10',array['us-carpenter-h2b-conditions','us-carpenter-perm-conditions'],6,'points','normalize-visa-accessibility-v1','available',null,'proxy','high','CampCareer converts direct official pathway conditions into the occupation-level visa accessibility rubric; it is not an immigration eligibility determination.','official_primary','medium',0.800,'Primary representative route H-2B: occupation applicability 2, employer dependency 1, eligibility burden 2; a verified employer-filed PERM route supports 1 long-term pathway point. Total 6/10.'),
('US:carpenter:entry_burden_points_v1','US:carpenter','entry_burden_points_5',array['us-carpenter-federal-personal-license','us-carpenter-ca-contractor-license-c5','us-carpenter-nyc-home-improvement-contractor-license','us-carpenter-osha-outreach'],5,'points','normalize-entry-burden-v1','available',null,'proxy','high','CampCareer converts jurisdiction-specific regulatory evidence into the agreed general-employee Entry Burden formula. Contractor-only rules are retained as warnings but are not deducted from employee entry accessibility.','official_primary','medium',0.820,'No nationwide general employee Carpenter occupational-license requirement was identified. California C-5 and NYC HIC evidence applies to contractor/business roles; federal OSHA Outreach is voluntary and not a certification. General employee Entry Burden therefore remains 5/5 while subnational checks remain visible.')
on conflict (normalized_metric_key) do update set profile_key=excluded.profile_key,metric_key=excluded.metric_key,input_observation_refs=excluded.input_observation_refs,normalized_value=excluded.normalized_value,normalized_unit=excluded.normalized_unit,formula_version=excluded.formula_version,availability=excluded.availability,reason=excluded.reason,directness=excluded.directness,mapping_quality=excluded.mapping_quality,proxy_reason=excluded.proxy_reason,source_type=excluded.source_type,quality=excluded.quality,confidence=excluded.confidence,explanation=excluded.explanation,calculated_at=now();

insert into public.career_normalized_metric_inputs
(normalized_metric_key, observation_key, input_role, usage_type)
values
('US:carpenter:relative_salary_ratio','us-carpenter-median-hourly-wage-2025','occupation_value','input'),
('US:carpenter:relative_salary_ratio','us-all-occupations-median-hourly-wage-2025','country_benchmark','benchmark'),
('US:carpenter:growth_excess_pp','us-carpenter-growth-2024-2034','occupation_value','input'),
('US:carpenter:growth_excess_pp','us-all-occupations-growth-2024-2034','country_benchmark','benchmark'),
('US:carpenter:annual_openings_intensity_ratio','us-carpenter-annual-openings-2024-2034','occupation_openings','input'),
('US:carpenter:annual_openings_intensity_ratio','us-carpenter-employment-2024','occupation_employment','input'),
('US:carpenter:annual_openings_intensity_ratio','us-all-occupations-annual-openings-2024-2034','country_openings_benchmark','benchmark'),
('US:carpenter:annual_openings_intensity_ratio','us-all-occupations-employment-2024','country_employment_benchmark','benchmark'),
('US:carpenter:shortage_points_v1','us-carpenter-shortage-signal','official_shortage_assessment_search','fallback_evidence'),
('US:carpenter:vacancy_points_v1','us-carpenter-vacancy-fallback-2026-08-12','listing_market_evidence','fallback_evidence'),
('US:carpenter:industry_diversity_points_v1','us-carpenter-industry-shares-2024','industry_share_evidence','fallback_evidence'),
('US:carpenter:entry_accessibility_points_v2','us-carpenter-entry-education','education','input'),
('US:carpenter:entry_accessibility_points_v2','us-carpenter-related-experience','related_experience','input'),
('US:carpenter:entry_accessibility_points_v2','us-carpenter-on-job-training','training_category','input'),
('US:carpenter:entry_accessibility_points_v2','us-carpenter-apprenticeship-paid-training','earning_structure','input'),
('US:carpenter:visa_accessibility_points_v1','us-carpenter-h2b-conditions','primary_pathway','policy_evidence'),
('US:carpenter:visa_accessibility_points_v1','us-carpenter-perm-conditions','long_term_pathway','policy_evidence'),
('US:carpenter:entry_burden_points_v1','us-carpenter-federal-personal-license','national_employee_license_search','policy_evidence'),
('US:carpenter:entry_burden_points_v1','us-carpenter-ca-contractor-license-c5','contractor_state_rule','policy_evidence'),
('US:carpenter:entry_burden_points_v1','us-carpenter-nyc-home-improvement-contractor-license','contractor_local_rule','policy_evidence'),
('US:carpenter:entry_burden_points_v1','us-carpenter-osha-outreach','safety_training_scope','policy_evidence')
on conflict do nothing;

insert into public.career_opportunity_score_snapshots (snapshot_key, profile_key, as_of_date, formula_version, required_component_keys, explanation)
values ('US:carpenter:2026-08-12:v3','US:carpenter','2026-08-12','career-opportunity-v3-foundation',array['shortage_signal','vacancy_intensity','industry_diversity','employment_momentum','entry_accessibility','relative_salary','projected_growth','visa_accessibility','entry_burden'],'Cross-country methodology v1 reference snapshot. Completed research may use deterministic zero/fallback/proxy evaluations while retaining evidence status, provenance and confidence. Employment momentum, salary and growth formulas are carried forward from the pilot pending their separate methodology freeze.')
on conflict (snapshot_key) do update set formula_version=excluded.formula_version,required_component_keys=excluded.required_component_keys,explanation=excluded.explanation;

insert into public.career_score_components (
  snapshot_key, profile_key, component_key, raw_input_refs, normalized_metric_refs,
  normalized_value, formula_version, availability, directness, mapping_quality,
  proxy_reason, source_type, quality, confidence, explanation, reason, evidence_status
)
values
('US:carpenter:2026-08-12:v3','US:carpenter','shortage_signal',array['us-carpenter-shortage-signal'],array['US:carpenter:shortage_points_v1'],0,'career-opportunity-v3-foundation','available','proxy','high','CampCareer no_evidence_found fallback converts a completed official-source shortage review into 0 points without asserting confirmed non-shortage.','official_primary','medium',0.750,'No validated official Carpenter shortage designation was found. Growth, openings and vacancies are kept separate from shortage.','Official shortage evidence was not validated after the documented v1 source review.','no_evidence_found'),
('US:carpenter:2026-08-12:v3','US:carpenter','vacancy_intensity',array['us-carpenter-vacancy-fallback-2026-08-12'],array['US:carpenter:vacancy_points_v1'],4,'career-opportunity-v3-foundation','available','proxy','medium','A clean 90-day distinct national numerator was unavailable, so v1 uses documented listing volume, geographic spread and persistence evidence with a source-quality cap.','official_service','medium',0.650,'Low intensity 3 plus repeated-period persistence 1 produces 4/15; current CareerOneStop/NLx inventory is not treated as a clean distinct 90-day count.','Fallback scoring is used because the official job portal does not expose the required clean national 90-day vacancy denominator pair.','fallback'),
('US:carpenter:2026-08-12:v3','US:carpenter','industry_diversity',array['us-carpenter-industry-shares-2024'],array['US:carpenter:industry_diversity_points_v1'],0,'career-opportunity-v3-foundation','available','proxy','medium','CampCareer applies the v1 insufficient-industry-coverage fallback rather than inventing a common-sector HHI from non-comparable published categories.','official_primary','medium',0.700,'BLS major shares cover 84%, but the published categories mix self-employment status and construction subindustries, preventing a defensible common broad-sector HHI.','Industry evidence cannot yet support the agreed cross-country HHI normalization.','insufficient_industry_coverage'),
('US:carpenter:2026-08-12:v3','US:carpenter','employment_momentum',array['us-carpenter-annual-openings-2024-2034','us-carpenter-employment-2024','us-all-occupations-annual-openings-2024-2034','us-all-occupations-employment-2024'],array['US:carpenter:annual_openings_intensity_ratio'],0.69617542042662060020,'career-opportunity-v3-foundation','available','direct','high',null,'official_primary','medium',0.900,'Projected annual openings intensity relative to the U.S. all-occupations benchmark. This remains employment momentum, not live vacancy intensity.',null,'derived'),
('US:carpenter:2026-08-12:v3','US:carpenter','entry_accessibility',array['us-carpenter-entry-education','us-carpenter-related-experience','us-carpenter-on-job-training','us-carpenter-apprenticeship-paid-training'],array['US:carpenter:entry_accessibility_points_v2'],14,'career-opportunity-v3-foundation','available','proxy','high','CampCareer v1 entry-accessibility rubric converts official typical-entry education, experience and training structure into a 15-point score; it is not a BLS score.','official_primary','high',0.900,'High school 7 + no related experience 3 + paid employment-linked apprenticeship 4 = 14/15.',null,'proxy'),
('US:carpenter:2026-08-12:v3','US:carpenter','relative_salary',array['us-carpenter-median-hourly-wage-2025','us-all-occupations-median-hourly-wage-2025'],array['US:carpenter:relative_salary_ratio'],1.1880864953080375,'career-opportunity-v3-foundation','available','direct','high',null,'official_primary','high',0.980,'Same-country occupation/all-occupations median hourly wage ratio, carried forward from the pilot formula pending separate methodology freeze.',null,'derived'),
('US:carpenter:2026-08-12:v3','US:carpenter','projected_growth',array['us-carpenter-growth-2024-2034','us-all-occupations-growth-2024-2034'],array['US:carpenter:growth_excess_pp'],1.4,'career-opportunity-v3-foundation','available','direct','high',null,'official_primary','high',0.950,'Projected growth percentage-point difference from the same-country all-occupations benchmark, carried forward pending separate methodology freeze.',null,'derived'),
('US:carpenter:2026-08-12:v3','US:carpenter','visa_accessibility',array['us-carpenter-h2b-conditions','us-carpenter-perm-conditions'],array['US:carpenter:visa_accessibility_points_v1'],6,'career-opportunity-v3-foundation','available','proxy','high','CampCareer converts direct official H-2B/PERM conditions into the occupation-level structural visa accessibility rubric; personal eligibility remains separate.','official_primary','medium',0.800,'Representative path scoring: occupation applicability 2 + employer dependency 1 + eligibility burden 2 + conditional long-term pathway 1 = 6/10.',null,'proxy'),
('US:carpenter:2026-08-12:v3','US:carpenter','entry_burden',array['us-carpenter-federal-personal-license','us-carpenter-ca-contractor-license-c5','us-carpenter-nyc-home-improvement-contractor-license','us-carpenter-osha-outreach'],array['US:carpenter:entry_burden_points_v1'],5,'career-opportunity-v3-foundation','available','proxy','high','CampCareer v1 entry-burden formula evaluates the general employee path. Contractor/business rules are stored separately and do not reduce the employee score.','official_primary','medium',0.820,'No nationwide general employee Carpenter occupational-license rule was identified; known California and NYC licensing evidence is contractor/business specific, and federal OSHA Outreach is voluntary/not a certification.',null,'proxy')
on conflict (snapshot_key, component_key) do update set raw_input_refs=excluded.raw_input_refs,normalized_metric_refs=excluded.normalized_metric_refs,normalized_value=excluded.normalized_value,formula_version=excluded.formula_version,availability=excluded.availability,directness=excluded.directness,mapping_quality=excluded.mapping_quality,proxy_reason=excluded.proxy_reason,source_type=excluded.source_type,calculated_at=now(),quality=excluded.quality,confidence=excluded.confidence,explanation=excluded.explanation,reason=excluded.reason,evidence_status=excluded.evidence_status;

insert into public.career_score_component_metric_inputs(snapshot_key, component_key, normalized_metric_key, input_role)
values
('US:carpenter:2026-08-12:v3','shortage_signal','US:carpenter:shortage_points_v1','scored_metric'),
('US:carpenter:2026-08-12:v3','vacancy_intensity','US:carpenter:vacancy_points_v1','scored_metric'),
('US:carpenter:2026-08-12:v3','industry_diversity','US:carpenter:industry_diversity_points_v1','scored_metric'),
('US:carpenter:2026-08-12:v3','employment_momentum','US:carpenter:annual_openings_intensity_ratio','scored_metric'),
('US:carpenter:2026-08-12:v3','entry_accessibility','US:carpenter:entry_accessibility_points_v2','scored_metric'),
('US:carpenter:2026-08-12:v3','relative_salary','US:carpenter:relative_salary_ratio','scored_metric'),
('US:carpenter:2026-08-12:v3','projected_growth','US:carpenter:growth_excess_pp','scored_metric'),
('US:carpenter:2026-08-12:v3','visa_accessibility','US:carpenter:visa_accessibility_points_v1','scored_metric'),
('US:carpenter:2026-08-12:v3','entry_burden','US:carpenter:entry_burden_points_v1','scored_metric')
on conflict do nothing;

insert into public.career_score_component_raw_inputs(snapshot_key, component_key, observation_key, input_role)
select 'US:carpenter:2026-08-12:v3',component_key,observation_key,input_role
from (values
('shortage_signal','us-carpenter-shortage-signal','official_shortage_search'),
('vacancy_intensity','us-carpenter-vacancy-fallback-2026-08-12','fallback_market_evidence'),
('industry_diversity','us-carpenter-industry-shares-2024','industry_shares'),
('employment_momentum','us-carpenter-annual-openings-2024-2034','occupation_openings'),
('employment_momentum','us-carpenter-employment-2024','occupation_employment'),
('employment_momentum','us-all-occupations-annual-openings-2024-2034','country_openings_benchmark'),
('employment_momentum','us-all-occupations-employment-2024','country_employment_benchmark'),
('entry_accessibility','us-carpenter-entry-education','education'),
('entry_accessibility','us-carpenter-related-experience','related_experience'),
('entry_accessibility','us-carpenter-on-job-training','training_category'),
('entry_accessibility','us-carpenter-apprenticeship-paid-training','earning_structure'),
('relative_salary','us-carpenter-median-hourly-wage-2025','occupation_wage'),
('relative_salary','us-all-occupations-median-hourly-wage-2025','country_wage_benchmark'),
('projected_growth','us-carpenter-growth-2024-2034','occupation_growth'),
('projected_growth','us-all-occupations-growth-2024-2034','country_growth_benchmark'),
('visa_accessibility','us-carpenter-h2b-conditions','primary_pathway'),
('visa_accessibility','us-carpenter-perm-conditions','long_term_pathway'),
('entry_burden','us-carpenter-federal-personal-license','national_employee_license_search'),
('entry_burden','us-carpenter-ca-contractor-license-c5','contractor_state_rule'),
('entry_burden','us-carpenter-nyc-home-improvement-contractor-license','contractor_local_rule'),
('entry_burden','us-carpenter-osha-outreach','safety_training_scope')
) as lineage(component_key, observation_key, input_role)
on conflict do nothing;

update public.career_foundation_profiles
set decision_ready=true,decision_readiness_reason='US Carpenter has official market, entry, visa, licensing-scope, vacancy-fallback and live opportunity evidence evaluated under the cross-country methodology v1. Personal work authorization and subnational requirements remain individual/location-specific.',source_checked_on='2026-08-12',updated_at=now()
where profile_key='US:carpenter';
