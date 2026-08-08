-- Canada Programs Phase 3: BCIT Computing & IT occupation-priority URL verification.

with verified(title, credential_type, official_program_url) as (
  values
    ('3D Modeling, Art and Animation', 'Diploma', 'https://www.bcit.ca/programs/3d-modeling-art-and-animation-diploma-full-time-6575dipma/'),
    ('Applied Computer Science (Database Option)', 'Bachelor of Science', 'https://www.bcit.ca/programs/applied-computer-science-database-option-bachelor-of-science-full-time-part-time-867cbsc/'),
    ('Applied Computer Science (Games Development Option)', 'Bachelor of Science', 'https://www.bcit.ca/programs/applied-computer-science-games-development-option-bachelor-of-science-full-time-867absc/'),
    ('Applied Computer Science (Human Computer Interface Option)', 'Bachelor of Science', 'https://www.bcit.ca/programs/applied-computer-science-human-computer-interface-option-bachelor-of-science-part-time-867dbsc/'),
    ('Applied Computer Science (Network Security Administration Option)', 'Bachelor of Science', 'https://www.bcit.ca/programs/applied-computer-science-network-security-administration-option-bachelor-of-science-part-time-867ebsc/'),
    ('Applied Computer Science (Network Security Applications Development Option)', 'Bachelor of Science', 'https://www.bcit.ca/programs/applied-computer-science-network-security-applications-development-option-bachelor-of-science-full-time-part-time-867bbsc/'),
    ('Applied Computer Science (Wireless and Mobile Applications Development Option)', 'Bachelor of Science', 'https://www.bcit.ca/programs/applied-computer-science-wireless-and-mobile-applications-development-option-bachelor-of-science-part-time-867fbsc/'),
    ('Applied Data Analytics', 'Certificate', 'https://www.bcit.ca/programs/applied-data-analytics-certificate-part-time-5512cert/'),
    ('Applied Database Administration and Design', 'Associate Certificate', 'https://www.bcit.ca/programs/applied-database-administration-and-design-associate-certificate-part-time-6994acert/'),
    ('Applied Network Administration and Design', 'Associate Certificate', 'https://www.bcit.ca/programs/applied-network-administration-and-design-associate-certificate-part-time-5515acert/'),
    ('Applied Software Development (ASD)', 'Associate Certificate', 'https://www.bcit.ca/programs/applied-software-development-asd-associate-certificate-part-time-6958acert/'),
    ('Business Analytics', 'Graduate Certificate', 'https://www.bcit.ca/programs/business-analytics-graduate-certificate-full-time-a600grcert/'),
    ('Business Information Technology Management (Analytics Data Management Option)', 'Diploma', 'https://www.bcit.ca/programs/business-information-technology-management-analytics-data-management-option-diploma-full-time-623cdipma/'),
    ('Computer Information Systems Administration', 'Diploma', 'https://www.bcit.ca/programs/computer-information-systems-administration-diploma-full-time-1930dipma/'),
    ('Forensic Investigation (Digital Forensics and Cybersecurity Option)', 'Advanced Certificate', 'https://www.bcit.ca/programs/forensic-investigation-digital-forensics-and-cybersecurity-option-advanced-certificate-part-time-528cadcert/'),
    ('Forensic Investigation (Digital Forensics and Cybersecurity Option)', 'Bachelor of Technology', 'https://www.bcit.ca/programs/forensic-investigation-digital-forensics-and-cybersecurity-option-bachelor-of-technology-full-time-part-time-847cbtech/'),
    ('Graphic Design', 'Certificate', 'https://www.bcit.ca/programs/graphic-design-certificate-full-time-part-time-6585cert/'),
    ('Graphic Design and Interactive Media', 'Diploma', 'https://www.bcit.ca/programs/graphic-design-and-interactive-media-diploma-part-time-6595dipma/'),
    ('Industrial Network Cybersecurity', 'Diploma', 'https://www.bcit.ca/programs/industrial-network-cybersecurity-diploma-full-time-5265dipma/'),
    ('User Interface (UI) and User Experience (UX) Design', 'Associate Certificate', 'https://www.bcit.ca/programs/user-interface-ui-and-user-experience-ux-design-associate-certificate-part-time-5985acert/'),
    ('Web and Mobile Application Development', 'Associate Certificate', 'https://www.bcit.ca/programs/web-and-mobile-application-development-associate-certificate-part-time-6465acert/')
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