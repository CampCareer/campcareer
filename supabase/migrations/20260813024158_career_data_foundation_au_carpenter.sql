-- Australia × Carpenter Career Data Foundation.
-- Reuses the frozen 100-point Opportunity Score v1 / v4 formula from US Carpenter.
-- Legacy AU Carpenter rows remain regression/reference only and are not fact sources.

insert into public.career_foundation_profiles
(profile_key,country_code,canonical_occupation_id,currency,decision_ready,decision_readiness_reason,source_checked_on)
values
('AU:carpenter','AU','carpenter','AUD',true,
 'All 9 Opportunity Score components are evaluated under CampCareer methodology v1. Official exact Carpenter data are used where available; ANZSCO 3312 Carpenters and Joiners is an explicit broader proxy where current official 6-digit statistics do not publish the required wage, historical growth, vacancy or projection metric.',
 '2026-08-13')
on conflict (profile_key) do update set
 country_code=excluded.country_code,canonical_occupation_id=excluded.canonical_occupation_id,currency=excluded.currency,
 decision_ready=excluded.decision_ready,decision_readiness_reason=excluded.decision_readiness_reason,
 source_checked_on=excluded.source_checked_on,updated_at=now();

insert into public.career_official_sources
(source_key,authority,title,url,source_type,last_verified_on,notes)
values
('au-abs-osca-2024','Australian Bureau of Statistics','OSCA 2024 v1 - Carpenter 372132','https://www.abs.gov.au/statistics/classifications/osca-occupation-standard-classification-australia/2024-version-1-0/browse-classification/3/37/372/3721/372132','official_primary','2026-08-13','Primary current Australian occupation mapping.'),
('au-abs-anzsco-2022','Australian Bureau of Statistics','ANZSCO latest release','https://www.abs.gov.au/statistics/classifications/australian-and-new-zealand-standard-classification-occupations/latest-release','official_primary','2026-08-13','Companion classification retained because current JSA labour-market series still publish ANZSCO occupation statistics.'),
('au-jsa-occupation-331212','Jobs and Skills Australia','Occupation profile - Carpenter 331212','https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupations/331212-carpenters','government_aggregator','2026-08-13','Exact Carpenter profile.'),
('au-jsa-occupation-3312','Jobs and Skills Australia','Occupation profile - Carpenters and Joiners 3312','https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupations/3312-carpenters-and-joiners','government_aggregator','2026-08-13','Broader official unit group used only where exact Carpenter metrics are unavailable.'),
('au-jsa-osl-2025','Jobs and Skills Australia','2025 Occupation Shortage List','https://www.jobsandskills.gov.au/data/occupation-shortage/occupation-shortage-list','government_aggregator','2026-08-13','Official point-in-time shortage assessment.'),
('au-yourcareer-matrix-2024','Australian Government Your Career','Australian Jobs 2025 Occupation Matrix','https://www.yourcareer.gov.au/resources/australian-jobs-report/occupation-matrix-tables','government_aggregator','2026-08-13','Official five-year historical occupation employment change.'),
('au-abs-lfs-detailed','Australian Bureau of Statistics','Labour Force, Australia, Detailed','https://www.abs.gov.au/statistics/labour/employment-and-unemployment/labour-force-australia-detailed/latest-release','official_primary','2026-08-13','Official national employment benchmark for actual momentum.'),
('au-jsa-ivi-2026','Jobs and Skills Australia','Internet Vacancy Index','https://www.jobsandskills.gov.au/data/internet-vacancy-index','government_aggregator','2026-08-13','Online job-ad series covering SEEK, CareerOne and Workforce Australia; a recruitment proxy rather than all vacancies.'),
('au-jsa-projections-2025-2035','Jobs and Skills Australia','Employment Projections - May 2025 to May 2035','https://www.jobsandskills.gov.au/data/employment-projections','government_aggregator','2026-08-13','Official occupation and national employment projections.'),
('au-training-cpc30220','Australian Government National Training Register','CPC30220 Certificate III in Carpentry','https://training.gov.au/Training/Details/CPC30220','official_primary','2026-08-13','Current trade qualification and apprenticeship pathway evidence.'),
('au-homeaffairs-189','Australian Government Department of Home Affairs','Skilled Independent visa (subclass 189)','https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189','official_primary','2026-08-13','Permanent points-tested skilled route without employer sponsorship.'),
('au-homeaffairs-skillselect-2026','Australian Government Department of Home Affairs','SkillSelect invitation rounds','https://immi.homeaffairs.gov.au/visas/working-in-australia/skillselect/invitation-rounds','official_primary','2026-08-13','Carpenter appears in the 4 June 2026 subclass 189 invitation round.'),
('au-homeaffairs-482','Australian Government Department of Home Affairs','Skills in Demand visa (subclass 482)','https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skills-in-demand-482','official_primary','2026-08-13','Employer-sponsored secondary skilled-work pathway.'),
('au-tra-carpenter','Trades Recognition Australia','TRA RTO Finder / Carpenter skills assessment','https://www.tradesrecognitionaustralia.gov.au/rto-finder','official_service','2026-08-13','Official trade skills-assessment pathway evidence.'),
('au-nsw-carpentry-licensing','NSW Government','Carpentry building and trade licensing','https://www.nsw.gov.au/business-and-economy/licences-and-credentials/building-and-trade-licences-and-registrations/categories-of-work/carpentry','official_primary','2026-08-13','Subnational carpentry contracting/licensing evidence.'),
('au-wa-carpenter-work','Government of Western Australia','Carpenter - Build a life in WA','https://buildalife.wa.gov.au/carpenter','official_primary','2026-08-13','Employee versus contractor licensing distinction and apprenticeship/white-card information.'),
('au-workforce-australia-jobs','Australian Government Workforce Australia','Find a job - Carpenter','https://www.workforceaustralia.gov.au/individuals/jobs/search?searchText=carpenter','official_service','2026-08-13','Government live job-search entry point; individual listings are not Vacancy Score observations.')
on conflict (source_key) do update set
 authority=excluded.authority,title=excluded.title,url=excluded.url,source_type=excluded.source_type,
 last_verified_on=excluded.last_verified_on,notes=excluded.notes;

