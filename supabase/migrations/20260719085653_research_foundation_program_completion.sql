-- A programme completion is written only by the server after it rechecks the
-- user's current planning records. The evidence snapshot is private and makes
-- the completion explainable without treating it as an academic credential.

create table if not exists public.program_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  program_id text not null check (program_id in ('research-foundation-v1')),
  evidence jsonb not null,
  completed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (user_id, program_id),
  check (jsonb_typeof(evidence) = 'object')
);

create index if not exists program_completions_user_completed_idx
  on public.program_completions (user_id, completed_at desc);

alter table public.program_completions enable row level security;
grant select on public.program_completions to authenticated;

create policy "users read own programme completions"
  on public.program_completions for select to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
