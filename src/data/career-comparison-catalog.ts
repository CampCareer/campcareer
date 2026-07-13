import { STUDY_CATEGORIES } from "@/data/study-concepts"

export type CareerCategoryId = (typeof STUDY_CATEGORIES)[number]["id"]

export type CanonicalCareer = {
  id: string
  categoryId: CareerCategoryId
  label: string
  labelKo: string
  aliases: readonly string[]
  aliasesKo: readonly string[]
}

export type CareerMappingRelation = "exact" | "broader" | "narrower" | "related"

/**
 * This is the required evidence record for a country-level career comparison.
 * A classification label alone is never enough to calculate salary or rank a
 * country: the mapping must be exact and tied to a current official source.
 */
export type CountryCareerMapping = {
  countryCode: string
  canonicalCareerId: string
  officialSystem: string
  officialSystemVersion: string
  officialCode: string
  relation: CareerMappingRelation
  sourceUrl: string
  sourceCheckedAt: string
  reviewStatus: "approved" | "review-required"
}

const career = (
  id: string,
  categoryId: CareerCategoryId,
  label: string,
  labelKo: string,
  aliases: readonly string[] = [],
  aliasesKo: readonly string[] = [],
): CanonicalCareer => ({
  id,
  categoryId,
  label,
  labelKo,
  aliases,
  aliasesKo,
})

/**
 * A neutral, global job-intent catalogue. It deliberately contains no country
 * code guesses. Country observations are attached only through
 * CountryCareerMapping after exact-code review.
 */
