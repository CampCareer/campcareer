-- Canada Programs Phase 3: BCIT Business & Media occupation-priority URL verification.
-- Ambiguous catalogue rows with multiple delivery-specific pages (Accounting Diploma, Finance Diploma)
-- are intentionally left unresolved for manual identity review.

with verified(title, credential_type, official_program_url) as (
  values
    ('Accounting', 'Bachelor of Accounting', 'https://www.bcit.ca/programs/accounting-bachelor-of-accounting-full-time-part-time-8630bacc/'),
    ('Business Administration (Human Resources Option)', 'Diploma', 'https://www.bcit.ca/programs/business-administration-human-resources-option-diploma-part-time-703cdipma/'),
    ('Business Administration (Marketing Option)', 'Diploma', 'https://www.bcit.ca/programs/business-administration-marketing-option-diploma-part-time-703edipma/'),
    ('Business Analysis', 'Associate Certificate', 'https://www.bcit.ca/programs/business-analysis-associate-certificate-part-time-5205acert/'),
    ('Business Intelligence', 'Associate Certificate', 'https://www.bcit.ca/programs/business-intelligence-associate-certificate-part-time-5275acert/'),
    ('Computerized Accounting', 'Associate Certificate', 'https://www.bcit.ca/programs/computerized-accounting-associate-certificate-part-time-5725acert/'),
    ('Digital Marketing Foundations', 'Associate Certificate', 'https://www.bcit.ca/programs/digital-marketing-foundations-associate-certificate-part-time-6375acert/'),
    ('Digital Marketing Strategy', 'Associate Certificate', 'https://www.bcit.ca/programs/digital-marketing-strategy-associate-certificate-part-time-6385acert/'),
    ('Digital Media Foundations', 'Associate Certificate', 'https://www.bcit.ca/programs/digital-media-foundations-associate-certificate-part-time-5365acert/'),
    ('Event Marketing and Management Strategy', 'Certificate', 'https://www.bcit.ca/programs/event-marketing-and-management-strategy-certificate-part-time-5077cert/'),
    ('Event Marketing and Planning Foundations', 'Associate Certificate', 'https://www.bcit.ca/programs/event-marketing-and-planning-foundations-associate-certificate-part-time-6315acert/'),
    ('Financial Management (Finance Option)', 'Certificate', 'https://www.bcit.ca/programs/financial-management-finance-option-certificate-part-time-585cmcert/'),
    ('Financial Management (Financial Planning)', 'Associate Certificate', 'https://www.bcit.ca/programs/financial-management-financial-planning-associate-certificate-part-time-585iacert/'),
    ('Financial Management (Professional Accounting Option)', 'Certificate', 'https://www.bcit.ca/programs/financial-management-professional-accounting-option-certificate-part-time-585fmcert/'),
    ('Global Supply Chain Management', 'Diploma', 'https://www.bcit.ca/programs/global-supply-chain-management-diploma-full-time-7475dipma/'),
    ('Graphic Design Foundations', 'Associate Certificate', 'https://www.bcit.ca/programs/graphic-design-foundations-associate-certificate-part-time-6505acert/'),
    ('Human Resource Management', 'Associate Certificate', 'https://www.bcit.ca/programs/human-resource-management-associate-certificate-part-time-7610acert/'),
    ('Human Resource Management', 'Certificate', 'https://www.bcit.ca/programs/human-resource-management-certificate-part-time-625amcert/'),
    ('International Trade and Transportation Logistics', 'Certificate', 'https://www.bcit.ca/programs/international-trade-and-transportation-logistics-certificate-part-time-7460mcert/'),
    ('Marketing Management', 'Certificate', 'https://www.bcit.ca/programs/marketing-management-certificate-part-time-6300mcert/'),
    ('Marketing Management', 'Diploma', 'https://www.bcit.ca/programs/marketing-management-diploma-full-time-6422dipma/'),
    ('Marketing Management - Customer Relationship Marketing', 'Associate Certificate', 'https://www.bcit.ca/programs/marketing-management-customer-relationship-marketing-associate-certificate-part-time-630wacert/'),
    ('Marketing Management - Entrepreneurship', 'Associate Certificate', 'https://www.bcit.ca/programs/marketing-management-entrepreneurship-associate-certificate-part-time-630hacert/'),
    ('Marketing Management - Fundraising Management', 'Associate Certificate', 'https://www.bcit.ca/programs/marketing-management-fundraising-management-associate-certificate-part-time-6390acert/'),
    ('Marketing Management - Marketing Communications', 'Associate Certificate', 'https://www.bcit.ca/programs/marketing-management-marketing-communications-associate-certificate-part-time-630dacert/'),
    ('Marketing Management - Public Relations', 'Associate Certificate', 'https://www.bcit.ca/programs/marketing-management-public-relations-associate-certificate-part-time-630xacert/'),
    ('Marketing Management - Sales Skills', 'Associate Certificate', 'https://www.bcit.ca/programs/marketing-management-sales-skills-associate-certificate-part-time-630macert/'),
    ('Marketing Management (Digital Marketing and Brand Strategy Option)', 'Diploma', 'https://www.bcit.ca/programs/marketing-management-digital-marketing-and-brand-strategy-option-diploma-full-time-642adipma/'),
    ('Marketing Management (Entrepreneurship Option)', 'Diploma', 'https://www.bcit.ca/programs/marketing-management-entrepreneurship-option-diploma-full-time-642cdipma/'),
    ('Marketing Management (Marketing Communications Option)', 'Certificate', 'https://www.bcit.ca/programs/marketing-management-marketing-communications-option-certificate-part-time-630dmcert/'),
    ('Marketing Management (Professional Real Estate Option)', 'Diploma', 'https://www.bcit.ca/programs/marketing-management-professional-real-estate-option-diploma-full-time-642ddipma/'),
    ('Marketing Management (Professional Sales Option)', 'Certificate', 'https://www.bcit.ca/programs/marketing-management-professional-sales-option-certificate-part-time-630vmcert/'),
    ('Marketing Management (Professional Sales Option)', 'Diploma', 'https://www.bcit.ca/programs/marketing-management-professional-sales-option-diploma-full-time-642bdipma/'),
    ('Marketing Management (Tourism Marketing and Sales Option)', 'Diploma', 'https://www.bcit.ca/programs/marketing-management-tourism-marketing-and-sales-option-diploma-full-time-642edipma/'),
    ('Media Techniques and Marketing Communications', 'Certificate', 'https://www.bcit.ca/programs/media-techniques-and-marketing-communications-certificate-part-time-630pmcert/'),
    ('Operations Management (Facilities Management Option)', 'Certificate', 'https://www.bcit.ca/programs/operations-management-facilities-management-option-certificate-part-time-690fmcert/'),
    ('Operations Management (Industrial Engineering Option)', 'Certificate', 'https://www.bcit.ca/programs/operations-management-industrial-engineering-option-certificate-part-time-690amcert/'),
    ('Operations Management (Management Engineering Option)', 'Certificate', 'https://www.bcit.ca/programs/operations-management-management-engineering-option-certificate-part-time-690bmcert/'),
    ('Operations Management (Materials Management Option)', 'Certificate', 'https://www.bcit.ca/programs/operations-management-materials-management-option-certificate-part-time-690dmcert/'),
    ('Payroll and Human Resources', 'Associate Certificate', 'https://www.bcit.ca/programs/payroll-and-human-resources-associate-certificate-part-time-6005acert/'),
    ('Professional Accounting', 'Advanced Diploma', 'https://www.bcit.ca/programs/professional-accounting-advanced-diploma-full-time-part-time-5290advdip/'),
    ('Project Management', 'Associate Certificate', 'https://www.bcit.ca/programs/project-management-associate-certificate-part-time-5085acert/'),
    ('Strategic Human Resources Management', 'Diploma', 'https://www.bcit.ca/programs/strategic-human-resources-management-diploma-full-time-6290dipma/'),
    ('Sustainable Business', 'Advanced Certificate', 'https://www.bcit.ca/programs/sustainable-business-advanced-certificate-part-time-5145adcert/'),
    ('Television & Video Production', 'Diploma', 'https://www.bcit.ca/programs/television-and-video-production-diploma-full-time-6130dipma/'),
    ('Tourism and Hospitality', 'Associate Certificate', 'https://www.bcit.ca/programs/tourism-and-hospitality-associate-certificate-part-time-6590acert/'),
    ('Video Production and Editing', 'Associate Certificate', 'https://www.bcit.ca/programs/video-production-and-editing-associate-certificate-part-time-6120acert/')
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