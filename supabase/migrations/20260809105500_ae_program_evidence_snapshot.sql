-- UAE reviewed occupation relationships and programme-level international admission evidence.
-- Evidence state verified on 2026-08-09. Accreditation and admission remain intentionally separate.

with links(source_program_key,canonical_career_id,rule_version,match_basis,match_pattern,review_status,relation_type,source_checked_at,reviewer_note) as (values
('ajman:bsc-physiotherapy','physiotherapist','ae-manual-v2','title','ajman:bsc-physiotherapy','approved','direct','2026-08-09','CAA Active Physiotherapy degree.'),
('ajman:doctor-pharmacy','pharmacist','ae-manual-v2','title','ajman:doctor-pharmacy','approved','direct','2026-08-09','CAA Active Doctor of Pharmacy.'),
('aue:bsc-digital-animation','animator','ae-manual-v2','title','aue:bsc-digital-animation','approved','direct','2026-08-09','CAA Active Digital Animation degree.'),
('aue:bsc-medical-diagnostic-imaging','radiographer','ae-manual-v2','title','aue:bsc-medical-diagnostic-imaging','approved','direct','2026-08-09','CAA Active Medical Diagnostic Imaging degree.'),
('aue:bsc-medical-laboratory-sciences','medical-laboratory-technician','ae-manual-v2','title','aue:bsc-medical-laboratory-sciences','approved','direct','2026-08-09','CAA Active Medical Laboratory Sciences degree; qualification level exceeds technician in some licensing contexts.'),
('aus:b-interior-design','interior-designer','ae-manual-v1','title','aus:b-interior-design','approved','direct','2026-08-09','Discipline-specific interior design degree.'),
('aus:ba-mass-communication','marketing-specialist','ae-manual-v1','title','aus:ba-mass-communication','approved','related','2026-08-09','Mass communication supports marketing/communications roles.'),
('aus:ba-psychology','counsellor','ae-manual-v1','title','aus:ba-psychology','approved','common_pathway','2026-08-09','Psychology is a common pre-professional counselling pathway; registration may require further training.'),
('aus:barch','architect','ae-manual-v1','title','aus:barch','approved','direct','2026-08-09','Professional architecture degree.'),
('aus:bsba-accounting','accountant','ae-manual-v1','title','aus:bsba-accounting','approved','direct','2026-08-09','Accounting major.'),
('aus:bsba-accounting','auditor','ae-manual-v1','title','aus:bsba-accounting','approved','common_pathway','2026-08-09','Accounting is a common audit pathway.'),
('aus:bsba-economics','financial-analyst','ae-manual-v1','title','aus:bsba-economics','approved','common_pathway','2026-08-09','Economics is a common financial-analysis pathway.'),
('aus:bsba-finance','financial-analyst','ae-manual-v1','title','aus:bsba-finance','approved','direct','2026-08-09','Finance major.'),
('aus:bsba-is-business-analytics','business-analyst','ae-manual-v1','title','aus:bsba-is-business-analytics','approved','direct','2026-08-09','Information systems/business analytics major.'),
('aus:bsba-is-business-analytics','data-analyst','ae-manual-v1','title','aus:bsba-is-business-analytics','approved','common_pathway','2026-08-09','Business analytics is a common data-analysis pathway.'),
('aus:bsba-is-business-analytics','database-administrator','ae-manual-v2','title','aus:bsba-is-business-analytics','approved','common_pathway','2026-08-09','Information Systems and Business Analytics provides a common database/information-systems foundation.'),
('aus:bsba-management','project-manager','ae-manual-v1','title','aus:bsba-management','approved','common_pathway','2026-08-09','Management degree is a common project-management base.'),
('aus:bsba-marketing','marketing-specialist','ae-manual-v1','title','aus:bsba-marketing','approved','direct','2026-08-09','Marketing major.'),
('aus:bsba-supply-chain','logistics-coordinator','ae-manual-v1','title','aus:bsba-supply-chain','approved','common_pathway','2026-08-09','Supply chain degree supports logistics roles.'),
('aus:bsba-supply-chain','supply-chain-analyst','ae-manual-v1','title','aus:bsba-supply-chain','approved','direct','2026-08-09','Supply chain management major.'),
('aus:bsc-chemical-biological-engineering','chemical-engineer','ae-manual-v1','title','aus:bsc-chemical-biological-engineering','approved','direct','2026-08-09','Chemical/biological engineering degree.'),
('aus:bsc-chemical-engineering','chemical-engineer','ae-manual-v1','title','aus:bsc-chemical-engineering','approved','direct','2026-08-09','Discipline-specific engineering degree.'),
('aus:bsc-civil-engineering','civil-engineer','ae-manual-v1','title','aus:bsc-civil-engineering','approved','direct','2026-08-09','Discipline-specific engineering degree.'),
('aus:bsc-computer-engineering','network-administrator','ae-manual-v1','title','aus:bsc-computer-engineering','approved','related','2026-08-09','Computer engineering supports network/infrastructure roles.'),
('aus:bsc-computer-science','cloud-engineer','ae-manual-v1','title','aus:bsc-computer-science','approved','common_pathway','2026-08-09','Computer science is a common cloud-engineering base.'),
('aus:bsc-computer-science','software-developer','ae-manual-v1','title','aus:bsc-computer-science','approved','direct','2026-08-09','Computer science degree.'),
('aus:bsc-data-science','data-analyst','ae-manual-v1','title','aus:bsc-data-science','approved','direct','2026-08-09','Data science degree.'),
('aus:bsc-data-science','data-engineer','ae-manual-v1','title','aus:bsc-data-science','approved','common_pathway','2026-08-09','Data science is a common data-engineering base.'),
('aus:bsc-design-management','project-manager','ae-manual-v1','title','aus:bsc-design-management','approved','related','2026-08-09','Design management supports project-management pathways.'),
('aus:bsc-digital-construction','construction-manager','ae-manual-v1','title','aus:bsc-digital-construction','approved','direct','2026-08-09','Digital construction engineering and management directly supports construction management.'),
('aus:bsc-digital-construction','project-manager','ae-manual-v1','title','aus:bsc-digital-construction','approved','common_pathway','2026-08-09','Construction management includes project-management pathway.'),
('aus:bsc-electrical-engineering','electrical-engineer','ae-manual-v1','title','aus:bsc-electrical-engineering','approved','direct','2026-08-09','Discipline-specific engineering degree.'),
('aus:bsc-environmental-sciences-sustainability','environmental-scientist','ae-manual-v1','title','aus:bsc-environmental-sciences-sustainability','approved','direct','2026-08-09','Environmental science degree.'),
('aus:bsc-environmental-sciences-sustainability','sustainability-specialist','ae-manual-v1','title','aus:bsc-environmental-sciences-sustainability','approved','direct','2026-08-09','Program explicitly covers sustainability.'),
('aus:bsc-film-new-media-design','film-editor','ae-manual-v1','title','aus:bsc-film-new-media-design','approved','common_pathway','2026-08-09','Film/new media production pathway.'),
('aus:bsc-film-new-media-design','multimedia-designer','ae-manual-v1','title','aus:bsc-film-new-media-design','approved','direct','2026-08-09','New media design pathway.'),
('aus:bsc-graphic-design','graphic-designer','ae-manual-v1','title','aus:bsc-graphic-design','approved','direct','2026-08-09','Discipline-specific graphic design degree.'),
('aus:bsc-graphic-design','ux-designer','ae-manual-v1','title','aus:bsc-graphic-design','approved','related','2026-08-09','Graphic design is related to digital product/UX design.'),
('aus:bsc-graphic-design','web-designer','ae-manual-v1','title','aus:bsc-graphic-design','approved','related','2026-08-09','Graphic design is related to web visual design.'),
('aus:bsc-industrial-engineering','industrial-engineer','ae-manual-v1','title','aus:bsc-industrial-engineering','approved','direct','2026-08-09','Discipline-specific engineering degree.'),
('aus:bsc-industrial-engineering','manufacturing-engineer','ae-manual-v1','title','aus:bsc-industrial-engineering','approved','common_pathway','2026-08-09','Industrial engineering is a common manufacturing-engineering pathway.'),
('aus:bsc-intelligent-systems-mechatronics','engineering-technician','ae-manual-v1','title','aus:bsc-intelligent-systems-mechatronics','approved','related','2026-08-09','Mechatronics engineering is related to engineering technical work but is a higher-level degree.'),
('aus:bsc-intelligent-systems-mechatronics','manufacturing-engineer','ae-manual-v1','title','aus:bsc-intelligent-systems-mechatronics','approved','related','2026-08-09','Mechatronics supports advanced manufacturing roles.'),
('aus:bsc-mechanical-engineering','mechanical-engineer','ae-manual-v1','title','aus:bsc-mechanical-engineering','approved','direct','2026-08-09','Discipline-specific engineering degree.'),
('dct:advanced-diploma-culinary-management','baker','ae-manual-v3','title','dct:advanced-diploma-culinary-management','approved','common_pathway','2026-08-09','Advanced Diploma includes Advanced Baking modules.'),
('dct:advanced-diploma-culinary-management','chef','ae-manual-v3','title','dct:advanced-diploma-culinary-management','approved','common_pathway','2026-08-09','Advanced culinary management includes advanced cooking techniques and internships.'),
('dct:advanced-diploma-culinary-management','restaurant-manager','ae-manual-v3','title','dct:advanced-diploma-culinary-management','approved','common_pathway','2026-08-09','Advanced culinary management includes business/restaurant operations.'),
('dct:certificate-culinary-operations','baker','ae-manual-v3','title','dct:certificate-culinary-operations','approved','common_pathway','2026-08-09','Culinary Operations includes baking fundamentals and professional kitchen training.'),
('dct:certificate-culinary-operations','chef','ae-manual-v3','title','dct:certificate-culinary-operations','approved','direct','2026-08-09','MOE-approved Culinary Operations certificate with practical kitchen training and internship.'),
('dct:certificate-culinary-operations','cook','ae-manual-v3','title','dct:certificate-culinary-operations','approved','direct','2026-08-09','MOE-approved Culinary Operations certificate with cooking techniques and kitchen operations.'),
('eau:applied-bachelor-aircraft-maintenance','aircraft-maintenance-technician','ae-manual-v2','title','eau:applied-bachelor-aircraft-maintenance','approved','direct','2026-08-09','CAA Active applied bachelor in Aircraft Maintenance Engineering.'),
('eau:higher-diploma-aircraft-maintenance','aircraft-maintenance-technician','ae-manual-v2','title','eau:higher-diploma-aircraft-maintenance','approved','direct','2026-08-09','CAA Active Aircraft Maintenance Engineering higher diploma.'),
('ecae:pgde-early-years-primary','primary-school-teacher','ae-manual-v2','title','ecae:pgde-early-years-primary','approved','direct','2026-08-09','Pre-service professional teacher qualification for Early Years/Primary.'),
('ecae:pgde-secondary','secondary-school-teacher','ae-manual-v2','title','ecae:pgde-secondary','approved','direct','2026-08-09','Pre-service professional teacher qualification for secondary teaching.'),
('efta:integrated-atpl','commercial-pilot','ae-manual-v3','title','efta:integrated-atpl','approved','direct','2026-08-09','Integrated ATPL leads to GCAA-approved CPL/Multi IR and ATPL training pathway.'),
('fakeeh:bsc-midwifery','midwife','ae-manual-v2','title','fakeeh:bsc-midwifery','approved','direct','2026-08-09','CAA Active Midwifery degree.'),
('fakeeh:bsc-occupational-therapy','occupational-therapist','ae-manual-v2','title','fakeeh:bsc-occupational-therapy','approved','direct','2026-08-09','CAA Active Occupational Therapy degree.'),
('fu:ba-sociology-social-work','social-worker','ae-manual-v2','title','fu:ba-sociology-social-work','approved','direct','2026-08-09','Current CAA-listed Sociology and Social Work degree.'),
('ku:bsc-applied-math-stats-data-science','data-analyst','ae-manual-v1','title','ku:bsc-applied-math-stats-data-science','approved','direct','2026-08-09','Statistics/data-science degree.'),
('ku:bsc-applied-math-stats-data-science','data-engineer','ae-manual-v1','title','ku:bsc-applied-math-stats-data-science','approved','common_pathway','2026-08-09','Data-science/math degree is a common data-engineering base.'),
('ku:bsc-cell-molecular-biology','medical-laboratory-technician','ae-manual-v1','title','ku:bsc-cell-molecular-biology','approved','related','2026-08-09','Laboratory science education is related but not a professional technician credential.'),
('ku:bsc-chemical-engineering','chemical-engineer','ae-manual-v1','title','ku:bsc-chemical-engineering','approved','direct','2026-08-09','Discipline-specific engineering degree.'),
('ku:bsc-civil-engineering','civil-engineer','ae-manual-v1','title','ku:bsc-civil-engineering','approved','direct','2026-08-09','Discipline-specific engineering degree.'),
('ku:bsc-computer-engineering','ict-support-technician','ae-manual-v1','title','ku:bsc-computer-engineering','approved','related','2026-08-09','Computer engineering supports ICT infrastructure roles.'),
('ku:bsc-computer-engineering','network-administrator','ae-manual-v1','title','ku:bsc-computer-engineering','approved','related','2026-08-09','Computer engineering supports network/infrastructure roles.'),
('ku:bsc-computer-science','cloud-engineer','ae-manual-v1','title','ku:bsc-computer-science','approved','common_pathway','2026-08-09','Computer science is a common cloud engineering education base.'),
('ku:bsc-computer-science','cybersecurity-analyst','ae-manual-v1','title','ku:bsc-computer-science','approved','common_pathway','2026-08-09','Current KU program includes a Cybersecurity concentration.'),
('ku:bsc-computer-science','software-developer','ae-manual-v1','title','ku:bsc-computer-science','approved','direct','2026-08-09','Computer science is a direct software-development pathway.'),
('ku:bsc-electrical-engineering','electrical-engineer','ae-manual-v1','title','ku:bsc-electrical-engineering','approved','direct','2026-08-09','Discipline-specific engineering degree.'),
('ku:bsc-engineering-systems-management','industrial-engineer','ae-manual-v1','title','ku:bsc-engineering-systems-management','approved','common_pathway','2026-08-09','Engineering systems and management is a common industrial/systems pathway.'),
('ku:bsc-engineering-systems-management','project-manager','ae-manual-v1','title','ku:bsc-engineering-systems-management','approved','related','2026-08-09','Management-oriented engineering degree supports project roles.'),
('ku:bsc-mechanical-engineering','mechanical-engineer','ae-manual-v1','title','ku:bsc-mechanical-engineering','approved','direct','2026-08-09','Discipline-specific engineering degree.'),
('ku:bsc-robotics-ai','software-developer','ae-manual-v1','title','ku:bsc-robotics-ai','approved','common_pathway','2026-08-09','Computing-intensive robotics/AI degree.'),
('ku:meng-hse-environmental-engineering','environmental-engineer','ae-manual-v2','title','ku:meng-hse-environmental-engineering','approved','direct','2026-08-09','CAA Active environmental engineering graduate degree.'),
('lesroches:bsc-global-hospitality-management','event-planner','ae-manual-v2','title','lesroches:bsc-global-hospitality-management','approved','related','2026-08-09','Hospitality management commonly includes event operations/management.'),
('lesroches:bsc-global-hospitality-management','hospitality-supervisor','ae-manual-v2','title','lesroches:bsc-global-hospitality-management','approved','direct','2026-08-09','Hospitality management degree.'),
('lesroches:bsc-global-hospitality-management','hotel-manager','ae-manual-v2','title','lesroches:bsc-global-hospitality-management','approved','direct','2026-08-09','Hospitality management degree.'),
('lesroches:bsc-global-hospitality-management','restaurant-manager','ae-manual-v2','title','lesroches:bsc-global-hospitality-management','approved','common_pathway','2026-08-09','Hospitality management is a common restaurant-management pathway.'),
('lesroches:bsc-global-hospitality-management','tourism-manager','ae-manual-v2','title','lesroches:bsc-global-hospitality-management','approved','common_pathway','2026-08-09','Hospitality management is a common tourism-management pathway.'),
('mbru:bsc-nursing','registered-nurse','ae-manual-v1','title','mbru:bsc-nursing','approved','direct','2026-08-09','Professional nursing degree.'),
('mbru:msc-biomedical-sciences','medical-laboratory-technician','ae-manual-v1','title','mbru:msc-biomedical-sciences','approved','related','2026-08-09','Biomedical sciences is relevant laboratory education but not a technician credential.'),
('mbru:phd-biomedical-sciences','medical-laboratory-technician','ae-manual-v1','title','mbru:phd-biomedical-sciences','approved','related','2026-08-09','Biomedical sciences research is relevant but exceeds technician qualification level.'),
('nyuad:ba-business-organizations-society','business-analyst','ae-manual-v1','title','nyuad:ba-business-organizations-society','approved','common_pathway','2026-08-09','Business/organizations major supports business-analysis roles.'),
('nyuad:ba-business-organizations-society','human-resources-specialist','ae-manual-v1','title','nyuad:ba-business-organizations-society','approved','related','2026-08-09','Organizations coursework is related to HR roles.'),
('nyuad:ba-economics','financial-analyst','ae-manual-v1','title','nyuad:ba-economics','approved','common_pathway','2026-08-09','Economics degree supports financial analysis.'),
('nyuad:ba-film-new-media','film-editor','ae-manual-v1','title','nyuad:ba-film-new-media','approved','common_pathway','2026-08-09','Film/new media major.'),
('nyuad:ba-film-new-media','multimedia-designer','ae-manual-v1','title','nyuad:ba-film-new-media','approved','common_pathway','2026-08-09','Film/new media major.'),
('nyuad:ba-interactive-media','multimedia-designer','ae-manual-v1','title','nyuad:ba-interactive-media','approved','direct','2026-08-09','Interactive media major.'),
('nyuad:ba-interactive-media','ux-designer','ae-manual-v1','title','nyuad:ba-interactive-media','approved','common_pathway','2026-08-09','Interactive media supports user-experience design.'),
('nyuad:ba-interactive-media','web-designer','ae-manual-v1','title','nyuad:ba-interactive-media','approved','common_pathway','2026-08-09','Interactive media supports web/digital design.'),
('nyuad:ba-psychology','counsellor','ae-manual-v1','title','nyuad:ba-psychology','approved','common_pathway','2026-08-09','Psychology is a common pre-professional counselling pathway.'),
('nyuad:ba-social-research-public-policy','community-worker','ae-manual-v1','title','nyuad:ba-social-research-public-policy','approved','related','2026-08-09','Social research/public policy is related to community-sector roles.'),
('nyuad:ba-social-research-public-policy','youth-worker','ae-manual-v1','title','nyuad:ba-social-research-public-policy','approved','related','2026-08-09','Social policy education is related but not a dedicated youth-work qualification.'),
('nyuad:bs-civil-urban-engineering','civil-engineer','ae-manual-v1','title','nyuad:bs-civil-urban-engineering','approved','direct','2026-08-09','Civil and urban engineering degree.'),
('nyuad:bs-computer-engineering','network-administrator','ae-manual-v1','title','nyuad:bs-computer-engineering','approved','related','2026-08-09','Computer engineering supports network/infrastructure roles.'),
('nyuad:bs-computer-science','cloud-engineer','ae-manual-v1','title','nyuad:bs-computer-science','approved','common_pathway','2026-08-09','Computer science is a common cloud-engineering base.'),
('nyuad:bs-computer-science','software-developer','ae-manual-v1','title','nyuad:bs-computer-science','approved','direct','2026-08-09','Computer science degree.'),
('nyuad:bs-electrical-engineering','electrical-engineer','ae-manual-v1','title','nyuad:bs-electrical-engineering','approved','direct','2026-08-09','Discipline-specific engineering degree.'),
('nyuad:bs-mathematics','data-analyst','ae-manual-v1','title','nyuad:bs-mathematics','approved','related','2026-08-09','Quantitative degree relevant to data analysis.'),
('nyuad:bs-mechanical-engineering','mechanical-engineer','ae-manual-v1','title','nyuad:bs-mechanical-engineering','approved','direct','2026-08-09','Discipline-specific engineering degree.'),
('nyuad:mfa-art-media','multimedia-designer','ae-manual-v1','title','nyuad:mfa-art-media','approved','common_pathway','2026-08-09','Art and media graduate program.'),
('nyuad:msc-data-science-ai','data-analyst','ae-manual-v1','title','nyuad:msc-data-science-ai','approved','direct','2026-08-09','Graduate data science/AI program.'),
('nyuad:msc-data-science-ai','data-engineer','ae-manual-v1','title','nyuad:msc-data-science-ai','approved','common_pathway','2026-08-09','Graduate data science/AI supports data engineering.'),
('nyuad:msc-data-science-ai','software-developer','ae-manual-v1','title','nyuad:msc-data-science-ai','approved','related','2026-08-09','Graduate data science/AI supports software roles.'),
('sma:b-marine-engineering-technology','marine-engineer','ae-manual-v2','title','sma:b-marine-engineering-technology','approved','direct','2026-08-09','SMA states program prepares graduates for marine-engineer watchkeeper pathway.'),
('sma:b-maritime-logistics-supply-chain','logistics-coordinator','ae-manual-v2','title','sma:b-maritime-logistics-supply-chain','approved','direct','2026-08-09','Maritime logistics and supply chain degree.'),
('sma:b-maritime-logistics-supply-chain','supply-chain-analyst','ae-manual-v2','title','sma:b-maritime-logistics-supply-chain','approved','common_pathway','2026-08-09','Supply chain degree supports analyst roles.'),
('sma:b-maritime-logistics-supply-chain','warehouse-manager','ae-manual-v2','title','sma:b-maritime-logistics-supply-chain','approved','common_pathway','2026-08-09','Maritime logistics and supply chain degree supports warehouse/logistics management.'),
('sma:b-maritime-transport','deck-officer','ae-manual-v2','title','sma:b-maritime-transport','approved','direct','2026-08-09','SMA states program prepares graduates for Watchkeeper/2nd Officer pathway.'),
('uaeu:b-accounting','accountant','ae-manual-v1','title','uaeu:b-accounting','approved','direct','2026-08-09','Accounting degree.'),
('uaeu:b-accounting','auditor','ae-manual-v1','title','uaeu:b-accounting','approved','common_pathway','2026-08-09','Accounting is a common audit pathway.'),
('uaeu:ba-geography','environmental-scientist','ae-manual-v1','title','uaeu:ba-geography','approved','related','2026-08-09','CAA lists active Environmental Geography concentration.'),
('uaeu:ba-geography','sustainability-specialist','ae-manual-v1','title','uaeu:ba-geography','approved','related','2026-08-09','Environmental geography is relevant to sustainability work.'),
('uaeu:ba-mass-communication','marketing-specialist','ae-manual-v1','title','uaeu:ba-mass-communication','approved','related','2026-08-09','Mass communication supports marketing/communications roles.'),
('uaeu:bba-human-resources','human-resources-specialist','ae-manual-v1','title','uaeu:bba-human-resources','approved','direct','2026-08-09','Human resources management and development major.'),
('uaeu:bba-marketing','marketing-specialist','ae-manual-v1','title','uaeu:bba-marketing','approved','direct','2026-08-09','Marketing major.'),
('uaeu:bba-supply-chain-logistics','logistics-coordinator','ae-manual-v1','title','uaeu:bba-supply-chain-logistics','approved','direct','2026-08-09','Supply chain and logistics major.'),
('uaeu:bba-supply-chain-logistics','supply-chain-analyst','ae-manual-v1','title','uaeu:bba-supply-chain-logistics','approved','direct','2026-08-09','Supply chain and logistics major.'),
('uaeu:bed-early-childhood','early-childhood-teacher','ae-manual-v1','title','uaeu:bed-early-childhood','approved','direct','2026-08-09','Professional early childhood education degree.'),
('uaeu:bed-special-education','special-education-teacher','ae-manual-v1','title','uaeu:bed-special-education','approved','direct','2026-08-09','Professional special education degree.'),
('uaeu:bsc-data-science-ai','data-analyst','ae-manual-v1','title','uaeu:bsc-data-science-ai','approved','direct','2026-08-09','Data science and AI degree.'),
('uaeu:bsc-data-science-ai','data-engineer','ae-manual-v1','title','uaeu:bsc-data-science-ai','approved','common_pathway','2026-08-09','Data science and AI supports data engineering.'),
('uaeu:bsc-food-science','food-technologist','ae-manual-v1','title','uaeu:bsc-food-science','approved','direct','2026-08-09','Food science degree.'),
('uaeu:bsc-geosciences','environmental-scientist','ae-manual-v1','title','uaeu:bsc-geosciences','approved','related','2026-08-09','Geosciences supports environmental science pathways.'),
('uaeu:bsc-horticulture','agronomist','ae-manual-v1','title','uaeu:bsc-horticulture','approved','common_pathway','2026-08-09','Crop production/organic farming concentration supports agronomy.'),
('uaeu:bsc-horticulture','farm-manager','ae-manual-v1','title','uaeu:bsc-horticulture','approved','related','2026-08-09','Horticulture/agriculture education supports farm management.'),
('uaeu:bsc-horticulture','horticulturist','ae-manual-v1','title','uaeu:bsc-horticulture','approved','direct','2026-08-09','Horticulture degree.'),
('uaeu:bsc-marine-fisheries-animal-science','animal-science-technician','ae-manual-v2','title','uaeu:bsc-marine-fisheries-animal-science','approved','direct','2026-08-09','CAA Active degree with Active Animal Science concentration.'),
('uaeu:bsc-math-data-science','data-analyst','ae-manual-v1','title','uaeu:bsc-math-data-science','approved','direct','2026-08-09','Mathematics of data science degree.'),
('uaeu:bsc-math-data-science','data-engineer','ae-manual-v1','title','uaeu:bsc-math-data-science','approved','common_pathway','2026-08-09','Data-science mathematics supports data engineering.'),
('uaeu:master-education','early-childhood-teacher','ae-manual-v1','title','uaeu:master-education','approved','common_pathway','2026-08-09','CAA lists active Early Childhood Education concentration.'),
('uaeu:master-education','special-education-teacher','ae-manual-v1','title','uaeu:master-education','approved','common_pathway','2026-08-09','CAA lists active Special Education concentration.')
)
insert into public.program_occupation_ae_staging(program_catalog_id,canonical_career_id,rule_version,match_basis,match_pattern,review_status,relation_type,source_checked_at,reviewer_note,reviewed_at)
select p.id,l.canonical_career_id,l.rule_version,l.match_basis,l.match_pattern,l.review_status,l.relation_type,l.source_checked_at::date,l.reviewer_note,now()
from links l join public.program_catalog_ae_staging p on p.source_program_key=l.source_program_key
on conflict(program_catalog_id,canonical_career_id) do update set
 rule_version=excluded.rule_version,match_basis=excluded.match_basis,match_pattern=excluded.match_pattern,review_status=excluded.review_status,
 relation_type=excluded.relation_type,source_checked_at=excluded.source_checked_at,reviewer_note=excluded.reviewer_note,reviewed_at=now();

