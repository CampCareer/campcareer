import type { CountryOccupationEditorial } from "./occupation-editorial-base"

type CanadaEngineeringManufacturingOccupationEditorialOverride = {
  id: string
  countryCode: "CA"
  editorial: CountryOccupationEditorial
}

export const CANADA_ENGINEERING_MANUFACTURING_OCCUPATION_EDITORIAL_OVERRIDES: readonly CanadaEngineeringManufacturingOccupationEditorialOverride[] = [
  {
    id: "civil-engineer",
    countryCode: "CA",
    editorial: {
      headline: "A regulated professional-engineering pathway with a moderate national shortage risk, high pay and current STEM-category eligibility",
      entryPathway:
        "Civil Engineer maps directly to NOC 21300 Civil engineers. The standard route is an accredited or otherwise academically accepted engineering degree followed by the experience, ethics, character and language requirements of the provincial or territorial engineering regulator where the applicant intends to practise.",
      registration:
        "Engineering practice and use of the engineer title are regulated provincially and territorially. Engineers Canada does not issue individual licences; applicants qualify through the engineering regulator in the jurisdiction of practice.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 48.56 per hour. The reviewed Canada labour snapshot classifies NOC 21300 as facing a moderate risk of shortage over the long-term projection period.",
      scoreCaveat:
        "The profile uses exact NOC 21300 wage and shortage evidence. Current Job Bank postings are point-in-time, so vacancy intensity and trend remain unscored. NOC 21300 is included in the current Express Entry STEM category.",
    },
  },
  {
    id: "mechanical-engineer",
    countryCode: "CA",
    editorial: {
      headline: "A regulated engineering profession with a moderate shortage signal, high national median pay and current STEM-category eligibility",
      entryPathway:
        "Mechanical Engineer maps directly to NOC 21301 Mechanical engineers. A university engineering degree is the normal academic route, followed by the applicable provincial or territorial engineering-licensure process and supervised professional experience.",
      registration:
        "Professional engineering is regulated by provincial and territorial engineering regulators. The right to practise engineering and use protected engineering titles depends on the jurisdiction and the applicant's licensure status.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 45.67 per hour. The reviewed Canada labour snapshot classifies NOC 21301 as facing a moderate risk of shortage over the long-term projection period.",
      scoreCaveat:
        "The score uses exact NOC 21301 wage and shortage evidence and current STEM-category inclusion. Vacancy and trend components stay at zero because point-in-time postings are not treated as a comparable vacancy time series.",
    },
  },
  {
    id: "electrical-engineer",
    countryCode: "CA",
    editorial: {
      headline: "A regulated electrical-engineering profession with high pay, moderate shortage risk and current STEM-category eligibility",
      entryPathway:
        "Electrical Engineer maps to NOC 21310 Electrical and electronics engineers. A relevant engineering degree is the standard academic route, with professional practice governed by the provincial or territorial engineering regulator in the jurisdiction of work.",
      registration:
        "Engineering licensure is jurisdictional rather than national. Applicants seeking to practise professional engineering or use the protected engineer title must satisfy the regulator's academic, experience, ethics, character and language requirements.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 50.67 per hour. The reviewed labour snapshot classifies NOC 21310 as facing a moderate risk of shortage over the long-term projection period.",
      scoreCaveat:
        "The score uses exact NOC 21310 wage and shortage evidence. NOC 21310 is in the current Express Entry STEM category; no vacancy-intensity or trend credit is inferred from point-in-time job advertisements.",
    },
  },
  {
    id: "manufacturing-engineer",
    countryCode: "CA",
    editorial: {
      headline: "A manufacturing-focused professional-engineering pathway inside a broader NOC with moderate shortage evidence and STEM eligibility",
      entryPathway:
        "Manufacturing Engineer is treated as a narrower canonical career within NOC 21321 Industrial and manufacturing engineers. Relevant engineering study in industrial, manufacturing, mechanical or related disciplines can support entry, followed by the applicable professional-engineering licensure pathway.",
      registration:
        "Use of the engineer title and professional engineering practice are regulated by provincial and territorial engineering regulators. The exact licensing pathway depends on the jurisdiction and the applicant's education and experience.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 44.23 per hour for the shared Industrial and manufacturing engineers NOC. The reviewed labour snapshot classifies NOC 21321 as facing a moderate risk of shortage.",
      scoreCaveat:
        "Because the shortage evidence applies to the combined NOC 21321 rather than Manufacturing Engineer alone, shortage credit is capped at 10/20. NOC 21321 is currently STEM-category eligible, while broader employment is not presented as a manufacturing-engineer-only count.",
    },
  },
  {
    id: "industrial-engineer",
    countryCode: "CA",
    editorial: {
      headline: "A regulated industrial-engineering pathway sharing NOC 21321, with high pay, partial shortage credit and current STEM-category eligibility",
      entryPathway:
        "Industrial Engineer is a direct title within NOC 21321 Industrial and manufacturing engineers. Relevant university engineering study is the normal route, followed by the professional-engineering licensing requirements of the province or territory where engineering practice occurs.",
      registration:
        "Engineering practice and protected title use are regulated provincially and territorially. Engineers Canada supports the regulatory system but the actual licence is granted by the relevant engineering regulator.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 44.23 per hour. The reviewed labour snapshot classifies the combined NOC 21321 Industrial and manufacturing engineers group as facing a moderate risk of shortage.",
      scoreCaveat:
        "The shared NOC contains both industrial and manufacturing engineers, so shortage credit is conservatively capped at 10/20 for this canonical profile. NOC 21321 is included in the current Express Entry STEM category.",
    },
  },
  {
    id: "chemical-engineer",
    countryCode: "CA",
    editorial: {
      headline: "A high-paying regulated engineering profession whose national long-term labour outlook is currently balanced rather than shortage-rated",
      entryPathway:
        "Chemical Engineer maps directly to NOC 21320 Chemical engineers. A bachelor's degree in chemical engineering or a related engineering discipline is normally required, followed by the provincial or territorial pathway to professional-engineering licensure where professional practice is performed.",
      registration:
        "Job Bank and Engineers Canada distinguish the academic engineering route from professional licensure. Provincial or territorial engineering licensure is required for professional engineering practice and protected professional titles in the relevant jurisdiction.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 51.92 per hour. The reviewed Canada long-term labour snapshot classifies NOC 21320 as balanced rather than at moderate or strong shortage risk.",
      scoreCaveat:
        "Chemical Engineer receives salary credit but no shortage or visa credit in Canada v1: NOC 21320 is balanced in the reviewed national outlook and is not on the current Express Entry STEM occupation table.",
    },
  },
  {
    id: "environmental-engineer",
    countryCode: "CA",
    editorial: {
      headline: "An environmental-engineering specialization inside Civil engineers NOC 21300, with high pay and partial broader-group shortage credit",
      entryPathway:
        "Environmental Engineer is an official Job Bank title within NOC 21300 Civil engineers. Environmental, civil or related accredited engineering study can support entry depending on the role, followed by the provincial or territorial engineering-licensure pathway for professional practice.",
      registration:
        "The engineer title and professional engineering practice are regulated by provincial and territorial regulators. Environmental engineering therefore follows the same jurisdiction-specific professional-licensure framework as other regulated engineering disciplines.",
      jobMarketNote:
        "Job Bank reports a national median wage of CAD 48.56 per hour for Environmental Engineer and places the title in NOC 21300. The broader NOC 21300 labour snapshot carries a moderate shortage signal.",
      scoreCaveat:
        "Because the long-term shortage signal covers all Civil engineers rather than Environmental Engineer alone, shortage credit is capped at 10/20. NOC 21300 is in the current STEM category, but broader employment is not treated as an environmental-engineer-only count.",
    },
  },
  {
    id: "engineering-technician",
    countryCode: "CA",
    editorial: {
      headline: "A broad technician and technologist umbrella with accessible college routes, mixed shortage signals and only partial STEM-category coverage",
      entryPathway:
        "Engineering Technician is intentionally modelled as a multi-NOC umbrella spanning civil, mechanical, industrial/manufacturing, and electrical/electronics engineering technologist and technician groups. College diploma and technology programmes provide common entry routes, with many verified international options in the Canada catalogue.",
      registration:
        "This umbrella is not treated as one nationally licensed professional-engineer occupation. Technician and technologist certification, designation and scope rules vary by discipline and province; applicants should check the relevant provincial association or regulator for the title they intend to use.",
      jobMarketNote:
        "The reviewed national snapshot shows moderate shortage risk for NOC 22300, 22301 and 22310, while NOC 22302 is balanced. Because this profile spans several groups, no single national median wage or employment total is presented as an umbrella-wide fact.",
      scoreCaveat:
        "Shortage credit is capped at 10/20 for mixed multi-NOC evidence. Visa credit is partial because current STEM eligibility covers 22300, 22301 and 22310 but not 22302. Salary is deliberately unscored instead of averaging unlike technician disciplines into a synthetic national wage.",
    },
  },
]
