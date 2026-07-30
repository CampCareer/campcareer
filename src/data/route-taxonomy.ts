export type RouteLocale = "en" | "ko"

export type LocalizedText = Record<RouteLocale, string>

/**
 * A human-first navigation layer. It deliberately differs from national
 * statistical classifications: someone who types "beauty" should not need to
 * know that their occupation may be classified as a personal service role.
 */
export const AU_ROUTE_CATEGORIES = [
  { id: "trades-construction", emoji: "🛠️", label: { en: "Trades & construction", ko: "건설·기술직" } },
  { id: "health-care", emoji: "🩺", label: { en: "Health & care", ko: "헬스·케어" } },
  { id: "technology-data", emoji: "💻", label: { en: "Technology, data & digital", ko: "IT·데이터·디지털" } },
  { id: "engineering-resources", emoji: "⚙️", label: { en: "Engineering, manufacturing & resources", ko: "엔지니어링·제조·자원" } },
  { id: "business-finance", emoji: "📊", label: { en: "Business & finance", ko: "비즈니스·금융" } },
  { id: "law-public-service", emoji: "⚖️", label: { en: "Law, government & public service", ko: "법률·정부·공공서비스" } },
  { id: "education-community", emoji: "🤝", label: { en: "Education, social & community", ko: "교육·사회·커뮤니티" } },
  { id: "environment-agriculture", emoji: "🌿", label: { en: "Environment, agriculture & animals", ko: "환경·농업·동물" } },
  { id: "creative-media", emoji: "🎨", label: { en: "Design, creative & media", ko: "디자인·크리에이티브·미디어" } },
  { id: "beauty-wellness", emoji: "✨", label: { en: "Beauty, wellness & personal services", ko: "뷰티·웰니스·퍼스널 서비스" } },
  { id: "hospitality-retail", emoji: "🍽️", label: { en: "Hospitality, tourism & retail", ko: "호스피탈리티·관광·리테일" } },
  { id: "transport-logistics", emoji: "🚚", label: { en: "Transport, logistics & aviation", ko: "운송·물류·항공" } },
] as const

export type RouteCategoryId = (typeof AU_ROUTE_CATEGORIES)[number]["id"]

export type AustraliaRouteCandidate = {
  id: string
  slug: string
  categoryId: RouteCategoryId
  label: LocalizedText
  /** Words a visitor may use before they know the official occupation name. */
  aliases: Record<RouteLocale, readonly string[]>
  /** Australia-specific statistical anchors. One intent can map to several roles. */
  oscaCodes: readonly string[]
  /** Existing study catalogue key where a study route is already researched. */
  studyConceptId?: string
}

const candidate = (value: AustraliaRouteCandidate) => value

/**
 * The first public Australia catalogue. These are canonical intents, not a
 * promise that every job title, visa, or training path is interchangeable.
 */
