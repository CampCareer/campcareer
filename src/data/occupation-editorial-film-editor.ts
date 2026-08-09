import type { OccupationEditorial } from "./occupation-editorial-base"

export const FILM_EDITOR_OCCUPATION_EDITORIAL = [
  {
    id: "film-editor",
    overview:
      "Film editors shape narrative, mood, pace and continuity by selecting and assembling picture and sound in post-production. Australia classifies this work directly as OSCA 231434 Film and Video Editor, including Animation Editor and Visual Effects Editor specialisations.",
    tasks: [
      "Review and select footage against the script, brief and production objectives",
      "Assemble picture and sound into a coherent narrative sequence",
      "Collaborate with directors, producers and post-production teams on creative decisions",
      "Refine pacing, timing, continuity and scene transitions",
      "Integrate visual effects, sound effects and music into editorial cuts",
      "Maintain organised project files, versions and records through post-production",
    ],
    countries: {
      AU: {
        headline:
          "An exact current OSCA 231434 Film and Video Editor occupation that is in national shortage, with VETASSESS Group B skills assessment but no current CampCareer skilled-list inclusion",
        entryPathway:
          "The University of Melbourne's Bachelor of Fine Arts (Film and Television), CRICOS 093584A, and Deakin's Bachelor of Film, Television and Animation, CRICOS 095258K, are current three-year screen-production routes that include post-production and editing practice.",
        registration:
          "There is no statutory occupational registration for Film and Video Editors. VETASSESS assesses legacy ANZSCO 212314 Film and Video Editor as Group B for migration skills assessment, requiring bachelor-level qualifications and relevant employment under the applicable pathway.",
        jobMarketNote:
          "The current ingest contains a six-digit legacy 212314 labour profile with 3,300 workers, 33% part-time share, 28% female share, median age 33 and 44 average full-time hours. Median earnings remain unavailable. Broader ANZSCO 2123 vacancy and projection data are contextual only. The 2025 OSL records current OSCA 231434 in shortage nationally and in every state and territory.",
        scoreCaveat:
          "Full shortage credit is supported by the exact current occupation. Vacancy intensity and trend are not scored because the vacancy series is broader ANZSCO 2123, salary remains unscored, and no current skilled-list row for 212314 is present in the reviewed CampCareer migration ingest.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