insert into public.career_occupation_mappings
(mapping_key,profile_key,canonical_occupation_id,country_code,official_taxonomy,official_taxonomy_version,official_code,official_title,mapping_relation,mapping_quality,rationale,source_key,source_url,verified_on,is_primary)
values
('AU:carpenter:OSCA:372132','AU:carpenter','carpenter','AU','OSCA','2024 v1','372132','Carpenter','exact','high','Current ABS OSCA exact occupation.','au-abs-osca-2024','https://www.abs.gov.au/statistics/classifications/osca-occupation-standard-classification-australia/2024-version-1-0/browse-classification/3/37/372/3721/372132','2026-08-13',true),
('AU:carpenter:ANZSCO:331212','AU:carpenter','carpenter','AU','ANZSCO','2022','331212','Carpenter','exact','high','Exact companion ANZSCO occupation for JSA series.','au-abs-anzsco-2022','https://www.abs.gov.au/statistics/classifications/australian-and-new-zealand-standard-classification-occupations/latest-release','2026-08-13',false),
('AU:carpenter:ANZSCO:3312','AU:carpenter','carpenter','AU','ANZSCO','2022','3312','Carpenters and Joiners','broader','medium','Used only when the required official statistic is not published separately for Carpenter 331212.','au-jsa-occupation-3312','https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupations/3312-carpenters-and-joiners','2026-08-13',false)
on conflict (mapping_key) do update set
 profile_key=excluded.profile_key,canonical_occupation_id=excluded.canonical_occupation_id,country_code=excluded.country_code,
 official_taxonomy=excluded.official_taxonomy,official_taxonomy_version=excluded.official_taxonomy_version,
 official_code=excluded.official_code,official_title=excluded.official_title,mapping_relation=excluded.mapping_relation,
 mapping_quality=excluded.mapping_quality,rationale=excluded.rationale,source_key=excluded.source_key,
 source_url=excluded.source_url,verified_on=excluded.verified_on,is_primary=excluded.is_primary;

