export type RouteLocale = "en" | "ko"

export type LocalizedText = Record<RouteLocale, string>

type RouteSource = {
  name: string
  url: string
  checkedAt: string
}

export type RouteGuide = {
  origin: { code: string; slug: string; name: LocalizedText }
  destination: { code: string; slug: string; name: LocalizedText }
  slug: string
  target: LocalizedText
  title: LocalizedText
  summary: LocalizedText
  lastVerified: string
  visa: {
    name: string
    summary: LocalizedText
    eligibility: LocalizedText[]
    workConditions: LocalizedText[]
    source: RouteSource
  }
  preparation: Array<{
    title: LocalizedText
    detail: LocalizedText
    source?: RouteSource
  }>
  jobs: Array<{
    label: LocalizedText
    detail: LocalizedText
    url: string
  }>
  courses: Array<{
    label: LocalizedText
    detail: LocalizedText
    url: string
  }>
  map: {
    label: LocalizedText
    detail: LocalizedText
    href: string
  }
  sources: RouteSource[]
}

const homeAffairsOverview: RouteSource = {
  name: "Australian Department of Home Affairs - Working Holiday Maker program",
  url: "https://immi.homeaffairs.gov.au/what-we-do/whm-program/overview",
  checkedAt: "2026-07-29",
}

const homeAffairsConditions: RouteSource = {
  name: "Australian Department of Home Affairs - Working Holiday Maker work conditions",
  url: "https://immi.homeaffairs.gov.au/what-we-do/whm-program/specified-work-conditions",
  checkedAt: "2026-07-29",
}

const homeAffairsKoreaUpdate: RouteSource = {
  name: "Australian Department of Home Affairs - WHM latest news",
  url: "https://immi.homeaffairs.gov.au/what-we-do/whm-program/latest-news",
  checkedAt: "2026-07-29",
}

const homeAffairsSpecified417: RouteSource = {
  name: "Australian Department of Home Affairs - Specified work for subclass 417",
  url: "https://immi.homeaffairs.gov.au/what-we-do/whm-program/specified-work-conditions/specified-work-417",
  checkedAt: "2026-07-29",
}