export const AU_ROUTE_CANDIDATES = [
  candidate({ id: "carpenter", slug: "carpenter", categoryId: "trades-construction", label: { en: "Carpenter", ko: "목수·카펜터" }, aliases: { en: ["carpenter", "joiner", "carpentry"], ko: ["목수", "카펜터", "목공", "카펜터 일"] }, oscaCodes: ["372131", "372132"], studyConceptId: "carpentry" }),
  candidate({ id: "electrician", slug: "electrician", categoryId: "trades-construction", label: { en: "Electrician", ko: "전기기사·전기기술자" }, aliases: { en: ["electrician", "electrical trade", "electrical worker"], ko: ["전기기사", "전기기술자", "전기공", "전기"] }, oscaCodes: ["381231"], studyConceptId: "electrical-trade" }),
  candidate({ id: "welder", slug: "welder", categoryId: "trades-construction", label: { en: "Welder", ko: "용접사" }, aliases: { en: ["welder", "welding", "fabricator"], ko: ["용접", "용접사", "웰더"] }, oscaCodes: ["331133"], studyConceptId: "welding" }),

  candidate({ id: "registered-nurse", slug: "registered-nurse", categoryId: "health-care", label: { en: "Registered Nurse", ko: "간호사" }, aliases: { en: ["registered nurse", "nurse", "nursing"], ko: ["간호사", "간호", "간호학"] }, oscaCodes: ["265432", "265433", "265434", "265435", "265499"], studyConceptId: "nursing" }),
  candidate({ id: "aged-care-worker", slug: "aged-care-worker", categoryId: "health-care", label: { en: "Aged Care Worker", ko: "요양·노인돌봄 종사자" }, aliases: { en: ["aged care", "aged care worker", "personal care worker"], ko: ["요양", "노인돌봄", "에이지드 케어", "요양보호사"] }, oscaCodes: ["421231", "421331"], studyConceptId: "aged-care" }),
  candidate({ id: "disability-support-worker", slug: "disability-support-worker", categoryId: "health-care", label: { en: "Disability Support Worker", ko: "장애인 지원 종사자" }, aliases: { en: ["disability support", "disability support worker", "support worker"], ko: ["장애인 지원", "장애인 돌봄", "서포트 워커"] }, oscaCodes: ["422231"], studyConceptId: "community-welfare" }),

  candidate({ id: "software-engineer", slug: "software-engineer", categoryId: "technology-data", label: { en: "Software Engineer", ko: "소프트웨어 개발자" }, aliases: { en: ["software engineer", "software developer", "developer", "programmer"], ko: ["개발자", "소프트웨어 개발자", "프로그래머", "컴공"] }, oscaCodes: ["273333"], studyConceptId: "computer-science" }),
  candidate({ id: "data-analyst", slug: "data-analyst", categoryId: "technology-data", label: { en: "Data Analyst", ko: "데이터 분석가" }, aliases: { en: ["data analyst", "data analytics", "business intelligence"], ko: ["데이터 분석", "데이터 분석가", "데이터 사이언스"] }, oscaCodes: ["223231"], studyConceptId: "data-analytics" }),
  candidate({ id: "cyber-security-analyst", slug: "cyber-security-analyst", categoryId: "technology-data", label: { en: "Cyber Security Analyst", ko: "사이버 보안 분석가" }, aliases: { en: ["cyber security", "cybersecurity", "security analyst"], ko: ["사이버 보안", "보안 분석가", "정보보안"] }, oscaCodes: ["271133"], studyConceptId: "cybersecurity" }),

  candidate({ id: "mining-site-work", slug: "mining-site-work", categoryId: "engineering-resources", label: { en: "Mining Site Work", ko: "광산 현장직" }, aliases: { en: ["mining", "mine work", "miner", "driller", "fifo"], ko: ["광업", "광산", "광산 취업", "광산 현장", "마이닝", "fifo"] }, oscaCodes: ["732331", "399231", "732332"] }),
  candidate({ id: "mining-engineer", slug: "mining-engineer", categoryId: "engineering-resources", label: { en: "Mining Engineer", ko: "광업 엔지니어" }, aliases: { en: ["mining engineer", "resources engineer", "mineral engineer"], ko: ["광업 엔지니어", "광산 엔지니어", "자원공학", "광업공학"] }, oscaCodes: ["243631", "243632"], studyConceptId: "mining-resources" }),
  candidate({ id: "civil-engineer", slug: "civil-engineer", categoryId: "engineering-resources", label: { en: "Civil Engineer", ko: "토목 엔지니어" }, aliases: { en: ["civil engineer", "civil engineering"], ko: ["토목", "토목 엔지니어", "토목공학"] }, oscaCodes: ["243231"], studyConceptId: "civil-engineering" }),
  candidate({ id: "mechanical-engineer", slug: "mechanical-engineer", categoryId: "engineering-resources", label: { en: "Mechanical Engineer", ko: "기계 엔지니어" }, aliases: { en: ["mechanical engineer", "mechanical engineering"], ko: ["기계 엔지니어", "기계공학"] }, oscaCodes: ["243532"], studyConceptId: "mechanical-engineering" }),

  candidate({ id: "accountant", slug: "accountant", categoryId: "business-finance", label: { en: "Accountant", ko: "회계사·회계 직무" }, aliases: { en: ["accountant", "accounting", "auditor"], ko: ["회계", "회계사", "회계 직무", "세무"] }, oscaCodes: ["211131"], studyConceptId: "accounting" }),
  candidate({ id: "business-analyst", slug: "business-analyst", categoryId: "business-finance", label: { en: "Business Analyst", ko: "비즈니스 분석가" }, aliases: { en: ["business analyst", "business analytics", "ba"], ko: ["비즈니스 분석", "비즈니스 분석가", "사업 분석"] }, oscaCodes: ["273232"], studyConceptId: "business-analytics" }),

  candidate({ id: "solicitor", slug: "solicitor", categoryId: "law-public-service", label: { en: "Solicitor", ko: "변호사" }, aliases: { en: ["solicitor", "lawyer", "law"], ko: ["변호사", "법률", "로스쿨", "법학"] }, oscaCodes: ["281331"], studyConceptId: "law" }),
  candidate({ id: "policy-analyst", slug: "policy-analyst", categoryId: "law-public-service", label: { en: "Policy Analyst", ko: "정책 분석가" }, aliases: { en: ["policy analyst", "government policy", "public policy"], ko: ["정책", "정책 분석", "정책 분석가", "공공정책"] }, oscaCodes: ["223332"] }),

  candidate({ id: "early-childhood-educator", slug: "early-childhood-educator", categoryId: "education-community", label: { en: "Early Childhood Educator", ko: "유아교육 보육교사" }, aliases: { en: ["early childhood educator", "childcare", "child care", "educator"], ko: ["차일드 케어", "차일드케어", "보육교사", "유아교육", "어린이집 교사"] }, oscaCodes: ["431132"], studyConceptId: "early-childhood" }),
  candidate({ id: "early-childhood-teacher", slug: "early-childhood-teacher", categoryId: "education-community", label: { en: "Early Childhood Teacher", ko: "유아교사" }, aliases: { en: ["early childhood teacher", "preschool teacher", "kindergarten teacher"], ko: ["유아교사", "유치원 교사", "유아 선생님"] }, oscaCodes: ["251131"], studyConceptId: "early-childhood" }),
  candidate({ id: "social-worker", slug: "social-worker", categoryId: "education-community", label: { en: "Social Worker", ko: "사회복지사" }, aliases: { en: ["social worker", "social work", "community worker"], ko: ["사회복지사", "사회복지", "소셜 워커"] }, oscaCodes: ["261331"], studyConceptId: "community-welfare" }),

  candidate({ id: "environmental-scientist", slug: "environmental-scientist", categoryId: "environment-agriculture", label: { en: "Environmental Scientist", ko: "환경 과학자" }, aliases: { en: ["environmental scientist", "environmental science", "environment consultant"], ko: ["환경", "환경 과학", "환경 과학자", "환경 컨설턴트"] }, oscaCodes: ["244431", "244432", "244499"], studyConceptId: "environmental-science" }),
  candidate({ id: "agricultural-scientist", slug: "agricultural-scientist", categoryId: "environment-agriculture", label: { en: "Agricultural Scientist", ko: "농업 과학자" }, aliases: { en: ["agricultural scientist", "agriculture", "agronomist"], ko: ["농업", "농업 과학", "농업 과학자", "농학"] }, oscaCodes: ["244131", "244132"], studyConceptId: "agriculture" }),

  candidate({ id: "ui-ux-designer", slug: "ui-ux-designer", categoryId: "creative-media", label: { en: "UI / UX Designer", ko: "UI·UX 디자이너" }, aliases: { en: ["ux designer", "ui designer", "product designer", "user experience"], ko: ["ux", "ui", "uiux", "ux 디자이너", "프로덕트 디자이너"] }, oscaCodes: ["242132"], studyConceptId: "design-media" }),
  candidate({ id: "film-media", slug: "film-media", categoryId: "creative-media", label: { en: "Film & Media", ko: "영상·미디어 제작" }, aliases: { en: ["film", "media", "video production", "film producer", "video editor"], ko: ["영상", "영화", "미디어", "영상 제작", "영화 제작"] }, oscaCodes: ["231434", "231499"], studyConceptId: "photography-film" }),

  candidate({ id: "beauty-therapist", slug: "beauty-therapist", categoryId: "beauty-wellness", label: { en: "Beauty Therapist", ko: "뷰티 테라피스트" }, aliases: { en: ["beauty", "beautician", "beauty therapist", "skin care"], ko: ["뷰티", "피부관리", "피부 관리사", "에스테티션", "뷰티 테라피스트"] }, oscaCodes: ["461131"], studyConceptId: "beauty-wellness" }),
  candidate({ id: "make-up-artist", slug: "make-up-artist", categoryId: "beauty-wellness", label: { en: "Make-up Artist", ko: "메이크업 아티스트" }, aliases: { en: ["makeup", "make-up", "makeup artist", "make-up artist"], ko: ["메이크업", "메이크업 아티스트", "분장"] }, oscaCodes: ["461232"], studyConceptId: "beauty-wellness" }),

  candidate({ id: "chef", slug: "chef", categoryId: "hospitality-retail", label: { en: "Chef", ko: "셰프·조리사" }, aliases: { en: ["chef", "cook", "commercial cookery", "culinary"], ko: ["셰프", "요리사", "조리사", "요리"] }, oscaCodes: ["321131"], studyConceptId: "culinary-arts" }),
  candidate({ id: "hospitality-manager", slug: "hospitality-manager", categoryId: "hospitality-retail", label: { en: "Hospitality Manager", ko: "호스피탈리티 매니저" }, aliases: { en: ["hospitality manager", "hotel manager", "restaurant manager", "cafe manager"], ko: ["호스피탈리티", "호텔 매니저", "레스토랑 매니저", "카페 매니저"] }, oscaCodes: ["161131", "161231", "161999"], studyConceptId: "hospitality-management" }),

  candidate({ id: "automotive-technician", slug: "automotive-technician", categoryId: "transport-logistics", label: { en: "Automotive Technician", ko: "자동차 정비사" }, aliases: { en: ["automotive technician", "mechanic", "motor mechanic", "automotive"], ko: ["자동차 정비", "자동차 정비사", "카센터", "메카닉"] }, oscaCodes: ["351131"], studyConceptId: "automotive" }),
  candidate({ id: "logistics-coordinator", slug: "logistics-coordinator", categoryId: "transport-logistics", label: { en: "Logistics Coordinator", ko: "물류 코디네이터" }, aliases: { en: ["logistics", "logistics coordinator", "supply chain", "freight"], ko: ["물류", "물류 코디네이터", "공급망", "로지스틱스"] }, oscaCodes: ["571131"] }),
] as const satisfies readonly AustraliaRouteCandidate[]

