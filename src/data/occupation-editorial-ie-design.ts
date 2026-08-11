import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type IeDesignOccupationEditorialOverride = {
  id: string
  countryCode: "IE"
  editorial: CountryOccupationEditorial
}

export const IE_DESIGN_OCCUPATION_EDITORIAL_OVERRIDES: readonly IeDesignOccupationEditorialOverride[] = [
  {
    id: "graphic-designer",
    countryCode: "IE",
    editorial: {
      headline: "A portfolio-led graphic-design career with ordinary permit access rather than blanket Critical Skills treatment",
      entryPathway:
        "Graphic Designer maps to SOC 2010 3421 Graphic designers. Portfolio quality is central, with relevant graphic, visual-communication or digital-design education and applied client or production experience providing common entry routes.",
      registration:
        "No universal statutory personal registration is required for the broad Graphic Designer occupation in Ireland.",
      jobMarketNote:
        "SOLAS 2025 reports below-average employment growth for the wider Arts, Sports and Tourism occupational group and does not publish an exact Graphic Designer shortage. The current Critical Skills list names selected 3421 animation-design specialisms, not generic graphic design, so ordinary General Employment Permit treatment is used for the broad profile.",
      scoreCaveat:
        "Animation-specialist Critical Skills treatment is not borrowed by generic graphic design. Exact salary, recurring vacancy and growth inputs remain unscored.",
    },
  },
  {
    id: "ux-designer",
    countryCode: "IE",
    editorial: {
      headline: "A digital UX scope that can sit inside Ireland's Critical Skills web-design classification",
      entryPathway:
        "UX Designer is constrained to SOC 2010 2137 Web design and development professionals where the actual work centres on digital/web user experience and interface design. Portfolio evidence plus UX, product, interaction or digital-design education and practical research/prototyping experience are common routes.",
      registration:
        "No universal statutory personal registration is required for UX Designer.",
      jobMarketNote:
        "SOC 2137 is explicitly on the current Critical Skills Occupations List. SOLAS 2025 shows strong ICT demand but names software developers/engineers and IT analysts/engineers as shortages, not UX designers specifically.",
      scoreCaveat:
        "Critical Skills credit applies only where the duties genuinely fit SOC 2137. Broader user-research or service-design roles may classify elsewhere, and no UX-specific shortage is inferred.",
    },
  },
  {
    id: "multimedia-designer",
    countryCode: "IE",
    editorial: {
      headline: "A deliberately cross-SOC multimedia profile spanning visual design and web/digital implementation",
      entryPathway:
        "Multimedia Designer is not forced into one SOC code. Visual and multimedia design can sit in SOC 3421, while web/digital implementation can fit SOC 2137. Portfolio work across motion, graphics, interactive media and digital production is normally central to entry.",
      registration:
        "No universal statutory personal registration is required for Multimedia Designer.",
      jobMarketNote:
        "The current Critical Skills list covers SOC 2137 and selected animation-design specialisms within SOC 3421, but a generic multimedia title alone does not establish either scope. SOLAS does not publish an exact Multimedia Designer shortage in the reviewed 2025 summaries.",
      scoreCaveat:
        "The model uses conditional visa credit because actual duties determine whether CSEP-level SOC 2137 or specialist animation treatment applies. No single primary SOC is fabricated.",
    },
  },
  {
    id: "animator",
    countryCode: "IE",
    editorial: {
      headline: "An animation career with narrowly defined Critical Skills specialisms rather than universal CSEP status",
      entryPathway:
        "Animator is centred on SOC 2010 3411 Artists for animation-artist work, while related SOC 3421 animation-design specialisms are retained separately. Entry commonly depends on a strong animation reel/portfolio plus relevant training, degree study or production experience.",
      registration:
        "No universal statutory personal registration is required for Animator.",
      jobMarketNote:
        "Ireland's current Critical Skills list names specific 2D/3D animation employments under SOC 3411 and 3421, generally requiring at least one year of experience in the named role. SOLAS 2025 does not publish an occupation-wide Animator shortage.",
      scoreCaveat:
        "Generic Animator is broader than the named CSEP specialisms, so only conditional visa credit is used. Art Director SOC 2473 and Games Rigger SOC 3417 remain separate occupations.",
    },
  },
  {
    id: "interior-designer",
    countryCode: "IE",
    editorial: {
      headline: "A portfolio-led interior-design career kept separate from the protected Architect profession",
      entryPathway:
        "Interior Designer maps to SOC 2010 3422 Product, clothing and related designers, constrained to interior and spatial design work. Portfolio evidence plus interior, spatial or related design education and project experience are common entry routes.",
      registration:
        "The broad Interior Designer title is not subject to the statutory Register of Architects. No universal personal registration requirement is applied to this canonical occupation.",
      jobMarketNote:
        "SOLAS 2025 does not publish an exact Interior Designer shortage. The role is not explicitly on the Critical Skills or Ineligible lists, so ordinary General Employment Permit access may apply subject to current permit conditions.",
      scoreCaveat:
        "Interior Designer is not promoted to Architect SOC 2431 and does not borrow architect Critical Skills or protected-title treatment.",
    },
  },
  {
    id: "film-editor",
    countryCode: "IE",
    editorial: {
      headline: "A film and video post-production profile with portfolio-driven entry and ordinary permit access",
      entryPathway:
        "Film Editor is mapped to SOC 2010 3416 Arts officers, producers and directors, constrained to film/video post-production editing. An editing reel plus film, broadcasting, creative-digital-media study or equivalent production experience is a common route.",
      registration:
        "No universal statutory personal registration is required for Film Editor.",
      jobMarketNote:
        "SOLAS 2025 does not publish an exact Film Editor shortage. SOC 3416 is not explicitly on the Critical Skills or Ineligible lists, so ordinary General Employment Permit access may apply subject to current conditions.",
      scoreCaveat:
        "Camera, audio-visual and broadcasting-equipment roles in SOC 3417 are kept separate. Exact salary, recurring vacancy and growth series remain unscored.",
    },
  },
  {
    id: "architect",
    countryCode: "IE",
    editorial: {
      headline: "A Critical Skills profession with a legally protected title and a long statutory registration route",
      entryPathway:
        "Architect maps to SOC 2010 2431 and is explicitly on the current Critical Skills Occupations List. RIAI describes the typical Irish route as a prescribed five-year architecture qualification, at least two years of approved postgraduate professional training and a Professional Practice Examination before registration.",
      registration:
        "The title Architect is protected under the Building Control Act 2007. A person must be entered on the statutory Register of Architects to use the title in Ireland; the RIAI acts as the statutory Registration Body.",
      jobMarketNote:
        "Architect receives direct Critical Skills visa treatment, but SOLAS 2025 Construction does not list architects among its explicit shortage occupations. Permit status and shortage evidence therefore remain separate in the score.",
      scoreCaveat:
        "The lengthy prescribed education, professional-training and registration pathway creates a high entry burden. No occupation-specific salary or recurring vacancy series is fabricated.",
    },
  },
  {
    id: "web-designer",
    countryCode: "IE",
    editorial: {
      headline: "A web-design occupation directly covered by Ireland's SOC 2137 Critical Skills classification",
      entryPathway:
        "Web Designer maps to SOC 2010 2137 Web design and development professionals. Portfolio evidence plus web, digital-design or related higher education and practical front-end/design experience are common entry routes.",
      registration:
        "No universal statutory personal registration is required for Web Designer.",
      jobMarketNote:
        "SOC 2137 is explicitly on the current Critical Skills Occupations List. SOLAS 2025 reports strong ICT demand but does not name web designers as a separate shortage occupation.",
      scoreCaveat:
        "Visa eligibility is not double-counted as shortage. Exact salary, recurring vacancy and occupation-specific growth inputs remain unscored.",
    },
  },
]
