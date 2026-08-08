-- CampCareer city / region / campus model v1
-- Additive only: no existing geography, campus, institution or programme row is rewritten.

alter table core.geographies
  add column if not exists slug text,
  add column if not exists canonical_geography_id uuid,
  add column if not exists scope_kind text,
  add column if not exists status text not null default 'active';

alter table core.geographies
  drop constraint if exists geographies_geography_type_check;

alter table core.geographies
  add constraint geographies_geography_type_check
  check (geography_type = any (array[
    'country'::text,
    'state'::text,
    'province'::text,
    'region'::text,
    'city'::text,
    'locality'::text,
    'sa4'::text,
    'other'::text
  ]));

alter table core.geographies
  drop constraint if exists geographies_status_check;

alter table core.geographies
  add constraint geographies_status_check
  check (status = any (array['active'::text, 'deprecated'::text, 'unknown'::text]));

alter table core.geographies
  drop constraint if exists geographies_slug_check;

alter table core.geographies
  add constraint geographies_slug_check
  check (slug is null or slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$');

alter table core.geographies
  drop constraint if exists geographies_canonical_not_self_check;

alter table core.geographies
  add constraint geographies_canonical_not_self_check
  check (canonical_geography_id is null or canonical_geography_id <> id);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'core.geographies'::regclass
      and conname = 'geographies_canonical_geography_id_fkey'
  ) then
    alter table core.geographies
      add constraint geographies_canonical_geography_id_fkey
      foreign key (canonical_geography_id)
      references core.geographies(id)
      on delete set null;
  end if;
end $$;

create index if not exists geographies_canonical_idx
  on core.geographies (canonical_geography_id);

create unique index if not exists geographies_canonical_slug_uidx
  on core.geographies (country_code, geography_type, lower(slug))
  where canonical_geography_id is null and slug is not null;

comment on column core.geographies.slug is
  'Stable URL slug for a canonical geography. Country is carried separately in routes, e.g. AU + sydney.';
comment on column core.geographies.canonical_geography_id is
  'When populated, this row is a legacy/duplicate geography that resolves to the referenced canonical geography. Null means the row is canonical.';
comment on column core.geographies.scope_kind is
  'Semantic scope such as administrative, metro, statistical_urban_area, locality or source_specific. Kept flexible because countries define cities differently.';
comment on column core.geographies.status is
  'Lifecycle state for the geography identity. Deprecated rows remain addressable for stable IDs and redirects.';

create table if not exists core.geography_aliases (
  id uuid primary key default gen_random_uuid(),
  geography_id uuid not null references core.geographies(id) on delete cascade,
  country_code text not null references core.countries(code),
  alias text not null,
  alias_normalized text not null,
  region_code text,
  alias_type text not null default 'source',
  source_system text,
  source_url text,
  created_at timestamptz not null default now(),
  constraint geography_aliases_alias_type_check
    check (alias_type = any (array[
      'canonical_name'::text,
      'slug'::text,
      'abbreviation'::text,
      'source'::text,
      'legacy'::text,
      'locality'::text,
      'other'::text
    ])),
  constraint geography_aliases_nonempty_check
    check (length(btrim(alias)) > 0 and length(btrim(alias_normalized)) > 0)
);

create index if not exists geography_aliases_lookup_idx
  on core.geography_aliases (country_code, alias_normalized, coalesce(region_code, ''));

create unique index if not exists geography_aliases_identity_uidx
  on core.geography_aliases (
    geography_id,
    alias_type,
    alias_normalized,
    coalesce(source_system, '')
  );

comment on table core.geography_aliases is
  'Maps raw, legacy and source-specific place labels to a permanent canonical geography ID. Used by crawlers and normalization jobs rather than display logic.';

alter table catalog.campuses
  add column if not exists locality text,
  add column if not exists locality_geography_id uuid,
  add column if not exists address_line text,
  add column if not exists postal_code text,
  add column if not exists official_url text,
  add column if not exists source_url text,
  add column if not exists source_checked_at timestamptz,
  add column if not exists metadata jsonb not null default '{}'::jsonb;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'catalog.campuses'::regclass
      and conname = 'campuses_locality_geography_id_fkey'
  ) then
    alter table catalog.campuses
      add constraint campuses_locality_geography_id_fkey
      foreign key (locality_geography_id)
      references core.geographies(id)
      on delete set null;
  end if;
end $$;

create index if not exists campuses_locality_geography_idx
  on catalog.campuses (locality_geography_id);

comment on column catalog.campuses.geography_id is
  'Canonical city/metro geography used for programme search, compare and city aggregation. Legacy city text is retained during migration.';
comment on column catalog.campuses.locality is
  'Human-readable campus suburb/locality, distinct from the wider student-market city/metro.';
comment on column catalog.campuses.locality_geography_id is
  'Optional normalized locality/suburb geography below the campus city/metro.';
comment on column catalog.campuses.metadata is
  'Source-specific campus attributes that do not belong in canonical columns.';

create table if not exists catalog.campus_identifiers (
  id uuid primary key default gen_random_uuid(),
  campus_id uuid not null references catalog.campuses(id) on delete cascade,
  identifier_system text not null,
  identifier_value text not null,
  source_url text,
  valid_from date,
  valid_to date,
  created_at timestamptz not null default now(),
  constraint campus_identifiers_nonempty_check
    check (length(btrim(identifier_system)) > 0 and length(btrim(identifier_value)) > 0),
  constraint campus_identifiers_validity_check
    check (valid_to is null or valid_from is null or valid_to >= valid_from)
);

create unique index if not exists campus_identifiers_system_value_uidx
  on catalog.campus_identifiers (identifier_system, identifier_value);

create index if not exists campus_identifiers_campus_idx
  on catalog.campus_identifiers (campus_id);

comment on table catalog.campus_identifiers is
  'External campus identifiers (for example CRICOS/provider source IDs) used to reconcile crawled or official campus records with one permanent campus ID.';

comment on table catalog.programme_offerings is
  'Programme-to-campus offering layer. Multiple rows allow one programme to be delivered at multiple campuses without duplicating the programme identity.';