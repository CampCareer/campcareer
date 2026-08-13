-- Durable, server-only quotas for public endpoints that can create storage,
-- database rows, email, or paid AI work. Browser-provided identifiers are
-- HMAC'd in the application before they reach this table.

begin;

create table public.api_request_rate_limits (
  endpoint text not null check (endpoint ~ '^[a-z0-9_]{3,80}$'),
  request_fingerprint text not null check (request_fingerprint ~ '^[0-9a-f]{64}$'),
  window_started timestamptz not null,
  request_count integer not null default 1 check (request_count >= 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (endpoint, request_fingerprint, window_started)
);

create index api_request_rate_limits_expiry_idx
  on public.api_request_rate_limits (window_started);

alter table public.api_request_rate_limits enable row level security;
revoke all on table public.api_request_rate_limits from anon, authenticated;
grant all on table public.api_request_rate_limits to service_role;

create function public.enforce_api_rate_limit(
  p_endpoint text,
  p_fingerprint text,
  p_limit integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_window_started timestamptz;
  v_accepted boolean;
begin
  if p_endpoint !~ '^[a-z0-9_]{3,80}$'
    or p_fingerprint !~ '^[0-9a-f]{64}$'
    or p_limit < 1 or p_limit > 100
    or p_window_seconds < 1 or p_window_seconds > 86400 then
    return false;
  end if;

  v_window_started := to_timestamp(
    floor(extract(epoch from clock_timestamp()) / p_window_seconds) * p_window_seconds
  );

  -- Bounded opportunistic cleanup avoids retaining a visitor fingerprint after
  -- it has no rate-limit purpose. The expiry index keeps this infrequent prune
  -- inexpensive without requiring a scheduler in every deployment.
  if random() < 0.01 then
    delete from public.api_request_rate_limits
    where window_started < clock_timestamp() - interval '2 days';
  end if;

  insert into public.api_request_rate_limits (
    endpoint,
    request_fingerprint,
    window_started,
    request_count,
    updated_at
  )
  values (p_endpoint, p_fingerprint, v_window_started, 1, clock_timestamp())
  on conflict (endpoint, request_fingerprint, window_started)
  do update set
    request_count = api_request_rate_limits.request_count + 1,
    updated_at = clock_timestamp()
  where api_request_rate_limits.request_count < p_limit
  returning true into v_accepted;

  return coalesce(v_accepted, false);
end;
$$;

revoke all on function public.enforce_api_rate_limit(text, text, integer, integer) from public, anon, authenticated;
grant execute on function public.enforce_api_rate_limit(text, text, integer, integer) to service_role;

comment on table public.api_request_rate_limits is
  'Short-lived HMAC visitor fingerprints used only for public endpoint abuse protection.';
comment on function public.enforce_api_rate_limit(text, text, integer, integer) is
  'Atomically consumes one request from a service-role-only fixed-window quota.';

commit;