export const ROUTE_GUIDES: readonly RouteGuide[] = [
  {
    origin: {
      code: "KR",
      slug: "south-korea",
      name: { en: "South Korea", ko: "대한민국" },
    },
    destination: {
      code: "AU",
      slug: "australia",
      name: { en: "Australia", ko: "호주" },
    },
    slug: "mining-work",
    target: { en: "Mining work", ko: "광업 취업" },
    title: {
      en: "How a Korean passport holder can pursue mining work in Australia",
      ko: "한국 여권자가 호주 광업 취업을 준비하는 경로",
    },
    summary: {
      en: "A practical first route is the Working Holiday visa (subclass 417), then a search focused on Western Australia mining roles. This guide separates visa rules from employer and site requirements.",
      ko: "현실적인 첫 경로는 워킹홀리데이 비자(417)로 입국한 뒤 서호주 광업 직무를 중심으로 구직하는 것입니다. 이 가이드는 비자 규정과 고용주·현장 요건을 분리해 보여줍니다.",
    },
    lastVerified: "2026-07-29",
    visa: {
      name: "Working Holiday visa (subclass 417)",
      summary: {
        en: "From 1 July 2026, Republic of Korea passport holders aged 18 to 35 inclusive can apply for this visa. It is assessed individually; confirm the current visa listing before applying.",
        ko: "2026년 7월 1일부터 대한민국 여권 소지자는 만 18세부터 35세까지 이 비자를 신청할 수 있습니다. 개별 심사이므로 신청 전 현재 비자 안내를 반드시 확인해야 합니다.",
      },
      eligibility: [
        {
          en: "Hold a Republic of Korea passport and be within the published 18 to 35 inclusive age range.",
          ko: "대한민국 여권을 소지하고 공개된 만 18세부터 35세까지의 연령 요건 안에 있어야 합니다.",
        },
        {
          en: "Apply through the official visa process and wait for written grant confirmation before booking travel.",
          ko: "공식 비자 절차로 신청하고, 여행을 예약하기 전 서면 비자 승인 통지를 기다려야 합니다.",
        },
      ],
      workConditions: [
        {
          en: "The WHM program allows a 12-month holiday with short-term work and study.",
          ko: "WHM 프로그램은 12개월 체류 중 단기 취업과 학업을 허용합니다.",
        },
        {
          en: "You can work in any occupation or industry, but condition 8547 generally limits work with one employer to 6 months unless an exemption or written permission applies.",
          ko: "어떤 직종·산업에서도 일할 수 있지만, 조건 8547에 따라 면제 또는 서면 허가가 없는 한 동일 고용주 근무는 일반적으로 최대 6개월입니다.",
        },
        {
          en: "Study or training is generally limited to 4 months on each WHM visa.",
          ko: "학업 또는 훈련은 WHM 비자 1회당 일반적으로 최대 4개월입니다.",
        },
        {
          en: "Mining may support a later second or third WHM visa only when the role, location, dates, and records meet the current specified-work rules. Do not rely on a job title alone.",
          ko: "광업은 직무·지역·근무 기간·증빙이 현재의 지정근무 규정을 충족할 때만 이후 두 번째 또는 세 번째 WHM 비자에 도움이 될 수 있습니다. 직함만으로 판단하면 안 됩니다.",
        },
      ],
      source: homeAffairsKoreaUpdate,
    },
    preparation: [
      {
        title: { en: "Confirm the visa before spending on travel", ko: "여행 비용을 쓰기 전 비자부터 확인" },
        detail: {
          en: "Use Home Affairs, apply through ImmiAccount, and wait for the written grant. CampCareer does not decide visa eligibility or grant outcomes.",
          ko: "Home Affairs와 ImmiAccount를 통해 신청하고 서면 승인 통지를 기다리세요. CampCareer는 비자 자격이나 승인 결과를 판정하지 않습니다.",
        },
        source: homeAffairsKoreaUpdate,
      },
      {
        title: { en: "Read the employer limit before accepting a roster", ko: "근무 로스터를 수락하기 전 고용주 제한 확인" },
        detail: {
          en: "A long FIFO assignment can run into the 6-month same-employer condition. Check the current exemptions or request process before extending work.",
          ko: "장기 FIFO 배정은 동일 고용주 6개월 조건에 닿을 수 있습니다. 연장 근무 전 현재 면제 조건 또는 허가 절차를 확인하세요.",
        },
        source: homeAffairsConditions,
      },
      {
        title: { en: "Use each job listing as the source of site requirements", ko: "각 구인 공고를 현장 요건의 기준으로 사용" },
        detail: {
          en: "Mining roles differ by state, site, equipment, and employer. Ask the recruiter or operator which induction, medical, licence, and safety evidence applies before paying for training.",
          ko: "광업 직무의 요건은 주, 현장, 장비, 고용주에 따라 다릅니다. 교육비를 내기 전에 채용 담당자 또는 운영사에 필요한 교육, 건강검진, 면허, 안전 증빙을 확인하세요.",
        },
      },
      {
        title: { en: "Keep specified-work evidence from day one", ko: "지정근무 증빙을 첫날부터 보관" },
        detail: {
          en: "If a later WHM visa matters to you, read the official specified-work guidance before accepting the role and retain the records it requires.",
          ko: "추후 WHM 비자가 중요하다면 채용 수락 전에 공식 지정근무 안내를 읽고, 요구되는 증빙을 보관하세요.",
        },
        source: homeAffairsSpecified417,
      },
    ],
    jobs: [
      {
        label: { en: "SEEK: mining jobs in Western Australia", ko: "SEEK: 서호주 광업 채용" },
        detail: { en: "Live mining, resources, and energy listings across Western Australia.", ko: "서호주 전역의 광업·자원·에너지 실시간 채용 공고입니다." },
        url: "https://www.seek.com.au/mining-jobs/in-Western-Australia-WA",
      },
      {
        label: { en: "SEEK: entry-level mining jobs in Western Australia", ko: "SEEK: 서호주 신입·초급 광업 채용" },
        detail: { en: "Use this narrower search to inspect entry-level wording and employer requirements.", ko: "신입·초급 직무의 표현과 고용주 요건을 확인하기 위한 더 좁은 검색입니다." },
        url: "https://www.seek.com.au/entry-level-mining-jobs/in-Western-Australia-WA",
      },
      {
        label: { en: "Workforce Australia job search", ko: "Workforce Australia 구직 검색" },
        detail: { en: "Australian Government job search. Filter by mining terms and your intended region.", ko: "호주 정부 구직 검색입니다. 광업 키워드와 희망 지역으로 필터링하세요." },
        url: "https://www.workforceaustralia.gov.au/individuals/jobs/search",
      },
    ],
    courses: [
      {
        label: { en: "RII20120 Certificate II in Resources and Infrastructure Work Preparation", ko: "RII20120 자원·인프라 업무 준비 Certificate II" },
        detail: { en: "A national training package qualification to research with an RTO. It is not a universal mining-entry requirement; confirm the role first.", ko: "RTO와 함께 검토할 수 있는 국가 훈련패키지 자격입니다. 모든 광업 입직의 공통 요건은 아니므로 먼저 직무 요건을 확인하세요." },
        url: "https://training.gov.au/training/details/RII20120/qualdetails",
      },
    ],
    map: {
      label: { en: "Explore Western Australia mining regions", ko: "서호주 광업 지역 탐색" },
      detail: { en: "Open the map to compare regions and inspect the existing mining-employer layer.", ko: "지도에서 지역을 비교하고 기존 광산 고용주 레이어를 살펴보세요." },
      href: "/maps?country=au&state=WA",
    },
    sources: [homeAffairsKoreaUpdate, homeAffairsOverview, homeAffairsConditions, homeAffairsSpecified417],
  },
] as const

export function routeGuideHref(guide: Pick<RouteGuide, "origin" | "destination" | "slug">) {
  return `/routes/${guide.origin.slug}/${guide.destination.slug}/${guide.slug}`
}

export function getRouteGuide(origin: string, destination: string, slug: string) {
  return ROUTE_GUIDES.find(
    (guide) =>
      guide.origin.slug === origin.toLowerCase() &&
      guide.destination.slug === destination.toLowerCase() &&
      guide.slug === slug.toLowerCase(),
  ) ?? null
}
