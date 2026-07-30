-- JSA Occupation Profiles publishes medians for full-time, non-managerial
-- adult employees. These are deliberately stored as weekly/hourly medians;
-- route results may calculate a clearly labelled annual equivalent but must
-- not relabel the source data as an average salary.
alter table public.occupation_profiles_au
  add column if not exists median_weekly_earnings_aud integer check (median_weekly_earnings_aud > 0),
  add column if not exists median_hourly_earnings_aud numeric(8,2) check (median_hourly_earnings_aud > 0);

comment on column public.occupation_profiles_au.median_weekly_earnings_aud is
  'Median full-time weekly earnings before tax, JSA Occupation Profiles / ABS Employee Earnings and Hours.';

comment on column public.occupation_profiles_au.median_hourly_earnings_aud is
  'Median full-time hourly earnings before tax, JSA Occupation Profiles / ABS Employee Earnings and Hours.';