insert into public.career_raw_observations
(observation_key,profile_key,mapping_key,source_key,metric_key,reference_period,as_of_date,raw_value,unit,availability,reason,directness,mapping_quality,proxy_reason,source_type,quality,confidence,last_verified_on,explanation)
values
('au-carpenter-employment-exact-2026','AU:carpenter','AU:carpenter:ANZSCO:331212','au-jsa-occupation-331212','employment_total','February 2026 JSA trend','2026-02-01',to_jsonb(104900),'persons','available',null,'direct','high',null,'government_aggregator','high',0.95,'2026-08-13','Exact Carpenter employment stock.'),
('au-carpenters-joiners-employment-2026','AU:carpenter','AU:carpenter:ANZSCO:3312','au-jsa-occupation-3312','proxy_employment_total','February 2026 JSA trend','2026-02-01',to_jsonb(149600),'persons','available',null,'proxy','medium','Required vacancy/wage/projection metrics are published at 3312 rather than exact Carpenter.','government_aggregator','high',0.90,'2026-08-13','Broader group employment stock used only with other 3312 metrics.'),
('au-carpenter-shortage-2025','AU:carpenter','AU:carpenter:OSCA:372132','au-jsa-osl-2025','national_shortage_signal','2025 OSL','2025-10-15',jsonb_build_object('source_label','Shortage','normalized_severity','shortage','scope','national'),'status','available',null,'direct','high',null,'government_aggregator','medium',0.90,'2026-08-13','2025 OSL classifies Carpenter as Shortage nationally.'),
('au-carpenters-joiners-ivi-may-2026','AU:carpenter','AU:carpenter:ANZSCO:3312','au-jsa-ivi-2026','national_vacancy_intensity','May 2026, 3-month average','2026-05-31',jsonb_build_object('three_month_average_online_job_ads',1002,'yoy_pct',1,'clean_distinct_90_day_numerator',false),'online_job_advertisements','available','The IVI occupation value is a 3-month average, not a clean distinct 90-day posting count.','proxy','medium','ANZSCO 3312 is broader than exact Carpenter and the IVI series is not a distinct 90-day numerator.','government_aggregator','medium',0.78,'2026-08-13','Used through the conservative vacancy fallback rubric.'),
('au-carpenters-joiners-industry-2026','AU:carpenter','AU:carpenter:ANZSCO:3312','au-jsa-occupation-3312','industry_employment_distribution','2026 occupation profile','2026-02-01',jsonb_build_object('published_industries',jsonb_build_array('Construction','Manufacturing'),'shares_available',false),'industries','available','Industry shares required for common-sector HHI are not published.','proxy','medium','The official 3312 profile names industries but does not provide usable employment shares.','government_aggregator','medium',0.75,'2026-08-13','No industry allocations are invented.'),
('au-carpenters-joiners-growth-2019-2024','AU:carpenter','AU:carpenter:ANZSCO:3312','au-yourcareer-matrix-2024','actual_employment_growth_5y','November 2019 to November 2024','2024-11-30',jsonb_build_object('end_employment',143900,'change',13200,'change_pct',10.1,'years',5),'persons','available',null,'proxy','medium','Five-year history is published at 3312 rather than exact Carpenter.','government_aggregator','high',0.90,'2026-08-13','Occupation matrix reports 143.9k employed and +10.1% five-year change.'),
('au-all-employment-nov-2019','AU:carpenter',null,'au-abs-lfs-detailed','actual_all_employment','November 2019 trend','2019-11-30',to_jsonb(12898900),'persons','available',null,'direct','not_applicable',null,'official_primary','high',0.97,'2026-08-13','National employment start benchmark.'),
('au-all-employment-nov-2024','AU:carpenter',null,'au-abs-lfs-detailed','actual_all_employment','November 2024 trend','2024-11-30',to_jsonb(14495900),'persons','available',null,'direct','not_applicable',null,'official_primary','high',0.97,'2026-08-13','National employment end benchmark.'),
('au-carpenters-joiners-hourly-wage-2025','AU:carpenter','AU:carpenter:ANZSCO:3312','au-jsa-occupation-3312','median_hourly_wage','May 2025','2025-05-01',to_jsonb(45),'AUD_per_hour','available',null,'proxy','medium','Exact Carpenter median is unavailable; 3312 official median is used.','government_aggregator','high',0.90,'2026-08-13','Median hourly earnings for Carpenters and Joiners.'),
('au-all-hourly-wage-2025','AU:carpenter',null,'au-jsa-occupation-3312','all_occupations_median_hourly_wage','May 2025','2025-05-01',to_jsonb(47),'AUD_per_hour','available',null,'direct','not_applicable',null,'government_aggregator','high',0.97,'2026-08-13','Same-source all-occupations hourly median.'),
('au-carpenters-joiners-projection-2025-2035','AU:carpenter','AU:carpenter:ANZSCO:3312','au-jsa-projections-2025-2035','projected_occupation_employment_levels','May 2025 to May 2035','2025-05-01',jsonb_build_object('employment_2025',149259,'employment_2035',165554,'years',10),'persons','available',null,'proxy','medium','Official projection is at 3312 rather than exact Carpenter.','government_aggregator','medium',0.85,'2026-08-13','JSA projection: 149,259 to 165,554.'),
('au-all-projection-2025-2035','AU:carpenter',null,'au-jsa-projections-2025-2035','projected_all_employment_levels','May 2025 to May 2035','2025-05-01',jsonb_build_object('employment_2025',14701000,'employment_2035',16655500,'years',10),'persons','available',null,'direct','not_applicable',null,'government_aggregator','high',0.98,'2026-08-13','JSA national projection: 14.7010m to 16.6555m.'),
('au-carpentry-qualification-entry','AU:carpenter','AU:carpenter:OSCA:372132','au-training-cpc30220','entry_education_training','Current CPC30220','2026-08-13',jsonb_build_object('qualification','CPC30220 Certificate III in Carpentry','entry_requirements','none','apprenticeship_pathway',true),'qualification','available',null,'proxy','high','CampCareer converts official typical-entry/training evidence into the frozen Entry Accessibility rubric.','official_primary','high',0.94,'2026-08-13','CPC30220 has no qualification entry requirements and is suitable for an apprenticeship pathway.'),
('au-carpentry-paid-apprenticeship','AU:carpenter','AU:carpenter:OSCA:372132','au-wa-carpenter-work','paid_training_structure','Current pathway','2026-08-13',jsonb_build_object('duration_years',4,'employment_linked',true,'paid',true),'apprenticeship','available',null,'proxy','medium','Government trade pathway evidence supports earn-while-you-learn scoring rather than treating total duration as pre-entry study.','official_primary','medium',0.85,'2026-08-13','Four-year apprenticeship / Certificate III pathway.'),
('au-visa-189-carpenter','AU:carpenter','AU:carpenter:ANZSCO:331212','au-homeaffairs-skillselect-2026','visa_pathway_evidence','4 June 2026 invitation round','2026-06-04',jsonb_build_object('subclass','189','occupation','Carpenter','minimum_invited_points',65,'permanent',true,'employer_sponsor_required',false),'visa','available',null,'proxy','high','Official visa structure is converted to the occupation-level Visa Accessibility rubric; individual eligibility is separate.','official_primary','high',0.92,'2026-08-13','Carpenter appears in an official subclass 189 invitation round.'),
('au-carpentry-white-card','AU:carpenter','AU:carpenter:OSCA:372132','au-training-cpc30220','employee_regulatory_requirement','Current','2026-08-13',jsonb_build_object('requirement','general construction induction training / white card','mandatory_for_construction_work',true),'certification','available',null,'proxy','high','CampCareer maps mandatory construction induction into Entry Burden; it is safety certification, not a Carpenter occupational licence.','official_primary','high',0.94,'2026-08-13','General construction induction training is required for construction work.')
on conflict (observation_key) do update set
 profile_key=excluded.profile_key,mapping_key=excluded.mapping_key,source_key=excluded.source_key,metric_key=excluded.metric_key,
 reference_period=excluded.reference_period,as_of_date=excluded.as_of_date,raw_value=excluded.raw_value,unit=excluded.unit,
 availability=excluded.availability,reason=excluded.reason,directness=excluded.directness,mapping_quality=excluded.mapping_quality,
 proxy_reason=excluded.proxy_reason,source_type=excluded.source_type,quality=excluded.quality,confidence=excluded.confidence,
 last_verified_on=excluded.last_verified_on,explanation=excluded.explanation;

