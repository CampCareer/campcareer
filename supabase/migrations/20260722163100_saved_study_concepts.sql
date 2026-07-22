-- Store the Australia study fields a user wants to carry into My Plan.
-- A concept is intentionally separate from a provider or exact course: users
-- often decide on a direction before they can shortlist a school.

begin;

create table if not exists public.saved_study_concepts (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  concept_slug text not null check (char_length(concept_slug) between 1 and 120),
  concept_label text not null default '' check (char_length(concept_label) <= 160),
  concept_label_ko text not null default '' check (char_length(concept_label_ko) <= 160),
  category text not null default '' check (char_length(category) <= 80),
  country text not null default 'AU' check (country = 'AU'),
  created_at timestamptz not null default now(),
  unique (user_id, concept_slug)
);

create index if not exists saved_study_concepts_user_created_idx
  on public.saved_study_concepts (user_id, created_at desc);

grant select, insert, update, delete on public.saved_study_concepts to authenticated;

alter table public.saved_study_concepts enable row level security;

create policy "users read own saved study concepts"
  on public.saved_study_concepts
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "users insert own saved study concepts"
  on public.saved_study_concepts
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "users update own saved study concepts"
  on public.saved_study_concepts
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "users delete own saved study concepts"
  on public.saved_study_concepts
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

commit;
