do $$
declare
  reviewed_ts timestamptz := now();
begin
  delete from evidence.metric_observations
  where scope_type = 'country'
    and scope_id = 'DK'
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
    v.metric_key, 'country', 'DK', v.value, v.unit, ss.id,
    v.evidence_kind, v.confidence, v.methodology, v.assumptions, v.effective_from,
    'verified', reviewed_ts,
    'CampCareer batch 3 Denmark official-source review, 6 August 2026', reviewed_ts
  from (
    values
      ('full_time_annual_earnings_range', 'cc_dk_dst_earnings_2024_v2',
       '{"low":551465,"high":620100,"ranking_value":551465,"currency":"DKK","basis":"national_median_to_mean_standardised_monthly_earnings_annualised","measure_type":"median_to_mean_comparison","median_standardised_hourly":286.63,"standard_month_hours":160.33,"monthly_median_calculated":45955.39,"monthly_average":51675,"population":"employees excluding trainees and employees under 18, Denmark"}'::jsonb,
       'DKK/year', 'calculated', 'medium',
       'The national standardized hourly median from Statistics Denmark StatBank LONS20 is multiplied by the 160.33-hour standard month and by twelve. The official national average monthly earnings are multiplied by twelve. The published range is median to mean because a directly reusable national P25-P75 extract was not used.',
       '{"median_hourly_to_monthly_multiplier":160.33,"monthly_to_annual_multiplier":12,"not_a_quartile_range":true,"not_a_starting_salary":true,"statbank_table":"https://www.statbank.dk/LONS20"}'::jsonb, date '2024-12-31'),
      ('average_annual_salary', 'cc_dk_dst_earnings_2024_v2',
       '{"amount":620100,"currency":"DKK","monthly_amount":51675,"statistic_type":"mean","basis":"annualised_national_average_standardised_monthly_earnings","population":"employees excluding trainees and employees under 18, Denmark"}'::jsonb,
       'DKK/year', 'calculated', 'high',
       'Statistics Denmark official national average standardized monthly earnings of DKK 51,675 are multiplied by twelve.',
       '{"monthly_to_annual_multiplier":12,"pension_and_bonus_included":true,"overtime_and_absence_pay_excluded":true,"not_a_starting_salary":true}'::jsonb, date '2024-12-31'),
      ('national_minimum_hourly_wage', 'cc_dk_lifeindenmark_minimum_wage_2026_v2',
       '{"amount":null,"currency":"DKK","not_applicable":true,"basis":"no_statutory_national_minimum_wage","collective_bargaining_primary":true}'::jsonb,
       'DKK/hour', 'observed', 'high',
       'Denmark has no statutory national minimum wage. Pay is commonly governed by collective agreements or individual negotiation, so no artificial hourly amount is published.',
       '{"sector_and_agreement_rates_may_apply":true,"numeric_value_intentionally_null":true}'::jsonb, date '2026-06-29'),
      ('student_living_cost_monthly_range', 'cc_dk_studyindenmark_budget_2026_v2',
       '{"low":8450,"high":13600,"ranking_value":11025,"currency":"DKK","basis":"official_student_budget_item_range_sum","scenario":"one higher-education student; tuition excluded","rent_low":3000,"rent_high":6500,"food_low":2000,"food_high":3500,"permit_maintenance_requirement_monthly":7426}'::jsonb,
       'DKK/month', 'calculated', 'medium',
       'Study in Denmark monthly budget line items are summed at their published lower and upper amounts. The separate SIRI residence-permit maintenance requirement of DKK 7,426 per month is recorded for context but is not used as the lower spending estimate.',
       '{"secondary_official_source":"https://nyidanmark.dk/en-GB/You-want-to-apply/Study/Higher-Education","tuition_excluded":true,"deposit_and_setup_costs_excluded":true,"permit_finance_floor_not_spending_forecast":true}'::jsonb, date '2026-08-06'),
      ('tuition_annual_low', 'cc_dk_aau_tuition_2026_v2',
       '{"amount":55600,"currency":"DKK","basis":"representative_mainstream_bachelor_fee_2026","programme_area":"economics and business administration","institution":"Aalborg University","student_type":"non-EU/EEA student","special_high_cost_programmes_excluded":true}'::jsonb,
       'DKK/year', 'observed', 'high',
       'The lower representative fee is Aalborg University annual 2026 tuition for the BSc in Economics and Business Administration. It is a verified programme benchmark, not a claimed national minimum.',
       '{"national_minimum_claimed":false,"two_semesters":true,"application_fee_excluded":true}'::jsonb, date '2026-08-01'),
      ('tuition_annual_high', 'cc_dk_aau_tuition_2026_v2',
       '{"amount":115700,"currency":"DKK","basis":"representative_mainstream_engineering_bachelor_fee_2026","programme_area":"applied industrial electronics, chemical engineering and biotechnology, and energy engineering","institution":"Aalborg University","student_type":"non-EU/EEA student","special_high_cost_programmes_excluded":true}'::jsonb,
       'DKK/year', 'observed', 'high',
       'The upper representative fee is Aalborg University annual 2026 tuition for selected engineering and biotechnology bachelor programmes. It is not presented as a national maximum and specialist high-cost programmes are excluded.',
       '{"national_maximum_claimed":false,"two_semesters":true,"application_fee_excluded":true}'::jsonb, date '2026-08-01'),
      ('student_work_hours_limit', 'cc_dk_siri_higher_education_2026_v2',
       '{"hours":20.77,"period":"week_comparison","legal_limit_hours":90,"legal_limit_period":"calendar_month","applies_during":"September_to_May","comparison_conversion":"90*12/52","summer_full_time_months":["June","July","August"],"state_approved_programme_required":true}'::jsonb,
       'hours/week', 'calculated', 'high',
       'The official legal limit is 90 hours per calendar month from September to May. The shared weekly comparison field is transparently normalised as 90 multiplied by 12 and divided by 52, giving 20.77 hours per week. Compliance is controlled by the monthly limit, not the converted weekly figure.',
       '{"monthly_limit_controls_legality":true,"individual_permit_conditions_control":true,"non_state_approved_programmes_may_not_include_work_rights":true}'::jsonb, date '2026-01-01'),
      ('visa_application_fee', 'cc_dk_siri_higher_education_2026_v2',
       '{"amount":3060,"currency":"DKK","basis":"higher_education_residence_permit_processing_fee","visa_type":"residence permit for higher education"}'::jsonb,
       'DKK', 'observed', 'high',
       'The calculation metric stores the SIRI processing fee for a higher-education residence permit. It is not added to the /visas catalogue.',
       '{"biometrics_travel_and_external_service_costs_excluded":true}'::jsonb, date '2026-01-01')
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
    where scope_type='country' and scope_id='DK' and review_status='verified'
      and metric_key in (
        'full_time_annual_earnings_range', 'average_annual_salary',
        'national_minimum_hourly_wage', 'student_living_cost_monthly_range',
        'tuition_annual_low', 'tuition_annual_high',
        'student_work_hours_limit', 'visa_application_fee'
      )
  ) <> 8 then
    raise exception 'Expected exactly 8 verified Denmark metric observations';
  end if;
end $$;

delete from evidence.sources s
where s.country_code = 'DK'
  and s.source_key not in (
    'cc_dk_dst_earnings_2024_v2',
    'cc_dk_studyindenmark_budget_2026_v2',
    'cc_dk_siri_higher_education_2026_v2',
    'cc_dk_lifeindenmark_minimum_wage_2026_v2',
    'cc_dk_aau_tuition_2026_v2'
  )
  and not exists (
    select 1
    from evidence.source_snapshots ss
    join evidence.metric_observations mo on mo.source_snapshot_id = ss.id
    where ss.source_id = s.id
  );
