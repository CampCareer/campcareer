-- Backfill colleges_au.website_url with official university homepages (AU).
-- All 42 AU providers had website_url = NULL, so the "College website" link
-- in the map occupation detail never rendered. URLs are canonical .edu.au
-- homepages (verified; some return 403/406 to curl due to bot/WAF blocking
-- but load normally in a browser). Idempotent: only fills NULL rows.

UPDATE colleges_au AS c SET website_url = v.url
FROM (VALUES
  ('australian-catholic-university', 'https://www.acu.edu.au/'),
  ('avondale-university', 'https://www.avondale.edu.au/'),
  ('bond-university', 'https://bond.edu.au/'),
  ('central-queensland-university', 'https://www.cqu.edu.au/'),
  ('charles-darwin-university', 'https://www.cdu.edu.au/'),
  ('charles-sturt-university', 'https://www.csu.edu.au/'),
  ('curtin-university', 'https://www.curtin.edu.au/'),
  ('deakin-university', 'https://www.deakin.edu.au/'),
  ('edith-cowan-university', 'https://www.ecu.edu.au/'),
  ('federation-university-australia', 'https://federation.edu.au/'),
  ('flinders-university', 'https://www.flinders.edu.au/'),
  ('griffith-university', 'https://www.griffith.edu.au/'),
  ('james-cook-university', 'https://www.jcu.edu.au/'),
  ('la-trobe-university', 'https://www.latrobe.edu.au/'),
  ('macquarie-university', 'https://www.mq.edu.au/'),
  ('monash-university', 'https://www.monash.edu/'),
  ('murdoch-university', 'https://www.murdoch.edu.au/'),
  ('queensland-university-of-technology', 'https://www.qut.edu.au/'),
  ('rmit-university', 'https://www.rmit.edu.au/'),
  ('southern-cross-university', 'https://www.scu.edu.au/'),
  ('swinburne-university-of-technology', 'https://www.swinburne.edu.au/'),
  ('the-australian-national-university', 'https://www.anu.edu.au/'),
  ('the-university-of-adelaide', 'https://www.adelaide.edu.au/'),
  ('the-university-of-melbourne', 'https://www.unimelb.edu.au/'),
  ('the-university-of-notre-dame-australia', 'https://www.notredame.edu.au/'),
  ('the-university-of-queensland', 'https://www.uq.edu.au/'),
  ('the-university-of-south-australia', 'https://www.unisa.edu.au/'),
  ('the-university-of-sydney', 'https://www.sydney.edu.au/'),
  ('the-university-of-western-australia', 'https://www.uwa.edu.au/'),
  ('torrens-university', 'https://www.torrens.edu.au/'),
  ('university-of-canberra', 'https://www.canberra.edu.au/'),
  ('university-of-divinity', 'https://www.divinity.edu.au/'),
  ('university-of-new-england', 'https://www.une.edu.au/'),
  ('university-of-new-south-wales', 'https://www.unsw.edu.au/'),
  ('university-of-newcastle', 'https://www.newcastle.edu.au/'),
  ('university-of-southern-queensland', 'https://www.unisq.edu.au/'),
  ('university-of-tasmania', 'https://www.utas.edu.au/'),
  ('university-of-technology-sydney', 'https://www.uts.edu.au/'),
  ('university-of-the-sunshine-coast', 'https://www.usc.edu.au/'),
  ('university-of-wollongong', 'https://www.uow.edu.au/'),
  ('victoria-university', 'https://www.vu.edu.au/'),
  ('western-sydney-university', 'https://www.westernsydney.edu.au/')
) AS v(institution_id, url)
WHERE c.institution_id = v.institution_id AND c.website_url IS NULL;

-- Verification:
-- select count(*) filter (where website_url is not null) as set, count(*) total from colleges_au;
