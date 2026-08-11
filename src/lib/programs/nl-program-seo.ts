const INDEXABLE_NL_PROGRAM_SLUGS = `
maastricht-university-maastricht-data-science-ai
radboud-university-radboud-artificial-intelligence
radboud-university-radboud-computing-science
tilburg-university-tilburg-economics
tilburg-university-tilburg-international-business-administration
university-of-amsterdam-uva-business-analytics
university-of-groningen-rug-artificial-intelligence
university-of-twente-utwente-business-information-technology
university-of-twente-utwente-chemical-science-engineering
university-of-twente-utwente-civil-engineering
university-of-twente-utwente-communication-science
university-of-twente-utwente-creative-technology
university-of-twente-utwente-electrical-engineering
university-of-twente-utwente-industrial-design-engineering
university-of-twente-utwente-industrial-engineering-management
university-of-twente-utwente-international-business-administration
university-of-twente-utwente-mechanical-engineering
university-of-twente-utwente-technical-computer-science
wageningen-university-and-research-wur-animal-sciences
wageningen-university-and-research-wur-data-science-global-challenges
wageningen-university-and-research-wur-earth-system-sciences
wageningen-university-and-research-wur-environmental-sciences
wageningen-university-and-research-wur-food-technology
wageningen-university-and-research-wur-international-land-water-management
wageningen-university-and-research-wur-marine-sciences
wageningen-university-and-research-wur-tourism-joint-degree
`.trim().split("\n")

const INDEXABLE_SET = new Set(INDEXABLE_NL_PROGRAM_SLUGS)

export function nlProgramDetailPath(slug: string) {
  return `/programs/nl/${slug}`
}

export function isIndexableNlProgramSlug(slug: string) {
  return INDEXABLE_SET.has(slug)
}

export const INDEXABLE_NL_PROGRAM_PATHS = INDEXABLE_NL_PROGRAM_SLUGS.map(nlProgramDetailPath)
export const INDEXABLE_NL_PROGRAM_COUNT = INDEXABLE_NL_PROGRAM_SLUGS.length
