-- Sweden Construction / Trades occupation cohort.
-- Classification basis: Standard för svensk yrkesklassificering (SSYK) 2012.
-- Market scoring basis: SCB 2025 national median wages, Arbetsförmedlingen June 2026
-- Yrkesbarometer, Arbetsförmedlingen 2035 labour-shortage scenarios and current
-- Swedish Migration Agency work-permit salary rules checked 2026-08-12.
--
-- Sweden v2 keeps the shared 100-point CampCareer component envelope. Where a
-- reproducible posting-level vacancy ratio or YoY vacancy series is unavailable,
-- the component is not fabricated. For occupations with an exact June 2026
-- Yrkesbarometer match, current job-opportunity categories are used as a documented
-- vacancy-intensity proxy (large=15, medium=9, small=3) and five-year demand
-- direction is used as a vacancy-trend proxy (increase=10, unchanged=5, decrease=0).
-- Numeric growth_component remains zero until exact employment-growth series are
-- normalised. Group-level 2035 shortage evidence is explicitly labelled as such.

insert into public.country_occupation_profiles (
  profile_key,country_code,canonical_career_id,official_title,
  official_code_system,official_code_version,official_unit_group_code,currency,
  registration_required,registration_authority,registration_url,
  publication_status,source_checked_at,updated_at
) values
('SE:carpenter','SE','carpenter','Träarbetare, snickare m.fl.','SSYK','2012','7111','SEK',false,null,null,'profile_ready','2026-08-12',now()),
('SE:electrician','SE','electrician','Installations- och serviceelektriker','SSYK','2012','7411','SEK',false,'Elsäkerhetsverket — company self-audit and authorised installer regime','https://www.elsakerhetsverket.se/en/professionals/authorised-electricians/working-with-electrical-installations/','profile_ready','2026-08-12',now()),
('SE:plumber','SE','plumber','VVS-montörer m.fl.','SSYK','2012','7125','SEK',false,'Säker Vatten — industry authorisation, not a universal state occupational licence','https://sakervatten.se/branschregler2026/','profile_ready','2026-08-12',now()),
('SE:wall-floor-tiler','SE','wall-floor-tiler','Murare m.fl. — plattsättare scope','SSYK','2012','7112','SEK',false,null,null,'profile_ready','2026-08-12',now()),
('SE:welder','SE','welder','Svetsare och gasskärare','SSYK','2012','7212','SEK',false,null,null,'profile_ready','2026-08-12',now()),
('SE:bricklayer','SE','bricklayer','Murare m.fl. — murare scope','SSYK','2012','7112','SEK',false,null,null,'profile_ready','2026-08-12',now()),
('SE:hvac-technician','SE','hvac-technician','Kyl- och värmepumpstekniker m.fl.','SSYK','2012','7126','SEK',false,'Naturvårdsverket / certification bodies for covered F-gas activities','https://www.naturvardsverket.se/vagledning-och-stod/kemikalier/fluorerade-vaxthusgaser/stationar-kyl--luftkonditionerings--och-varmepumpsutrustning/','profile_ready','2026-08-12',now()),
('SE:construction-manager','SE','construction-manager','Driftchefer inom bygg, anläggning och gruva, nivå 2','SSYK','2012','1362','SEK',false,null,null,'profile_ready','2026-08-12',now())
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

