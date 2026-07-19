-- User-owned visual preferences for the draggable Planner workspace.
create table public.planner_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  theme text not null default 'mist' check (theme in ('mist', 'lavender', 'sage', 'peach', 'midnight')),
  widget_order jsonb not null default '["today","dates","money","english","research"]'::jsonb
    check (jsonb_typeof(widget_order) = 'array'),
  widget_sizes jsonb not null default '{"today":"wide","dates":"narrow","money":"half","english":"half","research":"wide"}'::jsonb
    check (jsonb_typeof(widget_sizes) = 'object'),
  updated_at timestamptz not null default now()
);

alter table public.planner_preferences enable row level security;
grant select, insert, update, delete on public.planner_preferences to authenticated;

create policy "users read own planner preferences" on public.planner_preferences
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "users insert own planner preferences" on public.planner_preferences
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "users update own planner preferences" on public.planner_preferences
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "users delete own planner preferences" on public.planner_preferences
  for delete to authenticated using ((select auth.uid()) = user_id);