update public.program_international_ae_staging x
set international_students_eligible=true,
    international_admission_status='open',
    visa_sponsorship_available=true,
    intake_label='September 2026',
    intake_start_date='2026-09-01',
    admission_source_url='https://dct.ac.ae/admission/international-students/',
    visa_source_url='https://dct.ac.ae/en/admission/visa-information/',
    source_as_of='2026-08-09',verification_status='verified',
    rule_notes='DCT explicitly welcomes international students, processes student visas, and is accepting September 2026 applications.',verified_at=now()
from public.program_catalog_ae_staging p
where p.id=x.program_catalog_id and p.source_program_key in ('dct:certificate-culinary-operations','dct:advanced-diploma-culinary-management');

update public.program_international_ae_staging x
set international_students_eligible=true,
    international_admission_status='open',
    visa_sponsorship_available=true,
    intake_label='Continuous application; course date subject to availability',
    admission_source_url='https://www.emiratesflighttrainingacademy.com/en/admissions/',
    visa_source_url='https://www.emiratesflighttrainingacademy.com/en/admissions/',
    source_as_of='2026-08-09',verification_status='verified',
    rule_notes='EFTA accepts online applications from home country; non-UAE candidates must be eligible for UAE student visa; application is available now and course dates are assigned subject to availability.',verified_at=now()
