export type FieldKey = "software" | "data" | "nursing" | "engineering" | "business"
export type BudgetKey = "lean" | "balanced" | "premium"
export type GoalKey = "salary" | "immigration" | "low-cost"

export type DataConfidence = "official" | "market-estimate" | "internal-estimate"
export type DataMethod = "official-api" | "official-download" | "official-web" | "market-estimate" | "internal-methodology"
export type ReviewStatus = "approved" | "review-required"

export type DataSource = {
  confidence: DataConfidence
  sourceName: string
  sourceUrl?: string
  retrievedAt: string
  lastChecked: string
  method: DataMethod
  reviewStatus: ReviewStatus
  note: string
}

export type CountryRoiInsight = {
  code: string
  name: string
  slug: string
  href: string
  hubHref: string
  cities: string
  policy: string
  verdict: string
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
  detail: {
    bestFor: string[]
    watchouts: string[]
    policyHighlights: string[]
    budgetBreakdown: { label: string; value: string; note: string }[]
    nextSteps: { label: string; href: string; note: string }[]
  }
  sources: {
    salary: DataSource
    tax: DataSource
    rent: DataSource
    budget: DataSource
    policy: DataSource
  }
}

export const COUNTRY_ROI_DATA_META = {
  version: "country-roi-2026-07-11",
  lastUpdated: "2026-07-11",
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
  retrievedAt: COUNTRY_ROI_DATA_META.lastUpdated,
  lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
  method: "internal-methodology",
  reviewStatus: "approved",
  note: SHARED_ESTIMATE_NOTE,
}

const taxEstimateSource: DataSource = {
  confidence: "internal-estimate",
  sourceName: "CampCareer simplified tax model",
  sourceUrl: "/methodology",
  retrievedAt: COUNTRY_ROI_DATA_META.lastUpdated,
  lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
  method: "internal-methodology",
  reviewStatus: "approved",
  note: "Simplified single-filer estimate; credits, deductions, and local rules are not fully modelled.",
}

const rentEstimateSource: DataSource = {
  confidence: "market-estimate",
  sourceName: "City rent estimate",
  sourceUrl: "/methodology",
  retrievedAt: COUNTRY_ROI_DATA_META.lastUpdated,
  lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
  method: "market-estimate",
  reviewStatus: "approved",
  note: "Monthly shared/student housing proxy derived from city-level rent assumptions.",
}

