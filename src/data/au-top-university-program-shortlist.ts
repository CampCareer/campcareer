/**
 * First-pass programme shortlist for the ten Australian universities in scope.
 * Every available record is paired with an active CRICOS course code; a provider
 * page is used when it has been separately verified in official-course-urls.
 * Trade pathways intentionally remain in the TAFE phase rather than being
 * represented by an unrelated university degree.
 */
export type AuProgramShortlistStatus = "available" | "vocational_available" | "tafe_phase" | "specialist_provider_phase"

export type AuProgramShortlistItem = {
  conceptId: string
  status: AuProgramShortlistStatus
  institutionId?: string
  courseCode?: string
  note?: string
}

export const AU_TOP_UNIVERSITY_PROGRAM_SHORTLIST: AuProgramShortlistItem[] = [
  { conceptId: "computer-science", status: "available", institutionId: "university-of-new-south-wales", courseCode: "015784F" },
  { conceptId: "data-analytics", status: "available", institutionId: "rmit-university", courseCode: "110801G" },
  { conceptId: "cybersecurity", status: "available", institutionId: "rmit-university", courseCode: "114324K" },
  { conceptId: "nursing", status: "available", institutionId: "monash-university", courseCode: "075119J" },
  { conceptId: "aged-care", status: "vocational_available", note: "A provider-verified TAFE pathway is available; it is not substituted with a university degree." },
  { conceptId: "allied-health", status: "available", institutionId: "monash-university", courseCode: "064804A" },
  { conceptId: "engineering", status: "available", institutionId: "university-of-new-south-wales", courseCode: "056835E" },
  { conceptId: "civil-engineering", status: "available", institutionId: "rmit-university", courseCode: "087986M" },
  { conceptId: "mechanical-engineering", status: "available", institutionId: "rmit-university", courseCode: "110991G" },
  { conceptId: "business-analytics", status: "available", institutionId: "university-of-technology-sydney", courseCode: "0100398" },
  { conceptId: "accounting", status: "available", institutionId: "monash-university", courseCode: "097256G" },
  { conceptId: "early-childhood", status: "available", institutionId: "the-university-of-melbourne", courseCode: "093002F" },
  { conceptId: "carpentry", status: "vocational_available", note: "A provider-verified Certificate III pathway is available." },
  { conceptId: "wall-floor-tiling", status: "vocational_available", note: "A provider-verified Certificate III pathway is available." },
  { conceptId: "electrical-trade", status: "vocational_available", note: "A provider-verified electrotechnology pathway is available; state licensing is separate." },
  { conceptId: "plumbing", status: "vocational_available", note: "A provider-verified Certificate III pathway is available; state licensing is separate." },
  { conceptId: "welding", status: "vocational_available", note: "The current national qualification is linked through the government training register." },
  { conceptId: "automotive", status: "vocational_available", note: "A provider-verified Certificate III pathway is available." },
  { conceptId: "hospitality-management", status: "available", institutionId: "the-university-of-queensland", courseCode: "103168H" },
  { conceptId: "architecture", status: "available", institutionId: "monash-university", courseCode: "059372G" },
  { conceptId: "design-media", status: "available", institutionId: "monash-university", courseCode: "085345E" },
  { conceptId: "environmental-science", status: "available", institutionId: "the-university-of-queensland", courseCode: "102788K" },
  { conceptId: "agriculture", status: "available", institutionId: "the-university-of-queensland", courseCode: "0100492" },
  { conceptId: "aviation", status: "available", institutionId: "rmit-university", courseCode: "111188D" },
  { conceptId: "culinary-arts", status: "vocational_available", note: "An international TAFE NSW pathway is available." },
  { conceptId: "beauty-wellness", status: "vocational_available", note: "An international TAFE NSW pathway is available." },
  { conceptId: "social-work", status: "available", institutionId: "rmit-university", courseCode: "079596C" },
  { conceptId: "dental", status: "available", institutionId: "the-university-of-queensland", courseCode: "082620D" },
  { conceptId: "law", status: "available", institutionId: "monash-university", courseCode: "080585G" },
  { conceptId: "sport-fitness", status: "available", institutionId: "the-university-of-queensland", courseCode: "082624M" },
  { conceptId: "bricklaying", status: "vocational_available", note: "A provider-verified Certificate III pathway is available." },
  { conceptId: "hvac", status: "vocational_available", note: "The current national qualification is linked through the government training register." },
  { conceptId: "maritime", status: "vocational_available", note: "The current national maritime qualification is linked through the government training register." },
  { conceptId: "mining-resources", status: "available", institutionId: "monash-university", courseCode: "076844E" },
  { conceptId: "psychology", status: "available", institutionId: "monash-university", courseCode: "108900M" },
  { conceptId: "paramedic-emergency", status: "available", institutionId: "monash-university", courseCode: "094996F" },
  { conceptId: "veterinary", status: "available", institutionId: "the-university-of-queensland", courseCode: "082631A" },
  { conceptId: "primary-secondary-education", status: "available", institutionId: "monash-university", courseCode: "083045M" },
  { conceptId: "photography-film", status: "available", institutionId: "the-university-of-melbourne", courseCode: "093584A" },
]

export function getAuProgramShortlistItem(conceptId: string) {
  return AU_TOP_UNIVERSITY_PROGRAM_SHORTLIST.find((item) => item.conceptId === conceptId) ?? null
}