export const CANONICAL_CAREERS: readonly CanonicalCareer[] = [
  career("carpenter", "trades", "Carpenter", "목수", ["joiner"], ["목공"]),
  career("electrician", "trades", "Electrician", "전기 기술자", ["construction electrician"], ["전기공"]),
  career("plumber", "trades", "Plumber", "배관공", ["pipe fitter"], ["배관"]),
  career("wall-floor-tiler", "trades", "Wall and Floor Tiler", "벽·바닥 타일공", ["tile setter"], ["타일공"]),
  career("welder", "trades", "Welder", "용접공", ["metal fabricator"], ["용접"]),
  career("bricklayer", "trades", "Bricklayer", "벽돌공", ["mason"], ["조적공"]),
  career("hvac-technician", "trades", "HVAC Technician", "냉난방공조 기술자", ["refrigeration mechanic", "air conditioning technician"], ["냉난방", "공조"]),
  career("construction-manager", "trades", "Construction Manager", "건설 관리자", ["site manager"], ["건설 현장 관리자"]),

  career("registered-nurse", "health", "Registered Nurse", "간호사", ["nurse"], ["간호"]),
  career("midwife", "health", "Midwife", "조산사", [], ["조산"]),
  career("care-worker", "health", "Care Worker", "돌봄 종사자", ["aged care worker", "support worker"], ["요양보호", "돌봄"]),
  career("physiotherapist", "health", "Physiotherapist", "물리치료사", [], ["물리치료"]),
  career("medical-laboratory-technician", "health", "Medical Laboratory Technician", "임상병리사", ["lab technician"], ["임상병리"]),
  career("radiographer", "health", "Radiographer", "방사선사", ["medical imaging technologist"], ["방사선"]),
  career("pharmacist", "health", "Pharmacist", "약사", [], ["약사"]),
  career("occupational-therapist", "health", "Occupational Therapist", "작업치료사", [], ["작업치료"]),

  career("software-developer", "technology", "Software Developer", "소프트웨어 개발자", ["software engineer"], ["소프트웨어 엔지니어"]),
  career("data-analyst", "technology", "Data Analyst", "데이터 분석가", ["business intelligence analyst"], ["데이터 분석"]),
  career("data-engineer", "technology", "Data Engineer", "데이터 엔지니어", [], ["데이터 엔지니어"]),
  career("cybersecurity-analyst", "technology", "Cybersecurity Analyst", "사이버보안 분석가", ["information security analyst"], ["정보보안"]),
  career("network-administrator", "technology", "Network Administrator", "네트워크 관리자", ["systems administrator"], ["네트워크"]),
  career("cloud-engineer", "technology", "Cloud Engineer", "클라우드 엔지니어", [], ["클라우드"]),
  career("database-administrator", "technology", "Database Administrator", "데이터베이스 관리자", ["DBA"], ["DBA", "데이터베이스"]),
  career("ict-support-technician", "technology", "ICT Support Technician", "ICT 지원 기술자", ["IT support technician", "help desk technician"], ["IT 지원"]),

  career("civil-engineer", "engineering", "Civil Engineer", "토목 엔지니어", ["structural engineer"], ["토목"]),
  career("mechanical-engineer", "engineering", "Mechanical Engineer", "기계 엔지니어", [], ["기계"]),
  career("electrical-engineer", "engineering", "Electrical Engineer", "전기 엔지니어", [], ["전기"]),
  career("manufacturing-engineer", "engineering", "Manufacturing Engineer", "제조 엔지니어", [], ["제조"]),
  career("industrial-engineer", "engineering", "Industrial Engineer", "산업공학 엔지니어", [], ["산업공학"]),
  career("chemical-engineer", "engineering", "Chemical Engineer", "화학 엔지니어", [], ["화학공학"]),
  career("environmental-engineer", "engineering", "Environmental Engineer", "환경 엔지니어", [], ["환경공학"]),
  career("engineering-technician", "engineering", "Engineering Technician", "엔지니어링 기술자", [], ["공학 기술자"]),

  career("accountant", "business", "Accountant", "회계사·회계원", ["auditor"], ["회계", "감사"]),
  career("financial-analyst", "business", "Financial Analyst", "재무 분석가", [], ["재무 분석"]),
  career("business-analyst", "business", "Business Analyst", "비즈니스 분석가", [], ["경영 분석"]),
  career("supply-chain-analyst", "business", "Supply Chain Analyst", "공급망 분석가", ["logistics analyst"], ["공급망"]),
  career("human-resources-specialist", "business", "Human Resources Specialist", "인사 전문가", ["hr specialist"], ["인사"]),
  career("marketing-specialist", "business", "Marketing Specialist", "마케팅 전문가", [], ["마케팅"]),
  career("auditor", "business", "Auditor", "감사인", [], ["감사"]),
  career("project-manager", "business", "Project Manager", "프로젝트 관리자", [], ["프로젝트 관리"]),

  career("early-childhood-teacher", "education", "Early Childhood Teacher", "유아교사", ["preschool teacher"], ["유아교육"]),
  career("primary-school-teacher", "education", "Primary School Teacher", "초등교사", [], ["초등교사"]),
  career("secondary-school-teacher", "education", "Secondary School Teacher", "중등교사", [], ["중등교사"]),
  career("special-education-teacher", "education", "Special Education Teacher", "특수교사", [], ["특수교육"]),
  career("social-worker", "education", "Social Worker", "사회복지사", [], ["사회복지"]),
  career("youth-worker", "education", "Youth Worker", "청소년 지도사", [], ["청소년"]),
  career("community-worker", "education", "Community Worker", "커뮤니티 워커", ["community services worker"], ["지역사회 복지사"]),
  career("counsellor", "education", "Counsellor", "상담사", ["career counsellor"], ["상담"]),

  career("environmental-scientist", "environment", "Environmental Scientist", "환경과학자", [], ["환경과학"]),
  career("agronomist", "environment", "Agronomist", "농업기술자", ["crop scientist"], ["농업"]),
  career("farm-manager", "environment", "Farm Manager", "농장 관리자", [], ["농장"]),
  career("forestry-technician", "environment", "Forestry Technician", "산림 기술자", [], ["산림"]),
  career("food-technologist", "environment", "Food Technologist", "식품 기술자", [], ["식품"]),
  career("sustainability-specialist", "environment", "Sustainability Specialist", "지속가능성 전문가", [], ["지속가능성"]),
  career("horticulturist", "environment", "Horticulturist", "원예사", [], ["원예"]),
  career("animal-science-technician", "environment", "Animal Science Technician", "동물과학 기술자", ["animal health technician"], ["동물과학"]),

  career("graphic-designer", "design", "Graphic Designer", "그래픽 디자이너", [], ["그래픽디자인"]),
  career("ux-designer", "design", "UX Designer", "UX 디자이너", ["user experience designer"], ["사용자 경험"]),
  career("multimedia-designer", "design", "Multimedia Designer", "멀티미디어 디자이너", [], ["멀티미디어"]),
  career("animator", "design", "Animator", "애니메이터", [], ["애니메이션"]),
  career("interior-designer", "design", "Interior Designer", "인테리어 디자이너", [], ["실내디자인"]),
  career("film-editor", "design", "Film Editor", "영상 편집자", ["video editor"], ["영상 편집"]),
  career("architect", "design", "Architect", "건축사", [], ["건축"]),
  career("web-designer", "design", "Web Designer", "웹 디자이너", [], ["웹디자인"]),

  career("chef", "hospitality", "Chef", "셰프", [], ["셰프"]),
  career("cook", "hospitality", "Cook", "조리사", [], ["요리사"]),
  career("hotel-manager", "hospitality", "Hotel Manager", "호텔 관리자", [], ["호텔 경영"]),
  career("restaurant-manager", "hospitality", "Restaurant Manager", "레스토랑 관리자", [], ["외식 경영"]),
  career("baker", "hospitality", "Baker", "제빵사", [], ["제빵"]),
  career("tourism-manager", "hospitality", "Tourism Manager", "관광 관리자", [], ["관광"]),
  career("event-planner", "hospitality", "Event Planner", "행사 기획자", [], ["행사 기획"]),
  career("hospitality-supervisor", "hospitality", "Hospitality Supervisor", "호스피탈리티 슈퍼바이저", ["food service supervisor"], ["서비스 관리자"]),

  career("truck-driver", "transport", "Truck Driver", "화물차 운전기사", ["heavy truck driver"], ["트럭 운전"]),
  career("logistics-coordinator", "transport", "Logistics Coordinator", "물류 코디네이터", [], ["물류"]),
  career("aircraft-maintenance-technician", "transport", "Aircraft Maintenance Technician", "항공정비사", ["aircraft mechanic"], ["항공정비"]),
  career("commercial-pilot", "transport", "Commercial Pilot", "상업 조종사", [], ["조종사"]),
  career("marine-engineer", "transport", "Marine Engineer", "기관사", [], ["해양 엔지니어"]),
  career("deck-officer", "transport", "Deck Officer", "항해사", [], ["항해사"]),
  career("warehouse-manager", "transport", "Warehouse Manager", "창고 관리자", [], ["창고 관리"]),
  career("automotive-service-technician", "transport", "Automotive Service Technician", "자동차 정비 기술자", ["automotive mechanic"], ["자동차 정비"]),
] as const

if (CANONICAL_CAREERS.length !== 80) {
  throw new Error(`Career catalogue must contain exactly 80 careers; found ${CANONICAL_CAREERS.length}`)
}

export const CANONICAL_CAREER_BY_ID = new Map(
  CANONICAL_CAREERS.map((careerItem) => [careerItem.id, careerItem]),
)

export function getCanonicalCareer(id: string) {
  return CANONICAL_CAREER_BY_ID.get(id) ?? null
}

export function careersForCategory(categoryId: CareerCategoryId) {
  return CANONICAL_CAREERS.filter((careerItem) => careerItem.categoryId === categoryId)
}

export function isExactApprovedMapping(
  mapping: CountryCareerMapping | undefined,
): mapping is CountryCareerMapping {
  return Boolean(
    mapping &&
      mapping.relation === "exact" &&
      mapping.reviewStatus === "approved" &&
      mapping.officialCode &&
      mapping.sourceUrl &&
      mapping.sourceCheckedAt,
  )
}
