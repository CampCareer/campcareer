import type { LocalizedText } from "@/data/route-guides"

/**
 * JSA's current labour-market profiles remain on the historical ANZSCO v1.3
 * classification while the route catalogue is on OSCA. An anchor is included
 * only where the ABS correspondence file supplies the bridge. A missing
 * anchor means the result must withhold earnings and workforce figures rather
 * than borrow a broad-field estimate.
 */
export type AuRouteProfileAnchor = {
  anzscoV13: string
  label: LocalizedText
}

export type AuRouteOverviewAnchor = {
  candidateId: string
  profiles: readonly AuRouteProfileAnchor[]
}

export type JsaShortageRating = "S" | "M" | "R" | "NS"

export type RouteOverviewShortage = {
  sourceUrl: string
  sourceAsOf: number
  checkedAt: string
  exactOccupationCount: number
  ratings: Array<{
    oscaCode: string
    title: string
    nationalRating: JsaShortageRating
    stateRatings: Record<string, JsaShortageRating>
  }>
}

export type RouteOverviewLabourProfile = {
  anzscoV13: string
  label: LocalizedText
  employmentTotal: number | null
  medianWeeklyEarningsAud: number | null
  medianHourlyEarningsAud: number | null
  partTimeSharePct: number | null
  femaleSharePct: number | null
  medianAge: number | null
  fullTimeSharePct: number | null
  averageFullTimeHours: number | null
  stateDistribution: Array<{ name: string; sharePct: number }>
  educationDistribution: Array<{ name: string; sharePct: number }>
  topEducation: { label: string; sharePct: number } | null
  sourceUrl: string
  dataAsAt: string | null
}

export type RouteOverviewSkillLevel = {
  oscaCode: string
  level: number
  sourceUrl: string
}

export type RouteOverview = {
  candidateId: string
  shortage: RouteOverviewShortage | null
  labourProfiles: RouteOverviewLabourProfile[]
  skillLevels: RouteOverviewSkillLevel[]
}

const profile = (anzscoV13: string, en: string, ko: string): AuRouteProfileAnchor => ({
  anzscoV13,
  label: { en, ko },
})

/**
 * Reviewed against ABS OSCA 2024 → ANZSCO v1.3 correspondence Table 2.
 * Data Analyst and UI / UX Designer are intentionally absent: the available
 * historical bridge is not a useful public labour-profile proxy for either
 * search intent.
 */
export const AU_ROUTE_OVERVIEW_ANCHORS: readonly AuRouteOverviewAnchor[] = [
  { candidateId: "mining-site-work", profiles: [profile("7122", "Drillers, Miners and Shot Firers", "시추·광산·발파 작업자")] },
  { candidateId: "registered-nurse", profiles: [profile("2544", "Registered Nurses", "등록 간호사")] },
  { candidateId: "software-engineer", profiles: [profile("2612", "JSA historical mapped occupation group", "JSA 과거 분류 연계 직업군")] },
  { candidateId: "early-childhood-educator", profiles: [profile("4211", "Child Carers", "보육 종사자")] },
  { candidateId: "aged-care-worker", profiles: [
    profile("4231", "Aged and Disabled Carers", "노인·장애 돌봄 종사자"),
    profile("4233", "Personal Care Assistants", "개인 돌봄 보조원"),
  ] },
  { candidateId: "chef", profiles: [profile("3513", "Chefs", "셰프·조리사")] },
  { candidateId: "disability-support-worker", profiles: [profile("4231", "Aged and Disabled Carers", "노인·장애 돌봄 종사자")] },
  { candidateId: "beauty-therapist", profiles: [profile("4511", "Beauty Therapists", "뷰티 테라피스트")] },
  { candidateId: "cyber-security-analyst", profiles: [profile("2621", "Database and Systems Administrators, and ICT Security Specialists", "데이터베이스·시스템 관리자 및 ICT 보안 전문가")] },
  { candidateId: "electrician", profiles: [profile("3411", "Electricians", "전기 기술자")] },
  { candidateId: "data-analyst", profiles: [] },
  { candidateId: "automotive-technician", profiles: [profile("3212", "Automotive Electricians and Mechanics", "자동차 전기·정비 기술자")] },
  { candidateId: "civil-engineer", profiles: [profile("2332", "Civil Engineering Professionals", "토목 엔지니어링 전문가")] },
  { candidateId: "mechanical-engineer", profiles: [profile("2335", "Industrial, Mechanical and Production Engineers", "산업·기계·생산 엔지니어")] },
  { candidateId: "accountant", profiles: [profile("2211", "Accountants", "회계사·회계 전문가")] },
  { candidateId: "business-analyst", profiles: [profile("2611", "ICT Business and Systems Analysts", "ICT 비즈니스·시스템 분석가")] },
  { candidateId: "social-worker", profiles: [profile("2725", "Social Workers", "사회복지사")] },
  { candidateId: "ui-ux-designer", profiles: [] },
]

export const AU_ROUTE_OVERVIEW_ANCHOR_BY_CANDIDATE = new Map(
  AU_ROUTE_OVERVIEW_ANCHORS.map((anchor) => [anchor.candidateId, anchor]),
)

export function getAuRouteOverviewAnchor(candidateId: string) {
  return AU_ROUTE_OVERVIEW_ANCHOR_BY_CANDIDATE.get(candidateId) ?? null
}
