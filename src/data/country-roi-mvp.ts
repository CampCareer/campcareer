export type FieldKey = "software" | "data" | "nursing" | "engineering" | "business"
export type BudgetKey = "lean" | "balanced" | "premium"
export type GoalKey = "salary" | "immigration" | "low-cost"

export type DataConfidence = "official" | "market-estimate" | "internal-estimate"

export type DataSource = {
  confidence: DataConfidence
  sourceName: string
  sourceUrl?: string
  lastChecked: string
  note: string
}

export type CountryRoiInsight = {
  code: string
  name: string
  href: string
  cities: string
  policy: string
  initialBudget: string
  rent: string
  tax: string
  bestMajors: string[]
  salaries: {
    first: string
    year3: string
    year5: string
    year10: string
  }
  score: Record<FieldKey, number>
  goalFit: Record<GoalKey, number>
  budgetFit: Record<BudgetKey, number>
  sources: {
    salary: DataSource
    tax: DataSource
    rent: DataSource
    budget: DataSource
    policy: DataSource
  }
}

export const COUNTRY_ROI_DATA_META = {
  version: "country-roi-mvp-2026-07-09",
  lastUpdated: "2026-07-09",
  displayCurrency: "USD",
  note:
    "Landing figures are directional previews for comparison. Official policy sources are separated from market and internal estimates.",
} as const

export const FIELD_OPTIONS: Record<FieldKey, string> = {
  software: "Computer Science",
  data: "Data / AI",
  nursing: "Nursing",
  engineering: "Engineering",
  business: "Business Analytics",
}

export const BUDGET_OPTIONS: Record<BudgetKey, string> = {
  lean: "Under US$35k",
  balanced: "US$35k-60k",
  premium: "US$60k+",
}

export const GOAL_OPTIONS: Record<GoalKey, string> = {
  salary: "Highest salary",
  immigration: "Immigration pathway",
  "low-cost": "Lower total cost",
}

const SHARED_ESTIMATE_NOTE =
  "Directional landing estimate; validate with country detail pages before making decisions."

const methodologySource: DataSource = {
  confidence: "internal-estimate",
  sourceName: "CampCareer methodology",
  sourceUrl: "/methodology",
  lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
  note: SHARED_ESTIMATE_NOTE,
}

const taxEstimateSource: DataSource = {
  confidence: "internal-estimate",
  sourceName: "CampCareer simplified tax model",
  sourceUrl: "/methodology",
  lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
  note: "Simplified single-filer estimate; credits, deductions, and local rules are not fully modelled.",
}

const rentEstimateSource: DataSource = {
  confidence: "market-estimate",
  sourceName: "City rent estimate",
  sourceUrl: "/methodology",
  lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
  note: "Monthly shared/student housing proxy derived from city-level rent assumptions.",
}