from public.program_catalog_ae_staging p
where p.id=x.program_catalog_id and p.source_program_key='efta:integrated-atpl';

update public.program_international_ae_staging x
set international_students_eligible=false,
    international_admission_status='restricted',
    visa_sponsorship_available=false,
    intake_label='Academic Year 2026-2027 Fall',
    intake_start_date='2026-08-17',
    application_deadline='2026-07-21',
    admission_source_url='https://app.ecae.ac.ae/admission/Admission.aspx',
    source_as_of='2026-08-09',verification_status='verified',
    rule_notes='ECAE Pre-Service PGDE admissions are available only to UAE Nationals and children of Emirati mothers; Fall 2026 application close date was 21 July 2026.',verified_at=now()
from public.program_catalog_ae_staging p
where p.id=x.program_catalog_id and p.source_program_key in ('ecae:pgde-early-years-primary','ecae:pgde-secondary');

update public.program_international_ae_staging x
set international_students_eligible=true,
    international_admission_status='closed',
    intake_label='Fall 2026',
    application_deadline='2026-03-02',
    admission_source_url='https://www.ku.ac.ae/undergraduate-admissions',
    source_as_of='2026-08-09',verification_status='verified',
    rule_notes='KU explicitly accepts international applicants; Fall 2026 undergraduate applications closed 2 March 2026.',verified_at=now()
