import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type CanadaDesignCreativeOccupationEditorialOverride = {
  id: string
  countryCode: "CA"
  editorial: CountryOccupationEditorial
}

export const CANADA_DESIGN_CREATIVE_OCCUPATION_EDITORIAL_OVERRIDES: readonly CanadaDesignCreativeOccupationEditorialOverride[] = [
  {
    id: "graphic-designer",
    countryCode: "CA",
    editorial: {
      headline: "A portfolio-driven design career with strong study availability but a strong national surplus signal",
      entryPathway:
        "Graphic Designer maps to NOC 52120 Graphic designers and illustrators. A university visual-arts/design degree or a college graphic-arts diploma is the normal education route, and Job Bank identifies a portfolio demonstrating creative ability as an employment requirement.",
      registration:
        "Graphic design is not treated as a nationally licensed occupation. The Registered Graphic Designer title has statutory recognition in Ontario, but generic graphic-design work is not universally restricted to registered professionals.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 31.25 per hour. The national 2024–2033 outlook for NOC 52120 is a strong risk of surplus, with 93,200 workers across the full graphic-design and illustration group in 2023.",
      scoreCaveat:
        "Graphic Designer shares NOC 52120 with UX, multimedia, animation and illustration titles, so the broader employment total is not presented as a graphic-designer-only count. No shortage or current Express Entry occupation-category points are awarded.",
    },
  },
  {
    id: "ux-designer",
    countryCode: "CA",
    editorial: {
      headline: "An official NOC 52120 user-experience title with direct study routes, but the same strong-surplus labour signal as the broader design group",
      entryPathway:
        "User Experience Designer is an explicit NOC 52120 example title. Canada programmes in UI/UX, interaction design and user-experience design provide direct study routes, while employers commonly assess portfolios, research/process work and digital-product design skills.",
      registration:
        "UX Designer is not a nationally licensed occupation. Hiring is primarily skills- and portfolio-based, with no universal statutory credential required to use the UX Designer title.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 31.25 per hour for User Experience Designer. Because the title sits inside NOC 52120, the national 2024–2033 outlook is a strong risk of surplus.",
      scoreCaveat:
        "The profile uses the official User Experience Designer title inside NOC 52120 rather than reclassifying UX into Web designers NOC 21233. The shared NOC employment total is omitted as a UX-only count, and no current occupation-category immigration credit is awarded.",
    },
  },
  {
    id: "multimedia-designer",
    countryCode: "CA",
    editorial: {
      headline: "A direct multimedia-design title within NOC 52120 with many international programmes but a strong national surplus outlook",
      entryPathway:
        "Multimedia Designer is represented by multimedia and interactive-media design titles within NOC 52120. College or university design training is common, and the verified Canada catalogue includes direct graphic-design, interactive-media and digital-media programmes.",
      registration:
        "Multimedia Designer is not a nationally licensed occupation. Employers typically evaluate portfolio quality, production software skills, interaction/media capability and relevant post-secondary training.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 31.25 per hour for multimedia graphic-design titles. NOC 52120 is projected to face a strong risk of surplus nationally over 2024–2033.",
      scoreCaveat:
        "Multimedia Designer is narrower than the full NOC 52120 group, so the 93,200-worker group total is not used as a title-specific employment figure. No shortage or Express Entry category points are awarded.",
    },
  },
  {
    id: "animator",
    countryCode: "CA",
    editorial: {
      headline: "A recognised NOC animation pathway with excellent programme choice, offset by a strong national surplus signal",
      entryPathway:
        "Animator - animated films is an explicit title within NOC 52120. A visual-arts or graphic-design degree, graphic-arts diploma or relevant multimedia training is normally required, together with a portfolio demonstrating artistic and animation capability.",
      registration:
        "Animator is not a nationally licensed occupation. Entry is portfolio- and production-skill driven, although specialist studio roles may require experience with specific animation pipelines and tools.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 31.25 per hour for Animator - animated films. The broader NOC 52120 group is projected to face a strong risk of surplus over 2024–2033.",
      scoreCaveat:
        "The score does not convert the broad NOC employment count into an animator-only total. Competition is reflected by withholding shortage points; vacancy intensity and trend also remain unscored without a comparable reviewed series.",
    },
  },
  {
    id: "interior-designer",
    countryCode: "CA",
    editorial: {
      headline: "A protected-title design profession with direct degree routes and balanced national demand",
      entryPathway:
        "Interior Designer maps to NOC 52121 Interior designers and interior decorators. Job Bank states that a university degree or college diploma in interior design is usually required, and the NCIDQ examination may be required after combined study and professional experience.",
      registration:
        "Protected interior-designer titles require certification by a provincial institute or association in all provinces except Prince Edward Island. Regulation and the exact protected title vary by jurisdiction, so applicants should verify the destination province before relying on a credential pathway.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 28.85 per hour. NOC 52121 is nationally balanced over 2024–2033, with 32,900 workers across both interior designers and interior decorators in 2023.",
      scoreCaveat:
        "Because NOC 52121 also includes interior decorators, the broader employment count is not treated as an Interior Designer-only total. No shortage or current Express Entry occupation-category points are awarded.",
    },
  },
  {
    id: "film-editor",
    countryCode: "CA",
    editorial: {
      headline: "A high-paying film-production role with a verified editing programme route, but a broader NOC projected toward surplus",
      entryPathway:
        "Film Editor is an explicit occupation title within NOC 51120 Producers, directors, choreographers and related occupations. Job Bank states that a university degree or college diploma in film, broadcasting or a related field plus technical or production experience is usually required.",
      registration:
        "Film Editor is not a nationally licensed occupation. Employers rely on production experience, editing craft, software capability and portfolio or credits rather than a mandatory professional licence.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 41.03 per hour for Film Editor. The broader NOC 51120 group is projected to face a moderate risk of surplus nationally over 2024–2033.",
      scoreCaveat:
        "Film Editor is much narrower than NOC 51120, which also includes producers, directors and choreographers, so the broader employment total is omitted. The surplus outlook earns no shortage points and there is no current occupation-category immigration credit.",
    },
  },
  {
    id: "architect",
    countryCode: "CA",
    editorial: {
      headline: "A regulated professional design career with high pay and a direct MArch route, but no current occupation-category immigration boost",
      entryPathway:
        "Architect maps directly to NOC 21200. Job Bank requires accredited architectural education or the RAIC syllabus route, a supervised internship, the architect registration examination and provincial regulatory registration before independent professional practice.",
      registration:
        "Registration with a provincial architectural regulatory body is required in all provinces and the Northwest Territories. The professional title and practice rights are therefore treated as regulated rather than as a general design credential.",
      jobMarketNote:
        "Job Bank currently reports a national median wage of CAD 38.94 per hour and 26,900 workers in 2023. COPS projects NOC 21200 to remain balanced nationally over 2024–2033.",
      scoreCaveat:
        "Architect receives no shortage points and, unlike the older 2024 STEM list, NOC 21200 is not present in the current 2026 STEM occupation table. The entry score is kept conservative because the licence path includes education, internship and examination requirements.",
    },
  },
  {
    id: "web-designer",
    countryCode: "CA",
    editorial: {
      headline: "An exact NOC web-design career with direct international study options and balanced demand, but no current STEM-category credit",
      entryPathway:
        "Web Designer maps directly to NOC 21233. Job Bank states that a bachelor's degree or college programme in computer science, graphic arts or Web design is required and that prior graphic-design experience is usually expected.",
      registration:
        "Job Bank records Web Designer as not regulated in Canada. There is no universal occupational licence, although employers may require strong portfolios and technical web-design capability.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 33.65 per hour and 13,100 workers in 2023. COPS projects NOC 21233 to remain balanced nationally over 2024–2033.",
      scoreCaveat:
        "The profile uses exact NOC 21233 rather than graphic-design NOC 52120. No shortage points are awarded, and NOC 21233 is no longer in the current 2026 Express Entry STEM occupation table even though it appeared on older lists.",
    },
  },
]