export const COUNTRY_ROI_INSIGHTS: CountryRoiInsight[] = [
  {
    code: "AU",
    name: "Australia",
    href: "/au",
    cities: "Sydney, Melbourne, Brisbane",
    policy: "Post-study work route + skilled occupation pathways",
    initialBudget: "US$43k-68k",
    rent: "US$1,250/mo",
    tax: "25-30% effective",
    bestMajors: ["Nursing", "Software Engineering", "Civil Engineering"],
    salaries: {
      first: "US$55k",
      year3: "US$68k",
      year5: "US$82k",
      year10: "US$112k",
    },
    score: { software: 88, data: 84, nursing: 94, engineering: 86, business: 76 },
    goalFit: { salary: 83, immigration: 91, "low-cost": 63 },
    budgetFit: { lean: 54, balanced: 82, premium: 91 },
    sources: {
      salary: methodologySource,
      tax: taxEstimateSource,
      rent: rentEstimateSource,
      budget: methodologySource,
      policy: {
        confidence: "official",
        sourceName: "Australian Department of Home Affairs",
        sourceUrl: "https://immi.homeaffairs.gov.au/visas/working-in-australia/skill-occupation-list",
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        note: "Skilled occupation list and skilled migration pathway reference.",
      },
    },
  },
  {
    code: "CA",
    name: "Canada",
    href: "/ca",
    cities: "Toronto, Vancouver, Calgary",
    policy: "PGWP + province nomination options",
    initialBudget: "US$38k-64k",
    rent: "US$1,150/mo",
    tax: "22-29% effective",
    bestMajors: ["Data Science", "Nursing", "Accounting"],
    salaries: {
      first: "US$50k",
      year3: "US$63k",
      year5: "US$78k",
      year10: "US$104k",
    },
    score: { software: 86, data: 89, nursing: 91, engineering: 79, business: 82 },
    goalFit: { salary: 78, immigration: 93, "low-cost": 70 },
    budgetFit: { lean: 61, balanced: 86, premium: 88 },
    sources: {
      salary: methodologySource,
      tax: taxEstimateSource,
      rent: rentEstimateSource,
      budget: methodologySource,
      policy: {
        confidence: "official",
        sourceName: "IRCC post-graduation work permit",
        sourceUrl: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation/about.html",
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        note: "PGWP eligibility and post-study work reference.",
      },
    },
  },
  {
    code: "DE",
    name: "Germany",
    href: "/de",
    cities: "Munich, Berlin, Hamburg",
    policy: "Low tuition + EU Blue Card route",
    initialBudget: "US$18k-36k",
    rent: "US$850/mo",
    tax: "30-38% effective",
    bestMajors: ["Engineering", "Computer Science", "Renewable Energy"],
    salaries: {
      first: "US$48k",
      year3: "US$62k",
      year5: "US$76k",
      year10: "US$101k",
    },
    score: { software: 83, data: 81, nursing: 68, engineering: 92, business: 72 },
    goalFit: { salary: 74, immigration: 82, "low-cost": 92 },
    budgetFit: { lean: 91, balanced: 90, premium: 72 },
    sources: {
      salary: methodologySource,
      tax: taxEstimateSource,
      rent: rentEstimateSource,
      budget: methodologySource,
      policy: {
        confidence: "official",
        sourceName: "Make it in Germany EU Blue Card",
        sourceUrl: "https://www.make-it-in-germany.com/en/visa-residence/types/eu-blue-card",
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        note: "EU Blue Card work-residence pathway reference.",
      },
    },
  },
  {
    code: "UK",
    name: "United Kingdom",
    href: "/uk",
    cities: "London, Manchester, Edinburgh",
    policy: "Graduate route + skilled worker sponsorship",
    initialBudget: "US$41k-78k",
    rent: "US$1,300/mo",
    tax: "24-33% effective",
    bestMajors: ["Finance", "AI", "Life Sciences"],
    salaries: {
      first: "US$48k",
      year3: "US$61k",
      year5: "US$77k",
      year10: "US$108k",
    },
    score: { software: 82, data: 87, nursing: 76, engineering: 78, business: 88 },
    goalFit: { salary: 82, immigration: 70, "low-cost": 58 },
    budgetFit: { lean: 48, balanced: 75, premium: 92 },
    sources: {
      salary: methodologySource,
      tax: taxEstimateSource,
      rent: rentEstimateSource,
      budget: methodologySource,
      policy: {
        confidence: "official",
        sourceName: "GOV.UK Graduate visa",
        sourceUrl: "https://www.gov.uk/graduate-visa",
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        note: "Graduate route and post-study stay reference.",
      },
    },
  },
  {
    code: "NL",
    name: "Netherlands",
    href: "/nl",
    cities: "Amsterdam, Eindhoven, Rotterdam",
    policy: "Orientation year + highly skilled migrant route",
    initialBudget: "US$29k-54k",
    rent: "US$1,050/mo",
    tax: "28-36% effective",
    bestMajors: ["Data Science", "Engineering", "Logistics"],
    salaries: {
      first: "US$49k",
      year3: "US$64k",
      year5: "US$80k",
      year10: "US$109k",
    },
    score: { software: 84, data: 88, nursing: 67, engineering: 86, business: 80 },
    goalFit: { salary: 80, immigration: 77, "low-cost": 75 },
    budgetFit: { lean: 68, balanced: 84, premium: 83 },
    sources: {
      salary: methodologySource,
      tax: taxEstimateSource,
      rent: rentEstimateSource,
      budget: methodologySource,
      policy: {
        confidence: "official",
        sourceName: "IND orientation year",
        sourceUrl: "https://ind.nl/en/residence-permits/work/residence-permit-for-orientation-year",
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        note: "Orientation year after graduation, doctorate, or research reference.",
      },
    },
  },
]
