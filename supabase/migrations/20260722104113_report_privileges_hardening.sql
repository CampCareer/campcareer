-- Public-schema tables inherit broad API grants unless they are explicitly
-- revoked. RLS already denies anonymous access, but report inputs, orders,
-- and commercial evidence are sensitive enough to make the intended API
-- surface explicit as well.

revoke all on table public.report_intakes, public.report_decision_options, public.report_orders from anon;

-- Signed-in users may only read their own orders. Payment and fulfilment
-- transitions remain server-side operations through service_role.
revoke all on table public.report_orders from authenticated;
grant select on table public.report_orders to authenticated;

-- The commercial evidence ledger and city-cost assumptions are operator-only
-- inputs. They must never be readable through the browser Data API.
revoke all on table public.report_metric_evidence_au, public.city_living_cost_profiles_au from anon, authenticated;
