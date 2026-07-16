-- Official Jobs and Skills Australia (JSA) labour-market datasets.
-- ANZSCO v1.3 fields deliberately remain separate from OSCA identifiers in
-- occupations_au; join via occupations_au.anzsco_v13 and label grouped data
-- as ANZSCO unit-group data in the product.

create table if not exists public.occupation_profiles_au (
  anzsco_v13 text primary key,
  employment_total integer,
  part_time_share_pct numeric(5,2),
  female_share_pct numeric(5,2),
  median_age numeric(5,1),
  full_time_share_pct numeric(5,2),
  average_full_time_hours numeric(5,1),
  state_distribution jsonb not null default '[]'::jsonb,
  education_distribution jsonb not null default '[]'::jsonb,
  industries jsonb not null default '[]'::jsonb,
  data_as_at date,
  source_name text not null default 'Jobs and Skills Australia Occupation Profiles',
  source_url text not null,
  retrieved_at timestamptz not null default now()
);

create table if not exists public.occupation_pathways_au (
  anzsco_v13 text not null,
  qualification_code text not null,
  qualification_title text not null,
  pathway_type text not null check (pathway_type in ('occupation_ready', 'specialised_training', 'progression_pathway', 'pre_vocational', 'transferable')),
  licensing_required boolean not null default false,
  licensing_may_be_required boolean not null default false,
  restrictions jsonb not null default '[]'::jsonb,
  source_name text not null default 'Jobs and Skills Australia Training Occupation Pathways',
  source_url text not null,
  data_as_at date,
  retrieved_at timestamptz not null default now(),
  primary key (anzsco_v13, qualification_code)
);

create table if not exists public.occupation_shortage_drivers_au (
  anzsco_unit_group text primary key,
  shortage_driver text not null check (shortage_driver in ('long_training_gap', 'short_training_gap', 'suitability_gap', 'retention_gap', 'uncertain')),
  source_name text not null default 'Jobs and Skills Australia Occupation Shortage Drivers',
  source_url text not null,
  data_year smallint not null,
  retrieved_at timestamptz not null default now()
);

create table if not exists public.occupation_vacancies_au (
  anzsco_unit_group text not null,
  state text not null,
  period date not null,
  series text not null check (series in ('original', 'seasonally_adjusted', 'trend')),
  vacancy_count numeric,
  index_value numeric,
  source_name text not null default 'Jobs and Skills Australia Internet Vacancy Index',
  source_url text not null,
  retrieved_at timestamptz not null default now(),
  primary key (anzsco_unit_group, state, period, series)
);

create table if not exists public.occupation_outlook_au (
  anzsco_unit_group text not null,
  geography text not null default 'AU',
  period_start date not null,
  period_end date not null,
  employment_start integer,
  employment_end integer,
  employment_change integer,
  employment_change_pct numeric(7,2),
  source_name text not null default 'Jobs and Skills Australia Employment Projections',
  source_url text not null,
  retrieved_at timestamptz not null default now(),
  primary key (anzsco_unit_group, geography, period_start, period_end)
);

create table if not exists public.occupation_regional_employment_au (
  anzsco_unit_group text not null,
  sa4_code text not null,
  period date not null,
  employment_total integer,
  annual_change integer,
  annual_change_pct numeric(7,2),
  five_year_change integer,
  five_year_change_pct numeric(7,2),
  source_name text not null default 'Jobs and Skills Australia NERO',
  source_url text not null,
  retrieved_at timestamptz not null default now(),
  primary key (anzsco_unit_group, sa4_code, period)
);

create index if not exists occupation_pathways_au_anzsco_idx on public.occupation_pathways_au (anzsco_v13);
create index if not exists occupation_vacancies_au_lookup_idx on public.occupation_vacancies_au (anzsco_unit_group, state, period desc);
create index if not exists occupation_outlook_au_lookup_idx on public.occupation_outlook_au (anzsco_unit_group, geography, period_end);
create index if not exists occupation_regional_employment_au_lookup_idx on public.occupation_regional_employment_au (anzsco_unit_group, period desc);

alter table public.occupation_profiles_au enable row level security;
alter table public.occupation_pathways_au enable row level security;
alter table public.occupation_shortage_drivers_au enable row level security;
alter table public.occupation_vacancies_au enable row level security;
alter table public.occupation_outlook_au enable row level security;
alter table public.occupation_regional_employment_au enable row level security;

grant select on table public.occupation_profiles_au, public.occupation_pathways_au,
  public.occupation_shortage_drivers_au, public.occupation_vacancies_au,
  public.occupation_outlook_au, public.occupation_regional_employment_au
  to anon, authenticated;
grant all privileges on table public.occupation_profiles_au, public.occupation_pathways_au,
  public.occupation_shortage_drivers_au, public.occupation_vacancies_au,
  public.occupation_outlook_au, public.occupation_regional_employment_au
  to service_role;

create policy "Public can read AU occupation profiles" on public.occupation_profiles_au for select to anon, authenticated using (true);
create policy "Public can read AU occupation pathways" on public.occupation_pathways_au for select to anon, authenticated using (true);
create policy "Public can read AU occupation shortage drivers" on public.occupation_shortage_drivers_au for select to anon, authenticated using (true);
create policy "Public can read AU occupation vacancies" on public.occupation_vacancies_au for select to anon, authenticated using (true);
create policy "Public can read AU occupation outlook" on public.occupation_outlook_au for select to anon, authenticated using (true);
create policy "Public can read AU regional occupation employment" on public.occupation_regional_employment_au for select to anon, authenticated using (true);