export const AU_ROUTE_CANDIDATE_BY_ID = new Map(AU_ROUTE_CANDIDATES.map((candidate) => [candidate.id, candidate]))

export function getAustraliaRouteCandidate(idOrSlug: string) {
  const raw = idOrSlug.trim().toLowerCase()
  const normalized = normalizeRouteQuery(idOrSlug)
  return AU_ROUTE_CANDIDATES.find((candidate) =>
    candidate.id === raw ||
    candidate.slug === raw ||
    [candidate.label.en, candidate.label.ko, ...candidate.aliases.en, ...candidate.aliases.ko]
      .some((value) => normalizeRouteQuery(value) === normalized),
  ) ?? null
}

export function getRouteCategory(categoryId: RouteCategoryId) {
  return AU_ROUTE_CATEGORIES.find((category) => category.id === categoryId)
}

export function normalizeRouteQuery(value: string) {
  return value.normalize("NFKD").toLowerCase().replace(/[^a-z0-9\u1100-\u11ff\u3131-\u318e\uac00-\ud7a3]+/gi, " ").trim()
}

/** Search is intentionally forgiving, but results remain canonical route intents. */
export function findAustraliaRouteCandidates(query: string, limit = 8) {
  const normalized = normalizeRouteQuery(query)
  if (!normalized) return []

  const terms = normalized.split(" ").filter(Boolean)
  return AU_ROUTE_CANDIDATES
    .map((candidate) => {
      const searchable = [candidate.label.en, candidate.label.ko, ...candidate.aliases.en, ...candidate.aliases.ko]
        .map(normalizeRouteQuery)
      const score = searchable.reduce((best, value) => {
        if (value === normalized) return Math.max(best, 100)
        if (value.startsWith(normalized)) return Math.max(best, 80)
        if (terms.every((term) => value.includes(term))) return Math.max(best, 60)
        return best
      }, 0)
      return { candidate, score }
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.candidate.label.en.localeCompare(b.candidate.label.en))
    .slice(0, limit)
    .map((item) => item.candidate)
}
