-- Personalised Australia report workspace and private order ledger.
--
-- Intake answers are deliberately limited to the decision factors needed for
-- the report. The browser can save its own intake and option shortlist, but
-- it cannot create a paid order, set a price, or mark a report as fulfilled.
-- Those actions belong to a future server-side payment webhook and fulfilment
-- service after the evidence and operating-policy gates are complete.

create table public.report_intakes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  country text not null default 'AU' check (country = 'AU'),
  age smallint check (age is null or age between 13 and 99),
  education_work_history text not null default '' check (char_length(education_work_history) <= 4000),
  english_level text not null default 'not_sure' check (english_level in (
    'not_sure', 'beginner', 'intermediate', 'upper_intermediate', 'advanced', 'ielts', 'pte', 'toefl'
  )),
  maximum_budget_aud numeric(14, 2) check (maximum_budget_aud is null or maximum_budget_aud >= 0),
  expected_scholarship_aud numeric(14, 2) not null default 0 check (expected_scholarship_aud >= 0),
  family_accompaniment text not null default 'not_sure' check (family_accompaniment in (
    'no', 'partner', 'children', 'partner_and_children', 'not_sure'
  )),
  preferred_cities text[] not null default '{}'::text[] check (cardinality(preferred_cities) <= 6),
  location_preference text not null default 'open' check (location_preference in ('metro', 'regional', 'open')),
  target_occupation text not null default '' check (char_length(target_occupation) <= 160),
  post_study_goal text not null default 'not_sure' check (post_study_goal in (
    'return_home', 'australian_employment', 'open_to_both', 'not_sure'
  )),
  risk_tolerance text not null default 'balanced' check (risk_tolerance in ('low', 'balanced', 'high')),
  desired_payback_years smallint check (desired_payback_years is null or desired_payback_years between 1 and 25),
  report_language text not null default 'en' check (report_language in ('en', 'ko')),
  privacy_consent_at timestamptz,
  retention_expires_at timestamptz not null default (now() + interval '12 months'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, country),
  unique (id, user_id),
  check (retention_expires_at >= created_at and retention_expires_at <= created_at + interval '12 months')
);

create table public.report_decision_options (
  id uuid primary key default gen_random_uuid(),
  intake_id uuid not null references public.report_intakes(id) on delete cascade,
  position smallint not null check (position between 1 and 3),
  source_type text not null default 'manual' check (source_type in ('manual', 'saved_university', 'saved_course')),
  source_reference text check (source_reference is null or char_length(source_reference) <= 180),
  title text not null check (char_length(title) between 1 and 160),
  provider_name text not null default '' check (char_length(provider_name) <= 160),
  city text not null default '' check (char_length(city) <= 100),
  state_or_territory text not null default '' check (char_length(state_or_territory) <= 80),
  field_name text not null default '' check (char_length(field_name) <= 160),
  study_level text not null default '' check (char_length(study_level) <= 100),
  notes text not null default '' check (char_length(notes) <= 1500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (intake_id, position)
);

create table public.report_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  country text not null default 'AU' check (country = 'AU'),
  product_id text not null check (product_id in (
    'australia-topic-deep-dive',
    'australia-study-roi-index-2026',
    'my-australia-roi-decision-report',
    'australia-expert-review'
  )),
  report_intake_id uuid,
  source_order_id uuid,
  pricing_mode text not null check (pricing_mode in ('full_price', 'upgrade')),
  price_aud_cents integer not null check (price_aud_cents > 0),
  currency text not null default 'AUD' check (currency = 'AUD'),
  status text not null default 'draft' check (status in (
    'draft', 'awaiting_payment', 'paid', 'generating', 'ready', 'failed', 'refunded', 'cancelled'
  )),
  report_language text not null default 'en' check (report_language in ('en', 'ko')),
  payment_provider text check (payment_provider is null or char_length(payment_provider) <= 80),
  provider_payment_id text check (provider_payment_id is null or char_length(provider_payment_id) <= 240),
  delivery_path text check (delivery_path is null or char_length(delivery_path) <= 1000),
  purchased_at timestamptz,
  fulfilled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (id, user_id),
  foreign key (report_intake_id, user_id) references public.report_intakes(id, user_id) on delete set null (report_intake_id),
  foreign key (source_order_id, user_id) references public.report_orders(id, user_id) on delete set null (source_order_id),
  check (
    (product_id = 'my-australia-roi-decision-report' and report_intake_id is not null)
    or product_id <> 'my-australia-roi-decision-report'
  ),
  check (
    (pricing_mode = 'upgrade' and product_id = 'my-australia-roi-decision-report' and source_order_id is not null)
    or pricing_mode = 'full_price'
  )
);

create index report_intakes_user_country_idx on public.report_intakes (user_id, country);
create index report_decision_options_intake_idx on public.report_decision_options (intake_id, position);
create index report_orders_user_status_created_idx on public.report_orders (user_id, status, created_at desc);
create index report_orders_intake_idx on public.report_orders (report_intake_id) where report_intake_id is not null;
create index report_orders_source_order_idx on public.report_orders (source_order_id) where source_order_id is not null;

alter table public.report_intakes enable row level security;
alter table public.report_decision_options enable row level security;
alter table public.report_orders enable row level security;

-- Supabase public-schema tables require explicit authenticated grants as well
-- as RLS policies. Never grant order writes to a browser role.
grant select, insert, update, delete on public.report_intakes to authenticated;
grant select, insert, update, delete on public.report_decision_options to authenticated;
grant select on public.report_orders to authenticated;

create policy "users read own report intakes" on public.report_intakes
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "users insert own report intakes" on public.report_intakes
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "users update own report intakes" on public.report_intakes
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "users delete own report intakes" on public.report_intakes
  for delete to authenticated using ((select auth.uid()) = user_id);

create policy "users read own report options" on public.report_decision_options
  for select to authenticated using (
    exists (
      select 1 from public.report_intakes intake
      where intake.id = report_decision_options.intake_id
        and intake.user_id = (select auth.uid())
    )
  );
create policy "users insert own report options" on public.report_decision_options
  for insert to authenticated with check (
    exists (
      select 1 from public.report_intakes intake
      where intake.id = report_decision_options.intake_id
        and intake.user_id = (select auth.uid())
    )
  );
create policy "users update own report options" on public.report_decision_options
  for update to authenticated using (
    exists (
      select 1 from public.report_intakes intake
      where intake.id = report_decision_options.intake_id
        and intake.user_id = (select auth.uid())
    )
  ) with check (
    exists (
      select 1 from public.report_intakes intake
      where intake.id = report_decision_options.intake_id
        and intake.user_id = (select auth.uid())
    )
  );
create policy "users delete own report options" on public.report_decision_options
  for delete to authenticated using (
    exists (
      select 1 from public.report_intakes intake
      where intake.id = report_decision_options.intake_id
        and intake.user_id = (select auth.uid())
    )
  );

create policy "users read own report orders" on public.report_orders
  for select to authenticated using ((select auth.uid()) = user_id);

-- A webhook/fulfilment worker uses service_role. This explicit grant keeps the
-- operational path deliberate while RLS continues to protect browser access.
grant all privileges on table public.report_intakes, public.report_decision_options, public.report_orders to service_role;
