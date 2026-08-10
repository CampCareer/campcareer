-- Finalize the five title-only Algonquin occupation-priority rows after current official-site identity/admission review on 2026-08-08.
with held(title, program_code, official_program_url, source_status, admission_status) as (
  values
    ('Bachelor of Hospitality and Tourism Management Honours Co-op',null,null,'international_suspended_current_intake_2026','new_student_intakes_suspended_current_program'),
    ('Bachelor of Information Technology - Interactive Multimedia and Design Co-op',null,'https://www.algonquincollege.com/mediaanddesign/program/bit-interactive-multimedia-and-design/','pending_review_joint_institution_identity','joint_carleton_algonquin_admissions_identity_review_required'),
    ('Bachelor of Information Technology - Networking Technology Co-op',null,'https://www.algonquincollege.com/sat/program/bit-network-technology/','pending_review_joint_institution_identity','joint_carleton_algonquin_admissions_identity_review_required'),
    ('Bachelor of Science in Nursing Honours Pathway for Registered Practical Nurses','6616A01FWO','https://www.algonquincollege.com/health-sciences/program/bachelor-of-science-in-nursing-honours-pathway--for-practical-nursing/','pending_review_future_intake_2027','fall_2027_applications_not_yet_open_as_of_2026_08_08'),
    ('Practical Nursing Pathway for Personal Support Worker','1704A01FWO','https://www.algonquincollege.com/health-sciences/program/practical-nursing-pathway-for-personal-support-worker/','pending_review_domestic_professional_pathway','ontario_psw_work_and_authorization_requirements_not_general_international_entry')
), updated as (
  update public.program_catalog_ca_staging c
  set program_code=coalesce(c.program_code,h.program_code),
      official_program_url=coalesce(c.official_program_url,h.official_program_url),
      source_status=h.source_status,
      source_as_of=greatest(coalesce(c.source_as_of,date '1900-01-01'),date '2026-08-08')
  from held h
  where c.institution_name='Algonquin College' and c.title=h.title
  returning c.id,c.title
)
update public.program_pgwp_ca_staging p
set international_program_admission_status=h.admission_status,
    international_students_eligible=false,
    verified_at=now()
from held h join updated u on u.title=h.title
where p.program_catalog_id=u.id;
