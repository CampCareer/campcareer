export type WHVWorkCategory =
  | "agriculture"
  | "fishing"
  | "tree_farming"
  | "mining"
  | "construction"
  | "tourism_hospitality"

export interface WHVSpecifiedWork {
  key: WHVWorkCategory
  label_en: string
  label_ko: string
  examples_en: string[]
  examples_ko: string[]
}

export const WHV_SPECIFIED_WORK: WHVSpecifiedWork[] = [
  {
    key: "agriculture",
    label_en: "Agriculture / Horticulture",
    label_ko: "농업 / 원예",
    examples_en: ["fruit & vegetable picking", "crop farming", "livestock", "vineyard work", "grain farming"],
    examples_ko: ["과일·채소 수확", "곡물 재배", "축산", "포도원 작업", "농장 일반"],
  },
  {
    key: "fishing",
    label_en: "Fishing / Pearling",
    label_ko: "어업 / 진주 채취",
    examples_en: ["commercial fishing", "pearling", "aquaculture", "prawn trawling"],
    examples_ko: ["상업 어업", "진주 채취", "양식업", "새우 트롤링"],
  },
  {
    key: "tree_farming",
    label_en: "Tree Farming / Felling",
    label_ko: "임업 / 벌목",
    examples_en: ["plantation work", "forestry", "timber harvesting", "tree planting"],
    examples_ko: ["조림 작업", "산림업", "목재 수확", "나무 심기"],
  },
  {
    key: "mining",
    label_en: "Mining",
    label_ko: "광업",
    examples_en: ["mining operations", "quarrying", "resource extraction"],
    examples_ko: ["광산 작업", "채석", "자원 채굴"],
  },
  {
    key: "construction",
    label_en: "Construction",
    label_ko: "건설",
    examples_en: ["building construction", "civil works", "road construction", "site preparation"],
    examples_ko: ["건축 공사", "토목 공사", "도로 건설", "현장 정리"],
  },
  {
    key: "tourism_hospitality",
    label_en: "Tourism & Hospitality",
    label_ko: "관광 / 호스피탈리티",
    examples_en: ["hotel work", "restaurant / cafe", "tour guiding", "resort operations", "event management"],
    examples_ko: ["호텔 업무", "레스토랑·카페", "투어 가이드", "리조트 운영", "이벤트 관리"],
  },
]

export const WHV_WORK_BY_REGION: Record<string, WHVWorkCategory[]> = {
  eligible: ["agriculture", "fishing", "tree_farming", "mining", "construction"],
  remote_tourism: ["tourism_hospitality"],
}

export function getWorkCategoriesForSA4(code: string, category: string): WHVSpecifiedWork[] {
  const keys: WHVWorkCategory[] = []
  if (category === "eligible" || category === "partial") {
    keys.push("agriculture", "fishing", "tree_farming", "mining", "construction")
    const outbackCodes = ["105", "110", "315", "406", "510", "511", "604", "702"]
    const remoteCodes = ["306", "308", "312", "315", "318", "406", "510", "511", "604", "702", "701"]
    if (outbackCodes.includes(code) || remoteCodes.includes(code)) {
      keys.push("tourism_hospitality")
    }
  }
  return WHV_SPECIFIED_WORK.filter((w) => keys.includes(w.key))
}
