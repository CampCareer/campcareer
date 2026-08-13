update public.career_raw_observations
set raw_value = raw_value || jsonb_build_object(
  'persistence_comparator','same_period_previous_year',
  'persistence_supported',true
)
where observation_key='au-carpenters-joiners-ivi-may-2026'
  and profile_key='AU:carpenter';
