-- CampCareer global study-product foundation.
-- Public taxonomy data is served through narrow, cached application APIs rather
-- than being exposed directly through PostgREST. User-owned plans use RLS.

create table public.taxonomy_classifications (
  id text primary key,
  jurisdiction text not null,
  name text not null,
  version text not null,
  purpose text not null check (purpose in ('education', 'occupation', 'immigration', 'qualification')),
  source_url text not null,
  effective_from date,
  effective_to date,
  created_at timestamptz not null default now(),
  unique (jurisdiction, name, version)
);

create table public.canonical_concepts (
  id text primary key,
  slug text not null unique,
  kind text not null check (kind in ('STUDY_FIELD', 'QUALIFICATION', 'TRADE_PATHWAY')),
  category text not null,
  default_label text not null,
  description text,
  status text not null default 'active' check (status in ('active', 'retired')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.taxonomy_nodes (
  id bigint generated always as identity primary key,
  classification_id text not null references public.taxonomy_classifications(id) on delete cascade,
  code text not null,
  parent_code text,
  official_name text not null,
  description text,
  effective_from date,
  effective_to date,
  unique (classification_id, code)
);

create table public.concept_node_mappings (
  concept_id text not null references public.canonical_concepts(id) on delete cascade,
  taxonomy_node_id bigint not null references public.taxonomy_nodes(id) on delete cascade,
  relation text not null check (relation in ('exact', 'broader', 'narrower', 'related')),
  source_url text,
  reviewed_at timestamptz,
  primary key (concept_id, taxonomy_node_id)
);

create table public.concept_labels (
  id bigint generated always as identity primary key,
  concept_id text not null references public.canonical_concepts(id) on delete cascade,
  locale text not null,
  label text not null,
  normalized_label text not null,
  label_type text not null check (label_type in ('preferred', 'official_alias', 'reviewed_translation')),
  reviewed_at timestamptz,
  unique (concept_id, locale, normalized_label)
);

create table public.pathway_relations (
  id bigint generated always as identity primary key,
  concept_id text not null references public.canonical_concepts(id) on delete cascade,
  country_code text not null check (country_code ~ '^[A-Z]{2}$'),
  relation text not null check (relation in ('prepares_for', 'typical_pathway', 'required_for', 'eligible_for_assessment', 'regulated_by')),
  title text not null,
  description text,
  source_url text not null,
  as_of date not null,
  review_status text not null check (review_status in ('APPROVED', 'STALE', 'REVIEW_REQUIRED')),
  reviewed_at timestamptz
);

create table public.concept_country_coverage (
  concept_id text not null references public.canonical_concepts(id) on delete cascade,
  country_code text not null check (country_code ~ '^[A-Z]{2}$'),
  coverage text not null check (coverage in ('CATALOG', 'PROFILE_READY', 'PATHWAY_READY', 'DECISION_READY')),
  data_version text not null,
  as_of date not null,
  last_verified_at timestamptz not null,
  review_status text not null check (review_status in ('APPROVED', 'STALE', 'REVIEW_REQUIRED')),
  missing_fields text[] not null default '{}',
  primary key (concept_id, country_code)
);

create table public.course_offerings (
  id bigint generated always as identity primary key,
  concept_id text not null references public.canonical_concepts(id) on delete cascade,
  country_code text not null check (country_code ~ '^[A-Z]{2}$'),
  provider_id text not null,
  provider_name text not null,
  course_code text not null,
  title text not null,
  qualification_level text,
  tuition_amount numeric(14, 2),
  tuition_currency text check (tuition_currency is null or tuition_currency ~ '^[A-Z]{3}$'),
  duration_months integer check (duration_months is null or duration_months > 0),
  campus text,
  intake text,
  international_eligible boolean not null default false,
  registration_status text not null check (registration_status in ('CURRENT', 'EXPIRED', 'UNKNOWN')),
  official_url text not null,
  last_verified_at timestamptz not null,
  review_status text not null check (review_status in ('APPROVED', 'STALE', 'REVIEW_REQUIRED')),
  unique (country_code, provider_id, course_code)
);

create table public.course_offering_sources (
  id bigint generated always as identity primary key,
  course_offering_id bigint not null references public.course_offerings(id) on delete cascade,
  source_type text not null check (source_type in ('OFFICIAL', 'MARKET', 'INTERNAL')),
  source_name text not null,
  source_url text not null,
  as_of date not null,
  last_verified_at timestamptz not null
);

create table public.decision_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  locale text not null,
  origin_country text not null check (origin_country ~ '^[A-Z]{2}$'),
  target_concept_id text not null references public.canonical_concepts(id),
  selected_country text check (selected_country is null or selected_country ~ '^[A-Z]{2}$'),
  current_version integer not null default 1 check (current_version > 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.decision_plan_versions (
  id bigint generated always as identity primary key,
  plan_id uuid not null references public.decision_plans(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  version integer not null check (version > 0),
  input_json jsonb not null check (jsonb_typeof(input_json) = 'object'),
  result_snapshot jsonb not null check (jsonb_typeof(result_snapshot) = 'object'),
  engine_version text not null,
  data_version text not null,
  generated_at timestamptz not null,
  created_at timestamptz not null default now(),
  unique (plan_id, version)
);

create table public.plan_save_intents (
  id uuid primary key default gen_random_uuid(),
  claim_token_hash text not null unique,
  locale text not null,
  origin_country text not null check (origin_country ~ '^[A-Z]{2}$'),
  target_concept_id text not null references public.canonical_concepts(id),
  input_json jsonb not null check (jsonb_typeof(input_json) = 'object'),
  result_snapshot jsonb not null check (jsonb_typeof(result_snapshot) = 'object'),
  engine_version text not null,
  data_version text not null,
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.decision_plans
  add column save_intent_id uuid unique references public.plan_save_intents(id);

create table public.taxonomy_gaps (
  id bigint generated always as identity primary key,
  query_hash text not null,
  query_length smallint not null check (query_length between 1 and 120),
  locale text not null,
  origin_country text,
  created_at timestamptz not null default now()
);

insert into public.canonical_concepts (id, slug, kind, category, default_label) values
  ('computer-science', 'computer-science', 'STUDY_FIELD', 'technology', 'Computer Science'),
  ('data-analytics', 'data-analytics', 'STUDY_FIELD', 'technology', 'Data Analytics & AI'),
  ('cybersecurity', 'cybersecurity', 'STUDY_FIELD', 'technology', 'Cybersecurity'),
  ('nursing', 'nursing', 'STUDY_FIELD', 'health', 'Nursing'),
  ('aged-care', 'aged-care', 'QUALIFICATION', 'health', 'Aged Care & Community Services'),
  ('allied-health', 'allied-health', 'STUDY_FIELD', 'health', 'Allied Health'),
  ('engineering', 'engineering', 'STUDY_FIELD', 'engineering', 'Engineering'),
  ('civil-engineering', 'civil-engineering', 'STUDY_FIELD', 'engineering', 'Civil Engineering'),
  ('mechanical-engineering', 'mechanical-engineering', 'STUDY_FIELD', 'engineering', 'Mechanical Engineering'),
  ('business-analytics', 'business-analytics', 'STUDY_FIELD', 'business', 'Business Analytics'),
  ('accounting', 'accounting', 'STUDY_FIELD', 'business', 'Accounting'),
  ('early-childhood', 'early-childhood-education', 'QUALIFICATION', 'education', 'Early Childhood Education'),
  ('carpentry', 'carpentry', 'TRADE_PATHWAY', 'trades', 'Carpentry'),
  ('wall-floor-tiling', 'wall-floor-tiling', 'TRADE_PATHWAY', 'trades', 'Wall & Floor Tiling'),
  ('electrical-trade', 'electrical-trade', 'TRADE_PATHWAY', 'trades', 'Electrical Trade'),
  ('plumbing', 'plumbing', 'TRADE_PATHWAY', 'trades', 'Plumbing'),
  ('welding', 'welding', 'TRADE_PATHWAY', 'trades', 'Welding & Fabrication'),
  ('automotive', 'automotive-technology', 'TRADE_PATHWAY', 'transport', 'Automotive Technology'),
  ('hospitality-management', 'hospitality-management', 'QUALIFICATION', 'hospitality', 'Hospitality Management'),
  ('architecture', 'architecture', 'STUDY_FIELD', 'design', 'Architecture'),
  ('design-media', 'design-media', 'STUDY_FIELD', 'design', 'Design & Media'),
  ('environmental-science', 'environmental-science', 'STUDY_FIELD', 'environment', 'Environmental Science'),
  ('agriculture', 'agriculture', 'STUDY_FIELD', 'environment', 'Agriculture & Agribusiness'),
  ('aviation', 'aviation', 'QUALIFICATION', 'transport', 'Aviation');

create index taxonomy_nodes_parent_idx on public.taxonomy_nodes (classification_id, parent_code);
create index concept_labels_search_idx on public.concept_labels (locale, normalized_label text_pattern_ops);
create index pathway_relations_lookup_idx on public.pathway_relations (concept_id, country_code, review_status);
create index concept_country_coverage_ready_idx on public.concept_country_coverage (concept_id, coverage, review_status);
create index course_offerings_lookup_idx on public.course_offerings (concept_id, country_code, registration_status, review_status);
create index decision_plans_user_updated_idx on public.decision_plans (user_id, updated_at desc);
create index decision_plan_versions_user_idx on public.decision_plan_versions (user_id, plan_id, version desc);
create index plan_save_intents_expiry_idx on public.plan_save_intents (expires_at) where consumed_at is null;
create index taxonomy_gaps_query_idx on public.taxonomy_gaps (query_hash, created_at desc);

alter table public.taxonomy_classifications enable row level security;
alter table public.canonical_concepts enable row level security;
alter table public.taxonomy_nodes enable row level security;
alter table public.concept_node_mappings enable row level security;
alter table public.concept_labels enable row level security;
alter table public.pathway_relations enable row level security;
alter table public.concept_country_coverage enable row level security;
alter table public.course_offerings enable row level security;
alter table public.course_offering_sources enable row level security;
alter table public.decision_plans enable row level security;
alter table public.decision_plan_versions enable row level security;
alter table public.plan_save_intents enable row level security;
alter table public.taxonomy_gaps enable row level security;

create policy decision_plans_select_own on public.decision_plans
  for select to authenticated
  using ((select auth.uid()) = user_id);
create policy decision_plans_insert_own on public.decision_plans
  for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy decision_plans_update_own on public.decision_plans
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
create policy decision_plans_delete_own on public.decision_plans
  for delete to authenticated
  using ((select auth.uid()) = user_id);

create policy decision_plan_versions_select_own on public.decision_plan_versions
  for select to authenticated
  using ((select auth.uid()) = user_id);
create policy decision_plan_versions_insert_own on public.decision_plan_versions
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

revoke all on table public.taxonomy_classifications from anon, authenticated;
revoke all on table public.canonical_concepts from anon, authenticated;
revoke all on table public.taxonomy_nodes from anon, authenticated;
revoke all on table public.concept_node_mappings from anon, authenticated;
revoke all on table public.concept_labels from anon, authenticated;
revoke all on table public.pathway_relations from anon, authenticated;
revoke all on table public.concept_country_coverage from anon, authenticated;
revoke all on table public.course_offerings from anon, authenticated;
revoke all on table public.course_offering_sources from anon, authenticated;
revoke all on table public.plan_save_intents from anon, authenticated;
revoke all on table public.taxonomy_gaps from anon, authenticated;

grant select, insert, update, delete on table public.decision_plans to authenticated;
grant select, insert on table public.decision_plan_versions to authenticated;
grant all on table public.taxonomy_classifications to service_role;
grant all on table public.canonical_concepts to service_role;
grant all on table public.taxonomy_nodes to service_role;
grant all on table public.concept_node_mappings to service_role;
grant all on table public.concept_labels to service_role;
grant all on table public.pathway_relations to service_role;
grant all on table public.concept_country_coverage to service_role;
grant all on table public.course_offerings to service_role;
grant all on table public.course_offering_sources to service_role;
grant all on table public.decision_plans to service_role;
grant all on table public.decision_plan_versions to service_role;
grant all on table public.plan_save_intents to service_role;
grant all on table public.taxonomy_gaps to service_role;
grant usage, select on all sequences in schema public to service_role;
