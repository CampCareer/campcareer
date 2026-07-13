-- CampCareer career × country publication model.
--
-- This migration intentionally does not backfill legacy score data. A row is
-- publishable only when it has a current official source row, an approved
-- release version, and an exact career crosswalk. The application serves
-- published data through server APIs; raw tables remain inaccessible to anon
-- and authenticated PostgREST roles.

create table public.data_versions (
  id uuid primary key default gen_random_uuid(),
  version text not null unique,
  status text not null check (status in ('DRAFT', 'REVIEW_REQUIRED', 'PUBLISHED', 'ROLLED_BACK')),
  released_at timestamptz,
  supersedes_id uuid references public.data_versions(id),
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);

create table public.source_snapshots (
  id uuid primary key default gen_random_uuid(),
  country_code text not null check (country_code ~ '^[A-Z]{2}$'),
  source_name text not null,
  source_url text not null check (source_url ~ '^https://'),
  dataset_url text not null check (dataset_url ~ '^https://'),
  content_hash text not null check (content_hash !~* 'placeholder'),
  retrieved_at timestamptz not null,
  source_as_of date,
  reviewed_at timestamptz,
  review_status text not null check (review_status in ('APPROVED', 'STALE', 'REVIEW_REQUIRED')),
  data_version_id uuid references public.data_versions(id),
  created_at timestamptz not null default now(),
  unique (country_code, dataset_url, content_hash)
);

create table public.source_rows (
  id uuid primary key default gen_random_uuid(),
  source_snapshot_id uuid not null references public.source_snapshots(id) on delete cascade,
  original_row_id text not null,
  original_label text,
  payload jsonb not null check (jsonb_typeof(payload) = 'object'),
  created_at timestamptz not null default now(),
  unique (source_snapshot_id, original_row_id)
);

