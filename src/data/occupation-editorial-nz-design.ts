import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type NzDesignOverride = {
  id: string
  countryCode: "NZ"
  editorial: CountryOccupationEditorial
}

export const NZ_DESIGN_OCCUPATION_EDITORIAL_OVERRIDES: readonly NzDesignOverride[] = [
  {
    id: "graphic-designer",
    countryCode: "NZ",
    editorial: {
      headline: "A portfolio-led ANZSCO 232411 design profession with accessible study routes and no current Green List shortcut",
      entryPathway:
        "Tahatū describes Graphic Designer as typically requiring relevant graphics/design study plus a portfolio, with 0-3 years of training shown for the occupation.",
      registration:
        "Graphic Designer is not a statutorily registered occupation in New Zealand. Employers generally assess portfolio quality, software capability and relevant education or experience.",
      jobMarketNote:
        "The canonical scope maps directly to ANZSCO 232411 Graphic Designer. The occupation is not on the current 9 March 2026 Green List.",
      scoreCaveat:
        "No shortage credit is inferred. Salary uses the midpoint of Tahatū's current most-common Graphic Designer range and visa credit remains standard rather than Green List based.",
    },
  },
  {
    id: "ux-designer",
    countryCode: "NZ",
    editorial: {
      headline: "A high-paying digital-design profession with a direct Tahatū career profile but a conservative immigration-classification treatment",
      entryPathway:
        "Tahatū describes User Experience Designer as usually requiring relevant tertiary study in design, communication/media, computer science or a related field, together with a UX portfolio; its training range is 0-5 years.",
      registration:
        "UX design is not a statutorily registered profession. Portfolio evidence, user research, interaction design, accessibility and prototyping capability are the main entry signals.",
      jobMarketNote:
        "ANZSCO 2021 contains 261113 User Experience Designer (ICT), but the reviewed New Zealand immigration layer still requires care around ANZSCO 1.3 and the transition to the NOL. No older-code proxy is promoted to the canonical profile.",
      scoreCaveat:
        "No Green List credit is assigned. Visa scoring is conservative because a specific role still needs to be classified by its actual duties, while salary uses Tahatū's exact User Experience Designer range.",
    },
  },
  {
    id: "multimedia-designer",
    countryCode: "NZ",
    editorial: {
      headline: "An ANZSCO 232413 digital-media design role kept separate from the Green List ICT occupation Multimedia Specialist 261211",
      entryPathway:
        "ANZSCO 232413 covers multimedia design. Tahatū's multimedia-computing study layer provides direct bachelor and diploma routes covering text, audio, video, graphics and animation.",
      registration:
        "Multimedia Designer is not a statutorily registered occupation. Entry is generally portfolio- and skills-led, supported by relevant digital-media or design study.",
      jobMarketNote:
        "The current Green List names Multimedia Specialist 261211, which is a separate ICT occupation. That policy status is not transferred to Multimedia Designer 232413.",
      scoreCaveat:
        "Shortage remains zero and visa credit is standard. Tahatū has no clean exact Multimedia Designer pay page in the reviewed layer, so the Graphic Designer range is used as a transparent conservative digital-design salary proxy.",
    },
  },
  {
    id: "animator",
    countryCode: "NZ",
    editorial: {
      headline: "A portfolio-driven animation profession mapped to the ANZSCO 232412 Illustrator animator specialisation",
      entryPathway:
        "Tahatū's Visual Effects Artist and Animator profile describes experience and a work portfolio as core requirements, with relevant communication/media or graphics/design study useful and a 0-2 year training range.",
      registration:
        "Animator is not a statutorily licensed or registered profession in New Zealand.",
      jobMarketNote:
        "Under ANZSCO 1.3, Animator is a specialisation of 232412 Illustrator. It is not on the current Green List.",
      scoreCaveat:
        "No shortage points are assigned. Salary uses Tahatū's current Visual Effects Artist and Animator range and entry accessibility reflects the portfolio-led 0-2 year route.",
    },
  },
  {
    id: "interior-designer",
    countryCode: "NZ",
    editorial: {
      headline: "A direct ANZSCO 232511 interior-design pathway with diploma-to-degree options and no statutory register",
      entryPathway:
        "Tahatū describes Interior Designer entry through relevant experience plus optional advanced certificate/diploma, bachelor's or master's-level interior-design study, with a 0-5 year training range.",
      registration:
        "Interior Designer is not a statutorily protected or universally registered occupation in New Zealand.",
      jobMarketNote:
        "The canonical role maps directly to ANZSCO 232511 Interior Designer and is not on the current Green List.",
      scoreCaveat:
        "No shortage credit is assigned. Salary uses Tahatū's current Interior Designer range, while visa treatment remains standard for a qualifying skilled role.",
    },
  },
  {
    id: "film-editor",
    countryCode: "NZ",
    editorial: {
      headline: "A direct ANZSCO 212314 film-and-video editing role with experience-led entry and no current Green List shortcut",
      entryPathway:
        "Tahatū states that Film and Video Editors need relevant experience, with a New Zealand Diploma in Digital Media and Design or a Bachelor of Screen Arts among useful study options; training is shown as 0-4 years.",
      registration:
        "Film and Video Editor is not a statutorily registered profession in New Zealand.",
      jobMarketNote:
        "The canonical profile maps directly to ANZSCO 212314 Film and Video Editor. The occupation is not on the current Green List.",
      scoreCaveat:
        "No shortage credit is inferred from wider screen-sector activity. Salary uses Tahatū's current Film and Video Editor range and visa scoring remains standard.",
    },
  },
  {
    id: "architect",
    countryCode: "NZ",
    editorial: {
      headline: "A regulated ANZSCO 232111 profession with a protected title, substantial NZRAB pathway and no current Green List shortcut",
      entryPathway:
        "A common route is a recognised professional architecture qualification followed by the practical-experience requirements for NZRAB registration. NZRAB also maintains alternative pathways for applicants with different qualification and experience backgrounds.",
      registration:
        "Only a person currently registered with the New Zealand Registered Architects Board can use the title architect when providing building design services in New Zealand.",
      jobMarketNote:
        "The canonical role maps to ANZSCO 232111 Architect. NZRAB registration is mandatory for use of the protected professional title, but the occupation is not on the current Green List.",
      scoreCaveat:
        "Registration and professional-experience requirements reduce entry accessibility. Salary uses Tahatū's current Architect range; no shortage or Green List points are added.",
    },
  },
  {
    id: "web-designer",
    countryCode: "NZ",
    editorial: {
      headline: "A direct ANZSCO 232414 web-design role with a strong current pay range and accessible portfolio-led entry",
      entryPathway:
        "Tahatū describes Web Designer as usually entered through relevant experience, graphics/design study and a portfolio, with 0-3 years of training shown for the occupation.",
      registration:
        "Web Designer is not a statutorily registered occupation in New Zealand.",
      jobMarketNote:
        "The canonical role maps directly to ANZSCO 232414 Web Designer. It is not on the current Green List.",
      scoreCaveat:
        "No shortage credit is assigned. Salary uses Tahatū's current Web Designer range and visa credit remains standard rather than Green List based.",
    },
  },
] as const
