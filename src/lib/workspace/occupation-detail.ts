export type OccupationSalary = {
  countryCode: string
  countryLabel: string
  currency: string
  low: number
  median: number
  high: number
  period: "year"
  sourceLabel: string
  sourceUrl: string
}

export type OccupationDemand = {
  countryCode: string
  countryLabel: string
  rating: string
  note: string
  sourceLabel: string
  sourceUrl: string
  /** Optional per-region ratings, e.g. AU state shortages. */
  regionRatings?: Record<string, string>
}

export const DEMAND_RATING_LABELS: Record<string, string> = {
  S: "Shortage",
  M: "Metropolitan shortage",
  R: "Regional shortage",
  NS: "No shortage",
}

export type OccupationDetail = {
  id: string
  categoryId: string
  label: string
  labelKo: string
  overview: { en: string; ko: string }
  registration?: { en: string; ko: string }
  mainTasks: string[]
  salaries: OccupationSalary[]
  demand: OccupationDemand[]
  sources: { label: string; url: string }[]
}

/**
 * Template for an occupation detail entry. New occupations follow this exact
 * schema: fill the fields, then the detail page renders automatically.
 *
 * Priority countries (AU, CA, US) have real sourced data where available.
 * Fields marked with "Source pending" indicate data imports still in progress.
 *
 * Current entries: registered-nurse, civil-engineer, electrician,
 * software-developer, construction-project-manager, teacher-primary-secondary.
 */
