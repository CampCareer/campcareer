import { programDetailPath } from "./program-search"

export type IndexableAuProgram = {
  id: number
  title: string
  sourceCheckedAt: string
}

/**
 * Australian program pages that have an active CRICOS record and a verified
 * official program URL. Keep this explicit so sitemap/indexing never expands
 * to the entire catalogue without source review.
 */
export const INDEXABLE_AU_PROGRAMS: readonly IndexableAuProgram[] = [
  { id: 1, title: "Bachelor of Arts", sourceCheckedAt: "2026-07-30" },
  { id: 3, title: "Bachelor of Economics", sourceCheckedAt: "2026-07-30" },
  { id: 4, title: "Bachelor of Science", sourceCheckedAt: "2026-07-30" },
  { id: 8, title: "Master of Business Analytics", sourceCheckedAt: "2026-07-30" },
  { id: 31, title: "Bachelor of Medical Sciences", sourceCheckedAt: "2026-07-30" },
  { id: 36, title: "Bachelor of Applied Finance", sourceCheckedAt: "2026-07-30" },
  { id: 38, title: "Master of Clinical Audiology", sourceCheckedAt: "2026-07-30" },
  { id: 40, title: "Bachelor of Chiropractic Science", sourceCheckedAt: "2026-07-30" },
  { id: 48, title: "Master of Speech and Language Pathology", sourceCheckedAt: "2026-07-30" },
  { id: 51, title: "Bachelor of Education (Primary)", sourceCheckedAt: "2026-07-30" },
  { id: 53, title: "Bachelor of Information Technology", sourceCheckedAt: "2026-07-30" },
  { id: 63, title: "Bachelor of Planning", sourceCheckedAt: "2026-07-30" },
  { id: 74, title: "Bachelor of Biodiversity and Conservation", sourceCheckedAt: "2026-07-30" },
  { id: 78, title: "Bachelor of Environment", sourceCheckedAt: "2026-07-30" },
  { id: 93, title: "Bachelor of Business Analytics", sourceCheckedAt: "2026-07-30" },
  { id: 98, title: "Master of Data Science", sourceCheckedAt: "2026-07-30" },
  { id: 166, title: "Master of Creative Writing", sourceCheckedAt: "2026-07-30" },
  { id: 749, title: "Master of Cybersecurity", sourceCheckedAt: "2026-07-30" },
  { id: 802, title: "Bachelor of Architectural Design", sourceCheckedAt: "2026-07-30" },
  { id: 804, title: "Bachelor of Physiotherapy (Honours)", sourceCheckedAt: "2026-07-30" },
  { id: 823, title: "Bachelor of Nursing", sourceCheckedAt: "2026-07-18" },
  { id: 856, title: "Bachelor of Computer Science", sourceCheckedAt: "2026-07-30" },
  { id: 988, title: "Bachelor of Paramedicine", sourceCheckedAt: "2026-07-30" },
  { id: 1407, title: "Master of Nursing (Graduate Entry)", sourceCheckedAt: "2026-07-30" },
  { id: 1477, title: "Bachelor of Dental Science (Honours)", sourceCheckedAt: "2026-07-30" },
  { id: 1486, title: "Bachelor of Veterinary Science (Honours)", sourceCheckedAt: "2026-07-30" },
  { id: 1748, title: "Bachelor of Science - Computer Science", sourceCheckedAt: "2026-07-30" },
  { id: 1810, title: "Bachelor of Engineering (Honours)", sourceCheckedAt: "2026-07-30" },
  { id: 2202, title: "Master of Business Analytics", sourceCheckedAt: "2026-07-30" },
  { id: 2936, title: "Bachelor of Nursing", sourceCheckedAt: "2026-07-30" },
  { id: 3826, title: "Bachelor of Nursing", sourceCheckedAt: "2026-07-30" },
  { id: 4016, title: "Bachelor of Nursing (Graduate Entry)", sourceCheckedAt: "2026-07-30" },
  { id: 4018, title: "Bachelor of Nursing (Pre-Registration)", sourceCheckedAt: "2026-07-30" },
  { id: 4702, title: "Master of Social Work", sourceCheckedAt: "2026-07-30" },
  { id: 4723, title: "Master of Food Science", sourceCheckedAt: "2026-07-30" },
  { id: 4885, title: "Master of Teaching (Early Childhood and Primary)", sourceCheckedAt: "2026-07-30" },
  { id: 4901, title: "Bachelor of Fine Arts (Film and Television)", sourceCheckedAt: "2026-07-30" },
  { id: 5589, title: "Bachelor of Social Work (Honours)", sourceCheckedAt: "2026-07-30" },
  { id: 5681, title: "Master of Engineering (Civil Engineering)", sourceCheckedAt: "2026-07-30" },
  { id: 5785, title: "Bachelor of Engineering (Mechanical Engineering) (Honours)", sourceCheckedAt: "2026-07-30" },
  { id: 5797, title: "Bachelor of Applied Science (Aviation)", sourceCheckedAt: "2026-07-30" },
  { id: 5818, title: "Bachelor of Nursing", sourceCheckedAt: "2026-07-30" },
  { id: 5822, title: "Bachelor of Cyber Security", sourceCheckedAt: "2026-07-30" },
  { id: 5955, title: "Bachelor of Nursing", sourceCheckedAt: "2026-07-30" },
  { id: 6583, title: "Bachelor of Nursing", sourceCheckedAt: "2026-07-30" },
  { id: 7291, title: "Bachelor of Science (Nursing)", sourceCheckedAt: "2026-07-30" },
  { id: 7329, title: "Master of Nursing (Graduate Entry)", sourceCheckedAt: "2026-07-30" },
  { id: 7518, title: "Bachelor of Nursing", sourceCheckedAt: "2026-07-30" },
  { id: 7532, title: "Master of Nursing Practice (Pre-Registration)", sourceCheckedAt: "2026-07-30" },
  { id: 7935, title: "Bachelor of Nursing", sourceCheckedAt: "2026-07-30" },
  { id: 8013, title: "Bachelor of Nursing", sourceCheckedAt: "2026-07-30" },
  { id: 8416, title: "Bachelor of Nursing Science: Graduate Entry", sourceCheckedAt: "2026-07-30" },
  { id: 8428, title: "Bachelor of Nursing Science", sourceCheckedAt: "2026-07-30" },
]

const INDEXABLE_AU_PROGRAM_IDS = new Set(INDEXABLE_AU_PROGRAMS.map((program) => program.id))

export function isIndexableAuProgramId(id: number) {
  return INDEXABLE_AU_PROGRAM_IDS.has(id)
}

export function indexableAuProgramPath(program: Pick<IndexableAuProgram, "id" | "title">) {
  return programDetailPath(program.id, program.title)
}
