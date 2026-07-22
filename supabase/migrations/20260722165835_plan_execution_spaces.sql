-- Durable execution spaces for the CampCareer My Plan workspace.
-- Each record is private to its owner and works independently of device-local notes.

begin;

create table public.plan_application_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goal_option_id uuid references public.plan_goal_options(id) on delete set null,
  provider_name text not null default '' check (char_length(provider_name) <= 240),
  programme_name text not null default '' check (char_length(programme_name) <= 240),
  status text not null default 'preparing' check (status in ('planning', 'preparing', 'submitted', 'offer', 'declined')),
  deadline_date date,
  offer_date date,
  notes text not null default '' check (char_length(notes) <= 1200),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.plan_application_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  application_id uuid references public.plan_application_records(id) on delete cascade,
  label text not null check (char_length(label) between 1 and 180),
  status text not null default 'todo' check (status in ('todo', 'ready', 'submitted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.plan_money_scenarios (
  user_id uuid primary key references auth.users(id) on delete cascade,
  scholarship_amount numeric(12, 2) not null default 0 check (scholarship_amount >= 0),
  conservative_cost_lift numeric(5, 2) not null default 15 check (conservative_cost_lift between 0 and 50),
  updated_at timestamptz not null default now()
);

create table public.plan_english_study_blocks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  focus text not null default '' check (char_length(focus) <= 180),
  minutes smallint not null default 60 check (minutes between 5 and 600),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, day_of_week)
);

create table public.plan_research_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  source_type text not null check (source_type in ('university', 'course', 'field', 'career')),
  source_reference text not null check (char_length(source_reference) between 1 and 160),
  title text not null default '' check (char_length(title) <= 240),
  provider_name text not null default '' check (char_length(provider_name) <= 240),
  field_name text not null default '' check (char_length(field_name) <= 180),
  status text not null default 'watching' check (status in ('shortlist', 'watching', 'ruled_out')),
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (user_id, source_type, source_reference)
);

create table public.plan_pathway_decisions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  leading_option_id uuid,
  rationale text not null default '' check (char_length(rationale) <= 1200),
  updated_at timestamptz not null default now()
);

create index plan_application_records_user_deadline_idx on public.plan_application_records (user_id, deadline_date);
create index plan_application_documents_user_idx on public.plan_application_documents (user_id, application_id);
create index plan_english_study_blocks_user_day_idx on public.plan_english_study_blocks (user_id, day_of_week);
create index plan_research_items_user_status_idx on public.plan_research_items (user_id, status, updated_at desc);

grant select, insert, update, delete on public.plan_application_records to authenticated;
grant select, insert, update, delete on public.plan_application_documents to authenticated;
grant select, insert, update, delete on public.plan_money_scenarios to authenticated;
grant select, insert, update, delete on public.plan_english_study_blocks to authenticated;
grant select, insert, update, delete on public.plan_research_items to authenticated;
grant select, insert, update, delete on public.plan_pathway_decisions to authenticated;

alter table public.plan_application_records enable row level security;
alter table public.plan_application_documents enable row level security;
alter table public.plan_money_scenarios enable row level security;
alter table public.plan_english_study_blocks enable row level security;
alter table public.plan_research_items enable row level security;
alter table public.plan_pathway_decisions enable row level security;

create policy "users read own application records" on public.plan_application_records for select to authenticated using ((select auth.uid()) = user_id);
create policy "users insert own application records" on public.plan_application_records for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "users update own application records" on public.plan_application_records for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "users delete own application records" on public.plan_application_records for delete to authenticated using ((select auth.uid()) = user_id);

create policy "users read own application documents" on public.plan_application_documents for select to authenticated using ((select auth.uid()) = user_id);
create policy "users insert own application documents" on public.plan_application_documents for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "users update own application documents" on public.plan_application_documents for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "users delete own application documents" on public.plan_application_documents for delete to authenticated using ((select auth.uid()) = user_id);

create policy "users read own money scenarios" on public.plan_money_scenarios for select to authenticated using ((select auth.uid()) = user_id);
create policy "users insert own money scenarios" on public.plan_money_scenarios for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "users update own money scenarios" on public.plan_money_scenarios for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "users delete own money scenarios" on public.plan_money_scenarios for delete to authenticated using ((select auth.uid()) = user_id);

create policy "users read own english study blocks" on public.plan_english_study_blocks for select to authenticated using ((select auth.uid()) = user_id);
create policy "users insert own english study blocks" on public.plan_english_study_blocks for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "users update own english study blocks" on public.plan_english_study_blocks for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "users delete own english study blocks" on public.plan_english_study_blocks for delete to authenticated using ((select auth.uid()) = user_id);

create policy "users read own research items" on public.plan_research_items for select to authenticated using ((select auth.uid()) = user_id);
create policy "users insert own research items" on public.plan_research_items for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "users update own research items" on public.plan_research_items for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "users delete own research items" on public.plan_research_items for delete to authenticated using ((select auth.uid()) = user_id);

create policy "users read own pathway decision" on public.plan_pathway_decisions for select to authenticated using ((select auth.uid()) = user_id);
create policy "users insert own pathway decision" on public.plan_pathway_decisions for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "users update own pathway decision" on public.plan_pathway_decisions for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "users delete own pathway decision" on public.plan_pathway_decisions for delete to authenticated using ((select auth.uid()) = user_id);

commit;
