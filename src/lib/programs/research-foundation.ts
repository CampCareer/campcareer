export const RESEARCH_FOUNDATION_PROGRAM_ID = "research-foundation-v1"
export const RESEARCH_FOUNDATION_PROGRAM_NAME = "CampCareer Research Foundation"

export type ResearchFoundationEvidence = {
  program_version: 1
  direction_completed: boolean
  saved_careers: number
  saved_providers: number
  saved_courses: number
  verified_at: string
}

export function meetsResearchFoundationRequirements(evidence: Omit<ResearchFoundationEvidence, "program_version" | "verified_at">) {
  return evidence.direction_completed && evidence.saved_careers >= 1 && evidence.saved_providers >= 1 && evidence.saved_courses >= 2
}
