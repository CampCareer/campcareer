-- Demand signals for destinations that are not yet publicly available.
-- This table is intentionally server-only: visitors can request a country via
-- the API, but cannot read requests or write directly through the Data API.

create table public.country_launch_requests (
  id uuid primary key default gen_random_uuid(),
  country_code text not null check (country_code in (
    'CA', 'US', 'IE', 'UK', 'DE', 'NL', 'BE', 'FR', 'ES', 'SG',
    'KR', 'JP', 'NZ', 'NO', 'SE', 'DK', 'FI', 'CH', 'AE'
  )),
  request_fingerprint text not null check (char_length(request_fingerprint) = 64),
  surface text not null default 'home_country_grid' check (surface = 'home_country_grid'),
  notification_sent_at timestamptz,
  created_at timestamptz not null default now(),
  unique (country_code, request_fingerprint)
);

create index country_launch_requests_country_created_idx
  on public.country_launch_requests (country_code, created_at desc);

alter table public.country_launch_requests enable row level security;

revoke all on table public.country_launch_requests from anon, authenticated;
grant all on table public.country_launch_requests to service_role;
