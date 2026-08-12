-- Evidence-rich Netherlands Environment scoring.
-- Recurring vacancy-intensity, employer-diversity, vacancy-trend and growth components remain zero because
-- the current official Dutch series reviewed here are sector/basket level rather than exact recurring occupation series.
-- Those broader observations are retained in score_evidence instead of being silently converted into points.

insert into public.country_occupation_metric_snapshots (
  profile_key,as_of_date,employment_total,median_hourly_earnings,annualised_median_salary,
  shortage_component,vacancy_intensity_component,employer_diversity_component,vacancy_trend_component,
  entry_level_component,salary_component,growth_component,visa_component,entry_burden_component,
  opportunity_score,score_methodology_version,score_status,score_evidence,source_checked_at
) values
('NL:environmental-scientist','2026-08-12',null,18.92,35424,20,0,0,0,8,6,0,3,5,42,'career-opportunity-nl-v1','provisional',
  jsonb_build_object(
    'classification_scope','ISCO-08 2133 Environmental Protection Professionals, environmental scientist / milieukundige scope.',
    'shortage_note','UWV explicitly reports high demand for sustainability, environment and energy-management specialists and many vacancies for milieukundigen in government. SBB Onderzoeker Leefomgeving has current baankans 8/10. Strong direct 20/20.',
    'salary_method','Studiekeuze123 Milieukunde estimated starting salary EUR 2,952/month; annualised EUR 35,424. Hourly proxy EUR 18.92 uses the reported 36-hour graduate workweek. This is an early-career study proxy, not an occupation median.',
    'entry_basis','Hbo Milieukunde is the primary professional route; level-4 Onderzoeker Leefomgeving is a technical feeder. Degree-level professional entry scores 8/15.',
    'entry_burden_basis','No universal personal register for generic environmental science; activity/project permits may apply. 5/5 accessibility credit.',
    'visa_basis','No occupation-specific Dutch immigration fast track. HSM/GVVA remains employer-, sponsor-, salary- and permit-dependent; 3/10.',
    'graduate_outcomes',jsonb_build_object('study','Milieukunde','substantial_job_months',6,'fixed_contract_pct',62,'field_match_pct',77,'level_match_pct',95,'workweek_hours',36,'starting_salary_monthly_eur',2952,'employment_outlook','good','career_satisfaction_5',4.2),
    'vocational_signal',jsonb_build_object('route','Onderzoeker leefomgeving','sbb_job_chance_10',8,'graduates_with_work_pct',88,'starting_hourly_eur',15),
    'market_context',jsonb_build_object('uwv_direct_roles','duurzaamheid, milieu, energiemanagement; milieukundigen','green_vacancy_trend_scope','light-green basket, not exact occupation','green_vacancy_change_since_2019_pct',114),
    'unscored_components',jsonb_build_array('vacancy_intensity','employer_diversity','vacancy_trend','growth'),
    'data_quality_note','Direct occupational/study signals support shortage and entry scoring; broad green-sector vacancy trends are retained as context only.'
  ),'2026-08-12'),
('NL:agronomist','2026-08-12',null,19.83,39180,15,0,0,0,8,6,0,3,4,36,'career-opportunity-nl-v1','provisional',
  jsonb_build_object(
    'classification_scope','ISCO-08 2132 Farming, Forestry and Fisheries Advisers, constrained to agronomy/crop advisory work.',
    'shortage_note','UWV describes occupations needed for future-proof agriculture as tight to very tight and reports strong growth in light-green policy/agricultural/environmental/soil roles. The evidence basket is broader than Agronomist alone, so 15/20 rather than maximum.',
    'salary_method','Studiekeuze123 Tuinbouw en Akkerbouw estimated starting salary EUR 3,265/month; annualised EUR 39,180 and EUR 19.83/hour using the reported 38-hour workweek.',
    'entry_basis','Hbo Tuinbouw en Akkerbouw provides a direct crop/agronomy/advisory route; 8/15.',
    'entry_burden_basis','Agronomy itself is unregistered, but professional chemical crop-protection use/sale/storage/advice requires the applicable proof of competence; 4/5.',
    'visa_basis','No agronomist-specific Dutch immigration fast track; 3/10.',
    'graduate_outcomes',jsonb_build_object('study','Tuinbouw en Akkerbouw','substantial_job_months',2,'fixed_contract_pct',72,'field_match_pct',83,'level_match_pct',72,'workweek_hours',38,'starting_salary_monthly_eur',3265,'self_employed_pct',36,'job_satisfaction_5',4.3,'career_satisfaction_5',4.2),
    'graduate_destination_context',jsonb_build_object('farming_forestry_fisheries_advisers_pct',15,'agricultural_specialists_pct',13),
    'market_context',jsonb_build_object('green_vacancy_change_since_2019_pct',114,'trend_scope','light-green occupational basket including agricultural/environmental policy and soil expertise'),
    'task_regulation','RVO proof of competence (spuitlicentie) applies when professionally advising on or handling chemical crop-protection products.',
    'unscored_components',jsonb_build_array('vacancy_intensity','employer_diversity','vacancy_trend','growth')
  ),'2026-08-12'),