insert into public.country_occupation_metric_snapshots (
  profile_key,as_of_date,annualised_median_salary,
  shortage_component,vacancy_intensity_component,employer_diversity_component,
  vacancy_trend_component,entry_level_component,salary_component,growth_component,
  visa_component,entry_burden_component,opportunity_score,
  score_methodology_version,score_status,score_evidence,source_checked_at
) values
(
  'SE:carpenter','2026-08-12',483600,
  18,0,4,0,13,7,0,7,3,52,
  'career-opportunity-se-v2','provisional',
  jsonb_build_object(
    'classification_scope','SSYK 7111 Träarbetare, snickare m.fl.',
    'salary_reference_year',2025,
    'median_monthly_salary_sek',40300,
    'national_median_monthly_salary_sek',38300,
    'salary_premium_pct',5.22,
    'work_permit_salary_floor_sek',34470,
    'work_permit_salary_headroom_pct',16.91,
    'shortage_basis','Arbetsförmedlingen 2035 scenario report places the broader SSYK3 carpenter/mason/construction-worker group in shortage in all four scenarios; unchanged matching implies roughly 12,600–13,100 missing workers and about 9 percent of 2023 employment. This is group-level evidence, not a fabricated SSYK4 vacancy count.',
    'current_outlook_basis','No exact June 2026 Yrkesbarometer national category was captured reproducibly for SSYK 7111, so vacancy-intensity and vacancy-trend points remain zero.',
    'employer_diversity_basis','Arbetsförmedlingen describes carpentry across new construction, rebuilding, renovation and some infrastructure/formwork contexts.',
    'entry_level_basis','Upper-secondary construction training followed by paid apprentice employment; Arbetsförmedlingen describes about three years as an employed apprentice before the trade certificate for the standard route.',
    'visa_basis','The 2025 occupation median is above the current general work-permit salary floor. The broader carpenter/mason/construction-worker group had the highest number of granted work permits among the analysed SSYK1=7 groups in 2023, around 870, although permits later fell materially; this supports a real but not frictionless third-country route.',
    'growth_status','not_scored_no_exact_numeric_employment_growth_series',
    'score_note','Provisional because exact posting-level vacancy intensity, vacancy YoY and numeric SSYK4 employment growth are not yet normalised.'
  ),'2026-08-12'
),
(
  'SE:electrician','2026-08-12',480000,
  20,9,5,10,13,6,0,9,2,74,
  'career-opportunity-se-v2','provisional',
  jsonb_build_object(
    'classification_scope','SSYK 7411 Installations- och serviceelektriker.',
    'salary_reference_year',2025,
    'median_monthly_salary_sek',40000,
    'national_median_monthly_salary_sek',38300,
    'salary_premium_pct',4.44,
    'work_permit_salary_floor_sek',34470,
    'work_permit_salary_headroom_pct',16.04,
    'shortage_basis','The broader SSYK3 installations/industrial-electrician group is in shortage in all four Arbetsförmedlingen 2035 scenarios, around 9 percent of 2023 employment under unchanged matching.',
    'yrkesbarometer_release','2026-06',
    'yrkesbarometer_current_opportunities','medium',
    'yrkesbarometer_five_year_demand','increase',
    'vacancy_intensity_proxy','June 2026 Yrkesbarometer medium national job opportunities mapped to 9/15 for Sweden v2.',
    'vacancy_trend_proxy','June 2026 Yrkesbarometer five-year demand increase mapped to 10/10; Arbetsförmedlingen links part of the increase to green-transition skill needs.',
    'employer_diversity_basis','Installation and service electrical work spans construction, building services and industrial/service employers.',
    'entry_level_basis','Structured vocational education and workplace learning provide a paid practical route.',
    'qualification_note','Commercial installation work can be performed by an authorised installer or by a worker covered by an electrical installation company self-audit scheme; every worker does not need personal authorisation.',
    'visa_basis','The occupation median is above the general work-permit salary floor. Arbetsförmedlingen reports that third-country work permits for the broader installations/industrial-electrician group rose about 80 percent from just over 130 in 2023 to just under 240 in 2025, a stronger migration signal than the other construction-trade groups reviewed.',
    'growth_status','not_scored_directional_forecast_is_kept_in_vacancy_trend',
    'score_note','Provisional until exact posting-level vacancy ratio and numeric employment-growth series are ingested.'
  ),'2026-08-12'
),
(
  'SE:plumber','2026-08-12',512400,
  20,9,4,10,13,7,0,7,3,73,
  'career-opportunity-se-v2','provisional',
  jsonb_build_object(
    'classification_scope','SSYK 7125 VVS-montörer m.fl.',
    'salary_reference_year',2025,
    'median_monthly_salary_sek',42700,
    'national_median_monthly_salary_sek',38300,
    'salary_premium_pct',11.49,
    'work_permit_salary_floor_sek',34470,
    'work_permit_salary_headroom_pct',23.88,
    'shortage_basis','The broader SSYK3 roof/floor/VVS group is in shortage in all four Arbetsförmedlingen 2035 scenarios; the report estimates roughly 5,000 missing workers, around 11 percent of 2023 employment, under unchanged matching. The number is not treated as SSYK 7125 alone.',
    'yrkesbarometer_release','2026-06',
    'yrkesbarometer_current_opportunities','medium',
    'yrkesbarometer_five_year_demand','increase',
    'vacancy_intensity_proxy','June 2026 Yrkesbarometer medium national opportunities for certified VVS installers mapped to 9/15.',
    'vacancy_trend_proxy','June 2026 five-year demand increase mapped to 10/10.',
    'employer_diversity_basis','VVS work covers housing, offices, hospitals, service/maintenance and industrial pipe contexts.',
    'entry_level_basis','Vocational VVS training and workplace learning create a structured practical pathway.',
    'qualification_note','Säker Vatten is an industry authorisation framework and is not represented as a universal state occupational licence.',
    'visa_basis','The occupation median is well above the general work-permit salary floor. The broader roof/floor/VVS group has had third-country work permits, but Arbetsförmedlingen reports a marked decline since 2023, so visa credit is positive but below electrician.',
    'growth_status','not_scored_directional_forecast_is_kept_in_vacancy_trend',
    'score_note','Provisional until exact posting-level vacancy ratio and numeric employment-growth series are ingested.'
  ),'2026-08-12'
),
(
  'SE:wall-floor-tiler','2026-08-12',506400,
  18,0,3,0,13,7,0,7,3,51,
  'career-opportunity-se-v2','provisional',
  jsonb_build_object(
    'classification_scope','Canonical wall/floor tiler maps inside SSYK 7112 Murare m.fl.; official titles include Kakelsättare, Klinkerläggare, Mosaikläggare and Plattsättare.',
    'salary_reference_year',2025,
    'median_monthly_salary_sek',42200,
    'national_median_monthly_salary_sek',38300,
    'salary_premium_pct',10.18,
    'work_permit_salary_floor_sek',34470,
    'work_permit_salary_headroom_pct',22.43,
    'shortage_basis','The broader SSYK3 carpenter/mason/construction-worker group is in shortage in all four 2035 scenarios, with roughly 12,600–13,100 missing workers under unchanged matching. Because the report is SSYK3, CampCareer does not claim that full number for tilers.',
    'current_outlook_basis','No exact June 2026 national Yrkesbarometer category for the tiler scope was captured reproducibly, so vacancy-intensity and vacancy-trend remain zero.',
    'employer_diversity_basis','Arbetsförmedlingen describes tiling across renovation and new production in homes and commercial premises.',
    'entry_level_basis','Vocational construction training plus supervised practical work and trade qualification form the normal entry route.',
    'visa_basis','The SSYK 7112 median is comfortably above the general work-permit salary floor. The broader carpenter/mason/construction-worker group has historically received work permits, though volumes fell after 2023.',
    'growth_status','not_scored_no_exact_numeric_employment_growth_series',
    'score_note','Provisional because SSYK 7112 wage and SSYK3 shortage evidence are broader than the canonical tiler scope and exact posting metrics are unavailable.'
  ),'2026-08-12'
),
(
  'SE:welder','2026-08-12',426000,
  20,15,5,10,14,4,0,5,3,76,
  'career-opportunity-se-v2','provisional',
  jsonb_build_object(
    'classification_scope','SSYK 7212 Svetsare och gasskärare.',
    'salary_reference_year',2025,
    'median_monthly_salary_sek',35500,
    'national_median_monthly_salary_sek',38300,
    'salary_premium_pct',-7.31,
    'work_permit_salary_floor_sek',34470,
    'work_permit_salary_headroom_pct',2.99,
    'shortage_basis','Exact June 2026 Yrkesbarometer evidence shows large current job opportunities for welders and gas cutters; this supports the maximum shortage signal without borrowing another SSYK3 groups 2035 deficit.',
    'yrkesbarometer_release','2026-06',
    'yrkesbarometer_current_opportunities','large',
    'yrkesbarometer_five_year_demand','increase',
    'vacancy_intensity_proxy','June 2026 large national job opportunities mapped to 15/15.',
    'vacancy_trend_proxy','June 2026 five-year demand increase mapped to 10/10.',
    'employer_diversity_basis','Arbetsförmedlingen places welding across manufacturing, construction/civil works, contractors, maintenance, bridges and industrial pipe systems.',
    'entry_level_basis','Practical vocational and labour-market training routes exist, with process competence developed through supervised work.',
    'qualification_note','There is no universal state welder licence, but jobs can require process- and standard-specific welder tests or qualifications.',
    'visa_basis','The median salary clears the current general work-permit floor by only about 3 percent, leaving much less salary headroom than the other reviewed trades. No equally strong occupation-specific work-permit trend was verified, so visa credit is deliberately moderate.',
    'growth_status','not_scored_directional_forecast_is_kept_in_vacancy_trend',
    'score_note','Strong demand score, but salary/visa headroom and lack of an exact numeric vacancy ratio keep the profile provisional.'
  ),'2026-08-12'
),
(
  'SE:bricklayer','2026-08-12',506400,
  18,0,3,0,13,7,0,7,3,51,
  'career-opportunity-se-v2','provisional',
  jsonb_build_object(
    'classification_scope','Bricklayer maps inside SSYK 7112 Murare m.fl.; Murare and Murarmästare are official titles.',
    'salary_reference_year',2025,
    'median_monthly_salary_sek',42200,
    'national_median_monthly_salary_sek',38300,
    'salary_premium_pct',10.18,
    'work_permit_salary_floor_sek',34470,
    'work_permit_salary_headroom_pct',22.43,
    'shortage_basis','The broader SSYK3 carpenter/mason/construction-worker group is in shortage in all four 2035 scenarios, with roughly 12,600–13,100 missing workers under unchanged matching. The group total is not relabelled as a bricklayer-only deficit.',
    'current_outlook_basis','No exact June 2026 national Yrkesbarometer category for the bricklayer scope was captured reproducibly, so vacancy-intensity and vacancy-trend remain zero.',
    'employer_diversity_basis','Bricklayers work across new construction, facade work, renovation, masonry and related site contexts.',
    'entry_level_basis','Arbetsförmedlingen describes upper-secondary construction training followed by about 2.5 years of apprentice employment before the standard trade certificate.',
    'visa_basis','The SSYK 7112 median is comfortably above the general work-permit salary floor, and the broader carpenter/mason/construction-worker group has meaningful historical work-permit usage, though volumes declined after 2023.',
    'growth_status','not_scored_no_exact_numeric_employment_growth_series',
    'score_note','Provisional because wage and long-term shortage evidence are broader than the canonical bricklayer slice and exact posting metrics are unavailable.'
  ),'2026-08-12'
),
(
  'SE:hvac-technician','2026-08-12',508800,
  18,0,5,0,12,7,0,7,2,51,
  'career-opportunity-se-v2','provisional',
  jsonb_build_object(
    'classification_scope','SSYK 7126 Kyl- och värmepumpstekniker m.fl.',
    'salary_reference_year',2025,
    'median_monthly_salary_sek',42400,
    'national_median_monthly_salary_sek',38300,
    'salary_premium_pct',10.70,
    'work_permit_salary_floor_sek',34470,
    'work_permit_salary_headroom_pct',23.01,
    'shortage_basis','The broader SSYK3 roof/floor/VVS group is in shortage in all four 2035 scenarios, around 5,000 workers or 11 percent of 2023 employment under unchanged matching. This is treated as group-level evidence because 7126 is only one occupation inside the group.',
    'current_outlook_basis','The current occupational page was verified for scope and training, but an exact June 2026 national opportunity category was not captured reproducibly, so vacancy-intensity and vacancy-trend remain zero.',
    'employer_diversity_basis','Arbetsförmedlingen describes refrigeration and heat-pump systems in properties, retail, industry, air conditioning, industrial processes, medical technology and ice facilities, often through installation/service firms.',
    'entry_level_basis','Upper-secondary training or post-secondary training up to two years is typical; YH technician education is about 1.5 years.',
    'qualification_note','Covered F-gas installation, leak checking, recovery, service and maintenance can require person certification and covered companies also require certification.',
    'visa_basis','The median salary is well above the general work-permit floor, but the broader roof/floor/VVS group saw falling third-country permit volumes after 2023 and F-gas certification adds occupational friction.',
    'growth_status','not_scored_no_exact_numeric_employment_growth_series',
    'score_note','Provisional because the strongest shortage evidence is SSYK3-level and exact posting metrics are not yet ingested.'
  ),'2026-08-12'
),
(
  'SE:construction-manager','2026-08-12',687600,
  20,0,5,0,6,10,0,10,2,53,
  'career-opportunity-se-v2','provisional',
  jsonb_build_object(
    'classification_scope','SSYK 1362 operational construction management including Byggplatschef, Platschef and Produktionschef titles.',
    'salary_reference_year',2025,
    'median_monthly_salary_sek',57300,
    'national_median_monthly_salary_sek',38300,
    'salary_premium_pct',49.61,
    'work_permit_salary_floor_sek',34470,
    'work_permit_salary_headroom_pct',66.23,
    'eu_blue_card_salary_floor_sek',53625,
    'eu_blue_card_median_headroom_pct',6.85,
    'shortage_basis','Arbetsförmedlingen identifies construction/civil/mining operating managers as a shortage group in all scenarios, with an unchanged-matching shortage up to roughly 2,000 by 2035 and shortages across all or nearly all counties.',
    'current_outlook_basis','No exact posting-level national vacancy ratio or June 2026 Yrkesbarometer category matching the scoped SSYK 1362 profile was captured, so vacancy-intensity and vacancy-trend remain zero.',
    'employer_diversity_basis','The official SSYK scope spans building, civil engineering and mining operational management and includes site and production management titles.',
    'entry_level_basis','This is not a true entry-level role; technical or built-environment study plus substantial project, site, contractor and people-management experience is commonly required.',
    'visa_basis','The 2025 median is far above the general work-permit floor and also above the EU Blue Card salary threshold effective 15 July 2026. Blue Card eligibility still requires highly qualified employment plus qualifying higher education or at least five years of relevant experience. Arbetsförmedlingen also finds persistent domestic labour shortfall in this management group, supporting the maximum visa-pathway score without treating salary alone as a permit guarantee.',
    'growth_status','not_scored_no_exact_numeric_employment_growth_series',
    'score_note','Provisional because exact vacancy ratio, vacancy trend and numeric employment-growth series are not yet normalised.'
  ),'2026-08-12'
)
on conflict (profile_key,as_of_date) do update set
  annualised_median_salary=excluded.annualised_median_salary,
  shortage_component=excluded.shortage_component,
  vacancy_intensity_component=excluded.vacancy_intensity_component,
  employer_diversity_component=excluded.employer_diversity_component,
  vacancy_trend_component=excluded.vacancy_trend_component,
  entry_level_component=excluded.entry_level_component,
  salary_component=excluded.salary_component,
  growth_component=excluded.growth_component,
  visa_component=excluded.visa_component,
  entry_burden_component=excluded.entry_burden_component,
  opportunity_score=excluded.opportunity_score,
  score_methodology_version=excluded.score_methodology_version,
  score_status=excluded.score_status,
  score_evidence=excluded.score_evidence,
  source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_specialisations (
  profile_key,official_code,official_title,shortage_rating,visa_eligible,
  included_in_rollup,sort_order,source_url,source_checked_at
) values
('SE:carpenter','7111','Träarbetare, snickare m.fl.',null,null,true,1,'https://ssyksok.scb.se/SsykSok/SSYK2012/7111','2026-08-12'),
('SE:electrician','7411','Installations- och serviceelektriker',null,null,true,1,'https://ssyksok.scb.se/SsykSok/SSYK2012/7411','2026-08-12'),
('SE:plumber','7125','VVS-montörer m.fl.',null,null,true,1,'https://ssyksok.scb.se/SsykSok/SSYK2012/7125','2026-08-12'),
('SE:wall-floor-tiler','7112','Murare m.fl. — plattsättare scope',null,null,true,1,'https://ssyksok.scb.se/SsykSok/SSYK2012/7112','2026-08-12'),
('SE:welder','7212','Svetsare och gasskärare',null,null,true,1,'https://ssyksok.scb.se/SsykSok/SSYK2012/7212','2026-08-12'),
('SE:bricklayer','7112','Murare m.fl. — murare scope',null,null,true,1,'https://ssyksok.scb.se/SsykSok/SSYK2012/7112','2026-08-12'),
('SE:hvac-technician','7126','Kyl- och värmepumpstekniker m.fl.',null,null,true,1,'https://ssyksok.scb.se/SsykSok/SSYK2012/7126','2026-08-12'),
('SE:construction-manager','1362','Driftchefer inom bygg, anläggning och gruva, nivå 2',null,null,true,1,'https://ssyksok.scb.se/SsykSok/SSYK2012/1362','2026-08-12')
on conflict (profile_key,official_code) do update set
  official_title=excluded.official_title,
  included_in_rollup=excluded.included_in_rollup,
  sort_order=excluded.sort_order,
  source_url=excluded.source_url,
  source_checked_at=excluded.source_checked_at;

