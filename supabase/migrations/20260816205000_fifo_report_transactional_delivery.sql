begin;

-- Claim/complete/fail delivery attempts without letting duplicate Stripe events
-- send the same guide concurrently. The existing order row remains the single
-- source of truth for payment and fulfilment state.
create or replace function public.claim_fifo_report_delivery(
  p_order_id uuid,
  p_retry_after_seconds integer default 300
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_order public.fifo_report_orders%rowtype;
begin
  if p_order_id is null then
    raise exception 'invalid FIFO order id';
  end if;
  if p_retry_after_seconds < 0 or p_retry_after_seconds > 86400 then
    raise exception 'invalid FIFO delivery retry window';
  end if;

  select * into v_order
  from public.fifo_report_orders
  where id = p_order_id
  for update;

  if not found then
    return jsonb_build_object('claimed', false, 'reason', 'order_not_found');
  end if;

  if v_order.payment_status <> 'paid' then
    return jsonb_build_object('claimed', false, 'reason', 'not_paid');
  end if;

  if v_order.delivery_status = 'delivered' or v_order.delivered_at is not null then
    return jsonb_build_object('claimed', false, 'reason', 'already_delivered');
  end if;

  -- A pending attempt with a fresh timestamp is already being processed by a
  -- different webhook invocation. Failed attempts are intentionally claimable
  -- immediately so Stripe's later retry can recover transient delivery errors.
  if v_order.delivery_status = 'pending'
     and v_order.delivery_last_attempt_at is not null
     and v_order.delivery_last_attempt_at > now() - make_interval(secs => p_retry_after_seconds) then
    return jsonb_build_object('claimed', false, 'reason', 'recently_attempted');
  end if;

  update public.fifo_report_orders
  set
    delivery_status = 'pending',
    delivery_attempt_count = delivery_attempt_count + 1,
    delivery_last_attempt_at = now(),
    delivery_error_code = null,
    updated_at = now()
  where id = p_order_id;

  return jsonb_build_object(
    'claimed', true,
    'order_id', p_order_id,
    'attempt_count', v_order.delivery_attempt_count + 1
  );
end;
$$;

create or replace function public.complete_fifo_report_delivery(p_order_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_order public.fifo_report_orders%rowtype;
begin
  select * into v_order
  from public.fifo_report_orders
  where id = p_order_id
  for update;

  if not found then
    return jsonb_build_object('completed', false, 'reason', 'order_not_found');
  end if;
  if v_order.payment_status <> 'paid' then
    return jsonb_build_object('completed', false, 'reason', 'not_paid');
  end if;
  if v_order.delivery_status = 'delivered' and v_order.delivered_at is not null then
    return jsonb_build_object('completed', true, 'already_completed', true);
  end if;

  update public.fifo_report_orders
  set
    delivery_status = 'delivered',
    delivered_at = coalesce(delivered_at, now()),
    delivery_error_code = null,
    updated_at = now()
  where id = p_order_id;

  return jsonb_build_object('completed', true, 'already_completed', false);
end;
$$;

create or replace function public.fail_fifo_report_delivery(
  p_order_id uuid,
  p_error_code text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_order public.fifo_report_orders%rowtype;
  v_error_code text := lower(btrim(coalesce(p_error_code, '')));
begin
  if char_length(v_error_code) < 1 or char_length(v_error_code) > 80 then
    raise exception 'invalid FIFO delivery error code';
  end if;

  select * into v_order
  from public.fifo_report_orders
  where id = p_order_id
  for update;

  if not found then
    return jsonb_build_object('failed', false, 'reason', 'order_not_found');
  end if;
  if v_order.delivery_status = 'delivered' or v_order.delivered_at is not null then
    return jsonb_build_object('failed', false, 'reason', 'already_delivered');
  end if;

  update public.fifo_report_orders
  set
    delivery_status = 'failed',
    delivery_error_code = v_error_code,
    updated_at = now()
  where id = p_order_id;

  return jsonb_build_object('failed', true);
end;
$$;

revoke all on function public.claim_fifo_report_delivery(uuid, integer) from public, anon, authenticated;
revoke all on function public.complete_fifo_report_delivery(uuid) from public, anon, authenticated;
revoke all on function public.fail_fifo_report_delivery(uuid, text) from public, anon, authenticated;

grant execute on function public.claim_fifo_report_delivery(uuid, integer) to service_role;
grant execute on function public.complete_fifo_report_delivery(uuid) to service_role;
grant execute on function public.fail_fifo_report_delivery(uuid, text) to service_role;

commit;