('NL:farm-manager','2026-08-12',null,16.00,33280,10,0,0,0,12,4,0,3,4,33,'career-opportunity-nl-v1','provisional',
  jsonb_build_object(
    'classification_scope','ISCO-08 1311 Agricultural and Forestry Production Managers, farm-management scope.',
    'shortage_note','SBB level-4 Vakexpert teelt en groene technologie, which explicitly prepares learners for crop-production business leadership, has baankans 10/10. The employee-market signal is discounted because agriculture is seasonal, manager-specific recurring vacancies are unavailable and higher-education data show substantial self-employment; moderate 10/20.',
    'salary_method','SBB Vakexpert teelt en groene technologie BOL starting-pay indicator EUR 16/hour, annualised on the NL vocational 40-hour convention to EUR 33,280. Tuinbouw en Akkerbouw higher-education salary EUR 3,265/month is retained as progression context.',
    'entry_basis','A level-4 vocational leadership route exists, but genuine farm-management responsibility usually requires operational experience; 12/15.',
    'entry_burden_basis','No universal farm-manager register; activity-specific crop-protection and business obligations can apply; 4/5.',
    'visa_basis','No farm-manager occupation-list fast track; standard GVVA/HSM rules as applicable; 3/10.',
    'vocational_signal',jsonb_build_object('route','Vakexpert teelt en groene technologie','level',4,'sbb_job_chance_10',10,'graduates_with_work_pct',66,'starting_hourly_eur',16,'direct_management_scope',true),
    'graduate_context',jsonb_build_object('study','Tuinbouw en Akkerbouw','starting_salary_monthly_eur',3265,'self_employed_pct',36,'substantial_job_months',2,'fixed_contract_pct',72),
    'sector_context',jsonb_build_object('employee_jobs_sep_2025',132600,'open_vacancies_q4_2025',3100,'seasonality_material',true,'scope','agrarisch en groen sector; not farm-manager-specific'),
    'data_quality_note','Strong route-level job chance is not treated as a manager-only vacancy rate; self-employment and sector seasonality are explicit score dampeners.',
    'unscored_components',jsonb_build_array('vacancy_intensity','employer_diversity','vacancy_trend','growth')
  ),'2026-08-12'),
('NL:forestry-technician','2026-08-12',null,16.00,33280,10,0,0,0,12,4,0,3,5,34,'career-opportunity-nl-v1','provisional',
  jsonb_build_object(
    'classification_scope','ISCO-08 3143 Forestry Technicians; practical/technical forest and nature-management scope, not professional forester.',
    'shortage_note','SBB level-4 Opzichter/uitvoerder groene ruimte and nature-management routes report baankans 7/10. This is positive but weaker than horticulture. Higher-education Bos- en Natuurbeheer also has good outlook but slower job attainment and weaker contract stability; moderate 10/20.',
    'salary_method','Conservative SBB BOL level-4 green-space starting-pay indicator EUR 16/hour, annualised EUR 33,280. Studiekeuze123 Bos- en Natuurbeheer reports EUR 2,700/month as higher-education progression context.',
    'entry_basis','Level-4 MBO supervision/nature-management routes provide practical entry; 12/15.',
    'entry_burden_basis','No universal statutory forestry-technician register; job-specific safety/machine/ecology requirements can apply; 5/5.',
    'visa_basis','No forestry-technician-specific Dutch immigration fast track; 3/10.',
    'vocational_signal',jsonb_build_object('route','Opzichter/uitvoerder groene ruimte','level',4,'sbb_job_chance_10',7,'bol_starting_hourly_eur',16,'bol_graduates_with_work_pct',79,'bbl_starting_hourly_eur',19,'bbl_graduates_with_work_pct',88),
    'graduate_outcomes',jsonb_build_object('study','Bos- en Natuurbeheer','substantial_job_months',11,'fixed_contract_pct',40,'field_match_pct',78,'level_match_pct',67,'starting_salary_monthly_eur',2700,'workweek_hours',35,'employment_outlook','good'),
    'data_quality_note','The profile deliberately does not inherit baankans 9-10 signals from tree-care or generic green-ground occupations because the canonical role is technician-level forestry.',
    'unscored_components',jsonb_build_array('vacancy_intensity','employer_diversity','vacancy_trend','growth')
  ),'2026-08-12'),
