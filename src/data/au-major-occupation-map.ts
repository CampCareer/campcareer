// AU Major ↔ Occupation mapping for the selectable AU STUDY_CONCEPTS.
// Each concept maps to a cluster of OSCA 2024 codes (occupations_au) and
// ANZSCO 4-digit unit groups (for outlook/salary lookups).
//
// Sources:
//   - OSCA 2024: ABS Occupation Standard Classification for Australia
//   - ANZSCO v1.3: Australian and New Zealand Standard Classification of Occupations
//   - JSA Training Occupation Pathways: qualification → occupation links
//   - ASCED Broad Field: education field → course mapping

export interface AuConceptOccupations {
  /** STUDY_CONCEPT id — must match study-concepts.ts exactly */
  conceptId: string
  /** Reviewed OSCA 2024 occupation codes used by occupations_au and JSA OSL. */
  oscaCodes: string[]
  /** ANZSCO 4-digit unit groups (for outlook_au, salary lookups) */
  anzsco4Groups: string[]
  /** ASCED Broad Field codes (for courses_au.broad_field joins) */
  broadFields: string[]
  /** Qualification types available in Australia */
  qualificationTypes: string[]
  /** Typical study duration range in years */
  durationYears: { min: number; max: number }
  /** Representative occupation labels for UI display */
  representativeOccupations: Array<{ oscaCode: string; label: string; labelKo: string }>
}

