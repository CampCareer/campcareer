begin;

-- Server-managed purchase state for FIFO Construction Fast Entry Guide 2026.
-- Checkout, Stripe webhooks and delivery all converge on this table. Browser
-- roles cannot read or mutate purchase email or payment identifiers directly.
create table public.fifo_report_orders (
  id uuid primary key default gen_random_uuid(),
  checkout_attempt_id uuid not null,
  product_id text not null default 'fifo-construction-fast-entry-guide-2026',
  product_edition text not null default '1.0',
  email text not null,
  amount_aud_cents integer not null,
  currency text not null default 'AUD',
  payment_provider text not null default 'stripe',
  payment_status text not null default 'pending',
  delivery_status text not null default 'not_ready',
  stripe_checkout_session_id text,
  stripe_payment_intent_id text,
  stripe_customer_id text,
  marketing_opt_in_requested boolean not null default false,
  marketing_opt_in_requested_at timestamptz,
  marketing_consent_version text,
  purchased_at timestamptz,
  delivery_attempt_count integer not null default 0,
  delivery_last_attempt_at timestamptz,
  delivered_at timestamptz,
  delivery_error_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint fifo_report_orders_product_check
    check (product_id = 'fifo-construction-fast-entry-guide-2026'),
  constraint fifo_report_orders_edition_check
    check (char_length(product_edition) between 1 and 40),
  constraint fifo_report_orders_email_check
    check (
      char_length(email) between 3 and 320
      and email = lower(btrim(email))
      and position('@' in email) > 1
    ),
  constraint fifo_report_orders_amount_check
    check (amount_aud_cents > 0),
  constraint fifo_report_orders_currency_check
    check (currency = 'AUD'),
  constraint fifo_report_orders_provider_check
    check (payment_provider = 'stripe'),
  constraint fifo_report_orders_payment_status_check
    check (payment_status in ('pending', 'paid', 'failed', 'expired', 'refunded', 'disputed')),
  constraint fifo_report_orders_delivery_status_check
    check (delivery_status in ('not_ready', 'pending', 'delivered', 'failed')),
  constraint fifo_report_orders_checkout_session_check
    check (
      stripe_checkout_session_id is null
      or (char_length(stripe_checkout_session_id) between 4 and 255 and left(stripe_checkout_session_id, 3) = 'cs_')
    ),
  constraint fifo_report_orders_payment_intent_check
    check (
      stripe_payment_intent_id is null
      or (char_length(stripe_payment_intent_id) between 4 and 255 and left(stripe_payment_intent_id, 3) = 'pi_')
    ),
  constraint fifo_report_orders_customer_check
    check (
      stripe_customer_id is null
      or (char_length(stripe_customer_id) between 4 and 255 and left(stripe_customer_id, 4) = 'cus_')
    ),
  constraint fifo_report_orders_marketing_boundary_check
    check (
      (
        marketing_opt_in_requested = false
        and marketing_opt_in_requested_at is null
        and marketing_consent_version is null
      )
      or (
        marketing_opt_in_requested = true
        and marketing_opt_in_requested_at is not null
        and char_length(marketing_consent_version) between 1 and 80
      )
    ),
  constraint fifo_report_orders_purchase_state_check
    check (
      (purchased_at is null and payment_status in ('pending', 'failed', 'expired'))
      or (purchased_at is not null and payment_status in ('paid', 'refunded', 'disputed'))
    ),
  constraint fifo_report_orders_delivery_attempt_count_check
    check (delivery_attempt_count >= 0),
  constraint fifo_report_orders_delivery_state_check
    check (
      delivered_at is null
      or (delivery_status = 'delivered' and purchased_at is not null)
    ),
  constraint fifo_report_orders_delivery_error_check
    check (delivery_error_code is null or char_length(delivery_error_code) between 1 and 80)
);

comment on table public.fifo_report_orders is
  'Server-managed order state for the FIFO Construction Fast Entry Guide 2026. Checkout, Stripe webhook and fulfilment writes must be idempotent around checkout_attempt_id and Stripe identifiers.';
comment on column public.fifo_report_orders.checkout_attempt_id is
  'Client-generated UUID scoped to one checkout attempt. Unique so repeated submits can converge on one order.';
comment on column public.fifo_report_orders.marketing_opt_in_requested is
  'Optional marketing preference captured separately from the required purchase email. This is not itself a mailing-list subscription.';
comment on column public.fifo_report_orders.delivery_error_code is
  'Short non-PII/non-secret delivery failure code for retry and observability.';

create unique index fifo_report_orders_checkout_attempt_uidx
  on public.fifo_report_orders (checkout_attempt_id);
create unique index fifo_report_orders_stripe_session_uidx
  on public.fifo_report_orders (stripe_checkout_session_id)
  where stripe_checkout_session_id is not null;
create unique index fifo_report_orders_payment_intent_uidx
  on public.fifo_report_orders (stripe_payment_intent_id)
  where stripe_payment_intent_id is not null;
create index fifo_report_orders_email_created_idx
  on public.fifo_report_orders (lower(email), created_at desc);
create index fifo_report_orders_payment_created_idx
  on public.fifo_report_orders (payment_status, created_at desc);
create index fifo_report_orders_delivery_retry_idx
  on public.fifo_report_orders (delivery_status, delivery_last_attempt_at asc nulls first)
  where payment_status = 'paid' and delivery_status in ('pending', 'failed');

alter table public.fifo_report_orders enable row level security;
revoke all privileges on table public.fifo_report_orders from anon, authenticated;
grant select, insert, update, delete on table public.fifo_report_orders to service_role;

drop policy if exists "FIFO report orders are server managed" on public.fifo_report_orders;
create policy "FIFO report orders are server managed"
  on public.fifo_report_orders
  for all
  to service_role
  using (true)
  with check (true);

-- The finished PDF is stored once in a private bucket. Buyers receive only
-- short-lived signed URLs generated by trusted server code after payment.
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'fifo-report-products',
  'fifo-report-products',
  false,
  20971520,
  array['application/pdf']::text[]
)
on conflict (id) do update
set
  name = excluded.name,
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "FIFO report products are server managed" on storage.objects;
create policy "FIFO report products are server managed"
  on storage.objects
  for all
  to service_role
  using (bucket_id = 'fifo-report-products')
  with check (bucket_id = 'fifo-report-products');

commit;
