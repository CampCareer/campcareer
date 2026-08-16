import { calculateFifoEntryScore, fifoEntryScoreBand, type EntryScoreComponents } from "./entry-score"
import type { FifoPath } from "./fifo-paths"

const RIGGER_COMPONENTS: EntryScoreComponents = {
  pay: 9,
  accessibility: 6,
  demand: 8,
  trainingBurden: 5.5,
}
const RIGGER_SCORE = calculateFifoEntryScore(RIGGER_COMPONENTS)

export const RIGGER_PATH: FifoPath = {
  slug: "rigger",
  name: "Rigger",
  status: "verified",
  pathType: { en: "Licensed lifting trade", ko: "면허 기반 lifting 직무" },
  summary: {
    en: "A high-paying FIFO construction and maintenance path with a genuine zero-experience traineeship route. The catch is that ordinary WA FIFO hiring is dominated by Intermediate and Advanced riggers with site experience, so buying one ticket is not the same as becoming FIFO-ready.",
    ko: "고소득 FIFO 건설·정비 경로이며 실제 무경력 traineeship 진입 사례가 있습니다. 다만 일반적인 WA FIFO 채용은 현장경력이 있는 Intermediate·Advanced Rigger 중심이어서 티켓 하나를 사는 것과 FIFO-ready가 되는 것은 다릅니다.",
  },
  researchNote: {
    en: "CampCareer separates the legal licence ladder from the hiring market. Dogging leads to Basic, then Intermediate and Advanced rigging. A current Monadelphous Heavy Lift traineeship shows a direct paid FIFO route to Certificate III and Intermediate Rigger, while mainstream FIFO vacancies still ask for RI/RA and prior site experience.",
    ko: "CampCareer는 법적 면허 단계와 실제 채용시장을 구분합니다. Dogging에서 Basic, Intermediate, Advanced Rigging으로 순차 진행합니다. 현재 Monadelphous Heavy Lift traineeship은 유급 FIFO 근무와 Certificate III, Intermediate Rigger까지 연결하지만 일반 FIFO 공고는 여전히 RI/RA와 기존 현장경력을 요구합니다.",
  },
  researchFocus: {
    en: [
      "DG → RB → RI → RA high-risk-work licence progression",
      "Structured traineeship entry versus experienced FIFO hiring",
      "Local, qualified FIFO, shutdown and high-end project pay",
      "Current WA hiring strength versus official shortage status",
    ],
    ko: [
      "DG → RB → RI → RA High Risk Work Licence 단계",
      "정식 traineeship 진입과 경력자 FIFO 채용의 차이",
      "로컬·자격 보유 FIFO·shutdown·고급 프로젝트 보수",
      "현재 WA 채용 강도와 공식 shortage 여부 구분",
    ],
  },
  published: {
    asOf: "16 Aug 2026",
    confidence: "High",
    pay: {
      display: "A$55–A$70/hr",
      score: RIGGER_COMPONENTS.pay,
      note: {
        en: "CampCareer does not invent a trainee rate because the current Monadelphous traineeship does not publish one. Current Perth local examples sit around A$40–A$46/hour before overtime and penalties, including Dogman/Rigger and Sarens roles. Qualified WA FIFO/project ads cluster around A$55–A$70/hour, while shutdown campaigns commonly advertise A$62–A$70/hour plus travel. Experienced Advanced Rigger 2:1 project arrangements can be much higher at roughly A$86.77–A$107.21/hour flat-rate equivalent; those high-end outliers are excluded from the normal comparison band.",
        ko: "현재 Monadelphous traineeship은 급여를 공개하지 않아 CampCareer가 trainee 시급을 임의로 만들지 않습니다. 현재 Perth 로컬 사례는 Dogman/Rigger와 Sarens 공고를 포함해 overtime·penalty 전 약 A$40–A$46/h 수준입니다. 자격 보유 WA FIFO·project 공고는 대체로 A$55–A$70/h, shutdown은 A$62–A$70/h + travel 사례가 반복됩니다. 경력 Advanced Rigger의 특정 2:1 프로젝트는 flat-rate equivalent가 약 A$86.77–A$107.21/h까지 올라가지만 이런 high-end outlier는 일반 비교 밴드에서 제외합니다.",
      },
    },
    accessibility: {
      score: RIGGER_COMPONENTS.accessibility,
      label: { en: "Real trainee route, selective market", ko: "실제 trainee 경로 · 일반 시장은 선별적" },
      note: {
        en: "Monadelphous advertised a 2026 Heavy Lift Rigging Traineeship specifically for people starting their construction career: an 18-month full-time FIFO pathway toward CPC30720 Certificate III in Rigging and Intermediate Rigger, with previous rigging experience not required in current job-board copies. That is a real zero-experience exception. Mainstream WA FIFO vacancies from MinRes, Linkforce and Techforce instead ask for RI/RA plus 12 months to 2+ years of rigging, mining or heavy-lift experience.",
        ko: "Monadelphous는 2026년 건설 커리어를 시작하는 사람을 위한 Heavy Lift Rigging Traineeship을 공고했습니다. 18개월 full-time FIFO 과정으로 CPC30720 Certificate III in Rigging과 Intermediate Rigger를 목표로 하며 최신 채용 사본에는 기존 rigging 경력이 필요하지 않다고 명시됩니다. 이는 실제 무경력 예외 경로입니다. 반면 MinRes, Linkforce, Techforce의 일반 WA FIFO 공고는 RI/RA와 12개월~2년 이상의 rigging·mining·heavy-lift 경력을 요구합니다.",
      },
    },
    demand: {
      score: RIGGER_COMPONENTS.demand,
      label: { en: "Strong WA FIFO hiring, not official shortage", ko: "WA FIFO 채용 강함 · 공식 shortage 아님" },
      note: {
        en: "Current WA hiring is broad: Mineral Resources is recruiting Intermediate/Advanced Riggers across Pilbara and Goldfields projects with 2+ years of future work planned; Linkforce reports an ongoing shutdown/project pipeline; and Techforce advertised 100+ Intermediate/Advanced shutdown roles. However, the 2025 Jobs and Skills Australia Occupation Shortage List rates Construction Rigger as No Shortage nationally and in WA. CampCareer therefore scores current FIFO hiring strength without calling the occupation an official shortage.",
        ko: "현재 WA 채용 폭은 넓습니다. Mineral Resources는 Pilbara·Goldfields 프로젝트에서 Intermediate/Advanced Rigger를 채용하며 2년 이상의 향후 작업을 명시하고, Linkforce는 지속적인 shutdown/project pipeline을, Techforce는 100명 이상의 Intermediate/Advanced shutdown 모집을 제시합니다. 다만 Jobs and Skills Australia 2025 OSL은 Construction Rigger를 전국 및 WA 모두 No Shortage로 분류합니다. 따라서 CampCareer는 현재 FIFO 채용 강도를 반영하되 공식 shortage라고 표현하지 않습니다.",
      },
    },
    trainingBurden: {
      score: RIGGER_COMPONENTS.trainingBurden,
      label: { en: "Short courses, four-step licence ladder", ko: "단기교육 · 4단계 면허 누적" },
      note: {
        en: "The national prerequisite chain is strict: CPCCLDG3001 Dogging → CPCCLRG3001 Basic → CPCCLRG3002 Intermediate → CPCCLRG4001 Advanced. Current Perth RTO examples price each stage at roughly A$1,200–A$1,300 including WorkSafe fees and about four training days, putting a self-funded DG-to-RI sequence around 12 course days and roughly A$3,700 before subsidies. RA adds another four days and about A$1,300. Employer traineeships can shift much of this burden into paid training.",
        ko: "국가 공인 선행체계는 명확합니다. CPCCLDG3001 Dogging → CPCCLRG3001 Basic → CPCCLRG3002 Intermediate → CPCCLRG4001 Advanced 순서입니다. 현재 Perth RTO 사례는 각 단계가 약 4일, WorkSafe fee 포함 약 A$1,200–A$1,300 수준이어서 DG부터 RI까지 자비로 진행하면 보조금 전 약 12일·A$3,700 정도입니다. RA는 약 4일·A$1,300이 추가됩니다. 고용주 traineeship이면 이 부담의 상당 부분을 유급훈련으로 전환할 수 있습니다.",
      },
    },
    requirements: {
      common: [
        { en: "High Risk Work Licence at the level required for the work; mainstream WA FIFO hiring is commonly RI or RA", ko: "작업 범위에 맞는 High Risk Work Licence. 일반 WA FIFO 채용은 흔히 RI 또는 RA 요구" },
        { en: "Working at Heights, Construction White Card and current driver's licence recur in major WA FIFO recruitment", ko: "주요 WA FIFO 채용에서 반복되는 Working at Heights, Construction White Card, 현재 운전면허" },
        { en: "Confined Space is common in maintenance/shutdown roles, with employer-specific recency windows", ko: "정비·shutdown 역할에서 흔한 Confined Space. 고용주별 유효기간 기준 적용" },
        { en: "Australian work rights plus ability to pass police, medical and drug/alcohol screening where required", ko: "호주 취업권리 및 필요 시 police, medical, drug/alcohol screening 통과 가능" },
        { en: "Standard FIFO vacancies commonly expect prior rigging, construction, heavy-lift or mining site experience", ko: "일반 FIFO 공고는 기존 rigging, construction, heavy-lift 또는 mining 현장경력을 흔히 요구" },
      ],
      training: [
        { en: "CPCCLDG3001 — Dogging (DG); first HRWL step before Basic Rigging", ko: "CPCCLDG3001 — Dogging(DG), Basic Rigging 이전 첫 HRWL 단계" },
        { en: "CPCCLRG3001 — Basic Rigging (RB); Dogging is prerequisite", ko: "CPCCLRG3001 — Basic Rigging(RB), Dogging 선행" },
        { en: "CPCCLRG3002 — Intermediate Rigging (RI); Basic Rigging is prerequisite", ko: "CPCCLRG3002 — Intermediate Rigging(RI), Basic Rigging 선행" },
        { en: "CPCCLRG4001 — Advanced Rigging (RA); Intermediate Rigging is prerequisite", ko: "CPCCLRG4001 — Advanced Rigging(RA), Intermediate Rigging 선행" },
        { en: "CPC30720 Certificate III in Rigging — current national qualification; core units include Dogging, Basic and Intermediate Rigging", ko: "CPC30720 Certificate III in Rigging — 현재 국가 공인 자격. core에 Dogging, Basic, Intermediate Rigging 포함" },
      ],
      notUniversal: [
        { en: "A DG or RB ticket alone is not a normal shortcut into FIFO Rigger work; current general-market hiring is weighted to RI/RA plus experience", ko: "DG 또는 RB 티켓 하나만으로 일반적인 FIFO Rigger 진입이 되는 것은 아닙니다. 현재 일반 시장은 RI/RA와 경력 중심입니다." },
        { en: "Do not buy RA first: the licence ladder is sequential and Advanced requires Intermediate", ko: "RA부터 바로 살 수 없습니다. 면허 단계는 순차적이며 Advanced는 Intermediate가 선행입니다." },
        { en: "A short course statement of attainment is not itself the HRWL; WorkSafe WA licensing and assessment requirements still apply", ko: "단기과정 Statement of Attainment 자체가 HRWL은 아닙니다. WorkSafe WA 면허 신청·평가 요건이 별도로 적용됩니다." },
        { en: "A VOC or client induction can be required by a site, but it does not replace the underlying HRWL", ko: "현장별 VOC나 client induction이 요구될 수 있지만 기본 HRWL을 대체하지 않습니다." },
      ],
    },
    score: {
      total: RIGGER_SCORE,
      band: fifoEntryScoreBand(RIGGER_SCORE),
      components: RIGGER_COMPONENTS,
    },
    sources: [
      {
        label: "High risk work licence classes — dogging and rigging",
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
        label: "High risk work licensing for dogging",
        publisher: "WorkSafe WA",
        type: "official",
        date: "accessed 16 Aug 2026",
        url: "https://www.worksafe.wa.gov.au/high-risk-work-licensing-dogging",
      },
      {
        label: "CPCCLDG3001 Licence to perform dogging",
        publisher: "training.gov.au",
        type: "official",
        date: "Release 3 · 24 Dec 2024",
        url: "https://training.gov.au/Training/Details/CPCCLDG3001",
      },
      {
        label: "CPCCLRG3001 Licence to perform rigging basic level",
        publisher: "training.gov.au",
        type: "official",
        date: "Release 3 · 24 Dec 2024",
        url: "https://training.gov.au/Training/Details/CPCCLRG3001",
      },
      {
        label: "CPCCLRG3002 Licence to perform rigging intermediate level",
        publisher: "training.gov.au",
        type: "official",
        date: "Release 3 · 24 Dec 2024",
        url: "https://training.gov.au/Training/Details/CPCCLRG3002",
      },
      {
        label: "CPCCLRG4001 Licence to perform rigging advanced level",
        publisher: "training.gov.au",
        type: "official",
        date: "Release 3 · 24 Dec 2024",
        url: "https://training.gov.au/Training/Details/CPCCLRG4001",
      },
      {
        label: "CPC30720 Certificate III in Rigging",
        publisher: "training.gov.au",
        type: "official",
        date: "Release 6 · current",
        url: "https://training.gov.au/training/details/CPC30720",
      },
      {
        label: "Construction Riggers occupation profile",
        publisher: "Jobs and Skills Australia",
        type: "official",
        date: "Feb 2026 data release",
        url: "https://www.jobsandskills.gov.au/data/occupation-and-industry-profiles/occupations/821711-construction-riggers",
      },
      {
        label: "2025 Occupation Shortage List — Construction Rigger: No Shortage",
        publisher: "Jobs and Skills Australia",
        type: "official",
        date: "2025 OSL",
        url: "https://www.jobsandskills.gov.au/data/occupation-shortage",
      },
      {
        label: "Rigging Pathway Program",
        publisher: "Monadelphous",
        type: "employer",
        date: "7 Aug 2025",
        url: "https://news.monadelphous.com.au/on-the-hook/rigging-pathway-program-redefines-industry-excellence",
      },
      {
        label: "Intermediate and Advanced Riggers — Pilbara and Goldfields",
        publisher: "Mineral Resources",
        type: "employer",
        date: "current Aug 2026",
        url: "https://careers.mineralresources.com.au/jobs/intermediate-and-advanced-riggers-kalgoorlie-wa-australia-pilbara",
      },
      {
        label: "Riggers — Intermediate & Advanced FIFO",
        publisher: "Linkforce",
        type: "employer",
        date: "current Aug 2026",
        url: "https://careers.linkforce.com.au/jobs/riggers-intermediate-advanced-fifo-perth-wa-australia-e671f5a7-70da-41a5-ade3-025c265452aa",
      },
      {
        label: "Advanced and Intermediate Riggers — August shutdown peak",
        publisher: "Techforce Personnel",
        type: "employer",
        date: "27 Jul 2026",
        url: "https://www.techforce.com.au/job-details/advanced-and-intermediate-riggers-august-peak-in-mining-oil-gas-utilities-jobs-1655695",
      },
      {
        label: "Rigging Traineeship — Heavy Lift",
        publisher: "Monadelphous listing copy / Indeed",
        type: "market",
        date: "8 Jul 2026",
        url: "https://au.indeed.com/viewjob?jk=a1d3b153c30b7621",
      },
      {
        label: "Current Perth local Rigger and Dogman/Rigger rates",
        publisher: "SEEK",
        type: "market",
        date: "Apr–Aug 2026",
        url: "https://www.seek.com.au/basic-rigger-jobs/in-South-Perth-WA-6151",
      },
      {
        label: "Current WA FIFO rigging pay and project advertisements",
        publisher: "SEEK",
        type: "market",
        date: "Jul–Aug 2026",
        url: "https://au.seek.com/rigging-fifo-jobs/in-All-Perth-WA",
      },
      {
        label: "Current Perth DG/RB/RI/RA course pricing and duration",
        publisher: "Skills Training & Engineering Services",
        type: "market",
        date: "accessed 16 Aug 2026",
        url: "https://stes.com.au/courses",
      },
    ],
  },
}
