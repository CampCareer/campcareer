begin;

alter table public.feedback
  add column if not exists contact_email text,
  add column if not exists system_info_consent boolean not null default false,
  add column if not exists screenshot_bucket text,
  add column if not exists screenshot_path text,
  add column if not exists screenshot_content_type text,
  add column if not exists screenshot_size_bytes integer,
  add column if not exists expires_at timestamptz not null default (now() + interval '180 days');

alter table public.feedback
  drop constraint if exists feedback_contact_requires_consent,
  drop constraint if exists feedback_screenshot_reference_check,
  drop constraint if exists feedback_screenshot_size_check;

alter table public.feedback
  add constraint feedback_contact_requires_consent
    check (contact_email is null or coalesce(email_consent, false)),
  add constraint feedback_screenshot_reference_check
    check (
      (screenshot_bucket is null and screenshot_path is null)
      or (screenshot_bucket = 'feedback-screenshots' and screenshot_path is not null)
    ),
  add constraint feedback_screenshot_size_check
    check (screenshot_size_bytes is null or screenshot_size_bytes between 1 and 5242880);

create index if not exists feedback_expires_at_idx on public.feedback (expires_at);

comment on column public.feedback.contact_email is
  'Optional follow-up address, stored only when email_consent is true.';
comment on column public.feedback.system_info_consent is
  'Whether the submitter explicitly consented to limited diagnostic metadata.';
comment on column public.feedback.screenshot_path is
  'Private Storage object path. Generate a short-lived signed download URL only for authorized reviewers.';
comment on column public.feedback.expires_at is
  'Retention deadline. Feedback and any linked private screenshot should be deleted after this timestamp.';
comment on column public.feedback.screenshot_url is
  'Legacy public URL field. New submissions use screenshot_bucket and screenshot_path.';

-- Feedback writes now pass through the validated server route. Remove the old
-- direct anonymous insert policy and keep Data API access service-role-only.
alter table public.feedback enable row level security;
drop policy if exists "Anyone can insert feedback" on public.feedback;
drop policy if exists "Only service role can read feedback" on public.feedback;
drop policy if exists "Feedback is server managed" on public.feedback;

revoke all privileges on table public.feedback from anon, authenticated;
grant select, insert, update, delete on table public.feedback to service_role;

create policy "Feedback is server managed"
  on public.feedback
  for all
  to service_role
  using (true)
  with check (true);

do $$
begin
  if to_regclass('public.feedback_id_seq') is not null then
    execute 'revoke all privileges on sequence public.feedback_id_seq from anon, authenticated';
    execute 'grant usage, select on sequence public.feedback_id_seq to service_role';
  end if;
end
$$;

-- Private screenshots are limited at the bucket boundary as well as in the API.
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'feedback-screenshots',
  'feedback-screenshots',
  false,
  5242880,
  array['image/png', 'image/jpeg', 'image/webp']::text[]
)
on conflict (id) do update
set
  name = excluded.name,
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Signed upload tokens are issued by the service-role server endpoint. There is
-- intentionally no anon/authenticated list, read, update or delete policy.
drop policy if exists "Feedback screenshots are server managed" on storage.objects;
create policy "Feedback screenshots are server managed"
  on storage.objects
  for all
  to service_role
  using (bucket_id = 'feedback-screenshots')
  with check (bucket_id = 'feedback-screenshots');

commit;
