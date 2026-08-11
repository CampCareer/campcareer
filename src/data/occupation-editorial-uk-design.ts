import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type UkDesignOccupationEditorialOverride = {
  id: string
  countryCode: "UK"
  editorial: CountryOccupationEditorial
}

export const UK_DESIGN_OCCUPATION_EDITORIAL_OVERRIDES: readonly UkDesignOccupationEditorialOverride[] = [
  {
    id: "graphic-designer",
    countryCode: "UK",
    editorial: {
      headline: "A professional graphic-design scope within SOC 2142/99, with standard Skilled Worker access but a currently soft entry-level market",
      entryPathway:
        "Graphic Designer is constrained to SOC 2142/99 Graphic and multimedia designers n.e.c. Skills England's Level 6 Creative Digital Design Professional route covers digital graphic design, visual assets, branding and multi-channel design; a dedicated Graphic Designer occupational standard is also identified as a future Level 6 need.",
      registration:
        "Graphic Designer is not a statutorily protected UK profession. Employers commonly assess portfolios, software capability and relevant design education or experience rather than legal registration.",
      jobMarketNote:
        "The June 2026 UK entry-level hiring snapshot reports Graphic Designer hiring down about 28% year on year. This supports a cautious market stance rather than a shortage assumption.",
      scoreCaveat:
        "No shortage, vacancy-trend or growth points are inferred. SOC 2142 is RQF 6+ for Skilled Worker purposes, so visa credit is standard rather than shortage-list based.",
    },
  },
  {
    id: "ux-designer",
    countryCode: "UK",
    editorial: {
      headline: "A directly recognised UX profession in SOC 2141/02 with an approved Level 6 route and standard Skilled Worker access",
      entryPathway:
        "UX Designer maps directly to SOC 2141/02 UI and UX designers and researchers. Skills England's approved Level 6 Digital User Experience Professional integrated-degree route explicitly lists UX designer, UX researcher and interaction-designer titles.",
      registration:
        "UX design is not a statutorily licensed profession. Employers typically assess user-research, interaction-design, accessibility and portfolio evidence alongside degree or equivalent experience.",
      jobMarketNote:
        "UX is explicitly recognised in the current Home Office SOC 2141 Web design professionals group. No recurring occupation-specific UK shortage series is used for v1 scoring.",
      scoreCaveat:
        "Shortage remains zero. Salary uses the current Home Office SOC 2141 standard going rate, and visa credit reflects standard RQF 6+ Skilled Worker access.",
    },
  },
  {
    id: "multimedia-designer",
    countryCode: "UK",
    editorial: {
      headline: "A broad digital-media design role in SOC 2142/99, separated from the animator-specific 2142/01 sub-unit",
      entryPathway:
        "Multimedia Designer is constrained to SOC 2142/99 Graphic and multimedia designers n.e.c. Skills England's Level 6 Creative Digital Design Professional route covers digital art, video, special effects, animation, 3D graphics and interactive media.",
      registration:
        "There is no universal statutory registration for multimedia designers. Portfolio quality, production tools and discipline-specific experience are the main entry signals.",
      jobMarketNote:
        "SOC 2142 is a standard RQF 6+ Skilled Worker occupation, but current evidence reviewed for UK v1 does not establish a multimedia-designer-specific shortage.",
      scoreCaveat:
        "The role shares SOC 2142 salary evidence with Graphic Designer and digital Animator. No duplicate shortage credit is created from the wider creative-sector narrative.",
    },
  },
  {
    id: "animator",
    countryCode: "UK",
    editorial: {
      headline: "A digital-animation profile centred on SOC 2142/01 Multimedia animators, with an approved Level 4 junior route",
      entryPathway:
        "Animator is scoped primarily to SOC 2142/01 Multimedia animators. Skills England's approved Level 4 Junior Animator route covers 2D, 3D and computer-generated animation and also records hand-drawn animation as a related SOC 3411 pathway.",
      registration:
        "Animator is not a statutorily licensed profession. Entry depends heavily on showreel or portfolio quality, production-pipeline knowledge and software or traditional-animation capability.",
      jobMarketNote:
        "The canonical profile uses the multimedia-animation branch of SOC 2142 rather than the separate hand-drawn-artist group so that modern digital animation is not mixed with fine-art employment data.",
      scoreCaveat:
        "No shortage points are assigned. Entry accessibility receives more credit than the Level 6 design profiles because an approved Level 4 junior-animation route exists.",
    },
  },
  {
    id: "interior-designer",
    countryCode: "UK",
    editorial: {
      headline: "A direct SOC 3421/00 Interior Designer mapping with a developing Level 6 standard but restricted new-overseas Skilled Worker access",
      entryPathway:
        "Interior Designer maps directly to SOC 3421/00. Skills England identifies the occupation at Level 6 and is developing an Interior Designer standard; relevant interior architecture and design degrees are established entry routes.",
      registration:
        "Interior Designer is not a statutorily protected UK title. Employers and clients may value professional-body membership and building-regulation competence, but there is no universal legal register equivalent to ARB for architects.",
      jobMarketNote:
        "SOC 3421 is an RQF 3-5 occupation in the additional Skilled Worker table and is not on the current Temporary Shortage List. No direct shortage series is used.",
      scoreCaveat:
        "Visa credit is low because new overseas sponsorship is generally restricted for non-TSL RQF 3-5 occupations under the post-22 July 2025 rules, while qualifying transitional cases can remain.",
    },
  },
  {
    id: "film-editor",
    countryCode: "UK",
    editorial: {
      headline: "A broadcasting and entertainment editor scope within SOC 3416/03, with accessible post-production pathways but restricted new-overseas Skilled Worker access",
      entryPathway:
        "Film Editor is constrained to SOC 3416/03 Broadcasting and entertainment editors. Skills England's approved Level 4-5 post-production pathways cover edit support, non-linear editing, picture and sound finishing and film/television post-production workflows.",
      registration:
        "Film editing is not a statutorily licensed profession. Employers primarily assess editing craft, credits, software proficiency, workflow knowledge and a reel or portfolio.",
      jobMarketNote:
        "SOC 3416 is present in the additional RQF 3-5 Skilled Worker table but is not on the current Temporary Shortage List. Wider screen-sector activity is not treated as occupation-wide shortage evidence.",
      scoreCaveat:
        "Entry accessibility benefits from approved Level 4-5 routes, but visa credit remains low for a non-TSL RQF 3-5 occupation. Vacancy and growth components stay zero until comparable occupation-specific series are ingested.",
    },
  },
  {
    id: "architect",
    countryCode: "UK",
    editorial: {
      headline: "A regulated SOC 2451/01 profession with strong salary evidence, standard Skilled Worker access and a substantial ARB registration pathway",
      entryPathway:
        "Architect maps to SOC 2451/01 Architects excluding landscape. Skills England's Level 7 Architect integrated-degree occupation is approved and sits within the ARB-defined education, training and registration framework; the canonical Cardiff Architecture programme is therefore treated as progression rather than completed professional qualification.",
      registration:
        "The title 'architect' is protected by the Architects Act 1997. Anyone using the title in UK business or practice must be registered with the Architects Registration Board (ARB).",
      jobMarketNote:
        "Architects are a standard RQF 6+ Skilled Worker occupation. Current evidence supports a professional labour market but does not justify an occupation-specific shortage score in UK v1.",
      scoreCaveat:
        "The score receives strong salary credit but a low entry-burden accessibility component because ARB registration and the professional education/experience pathway are substantial requirements.",
    },
  },
  {
    id: "web-designer",
    countryCode: "UK",
    editorial: {
      headline: "A direct SOC 2141/03 Web Designer scope with an approved Level 6 creative-digital route and standard Skilled Worker access",
      entryPathway:
        "Web Designer maps to SOC 2141/03 Web designers. Skills England's approved Level 6 Creative Digital Design Professional route explicitly lists Web Designer and covers responsive, user-centred and multi-platform digital design.",
      registration:
        "Web Designer is not a statutorily licensed UK profession. Portfolio, responsive-design, accessibility, interface and front-end collaboration skills are normally more important than formal registration.",
      jobMarketNote:
        "Home Office guidance explicitly lists Web designers under SOC 2141 Web design professionals. No recurring web-designer-specific shortage series is available in the current v1 evidence set.",
      scoreCaveat:
        "Shortage remains zero. Salary and visa components use the same SOC 2141 evidence as UX Designer, while the canonical scope remains web-design rather than UX research.",
    },
  },
]
