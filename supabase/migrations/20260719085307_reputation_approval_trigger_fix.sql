-- The initial trigger was created before insert/update. Reputation must be
-- written after the submission row exists because the ledger has a foreign key
-- to that row. Keep timestamps in a separate BEFORE trigger.

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
