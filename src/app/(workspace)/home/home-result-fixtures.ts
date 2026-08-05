import type { FormValues } from "./home-search-config"

export type NextStep = {
  title: string
  description: string
  actionLabel: string
  actionTarget: string
}

export type PathwayFixture = {
  type: "Best fit" | "Lower cost" | "Faster route"
  title: string
  cost: string
  time: string
  requirement: string
}

type PathwayFixtureGroup = {
  country: string
  field: string
  pathways: readonly PathwayFixture[]
}

/** Deliberately small UI fixtures for the generic Home result states. */
export const HOME_PATHWAY_FIXTURES: readonly PathwayFixtureGroup[] = [
  {
    country: "AU",
    field: "nursing",
    pathways: [
      { type: "Best fit", title: "Bachelor of Nursing → Registered Nurse", cost: "A$180k–220k", time: "3–4 years", requirement: "English + approved program" },
      { type: "Lower cost", title: "Public university Nursing degree → Registered Nurse", cost: "A$130k–170k", time: "3–4 years", requirement: "Approved program + clinical placement" },
      { type: "Faster route", title: "Accelerated Nursing degree → Registered Nurse", cost: "A$190k–230k", time: "2.5–3 years", requirement: "Recognised prior study" },
    ],
  },
]

export const NEXT_STEPS_BY_STATUS: Record<string, NextStep> = {
  "no-field": { title: "Explore fields that match your goals", description: "Compare study options, job prospects and visa potential before choosing a field.", actionLabel: "Explore fields", actionTarget: "explore-fields" },
  "choosing-school": { title: "Compare programs and universities", description: "Review tuition, duration, entry requirements and career outcomes before choosing a program.", actionLabel: "Compare programs", actionTarget: "compare-programs" },
  "preparing-application": { title: "Prepare your application", description: "Check entry requirements, documents, English scores and application deadlines.", actionLabel: "Check requirements", actionTarget: "check-requirements" },
  "already-qualified": { title: "Check qualification recognition", description: "Confirm whether your existing qualification is recognised and whether registration, licensing or further study is required.", actionLabel: "Check recognition steps", actionTarget: "check-recognition" },
  "looking-for-job": { title: "Confirm your employment route", description: "Check work eligibility, target suitable employers and verify whether sponsorship or another work route is required.", actionLabel: "Review employment route", actionTarget: "review-employment-route" },
  "preparing-visa": { title: "Prepare your visa pathway", description: "Review visa eligibility, required documents, estimated costs and key deadlines.", actionLabel: "Review visa steps", actionTarget: "review-visa-steps" },
}

const GENERIC_REQUIREMENTS_BY_STATUS: Record<string, readonly string[]> = {
  "no-field": ["Job prospects", "Study length", "Estimated cost", "Visa potential"],
  "choosing-school": ["Tuition and total study cost", "Program duration", "Entry requirements", "Accreditation"],
  "preparing-application": ["Application documents", "English language requirement", "Application deadlines", "Prerequisites"],
  "already-qualified": ["Qualification assessment", "Professional registration or licensing", "English language evidence", "Additional study or supervised practice"],
  "looking-for-job": ["Current work eligibility", "Occupation and employer requirements", "Sponsorship availability", "Registration or licensing", "Visa timing"],
  "preparing-visa": ["Visa eligibility", "Financial capacity", "Required documents", "Health insurance", "Key deadlines"],
}

const AU_NURSING_REQUIREMENTS_BY_STATUS: Record<string, readonly string[]> = {
  "no-field": GENERIC_REQUIREMENTS_BY_STATUS["no-field"],
  "choosing-school": ["Approved nursing program", "Program accreditation", "English language requirement", "Clinical placement requirements", "Student visa eligibility"],
  "preparing-application": ["Application documents", "English language requirement", "Prerequisite subjects", "Clinical placement requirements", "Application deadlines"],
  "already-qualified": ["AHPRA/NMBA qualification assessment", "English language evidence", "Identity and registration documents", "Possible additional study or supervised practice"],
  "looking-for-job": ["Current nursing registration", "Work eligibility", "Employer requirements", "Sponsorship availability", "Current occupation and visa rules"],
  "preparing-visa": ["Student visa eligibility", "Financial capacity", "Required documents", "Health insurance", "Key deadlines"],
}

export function getPathwayFixtures(query: FormValues) {
  return HOME_PATHWAY_FIXTURES.find((fixture) => fixture.country === query.country && fixture.field === query.field)?.pathways ?? []
}

export function getKeyRequirements(query: FormValues) {
  if (query.country === "AU" && query.field === "nursing") return AU_NURSING_REQUIREMENTS_BY_STATUS[query.status] ?? []
  return GENERIC_REQUIREMENTS_BY_STATUS[query.status] ?? []
}