const CONCEPT_METADATA: AuConceptOccupations[] = [
  // ── Technology ─────────────────────────────────────────────────────────────
  {
    conceptId: "computer-science",
    oscaCodes: ["261313", "261312", "262131", "262132"],
    anzsco4Groups: ["2613", "2621"],
    broadFields: ["02 - Information Technology"],
    qualificationTypes: ["Bachelor", "Master", "Graduate Diploma"],
    durationYears: { min: 3, max: 2 },
    representativeOccupations: [
      { oscaCode: "261313", label: "Software Developer", labelKo: "소프트웨어 개발자" },
      { oscaCode: "261312", label: "Developer Programmer", labelKo: "개발 프로그래머" },
      { oscaCode: "262131", label: "Database Administrator", labelKo: "데이터베이스 관리자" },
      { oscaCode: "262132", label: "Systems Administrator", labelKo: "시스템 관리자" },
    ],
  },
  {
    conceptId: "data-analytics",
    oscaCodes: ["261399", "224999", "224131"],
    anzsco4Groups: ["2613", "2249", "2241"],
    broadFields: ["02 - Information Technology", "08 - Management and Commerce"],
    qualificationTypes: ["Bachelor", "Master", "Graduate Diploma"],
    durationYears: { min: 3, max: 2 },
    representativeOccupations: [
      { oscaCode: "261399", label: "ICT Systems Designer", labelKo: "ICT 시스템 설계자" },
      { oscaCode: "224999", label: "Information and Organisation Professional nec", labelKo: "정보·조직 전문가" },
      { oscaCode: "224131", label: "Data Analyst", labelKo: "데이터 분석가" },
    ],
  },
  {
    conceptId: "cybersecurity",
    oscaCodes: ["271131", "271132", "271133", "271134", "271135", "271136"],
    anzsco4Groups: ["2621"],
    broadFields: ["02 - Information Technology"],
    qualificationTypes: ["Bachelor", "Master", "Graduate Certificate"],
    durationYears: { min: 3, max: 2 },
    representativeOccupations: [
      { oscaCode: "271133", label: "Cyber Security Analyst", labelKo: "사이버 보안 분석가" },
      { oscaCode: "271134", label: "Cyber Security Architect", labelKo: "사이버 보안 아키텍트" },
      { oscaCode: "271135", label: "Cyber Security Engineer", labelKo: "사이버 보안 엔지니어" },
    ],
  },

  // ── Health ──────────────────────────────────────────────────────────────────
  {
    conceptId: "nursing",
    oscaCodes: ["254415", "254418", "254425", "254499"],
    anzsco4Groups: ["2544"],
    broadFields: ["06 - Health"],
    qualificationTypes: ["Bachelor", "Diploma", "Master"],
    durationYears: { min: 3, max: 3 },
    representativeOccupations: [
      { oscaCode: "254415", label: "Registered Nurse", labelKo: "간호사" },
      { oscaCode: "254418", label: "Enrolled Nurse", labelKo: "등록간호보조" },
      { oscaCode: "254425", label: "Midwife", labelKo: "조산사" },
    ],
  },
  {
    conceptId: "aged-care",
    oscaCodes: ["423331", "423332", "423333"],
    anzsco4Groups: ["4233"],
    broadFields: ["09 - Society and Culture", "06 - Health"],
    qualificationTypes: ["Certificate III", "Certificate IV", "Diploma"],
    durationYears: { min: 1, max: 2 },
    representativeOccupations: [
      { oscaCode: "423331", label: "Aged or Disabled Carer", labelKo: "노인·장애인 돌봄원" },
      { oscaCode: "423332", label: "Community Worker", labelKo: "커뮤니티 워커" },
      { oscaCode: "423333", label: "Disability Support Worker", labelKo: "장애인 지원원" },
    ],
  },
  {
    conceptId: "allied-health",
    oscaCodes: ["252331", "252431", "252531", "252931"],
    anzsco4Groups: ["2523", "2524", "2525", "2529"],
    broadFields: ["06 - Health"],
    qualificationTypes: ["Bachelor", "Master", "Doctorate"],
    durationYears: { min: 4, max: 4 },
    representativeOccupations: [
      { oscaCode: "252331", label: "Physiotherapist", labelKo: "물리치료사" },
      { oscaCode: "252431", label: "Occupational Therapist", labelKo: "작업치료사" },
      { oscaCode: "252531", label: "Rehabilitation Therapist", labelKo: "재활치료사" },
    ],
  },
  {
    conceptId: "dental",
    oscaCodes: ["269232", "269231", "269131", "269133"],
    anzsco4Groups: ["2692", "2691"],
    broadFields: ["06 - Health"],
    qualificationTypes: ["Bachelor", "Doctorate", "Diploma"],
    durationYears: { min: 3, max: 5 },
    representativeOccupations: [
      { oscaCode: "269232", label: "Dentist", labelKo: "치과의사" },
      { oscaCode: "269131", label: "Dental Hygienist", labelKo: "치과위생사" },
      { oscaCode: "269133", label: "Oral Health Therapist", labelKo: "구강건강치료사" },
    ],
  },
  {
    conceptId: "psychology",
    oscaCodes: ["272331", "272332", "272333"],
    anzsco4Groups: ["2723"],
    broadFields: ["09 - Society and Culture", "06 - Health"],
    qualificationTypes: ["Bachelor", "Master", "Doctorate"],
    durationYears: { min: 4, max: 5 },
    representativeOccupations: [
      { oscaCode: "272331", label: "Psychologist", labelKo: "심리학자" },
      { oscaCode: "272332", label: "Clinical Psychologist", labelKo: "임상심리학자" },
      { oscaCode: "272333", label: "Organisational Psychologist", labelKo: "산업심리학자" },
    ],
  },
  {
    conceptId: "paramedic-emergency",
    oscaCodes: ["269432", "269433"],
    anzsco4Groups: ["2694"],
    broadFields: ["06 - Health"],
    qualificationTypes: ["Bachelor", "Diploma"],
    durationYears: { min: 3, max: 3 },
    representativeOccupations: [
      { oscaCode: "269432", label: "Paramedic", labelKo: "구급대원" },
      { oscaCode: "269433", label: "Ambulance Officer", labelKo: "응급구조대원" },
    ],
  },

  // ── Engineering ─────────────────────────────────────────────────────────────
  {
    conceptId: "engineering",
    oscaCodes: ["233999", "233911", "233912"],
    anzsco4Groups: ["2339"],
    broadFields: ["04 - Engineering and Related Technologies"],
    qualificationTypes: ["Bachelor", "Master"],
    durationYears: { min: 4, max: 2 },
    representativeOccupations: [
      { oscaCode: "233999", label: "Engineering Professional nec", labelKo: "공학 전문가" },
      { oscaCode: "233911", label: "Engineering Manager", labelKo: "공학 관리자" },
      { oscaCode: "233912", label: "Naval Architect", labelKo: "선박설계사" },
    ],
  },
  {
    conceptId: "civil-engineering",
    oscaCodes: ["233231", "133631", "233232"],
    anzsco4Groups: ["2332", "1336"],
    broadFields: ["04 - Engineering and Related Technologies"],
    qualificationTypes: ["Bachelor", "Master"],
    durationYears: { min: 4, max: 2 },
    representativeOccupations: [
      { oscaCode: "233231", label: "Civil Engineer", labelKo: "토목 엔지니어" },
      { oscaCode: "133631", label: "Construction Manager", labelKo: "건설 관리자" },
      { oscaCode: "233232", label: "Quantity Surveyor", labelKo: "도량형사" },
    ],
  },
  {
    conceptId: "mechanical-engineering",
    oscaCodes: ["233531", "233532", "233533"],
    anzsco4Groups: ["2335"],
    broadFields: ["04 - Engineering and Related Technologies"],
    qualificationTypes: ["Bachelor", "Master"],
    durationYears: { min: 4, max: 2 },
    representativeOccupations: [
      { oscaCode: "233531", label: "Mechanical Engineer", labelKo: "기계 엔지니어" },
      { oscaCode: "233532", label: "Production Engineer", labelKo: "제조 엔지니어" },
      { oscaCode: "233533", label: "Engineering Technologist", labelKo: "공학기술자" },
    ],
  },
  {
    conceptId: "mining-resources",
    oscaCodes: ["243631", "243632", "312931"],
    anzsco4Groups: ["2436", "3129"],
    broadFields: ["04 - Engineering and Related Technologies"],
    qualificationTypes: ["Bachelor", "Master"],
    durationYears: { min: 4, max: 2 },
    representativeOccupations: [
      { oscaCode: "243631", label: "Mining Engineer", labelKo: "광업 엔지니어" },
      { oscaCode: "243632", label: "Petroleum Engineer", labelKo: "석유 엔지니어" },
      { oscaCode: "312931", label: "Driller", labelKo: "시추공" },
    ],
  },

  // ── Business ────────────────────────────────────────────────────────────────
  {
    conceptId: "business-analytics",
    oscaCodes: ["224131", "224999", "224231"],
    anzsco4Groups: ["2241", "2249", "2242"],
    broadFields: ["08 - Management and Commerce"],
    qualificationTypes: ["Bachelor", "Master"],
    durationYears: { min: 3, max: 2 },
    representativeOccupations: [
      { oscaCode: "224131", label: "Data Analyst", labelKo: "데이터 분석가" },
      { oscaCode: "224231", label: "Management Consultant", labelKo: "경영컨설턴트" },
      { oscaCode: "224999", label: "Information and Organisation Professional nec", labelKo: "정보·조직 전문가" },
    ],
  },
  {
    conceptId: "accounting",
    oscaCodes: ["221131", "221231", "221232", "221233"],
    anzsco4Groups: ["2211", "2212"],
    broadFields: ["08 - Management and Commerce"],
    qualificationTypes: ["Bachelor", "Master", "Graduate Diploma"],
    durationYears: { min: 3, max: 2 },
    representativeOccupations: [
      { oscaCode: "221131", label: "Accountant", labelKo: "회계사" },
      { oscaCode: "221231", label: "External Auditor", labelKo: "외부감사인" },
      { oscaCode: "221233", label: "Taxation Accountant", labelKo: "세무회계사" },
    ],
  },
  {
    conceptId: "law",
    oscaCodes: ["281331", "281332", "281333"],
    anzsco4Groups: ["2813"],
    broadFields: ["09 - Society and Culture"],
    qualificationTypes: ["Bachelor (LLB)", "Juris Doctor", "Graduate Diploma"],
    durationYears: { min: 4, max: 3 },
    representativeOccupations: [
      { oscaCode: "281331", label: "Solicitor", labelKo: "변호사" },
      { oscaCode: "281332", label: "Barrister", labelKo: "변호사(소송)" },
      { oscaCode: "281333", label: "Judicial Member", labelKo: "판사" },
    ],
  },

  // ── Education ───────────────────────────────────────────────────────────────
  {
    conceptId: "early-childhood",
    oscaCodes: ["241131", "241132"],
    anzsco4Groups: ["2411"],
    broadFields: ["07 - Education", "09 - Society and Culture"],
    qualificationTypes: ["Bachelor", "Diploma", "Certificate III"],
    durationYears: { min: 3, max: 1 },
    representativeOccupations: [
      { oscaCode: "241131", label: "Early Childhood Teacher", labelKo: "유아교사" },
      { oscaCode: "241132", label: "Early Childhood Centre Manager", labelKo: "유아교육기관 관리자" },
    ],
  },
  {
    conceptId: "primary-secondary-education",
    oscaCodes: ["241231", "241331"],
    anzsco4Groups: ["2412", "2413"],
    broadFields: ["07 - Education"],
    qualificationTypes: ["Bachelor", "Master of Teaching"],
    durationYears: { min: 4, max: 2 },
    representativeOccupations: [
      { oscaCode: "241231", label: "Primary School Teacher", labelKo: "초등교사" },
      { oscaCode: "241331", label: "Secondary School Teacher", labelKo: "중등교사" },
    ],
  },
  {
    conceptId: "social-work",
    oscaCodes: ["272631", "411731", "272633", "272632"],
    anzsco4Groups: ["2726", "4117"],
    broadFields: ["09 - Society and Culture"],
    qualificationTypes: ["Bachelor", "Master"],
    durationYears: { min: 4, max: 2 },
    representativeOccupations: [
      { oscaCode: "272631", label: "Social Worker", labelKo: "사회복지사" },
      { oscaCode: "411731", label: "Youth Worker", labelKo: "청소년 지도사" },
      { oscaCode: "272633", label: "Counsellor", labelKo: "상담사" },
    ],
  },
  {
    conceptId: "sport-fitness",
    oscaCodes: ["462434", "462442", "451131", "462438"],
    anzsco4Groups: ["4624", "4511"],
    broadFields: ["07 - Education", "06 - Health"],
    qualificationTypes: ["Bachelor", "Diploma", "Certificate IV"],
    durationYears: { min: 3, max: 2 },
    representativeOccupations: [
      { oscaCode: "462434", label: "Gymnastics Coach", labelKo: "체조 코치" },
      { oscaCode: "462442", label: "Swimming Instructor", labelKo: "수영 강사" },
      { oscaCode: "451131", label: "Sportsperson", labelKo: "스포츠선수" },
    ],
  },

  // ── Trades ──────────────────────────────────────────────────────────────────
  {
    conceptId: "carpentry",
    oscaCodes: ["372132"],
    anzsco4Groups: ["3312"],
    broadFields: ["04 - Engineering and Related Technologies"],
    qualificationTypes: ["Certificate III", "Certificate IV"],
    durationYears: { min: 4, max: 4 },
    representativeOccupations: [
      { oscaCode: "372132", label: "Carpenter", labelKo: "목수" },
    ],
  },
  {
    conceptId: "wall-floor-tiling",
    oscaCodes: ["362431"],
    anzsco4Groups: ["3334"],
    broadFields: ["04 - Engineering and Related Technologies"],
    qualificationTypes: ["Certificate III"],
    durationYears: { min: 3, max: 3 },
    representativeOccupations: [
      { oscaCode: "362431", label: "Wall and Floor Tiler", labelKo: "타일공" },
    ],
  },
  {
    conceptId: "electrical-trade",
    oscaCodes: ["381231", "381232"],
    anzsco4Groups: ["3411"],
    broadFields: ["04 - Engineering and Related Technologies"],
    qualificationTypes: ["Certificate III", "Certificate IV"],
    durationYears: { min: 4, max: 4 },
    representativeOccupations: [
      { oscaCode: "381231", label: "Electrician", labelKo: "전기공" },
      { oscaCode: "381232", label: "Electrical Trades Worker", labelKo: "전기기술자" },
    ],
  },
  {
    conceptId: "plumbing",
    oscaCodes: ["334131", "334132"],
    anzsco4Groups: ["3341"],
    broadFields: ["04 - Engineering and Related Technologies"],
    qualificationTypes: ["Certificate III", "Certificate IV"],
    durationYears: { min: 4, max: 4 },
    representativeOccupations: [
      { oscaCode: "334131", label: "Plumber", labelKo: "배관공" },
      { oscaCode: "334132", label: "Plumbing Technician", labelKo: "배관기술자" },
    ],
  },
  {
    conceptId: "welding",
    oscaCodes: ["323131", "323132", "323133"],
    anzsco4Groups: ["3223", "3231"],
    broadFields: ["04 - Engineering and Related Technologies"],
    qualificationTypes: ["Certificate III", "Certificate IV"],
    durationYears: { min: 3, max: 3 },
    representativeOccupations: [
      { oscaCode: "323131", label: "Welder", labelKo: "용접공" },
      { oscaCode: "323132", label: "Metal Fabricator", labelKo: "금속가공원" },
      { oscaCode: "323133", label: "Boilermaker", labelKo: "제관공" },
    ],
  },
  {
    conceptId: "bricklaying",
    oscaCodes: ["371131", "371132"],
    anzsco4Groups: ["3311"],
    broadFields: ["04 - Engineering and Related Technologies"],
    qualificationTypes: ["Certificate III", "Certificate IV"],
    durationYears: { min: 3, max: 3 },
    representativeOccupations: [
      { oscaCode: "371131", label: "Bricklayer", labelKo: "조적공" },
      { oscaCode: "371132", label: "Stonemason", labelKo: "석공" },
    ],
  },
  {
    conceptId: "hvac",
    oscaCodes: ["382131"],
    anzsco4Groups: ["3421"],
    broadFields: ["04 - Engineering and Related Technologies"],
    qualificationTypes: ["Certificate III", "Certificate IV"],
    durationYears: { min: 4, max: 4 },
    representativeOccupations: [
      { oscaCode: "382131", label: "Air Conditioning and Refrigeration Technician", labelKo: "냉난방공조 기술자" },
    ],
  },

  // ── Design ──────────────────────────────────────────────────────────────────
  {
    conceptId: "architecture",
    oscaCodes: ["232131", "312131", "232132"],
    anzsco4Groups: ["2321", "3121"],
    broadFields: ["04 - Engineering and Related Technologies", "10 - Creative Arts"],
    qualificationTypes: ["Bachelor", "Master", "Diploma"],
    durationYears: { min: 5, max: 2 },
    representativeOccupations: [
      { oscaCode: "232131", label: "Architect", labelKo: "건축가" },
      { oscaCode: "312131", label: "Architectural Draftsperson", labelKo: "건축설계기사" },
      { oscaCode: "232132", label: "Landscape Architect", labelKo: "조경건축가" },
    ],
  },
  {
    conceptId: "design-media",
    oscaCodes: ["261231", "261232", "261233"],
    anzsco4Groups: ["2612"],
    broadFields: ["10 - Creative Arts", "02 - Information Technology"],
    qualificationTypes: ["Bachelor", "Diploma"],
    durationYears: { min: 3, max: 3 },
    representativeOccupations: [
      { oscaCode: "261231", label: "Web Designer", labelKo: "웹 디자이너" },
      { oscaCode: "261232", label: "Graphic Designer", labelKo: "그래픽 디자이너" },
      { oscaCode: "261233", label: "Multimedia Designer", labelKo: "멀티미디어 디자이너" },
    ],
  },
  {
    conceptId: "photography-film",
    oscaCodes: ["212331", "212431", "212332"],
    anzsco4Groups: ["2123", "2124"],
    broadFields: ["10 - Creative Arts"],
    qualificationTypes: ["Bachelor", "Diploma"],
    durationYears: { min: 3, max: 3 },
    representativeOccupations: [
      { oscaCode: "212331", label: "Photographer", labelKo: "촬영감독" },
      { oscaCode: "212431", label: "Film and Video Director", labelKo: "영화·영상 감독" },
      { oscaCode: "212332", label: "Film and Video Editor", labelKo: "영상 편집자" },
    ],
  },

  // ── Environment ─────────────────────────────────────────────────────────────
  {
    conceptId: "environmental-science",
    oscaCodes: ["234331", "234231", "234332"],
    anzsco4Groups: ["2343", "2342"],
    broadFields: ["05 - Architecture and Built Environment", "01 - Natural and Physical Sciences"],
    qualificationTypes: ["Bachelor", "Master"],
    durationYears: { min: 3, max: 2 },
    representativeOccupations: [
      { oscaCode: "234331", label: "Environmental Scientist", labelKo: "환경과학자" },
      { oscaCode: "234231", label: "Conservation Officer", labelKo: "자연보존전문가" },
      { oscaCode: "234332", label: "Environmental Research Scientist", labelKo: "환경연구과학자" },
    ],
  },
  {
    conceptId: "agriculture",
    oscaCodes: ["212331", "212332", "212333"],
    anzsco4Groups: ["2123"],
    broadFields: ["06 - Agriculture, Environmental and Related Studies"],
    qualificationTypes: ["Bachelor", "Diploma", "Certificate III"],
    durationYears: { min: 3, max: 2 },
    representativeOccupations: [
      { oscaCode: "212331", label: "Agricultural Scientist", labelKo: "농업과학자" },
      { oscaCode: "212332", label: "Agronomist", labelKo: "농업기술자" },
      { oscaCode: "212333", label: "Horticulturist", labelKo: "원예사" },
    ],
  },
  {
    conceptId: "veterinary",
    oscaCodes: ["269531", "269532"],
    anzsco4Groups: ["2695"],
    broadFields: ["06 - Agriculture, Environmental and Related Studies"],
    qualificationTypes: ["Bachelor (DVM)", "Diploma"],
    durationYears: { min: 5, max: 2 },
    representativeOccupations: [
      { oscaCode: "269531", label: "Veterinarian", labelKo: "수의사" },
      { oscaCode: "269532", label: "Veterinary Nurse", labelKo: "수의간호사" },
    ],
  },

  // ── Hospitality ─────────────────────────────────────────────────────────────
  {
    conceptId: "hospitality-management",
    oscaCodes: ["141131", "141132", "141133"],
    anzsco4Groups: ["1411"],
    broadFields: ["08 - Management and Commerce"],
    qualificationTypes: ["Bachelor", "Diploma"],
    durationYears: { min: 3, max: 2 },
    representativeOccupations: [
      { oscaCode: "141131", label: "Hotel or Motel Manager", labelKo: "호텔·모텔 관리자" },
      { oscaCode: "141132", label: "Restaurant Manager", labelKo: "레스토랑 관리자" },
      { oscaCode: "141133", label: "Licensed Club Manager", labelKo: "면허클럽 관리자" },
    ],
  },
  {
    conceptId: "culinary-arts",
    oscaCodes: ["322331", "322131", "322231"],
    anzsco4Groups: ["3223", "3221", "3222"],
    broadFields: ["08 - Management and Commerce", "11 - Food, Hospitality and Personal Services"],
    qualificationTypes: ["Certificate III", "Certificate IV", "Diploma"],
    durationYears: { min: 2, max: 3 },
    representativeOccupations: [
      { oscaCode: "322331", label: "Cook", labelKo: "조리사" },
      { oscaCode: "322131", label: "Baker", labelKo: "제빵사" },
      { oscaCode: "322231", label: "Butcher", labelKo: "정육사" },
    ],
  },
  {
    conceptId: "beauty-wellness",
    oscaCodes: ["461131", "461132", "392132", "392131"],
    anzsco4Groups: ["4611", "3921"],
    broadFields: ["09 - Society and Culture", "11 - Food, Hospitality and Personal Services"],
    qualificationTypes: ["Certificate III", "Certificate IV", "Diploma"],
    durationYears: { min: 1, max: 2 },
    representativeOccupations: [
      { oscaCode: "461131", label: "Beauty Therapist", labelKo: "미용사" },
      { oscaCode: "461132", label: "Dermal Therapist", labelKo: "피부치료사" },
      { oscaCode: "392132", label: "Hairdresser", labelKo: "미용사(헤어)" },
    ],
  },

  // ── Transport ───────────────────────────────────────────────────────────────
  {
    conceptId: "automotive",
    oscaCodes: ["351131", "351231"],
    anzsco4Groups: ["3212"],
    broadFields: ["04 - Engineering and Related Technologies"],
    qualificationTypes: ["Certificate III", "Certificate IV"],
    durationYears: { min: 4, max: 4 },
    representativeOccupations: [
      { oscaCode: "351131", label: "Automotive Technician", labelKo: "자동차 정비사" },
      { oscaCode: "351231", label: "Automotive Electrician", labelKo: "자동차 전기 정비사" },
    ],
  },
  {
    conceptId: "aviation",
    oscaCodes: ["231131", "231132", "231133", "261231"],
    anzsco4Groups: ["2311", "2612"],
    broadFields: ["04 - Engineering and Related Technologies"],
    qualificationTypes: ["Bachelor", "Diploma", "Certificate IV"],
    durationYears: { min: 3, max: 3 },
    representativeOccupations: [
      { oscaCode: "231131", label: "Aircraft Pilot", labelKo: "항공기 조종사" },
      { oscaCode: "231132", label: "Flying Instructor", labelKo: "비행 강사" },
      { oscaCode: "231133", label: "Air Transport Professional", labelKo: "항공운송 전문가" },
    ],
  },
  {
    conceptId: "maritime",
    oscaCodes: ["313431", "313435", "313436", "313432"],
    anzsco4Groups: ["3134"],
    broadFields: ["04 - Engineering and Related Technologies"],
    qualificationTypes: ["Bachelor", "Diploma", "Certificate III"],
    durationYears: { min: 3, max: 4 },
    representativeOccupations: [
      { oscaCode: "313431", label: "Marine Engineer", labelKo: "기관사" },
      { oscaCode: "313435", label: "Ship's Master", labelKo: "선장" },
      { oscaCode: "313436", label: "Ship's Officer", labelKo: "항해사" },
    ],
  },

  // ── Health (additional) ──────────────────────────────────────────────────────
  {
    conceptId: "medicine",
    oscaCodes: ["253111", "253112"],
    anzsco4Groups: ["2531"],
    broadFields: ["06 - Health"],
    qualificationTypes: ["Bachelor of Medicine", "Doctor of Medicine"],
    durationYears: { min: 4, max: 7 },
    representativeOccupations: [
      { oscaCode: "253111", label: "General Practitioner", labelKo: "일반의" },
      { oscaCode: "253112", label: "Specialist Physician", labelKo: "전문의" },
    ],
  },
  {
    conceptId: "pharmacy",
    oscaCodes: ["251511"],
    anzsco4Groups: ["2515"],
    broadFields: ["06 - Health"],
    qualificationTypes: ["Bachelor of Pharmacy", "Master of Pharmacy"],
    durationYears: { min: 4, max: 4 },
    representativeOccupations: [
      { oscaCode: "251511", label: "Pharmacist", labelKo: "약사" },
    ],
  },

  // ── Business (additional) ────────────────────────────────────────────────────
  {
    conceptId: "finance",
    oscaCodes: ["222311", "222211"],
    anzsco4Groups: ["2223", "2222"],
    broadFields: ["08 - Management and Commerce"],
    qualificationTypes: ["Bachelor", "Master"],
    durationYears: { min: 3, max: 2 },
    representativeOccupations: [
      { oscaCode: "222311", label: "Financial Investment Adviser", labelKo: "재무투자자문가" },
      { oscaCode: "222211", label: "Financial Dealer", labelKo: "금융딜러" },
    ],
  },
  {
    conceptId: "marketing",
    oscaCodes: ["225111"],
    anzsco4Groups: ["2251"],
    broadFields: ["08 - Management and Commerce"],
    qualificationTypes: ["Bachelor", "Master"],
    durationYears: { min: 3, max: 2 },
    representativeOccupations: [
      { oscaCode: "225111", label: "Advertising Specialist", labelKo: "광고기획자" },
    ],
  },
  {
    conceptId: "international-business",
    oscaCodes: ["224711"],
    anzsco4Groups: ["2247"],
    broadFields: ["08 - Management and Commerce"],
    qualificationTypes: ["Bachelor", "Master"],
    durationYears: { min: 3, max: 2 },
    representativeOccupations: [
      { oscaCode: "224711", label: "Management Consultant", labelKo: "경영컨설턴트" },
    ],
  },
  {
    conceptId: "commerce",
    oscaCodes: ["224711", "224999"],
    anzsco4Groups: ["2247", "2249"],
    broadFields: ["08 - Management and Commerce"],
    qualificationTypes: ["Bachelor"],
    durationYears: { min: 3, max: 3 },
    representativeOccupations: [
      { oscaCode: "224711", label: "Management Consultant", labelKo: "경영컨설턴트" },
      { oscaCode: "224999", label: "Information and Organisation Professional nec", labelKo: "정보·조직 전문가" },
    ],
  },

  // ── Education (additional) ───────────────────────────────────────────────────
  {
    conceptId: "tesol",
    oscaCodes: ["249299"],
    anzsco4Groups: ["2492"],
    broadFields: ["07 - Education"],
    qualificationTypes: ["Bachelor", "Graduate Diploma"],
    durationYears: { min: 3, max: 1 },
    representativeOccupations: [
      { oscaCode: "249299", label: "Teacher nec", labelKo: "교사" },
    ],
  },
  {
    conceptId: "community-welfare",
    oscaCodes: ["272611", "411711"],
    anzsco4Groups: ["2726", "4117"],
    broadFields: ["09 - Society and Culture"],
    qualificationTypes: ["Bachelor"],
    durationYears: { min: 3, max: 3 },
    representativeOccupations: [
      { oscaCode: "272611", label: "Social Worker", labelKo: "사회복지사" },
      { oscaCode: "411711", label: "Community Worker", labelKo: "커뮤니티워커" },
    ],
  },

  // ── Engineering (additional) ─────────────────────────────────────────────────
  {
    conceptId: "electrical-engineering",
    oscaCodes: ["233311"],
    anzsco4Groups: ["2333"],
    broadFields: ["04 - Engineering and Related Technologies"],
    qualificationTypes: ["Bachelor", "Master"],
    durationYears: { min: 4, max: 2 },
    representativeOccupations: [
      { oscaCode: "233311", label: "Electrical Engineer", labelKo: "전기공학자" },
    ],
  },

  // ── Design (additional) ──────────────────────────────────────────────────────
  {
    conceptId: "interior-design",
    oscaCodes: ["232511"],
    anzsco4Groups: ["2325"],
    broadFields: ["10 - Architecture and Planning"],
    qualificationTypes: ["Bachelor", "Diploma"],
    durationYears: { min: 3, max: 4 },
    representativeOccupations: [
      { oscaCode: "232511", label: "Interior Designer", labelKo: "인테리어디자이너" },
    ],
  },
]