-- Primary search surface.
insert into public.country_occupation_links (
  profile_key,link_type,label,url,provider_type,sort_order,source_checked_at
)
select p.profile_key,'job_search','Arbetsförmedlingen Platsbanken','https://arbetsformedlingen.se/platsbanken/','government_job_board',10,'2026-08-12'
from public.country_occupation_profiles p
where p.country_code='SE' and p.canonical_career_id in (
  'carpenter','electrician','plumber','wall-floor-tiler','welder','bricklayer','hvac-technician','construction-manager'
)
on conflict (profile_key,link_type,url) do update set
  label=excluded.label,provider_type=excluded.provider_type,
  sort_order=excluded.sort_order,source_checked_at=excluded.source_checked_at;

-- Shared official evidence for the cohort.
insert into public.country_occupation_links (
  profile_key,link_type,label,url,provider_type,sort_order,source_checked_at
)
select p.profile_key,'source','SCB SSYK 2012','https://ssyksok.scb.se/SsykSok/SSYK2012','official_classification',20,'2026-08-12'
from public.country_occupation_profiles p
where p.country_code='SE' and p.canonical_career_id in (
  'carpenter','electrician','plumber','wall-floor-tiler','welder','bricklayer','hvac-technician','construction-manager'
)
on conflict (profile_key,link_type,url) do update set
  label=excluded.label,provider_type=excluded.provider_type,
  sort_order=excluded.sort_order,source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_links (
  profile_key,link_type,label,url,provider_type,sort_order,source_checked_at
)
select p.profile_key,'source','SCB — 2025 median salary by SSYK','https://www.statistikdatabasen.scb.se/pxweb/sv/ssd/START__AM__AM0110__AM0110A/LoneSpridSektYrk4AN/','official_salary',21,'2026-08-12'
from public.country_occupation_profiles p
where p.country_code='SE' and p.canonical_career_id in (
  'carpenter','electrician','plumber','wall-floor-tiler','welder','bricklayer','hvac-technician','construction-manager'
)
on conflict (profile_key,link_type,url) do update set
  label=excluded.label,provider_type=excluded.provider_type,
  sort_order=excluded.sort_order,source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_links (
  profile_key,link_type,label,url,provider_type,sort_order,source_checked_at
)
select p.profile_key,'source','Arbetsförmedlingen — Yrkesbarometer June 2026','https://arbetsformedlingen.se/statistik/yrkes--och-kompetensanalyser','official_labour_market',22,'2026-08-12'
from public.country_occupation_profiles p
where p.country_code='SE' and p.canonical_career_id in (
  'carpenter','electrician','plumber','wall-floor-tiler','welder','bricklayer','hvac-technician','construction-manager'
)
on conflict (profile_key,link_type,url) do update set
  label=excluded.label,provider_type=excluded.provider_type,
  sort_order=excluded.sort_order,source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_links (
  profile_key,link_type,label,url,provider_type,sort_order,source_checked_at
)
select p.profile_key,'source','Arbetsförmedlingen — 2035 labour shortage and foreign labour','https://arbetsformedlingen.se/statistik/analyser-och-prognoser/analys-och-utvardering/2026/arbetskraftsunderskott-och-arbetskraft-fran-utlandet','official_labour_market',23,'2026-08-12'
from public.country_occupation_profiles p
where p.country_code='SE' and p.canonical_career_id in (
  'carpenter','electrician','plumber','wall-floor-tiler','welder','bricklayer','hvac-technician','construction-manager'
)
on conflict (profile_key,link_type,url) do update set
  label=excluded.label,provider_type=excluded.provider_type,
  sort_order=excluded.sort_order,source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_links (
  profile_key,link_type,label,url,provider_type,sort_order,source_checked_at
)
select p.profile_key,'source','Swedish Migration Agency — work-permit salary requirement','https://www.migrationsverket.se/en/word-explanations/salary-requirements-for-a-work-permit.html','official_visa',24,'2026-08-12'
from public.country_occupation_profiles p
where p.country_code='SE' and p.canonical_career_id in (
  'carpenter','electrician','plumber','wall-floor-tiler','welder','bricklayer','hvac-technician','construction-manager'
)
on conflict (profile_key,link_type,url) do update set
  label=excluded.label,provider_type=excluded.provider_type,
  sort_order=excluded.sort_order,source_checked_at=excluded.source_checked_at;