('NL:food-technologist','2026-08-12',null,18.29,36144,20,0,0,0,12,6,0,3,5,46,'career-opportunity-nl-v1','provisional',
  jsonb_build_object(
    'classification_scope','ISCO-08 2145 Chemical Engineers, constrained to food/process technology. Food production/quality work is not blended with generic chemical engineering salary or vacancy data.',
    'shortage_note','SBB Vakexpert voeding, technologie en techniek has current baankans 10/10 and UWV identifies higher-level procestechnoloog vacancies as difficult to fill in industry. Food-specific vocational and process-technology evidence jointly support 20/20 despite broader industrial cooling.',
    'salary_method','Studiekeuze123 Voedingsmiddelentechnologie estimated starting salary EUR 3,012/month; annualised EUR 36,144 and EUR 18.29/hour using reported 38-hour workweek. SBB BOL/BBL hourly starting-pay observations are retained separately.',
    'entry_basis','A direct level-4 food technology route plus hbo Voedingsmiddelentechnologie creates multiple structured entry points; 12/15.',
    'entry_burden_basis','No personal Food Technologist register. HACCP/NVWA obligations attach to food businesses/processes rather than universal individual registration; 5/5.',
    'visa_basis','No food-technologist-specific Dutch immigration fast track; 3/10.',
    'vocational_signal',jsonb_build_object('route','Vakexpert voeding, technologie en techniek','level',4,'sbb_job_chance_10',10,'bol_starting_hourly_eur',17,'bol_graduates_with_work_pct',88,'bbl_starting_hourly_eur',25,'bbl_graduates_with_work_pct',100),
    'graduate_outcomes',jsonb_build_object('study','Voedingsmiddelentechnologie','substantial_job_months',9,'fixed_contract_pct',59,'field_match_pct',81,'level_match_pct',92,'starting_salary_monthly_eur',3012,'workweek_hours',38,'employment_outlook','good'),
    'industry_context',jsonb_build_object('open_vacancies_end_2025',28000,'food_industry_job_share_pct',18,'hard_to_fill_higher_role','procestechnoloog','scope','industry-wide context, not exact Food Technologist vacancies'),
    'regulatory_context','Food businesses must operate HACCP-based food-safety plans/hygiene codes and comply with NVWA registration/recognition rules.',
    'unscored_components',jsonb_build_array('vacancy_intensity','employer_diversity','vacancy_trend','growth')
  ),'2026-08-12'),
('NL:sustainability-specialist','2026-08-12',null,18.92,35424,15,0,0,0,8,6,0,3,5,37,'career-opportunity-nl-v1','provisional',
  jsonb_build_object(
    'classification_scope','Modern Sustainability / ESG / energy-management specialist retained as explicit NL career scope; no single legacy ISCO-08 unit group is forced.',
    'shortage_note','UWV explicitly states high demand for specialists in sustainability, environment and energy management. The title spans environmental, business and engineering families, so 15/20 rather than inheriting the full Environmental Scientist score.',
    'salary_method','Studiekeuze123 Milieukunde EUR 2,952/month and 36-hour workweek is used as a transparent environmental-route proxy: EUR 35,424/year and EUR 18.92/hour. It is not claimed as a sustainability-specialist median.',
    'entry_basis','Hbo/wo environmental, energy, engineering and business-sustainability routes are common; 8/15.',
    'entry_burden_basis','No universal statutory sustainability register; 5/5.',
    'visa_basis','No occupation-specific Dutch immigration fast track; HSM conditions remain sponsor/salary/market-rate dependent; 3/10.',
    'policy_demand_context',jsonb_build_object('uwv_direct_demand','duurzaamheid, milieu en energiemanagement','csrd_reporting_active',true,'esrs_guidance_current',true,'national_renewable_energy_target_2030_pct',27,'national_near_full_sustainable_energy_target_year',2050),
    'graduate_proxy_outcomes',jsonb_build_object('study','Milieukunde','substantial_job_months',6,'fixed_contract_pct',62,'field_match_pct',77,'level_match_pct',95,'starting_salary_monthly_eur',2952),
    'data_quality_note','Policy/reporting demand is evidence for role relevance, not an exact vacancy series; recurring vacancy/growth components stay zero.',
    'unscored_components',jsonb_build_array('vacancy_intensity','employer_diversity','vacancy_trend','growth')
  ),'2026-08-12'),