type VerifiedConceptEvidence = Pick<AuConceptOccupations, "oscaCodes" | "anzsco4Groups" | "broadFields">

// These identifiers were checked against the local ABS OSCA profile snapshot,
// JSA Occupation Shortage List, CSOL correspondence, and CRICOS broad fields.
// The older editorial entries above retain study-duration and qualification copy.
const VERIFIED_CONCEPT_EVIDENCE: Record<string, VerifiedConceptEvidence> = {
  "computer-science": { oscaCodes: ["273333"], anzsco4Groups: [], broadFields: ["02 - Information Technology"] },
  "data-analytics": { oscaCodes: ["223231", "223232", "223233", "273333"], anzsco4Groups: [], broadFields: ["02 - Information Technology", "08 - Management and Commerce"] },
  cybersecurity: { oscaCodes: ["271132", "271133", "271134", "271135", "271136"], anzsco4Groups: ["2613", "2621"], broadFields: ["02 - Information Technology"] },
  nursing: { oscaCodes: ["265432", "265433", "265434", "265435", "265499"], anzsco4Groups: ["2544"], broadFields: ["06 - Health"] },
  "aged-care": { oscaCodes: ["421231", "421331"], anzsco4Groups: ["4231", "4233"], broadFields: ["06 - Health", "09 - Society and Culture"] },
  "allied-health": { oscaCodes: ["261135", "262331", "262431"], anzsco4Groups: ["2524", "2525", "2721"], broadFields: ["06 - Health"] },
  engineering: { oscaCodes: ["243999"], anzsco4Groups: ["2339"], broadFields: ["03 - Engineering and Related Technologies"] },
  "civil-engineering": { oscaCodes: ["243231", "243234", "243235"], anzsco4Groups: ["2332"], broadFields: ["03 - Engineering and Related Technologies"] },
  "mechanical-engineering": { oscaCodes: ["243532", "243937", "243533"], anzsco4Groups: ["2335", "2339"], broadFields: ["03 - Engineering and Related Technologies"] },
  "business-analytics": { oscaCodes: ["223231", "273232", "223432", "113299"], anzsco4Groups: ["2611"], broadFields: ["02 - Information Technology", "08 - Management and Commerce"] },
  accounting: { oscaCodes: ["211131", "211134", "211135", "211231"], anzsco4Groups: ["2211", "2212"], broadFields: ["08 - Management and Commerce"] },
  "early-childhood": { oscaCodes: ["251131", "431132"], anzsco4Groups: ["2411", "4211"], broadFields: ["07 - Education"] },
  carpentry: { oscaCodes: ["372132"], anzsco4Groups: ["3312"], broadFields: ["03 - Engineering and Related Technologies"] },
  "wall-floor-tiling": { oscaCodes: ["362431"], anzsco4Groups: ["3334"], broadFields: ["03 - Engineering and Related Technologies"] },
  "electrical-trade": { oscaCodes: ["381231"], anzsco4Groups: ["3411"], broadFields: ["03 - Engineering and Related Technologies"] },
  plumbing: { oscaCodes: ["363131", "363231", "363331"], anzsco4Groups: ["3341"], broadFields: ["03 - Engineering and Related Technologies"] },
  welding: { oscaCodes: ["331131", "331132", "331133"], anzsco4Groups: ["3223"], broadFields: ["03 - Engineering and Related Technologies"] },
  automotive: { oscaCodes: ["351131", "351231"], anzsco4Groups: ["3211", "3212"], broadFields: ["03 - Engineering and Related Technologies"] },
  "hospitality-management": { oscaCodes: ["161431", "161231", "161999"], anzsco4Groups: ["1411"], broadFields: ["08 - Management and Commerce"] },
  architecture: { oscaCodes: ["241131", "312131", "312132"], anzsco4Groups: ["3121"], broadFields: ["04 - Architecture and Building"] },
  "design-media": { oscaCodes: ["242131", "242132", "242133", "242331", "242332"], anzsco4Groups: [], broadFields: ["10 - Creative Arts"] },
  "environmental-science": { oscaCodes: ["244332", "244431", "244432"], anzsco4Groups: ["2343"], broadFields: ["01 - Natural and Physical Sciences", "05 - Agriculture, Environmental and Related Studies"] },
  agriculture: { oscaCodes: ["244131", "244132", "311131"], anzsco4Groups: ["2341", "3111"], broadFields: ["05 - Agriculture, Environmental and Related Studies"] },
  aviation: { oscaCodes: ["299131", "299133", "299134", "299199", "332131", "332132", "332133"], anzsco4Groups: ["2311", "3231"], broadFields: ["03 - Engineering and Related Technologies"] },
  "culinary-arts": { oscaCodes: ["321131", "322131", "322331", "322431"], anzsco4Groups: ["3511", "3513", "3514"], broadFields: ["11 - Food, Hospitality and Personal Services"] },
  "beauty-wellness": { oscaCodes: ["461131", "461132", "392132"], anzsco4Groups: ["3911", "4511"], broadFields: ["11 - Food, Hospitality and Personal Services"] },
  "social-work": { oscaCodes: ["261331", "411232", "411733", "261131"], anzsco4Groups: ["2725", "4115", "4117"], broadFields: ["09 - Society and Culture"] },
  dental: { oscaCodes: ["269232", "269131", "269133"], anzsco4Groups: ["2523", "4112"], broadFields: ["06 - Health"] },
  law: { oscaCodes: ["281131", "281331", "521234"], anzsco4Groups: ["2713"], broadFields: ["09 - Society and Culture"] },
  "sport-fitness": { oscaCodes: ["262232", "462131", "462434", "462442", "462438"], anzsco4Groups: ["4522", "4523"], broadFields: ["06 - Health", "09 - Society and Culture"] },
  bricklaying: { oscaCodes: ["371131", "371132"], anzsco4Groups: ["3311"], broadFields: ["03 - Engineering and Related Technologies"] },
  hvac: { oscaCodes: ["382131"], anzsco4Groups: ["3421"], broadFields: ["03 - Engineering and Related Technologies"] },
  maritime: { oscaCodes: ["313431", "313432", "313435", "313436"], anzsco4Groups: ["2312"], broadFields: ["03 - Engineering and Related Technologies"] },
  "mining-resources": { oscaCodes: ["243631", "243632"], anzsco4Groups: ["2336"], broadFields: ["03 - Engineering and Related Technologies"] },
  psychology: { oscaCodes: ["261231"], anzsco4Groups: ["2723"], broadFields: ["06 - Health", "09 - Society and Culture"] },
  "paramedic-emergency": { oscaCodes: ["269431", "269432"], anzsco4Groups: ["4111"], broadFields: ["06 - Health"] },
  veterinary: { oscaCodes: ["269531", "269532", "341231"], anzsco4Groups: ["2347", "3613"], broadFields: ["05 - Agriculture, Environmental and Related Studies", "06 - Health"] },
  "primary-secondary-education": { oscaCodes: ["251231", "251331"], anzsco4Groups: ["2412", "2413"], broadFields: ["07 - Education"] },
  "photography-film": { oscaCodes: ["391331", "231433", "231434", "231436", "231533", "391233"], anzsco4Groups: ["2123"], broadFields: ["10 - Creative Arts"] },
  medicine: { oscaCodes: ["264231", "264531", "264999"], anzsco4Groups: ["2531", "2539"], broadFields: ["06 - Health"] },
  pharmacy: { oscaCodes: ["263431", "263432"], anzsco4Groups: ["2515"], broadFields: ["06 - Health"] },
  finance: { oscaCodes: ["212131", "212231", "212332", "212333"], anzsco4Groups: [], broadFields: ["08 - Management and Commerce"] },
  marketing: { oscaCodes: ["221131", "221531", "221532", "221534"], anzsco4Groups: [], broadFields: ["08 - Management and Commerce"] },
  "international-business": { oscaCodes: ["133131"], anzsco4Groups: [], broadFields: ["08 - Management and Commerce"] },
  commerce: { oscaCodes: [], anzsco4Groups: [], broadFields: ["08 - Management and Commerce"] },
  tesol: { oscaCodes: ["259531"], anzsco4Groups: [], broadFields: ["07 - Education"] },
  "community-welfare": { oscaCodes: ["411231", "411232", "411636", "411733"], anzsco4Groups: ["2726", "4115", "4117"], broadFields: ["09 - Society and Culture"] },
  "electrical-engineering": { oscaCodes: ["243331", "243431"], anzsco4Groups: ["2333", "2334"], broadFields: ["03 - Engineering and Related Technologies"] },
  "interior-design": { oscaCodes: ["242431"], anzsco4Groups: [], broadFields: ["04 - Architecture and Building"] },
}

