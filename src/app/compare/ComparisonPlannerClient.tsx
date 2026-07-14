"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ArrowRight, Check, CircleAlert, ExternalLink, Landmark, MapPinned, ShieldCheck, WalletCards } from "lucide-react"
import { LAUNCH_COUNTRIES } from "@/data/launch-countries"
import {
  getDecisionCareers,
  type PublicComparisonResponse,
} from "@/lib/comparison/public-contract"
import { localeFromPathname, localizePath, type LocaleOption } from "@/lib/i18n/config"
import { useLocale } from "@/lib/i18n/locale-provider"
import { track } from "@/lib/analytics"

const DEFAULT_COUNTRIES = ["AU", "CA", "US", "UK"]

const COPY = {
  en: {
    eyebrow: "Career-first comparison",
    title: "Plan the study decision behind your next move.",
    subtitle: "Start with the work you want to do. CampCareer only publishes a financial or immigration result when the exact career-country evidence is current.",
    career: "What career are you planning for?",
    countries: "Compare up to four destinations",
    origin: "Current country or citizenship (optional)",
    originPlaceholder: "e.g. KR",
    city: "Destination city (optional)",
    cityPlaceholder: "e.g. Dublin",
    currency: "Display currency",
    refine: "Refine study budget and housing",
    degreeYears: "Degree length (years)",
    annualTuition: "Annual tuition (optional)",
    studentHousing: "Student housing",
    graduateHousing: "After-graduation housing",
    shared: "Shared housing",
    studio: "Studio",
    oneBedroom: "One-bedroom",
    outerOneBedroom: "One-bedroom outside city centre",
    cityOneBedroom: "One-bedroom in city centre",
    availability: "What will appear when this comparison is published",
    financial: "After-tax money",
    financialBody: "Gross pay, tax and social contributions, rent, essential costs, annual disposable income, first-year budget, and payback.",
    immigration: "Work and immigration pathway",
    immigrationBody: "Eligibility status, post-study work, occupation match, salary threshold, licensing, language requirements, and policy date.",
    evidence: "Source trail",
    evidenceBody: "Every number carries its publisher, source URL, applicable date, review date, and methodology version.",
    noData: "Not published yet",
    noDataBody: "We need an exact occupation crosswalk and current salary, tax, housing, tuition, and pathway evidence before showing a result. We will not substitute a broad major score or a zero-tax estimate.",
    map: "Explore this destination on Maps",
    mapAvailable: "Map data is available for exploration.",
    methodology: "Read the methodology",
    assumptions: "Default scenario: single filer, no dependants, full-year tax resident. Student housing uses shared housing; graduate housing uses a one-bedroom outside the city centre.",
    ready: "Checking evidence",
    grossSalary: "Gross salary",
    takeHome: "Take-home after tax",
    rentEssentials: "Rent + essential costs",
    firstYearCash: "First-year cash budget",
    immigrationStatus: "Immigration status",
  },
  ko: {
    eyebrow: "직업 중심 비교",
    title: "다음 이동을 위한 유학 결정을 설계하세요.",
    subtitle: "원하는 직업부터 시작하세요. CampCareer는 해당 직업과 국가의 근거가 최신·정확할 때만 금액과 이민 결과를 공개합니다.",
    career: "어떤 직업을 목표로 하나요?",
    countries: "최대 4개 목적지 비교",
    origin: "현재 거주국 또는 시민권 (선택)",
    originPlaceholder: "예: KR",
    city: "희망 도시 (선택)",
    cityPlaceholder: "예: Dublin",
    currency: "표시 통화",
    refine: "학비·주거 조건 조정",
    degreeYears: "학위 기간 (년)",
    annualTuition: "연간 학비 (선택)",
    studentHousing: "학생 주거 형태",
    graduateHousing: "졸업 후 주거 형태",
    shared: "공유 주거",
    studio: "스튜디오",
    oneBedroom: "1-bedroom",
    outerOneBedroom: "도심 외곽 1-bedroom",
    cityOneBedroom: "도심 1-bedroom",
    availability: "이 비교가 공개되면 제공되는 내용",
    financial: "세후 실제 금액",
    financialBody: "연봉, 세금·사회보험, 월세, 필수 생활비, 연간 가처분액, 첫해 예산, 투자 회수기간.",
    immigration: "취업·이민 경로",
    immigrationBody: "가능 상태, 졸업 후 체류, 직업 매칭, 급여 기준, 면허·언어 조건, 정책 기준일.",
    evidence: "근거 추적",
    evidenceBody: "모든 수치에 발행기관, 원문 URL, 적용일, 검토일, 방법론 버전이 붙습니다.",
    noData: "아직 공개되지 않았습니다",
    noDataBody: "정확한 직업 코드, 최신 급여·세금·주거·학비·경로 근거가 모두 필요합니다. 넓은 전공 점수나 세금 0원 추정으로 대신하지 않습니다.",
    map: "Maps에서 목적지 탐색",
    mapAvailable: "지도 데이터로 목적지를 탐색할 수 있습니다.",
    methodology: "방법론 보기",
    assumptions: "기본 시나리오: 독신·부양가족 없음·해당국 연중 세금 거주자. 학생은 공유 주거, 졸업 후에는 도심 외곽 1-bedroom을 기본값으로 둡니다.",
    ready: "근거 확인 중",
    grossSalary: "세전 연봉",
    takeHome: "세후 실수령액",
    rentEssentials: "월세 + 필수 생활비",
    firstYearCash: "첫해 필요 현금",
    immigrationStatus: "이민 가능 상태",
  },
} as const

