with sponsor_rows(canonical_name, source_sponsor_key, sponsor_name, town_city, additional_locations, sponsor_type, sponsor_status, route, match_basis) as (
  values
  ('Aston University','aston-university|birmingham|student','Aston University','Birmingham',null,'Higher Education Institution (HEI)','Student Sponsor - Track Record','Student','exact_current_sponsor_name'),
  ('Brunel University of London','brunel-university-london|uxbridge|student','Brunel University London','Uxbridge','London Brunel International College (Embedded College)','Higher Education Institution (HEI)','Student Sponsor - Track Record','Student','current_sponsor_alias_to_canonical_name'),
  ('Cardiff University','cardiff-university|cardiff|student','Cardiff University','Cardiff',null,'Higher Education Institution (HEI)','Student Sponsor - Track Record','Student','exact_current_sponsor_name'),
  ('City St George''s, University of London','city-st-georges-university-of-london|london|student','City St George''s, University of London','London','INTO City University (Embedded College)','Higher Education Institution (HEI)','Student Sponsor - Track Record','Student','exact_current_sponsor_name'),
  ('Coventry University','coventry-university|coventry|student','Coventry University','Coventry',null,'Higher Education Institution (HEI)','Student Sponsor - Track Record','Student','exact_current_sponsor_name'),
  ('Heriot-Watt University','heriot-watt-university|edinburgh|student','Heriot-Watt University','Edinburgh',null,'Higher Education Institution (HEI)','Student Sponsor - Track Record','Student','exact_current_sponsor_name'),
  ('Imperial College London','imperial-college-london|london|student','Imperial College London','London',null,'Higher Education Institution (HEI)','Student Sponsor - Track Record','Student','exact_current_sponsor_name'),
  ('King''s College London','kings-college-london|london|student','King''s College London','London',null,'Higher Education Institution (HEI)','Student Sponsor - Track Record','Student','exact_current_sponsor_name'),
  ('Lancaster University','lancaster-university|lancaster|student','Lancaster University','Lancaster',null,'Higher Education Institution (HEI)','Student Sponsor - Track Record','Student','exact_current_sponsor_name'),
  ('London School of Economics and Political Science','london-school-of-economics-and-political-science|london|student','London School of Economics and Political Science','London',null,'Higher Education Institution (HEI)','Student Sponsor - Track Record','Student','exact_current_sponsor_name'),
  ('Loughborough University','loughborough-university|loughborough|student','Loughborough University','Loughborough',null,'Higher Education Institution (HEI)','Student Sponsor - Track Record','Student','exact_current_sponsor_name'),
  ('Newcastle University','newcastle-university|newcastle-upon-tyne|student','Newcastle University','Newcastle upon Tyne','INTO Newcastle University (Embedded College)','Higher Education Institution (HEI)','Student Sponsor - Track Record','Student','exact_current_sponsor_name'),
  ('Nottingham Trent University','nottingham-trent-university|nottingham|student','Nottingham Trent University','Nottingham',null,'Higher Education Institution (HEI)','Student Sponsor - Track Record','Student','exact_current_sponsor_name'),
  ('Queen Mary University of London','queen-mary-university-of-london|london|student','Queen Mary University of London','London',null,'Higher Education Institution (HEI)','Student Sponsor - Track Record','Student','exact_current_sponsor_name'),
  ('Queen''s University Belfast','queens-university-belfast|belfast|student','Queen''s University Belfast','Belfast',null,'Higher Education Institution (HEI)','Student Sponsor - Track Record','Student','exact_current_sponsor_name'),
  ('Royal Holloway, University of London','royal-holloway-and-bedford-new-college|egham|student','Royal Holloway and Bedford New College','Egham',null,'Higher Education Institution (HEI)','Student Sponsor - Track Record','Student','current_sponsor_legal_name_to_canonical_name')
)
insert into public.institution_student_sponsor_uk_staging (
  source_sponsor_key, sponsor_name, town_city, additional_locations, sponsor_type,
  sponsor_status, route, institution_id, ukprn, match_status, match_basis,
  source_url, source_as_of
)
select
  s.source_sponsor_key, s.sponsor_name, s.town_city, s.additional_locations, s.sponsor_type,
  s.sponsor_status, s.route, i.institution_id, i.ukprn, 'matched', s.match_basis,
  'https://www.gov.uk/government/publications/register-of-licensed-sponsors-students', date '2026-08-07'
from sponsor_rows s
join public.institution_identity_uk_v1 i on i.canonical_name=s.canonical_name
on conflict (source_name, source_sponsor_key) do update set
  sponsor_name=excluded.sponsor_name,
  town_city=excluded.town_city,
  additional_locations=excluded.additional_locations,
  sponsor_type=excluded.sponsor_type,
  sponsor_status=excluded.sponsor_status,
  route=excluded.route,
  institution_id=excluded.institution_id,
  ukprn=excluded.ukprn,
  match_status=excluded.match_status,
  match_basis=excluded.match_basis,
  source_url=excluded.source_url,
  source_as_of=excluded.source_as_of;