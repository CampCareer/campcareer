-- CampCareer Report Factory canonical expansion.
-- Creates missing shared schemas and reference data. No legacy rows are deleted here.

create schema if not exists ingest;
create schema if not exists taxonomy;

create table if not exists core.geographies (
  id uuid primary key default gen_random_uuid(),
  country_code text not null references core.countries(code),
  geography_type text not null check (geography_type in ('country','state','province','region','city','sa4','other')),
  code text,
  name text not null,
  region_code text,
  parent_id uuid references core.geographies(id) on delete set null,
  latitude numeric(9,6),
  longitude numeric(9,6),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists geographies_identity_uidx
  on core.geographies (
    country_code,
    geography_type,
    coalesce(code,''),
    lower(name),
    coalesce(region_code,'')
  );
create index if not exists geographies_parent_idx on core.geographies(parent_id);

alter table catalog.campuses
  add column if not exists geography_id uuid references core.geographies(id) on delete set null;
create index if not exists campuses_geography_idx on catalog.campuses(geography_id);

create table if not exists catalog.legacy_entity_map (
  legacy_schema text not null,
  legacy_table text not null,
  legacy_key text not null,
  entity_type text not null check (entity_type in ('institution','campus','programme','offering','geography','occupation')),
  entity_id uuid not null,
  metadata jsonb not null default '{}'::jsonb,
  migrated_at timestamptz not null default now(),
  primary key (legacy_schema, legacy_table, legacy_key, entity_type)
);
create index if not exists legacy_entity_map_entity_idx
  on catalog.legacy_entity_map(entity_type, entity_id);

create table if not exists taxonomy.study_concepts (
  id uuid primary key default gen_random_uuid(),
  concept_key text not null unique,
  slug text not null unique,
  concept_type text not null default 'study_field'
    check (concept_type in ('study_field','qualification','trade_pathway','career_cluster')),
  canonical_name text not null,
  name_ko text,
  description text,
  status text not null default 'active' check (status in ('active','inactive','review_required','retired')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists taxonomy.occupations (
  id uuid primary key default gen_random_uuid(),
  country_code text not null references core.countries(code),
  canonical_name text not null,
  name_ko text,
  status text not null default 'active' check (status in ('active','inactive','review_required','retired')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists occupations_country_name_idx
  on taxonomy.occupations(country_code, lower(canonical_name));

create table if not exists taxonomy.occupation_identifiers (
  id uuid primary key default gen_random_uuid(),
  occupation_id uuid not null references taxonomy.occupations(id) on delete cascade,
  identifier_system text not null,
  identifier_version text,
  identifier_value text not null,
  source_url text,
  valid_from date,
  valid_to date,
  created_at timestamptz not null default now()
);
create unique index if not exists occupation_identifiers_identity_uidx
  on taxonomy.occupation_identifiers(identifier_system, coalesce(identifier_version,''), identifier_value);
create index if not exists occupation_identifiers_occupation_idx
  on taxonomy.occupation_identifiers(occupation_id);

create table if not exists taxonomy.programme_concepts (
  programme_id uuid not null references catalog.programmes(id) on delete cascade,
  concept_id uuid not null references taxonomy.study_concepts(id) on delete cascade,
  relation_type text not null default 'primary' check (relation_type in ('primary','secondary','related')),
  confidence text not null default 'medium' check (confidence in ('high','medium','low')),
  created_at timestamptz not null default now(),
  primary key(programme_id, concept_id)
);

create table if not exists taxonomy.concept_occupations (
  concept_id uuid not null references taxonomy.study_concepts(id) on delete cascade,
  occupation_id uuid not null references taxonomy.occupations(id) on delete cascade,
  relation_type text not null default 'related' check (relation_type in ('primary','common','related','adjacent')),
  confidence text not null default 'medium' check (confidence in ('high','medium','low')),
  created_at timestamptz not null default now(),
  primary key(concept_id, occupation_id)
);

alter table core.geographies enable row level security;
alter table catalog.legacy_entity_map enable row level security;
alter table taxonomy.study_concepts enable row level security;
alter table taxonomy.occupations enable row level security;
alter table taxonomy.occupation_identifiers enable row level security;
alter table taxonomy.programme_concepts enable row level security;
alter table taxonomy.concept_occupations enable row level security;

grant usage on schema ingest, taxonomy to service_role;
grant all privileges on all tables in schema taxonomy to service_role;
grant all privileges on table core.geographies, catalog.legacy_entity_map to service_role;
grant usage, select on all sequences in schema ingest, taxonomy to service_role;
alter default privileges in schema ingest grant all on tables to service_role;
alter default privileges in schema taxonomy grant all on tables to service_role;
alter default privileges in schema ingest grant usage, select on sequences to service_role;
alter default privileges in schema taxonomy grant usage, select on sequences to service_role;

insert into core.currencies(code,name,minor_units) values
  ('AUD','Australian dollar',2),
  ('CAD','Canadian dollar',2),
  ('GBP','Pound sterling',2),
  ('EUR','Euro',2),
  ('USD','United States dollar',2)
on conflict (code) do update set name=excluded.name, minor_units=excluded.minor_units;

insert into core.countries(code,name,default_currency,active) values
  ('AU','Australia','AUD',true),
  ('CA','Canada','CAD',true),
  ('UK','United Kingdom','GBP',true),
  ('IE','Ireland','EUR',true),
  ('US','United States','USD',true),
  ('NL','Netherlands','EUR',true)
on conflict (code) do update set name=excluded.name, default_currency=excluded.default_currency, active=true, updated_at=now();

insert into core.qualification_frameworks(country_code,framework_code,name,version,source_url)
values
  ('AU','AQF','Australian Qualifications Framework','current','https://www.aqf.edu.au/'),
  ('IE','NFQ','National Framework of Qualifications','current','https://www.qqi.ie/what-we-do/the-qualifications-system/national-framework-of-qualifications'),
  ('UK','RQF','Regulated Qualifications Framework','current','https://www.gov.uk/what-different-qualification-levels-mean/list-of-qualification-levels')
on conflict (country_code,framework_code,version) do update
set name=excluded.name, source_url=excluded.source_url, updated_at=now();

insert into core.qualification_levels(framework_id,level_code,label,rank_order)
select f.id, v.level_code, v.label, v.rank_order
from core.qualification_frameworks f
join (values
  ('AQF','1','AQF Level 1',1),('AQF','2','AQF Level 2',2),('AQF','3','AQF Level 3',3),
  ('AQF','4','AQF Level 4',4),('AQF','5','AQF Level 5',5),('AQF','6','AQF Level 6',6),
  ('AQF','7','AQF Level 7',7),('AQF','8','AQF Level 8',8),('AQF','9','AQF Level 9',9),('AQF','10','AQF Level 10',10),
  ('NFQ','1','NFQ Level 1',1),('NFQ','2','NFQ Level 2',2),('NFQ','3','NFQ Level 3',3),
  ('NFQ','4','NFQ Level 4',4),('NFQ','5','NFQ Level 5',5),('NFQ','6','NFQ Level 6',6),
  ('NFQ','7','NFQ Level 7',7),('NFQ','8','NFQ Level 8',8),('NFQ','9','NFQ Level 9',9),('NFQ','10','NFQ Level 10',10),
  ('RQF','1','RQF Level 1',1),('RQF','2','RQF Level 2',2),('RQF','3','RQF Level 3',3),
  ('RQF','4','RQF Level 4',4),('RQF','5','RQF Level 5',5),('RQF','6','RQF Level 6',6),
  ('RQF','7','RQF Level 7',7),('RQF','8','RQF Level 8',8)
) as v(framework_code,level_code,label,rank_order)
  on v.framework_code=f.framework_code
on conflict (framework_id,level_code) do update
set label=excluded.label, rank_order=excluded.rank_order;