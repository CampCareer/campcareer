import type { ConceptCountryCoverage, StudyConcept } from "@/lib/study-product/types"
import { LAUNCH_COUNTRY_CODES } from "@/data/launch-countries"

export const STUDY_CATEGORIES = [
  { id: "trades", label: "Construction & Skilled Trades", labelKo: "건설·기술직" },
  { id: "health", label: "Health & Care", labelKo: "보건·돌봄" },
  { id: "technology", label: "IT, Data & Science", labelKo: "IT·데이터·과학" },
  { id: "engineering", label: "Engineering, Manufacturing & Resources", labelKo: "공학·제조·자원" },
  { id: "business", label: "Business, Finance, Legal & Public Administration", labelKo: "비즈니스·금융·법·공공행정" },
  { id: "education", label: "Education, Social & Community Services", labelKo: "교육·사회·커뮤니티 서비스" },
  { id: "environment", label: "Environment & Agriculture", labelKo: "환경·농업" },
  { id: "design", label: "Design, Media & Culture", labelKo: "디자인·미디어·문화" },
  { id: "hospitality", label: "Hospitality, Retail & Services", labelKo: "호텔·리테일·서비스" },
  { id: "transport", label: "Transport, Aviation, Maritime & Logistics", labelKo: "운송·항공·해양·물류" },
] as const

const DESTINATIONS = LAUNCH_COUNTRY_CODES

function coverage(
  decisionReady: readonly string[],
  pathwayReady: readonly string[] = DESTINATIONS,
): Record<string, ConceptCountryCoverage> {
  return Object.fromEntries(
    DESTINATIONS.map((country) => [
      country,
      decisionReady.includes(country)
        ? "DECISION_READY"
        : pathwayReady.includes(country)
          ? "PATHWAY_READY"
          : "PROFILE_READY",
    ]),
  )
}

function concept(value: Omit<StudyConcept, "coverageByCountry"> & {
  decisionReady?: readonly string[]
  pathwayReady?: readonly string[]
}): StudyConcept {
  const { decisionReady = [], pathwayReady, ...rest } = value
  // A concept is ranked only when it has a dedicated, reviewed decision model.
  // Broad taxonomy relationships never inherit a score from a parent field.
  const reviewedDecisionCountries = rest.legacyField ? decisionReady : []
  return { ...rest, coverageByCountry: coverage(reviewedDecisionCountries, pathwayReady) }
}

