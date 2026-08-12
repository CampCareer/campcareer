-- Netherlands Environment cohort: 8 canonical careers.
-- Direct ISCO-08 mappings are used where a defensible unit group exists.
-- Sustainability Specialist remains an explicit modern NL career scope rather than forcing one legacy unit group.

insert into public.country_occupation_profiles (
  profile_key,country_code,canonical_career_id,official_title,official_code_system,official_code_version,
  official_unit_group_code,currency,registration_required,registration_authority,registration_url,
  publication_status,source_checked_at,updated_at
) values
  ('NL:environmental-scientist','NL','environmental-scientist','Environmental Protection Professionals — environmental scientist / milieukundige scope','ISCO-08','2008','2133','EUR',false,null,null,'profile_ready','2026-08-12',now()),
  ('NL:agronomist','NL','agronomist','Farming, Forestry and Fisheries Advisers — agronomy / crop-advisory scope','ISCO-08','2008','2132','EUR',false,null,null,'profile_ready','2026-08-12',now()),
  ('NL:farm-manager','NL','farm-manager','Agricultural and Forestry Production Managers — farm-management scope','ISCO-08','2008','1311','EUR',false,null,null,'profile_ready','2026-08-12',now()),
  ('NL:forestry-technician','NL','forestry-technician','Forestry Technicians','ISCO-08','2008','3143','EUR',false,null,null,'profile_ready','2026-08-12',now()),
  ('NL:food-technologist','NL','food-technologist','Chemical Engineers — food / process technology scope','ISCO-08','2008','2145','EUR',false,null,null,'profile_ready','2026-08-12',now()),
  ('NL:sustainability-specialist','NL','sustainability-specialist','Sustainability / ESG / energy-management specialist — Netherlands cross-sector career scope','NL career scope','2026-08-12',null,'EUR',false,null,null,'profile_ready','2026-08-12',now()),
  ('NL:horticulturist','NL','horticulturist','Gardeners, Horticultural and Nursery Growers — skilled horticultural production scope','ISCO-08','2008','6113','EUR',false,null,null,'profile_ready','2026-08-12',now()),
  ('NL:animal-science-technician','NL','animal-science-technician','Life Science Technicians (except medical) — laboratory-animal / life-science technical scope','ISCO-08','2008','3141','EUR',false,null,null,'profile_ready','2026-08-12',now())
on conflict (profile_key) do update set
  official_title=excluded.official_title,
  official_code_system=excluded.official_code_system,
  official_code_version=excluded.official_code_version,
  official_unit_group_code=excluded.official_unit_group_code,
  currency=excluded.currency,
  registration_required=excluded.registration_required,
  registration_authority=excluded.registration_authority,
  registration_url=excluded.registration_url,
  publication_status=excluded.publication_status,
  source_checked_at=excluded.source_checked_at,
  updated_at=now();