export const AU_CONCEPT_OCCUPATIONS: AuConceptOccupations[] = CONCEPT_METADATA.map((concept) => {
  const evidence = VERIFIED_CONCEPT_EVIDENCE[concept.conceptId]
  return {
    ...concept,
    ...evidence,
    // Do not display legacy labels that no longer match the reviewed OSCA code.
    representativeOccupations: concept.representativeOccupations.filter((occupation) => evidence.oscaCodes.includes(occupation.oscaCode)),
  }
})

// ── Lookup helpers ───────────────────────────────────────────────────────────

const CONCEPT_MAP = new Map(AU_CONCEPT_OCCUPATIONS.map((entry) => [entry.conceptId, entry]))

const OSCA_TO_CONCEPT = new Map<string, string>()
for (const entry of AU_CONCEPT_OCCUPATIONS) {
  for (const code of entry.oscaCodes) {
    OSCA_TO_CONCEPT.set(code, entry.conceptId)
  }
}

export function getAuConceptOccupations(conceptId: string): AuConceptOccupations | undefined {
  return CONCEPT_MAP.get(conceptId)
}

export function getAuConceptForOccupation(oscaCode: string): string | undefined {
  return OSCA_TO_CONCEPT.get(oscaCode)
}

/** All OSCA codes across all AU concepts (for Supabase in queries) */
export const ALL_AU_OSCA_CODES = [...new Set(AU_CONCEPT_OCCUPATIONS.flatMap((e) => e.oscaCodes))]
