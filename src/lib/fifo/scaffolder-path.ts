import { calculateFifoEntryScore, fifoEntryScoreBand, type EntryScoreComponents } from "./entry-score"
import type { FifoPath } from "./fifo-paths"

const SCAFFOLDER_COMPONENTS: EntryScoreComponents = {
  pay: 9,
  accessibility: 4.5,
  demand: 9,
  trainingBurden: 6,
}
const SCAFFOLDER_SCORE = calculateFifoEntryScore(SCAFFOLDER_COMPONENTS)

export const SCAFFOLDER_PATH: FifoPath = {
  slug: "scaffolder",
  name: "Scaffolder",
  status: "verified",
  pathType: { en: "Licensed access trade", ko: "면허 기반 access 직무" },
  summary: {
    en: "A high-paying, high-demand FIFO trade with a real beginner pathway — but usually not a direct zero-experience jump to mine-site scaffolding. Basic licensing can be gained quickly; major FIFO employers commonly recruit Intermediate or Advanced scaffolders with additional site tickets and experience.",
    ko: "보수와 수요가 강하고 초보 진입 경로도 실제로 존재하지만, 무경력 상태에서 곧바로 광산 FIFO Scaffolder로 들어가는 직무는 아닙니다. Basic 면허는 비교적 빨리 취득할 수 있지만 주요 FIFO 고용주는 보통 Intermediate/Advanced 면허와 추가 현장 티켓·경력을 요구합니다.",
  },
  researchNote: {
    en: "CampCareer separates the legal minimum from the hiring reality. An SB licence is the first licensing step, while current WA FIFO hiring is weighted toward SI/SA holders. The practical beginner route is often local/industrial work or a structured traineeship first, then FIFO after competency and site experience are built.",
    ko: "CampCareer는 법적 최소요건과 실제 채용요건을 구분합니다. SB는 첫 면허 단계지만 현재 WA FIFO 채용은 SI/SA 보유자 중심입니다. 현실적인 초보 경로는 로컬·산업 현장 또는 정식 traineeship에서 역량과 현장경력을 만든 뒤 FIFO로 이동하는 방식입니다.",
  },
  researchFocus: {
    en: [
      "SB → SI → SA high-risk-work licence progression",
      "Current FIFO employer requirements beyond the licence itself",
      "Beginner traineeships versus experienced FIFO vacancies",
      "Current hourly rates, shortage evidence and shutdown demand",
    ],
    ko: [
      "SB → SI → SA High Risk Work Licence 단계",
      "면허 외 현재 FIFO 고용주가 요구하는 조건",
      "초보 traineeship과 경력자 FIFO 공고의 차이",
      "현재 시급·인력부족·shutdown 수요 근거",
    ],
  },
  published: {
    asOf: "16 Aug 2026",
    confidence: "High",
    pay: {
      display: "A$55–A$65/hr",
      score: SCAFFOLDER_COMPONENTS.pay,
      note: {
        en: "A conservative current qualified-FIFO comparison range, not trainee pay and not an annual guarantee. Current WA FIFO listings commonly sit around A$55–A$65/hour, with advanced shutdown and oil-and-gas roles reaching roughly A$70–A$80+/hour. Annual earnings vary heavily by roster and continuity of shutdown work.",
        ko: "trainee 급여나 연간 보장액이 아니라 현재 자격 보유 FIFO Scaffolder를 비교하기 위한 보수적 시급 범위입니다. WA FIFO 공고는 대체로 A$55–A$65/h에 형성되고 Advanced shutdown·Oil & Gas 역할은 약 A$70–A$80+/h까지 올라갑니다. 연간 총수입은 로스터와 shutdown 연속성에 크게 달라집니다.",
      },
    },
    accessibility: {
      score: SCAFFOLDER_COMPONENTS.accessibility,
      label: { en: "Possible from zero, but FIFO comes later", ko: "무경력 진입 가능 · FIFO는 보통 이후" },
      note: {
        en: "Caledonia runs recurring scaffolding traineeship intakes and says it targets up to eight trainees per location, showing a real beginner route. However, current FIFO employers such as SRG/Bugarrba recruit predominantly SI/SA scaffolders and ask for Working at Heights, Confined Space, White Card, driver licence, work rights and medical/site testing. The first job and the first FIFO job are usually not the same step.",
        ko: "Caledonia는 지역별 연간 최대 8명 수준의 Scaffolding traineeship intake를 운영해 실제 초보 진입 경로가 있음을 보여줍니다. 하지만 현재 SRG/Bugarrba 같은 FIFO 고용주는 주로 SI/SA Scaffolder를 채용하며 Working at Heights, Confined Space, White Card, 운전면허, 취업권리와 medical/site 검사를 요구합니다. 첫 취업과 첫 FIFO 취업은 보통 같은 단계가 아닙니다.",
      },
    },
    demand: {
      score: SCAFFOLDER_COMPONENTS.demand,
      label: { en: "Very strong current demand", ko: "현재 수요 매우 강함" },
      note: {
        en: "Jobs and Skills Australia reports about 8,300 Scaffolders nationally and identifies the occupation through its shortage framework; the 2025 OSL rates Scaffolder as in shortage nationally. Current WA searches show 100+ FIFO scaffolding listings around Perth, while SRG/Bugarrba reports multiple ongoing shutdown positions and a strong pipeline through the end of 2026. Job-board counts are treated as breadth signals, not exact vacancy totals.",
        ko: "Jobs and Skills Australia는 전국 약 8,300명의 Scaffolder 고용을 집계하고 있으며 2025 OSL에서 Scaffolder를 전국 Shortage로 분류합니다. 현재 Perth 주변에는 100건 이상의 FIFO scaffolding 검색 결과가 보이고 SRG/Bugarrba도 2026년 말까지 이어지는 shutdown pipeline과 복수 채용을 명시합니다. 채용 플랫폼 숫자는 정확한 vacancy 통계가 아니라 시장 폭 신호로만 사용합니다.",
      },
    },
    trainingBurden: {
      score: SCAFFOLDER_COMPONENTS.trainingBurden,
      label: { en: "Short courses, but sequential licensing", ko: "교육은 짧지만 면허 단계가 누적됨" },
      note: {
        en: "CPCCLSF2001 Basic has no prerequisite and current Perth RTO offerings are typically 4–5 days at roughly A$940–A$1,280 before any subsidy. But Intermediate requires Basic, Advanced requires Intermediate, and the FIFO market commonly prefers SI or SA plus current site tickets. CPC30920 Certificate III in Scaffolding is also current and structured traineeships can build the pathway on the job.",
        ko: "CPCCLSF2001 Basic은 선행 단위가 없고 현재 Perth RTO 과정은 보통 4–5일, 비보조 기준 약 A$940–A$1,280입니다. 하지만 Intermediate는 Basic, Advanced는 Intermediate가 선행되고 FIFO 시장은 흔히 SI/SA와 최신 현장 티켓을 선호합니다. CPC30920 Certificate III in Scaffolding도 현재 유효하며 정식 traineeship을 통해 현장에서 단계적으로 취득할 수 있습니다.",
      },
    },
    requirements: {
      common: [
        { en: "Relevant High Risk Work Licence for the scaffolding class performed; current WA FIFO hiring commonly asks for SI or SA", ko: "수행 작업에 맞는 High Risk Work Licence. 현재 WA FIFO 채용은 흔히 SI 또는 SA 요구" },
        { en: "Working at Heights and Confined Space tickets kept within the employer's recency window (often 2 years)", ko: "고용주 유효기간 기준의 Working at Heights·Confined Space 티켓(현재 공고는 흔히 2년 이내)" },
        { en: "Construction White Card for construction work and current WA FIFO scaffolding recruitment", ko: "construction work 및 현재 WA FIFO Scaffolder 채용에서 요구되는 White Card" },
        { en: "Current driver's licence, Australian work rights and ability to pass medical / site testing", ko: "현재 운전면허, 호주 취업권리, medical·site 검사 통과 가능" },
        { en: "Industrial / shutdown experience is commonly expected before major-site FIFO work", ko: "대형 현장 FIFO 이전에 산업·shutdown 경력을 흔히 요구" },
      ],
      training: [
        { en: "CPCCLSF2001 — Basic scaffolding (SB); no prerequisite", ko: "CPCCLSF2001 — Basic scaffolding(SB), 선행 단위 없음" },
        { en: "CPCCLSF3001 — Intermediate scaffolding (SI); Basic is prerequisite", ko: "CPCCLSF3001 — Intermediate scaffolding(SI), Basic 선행" },
        { en: "CPCCLSF4001 — Advanced scaffolding (SA); Intermediate is prerequisite", ko: "CPCCLSF4001 — Advanced scaffolding(SA), Intermediate 선행" },
        { en: "CPC30920 Certificate III in Scaffolding — current national qualification and a structured traineeship pathway", ko: "CPC30920 Certificate III in Scaffolding — 현재 국가 공인 자격 및 정식 traineeship 경로" },
      ],
      notUniversal: [
        { en: "An SB ticket alone does not make someone FIFO-ready; current major-site hiring is heavily weighted to SI/SA and experience", ko: "SB 하나만으로 FIFO-ready가 되지 않습니다. 현재 대형 현장 채용은 SI/SA와 경력 비중이 큽니다." },
        { en: "Rigging, Gas Test Atmospheres and client inductions can help but are role/site-specific rather than universal scaffolder prerequisites", ko: "Rigging, Gas Test Atmospheres, 고객사 induction은 도움이 되지만 모든 Scaffolder의 보편적 선행요건은 아닙니다." },
        { en: "A private short course is not a substitute for the HRWL application, licence class or employer verification of competency", ko: "민간 단기과정 수료만으로 HRWL 신청·면허 class·고용주 VOC를 대체할 수 없습니다." },
      ],
    },
    score: {
      total: SCAFFOLDER_SCORE,
      band: fifoEntryScoreBand(SCAFFOLDER_SCORE),
      components: SCAFFOLDER_COMPONENTS,
    },
    sources: [
      {
        label: "High risk work licences — scaffolding classes",
        publisher: "Safe Work Australia",
        type: "official",
        date: "accessed 16 Aug 2026",
        url: "https://www.safeworkaustralia.gov.au/safety-topic/managing-health-and-safety/licences/high-risk-work-licence-classes",
      },
      {
        label: "High risk work licensing requirements",
        publisher: "WorkSafe WA",
        type: "official",
        date: "accessed 16 Aug 2026",
        url: "https://www.worksafe.wa.gov.au/high-risk-work-0",
      },
      {
        label: "CPCCLSF2001 Basic scaffolding",
        publisher: "training.gov.au",
        type: "official",
        date: "Release 3 · current",
        url: "https://training.gov.au/training/details/CPCCLSF2001/qualdetails",
      },
      {
        label: "CPCCLSF3001 Intermediate scaffolding",
        publisher: "training.gov.au",
        type: "official",
        date: "Release 3 · current",
        url: "https://training.gov.au/Training/Details/cpcclsf3001/unitdetails",
      },
      {
        label: "CPCCLSF4001 Advanced scaffolding",
        publisher: "training.gov.au",
        type: "official",
        date: "Release 4 · current",
        url: "https://training.gov.au/training/details/CPCCLSF4001",
      },
      {
        label: "CPC30920 Certificate III in Scaffolding",
        publisher: "training.gov.au",
        type: "official",
        date: "Release 3 · current",
        url: "https://training.gov.au/Training/Details/CPC30920/qualdetails",
      },
      {
        label: "Scaffolders occupation profile",
        publisher: "Jobs and Skills Australia",
        type: "official",
        date: "Feb 2026 data release",
        url: "https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupations/821712-scaffolders",
      },
      {
        label: "2025 Occupation Shortage List",
        publisher: "Jobs and Skills Australia",
        type: "official",
        date: "2025 OSL · current official release",
        url: "https://www.jobsandskills.gov.au/data/occupation-shortage",
      },
      {
        label: "Advanced & Intermediate Scaffolders — shutdowns",
        publisher: "SRG Global / Bugarrba",
        type: "employer",
        date: "Jul 2026 ongoing",
        url: "https://careers.srgglobal.com.au/job/Advanced-Scaffolder/1361836766/",
      },
      {
        label: "Scaffolding Traineeship Program",
        publisher: "Caledonia Group",
        type: "employer",
        date: "accessed 16 Aug 2026",
        url: "https://caledoniagroup.com.au/careers/traineeship-program/",
      },
      {
        label: "Scaffolders — Intermediate & Advanced current FIFO rates",
        publisher: "SEEK / Linkforce",
        type: "market",
        date: "Jul–Aug 2026",
        url: "https://au.seek.com/Advanced-Scaffolder-fifo-jobs/in-All-Perth-WA",
      },
      {
        label: "Current FIFO scaffolding jobs and advertised rates",
        publisher: "SEEK",
        type: "market",
        date: "Jul–Aug 2026",
        url: "https://au.seek.com/fifo-scaffolding-jobs/in-Perth-WA-6000",
      },
      {
        label: "Basic scaffolding course market pricing",
        publisher: "Australian Training Management",
        type: "market",
        date: "accessed 16 Aug 2026",
        url: "https://www.australiantraining.com.au/courses/high-risk-work/scaffolding-basic-level",
      },
      {
        label: "Basic scaffolding course market pricing",
        publisher: "Paratus Training",
        type: "market",
        date: "accessed 16 Aug 2026",
        url: "https://www.paratus.edu.au/training/scaffolding-basic",
      },
    ],
  },
}
