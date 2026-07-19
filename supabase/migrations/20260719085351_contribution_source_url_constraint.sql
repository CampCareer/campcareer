alter table public.contribution_submissions
  add constraint contribution_submissions_source_url_protocol_check
  check (source_url is null or (char_length(source_url) <= 500 and source_url ~ '^https?://'));
