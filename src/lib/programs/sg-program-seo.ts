export function sgProgramDetailPath(slug:string){return `/programs/sg/${slug}`}

export const INDEXABLE_SG_PROGRAM_SLUGS = [
  "singapore-university-of-social-sciences-bachelor-of-accountancy-bachelor",
  "singapore-university-of-social-sciences-bachelor-of-arts-in-chinese-studies-bachelor",
  "singapore-university-of-social-sciences-bachelor-of-early-childhood-education-bachelor",
  "singapore-university-of-social-sciences-bachelor-of-human-resource-management-bachelor",
  "singapore-university-of-social-sciences-bachelor-of-public-safety-and-security-bachelor",
  "singapore-university-of-social-sciences-bachelor-of-science-in-business-analytics-bachelor",
  "singapore-university-of-social-sciences-bachelor-of-science-in-finance-bachelor",
  "singapore-university-of-social-sciences-bachelor-of-science-in-information-and-communication-technology-bachelor",
  "singapore-university-of-social-sciences-bachelor-of-science-in-marketing-bachelor",
  "singapore-university-of-social-sciences-bachelor-of-science-in-psychology-bachelor",
  "singapore-university-of-social-sciences-bachelor-of-science-in-supply-chain-management-bachelor",
  "singapore-university-of-social-sciences-bachelor-of-social-work-bachelor",
] as const

const INDEXABLE_SG_PROGRAM_SLUG_SET=new Set<string>(INDEXABLE_SG_PROGRAM_SLUGS)
export function isIndexableSgProgramSlug(slug:string){return INDEXABLE_SG_PROGRAM_SLUG_SET.has(slug)}
export const INDEXABLE_SG_PROGRAM_PATHS=INDEXABLE_SG_PROGRAM_SLUGS.map(sgProgramDetailPath)
