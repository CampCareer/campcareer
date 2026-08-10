const INDEXABLE_NZ_PROGRAM_SLUGS = `
auckland-university-of-technology-aut-bhsc-midwifery
auckland-university-of-technology-aut-bhsc-nursing
auckland-university-of-technology-aut-bhsc-physiotherapy
lincoln-university-lincoln-bagrisci
lincoln-university-lincoln-benvmgmt
lincoln-university-lincoln-mtourismmgmt
massey-university-massey-bav-air-transport-pilot
massey-university-massey-bconst-construction-management
massey-university-massey-bfoodtech-hons
university-of-auckland-uoa-behons-civil-engineering
university-of-auckland-uoa-behons-software-engineering
university-of-auckland-uoa-bsc-data-science
university-of-canterbury-uc-behons-electrical-electronic
university-of-canterbury-uc-bforestrysci
university-of-canterbury-uc-bswhons
university-of-otago-otago-bmlsc
university-of-otago-otago-bpharm
university-of-otago-otago-bphysio
university-of-waikato-waikato-bbus-accounting
university-of-waikato-waikato-btchg-early-childhood
university-of-waikato-waikato-btchg-primary
victoria-university-of-wellington-vuw-bcom-hrer
victoria-university-of-wellington-vuw-bdi-communication-design
victoria-university-of-wellington-vuw-bdi-interaction-design
`.trim().split("\n")

const INDEXABLE_SET = new Set(INDEXABLE_NZ_PROGRAM_SLUGS)

export function nzProgramDetailPath(slug: string) {
  return `/programs/nz/${slug}`
}

export function isIndexableNzProgramSlug(slug: string) {
  return INDEXABLE_SET.has(slug)
}

export const INDEXABLE_NZ_PROGRAM_PATHS = INDEXABLE_NZ_PROGRAM_SLUGS.map(nzProgramDetailPath)
export const INDEXABLE_NZ_PROGRAM_COUNT = INDEXABLE_NZ_PROGRAM_SLUGS.length
