begin;

alter table public.fifo_report_orders
  add column if not exists stripe_price_id text,
  add column if not exists stripe_checkout_url text,
  add column if not exists stripe_last_event_id text,
  add column if not exists stripe_last_event_created_at timestamptz;

alter table public.fifo_report_orders
  drop constraint if exists fifo_report_orders_price_id_check,
  drop constraint if exists fifo_report_orders_checkout_url_check,
  drop constraint if exists fifo_report_orders_last_event_id_check;

alter table public.fifo_report_orders
  add constraint fifo_report_orders_price_id_check
    check (stripe_price_id is null or (char_length(stripe_price_id) between 7 and 255 and left(stripe_price_id, 6) = 'price_')),
  add constraint fifo_report_orders_checkout_url_check
    check (stripe_checkout_url is null or (char_length(stripe_checkout_url) between 20 and 2048 and left(stripe_checkout_url, 8) = 'https://')),
  add constraint fifo_report_orders_last_event_id_check
    check (stripe_last_event_id is null or (char_length(stripe_last_event_id) between 5 and 255 and left(stripe_last_event_id, 4) = 'evt_'));

comment on column public.fifo_report_orders.stripe_price_id is
  'Stripe Price used to create the Checkout Session. Stored so an order cannot silently switch commercial terms across retries.';
comment on column public.fifo_report_orders.stripe_checkout_url is
  'Hosted Checkout URL returned by Stripe. Reused for the same checkout_attempt_id instead of creating a second session.';
comment on column public.fifo_report_orders.stripe_last_event_created_at is
  'Stripe event creation time for the latest applied payment-state transition. Older events must not downgrade newer order state.';

create table if not exists public.fifo_report_stripe_events (
  event_id text primary key,
  event_type text not null,
  event_created_at timestamptz not null,
  order_id uuid references public.fifo_report_orders(id) on delete set null,
  processing_result text not null,
  processing_reason text,
  received_at timestamptz not null default now(),
  constraint fifo_report_stripe_events_id_check
    check (char_length(event_id) between 5 and 255 and left(event_id, 4) = 'evt_'),
  constraint fifo_report_stripe_events_type_check
    check (char_length(event_type) between 3 and 160),
  constraint fifo_report_stripe_events_result_check
    check (processing_result in ('applied', 'ignored')),
  constraint fifo_report_stripe_events_reason_check
    check (processing_reason is null or char_length(processing_reason) between 1 and 80)
);

create index if not exists fifo_report_stripe_events_order_received_idx
  on public.fifo_report_stripe_events (order_id, received_at desc);
create index if not exists fifo_report_stripe_events_created_idx
  on public.fifo_report_stripe_events (event_created_at desc);

alter table public.fifo_report_stripe_events enable row level security;
revoke all privileges on table public.fifo_report_stripe_events from anon, authenticated;
grant select, insert, update, delete on table public.fifo_report_stripe_events to service_role;

drop policy if exists "FIFO Stripe events are server managed" on public.fifo_report_stripe_events;
create policy "FIFO Stripe events are server managed"
  on public.fifo_report_stripe_events
  for all
  to service_role
  using (true)
  with check (true);

