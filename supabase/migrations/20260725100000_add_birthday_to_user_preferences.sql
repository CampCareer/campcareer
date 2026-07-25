alter table public.user_preferences add column if not exists birthday date;

comment on column public.user_preferences.birthday is 'User date of birth (YYYY-MM-DD). Used for age-gated content and personalisation. Never shown publicly.';