from public.program_catalog_ae_staging p
where p.id=x.program_catalog_id and p.institution_name='Khalifa University' and p.programme_level='BACHELOR';

update public.program_international_ae_staging x
set international_admission_status='closed',
    admission_source_url='https://www.mbru.ac.ae/programs/',
    source_as_of='2026-08-09',verification_status='verified',
    rule_notes=case p.source_program_key
      when 'mbru:bsc-nursing' then '2026-27 application deadline was 20 July 2026.'
      when 'mbru:md-6' then '2026-27 application deadline was 9 January 2026; MBRU explicitly describes an online entrance exam for international students.'
      when 'mbru:graduate-entry-md-4' then '2026-27 application deadline was 9 January 2026.'
      when 'mbru:msc-biomedical-sciences' then '2026-27 application deadline was 27 July 2026; applicants with degrees outside UAE are explicitly supported subject to credential evaluation.'
      when 'mbru:phd-biomedical-sciences' then '2026-27 application deadline was 13 April 2026.'
      when 'mbru:msc-health-professions-education' then '2026-27 application deadline was 7 April 2026.'
      when 'mbru:pgdip-health-professions-education' then '2026-27 application deadline was 20 July 2026.' end,
    application_deadline=case p.source_program_key
      when 'mbru:bsc-nursing' then '2026-07-20'::date
      when 'mbru:md-6' then '2026-01-09'::date
      when 'mbru:graduate-entry-md-4' then '2026-01-09'::date
      when 'mbru:msc-biomedical-sciences' then '2026-07-27'::date
      when 'mbru:phd-biomedical-sciences' then '2026-04-13'::date
      when 'mbru:msc-health-professions-education' then '2026-04-07'::date
      when 'mbru:pgdip-health-professions-education' then '2026-07-20'::date end,
    international_students_eligible=case when p.source_program_key='mbru:md-6' then true else x.international_students_eligible end,
    verified_at=now()
