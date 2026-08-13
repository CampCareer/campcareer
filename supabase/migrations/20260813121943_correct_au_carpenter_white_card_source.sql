insert into public.career_official_sources
(source_key,authority,title,url,source_type,last_verified_on,notes)
values
('au-training-cpcwhs1001','Australian Government National Training Register','CPCWHS1001 Prepare to work safely in the construction industry','https://training.gov.au/Training/Details/CPCWHS1001','official_primary','2026-08-13','Current unit of competency for mandatory general construction induction training. Used as the direct White Card evidence source; CPC30220 remains the carpentry qualification/apprenticeship source.')
on conflict (source_key) do update set
 authority=excluded.authority,
 title=excluded.title,
 url=excluded.url,
 source_type=excluded.source_type,
 last_verified_on=excluded.last_verified_on,
 notes=excluded.notes;
