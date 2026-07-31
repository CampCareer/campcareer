/**
 * Visa pathway catalogue for the workspace Visas explorer.
 *
 * This is a navigation-level index of well-known visa categories. It is not a
 * substitute for official guidance — every entry links to the issuing agency.
 */

export type VisaEntry = {
  country: string
  countryCode: string
  name: string
  kind: "Study" | "Work" | "Working holiday" | "Skilled" | "Family" | "Temporary"
  note: string
  authority: string
  url: string
}

export const VISA_CATALOG: readonly VisaEntry[] = [
  { country: "Australia", countryCode: "AU", name: "Student visa", kind: "Study", note: "Full-time study at a registered Australian institution.", authority: "Home Affairs", url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500" },
  { country: "Australia", countryCode: "AU", name: "Working Holiday", kind: "Working holiday", note: "Work and travel for up to 12 months, with regional work extensions.", authority: "Home Affairs", url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/work-holiday-417" },
  { country: "Australia", countryCode: "AU", name: "Temporary Graduate", kind: "Work", note: "Stay and work in Australia after finishing your studies.", authority: "Home Affairs", url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-graduate-485" },
  { country: "Australia", countryCode: "AU", name: "Skilled Independent", kind: "Skilled", note: "Points-tested skilled migration with no sponsor or nominator.", authority: "Home Affairs", url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189" },
  { country: "Australia", countryCode: "AU", name: "Skilled Nominated", kind: "Skilled", note: "Points-tested skilled migration nominated by a state or territory.", authority: "Home Affairs", url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-nominated-190" },
  { country: "Australia", countryCode: "AU", name: "Skilled Work Regional", kind: "Skilled", note: "Skilled migration to regional Australia with a pathway to PR.", authority: "Home Affairs", url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-work-regional-491" },
  { country: "Australia", countryCode: "AU", name: "Temporary Skill Shortage", kind: "Work", note: "Employer-sponsored work for occupations in demand.", authority: "Home Affairs", url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-skill-shortage-482" },

  { country: "Canada", countryCode: "CA", name: "Study Permit", kind: "Study", note: "Allows study at a designated learning institution.", authority: "IRCC", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit.html" },
  { country: "Canada", countryCode: "CA", name: "Post-Graduation Work Permit", kind: "Work", note: "Open work permit after graduating from an eligible program.", authority: "IRCC", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation.html" },
  { country: "Canada", countryCode: "CA", name: "Express Entry", kind: "Skilled", note: "Points-based system for skilled workers (FSW, CEC, FST).", authority: "IRCC", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html" },
  { country: "Canada", countryCode: "CA", name: "Provincial Nominee Program", kind: "Skilled", note: "Nomination by a province or territory for permanent residence.", authority: "IRCC", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/provincial-nominees.html" },
  { country: "Canada", countryCode: "CA", name: "International Experience Canada", kind: "Working holiday", note: "Working holiday-style permits for youth from partner countries.", authority: "IRCC", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/iec.html" },

  { country: "United Kingdom", countryCode: "UK", name: "Student visa", kind: "Study", note: "Study at an accredited UK education provider.", authority: "Home Office", url: "https://www.gov.uk/student-visa" },
  { country: "United Kingdom", countryCode: "UK", name: "Skilled Worker", kind: "Work", note: "Work for an approved UK sponsor in an eligible occupation.", authority: "Home Office", url: "https://www.gov.uk/skilled-worker-visa" },
  { country: "United Kingdom", countryCode: "UK", name: "Graduate visa", kind: "Work", note: "Stay in the UK to work after completing a degree.", authority: "Home Office", url: "https://www.gov.uk/graduate-visa" },
  { country: "United Kingdom", countryCode: "UK", name: "Health and Care Worker", kind: "Work", note: "Faster visa route for health and adult social care roles.", authority: "Home Office", url: "https://www.gov.uk/health-care-worker-visa" },
  { country: "United Kingdom", countryCode: "UK", name: "Youth Mobility Scheme", kind: "Working holiday", note: "Two-year working holiday for young people from partner countries.", authority: "Home Office", url: "https://www.gov.uk/youth-mobility" },

  { country: "United States", countryCode: "US", name: "F-1 Student", kind: "Study", note: "Full-time study at an SEVP-approved school.", authority: "USCIS", url: "https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors" },
  { country: "United States", countryCode: "US", name: "H-1B Specialty Occupation", kind: "Work", note: "Employer-sponsored visa for specialty occupation roles.", authority: "USCIS", url: "https://www.uscis.gov/working-in-the-united-states/h-1b-specialty-occupations" },
  { country: "United States", countryCode: "US", name: "J-1 Exchange Visitor", kind: "Work", note: "Work-and-study exchange program for students and professionals.", authority: "US State Dept", url: "https://j1visa.state.gov/" },
  { country: "United States", countryCode: "US", name: "L-1 Intracompany Transferee", kind: "Work", note: "Transfer within a company to a US office in a managerial or specialised role.", authority: "USCIS", url: "https://www.uscis.gov/working-in-the-united-states/temporary-workers/l-1a-intracompany-transferee" },
  { country: "United States", countryCode: "US", name: "OPT / STEM OPT", kind: "Work", note: "Optional Practical Training after completing an F-1 degree.", authority: "USCIS", url: "https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-opt-for-f-1-students" },

  { country: "Ireland", countryCode: "IE", name: "Student visa", kind: "Study", note: "Study at a recognised Irish education provider.", authority: "Immigration Service Delivery", url: "https://www.irishimmigration.ie/coming-to-study-in-ireland/" },
  { country: "Ireland", countryCode: "IE", name: "Stamp 1G", kind: "Work", note: "Third-level graduate work permission after completing studies.", authority: "Immigration Service Delivery", url: "https://www.irishimmigration.ie/coming-to-work-in-ireland/" },
  { country: "Ireland", countryCode: "IE", name: "Working Holiday / Youth Mobility", kind: "Working holiday", note: "Working holiday agreements with partner countries.", authority: "Immigration Service Delivery", url: "https://www.irishimmigration.ie/coming-to-work-in-ireland/" },
  { country: "Ireland", countryCode: "IE", name: "Critical Skills Employment Permit", kind: "Skilled", note: "Fast-track permit for occupations on the critical skills list.", authority: "DETE", url: "https://enterprise.gov.ie/en/what-we-do/workplace-and-skills/employment-permits/" },

  { country: "Germany", countryCode: "DE", name: "Student visa", kind: "Study", note: "Study or preparatory course at a German university.", authority: "Federal Foreign Office", url: "https://www.make-it-in-germany.com/en/visa-residence/visa-application/study" },
  { country: "Germany", countryCode: "DE", name: "EU Blue Card", kind: "Skilled", note: "Residence permit for highly qualified workers with a job offer.", authority: "Federal Office for Migration", url: "https://www.make-it-in-germany.com/en/visa-residence/types/eu-blue-card" },
  { country: "Germany", countryCode: "DE", name: "Skilled Worker visa", kind: "Work", note: "Residence permit for qualified workers with recognised qualifications.", authority: "Federal Office for Migration", url: "https://www.make-it-in-germany.com/en/visa-residence/visa-application/skilled-workers" },
  { country: "Germany", countryCode: "DE", name: "Working Holiday", kind: "Working holiday", note: "One-year working holiday for young people from partner countries.", authority: "Federal Foreign Office", url: "https://www.make-it-in-germany.com/en/visa-residence/types/working-holiday" },
  { country: "Germany", countryCode: "DE", name: "Job Seeker Visa", kind: "Temporary", note: "Look for a job in Germany for up to 6 months.", authority: "Federal Foreign Office", url: "https://www.make-it-in-germany.com/en/visa-residence/types/job-seeker" },
  { country: "Germany", countryCode: "DE", name: "Family Reunion Visa", kind: "Family", note: "Join your spouse or family member in Germany.", authority: "Federal Foreign Office", url: "https://www.make-it-in-germany.com/en/visa-residence/types/family-reunion" },

  { country: "Netherlands", countryCode: "NL", name: "Student visa", kind: "Study", note: "Study at a Dutch higher education institution.", authority: "IND", url: "https://ind.nl/en/study" },
  { country: "Netherlands", countryCode: "NL", name: "Highly Skilled Migrant", kind: "Skilled", note: "Employer-sponsored residence permit for skilled migrants.", authority: "IND", url: "https://ind.nl/en/work/working-in-the-netherlands/highly-skilled-migrant" },
  { country: "Netherlands", countryCode: "NL", name: "Orientation Year", kind: "Work", note: "Search year after graduating from a Dutch or eligible foreign university.", authority: "IND", url: "https://ind.nl/en/work/working-in-the-netherlands/orientation-year-for-graduates" },
  { country: "Netherlands", countryCode: "NL", name: "Working Holiday", kind: "Working holiday", note: "Working holiday arrangements with partner countries.", authority: "IND", url: "https://ind.nl/en/work/working-in-the-netherlands/working-holiday" },

  { country: "Belgium", countryCode: "BE", name: "Student visa", kind: "Study", note: "Study at a Belgian higher education institution.", authority: "Immigration Office", url: "https://dofi.ibz.be/themes/studying-belgium" },
  { country: "Belgium", countryCode: "BE", name: "Single Permit", kind: "Work", note: "Combined work and residence permit for employed workers.", authority: "Immigration Office", url: "https://dofi.ibz.be/themes/working-belgium" },
  { country: "Belgium", countryCode: "BE", name: "Working Holiday", kind: "Working holiday", note: "Working holiday agreements with partner countries.", authority: "Immigration Office", url: "https://dofi.ibz.be/themes/working-belgium/working-holiday-programme" },

  { country: "France", countryCode: "FR", name: "Student visa", kind: "Study", note: "Study at a French higher education institution.", authority: "Campus France", url: "https://france-visas.gouv.fr/en/france-visas" },
  { country: "France", countryCode: "FR", name: "Talent Passport", kind: "Skilled", note: "Multi-year residence permit for highly skilled workers and researchers.", authority: "France Visas", url: "https://france-visas.gouv.fr/en/other-talent-passport" },
  { country: "France", countryCode: "FR", name: "Working Holiday", kind: "Working holiday", note: "Working holiday visa for young people from partner countries.", authority: "France Visas", url: "https://france-visas.gouv.fr/en/working-holiday" },

  { country: "Spain", countryCode: "ES", name: "Student visa", kind: "Study", note: "Study at a Spanish education institution.", authority: "Ministry of Foreign Affairs", url: "https://www.exteriores.gob.es/" },
  { country: "Spain", countryCode: "ES", name: "Employment Permit", kind: "Work", note: "Work permit for employed workers with a job offer.", authority: "Ministry of Inclusion", url: "https://extranjeros.inclusion.gob.es/" },
  { country: "Spain", countryCode: "ES", name: "Working Holiday", kind: "Working holiday", note: "Working holiday agreements with partner countries.", authority: "Ministry of Foreign Affairs", url: "https://www.exteriores.gob.es/" },

  { country: "Singapore", countryCode: "SG", name: "Student's Pass", kind: "Study", note: "Study at a registered Singapore institution.", authority: "ICA", url: "https://www.ica.gov.sg/reside/STP" },
  { country: "Singapore", countryCode: "SG", name: "Employment Pass", kind: "Work", note: "For professionals, managers and executives with a job offer.", authority: "MOM", url: "https://www.mom.gov.sg/passes-and-permits/employment-pass" },
  { country: "Singapore", countryCode: "SG", name: "S Pass", kind: "Work", note: "For mid-level skilled workers with a job offer.", authority: "MOM", url: "https://www.mom.gov.sg/passes-and-permits/s-pass" },
  { country: "Singapore", countryCode: "SG", name: "Training Employment Pass", kind: "Work", note: "For short-term practical training in a Singapore company.", authority: "MOM", url: "https://www.mom.gov.sg/passes-and-permits/training-employment-pass" },

  { country: "South Korea", countryCode: "KR", name: "D-2 Student visa", kind: "Study", note: "Degree-seeking study at a Korean university.", authority: "HiKorea", url: "https://www.visa.go.kr/" },
  { country: "South Korea", countryCode: "KR", name: "D-4 Language Training", kind: "Study", note: "Language training at a Korean institute.", authority: "HiKorea", url: "https://www.visa.go.kr/" },
  { country: "South Korea", countryCode: "KR", name: "E-7 Work visa", kind: "Work", note: "Employer-sponsored work in an eligible occupation.", authority: "HiKorea", url: "https://www.visa.go.kr/" },
  { country: "South Korea", countryCode: "KR", name: "H-1 Working Holiday", kind: "Working holiday", note: "Working holiday visa for young people from partner countries.", authority: "HiKorea", url: "https://www.visa.go.kr/" },

  { country: "Japan", countryCode: "JP", name: "Student visa", kind: "Study", note: "Study at a Japanese university or language school.", authority: "MOFA", url: "https://www.mofa.go.jp/j_info/visit/visa/index.html" },
  { country: "Japan", countryCode: "JP", name: "Engineer / Specialist in Humanities", kind: "Work", note: "Work visa for professional and technical roles.", authority: "MOFA", url: "https://www.mofa.go.jp/j_info/visit/visa/index.html" },
  { country: "Japan", countryCode: "JP", name: "Working Holiday", kind: "Working holiday", note: "Working holiday for young people from partner countries.", authority: "MOFA", url: "https://www.mofa.go.jp/j_info/visit/visa/long/index.html" },
  { country: "Japan", countryCode: "JP", name: "Technical Intern Training", kind: "Work", note: "Training program for specific industries.", authority: "MOFA", url: "https://www.mofa.go.jp/j_info/visit/visa/index.html" },

  { country: "New Zealand", countryCode: "NZ", name: "Student visa", kind: "Study", note: "Study at a New Zealand education provider.", authority: "Immigration NZ", url: "https://www.immigration.govt.nz/new-zealand-visas/visas/visa/student-visa" },
  { country: "New Zealand", countryCode: "NZ", name: "Post-Study Work visa", kind: "Work", note: "Work in New Zealand after completing a qualification.", authority: "Immigration NZ", url: "https://www.immigration.govt.nz/new-zealand-visas/visas/visa/post-study-work-visa" },
  { country: "New Zealand", countryCode: "NZ", name: "Skilled Migrant Category", kind: "Skilled", note: "Points-based skilled residence pathway.", authority: "Immigration NZ", url: "https://www.immigration.govt.nz/new-zealand-visas/visas/visa/skilled-migrant-category" },
  { country: "New Zealand", countryCode: "NZ", name: "Working Holiday", kind: "Working holiday", note: "Working holiday visa for young people from partner countries.", authority: "Immigration NZ", url: "https://www.immigration.govt.nz/new-zealand-visas/visas/visa/working-holiday-visa" },

  { country: "Norway", countryCode: "NO", name: "Student visa", kind: "Study", note: "Study at a Norwegian university or university college.", authority: "UDI", url: "https://www.udi.no/en/want-to-apply/student/" },
  { country: "Norway", countryCode: "NO", name: "Skilled Worker", kind: "Work", note: "Residence permit for qualified workers with a job offer.", authority: "UDI", url: "https://www.udi.no/en/want-to-apply/work/" },
  { country: "Norway", countryCode: "NO", name: "Job Seeker", kind: "Work", note: "Six-month residence permit to look for work.", authority: "UDI", url: "https://www.udi.no/en/want-to-apply/work/" },

  { country: "Sweden", countryCode: "SE", name: "Student visa", kind: "Study", note: "Study at a Swedish higher education institution.", authority: "Swedish Migration Agency", url: "https://www.migrationsverket.se/English/Private-individuals/Studying-and-researching-in-Sweden" },
  { country: "Sweden", countryCode: "SE", name: "Work permit", kind: "Work", note: "Work permit for employment with a Swedish employer.", authority: "Swedish Migration Agency", url: "https://www.migrationsverket.se/English/Private-individuals/Working-in-Sweden" },
  { country: "Sweden", countryCode: "SE", name: "Job Seeker visa", kind: "Work", note: "Residence permit to look for work or explore business ideas.", authority: "Swedish Migration Agency", url: "https://www.migrationsverket.se/English/Private-individuals/Working-in-Sweden/After-your-studies" },

  { country: "Denmark", countryCode: "DK", name: "Student visa", kind: "Study", note: "Study at a Danish education institution.", authority: "SIRI", url: "https://www.nyidanmark.dk/en-GB/You-want-to-apply/Study" },
  { country: "Denmark", countryCode: "DK", name: "Positive List", kind: "Skilled", note: "Work permit for occupations in shortage in Denmark.", authority: "SIRI", url: "https://www.nyidanmark.dk/en-GB/You-want-to-apply/Work/Positive-list" },
  { country: "Denmark", countryCode: "DK", name: "Pay Limit Scheme", kind: "Work", note: "Work permit for highly paid job offers.", authority: "SIRI", url: "https://www.nyidanmark.dk/en-GB/You-want-to-apply/Work/Pay-limit-scheme" },

  { country: "Finland", countryCode: "FI", name: "Student visa", kind: "Study", note: "Study at a Finnish education institution.", authority: "Migri", url: "https://migri.fi/en/studying-in-finland" },
  { country: "Finland", countryCode: "FI", name: "Work-based residence permit", kind: "Work", note: "Residence permit for employed workers with a job offer.", authority: "Migri", url: "https://migri.fi/en/working-in-finland" },
  { country: "Finland", countryCode: "FI", name: "Specialist residence permit", kind: "Skilled", note: "For specialists, researchers and experts.", authority: "Migri", url: "https://migri.fi/en/specialist" },

  { country: "Switzerland", countryCode: "CH", name: "Student visa", kind: "Study", note: "Study at a Swiss university or recognised institution.", authority: "SEM", url: "https://www.sem.admin.ch/sem/en/home/themen/aufenthalt/studium.html" },
  { country: "Switzerland", countryCode: "CH", name: "Residence Permit B (L) — Worker", kind: "Work", note: "Residence permit for employed workers with a job offer.", authority: "SEM", url: "https://www.sem.admin.ch/sem/en/home/themen/arbeit/nicht-selbstaendig.html" },
  { country: "Switzerland", countryCode: "CH", name: "EU/EFTA mobility", kind: "Work", note: "Free movement for EU/EFTA nationals with a job offer.", authority: "SEM", url: "https://www.sem.admin.ch/sem/en/home/themen/arbeit/nicht-selbstaendig.html" },

  { country: "United Arab Emirates", countryCode: "AE", name: "Student visa", kind: "Study", note: "Residence visa sponsored by a UAE university.", authority: "ICP", url: "https://icp.gov.ae/en/" },
  { country: "United Arab Emirates", countryCode: "AE", name: "Employment visa", kind: "Work", note: "Employer-sponsored work visa and residence.", authority: "ICP", url: "https://icp.gov.ae/en/" },
  { country: "United Arab Emirates", countryCode: "AE", name: "Green Visa", kind: "Skilled", note: "Self-sponsored five-year residence for skilled workers.", authority: "ICP", url: "https://icp.gov.ae/en/" },
]

export const VISA_KINDS = ["Study", "Work", "Working holiday", "Skilled", "Family", "Temporary"] as const