insert into public.career_normalized_metrics
(normalized_metric_key,profile_key,metric_key,input_observation_refs,normalized_value,normalized_unit,formula_version,availability,reason,directness,mapping_quality,proxy_reason,source_type,quality,confidence,explanation)
values
('AU:carpenter:shortage_points_v1','AU:carpenter','shortage_points',array['au-carpenter-shortage-2025'],12,'points','normalize-shortage-v1','available',null,'direct','high',null,'government_aggregator','medium',0.90,'Shortage severity 12 × national scope 1.00 = 12.'),
('AU:carpenter:vacancy_fallback_points_v1','AU:carpenter','vacancy_fallback_points',array['au-carpenters-joiners-ivi-may-2026','au-carpenters-joiners-employment-2026'],4,'points','normalize-vacancy-90d-v1','available','No clean distinct 90-day numerator exists.','proxy','medium','3312 is broader and the IVI value is a 3-month average rather than a distinct 90-day numerator.','government_aggregator','medium',0.75,'Low fallback intensity 3 + repeated-period persistence 1 = 4.'),
('AU:carpenter:industry_diversity_points_v1','AU:carpenter','industry_diversity_points',array['au-carpenters-joiners-industry-2026'],0,'points','normalize-industry-diversity-v1','available','Comparable broad-sector employment shares are not published.','proxy','medium','Official profile names industries but does not publish usable shares for HHI.','government_aggregator','medium',0.72,'Conservative 0 with insufficient_industry_coverage; not a claim of maximum concentration.'),
('AU:carpenter:employment_momentum_excess_cagr_pp_v1','AU:carpenter','employment_momentum_excess_cagr_pp',array['au-carpenters-joiners-growth-2019-2024','au-all-employment-nov-2019','au-all-employment-nov-2024'],-0.4189258298143761,'percentage_points_per_year','normalize-employment-momentum-v1','available',null,'proxy','medium','Occupation history is available at broader ANZSCO 3312.','government_aggregator','medium',0.84,'Occupation CAGR about 1.9430%/yr versus national 2.3619%/yr; excess -0.4189pp/yr.'),
('AU:carpenter:entry_accessibility_points_v1','AU:carpenter','entry_accessibility_points',array['au-carpentry-qualification-entry','au-carpentry-paid-apprenticeship'],14,'points','normalize-entry-accessibility-v1','available',null,'proxy','high','CampCareer proxy built from official typical-entry and apprenticeship structure.','official_primary','high',0.90,'Education 7 + no prior related experience required 3 + paid employment-linked apprenticeship 4 = 14.'),
('AU:carpenter:relative_salary_ratio_v1','AU:carpenter','relative_salary_ratio',array['au-carpenters-joiners-hourly-wage-2025','au-all-hourly-wage-2025'],0.9574468085106383,'ratio','normalize-relative-salary-v1','available',null,'proxy','medium','Exact Carpenter wage unavailable; 3312 official median is the broader proxy.','government_aggregator','high',0.90,'AUD45 / AUD47 = 0.95745.'),
('AU:carpenter:projected_growth_excess_cagr_pp_v1','AU:carpenter','projected_growth_excess_cagr_pp',array['au-carpenters-joiners-projection-2025-2035','au-all-projection-2025-2035'],-0.21454259569968492,'percentage_points_per_year','normalize-projected-growth-v1','available',null,'proxy','medium','Official occupation projection is available at broader ANZSCO 3312.','government_aggregator','medium',0.84,'Occupation projected CAGR about 1.0415%/yr versus national 1.2561%/yr; excess -0.2145pp/yr.'),
('AU:carpenter:visa_accessibility_points_v1','AU:carpenter','visa_accessibility_points',array['au-visa-189-carpenter'],9,'points','normalize-visa-accessibility-v1','available',null,'proxy','high','Official visa pathways are converted into the frozen occupation-level rubric; not personal visa advice.','official_primary','high',0.88,'Subclass 189: applicability 3 + employer independence 3 + eligibility burden 1 + permanent pathway 2 = 9.'),
('AU:carpenter:entry_burden_points_v1','AU:carpenter','entry_burden_points',array['au-carpentry-white-card'],2,'points','normalize-entry-burden-v1','available',null,'proxy','high','Mandatory construction induction applies broadly to employees; contractor licences are stored separately.','official_primary','medium',0.85,'5 - national/effectively-national scope 2 - mandatory certification 1 - near-immediate acquisition 0 = 2.')
on conflict (normalized_metric_key) do update set
 profile_key=excluded.profile_key,metric_key=excluded.metric_key,input_observation_refs=excluded.input_observation_refs,
 normalized_value=excluded.normalized_value,normalized_unit=excluded.normalized_unit,formula_version=excluded.formula_version,
 availability=excluded.availability,reason=excluded.reason,directness=excluded.directness,mapping_quality=excluded.mapping_quality,
 proxy_reason=excluded.proxy_reason,source_type=excluded.source_type,quality=excluded.quality,confidence=excluded.confidence,
 explanation=excluded.explanation,calculated_at=now();

