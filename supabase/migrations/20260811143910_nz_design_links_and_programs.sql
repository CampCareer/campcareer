insert into public.country_occupation_specialisations (profile_key,official_code,official_title,shortage_rating,visa_eligible,included_in_rollup,sort_order,source_url,source_checked_at) values
('NZ:graphic-designer','232411','Graphic Designer',null,true,true,1,'https://www.abs.gov.au/statistics/classifications/anzsco-australian-and-new-zealand-standard-classification-occupations/2021/browse-classification/2/23/232/2324','2026-08-11'),
('NZ:multimedia-designer','232413','Multimedia Designer',null,true,true,1,'https://www.abs.gov.au/statistics/classifications/anzsco-australian-and-new-zealand-standard-classification-occupations/2021/browse-classification/2/23/232/2324','2026-08-11'),
('NZ:animator','232412','Illustrator — Animator specialisation',null,true,true,1,'https://www.abs.gov.au/statistics/classifications/anzsco-australian-and-new-zealand-standard-classification-occupations/2021/browse-classification/2/23/232/2324','2026-08-11'),
('NZ:interior-designer','232511','Interior Designer',null,true,true,1,'https://www.abs.gov.au/statistics/classifications/anzsco-australian-and-new-zealand-standard-classification-occupations/2021/browse-classification/2/23/232/2325','2026-08-11'),
('NZ:film-editor','212314','Film and Video Editor',null,true,true,1,'https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00428-film-and-video-editor','2026-08-11'),
('NZ:architect','232111','Architect',null,true,true,1,'https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00156-architect','2026-08-11'),
('NZ:web-designer','232414','Web Designer',null,true,true,1,'https://www.abs.gov.au/statistics/classifications/anzsco-australian-and-new-zealand-standard-classification-occupations/2021/browse-classification/2/23/232/2324','2026-08-11')
on conflict (profile_key,official_code) do update set official_title=excluded.official_title,shortage_rating=excluded.shortage_rating,visa_eligible=excluded.visa_eligible,included_in_rollup=excluded.included_in_rollup,sort_order=excluded.sort_order,source_url=excluded.source_url,source_checked_at=excluded.source_checked_at;

