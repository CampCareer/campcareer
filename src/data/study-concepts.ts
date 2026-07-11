import type { ConceptCountryCoverage, StudyConcept } from "@/lib/study-product/types"

export const STUDY_CATEGORIES = [
  { id: "trades", label: "Construction & Skilled Trades", labelKo: "건설·기술직" },
  { id: "health", label: "Health & Care", labelKo: "보건·돌봄" },
  { id: "technology", label: "IT & Data", labelKo: "IT·데이터" },
  { id: "engineering", label: "Engineering & Manufacturing", labelKo: "공학·제조" },
  { id: "business", label: "Business & Finance", labelKo: "비즈니스·금융" },
  { id: "education", label: "Education & Social Services", labelKo: "교육·사회" },
  { id: "environment", label: "Environment & Agriculture", labelKo: "환경·농업" },
  { id: "design", label: "Design & Media", labelKo: "디자인·미디어" },
  { id: "hospitality", label: "Hospitality & Services", labelKo: "호텔·서비스" },
  { id: "transport", label: "Transport, Aviation & Maritime", labelKo: "운송·항공·해양" },
] as const

const DESTINATIONS = ["AU", "US", "CA", "UK", "IE", "DE", "NL", "BE"] as const

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
  concept({ id: "data-analytics", slug: "data-analytics", kind: "STUDY_FIELD", category: "technology", label: "Data Analytics & AI", labelKo: "데이터 분석·AI", aliases: ["data science", "artificial intelligence", "machine learning", "business intelligence"], aliasesKo: ["데이터과학", "인공지능", "머신러닝"], description: "Data analysis, statistics, machine learning and applied AI.", roiSearchTerm: "Data", legacyField: "data", decisionReady: ["AU", "US", "CA", "UK", "IE"] }),
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
