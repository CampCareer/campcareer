import { calculateFifoEntryScore, fifoEntryScoreBand, type EntryScoreComponents } from "./entry-score"

export type FifoPathStatus = "researching" | "verified"
export type EvidenceConfidence = "Low" | "Medium" | "High"

export type FifoEvidenceSource = {
  label: string
  publisher: string
  type: "official" | "employer" | "market"
  date: string
  url: string
}

export type FifoPublishedResearch = {
  asOf: string
  confidence: EvidenceConfidence
  pay: {
    display: string
    score: number
    note: { en: string; ko: string }
  }
  accessibility: {
    score: number
    label: { en: string; ko: string }
    note: { en: string; ko: string }
  }
  demand: {
    score: number
    label: { en: string; ko: string }
    note: { en: string; ko: string }
  }
  trainingBurden: {
    score: number
    label: { en: string; ko: string }
    note: { en: string; ko: string }
  }
  requirements: {
    common: readonly { en: string; ko: string }[]
    training: readonly { en: string; ko: string }[]
    notUniversal: readonly { en: string; ko: string }[]
  }
  score: {
    total: number
    band: string
    components: EntryScoreComponents
  }
  sources: readonly FifoEvidenceSource[]
}

export type FifoPath = {
  slug: string
  name: string
  status: FifoPathStatus
  pathType: { en: string; ko: string }
  summary: { en: string; ko: string }
  researchNote: { en: string; ko: string }
  researchFocus: { en: readonly string[]; ko: readonly string[] }
  published?: FifoPublishedResearch
}

const DRILLERS_OFFSIDER_COMPONENTS: EntryScoreComponents = {
  pay: 8.5,
  accessibility: 7.5,
  demand: 7.5,
  trainingBurden: 8.5,
}
const DRILLERS_OFFSIDER_SCORE = calculateFifoEntryScore(DRILLERS_OFFSIDER_COMPONENTS)

