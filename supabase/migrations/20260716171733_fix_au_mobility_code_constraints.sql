-- The first migration escaped the POSIX regex token one level too far. Keep
-- the validation in place, but use PostgreSQL's single-backslash digit token.
alter table public.occupation_mobility_flows_au
  drop constraint occupation_mobility_flows_au_financial_year_check,
  drop constraint occupation_mobility_flows_au_previous_anzsco_v13_check,
  drop constraint occupation_mobility_flows_au_recent_anzsco_v13_check,
  add constraint occupation_mobility_flows_au_financial_year_check check (financial_year ~ '^\d{4}_\d{4}$'),
  add constraint occupation_mobility_flows_au_previous_anzsco_v13_check check (previous_anzsco_v13 ~ '^\d{6}$'),
  add constraint occupation_mobility_flows_au_recent_anzsco_v13_check check (recent_anzsco_v13 ~ '^\d{6}$');

alter table public.occupation_mobility_stocks_au
  drop constraint occupation_mobility_stocks_au_financial_year_check,
  drop constraint occupation_mobility_stocks_au_anzsco_v13_check,
  add constraint occupation_mobility_stocks_au_financial_year_check check (financial_year ~ '^\d{4}_\d{4}$'),
  add constraint occupation_mobility_stocks_au_anzsco_v13_check check (anzsco_v13 ~ '^\d{6}$');
