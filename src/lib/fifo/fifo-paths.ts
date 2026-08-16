export type FifoPathStatus = "researching" | "verified"

export type FifoPath = {
  slug: string
  name: string
  status: FifoPathStatus
  pathType: { en: string; ko: string }
  summary: { en: string; ko: string }
  researchNote: { en: string; ko: string }
  researchFocus: { en: readonly string[]; ko: readonly string[] }
}

export const FIFO_PATHS: readonly FifoPath[] = [
  {
    slug: "drillers-offsider",
    name: "Driller's Offsider",
    status: "researching",
    pathType: { en: "Entry path", ko: "초기 진입 경로" },
    summary: {
      en: "A focused research page for people considering Driller's Offsider roles as a route into Australian FIFO work.",
      ko: "호주 FIFO 진입 경로로 Driller's Offsider를 검토하는 사람을 위한 집중 리서치 페이지입니다.",
    },
    researchNote: {
      en: "CampCareer will not publish an Entry Score or pay range until current employer requirements, training burden, demand and first-job evidence are verified.",
      ko: "현재 채용 요건, 교육 부담, 수요, 첫 취업 근거를 검증하기 전에는 CampCareer Entry Score나 보수 범위를 공개하지 않습니다.",
    },
    researchFocus: {
      en: [
        "Current employer entry requirements",
        "Required, useful and employer-specific tickets",
        "Roster and site patterns relevant to first-time applicants",
        "Evidence-backed pay ranges and first-job availability",
      ],
      ko: [
        "현재 고용주 진입 요건",
        "필수·유용·고용주별 티켓 구분",
        "첫 지원자에게 중요한 로스터·현장 패턴",
        "근거가 있는 보수 범위와 첫 취업 가능성",
      ],
    },
  },
  {
    slug: "plant-operator",
    name: "Plant Operator",
    status: "researching",
    pathType: { en: "Equipment path", ko: "장비 운전 경로" },
    summary: {
      en: "A FIFO research page for the broad Plant Operator search term, with the final CampCareer model designed to separate equipment-specific entry paths.",
      ko: "광범위한 Plant Operator 검색어를 다루되, 최종 CampCareer 모델에서는 장비 종류별 진입 경로를 분리하기 위한 FIFO 리서치 페이지입니다.",
    },
    researchNote: {
      en: "Plant Operator will not receive one generic score. CampCareer is verifying which equipment paths should be compared separately before publishing ratings.",
      ko: "Plant Operator에 하나의 포괄 점수를 부여하지 않습니다. 어떤 장비 경로를 별도로 비교해야 하는지 검증한 뒤 점수를 공개합니다.",
    },
    researchFocus: {
      en: [
        "Which equipment categories deserve separate CampCareer paths",
        "Licence, competency and site-entry requirements by equipment type",
        "Experience expectations for first-time FIFO applicants",
        "Pay, demand and roster evidence by equipment path",
      ],
      ko: [
        "어떤 장비 카테고리를 별도 CampCareer 경로로 나눌지",
        "장비별 면허·역량·현장 진입 요건",
        "첫 FIFO 지원자에게 요구되는 경력 수준",
        "장비 경로별 보수·수요·로스터 근거",
      ],
    },
  },
  {
    slug: "scaffolder",
    name: "Scaffolder",
    status: "researching",
    pathType: { en: "Licensing-focused path", ko: "면허 중심 경로" },
    summary: {
      en: "A research page for people comparing scaffolding with other FIFO entry paths, focused on the real entry burden rather than headline pay alone.",
      ko: "스캐폴딩을 다른 FIFO 진입 경로와 비교하는 사람을 위해, 단순한 높은 보수보다 실제 진입 부담을 중심으로 보는 리서치 페이지입니다.",
    },
    researchNote: {
      en: "CampCareer is verifying current licensing, training and employer evidence before deciding how Scaffolder should score against lower-barrier FIFO paths.",
      ko: "Scaffolder를 더 낮은 진입 장벽의 FIFO 경로와 비교해 점수화하기 전에 현재 면허, 교육, 고용주 근거를 검증하고 있습니다.",
    },
    researchFocus: {
      en: [
        "Current licensing and training requirements",
        "What employers expect beyond minimum compliance",
        "Time and cost burden before a first FIFO role",
        "Evidence-backed pay, demand and progression paths",
      ],
      ko: [
        "현재 면허·교육 요건",
        "최소 법적 요건 외에 고용주가 기대하는 조건",
        "첫 FIFO 역할 전 필요한 시간·비용 부담",
        "근거가 있는 보수·수요·경력 발전 경로",
      ],
    },
  },
] as const

export function getFifoPath(slug: string) {
  return FIFO_PATHS.find((path) => path.slug === slug)
}
