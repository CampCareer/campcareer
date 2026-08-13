update public.career_score_components
set explanation='Vacancy fallback: low intensity 3 plus same-period persistence 1 equals 4.'
where snapshot_key='AU:carpenter:2026-08-13:v1'
  and component_key='vacancy_intensity';
