-- Private reputation starts with reviewed, useful contributions—not activity volume.
-- A reviewer changes a submission from pending to approved in the Supabase table
-- editor (or an internal moderation tool in a future release). The trigger below
-- writes an immutable ledger event only for that approved transition.

create table if not exists public.contribution_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('review', 'correction', 'source')),
  target_path text not null check (
    char_length(target_path) between 1 and 500
    and target_path like '/%'
    and target_path not like '//%'
  ),
  target_label text not null default '' check (char_length(target_label) <= 180),
  description text not null check (char_length(description) between 30 and 3000),
  source_url text check (source_url is null or (char_length(source_url) <= 500 and source_url ~ '^https?://')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewer_note text check (reviewer_note is null or char_length(reviewer_note) <= 1000),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (kind <> 'source' or source_url is not null)
);

create index if not exists contribution_submissions_user_created_idx
  on public.contribution_submissions (user_id, created_at desc);
create index if not exists contribution_submissions_status_created_idx
  on public.contribution_submissions (status, created_at asc);

create table if not exists public.reputation_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  contribution_id uuid not null unique references public.contribution_submissions(id) on delete cascade,
  event_type text not null check (event_type = 'approved_contribution'),
  points smallint not null check (points > 0 and points <= 100),
  created_at timestamptz not null default now()
);

create index if not exists reputation_ledger_user_created_idx
  on public.reputation_ledger (user_id, created_at desc);

alter table public.contribution_submissions enable row level security;
alter table public.reputation_ledger enable row level security;

grant select, insert, delete on public.contribution_submissions to authenticated;
grant select on public.reputation_ledger to authenticated;

create policy "contributors read own submissions"
  on public.contribution_submissions for select to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "contributors submit pending work"
  on public.contribution_submissions for insert to authenticated
  with check (
    (select auth.uid()) is not null
    and (select auth.uid()) = user_id
    and status = 'pending'
    and reviewer_note is null
    and reviewed_at is null
  );

create policy "contributors withdraw pending work"
  on public.contribution_submissions for delete to authenticated
  using (
    (select auth.uid()) is not null
    and (select auth.uid()) = user_id
    and status = 'pending'
  );

create policy "contributors read own reputation"
  on public.reputation_ledger for select to authenticated
  using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create schema if not exists private;
revoke all on schema private from public;

create or replace function private.set_contribution_timestamps()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if tg_op = 'UPDATE' and new.status is distinct from old.status and new.status in ('approved', 'rejected') and new.reviewed_at is null then
    new.reviewed_at := now();
  end if;
  new.updated_at := now();
  return new;
end;
$$;

revoke all on function private.set_contribution_timestamps() from public;

create or replace function private.apply_contribution_reputation()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  awarded_points smallint;
begin
  if new.status = 'approved' and (tg_op = 'INSERT' or old.status is distinct from 'approved') then
    awarded_points := case new.kind
      when 'review' then 25
      when 'correction' then 10
      when 'source' then 15
    end;

    insert into public.reputation_ledger (user_id, contribution_id, event_type, points)
    values (new.user_id, new.id, 'approved_contribution', awarded_points)
    on conflict (contribution_id) do nothing;
  elsif tg_op = 'UPDATE' and old.status = 'approved' and new.status <> 'approved' then
    delete from public.reputation_ledger where contribution_id = new.id;
  end if;

  return new;
end;
$$;

revoke all on function private.apply_contribution_reputation() from public;

drop trigger if exists contribution_submission_timestamps on public.contribution_submissions;
create trigger contribution_submission_timestamps
  before insert or update on public.contribution_submissions
  for each row execute function private.set_contribution_timestamps();

drop trigger if exists contribution_reputation_after_review on public.contribution_submissions;
create trigger contribution_reputation_after_review
  after insert or update of status on public.contribution_submissions
  for each row execute function private.apply_contribution_reputation();
