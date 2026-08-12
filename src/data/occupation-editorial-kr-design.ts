import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type KoreaDesignOccupationEditorialOverride = {
  id: string
  countryCode: "KR"
  editorial: CountryOccupationEditorial
}

export const KOREA_DESIGN_OCCUPATION_EDITORIAL_OVERRIDES: readonly KoreaDesignOccupationEditorialOverride[] = [
  {
    id: "graphic-designer",
    countryCode: "KR",
    editorial: {
      headline: "A direct visual-design occupation mapped to KECO 4154, with portfolio-based entry and no universal personal licence",
      entryPathway:
        "Graphic Designer maps to KECO 2025 code 4154 시각 디자이너. Visual communication and visual design degrees are direct academic routes, while broader art, design and industrial-design programmes remain related study rather than guaranteed occupation entry. Portfolio quality and applied software skills are central to hiring.",
      registration:
        "There is no universal statutory personal licence for Graphic Designers in Korea. National technical qualifications such as visual-design credentials may support employability but are not treated as mandatory occupational registration.",
      jobMarketNote:
        "Two reviewed Korean visual-design programmes are retained as direct study links and four broader design programmes as related pathways. CampCareer does not yet publish exact recurring KECO 4154 vacancy, comparable salary or shortage evidence for KR v1.",
      scoreCaveat:
        "KR v1 credits accessible portfolio-based entry and low universal licensing burden only. Shortage, vacancy intensity, salary, growth and occupation-specific visa components remain unscored.",
    },
  },
  {
    id: "ux-designer",
    countryCode: "KR",
    editorial: {
      headline: "A current UX/UI design scope within Korea's visual-design family, kept separate from software engineering and web development",
      entryPathway:
        "UX Designer is represented conservatively within KECO 4154 시각 디자이너, restricted to UX/UI and service-experience design. Korean employment and training sources recognise UX/UI designers within visual-design practice, while CampCareer does not treat UX design as equivalent to web development or software engineering. Six reviewed design programmes remain related pathways rather than direct occupational guarantees.",
      registration:
        "There is no universal statutory licence for UX Designers. Portfolio evidence, user research, prototyping and product-design capability are employer requirements rather than a national occupational registration regime.",
      jobMarketNote:
        "The Korean programme catalogue contains six reviewed design programmes linked as related pathways. Exact UX-only national vacancy, salary and shortage series are not normalised because KECO 4154 remains broader than the canonical UX occupation.",
      scoreCaveat:
        "The broader KECO mapping is kept provisional. KR v1 scores only entry accessibility and low licensing burden and does not reuse software-development or broad design-sector demand as UX-only evidence.",
    },
  },
  {
    id: "multimedia-designer",
    countryCode: "KR",
    editorial: {
      headline: "A direct media-content design family under KECO 4155 with digital-content and visual-media study routes",
      entryPathway:
        "Multimedia Designer maps to KECO 2025 code 4155 미디어 콘텐츠 디자이너. The current classification covers web and other media-content design, including motion-graphics and related digital visual production. Two reviewed digital-content and visual-media programmes are retained as direct links and two media-communication programmes as related study.",
      registration:
        "There is no universal statutory personal licence for Multimedia Designers in Korea. Relevant software, content-production and portfolio skills are employment signals rather than regulated occupational registration.",
      jobMarketNote:
        "CampCareer preserves the KECO 4155 family without importing employment observations from adjacent film, broadcasting or software roles. Exact recurring 4155 vacancy and comparable salary evidence is not yet normalised for KR v1.",
      scoreCaveat:
        "KR v1 credits structured study and portfolio entry only; shortage, vacancy, salary, growth and occupation-specific visa components remain zero pending exact comparable evidence.",
    },
  },
  {
    id: "animator",
    countryCode: "KR",
    editorial: {
      headline: "An exact animation profession inside KECO 4143, distinct from general multimedia and video-editing work",
      entryPathway:
        "Animator maps to KECO 2025 code 4143 만화가 및 만화영화 작가, which includes animation production. One reviewed Digital Content degree remains a related study pathway. Entry is strongly portfolio and production-reel based, and the classification is kept separate from 4155 media-content design and 4166 video editing.",
      registration:
        "There is no universal statutory occupational licence for Animators in Korea. Technical and creative software credentials can be useful but are not mandatory personal registration.",
      jobMarketNote:
        "The current reviewed programme catalogue does not contain a direct animation-specific Korean degree mapping, so the existing Digital Content link remains related. No broader content-industry demand is converted into animator-only labour-market scoring.",
      scoreCaveat:
        "KR v1 gives conservative entry credit because the current programme evidence is related rather than direct. Market and occupation-specific visa components remain unscored.",
    },
  },
  {
    id: "interior-designer",
    countryCode: "KR",
    editorial: {
      headline: "A direct KECO 4153 interior-design occupation with one reviewed specialist programme and no universal designer licence",
      entryPathway:
        "Interior Designer maps directly to KECO 2025 code 4153 실내장식 디자이너. The classification covers interior, display and related spatial-decoration design. One reviewed Interior Architecture Design programme is retained as a direct study pathway, while construction execution and legally reserved architectural services remain separate occupational scopes.",
      registration:
        "There is no universal statutory personal licence for the broad Interior Designer occupation. Specific construction, technical or architectural responsibilities can require separate qualifications, but those are not attributed to every interior-design role.",
      jobMarketNote:
        "The direct KECO mapping and specialist programme support a clear occupation profile, but exact recurring 4153 vacancy, salary, shortage and growth evidence is not yet normalised for KR v1.",
      scoreCaveat:
        "Only entry accessibility and non-universal registration burden are scored. Architect licensing and construction-role requirements are not transferred to the general interior-design profile.",
    },
  },
  {
    id: "film-editor",
    countryCode: "KR",
    editorial: {
      headline: "A direct video and film editing occupation under KECO 4166, separated from general media-content design",
      entryPathway:
        "Film Editor maps directly to KECO 2025 code 4166 영상·녹화 및 편집 기사. The occupation includes film, broadcast and digital video editing work. Four reviewed Korean media and visual-media programmes remain related pathways because none is promoted beyond its existing reviewed relation.",
      registration:
        "There is no universal statutory occupational licence for Film Editors. Editing systems, post-production workflows and a production reel are employer-facing skills rather than national registration requirements.",
      jobMarketNote:
        "The classification is exact at KECO 4166, but CampCareer has not yet normalised a recurring exact-code Korean vacancy, salary, shortage or growth series. Adjacent broadcasting and content-production signals are not substituted.",
      scoreCaveat:
        "KR v1 credits portfolio-based entry and low licensing burden but keeps all labour-market and occupation-specific visa components unscored.",
    },
  },
  {
    id: "architect",
    countryCode: "KR",
    editorial: {
      headline: "A regulated Korean architect profession with KECO 1401 classification, accredited architectural education, practical training, examination and registration",
      entryPathway:
        "Architect maps to KECO 2025 code 1401 건축가. Because the CampCareer canonical label is 건축사, the Korean profile represents the regulated architect pathway rather than every architectural-design employee. The standard route includes an accredited five-year architecture education or equivalent recognised route, required practical training, the national architect qualification examination and architect registration before performing reserved architect services.",
      registration:
        "Registration is mandatory for performing 건축사 업무. Under the Architects Act, a person who passes the architect qualification examination must register to perform architect services; the Korea Architects Registration Board operated by the Korea Institute of Registered Architects administers registration delegated by the Ministry of Land, Infrastructure and Transport.",
      jobMarketNote:
        "Seven reviewed Korean architecture programmes are retained as direct study links, but degree admission or graduation alone does not guarantee professional registration. Programme accreditation, practical-training eligibility, examination eligibility and registration requirements must be checked for the individual pathway.",
      scoreCaveat:
        "KR v1 gives limited entry credit because the regulated pathway is lengthy and carries substantial professional burden. No shortage, vacancy, salary, growth or occupation-specific visa points are inferred from the broader architecture and construction sector.",
    },
  },
  {
    id: "web-designer",
    countryCode: "KR",
    editorial: {
      headline: "A current web-design scope within KECO 4155, focused on visual interface production rather than software development",
      entryPathway:
        "Web Designer maps to KECO 2025 code 4155 미디어 콘텐츠 디자이너, restricted to the web-design subset. The current occupation family explicitly includes web designers. Three reviewed visual/design programmes remain related study pathways; CampCareer does not treat them as software-development degrees or guaranteed web-design employment.",
      registration:
        "There is no universal statutory personal licence for Web Designers. Employers typically assess portfolio, interface-design capability and front-end production skills rather than national occupational registration.",
      jobMarketNote:
        "Because KECO 4155 also contains other media-content design roles, broad group labour observations are not presented as web-designer-only market evidence. Exact recurring web-design vacancy, salary and shortage evidence remains unnormalised.",
      scoreCaveat:
        "KR v1 credits relatively accessible portfolio-based entry and low licensing burden while leaving market and occupation-specific visa components unscored.",
    },
  },
]
