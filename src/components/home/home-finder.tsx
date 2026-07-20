"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Clock3, Eye, Heart, X } from "lucide-react"
import { LAUNCH_COUNTRIES, type LaunchCountry } from "@/data/launch-countries"
import { STUDY_CATEGORIES } from "@/data/study-concepts"
import { LANDING_GOALS, type LandingGoalId } from "@/lib/discovery/landing-discovery"
import { localizePath } from "@/lib/i18n/config"
import { recordDiscoveryEvent } from "@/lib/analytics"
import { IconPicker, type PickerOption, countryFlag } from "@/components/ui/icon-picker"
import { getStudyCategoryVisual } from "@/components/ui/au-career-category-visuals"
import { isPublicProductCountry } from "@/lib/product-scope"
import { HomeStatsSection, HomeHowItWorksSection, HomeWhySection } from "./home-landing-sections"

type Locale = "en" | "ko-KR"

const COPY = {
  en: {
    headline: "Best option for you in Australia",
    country: "Where",
    major: "Major",
    goal: "Goal",
    australiaOnly: "Australia is available now",
    majorPlaceholder: "Anything",
    goalPlaceholder: "Choose your goal",
    submit: "Search",
    exploreCountries: "Explore Australia",
    nextDestination: "Next Destination?",
    explore: "Explore Australia",
    available: "Available now",
    comingSoon: "Coming soon",
    preview: "Preview",
    requestCountry: "Request this country",
    modalEyebrow: "CampCareer is building Australia first",
    modalTitle: "Want {country} sooner?",
    modalDescription: "Tell us where to build next. Your request helps us prioritise the next country with the depth it deserves.",
    modalSubmit: "Request {country} next",
    modalSuccess: "Thanks — your request is in.",
    modalError: "We couldn’t save your request. Please try again.",
    modalClose: "Close",
  },
  ko: {
    headline: "호주에서 당신에게 맞는 최적의 선택",
    country: "나라",
    major: "전공",
    goal: "목표",
    australiaOnly: "현재 호주만 이용할 수 있어요",
    majorPlaceholder: "아직 모르겠어요",
    goalPlaceholder: "목표를 선택하세요",
    submit: "검색",
    exploreCountries: "호주를 시작해보세요",
    nextDestination: "다음 목적지는?",
    explore: "호주 탐색",
    available: "지금 이용 가능",
    comingSoon: "준비 중",
    preview: "미리보기",
    requestCountry: "이 국가 요청하기",
    modalEyebrow: "CampCareer는 호주부터 깊이 만들고 있어요",
    modalTitle: "{country}을(를) 더 빨리 보고 싶나요?",
    modalDescription: "다음에 만들 국가를 알려주세요. 여러분의 요청이 다음 출시 우선순위를 정하는 데 도움이 됩니다.",
    modalSubmit: "{country} 우선 요청하기",
    modalSuccess: "감사합니다. 요청을 저장했어요.",
    modalError: "요청을 저장하지 못했습니다. 다시 시도해 주세요.",
    modalClose: "닫기",
  },
} as const

type RequestStatus = "idle" | "submitting" | "success" | "error"
const LAUNCH_REQUEST_BROWSER_ID_KEY = "campcareer-country-launch-request-id"

