"use client"

const STATS_EN = [
  { value: "10", label: "Career Categories" },
  { value: "20", label: "Countries" },
  { value: "3", label: "Goal Paths" },
  { value: "5", label: "Data Sources" },
] as const

const STATS_KO = [
  { value: "10", label: "전공 카테고리" },
  { value: "20", label: "지원 국가" },
  { value: "3", label: "목표 유형" },
  { value: "5", label: "데이터 소스" },
] as const

const STEPS_EN = [
  { num: 1, title: "Choose your major", desc: "Pick a career category that matches your interest" },
  { num: 2, title: "Set your goals", desc: "Select salary, immigration, or budget priorities" },
  { num: 3, title: "Get your match", desc: "See ranked countries with salary, policy & risk data" },
] as const

const STEPS_KO = [
  { num: 1, title: "전공 선택", desc: "관심 있는 전공 카테고리를 선택하세요" },
  { num: 2, title: "목표 설정", desc: "임금, 이민, 예산 목표를 설정하세요" },
  { num: 3, title: "맞춤 경로 확인", desc: "임금·정책·리스크 데이터와 함께 추천 국가를 확인하세요" },
] as const

const WHY_EN = [
  { icon: "📊", title: "Verified data", desc: "Salary, employment & visa data from government & university sources" },
  { icon: "🔍", title: "Explainable rules", desc: "Every recommendation shows the \"why\" behind it" },
  { icon: "⚖️", title: "Fair comparison", desc: "Compare countries side-by-side on the metrics that matter" },
] as const

const WHY_KO = [
  { icon: "📊", title: "검증된 데이터", desc: "정부·대학교 데이터베이스에서 검증된 임금·고용·비자 정보" },
  { icon: "🔍", title: "설명 가능한 추천", desc: "모든 추천에 근거를 투명하게 공개합니다" },
  { icon: "⚖️", title: "공정한 비교", desc: "중요한 지표를 기준으로 국가를 나란히 비교할 수 있습니다" },
] as const

export function HomeStatsSection({ isKo }: { isKo: boolean }) {
  const stats = isKo ? STATS_KO : STATS_EN
  return (
    <section className="bg-white border-b border-slate-100">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-slate-100 bg-slate-50 p-5 text-center">
              <p className="text-2xl font-semibold text-slate-950">{s.value}</p>
              <p className="mt-1 text-xs text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function HomeHowItWorksSection({ isKo }: { isKo: boolean }) {
  const steps = isKo ? STEPS_KO : STEPS_EN
  return (
    <section className="bg-white border-t border-slate-100">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-slate-500">{isKo ? "이용 방법" : "HOW IT WORKS"}</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">{isKo ? "3단계로 완성" : "3 simple steps"}</h2>
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {steps.map((s) => (
            <div key={s.num}>
              <span className="flex size-10 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">{s.num}</span>
              <h3 className="mt-3 text-sm font-semibold text-slate-950">{s.title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-slate-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function HomeWhySection({ isKo }: { isKo: boolean }) {
  const items = isKo ? WHY_KO : WHY_EN
  return (
    <section className="bg-slate-50 border-t border-slate-100">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-slate-500">{isKo ? "왜 CampCareer인가" : "WHY CAMPCAREER"}</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">{isKo ? "신뢰할 수 있는 데이터" : "Data you can trust"}</h2>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {items.map((item) => (
            <div key={item.title} className="rounded-xl border border-slate-200 bg-white p-6">
              <span className="flex size-10 items-center justify-center rounded-lg bg-blue-50 text-lg">{item.icon}</span>
              <h3 className="mt-3 text-sm font-semibold text-slate-950">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-6 text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