insert into public.career_normalized_metric_inputs
(normalized_metric_key,observation_key,input_role,usage_type)
values
('AU:carpenter:shortage_points_v1','au-carpenter-shortage-2025','official_shortage_assessment','policy_evidence'),
('AU:carpenter:vacancy_fallback_points_v1','au-carpenters-joiners-ivi-may-2026','fallback_market_evidence','fallback_evidence'),
('AU:carpenter:vacancy_fallback_points_v1','au-carpenters-joiners-employment-2026','employment_denominator_context','benchmark'),
('AU:carpenter:industry_diversity_points_v1','au-carpenters-joiners-industry-2026','industry_coverage_evidence','input'),
('AU:carpenter:employment_momentum_excess_cagr_pp_v1','au-carpenters-joiners-growth-2019-2024','occupation_growth','input'),
('AU:carpenter:employment_momentum_excess_cagr_pp_v1','au-all-employment-nov-2019','country_start_employment','benchmark'),
('AU:carpenter:employment_momentum_excess_cagr_pp_v1','au-all-employment-nov-2024','country_end_employment','benchmark'),
('AU:carpenter:entry_accessibility_points_v1','au-carpentry-qualification-entry','entry_education','input'),
('AU:carpenter:entry_accessibility_points_v1','au-carpentry-paid-apprenticeship','earning_structure','input'),
('AU:carpenter:relative_salary_ratio_v1','au-carpenters-joiners-hourly-wage-2025','occupation_value','input'),
('AU:carpenter:relative_salary_ratio_v1','au-all-hourly-wage-2025','country_benchmark','benchmark'),
('AU:carpenter:projected_growth_excess_cagr_pp_v1','au-carpenters-joiners-projection-2025-2035','occupation_projection','input'),
('AU:carpenter:projected_growth_excess_cagr_pp_v1','au-all-projection-2025-2035','country_projection_benchmark','benchmark'),
('AU:carpenter:visa_accessibility_points_v1','au-visa-189-carpenter','primary_pathway','policy_evidence'),
('AU:carpenter:entry_burden_points_v1','au-carpentry-white-card','employee_regulatory_requirement','policy_evidence')
on conflict do nothing;

insert into public.career_opportunity_score_snapshots
(snapshot_key,profile_key,as_of_date,formula_version,required_component_keys,explanation)
values
('AU:carpenter:2026-08-13:v1','AU:carpenter','2026-08-13','career-opportunity-v4-foundation',
 array['shortage_signal','vacancy_intensity','industry_diversity','employment_momentum','entry_accessibility','relative_salary','projected_growth','visa_accessibility','entry_burden'],
 'Australia Carpenter under the same frozen methodology v1 as US Carpenter; broader 3312 proxy use is explicit.')
on conflict (snapshot_key) do update set
 formula_version=excluded.formula_version,required_component_keys=excluded.required_component_keys,explanation=excluded.explanation;

