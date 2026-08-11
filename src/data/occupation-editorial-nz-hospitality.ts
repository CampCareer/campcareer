import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type NzHospitalityOccupationEditorialOverride = {
  id: string
  countryCode: "NZ"
  editorial: CountryOccupationEditorial
}

export const NZ_HOSPITALITY_OCCUPATION_EDITORIAL_OVERRIDES: readonly NzHospitalityOccupationEditorialOverride[] = [
  {
    id: "chef",
    countryCode: "NZ",
    editorial: {
      headline: "A practical culinary career with direct NZ training and newly recognised NOL chef subtypes for AEWV use",
      entryPathway:
        "Chef is anchored to ANZSCO 1.3 occupation 351311 Chef. Tahatū describes direct New Zealand Certificate in Cookery routes and experience-based progression. For AEWV classification, Immigration New Zealand now recognises several NOL chef occupations, including Head Chef/Executive Chef, Sous Chef, Chef de Partie, Demi Chef de Partie and Other Chef; those subtype rules are kept separate from Green List residence scoring.",
      registration:
        "Chef is not a universally registered profession in New Zealand. Food businesses and workers must meet food-safety, allergen, hygiene and workplace requirements, but there is no single statutory chef register.",
      jobMarketNote:
        "Tahatū reports a most-common chef pay range of NZ$25–$37 an hour and training of about 0–1 year. The 9 March 2026 NOL changes improve AEWV classification coverage for chef subtypes, but Chef is not treated as a Green List occupation in this profile.",
      scoreCaveat:
        "No Green List or shortage points are awarded. Visa credit reflects an established skilled occupation plus current NOL AEWV recognition, without converting work-visa classification into residence-list status.",
    },
  },
  {
    id: "cook",
    countryCode: "NZ",
    editorial: {
      headline: "A hands-on cooking occupation mapped to ANZSCO 351411 with accessible work-based entry",
      entryPathway:
        "Cook maps to ANZSCO 1.3 occupation 351411 Cook. Tahatū lists on-the-job learning and cookery training as common routes, with training commonly taking up to three years depending on the pathway.",
      registration:
        "Cook is not a statutorily registered occupation. Food-safety and workplace rules apply to the work, but there is no universal personal occupational licence.",
      jobMarketNote:
        "Tahatū reports a most-common cook pay range of NZ$24–$32 an hour. Cook is not on the current Green List and does not receive occupation-specific shortage credit in NZ v1.",
      scoreCaveat:
        "The score benefits from accessible entry and a clear ANZSCO occupation, but it receives no Green List or shortage uplift.",
    },
  },
  {
    id: "hotel-manager",
    countryCode: "NZ",
    editorial: {
      headline: "An accommodation-management career mapped to ANZSCO 141311 with experience-led progression",
      entryPathway:
        "Hotel Manager maps to ANZSCO 1.3 occupation 141311 Hotel or Motel Manager. Tahatū's Accommodation Manager profile covers hotel, motel, hostel, holiday-park and resort management and notes experience plus hospitality study as common entry routes.",
      registration:
        "Hotel management is not universally registered. Where licensed alcohol is sold, a Licence Controller Qualification and current Manager's Certificate can be required for relevant duty-management responsibilities, but that is not a universal occupational register for all hotel managers.",
      jobMarketNote:
        "Tahatū reports a most-common accommodation-manager pay range of NZ$58,000–$103,000 a year. Hotel or Motel Manager is not a current Green List occupation.",
      scoreCaveat:
        "No Green List or shortage points are awarded. The entry-burden score remains unpenalised because alcohol-management certification is role and premises dependent rather than universal to the occupation.",
    },
  },
  {
    id: "restaurant-manager",
    countryCode: "NZ",
    editorial: {
      headline: "A food-service management occupation mapped to ANZSCO 141111 with short formal training but experience expectations",
      entryPathway:
        "Restaurant Manager maps to ANZSCO 1.3 occupation 141111 Cafe or Restaurant Manager. Tahatū says relevant hospitality experience is normally needed and that food, tourism or hospitality qualifications can be useful.",
      registration:
        "Restaurant management is not a universally registered profession. A Licence Controller Qualification and Manager's Certificate may be needed where the role includes managing licensed alcohol service, but those requirements do not apply to every restaurant manager.",
      jobMarketNote:
        "Tahatū reports a most-common restaurant-manager pay range of NZ$52,000–$83,000 a year and training of about 0–2 years. The occupation is not on the current Green List.",
      scoreCaveat:
        "General hospitality recruitment pressure is not converted into shortage points. Visa credit remains ordinary rather than targeted Green List credit.",
    },
  },
  {
    id: "baker",
    countryCode: "NZ",
    editorial: {
      headline: "A bakery trade mapped to ANZSCO 351111 with apprenticeship and certificate entry routes",
      entryPathway:
        "Baker maps to ANZSCO 1.3 occupation 351111 Baker. Tahatū lists New Zealand Certificates in Baking at Levels 3 and 4, apprenticeship training and a Level 5 diploma as relevant routes.",
      registration:
        "Baker is not a statutorily registered occupation. Food-safety, allergen, hygiene and workplace obligations apply, but there is no universal baker licence.",
      jobMarketNote:
        "Tahatū reports a most-common baker pay range of NZ$24–$35 an hour and training of about 0–2 years. Baker is not on the current Green List.",
      scoreCaveat:
        "The score benefits from direct vocational entry but receives no Green List or occupation-specific shortage points.",
    },
  },
  {
    id: "tourism-manager",
    countryCode: "NZ",
    editorial: {
      headline: "A conservative tourism-management scope anchored to ANZSCO 142116 Travel Agency Manager rather than the whole tourism sector",
      entryPathway:
        "The canonical Tourism Manager role is constrained to the travel-agency management side of tourism and mapped to ANZSCO 1.3 occupation 142116 Travel Agency Manager. Tahatū's Travel Agent profile is used as a transparent feeder proxy because it describes industry entry through experience and tourism study rather than claiming a separate exact Tourism Manager page.",
      registration:
        "Tourism management is not a universally registered profession. Business-specific consumer, transport or activity rules can apply, but there is no single personal tourism-manager register.",
      jobMarketNote:
        "Tahatū reports a most-common Travel Agent pay range of NZ$53,000–$83,000 a year. This pay is used only as a conservative travel-sector proxy; the profile does not claim a national exact Tourism Manager earnings series.",
      scoreCaveat:
        "No shortage or Green List points are awarded. The ANZSCO mapping is deliberately narrow so tour guides, activity operators and accommodation managers are not rolled into the same profile.",
    },
  },
  {
    id: "event-planner",
    countryCode: "NZ",
    editorial: {
      headline: "An event-planning occupation mapped to ANZSCO 149311 with direct Tahatū event-management evidence",
      entryPathway:
        "Event Planner maps to ANZSCO 1.3 occupation 149311 Conference and Event Organiser. Tahatū's Event Manager profile explicitly includes event planner and event coordinator as alternative titles and notes experience plus relevant tertiary study as common entry routes.",
      registration:
        "Event planning is not a statutorily registered profession. Individual events and venues can require alcohol, entertainment, safety or local-authority permissions, but there is no universal planner licence.",
      jobMarketNote:
        "Tahatū reports a most-common event-manager pay range of NZ$58,000–$91,000 a year and training of about 0–2 years. The occupation is not on the current Green List.",
      scoreCaveat:
        "No shortage or Green List points are awarded. Salary and entry credits are based on the direct Tahatū event-management scope.",
    },
  },
  {
    id: "hospitality-supervisor",
    countryCode: "NZ",
    editorial: {
      headline: "A broad NZ food-service supervision scope kept outside forced ANZSCO 1.3 coding",
      entryPathway:
        "Hospitality Supervisor uses Tahatū's Food Service Worker Supervisor profile, which includes head waiter, restaurant supervisor, host and catering supervisor. Tahatū lists relevant experience, New Zealand Certificate in Catering Services Level 3 and advanced hospitality study as useful routes.",
      registration:
        "Hospitality supervision is not universally registered. A Licence Controller Qualification and Manager's Certificate may be needed for some licensed-premises supervisory duties, but those are not universal requirements for every hospitality supervisor.",
      jobMarketNote:
        "Tahatū reports a most-common Food Service Worker Supervisor pay range of NZ$24–$33 an hour. Because ANZSCO 1.3 does not provide one clean exact Hospitality Supervisor occupation, this profile does not import newer Australia-only hospitality-supervisor codes into the NZ immigration layer.",
      scoreCaveat:
        "The classification ambiguity lowers visa credit. No Green List or shortage points are awarded, and newer Australian OSCA supervisor codes are not treated as NZ ANZSCO 1.3 occupations.",
    },
  },
]