type Copy = { [K in keyof typeof COPY.en]: string }

function localeCopy(locale: string) {
  return locale === "ko" ? COPY.ko : COPY.en
}

export default function ComparisonPlannerClient() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  // Reserved locale prefixes keep future launches URL-stable. They are
  // noindexed and not shown in the language picker until their catalogue has
  // passed human review, but a direct link still preserves its own prefix.
  const pathLocale = localeFromPathname(pathname) ?? locale
  const t = localeCopy(locale)
  const careers = useMemo(() => getDecisionCareers(), [])
  const [career, setCareer] = useState(searchParams.get("career") ?? "software-developer")
  const [countries, setCountries] = useState<string[]>(() => {
    const requested = searchParams.get("countries")?.split(",").map((value) => value.toUpperCase()).filter(Boolean)
    return requested?.length ? requested.slice(0, 4) : DEFAULT_COUNTRIES
  })
  const [origin, setOrigin] = useState(searchParams.get("origin") ?? "")
  const [city, setCity] = useState(searchParams.get("city") ?? "")
  const [currency, setCurrency] = useState(searchParams.get("currency") ?? "USD")
  const [degreeYears, setDegreeYears] = useState(searchParams.get("degreeYears") ?? "2")
  const [annualTuition, setAnnualTuition] = useState(searchParams.get("annualTuition") ?? "")
  const [studentHousing, setStudentHousing] = useState(searchParams.get("studentHousing") ?? "shared")
  const [graduateHousing, setGraduateHousing] = useState(searchParams.get("graduateHousing") ?? "outer_one_bedroom")
  const [result, setResult] = useState<PublicComparisonResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const params = new URLSearchParams({ career, countries: countries.join(","), currency })
    if (origin.trim()) params.set("origin", origin.trim().toUpperCase())
    if (city.trim()) params.set("city", city.trim().slice(0, 100))
    if (degreeYears) params.set("degreeYears", degreeYears)
    if (annualTuition) params.set("annualTuition", annualTuition)
    if (studentHousing !== "shared") params.set("studentHousing", studentHousing)
    if (graduateHousing !== "outer_one_bedroom") params.set("graduateHousing", graduateHousing)
    const comparisonHref = `${localizePath("/compare", pathLocale)}?${params.toString()}`
    router.replace(comparisonHref, { scroll: false })
    setLoading(true)
    setError(null)
    fetch(`/api/v1/compare?${params.toString()}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error((await response.json().catch(() => null))?.error ?? "Unable to build this comparison")
        return response.json() as Promise<PublicComparisonResponse>
      })
      .then((data) => {
        setResult(data)
        track("comparison_personalized", { career: data.data.career.id, country_count: data.data.comparisons.length })
      })
      .catch((cause: unknown) => {
        if (cause instanceof DOMException && cause.name === "AbortError") return
        setError(cause instanceof Error ? cause.message : "Unable to build this comparison")
        setResult(null)
      })
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [annualTuition, career, city, countries, currency, degreeYears, graduateHousing, origin, pathLocale, router, studentHousing])

  const toggleCountry = (code: string) => {
    setCountries((current) => {
      if (current.includes(code)) return current.filter((item) => item !== code)
      return current.length < 4 ? [...current, code] : current
    })
  }

  return (
    <div className="bg-background">
      <section className="border-b border-slate-200 bg-gradient-to-b from-blue-50/70 to-background">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">{t.eyebrow}</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{t.title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">{t.subtitle}</p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)_150px]">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-800">{t.career}</span>
              <select value={career} onChange={(event) => setCareer(event.target.value)} className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500">
                {careers.map((item) => <option key={item.id} value={item.id}>{locale === "ko" ? item.labelKo : item.label}</option>)}
              </select>
            </label>
            <fieldset>
              <legend className="mb-2 block text-sm font-semibold text-slate-800">{t.countries}</legend>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
                {LAUNCH_COUNTRIES.map((country) => {
                  const selected = countries.includes(country.code)
                  const disabled = !selected && countries.length >= 4
                  return (
                    <button key={country.code} type="button" disabled={disabled} onClick={() => toggleCountry(country.code)} className={`flex min-h-10 items-center justify-between rounded-lg border px-3 text-left text-xs font-medium transition ${selected ? "border-blue-500 bg-blue-50 text-blue-800" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"} disabled:cursor-not-allowed disabled:opacity-45`}>
                      <span>{country.name}</span>{selected && <Check className="h-3.5 w-3.5" />}
                    </button>
                  )
                })}
              </div>
            </fieldset>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
              <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-800">{t.origin}</span><input value={origin} onChange={(event) => setOrigin(event.target.value.toUpperCase().slice(0, 2))} placeholder={t.originPlaceholder} className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm uppercase text-slate-900 outline-none focus:ring-2 focus:ring-blue-500" /></label>
              <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-800">{t.currency}</span><select value={currency} onChange={(event) => setCurrency(event.target.value)} className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"><option>USD</option><option>EUR</option><option>GBP</option><option>AUD</option><option>CAD</option></select></label>
            </div>
          </div>
          <details className="mt-5 rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 open:bg-white">
            <summary className="cursor-pointer text-sm font-semibold text-slate-700 marker:text-slate-400">{t.refine}</summary>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">{t.city}</span><input value={city} onChange={(event) => setCity(event.target.value.slice(0, 100))} placeholder={t.cityPlaceholder} className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500" /></label>
              <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">{t.degreeYears}</span><input value={degreeYears} onChange={(event) => setDegreeYears(event.target.value)} type="number" min="1" max="8" step="0.5" inputMode="decimal" className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500" /></label>
              <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">{t.annualTuition}</span><input value={annualTuition} onChange={(event) => setAnnualTuition(event.target.value.replace(/[^0-9]/g, "").slice(0, 7))} inputMode="numeric" placeholder="20,000" className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500" /></label>
              <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">{t.studentHousing}</span><select value={studentHousing} onChange={(event) => setStudentHousing(event.target.value)} className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"><option value="shared">{t.shared}</option><option value="studio">{t.studio}</option><option value="one_bedroom">{t.oneBedroom}</option></select></label>
              <label className="block"><span className="mb-2 block text-sm font-medium text-slate-700">{t.graduateHousing}</span><select value={graduateHousing} onChange={(event) => setGraduateHousing(event.target.value)} className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-500"><option value="outer_one_bedroom">{t.outerOneBedroom}</option><option value="shared">{t.shared}</option><option value="city_one_bedroom">{t.cityOneBedroom}</option></select></label>
            </div>
          </details>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-xl font-semibold tracking-tight text-slate-950">{t.availability}</h2><p className="mt-1 text-sm text-slate-500">{t.assumptions}</p></div><Link href={localizePath("/methodology", pathLocale)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:underline">{t.methodology}<ArrowRight className="h-4 w-4" /></Link></div>
          {error && <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{error}</p>}
          {loading ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{countries.map((code) => <div key={code} className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-slate-50" />)}</div> : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {result?.data.comparisons.map((comparison) => <ComparisonCard key={comparison.country.code} comparison={comparison} copy={t} locale={pathLocale} />)}
            </div>
          )}
        </section>

        <section className="mt-10 grid gap-4 lg:grid-cols-3">
          <InfoCard icon={WalletCards} title={t.financial} body={t.financialBody} />
          <InfoCard icon={ShieldCheck} title={t.immigration} body={t.immigrationBody} />
          <InfoCard icon={Landmark} title={t.evidence} body={t.evidenceBody} />
        </section>
      </main>
    </div>
  )
}

