-- Canada Programs Phase 3: reconcile BCIT program-level international availability
-- against the current BCIT catalogue marker. Rows not marked as accepting
-- international students are held from the public international-student catalogue.

with non_international(title, credential_type) as (
  values
    ('Electrical Engineering', 'Bachelor of Engineering'),
    ('Business Analysis', 'Associate Certificate'),
    ('Business Intelligence', 'Associate Certificate'),
    ('Digital Media Foundations', 'Associate Certificate'),
    ('Event Marketing and Planning Foundations', 'Associate Certificate'),
    ('Sustainable Business', 'Advanced Certificate'),
    ('Applied Database Administration and Design', 'Associate Certificate'),
    ('Applied Network Administration and Design', 'Associate Certificate'),
    ('Applied Software Development (ASD)', 'Associate Certificate'),
    ('Web and Mobile Application Development', 'Associate Certificate'),
    ('Bridging Medical Radiography', 'Advanced Certificate'),
    ('Medical Laboratory Science', 'Diploma'),
    ('Medical Radiography', 'Diploma'),
    ('Nursing', 'Bachelor of Science in Nursing'),
    ('Essential Technical Skills for Architecture, Construction, and Engineering', 'Certificate'),
    ('Heating, Ventilation, Air Conditioning and Refrigeration Technician', 'Certificate'),
    ('Heating, Ventilation, Air Conditioning and Refrigeration Technician', 'Diploma'),
    ('Welder Foundation', 'Certificate'),
    ('Welding, Level A', 'Certificate'),
    ('Welding, Level B', 'Certificate')
), affected as (
  select c.id
  from public.program_catalog_ca_staging c
  join non_international n
    on n.title = c.title
   and n.credential_type = c.credential_type
  where c.institution_id = 'british-columbia-institute-of-technology'
), pgwp_updated as (
  update public.program_pgwp_ca_staging p
  set international_students_eligible = false,
      international_program_admission_status = 'bcit_current_catalog_not_marked_international_2026_08_08',
      verified_at = now()
  where p.program_catalog_id in (select id from affected)
  returning p.program_catalog_id
)
update public.program_occupation_ca_staging s
set review_status = 'rejected',
    reviewer_note = 'BCIT current catalogue does not mark this program as accepting international students (verified 2026-08-08).',
    source_checked_at = date '2026-08-08',
    reviewed_at = now()
where s.program_catalog_id in (select program_catalog_id from pgwp_updated);