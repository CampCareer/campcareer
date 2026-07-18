/**
 * The second Australian university cohort: the 32 institutions outside the
 * QS top-10 seed cohort. These are provider-level course finders, not guessed
 * programme pages. They let a learner continue from a CRICOS course record to
 * the relevant university's own catalogue while exact programme URLs are
 * reviewed incrementally.
 *
 * The cohort is deliberately pinned to the 42 institutions in colleges_au, so
 * import and review jobs do not silently change the scope.
 */
export type AuUniversityCatalogue = {
  institutionId: string
  providerName: string
  programmesUrl: string
  checkedAt: string
}

export const AU_PHASE_THREE_UNIVERSITY_CATALOGUES: readonly AuUniversityCatalogue[] = [
  { institutionId: "australian-catholic-university", providerName: "Australian Catholic University", programmesUrl: "https://www.acu.edu.au/study-at-acu/find-a-course", checkedAt: "2026-07-18" },
  { institutionId: "avondale-university", providerName: "Avondale University", programmesUrl: "https://www.avondale.edu.au/courses/", checkedAt: "2026-07-18" },
  { institutionId: "bond-university", providerName: "Bond University", programmesUrl: "https://bond.edu.au/study", checkedAt: "2026-07-18" },
  { institutionId: "central-queensland-university", providerName: "Central Queensland University", programmesUrl: "https://www.cqu.edu.au/courses", checkedAt: "2026-07-18" },
  { institutionId: "charles-darwin-university", providerName: "Charles Darwin University", programmesUrl: "https://www.cdu.edu.au/study", checkedAt: "2026-07-18" },
  { institutionId: "charles-sturt-university", providerName: "Charles Sturt University", programmesUrl: "https://study.csu.edu.au/courses", checkedAt: "2026-07-18" },
  { institutionId: "curtin-university", providerName: "Curtin University", programmesUrl: "https://www.curtin.edu.au/study/", checkedAt: "2026-07-18" },
  { institutionId: "deakin-university", providerName: "Deakin University", programmesUrl: "https://www.deakin.edu.au/courses", checkedAt: "2026-07-18" },
  { institutionId: "edith-cowan-university", providerName: "Edith Cowan University", programmesUrl: "https://www.ecu.edu.au/degrees/courses", checkedAt: "2026-07-18" },
  { institutionId: "federation-university-australia", providerName: "Federation University Australia", programmesUrl: "https://www.federation.edu.au/study/search/", checkedAt: "2026-07-18" },
  { institutionId: "flinders-university", providerName: "Flinders University", programmesUrl: "https://www.flinders.edu.au/study/courses", checkedAt: "2026-07-18" },
  { institutionId: "griffith-university", providerName: "Griffith University", programmesUrl: "https://www.griffith.edu.au/study/degrees", checkedAt: "2026-07-18" },
  { institutionId: "james-cook-university", providerName: "James Cook University", programmesUrl: "https://www.jcu.edu.au/courses", checkedAt: "2026-07-18" },
  { institutionId: "la-trobe-university", providerName: "La Trobe University", programmesUrl: "https://www.latrobe.edu.au/courses", checkedAt: "2026-07-18" },
  { institutionId: "murdoch-university", providerName: "Murdoch University", programmesUrl: "https://www.murdoch.edu.au/study/courses", checkedAt: "2026-07-18" },
  { institutionId: "queensland-university-of-technology", providerName: "Queensland University of Technology", programmesUrl: "https://www.qut.edu.au/courses", checkedAt: "2026-07-18" },
  { institutionId: "rmit-university", providerName: "RMIT University", programmesUrl: "https://www.rmit.edu.au/study-with-us", checkedAt: "2026-07-18" },
  { institutionId: "southern-cross-university", providerName: "Southern Cross University", programmesUrl: "https://www.scu.edu.au/study-at-scu/", checkedAt: "2026-07-18" },
  { institutionId: "swinburne-university-of-technology", providerName: "Swinburne University of Technology", programmesUrl: "https://www.swinburne.edu.au/courses/", checkedAt: "2026-07-18" },
  { institutionId: "the-university-of-south-australia", providerName: "The University of South Australia", programmesUrl: "https://study.unisa.edu.au/", checkedAt: "2026-07-18" },
  { institutionId: "the-university-of-notre-dame-australia", providerName: "The University of Notre Dame Australia", programmesUrl: "https://www.notredame.edu.au/study", checkedAt: "2026-07-18" },
  { institutionId: "torrens-university", providerName: "Torrens University", programmesUrl: "https://www.torrens.edu.au/courses", checkedAt: "2026-07-18" },
  { institutionId: "university-of-canberra", providerName: "University of Canberra", programmesUrl: "https://www.canberra.edu.au/future-students/study-at-uc/find-a-course", checkedAt: "2026-07-18" },
  { institutionId: "university-of-divinity", providerName: "University of Divinity", programmesUrl: "https://divinity.edu.au/study/", checkedAt: "2026-07-18" },
  { institutionId: "university-of-new-england", providerName: "University of New England", programmesUrl: "https://www.une.edu.au/study/courses", checkedAt: "2026-07-18" },
  { institutionId: "university-of-newcastle", providerName: "University of Newcastle", programmesUrl: "https://www.newcastle.edu.au/degrees", checkedAt: "2026-07-18" },
  { institutionId: "university-of-southern-queensland", providerName: "University of Southern Queensland", programmesUrl: "https://www.unisq.edu.au/study", checkedAt: "2026-07-18" },
  { institutionId: "university-of-tasmania", providerName: "University of Tasmania", programmesUrl: "https://www.utas.edu.au/study/undergraduate", checkedAt: "2026-07-18" },
  { institutionId: "university-of-the-sunshine-coast", providerName: "University of the Sunshine Coast", programmesUrl: "https://www.usc.edu.au/study/courses-and-programs", checkedAt: "2026-07-18" },
  { institutionId: "university-of-wollongong", providerName: "University of Wollongong", programmesUrl: "https://www.uow.edu.au/study/", checkedAt: "2026-07-18" },
  { institutionId: "victoria-university", providerName: "Victoria University", programmesUrl: "https://www.vu.edu.au/courses", checkedAt: "2026-07-18" },
  { institutionId: "western-sydney-university", providerName: "Western Sydney University", programmesUrl: "https://www.westernsydney.edu.au/future/study", checkedAt: "2026-07-18" },
]

const catalogueByInstitutionId = new Map(AU_PHASE_THREE_UNIVERSITY_CATALOGUES.map((catalogue) => [catalogue.institutionId, catalogue]))

export function getAuPhaseThreeUniversityCatalogue(institutionId: string) {
  return catalogueByInstitutionId.get(institutionId) ?? null
}
