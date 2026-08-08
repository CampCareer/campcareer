-- Ireland education-organization relationship layer.
--
-- Institution rows represent learner-facing colleges/centres. Education and
-- Training Boards (ETBs) are administrative/statutory operators and should not
-- be introduced as duplicate learner-facing Institutions merely to express a
-- parent relationship. This migration therefore adds a separate organization
-- layer and links the first eight normalized FET centres with `operated_by`.
--
-- Sources:
-- CMETB Cavan / Monaghan centre pages:
--   https://www.cmetb.ie/cavan-institute/
--   https://www.cmetb.ie/monaghan-institute/
-- Cork ETB / Cork College of FET:
--   https://www.corketb.ie/further-education-training/
--   https://fet.corketb.ie/
-- LMETB PLC college directory:
--   https://www.lmetb.ie/further-education-training/post-leaving-certificate-colleges/

create table if not exists catalog.education_organizations(
  id uuid primary key default gen_random_uuid(),
  country_code text not null references core.countries(code),
  canonical_name text not null,
  slug text not null,
  organization_kind text not null,
  website_url text,
  status text not null default 'active',
  source_url text,
  source_checked_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint education_organizations_country_slug_key unique(country_code,slug),
  constraint education_organizations_slug_chk check(slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint education_organizations_kind_chk check(organization_kind in ('education_training_board','government_agency','awarding_body','other')),
  constraint education_organizations_status_chk check(status in ('active','inactive','unknown')),
  constraint education_organizations_website_https_chk check(website_url is null or website_url ~ '^https://'),
  constraint education_organizations_source_https_chk check(source_url is null or source_url ~ '^https://')
);

alter table catalog.education_organizations enable row level security;
revoke all on catalog.education_organizations from public,anon,authenticated;
grant select on catalog.education_organizations to service_role;

create table if not exists catalog.institution_organization_relationships(
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references catalog.institutions(id) on delete cascade,
  organization_id uuid not null references catalog.education_organizations(id) on delete cascade,
  relationship_type text not null,
  status text not null default 'active',
  source_url text not null,
  source_checked_at timestamptz,
  valid_from date,
  valid_to date,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint institution_org_relationship_key unique(institution_id,organization_id,relationship_type),
  constraint institution_org_relationship_type_chk check(relationship_type in ('operated_by','affiliated_with','member_of')),
  constraint institution_org_relationship_status_chk check(status in ('active','inactive','unknown')),
  constraint institution_org_relationship_source_https_chk check(source_url ~ '^https://'),
  constraint institution_org_relationship_dates_chk check(valid_to is null or valid_from is null or valid_to>=valid_from)
);

alter table catalog.institution_organization_relationships enable row level security;
revoke all on catalog.institution_organization_relationships from public,anon,authenticated;
grant select on catalog.institution_organization_relationships to service_role;

insert into catalog.education_organizations(
  country_code,canonical_name,slug,organization_kind,website_url,status,
  source_url,source_checked_at,metadata,updated_at
) values
  (
    'IE','Cavan and Monaghan Education and Training Board','cavan-and-monaghan-etb',
    'education_training_board','https://www.cmetb.ie/','active',
    'https://www.cmetb.ie/cavan-institute/',now(),
    jsonb_build_object('abbreviation','CMETB','normalization_batch','ie_etb_relationships_v1'),now()
  ),
  (
    'IE','Cork Education and Training Board','cork-etb',
    'education_training_board','https://www.corketb.ie/','active',
    'https://www.corketb.ie/further-education-training/',now(),
    jsonb_build_object('abbreviation','Cork ETB','normalization_batch','ie_etb_relationships_v1'),now()
  ),
  (
    'IE','Louth and Meath Education and Training Board','louth-and-meath-etb',
    'education_training_board','https://www.lmetb.ie/','active',
    'https://www.lmetb.ie/further-education-training/post-leaving-certificate-colleges/',now(),
    jsonb_build_object('abbreviation','LMETB','normalization_batch','ie_etb_relationships_v1'),now()
  )
on conflict(country_code,slug)
do update set
  canonical_name=excluded.canonical_name,
  organization_kind=excluded.organization_kind,
  website_url=excluded.website_url,
  status=excluded.status,
  source_url=excluded.source_url,
  source_checked_at=excluded.source_checked_at,
  metadata=catalog.education_organizations.metadata||excluded.metadata,
  updated_at=now();

create temp table ie_etb_centre_relationships(
  institution_slug text primary key,
  organization_slug text not null,
  source_url text not null
) on commit drop;

insert into ie_etb_centre_relationships values
  ('cavan-institute','cavan-and-monaghan-etb','https://www.cmetb.ie/cavan-institute/'),
  ('monaghan-institute','cavan-and-monaghan-etb','https://www.cmetb.ie/monaghan-institute/'),
  ('cork-college-of-fet-morrison-s-island','cork-etb','https://fet.corketb.ie/'),
  ('cork-college-of-fet-douglas-street','cork-etb','https://fet.corketb.ie/'),
  ('cork-college-of-fet-mallow','cork-etb','https://fet.corketb.ie/'),
  ('drogheda-institute-of-further-education','louth-and-meath-etb','https://www.lmetb.ie/further-education-training/post-leaving-certificate-colleges/'),
  ('dunboyne-college-of-further-education','louth-and-meath-etb','https://www.lmetb.ie/further-education-training/post-leaving-certificate-colleges/'),
  ('fiaich-institute-of-fet','louth-and-meath-etb','https://www.lmetb.ie/further-education-training/post-leaving-certificate-colleges/');

-- A relationship must never silently disappear because a centre slug changed.
do $$
declare
  missing_institution_count integer;
  missing_organization_count integer;
begin
  select count(*) into missing_institution_count
  from ie_etb_centre_relationships r
  left join catalog.institutions i
    on i.country_code='IE' and i.slug=r.institution_slug and i.status<>'inactive'
  where i.id is null;

  if missing_institution_count>0 then
    raise exception 'Missing % expected Irish FET centre institutions for ETB relationships',missing_institution_count;
  end if;

  select count(*) into missing_organization_count
  from ie_etb_centre_relationships r
  left join catalog.education_organizations o
    on o.country_code='IE' and o.slug=r.organization_slug and o.status='active'
  where o.id is null;

  if missing_organization_count>0 then
    raise exception 'Missing % expected Irish ETB organizations',missing_organization_count;
  end if;
end $$;

insert into catalog.institution_organization_relationships(
  institution_id,organization_id,relationship_type,status,
  source_url,source_checked_at,metadata,updated_at
)
select
  i.id,o.id,'operated_by','active',
  r.source_url,now(),
  jsonb_build_object('normalization_batch','ie_etb_relationships_v1','source_kind','official_etb_directory'),
  now()
from ie_etb_centre_relationships r
join catalog.institutions i
  on i.country_code='IE' and i.slug=r.institution_slug and i.status<>'inactive'
join catalog.education_organizations o
  on o.country_code='IE' and o.slug=r.organization_slug and o.status='active'
on conflict(institution_id,organization_id,relationship_type)
do update set
  status=excluded.status,
  source_url=excluded.source_url,
  source_checked_at=excluded.source_checked_at,
  metadata=catalog.institution_organization_relationships.metadata||excluded.metadata,
  updated_at=now();

create or replace view public.institution_operator_ie_v1
with (security_invoker=true) as
select
  i.id as institution_id,
  i.slug as institution_slug,
  i.canonical_name as institution_name,
  o.id as organization_id,
  o.slug as organization_slug,
  o.canonical_name as organization_name,
  o.organization_kind,
  o.website_url as organization_website_url,
  r.relationship_type,
  r.source_url as relationship_source_url,
  r.source_checked_at
from catalog.institution_organization_relationships r
join catalog.institutions i
  on i.id=r.institution_id
 and i.country_code='IE'
 and i.status<>'inactive'
join catalog.education_organizations o
  on o.id=r.organization_id
 and o.country_code='IE'
 and o.status='active'
where r.status='active';

comment on view public.institution_operator_ie_v1 is
  'Service-role Ireland Institution operator relationship view. FET centres remain learner-facing Institutions while statutory ETBs are modeled as education organizations.';

revoke all on public.institution_operator_ie_v1 from public,anon,authenticated;
grant select on public.institution_operator_ie_v1 to service_role;

do $$
declare
  org_count integer;
  relationship_count integer;
  centre_count integer;
  invalid_cardinality_count integer;
  bad_source_count integer;
  active_program_count integer;
  anon_can_select boolean;
  authenticated_can_select boolean;
  service_can_select boolean;
begin
  select count(*) into org_count
  from catalog.education_organizations
  where country_code='IE'
    and metadata->>'normalization_batch'='ie_etb_relationships_v1'
    and status='active';
  if org_count<>3 then
    raise exception 'Expected 3 Irish ETB organizations in v1, found %',org_count;
  end if;

  select count(*),count(distinct institution_id)
  into relationship_count,centre_count
  from public.institution_operator_ie_v1
  where relationship_type='operated_by';
  if relationship_count<>8 or centre_count<>8 then
    raise exception 'Expected 8 operated_by relationships across 8 FET centres; relationships %, centres %',relationship_count,centre_count;
  end if;

  select count(*) into invalid_cardinality_count
  from (
    select institution_id,count(*) as n
    from public.institution_operator_ie_v1
    where relationship_type='operated_by'
    group by institution_id
    having count(*)<>1
  ) x;
  if invalid_cardinality_count>0 then
    raise exception 'Found % Irish FET centres without exactly one active operator',invalid_cardinality_count;
  end if;

  select count(*) into bad_source_count
  from public.institution_operator_ie_v1
  where organization_website_url !~ '^https://'
     or relationship_source_url !~ '^https://';
  if bad_source_count>0 then
    raise exception 'Found % Irish operator relationships without HTTPS provenance',bad_source_count;
  end if;

  select count(*) into active_program_count
  from catalog.programmes p
  join catalog.institutions i on i.id=p.institution_id
  where i.country_code='IE' and p.status='active';
  if active_program_count<>2876 then
    raise exception 'Expected 2876 active Irish programmes after ETB relationship modeling, found %',active_program_count;
  end if;

  select has_table_privilege('anon','public.institution_operator_ie_v1','select'),
         has_table_privilege('authenticated','public.institution_operator_ie_v1','select'),
         has_table_privilege('service_role','public.institution_operator_ie_v1','select')
  into anon_can_select,authenticated_can_select,service_can_select;

  if anon_can_select or authenticated_can_select or not service_can_select then
    raise exception 'Unexpected Ireland operator view privileges: anon %, authenticated %, service_role %',anon_can_select,authenticated_can_select,service_can_select;
  end if;
end $$;
