-- United Kingdom business occupation cohort: scope, source and verified programme links.

insert into public.country_occupation_specialisations (
  profile_key,official_code,official_title,shortage_rating,visa_eligible,included_in_rollup,sort_order,source_url,source_checked_at
) values
  ('UK:accountant','2421/02','Financial accountants (qualified)',null,true,true,1,'https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0001','2026-08-10'),
  ('UK:financial-analyst','2422/03','Financial analysts and advisers',null,true,true,1,'https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0561B','2026-08-10'),
  ('UK:business-analyst','2431/01','Business analysts and consultants',null,true,true,1,'https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0117','2026-08-10'),
  ('UK:supply-chain-analyst','3551','Buyers and procurement officers — supply-chain analyst scope',null,false,true,1,'https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0313','2026-08-10'),
  ('UK:human-resources-specialist','3571/02','Human resources advisers',null,true,true,1,'https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0238','2026-08-10'),
  ('UK:marketing-specialist','3554/01','Advertising and marketing executives — marketing specialist scope',null,true,true,1,'https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0596','2026-08-10'),
  ('UK:auditor','2421','Auditors (qualified accountant) — audit scope',null,true,true,1,'https://www.gov.uk/find-licences/become-a-registered-auditor','2026-08-10'),
  ('UK:project-manager','2440','Business and financial project management professionals',null,true,true,1,'https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0411','2026-08-10')
on conflict (profile_key,official_code) do update set
  official_title=excluded.official_title, shortage_rating=excluded.shortage_rating, visa_eligible=excluded.visa_eligible,
  included_in_rollup=excluded.included_in_rollup, sort_order=excluded.sort_order, source_url=excluded.source_url,
  source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_links (
  profile_key,link_type,label,url,provider_type,region_code,sort_order,source_checked_at
) values
  ('UK:accountant','entry_program','Skills England — Accountancy or Taxation Professional','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0001','official_training',null,1,'2026-08-10'),
  ('UK:accountant','source','Home Office — Appendix Skilled Occupations','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','official_immigration',null,2,'2026-08-10'),
  ('UK:financial-analyst','entry_program','Skills England — Financial Services Professional','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0472C','official_training',null,1,'2026-08-10'),
  ('UK:financial-analyst','source','Home Office — Appendix Skilled Occupations','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','official_immigration',null,2,'2026-08-10'),
  ('UK:business-analyst','entry_program','Skills England — Business Analyst','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0117','official_training',null,1,'2026-08-10'),
  ('UK:business-analyst','source','Home Office — Appendix Skilled Occupations','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','official_immigration',null,2,'2026-08-10'),
  ('UK:supply-chain-analyst','entry_program','Skills England — Procurement and Supply Chain Practitioner','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0313','official_training',null,1,'2026-08-10'),
  ('UK:supply-chain-analyst','source','Home Office — Appendix Skilled Occupations','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','official_immigration',null,2,'2026-08-10'),
  ('UK:supply-chain-analyst','source','Home Office — Appendix Skilled Worker current TSL','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-worker','official_immigration',null,3,'2026-08-10'),
  ('UK:human-resources-specialist','entry_program','Skills England — People Professional','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0238','official_training',null,1,'2026-08-10'),
  ('UK:human-resources-specialist','source','Home Office — Temporary Shortage List','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-worker','official_immigration',null,2,'2026-08-10'),
  ('UK:marketing-specialist','entry_program','Skills England — Marketing Executive','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0596','official_training',null,1,'2026-08-10'),
  ('UK:marketing-specialist','source','Home Office — Temporary Shortage List','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-worker','official_immigration',null,2,'2026-08-10'),
  ('UK:marketing-specialist','source','MAC — Temporary Shortage List Stage 2','https://www.gov.uk/government/publications/temporary-shortage-list-stage-2-report/temporary-shortage-list-stage-2-report-accessible','official_shortage',null,3,'2026-08-10'),
  ('UK:auditor','entry_program','Skills England — Internal Audit Professional','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0610','official_training',null,1,'2026-08-10'),
  ('UK:auditor','source','GOV.UK — Become a registered auditor','https://www.gov.uk/find-licences/become-a-registered-auditor','official_regulation',null,2,'2026-08-10'),
  ('UK:auditor','source','Home Office — Appendix Skilled Occupations','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','official_immigration',null,3,'2026-08-10'),
  ('UK:project-manager','entry_program','Skills England — Project Manager','https://occupational-maps.skillsengland.education.gov.uk/maps/occupation/OCC0411','official_training',null,1,'2026-08-10'),
  ('UK:project-manager','source','Home Office — Appendix Skilled Occupations','https://www.gov.uk/guidance/immigration-rules/immigration-rules-appendix-skilled-occupations','official_immigration',null,2,'2026-08-10')
on conflict (profile_key,link_type,url) do update set
  label=excluded.label, provider_type=excluded.provider_type, region_code=excluded.region_code,
  sort_order=excluded.sort_order, source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_program_links (profile_key,program_ref,relation_type,source_checked_at) values
  ('UK:accountant','uk-program:d06ea684-e484-4283-70eb-b7d10fd7fc1b','direct','2026-08-10'),
  ('UK:accountant','uk-program:4185972b-fe61-ea99-0bab-056da05d9e19','direct','2026-08-10'),
  ('UK:accountant','uk-program:dea71cdb-fe88-00e2-bac0-cf8095b1eba5','direct','2026-08-10'),
  ('UK:auditor','uk-program:d06ea684-e484-4283-70eb-b7d10fd7fc1b','direct','2026-08-10'),
  ('UK:business-analyst','uk-program:d06ea684-e484-4283-70eb-b7d10fd7fc1b','direct','2026-08-10'),
  ('UK:business-analyst','uk-program:4ade9971-52f4-af52-718b-aa0d9ce785b5','direct','2026-08-10'),
  ('UK:business-analyst','uk-program:2bbd0e08-f3bd-b9fc-5f0e-61936caa4184','direct','2026-08-10'),
  ('UK:financial-analyst','uk-program:b3439615-4e49-5714-7b2b-7bd8ac662bc4','direct','2026-08-10'),
  ('UK:financial-analyst','uk-program:ee087516-e1f3-69e3-85c3-e8e03c170cd7','direct','2026-08-10'),
  ('UK:financial-analyst','uk-program:d06ea684-e484-4283-70eb-b7d10fd7fc1b','direct','2026-08-10'),
  ('UK:financial-analyst','uk-program:941b7dc6-4723-d613-798e-30d274beb134','direct','2026-08-10'),
  ('UK:human-resources-specialist','uk-program:f5701f63-9582-631e-27ce-5332b4eb20c1','direct','2026-08-10'),
  ('UK:marketing-specialist','uk-program:f46f5099-e367-d3d6-3bee-05b478a1c1ac','direct','2026-08-10'),
  ('UK:project-manager','uk-program:7e7dadd5-1276-1c94-b15f-87a34a9d4669','direct','2026-08-10'),
  ('UK:supply-chain-analyst','uk-program:28523c4e-d9d5-fc17-6285-31d09babbd46','direct','2026-08-10')
on conflict (profile_key,program_ref) do update set
  relation_type=excluded.relation_type, source_checked_at=excluded.source_checked_at;
