import type { OccupationEditorial } from "./occupation-editorial-base"

export const MULTIMEDIA_DESIGNER_OCCUPATION_EDITORIAL = [
  {
    id: "multimedia-designer",
    overview:
      "Multimedia designers plan and produce digitally delivered information, promotional material, instructional content and entertainment by combining text, imagery, video, sound and interactive elements. Australia has an exact current OSCA occupation, 242131 Multimedia Designer. Its current ANZSCO 2022 correspondence is split across 232413 Multimedia Designer and 261211 Multimedia Specialist, so older labour statistics cannot be treated as a single exact current-OSCA series.",
    tasks: [
      "Plan the layout and structure of digital multimedia projects",
      "Combine text, images, animation, video and sound for a defined audience and purpose",
      "Develop multimedia prototypes, mock-ups and storyboards",
      "Research and select appropriate software, tools and production technologies",
      "Coordinate visual, interactive and technical elements across digital media",
      "Prepare and refine digital content for online, recorded or interactive delivery",
    ],
    countries: {
      AU: {
        headline:
          "Exact current OSCA 242131 Multimedia Designer, with split current ANZSCO correspondence and therefore conservative labour and migration scoring",
        entryPathway:
          "RMIT's Bachelor of Design (Digital Media), CRICOS 080226G, is a current three-year on-campus route covering interactive design, UX, visual effects, motion graphics and digital production. UTS's Bachelor of Design in Visual Communication, CRICOS 077339C, is a current three-year city-campus route that includes digital media, motion design, interaction, UX and emerging creative technologies.",
        registration:
          "Multimedia design is not a statutorily registered occupation in Australia. VETASSESS assesses ANZSCO 232413 Multimedia Designer as Group B, while ANZSCO 261211 Multimedia Specialist is assessed by ACS on the current CSOL. Those migration pathways are distinct from occupational registration and do not create a one-to-one current OSCA mapping.",
        jobMarketNote:
          "Legacy JSA ANZSCO 232413 data record 4,600 workers, but current OSCA 242131 corresponds partially to both 232413 and 261211, so primary employment and earnings remain null. Broader 2324 vacancies were 441 in May 2026, about 7.68% lower year on year, while 2612 vacancies were 76.67, about 0.88% higher. Both unit groups have positive broader employment projections. The 2025 OSL rates OSCA 242131 No Shortage nationally.",
        scoreCaveat:
          "Vacancy intensity, vacancy trend and salary receive no exact-occupation credit because the current OSCA scope splits across two ANZSCO routes. Broader growth receives partial credit. Current CSOL entries for 232413 and 261211 support only partial visa credit because neither correspondence alone represents the full current OSCA 242131 scope.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
