-- CampCareer Australia Nursing v1 baseline schema extension.
-- Adds first-class source-register, pathway, scenario, release-programme and release-claim controls.

create table if not exists evidence.source_register_records (
  record_id text primary key,
  report_key text not null,
  metric_observation_id uuid not null unique references evidence.metric_observations(id) on delete restrict,
  source_snapshot_id uuid not null references evidence.source_snapshots(id) on delete restrict,
  verification_status text,
  use_status text,
  source_quality_grade text,
  archived_copy text,
  full_record jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists source_register_metric_observation_uidx
  on evidence.metric_observations(scope_id,source_snapshot_id,metric_key)
  where scope_type='source_register_record';

create table if not exists reporting.analysis_pathways (
  id uuid primary key default gen_random_uuid(),
  analysis_run_id uuid not null references reporting.analysis_runs(id) on delete cascade,
  pathway_key text not null,
  name text not null,
  occupation text,
  qualification_type text,
  display_order smallint,
  result_status text,
  ranking_eligible boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (analysis_run_id, pathway_key)
);

create table if not exists reporting.analysis_scenarios (
  id uuid primary key default gen_random_uuid(),
  analysis_run_id uuid not null references reporting.analysis_runs(id) on delete cascade,
  pathway_id uuid not null references reporting.analysis_pathways(id) on delete cascade,
  scenario_key text not null,
  scenario_name text not null,
  display_order smallint,
  status text not null default 'controlled',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  unique (analysis_run_id, scenario_key)
);

create table if not exists reporting.report_programmes (
  report_release_id uuid not null references reporting.report_releases(id) on delete cascade,
  programme_id uuid not null references catalog.programmes(id) on delete restrict,
  offering_id uuid references catalog.programme_offerings(id) on delete set null,
  sample_key text not null,
  pathway_key text not null,
  display_order smallint not null,
  role text not null default 'sample',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  primary key (report_release_id, sample_key)
);

create table if not exists reporting.release_claims (
  report_release_id uuid not null references reporting.report_releases(id) on delete cascade,
  claim_id uuid not null references evidence.claims(id) on delete restrict,
  publication_role text not null default 'supporting'
    check (publication_role in ('included','supporting','limitation','excluded')),
  created_at timestamptz not null default now(),
  primary key (report_release_id, claim_id)
);

alter table evidence.source_register_records enable row level security;
alter table reporting.analysis_pathways enable row level security;
alter table reporting.analysis_scenarios enable row level security;
alter table reporting.report_programmes enable row level security;
alter table reporting.release_claims enable row level security;

grant all privileges on evidence.source_register_records to service_role;
grant all privileges on reporting.analysis_pathways, reporting.analysis_scenarios,
  reporting.report_programmes, reporting.release_claims to service_role;

revoke all on evidence.source_register_records from anon, authenticated;
revoke all on reporting.analysis_pathways, reporting.analysis_scenarios,
  reporting.report_programmes, reporting.release_claims from anon, authenticated;

-- Add the two TAFE sample providers/courses absent from the legacy university catalogue.
insert into catalog.institutions(country_code,canonical_name,institution_type,website_url,status)
values
  ('AU','TAFE NSW','TAFE','https://www.tafensw.edu.au/international','active'),
  ('AU','TAFE SA','TAFE','https://www.tafesa.edu.au/international','active')
on conflict do nothing;

insert into catalog.institution_identifiers(institution_id,identifier_system,identifier_value,source_url)
select id,'AU_PROVIDER_SLUG','tafe-nsw','https://www.tafensw.edu.au/international'
from catalog.institutions where country_code='AU' and canonical_name='TAFE NSW'
on conflict (identifier_system,identifier_value) do update set institution_id=excluded.institution_id,source_url=excluded.source_url;

insert into catalog.institution_identifiers(institution_id,identifier_system,identifier_value,source_url)
select id,'AU_PROVIDER_SLUG','tafe-sa','https://www.tafesa.edu.au/international'
from catalog.institutions where country_code='AU' and canonical_name='TAFE SA'
on conflict (identifier_system,identifier_value) do update set institution_id=excluded.institution_id,source_url=excluded.source_url;

insert into catalog.campuses(institution_id,name,city,region,country_code,status)
select id,'Randwick Campus','Sydney','NSW','AU','active'
from catalog.institutions where country_code='AU' and canonical_name='TAFE NSW'
on conflict do nothing;

insert into catalog.campuses(institution_id,name,city,region,country_code,status)
select id,'Adelaide listed campus','Adelaide','SA','AU','active'
from catalog.institutions where country_code='AU' and canonical_name='TAFE SA'
on conflict do nothing;

insert into catalog.programmes(institution_id,canonical_title,programme_type,field_code,field_name,default_duration_months,status)
select id,'Diploma of Nursing HLT54121','Diploma','nursing','Nursing',18,'active'
from catalog.institutions where country_code='AU' and canonical_name='TAFE NSW'
and not exists (
  select 1 from catalog.programmes p where p.institution_id=catalog.institutions.id and p.canonical_title='Diploma of Nursing HLT54121'
);

insert into catalog.programmes(institution_id,canonical_title,programme_type,field_code,field_name,default_duration_months,status)
select id,'Diploma of Nursing HLT54121','Diploma','nursing','Nursing',21,'active'
from catalog.institutions where country_code='AU' and canonical_name='TAFE SA'
and not exists (
  select 1 from catalog.programmes p where p.institution_id=catalog.institutions.id and p.canonical_title='Diploma of Nursing HLT54121'
);

insert into catalog.programme_identifiers(programme_id,identifier_system,identifier_value,source_url)
select p.id,'CRICOS_COURSE_CODE','110160B','https://www.tafensw.edu.au/international/courses/Diploma-of-Nursing--HLT54121'
from catalog.programmes p join catalog.institutions i on i.id=p.institution_id
where i.canonical_name='TAFE NSW' and p.canonical_title='Diploma of Nursing HLT54121'
on conflict (identifier_system,identifier_value) do update set programme_id=excluded.programme_id,source_url=excluded.source_url;

insert into catalog.programme_identifiers(programme_id,identifier_system,identifier_value,source_url)
select p.id,'CRICOS_COURSE_CODE','111783G','https://www.tafesa.edu.au/international/international-courses/international-courses-list'
from catalog.programmes p join catalog.institutions i on i.id=p.institution_id
where i.canonical_name='TAFE SA' and p.canonical_title='Diploma of Nursing HLT54121'
on conflict (identifier_system,identifier_value) do update set programme_id=excluded.programme_id,source_url=excluded.source_url;

insert into catalog.programme_offerings(programme_id,campus_id,market,intake_label,duration_months,enrolment_status,source_url,valid_from)
select p.id,c.id,'international','2026 controlled baseline',18,'unknown',
       'https://www.tafensw.edu.au/international/courses/Diploma-of-Nursing--HLT54121','2026-01-01'
from catalog.programmes p
join catalog.institutions i on i.id=p.institution_id and i.canonical_name='TAFE NSW'
left join catalog.campuses c on c.institution_id=i.id and c.name='Randwick Campus'
where p.canonical_title='Diploma of Nursing HLT54121'
and not exists (select 1 from catalog.programme_offerings o where o.programme_id=p.id);

insert into catalog.programme_offerings(programme_id,campus_id,market,intake_label,duration_months,enrolment_status,source_url,valid_from)
select p.id,c.id,'international','2026 controlled baseline',21,'unknown',
       'https://www.tafesa.edu.au/international/international-courses/international-courses-list','2026-01-01'
from catalog.programmes p
join catalog.institutions i on i.id=p.institution_id and i.canonical_name='TAFE SA'
left join catalog.campuses c on c.institution_id=i.id and c.name='Adelaide listed campus'
where p.canonical_title='Diploma of Nursing HLT54121'
and not exists (select 1 from catalog.programme_offerings o where o.programme_id=p.id);

insert into taxonomy.programme_concepts(programme_id,concept_id,relation_type,confidence)
select p.id,c.id,'primary','high'
from catalog.programmes p
join catalog.institutions i on i.id=p.institution_id
cross join taxonomy.study_concepts c
where c.concept_key='nursing'
  and i.canonical_name in ('TAFE NSW','TAFE SA')
  and p.canonical_title='Diploma of Nursing HLT54121'
on conflict do nothing;
