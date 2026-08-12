import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type UsDesignOccupationEditorialOverride = {
  id: string
  countryCode: "US"
  editorial: CountryOccupationEditorial
}

export const US_DESIGN_OCCUPATION_EDITORIAL_OVERRIDES: readonly UsDesignOccupationEditorialOverride[] = [
  {
    id: "graphic-designer",
    countryCode: "US",
    editorial: {
      headline: "A broad design occupation with strong replacement demand but recent payroll-employment contraction",
      entryPathway:
        "Graphic Designer maps directly to SOC 2018 27-1024 Graphic Designers. BLS/CareerOneStop assigns bachelor's-level entry with no prior work experience or formal on-the-job training; portfolio quality remains important in practice but is not scored as a statutory credential.",
      registration:
        "There is no universal U.S. occupational licence for graphic designers. Employer software, portfolio, branding and production requirements are job-specific rather than a national registration barrier.",
      jobMarketNote:
        "May 2025 OEWS reports 197,830 wage-and-salary jobs and a $30.27 median hourly wage. BLS projections show 20,000 annual openings from a 265,900-job 2024 base, while May 2024 to May 2025 OEWS employment fell 7.67%. A current CareerOneStop/NLx snapshot also returned 8,947 U.S. postings for the SOC.",
      scoreCaveat:
        "US v2 separates projected openings intensity, industry concentration, recent OEWS employment-stock momentum, wage premium and long-run growth. The recent-momentum component is explicitly an employment-stock proxy, not a historical vacancy-series claim; no federal shortage status is inferred.",
    },
  },
  {
    id: "ux-designer",
    countryCode: "US",
    editorial: {
      headline: "A high-pay digital design pathway with above-average growth and a broad employer base",
      entryPathway:
        "UX Designer is constrained to the user-experience, usability, interaction and human-computer-interface scope within SOC 2018 15-1255 Web and Digital Interface Designers. The national SOC also includes web/interface design, so UX and Web Designer intentionally share the same national labor series rather than receiving invented separate statistics.",
      registration:
        "There is no universal statutory licence for UX designers. Employers commonly assess portfolios, research/design methods and product-tool skills, but these are hiring requirements rather than national occupational registration.",
      jobMarketNote:
        "The shared 15-1255 series has 113,330 May 2025 jobs and a $50.00 median hourly wage. BLS projects 9,100 annual openings from a 128,900-job 2024 base and 7% growth to 2034; May 2024 to May 2025 OEWS employment increased 1.73%. Current CareerOneStop/NLx returned 3,710 U.S. postings for the shared SOC, including UX/UI roles.",
      scoreCaveat:
        "The score is based on the shared 15-1255 national series and does not pretend that UX-only employment, pay or vacancy counts exist in BLS. H-1B credit remains conditional on the actual position requiring a specific-specialty degree relationship.",
    },
  },
  {
    id: "multimedia-designer",
    countryCode: "US",
    editorial: {
      headline: "A motion and multimedia design scope with high wages but a smaller, more concentrated employment base",
      entryPathway:
        "Multimedia Designer is conservatively scoped to motion, digital-effects and multimedia design work within SOC 2018 27-1014 Special Effects Artists and Animators. The national series also contains animators, so Multimedia Designer and Animator share the same BLS labor-market inputs rather than being assigned separate fictional counts.",
      registration:
        "There is no universal occupational licence. Portfolio/reel quality and specialist 2D/3D, motion, compositing or interactive-media tools can be decisive for hiring but are not statutory registration requirements.",
      jobMarketNote:
        "The shared 27-1014 series has 19,970 May 2025 wage-and-salary jobs and a $49.06 median hourly wage. BLS projects 5,000 annual openings from a 57,100-job 2024 base and 2% growth; May 2024 to May 2025 OEWS employment declined 6.16%. Current CareerOneStop/NLx returned 419 postings for the shared SOC.",
      scoreCaveat:
        "The 27-1014 statistics are shared with Animator and exclude self-employed workers from OEWS. The score records live postings as corroboration but uses the consistent BLS annual-openings intensity for cross-Design comparability.",
    },
  },
  {
    id: "animator",
    countryCode: "US",
    editorial: {
      headline: "A specialized animation occupation with strong pay and replacement openings but weak recent employment momentum",
      entryPathway:
        "Animator uses SOC 2018 27-1014 Special Effects Artists and Animators, constrained to animation work. CareerOneStop/BLS assigns bachelor's-level entry with no prior work experience or formal on-the-job training, while portfolio/reel evidence remains central to real-world hiring.",
      registration:
        "Animator is not a nationally licensed occupation. Studio-specific software, reel, artistic and technical requirements are employer qualifications rather than statutory registration.",
      jobMarketNote:
        "The shared 27-1014 series reports 19,970 May 2025 wage-and-salary jobs and a $49.06 median hourly wage. BLS projects 5,000 annual openings from 57,100 jobs in 2024 and 2% growth to 2034; OEWS employment fell 6.16% from May 2024 to May 2025. NLx showed 419 current U.S. postings for the SOC.",
      scoreCaveat:
        "Animator and Multimedia Designer deliberately share national labor metrics because BLS does not publish separate series for the two CampCareer labels. No shortage points are inferred from replacement openings or creative-industry hiring.",
    },
  },
  {
    id: "interior-designer",
    countryCode: "US",
    editorial: {
      headline: "A moderately growing design profession with healthy replacement demand and jurisdiction-specific regulation",
      entryPathway:
        "Interior Designer maps directly to SOC 2018 27-1025 Interior Designers. BLS/CareerOneStop assigns bachelor's-level entry with no prior work experience or formal on-the-job training.",
      registration:
        "Interior-design regulation is jurisdiction-specific rather than universal nationwide. Some states or jurisdictions regulate use of professional titles or practice, so the profile is not marked as universally registered but the score carries a partial entry-burden deduction.",
      jobMarketNote:
        "May 2025 OEWS reports 71,500 jobs and a $32.31 median hourly wage. BLS projects 7,800 annual openings from 87,100 jobs in 2024 and 3% growth to 2034. OEWS wage-and-salary employment increased 2.76% from May 2024 to May 2025, while 42.56% of May 2024 employment sat in Specialized Design Services.",
      scoreCaveat:
        "The employer-diversity component uses top-industry concentration as a transparent proxy rather than an invented unique-employer count. Licensing remains state/jurisdiction-specific and is not generalized to every U.S. interior-design job.",
    },
  },
  {
    id: "film-editor",
    countryCode: "US",
    editorial: {
      headline: "A skilled post-production occupation with solid replacement demand but pronounced recent payroll-employment contraction",
      entryPathway:
        "Film Editor maps directly to SOC 2018 27-4032 Film and Video Editors. CareerOneStop/BLS assigns bachelor's-level entry, no prior work experience and no formal on-the-job training; editing-reel and software specialization remain important employer filters.",
      registration:
        "There is no universal national professional registration requirement for film and video editors. Production software, reel, union or project requirements can matter but are separate from occupational licensure.",
      jobMarketNote:
        "May 2025 OEWS reports 25,610 wage-and-salary jobs and a $36.26 median hourly wage. BLS projects 3,600 annual openings from 43,500 jobs in 2024 and 4% growth to 2034, but OEWS employment fell 11.26% from May 2024 to May 2025. In May 2024, 47.68% of OEWS employment was in Motion Picture and Video Industries.",
      scoreCaveat:
        "The negative recent-momentum score reflects the observed OEWS employment-stock change, not a claim that vacancies themselves fell by the same amount. OEWS also excludes self-employed workers, an important limitation for creative freelance work.",
    },
  },
  {
    id: "architect",
    countryCode: "US",
    editorial: {
      headline: "A high-pay licensed profession with stable long-run demand but a long, regulated path to independent practice",
      entryPathway:
        "Architect maps directly to SOC 2018 17-1011 Architects, Except Landscape and Naval. BLS describes the usual licensed pathway as an architecture degree, paid internship/experience and the Architect Registration Examination; NCARB's AXP requires 3,740 documented hours across six experience areas.",
      registration:
        "All states and the District of Columbia require architects to be licensed for regulated architectural practice. Requirements vary by jurisdiction but generally combine education, documented experience and examination, with continuing-education obligations in many jurisdictions.",
      jobMarketNote:
        "May 2025 OEWS reports 106,770 jobs and a $47.73 median hourly wage. BLS projects 7,800 annual openings from 123,600 jobs in 2024 and 4% growth to 2034. OEWS employment fell 3.93% from May 2024 to May 2025, and 85.74% of May 2024 employment was concentrated in Architectural, Engineering, and Related Services.",
      scoreCaveat:
        "High pay does not erase the substantial entry barrier. US v2 therefore separately penalizes the internship/licensure path and extreme industry concentration while retaining stronger specialty-occupation visa fit for genuinely architecture-specific positions.",
    },
  },
  {
    id: "web-designer",
    countryCode: "US",
    editorial: {
      headline: "A high-pay web-interface design pathway using the same strong national labor series as UX design",
      entryPathway:
        "Web Designer is constrained to website/interface visual design, navigation, accessibility and front-end interaction work within SOC 2018 15-1255 Web and Digital Interface Designers. The same SOC includes UX/UI work, so Web Designer and UX Designer intentionally share national labor metrics.",
      registration:
        "There is no universal statutory Web Designer licence. Employers may emphasize portfolio work, accessibility, visual systems, HTML/CSS or design-tool fluency, but these are role-specific hiring criteria.",
      jobMarketNote:
        "The shared 15-1255 series reports 113,330 May 2025 jobs and a $50.00 median hourly wage. BLS projects 9,100 annual openings from 128,900 jobs in 2024 and 7% growth to 2034; May 2024 to May 2025 OEWS employment rose 1.73%. NLx returned 3,710 current U.S. postings for the shared SOC.",
      scoreCaveat:
        "The score does not manufacture separate Web-versus-UX national employment statistics. Both careers use identical shared-SOC labor inputs; their editorial and education/program pathways distinguish the role scope.",
    },
  },
]
