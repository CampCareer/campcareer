import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type JapanTechnologyOccupationEditorialOverride = {
  id: string
  countryCode: "JP"
  editorial: CountryOccupationEditorial
}

export const JAPAN_TECHNOLOGY_OCCUPATION_EDITORIAL_OVERRIDES: readonly JapanTechnologyOccupationEditorialOverride[] = [
  {
    id: "software-developer",
    countryCode: "JP",
    editorial: {
      headline: "A broad software-development career spanning several 2022 MHLW software classifications rather than one fabricated code",
      entryPathway:
        "Japan's 2022 occupation classification separates software work into 009-01 Web/open-system development, 009-02 embedded/control development, 009-03 programming and 009-99 other software-development work. CampCareer therefore keeps Software Developer as an umbrella. Computer science, information engineering and related study can prepare candidates, but portfolios, programming ability and practical development experience remain important.",
      registration:
        "There is no universal statutory occupational licence required to work as a software developer in Japan. IPA information-technology examinations and vendor certifications can support professional development but are not licences to practise software development.",
      jobMarketNote:
        "Current official statistics and job-tag pages are published for narrower or broader Japanese classifications rather than the full CampCareer Software Developer umbrella. Those figures are not merged into a synthetic exact-role labour-market series.",
      scoreCaveat:
        "The Japan v1 score is provisional and reflects entry accessibility and burden only. Shortage, recurring vacancy, exact salary, growth and occupation-specific visa components remain zero until comparable evidence is normalised for this umbrella.",
    },
  },
  {
    id: "data-analyst",
    countryCode: "JP",
    editorial: {
      headline: "A business-facing analytics role without a standalone exact 2022 MHLW occupation code",
      entryPathway:
        "The 2022 MHLW classification does not publish a standalone Data Analyst code. MHLW job tag places Data Scientist under 011-99 他に分類されない技術の職業, but CampCareer does not equate the broader business-facing Data Analyst career with Data Scientist. Quantitative, computing, economics and business study are relevant pathways, with SQL, statistics, visualisation and stakeholder communication central to entry.",
      registration:
        "There is no universal statutory occupational licence required for data analysts in Japan. Professional IT or analytics certifications may support employability but do not create a legal right to practise the occupation.",
      jobMarketNote:
        "Data-scientist statistics and individual Data Analyst advertisements are useful context but are not treated as a national exact-code Data Analyst series because the official classification lacks a standalone matching code.",
      scoreCaveat:
        "No market or visa points are inferred from related data-science statistics or individual vacancies. The provisional score reflects the study and skills pathway only.",
    },
  },
  {
    id: "data-engineer",
    countryCode: "JP",
    editorial: {
      headline: "A direct title match inside MHLW 2022 010-99, with broad-group statistics kept separate from Data Engineer evidence",
      entryPathway:
        "Data Engineer maps to 010-99 その他の情報処理・通信技術者（ソフトウェア開発を除く）, whose official examples explicitly include データエンジニア and ビッグデータエンジニア. Computer science and information programmes are common preparation, while production roles usually also require SQL, programming, database, pipeline and cloud-platform skills.",
      registration:
        "There is no universal statutory occupational licence required for data engineers in Japan. IPA and cloud or database certifications are optional professional credentials rather than licences to practise.",
      jobMarketNote:
        "010-99 is a residual IT classification containing several different occupations. Its employment or wage figures therefore cannot be presented as Data Engineer-only figures without a narrower official series.",
      scoreCaveat:
        "The direct title mapping does not justify importing broad 010-99 market statistics. Shortage, vacancy, salary, growth and visa components remain unscored in the Japan v1 profile.",
    },
  },
  {
    id: "cybersecurity-analyst",
    countryCode: "JP",
    editorial: {
      headline: "A cyber-analysis umbrella split between security operations in 010-04 and vulnerability-diagnosis work in 010-99",
      entryPathway:
        "MHLW job tag places Security Analyst / operational security work under 010-04 ITシステム運用管理者, while the 2022 classification lists vulnerability-diagnosis security experts and engineers under 010-99. Because the CampCareer career covers monitoring, incident analysis, vulnerability assessment and threat work, no single code is forced across the whole scope. Computing study is useful but hands-on systems, network and security experience is especially important.",
      registration:
        "There is no universal statutory occupational licence for cybersecurity analysts in Japan. IPA security qualifications and private certifications can evidence competence but are not general licences to work in cyber security.",
      jobMarketNote:
        "System-operations and residual-IT groups are broader than Cybersecurity Analyst. CampCareer does not combine them into an artificial exact-role market series.",
      scoreCaveat:
        "The Japan v1 score remains conservative: no shortage, vacancy, salary, growth or occupation-specific visa points are assigned from broader IT or qualitative cyber-demand evidence.",
    },
  },
  {
    id: "network-administrator",
    countryCode: "JP",
    editorial: {
      headline: "A direct network-administration scope within MHLW 2022 010-04 IT System Operations Administrators",
      entryPathway:
        "Network Administrator is represented through 010-04 ITシステム運用管理者. MHLW job tag explicitly lists ネットワーク管理者 as an alternative title. Information and communications study, networking fundamentals, server administration and practical operations experience are relevant preparation routes.",
      registration:
        "There is no universal statutory occupational licence for network administrators. IPA and vendor certifications such as networking credentials can support recruitment but are voluntary professional signals.",
      jobMarketNote:
        "The 010-04 classification also includes server and general system administration, so whole-group employment and earnings are not presented as exact Network Administrator statistics.",
      scoreCaveat:
        "The provisional score recognises accessible technical entry but keeps broad group market, growth and visa evidence at zero until a comparable role-specific series is available.",
    },
  },
  {
    id: "cloud-engineer",
    countryCode: "JP",
    editorial: {
      headline: "A cloud-infrastructure role spanning 010-02 system design and 010-04 operations rather than one exact Japanese code",
      entryPathway:
        "MHLW job tag describes modern IT infrastructure design and construction, including IaaS, PaaS and SaaS cloud environments, under 010-02 ITシステム設計技術者. Ongoing cloud monitoring and system administration fit 010-04. CampCareer therefore models Cloud Engineer as an umbrella across design/build and operations. Computing study is relevant, but cloud platforms, Linux, networking and infrastructure automation are important practical skills.",
      registration:
        "There is no universal statutory occupational licence for cloud engineers in Japan. Cloud-vendor and IPA qualifications may strengthen employability but are not licences to practise.",
      jobMarketNote:
        "Cloud work is embedded in broader infrastructure-design and operations classifications. Those groups are not merged into a synthetic Cloud Engineer labour-market series.",
      scoreCaveat:
        "The score remains provisional and uses entry/burden evidence only. Shortage, vacancy, salary, growth and occupation-specific visa components remain zero.",
    },
  },
  {
    id: "database-administrator",
    countryCode: "JP",
    editorial: {
      headline: "A database-operations scope represented inside MHLW 2022 010-04 IT System Operations Administrators",
      entryPathway:
        "Database Administrator is represented through 010-04 ITシステム運用管理者, restricted to database operations, access management, backup, recovery, performance and reliability work. Computer science and information study are relevant, while employers commonly value hands-on database and systems-administration experience.",
      registration:
        "There is no universal statutory occupational licence for database administrators. IPA Database Specialist and vendor credentials are professional qualifications, not legal licences to practise database administration.",
      jobMarketNote:
        "010-04 covers broader server, network and system administration as well as database-related work. Group figures are therefore not treated as DBA-only statistics.",
      scoreCaveat:
        "The provisional profile gives no shortage, vacancy, salary, growth or visa credit from the broader system-administration classification.",
    },
  },
  {
    id: "ict-support-technician",
    countryCode: "JP",
    editorial: {
      headline: "A direct MHLW 2022 010-05 IT Help Desk match for technical user-support work",
      entryPathway:
        "ICT Support Technician maps to 010-05 ITヘルプデスク for internal help-desk and technical user-support duties. Entry can come through IT study, workplace training, certifications or practical troubleshooting experience, making the pathway more accessible than many specialist engineering occupations.",
      registration:
        "There is no universal statutory occupational licence required for IT help-desk or ICT support work in Japan.",
      jobMarketNote:
        "MHLW job tag publishes current information for IT Help Desk, but CampCareer has not yet normalised its employment, wage and vacancy measures for direct cross-country scoring.",
      scoreCaveat:
        "The Japan v1 score therefore reflects accessible entry and low licensing burden only; market, growth and visa components remain zero pending comparable ingestion.",
    },
  },
]
