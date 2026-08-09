const INDEXABLE_UK_PROGRAM_SLUGS = `
aston-university-civil-engineering-meng
aston-university-civil-infrastructure-engineering-msc
aston-university-computer-science-bsc
aston-university-cybersecurity-bsc
aston-university-electronic-engineering-and-computer-science-beng
aston-university-electronic-engineering-and-computer-science-meng
aston-university-finance-bsc
aston-university-finance-msc
aston-university-mechanical-engineering-beng
aston-university-mechanical-engineering-msc
brunel-university-of-london-accounting-and-business-management-msc
brunel-university-of-london-business-computing-bsc
brunel-university-of-london-civil-engineering-meng
brunel-university-of-london-computer-science-bsc
brunel-university-of-london-computer-science-cybersecurity-bsc
brunel-university-of-london-computer-science-network-computing-bsc
brunel-university-of-london-computer-science-software-engineering-bsc
brunel-university-of-london-electronic-and-electrical-engineering-meng
brunel-university-of-london-finance-and-accounting-bsc
brunel-university-of-london-finance-and-accounting-msc
brunel-university-of-london-finance-and-investment-msc
brunel-university-of-london-mathematics-for-data-science-bsc
brunel-university-of-london-mechanical-engineering-beng
brunel-university-of-london-mechanical-engineering-meng
brunel-university-of-london-occupational-therapy-bsc
brunel-university-of-london-occupational-therapy-pre-registration-msci
brunel-university-of-london-physiotherapy-bsc
cardiff-university-ai-cyber-security-msc
cardiff-university-ai-data-science-msc
cardiff-university-architecture-bsc
cardiff-university-bachelor-of-nursing-adult-autumn-intake-bn
cardiff-university-civil-and-environmental-engineering-meng
cardiff-university-computer-science-bsc
cardiff-university-cyber-security-msc
cardiff-university-data-science-and-analytics-msc
cardiff-university-electrical-and-electronic-engineering-meng
cardiff-university-mechanical-engineering-meng
cardiff-university-pharmacy-mpharm
city-st-georges-university-of-london-diagnostic-radiography-bsc-hons
city-st-georges-university-of-london-midwifery-bmid-hons
city-st-georges-university-of-london-occupational-therapy-bsc-hons
city-st-georges-university-of-london-physiotherapy-bsc-hons
city-st-georges-university-of-london-therapeutic-radiography-bsc-hons
lancaster-university-ecology-conservation-msci-c184-2026
loughborough-university-advanced-manufacturing-engineering-management-msc-2026
loughborough-university-chemical-engineering-beng-h805-2026
queen-s-university-belfast-media-broadcast-production-ba-p310
queen-s-university-belfast-midwifery-bsc-b720
queen-s-university-belfast-pharmacy-mpharm-b230
queen-s-university-belfast-social-work-bsw-l500
queen-s-university-belfast-software-engineering-meng-g602
swansea-university-environmental-science-climate-emergency-bsc-f770
ulster-university-community-youth-work-bsc-l521-2026
ulster-university-computer-science-beng-41242-2026
ulster-university-computing-technologies-bsc-g500-2026
university-college-london-early-years-eyitt-mainstream-pgce-2026
university-college-london-primary-pgce-2026
university-college-london-science-biology-pgce-2026
university-of-edinburgh-counselling-interpersonal-dialogue-mcouns-2026
university-of-hertfordshire-digital-marketing-msc-2026
university-of-hertfordshire-graphic-design-ba-hons-2026
university-of-hertfordshire-human-resource-management-ma-2026
university-of-hertfordshire-interior-architecture-design-ba-hons-2026
university-of-hertfordshire-supply-chain-logistics-management-msc-2026
university-of-hertfordshire-three-d-animation-visual-effects-ba-hons-2027
university-of-leicester-creative-computing-foundation-year-bsc-g993-2026
university-of-nottingham-industrial-engineering-operations-management-msc-2026
university-of-reading-agriculture-bsc-d400-2026
university-of-reading-food-technology-bioprocessing-bsc-d622-2026
university-of-reading-primary-pgce-special-educational-needs-2vd7-2026
university-of-strathclyde-information-management-msc-2026
university-of-surrey-international-event-management-bsc-2026
university-of-surrey-international-hospitality-management-bsc-2026
university-of-surrey-international-tourism-management-bsc-2026
university-of-york-human-centred-interactive-technologies-msc-2026
`.trim().split("\n")

const INDEXABLE_SET = new Set(INDEXABLE_UK_PROGRAM_SLUGS)

export function ukProgramDetailPath(slug: string) {
  return `/programs/uk/${slug}`
}

export function isIndexableUkProgramSlug(slug: string) {
  return INDEXABLE_SET.has(slug)
}

export const INDEXABLE_UK_PROGRAM_PATHS = INDEXABLE_UK_PROGRAM_SLUGS.map(ukProgramDetailPath)
export const INDEXABLE_UK_PROGRAM_COUNT = INDEXABLE_UK_PROGRAM_SLUGS.length
