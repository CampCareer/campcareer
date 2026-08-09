import type { OccupationEditorial } from "./occupation-editorial-base"

export const TECHNOLOGY_SUPPORT_OCCUPATION_EDITORIAL = [
  {
    id: "ict-support-technician",
    overview:
      "ICT Support Technicians help users and organisations keep everyday computer hardware, software and connectivity working. CampCareer maps this user-facing career to current OSCA 314231 ICT Customer Support Officer, which includes ICT Help Desk Officer and ICT Service Desk Analyst as alternative titles and Network Support Technician as a specialisation.",
    tasks: [
      "Respond to user incidents and service requests involving computer hardware, software, accounts and connectivity",
      "Diagnose, troubleshoot and resolve common desktop, application, peripheral and network-access problems",
      "Install, configure, deploy and update software, devices and standard workplace technology",
      "Guide users through fixes, basic training and secure use of workplace systems and applications",
      "Escalate complex incidents to systems, network, security or application specialists while maintaining clear service records",
      "Document incidents, solutions, asset changes and recurring problems to improve service-desk knowledge and support processes",
    ],
    countries: {
      AU: {
        headline: "A direct CSOL-listed Skill Level 2 support occupation with accessible vocational entry routes, but no shortage rating in 2025",
        entryPathway:
          "OSCA assigns ICT Customer Support Officer Skill Level 2, corresponding to an AQF Associate Degree, Advanced Diploma or Diploma, or relevant experience. For migration assessment, TRA currently lists Certificate IV in Information Technology ICT40120 as an accepted qualification for ANZSCO 313112. International pathways such as TAFE NSW's Certificate IV in Information Technology explicitly prepare students for help desk, ICT operations, client-support and computer-technician roles, while Diploma and Associate Degree programs provide broader progression into systems and networking work. Practical troubleshooting, communication, Windows or macOS administration, Microsoft 365, networking fundamentals and ticketing-system experience are especially useful for entry roles.",
        registration:
          "There is no single statutory national occupational registration or licence required to work in general ICT customer support in Australia. The directly aligned migration occupation is ANZSCO 313112 ICT Customer Support Officer and the current CSOL names Trades Recognition Australia as the assessing authority. A TRA skills assessment is an immigration assessment and does not operate as a domestic licence to work in IT support.",
        jobMarketNote:
          "The exact current occupation is OSCA 314231 ICT Customer Support Officer, directly aligned to ANZSCO 313112. JSA provides a six-digit employment and demographic profile for 313112, so CampCareer retains its 46,200 employment figure as occupation-specific context. JSA earnings, vacancy and projection series are broader at ANZSCO 3131 ICT Support Technicians, which also includes hardware technicians, web administrators and other ICT support technicians. The 2025 Occupation Shortage List records ICT Customer Support Officer as No Shortage nationally and in every state and territory, while ANZSCO 313112 remains on the current Core Skills Occupation List.",
        scoreCaveat:
          "The opportunity score keeps the exact 313112 employment and demographic context but does not assign the broader ANZSCO 3131 earnings to ICT Customer Support Officer, so salary remains unscored. Broader 3131 vacancies were almost flat but slightly lower year on year to May 2026, so vacancy trend and intensity add no points; broader five- and ten-year projections receive limited growth credit. Accessible vocational pathways and common service-desk entry roles receive full entry-level credit, and the direct CSOL signal is retained, while the 2025 shortage component is zero.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