insert into public.career_score_components
(snapshot_key,profile_key,component_key,raw_input_refs,normalized_metric_refs,normalized_value,formula_version,availability,directness,mapping_quality,proxy_reason,source_type,quality,confidence,explanation,reason,evidence_status)
values
('AU:carpenter:2026-08-13:v1','AU:carpenter','shortage_signal',array['au-carpenter-shortage-2025'],array['AU:carpenter:shortage_points_v1'],12,'career-opportunity-v4-foundation','available','direct','high',null,'government_aggregator','medium',0.90,'Official national Shortage maps to 12.',null,'direct_verified'),
('AU:carpenter:2026-08-13:v1','AU:carpenter','vacancy_intensity',array['au-carpenters-joiners-ivi-may-2026','au-carpenters-joiners-employment-2026'],array['AU:carpenter:vacancy_fallback_points_v1'],4,'career-opportunity-v4-foundation','available','proxy','medium','Official 3312 IVI evidence is broader and not a clean distinct 90-day numerator.','government_aggregator','medium',0.75,'Conservative vacancy fallback = 4.','No clean distinct 90-day Carpenter numerator is published.','fallback'),
('AU:carpenter:2026-08-13:v1','AU:carpenter','industry_diversity',array['au-carpenters-joiners-industry-2026'],array['AU:carpenter:industry_diversity_points_v1'],0,'career-opportunity-v4-foundation','available','proxy','medium','Official profile lacks comparable employment shares for HHI.','government_aggregator','medium',0.72,'Conservative zero preserves insufficient-coverage semantics.','Comparable broad-sector employment shares are unavailable.','insufficient_industry_coverage'),
('AU:carpenter:2026-08-13:v1','AU:carpenter','employment_momentum',array['au-carpenters-joiners-growth-2019-2024','au-all-employment-nov-2019','au-all-employment-nov-2024'],array['AU:carpenter:employment_momentum_excess_cagr_pp_v1'],-0.4189258298143761,'career-opportunity-v4-foundation','available','proxy','medium','Five-year occupation history is published at 3312.','government_aggregator','medium',0.84,'Actual excess CAGR score = 3.95.',null,'derived'),
('AU:carpenter:2026-08-13:v1','AU:carpenter','entry_accessibility',array['au-carpentry-qualification-entry','au-carpentry-paid-apprenticeship'],array['AU:carpenter:entry_accessibility_points_v1'],14,'career-opportunity-v4-foundation','available','proxy','high','CampCareer rubric from official entry/training evidence.','official_primary','high',0.90,'7 + 3 + 4 = 14.',null,'proxy'),
('AU:carpenter:2026-08-13:v1','AU:carpenter','relative_salary',array['au-carpenters-joiners-hourly-wage-2025','au-all-hourly-wage-2025'],array['AU:carpenter:relative_salary_ratio_v1'],0.9574468085106383,'career-opportunity-v4-foundation','available','proxy','medium','Exact Carpenter wage is unavailable; 3312 is the official broader proxy.','government_aggregator','high',0.90,'AUD45 / AUD47; score = 4.57.',null,'derived'),
('AU:carpenter:2026-08-13:v1','AU:carpenter','projected_growth',array['au-carpenters-joiners-projection-2025-2035','au-all-projection-2025-2035'],array['AU:carpenter:projected_growth_excess_cagr_pp_v1'],-0.21454259569968492,'career-opportunity-v4-foundation','available','proxy','medium','Official projection is at 3312.','government_aggregator','medium',0.84,'Projected excess CAGR score = 4.46.',null,'derived'),
('AU:carpenter:2026-08-13:v1','AU:carpenter','visa_accessibility',array['au-visa-189-carpenter'],array['AU:carpenter:visa_accessibility_points_v1'],9,'career-opportunity-v4-foundation','available','proxy','high','Occupation-level CampCareer visa rubric; individual eligibility is separate.','official_primary','high',0.88,'Subclass 189 = 9/10.',null,'proxy'),
('AU:carpenter:2026-08-13:v1','AU:carpenter','entry_burden',array['au-carpentry-white-card'],array['AU:carpenter:entry_burden_points_v1'],2,'career-opportunity-v4-foundation','available','proxy','high','Mandatory construction induction is counted; contractor-only licences are separate.','official_primary','medium',0.85,'5 - 2 - 1 - 0 = 2.',null,'proxy')
on conflict (snapshot_key,component_key) do update set
 raw_input_refs=excluded.raw_input_refs,normalized_metric_refs=excluded.normalized_metric_refs,normalized_value=excluded.normalized_value,
 formula_version=excluded.formula_version,availability=excluded.availability,directness=excluded.directness,mapping_quality=excluded.mapping_quality,
 proxy_reason=excluded.proxy_reason,source_type=excluded.source_type,quality=excluded.quality,confidence=excluded.confidence,
 explanation=excluded.explanation,reason=excluded.reason,evidence_status=excluded.evidence_status,calculated_at=now();