function ComparisonCard({ comparison, copy, locale }: { comparison: PublicComparisonResponse["data"]["comparisons"][number]; copy: Copy; locale: LocaleOption }) {
  const mapHref = `${localizePath("/maps", locale)}?country=${comparison.country.code.toLowerCase()}`
  return (
    <article className="flex min-h-80 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">{comparison.country.code}</p><h3 className="mt-1 text-xl font-semibold text-slate-950">{comparison.country.name}</h3></div><span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800">{copy.ready}</span></div>
      <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50/70 p-3"><div className="flex gap-2"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" /><div><p className="text-sm font-semibold text-amber-950">{copy.noData}</p><p className="mt-1 text-xs leading-5 text-amber-800">{copy.noDataBody}</p></div></div></div>
      <dl className="mt-5 space-y-3 text-sm"><Metric label={copy.grossSalary} /><Metric label={copy.takeHome} /><Metric label={copy.rentEssentials} /><Metric label={copy.firstYearCash} /><Metric label={copy.immigrationStatus} /></dl>
      <Link href={mapHref} className="mt-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800">{copy.map}<MapPinned className="h-4 w-4" /></Link>
      {comparison.country.mapReady && <p className="mt-3 inline-flex items-center gap-1 text-[11px] text-slate-400"><ExternalLink className="h-3 w-3" /> {comparison.country.name}: {copy.mapAvailable}</p>}
    </article>
  )
}

function Metric({ label }: { label: string }) {
  return <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2"><dt className="text-slate-500">{label}</dt><dd className="font-medium text-slate-400">—</dd></div>
}

function InfoCard({ icon: Icon, title, body }: { icon: typeof WalletCards; title: string; body: string }) {
  return <article className="rounded-2xl border border-slate-200 bg-white p-5"><Icon className="h-5 w-5 text-blue-700" /><h2 className="mt-4 text-base font-semibold text-slate-950">{title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{body}</p></article>
}
