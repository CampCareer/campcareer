import type { OccupationEditorial } from "./occupation-editorial-base"

export const TECHNOLOGY_NETWORK_OCCUPATION_EDITORIAL = [
  {
    id: "network-administrator",
    overview:
      "Network Administrators install, maintain, monitor and optimise network hardware, software and infrastructure, troubleshoot incidents, manage network security controls and keep network configuration and operational documentation current. The role is operational and reliability-focused rather than primarily responsible for high-level network architecture.",
    tasks: [
      "Monitor, maintain and optimise wired, wireless and virtual network environments and supporting infrastructure",
      "Install, configure, test and upgrade network hardware, software, servers and related communications systems",
      "Troubleshoot network incidents, connectivity problems, performance issues and equipment failures and document their resolution",
      "Implement and maintain access controls, firewall rules, network-security measures and backup or recovery procedures",
      "Track network capacity, traffic, inventory and configuration changes to protect availability and performance",
      "Maintain operating procedures, diagrams and technical documentation and provide technical support to users and other infrastructure teams",
    ],
    countries: {
      AU: {
        headline: "A CSOL-listed network operations occupation with direct study routes and solid broader growth, but no shortage rating in 2025",
        entryPathway:
          "OSCA assigns Network Administrator Skill Level 1. Common Australian routes include Bachelor degrees in Information Technology, computer systems, networking or network security, with postgraduate networking and infrastructure programs also available. Employers often value practical routing, switching, wireless, firewall, Windows or Linux administration and troubleshooting skills, and vendor certifications such as Cisco credentials can strengthen entry prospects. Many people first build experience in service desk, ICT support or junior systems and infrastructure roles before moving into dedicated network administration.",
        registration:
          "There is no single statutory national occupational registration or licence required to work as a Network Administrator in Australia. The current migration occupation is ANZSCO 263112 Network Administrator and the Australian Computer Society is the assessing authority. An ACS migration skills assessment is an immigration and professional-assessment process rather than a domestic licence to practise.",
        jobMarketNote:
          "The exact current occupation is OSCA 272132 Network Administrator and the directly aligned migration occupation is ANZSCO 263112. JSA labour-market statistics are still published at the broader ANZSCO 2631 Computer Network Professionals level, which also includes Computer Network and Systems Engineers and Network Analysts, so its employment and earnings are not treated as exact Network Administrator values. The 2025 Occupation Shortage List records Network Administrator as No Shortage nationally and in all eight states and territories, while the occupation remains on the current Core Skills Occupation List.",
        scoreCaveat:
          "The opportunity score is deliberately conservative. Exact Network Administrator employment and earnings are not inferred from broader ANZSCO 2631, so salary and vacancy-intensity components remain zero. Broader 2631 vacancies fell about 14.89% year on year to May 2026, so vacancy trend scores zero; broader five- and ten-year growth projections receive only partial credit. Entry-level credit is moderated because direct networking study routes exist but many dedicated administrator roles still expect prior support or infrastructure experience. The verified CSOL signal is retained while the 2025 shortage component is zero.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
