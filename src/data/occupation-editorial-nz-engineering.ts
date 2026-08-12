import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type NzEngineeringOverride = {
  id: string
  countryCode: "NZ"
  editorial: CountryOccupationEditorial
}

export const NZ_ENGINEERING_OCCUPATION_EDITORIAL_OVERRIDES: readonly NzEngineeringOverride[] = [
  {
    id: "civil-engineer",
    countryCode: "NZ",
    editorial: {
      headline: "A Tier 1 engineering route with strong pay and broad infrastructure scope",
      entryPathway:
        "Tahatū identifies a Bachelor of Engineering with Honours or comparable professional civil-engineering study as the standard route. The current Green List also accepts specified engineering qualifications, Washington Accord study, an Engineering New Zealand benchmark letter or relevant CPEng/Engineering Technologist registration pathways.",
      registration:
        "Engineering New Zealand states that engineers do not generally have to be registered to work in New Zealand. CPEng can nevertheless be required for particular consent, certification or producer-statement responsibilities.",
      jobMarketNote:
        "The canonical role is anchored to ANZSCO 233211 Civil Engineer. Structural, geotechnical and other civil specialisations may have their own codes, so this profile does not roll those occupations into the salary observation.",
      scoreCaveat:
        "Current Green List Tier 1 status provides the shortage and visa signal. Vacancy intensity, employer diversity, vacancy trend and growth remain zero until a recurring comparable NZ occupation series is ingested.",
    },
  },
  {
    id: "mechanical-engineer",
    countryCode: "NZ",
    editorial: {
      headline: "A clear Tier 1 professional-engineering pathway with solid mid-career pay",
      entryPathway:
        "Mechanical engineers normally enter through professional engineering study such as a BE(Hons) or comparable qualification. Green List eligibility can also be demonstrated through the listed Engineering New Zealand qualification or registration pathways.",
      registration:
        "There is no universal statutory licence for the generic mechanical-engineer profession. CPEng is optional for many jobs but can be required where regulated sign-off or certification responsibilities apply.",
      jobMarketNote:
        "ANZSCO 233512 Mechanical Engineer is an exact canonical match and is on the current Green List Tier 1.",
      scoreCaveat:
        "The score uses Green List Tier 1 as the direct policy-demand signal and Tahatū pay for salary. No posting-derived shortage or growth points are added.",
    },
  },
  {
    id: "electrical-engineer",
    countryCode: "NZ",
    editorial: {
      headline: "Tier 1 immigration access with an important prescribed-electrical-work boundary",
      entryPathway:
        "A bachelor-level electrical-engineering qualification is the standard professional route. The Green List accepts specified engineering qualifications and recognised Engineering New Zealand pathways.",
      registration:
        "Engineering practice is not universally licensed, but carrying out or supervising prescribed electrical work requires the appropriate Electrical Workers Registration Board registration and a current practising licence. EWRB therefore matters for the regulated work scope rather than every electrical-engineering job.",
      jobMarketNote:
        "ANZSCO 233311 Electrical Engineer is on the current Green List Tier 1. The immigration qualification route does not itself make EWRB registration mandatory for every electrical-engineering position.",
      scoreCaveat:
        "Tier 1 demand and visa credit are retained, while entry-burden credit is slightly reduced to recognise the PEW licensing boundary. Posting-derived components remain zero.",
    },
  },
  {
    id: "manufacturing-engineer",
    countryCode: "NZ",
    editorial: {
      headline: "Manufacturing systems work mapped to the current Production or Plant Engineer code",
      entryPathway:
        "Tahatū describes entry through relevant manufacturing, engineering or technology study, with experienced trade-qualified production and process workers also able to progress into manufacturing-engineering work.",
      registration:
        "There is no universal statutory occupational licence for manufacturing engineers. Engineering New Zealand membership or CPEng can be useful for particular responsibilities but is not a general practising requirement.",
      jobMarketNote:
        "The canonical Manufacturing Engineer is mapped to ANZSCO 233513 Production or Plant Engineer because that occupation explicitly covers plant performance and the management and planning of manufacturing activities. ANZSCO 233513 is on the current Green List Tier 1.",
      scoreCaveat:
        "The profile keeps the canonical manufacturing scope explicit rather than substituting Industrial Engineer or Mechanical Engineer. Green List policy evidence is scored, but recurring vacancy and growth components remain zero.",
    },
  },
  {
    id: "industrial-engineer",
    countryCode: "NZ",
    editorial: {
      headline: "A direct Green List match for process, efficiency and industrial-systems work",
      entryPathway:
        "Tahatū identifies a Bachelor of Engineering with Honours or Bachelor of Engineering Technology as direct routes, with relevant mechanical-engineering study and experience also useful.",
      registration:
        "Industrial engineering is not universally statutorily registered. CPEng may be valuable for senior or regulated responsibilities but is not required for most generic industrial-engineering employment.",
      jobMarketNote:
        "ANZSCO 233511 Industrial Engineer is an exact canonical match and is on the current Green List Tier 1.",
      scoreCaveat:
        "Tier 1 status supplies the policy-demand signal; no shortage points are inferred from generic manufacturing recruitment commentary or one-off job advertisements.",
    },
  },
  {
    id: "chemical-engineer",
    countryCode: "NZ",
    editorial: {
      headline: "A high-skill Tier 1 process-engineering route with strong salary potential",
      entryPathway:
        "Tahatū lists BE(Hons), Food Technology (Honours) and relevant process/resources engineering study as direct foundations. The Green List also accepts the specified professional-engineering qualification and Engineering New Zealand pathways.",
      registration:
        "There is no universal statutory licence for the generic chemical-engineer profession. CPEng can be useful or required for particular regulated responsibilities but is not normally a general condition of employment.",
      jobMarketNote:
        "ANZSCO 233111 Chemical Engineer is an exact match and sits on the current Green List Tier 1.",
      scoreCaveat:
        "The score uses current Green List policy evidence plus Tahatū pay. Vacancy, employer-diversity, trend and growth components remain zero until comparable recurring evidence is available.",
    },
  },
  {
    id: "environmental-engineer",
    countryCode: "NZ",
    editorial: {
      headline: "A Tier 1 environmental-engineering route combining infrastructure and sustainability work",
      entryPathway:
        "Tahatū identifies a BE(Hons) or similar environmental-engineering qualification as the standard entry route, with Engineering New Zealand pathways available for Green List qualification recognition.",
      registration:
        "Engineers do not generally need CPEng registration simply to work in New Zealand, although specific consent, certification or producer-statement work can require a chartered professional.",
      jobMarketNote:
        "ANZSCO 233915 Environmental Engineer is an exact canonical match and is on the current Green List Tier 1.",
      scoreCaveat:
        "Green List policy status is the shortage signal. The profile does not convert general climate or infrastructure demand narratives into extra vacancy or growth points.",
    },
  },
  {
    id: "engineering-technician",
    countryCode: "NZ",
    editorial: {
      headline: "An accessible technician route whose new residence pathway has not yet commenced",
      entryPathway:
        "The generic profile is conservatively anchored to ANZSCO 312999 Building and Engineering Technicians nec. Tahatū's Mechanical Engineering Technician pathway is used as a representative route because diploma, certificate, apprenticeship and experience pathways are common across technician work.",
      registration:
        "There is no universal registration requirement across the generic 312999 scope. Particular electrical, mining, aviation or other regulated technician jobs can have separate licensing requirements and must be checked individually.",
      jobMarketNote:
        "ANZSCO 312999 is not on the current Green List. It is listed for the new Skilled Migrant Category Trades and Technician pathway scheduled to take effect on 24 August 2026, after this profile's 11 August 2026 evidence date.",
      scoreCaveat:
        "The future SMC pathway is disclosed but deliberately not pre-scored before commencement. Salary uses Tahatū Mechanical Engineering Technician as a transparent representative proxy, and shortage/posting-derived components remain zero.",
    },
  },
] as const
