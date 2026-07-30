create schema if not exists retired;

alter materialized view public.roi_explorer_au set schema retired;
alter materialized view public.roi_explorer_ca set schema retired;
alter materialized view public.roi_explorer_ie set schema retired;
alter materialized view public.roi_explorer_uk set schema retired;
alter materialized view public.roi_explorer_us set schema retired;
alter materialized view public.roi_explorer_by_field_us set schema retired;
alter materialized view public.roi_explorer_nl set schema retired;

revoke all on schema retired from anon,authenticated;
comment on schema retired is 'Obsolete product tables and views isolated during the 2026-07-30 canonical schema cutover; safe for physical deletion after code cutover.';