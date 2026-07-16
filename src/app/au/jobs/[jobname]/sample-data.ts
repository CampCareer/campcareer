export type OccupationDetail = {
  slug: string
  anzscoCode: string
  name: string
  nameKo: string
  lastVerified: string
  sources: string[]
  description: string
  environments: string[]
  anzscoDescriptionUrl: string
  skillsCore: string[]
  skillsEdge: string[]
  credentials: { title: string; details: string }[]
  outlook?: {
    years: { year: number; level: number }[]
    reason: string
  }
}

export const AU_OCCUPATION_DETAILS: Record<string, OccupationDetail> = {
  "electrician-general": {
    slug: "electrician-general",
    anzscoCode: "341111",
    name: "Electrician (General)",
    nameKo: "일반 전기기사",
    lastVerified: "2026-01-19",
    sources: ["JSA", "HomeAffairs", "SEEK"],
    description: "Install, test, maintain and repair electrical wiring, fixtures, switchboards and equipment in buildings, industrial sites and infrastructure projects. Work includes safety testing, compliance inspections and fault diagnosis.",
    environments: ["construction sites", "mining operations", "facilities maintenance", "residential projects"],
    anzscoDescriptionUrl: "https://www.abs.gov.au/anzsco/341111",
    skillsCore: [
      "Electrical safety & testing procedures",
      "Wiring rules (AS/NZS 3000)",
      "Fault finding & diagnostics",
      "Switchboard installation & commissioning",
      "Power distribution systems",
    ],
    skillsEdge: [
      "Solar PV / EV charging installation",
      "PLC & automation basics",
      "Mining site compliance (SLS)",
      "High-voltage switching",
    ],
    credentials: [
      { title: "Certificate III in Electrotechnology Electrician", details: "2–4 year apprenticeship pathway. Covers wiring, safety, compliance and practical assessment." },
      { title: "A-Grade Electrical Licence", details: "Required to work unsupervised. Issued by state electrical safety regulator after supervised hours + exam." },
      { title: "White Card (Construction Induction)", details: "Mandatory for all construction site work in Australia." },
      { title: "CPR & First Aid Certificate", details: "Required renewal every 3 years. Often a condition of employment." },
    ],
    outlook: {
      years: [
        { year: 2024, level: 3 },
        { year: 2025, level: 4 },
        { year: 2026, level: 5 },
      ],
      reason: "Infrastructure megaprojects (Western Sydney Airport, Melbourne Metro), renewable energy rollout, and an ageing trade workforce retiring faster than new apprentices qualify.",
    },
  },
  "registered-nurse": {
    slug: "registered-nurse",
    anzscoCode: "254415",
    name: "Registered Nurse",
    nameKo: "등록 간호사",
    lastVerified: "2026-01-15",
    sources: ["JSA", "HomeAffairs", "Health.gov.au"],
    description: "Provide and coordinate patient care in hospitals, aged care facilities, community health centres and mental health settings. Includes medication administration, patient assessment and care planning.",
    environments: ["hospitals (acute care)", "aged care facilities", "community health centres", "mental health services"],
    anzscoDescriptionUrl: "https://www.abs.gov.au/anzsco/254415",
    skillsCore: [
      "Clinical patient assessment",
      "Medication administration & management",
      "Wound care & infection control",
      "Patient documentation (electronic health records)",
      "Triage & emergency response",
    ],
    skillsEdge: [
      "Specialised areas (ICU, ED, perioperative)",
      "Mental health nursing",
      "Chronic disease management",
      "Leadership & preceptorship",
    ],
    credentials: [
      { title: "Bachelor of Nursing (or equivalent)", details: "3-year AQF Level 7 degree. Required for AHPRA registration as a Registered Nurse." },
      { title: "AHPRA Registration", details: "Mandatory registration with the Australian Health Practitioner Regulation Agency. Annual renewal required." },
      { title: "Working with Children Check", details: "Required for roles involving minors. State-specific." },
      { title: "National Police Check", details: "Standard requirement for healthcare employment." },
    ],
    outlook: {
      years: [
        { year: 2024, level: 4 },
        { year: 2025, level: 5 },
        { year: 2026, level: 5 },
      ],
      reason: "Chronic national shortage driven by ageing population, post-COVID workforce burnout, and regional demand outpacing graduate supply.",
    },
  },
  "software-developer": {
    slug: "software-developer",
    anzscoCode: "261313",
    name: "Software Developer",
    nameKo: "소프트웨어 개발자",
    lastVerified: "2026-01-20",
    sources: ["JSA", "Seek.com.au", "LinkedIn"],
    description: "Design, develop, test and maintain software applications and systems. Work spans full-stack web development, mobile apps, APIs and cloud infrastructure.",
    environments: ["tech companies", "financial services", "consulting firms", "start-ups", "government digital teams"],
    anzscoDescriptionUrl: "https://www.abs.gov.au/anzsco/261313",
    skillsCore: [
      "Programming (Python, Java, JavaScript/TypeScript)",
      "Software design & architecture",
      "Version control (Git)",
      "Testing & CI/CD pipelines",
      "Database design & SQL",
    ],
    skillsEdge: [
      "Cloud platforms (AWS, Azure, GCP)",
      "Mobile development (iOS/Android)",
      "Machine learning & AI integration",
      "Cybersecurity fundamentals",
    ],
    credentials: [
      { title: "Bachelor of Computer Science / IT (or equivalent)", details: "3-year degree or equivalent portfolio + experience. No formal licence required." },
      { title: "Industry Certifications (optional)", details: "AWS, Azure, Google Cloud, or vendor-specific certifications can strengthen applications." },
      { title: "Portfolio / GitHub", details: "Demonstrable projects often outweigh formal qualifications in hiring decisions." },
    ],
    outlook: {
      years: [
        { year: 2024, level: 3 },
        { year: 2025, level: 4 },
        { year: 2026, level: 4 },
      ],
      reason: "Strong demand across fintech, healthtech and government digital transformation. AI/ML specialisations command premium salaries but generalist roles face increasing global competition.",
    },
  },
  carpenter: {
    slug: "carpenter",
    anzscoCode: "331111",
    name: "Carpenter",
    nameKo: "목수",
    lastVerified: "2026-01-18",
    sources: ["JSA", "HomeAffairs", "SEEK"],
    description: "Construct, install and repair structures and fixtures made from wood and other materials. Work includes framing, roofing, formwork, and finishing in residential and commercial construction.",
    environments: ["residential construction", "commercial building sites", "renovation projects", "infrastructure"],
    anzscoDescriptionUrl: "https://www.abs.gov.au/anzsco/331111",
    skillsCore: [
      "Timber framing & structural work",
      "Reading construction plans & specifications",
      "Power tool operation & safety",
      "Measuring, marking & cutting",
      "Building code compliance (NCC)",
    ],
    skillsEdge: [
      "Concrete formwork",
      "Roof carpentry",
      "Heritage restoration",
      "Sustainable building materials",
    ],
    credentials: [
      { title: "Certificate III in Carpentry", details: "3–4 year apprenticeship. Covers structural carpentry, formwork and finishing." },
      { title: "White Card (Construction Induction)", details: "Mandatory for all construction site access." },
      { title: "Working at Heights Licence", details: "Required for roofing and elevated work." },
    ],
    outlook: {
      years: [
        { year: 2024, level: 3 },
        { year: 2025, level: 4 },
        { year: 2026, level: 4 },
      ],
      reason: "Housing supply targets and infrastructure pipeline keep demand strong. Apprenticeship completion rates remain below replacement level.",
    },
  },
  plumber: {
    slug: "plumber",
    anzscoCode: "334111",
    name: "Plumber",
    nameKo: "배관공",
    lastVerified: "2026-01-17",
    sources: ["JSA", "HomeAffairs", "SEEK"],
    description: "Install, maintain and repair water, drainage, gas and sanitary plumbing systems in residential, commercial and industrial buildings.",
    environments: ["residential construction", "commercial buildings", "industrial facilities", "maintenance & service"],
    anzscoDescriptionUrl: "https://www.abs.gov.au/anzsco/334111",
    skillsCore: [
      "Water supply & drainage systems",
      "Gas fitting & testing",
      "Pipe jointing (copper, PVC, steel)",
      "Blueprint reading",
      "Backflow prevention",
    ],
    skillsEdge: [
      "Solar hot water installation",
      "Fire services plumbing",
      "Roof plumbing",
      "Sustainable water systems (rainwater tanks)",
    ],
    credentials: [
      { title: "Certificate III in Plumbing", details: "4 year apprenticeship. Covers water, drainage, gas, sanitary and roofing plumbing." },
      { title: "Plumbing Licence", details: "State-regulated. Required to work unsupervised and pull permits." },
      { title: "Gas Fitting Endorsement", details: "Additional qualification for gas work. Required by state regulators." },
    ],
    outlook: {
      years: [
        { year: 2024, level: 3 },
        { year: 2025, level: 4 },
        { year: 2026, level: 4 },
      ],
      reason: "Building activity remains strong. Licensed plumbers face low replacement rates and steady service demand.",
    },
  },
  "motor-mechanic": {
    slug: "motor-mechanic",
    anzscoCode: "321211",
    name: "Motor Mechanic",
    nameKo: "자동차 정비사",
    lastVerified: "2026-01-16",
    sources: ["JSA", "HomeAffairs", "SEEK"],
    description: "Diagnose, service and repair motor vehicles including engines, transmissions, suspension, brakes and electrical systems. Work in workshops, dealerships and mobile service.",
    environments: ["automotive workshops", "dealerships", "fleet maintenance", "mobile service"],
    anzscoDescriptionUrl: "https://www.abs.gov.au/anzsco/321211",
    skillsCore: [
      "Engine diagnostics & repair",
      "Brake & suspension systems",
      "Electrical & electronic systems",
      "Service scheduling & maintenance",
      "Workshop safety (OH&S)",
    ],
    skillsEdge: [
      "Hybrid / EV drivetrain systems",
      "Diesel engine diagnostics",
      "Air conditioning (auto)",
      "Logbook & compliance inspections",
    ],
    credentials: [
      { title: "Certificate III in Light Vehicle Mechanical Technology", details: "3–4 year apprenticeship. Covers engine, electrical, braking and suspension systems." },
      { title: "Motor Vehicle Trade Licence", details: "Not nationally required but some states require licensing for certain work types." },
      { title: "Air Conditioning Licence", details: "Required for automotive refrigerant handling (ARCtick). Nationally recognised." },
    ],
    outlook: {
      years: [
        { year: 2024, level: 2 },
        { year: 2025, level: 3 },
        { year: 2026, level: 3 },
      ],
      reason: "Transition to EVs is changing skill requirements. Traditional mechanics with EV upskilling remain in demand, but pure ICE roles face gradual decline.",
    },
  },
}

export function getOccupationDetail(slug: string): OccupationDetail | null {
  return AU_OCCUPATION_DETAILS[slug] ?? null
}

export function getOccupationDetailByAnzsco(anzscoCode: string): OccupationDetail | null {
  return Object.values(AU_OCCUPATION_DETAILS).find((detail) => detail.anzscoCode === anzscoCode) ?? null
}

export function getAllOccupationSlugs(): string[] {
  return Object.keys(AU_OCCUPATION_DETAILS)
}
