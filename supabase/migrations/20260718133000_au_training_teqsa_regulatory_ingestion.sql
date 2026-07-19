-- Source-specific operational tables. These records are private review inputs;
-- no licence, registration or provider status is published until reviewed.

create table if not exists public.training_qualifications_au (
  qualification_code text primary key,
  qualification_title text not null,
  qualification_url text not null,
  qualification_status text not null default 'review_required'
    check (qualification_status in ('current', 'superseded', 'review_required', 'fetch_failed')),
  qualification_description text,
  licensing_note text,
  source_content_hash text,
  last_checked_at timestamptz not null default now(),
  review_status text not null default 'review_required'
    check (review_status in ('review_required', 'verified', 'stale', 'rejected')),
  reviewer_note text
);
create index if not exists training_qualifications_au_review_idx
  on public.training_qualifications_au (review_status, last_checked_at desc);

create table if not exists public.teqsa_provider_checks_au (
  institution_id text primary key references public.colleges_au(institution_id) on delete cascade,
  provider_name text not null,
  register_search_url text not null,
  source_content_hash text,
  fetch_status text not null check (fetch_status in ('found', 'not_confirmed', 'fetch_failed')),
  extracted_text text,
  last_checked_at timestamptz not null default now(),
  review_status text not null default 'review_required'
    check (review_status in ('review_required', 'verified', 'stale', 'rejected')),
  reviewer_note text
);
create index if not exists teqsa_provider_checks_au_review_idx
  on public.teqsa_provider_checks_au (review_status, fetch_status, last_checked_at desc);

alter table public.training_qualifications_au enable row level security;
alter table public.teqsa_provider_checks_au enable row level security;
grant all privileges on table public.training_qualifications_au, public.teqsa_provider_checks_au to service_role;
