/**
 * Result-page course matching is deliberately career-specific.
 *
 * A broad study field is useful for a catalogue browse experience, but it is
 * not reliable enough to answer “what should I study for this job?”. These
 * matchers only inspect a provider's actual course title and are used by the
 * route-result study data service.
 */
export type RouteCourseMatcherKind = "course" | "training"

export type RouteCourseMatcher = {
  candidateId: string
  kind: RouteCourseMatcherKind
  /** Narrow title terms used to preselect database rows before the exact test. */
  queryTerms: readonly string[]
  /** At least one of these title phrases must be present. */
  requiredAny: readonly string[]
  /** A result must contain one recognised qualification signal. */
  qualificationAny: readonly string[]
  /** Research-only and adjacent programmes must never become route results. */
  excluded: readonly string[]
}

const STANDARD_DEGREE_SIGNALS = ["certificate", "diploma", "bachelor", "master", "graduate diploma", "graduate certificate"] as const

function courseMatcher(input: Omit<RouteCourseMatcher, "kind" | "qualificationAny" | "excluded"> & Partial<Pick<RouteCourseMatcher, "qualificationAny" | "excluded">>): RouteCourseMatcher {
  return {
    kind: "course",
    qualificationAny: STANDARD_DEGREE_SIGNALS,
    excluded: ["doctor of philosophy", "master of philosophy", "phd", "research"],
    ...input,
  }
}

/**
 * Every published Australian route has an explicit matcher. Adding a new
 * public route without one is intentionally a release failure in tests.
 */
export const AU_ROUTE_COURSE_MATCHERS: readonly RouteCourseMatcher[] = [
  {
    candidateId: "mining-site-work",
    kind: "training",
    queryTerms: [],
    requiredAny: [],
    qualificationAny: [],
    excluded: [],
  },
  courseMatcher({ candidateId: "registered-nurse", queryTerms: ["nursing"], requiredAny: ["nursing"] }),
  courseMatcher({ candidateId: "software-engineer", queryTerms: ["software engineering", "computer science"], requiredAny: ["software engineering", "computer science"] }),
  courseMatcher({ candidateId: "early-childhood-educator", queryTerms: ["early childhood"], requiredAny: ["early childhood education", "early childhood teaching", "early childhood"] }),
  courseMatcher({ candidateId: "aged-care-worker", queryTerms: ["ageing support", "individual support", "aged care"], requiredAny: ["ageing support", "individual support", "aged care"] }),
  courseMatcher({ candidateId: "chef", queryTerms: ["commercial cookery"], requiredAny: ["commercial cookery"] }),
  courseMatcher({ candidateId: "disability-support-worker", queryTerms: ["disability", "individual support"], requiredAny: ["certificate iv in disability", "disability support", "individual support"] }),
  courseMatcher({ candidateId: "beauty-therapist", queryTerms: ["beauty therapy"], requiredAny: ["beauty therapy"] }),
  courseMatcher({ candidateId: "cyber-security-analyst", queryTerms: ["cyber security", "cybersecurity"], requiredAny: ["cyber security", "cybersecurity"] }),
  courseMatcher({ candidateId: "electrician", queryTerms: ["electrotechnology", "electrician"], requiredAny: ["electrotechnology", "electrician"] }),
  courseMatcher({ candidateId: "data-analyst", queryTerms: ["data analytics", "data analysis", "data science"], requiredAny: ["data analytics", "data analysis", "data science"] }),
  courseMatcher({ candidateId: "automotive-technician", queryTerms: ["automotive", "motor mechanic", "light vehicle"], requiredAny: ["automotive", "motor mechanic", "light vehicle"] }),
  courseMatcher({ candidateId: "civil-engineer", queryTerms: ["civil engineering"], requiredAny: ["civil engineering"] }),
  courseMatcher({ candidateId: "mechanical-engineer", queryTerms: ["mechanical engineering"], requiredAny: ["mechanical engineering"] }),
  courseMatcher({ candidateId: "accountant", queryTerms: ["accounting"], requiredAny: ["accounting"] }),
  courseMatcher({ candidateId: "business-analyst", queryTerms: ["business analytics"], requiredAny: ["business analytics"] }),
  courseMatcher({ candidateId: "social-worker", queryTerms: ["social work"], requiredAny: ["social work"] }),
  courseMatcher({ candidateId: "ui-ux-designer", queryTerms: ["user experience", "interaction design", "ux design"], requiredAny: ["user experience", "interaction design", "ux design"] }),
]

export function getAuRouteCourseMatcher(candidateId: string) {
  return AU_ROUTE_COURSE_MATCHERS.find((matcher) => matcher.candidateId === candidateId) ?? null
}

export function normalizeCourseTitle(title: string) {
  return title.toLocaleLowerCase("en-AU").replace(/[^a-z0-9]+/g, " ").trim()
}

/** A title-only gate. It never falls back to a broad field or subject area. */
export function matchesExactAuRouteCourse(candidateId: string, title: string) {
  const matcher = getAuRouteCourseMatcher(candidateId)
  if (!matcher || matcher.kind !== "course") return false

  const normalized = normalizeCourseTitle(title)
  if (matcher.excluded.some((term) => normalized.includes(normalizeCourseTitle(term)))) return false
  if (!matcher.requiredAny.some((term) => normalized.includes(normalizeCourseTitle(term)))) return false
  return matcher.qualificationAny.some((term) => normalized.includes(normalizeCourseTitle(term)))
}
