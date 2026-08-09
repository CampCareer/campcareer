import type { OccupationEditorial } from "./occupation-editorial-base"

export const ANIMATOR_OCCUPATION_EDITORIAL = [
  {
    id: "animator",
    overview:
      "Animators create moving images and visual effects for screen, digital media, games, advertising and interactive productions. Australia has an exact current OSCA occupation, 242331 Animator or Visual Effects Artist. Its current ANZSCO 2022 correspondence is distributed across Graphic Designer, Illustrator and Multimedia Designer, so older six-digit ANZSCO labour data is used only as context rather than as an exact Animator series.",
    tasks: [
      "Develop animation and visual-effects concepts from scripts, briefs and storyboards",
      "Create 2D or 3D animated sequences, assets and motion graphics",
      "Design character, environment and effects movement for screen or interactive media",
      "Use animation, compositing and visual-effects software to produce and refine sequences",
      "Collaborate with directors, designers, editors and technical artists through production",
      "Review timing, continuity and visual quality and revise work for final delivery",
    ],
    countries: {
      AU: {
        headline:
          "Exact current OSCA 242331 Animator or Visual Effects Artist, with multiple partial ANZSCO correspondences and conservative labour scoring",
        entryPathway:
          "RMIT's Bachelor of Design (Animation and Interactive Media), CRICOS 079976B, is a current three-year on-campus degree preparing students for animation, interactive media and visual-effects work. Swinburne's Bachelor of Animation, CRICOS 092511D, is a current three-year on-campus degree covering 2D and 3D animation, visual effects and production practice.",
        registration:
          "Animation is not a statutorily registered occupation in Australia. VETASSESS assesses ANZSCO 232412 Illustrator as a Group B professional occupation and recognises Animator as a suitable occupation under that assessment page, but this migration pathway is not occupational registration and is only a partial correspondence to current OSCA 242331.",
        jobMarketNote:
          "Legacy JSA ANZSCO 232412 Illustrator data record 3,400 workers, but current OSCA 242331 has multiple partial ANZSCO correspondences, so primary employment and earnings remain null. Broader ANZSCO 2324 vacancies were 441 in May 2026, about 7.68% lower than May 2025, while broader employment projections are +9.86% to 2030 and +18.96% to 2035. The 2025 OSL rates OSCA 242331 No Shortage nationally.",
        scoreCaveat:
          "Exact salary, vacancy intensity and vacancy trend are not scored because the available labour series is broader than current OSCA 242331. Broader growth receives partial credit. ANZSCO 232412 Illustrator is on the current CSOL with VETASSESS and can recognise Animator, but the current OSCA correspondence is partial, so only partial visa credit is used.",
      },
    },
  },
] as const satisfies readonly OccupationEditorial[]