export const COUNTRY_ROI_INSIGHTS: CountryRoiInsight[] = [
  {
    code: "AU",
    name: "Australia",
    slug: "australia",
    href: "/au",
    hubHref: "/au",
    cities: "Sydney, Melbourne, Brisbane",
    policy: "Post-study work route + skilled occupation pathways",
    verdict:
      "A strong fit when your target occupation sits on a skilled list and you can handle a higher first-year budget.",
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
    detail: {
      bestFor: [
        "Students targeting nursing, software, civil engineering, or other skilled-list occupations.",
        "People who value English-speaking work experience and a clear state-by-state labour market.",
        "Applicants who can fund a relatively high tuition and rent runway before their first skilled job.",
      ],
      watchouts: [
        "Occupation list eligibility does not guarantee nomination, sponsorship, or permanent residence.",
        "Sydney and Melbourne can push rent and first-year cash needs well above the national preview.",
        "Graduate outcomes depend heavily on placement, English level, and local work experience.",
      ],
      policyHighlights: [
        "Home Affairs publishes eligible skilled occupations and the visa subclasses linked to them.",
        "Some skilled programs use ANZSCO 2022 while others still reference ANZSCO 2013.",
        "Temporary Graduate and skilled visas have separate stream and assessment requirements.",
      ],
      budgetBreakdown: [
        { label: "Minimum runway", value: "US$43k-68k", note: "Tuition deposit, visa proof, rent setup, and first 90 days." },
        { label: "Student rent proxy", value: "US$1,250/mo", note: "Shared/student housing estimate for major cities." },
        { label: "Effective tax preview", value: "25-30%", note: "Simplified single-filer estimate from CampCareer tax model." },
      ],
      nextSteps: [
        { label: "Browse Australia occupations", href: "/au/jobs", note: "Check salary, shortage, and occupation-list fit." },
        { label: "Open Australia map", href: "/map?country=au&state=NSW&tab=shortage", note: "Compare states before choosing a city." },
        { label: "Run ROI Explorer", href: "/roi-explorer?country=au", note: "Compare tuition and payback by institution." },
      ],
    },
    sources: {
      salary: methodologySource,
      tax: taxEstimateSource,
      rent: rentEstimateSource,
      budget: methodologySource,
      policy: {
        confidence: "official",
        sourceName: "Australian Department of Home Affairs",
        sourceUrl: "https://immi.homeaffairs.gov.au/visas/working-in-australia/skill-occupation-list",
        retrievedAt: COUNTRY_ROI_DATA_META.lastUpdated,
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        method: "official-web",
        reviewStatus: "approved",
        note: "Skilled occupation list and skilled migration pathway reference.",
      },
    },
  },
  {
    code: "US",
    name: "United States",
    slug: "united-states",
    href: "/us",
    hubHref: "/us",
    cities: "New York, Boston, San Francisco",
    policy: "F-1 OPT + STEM OPT + employer sponsorship",
    verdict:
      "The strongest salary upside for elite tech, finance, and research paths, but immigration risk is materially higher than Canada or Australia.",
    initialBudget: "US$58k-95k",
    rent: "US$1,650/mo",
    tax: "24-35% effective",
    bestMajors: ["Computer Science", "Data Science", "Finance"],
    salaries: {
      first: "US$72k",
      year3: "US$92k",
      year5: "US$118k",
      year10: "US$165k",
    },
    score: { software: 96, data: 94, nursing: 72, engineering: 88, business: 92 },
    goalFit: { salary: 96, immigration: 55, "low-cost": 42 },
    budgetFit: { lean: 35, balanced: 62, premium: 94 },
    detail: {
      bestFor: [
        "Students targeting high-upside technology, AI, quantitative finance, research, or brand-sensitive graduate schools.",
        "Applicants who can tolerate immigration uncertainty in exchange for the highest salary ceiling.",
        "People with enough budget to handle high tuition, insurance, rent, and a longer job-search runway.",
      ],
      watchouts: [
        "OPT and STEM OPT are temporary work authorizations and do not guarantee H-1B selection or permanent residence.",
        "City choice matters sharply; rent in New York, Boston, and the Bay Area can erase part of the salary premium.",
        "The route is strongest for fields with clear employer sponsorship demand and weak for low-sponsorship occupations.",
      ],
      policyHighlights: [
        "USCIS describes OPT as temporary employment directly related to an F-1 student's major area of study.",
        "Eligible STEM graduates may apply for an additional STEM OPT extension if requirements are met.",
        "Longer-term stay usually depends on employer sponsorship routes such as H-1B, O-1, EB-2, or EB-3.",
      ],
      budgetBreakdown: [
        { label: "Minimum runway", value: "US$58k-95k", note: "Tuition, insurance, visa costs, rent setup, and first 90 days." },
        { label: "Student rent proxy", value: "US$1,650/mo", note: "Blended shared/student estimate across expensive university metros." },
        { label: "Effective tax preview", value: "24-35%", note: "Simplified federal, state, payroll, and local-tax preview." },
      ],
      nextSteps: [
        { label: "Browse US occupations", href: "/us/jobs", note: "Check SOC salary, outlook, and state-level demand." },
        { label: "Open US map", href: "/map?country=us", note: "Compare states, universities, and labour-market density." },
        { label: "Run ROI Explorer", href: "/roi-explorer?country=us", note: "Compare US study cost and salary outcomes." },
      ],
    },
    sources: {
      salary: {
        confidence: "official",
        sourceName: "Bureau of Labor Statistics occupational wage data",
        sourceUrl: "https://www.bls.gov/oes/",
        retrievedAt: COUNTRY_ROI_DATA_META.lastUpdated,
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        method: "official-download",
        reviewStatus: "approved",
        note: "Occupation-level salary signals are based on BLS/OES-derived CampCareer datasets.",
      },
      tax: taxEstimateSource,
      rent: rentEstimateSource,
      budget: methodologySource,
      policy: {
        confidence: "official",
        sourceName: "USCIS Policy Manual — Practical Training",
        sourceUrl: "https://www.uscis.gov/node/92821",
        retrievedAt: COUNTRY_ROI_DATA_META.lastUpdated,
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        method: "official-web",
        reviewStatus: "approved",
        note: "F-1 OPT and post-study work authorization reference.",
      },
    },
  },
  {
    code: "CA",
    name: "Canada",
    slug: "canada",
    href: "/ca",
    hubHref: "/ca",
    cities: "Toronto, Vancouver, Calgary",
    policy: "PGWP + province nomination options",
    verdict:
      "A strong fit for students who want a post-graduation work window and province-specific immigration options.",
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
    detail: {
      bestFor: [
        "Students comparing education, healthcare, tech, and accounting pathways across provinces.",
        "Applicants who want PGWP work experience before deciding on a province or employer.",
        "People who can be flexible on city choice to manage rent and nomination competitiveness.",
      ],
      watchouts: [
        "Graduating from a DLI does not automatically make a program PGWP-eligible.",
        "Language and program eligibility rules changed for many applicants from November 2024.",
        "Toronto and Vancouver can materially reduce disposable income despite strong job markets.",
      ],
      policyHighlights: [
        "IRCC states the PGWP is for graduates from eligible designated learning institutions.",
        "PGWP length generally depends on study level, program duration, and passport validity.",
        "Most PGWP applicants now need proof of language results unless an exemption applies.",
      ],
      budgetBreakdown: [
        { label: "Minimum runway", value: "US$38k-64k", note: "Tuition, proof of funds, housing setup, and first 90 days." },
        { label: "Student rent proxy", value: "US$1,150/mo", note: "Major-city shared/student housing estimate." },
        { label: "Effective tax preview", value: "22-29%", note: "Simplified federal plus provincial estimate." },
      ],
      nextSteps: [
        { label: "Browse Canada occupations", href: "/ca/jobs", note: "Check NOC salary and shortage data." },
        { label: "Open Canada map", href: "/map?country=ca&state=ON&tab=shortage", note: "Compare provinces and local demand." },
        { label: "Run ROI Explorer", href: "/roi-explorer?country=ca", note: "Compare Canadian institutions by ROI." },
      ],
    },
    sources: {
      salary: methodologySource,
      tax: taxEstimateSource,
      rent: rentEstimateSource,
      budget: methodologySource,
      policy: {
        confidence: "official",
        sourceName: "IRCC post-graduation work permit",
        sourceUrl: "https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation/about.html",
        retrievedAt: COUNTRY_ROI_DATA_META.lastUpdated,
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        method: "official-web",
        reviewStatus: "approved",
        note: "PGWP eligibility and post-study work reference.",
      },
    },
  },
  {
    code: "IE",
    name: "Ireland",
    slug: "ireland",
    href: "/ie",
    hubHref: "/ie",
    cities: "Dublin, Cork, Galway",
    policy: "Third Level Graduate Programme + Critical Skills permit",
    verdict:
      "A focused EU option for tech, pharma, finance, healthcare, and construction paths, with strong employer concentration but severe Dublin housing pressure.",
    initialBudget: "US$31k-58k",
    rent: "US$1,250/mo",
    tax: "27-36% effective",
    bestMajors: ["Data Science", "Software Engineering", "Healthcare"],
    salaries: {
      first: "US$46k",
      year3: "US$60k",
      year5: "US$76k",
      year10: "US$105k",
    },
    score: { software: 88, data: 90, nursing: 82, engineering: 80, business: 78 },
    goalFit: { salary: 76, immigration: 78, "low-cost": 67 },
    budgetFit: { lean: 64, balanced: 82, premium: 84 },
    detail: {
      bestFor: [
        "Students targeting multinational tech, pharma, finance, healthcare, or construction roles in an English-speaking EU market.",
        "Applicants who want a post-study bridge before moving into an employment permit route.",
        "People willing to compare Dublin against Cork, Galway, Limerick, and regional options to manage housing risk.",
      ],
      watchouts: [
        "The Third Level Graduate Programme is temporary and must be converted into a qualifying work route.",
        "Dublin housing can be the binding constraint even when salary and visa logic look attractive.",
        "Critical Skills fit depends on role, qualification, salary threshold, and employer timing.",
      ],
      policyHighlights: [
        "Irish Immigration Service publishes the Third Level Graduate Programme for eligible Irish-educated non-EEA graduates.",
        "DETE publishes the Critical Skills Occupations List used for high-demand employment permits.",
        "CampCareer links Irish shortage occupations to graduate outcomes by field where available.",
      ],
      budgetBreakdown: [
        { label: "Minimum runway", value: "US$31k-58k", note: "Tuition, proof of funds, housing setup, insurance, and first 90 days." },
        { label: "Student rent proxy", value: "US$1,250/mo", note: "Dublin-weighted shared/student housing estimate." },
        { label: "Effective tax preview", value: "27-36%", note: "Simplified income tax, USC, and PRSI preview." },
      ],
      nextSteps: [
        { label: "Browse Ireland occupations", href: "/ie/jobs", note: "Check Critical Skills occupation fit and graduate outcome signals." },
        { label: "Open Ireland map", href: "/map?country=ie", note: "Compare schools, counties, and language-school locations." },
        { label: "Run ROI Explorer", href: "/roi-explorer?country=ie", note: "Compare Irish study and career outcomes." },
      ],
    },
    sources: {
      salary: {
        confidence: "official",
        sourceName: "CSO Higher Education Outcomes",
        sourceUrl: "https://www.cso.ie/en/releasesandpublications/ep/p-heo/highereducationoutcomes-graduationyears2013-2022/whatgraduatesearn/",
        retrievedAt: COUNTRY_ROI_DATA_META.lastUpdated,
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        method: "official-download",
        reviewStatus: "approved",
        note: "Graduate earnings and employment outcomes by field; occupation salary figures remain directional.",
      },
      tax: taxEstimateSource,
      rent: rentEstimateSource,
      budget: methodologySource,
      policy: {
        confidence: "official",
        sourceName: "Irish Immigration Service Third Level Graduate Programme",
        sourceUrl: "https://www.irishimmigration.ie/my-situation-has-changed-since-i-arrived-in-ireland/third-level-graduate-programme/",
        retrievedAt: COUNTRY_ROI_DATA_META.lastUpdated,
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        method: "official-web",
        reviewStatus: "approved",
        note: "Post-study permission reference for eligible Irish-educated non-EEA graduates.",
      },
    },
  },
  {
    code: "DE",
    name: "Germany",
    slug: "germany",
    href: "/de",
    hubHref: "/de",
    cities: "Munich, Berlin, Hamburg",
    policy: "Low tuition + EU Blue Card route",
    verdict:
      "A strong fit for cost-sensitive students in engineering or tech who can navigate language and credential requirements.",
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
    detail: {
      bestFor: [
        "Engineering, computer science, and applied technical fields where Germany has deep employer demand.",
        "Students who want lower tuition exposure and can invest in German language ability.",
        "Applicants aiming for qualified employment routes such as the EU Blue Card.",
      ],
      watchouts: [
        "Lower tuition does not remove the need for housing, blocked-account style funding, and setup cash.",
        "Many roles require German, especially outside international tech employers.",
        "Recognition, job contract, salary threshold, and qualification fit need to be checked case by case.",
      ],
      policyHighlights: [
        "Make it in Germany describes the EU Blue Card as a residence title for foreign academics and comparable qualified workers.",
        "The route is tied to qualified employment and meeting stated requirements.",
        "Germany also has separate skilled-worker and opportunity-card routes that may fit some profiles.",
      ],
      budgetBreakdown: [
        { label: "Minimum runway", value: "US$18k-36k", note: "Lower tuition scenario plus housing and first 90 days." },
        { label: "Student rent proxy", value: "US$850/mo", note: "Blended estimate across major cities and lower-cost regions." },
        { label: "Effective tax preview", value: "30-38%", note: "Simplified income tax and social security estimate." },
      ],
      nextSteps: [
        { label: "Browse Germany occupations", href: "/de/jobs", note: "Check KldB salary and shortage signals." },
        { label: "Open Germany map", href: "/map?country=de", note: "Compare states and university locations." },
        { label: "Run ROI Explorer", href: "/roi-explorer?country=de", note: "Compare German university ROI." },
      ],
    },
    sources: {
      salary: methodologySource,
      tax: taxEstimateSource,
      rent: rentEstimateSource,
      budget: methodologySource,
      policy: {
        confidence: "official",
        sourceName: "Make it in Germany EU Blue Card",
        sourceUrl: "https://www.make-it-in-germany.com/en/visa-residence/types/eu-blue-card",
        retrievedAt: COUNTRY_ROI_DATA_META.lastUpdated,
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        method: "official-web",
        reviewStatus: "approved",
        note: "EU Blue Card work-residence pathway reference.",
      },
    },
  },
  {
    code: "UK",
    name: "United Kingdom",
    slug: "united-kingdom",
    href: "/uk",
    hubHref: "/uk",
    cities: "London, Manchester, Edinburgh",
    policy: "Graduate route + skilled worker sponsorship",
    verdict:
      "A strong fit for brand-sensitive degrees and finance, AI, or life-science paths, but cost and sponsorship risk are high.",
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
    detail: {
      bestFor: [
        "Students targeting finance, AI, life sciences, consulting, or globally recognised universities.",
        "Applicants who value an English-speaking degree and access to London or regional graduate markets.",
        "People with enough budget to absorb tuition, rent, and visa health surcharge costs.",
      ],
      watchouts: [
        "The Graduate visa is time-limited and does not directly guarantee Skilled Worker sponsorship.",
        "GOV.UK states Graduate visa duration changes for non-doctoral applicants from 2027.",
        "London rent can sharply reduce the net salary advantage of high-paying sectors.",
      ],
      policyHighlights: [
        "GOV.UK says the Graduate visa gives permission to stay after completing an eligible UK course.",
        "It lasts 2 years for applications on or before 31 December 2026 and 18 months from 1 January 2027.",
        "The Graduate visa cannot be extended, but some people may switch to another visa such as Skilled Worker.",
      ],
      budgetBreakdown: [
        { label: "Minimum runway", value: "US$41k-78k", note: "Tuition, visa costs, health surcharge, rent setup, and first 90 days." },
        { label: "Student rent proxy", value: "US$1,300/mo", note: "Blended shared/student estimate; London can be materially higher." },
        { label: "Effective tax preview", value: "24-33%", note: "Simplified income tax and National Insurance estimate." },
      ],
      nextSteps: [
        { label: "Browse UK occupations", href: "/uk/jobs", note: "Check salary and shortage signals." },
        { label: "Open UK map", href: "/map?country=uk&region=TLI&tab=pay", note: "Compare regions before choosing a city." },
        { label: "Run ROI Explorer", href: "/roi-explorer?country=uk", note: "Compare UK study cost and salary." },
      ],
    },
    sources: {
      salary: methodologySource,
      tax: taxEstimateSource,
      rent: rentEstimateSource,
      budget: methodologySource,
      policy: {
        confidence: "official",
        sourceName: "GOV.UK Graduate visa",
        sourceUrl: "https://www.gov.uk/graduate-visa",
        retrievedAt: COUNTRY_ROI_DATA_META.lastUpdated,
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        method: "official-web",
        reviewStatus: "approved",
        note: "Graduate route and post-study stay reference.",
      },
    },
  },
  {
    code: "NL",
    name: "Netherlands",
    slug: "netherlands",
    href: "/nl",
    hubHref: "/nl",
    cities: "Amsterdam, Eindhoven, Rotterdam",
    policy: "Orientation year + highly skilled migrant route",
    verdict:
      "A good fit for data, engineering, and logistics students who want an EU market with many English-taught options.",
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
    detail: {
      bestFor: [
        "Students targeting data science, engineering, logistics, and internationally oriented business roles.",
        "Applicants who want a post-study orientation year before moving into a skilled migrant route.",
        "People who prefer compact cities and strong English access, while still preparing for Dutch-language advantages.",
      ],
      watchouts: [
        "Housing shortages can make Amsterdam and Eindhoven difficult despite moderate headline budgets.",
        "The orientation year is a bridge, not a permanent outcome by itself.",
        "Highly skilled migrant routes depend on employer sponsorship and salary requirements.",
      ],
      policyHighlights: [
        "IND publishes the residence permit for orientation year after study, doctorate, or research.",
        "The route is designed as a temporary job-search and labour-market entry window.",
        "Longer-term stay usually depends on a qualifying work route such as highly skilled migrant or EU Blue Card.",
      ],
      budgetBreakdown: [
        { label: "Minimum runway", value: "US$29k-54k", note: "Tuition, housing setup, insurance, and first 90 days." },
        { label: "Student rent proxy", value: "US$1,050/mo", note: "Shared/student housing estimate with Amsterdam pressure reflected." },
        { label: "Effective tax preview", value: "28-36%", note: "Simplified Dutch Box 1 income tax and social security estimate." },
      ],
      nextSteps: [
        { label: "Browse Netherlands occupations", href: "/nl/jobs", note: "Check salary and shortage signals." },
        { label: "Open Netherlands map", href: "/map?country=nl", note: "Compare university locations and regional demand." },
        { label: "Run ROI Explorer", href: "/roi-explorer?country=nl", note: "Compare Dutch university ROI." },
      ],
    },
    sources: {
      salary: methodologySource,
      tax: taxEstimateSource,
      rent: rentEstimateSource,
      budget: methodologySource,
      policy: {
        confidence: "official",
        sourceName: "IND orientation year",
        sourceUrl: "https://ind.nl/en/residence-permits/work/residence-permit-for-orientation-year",
        retrievedAt: COUNTRY_ROI_DATA_META.lastUpdated,
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        method: "official-web",
        reviewStatus: "approved",
        note: "Orientation year after graduation, doctorate, or research reference.",
      },
    },
  },
  {
    code: "FR",
    name: "France",
    slug: "france",
    href: "/fr",
    hubHref: "/fr",
    cities: "Paris, Lyon, Toulouse",
    policy: "APS post-study job-search permit + talent passport route",
    verdict:
      "A strong fit for students targeting engineering, business, luxury, aerospace, or healthcare paths in a French-speaking or bilingual market, with lower tuition than many Anglophone destinations.",
    initialBudget: "US$15k-32k",
    rent: "US$950/mo",
    tax: "25-35% effective",
    bestMajors: ["Engineering", "Business Analytics", "Data Science"],
    salaries: {
      first: "US$35k",
      year3: "US$45k",
      year5: "US$55k",
      year10: "US$75k",
    },
    score: { software: 78, data: 80, nursing: 72, engineering: 88, business: 84 },
    goalFit: { salary: 72, immigration: 75, "low-cost": 85 },
    budgetFit: { lean: 88, balanced: 85, premium: 68 },
    detail: {
      bestFor: [
        "Students targeting engineering, aerospace, luxury, business, or healthcare roles in France or the broader francophone market.",
        "Applicants who want lower public university tuition and a post-study job-search window.",
        "People who can work in French or bilingual environments and value EU mobility.",
      ],
      watchouts: [
        "French language proficiency is often required for non-tech roles and significantly affects employability.",
        "Paris rent and living costs can be high relative to entry-level graduate salaries.",
        "The APS (Autorisation provisoire de séjour) is time-limited and must be converted into a qualifying work route.",
      ],
      policyHighlights: [
        "France-Visas states the APS allows eligible non-EU graduates to seek employment or create a business for up to 12 months.",
        "The Talent Passport (Passeport Talent) route is available for qualified workers, researchers, and entrepreneurs meeting specific criteria.",
        "Campus France provides official guidance on study and post-study work pathways for international students.",
      ],
      budgetBreakdown: [
        { label: "Minimum runway", value: "US$15k-32k", note: "Lower public tuition, housing setup, visa costs, and first 90 days." },
        { label: "Student rent proxy", value: "US$950/mo", note: "Blended shared/student estimate; Paris can be materially higher." },
        { label: "Effective tax preview", value: "25-35%", note: "Simplified income tax and social security estimate." },
      ],
      nextSteps: [
        { label: "Browse France occupations", href: "/fr/jobs", note: "Check France Travail BMO demand and salary signals." },
        { label: "Open France map", href: "/maps?country=fr", note: "Compare regions and university locations." },
        { label: "Run ROI Explorer", href: "/roi-explorer?country=fr", note: "Compare French study cost and salary." },
      ],
    },
    sources: {
      salary: {
        confidence: "official",
        sourceName: "INSEE salary groups",
        sourceUrl: "https://www.insee.fr/fr/statistiques/2021266",
        retrievedAt: COUNTRY_ROI_DATA_META.lastUpdated,
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        method: "official-download",
        reviewStatus: "approved",
        note: "INSEE private-sector salary groups by region and occupation class; occupation-level figures are directional.",
      },
      tax: taxEstimateSource,
      rent: rentEstimateSource,
      budget: methodologySource,
      policy: {
        confidence: "official",
        sourceName: "France-Visas post-study work permit",
        sourceUrl: "https://france-visas.gouv.fr/en",
        retrievedAt: COUNTRY_ROI_DATA_META.lastUpdated,
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        method: "official-web",
        reviewStatus: "approved",
        note: "APS and Talent Passport post-study work reference for eligible non-EU graduates.",
      },
    },
  },
  {
    code: "ES",
    name: "Spain",
    slug: "spain",
    href: "/es",
    hubHref: "/es",
    cities: "Madrid, Barcelona, Valencia",
    policy: "Post-study job-search residence + EU Blue Card route",
    verdict:
      "A strong fit for students targeting engineering, hospitality, healthcare, or tech paths in a Spanish-speaking or bilingual market, with low tuition and a 24-month post-study job-search window.",
    initialBudget: "US$12k-25k",
    rent: "US$800/mo",
    tax: "24-34% effective",
    bestMajors: ["Engineering", "Business Analytics", "Hospitality"],
    salaries: {
      first: "US$28k",
      year3: "US$36k",
      year5: "US$44k",
      year10: "US$60k",
    },
    score: { software: 72, data: 74, nursing: 70, engineering: 82, business: 78 },
    goalFit: { salary: 65, immigration: 72, "low-cost": 92 },
    budgetFit: { lean: 92, balanced: 88, premium: 62 },
    detail: {
      bestFor: [
        "Students targeting engineering, hospitality, healthcare, or business roles in Spain or the broader Spanish-speaking market.",
        "Applicants who want very low public tuition and a 24-month post-study job-search window.",
        "People who can work in Spanish or bilingual environments and value EU mobility.",
      ],
      watchouts: [
        "Spanish language proficiency is often required for non-tech roles and significantly affects employability.",
        "Madrid and Barcelona rent can be high relative to entry-level graduate salaries.",
        "The post-study job-search residence does not itself authorise work; a separate work permit is needed.",
      ],
      policyHighlights: [
        "Spanish immigration law provides a 24-month post-study job-search residence for eligible graduates of authorised higher education.",
        "The EU Blue Card route is available for qualified workers meeting salary and qualification thresholds.",
        "Regulated professions may require degree homologation before practice.",
      ],
      budgetBreakdown: [
        { label: "Minimum runway", value: "US$12k-25k", note: "Lower public tuition, housing setup, visa costs, and first 90 days." },
        { label: "Student rent proxy", value: "US$800/mo", note: "Blended shared/student estimate; Madrid and Barcelona can be materially higher." },
        { label: "Effective tax preview", value: "24-34%", note: "Simplified income tax and social security estimate." },
      ],
      nextSteps: [
        { label: "Browse Spain occupations", href: "/es/jobs", note: "Check SEPE shortage and salary signals." },
        { label: "Open Spain map", href: "/maps?country=es", note: "Compare communities and university locations." },
        { label: "Run ROI Explorer", href: "/roi-explorer?country=es", note: "Compare Spanish study cost and salary." },
      ],
    },
    sources: {
      salary: {
        confidence: "official",
        sourceName: "INE salary groups",
        sourceUrl: "https://ine.es/dyngs/Prensa/EAES2024.htm",
        retrievedAt: COUNTRY_ROI_DATA_META.lastUpdated,
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        method: "official-download",
        reviewStatus: "approved",
        note: "INE CNO-11 major-group annual gross wages with regional factors; occupation-level figures are directional.",
      },
      tax: taxEstimateSource,
      rent: rentEstimateSource,
      budget: methodologySource,
      policy: {
        confidence: "official",
        sourceName: "Spanish immigration post-study residence",
        sourceUrl: "https://inclusion.gob.es/web/migraciones/w/20.-autorizacion-de-residencia-para-busqueda-de-empleo-o-inicio-de-proyecto-empresarial",
        retrievedAt: COUNTRY_ROI_DATA_META.lastUpdated,
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        method: "official-web",
        reviewStatus: "approved",
        note: "Post-study job-search residence and EU Blue Card reference for eligible non-EU graduates.",
      },
    },
  },
  {
    code: "BE",
    name: "Belgium",
    slug: "belgium",
    href: "/be",
    hubHref: "/be",
    cities: "Brussels, Leuven, Ghent",
    policy: "Search year after studies + single permit",
    verdict:
      "A useful EU option for multilingual students comparing Brussels, Flanders, and Wallonia, especially in healthcare, engineering, ICT, and accounting shortage paths.",
    initialBudget: "US$27k-50k",
    rent: "US$980/mo",
    tax: "34-43% effective",
    bestMajors: ["Engineering", "Healthcare", "Accounting"],
    salaries: {
      first: "US$44k",
      year3: "US$56k",
      year5: "US$69k",
      year10: "US$92k",
    },
    score: { software: 76, data: 78, nursing: 84, engineering: 85, business: 80 },
    goalFit: { salary: 70, immigration: 72, "low-cost": 78 },
    budgetFit: { lean: 72, balanced: 84, premium: 78 },
    detail: {
      bestFor: [
        "Students who can use English plus French or Dutch to access Brussels, Flanders, and Wallonia labour markets.",
        "Applicants targeting shortage occupations such as nursing, accounting, industrial maintenance, construction, and ICT.",
        "People who want EU access with lower headline tuition than many English-speaking destinations.",
      ],
      watchouts: [
        "Belgium is multilingual; local-language ability can matter more than the headline national pathway.",
        "High income tax and social security mean gross salary needs a take-home check.",
        "Regional labour-market signals differ across Flanders, Brussels, and Wallonia.",
      ],
      policyHighlights: [
        "IBZ publishes the search year after higher studies for eligible third-country graduates.",
        "Belgian work stay commonly moves through employment-purpose residence routes such as the single permit.",
        "VDAB, Actiris, and Forem shortage lists should be checked region by region.",
      ],
      budgetBreakdown: [
        { label: "Minimum runway", value: "US$27k-50k", note: "Tuition, housing setup, residence costs, and first 90 days." },
        { label: "Student rent proxy", value: "US$980/mo", note: "Blended estimate across Brussels, Flanders, and Wallonia." },
        { label: "Effective tax preview", value: "34-43%", note: "Simplified income tax and social security estimate." },
      ],
      nextSteps: [
        { label: "Browse Belgium occupations", href: "/be/jobs", note: "Check salary, shortage, and regional fit." },
        { label: "Open Belgium map", href: "/map?country=be", note: "Compare Belgian regions and universities." },
        { label: "Compare country ROI", href: "/countries/belgium", note: "Review Belgium budget, tax, rent, and policy assumptions." },
      ],
    },
    sources: {
      salary: {
        confidence: "official",
        sourceName: "Statbel Belgian wages and salaries",
        sourceUrl: "https://statbel.fgov.be/en/themes/work-training/wages-and-labourcost/overview-belgian-wages-and-salaries",
        retrievedAt: COUNTRY_ROI_DATA_META.lastUpdated,
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        method: "official-download",
        reviewStatus: "approved",
        note: "Belgian gross salary reference; occupation-level figures are merged with Jobat and market datasets where needed.",
      },
      tax: {
        confidence: "official",
        sourceName: "FPS Finance Belgium tax rates",
        sourceUrl: "https://fin.belgium.be/en/individuals/taxation/tax-rates/income-tax-rates",
        retrievedAt: COUNTRY_ROI_DATA_META.lastUpdated,
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        method: "official-web",
        reviewStatus: "review-required",
        note: "Simplified tax preview derived from official Belgian tax-rate structure.",
      },
      rent: rentEstimateSource,
      budget: methodologySource,
      policy: {
        confidence: "official",
        sourceName: "IBZ Search year after higher studies",
        sourceUrl: "https://dofi.ibz.be/en/themes/third-country-nationals/study/search-year-after-higher-studies",
        retrievedAt: COUNTRY_ROI_DATA_META.lastUpdated,
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        method: "official-web",
        reviewStatus: "approved",
        note: "Post-study search year reference for eligible third-country graduates.",
      },
    },
  },
  {
    code: "NZ",
    name: "New Zealand",
    slug: "new-zealand",
    href: "/nz",
    hubHref: "/nz",
    cities: "Auckland, Wellington, Christchurch",
    policy: "Post-study work visa + skilled occupation pathways",
    verdict:
      "A strong English-speaking destination with a clear post-study work pathway and occupation-driven skilled migration system.",
    initialBudget: "US$25k-45k",
    rent: "US$1,050/mo",
    tax: "20-30% effective",
    bestMajors: ["Nursing", "Software Engineering", "Civil Engineering"],
    salaries: {
      first: "US$48k",
      year3: "US$60k",
      year5: "US$72k",
      year10: "US$95k",
    },
    score: { software: 82, data: 78, nursing: 92, engineering: 80, business: 72 },
    goalFit: { salary: 75, immigration: 88, "low-cost": 72 },
    budgetFit: { lean: 68, balanced: 85, premium: 88 },
    detail: {
      bestFor: [
        "Students targeting nursing, trades, IT, or other Green List occupations with clear residency pathways.",
        "People who value an English-speaking environment with a lower cost of living than Australia.",
        "Applicants who want a clear study-to-work-to-residence pathway without excessive complexity.",
      ],
      watchouts: [
        "New Zealand's salary ceiling is lower than Australia, the US, or the UK for equivalent roles.",
        "Auckland rent can be high relative to salaries; smaller cities offer better value.",
        "Post-study work visa requirements include minimum study duration and institution criteria.",
      ],
      policyHighlights: [
        "Immigration New Zealand publishes a Green List of occupations eligible for direct residence or work-to-residence.",
        "Post-study work visas (open and employer-assisted) are available for eligible graduates.",
        "Skilled Migrant Category uses a points system with occupation, salary, and qualification factors.",
      ],
      budgetBreakdown: [
        { label: "Minimum runway", value: "US$25k-45k", note: "Tuition, visa proof, rent setup, and first 90 days." },
        { label: "Student rent proxy", value: "US$1,050/mo", note: "Shared/student housing estimate for major cities." },
        { label: "Effective tax preview", value: "20-30%", note: "Simplified single-filer estimate from CampCareer tax model." },
      ],
      nextSteps: [
        { label: "Browse New Zealand occupations", href: "/nz/jobs", note: "Check salary, shortage, and Green List fit." },
        { label: "Open New Zealand map", href: "/map/nz", note: "Explore regions and institution references." },
        { label: "Compare country ROI", href: "/countries/new-zealand", note: "Review NZ budget, tax, rent, and policy assumptions." },
      ],
    },
    sources: {
      salary: methodologySource,
      tax: taxEstimateSource,
      rent: rentEstimateSource,
      budget: methodologySource,
      policy: {
        confidence: "official",
        sourceName: "Immigration New Zealand Green List",
        sourceUrl: "https://www.immigration.govt.nz/work/requirements-for-work-visas/green-list-occupations-qualifications-and-skills/green-list-roles-jobs-we-need-people-for-in-new-zealand/",
        retrievedAt: COUNTRY_ROI_DATA_META.lastUpdated,
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        method: "official-web",
        reviewStatus: "approved",
        note: "New Zealand Green List and skilled migration pathway reference.",
      },
    },
  },
  {
    code: "NO",
    name: "Norway",
    slug: "norway",
    href: "/no",
    hubHref: "/no",
    cities: "Oslo, Bergen, Trondheim",
    policy: "Skilled worker visa + job seeker permit after graduation",
    verdict:
      "A high-salary English-accessible destination for tech, engineering, healthcare and trades, with strong social benefits but high living costs and Norwegian language expectations.",
    initialBudget: "US$28k-52k",
    rent: "US$1,350/mo",
    tax: "30-38% effective",
    bestMajors: ["Engineering", "Computer Science", "Nursing"],
    salaries: {
      first: "US$55k",
      year3: "US$68k",
      year5: "US$82k",
      year10: "US$110k",
    },
    score: { software: 82, data: 78, nursing: 88, engineering: 90, business: 72 },
    goalFit: { salary: 88, immigration: 76, "low-cost": 52 },
    budgetFit: { lean: 58, balanced: 78, premium: 90 },
    detail: {
      bestFor: [
        "Students targeting engineering, healthcare, ICT, or petroleum-related roles in a high-wage economy.",
        "Applicants who want strong social benefits, worker protections and a clear skilled-worker visa route.",
        "People who can manage high living costs in exchange for excellent salary and quality of life.",
      ],
      watchouts: [
        "Non-EU/EEA students now pay tuition at Norwegian universities (since August 2023).",
        "Norwegian language ability significantly improves long-term employment prospects.",
        "Oslo and Bergen rent can be high relative to entry-level graduate salaries.",
      ],
      policyHighlights: [
        "UDI publishes the skilled worker visa route requiring a concrete job offer matching Norwegian norms.",
        "Graduates can apply for a 1-year job seeker permit after completing their degree.",
        "Norway offers permanent residency after 3 years of qualified employment.",
      ],
      budgetBreakdown: [
        { label: "Minimum runway", value: "US$28k-52k", note: "Tuition (non-EU/EEA), visa proof, rent setup, and first 90 days." },
        { label: "Student rent proxy", value: "US$1,350/mo", note: "Shared/student housing estimate for major cities." },
        { label: "Effective tax preview", value: "30-38%", note: "Simplified income tax and national insurance estimate." },
      ],
      nextSteps: [
        { label: "Browse Norway occupations", href: "/no/jobs", note: "Check STYRK salary and shortage data." },
        { label: "Open Norway map", href: "/map/no", note: "Explore counties and university references." },
        { label: "Compare country ROI", href: "/countries/norway", note: "Review NO budget, tax, rent, and policy assumptions." },
      ],
    },
    sources: {
      salary: methodologySource,
      tax: taxEstimateSource,
      rent: rentEstimateSource,
      budget: methodologySource,
      policy: {
        confidence: "official",
        sourceName: "Norwegian Directorate of Immigration (UDI)",
        sourceUrl: "https://www.udi.no/en/want-to-apply/work-immigration/",
        retrievedAt: COUNTRY_ROI_DATA_META.lastUpdated,
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        method: "official-web",
        reviewStatus: "approved",
        note: "Norway skilled worker visa and job seeker permit reference.",
      },
    },
  },
  {
    code: "SE",
    name: "Sweden",
    slug: "sweden",
    href: "/se",
    hubHref: "/se",
    cities: "Stockholm, Gothenburg, Malmö",
    policy: "Work permit for qualified workers + EU free movement",
    verdict:
      "A highly English-proficient innovation hub for tech, engineering and design, with strong social benefits, a vibrant startup ecosystem and accessible immigration for skilled workers.",
    initialBudget: "US$22k-42k",
    rent: "US$1,100/mo",
    tax: "29-35% effective",
    bestMajors: ["Computer Science", "Engineering", "Design"],
    salaries: {
      first: "US$45k",
      year3: "US$56k",
      year5: "US$68k",
      year10: "US$92k",
    },
    score: { software: 88, data: 84, nursing: 80, engineering: 86, business: 78 },
    goalFit: { salary: 82, immigration: 84, "low-cost": 58 },
    budgetFit: { lean: 65, balanced: 82, premium: 88 },
    detail: {
      bestFor: [
        "Students targeting software, engineering, design and innovation roles in a collaborative work culture.",
        "Applicants who want a clear work-permit route with high English proficiency across society.",
        "People who value work-life balance, social welfare benefits and a progressive lifestyle.",
      ],
      watchouts: [
        "Non-EU/EEA students pay tuition at Swedish universities.",
        "Swedish language ability improves long-term career prospects significantly.",
        "Stockholm rent can be high; housing shortage is a known issue.",
      ],
      policyHighlights: [
        "Migrationsverket publishes the work permit route for qualified workers with a concrete job offer.",
        "Graduates can extend their residence permit to seek employment after graduation.",
        "Sweden offers permanent residency after 4 years of continuous residence.",
      ],
      budgetBreakdown: [
        { label: "Minimum runway", value: "US$22k-42k", note: "Tuition (non-EU/EEA), visa proof, rent setup, and first 90 days." },
        { label: "Student rent proxy", value: "US$1,100/mo", note: "Shared/student housing estimate for major cities." },
        { label: "Effective tax preview", value: "29-35%", note: "Simplified income tax and social insurance estimate." },
      ],
      nextSteps: [
        { label: "Browse Sweden occupations", href: "/se/jobs", note: "Check SSYK salary and shortage data." },
        { label: "Open Sweden map", href: "/map?country=se", note: "Compare regions and universities." },
        { label: "Compare country ROI", href: "/countries/sweden", note: "Review SE budget, tax, rent, and policy assumptions." },
      ],
    },
    sources: {
      salary: methodologySource,
      tax: taxEstimateSource,
      rent: rentEstimateSource,
      budget: methodologySource,
      policy: {
        confidence: "official",
        sourceName: "Swedish Migration Agency (Migrationsverket)",
        sourceUrl: "https://www.migrationsverket.se/en/you-want-to-apply/work/employee-or-self-employed/employees.html",
        retrievedAt: COUNTRY_ROI_DATA_META.lastUpdated,
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        method: "official-web",
        reviewStatus: "approved",
        note: "Sweden work permit and post-graduation residence reference.",
      },
    },
  },
  {
    code: "DK",
    name: "Denmark",
    slug: "denmark",
    href: "/dk",
    hubHref: "/dk",
    cities: "Copenhagen, Aarhus, Odense",
    policy: "Establishment Card for qualified workers + Positive List skilled shortage + EU free movement",
    verdict:
      "A highly English-proficient innovation hub with a world-class life sciences sector, strong worker protections, generous social benefits and a well-organized job market for skilled professionals.",
    initialBudget: "US$24k-45k",
    rent: "US$1,150/mo",
    tax: "35-52% effective",
    bestMajors: ["Computer Science", "Engineering", "Life Sciences"],
    salaries: {
      first: "US$48k",
      year3: "US$58k",
      year5: "US$70k",
      year10: "US$95k",
    },
    score: { software: 86, data: 82, nursing: 84, engineering: 88, business: 78 },
    goalFit: { salary: 84, immigration: 80, "low-cost": 55 },
    budgetFit: { lean: 62, balanced: 80, premium: 88 },
    detail: {
      bestFor: [
        "Students targeting software, engineering, life sciences and green tech roles in a collaborative work culture.",
        "Applicants who want a clear Establishment Card or Positive List route with high English proficiency.",
        "People who value work-life balance, social welfare benefits and a progressive lifestyle.",
      ],
      watchouts: [
        "Non-EU/EEA students pay tuition at Danish universities.",
        "Danish language ability significantly improves long-term career prospects.",
        "Copenhagen rent can be high; housing shortage is a known issue.",
      ],
      policyHighlights: [
        "SIRI publishes the Establishment Card route for qualified workers with a concrete job offer.",
        "Graduates can extend their residence permit to seek employment after graduation.",
        "Denmark offers permanent residency after 4 years of continuous residence with Danish language requirement.",
      ],
      budgetBreakdown: [
        { label: "Minimum runway", value: "US$24k-45k", note: "Tuition (non-EU/EEA), visa proof, rent setup, and first 90 days." },
        { label: "Student rent proxy", value: "US$1,150/mo", note: "Shared/student housing estimate for major cities." },
        { label: "Effective tax preview", value: "35-52%", note: "Simplified income tax and social insurance estimate." },
      ],
      nextSteps: [
        { label: "Browse Denmark occupations", href: "/dk/jobs", note: "Check DOS salary and shortage data." },
        { label: "Open Denmark map", href: "/map?country=dk", note: "Compare regions and universities." },
        { label: "Compare country ROI", href: "/countries/denmark", note: "Review DK budget, tax, rent, and policy assumptions." },
      ],
    },
    sources: {
      salary: methodologySource,
      tax: taxEstimateSource,
      rent: rentEstimateSource,
      budget: methodologySource,
      policy: {
        confidence: "official",
        sourceName: "Danish Agency for International Recruitment (SIRI)",
        sourceUrl: "https://www.nyidanmark.dk/en-GB/You-want-to-extend/Work---extension/Establishment-card",
        retrievedAt: COUNTRY_ROI_DATA_META.lastUpdated,
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        method: "official-web",
        reviewStatus: "approved",
        note: "Denmark Establishment Card and Positive List reference.",
      },
    },
  },
  {
    code: "FI",
    name: "Finland",
    slug: "finland",
    href: "/fi",
    hubHref: "/fi",
    cities: "Helsinki, Tampere, Turku",
    policy: "Work permit for qualified workers + EU free movement",
    verdict:
      "A high-tech innovation hub with strong education outcomes, a thriving startup ecosystem, affordable tuition compared to Nordic peers, and accessible immigration for skilled workers.",
    initialBudget: "US$18k-36k",
    rent: "US$900/mo",
    tax: "30-38% effective",
    bestMajors: ["Computer Science", "Engineering", "Environmental Science"],
    salaries: {
      first: "US$40k",
      year3: "US$50k",
      year5: "US$60k",
      year10: "US$80k",
    },
    score: { software: 85, data: 80, nursing: 82, engineering: 84, business: 76 },
    goalFit: { salary: 80, immigration: 82, "low-cost": 62 },
    budgetFit: { lean: 68, balanced: 80, premium: 86 },
    detail: {
      bestFor: [
        "Students targeting software, engineering, environmental science and tech innovation roles.",
        "Applicants who want a clear work-permit route with high English proficiency across society.",
        "People who value work-life balance, social welfare benefits and affordable Nordic living.",
      ],
      watchouts: [
        "Non-EU/EEA students pay tuition at Finnish universities (scholarships widely available).",
        "Finnish language ability improves long-term career prospects significantly.",
        "Helsinki rent can be high compared to other Finnish cities; housing shortage is a known issue.",
      ],
      policyHighlights: [
        "Finnish Immigration Service (Migri) publishes the work permit route for qualified workers with a concrete job offer.",
        "Graduates can extend their residence permit to seek employment after graduation.",
        "Finland offers permanent residency after 4 years of continuous residence.",
      ],
      budgetBreakdown: [
        { label: "Minimum runway", value: "US$18k-36k", note: "Tuition (non-EU/EEA), visa proof, rent setup, and first 90 days." },
        { label: "Student rent proxy", value: "US$900/mo", note: "Shared/student housing estimate for major cities." },
        { label: "Effective tax preview", value: "30-38%", note: "Simplified income tax and social insurance estimate." },
      ],
      nextSteps: [
        { label: "Browse Finland occupations", href: "/fi/jobs", note: "Check ISCO-08 salary and shortage data." },
        { label: "Open Finland map", href: "/map?country=fi", note: "Compare regions and universities." },
        { label: "Compare country ROI", href: "/countries/finland", note: "Review FI budget, tax, rent, and policy assumptions." },
      ],
    },
    sources: {
      salary: methodologySource,
      tax: taxEstimateSource,
      rent: rentEstimateSource,
      budget: methodologySource,
      policy: {
        confidence: "official",
        sourceName: "Finnish Immigration Service (Migri)",
        sourceUrl: "https://migri.fi/en/work-in-finland",
        retrievedAt: COUNTRY_ROI_DATA_META.lastUpdated,
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        method: "official-web",
        reviewStatus: "approved",
        note: "Finland work permit and post-graduation residence reference.",
      },
    },
  },
  {
    code: "SG",
    name: "Singapore",
    slug: "singapore",
    href: "/sg",
    hubHref: "/sg",
    cities: "Singapore",
    policy: "Student's Pass → Employment Pass / S Pass / COMPASS",
    verdict:
      "A compact, high-cost hub for finance, tech, and logistics, with concentrated employer demand but strict foreign-worker access rules.",
    initialBudget: "US$25k-48k",
    rent: "US$1,200/mo",
    tax: "0-22% effective",
    bestMajors: ["Data Science", "Software Engineering", "Finance"],
    salaries: {
      first: "US$42k",
      year3: "US$55k",
      year5: "US$68k",
      year10: "US$95k",
    },
    score: { software: 90, data: 92, nursing: 70, engineering: 84, business: 90 },
    goalFit: { salary: 88, immigration: 65, "low-cost": 48 },
    budgetFit: { lean: 42, balanced: 68, premium: 92 },
    detail: {
      bestFor: [
        "Students targeting finance, data, software, logistics, or consulting roles in a compact Asian hub.",
        "Applicants who want a high-salary environment with low personal income tax.",
        "People who can navigate strict foreign-worker access rules and employer sponsorship requirements.",
      ],
      watchouts: [
        "Singapore has no post-study open work route; employment authorisation depends on employer-sponsored passes.",
        "The COMPASS framework and EP minimum salary thresholds can change and affect eligibility.",
        "Rent and living costs are high relative to entry-level graduate salaries.",
      ],
      policyHighlights: [
        "MOM publishes the Employment Pass and S Pass requirements including minimum salary thresholds.",
        "COMPASS (Complementarity Assessment Framework) is used for new EP applications from September 2024.",
        "Student's Pass holders can work limited hours during term and full-time during holidays.",
      ],
      budgetBreakdown: [
        { label: "Minimum runway", value: "US$25k-48k", note: "Tuition, Student's Pass fees, housing setup, and first 90 days." },
        { label: "Student rent proxy", value: "US$1,200/mo", note: "Shared/student housing estimate; central areas can be materially higher." },
        { label: "Effective tax preview", value: "0-22%", note: "Singapore progressive resident tax rates; many graduates start at 0-3%." },
      ],
      nextSteps: [
        { label: "Browse Singapore occupations", href: "/sg/jobs", note: "Check MOM demand cards and salary data." },
        { label: "Open Singapore map", href: "/map?country=sg&area=cbd", note: "Compare living areas and rental indices." },
        { label: "Run ROI Explorer", href: "/roi-explorer?country=sg", note: "Compare Singapore study cost and salary." },
      ],
    },
    sources: {
      salary: {
        confidence: "official",
        sourceName: "MOM Occupational Wages",
        sourceUrl: "https://stats.mom.gov.sg/Pages/Occupational-Wages-Data-and-Other-Resources.aspx",
        retrievedAt: COUNTRY_ROI_DATA_META.lastUpdated,
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        method: "official-download",
        reviewStatus: "approved",
        note: "MOM monthly median basic and gross wages by SSOC occupation; occupation-level figures are directional.",
      },
      tax: taxEstimateSource,
      rent: {
        confidence: "official",
        sourceName: "URA rental statistics",
        sourceUrl: "https://www.ura.gov.sg/realEstateIIWeb/rental/search.action",
        retrievedAt: COUNTRY_ROI_DATA_META.lastUpdated,
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        method: "official-download",
        reviewStatus: "approved",
        note: "URA CCR/RCR/OCR rental indices as transparent market proxies.",
      },
      budget: methodologySource,
      policy: {
        confidence: "official",
        sourceName: "MOM Employment Pass",
        sourceUrl: "https://www.mom.gov.sg/passes-and-permits/employment-pass",
        retrievedAt: COUNTRY_ROI_DATA_META.lastUpdated,
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        method: "official-web",
        reviewStatus: "approved",
        note: "EP, S Pass, and COMPASS framework reference for employer-sponsored foreign workers.",
      },
    },
  },
  {
    code: "KR",
    name: "South Korea",
    slug: "south-korea",
    href: "/kr",
    hubHref: "/kr",
    cities: "Seoul, Busan, Daejeon",
    policy: "Job-seeking visa (D-10) + E-series work visas",
    verdict:
      "A strong fit for students targeting tech, manufacturing, K-content, or healthcare paths in a fast-paced market with structured post-study work options.",
    initialBudget: "US$12k-24k",
    rent: "US$650/mo",
    tax: "15-25% effective",
    bestMajors: ["Software Engineering", "Data Science", "Manufacturing"],
    salaries: {
      first: "US$32k",
      year3: "US$42k",
      year5: "US$52k",
      year10: "US$72k",
    },
    score: { software: 84, data: 82, nursing: 75, engineering: 86, business: 78 },
    goalFit: { salary: 76, immigration: 70, "low-cost": 82 },
    budgetFit: { lean: 85, balanced: 82, premium: 65 },
    detail: {
      bestFor: [
        "Students targeting tech, manufacturing, engineering, or healthcare roles in the Korean market.",
        "Applicants who want structured post-study work-visa options and a fast-growing economy.",
        "People who can work in Korean or bilingual environments and value East Asian connectivity.",
      ],
      watchouts: [
        "Korean language proficiency significantly affects employability outside international companies.",
        "Seoul rent and jeonse deposits can be high relative to entry-level graduate salaries.",
        "E-series work visa eligibility depends on field, salary, and employer sponsorship.",
      ],
      policyHighlights: [
        "Korea Immigration Service publishes the D-10 job-seeking visa for eligible graduates of Korean higher education.",
        "E-series work visas (E-7, E-7-4) are available for qualified workers meeting occupation and salary criteria.",
        "The Working Holiday visa is available for eligible nationalities but is not a work-permit route.",
      ],
      budgetBreakdown: [
        { label: "Minimum runway", value: "US$12k-24k", note: "Lower tuition options, housing setup, visa costs, and first 90 days." },
        { label: "Student rent proxy", value: "US$650/mo", note: "Shared/student housing estimate; Seoul can be materially higher." },
        { label: "Effective tax preview", value: "15-25%", note: "Simplified income tax and social insurance estimate." },
      ],
      nextSteps: [
        { label: "Browse Korea occupations", href: "/kr/jobs", note: "Check KEIS salary and shortage data." },
        { label: "Open Korea map", href: "/map?country=kr", note: "Compare regions and university locations." },
        { label: "Run ROI Explorer", href: "/roi-explorer?country=kr", note: "Compare Korean study cost and salary." },
      ],
    },
    sources: {
      salary: {
        confidence: "official",
        sourceName: "Korea Employment Information Service",
        sourceUrl: "https://www.keis.or.kr/eng/index.do",
        retrievedAt: COUNTRY_ROI_DATA_META.lastUpdated,
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        method: "official-web",
        reviewStatus: "approved",
        note: "KEIS occupation-level salary signals; figures are directional estimates for comparison.",
      },
      tax: taxEstimateSource,
      rent: rentEstimateSource,
      budget: methodologySource,
      policy: {
        confidence: "official",
        sourceName: "Korea Immigration Service",
        sourceUrl: "https://www.immigration.go.kr/immigration_eng/index.do",
        retrievedAt: COUNTRY_ROI_DATA_META.lastUpdated,
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        method: "official-web",
        reviewStatus: "approved",
        note: "D-10 job-seeking visa and E-series work visa reference.",
      },
    },
  },
  {
    code: "JP",
    name: "Japan",
    slug: "japan",
    href: "/jp",
    hubHref: "/jp",
    cities: "Tokyo, Osaka, Nagoya",
    policy: "Designated activities visa + work visa (Engineering/Humanities)",
    verdict:
      "A strong fit for students targeting tech, engineering, manufacturing, or research paths, with structured post-study work options and deep employer demand.",
    initialBudget: "US$15k-30k",
    rent: "US$800/mo",
    tax: "15-25% effective",
    bestMajors: ["Computer Science", "Engineering", "Data Science"],
    salaries: {
      first: "US$32k",
      year3: "US$42k",
      year5: "US$52k",
      year10: "US$70k",
    },
    score: { software: 86, data: 82, nursing: 78, engineering: 90, business: 76 },
    goalFit: { salary: 78, immigration: 72, "low-cost": 80 },
    budgetFit: { lean: 82, balanced: 80, premium: 68 },
    detail: {
      bestFor: [
        "Students targeting software, engineering, manufacturing, or research roles in a technology-driven economy.",
        "Applicants who want structured post-study work-visa options and deep employer networks.",
        "People who can work in Japanese or bilingual environments and value East Asian connectivity.",
      ],
      watchouts: [
        "Japanese language proficiency is often required for non-tech roles and significantly affects employability.",
        "Tokyo rent can be high relative to entry-level graduate salaries.",
        "The designated activities visa for job-seeking is time-limited and must be converted into a qualifying work route.",
      ],
      policyHighlights: [
        "Immigration Services Agency publishes the designated activities visa for job-seeking after graduation.",
        "Work visas (Engineer/Specialist in Humanities/International Services) are available for qualified workers.",
        "Japan offers permanent residency after 10 years of continuous residence (or faster under highly-skilled points).",
      ],
      budgetBreakdown: [
        { label: "Minimum runway", value: "US$15k-30k", note: "Tuition, visa costs, housing setup, and first 90 days." },
        { label: "Student rent proxy", value: "US$800/mo", note: "Shared/student housing estimate; Tokyo can be materially higher." },
        { label: "Effective tax preview", value: "15-25%", note: "Simplified income tax and social insurance estimate." },
      ],
      nextSteps: [
        { label: "Browse Japan occupations", href: "/jp/jobs", note: "Check MHLW salary and shortage data." },
        { label: "Open Japan map", href: "/map?country=jp", note: "Compare prefectures and university locations." },
        { label: "Run ROI Explorer", href: "/roi-explorer?country=jp", note: "Compare Japanese study cost and salary." },
      ],
    },
    sources: {
      salary: {
        confidence: "official",
        sourceName: "MHLW Wage Structure Survey",
        sourceUrl: "https://www.mhlw.go.jp/content/001692996.xlsx",
        retrievedAt: COUNTRY_ROI_DATA_META.lastUpdated,
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        method: "official-download",
        reviewStatus: "approved",
        note: "MHLW occupation-level wage data; figures are directional estimates for comparison.",
      },
      tax: taxEstimateSource,
      rent: rentEstimateSource,
      budget: methodologySource,
      policy: {
        confidence: "official",
        sourceName: "Immigration Services Agency of Japan",
        sourceUrl: "https://www.isa.go.jp/en/",
        retrievedAt: COUNTRY_ROI_DATA_META.lastUpdated,
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        method: "official-web",
        reviewStatus: "approved",
        note: "Designated activities and work visa reference for post-study employment.",
      },
    },
  },
  {
    code: "CH",
    name: "Switzerland",
    slug: "switzerland",
    href: "/ch",
    hubHref: "/ch",
    cities: "Zurich, Geneva, Basel",
    policy: "6-month job-search permit after graduation + B permit for employed workers",
    verdict:
      "A high-salary, high-cost destination for engineering, pharma, finance, and tech, with excellent quality of life but strict immigration control for non-EU/EFTA nationals.",
    initialBudget: "US$28k-55k",
    rent: "US$1,400/mo",
    tax: "15-25% effective",
    bestMajors: ["Engineering", "Finance", "Computer Science"],
    salaries: {
      first: "US$65k",
      year3: "US$80k",
      year5: "US$95k",
      year10: "US$125k",
    },
    score: { software: 88, data: 84, nursing: 78, engineering: 94, business: 90 },
    goalFit: { salary: 95, immigration: 58, "low-cost": 35 },
    budgetFit: { lean: 32, balanced: 55, premium: 95 },
    detail: {
      bestFor: [
        "Students targeting engineering, pharma, finance, or tech roles in one of the highest-salary markets globally.",
        "Applicants who can fund a high initial budget and want excellent quality of life.",
        "People with German, French, or Italian language ability who can navigate cantonal immigration rules.",
      ],
      watchouts: [
        "Non-EU/EFTA graduates face stricter immigration quotas and longer processing times.",
        "Rent in Zurich and Geneva is among the highest in Europe.",
        "Swiss work permits depend on cantonal quotas, employer sponsorship, and qualification recognition.",
      ],
      policyHighlights: [
        "SEMO publishes the 6-month job-search residence permit for eligible Swiss-educated graduates.",
        "B permit for employed workers is tied to employer sponsorship and cantonal approval.",
        "Non-EU/EFTA nationals are subject to annual quotas for Swiss work permits.",
      ],
      budgetBreakdown: [
        { label: "Minimum runway", value: "US$28k-55k", note: "Tuition, visa costs, housing deposit, and first 90 days." },
        { label: "Student rent proxy", value: "US$1,400/mo", note: "Shared/student housing estimate; Zurich and Geneva can be materially higher." },
        { label: "Effective tax preview", value: "15-25%", note: "Simplified federal, cantonal, and communal tax estimate." },
      ],
      nextSteps: [
        { label: "Browse Switzerland occupations", href: "/ch/jobs", note: "Check BFS salary and shortage data." },
        { label: "Open Switzerland map", href: "/map?country=ch", note: "Compare cantons and university locations." },
        { label: "Run ROI Explorer", href: "/roi-explorer?country=ch", note: "Compare Swiss study cost and salary." },
      ],
    },
    sources: {
      salary: {
        confidence: "official",
        sourceName: "BFS Swiss wage structure",
        sourceUrl: "https://www.bfs.admin.ch/bfs/en/home/statistics/work-income.html",
        retrievedAt: COUNTRY_ROI_DATA_META.lastUpdated,
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        method: "official-download",
        reviewStatus: "approved",
        note: "BFS occupation-level wage data; figures are directional estimates for comparison.",
      },
      tax: taxEstimateSource,
      rent: rentEstimateSource,
      budget: methodologySource,
      policy: {
        confidence: "official",
        sourceName: "SEMO job-search permit after graduation",
        sourceUrl: "https://www.sem.admin.ch/sem/en/home/work/non-eu-efta/graduates-of-swiss-higher-education-institutions.html",
        retrievedAt: COUNTRY_ROI_DATA_META.lastUpdated,
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        method: "official-web",
        reviewStatus: "approved",
        note: "Post-graduation job-search permit and B permit reference for non-EU/EFTA graduates.",
      },
    },
  },
  {
    code: "AE",
    name: "United Arab Emirates",
    slug: "united-arab-emirates",
    href: "/ae",
    hubHref: "/ae",
    cities: "Dubai, Abu Dhabi, Sharjah",
    policy: "Student visa → employment visa / Green visa / Golden visa",
    verdict:
      "A tax-free salary destination for finance, tech, energy, and construction, with fast visa processing but no permanent-residence path for most workers.",
    initialBudget: "US$20k-42k",
    rent: "US$1,100/mo",
    tax: "0% income tax",
    bestMajors: ["Finance", "Software Engineering", "Civil Engineering"],
    salaries: {
      first: "US$38k",
      year3: "US$50k",
      year5: "US$62k",
      year10: "US$85k",
    },
    score: { software: 82, data: 80, nursing: 72, engineering: 84, business: 86 },
    goalFit: { salary: 85, immigration: 55, "low-cost": 60 },
    budgetFit: { lean: 58, balanced: 72, premium: 90 },
    detail: {
      bestFor: [
        "Students targeting finance, tech, energy, or construction roles in a tax-free salary environment.",
        "Applicants who want fast visa processing and a cosmopolitan business hub.",
        "People who can manage high rent costs in exchange for zero personal income tax.",
      ],
      watchouts: [
        "There is no permanent-residence path for most workers; visa sponsorship ties employment to employer.",
        "Dubai and Abu Dhabi rent can be high relative to entry-level graduate salaries.",
        "Emiratisation policies affect certain sectors and may limit opportunities for foreign workers.",
      ],
      policyHighlights: [
        "ICP publishes the student visa and post-study employment visa routes for eligible graduates.",
        "The Green visa allows self-sponsored employment for skilled workers meeting salary thresholds.",
        "The Golden visa is available for investors, entrepreneurs, and highly specialised talent.",
      ],
      budgetBreakdown: [
        { label: "Minimum runway", value: "US$20k-42k", note: "Tuition, visa costs, housing deposit, and first 90 days." },
        { label: "Student rent proxy", value: "US$1,100/mo", note: "Shared/student housing estimate; Dubai can be materially higher." },
        { label: "Effective tax preview", value: "0%", note: "UAE levies no personal income tax; 5% VAT applies to some goods and services." },
      ],
      nextSteps: [
        { label: "Browse UAE occupations", href: "/ae/jobs", note: "Check MOHRE and TASC shortage data." },
        { label: "Open UAE map", href: "/map?country=ae", note: "Compare emirates and living costs." },
        { label: "Run ROI Explorer", href: "/roi-explorer?country=ae", note: "Compare UAE study cost and salary." },
      ],
    },
    sources: {
      salary: methodologySource,
      tax: {
        confidence: "official",
        sourceName: "UAE Federal Tax Authority",
        sourceUrl: "https://tax.gov.ae/en/",
        retrievedAt: COUNTRY_ROI_DATA_META.lastUpdated,
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        method: "official-web",
        reviewStatus: "approved",
        note: "UAE levies no personal income tax; this is an official zero-rate reference.",
      },
      rent: rentEstimateSource,
      budget: methodologySource,
      policy: {
        confidence: "official",
        sourceName: "ICP UAE visa routes",
        sourceUrl: "https://ICP.gov.ae/en/",
        retrievedAt: COUNTRY_ROI_DATA_META.lastUpdated,
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        method: "official-web",
        reviewStatus: "approved",
        note: "Student, employment, Green, and Golden visa reference for UAE immigration.",
      },
    },
  },
]