('NL:horticulturist','2026-08-12',null,16.00,33280,20,0,0,0,15,4,0,3,4,46,'career-opportunity-nl-v1','provisional',
  jsonb_build_object(
    'classification_scope','ISCO-08 6113 Gardeners, Horticultural and Nursery Growers, constrained to skilled horticultural/crop/nursery production.',
    'shortage_note','SBB Vakexpert teelt en groene technologie has baankans 10/10. UWV says future-proof agriculture occupations are tight to very tight and reports major recruitment difficulty in horticulture/green employers plus growing technical/ICT skill needs. Direct maximum 20/20.',
    'salary_method','SBB Vakexpert teelt en groene technologie BOL starting-pay indicator EUR 16/hour, annualised EUR 33,280. Higher-education Tuinbouw en Akkerbouw EUR 3,265/month is retained as progression context rather than substituted into the vocational occupation salary.',
    'entry_basis','Direct MBO level-2/3/4 crop-production routes exist and level-4 adds production leadership/technology; accessible vocational entry earns 15/15.',
    'entry_burden_basis','No universal horticulturist register, but professional chemical crop-protection handling/advice requires proof of competence; 4/5.',
    'visa_basis','No horticulturist-specific immigration fast track; standard GVVA/HSM rules as applicable; 3/10.',
    'vocational_signal',jsonb_build_object('route','Vakexpert teelt en groene technologie','level',4,'sbb_job_chance_10',10,'starting_hourly_eur',16,'graduates_with_work_pct',66),
    'higher_education_context',jsonb_build_object('study','Tuinbouw en Akkerbouw','substantial_job_months',2,'fixed_contract_pct',72,'field_match_pct',83,'level_match_pct',72,'starting_salary_monthly_eur',3265,'self_employed_pct',36),
    'sector_context',jsonb_build_object('employee_jobs_sep_2025',132600,'open_vacancies_q4_2025',3100,'employer_shortage_note','about half of landscaping/green employers report staffing problems; crop-production technology skills increasingly important','scope','sector-wide context only'),
    'task_regulation','RVO proof of competence required for professional chemical crop-protection use, storage, purchase, sale or advice.',
    'unscored_components',jsonb_build_array('vacancy_intensity','employer_diversity','vacancy_trend','growth')
  ),'2026-08-12'),
('NL:animal-science-technician','2026-08-12',null,15.00,31200,0,0,0,0,15,4,0,3,2,24,'career-opportunity-nl-v1','provisional',
  jsonb_build_object(
    'classification_scope','ISCO-08 3141 Life Science Technicians (except medical), constrained to laboratory-animal/life-science technical support. Generic livestock work and registered veterinary practice are excluded.',
    'shortage_note','The closest direct SBB laboratory-animal pathway, Proefdierverzorger, has current baankans 4/10 and explicitly says few matching vacancies are available. Broad agriculture/animal staffing pressure is not transferred to this narrow technical profile; 0/20.',
    'salary_method','SBB Proefdierverzorger current starting-pay indicator EUR 15/hour, annualised EUR 31,200 on the NL vocational 40-hour convention.',
    'entry_basis','A direct level-3 MBO Proefdierverzorger pathway exists; accessible vocational entry earns 15/15.',
    'entry_burden_basis','Laboratory-animal work is competence-gated under the Wet op de dierproeven: only specially trained staff may work with laboratory animals/perform animal procedures; foreign qualifications may need recognition or exemption. Significant burden earns 2/5.',
    'visa_basis','No animal-science-technician-specific Dutch immigration fast track; 3/10.',
    'vocational_signal',jsonb_build_object('route','Proefdierverzorger','level',3,'sbb_job_chance_10',4,'starting_hourly_eur',15,'market_description','few matching vacancies; difficult to find matching work'),
    'regulated_setting_context',jsonb_build_object('wod_special_training_required',true,'nvwa_2025_permit_holders',69,'nvwa_2025_qualification_exemptions_granted',110,'nvwa_2025_foreign_qualification_recognitions_granted',66),
    'scope_exclusion','Veterinary diagnosis/treatment belongs to registered veterinary professions and is not part of this canonical profile.',
    'data_quality_note','Direct narrow-role evidence overrides broader animal/agriculture narratives; no shortage points are inferred.',
    'unscored_components',jsonb_build_array('vacancy_intensity','employer_diversity','vacancy_trend','growth')
  ),'2026-08-12')
on conflict (profile_key,as_of_date) do update set
  employment_total=excluded.employment_total,
  median_hourly_earnings=excluded.median_hourly_earnings,
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
