-- JSA Data on Occupation Mobility (DOM), supplied as annual ANZSCO v1.3
-- worker transitions from Income Tax Return records. These tables retain the
-- observed flow separately from CampCareer’s OSCA taxonomy: one ANZSCO code can
-- map to multiple OSCA occupations, so no direct foreign key is appropriate.

create table if not exists public.occupation_mobility_flows_au (
  financial_year text not null check (financial_year ~ '^\\d{4}_\\d{4}$'),
  previous_anzsco_v13 text not null check (previous_anzsco_v13 ~ '^\\d{6}$'),
  recent_anzsco_v13 text not null check (recent_anzsco_v13 ~ '^\\d{6}$'),
  worker_count integer not null check (worker_count >= 10),
  previous_occupation_title text,
  recent_occupation_title text,
  source_name text not null default 'Jobs and Skills Australia Data on Occupation Mobility',
  source_url text not null,
  retrieved_at timestamptz not null default now(),
  primary key (financial_year, previous_anzsco_v13, recent_anzsco_v13)
);

create table if not exists public.occupation_mobility_stocks_au (
  financial_year text not null check (financial_year ~ '^\\d{4}_\\d{4}$'),
  anzsco_v13 text not null check (anzsco_v13 ~ '^\\d{6}$'),
  worker_stock integer not null check (worker_stock >= 0),
  previous_financial_year_stock integer,
  stock_delta integer,
  inflow integer,
  outflow integer,
  epsilon integer,
  occupation_title text,
  source_name text not null default 'Jobs and Skills Australia Data on Occupation Mobility',
  source_url text not null,
  retrieved_at timestamptz not null default now(),
  primary key (financial_year, anzsco_v13)
);

-- Page queries always start with one occupation and the latest financial year,
-- then order the observed destinations by their worker count.
create index if not exists occupation_mobility_flows_au_outbound_lookup_idx
  on public.occupation_mobility_flows_au (previous_anzsco_v13, financial_year desc, worker_count desc);
create index if not exists occupation_mobility_flows_au_inbound_lookup_idx
  on public.occupation_mobility_flows_au (recent_anzsco_v13, financial_year desc, worker_count desc);
create index if not exists occupation_mobility_stocks_au_lookup_idx
  on public.occupation_mobility_stocks_au (anzsco_v13, financial_year desc);

alter table public.occupation_mobility_flows_au enable row level security;
alter table public.occupation_mobility_stocks_au enable row level security;

grant select on table public.occupation_mobility_flows_au, public.occupation_mobility_stocks_au
  to anon, authenticated;
grant all privileges on table public.occupation_mobility_flows_au, public.occupation_mobility_stocks_au
  to service_role;

create policy "Public can read AU occupation mobility flows"
  on public.occupation_mobility_flows_au for select to anon, authenticated using (true);
create policy "Public can read AU occupation mobility stocks"
  on public.occupation_mobility_stocks_au for select to anon, authenticated using (true);