insert into public.career_score_component_metric_inputs
(snapshot_key,component_key,normalized_metric_key,input_role)
values
('AU:carpenter:2026-08-13:v1','shortage_signal','AU:carpenter:shortage_points_v1','scored_metric'),
('AU:carpenter:2026-08-13:v1','vacancy_intensity','AU:carpenter:vacancy_fallback_points_v1','scored_metric'),
('AU:carpenter:2026-08-13:v1','industry_diversity','AU:carpenter:industry_diversity_points_v1','scored_metric'),
('AU:carpenter:2026-08-13:v1','employment_momentum','AU:carpenter:employment_momentum_excess_cagr_pp_v1','scored_metric'),
('AU:carpenter:2026-08-13:v1','entry_accessibility','AU:carpenter:entry_accessibility_points_v1','scored_metric'),
('AU:carpenter:2026-08-13:v1','relative_salary','AU:carpenter:relative_salary_ratio_v1','scored_metric'),
('AU:carpenter:2026-08-13:v1','projected_growth','AU:carpenter:projected_growth_excess_cagr_pp_v1','scored_metric'),
('AU:carpenter:2026-08-13:v1','visa_accessibility','AU:carpenter:visa_accessibility_points_v1','scored_metric'),
('AU:carpenter:2026-08-13:v1','entry_burden','AU:carpenter:entry_burden_points_v1','scored_metric')
on conflict do nothing;

insert into public.career_score_component_raw_inputs
(snapshot_key,component_key,observation_key,input_role)
select 'AU:carpenter:2026-08-13:v1',m.component_key,n.observation_key,n.input_role
from public.career_score_component_metric_inputs m
join public.career_normalized_metric_inputs n on n.normalized_metric_key=m.normalized_metric_key
where m.snapshot_key='AU:carpenter:2026-08-13:v1'
on conflict do nothing;

insert into public.career_foundation_visa_pathways
(pathway_key,profile_key,route_role,pathway_name,source_key,official_source_url,occupation_applicability_points,employer_dependency_points,eligibility_burden_points,long_term_pathway_points,used_for_primary_score,applicability_scope,last_verified_on,notes)
values
('AU:carpenter:189','AU:carpenter','primary','Skilled Independent visa (subclass 189)','au-homeaffairs-189','https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189',3,3,1,2,true,'General skilled migration; invitation, points and skills-assessment requirements remain individual.','2026-08-13','Permanent, non-employer-sponsored representative pathway; Carpenter appeared in the 4 June 2026 invitation round.'),
('AU:carpenter:482','AU:carpenter','secondary','Skills in Demand visa (subclass 482)','au-homeaffairs-482','https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skills-in-demand-482',2,1,1,1,false,'Employer-sponsored secondary pathway; current list and nomination eligibility must be checked.','2026-08-13','Secondary flexibility evidence only; not added to the primary pathway score.')
on conflict (pathway_key) do update set
 route_role=excluded.route_role,pathway_name=excluded.pathway_name,source_key=excluded.source_key,official_source_url=excluded.official_source_url,
 occupation_applicability_points=excluded.occupation_applicability_points,employer_dependency_points=excluded.employer_dependency_points,
 eligibility_burden_points=excluded.eligibility_burden_points,long_term_pathway_points=excluded.long_term_pathway_points,
 used_for_primary_score=excluded.used_for_primary_score,applicability_scope=excluded.applicability_scope,
 last_verified_on=excluded.last_verified_on,notes=excluded.notes;

insert into public.career_foundation_licensing_evidence
(evidence_key,profile_key,mapping_key,jurisdiction_code,jurisdiction_name,jurisdiction_level,requirement_type,mandatory,applies_to,authority,source_key,official_source_url,verified_on,cost_amount,cost_currency,expected_duration_days,exceptions,evidence_quality,notes)
values
('AU:carpenter:white-card','AU:carpenter','AU:carpenter:OSCA:372132','AU','Australia','national','safety_training',true,'employee','Australian Government National Training Register / state and territory WHS regulators','au-training-cpc30220','https://training.gov.au/Training/Details/CPC30220','2026-08-13',null,null,1,null,'high','Mandatory construction induction / white-card evidence; not an occupational Carpenter licence.'),
('AU:carpenter:NSW:contractor','AU:carpenter','AU:carpenter:OSCA:372132','NSW','New South Wales','state','contractor_license',true,'contractor','NSW Government / Fair Trading','au-nsw-carpentry-licensing','https://www.nsw.gov.au/business-and-economy/licences-and-credentials/building-and-trade-licences-and-registrations/categories-of-work/carpentry','2026-08-13',null,null,null,'Employee/apprentice application depends on work arrangement; not generalized nationally.','high','Subnational contractor/licensing evidence, separate from ordinary employee score.'),
('AU:carpenter:WA:builder','AU:carpenter','AU:carpenter:OSCA:372132','WA','Western Australia','state','contractor_license',true,'contractor','Government of Western Australia','au-wa-carpenter-work','https://buildalife.wa.gov.au/carpenter','2026-08-13',null,null,null,'Employee of a registered builder does not need a Carpenter licence; builder registration can apply when contracting.','high','Explicit employee-versus-contractor distinction.')
on conflict (evidence_key) do update set
 mapping_key=excluded.mapping_key,jurisdiction_code=excluded.jurisdiction_code,jurisdiction_name=excluded.jurisdiction_name,
 jurisdiction_level=excluded.jurisdiction_level,requirement_type=excluded.requirement_type,mandatory=excluded.mandatory,
 applies_to=excluded.applies_to,authority=excluded.authority,source_key=excluded.source_key,official_source_url=excluded.official_source_url,
 verified_on=excluded.verified_on,cost_amount=excluded.cost_amount,cost_currency=excluded.cost_currency,
 expected_duration_days=excluded.expected_duration_days,exceptions=excluded.exceptions,evidence_quality=excluded.evidence_quality,notes=excluded.notes;

