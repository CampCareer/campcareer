-- Canada Programs Phase 3: BCIT Health Sciences programs currently marked international.
-- Programs not marked international were handled by the preceding reconciliation migration.

with verified(title, credential_type, official_program_url) as (
  values
    ('Biomedical Engineering Technology', 'Diploma', 'https://www.bcit.ca/programs/biomedical-engineering-technology-diploma-full-time-5063dipma/'),
    ('Critical Care Nursing Specialty', 'Advanced Certificate', 'https://www.bcit.ca/programs/critical-care-nursing-specialty-advanced-certificate-part-time-680xadcert/'),
    ('Critical Care Nursing Specialty (Combined Critical Care/Emergency Option)', 'Advanced Certificate', 'https://www.bcit.ca/programs/critical-care-nursing-specialty-combined-critical-care-emergency-option-advanced-certificate-part-time-680lascert/'),
    ('Emergency Nursing Specialty (Combined Emergency/Critical Care Option)', 'Advanced Certificate', 'https://www.bcit.ca/programs/emergency-nursing-specialty-combined-emergency-critical-care-option-advanced-certificate-part-time-680sascert/'),
    ('Emergency Nursing Specialty (Pediatric Emergency Option)', 'Advanced Certificate', 'https://www.bcit.ca/programs/emergency-nursing-specialty-pediatric-emergency-option-advanced-certificate-part-time-680yadcert/'),
    ('Emergency Nursing Specialty (Standard Option)', 'Advanced Certificate', 'https://www.bcit.ca/programs/emergency-nursing-specialty-standard-option-advanced-certificate-part-time-680eascert/'),
    ('Food Processing, Safety, and Quality', 'Diploma', 'https://www.bcit.ca/programs/food-processing-safety-and-quality-diploma-full-time-5155dipma/'),
    ('High Acuity Nursing Specialty', 'Advanced Certificate', 'https://www.bcit.ca/programs/high-acuity-nursing-specialty-advanced-certificate-part-time-680wascert/'),
    ('Neonatal Nursing Specialty', 'Advanced Certificate', 'https://www.bcit.ca/programs/neonatal-nursing-specialty-advanced-certificate-part-time-680fascert/'),
    ('Nephrology Nursing Specialty', 'Advanced Certificate', 'https://www.bcit.ca/programs/nephrology-nursing-specialty-advanced-certificate-part-time-680mascert/'),
    ('Pediatric Emergency Nursing Specialty', 'Advanced Certificate', 'https://www.bcit.ca/programs/pediatric-emergency-nursing-specialty-advanced-certificate-part-time-6835adcert/'),
    ('Pediatric Nursing Specialty (Anesthesia Care Option)', 'Advanced Certificate', 'https://www.bcit.ca/programs/pediatric-nursing-specialty-anesthesia-care-option-advanced-certificate-part-time-681badcert/'),
    ('Pediatric Nursing Specialty (Critical Care Option)', 'Advanced Certificate', 'https://www.bcit.ca/programs/pediatric-nursing-specialty-critical-care-option-advanced-certificate-part-time-680zadcert/'),
    ('Pediatric Nursing Specialty (Standard Option)', 'Advanced Certificate', 'https://www.bcit.ca/programs/pediatric-nursing-specialty-standard-option-advanced-certificate-part-time-680bascert/'),
    ('Perinatal Nursing Specialty (Perinatal - Perioperative Option)', 'Advanced Certificate', 'https://www.bcit.ca/programs/perinatal-nursing-specialty-perinatal-perioperative-option-advanced-certificate-part-time-680vascert/'),
    ('Perinatal Nursing Specialty (Standard Option)', 'Advanced Certificate', 'https://www.bcit.ca/programs/perinatal-nursing-specialty-standard-option-advanced-certificate-part-time-680cascert/'),
    ('Perioperative Nursing Specialty', 'Advanced Certificate', 'https://www.bcit.ca/programs/perioperative-nursing-specialty-advanced-certificate-part-time-680pascert/')
), updated as (
  update public.program_catalog_ca_staging c
  set official_program_url = v.official_program_url
  from verified v
  where c.institution_id = 'british-columbia-institute-of-technology'
    and c.title = v.title
    and c.credential_type = v.credential_type
    and c.official_program_url is null
  returning c.id
)
update public.program_occupation_ca_staging s
set source_checked_at = date '2026-08-08'
where s.program_catalog_id in (select id from updated);