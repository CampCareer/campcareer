import { calculateFifoEntryScore, fifoEntryScoreBand, type EntryScoreComponents } from "./entry-score"
import type { FifoPath } from "./fifo-paths"

const DUMP_TRUCK_COMPONENTS: EntryScoreComponents = {
  pay: 9,
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
      en: "The strongest Plant Operator route for a beginner right now: current Australian mining traineeships recruit people without prior mine-site experience and train them to operate rigid haul trucks on site.",
      ko: "현재 초보자에게 가장 강한 Plant Operator 경로입니다. 호주 광산의 최신 traineeship은 기존 광산 현장 경력이 없는 지원자도 선발해 현장에서 rigid haul truck 운전을 훈련합니다.",
    },
    researchNote: {
      en: "CampCareer rates Dump Truck separately from excavator and loader work because current 2026 employer evidence shows a real new-to-industry FIFO/DIDO traineeship route. The open market is still experience-heavy, so the score rewards the traineeship route without treating every dump-truck vacancy as beginner-friendly.",
      ko: "2026년 현재 실제 new-to-industry FIFO/DIDO traineeship 경로가 확인되므로 Dump Truck를 Excavator·Loader와 분리해 평가합니다. 일반 채용시장은 여전히 경력 중심이므로 모든 dump-truck 공고가 초보자 친화적이라고 보지는 않습니다.",
    },
    researchFocus: {
      en: [
        "Current employer-funded new-to-industry programs",
        "Rigid haul truck competency and Certificate III pathway",
        "First-job work-rights, licence and screening requirements",
        "Current pay evidence and the gap between trainee and experienced vacancies",
      ],
      ko: [
        "현재 고용주 지원 new-to-industry 프로그램",
        "Rigid haul truck 역량과 Certificate III 경로",
        "첫 취업의 취업권리·운전면허·검사 요건",
        "현재 보수 근거와 trainee·경력직 공고의 차이",
      ],
    },
    published: {
      asOf: "16 Aug 2026",
      confidence: "Medium",
      pay: {
        display: "A$110k–A$140k",
        score: DUMP_TRUCK_COMPONENTS.pay,
        note: {
          en: "A conservative FIFO comparison band rather than a guaranteed trainee salary. SEEK currently estimates Dump Truck Operator pay around A$120k–A$140k across major mining employers, while new-to-industry hourly ads show that entry programs can start differently by roster and employer. CampCareer lowers the comparison floor to A$110k to avoid presenting experienced-market pay as a trainee guarantee.",
          ko: "보장 trainee 연봉이 아니라 보수적인 FIFO 비교 밴드입니다. SEEK의 주요 광산 고용주 Dump Truck Operator 추정치는 현재 대체로 A$120k–A$140k이며, new-to-industry 시급 공고는 로스터·고용주에 따라 시작 보수가 달라질 수 있음을 보여줍니다. 경력직 시장 보수를 trainee 보장액처럼 보이지 않도록 하한을 A$110k로 낮췄습니다.",
        },
      },
      accessibility: {
        score: DUMP_TRUCK_COMPONENTS.accessibility,
        label: { en: "Good through traineeships", ko: "Traineeship 경로로 좋음" },
        note: {
          en: "Macmahon's current 24-month program is FIFO/DIDO from Perth and says previous mine-site experience is advantageous but not essential. The catch is that structured intake windows are competitive and episodic, while many ordinary dump-truck vacancies still ask for prior production experience.",
          ko: "Macmahon의 현재 24개월 프로그램은 Perth FIFO/DIDO이며 기존 mine-site 경력을 'advantageous but not essential'로 명시합니다. 다만 이런 구조화된 선발창구는 경쟁이 있고 상시가 아니며, 일반 dump-truck 공고 상당수는 여전히 production 경력을 요구합니다.",
        },
      },
      demand: {
        score: DUMP_TRUCK_COMPONENTS.demand,
        label: { en: "Strong, with recurring intake windows", ko: "강함 · 반복되는 신규 선발" },
        note: {
          en: "Current 2026 hiring includes Macmahon's surface-mining traineeship plus multiple new-to-industry truck campaigns in the market. Jobs and Skills Australia also lists Truck Drivers and Earthmoving Plant Operators among the ten largest occupations in Mining. CampCareer treats broad job-board result counts as a breadth signal, not a vacancy census.",
          ko: "2026년 현재 Macmahon surface-mining traineeship과 여러 new-to-industry truck 채용이 확인됩니다. Jobs and Skills Australia에서도 Truck Drivers와 Earthmoving Plant Operators가 Mining 산업의 상위 10개 직업군에 포함됩니다. 채용 플랫폼의 검색 결과 수는 정확한 vacancy 통계가 아니라 시장 폭 신호로만 사용합니다.",
        },
      },
      trainingBurden: {
        score: DUMP_TRUCK_COMPONENTS.trainingBurden,
        label: { en: "Low upfront cost, long on-job training", ko: "선결제 부담 낮음 · 장기 OJT" },
        note: {
          en: "RIIMPO338E is the current national unit for rigid haul truck operations. Macmahon's current traineeship works toward RII30120 Certificate III in Surface Extraction Operations through a 24-month employer/RTO pathway, so paying privately for a stack of tickets before applying is not the default recommendation.",
          ko: "RIIMPO338E는 현재 rigid haul truck 운전 국가 단위 역량입니다. Macmahon의 최신 traineeship은 24개월 고용주/RTO 경로로 RII30120 Certificate III in Surface Extraction Operations 취득을 지원하므로, 지원 전 여러 티켓을 사비로 쌓는 것을 기본 전략으로 추천하지 않습니다.",
        },
      },
      requirements: {
        common: [
          { en: "Full unrestricted manual driver's licence for Macmahon's current traineeship", ko: "Macmahon 현재 traineeship 기준 full unrestricted manual 운전면허" },
          { en: "Full Australian work rights; Macmahon's funded intake currently specifies Australian citizenship or permanent residency", ko: "호주 취업 권리. Macmahon의 현재 지원 프로그램은 시민권 또는 영주권을 명시" },
          { en: "Ability to pass pre-employment medical, drug/alcohol, criminal-history and qualification checks", ko: "입사 전 medical, D&A, criminal-history, qualification 검사 통과" },
          { en: "Readiness for 12-hour rotating day/night shifts and remote-site rosters", ko: "12시간 주·야간 교대와 원격 현장 로스터 적응" },
        ],
        training: [
          { en: "RII30120 Certificate III in Surface Extraction Operations can be completed through employer traineeships such as Macmahon's current 24-month program", ko: "RII30120 Certificate III in Surface Extraction Operations — Macmahon의 현재 24개월 고용주 traineeship 등으로 취득 가능" },
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
          label: "Traineeship - Dump Truck Operator",
          publisher: "Macmahon",
          type: "employer",
          date: "current intake · Aug 2026 assessment / Oct 2026 start",
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
          label: "Dump Truck Operator salary estimate at Macmahon",
          publisher: "SEEK",
          type: "market",
          date: "refreshed 16 Mar 2026",
          url: "https://www.seek.com.au/companies/macmahon-432668/salaries/dump-truck-operator",
        },
        {
          label: "Current entry-level dump truck jobs",
          publisher: "SEEK",
          type: "market",
          date: "Jul–Aug 2026",
          url: "https://au.seek.com/entry-level-dump-truck-drivers-jobs",
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
