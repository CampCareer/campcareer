-- Personal planning workspace for /dashboard (presented as "My Plan").
-- These records are intentionally separate from the public study catalog and
-- are visible only to their owner through authenticated RLS policies.

create table public.plan_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entry_date date not null default current_date,
  title text not null default '' check (char_length(title) <= 160),
  content text not null default '' check (char_length(content) <= 12000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.plan_tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null check (char_length(title) between 1 and 240),
  notes text not null default '' check (char_length(notes) <= 2000),
  kind text not null default 'personal' check (kind in ('application', 'english', 'money', 'research', 'personal')),
  status text not null default 'todo' check (status in ('todo', 'done')),
  due_date date,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.plan_budgets (
  user_id uuid primary key references auth.users(id) on delete cascade,
  currency text not null default 'AUD' check (currency ~ '^[A-Z]{3}$'),
  current_savings numeric(14, 2) not null default 0 check (current_savings >= 0),
  monthly_saving numeric(14, 2) not null default 0 check (monthly_saving >= 0),
  target_amount numeric(14, 2) check (target_amount is null or target_amount > 0),
  target_date date,
  updated_at timestamptz not null default now()
);

create table public.plan_language_goals (
  user_id uuid primary key references auth.users(id) on delete cascade,
  exam_name text not null default 'IELTS' check (char_length(exam_name) <= 80),
  current_score numeric(3, 1) check (current_score is null or current_score between 0 and 10),
  target_score numeric(3, 1) check (target_score is null or target_score between 0 and 10),
  weekly_hours numeric(4, 1) check (weekly_hours is null or weekly_hours between 0 and 80),
  test_date date,
  updated_at timestamptz not null default now()
);

create index plan_notes_user_date_idx on public.plan_notes (user_id, entry_date desc, created_at desc);
create index plan_tasks_user_status_due_idx on public.plan_tasks (user_id, status, due_date nulls last, created_at desc);

alter table public.plan_notes enable row level security;
alter table public.plan_tasks enable row level security;
alter table public.plan_budgets enable row level security;
alter table public.plan_language_goals enable row level security;

grant select, insert, update, delete on public.plan_notes to authenticated;
grant select, insert, update, delete on public.plan_tasks to authenticated;
grant select, insert, update, delete on public.plan_budgets to authenticated;
grant select, insert, update, delete on public.plan_language_goals to authenticated;

create policy "users read own plan notes" on public.plan_notes
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "users insert own plan notes" on public.plan_notes
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "users update own plan notes" on public.plan_notes
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "users delete own plan notes" on public.plan_notes
  for delete to authenticated using ((select auth.uid()) = user_id);

create policy "users read own plan tasks" on public.plan_tasks
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "users insert own plan tasks" on public.plan_tasks
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "users update own plan tasks" on public.plan_tasks
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "users delete own plan tasks" on public.plan_tasks
  for delete to authenticated using ((select auth.uid()) = user_id);

create policy "users read own plan budget" on public.plan_budgets
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "users insert own plan budget" on public.plan_budgets
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "users update own plan budget" on public.plan_budgets
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "users delete own plan budget" on public.plan_budgets
  for delete to authenticated using ((select auth.uid()) = user_id);

create policy "users read own language goal" on public.plan_language_goals
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "users insert own language goal" on public.plan_language_goals
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "users update own language goal" on public.plan_language_goals
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "users delete own language goal" on public.plan_language_goals
  for delete to authenticated using ((select auth.uid()) = user_id);