-- Exact June 2026 occupational outlook pages used as current demand proxies.
insert into public.country_occupation_links (
  profile_key,link_type,label,url,provider_type,sort_order,source_checked_at
) values
('SE:electrician','source','Arbetsförmedlingen — Installations- och serviceelektriker job opportunities','https://arbetsformedlingen.se/for-arbetssokande/vilket-yrke-passar-dig/hitta-yrken/yrkesgrupper/installations-och-serviceelektriker/jobbmojligheter','official_labour_market',25,'2026-08-12'),
('SE:plumber','source','Arbetsförmedlingen — VVS-montör job opportunities','https://arbetsformedlingen.se/for-arbetssokande/vilket-yrke-passar-dig/hitta-yrken/yrkesgrupper/vvs-montor-och-industrirormontor/jobbmojligheter','official_labour_market',25,'2026-08-12'),
('SE:welder','source','Arbetsförmedlingen — Svetsare job opportunities','https://arbetsformedlingen.se/for-arbetssokande/vilket-yrke-passar-dig/hitta-yrken/yrkesgrupper/svetsare/jobbmojligheter','official_labour_market',25,'2026-08-12')
on conflict (profile_key,link_type,url) do update set
  label=excluded.label,provider_type=excluded.provider_type,
  sort_order=excluded.sort_order,source_checked_at=excluded.source_checked_at;

