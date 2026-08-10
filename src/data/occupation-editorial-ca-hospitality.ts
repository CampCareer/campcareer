import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type CanadaHospitalityOccupationEditorialOverride = {
  id: string
  countryCode: "CA"
  editorial: CountryOccupationEditorial
}

export const CANADA_HOSPITALITY_OCCUPATION_EDITORIAL_OVERRIDES: readonly CanadaHospitalityOccupationEditorialOverride[] = [
  {
    id: "chef",
    countryCode: "CA",
    editorial: {
      headline: "An experience-heavy culinary leadership career with direct study routes, but balanced national demand and no current category-based immigration boost",
      entryPathway:
        "Chef maps directly to NOC 62200. Job Bank states that cook trade certification or equivalent training and experience is required, while executive and senior chef roles normally require several years of commercial food-preparation experience and supervisory progression. Verified Canadian culinary-management programmes can support the education side of that pathway but do not replace the experience requirement.",
      registration:
        "Job Bank does not classify Chef as a regulated occupation nationally. Certified Working Chef and Certified Chef de Cuisine credentials are available, and qualified chefs may also hold Cook Red Seal endorsement, but there is no universal statutory Chef licence across Canada.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 23.00 per hour. The reviewed COPS 2024–2033 national outlook for NOC 62200 is Balance.",
      scoreCaveat:
        "The score gives no shortage or current Express Entry occupation-category points. Entry is kept conservative because the normal chef pathway depends on prior commercial cooking experience and, for senior roles, supervisory progression rather than classroom training alone.",
    },
  },
  {
    id: "cook",
    countryCode: "CA",
    editorial: {
      headline: "A broad food-service trade with moderate national shortage risk and many vacancies, but no current Express Entry occupation-category credit",
      entryPathway:
        "Cook maps directly to NOC 63200. Secondary school is usually required, while a three-year apprenticeship, a college cooking or food-safety programme, or several years of commercial cooking experience may be required. Trade certification is voluntary across provinces and territories and Red Seal endorsement is available to qualified cooks.",
      registration:
        "Cook trade certification is available but voluntary rather than universally compulsory. Red Seal endorsement can support interprovincial recognition, but the occupation is not treated here as requiring one national licence before employment.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 18.00 per hour. COPS classifies NOC 63200 as facing a moderate risk of shortage over 2024–2033.",
      scoreCaveat:
        "Cook receives moderate-shortage credit but no current Express Entry occupation-category credit. The linked RRC Culinary Arts programme is open to international students but is currently marked PGWP-noneligible in the Canada programme publication layer, so study availability must not be read as a post-graduation work-permit claim.",
    },
  },
  {
    id: "hotel-manager",
    countryCode: "CA",
    editorial: {
      headline: "A well-paid accommodation-management career with direct hospitality study options and balanced national demand",
      entryPathway:
        "Hotel Manager is an explicit title within NOC 60031 Accommodation service managers. Job Bank states that several years of accommodation-industry experience are usually required and that a hotel-management or related degree or diploma is usually required for managers in hotel chains or large establishments.",
      registration:
        "Job Bank records Hotel Manager as not regulated in Canada. Entry depends on hospitality-management education and sector experience rather than a universal professional licence.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 38.00 per hour. COPS projects NOC 60031 to remain balanced nationally over 2024–2033.",
      scoreCaveat:
        "No shortage or current Express Entry occupation-category points are awarded. The profile treats the management experience requirement as a meaningful entry burden even though verified hospitality-management programmes are available to international students.",
    },
  },
  {
    id: "restaurant-manager",
    countryCode: "CA",
    editorial: {
      headline: "A high-volume food-service management pathway with substantial live hiring but balanced long-run national supply and demand",
      entryPathway:
        "Restaurant Manager maps directly to NOC 60030 Restaurant and food service managers. Job Bank states that a hospitality or food-and-beverage management programme is usually required together with several years of food-service experience including supervisory experience; responsible beverage-service certification is usually required where alcohol is served.",
      registration:
        "Job Bank records Restaurant Manager as not regulated nationally. Establishment-specific and provincial requirements such as responsible beverage-service certification may still apply depending on the workplace.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 26.00 per hour. COPS projects NOC 60030 to remain balanced nationally over 2024–2033.",
      scoreCaveat:
        "The large point-in-time Job Bank posting count is not converted into vacancy-intensity points because the Canada methodology requires a comparable reviewed vacancy series. No shortage or current Express Entry occupation-category credit is awarded.",
    },
  },
  {
    id: "baker",
    countryCode: "CA",
    editorial: {
      headline: "A practical baking trade with direct international study routes and optional Red Seal progression, but balanced national demand",
      entryPathway:
        "Baker maps directly to NOC 63202. Secondary school is usually required, followed by a three- or four-year apprenticeship, a college baking programme, or several years of commercial baking experience. On-the-job training may also be provided.",
      registration:
        "Trade certification is voluntary in the listed provinces and territories rather than universally compulsory, and Red Seal endorsement is available to qualified bakers. The profile therefore does not treat Baker as requiring one national licence.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 17.50 per hour. COPS projects NOC 63202 to remain balanced nationally over 2024–2033.",
      scoreCaveat:
        "Baker receives no shortage or current Express Entry occupation-category points. Direct baking and pastry programmes are available, but they do not eliminate the practical training or experience normally expected in the occupation.",
    },
  },
  {
    id: "tourism-manager",
    countryCode: "CA",
    editorial: {
      headline: "A tourism-operations management pathway represented conservatively through the Tour Operator title inside NOC 60040",
      entryPathway:
        "Canada does not provide one exact private-sector NOC titled Tourism Manager. This canonical profile therefore uses the Tour Operator title within NOC 60040 Managers in customer and personal services as the closest operational tourism-management scope. Completion of secondary school is usually required, a relevant college or vocational credential may be required, and one to three years of service-sector experience are normally expected.",
      registration:
        "Job Bank records Tour Operator under NOC 60040 as not regulated in Canada. Tourism-development managers in government are separately classified under NOC 40011 and are intentionally excluded from this profile.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 34.00 per hour for Tour Operator. COPS projects the broader NOC 60040 group to remain balanced nationally over 2024–2033.",
      scoreCaveat:
        "Because Tourism Manager is narrower than the full NOC 60040 group, the broad employment total is not published as a tourism-manager-only figure. Verified tourism and hospitality programmes are linked as related pathways rather than being presented as direct occupational qualification.",
    },
  },
  {
    id: "event-planner",
    countryCode: "CA",
    editorial: {
      headline: "An exact conference-and-events occupation with direct study routes, balanced national demand and experience-sensitive entry",
      entryPathway:
        "Event Planner maps directly to NOC 12103 Conference and event planners. Job Bank states that a university degree or college diploma in business, tourism or hospitality administration is usually required, while several years of hospitality, tourism or public-relations experience may substitute for formal education.",
      registration:
        "There is no single national Event Planner licence. Job Bank notes that certification relating to special events, meetings or conference management may be required, and specific provincial or title-level requirements should be checked separately.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 28.37 per hour. COPS projects NOC 12103 to remain balanced nationally over 2024–2033.",
      scoreCaveat:
        "No shortage or current Express Entry occupation-category points are awarded. The score also does not infer recurring vacancy intensity from the small point-in-time Job Bank posting count.",
    },
  },
  {
    id: "hospitality-supervisor",
    countryCode: "CA",
    editorial: {
      headline: "A front-line hospitality supervision pathway mapped to Food Service Supervisors, with broad hiring but balanced long-run demand",
      entryPathway:
        "Hospitality Supervisor is mapped through the canonical Food Service Supervisor alias to NOC 62020. Job Bank describes the occupation as supervising workers who prepare, portion and serve food; entry usually requires post-secondary or apprenticeship-level training or supervisory experience.",
      registration:
        "Food Service Supervisor is not treated as a nationally licensed profession. Employer food-safety, responsible-service or establishment-specific certifications can still apply depending on the workplace and province.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 19.00 per hour. Although COPS records moderate recent shortage signs, the 2024–2033 national projection is Balance, so the long-run shortage component remains zero.",
      scoreCaveat:
        "The canonical Hospitality Supervisor label is intentionally constrained to Food Service Supervisor NOC 62020 rather than blended with accommodation supervisors or hotel managers. No current Express Entry occupation-category credit is awarded.",
    },
  },
]