insert into public.career_foundation_blockers
(blocker_key,profile_key,blocker_type,severity,reason,source_key,official_source_url,applicability_scope,last_verified_on,active)
values
('AU:carpenter:work-rights','AU:carpenter','work_rights','conditional','Australian work rights or an appropriate visa are required; the occupation-level score does not confirm personal eligibility.','au-homeaffairs-189','https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189','Individual applicant','2026-08-13',true),
('AU:carpenter:skills-assessment','AU:carpenter','visa','conditional','Applicable skilled migration can require a suitable trade skills assessment plus invitation/points criteria.','au-tra-carpenter','https://www.tradesrecognitionaustralia.gov.au/rto-finder','Overseas-skilled applicants','2026-08-13',true),
('AU:carpenter:white-card-blocker','AU:carpenter','safety_training','conditional','Construction-site work generally requires construction induction training / a white card.','au-training-cpc30220','https://training.gov.au/Training/Details/CPC30220','Construction-site work','2026-08-13',true),
('AU:carpenter:jurisdiction-check','AU:carpenter','licensing','conditional','Carpentry/building licensing varies by jurisdiction and employee-versus-contractor work mode.','au-abs-osca-2024','https://www.abs.gov.au/statistics/classifications/osca-occupation-standard-classification-australia/2024-version-1-0/browse-classification/3/37/372/3721/372132','State/territory and work-mode specific','2026-08-13',true)
on conflict (blocker_key) do update set
 blocker_type=excluded.blocker_type,severity=excluded.severity,reason=excluded.reason,source_key=excluded.source_key,
 official_source_url=excluded.official_source_url,applicability_scope=excluded.applicability_scope,
 last_verified_on=excluded.last_verified_on,active=excluded.active;

insert into public.career_foundation_entry_points
(entry_point_key,profile_key,entry_type,label,provider,url,source_key,applicability_scope,last_verified_on,notes,sort_order)
values
('AU:carpenter:jobs','AU:carpenter','job_search','Search current Carpenter jobs','Workforce Australia','https://www.workforceaustralia.gov.au/individuals/jobs/search?searchText=carpenter','au-workforce-australia-jobs','Australia','2026-08-13','Government live search; individual listings are examples only and not Vacancy Score observations.',10),
('AU:carpenter:training','AU:carpenter','apprenticeship','Certificate III in Carpentry / apprenticeship pathway','National Training Register','https://training.gov.au/Training/Details/CPC30220','au-training-cpc30220','Australia','2026-08-13','Current qualification and apprenticeship pathway.',20),
('AU:carpenter:skills-assessment-entry','AU:carpenter','source','Check Carpenter trade skills assessment','Trades Recognition Australia','https://www.tradesrecognitionaustralia.gov.au/rto-finder','au-tra-carpenter','Overseas-skilled applicants','2026-08-13','Verify current assessing pathway before migration application.',30),
('AU:carpenter:visa-189-entry','AU:carpenter','visa','Skilled Independent visa (subclass 189)','Department of Home Affairs','https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189','au-homeaffairs-189','Potential skilled-migration applicants','2026-08-13','Personal eligibility and invitation requirements are separate.',40),
('AU:carpenter:licensing-check','AU:carpenter','licensing_check','Check state licensing and white-card requirements','ABS / state regulators','https://www.abs.gov.au/statistics/classifications/osca-occupation-standard-classification-australia/2024-version-1-0/browse-classification/3/37/372/3721/372132','au-abs-osca-2024','Target state/territory','2026-08-13','Employee and contractor requirements must be checked separately.',50)
on conflict (entry_point_key) do update set
 entry_type=excluded.entry_type,label=excluded.label,provider=excluded.provider,url=excluded.url,source_key=excluded.source_key,
 applicability_scope=excluded.applicability_scope,last_verified_on=excluded.last_verified_on,notes=excluded.notes,sort_order=excluded.sort_order;