-- Regulation and training evidence.
insert into public.country_occupation_links (
  profile_key,link_type,label,url,provider_type,sort_order,source_checked_at
) values
('SE:electrician','source','Elsäkerhetsverket — Working with electrical installations','https://www.elsakerhetsverket.se/en/professionals/authorised-electricians/working-with-electrical-installations/','official_regulator',30,'2026-08-12'),
('SE:plumber','source','Säker Vatten — Branschregler 2026:1','https://sakervatten.se/branschregler2026/','industry_regulator',30,'2026-08-12'),
('SE:hvac-technician','source','Naturvårdsverket — F-gas requirements','https://www.naturvardsverket.se/vagledning-och-stod/kemikalier/fluorerade-vaxthusgaser/stationar-kyl--luftkonditionerings--och-varmepumpsutrustning/','official_regulator',30,'2026-08-12'),
('SE:carpenter','source','Arbetsförmedlingen — Carpenter training route','https://arbetsformedlingen.se/for-arbetssokande/vilket-yrke-passar-dig/hitta-yrken/yrkesgrupper/traarbetare-snickare/utbildning','official_training',30,'2026-08-12'),
('SE:bricklayer','source','Arbetsförmedlingen — Bricklayer training route','https://arbetsformedlingen.se/for-arbetssokande/vilket-yrke-passar-dig/hitta-yrken/yrkesgrupper/murare/utbildning','official_training',30,'2026-08-12'),
('SE:hvac-technician','source','Arbetsförmedlingen — Refrigeration and heat-pump technician training','https://arbetsformedlingen.se/for-arbetssokande/vilket-yrke-passar-dig/hitta-yrken/yrkesgrupper/kyl-och-varmepumptekniker/utbildning','official_training',31,'2026-08-12'),
('SE:construction-manager','source','Swedish Migration Agency — EU Blue Card','https://www.migrationsverket.se/en/you-want-to-apply/work/employee-or-self-employed/eu-blue-cards.html','official_visa',30,'2026-08-12')
on conflict (profile_key,link_type,url) do update set
  label=excluded.label,provider_type=excluded.provider_type,
  sort_order=excluded.sort_order,source_checked_at=excluded.source_checked_at;
