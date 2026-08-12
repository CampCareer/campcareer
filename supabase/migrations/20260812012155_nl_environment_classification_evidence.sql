-- Explicit classification evidence for Netherlands Environment careers.
-- These rows make the direct ISCO-08 scopes auditable independently of the profile row.
-- Sustainability Specialist intentionally has no row here because no exact single ISCO-08 unit group is asserted.
-- No country_occupation_region_metrics rows are inserted: reviewed official regional/sector sources do not provide
-- a sufficiently exact recurring occupation-by-region series for these eight canonical scopes.

insert into public.country_occupation_specialisations (
  profile_key,official_code,official_title,legacy_code_system,legacy_code_version,legacy_code,
  shortage_rating,visa_eligible,included_in_rollup,sort_order,source_url,source_checked_at
) values
  ('NL:environmental-scientist','2133','Environmental Protection Professionals — environmental scientist / milieukundige scope',null,null,null,null,null,true,1,'https://isco.ilo.org/en/isco-08/','2026-08-12'),
  ('NL:agronomist','2132','Farming, Forestry and Fisheries Advisers — agronomy / crop-advisory scope',null,null,null,null,null,true,1,'https://isco.ilo.org/en/isco-08/','2026-08-12'),
  ('NL:farm-manager','1311','Agricultural and Forestry Production Managers — farm-management scope',null,null,null,null,null,true,1,'https://isco.ilo.org/en/isco-08/','2026-08-12'),
  ('NL:forestry-technician','3143','Forestry Technicians',null,null,null,null,null,true,1,'https://isco.ilo.org/en/isco-08/','2026-08-12'),
  ('NL:food-technologist','2145','Chemical Engineers — food / process technology scope',null,null,null,null,null,true,1,'https://isco.ilo.org/en/isco-08/','2026-08-12'),
  ('NL:horticulturist','6113','Gardeners, Horticultural and Nursery Growers — skilled horticultural production scope',null,null,null,null,null,true,1,'https://isco.ilo.org/en/isco-08/','2026-08-12'),
  ('NL:animal-science-technician','3141','Life Science Technicians (except medical) — laboratory-animal / life-science technical scope',null,null,null,null,null,true,1,'https://isco.ilo.org/en/isco-08/','2026-08-12')
on conflict (profile_key,official_code) do update set
  official_title=excluded.official_title,
  legacy_code_system=excluded.legacy_code_system,
  legacy_code_version=excluded.legacy_code_version,
  legacy_code=excluded.legacy_code,
  shortage_rating=excluded.shortage_rating,
  visa_eligible=excluded.visa_eligible,
  included_in_rollup=excluded.included_in_rollup,
  sort_order=excluded.sort_order,
  source_url=excluded.source_url,
  source_checked_at=excluded.source_checked_at;
