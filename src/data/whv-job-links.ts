import type { WHVWorkCategory } from "./whv-occupations"

export interface WHVJobLink {
  label_en: string
  label_ko: string
  url: string
}

export const WHV_GENERAL_JOBS: WHVJobLink = {
  label_en: "Backpacker Job Board — Second Year Visa Jobs",
  label_ko: "백패커 잡보드 — 세컨비자 전용",
  url: "https://www.backpackerjobboard.com.au/second-year-visa-jobs/",
}

export const WHV_JOB_LINKS: Record<WHVWorkCategory, WHVJobLink[]> = {
  agriculture: [
    {
      label_en: "Backpacker Job Board — Fruit Picking",
      label_ko: "백패커 잡보드 — 과일 피킹",
      url: "https://www.backpackerjobboard.com.au/jobs/fruit-picking-jobs/",
    },
    {
      label_en: "AgriLabour — Seasonal Harvest",
      label_ko: "AgriLabour — 시즌 수확",
      url: "https://www.agrilabour.com.au/candidates/seasonal-harvest-listings/",
    },
  ],
  fishing: [],
  tree_farming: [],
  mining: [
    {
      label_en: "Seek — Mining Jobs",
      label_ko: "Seek — 광업",
      url: "https://au.seek.com/mining-jobs",
    },
  ],
  construction: [
    {
      label_en: "Seek — Construction Jobs",
      label_ko: "Seek — 건설",
      url: "https://au.seek.com/construction-jobs",
    },
  ],
  tourism_hospitality: [
    {
      label_en: "Seek — Hospitality Jobs",
      label_ko: "Seek — 접객/관광",
      url: "https://au.seek.com/hospitality-jobs",
    },
  ],
}
