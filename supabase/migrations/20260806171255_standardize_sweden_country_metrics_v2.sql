do $$
declare
  reviewed_ts timestamptz := now();
begin
  delete from evidence.metric_observations
  where scope_type = 'country'
    and scope_id = 'SE'
    and metric_key in (
      'full_time_annual_earnings_range', 'average_annual_salary',
      'national_minimum_hourly_wage', 'student_living_cost_monthly_range',
      'tuition_annual_low', 'tuition_annual_high',
      'student_work_hours_limit', 'visa_application_fee'
    );

  insert into evidence.metric_observations (
    metric_key, scope_type, scope_id, value, unit, source_snapshot_id,
    evidence_kind, confidence, methodology, assumptions, effective_from,
    review_status, reviewed_at, reviewer_note, updated_at
  )
  select
    v.metric_key, 'country', 'SE', v.value, v.unit, ss.id,
    v.evidence_kind, v.confidence, v.methodology, v.assumptions, v.effective_from,
    'verified', reviewed_ts,
    'CampCareer batch 3 Sweden official-source review, 6 August 2026', reviewed_ts
  from (
    values
      ('full_time_annual_earnings_range', 'cc_se_scb_salary_2025_v2',
       '{"low":384000,"high":576000,"ranking_value":459600,"currency":"SEK","basis":"national_p25_to_p75_monthly_salary_annualised","measure_type":"quartile_distribution","monthly_lower_quartile":32000,"monthly_median":38300,"monthly_upper_quartile":48000,"population":"employees across all sectors, both sexes, Sweden"}'::jsonb,
       'SEK/year', 'calculated', 'high',
       'Statistics Sweden monthly lower quartile, median and upper quartile for the whole economy are multiplied by 12. The displayed range is P25 to P75 and the ranking value is the annualised median.',
       '{"monthly_to_annual_multiplier":12,"not_a_starting_salary":true,"not_a_graduate_only_population":true}'::jsonb, date '2025-12-31'),
      ('average_annual_salary', 'cc_se_scb_salary_2025_v2',
       '{"amount":514800,"currency":"SEK","monthly_amount":42900,"statistic_type":"mean","basis":"annualised_average_monthly_salary_all_sectors","population":"employees across all sectors, both sexes, Sweden"}'::jsonb,
       'SEK/year', 'calculated', 'high',
       'Statistics Sweden average monthly salary for the whole economy is multiplied by 12.',
       '{"monthly_to_annual_multiplier":12,"not_a_starting_salary":true,"not_a_graduate_only_population":true}'::jsonb, date '2025-12-31'),
      ('national_minimum_hourly_wage', 'cc_se_work_environment_minimum_wage_v2',
       '{"amount":null,"currency":"SEK","not_applicable":true,"basis":"no_statutory_national_minimum_wage","collective_bargaining_primary":true}'::jsonb,
       'SEK/hour', 'observed', 'high',
       'Sweden has no statutory national minimum wage. Pay is commonly governed by collective agreements, so no artificial hourly amount is published.',
       '{"sector_and_agreement_rates_may_apply":true,"numeric_value_intentionally_null":true}'::jsonb, date '2026-08-06'),
      ('student_living_cost_monthly_range', 'cc_se_migration_higher_education_2026_v2',
       '{"low":10656,"high":12350,"ranking_value":10656,"currency":"SEK","basis":"2026_residence_permit_floor_to_kth_stockholm_student_budget","scenario":"one higher-education student; tuition excluded","maintenance_requirement_monthly":10656,"kth_budget_low":9450,"kth_budget_high":12350}'::jsonb,
       'SEK/month', 'calculated', 'medium',
       'The lower displayed value is the Swedish Migration Agency 2026 maintenance requirement. The upper value is KTH official Stockholm monthly student-budget guidance. The KTH lower estimate is below the permit floor and is therefore not used as the published lower bound.',
       '{"secondary_official_source":"https://www.kth.se/en/studies/master/application-and-tuition-fees-for-master-s-studies-1.65817","tuition_excluded":true,"stockholm_budget_not_national_average":true,"visa_finance_floor_not_spending_forecast":true}'::jsonb, date '2026-06-11'),
      ('tuition_annual_low', 'cc_se_stockholm_tuition_2026_v2',
       '{"amount":90000,"currency":"SEK","basis":"representative_general_programme_fee","programme_area":"humanities, social sciences and law","student_type":"fee-liable non-EU/EEA/Swiss student","special_high_cost_programmes_excluded":true}'::jsonb,
       'SEK/year', 'observed', 'high',
       'The lower representative fee is Stockholm University annual tuition for humanities, social sciences and law. It is a verified mainstream programme benchmark, not a claimed national minimum.',
       '{"national_minimum_claimed":false,"application_fee_excluded":true}'::jsonb, date '2026-08-06'),
      ('tuition_annual_high', 'cc_se_kth_tuition_2026_27_v2',
       '{"amount":180000,"currency":"SEK","basis":"representative_general_advanced_level_fee_2026_27","programme_area":"general advanced-level programmes","student_type":"fee-liable non-EU/EEA/Swiss student","special_high_cost_programmes_excluded":true}'::jsonb,
       'SEK/year', 'observed', 'high',
       'The upper representative fee is KTH general advanced-level tuition for academic year 2026/27. Architecture and other special high-cost programmes are excluded, so this is not presented as a national maximum.',
       '{"national_maximum_claimed":false,"architecture_excluded":true,"application_fee_excluded":true}'::jsonb, date '2026-07-01'),
      ('student_work_hours_limit', 'cc_se_migration_higher_education_2026_v2',
       '{"hours":15,"period":"week","applies_to":"bachelor_master_permits_granted_on_or_after_2026-06-11","effective_date":"2026-06-11","exceptions_exist":true,"summer_months_unrestricted":["June","July","August"]}'::jsonb,
       'hours/week', 'observed', 'high',
       'The metric stores the school-term maximum introduced for bachelor and master residence permits granted on or after 11 June 2026. Summer and specified study-related exceptions remain subject to the official conditions.',
       '{"older_or_other_permits_may_differ":true,"individual_permit_conditions_control":true}'::jsonb, date '2026-06-11'),
      ('visa_application_fee', 'cc_se_migration_higher_education_2026_v2',
       '{"amount":1500,"currency":"SEK","basis":"adult_higher_education_residence_permit_fee","visa_type":"residence permit for higher education","under_18_fee":750,"exemptions_apply":true}'::jsonb,
       'SEK', 'observed', 'high',
       'The calculation metric stores the Swedish Migration Agency adult application fee for a higher-education residence permit. It is not added to the /visas catalogue.',
       '{"external_service_fees_excluded":true,"exemptions_may_apply":true}'::jsonb, date '2026-06-11')
  ) as v(metric_key, source_key, value, unit, evidence_kind, confidence, methodology, assumptions, effective_from)
  join evidence.sources s on s.source_key = v.source_key
  join lateral (
    select source_snapshot.*
    from evidence.source_snapshots source_snapshot
    where source_snapshot.source_id = s.id
      and source_snapshot.snapshot_status in ('captured', 'unchanged')
    order by source_snapshot.retrieved_at desc
    limit 1
  ) ss on true;

  if (
    select count(*) from evidence.metric_observations
    where scope_type='country' and scope_id='SE' and review_status='verified'
      and metric_key in (
        'full_time_annual_earnings_range', 'average_annual_salary',
        'national_minimum_hourly_wage', 'student_living_cost_monthly_range',
        'tuition_annual_low', 'tuition_annual_high',
        'student_work_hours_limit', 'visa_application_fee'
      )
  ) <> 8 then
    raise exception 'Expected exactly 8 verified Sweden metric observations';
  end if;
end $$;

delete from evidence.sources s
where s.country_code = 'SE'
  and s.source_key not in (
    'cc_se_scb_salary_2025_v2',
    'cc_se_migration_higher_education_2026_v2',
    'cc_se_work_environment_minimum_wage_v2',
    'cc_se_kth_student_budget_2026_v2',
    'cc_se_stockholm_tuition_2026_v2',
    'cc_se_kth_tuition_2026_27_v2'
  )
  and not exists (
    select 1
    from evidence.source_snapshots ss
    join evidence.metric_observations mo on mo.source_snapshot_id = ss.id
    where ss.source_id = s.id
  );
