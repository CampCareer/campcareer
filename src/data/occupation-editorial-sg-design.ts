import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type SingaporeDesignOccupationEditorialOverride = {
  id: string
  countryCode: "SG"
  editorial: CountryOccupationEditorial
}

export const SINGAPORE_DESIGN_OCCUPATION_EDITORIAL_OVERRIDES: readonly SingaporeDesignOccupationEditorialOverride[] = [
  {
    id: "graphic-designer",
    countryCode: "SG",
    editorial: {
      headline: "A direct SSOC 21661 visual-communication occupation that explicitly includes Internet graphic design",
      entryPathway:
        "Graphic Designer maps directly to SSOC 21661. Portfolio-led graphic, communication and digital-media study are common routes. Three approved Singapore programmes are retained as related pathways because programme completion is not occupational certification.",
      registration:
        "There is no universal statutory occupational registration for Graphic Designers in Singapore.",
      jobMarketNote:
        "The classification anchor is direct, but CampCareer has not yet normalised an exact recurring 21661 shortage, vacancy, salary or growth series into the Singapore scoring model.",
      scoreCaveat:
        "SG v1 credits accessible portfolio-led entry and low regulatory burden only. Labour-market and occupation-specific visa components remain unscored.",
    },
  },
  {
    id: "ux-designer",
    countryCode: "SG",
    editorial: {
      headline: "A direct SSOC 25124 Interaction Designer occupation whose examples explicitly include UX and UI designers",
      entryPathway:
        "UX Designer maps directly to SSOC 25124 Interaction designer. Interaction design, product design, user research and digital-media study can all contribute to entry, with portfolio and applied research evidence usually important. Five approved programmes are retained as related pathways.",
      registration:
        "There is no universal statutory occupational registration for UX Designers.",
      jobMarketNote:
        "SSOC 25124 is a clean classification anchor, but CampCareer does not infer demand from the broader ICT sector or from programme availability.",
      scoreCaveat:
        "Only structured entry accessibility and low licensing burden are scored in the foundation phase. Market and visa components remain zero.",
    },
  },
  {
    id: "multimedia-designer",
    countryCode: "SG",
    editorial: {
      headline: "A direct SSOC 21662 multimedia-design occupation spanning graphics, animation, special effects and video content",
      entryPathway:
        "Multimedia Designer maps directly to SSOC 21662 Multimedia designer/artist/animator. The official scope includes graphics, 2D and 3D animation, special effects and video editing. Three approved art, digital-media and interactive-media programmes are retained as related pathways.",
      registration:
        "There is no universal statutory occupational registration for Multimedia Designers.",
      jobMarketNote:
        "Because 21662 also contains animators and other multimedia artists, CampCareer does not present its eventual market data as automatically exact for every multimedia-design specialisation.",
      scoreCaveat:
        "SG v1 scores portfolio-based entry and low regulatory burden only. Market and visa components remain unscored.",
    },
  },
  {
    id: "animator",
    countryCode: "SG",
    editorial: {
      headline: "An explicit Animator scope inside SSOC 21662 Multimedia designer/artist/animator",
      entryPathway:
        "Animator is explicitly listed under SSOC 21662. Art, design, animation, interactive-media and games programmes can support entry, but professional portfolios and production skills remain central. Two approved programmes are related pathways.",
      registration:
        "There is no universal statutory occupational registration for Animators.",
      jobMarketNote:
        "The official code is shared with multimedia designers and other artists, so CampCareer will not manufacture an animator-only market series from broader 21662 data.",
      scoreCaveat:
        "Foundation scoring recognises portfolio-led entry and low regulatory burden while leaving labour-market and visa components zero.",
    },
  },
  {
    id: "interior-designer",
    countryCode: "SG",
    editorial: {
      headline: "A direct SSOC 34321 interior-design occupation kept separate from BOA-regulated architectural practice",
      entryPathway:
        "Interior Designer maps directly to SSOC 34321, covering interior planning, design concepts, sketches, specifications and supervision of decorating work. Two approved design/architecture-adjacent programmes are related pathways rather than claims of professional registration.",
      registration:
        "The broad Interior Designer occupation is not treated as requiring Board of Architects registration. Reserved architectural practice and use of the architect title remain separate under the Architects Act.",
      jobMarketNote:
        "CampCareer keeps 34321 distinct from Building Architect 21610 and does not infer design-sector demand from architectural regulation.",
      scoreCaveat:
        "SG v1 credits the portfolio/project entry route and low broad-role licensing burden only. Market and visa components remain unscored.",
    },
  },
  {
    id: "film-editor",
    countryCode: "SG",
    editorial: {
      headline: "A creative post-production career with no exact standalone SSOC five-digit code, mapped conservatively to video-editing scope inside 21662",
      entryPathway:
        "SSOC 2024 does not provide a standalone Film Editor occupation. The closest creative reference is 21662 because its definition explicitly includes editing video content. Two approved art and digital-media programmes are retained as related pathways.",
      registration:
        "There is no universal statutory occupational registration for Film Editors.",
      jobMarketNote:
        "SSOC 26544 Editor (radio/television/video) describes editorial and script coordination rather than picture editing, so CampCareer does not mislabel it as the canonical Film Editor occupation. No proxy code is used as exact market evidence.",
      scoreCaveat:
        "The classification remains a non-rollup reference mapping. Portfolio-led entry receives foundation credit while all market and visa components remain zero.",
    },
  },
  {
    id: "architect",
    countryCode: "SG",
    editorial: {
      headline: "A direct SSOC 21610 Building Architect occupation with statutory BOA registration and practising-certificate requirements",
      entryPathway:
        "Building Architect maps directly to SSOC 21610. BOA registration requires an approved architecture qualification, prescribed practical experience and the applicable professional examination or interview route. Three approved architecture, landscape-architecture and sustainable-design programmes remain related study links because graduation alone does not confer registration.",
      registration:
        "Registration with the Board of Architects is required by law to practise architecture and to use the architect title in the regulated sense. A registered architect who intends to practise must also hold a valid Practising Certificate.",
      jobMarketNote:
        "The legal registration framework establishes professional entry requirements but is not treated as shortage, vacancy or salary evidence.",
      scoreCaveat:
        "SG v1 applies a high entry-burden discount for the protected profession. Market and occupation-specific visa components remain unscored.",
    },
  },
  {
    id: "web-designer",
    countryCode: "SG",
    editorial: {
      headline: "A web-interface design umbrella spanning SSOC 21661 Internet graphic design and 25124 interaction design rather than software development",
      entryPathway:
        "Singapore has no standalone five-digit Web Designer occupation. Visual website work is represented by 21661, which explicitly includes Internet graphic designer, while interface/usability work is represented by 25124 Interaction designer. Three approved design/media programmes are related pathways.",
      registration:
        "There is no universal statutory occupational registration for Web Designers.",
      jobMarketNote:
        "SSOC 25122 Web/Mobile applications developer is intentionally excluded from the design mapping because it is a software-development occupation. The two design references are not aggregated into fabricated exact labour-market figures.",
      scoreCaveat:
        "The umbrella mapping remains provisional. Portfolio-led entry receives foundation credit while market and visa components remain zero.",
    },
  },
]