create table public.canonical_careers (
  id text primary key,
  career_category text not null check (career_category in (
    'trades', 'health', 'technology', 'engineering', 'business', 'education',
    'environment', 'design', 'hospitality', 'transport'
  )),
  label text not null,
  label_ko text not null,
  status text not null default 'ACTIVE' check (status in ('ACTIVE', 'RETIRED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.country_occupation_codes (
  id uuid primary key default gen_random_uuid(),
  country_code text not null check (country_code ~ '^[A-Z]{2}$'),
  classification_name text not null,
  classification_version text not null,
  official_code text not null,
  official_label text not null,
  source_row_id uuid not null references public.source_rows(id),
  effective_from date,
  effective_to date,
  review_status text not null check (review_status in ('APPROVED', 'STALE', 'REVIEW_REQUIRED')),
  reviewed_at timestamptz,
  unique (country_code, classification_name, classification_version, official_code)
);

create table public.career_country_crosswalks (
  id uuid primary key default gen_random_uuid(),
  canonical_career_id text not null references public.canonical_careers(id),
  country_occupation_code_id uuid not null references public.country_occupation_codes(id) on delete cascade,
  relation text not null check (relation in ('exact', 'broader', 'narrower', 'related')),
  source_row_id uuid not null references public.source_rows(id),
  review_status text not null check (review_status in ('APPROVED', 'STALE', 'REVIEW_REQUIRED')),
  reviewed_at timestamptz,
  unique (canonical_career_id, country_occupation_code_id)
);

create table public.compensation_observations (
  id uuid primary key default gen_random_uuid(),
  canonical_career_id text not null references public.canonical_careers(id),
  country_code text not null check (country_code ~ '^[A-Z]{2}$'),
  region_code text,
  city_code text,
  employment_basis text not null check (employment_basis in ('FULL_TIME_EMPLOYEE', 'ALL_EMPLOYEES')),
  statistic text not null check (statistic in ('MEDIAN', 'MEAN', 'PERCENTILE_25', 'PERCENTILE_75')),
  annual_gross_amount numeric(14,2) not null check (annual_gross_amount > 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  source_row_id uuid not null references public.source_rows(id),
  source_as_of date not null,
  reviewed_at timestamptz,
  review_status text not null check (review_status in ('APPROVED', 'STALE', 'REVIEW_REQUIRED')),
  data_version_id uuid references public.data_versions(id)
);

create table public.shortage_observations (
  id uuid primary key default gen_random_uuid(),
  canonical_career_id text not null references public.canonical_careers(id),
  country_code text not null check (country_code ~ '^[A-Z]{2}$'),
  region_code text,
  indicator_name text not null,
  indicator_value text not null,
  source_row_id uuid not null references public.source_rows(id),
  source_as_of date not null,
  reviewed_at timestamptz,
  review_status text not null check (review_status in ('APPROVED', 'STALE', 'REVIEW_REQUIRED')),
  data_version_id uuid references public.data_versions(id)
);

create table public.housing_observations (
  id uuid primary key default gen_random_uuid(),
  country_code text not null check (country_code ~ '^[A-Z]{2}$'),
  region_code text,
  city_code text,
  housing_type text not null check (housing_type in ('SHARED_STUDENT', 'ONE_BEDROOM_CITY_CENTRE', 'ONE_BEDROOM_OUTSIDE_CENTRE')),
  monthly_amount numeric(14,2) not null check (monthly_amount > 0),
  currency text not null check (currency ~ '^[A-Z]{3}$'),
  source_row_id uuid not null references public.source_rows(id),
  source_as_of date not null,
  reviewed_at timestamptz,
  review_status text not null check (review_status in ('APPROVED', 'STALE', 'REVIEW_REQUIRED')),
  data_version_id uuid references public.data_versions(id)
);

create table public.geo_regions (
  id uuid primary key default gen_random_uuid(),
  country_code text not null check (country_code ~ '^[A-Z]{2}$'),
  region_code text not null,
  name text not null,
  boundary_geojson jsonb,
  source_row_id uuid not null references public.source_rows(id),
  review_status text not null check (review_status in ('APPROVED', 'STALE', 'REVIEW_REQUIRED')),
  unique (country_code, region_code)
);

create table public.cities (
  id uuid primary key default gen_random_uuid(),
  country_code text not null check (country_code ~ '^[A-Z]{2}$'),
  city_code text not null,
  region_code text,
  name text not null,
  latitude numeric(9,6),
  longitude numeric(9,6),
  source_row_id uuid not null references public.source_rows(id),
  review_status text not null check (review_status in ('APPROVED', 'STALE', 'REVIEW_REQUIRED')),
  unique (country_code, city_code),
  foreign key (country_code, region_code) references public.geo_regions(country_code, region_code)
);

create table public.institutions (
  id uuid primary key default gen_random_uuid(),
  country_code text not null check (country_code ~ '^[A-Z]{2}$'),
  institution_code text not null,
  region_code text,
  city_code text,
  name text not null,
  official_url text not null check (official_url ~ '^https://'),
  registry_url text not null check (registry_url ~ '^https://'),
  source_row_id uuid not null references public.source_rows(id),
  review_status text not null check (review_status in ('APPROVED', 'STALE', 'REVIEW_REQUIRED')),
  unique (country_code, institution_code),
  foreign key (country_code, region_code) references public.geo_regions(country_code, region_code),
  foreign key (country_code, city_code) references public.cities(country_code, city_code)
);

create index country_occupation_codes_lookup_idx on public.country_occupation_codes (country_code, classification_name, official_code, review_status);
create index career_country_crosswalks_publish_idx on public.career_country_crosswalks (canonical_career_id, relation, review_status);
create index compensation_observations_publish_idx on public.compensation_observations (canonical_career_id, country_code, review_status, source_as_of desc);
create index shortage_observations_publish_idx on public.shortage_observations (canonical_career_id, country_code, review_status, source_as_of desc);
create index housing_observations_publish_idx on public.housing_observations (country_code, city_code, review_status, source_as_of desc);

alter table public.data_versions enable row level security;
alter table public.source_snapshots enable row level security;
alter table public.source_rows enable row level security;
alter table public.canonical_careers enable row level security;
alter table public.country_occupation_codes enable row level security;
alter table public.career_country_crosswalks enable row level security;
alter table public.compensation_observations enable row level security;
alter table public.shortage_observations enable row level security;
alter table public.housing_observations enable row level security;
alter table public.geo_regions enable row level security;
alter table public.cities enable row level security;
alter table public.institutions enable row level security;

revoke all on table public.data_versions, public.source_snapshots, public.source_rows,
  public.canonical_careers, public.country_occupation_codes, public.career_country_crosswalks,
  public.compensation_observations, public.shortage_observations, public.housing_observations,
  public.geo_regions, public.cities, public.institutions from anon, authenticated;

grant all on table public.data_versions, public.source_snapshots, public.source_rows,
  public.canonical_careers, public.country_occupation_codes, public.career_country_crosswalks,
  public.compensation_observations, public.shortage_observations, public.housing_observations,
  public.geo_regions, public.cities, public.institutions to service_role;