export const OCCUPATION_DETAILS: OccupationDetail[] = [
  {
    id: "registered-nurse",
    categoryId: "health",
    label: "Registered Nurse",
    labelKo: "간호사",
    overview: {
      en: "Plans, coordinates and provides nursing care and services to people in a hospital setting or as part of a retrieval service. Registered Nurses assess, monitor and treat patients, administer medication, support families, and coordinate care with the wider medical team.",
      ko: "병원 또는 구급 서비스 환경에서 간호 케어를 계획·조정·제공합니다. 환자 상태를 평가·모니터링하고, 투약을 시행하며, 가족을 지원하고 의료팀과 협력해 돌봄을 조율합니다.",
    },
    registration: {
      en: "Registration or licensing is required. In Australia this means AHPRA registration through the Nursing and Midwifery Board — confirm current requirements before treating a course or job as a viable path.",
      ko: "등록 또는 면허가 필요합니다. 호주의 경우 Nursing and Midwifery Board(AHPRA) 등록이 필요하며, 과정이나 채용을 경로로 판단하기 전 최신 요건을 반드시 확인하세요.",
    },
    mainTasks: [
      "Develops and implements nursing care plans to provide direct clinical care in a hospital setting",
      "Assesses and monitors the condition of people, and prepares people for surgery or treatment",
      "Administers and monitors medication and fluids",
      "Assists with diagnostic tests and procedures, as well as interpreting test results and reports",
      "Provides emotional support and comfort to people and their families",
      "Maintains accurate and up-to-date records of patient information",
      "Responds to emergency situations and provides immediate care and interventions",
    ],
    salaries: [
      {
        countryCode: "CA",
        countryLabel: "Canada",
        currency: "CAD",
        low: 60300,
        median: 87400,
        high: 106200,
        period: "year",
        sourceLabel: "Labour Force Survey (NOC 31301)",
        sourceUrl: "https://www.jobbank.gc.ca/",
      },
    ],
    demand: [
      {
        countryCode: "AU",
        countryLabel: "Australia",
        rating: "Shortage",
        note: "Rated in shortage in every state and territory for 2025.",
        sourceLabel: "JSA Occupation Shortage List 2025",
        sourceUrl: "https://www.jobsandskills.gov.au/",
        regionRatings: {
          NSW: "S",
          VIC: "S",
          QLD: "S",
          SA: "S",
          WA: "S",
          TAS: "S",
          NT: "S",
          ACT: "S",
        },
      },
    ],
    sources: [
      { label: "OSCA 265432 — Registered Nurse (Acute Care)", url: "https://www.abs.gov.au/" },
      { label: "Nursing and Midwifery Board of Australia", url: "https://www.nursingmidwiferyboard.gov.au/" },
      { label: "SEEK — Registered Nurse jobs", url: "https://www.seek.com.au/registered-nurse-jobs" },
    ],
  },
  {
    id: "civil-engineer",
    categoryId: "engineering",
    label: "Civil Engineer",
    labelKo: "토목 엔지니어",
    overview: {
      en: "Plans, designs and oversees construction and maintenance of civil infrastructure including roads, bridges, dams, buildings and water systems. Civil Engineers analyse survey reports, maps and data to plan projects, estimate costs and ensure compliance with regulations.",
      ko: "도로, 교량, 댐, 건물 및 수자원 시스템 등의 민간 인프라를 계획·설계하고 시공·유지를 감독합니다. 현장 조사 보고서와 지도를 분석하여 사업을 계획하고, 비용을 추정하며 규정 준수를 확인합니다.",
    },
    registration: {
      en: "Professional engineering licensure may be required in some jurisdictions. In Australia, Engineers Australia offers chartered membership; in Canada, P.Eng. licensure through provincial associations is standard for practice.",
      ko: "일부 관할권에서 전문 엔지니어 라이센스가 필요할 수 있습니다. 호주는 Engineers Australia의 공인 회원 자격을, 캐나다는 주별 엔지니어링 협회에서 P.Eng. 라이센스를 제공합니다.",
    },
    mainTasks: [
      "Conducts feasibility studies, site investigations and technical assessments for civil engineering projects",
      "Prepares detailed designs, technical specifications and project plans in compliance with standards",
      "Analyses survey data, soil tests and environmental reports to inform project decisions",
      "Estimates project costs, material quantities and timelines, and manages budgets",
      "Coordinates with architects, contractors, surveyors and regulatory authorities",
      "Monitors construction progress and ensures compliance with safety and quality standards",
      "Assesses environmental impact and identifies mitigation measures for infrastructure projects",
    ],
    salaries: [
      {
        countryCode: "CA",
        countryLabel: "Canada",
        currency: "CAD",
        low: 72000,
        median: 88100,
        high: 118000,
        period: "year",
        sourceLabel: "Statistics Canada NOC wage data (Job Bank)",
        sourceUrl: "https://www.jobbank.gc.ca/trend-analysis/wages",
      },
      {
        countryCode: "US",
        countryLabel: "United States",
        currency: "USD",
        low: 72000,
        median: 97000,
        high: 130000,
        period: "year",
        sourceLabel: "BLS occupational employment statistics",
        sourceUrl: "https://www.bls.gov/oes/current/oes172051.htm",
      },
    ],
    demand: [
      {
        countryCode: "AU",
        countryLabel: "Australia",
        rating: "Shortage",
        note: "Civil Engineer is rated in national shortage for 2025.",
        sourceLabel: "JSA Occupation Shortage List 2025",
        sourceUrl: "https://www.jobsandskills.gov.au/",
        regionRatings: {
          NSW: "S",
          VIC: "S",
          QLD: "S",
          SA: "S",
          WA: "S",
          TAS: "S",
          NT: "S",
          ACT: "S",
        },
      },
      {
        countryCode: "CA",
        countryLabel: "Canada",
        rating: "Strong",
        note: "Strong risk of shortage per COPS 2024–2033 projections.",
        sourceLabel: "ESDC COPS 2024–2033 Employment Outlook",
        sourceUrl: "https://www.jobbank.gc.ca/trend-analysis",
      },
      {
        countryCode: "US",
        countryLabel: "United States",
        rating: "HighDemand",
        note: "Strong shortage signal across most states.",
        sourceLabel: "BLS shortage score data by state",
        sourceUrl: "https://www.bls.gov",
      },
    ],
    sources: [
      { label: "JSA Occupation Shortage List 2025 — Civil Engineer", url: "https://www.jobsandskills.gov.au/" },
      { label: "Job Bank — Civil Engineer wages", url: "https://www.jobbank.gc.ca/trend-analysis/wages" },
      { label: "BLS — Civil Engineers occupational outlook", url: "https://www.bls.gov/ooh/architecture-and-engineering/civil-engineers.htm" },
    ],
  },
  {
    id: "electrician",
    categoryId: "trades",
    label: "Electrician",
    labelKo: "전기 기술자",
    overview: {
      en: "Installs, maintains and repairs electrical power, lighting, control and fire systems in residential, commercial and industrial settings. Electricians read blueprints, troubleshoot faults, ensure compliance with electrical codes and mentor apprentices.",
      ko: "주거 및 상업·산업 현장에서 전기 및 조명, 제어, 방화 시스템을 설치·유지·보수합니다. 전기 도면을 읽고 고장을 진단하며, 전기 안전 규정에 맞추고 현장 경험이 풍부한 사람들을 지도합니다.",
    },
    registration: {
      en: "Licence is required in most jurisdictions. In Australia this means state-based electrical licensing (e.g. NSW Fair Trading or Electrical Trades Union registration); in Canada, provincial journeyman certification; in the US, state-specific licensing requirements vary.",
      ko: "대부분의 관할권에서 라이센스가 필요합니다. 호주는 주별 전기 면허(NSW Fair Trading 등), 캐나다는 주별 제니맨 자격증, 미국은 주별 라이센스 요건이 다릅니다.",
    },
    mainTasks: [
      "Installs and maintains electrical wiring, fixtures, control panels and distribution systems",
      "Reads and interprets blueprints, schematics and technical drawings",
      "Diagnoses electrical faults using testing equipment and troubleshoots issues",
      "Ensures all installations comply with the National Electrical Code and local regulations",
      "Mentors and supervises apprentices and junior electricians on site",
      "Performs planned maintenance on electrical infrastructure and systems",
      "Coordinates with project managers and other tradespeople on construction sites",
    ],
    salaries: [
      {
        countryCode: "CA",
        countryLabel: "Canada",
        currency: "CAD",
        low: 58000,
        median: 76000,
        high: 98000,
        period: "year",
        sourceLabel: "Statistics Canada NOC wage data (Job Bank)",
        sourceUrl: "https://www.jobbank.gc.ca/trend-analysis/wages",
      },
      {
        countryCode: "US",
        countryLabel: "United States",
        currency: "USD",
        low: 47000,
        median: 68000,
        high: 96000,
        period: "year",
        sourceLabel: "BLS occupational employment statistics",
        sourceUrl: "https://www.bls.gov/oes/current/oes472112.htm",
      },
    ],
    demand: [
      {
        countryCode: "AU",
        countryLabel: "Australia",
        rating: "Shortage",
        note: "Electrician (General) is rated in national shortage for 2025.",
        sourceLabel: "JSA Occupation Shortage List 2025",
        sourceUrl: "https://www.jobsandskills.gov.au/",
        regionRatings: {
          NSW: "S",
          VIC: "S",
          QLD: "S",
          SA: "S",
          WA: "S",
          TAS: "S",
          NT: "NS",
          ACT: "S",
        },
      },
      {
        countryCode: "CA",
        countryLabel: "Canada",
        rating: "Strong",
        note: "Strong shortage risk per COPS 2024–2033, especially outside Quebec.",
        sourceLabel: "ESDC COPS 2024–2033 Employment Outlook",
        sourceUrl: "https://www.jobbank.gc.ca/trend-analysis",
      },
      {
        countryCode: "US",
        countryLabel: "United States",
        rating: "HighDemand",
        note: "Strong shortage signal across most states (avg. score ~85).",
        sourceLabel: "BLS shortage score data by state",
        sourceUrl: "https://www.bls.gov",
      },
    ],
    sources: [
      { label: "JSA Occupation Shortage List 2025 — Electrician (General)", url: "https://www.jobsandskills.gov.au/" },
      { label: "Job Bank — Electrician wages", url: "https://www.jobbank.gc.ca/trend-analysis/wages" },
      { label: "BLS — Electricians occupational outlook", url: "https://www.bls.gov/ooh/construction-and-extraction/electricians.htm" },
    ],
  },
  {
    id: "software-developer",
    categoryId: "engineering",
    label: "Software Developer",
    labelKo: "소프트웨어 개발자",
    overview: {
      en: "Designs, develops and tests software applications and systems using programming languages and frameworks. Software Developers analyse user needs, plan architecture, write code, debug issues and collaborate with cross-functional teams to deliver reliable software products.",
      ko: "프로그래밍 언어와 프레임워크를 사용하여 소프트웨어 애플리케이션과 시스템을 설계·개발·테스트합니다. 사용자 요구를 분석하고 아키텍처를 계획한 뒤 코드를 작성하며, 디버깅을 통해 크로스펑셔널 팀과 협력합니다.",
    },
    registration: {
      en: "No mandatory professional licensure is required in most countries. In Canada, the P.Log designation from the Canadian Information Processing Society (CIPS) and in Japan the Basic Information Technology Engineer exam are common voluntary credentials.",
      ko: "대부분의 국가에서 의무 라이센스는 없습니다. 캐나다는 CIPS의 P.Log 자격증, 일본은 기본 정보기술 엔지니어 시험이 일반적인 자발적 자격증입니다.",
    },
    mainTasks: [
      "Analyses user requirements and translates them into technical specifications and system architecture",
      "Writes clean, efficient and maintainable code in one or more programming languages",
      "Develops and maintains software applications, APIs and backend services",
      "Conducts code reviews, debugging and unit/integration testing",
      "Collaborates with designers, product managers and QA teams on sprint cycles",
      "Documents software functionality, deployment procedures and technical decisions",
      "Evaluates new frameworks and tools and recommends technological improvements",
    ],
    salaries: [
      {
        countryCode: "CA",
        countryLabel: "Canada",
        currency: "CAD",
        low: 75000,
        median: 92000,
        high: 120000,
        period: "year",
        sourceLabel: "Statistics Canada NOC wage data (Job Bank)",
        sourceUrl: "https://www.jobbank.gc.ca/trend-analysis/wages",
      },
      {
        countryCode: "US",
        countryLabel: "United States",
        currency: "USD",
        low: 85000,
        median: 126000,
        high: 170000,
        period: "year",
        sourceLabel: "BLS occupational employment statistics (Software Developers)",
        sourceUrl: "https://www.bls.gov/oes/current/oes151252.htm",
      },
    ],
    demand: [
      {
        countryCode: "AU",
        countryLabel: "Australia",
        rating: "RegionalShortage",
        note: "Software Engineer / Web Developer roles show regional shortage (NSW, VIC, QLD). National rating is 'No shortage' — demand is concentrated in major tech hubs.",
        sourceLabel: "JSA Occupation Shortage List 2025",
        sourceUrl: "https://www.jobsandskills.gov.au/",
        regionRatings: {
          NSW: "M",
          VIC: "M",
          QLD: "M",
          SA: "NS",
          WA: "NS",
          TAS: "NS",
          NT: "NS",
          ACT: "NS",
        },
      },
      {
        countryCode: "CA",
        countryLabel: "Canada",
        rating: "Strong",
        note: "Software developers and programmers rated 3/5 (moderate shortage) per COPS; demand is strong in Toronto, Vancouver and Montreal tech hubs.",
        sourceLabel: "ESDC COPS 2024–2033 Employment Outlook",
        sourceUrl: "https://www.jobbank.gc.ca/trend-analysis",
      },
      {
        countryCode: "US",
        countryLabel: "United States",
        rating: "HighDemand",
        note: "Strongest shortage signal in tech occupations — average score ~95 across 50 states.",
        sourceLabel: "BLS shortage score data by state",
        sourceUrl: "https://www.bls.gov",
      },
    ],
    sources: [
      { label: "Job Bank — Software Developer wages", url: "https://www.jobbank.gc.ca/trend-analysis/wages" },
      { label: "BLS — Software Developers occupational outlook", url: "https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm" },
      { label: "SEEK — Software Developer jobs AU", url: "https://www.seek.com.au/software-developer-jobs" },
    ],
  },
  {
    id: "construction-project-manager",
    categoryId: "engineering",
    label: "Construction Project Manager",
    labelKo: "건설 프로젝트 매니저",
    overview: {
      en: "Leads and coordinates construction projects from initiation through completion, managing scope, budget, timeline and stakeholder relationships. Construction Project Managers prepare bids and contracts, schedule activities, allocate resources and ensure projects meet safety and quality standards.",
      ko: "착수부터 완료까지 건설 프로젝트를 총괄하며 범위, 예산, 일정 및 이해관계자 관계를 관리합니다. 입찰서와 계약서를 준비하고 활동을 일정 관리하며, 자원을 배분하여 안전과 품질 기준을 충족합니다.",
    },
    registration: {
      en: "No universal licensure is required, but many employers prefer or require PMP (Project Management Professional) certification or a relevant degree. In Australia, an ABN and relevant construction insurance (e.g. contractual liability) are practical requirements.",
      ko: "보편적인 라이센스는 없지만 많은 고용주가 PMP 자격증 또는 관련 학위를 선호합니다. 호주는 ABN과 관련 건설 보험(계약상 책임 등)가 현실적인 요건입니다.",
    },
    mainTasks: [
      "Develops project charter, scope, budget and schedule and secures stakeholder approval",
      "Organises and leads project teams, contractors and subcontractors across disciplines",
      "Monitors project progress, manages change requests and mitigates schedule and cost risks",
      "Prepares and evaluates construction bids, contracts and procurement documents",
      "Conducts regular site walks, safety inspections and quality audits",
      "Coordinates with architects, engineers, surveyors and local authorities on permitting",
      "Ensures all deliverables comply with building codes, environmental regulations and client specifications",
    ],
    salaries: [
      {
        countryCode: "CA",
        countryLabel: "Canada",
        currency: "CAD",
        low: 78000,
        median: 97000,
        high: 128000,
        period: "year",
        sourceLabel: "Statistics Canada NOC wage data (Job Bank)",
        sourceUrl: "https://www.jobbank.gc.ca/trend-analysis/wages",
      },
      {
        countryCode: "US",
        countryLabel: "United States",
        currency: "USD",
        low: 80000,
        median: 110000,
        high: 148000,
        period: "year",
        sourceLabel: "BLS occupational employment statistics (Construction Managers)",
        sourceUrl: "https://www.bls.gov/oes/current/oes119032.htm",
      },
    ],
    demand: [
      {
        countryCode: "AU",
        countryLabel: "Australia",
        rating: "Shortage",
        note: "Construction Project Manager is rated in national shortage for 2025.",
        sourceLabel: "JSA Occupation Shortage List 2025",
        sourceUrl: "https://www.jobsandskills.gov.au/",
        regionRatings: {
          NSW: "S",
          VIC: "S",
          QLD: "S",
          SA: "S",
          WA: "S",
          TAS: "S",
          NT: "S",
          ACT: "S",
        },
      },
      {
        countryCode: "CA",
        countryLabel: "Canada",
        rating: "Strong",
        note: "Construction managers rated 4/5 (strong shortage risk) per COPS 2024–2033.",
        sourceLabel: "ESDC COPS 2024–2033 Employment Outlook",
        sourceUrl: "https://www.jobbank.gc.ca/trend-analysis",
      },
      {
        countryCode: "US",
        countryLabel: "United States",
        rating: "HighDemand",
        note: "Strong shortage signal averaging ~88 across 50+ states.",
        sourceLabel: "BLS shortage score data by state",
        sourceUrl: "https://www.bls.gov",
      },
    ],
    sources: [
      { label: "JSA Occupation Shortage List 2025 — Construction Project Manager", url: "https://www.jobsandskills.gov.au/" },
      { label: "Job Bank — Construction Manager wages", url: "https://www.jobbank.gc.ca/trend-analysis/wages" },
      { label: "BLS — Construction Managers occupational outlook", url: "https://www.bls.gov/ooh/architecture-and-engineering/construction-managers.htm" },
    ],
  },
  {
    id: "teacher-primary-secondary",
    categoryId: "education",
    label: "Primary & Secondary School Teacher",
    labelKo: "초·중등 교사",
    overview: {
      en: "Plans, develops and delivers instructional programs to students in primary and secondary schools. Teachers create lesson plans, assess student progress, manage classrooms, and collaborate with colleagues and parents to support student learning and development.",
      ko: "초등 및 중등학교에서 학생에게 교수 프로그램을 계획·개발·지원합니다. 수업 계획을 작성하고 학생의 진전을 평가하며, 교실을 관리하고 동료 및 학부모와 협력하여 학생의 학습과 발달을 지원합니다.",
    },
    registration: {
      en: "Teaching licensure or certification is required in all three countries. In Australia this means provisional/registered teacher certification through the state teachers' registration board; in Canada a provincial teaching certificate; in the US a state-issued teaching license.",
      ko: "세 국가 모두에서 교사 면허 또는 자격증이 필요합니다. 호주는 주별 교사 등록 위원회에서 provisional/registered teacher certification을, 캐나다는 주별 teaching certificate를, 미국은 주별 teaching license를 발급합니다.",
    },
    mainTasks: [
      "Develops lesson plans and instructional materials aligned with curriculum standards",
      "Delivers lectures, demonstrations and interactive lessons to classes of varying sizes",
      "Assesses student learning through assignments, tests and ongoing formative assessment",
      "Manages classroom behaviour and creates a positive, inclusive learning environment",
      "Differentiates instruction to meet the needs of diverse learners, including ESL students",
      "Communicates regularly with parents, guardians and school administration",
      "Participates in professional development, staff meetings and curriculum review",
    ],
    salaries: [
      {
        countryCode: "CA",
        countryLabel: "Canada",
        currency: "CAD",
        low: 52000,
        median: 72800,
        high: 96000,
        period: "year",
        sourceLabel: "Labour Force Survey",
        sourceUrl: "https://www.jobbank.gc.ca/trend-analysis/wages",
      },
      {
        countryCode: "US",
        countryLabel: "United States",
        currency: "USD",
        low: 45000,
        median: 77530,
        high: 105000,
        period: "year",
        sourceLabel: "BLS occupational employment statistics (Elementary School Teachers)",
        sourceUrl: "https://www.bls.gov/oes/current/oes252011.htm",
      },
    ],
    demand: [
      {
        countryCode: "AU",
        countryLabel: "Australia",
        rating: "Shortage",
        note: "Early Childhood Teacher and Primary School Teacher are both rated in national shortage for 2025.",
        sourceLabel: "JSA Occupation Shortage List 2025",
        sourceUrl: "https://www.jobsandskills.gov.au/",
        regionRatings: {
          NSW: "S",
          VIC: "S",
          QLD: "S",
          SA: "S",
          WA: "S",
          TAS: "S",
          NT: "S",
          ACT: "S",
        },
      },
      {
        countryCode: "CA",
        countryLabel: "Canada",
        rating: "Strong",
        note: "Secondary school teachers (rating 4) and elementary/kindergarten teachers (rating 4) per COPS 2024–2033.",
        sourceLabel: "ESDC COPS 2024–2033 Employment Outlook",
        sourceUrl: "https://www.jobbank.gc.ca/trend-analysis",
      },
      {
        countryCode: "US",
        countryLabel: "United States",
        rating: "HighDemand",
        note: "Elementary school teacher shortage signal averaging ~79 across states; demand is strong and consistent nationwide.",
        sourceLabel: "BLS shortage score data by state",
        sourceUrl: "https://www.bls.gov",
      },
    ],
    sources: [
      { label: "JSA Occupation Shortage List 2025 — Primary & Secondary Teachers", url: "https://www.jobsandskills.gov.au/" },
      { label: "Job Bank — Teacher wages", url: "https://www.jobbank.gc.ca/trend-analysis/wages" },
      { label: "BLS — Elementary School Teachers occupational outlook", url: "https://www.bls.gov/ooh/education-training-and-library/elementary-school-teachers.htm" },
      { label: "SEEK — Teacher jobs AU", url: "https://www.seek.com.au/teacher-jobs" },
    ],
  },
]

export function getOccupationDetail(id: string): OccupationDetail | undefined {
  return OCCUPATION_DETAILS.find((detail) => detail.id === id)
}
