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
    slug: "australia",
    href: "/countries/australia",
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
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        note: "Skilled occupation list and skilled migration pathway reference.",
      },
    },
  },
  {
    code: "US",
    name: "United States",
    slug: "united-states",
    href: "/countries/united-states",
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
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        note: "Occupation-level salary signals are based on BLS/OES-derived CampCareer datasets.",
      },
      tax: taxEstimateSource,
      rent: rentEstimateSource,
      budget: methodologySource,
      policy: {
        confidence: "official",
        sourceName: "USCIS Optional Practical Training",
        sourceUrl: "https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-opt-for-f-1-students",
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        note: "F-1 OPT and post-study work authorization reference.",
      },
    },
  },
  {
    code: "CA",
    name: "Canada",
    slug: "canada",
    href: "/countries/canada",
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
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        note: "PGWP eligibility and post-study work reference.",
      },
    },
  },
  {
    code: "IE",
    name: "Ireland",
    slug: "ireland",
    href: "/countries/ireland",
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
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        note: "Graduate earnings and employment outcomes by field; occupation salary figures remain directional.",
      },
      tax: taxEstimateSource,
      rent: rentEstimateSource,
      budget: methodologySource,
      policy: {
        confidence: "official",
        sourceName: "Irish Immigration Service Third Level Graduate Programme",
        sourceUrl: "https://www.irishimmigration.ie/my-situation-has-changed-since-i-arrived-in-ireland/third-level-graduate-programme/",
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        note: "Post-study permission reference for eligible Irish-educated non-EEA graduates.",
      },
    },
  },
  {
    code: "DE",
    name: "Germany",
    slug: "germany",
    href: "/countries/germany",
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
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        note: "EU Blue Card work-residence pathway reference.",
      },
    },
  },
  {
    code: "UK",
    name: "United Kingdom",
    slug: "united-kingdom",
    href: "/countries/united-kingdom",
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
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        note: "Graduate route and post-study stay reference.",
      },
    },
  },
  {
    code: "NL",
    name: "Netherlands",
    slug: "netherlands",
    href: "/countries/netherlands",
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
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        note: "Orientation year after graduation, doctorate, or research reference.",
      },
    },
  },
  {
    code: "BE",
    name: "Belgium",
    slug: "belgium",
    href: "/countries/belgium",
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
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        note: "Belgian gross salary reference; occupation-level figures are merged with Jobat and market datasets where needed.",
      },
      tax: {
        confidence: "official",
        sourceName: "FPS Finance Belgium tax rates",
        sourceUrl: "https://fin.belgium.be/en/individuals/taxation/tax-rates/income-tax-rates",
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        note: "Simplified tax preview derived from official Belgian tax-rate structure.",
      },
      rent: rentEstimateSource,
      budget: methodologySource,
      policy: {
        confidence: "official",
        sourceName: "IBZ Search year after higher studies",
        sourceUrl: "https://dofi.ibz.be/en/themes/third-country-nationals/study/search-year-after-higher-studies",
        lastChecked: COUNTRY_ROI_DATA_META.lastUpdated,
        note: "Post-study search year reference for eligible third-country graduates.",
      },
    },
  },
]