export const FIFO_PATHS: readonly FifoPath[] = [
  {
    slug: "drillers-offsider",
    name: "Driller's Offsider",
    status: "verified",
    pathType: { en: "Entry path", ko: "초기 진입 경로" },
    summary: {
      en: "One of the clearest paid-training routes into Australian FIFO: major drilling employers currently recruit entry-level offsiders, then train them toward nationally recognised drilling qualifications.",
      ko: "호주 FIFO에 들어가는 비교적 명확한 유급훈련 경로입니다. 주요 드릴링 고용주가 현재 초급 Offsider를 채용하고, 입사 후 국가 공인 드릴링 자격 취득을 지원합니다.",
    },
    researchNote: {
      en: "CampCareer rates this path from current employer hiring evidence, official occupation/training sources and current advertised pay evidence. The published pay band is a conservative comparison range, not a guaranteed salary.",
      ko: "현재 고용주 채용 근거, 공식 직업·훈련 자료, 최신 공개 보수 자료를 바탕으로 평가합니다. 공개 보수 밴드는 비교를 위한 보수적 범위이며 보장 연봉이 아닙니다.",
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
    published: {
      asOf: "16 Aug 2026",
      confidence: "Medium",
      pay: {
        display: "A$100k–A$130k",
        score: DRILLERS_OFFSIDER_COMPONENTS.pay,
        note: {
          en: "A conservative entry-level FIFO comparison band. Current DDH1 recruitment describes the role as six-figure; current salary estimates and ads cluster around A$100k–A$130k, with higher outliers excluded.",
          ko: "초급 FIFO 비교를 위한 보수적 밴드입니다. DDH1은 현재 공고에서 six-figure 급여를 명시하고, 최신 급여 추정·공고는 대체로 A$100k–A$130k에 모입니다. 더 높은 outlier는 제외했습니다.",
        },
      },
      accessibility: {
        score: DRILLERS_OFFSIDER_COMPONENTS.accessibility,
        label: { en: "Good, but physically selective", ko: "좋음 · 육체 조건은 까다로움" },
        note: {
          en: "DDH1 explicitly accepts applicants without drilling-industry experience, but expects an HR-B licence or willingness to obtain it, First Aid/CPR, police clearance, medical and drug/alcohol screening, manual-labour capacity and remote 12-hour-shift readiness.",
          ko: "DDH1은 드릴링 업계 경력이 없어도 지원 가능하다고 명시하지만, HR-B 면허 또는 취득 의향, First Aid/CPR, 경찰조회, medical·D&A 검사, 육체노동 역량과 원격지 12시간 교대 적응이 필요합니다.",
        },
      },
      demand: {
        score: DRILLERS_OFFSIDER_COMPONENTS.demand,
        label: { en: "Strong current hiring", ko: "현재 채용 강함" },
        note: {
          en: "DDH1 is running multiple entry-level traineeship campaigns across Australian states and Ausdrill is actively recruiting offsiders. Job-board searches show hundreds of related listings, but CampCareer treats those counts as breadth signals rather than exact vacancy totals.",
          ko: "DDH1은 여러 주에서 초급 traineeship 채용을 진행하고 Ausdrill도 Offsider를 채용 중입니다. 채용 플랫폼에는 관련 공고가 수백 건 보이지만 CampCareer는 이를 정확한 vacancy 수가 아니라 시장 폭 신호로만 사용합니다.",
        },
      },
      trainingBurden: {
        score: DRILLERS_OFFSIDER_COMPONENTS.trainingBurden,
        label: { en: "Low upfront training burden", ko: "선행 교육 부담 낮음" },
        note: {
          en: "RII20920 Certificate II in Drilling Operations is current nationally recognised training. Crucially, DDH1 and Ausdrill advertise pathways where the qualification is gained after hiring through paid/employer-supported traineeship training, so buying a Cert II upfront is not the default recommendation.",
          ko: "RII20920 Certificate II in Drilling Operations는 현재 국가 공인 훈련입니다. 중요한 점은 DDH1과 Ausdrill이 채용 후 유급·고용주 지원 traineeship으로 이 자격을 취득하는 경로를 제공한다는 것입니다. 따라서 Cert II를 선결제하는 것을 기본 추천으로 보지 않습니다.",
        },
      },
      requirements: {
        common: [
          { en: "HR-B / HR driver licence, or ability to obtain it on the employer's timetable", ko: "HR-B / HR 운전면허 또는 고용주 일정에 맞춰 취득 가능" },
          { en: "Current First Aid and CPR for DDH1 entry-level traineeships", ko: "DDH1 초급 traineeship 기준 현재 First Aid·CPR" },
          { en: "National Police Clearance and ability to pass pre-employment medical + drug/alcohol screening", ko: "National Police Clearance 및 입사 전 medical·D&A 검사 통과" },
          { en: "Manual-labour fitness for remote 12-hour shifts, including days/nights and harsh weather", ko: "원격지 12시간 주·야간 교대와 거친 날씨를 버틸 육체노동 체력" },
          { en: "Australian work rights; some government-funded traineeships add Australian/NZ residency conditions", ko: "호주 취업 권리. 일부 정부지원 traineeship은 호주/뉴질랜드 거주 조건 추가" },
        ],
        training: [
          { en: "RII20920 Certificate II in Drilling Operations — often employer-funded after hire", ko: "RII20920 Certificate II in Drilling Operations — 채용 후 고용주 지원 취득 사례가 일반적" },
          { en: "Progression can continue to Certificate III and later senior drilling qualifications", ko: "이후 Certificate III 및 senior drilling 자격으로 발전 가능" },
        ],
        notUniversal: [
          { en: "White Card is not a universal mining-drilling entry ticket; it is construction-induction training required when doing construction work", ko: "White Card는 모든 mining-drilling 진입에 공통으로 필요한 티켓이 아닙니다. construction work를 수행할 때 필요한 건설 안전 induction입니다." },
          { en: "Working at Heights, Confined Space and other site tickets may be employer/site-specific rather than universal pre-entry requirements", ko: "Working at Heights, Confined Space 등은 보편적 선행요건이 아니라 고용주·현장별 요건일 수 있습니다." },
        ],
      },
      score: {
        total: DRILLERS_OFFSIDER_SCORE,
        band: fifoEntryScoreBand(DRILLERS_OFFSIDER_SCORE),
        components: DRILLERS_OFFSIDER_COMPONENTS,
      },
      sources: [
        {
          label: "Driller's Assistants occupation profile",
          publisher: "Jobs and Skills Australia",
          type: "official",
          date: "Feb 2026 data release",
          url: "https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupations/821912-drillers-assistants",
        },
        {
          label: "OSCA 821931 Driller's Offsider",
          publisher: "Australian Bureau of Statistics",
          type: "official",
          date: "OSCA 2024 v1.0",
          url: "https://www.abs.gov.au/book/export/43517/print",
        },
        {
          label: "RII20920 Certificate II in Drilling Operations",
          publisher: "training.gov.au",
          type: "official",
          date: "Release 4 · 17 Mar 2026",
          url: "https://training.gov.au/training/details/RII20920/qualdetails",
        },
        {
          label: "Construction induction training scope",
          publisher: "WorkSafe WA",
          type: "official",
          date: "accessed 16 Aug 2026",
          url: "https://www.worksafe.wa.gov.au/construction-induction-training",
        },
        {
          label: "Driller's Offsiders WA — Entry Level Traineeships",
          publisher: "DDH1 Drilling / Perenti",
          type: "employer",
          date: "15 Jul 2026",
          url: "https://jobs.perentigroup.com/job/Canning-Vale-Driller%26apos%3Bs-Offsiders-WA-Entry-Level-Traineeships%21-WA-6155/1356117966/",
        },
        {
          label: "Queensland Driller's Offsiders — Entry Level Traineeships",
          publisher: "DDH1 Drilling / Perenti",
          type: "employer",
          date: "27 Jul 2026",
          url: "https://jobs.perentigroup.com/job/Brisbane-Queensland-Driller%26apos%3Bs-Offsiders-Entry-Level-Traineeships%21-QLD/1063248566/",
        },
        {
          label: "Drillers Offsiders",
          publisher: "Ausdrill / Perenti",
          type: "employer",
          date: "14 Jul 2026",
          url: "https://jobs.perentigroup.com/job/Perth-Drillers-Offsiders-WA/1364232866/",
        },
        {
          label: "Current Drillers Offsider jobs and advertised pay",
          publisher: "SEEK",
          type: "market",
          date: "Jul–Aug 2026",
          url: "https://au.seek.com/drillers-offsider-jobs/in-All-Australia",
        },
        {
          label: "DDH1 Drillers Offsider salary estimate",
          publisher: "SEEK",
          type: "market",
          date: "refreshed 2 Jul 2026",
          url: "https://au.seek.com/companies/ddh1-drilling-436912/salaries/drillers-offsider",
        },
        {
          label: "McKay Drilling Drillers Offsider salary estimate",
          publisher: "SEEK",
          type: "market",
          date: "refreshed 2 Jul 2026",
          url: "https://au.seek.com/companies/mckay-drilling-1048250/salaries/drillers-offsider",
        },
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
