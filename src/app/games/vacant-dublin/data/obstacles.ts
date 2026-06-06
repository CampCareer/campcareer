export type ObstacleType = "cost" | "flat" | "perUnit"

export interface Obstacle {
  emoji: string
  title: string
  desc: string
  impact: string
  type: ObstacleType
  pct?: number
  flat?: number
  perUnit?: number
}

export const OBSTACLES: { normal: Obstacle[]; hard: Obstacle[] } = {
  normal: [
    { emoji: "💶", title: "LAND PURCHASE TAX",    desc: "Stamp duty on commercial land purchase applies. The Revenue Commissioners want their cut.",              impact: "+ €{val} added to costs (7.5% stamp duty)",              type: "cost",    pct: 0.075 },
    { emoji: "📋", title: "PLANNING PERMISSION",  desc: "An Bord Pleanála requires a full planning application. Neighbours have been notified.",                  impact: "⏳ 6-month delay. Build cost up 8%.",                     type: "cost",    pct: 0.08  },
    { emoji: "🏗",  title: "VAT ON CONSTRUCTION", desc: "Irish VAT at 13.5% applies to all construction work. One of the highest in Europe.",                    impact: "+ €{val} VAT added to build cost",                       type: "cost",    pct: 0.135 },
    { emoji: "💰", title: "DEVELOPMENT LEVY",     desc: "Dublin City Council charges a development contribution levy for new builds.",                            impact: "+ €12,000 per unit in levies",                           type: "perUnit", perUnit: 12000 },
    { emoji: "📐", title: "FIRE SAFETY CERT",     desc: "A Fire Safety Certificate from the Building Control Authority is required.",                             impact: "⏳ 2-month delay. €45,000 compliance cost.",              type: "flat",    flat: 45000 },
    { emoji: "🌊", title: "ENVIRONMENTAL SCREENING", desc: "Your site may be near a flood zone. An EIA is required.",                                            impact: "+ €65,000 EIA cost. 3-month delay.",                     type: "flat",    flat: 65000 },
  ],
  hard: [
    { emoji: "🪧", title: "NIMBY 주민 반대!",       desc: "주민 47명이 민원을 제기했습니다. '동네 분위기가 바뀐다'는 이유입니다. 공청회가 열립니다.",            impact: "⏳ 계획 지연 12개월. 법률 비용 €120,000.",                type: "flat",    flat: 120000 },
    { emoji: "⚒",  title: "UNION ACTION",           desc: "The Building Workers' Union has called a work-to-rule after a pay dispute. Progress halved.",          impact: "⏳ 4-month delay. Build cost up 15%.",                   type: "cost",    pct: 0.15  },
    { emoji: "🏛",  title: "PROTECTED STRUCTURE",   desc: "An architectural historian has flagged a Victorian wall on-site. Conservation order applied.",          impact: "⏳ 8-month hold. Redesign costs €200,000.",               type: "flat",    flat: 200000 },
    { emoji: "📁", title: "행정 적체",               desc: "An Bord Pleanála가 업무 과부하 상태입니다. 담당자가 병가 중입니다.",                                  impact: "⏳ 18개월 지연. 비용 22% 증가.",                          type: "cost",    pct: 0.22  },
    { emoji: "💸", title: "INTEREST RATE SPIKE",    desc: "ECB가 금리를 또 올렸습니다. 건설 대출 이자가 급증했어요.",                                            impact: "+ 총 금융 비용의 20% 추가.",                             type: "cost",    pct: 0.20  },
    { emoji: "🏗",  title: "시공사 부도",             desc: "주요 시공사가 파산했습니다. 재입찰을 진행해야 합니다.",                                              impact: "⏳ 6개월 지연. €180,000 재입찰 비용.",                    type: "flat",    flat: 180000 },
    { emoji: "🪨", title: "ARCHAEOLOGICAL FIND",    desc: "바이킹 시대 유물이 발견되었습니다. 국립박물관에 신고가 접수되었습니다.",                              impact: "⏳ 12개월 발굴 중단. €90,000 비용.",                      type: "flat",    flat: 90000 },
    { emoji: "🧾", title: "부동산 횡재세",           desc: "정부가 새로운 주거용 토지세를 도입했습니다.",                                                       impact: "+ €50,000/년 유휴지 세금.",                              type: "flat",    flat: 50000 },
  ],
}

export const UNCLE_LINES = {
  idle: [
    "더블린 집값 왜 이렇게 비싸? 빈 땅은 넘쳐나는데! 빨리 짓자고!",
    "아일랜드 정부는 뭐 하는 거야... 한국 같았으면 벌써 올라갔어!",
    "닌비(NIMBY)들 때문에 더블린 집값이 안 내려가는 거야. 무서운 현실이지.",
    "{name}! 월 200만원 낸다고? 내가 직접 지어줘야겠어!",
    "핀 클릭해서 빈 땅 골라봐! 아무 데나 짓는 게 방치보다 낫거든!",
  ],
  select: {
    Council: "공공 용지야! 세금으로 사놓고 {years}년 동안 방치?! 말이 돼? 어서 개발하자!",
    Vacant:  "{years}년째 빈 땅... 투기 목적으로 들고 있는 거 아냐. 이런 거 짓는 게 정답이야!",
    Derelict:"폐건물이네. 철거하고 새로 지으면 딱이야. 이런 게 제일 재미있어!",
  },
  highROI: ["이야~ ROI {roi}%! 역시 내 조카야! 잘 가르쳤다!", "완벽해! {roi}% 수익률이면 {name} 학비도 나오겠는데?"],
  lowROI:  ["ROI가 좀 낮네... 층수 더 올리거나 시장가 비율 늘려봐!", "이 사이트는 층수를 높여야 수익이 나. 15층 이상 도전해봐!"],
  nimby:   ["또 님비야?! '내 집값은 올라야 하는데 새 집은 짓지 마!' 이게 무슨 논리야!", "이래서 더블린 집값이 10년째 오르는 거지. 그냥 밀어!"],
  complete:["완성! {units}채 건설 성공! {name} 친구들도 이제 살 데 생겼네!", "잘했어! 하나하나 지어나가면 더블린 집값 잡을 수 있어!"],
  budget:  "예산이 모자라! 모듈러 공법이나 층수 낮춰서 비용 줄여봐!",
}
