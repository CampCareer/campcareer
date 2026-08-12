import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type SwedenConstructionOccupationEditorialOverride = {
  id: string
  countryCode: "SE"
  editorial: CountryOccupationEditorial
}

export const SWEDEN_CONSTRUCTION_OCCUPATION_EDITORIAL_OVERRIDES: readonly SwedenConstructionOccupationEditorialOverride[] = [
  {
    id: "carpenter",
    countryCode: "SE",
    editorial: {
      headline: "SSYK 7111 carpentry with a strong 2035 structural shortage signal and a median wage above the 2026 work-permit floor",
      entryPathway:
        "Carpenter maps directly to SSYK 2012 code 7111 Träarbetare, snickare m.fl. Arbetsförmedlingen describes the standard route as upper-secondary construction training followed by employed apprenticeship; after roughly three years as an employed apprentice, a worker with complete basic training can obtain the trade certificate under the standard route.",
      registration:
        "There is no universal Swedish state licence that every carpenter must hold before employment. Construction-site safety, employer competence, collective-agreement and project requirements apply separately from state occupational registration.",
      jobMarketNote:
        "SCB reports a 2025 median salary of SEK 40,300 per month for SSYK 7111, about 5% above the national median and roughly 17% above the current SEK 34,470 general work-permit salary floor. Arbetsförmedlingen projects shortage across all four 2035 scenarios for the broader carpenter/mason/construction-worker group, with roughly 12,600–13,100 missing workers under unchanged matching and a deficit around 9% of 2023 employment.",
      scoreCaveat:
        "SE v2 treats the 2035 figure as SSYK3 group evidence rather than a carpenter-only vacancy count. An exact reproducible June 2026 national Yrkesbarometer category and posting-level vacancy ratio were not captured for SSYK 7111, so those components remain unscored instead of being estimated.",
    },
  },
  {
    id: "electrician",
    countryCode: "SE",
    editorial: {
      headline: "SSYK 7411 installation electrician with rising five-year demand, persistent structural shortage and unusually strong recent third-country permit momentum",
      entryPathway:
        "Electrician maps directly to SSYK 2012 code 7411 Installations- och serviceelektriker. Vocational electrical education and workplace learning are the common preparation route; personal authorisation as an elinstallatör is a separate regulated status rather than a prerequisite for every employed electrician.",
      registration:
        "Elsäkerhetsverket states that commercial electrical installation work may be carried out by an authorised electrician or by a person covered by an electrical installation company self-audit scheme. Every electrical installation company must have an authorised compliance electrician, but ordinary employees do not all need personal authorisation.",
      jobMarketNote:
        "The June 2026 Arbetsförmedlingen Yrkesbarometer rates certified installation and service electricians at medium current job opportunities and expects demand to increase over five years, partly with the green transition. The broader installations/industrial-electrician group is also in shortage in all four 2035 scenarios. SCB gives SSYK 7411 a 2025 median salary of SEK 40,000, about 16% above the current general work-permit floor. Arbetsförmedlingen reports third-country work permits for the broader group rising about 80%, from just over 130 in 2023 to just under 240 in 2025.",
      scoreCaveat:
        "SE v2 uses the exact Yrkesbarometer current-opportunity category as a documented Sweden-specific vacancy-intensity proxy and its five-year direction as a trend proxy. Numeric posting intensity and exact employment growth remain unscored, so the profile stays provisional despite unusually strong combined demand and migration evidence.",
    },
  },
  {
    id: "plumber",
    countryCode: "SE",
    editorial: {
      headline: "SSYK 7125 VVS with medium current opportunities, increasing five-year demand and a large structural shortage in the wider 712 group",
      entryPathway:
        "Plumber maps directly to SSYK 2012 code 7125 VVS-montörer m.fl., including VVS-montör and related pipe-installation titles. Entry is primarily vocational through VVS training, workplace learning and trade experience.",
      registration:
        "There is no universal Swedish state personal licence for the broad plumber occupation. Säker Vatten operates an industry authorisation system for VVS companies and branch credentials for work delivered under its rules; CampCareer keeps that separate from state occupational licensing.",
      jobMarketNote:
        "The June 2026 Yrkesbarometer gives certified VVS installers medium current job opportunities and expects demand to increase over five years. Arbetsförmedlingen also places the broader roof/floor/VVS group in shortage in all four 2035 scenarios, with roughly 5,000 missing workers, around 11% of 2023 employment, under unchanged matching. SCB reports a 2025 SSYK 7125 median salary of SEK 42,700, about 24% above the current general work-permit salary floor.",
      scoreCaveat:
        "SE v2 scores the exact VVS Yrkesbarometer signal, but the 2035 deficit and work-permit trend are broader SSYK3 evidence. Third-country permits in the wider group fell materially after 2023, so visa credit is positive but deliberately below the electrician profile.",
    },
  },
  {
    id: "wall-floor-tiler",
    countryCode: "SE",
    editorial: {
      headline: "A precise SSYK 7112 tiling scope backed by strong broader construction shortage evidence and a wage level comfortably above the work-permit floor",
      entryPathway:
        "Wall and Floor Tiler maps to SSYK 2012 code 7112 Murare m.fl. because the official title list explicitly includes Kakelsättare, Klinkerläggare, Mosaikläggare and Plattsättare and the scope covers tiles on both walls and floors. The route is vocational and practice-heavy, with trade competence developed through construction training and supervised site work.",
      registration:
        "There is no universal Swedish state occupational licence for the broad wall and floor tiler role. Wet-room systems, site safety, employer competence and contractor requirements can add narrower credentials without turning the whole occupation into a state-licensed profession.",
      jobMarketNote:
        "SCB reports a 2025 median salary of SEK 42,200 for the wider SSYK 7112 group, roughly 10% above the national median and 22% above the current general work-permit salary floor. The broader carpenter/mason/construction-worker group is in shortage in all four Arbetsförmedlingen 2035 scenarios, with roughly 12,600–13,100 missing workers under unchanged matching.",
      scoreCaveat:
        "The wage and 2035 shortage series are broader than the canonical tiler slice, and no exact reproducible June 2026 tiler opportunity category or posting-level vacancy ratio was captured. SE v2 therefore credits structural shortage, salary, entry accessibility and visa headroom but leaves the unsupported current-vacancy components at zero.",
    },
  },
  {
    id: "welder",
    countryCode: "SE",
    editorial: {
      headline: "SSYK 7212 welding with large current job opportunities and rising five-year demand, offset by very thin work-permit salary headroom",
      entryPathway:
        "Welder maps directly to SSYK 2012 code 7212 Svetsare och gasskärare, including MIG-, MAG-, TIG-, gas- and pipe-welding titles. Practical vocational and labour-market training routes can lead into supervised industrial or construction work, with process competence built on the job.",
      registration:
        "There is no one universal Swedish state Welder licence covering every welding job. Employers, projects and quality systems may require process-, material- or standard-specific welder tests and qualifications for particular work.",
      jobMarketNote:
        "The June 2026 Arbetsförmedlingen Yrkesbarometer rates welders and gas cutters at large current job opportunities and expects demand to increase over five years. Arbetsförmedlingen also describes work across manufacturing, construction, contractors, maintenance, bridge work and industrial pipe systems. SCB reports a 2025 median salary of SEK 35,500, below the national median but still just above the current SEK 34,470 general work-permit floor.",
      scoreCaveat:
        "SE v2 gives welding the strongest current-demand proxy in this cohort, but the median salary is only about 3% above the current work-permit threshold. That narrow headroom and the absence of a verified occupation-specific permit trend keep visa credit moderate and the overall score provisional.",
    },
  },
  {
    id: "bricklayer",
    countryCode: "SE",
    editorial: {
      headline: "SSYK 7112 bricklaying with persistent broader masonry/construction shortage and a 2025 median wage well above the general permit floor",
      entryPathway:
        "Bricklayer maps directly to SSYK 2012 code 7112 Murare m.fl.; Murare and Murarmästare are explicit official titles. Arbetsförmedlingen describes upper-secondary construction training followed by apprenticeship, with roughly 2.5 years as an apprentice before the standard trade certificate when basic training is complete.",
      registration:
        "There is no universal Swedish state personal licence for ordinary bricklaying employment. Construction-site safety and contractor or employer competence requirements remain separate from state occupational registration.",
      jobMarketNote:
        "SCB reports a 2025 median salary of SEK 42,200 for SSYK 7112, about 22% above the current general work-permit floor. The broader carpenter/mason/construction-worker group is in shortage in all four Arbetsförmedlingen 2035 scenarios, with roughly 12,600–13,100 missing workers under unchanged matching and a deficit around 9% of 2023 employment.",
      scoreCaveat:
        "SE v2 does not relabel the broader SSYK3 shortage as a bricklayer-only deficit. Because an exact June 2026 current opportunity category and posting-level vacancy ratio were not captured for the bricklayer slice, those components remain zero while structural shortage, salary, entry and visa evidence are scored.",
    },
  },
  {
    id: "hvac-technician",
    countryCode: "SE",
    editorial: {
      headline: "SSYK 7126 refrigeration and heat-pump work with strong structural shortage and salary headroom, but meaningful F-gas certification friction",
      entryPathway:
        "HVAC Technician maps to SSYK 2012 code 7126 Kyl- och värmepumpstekniker m.fl. Arbetsförmedlingen describes upper-secondary training or post-secondary education up to two years, with a YH technician route of about 1.5 years. Work spans properties, retail, industry, air conditioning, industrial processes, medical technology and ice facilities.",
      registration:
        "The occupation is broader than one universal personal licence, but Swedish and EU F-gas rules require person certification for covered installation, leak checking, refrigerant recovery, service and maintenance when equipment contains covered F-gases. Covered installation or service companies also require certification.",
      jobMarketNote:
        "SCB reports a 2025 median salary of SEK 42,400 for SSYK 7126, about 23% above the current general work-permit salary floor. The broader SSYK3 roof/floor/VVS group is in shortage in all four Arbetsförmedlingen 2035 scenarios, around 5,000 workers or 11% of 2023 employment under unchanged matching.",
      scoreCaveat:
        "SE v2 treats the 2035 shortage as group-level evidence and does not invent an exact 7126 current-vacancy series. F-gas certification reduces entry accessibility, and falling third-country permits in the broader 712 group temper the otherwise strong salary and shortage signals.",
    },
  },
  {
    id: "construction-manager",
    countryCode: "SE",
    editorial: {
      headline: "SSYK 1362 site management with persistent 2035 shortage, a high median wage and potential EU Blue Card salary compatibility",
      entryPathway:
        "Construction Manager is scoped to SSYK 2012 code 1362 Driftchefer inom bygg, anläggning och gruva, nivå 2, whose official titles include Byggplatschef, Platschef and Produktionschef in construction. Entry commonly combines built-environment or technical study with substantial project, site, contractor and people-management experience.",
      registration:
        "There is no single Swedish state occupational licence that universally authorises construction managers. Project role, work-environment responsibility, procurement and employer competence requirements can create narrower obligations without turning the broad occupation into a licensed profession.",
      jobMarketNote:
        "Arbetsförmedlingen identifies construction/civil/mining operating managers as a shortage group in all scenarios, with an unchanged-matching shortfall up to roughly 2,000 by 2035 and shortages across all or nearly all counties. SCB reports a 2025 median salary of SEK 57,300 for level-2 managers, about 50% above the national median and above both the general work-permit floor and the SEK 53,625 EU Blue Card salary threshold effective from 15 July 2026.",
      scoreCaveat:
        "The occupation median clearing the Blue Card salary threshold does not make every job Blue Card eligible: the role must still be highly qualified and the applicant needs qualifying higher education or at least five years of relevant experience. Exact current vacancy intensity and numeric employment growth remain unscored, so SE v2 remains provisional.",
    },
  },
]
