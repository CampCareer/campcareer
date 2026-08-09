import type { OccupationEditorial } from "./occupation-editorial-base"

export const AUDITOR_OCCUPATION_EDITORIAL = [
  {
    id: "auditor",
    overview:
      "Auditors independently examine financial, operational and management information, controls and processes and report whether they are reliable, compliant and effective. Australia's current OSCA separates the field into 211231 External Auditor and 211232 Internal Auditor, so CampCareer models the neutral Auditor career as an umbrella across both rather than pretending there is one six-digit Auditor code.",
    tasks: [
      "Plan audit objectives, scope, evidence requirements and testing procedures",
      "Examine financial records, controls, systems and supporting evidence for accuracy and compliance",
      "Evaluate operational, governance and risk-management processes and the effectiveness of internal controls",
      "Identify material weaknesses, control failures, compliance issues and areas of financial or operational risk",
      "Prepare audit findings, working papers and reports for management, boards, shareholders or statutory bodies",
      "Maintain professional independence and communicate recommendations while tracking remediation or follow-up actions",
    ],
    countries: {
      AU: {
        headline:
          "A Skill Level 1 audit umbrella covering external and internal audit, with mixed 2025 shortage signals and verified skilled-migration pathways for both branches",
        entryPathway:
          "Both current OSCA Auditor occupations are Skill Level 1. A directly relevant undergraduate route is Macquarie University's three-year Bachelor of Professional Accounting, CRICOS 099149E, and a postgraduate route is its Master of Professional Accounting, CRICOS 099183C. External-auditor migration assessments use CPA Australia, CA ANZ or IPA for ANZSCO 221213, while Internal Auditor 221214 is assessed by VETASSESS as Group A. Professional accounting study supports entry but does not by itself confer statutory auditor registration or guarantee a migration assessment.",
        registration:
          "Registration depends on the work performed. ASIC registration as a registered company auditor is required for certain statutory external company audits under the Corporations Act framework. Internal auditors do not have an equivalent universal statutory registration requirement. Migration skills assessment is separate: External Auditor 221213 uses CPA Australia, CA ANZ or IPA, while Internal Auditor 221214 uses VETASSESS.",
        jobMarketNote:
          "CampCareer combines the aligned legacy JSA six-digit profiles for External Auditors (about 12,500 employed) and Internal Auditors (about 6,000 employed), giving about 18,500 across the two audit occupations. Six-digit median earnings are not published, so broader ANZSCO 2212 earnings are shown only as context. The reviewed 2025 OSL records External Auditor as a national shortage occupation while Internal Auditor is No Shortage nationally, so the umbrella receives partial rather than maximum shortage credit.",
        scoreCaveat:
          "The opportunity score keeps exact employment separate from broader demand evidence. Broader ANZSCO 2212 vacancies rose about 8.44% year on year to May 2026 and broader projections are about +8.03% to 2030 and +15.89% to 2035, but 2212 also includes Company Secretaries and Corporate Treasurers. Vacancy intensity and salary therefore receive no points, while trend and growth receive only partial credit. Mixed shortage status receives partial shortage credit and both audit branches have verified skilled-migration assessment pathways.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