export const STUDY_CONCEPTS: StudyConcept[] = [
  concept({ id: "computer-science", slug: "computer-science", kind: "STUDY_FIELD", category: "technology", label: "Computer Science", labelKo: "컴퓨터과학", aliases: ["computing", "computer engineering", "informatics"], aliasesKo: ["컴공", "컴퓨터공학"], description: "Computing, algorithms, systems and software foundations.", roiSearchTerm: "Computer Science", legacyField: "software", decisionReady: ["AU", "US", "CA", "UK", "IE"] }),
  concept({ id: "data-analytics", slug: "data-analytics", kind: "STUDY_FIELD", category: "technology", label: "Data Analytics & AI", labelKo: "데이터 분석·AI", aliases: ["data science", "artificial intelligence", "machine learning", "business intelligence"], aliasesKo: ["데이터과학", "인공지능", "머신러닝"], description: "Data analysis, statistics, machine learning and applied AI.", roiSearchTerm: "Computer and Information", legacyField: "data", decisionReady: ["AU", "US", "CA", "UK", "IE"] }),
  concept({ id: "cybersecurity", slug: "cybersecurity", kind: "STUDY_FIELD", category: "technology", label: "Cybersecurity", labelKo: "사이버보안", aliases: ["information security", "network security"], aliasesKo: ["정보보안", "네트워크 보안"], description: "Security operations, systems defence and information assurance.", roiSearchTerm: "Cybersecurity", decisionReady: ["AU", "US", "CA", "UK"] }),
  concept({ id: "nursing", slug: "nursing", kind: "STUDY_FIELD", category: "health", label: "Nursing", labelKo: "간호학", aliases: ["registered nursing", "nurse", "clinical nursing"], aliasesKo: ["간호", "간호사"], description: "Registered nursing education and clinical practice.", roiSearchTerm: "Nursing", legacyField: "nursing", decisionReady: ["AU", "US", "CA", "UK", "IE"] }),
  concept({ id: "aged-care", slug: "aged-care", kind: "QUALIFICATION", category: "health", label: "Aged Care & Community Services", labelKo: "노인돌봄·커뮤니티 서비스", aliases: ["elderly care", "individual support", "community care"], aliasesKo: ["요양보호", "노인복지", "개인지원"], description: "Care qualifications for older people and community settings.", roiSearchTerm: "Health Services", decisionReady: ["AU", "CA", "UK"] }),
  concept({ id: "allied-health", slug: "allied-health", kind: "STUDY_FIELD", category: "health", label: "Allied Health", labelKo: "보건의료·재활", aliases: ["physiotherapy", "occupational therapy", "rehabilitation"], aliasesKo: ["물리치료", "작업치료", "재활"], description: "Rehabilitation, therapy and allied clinical professions.", roiSearchTerm: "Rehabilitation", decisionReady: ["AU", "US", "CA", "UK", "IE"] }),
  concept({ id: "engineering", slug: "engineering", kind: "STUDY_FIELD", category: "engineering", label: "Engineering", labelKo: "공학", aliases: ["general engineering"], aliasesKo: ["엔지니어링"], description: "Broad engineering study across civil, mechanical and electrical pathways.", roiSearchTerm: "Engineering", legacyField: "engineering", decisionReady: ["AU", "US", "CA", "UK", "IE"] }),
  concept({ id: "civil-engineering", slug: "civil-engineering", kind: "STUDY_FIELD", category: "engineering", label: "Civil Engineering", labelKo: "토목공학", aliases: ["structural engineering", "construction engineering"], aliasesKo: ["구조공학", "건설공학"], description: "Infrastructure, structures, transport and construction systems.", roiSearchTerm: "Civil Engineering", decisionReady: ["AU", "US", "CA", "UK", "IE"] }),
  concept({ id: "mechanical-engineering", slug: "mechanical-engineering", kind: "STUDY_FIELD", category: "engineering", label: "Mechanical Engineering", labelKo: "기계공학", aliases: ["mechatronics", "manufacturing engineering"], aliasesKo: ["메카트로닉스", "제조공학"], description: "Mechanical systems, design, manufacturing and energy.", roiSearchTerm: "Mechanical Engineering", decisionReady: ["AU", "US", "CA", "UK"] }),
  concept({ id: "business-analytics", slug: "business-analytics", kind: "STUDY_FIELD", category: "business", label: "Business Analytics", labelKo: "비즈니스 애널리틱스", aliases: ["business intelligence", "management analytics"], aliasesKo: ["경영분석", "비즈니스 분석"], description: "Business decisions using data, operations and information systems.", roiSearchTerm: "Business", legacyField: "business", decisionReady: ["AU", "US", "CA", "UK", "IE"] }),
  concept({ id: "accounting", slug: "accounting", kind: "STUDY_FIELD", category: "business", label: "Accounting", labelKo: "회계학", aliases: ["accountancy", "audit", "taxation"], aliasesKo: ["회계", "감사", "세무"], description: "Financial reporting, audit, taxation and professional accounting.", roiSearchTerm: "Accounting", decisionReady: ["AU", "US", "CA", "UK", "IE"] }),
  concept({ id: "early-childhood", slug: "early-childhood-education", kind: "QUALIFICATION", category: "education", label: "Early Childhood Education", labelKo: "유아교육", aliases: ["childcare", "early years", "preschool education"], aliasesKo: ["보육", "아동교육", "유치원"], description: "Education and care for young children in regulated settings.", roiSearchTerm: "Early Childhood", decisionReady: ["AU", "CA", "UK", "IE"] }),
  concept({ id: "carpentry", slug: "carpentry", kind: "TRADE_PATHWAY", category: "trades", label: "Carpentry", labelKo: "목공·목수", aliases: ["carpenter", "joinery", "roof carpenter", "certificate iii carpentry"], aliasesKo: ["목수", "목공", "건축목공"], description: "Construction carpentry, joinery and timber structures.", roiSearchTerm: "Carpentry", decisionReady: ["AU", "CA", "UK"], officialCodes: [{ country: "AU", system: "OSCA", version: "2024", code: "372132" }, { country: "AU", system: "ANZSCO", version: "2013", code: "331212" }] }),
  concept({ id: "wall-floor-tiling", slug: "wall-floor-tiling", kind: "TRADE_PATHWAY", category: "trades", label: "Wall & Floor Tiling", labelKo: "벽·바닥 타일", aliases: ["tiler", "tile setter", "ceramic tiler", "certificate iii tiling"], aliasesKo: ["타일공", "타일시공", "세라믹 타일"], description: "Wall, floor and specialist tile installation.", roiSearchTerm: "Wall and Floor Tiling", decisionReady: ["AU", "CA"], officialCodes: [{ country: "AU", system: "OSCA", version: "2024", code: "362431" }, { country: "AU", system: "ANZSCO", version: "2013", code: "333411" }] }),
  concept({ id: "electrical-trade", slug: "electrical-trade", kind: "TRADE_PATHWAY", category: "trades", label: "Electrical Trade", labelKo: "전기 기술", aliases: ["electrician", "electrotechnology", "construction electrician"], aliasesKo: ["전기공", "전기기사", "전기기술"], description: "Electrical installation, maintenance and regulated trade training.", roiSearchTerm: "Electrical", decisionReady: ["AU", "CA", "UK"], officialCodes: [{ country: "AU", system: "OSCA", version: "2024", code: "381231" }, { country: "AU", system: "ANZSCO", version: "2013", code: "341111" }] }),
  concept({ id: "plumbing", slug: "plumbing", kind: "TRADE_PATHWAY", category: "trades", label: "Plumbing", labelKo: "배관", aliases: ["plumber", "gas fitting", "roof plumbing"], aliasesKo: ["배관공", "가스배관"], description: "Water, drainage, gas and regulated plumbing systems.", roiSearchTerm: "Plumbing", decisionReady: ["AU", "CA", "UK"] }),
  concept({ id: "welding", slug: "welding", kind: "TRADE_PATHWAY", category: "trades", label: "Welding & Fabrication", labelKo: "용접·금속가공", aliases: ["welder", "metal fabrication", "boilermaker"], aliasesKo: ["용접공", "금속가공", "제관"], description: "Welding, fabrication and structural metal work.", roiSearchTerm: "Welding", decisionReady: ["AU", "CA", "UK"] }),
  concept({ id: "automotive", slug: "automotive-technology", kind: "TRADE_PATHWAY", category: "transport", label: "Automotive Technology", labelKo: "자동차 정비", aliases: ["automotive mechanic", "motor mechanic", "vehicle technician"], aliasesKo: ["자동차정비", "정비사", "차량기술"], description: "Vehicle diagnostics, maintenance and repair qualifications.", roiSearchTerm: "Automotive", decisionReady: ["AU", "CA", "UK"] }),
  concept({ id: "hospitality-management", slug: "hospitality-management", kind: "QUALIFICATION", category: "hospitality", label: "Hospitality Management", labelKo: "호텔·관광경영", aliases: ["hotel management", "tourism management", "culinary management"], aliasesKo: ["호텔경영", "관광경영", "외식경영"], description: "Hospitality, hotel, tourism and service operations.", roiSearchTerm: "Hospitality", decisionReady: ["AU", "US", "CA", "UK", "IE"] }),
  concept({ id: "architecture", slug: "architecture", kind: "STUDY_FIELD", category: "design", label: "Architecture", labelKo: "건축학", aliases: ["architectural design", "built environment"], aliasesKo: ["건축", "건축설계"], description: "Architecture, spatial design and the built environment.", roiSearchTerm: "Architecture", decisionReady: ["AU", "US", "CA", "UK"] }),
  concept({ id: "design-media", slug: "design-media", kind: "STUDY_FIELD", category: "design", label: "Design & Media", labelKo: "디자인·미디어", aliases: ["ux design", "graphic design", "digital media", "animation"], aliasesKo: ["UX디자인", "그래픽디자인", "디지털미디어"], description: "Visual, interaction and digital media design.", roiSearchTerm: "Design", decisionReady: ["AU", "US", "CA", "UK"] }),
  concept({ id: "environmental-science", slug: "environmental-science", kind: "STUDY_FIELD", category: "environment", label: "Environmental Science", labelKo: "환경과학", aliases: ["sustainability", "natural resource management"], aliasesKo: ["지속가능성", "환경관리"], description: "Environmental systems, conservation and sustainability.", roiSearchTerm: "Environmental", decisionReady: ["AU", "US", "CA", "UK"] }),
  concept({ id: "agriculture", slug: "agriculture", kind: "STUDY_FIELD", category: "environment", label: "Agriculture & Agribusiness", labelKo: "농업·농업경영", aliases: ["agribusiness", "horticulture", "agricultural science"], aliasesKo: ["농업", "원예", "농업과학"], description: "Agriculture, food production and agribusiness.", roiSearchTerm: "Agriculture", decisionReady: ["AU", "US", "CA"] }),
  concept({ id: "aviation", slug: "aviation", kind: "QUALIFICATION", category: "transport", label: "Aviation", labelKo: "항공", aliases: ["pilot training", "aviation management", "aircraft maintenance"], aliasesKo: ["조종사", "항공경영", "항공정비"], description: "Flight, airport operations and aircraft maintenance pathways.", roiSearchTerm: "Aviation", decisionReady: ["AU", "US", "CA", "UK"] }),

  concept({ id: "culinary-arts", slug: "culinary-arts", kind: "TRADE_PATHWAY", category: "hospitality", label: "Commercial Cookery & Culinary Arts", labelKo: "요리·제빵", aliases: ["cook", "chef", "bakery", "commercial cookery", "patisserie"], aliasesKo: ["요리사", "제빵사", "조리", "파티시에"], description: "Commercial cookery, baking and food preparation trade qualifications.", roiSearchTerm: "Cookery", decisionReady: ["AU"], officialCodes: [{ country: "AU", system: "OSCA", version: "2024", code: "322331" }, { country: "AU", system: "OSCA", version: "2024", code: "322131" }, { country: "AU", system: "OSCA", version: "2024", code: "322231" }] }),

  concept({ id: "beauty-wellness", slug: "beauty-wellness", kind: "TRADE_PATHWAY", category: "hospitality", label: "Beauty & Wellness Therapy", labelKo: "미용·웰빙", aliases: ["beauty therapy", "dermal therapy", "hairdressing", "skin care"], aliasesKo: ["미용사", "피부관리", "헤어", "네일"], description: "Beauty therapy, dermal treatments, hairdressing and personal care qualifications.", roiSearchTerm: "Beauty Therapy", decisionReady: ["AU"], officialCodes: [{ country: "AU", system: "OSCA", version: "2024", code: "461131" }, { country: "AU", system: "OSCA", version: "2024", code: "461132" }, { country: "AU", system: "OSCA", version: "2024", code: "392132" }] }),

  concept({ id: "social-work", slug: "social-work", kind: "STUDY_FIELD", category: "education", label: "Social & Community Services", labelKo: "사회복지·커뮤니티", aliases: ["social work", "community services", "youth work", "counselling"], aliasesKo: ["사회복지사", "청소년지도사", "상담"], description: "Social work, community services, youth work and professional counselling.", roiSearchTerm: "Social Work", decisionReady: ["AU"], officialCodes: [{ country: "AU", system: "OSCA", version: "2024", code: "272631" }, { country: "AU", system: "OSCA", version: "2024", code: "411731" }, { country: "AU", system: "OSCA", version: "2024", code: "272633" }] }),

  concept({ id: "dental", slug: "dental", kind: "STUDY_FIELD", category: "health", label: "Dental & Oral Health", labelKo: "치과·구강건강", aliases: ["dentistry", "dental hygiene", "oral health", "dental therapy"], aliasesKo: ["치과의사", "위생사", "구강건강"], description: "Dentistry, dental hygiene, oral health therapy and dental prosthetics.", roiSearchTerm: "Dentistry", decisionReady: ["AU"], officialCodes: [{ country: "AU", system: "OSCA", version: "2024", code: "269232" }, { country: "AU", system: "OSCA", version: "2024", code: "269131" }, { country: "AU", system: "OSCA", version: "2024", code: "269133" }] }),

  concept({ id: "law", slug: "law", kind: "STUDY_FIELD", category: "business", label: "Law & Legal Studies", labelKo: "법학", aliases: ["legal studies", "juris doctor", "LLB", "paralegal"], aliasesKo: ["법학", "로스쿨", "법무사"], description: "Legal education, solicitor and barrister training, paralegal studies.", roiSearchTerm: "Law", decisionReady: ["AU"], officialCodes: [{ country: "AU", system: "OSCA", version: "2024", code: "281331" }, { country: "AU", system: "OSCA", version: "2024", code: "281332" }] }),

  concept({ id: "sport-fitness", slug: "sport-fitness", kind: "QUALIFICATION", category: "education", label: "Sport Science & Fitness", labelKo: "스포츠과학·피트니스", aliases: ["sport science", "exercise science", "fitness", "coaching", "outdoor recreation"], aliasesKo: ["운동과학", "피트니스", "스포츠코칭"], description: "Sport science, exercise physiology, fitness training and outdoor recreation leadership.", roiSearchTerm: "Sports", decisionReady: ["AU"], officialCodes: [{ country: "AU", system: "OSCA", version: "2024", code: "462434" }, { country: "AU", system: "OSCA", version: "2024", code: "462442" }, { country: "AU", system: "OSCA", version: "2024", code: "451131" }] }),

  concept({ id: "bricklaying", slug: "bricklaying", kind: "TRADE_PATHWAY", category: "trades", label: "Bricklaying & Stonemasonry", labelKo: "조적·석공", aliases: ["bricklayer", "stonemason", "blocklayer", "certificate iii bricklaying"], aliasesKo: ["조적공", "석공", "brick"], description: "Bricklaying, blocklaying, stonemasonry and rendered finishes.", roiSearchTerm: "Bricklaying", decisionReady: ["AU"], officialCodes: [{ country: "AU", system: "OSCA", version: "2024", code: "371131" }, { country: "AU", system: "OSCA", version: "2024", code: "371132" }] }),

  concept({ id: "hvac", slug: "hvac", kind: "TRADE_PATHWAY", category: "trades", label: "Air Conditioning & Refrigeration", labelKo: "냉난방공조", aliases: ["HVAC", "air conditioning mechanic", "refrigeration mechanic", "certificate iii refrigeration"], aliasesKo: ["냉난방", "공조기술", "냉동기사"], description: "Installation, maintenance and repair of air conditioning and refrigeration systems.", roiSearchTerm: "HVAC", decisionReady: ["AU"], officialCodes: [{ country: "AU", system: "OSCA", version: "2024", code: "382131" }] }),

  concept({ id: "maritime", slug: "maritime", kind: "QUALIFICATION", category: "transport", label: "Maritime & Shipping", labelKo: "해양·해운", aliases: ["marine engineering", "deck officer", "naval officer", "merchant navy"], aliasesKo: ["해양공학", "항해사", "기관사", "상선"], description: "Maritime navigation, marine engineering, port operations and shipping qualifications.", roiSearchTerm: "Maritime", decisionReady: ["AU"], officialCodes: [{ country: "AU", system: "OSCA", version: "2024", code: "313431" }, { country: "AU", system: "OSCA", version: "2024", code: "313435" }, { country: "AU", system: "OSCA", version: "2024", code: "313436" }] }),

  concept({ id: "mining-resources", slug: "mining-resources", kind: "STUDY_FIELD", category: "engineering", label: "Mining & Resources Engineering", labelKo: "광업·자원공학", aliases: ["mining engineering", "petroleum engineering", "resources engineering", "geotechnical"], aliasesKo: ["광업공학", "석유공학", "자원공학"], description: "Mining, petroleum, resources extraction and geotechnical engineering.", roiSearchTerm: "Mining Engineering", decisionReady: ["AU"], officialCodes: [{ country: "AU", system: "OSCA", version: "2024", code: "243631" }, { country: "AU", system: "OSCA", version: "2024", code: "243632" }] }),

  concept({ id: "psychology", slug: "psychology", kind: "STUDY_FIELD", category: "health", label: "Psychology & Mental Health", labelKo: "심리학·정신건강", aliases: ["psychology", "clinical psychology", "counselling psychology", "mental health"], aliasesKo: ["심리학", "임상심리", "정신건강"], description: "Psychological science, clinical practice, counselling and mental health interventions.", roiSearchTerm: "Psychology", decisionReady: ["AU"], officialCodes: [{ country: "AU", system: "OSCA", version: "2024", code: "272331" }, { country: "AU", system: "OSCA", version: "2024", code: "272332" }] }),

  concept({ id: "paramedic-emergency", slug: "paramedic-emergency", kind: "STUDY_FIELD", category: "health", label: "Paramedic & Emergency Health", labelKo: "응급의료·구급", aliases: ["paramedic", "ambulance officer", "emergency health", "pre-hospital care"], aliasesKo: ["구급대원", "응급구조사", "응급의료"], description: "Pre-hospital emergency care, paramedic science and ambulance operations.", roiSearchTerm: "Paramedic", decisionReady: ["AU"], officialCodes: [{ country: "AU", system: "OSCA", version: "2024", code: "269432" }, { country: "AU", system: "OSCA", version: "2024", code: "269433" }] }),

  concept({ id: "veterinary", slug: "veterinary", kind: "STUDY_FIELD", category: "environment", label: "Veterinary Science", labelKo: "수의학", aliases: ["veterinary", "animal science", "veterinary nursing", "vet tech"], aliasesKo: ["수의사", "동물간호", "수의기술"], description: "Veterinary medicine, animal health and veterinary nursing.", roiSearchTerm: "Veterinary", decisionReady: ["AU"], officialCodes: [{ country: "AU", system: "OSCA", version: "2024", code: "269531" }] }),

  concept({ id: "primary-secondary-education", slug: "primary-secondary-education", kind: "STUDY_FIELD", category: "education", label: "Primary & Secondary Teaching", labelKo: "초중등교사", aliases: ["primary teacher", "secondary teacher", "school teaching", "education degree"], aliasesKo: ["초등교사", "중등교사", "교사"], description: "Primary and secondary school teacher training and education degrees.", roiSearchTerm: "Education", decisionReady: ["AU"], officialCodes: [{ country: "AU", system: "OSCA", version: "2024", code: "241231" }, { country: "AU", system: "OSCA", version: "2024", code: "241331" }] }),

  concept({ id: "photography-film", slug: "photography-film", kind: "STUDY_FIELD", category: "design", label: "Photography & Film Production", labelKo: "영상·영화제작", aliases: ["photography", "film production", "cinematography", "screen production", "video production"], aliasesKo: ["촬영감독", "영화제작", "영상편집"], description: "Photography, film and television production, cinematography and post-production.", roiSearchTerm: "Film Production", decisionReady: ["AU"], officialCodes: [{ country: "AU", system: "OSCA", version: "2024", code: "212331" }, { country: "AU", system: "OSCA", version: "2024", code: "212431" }] }),
]

export const STUDY_CONCEPT_BY_ID = new Map(STUDY_CONCEPTS.map((item) => [item.id, item]))

export function getStudyConcept(idOrSlug: string) {
  return STUDY_CONCEPTS.find((item) => item.id === idOrSlug || item.slug === idOrSlug) ?? null
}

export function getLocalizedConceptLabel(concept: StudyConcept, locale: string) {
  return locale.startsWith("ko") ? concept.labelKo : concept.label
}

export function normalizeTaxonomyQuery(value: string) {
  return value
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9\u3131-\u318e\uac00-\ud7a3]+/gi, " ")
    .trim()
}
