-- Final physical cleanup after the Report Factory canonical cutover.
-- Audited on 2026-07-30: all six remaining legacy report tables below contain 0 rows.
-- Run once against the linked production project.

begin;

alter table public.city_living_cost_profiles_au set schema retired;
alter table public.report_metric_evidence_au set schema retired;
alter table public.report_decision_options set schema retired;
alter table public.report_intakes set schema retired;
alter table public.report_launch_interests set schema retired;
alter table public.report_orders set schema retired;

-- All legacy planner, discovery, approximate ROI and superseded report tables/views
-- are now isolated under retired. The canonical copies and source lineage live in
-- core, catalog, taxonomy, evidence, labour, reporting and ingest.
drop schema retired cascade;

commit;