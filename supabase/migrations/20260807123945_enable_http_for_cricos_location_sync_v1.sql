-- Temporary operational extension used to retrieve official data.gov.au CKAN resources
-- during the one-time CRICOS location backfill. A later migration removes it.
create extension if not exists http with schema extensions;
