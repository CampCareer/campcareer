-- Demand data for routes that are not public yet. This is deliberately
-- separate from sales leads, partner referrals, and authenticated profiles.
-- All writes go through /api/route-requests using the service role.

create table public.route_search_requests (
  id uuid primary key default gen_random_uuid(),
  citizenship_code text not null check (citizenship_code ~ '^[A-Z]{2}$'),
  destination_code text not null check (destination_code ~ '^[A-Z]{2}$'),
  route_goal text not null check (route_goal in ('work', 'study')),
  field_normalized text not null check (char_length(field_normalized) between 1 and 80),
  request_kind text not null default 'route_research' check (request_kind in ('route_research', 'guide_interest')),
  locale text not null default 'ko' check (locale in ('en', 'ko')),
  notification_email text check (notification_email is null or char_length(notification_email) between 3 and 320),
  notification_consent boolean not null default false,
  notification_consent_at timestamptz,
  notification_consent_version text,
  request_fingerprint text not null check (char_length(request_fingerprint) = 64),
  source_path text not null default '/' check (char_length(source_path) between 1 and 500),
  created_at timestamptz not null default now(),
  check (
    (notification_consent = false and notification_email is null and notification_consent_at is null and notification_consent_version is null)
    or
    (notification_consent = true and notification_email is not null and notification_consent_at is not null and notification_consent_version is not null)
  )
);

create unique index route_search_requests_dedup_uidx
  on public.route_search_requests (
    request_fingerprint,
    citizenship_code,
    destination_code,
    route_goal,
    field_normalized,
    request_kind
  );

create index route_search_requests_demand_idx
  on public.route_search_requests (citizenship_code, destination_code, field_normalized, created_at desc);

create index route_search_requests_guide_interest_idx
  on public.route_search_requests (request_kind, created_at desc)
  where notification_consent = true;

alter table public.route_search_requests enable row level security;

-- This table is server-only: visitors must not enumerate route demand or
-- notification email addresses through the Data API.
revoke all on table public.route_search_requests from anon, authenticated;
grant all privileges on table public.route_search_requests to service_role;
