-- The first DOM release exposes outbound "next move" paths only. Keep the
-- write and read footprint focused until an inbound-path feature is shipped.
drop index if exists public.occupation_mobility_flows_au_inbound_lookup_idx;