insert into public.country_occupation_links (profile_key,link_type,label,url,provider_type,region_code,sort_order,source_checked_at) values
('NZ:graphic-designer','entry_program','Tahatū — Graphic Designer','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00391-graphic-designer','official_training',null,1,'2026-08-11'),
('NZ:graphic-designer','source','ANZSCO — Graphic and Web Designers, and Illustrators','https://www.abs.gov.au/statistics/classifications/anzsco-australian-and-new-zealand-standard-classification-occupations/2021/browse-classification/2/23/232/2324','official_classification',null,2,'2026-08-11'),
('NZ:ux-designer','entry_program','Tahatū — User Experience Designer','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T01095-user-experience-designer','official_training',null,1,'2026-08-11'),
('NZ:ux-designer','source','ANZSCO 2021 — User Experience Designer (ICT) 261113','https://www.abs.gov.au/statistics/classifications/anzsco-australian-and-new-zealand-standard-classification-occupations/2021/browse-classification/2/26/261/2611','official_classification',null,2,'2026-08-11'),
('NZ:ux-designer','source','Immigration New Zealand — NOL occupations used for AEWV','https://www.immigration.govt.nz/work/requirements-for-work-visas/green-list-occupations-qualifications-and-skills/national-occupation-list-occupations-used-for-an-aewv/','official_immigration',null,3,'2026-08-11'),
('NZ:multimedia-designer','entry_program','Tahatū — Bachelor degrees in Multimedia computing','https://tahatu.govt.nz/study-and-training/explore-study-and-training/1007-communication-and-media/100710/05-bachelors-degrees-in-multimedia-computing','official_training',null,1,'2026-08-11'),
('NZ:multimedia-designer','source','ANZSCO — Multimedia Designer 232413','https://www.abs.gov.au/statistics/classifications/anzsco-australian-and-new-zealand-standard-classification-occupations/2021/browse-classification/2/23/232/2324','official_classification',null,2,'2026-08-11'),
('NZ:multimedia-designer','source','Immigration New Zealand — Green List (261211 Multimedia Specialist is a separate ICT occupation)','https://www.immigration.govt.nz/opsmanual/89117.htm','official_immigration',null,3,'2026-08-11'),
('NZ:animator','entry_program','Tahatū — Visual Effects Artist and Animator','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00386-visual-effects-artist-and-animator','official_training',null,1,'2026-08-11'),
('NZ:animator','source','ANZSCO — Illustrator 232412 (Animator specialisation)','https://www.abs.gov.au/statistics/classifications/anzsco-australian-and-new-zealand-standard-classification-occupations/2021/browse-classification/2/23/232/2324','official_classification',null,2,'2026-08-11'),
('NZ:interior-designer','entry_program','Tahatū — Interior Designer','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00392-interior-designer','official_training',null,1,'2026-08-11'),
('NZ:interior-designer','source','ANZSCO — Interior Designer 232511','https://www.abs.gov.au/statistics/classifications/anzsco-australian-and-new-zealand-standard-classification-occupations/2021/browse-classification/2/23/232/2325','official_classification',null,2,'2026-08-11'),
('NZ:film-editor','entry_program','Tahatū — Film and Video Editor','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00428-film-and-video-editor','official_training',null,1,'2026-08-11'),
('NZ:film-editor','source','Immigration New Zealand — Green List','https://www.immigration.govt.nz/opsmanual/89117.htm','official_immigration',null,2,'2026-08-11'),
('NZ:architect','entry_program','Tahatū — Architect','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00156-architect','official_training',null,1,'2026-08-11'),
('NZ:architect','source','NZRAB — Initial Registration','https://www.nzrab.nz/c/initial-registration','official_regulator',null,2,'2026-08-11'),
('NZ:architect','source','NZRAB — registration pathways','https://www.nzrab.nz/c/Alt-To-Apply','official_regulator',null,3,'2026-08-11'),
('NZ:web-designer','entry_program','Tahatū — Web Designer','https://tahatu.govt.nz/work/explore-career-ideas/occupation/T00134-web-designer','official_training',null,1,'2026-08-11'),
('NZ:web-designer','source','ANZSCO — Web Designer 232414','https://www.abs.gov.au/statistics/classifications/anzsco-australian-and-new-zealand-standard-classification-occupations/2021/browse-classification/2/23/232/2324','official_classification',null,2,'2026-08-11')
on conflict (profile_key,link_type,url) do update set label=excluded.label,provider_type=excluded.provider_type,region_code=excluded.region_code,sort_order=excluded.sort_order,source_checked_at=excluded.source_checked_at;

delete from public.country_occupation_program_links where profile_key in ('NZ:graphic-designer','NZ:ux-designer','NZ:multimedia-designer','NZ:animator','NZ:interior-designer','NZ:film-editor','NZ:architect','NZ:web-designer') and program_ref like 'nz-program:%';

insert into public.country_occupation_program_links (profile_key,program_ref,relation_type,source_checked_at)
select 'NZ:' || poc.canonical_career_id,
       'nz-program:' || poc.programme_id::text,
       poc.normalized_relation_type,
       '2026-08-11'::date
from public.program_occupation_canonical_nz_v1 poc
join public.program_catalog_canonical_nz_v1 pc using (programme_id)
where poc.canonical_career_id in ('graphic-designer','ux-designer','multimedia-designer','animator','interior-designer','film-editor','architect','web-designer')
  and pc.verification_tier = 'A'
  and pc.international_students_eligible is true
  and pc.code_signatory_status = 'confirmed'
  and coalesce(pc.canonical_admission_state,'') <> 'closed'
on conflict (profile_key,program_ref) do update set relation_type=excluded.relation_type,source_checked_at=excluded.source_checked_at;