export function HomeFinder({ locale = "en" }: { locale?: Locale }) {
  const isKo = locale === "ko-KR"
  const t = isKo ? COPY.ko : COPY.en
  const localePrefix = isKo ? "ko" : "en"
  const [category, setCategory] = useState("")
  const [goal, setGoal] = useState<LandingGoalId | "">("")
  const [requestedCountry, setRequestedCountry] = useState<LaunchCountry | null>(null)
  const [requestStatus, setRequestStatus] = useState<RequestStatus>("idle")
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({})
  const [likedCountries, setLikedCountries] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set()
    try {
      const stored = localStorage.getItem("campcareer-liked-countries")
      return stored ? new Set(JSON.parse(stored)) : new Set()
    } catch { return new Set() }
  })
  const [heartAnimating, setHeartAnimating] = useState<string | null>(null)
  const router = useRouter()
  const searchHref = `${localizePath("/au/majors", localePrefix)}?${new URLSearchParams({ ...(category ? { category } : {}), ...(goal ? { goal } : {}) })}`
  const majorOptions = useMemo<PickerOption[]>(() => [
    { value: "", label: t.majorPlaceholder, description: isKo ? "10개 전공 카테고리에서 선택" : "Choose from 10 study categories", icon: "✨", keywords: "any undecided" },
    ...STUDY_CATEGORIES.map((item) => {
      const visual = getStudyCategoryVisual(item.id)
      return { value: item.id, label: isKo ? item.labelKo : item.label, description: isKo ? `${item.labelKo} 분야 전공 탐색` : `Explore ${item.label} study paths`, icon: "", iconComponent: visual.Icon, iconTone: visual.tone, keywords: `${item.id} ${item.label} ${item.labelKo}` }
    }),
  ], [isKo, t.majorPlaceholder])
  const goalOptions = useMemo<PickerOption[]>(() => [
    ...LANDING_GOALS.map((item) => ({ value: item.id, label: isKo ? goalCopy(item.id).label : item.label, description: isKo ? goalCopy(item.id).description : goalCopy(item.id).descriptionEn, icon: goalCopy(item.id).icon })),
  ], [isKo])

  useEffect(() => {
    fetch("/api/v1/country-launch-requests")
      .then((res) => res.json())
      .then((data) => {
        if (!data.ok) return
        setLikeCounts((prev) => {
          const next = { ...data.counts }
          for (const code of likedCountries) {
            next[code] = Math.max(0, (next[code] ?? 0) + 1)
          }
          return next
        })
      })
      .catch(() => {})
  }, [])

  function toggleLike(country: LaunchCountry) {
    const code = country.code
    const isLiked = likedCountries.has(code)

    if (!isLiked) {
      setHeartAnimating(code)
      setTimeout(() => setHeartAnimating(null), 600)
    }

    const next = new Set(likedCountries)
    if (isLiked) { next.delete(code) } else { next.add(code) }
    setLikedCountries(next)
    localStorage.setItem("campcareer-liked-countries", JSON.stringify([...next]))

    setLikeCounts((prev) => ({ ...prev, [code]: Math.max(0, (prev[code] ?? 0) + (isLiked ? -1 : 1)) }))

    if (!isLiked) {
      const browserRequestId = getCountryRequestBrowserId()
      fetch("/api/v1/country-launch-requests", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ countryCode: code, browserRequestId }),
      }).catch(() => {})
    }
  }

  function openCountryRequest(country: LaunchCountry) {
    setRequestedCountry(country)
    setRequestStatus("idle")
  }

  async function submitCountryRequest() {
    if (!requestedCountry) return

    setRequestStatus("submitting")
    try {
      const browserRequestId = getCountryRequestBrowserId()
      const response = await fetch("/api/v1/country-launch-requests", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ countryCode: requestedCountry.code, browserRequestId }),
      })

      if (!response.ok) throw new Error("Country launch request failed")
      setRequestStatus("success")
    } catch {
      setRequestStatus("error")
    }
  }

  return (
    <div className="overflow-hidden bg-transparent">
      <section className="relative bg-gradient-to-b from-blue-600 to-blue-50">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8">
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-blue-200">{isKo ? "CampCareer" : "CampCareer"}</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">{t.headline}</h1>
          <form action={searchHref} onSubmit={(event) => { event.preventDefault(); const submitted = new FormData(event.currentTarget); const submittedCategory = String(submitted.get("category") ?? ""); const submittedGoal = String(submitted.get("goal") ?? ""); const href = `${localizePath("/au/majors", localePrefix)}?${new URLSearchParams({ ...(submittedCategory ? { category: submittedCategory } : {}), ...(submittedGoal ? { goal: submittedGoal } : {}) })}`; recordDiscoveryEvent("recommendation_start", { surface: "landing", country: "AU", major: submittedCategory || "anything", goal: submittedGoal }); router.push(href) }} className="max-w-5xl rounded-2xl border border-blue-400/30 bg-white p-3 shadow-[0_18px_45px_rgba(15,23,42,.10)]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <input type="hidden" name="country" value="AU" />
              <div className="flex-1">
                <p className="mb-1.5 text-xs font-medium text-slate-500">{t.country}</p>
                <div className="flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-900">
                  <span aria-hidden="true" className="text-lg">{countryFlag("AU")}</span>
                  <span>Australia</span>
                  <span className="ml-auto hidden text-xs font-medium text-blue-700 sm:block">{t.australiaOnly}</span>
                </div>
              </div>
              <div className="flex-1"><IconPicker name="category" label={t.major} value={category} options={majorOptions} onChange={setCategory} searchPlaceholder={isKo ? "전공 카테고리 검색" : "Search categories"} testId="major" /></div>
              <div className="flex-1"><IconPicker name="goal" label={t.goal} value={goal} options={goalOptions} onChange={(value) => setGoal(value as LandingGoalId)} testId="goal" /></div>
              <button type="submit" className="inline-flex h-12 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700"><span>{t.submit}</span></button>
            </div>
          </form>


        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-12 sm:px-6 sm:pb-16 sm:pt-14">
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">{t.exploreCountries}</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
            {LAUNCH_COUNTRIES.filter((c) => isPublicProductCountry(c.code)).map((country) => (
              <Link key={country.code} href={localizePath("/au", localePrefix)} className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:border-blue-300 hover:shadow-md">
                <div className="flex flex-col sm:flex-row">
                  <div className="relative h-48 overflow-hidden sm:h-auto sm:w-1/2"><Image src={country.image} alt={country.name} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-300 group-hover:scale-105" /><span className="absolute left-3 top-3 rounded-full bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">{t.available}</span></div>
                  <div className="flex flex-1 flex-col p-5 sm:w-1/2">
                    <p className="text-xs font-semibold tracking-[.15em] text-blue-700">{country.code}</p>
                    <h3 className="mt-1 font-semibold text-slate-950">{country.name}</h3>
                    <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
                      <p className="text-xs font-semibold text-blue-800">{isKo ? "호주의 강점" : "Why Australia?"}</p>
                      <ul className="mt-2 space-y-1.5 text-xs leading-5 text-slate-600">
                        <li>{isKo ? "졸업 후 평균 연봉: US$55k" : "Avg salary: US$55k"}</li>
                        <li>{isKo ? "영주권(PR) 경로 제공" : "PR pathway available"}</li>
                        <li>{isKo ? "1,700개 이상 직종 데이터" : "1,700+ occupations"}</li>
                      </ul>
                    </div>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-slate-600 group-hover:text-blue-700">{t.explore}<ArrowRight className="h-4 w-4" /></span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <HomeStatsSection isKo={isKo} />
      <HomeHowItWorksSection isKo={isKo} />
      <HomeWhySection isKo={isKo} />

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 pb-12 pt-12 sm:px-6 sm:pb-16 sm:pt-14">
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">{t.nextDestination}</h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LAUNCH_COUNTRIES.filter((c) => !isPublicProductCountry(c.code)).map((country) => {
              const isLiked = likedCountries.has(country.code)
              const count = likeCounts[country.code] ?? 0
              const animating = heartAnimating === country.code
              return (
                <div key={country.code} className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:border-slate-300 hover:shadow-md">
                  <button type="button" onClick={() => toggleLike(country)} className="relative block h-40 w-full overflow-hidden cursor-pointer" aria-label={`Like ${country.name}`}>
                    <Image src={country.image} alt="" fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover grayscale opacity-55 transition duration-300 group-hover:scale-105 group-hover:opacity-65" />
                    <div aria-hidden="true" className="absolute inset-0 bg-slate-950/20" />
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-slate-950/75 px-2.5 py-1 text-xs font-semibold text-white shadow-sm"><Clock3 className="h-3.5 w-3.5" />{t.comingSoon}</span>
                    <span className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold shadow-sm transition ${isLiked ? "bg-rose-500 text-white" : "bg-black/50 text-white"}`}>
                      <Heart className={`h-3.5 w-3.5 ${isLiked ? "fill-white" : ""}`} />
                      <span className="tabular-nums">{count > 0 ? count.toLocaleString() : "0"}</span>
                    </span>
                  </button>
                  <div className="p-4">
                    <p className="text-xs font-semibold tracking-[.15em] text-slate-500">{country.code}</p>
                    <h3 className="mt-1 font-semibold text-slate-700">{country.name}</h3>
                    <div className="mt-3 flex items-center justify-between">
                      <button type="button" onClick={() => toggleLike(country)} className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold transition ${isLiked ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-500"}`} aria-label={isLiked ? `Unlike ${country.name}` : `Like ${country.name}`}>
                        <Heart className={`h-5 w-5 transition-transform ${isLiked ? "fill-rose-500 text-rose-500" : ""} ${animating ? "scale-125" : ""}`} />
                        <span className="tabular-nums">{count > 0 ? count.toLocaleString() : "0"}</span>
                      </button>
                      <Link href={localizePath(`/${country.code.toLowerCase()}`, localePrefix)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 transition hover:text-blue-600">
                        <Eye className="h-4 w-4" />
                        <span>{t.preview}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {requestedCountry && <CountryRequestModal country={requestedCountry} status={requestStatus} copy={COPY.en} onClose={() => setRequestedCountry(null)} onSubmit={submitCountryRequest} />}
    </div>
  )
}

function CountryRequestModal({ country, status, copy, onClose, onSubmit }: { country: LaunchCountry; status: RequestStatus; copy: typeof COPY.en | typeof COPY.ko; onClose: () => void; onSubmit: () => void }) {
  const title = copy.modalTitle.replace("{country}", country.name)
  const submitLabel = copy.modalSubmit.replace("{country}", country.name)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section role="dialog" aria-modal="true" aria-labelledby="country-request-title" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div><p className="text-xs font-semibold uppercase tracking-[.14em] text-blue-700">{copy.modalEyebrow}</p><h2 id="country-request-title" className="mt-2 text-xl font-semibold tracking-tight text-slate-950">{title}</h2></div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900" aria-label={copy.modalClose}><X className="h-5 w-5" /></button>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-600">{copy.modalDescription}</p>
        {status === "success" ? <p className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{copy.modalSuccess}</p> : <div className="mt-6"><button type="button" onClick={onSubmit} disabled={status === "submitting"} className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-70">{status === "submitting" ? "Saving…" : submitLabel}</button>{status === "error" && <p className="mt-3 text-sm font-medium text-rose-700">{copy.modalError}</p>}</div>}
      </section>
    </div>
  )
}

function getCountryRequestBrowserId() {
  const existing = window.localStorage.getItem(LAUNCH_REQUEST_BROWSER_ID_KEY)
  if (existing) return existing

  const id = window.crypto.randomUUID()
  window.localStorage.setItem(LAUNCH_REQUEST_BROWSER_ID_KEY, id)
  return id
}

function goalCopy(goal: LandingGoalId) {
  if (goal === "high-income") return { label: "높은 졸업 후 연봉", description: "소득 신호가 강한 국가부터 확인", descriptionEn: "Prioritise stronger graduate earning signals", icon: "💰" }
  if (goal === "low-cost") return { label: "낮은 유학비용", description: "비용 부담이 낮은 국가부터 확인", descriptionEn: "Prioritise lower study-cost signals", icon: "🌱" }
  return { label: "졸업 후 취업·체류", description: "졸업 후 경로가 강한 국가부터 확인", descriptionEn: "Prioritise post-study work options", icon: "🧭" }
}
