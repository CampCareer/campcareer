update public.career_normalized_metrics
set explanation='Low fallback intensity 3 plus positive same-period year-over-year persistence 1 equals 4.',
    calculated_at=now()
where normalized_metric_key='AU:carpenter:vacancy_fallback_points_v1';
