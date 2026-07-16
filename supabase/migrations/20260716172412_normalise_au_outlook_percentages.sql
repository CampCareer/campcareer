-- The JSA projection workbook stores percentage cells as decimal fractions.
-- The first import preserved the raw Excel value; public-facing values use
-- percentage points, so repair the existing official JSA projection rows.
update public.occupation_outlook_au
set employment_change_pct = round((employment_change_pct * 100)::numeric, 2)
where source_name = 'Jobs and Skills Australia Employment Projections'
  and employment_change_pct is not null;