from public.program_catalog_ae_staging p
where p.id=x.program_catalog_id and p.institution_name='Mohammed Bin Rashid University of Medicine and Health Sciences';

do $$
declare
  staged_count integer;
  tier_a_count integer;
  link_count integer;
  career_count integer;
  international_count integer;
  open_count integer;
  closed_count integer;
  restricted_count integer;
  unknown_count integer;
begin
  select count(*) into staged_count from public.program_catalog_ae_staging;
  select count(*) into tier_a_count from public.program_catalog_ae_staging where verification_tier='A';
  select count(*) into link_count from public.program_occupation_ae_staging where review_status='approved';
  select count(distinct canonical_career_id) into career_count from public.program_occupation_ae_staging where review_status='approved';
  select count(*) into international_count from public.program_international_ae_staging;
  select count(*) into open_count from public.program_international_ae_staging where verification_status='verified' and international_admission_status='open';
  select count(*) into closed_count from public.program_international_ae_staging where verification_status='verified' and international_admission_status='closed';
  select count(*) into restricted_count from public.program_international_ae_staging where verification_status='verified' and international_admission_status='restricted';
  select count(*) into unknown_count from public.program_international_ae_staging where verification_status='unverified' and international_admission_status='unknown';
  if staged_count <> 108 or tier_a_count <> 37 or link_count <> 132 or career_count <> 69
     or international_count <> 108 or open_count <> 3 or closed_count <> 24 or restricted_count <> 2 or unknown_count <> 79 then
    raise exception 'AE programme evidence snapshot drift: staged %, tier_a %, links %, careers %, international %, open %, closed %, restricted %, unknown %',
      staged_count,tier_a_count,link_count,career_count,international_count,open_count,closed_count,restricted_count,unknown_count;
  end if;
end $$;
