-- Canada Programs Phase 3: occupation-priority verification queue.
-- Keeps heuristic matching internal. No rows are published to the user-facing catalogue here.

create table if not exists public.program_occupation_match_rules (
  country_code text not null check (country_code ~ '^[A-Z]{2}$'),
  canonical_career_id text not null,
  title_pattern text not null,
  rule_version text not null,
  review_status text not null check (review_status in ('approved','review_required','retired')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (country_code, canonical_career_id, rule_version)
);

create table if not exists public.program_occupation_ca_staging (
  program_catalog_id bigint not null references public.program_catalog_ca_staging(id) on delete cascade,
  canonical_career_id text not null,
  rule_version text not null,
  match_basis text not null default 'title' check (match_basis in ('title','field','credential','manual')),
  match_pattern text not null,
  review_status text not null default 'candidate' check (review_status in ('candidate','approved','rejected')),
  relation_type text check (relation_type is null or relation_type in ('direct','common_pathway','related')),
  source_checked_at date,
  reviewer_note text,
  matched_at timestamptz not null default now(),
  reviewed_at timestamptz,
  primary key (program_catalog_id, canonical_career_id)
);

create index if not exists program_occupation_ca_staging_career_idx
  on public.program_occupation_ca_staging (canonical_career_id, review_status);
create index if not exists program_occupation_ca_staging_review_idx
  on public.program_occupation_ca_staging (review_status, program_catalog_id);

alter table public.program_occupation_match_rules enable row level security;
alter table public.program_occupation_ca_staging enable row level security;

revoke all on table public.program_occupation_match_rules from anon, authenticated;
revoke all on table public.program_occupation_ca_staging from anon, authenticated;
grant select, insert, update, delete on table public.program_occupation_match_rules to service_role;
grant select, insert, update, delete on table public.program_occupation_ca_staging to service_role;

insert into public.program_occupation_match_rules
  (country_code, canonical_career_id, title_pattern, rule_version, review_status)
values
  ('CA', 'carpenter', '(carpent|joiner|joinery|woodwork)', 'v1', 'approved'),
  ('CA', 'electrician', '(electrician|electrical techniques|electrical construction|electrotechn)', 'v1', 'approved'),
  ('CA', 'plumber', '(plumb|pipefitt|gas technician)', 'v1', 'approved'),
  ('CA', 'wall-floor-tiler', '(tiling|tile setting|tilesetter|ceramic tile)', 'v1', 'approved'),
  ('CA', 'welder', '(weld|metal fabrication|fabrication technician)', 'v1', 'approved'),
  ('CA', 'bricklayer', '(bricklay|masonry|brick and stone)', 'v1', 'approved'),
  ('CA', 'hvac-technician', '(hvac|heating.*refrigeration|refrigeration.*air conditioning|air conditioning|heating ventilation)', 'v1', 'approved'),
  ('CA', 'construction-manager', '(construction management|construction project management|building construction management)', 'v1', 'approved'),
  ('CA', 'registered-nurse', '(nursing|registered nursing)', 'v1', 'approved'),
  ('CA', 'midwife', '(midwif)', 'v1', 'approved'),
  ('CA', 'care-worker', '(personal support worker|continuing care assistant|health care assistant|aged care|community support|disability support|support worker)', 'v1', 'approved'),
  ('CA', 'physiotherapist', '(physiotherap|physical therap)', 'v1', 'approved'),
  ('CA', 'medical-laboratory-technician', '(medical laboratory|laboratory technology|laboratory technician)', 'v1', 'approved'),
  ('CA', 'radiographer', '(radiograph|medical radiation|medical imaging|diagnostic imaging)', 'v1', 'approved'),
  ('CA', 'pharmacist', '(pharmacy|pharm.?d|pharmaceutical sciences)', 'v1', 'approved'),
  ('CA', 'occupational-therapist', '(occupational therap)', 'v1', 'approved'),
  ('CA', 'software-developer', '(software engineering|software development|computer science|computing science|computer programming|application development)', 'v1', 'approved'),
  ('CA', 'data-analyst', '(data analytics|data analysis|data science|business intelligence|analytics)', 'v1', 'approved'),
  ('CA', 'data-engineer', '(data engineering|big data|data science|cloud data)', 'v1', 'approved'),
  ('CA', 'cybersecurity-analyst', '(cybersecurity|cyber security|information security)', 'v1', 'approved'),
  ('CA', 'network-administrator', '(network administration|network engineering|networking|systems administration)', 'v1', 'approved'),
  ('CA', 'cloud-engineer', '(cloud computing|cloud engineering|cloud architecture)', 'v1', 'approved'),
  ('CA', 'database-administrator', '(database administration|database management|database systems)', 'v1', 'approved'),
  ('CA', 'ict-support-technician', '(it support|information technology support|computer support|help desk|systems technician)', 'v1', 'approved'),
  ('CA', 'civil-engineer', '(civil engineering|structural engineering)', 'v1', 'approved'),
  ('CA', 'mechanical-engineer', '(mechanical engineering|mechatronic)', 'v1', 'approved'),
  ('CA', 'electrical-engineer', '(electrical engineering|electronics engineering)', 'v1', 'approved'),
  ('CA', 'manufacturing-engineer', '(manufacturing engineering|manufacturing systems)', 'v1', 'approved'),
  ('CA', 'industrial-engineer', '(industrial engineering)', 'v1', 'approved'),
  ('CA', 'chemical-engineer', '(chemical engineering)', 'v1', 'approved'),
  ('CA', 'environmental-engineer', '(environmental engineering)', 'v1', 'approved'),
  ('CA', 'engineering-technician', '(engineering technology|engineering technician|engineering technologist)', 'v1', 'approved'),
  ('CA', 'accountant', '(accounting|accountancy)', 'v1', 'approved'),
  ('CA', 'financial-analyst', '(finance|financial management|financial analytics|investment management)', 'v1', 'approved'),
  ('CA', 'business-analyst', '(business analytics|business analysis|management analytics)', 'v1', 'approved'),
  ('CA', 'supply-chain-analyst', '(supply chain|logistics|operations management)', 'v1', 'approved'),
  ('CA', 'human-resources-specialist', '(human resources|human resource management|hr management)', 'v1', 'approved'),
  ('CA', 'marketing-specialist', '(marketing|digital marketing)', 'v1', 'approved'),
  ('CA', 'auditor', '(audit|auditing|forensic accounting)', 'v1', 'approved'),
  ('CA', 'project-manager', '(project management)', 'v1', 'approved'),
  ('CA', 'early-childhood-teacher', '(early childhood education|early childhood teaching|early learning|childhood education)', 'v1', 'approved'),
  ('CA', 'primary-school-teacher', '(elementary education|primary education|teacher education.*elementary)', 'v1', 'approved'),
  ('CA', 'secondary-school-teacher', '(secondary education|teacher education.*secondary)', 'v1', 'approved'),
  ('CA', 'special-education-teacher', '(special education|inclusive education)', 'v1', 'approved'),
  ('CA', 'social-worker', '(social work)', 'v1', 'approved'),
  ('CA', 'youth-worker', '(youth work|child and youth care)', 'v1', 'approved'),
  ('CA', 'community-worker', '(community service|community development|social service worker)', 'v1', 'approved'),
  ('CA', 'counsellor', '(counsell|counseling|psychotherapy)', 'v1', 'approved'),
  ('CA', 'environmental-scientist', '(environmental science|environmental studies)', 'v1', 'approved'),
  ('CA', 'agronomist', '(agronom|crop science|plant science|agricultural science)', 'v1', 'approved'),
  ('CA', 'farm-manager', '(farm management|agribusiness|agricultural business)', 'v1', 'approved'),
  ('CA', 'forestry-technician', '(forestry|forest technology|forest technician)', 'v1', 'approved'),
  ('CA', 'food-technologist', '(food science|food technology|food processing)', 'v1', 'approved'),
  ('CA', 'sustainability-specialist', '(sustainab|sustainable development|environmental management)', 'v1', 'approved'),
  ('CA', 'horticulturist', '(horticultur)', 'v1', 'approved'),
  ('CA', 'animal-science-technician', '(animal science|animal health|veterinary technician|veterinary technology)', 'v1', 'approved'),
  ('CA', 'graphic-designer', '(graphic design)', 'v1', 'approved'),
  ('CA', 'ux-designer', '(user experience|ux design|interaction design)', 'v1', 'approved'),
  ('CA', 'multimedia-designer', '(multimedia|interactive media|digital media)', 'v1', 'approved'),
  ('CA', 'animator', '(animation|3d animation)', 'v1', 'approved'),
  ('CA', 'interior-designer', '(interior design)', 'v1', 'approved'),
  ('CA', 'film-editor', '(film production|video production|post production|film editing|video editing)', 'v1', 'approved'),
  ('CA', 'architect', '(^architecture$|architecture,|architectural studies|master of architecture|bachelor of architectural)', 'v1', 'approved'),
  ('CA', 'web-designer', '(web design|interactive web)', 'v1', 'approved'),
  ('CA', 'chef', '(culinary arts|culinary management|professional cooking|commercial cookery|chef)', 'v1', 'approved'),
  ('CA', 'cook', '(culinary arts|cooking|cook)', 'v1', 'approved'),
  ('CA', 'hotel-manager', '(hotel management|hospitality management)', 'v1', 'approved'),
  ('CA', 'restaurant-manager', '(restaurant management|food and beverage management|hospitality management)', 'v1', 'approved'),
  ('CA', 'baker', '(baking|bakery|pastry)', 'v1', 'approved'),
  ('CA', 'tourism-manager', '(tourism management|tourism and hospitality)', 'v1', 'approved'),
  ('CA', 'event-planner', '(event management|event planning)', 'v1', 'approved'),
  ('CA', 'hospitality-supervisor', '(hospitality management|food service management|hospitality operations)', 'v1', 'approved'),
  ('CA', 'truck-driver', '(truck driving|commercial driver)', 'v1', 'approved'),
  ('CA', 'logistics-coordinator', '(logistics|supply chain)', 'v1', 'approved'),
  ('CA', 'aircraft-maintenance-technician', '(aircraft maintenance|aviation maintenance|aircraft technician)', 'v1', 'approved'),
  ('CA', 'commercial-pilot', '(commercial aviation|professional pilot|flight training|aviation.*pilot)', 'v1', 'approved'),
  ('CA', 'marine-engineer', '(marine engineering)', 'v1', 'approved'),
  ('CA', 'deck-officer', '(nautical science|marine navigation|deck officer|bridge watch)', 'v1', 'approved'),
  ('CA', 'warehouse-manager', '(warehouse management|warehousing|logistics|supply chain)', 'v1', 'approved'),
  ('CA', 'automotive-service-technician', '(automotive service|automotive technician|automotive technology|motor vehicle)', 'v1', 'approved')
on conflict (country_code, canonical_career_id, rule_version) do update
set title_pattern = excluded.title_pattern,
    review_status = excluded.review_status,
    updated_at = now();

with eligible as (
  select c.id, c.title
  from public.program_catalog_ca_staging c
  left join public.program_pgwp_ca_staging p on p.program_catalog_id = c.id
  where nullif(btrim(c.title), '') is not null
    and nullif(btrim(c.source_url), '') is not null
    and (c.source_as_of is not null or c.collected_at is not null)
    and nullif(btrim(p.matched_dli_number), '') is not null
    and p.international_students_eligible is true
    and lower(coalesce(c.source_status, '')) !~ '(excluded_|suspended|not_accepting|pending_review|cancelled|legacy_|one_time_delivery_closed|parent_program_multiple_credentials)'
    and lower(coalesce(p.international_program_admission_status, '')) !~ '(not_assessed_non_core|suspended|cancelled|not_accepting|not currently|not_current|unavailable|restricted_not_open|temporarily_paused|not_eligible_for_study_permit|legacy_program)'
)
insert into public.program_occupation_ca_staging
  (program_catalog_id, canonical_career_id, rule_version, match_basis, match_pattern)
select e.id, r.canonical_career_id, r.rule_version, 'title', r.title_pattern
from eligible e
join public.program_occupation_match_rules r
  on r.country_code = 'CA'
 and r.rule_version = 'v1'
 and r.review_status = 'approved'
 and lower(e.title) ~ r.title_pattern
on conflict (program_catalog_id, canonical_career_id) do update
set rule_version = excluded.rule_version,
    match_basis = excluded.match_basis,
    match_pattern = excluded.match_pattern,
    matched_at = now();