create or replace function public.apply_fifo_report_stripe_event(
  p_event_id text,
  p_event_type text,
  p_event_created_at timestamptz,
  p_order_id uuid default null,
  p_checkout_session_id text default null,
  p_payment_intent_id text default null,
  p_customer_id text default null,
  p_payment_status text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_order public.fifo_report_orders%rowtype;
  v_new_payment_status text;
  v_should_apply boolean := false;
begin
  if p_event_id is null or left(p_event_id, 4) <> 'evt_' then
    raise exception 'invalid Stripe event id';
  end if;
  if p_event_type is null or char_length(p_event_type) < 3 then
    raise exception 'invalid Stripe event type';
  end if;
  if p_event_created_at is null then
    raise exception 'invalid Stripe event timestamp';
  end if;
  if p_payment_status is not null and p_payment_status not in ('pending', 'paid', 'failed', 'expired') then
    raise exception 'invalid FIFO payment state';
  end if;

  if exists (select 1 from public.fifo_report_stripe_events where event_id = p_event_id) then
    return jsonb_build_object('duplicate', true, 'applied', false);
  end if;

  if p_order_id is not null then
    select * into v_order
    from public.fifo_report_orders
    where id = p_order_id
    for update;
  elsif p_checkout_session_id is not null then
    select * into v_order
    from public.fifo_report_orders
    where stripe_checkout_session_id = p_checkout_session_id
    for update;
  elsif p_payment_intent_id is not null then
    select * into v_order
    from public.fifo_report_orders
    where stripe_payment_intent_id = p_payment_intent_id
    for update;
  end if;

  if not found then
    insert into public.fifo_report_stripe_events (
      event_id, event_type, event_created_at, processing_result, processing_reason
    ) values (
      p_event_id, p_event_type, p_event_created_at, 'ignored', 'order_not_found'
    ) on conflict (event_id) do nothing;
    return jsonb_build_object('duplicate', false, 'applied', false, 'reason', 'order_not_found');
  end if;

  -- Recheck after the row lock so simultaneous retries cannot both pass the
  -- pre-lock duplicate test and trigger divergent state transitions.
  if exists (select 1 from public.fifo_report_stripe_events where event_id = p_event_id) then
    return jsonb_build_object('duplicate', true, 'applied', false, 'order_id', v_order.id);
  end if;

  if p_checkout_session_id is not null
     and v_order.stripe_checkout_session_id is not null
     and v_order.stripe_checkout_session_id <> p_checkout_session_id then
    insert into public.fifo_report_stripe_events (
      event_id, event_type, event_created_at, order_id, processing_result, processing_reason
    ) values (
      p_event_id, p_event_type, p_event_created_at, v_order.id, 'ignored', 'checkout_session_conflict'
    );
    return jsonb_build_object('duplicate', false, 'applied', false, 'order_id', v_order.id, 'reason', 'checkout_session_conflict');
  end if;

  if p_payment_intent_id is not null
     and v_order.stripe_payment_intent_id is not null
     and v_order.stripe_payment_intent_id <> p_payment_intent_id then
    insert into public.fifo_report_stripe_events (
      event_id, event_type, event_created_at, order_id, processing_result, processing_reason
    ) values (
      p_event_id, p_event_type, p_event_created_at, v_order.id, 'ignored', 'payment_intent_conflict'
    );
    return jsonb_build_object('duplicate', false, 'applied', false, 'order_id', v_order.id, 'reason', 'payment_intent_conflict');
  end if;

  if v_order.stripe_last_event_created_at is null or p_event_created_at >= v_order.stripe_last_event_created_at then
    v_should_apply := true;
  end if;

  if not v_should_apply then
    insert into public.fifo_report_stripe_events (
      event_id, event_type, event_created_at, order_id, processing_result, processing_reason
    ) values (
      p_event_id, p_event_type, p_event_created_at, v_order.id, 'ignored', 'stale_event'
    );
    return jsonb_build_object('duplicate', false, 'applied', false, 'order_id', v_order.id, 'reason', 'stale_event');
  end if;

  v_new_payment_status := v_order.payment_status;

  if p_payment_status = 'paid' and v_order.payment_status not in ('refunded', 'disputed') then
    v_new_payment_status := 'paid';
  elsif p_payment_status in ('failed', 'expired') and v_order.payment_status in ('pending', 'failed', 'expired') then
    v_new_payment_status := p_payment_status;
  elsif p_payment_status = 'pending' and v_order.payment_status = 'pending' then
    v_new_payment_status := 'pending';
  end if;

  update public.fifo_report_orders
  set
    stripe_checkout_session_id = coalesce(stripe_checkout_session_id, p_checkout_session_id),
    stripe_payment_intent_id = coalesce(stripe_payment_intent_id, p_payment_intent_id),
    stripe_customer_id = coalesce(stripe_customer_id, p_customer_id),
    payment_status = v_new_payment_status,
    purchased_at = case
      when v_new_payment_status in ('paid', 'refunded', 'disputed') then coalesce(purchased_at, p_event_created_at)
      else purchased_at
    end,
    delivery_status = case
      when v_new_payment_status = 'paid' and delivery_status = 'not_ready' then 'pending'
      else delivery_status
    end,
    stripe_last_event_id = p_event_id,
    stripe_last_event_created_at = p_event_created_at,
    updated_at = now()
  where id = v_order.id;

  insert into public.fifo_report_stripe_events (
    event_id,
    event_type,
    event_created_at,
    order_id,
    processing_result
  ) values (
    p_event_id,
    p_event_type,
    p_event_created_at,
    v_order.id,
    'applied'
  );

  return jsonb_build_object(
    'duplicate', false,
    'applied', true,
    'order_id', v_order.id,
    'payment_status', v_new_payment_status
  );
end;
$$;

revoke all on function public.apply_fifo_report_stripe_event(text, text, timestamptz, uuid, text, text, text, text) from public, anon, authenticated;
grant execute on function public.apply_fifo_report_stripe_event(text, text, timestamptz, uuid, text, text, text, text) to service_role;

commit;
