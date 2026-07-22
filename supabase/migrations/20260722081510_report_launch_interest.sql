-- Consented, double-opt-in launch notifications for Australia report products.
-- This is intentionally separate from visa-policy subscriptions: a visitor
-- asking when a report launches must never receive a visa-alert email.

create table public.report_launch_interests (
  id uuid primary key default gen_random_uuid(),
  email text not null check (char_length(email) between 3 and 320),
  report_product_ids text[] not null check (
    cardinality(report_product_ids) between 1 and 3
    and report_product_ids <@ array[
      'australia-study-roi-index-2026',
      'my-australia-roi-decision-report',
      'australia-expert-review'
    ]::text[]
  ),
  locale text not null default 'en' check (locale in ('en', 'ko')),
  source_path text not null default '/' check (char_length(source_path) between 1 and 500),
  consent_at timestamptz not null,
  consent_version text not null check (char_length(consent_version) between 1 and 80),
  confirmation_token uuid not null default gen_random_uuid(),
  confirmation_sent_at timestamptz,
  confirmed boolean not null default false,
  confirmed_at timestamptz,
  unsubscribed_at timestamptz,
  acquisition_session_id text check (acquisition_session_id is null or char_length(acquisition_session_id) <= 80),
  first_path text check (first_path is null or char_length(first_path) <= 500),
  utm jsonb not null default '{}'::jsonb,
  retention_expires_at timestamptz not null default (now() + interval '12 months'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (confirmed_at is null or confirmed),
  check (retention_expires_at >= created_at and retention_expires_at <= created_at + interval '12 months')
);

create unique index report_launch_interests_email_uidx on public.report_launch_interests (lower(email));
create unique index report_launch_interests_confirmation_token_uidx on public.report_launch_interests (confirmation_token);
create index report_launch_interests_retention_idx on public.report_launch_interests (retention_expires_at asc);
create index report_launch_interests_confirmed_created_idx on public.report_launch_interests (confirmed, created_at desc)
  where unsubscribed_at is null;

alter table public.report_launch_interests enable row level security;

-- The public form posts to a server route. Neither anonymous nor signed-in
-- browser roles can enumerate, create, or alter another visitor's email.
revoke all on table public.report_launch_interests from anon, authenticated;
grant all privileges on table public.report_launch_interests to service_role;
