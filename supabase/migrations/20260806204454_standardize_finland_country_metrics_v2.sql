do $$
declare
  reviewed_ts timestamptz := now();
begin
  delete from evidence.metric_observations
  where scope_type = 'country'
    and scope_id = 'FI'
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
    v.metric_key, 'country', 'FI', v.value, v.unit, ss.id,
    v.evidence_kind, v.confidence, v.methodology, v.assumptions, v.effective_from,
    'verified', reviewed_ts,
    'CampCareer batch 3 Finland official-source review, 6 August 2026', reviewed_ts
  from (
    values
      ('full_time_annual_earnings_range', 'cc_fi_statistics_earnings_2024_v2',
       '{"low":29796,"high":73428,"ranking_value":43380,"currency":"EUR","basis":"national_d1_to_d9_total_monthly_earnings_annualised","measure_type":"decile_distribution","monthly_d1":2483,"monthly_median":3615,"monthly_d9":6119,"population":"full-time wage and salary earners, Finland"}'::jsonb,
       'EUR/year', 'calculated', 'high',
       'Statistics Finland monthly first decile, median and ninth decile total earnings are multiplied by twelve. The range is an official D1-D9 distribution and is not labelled as a quartile range.',
       '{"monthly_to_annual_multiplier":12,"not_a_quartile_range":true,"not_a_starting_salary":true}'::jsonb, date '2024-12-31'),
      ('average_annual_salary', 'cc_fi_statistics_earnings_2024_v2',
       '{"amount":48840,"currency":"EUR","monthly_amount":4070,"statistic_type":"mean","basis":"annualised_average_total_earnings_full_time","population":"full-time wage and salary earners, Finland"}'::jsonb,
       'EUR/year', 'calculated', 'medium',
       'The official 2024 Structure of Earnings mean total earnings of EUR 4,070 per month are multiplied by twelve. The final distribution release and the same-series preliminary release are retained together in the source snapshot metadata.',
       '{"monthly_to_annual_multiplier":12,"same_reference_year_as_distribution":true,"not_a_starting_salary":true}'::jsonb, date '2024-12-31'),
      ('national_minimum_hourly_wage', 'cc_fi_infofinland_minimum_wage_v2',
       '{"amount":null,"currency":"EUR","not_applicable":true,"basis":"no_statutory_national_minimum_wage","collective_bargaining_primary":true}'::jsonb,
       'EUR/hour', 'observed', 'high',
       'Finnish law does not specify a national minimum wage. Generally binding collective agreements set sector-specific minimum pay, so no artificial hourly amount is published.',
       '{"sector_collective_agreement_rates_may_apply":true,"normal_and_reasonable_pay_required_without_agreement":true,"numeric_value_intentionally_null":true}'::jsonb, date '2026-08-06'),
      ('student_living_cost_monthly_range', 'cc_fi_studyinfinland_costs_2026_v2',
       '{"low":900,"high":1200,"ranking_value":1050,"currency":"EUR","basis":"official_student_monthly_planning_range","scenario":"one higher-education student; tuition excluded","permit_maintenance_requirement_monthly":800}'::jsonb,
       'EUR/month', 'observed', 'high',
       'Study in Finland publishes a planning range of EUR 900-1,200 per month. Migri''s EUR 800 monthly finance requirement is stored as contextual metadata and is not used as the lower spending estimate.',
       '{"secondary_official_source":"https://migri.fi/en/income-requirement-for-students","tuition_excluded":true,"deposit_and_setup_costs_excluded":true,"permit_finance_floor_not_spending_forecast":true}'::jsonb, date '2026-06-04'),
      ('tuition_annual_low', 'cc_fi_tampere_tuition_2026_v2',
       '{"amount":10000,"currency":"EUR","basis":"representative_mainstream_fee_category_2026","institution":"Tampere University","student_type":"non-EU/EEA/Swiss fee-liable student","special_high_cost_programmes_excluded":true}'::jsonb,
       'EUR/year', 'observed', 'high',
       'The lower representative benchmark is Tampere University''s EUR 10,000 annual tuition category for students admitted in 2026. It is not presented as a national minimum.',
       '{"national_minimum_claimed":false,"scholarships_and_discounts_excluded":true}'::jsonb, date '2026-08-01'),
      ('tuition_annual_high', 'cc_fi_aalto_tuition_2026_v2',
       '{"amount":17000,"currency":"EUR","basis":"representative_mainstream_technology_master_fee","institution":"Aalto University","programme_area":"technology and multidisciplinary master programmes","student_type":"non-EU/EEA/Swiss fee-liable student","special_high_cost_programmes_excluded":true}'::jsonb,
       'EUR/year', 'observed', 'high',
       'The upper representative benchmark is Aalto University''s EUR 17,000 annual fee for technology and multidisciplinary master programmes. Art and architecture programmes at EUR 20,000 are excluded as specialist high-cost programmes, and EUR 17,000 is not presented as a national maximum.',
       '{"national_maximum_claimed":false,"art_and_architecture_excluded":true,"scholarships_excluded":true}'::jsonb, date '2026-08-01'),
      ('student_work_hours_limit', 'cc_fi_migri_student_rules_2026_v2',
       '{"hours":30,"period":"week_average_over_calendar_year","basis":"average_weekly_limit_over_calendar_year","degree_related_work_unrestricted":true}'::jsonb,
       'hours/week', 'observed', 'high',
       'A student residence permit allows paid employment for an average of 30 hours per week over the calendar year. Work related to the degree, including practical training or thesis work, can be unrestricted.',
       '{"annual_average_controls_compliance":true,"weekly_hours_may_vary":true,"individual_permit_conditions_control":true}'::jsonb, date '2026-08-06'),
      ('visa_application_fee', 'cc_fi_migri_processing_fees_2026_v2',
       '{"amount":600,"currency":"EUR","basis":"electronic_first_student_residence_permit_fee","visa_type":"first residence permit for studies","paper_application_fee":750}'::jsonb,
       'EUR', 'observed', 'high',
       'The calculation metric stores the 2026 electronic processing fee for a first residence permit for studies. It is not added to the /visas catalogue.',
       '{"paper_application_fee":750,"insurance_travel_identification_and_external_service_costs_excluded":true}'::jsonb, date '2026-01-01')
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
    where scope_type='country' and scope_id='FI' and review_status='verified'
      and metric_key in (
        'full_time_annual_earnings_range', 'average_annual_salary',
        'national_minimum_hourly_wage', 'student_living_cost_monthly_range',
        'tuition_annual_low', 'tuition_annual_high',
        'student_work_hours_limit', 'visa_application_fee'
      )
  ) <> 8 then
    raise exception 'Expected exactly 8 verified Finland metric observations';
  end if;
end $$;

delete from evidence.sources s
where s.country_code = 'FI'
  and s.source_key not in (
    'cc_fi_statistics_earnings_2024_v2',
    'cc_fi_studyinfinland_costs_2026_v2',
    'cc_fi_migri_student_rules_2026_v2',
    'cc_fi_migri_processing_fees_2026_v2',
    'cc_fi_infofinland_minimum_wage_v2',
    'cc_fi_tampere_tuition_2026_v2',
    'cc_fi_aalto_tuition_2026_v2'
  )
  and not exists (
    select 1
    from evidence.source_snapshots ss
    join evidence.metric_observations mo on mo.source_snapshot_id = ss.id
    where ss.source_id = s.id
  );
