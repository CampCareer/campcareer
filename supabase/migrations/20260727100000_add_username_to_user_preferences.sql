alter table public.user_preferences add column if not exists username text;

-- Enforce unique usernames
create unique index if not exists user_preferences_username_unique
  on public.user_preferences (username)
  where username is not null;

-- Username format: 3-30 chars, lowercase alphanumeric + underscores, must start with a letter
alter table public.user_preferences
  add constraint user_preferences_username_check
  check (username is null or (length(username) >= 3 and length(username) <= 30 and username ~ '^[a-z][a-z0-9_]*$'));

comment on column public.user_preferences.username is 'Public URL slug (e.g. x.com/campcareer.com/[username]). Lowercase, 3-30 chars, alphanumeric + underscores.';
