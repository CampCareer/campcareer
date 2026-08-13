insert into public.career_official_sources
(source_key,authority,title,url,source_type,last_verified_on,notes)
values
('au-ablis-licensing','Australian Government Department of Industry, Science and Resources','Australian Business Licence and Information Service','https://ablis.business.gov.au/?region=AU','official_service','2026-08-13','National government service for finding state, territory, local and Australian government licences, permits, approvals and compliance requirements.')
on conflict (source_key) do update set
 authority=excluded.authority,
 title=excluded.title,
 url=excluded.url,
 source_type=excluded.source_type,
 last_verified_on=excluded.last_verified_on,
 notes=excluded.notes;

update public.career_foundation_blockers
set source_key='au-training-cpcwhs1001',
    official_source_url='https://training.gov.au/Training/Details/CPCWHS1001',
    last_verified_on='2026-08-13'
where blocker_key='AU:carpenter:white-card-blocker'
  and profile_key='AU:carpenter';

update public.career_foundation_blockers
set source_key='au-ablis-licensing',
    official_source_url='https://ablis.business.gov.au/?region=AU',
    last_verified_on='2026-08-13'
where blocker_key='AU:carpenter:jurisdiction-check'
  and profile_key='AU:carpenter';

update public.career_foundation_entry_points
set label='Check state and territory licensing requirements',
    provider='Australian Business Licence and Information Service (ABLIS)',
    url='https://ablis.business.gov.au/?region=AU',
    source_key='au-ablis-licensing',
    notes='Use ABLIS to check location- and work-mode-specific licensing, permit and compliance requirements. White Card evidence is maintained separately under CPCWHS1001.',
    last_verified_on='2026-08-13'
where entry_point_key='AU:carpenter:licensing-check'
  and profile_key='AU:carpenter';
