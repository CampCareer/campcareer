import { calculateFifoEntryScore, fifoEntryScoreBand, type EntryScoreComponents } from "./entry-score"
import type { FifoPath } from "./fifo-paths"

const DUMP_TRUCK_COMPONENTS: EntryScoreComponents = {
  pay: 8.5,
  accessibility: 7.5,
  demand: 8,
  trainingBurden: 8,
}
const DUMP_TRUCK_SCORE = calculateFifoEntryScore(DUMP_TRUCK_COMPONENTS)

export const PLANT_EQUIPMENT_PATHS = [
  {
    slug: "dump-truck-operator",
    name: "Dump Truck Operator",
    status: "verified",
    pathType: { en: "New-to-industry equipment path", ko: "신규 진입 장비 경로" },
    summary: {
      en: "The clearest Plant Operator route for a beginner right now: current Australian mining employers are advertising new-to-industry dump-truck roles, while recent FIFO traineeships show a structured path from no mine-site experience into rigid haul-truck work.",
      ko: "현재 초보자에게 가장 명확한 Plant Operator 경로입니다. 호주 광산 고용주들이 new-to-industry Dump Truck 역할을 채용 중이고, 최근 FIFO traineeship은 기존 광산 현장 경력 없이 rigid haul-truck 업무로 들어가는 구조화된 경로를 보여줍니다.",
    },
    researchNote: {
      en: "CampCareer rates Dump Truck separately from excavator and loader work because 2026 employer evidence shows a repeatable new-to-industry route. The open market is still experience-heavy, so the score rewards the beginner pathway without treating every dump-truck vacancy as entry-level.",
      ko: "2026년 고용주 근거에서 반복 가능한 new-to-industry 경로가 확인되므로 Dump Truck를 Excavator·Loader와 분리해 평가합니다. 일반 채용시장은 여전히 경력 중심이므로 모든 Dump Truck 공고를 초보자용으로 보지는 않습니다.",
    },
    researchFocus: {
      en: [
        "Current and recent employer-funded new-to-industry programs",
        "Rigid haul truck competency and Certificate III pathway",
        "First-job work-rights, licence and screening requirements",
        "Current pay evidence and the gap between trainee and experienced vacancies",
      ],
      ko: [
        "현재·최근 고용주 지원 new-to-industry 프로그램",
        "Rigid haul truck 역량과 Certificate III 경로",
        "첫 취업의 취업권리·운전면허·검사 요건",
        "현재 보수 근거와 trainee·경력직 공고의 차이",
      ],
    },
    published: {
      asOf: "16 Aug 2026",
      confidence: "Medium",
      pay: {
        display: "A$90k–A$140k",
        score: DUMP_TRUCK_COMPONENTS.pay,
        note: {
          en: "A trainee-to-established-operator comparison band, not a guaranteed salary. Current entry-level ads include roughly A$38–A$50 per hour offers, while SEEK estimates established Dump Truck Operator pay around A$120k–A$140k at major mining employers. CampCareer keeps the lower end below experienced-market estimates so trainee pay is not overstated.",
          ko: "보장 연봉이 아니라 trainee에서 established operator까지의 비교 밴드입니다. 현재 entry-level 공고에는 대략 A$38–A$50/hour 수준이 확인되고, SEEK의 주요 광산 고용주 Dump Truck Operator 추정치는 A$120k–A$140k 수준입니다. trainee 보수를 과장하지 않도록 하한을 경력직 시장 추정보다 낮게 잡았습니다.",
        },
      },
      accessibility: {
        score: DUMP_TRUCK_COMPONENTS.accessibility,
        label: { en: "Good through targeted intakes", ko: "신규 선발 경로로 좋음" },
        note: {
          en: "Current Yellow Iron and Programmed listings explicitly recruit new-to-industry or trainee operators. Macmahon's 2026 24-month FIFO/DIDO traineeship also stated mine-site experience was advantageous but not essential. The catch is that beginner intakes are competitive or episodic, while many ordinary production vacancies still require experience.",
          ko: "현재 Yellow Iron과 Programmed 공고는 new-to-industry 또는 trainee operator를 명시적으로 모집합니다. Macmahon의 2026년 24개월 FIFO/DIDO traineeship도 mine-site experience를 'advantageous but not essential'로 명시했습니다. 다만 초보 선발은 경쟁이 있거나 상시가 아니며, 일반 production 공고 상당수는 여전히 경력을 요구합니다.",
        },
      },
      demand: {
        score: DUMP_TRUCK_COMPONENTS.demand,
        label: { en: "Strong current hiring breadth", ko: "현재 채용 폭 강함" },
        note: {
          en: "Current market evidence includes new-to-industry and trainee dump-truck recruitment alongside many experienced vacancies, and Macmahon ran a structured FIFO/DIDO trainee intake for an October 2026 start. Jobs and Skills Australia also lists Truck Drivers and Earthmoving Plant Operators among the ten largest occupations in Mining. Job-board result counts are treated as breadth signals, not a vacancy census.",
          ko: "현재 시장에는 new-to-industry·trainee Dump Truck 채용과 다수의 경력직 공고가 함께 확인되며, Macmahon도 2026년 10월 시작을 위한 구조화된 FIFO/DIDO trainee 선발을 진행했습니다. Jobs and Skills Australia에서도 Truck Drivers와 Earthmoving Plant Operators가 Mining 산업의 상위 10개 직업군에 포함됩니다. 채용 플랫폼 결과 수는 정확한 vacancy 통계가 아니라 시장 폭 신호로만 사용합니다.",
        },
      },
      trainingBurden: {
        score: DUMP_TRUCK_COMPONENTS.trainingBurden,
        label: { en: "Low upfront cost, substantial on-job training", ko: "선결제 부담 낮음 · 충분한 OJT 필요" },
        note: {
          en: "RIIMPO338E is the current national unit for rigid haul truck operations. Macmahon's 2026 traineeship worked toward RII30120 Certificate III in Surface Extraction Operations through a 24-month employer/RTO pathway, and current Programmed traineeships also offer learn-while-you-earn pathways. Paying privately for a stack of tickets before applying is not the default recommendation.",
          ko: "RIIMPO338E는 현재 rigid haul truck 운전 국가 단위 역량입니다. Macmahon의 2026 traineeship은 24개월 고용주/RTO 경로로 RII30120 Certificate III in Surface Extraction Operations 취득을 지원했고, 현재 Programmed traineeship도 learn-while-you-earn 경로를 제공합니다. 지원 전 여러 티켓을 사비로 쌓는 것을 기본 전략으로 추천하지 않습니다.",
        },
      },
      requirements: {
        common: [
          { en: "A current driver's licence; Macmahon's 2026 FIFO traineeship required a full unrestricted manual licence", ko: "현재 운전면허. Macmahon의 2026 FIFO traineeship은 full unrestricted manual licence를 요구" },
          { en: "Australian work rights; funded employer programs can add citizenship or permanent-residency conditions", ko: "호주 취업 권리. 고용주·정부지원 프로그램에 따라 시민권 또는 영주권 조건이 추가될 수 있음" },
          { en: "Ability to pass pre-employment medical and drug/alcohol screening; some employers also run criminal-history and qualification checks", ko: "입사 전 medical·D&A 검사 통과. 일부 고용주는 criminal-history·qualification 검사도 진행" },
          { en: "Roster readiness varies by site: FIFO traineeships can include 12-hour rotating day/night shifts, while some current new-to-industry roles are day shift", ko: "현장별 로스터 적응. FIFO traineeship은 12시간 주·야간 교대가 포함될 수 있고, 일부 현재 new-to-industry 역할은 day shift" },
        ],
        training: [
          { en: "RII30120 Certificate III in Surface Extraction Operations — available through employer traineeship pathways", ko: "RII30120 Certificate III in Surface Extraction Operations — 고용주 traineeship 경로로 취득 가능" },
          { en: "RIIMPO338E Conduct rigid haul truck operations is the current nationally recognised unit for this equipment", ko: "RIIMPO338E Conduct rigid haul truck operations — 현재 해당 장비의 국가 공인 unit" },
        ],
        notUniversal: [
          { en: "A privately purchased 'dump truck ticket' does not substitute for the site-specific competency and production experience many standard vacancies ask for", ko: "사설 'dump truck ticket' 하나가 일반 채용에서 요구하는 현장별 competency와 production 경력을 대체하지는 않습니다." },
          { en: "White Card is construction-induction training, not a universal mining haul-truck entry requirement", ko: "White Card는 건설 induction이며 모든 mining haul-truck 진입에 공통인 요건은 아닙니다." },
        ],
      },
      score: {
        total: DUMP_TRUCK_SCORE,
        band: fifoEntryScoreBand(DUMP_TRUCK_SCORE),
        components: DUMP_TRUCK_COMPONENTS,
      },
      sources: [
        {
          label: "Traineeship - Dump Truck Operator — 2026 intake",
          publisher: "Macmahon",
          type: "employer",
          date: "Assessment 6 Aug 2026 · October 2026 start",
          url: "https://careers.macmahon.com.au/job/Perth-Traineeship-Dump-Truck-Operator-WA-6105/1364164166/",
        },
        {
          label: "RIIMPO338E Conduct rigid haul truck operations",
          publisher: "training.gov.au",
          type: "official",
          date: "current unit · accessed 16 Aug 2026",
          url: "https://training.gov.au/Training/Details/RIIMPO338E",
        },
        {
          label: "RII30120 Certificate III in Surface Extraction Operations",
          publisher: "training.gov.au",
          type: "official",
          date: "current qualification · accessed 16 Aug 2026",
          url: "https://training.gov.au/Training/Details/RII30120",
        },
        {
          label: "OSCA 732331 Miner / Mining Plant Operator",
          publisher: "Australian Bureau of Statistics",
          type: "official",
          date: "OSCA 2024 v1.0",
          url: "https://www.abs.gov.au/statistics/classifications/osca-occupation-standard-classification-australia/2024-version-1-0/browse-classification/7/73/732/7323/732331",
        },
        {
          label: "Mining industry occupation profile",
          publisher: "Jobs and Skills Australia",
          type: "official",
          date: "Feb 2026 data release",
          url: "https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/industries/mining",
        },
        {
          label: "New to Industry - Dump Truck Operator",
          publisher: "Yellow Iron Fleet via SEEK",
          type: "market",
          date: "listed 15 Aug 2026",
          url: "https://au.seek.com/fifo-dump-truck-operator-entry-level-jobs",
        },
        {
          label: "Trainee Dump Truck Operator - Upper and Lower Hunter Valley",
          publisher: "Programmed Skilled Workforce via SEEK",
          type: "market",
          date: "active Aug 2026",
          url: "https://au.seek.com/trainee-dump-truck-drivers-jobs",
        },
        {
          label: "Dump Truck Operator salary estimate at Macmahon",
          publisher: "SEEK",
          type: "market",
          date: "refreshed 16 Mar 2026",
          url: "https://www.seek.com.au/companies/macmahon-432668/salaries/dump-truck-operator",
        },
        {
          label: "Construction induction training scope",
          publisher: "WorkSafe WA",
          type: "official",
          date: "accessed 16 Aug 2026",
          url: "https://www.worksafe.wa.gov.au/construction-induction-training",
        },
      ],
    },
  },
  {
    slug: "excavator-operator",
    name: "Excavator Operator",
    status: "researching",
    pathType: { en: "Experience-first equipment path", ko: "경력 우선 장비 경로" },
    summary: {
      en: "High-paying FIFO work exists, but current 2026 mining ads repeatedly ask for proven excavator experience and often specific large-machine exposure. CampCareer is not treating this as a zero-experience entry path yet.",
      ko: "고소득 FIFO 일자리는 존재하지만 2026년 현재 광산 공고는 반복적으로 excavator 실무경력과 대형 장비 경험을 요구합니다. 아직 zero-experience 진입 경로로 평가하지 않습니다.",
    },
    researchNote: {
      en: "RIIMPO320F is current nationally recognised excavator competency, but a ticket alone does not solve the first-job problem. CampCareer is looking for a repeatable employer-sponsored beginner route before publishing a score.",
      ko: "RIIMPO320F는 현재 국가 공인 excavator 역량이지만 티켓 하나만으로 첫 취업 문제가 해결되지는 않습니다. 반복 가능한 고용주 지원 초보 경로가 확인될 때까지 점수를 공개하지 않습니다.",
    },
    researchFocus: {
      en: [
        "Minimum operating experience in current FIFO vacancies",
        "RIIMPO320F and site-specific competency expectations",
        "Large production excavator machine requirements",
        "Whether a genuine new-to-industry employer pathway exists",
      ],
      ko: [
        "현재 FIFO 공고의 최소 운전경력",
        "RIIMPO320F와 현장별 competency 기대치",
        "대형 production excavator 장비 요구조건",
        "실제 new-to-industry 고용주 경로 존재 여부",
      ],
    },
  },
  {
    slug: "loader-operator",
    name: "Loader Operator",
    status: "researching",
    pathType: { en: "Experience-first equipment path", ko: "경력 우선 장비 경로" },
    summary: {
      en: "Current FIFO loader roles can pay strongly, but the visible 2026 market is dominated by experienced and multi-ticketed operator hiring. It stays unrated until a credible beginner route is verified.",
      ko: "현재 FIFO Loader는 높은 보수가 가능하지만 2026년 공개 채용시장은 경력자·multi-ticketed operator 중심입니다. 신뢰할 수 있는 초보 진입 경로가 검증될 때까지 미평가 상태로 둡니다.",
    },
    researchNote: {
      en: "RIIMPO321F is current nationally recognised wheeled front-end loader competency. Current mining vacancies still place substantial weight on relevant plant and production experience, so CampCareer will not equate a short course with job readiness.",
      ko: "RIIMPO321F는 현재 국가 공인 wheeled front-end loader 역량입니다. 최신 광산 공고는 관련 plant·production 경력을 강하게 보기 때문에 단기 교육 이수를 취업 준비 완료와 동일시하지 않습니다.",
    },
    researchFocus: {
      en: [
        "Current FIFO experience thresholds",
        "RIIMPO321F and equipment/site competency",
        "Loader pay versus realistic first-job accessibility",
        "Employer upskilling routes from dump truck or other entry equipment",
      ],
      ko: [
        "현재 FIFO 경력 기준",
        "RIIMPO321F와 장비·현장 competency",
        "Loader 보수와 실제 첫 취업 접근성의 차이",
        "Dump Truck 등 초기 장비에서 Loader로 올라가는 고용주 upskilling 경로",
      ],
    },
  },
] as const satisfies readonly FifoPath[]

export { DUMP_TRUCK_SCORE, DUMP_TRUCK_COMPONENTS }
