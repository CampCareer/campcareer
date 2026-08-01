"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"
import { Clock3, Eye, Heart, X } from "lucide-react"
import { LAUNCH_COUNTRIES, type LaunchCountry } from "@/data/launch-countries"
import { localizePath } from "@/lib/i18n/config"
import { useLocale } from "@/lib/i18n/locale-provider"
import { isPublicProductCountry } from "@/lib/product-scope"

type RequestStatus = "idle" | "submitting" | "success" | "error"
const LAUNCH_REQUEST_BROWSER_ID_KEY = "cc_launch_request_browser_id"

export default function ComingSoonPage() {
  const locale = useLocale()
  const isKo = locale === "ko"
  const pathLocale = isKo ? "ko" : "en"

  const comingSoonCountries = useMemo(
    () => LAUNCH_COUNTRIES.filter((c) => !isPublicProductCountry(c.code)),
    [],
  )

  const [likedCountries, setLikedCountries] = useState<Set<string>>(() => {
    if (typeof window === "undefined") return new Set()
    try {
      const stored = localStorage.getItem("cc_liked_countries")
      return stored ? new Set(JSON.parse(stored)) : new Set()
    } catch { return new Set() }
  })
  const [heartAnimating, setHeartAnimating] = useState<string | null>(null)
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({})
  const [requestedCountry, setRequestedCountry] = useState<LaunchCountry | null>(null)
  const [requestStatus, setRequestStatus] = useState<RequestStatus>("idle")

  useEffect(() => {
    fetch("/api/v1/country-launch-requests")
      .then((r) => r.json())
      .then((data: { counts: Record<string, number> }) => {
        if (data?.counts) setLikeCounts(data.counts)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (likedCountries.size === 0) return
    localStorage.setItem("cc_liked_countries", JSON.stringify([...likedCountries]))
  }, [likedCountries])

  function toggleLike(country: LaunchCountry) {
    setLikedCountries((prev) => {
      const next = new Set(prev)
      if (next.has(country.code)) {
        next.delete(country.code)
        setLikeCounts((c) => ({ ...c, [country.code]: Math.max(0, (c[country.code] ?? 1) - 1) }))
      } else {
        next.add(country.code)
        setLikeCounts((c) => ({ ...c, [country.code]: (c[country.code] ?? 0) + 1 }))
        setHeartAnimating(country.code)
        setTimeout(() => setHeartAnimating(null), 400)
        fetch("/api/v1/country-launch-requests", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ countryCode: country.code, browserRequestId: getCountryRequestBrowserId() }),
        }).catch(() => {})
      }
      return next
    })
  }

  async function submitCountryRequest() {
    if (!requestedCountry) return
    setRequestStatus("submitting")
    try {
      const response = await fetch("/api/v1/country-launch-requests", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ countryCode: requestedCountry.code, browserRequestId: getCountryRequestBrowserId() }),
      })
      if (!response.ok) throw new Error("Country launch request failed")
      setRequestStatus("success")
    } catch { setRequestStatus("error") }
  }

  const sorted = useMemo(() => {
    return [...comingSoonCountries].sort((a, b) => (likeCounts[b.code] ?? 0) - (likeCounts[a.code] ?? 0))
  }, [comingSoonCountries, likeCounts])

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-b from-blue-600 to-blue-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-blue-200">Coming Soon</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {isKo ? "다음 국가는 어디일까요?" : "Which country is next?"}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-200 sm:text-base">
            {isKo
              ? "좋아요를 눌러 어떤 나라를 가장 먼저 열지 알려주세요. 많은 요청을 받은 나라를 우선적으로 만듭니다."
              : "Vote for the countries you want us to build next. The most-requested countries get prioritised."}
          </p>
          <div className="mt-4 flex items-center gap-3 text-sm text-blue-200">
            <span className="inline-flex items-center gap-1.5"><Heart className="size-4" /> {isKo ? "좋아요로 투표" : "Vote with hearts"}</span>
            <span className="text-blue-300">·</span>
            <span className="inline-flex items-center gap-1.5"><Eye className="size-4" /> {isKo ? "미리보기로 탐색" : "Preview available"}</span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sorted.map((country) => {
            const isLiked = likedCountries.has(country.code)
            const count = likeCounts[country.code] ?? 0
            const animating = heartAnimating === country.code
            return (
              <div key={country.code} className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:border-slate-300 hover:shadow-md">
                <button type="button" onClick={() => toggleLike(country)} className="relative block h-40 w-full cursor-pointer overflow-hidden" aria-label={`${country.name} ${isKo ? "좋아요" : "Like"}`}>
                  <Image src={country.image} alt="" fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover grayscale opacity-55 transition duration-300 group-hover:scale-105 group-hover:opacity-65" />
                  <div aria-hidden="true" className="absolute inset-0 bg-slate-950/20" />
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-slate-950/75 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                    <Clock3 className="h-3.5 w-3.5" /> {isKo ? "준비 중" : "Coming soon"}
                  </span>
                  <span className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold shadow-sm transition ${isLiked ? "bg-rose-500 text-white" : "bg-black/50 text-white"}`}>
                    <Heart className={`h-3.5 w-3.5 ${isLiked ? "fill-white" : ""}`} />
                    <span className="tabular-nums">{count > 0 ? count.toLocaleString() : "0"}</span>
                  </span>
                </button>
                <div className="p-4">
                  <p className="text-xs font-semibold tracking-[.15em] text-slate-500">{country.code}</p>
                  <h3 className="mt-1 font-semibold text-slate-700">{country.name}</h3>
                  <div className="mt-3 flex items-center justify-between">
                    <button type="button" onClick={() => toggleLike(country)} className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold transition ${isLiked ? "bg-rose-50 text-rose-600" : "bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-500"}`} aria-label={isLiked ? `${country.name} ${isKo ? "좋아요 취소" : "Unlike"}` : `${country.name} ${isKo ? "좋아요" : "Like"}`}>
                      <Heart className={`h-5 w-5 transition-transform ${isLiked ? "fill-rose-500 text-rose-500" : ""} ${animating ? "scale-125" : ""}`} />
                      <span className="tabular-nums">{count > 0 ? count.toLocaleString() : "0"}</span>
                    </button>
                    <Link href={localizePath(`/${country.code.toLowerCase()}`, pathLocale)} className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 transition hover:text-blue-600">
                      <Eye className="h-4 w-4" /> {isKo ? "미리보기" : "Preview"}
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-10 text-center">
          <Link href="/home" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
            {isKo ? "호주 시작하기" : "Start with Australia"}
          </Link>
        </div>
      </div>

      {requestedCountry && <CountryRequestModal country={requestedCountry} status={requestStatus} isKo={isKo} onClose={() => { setRequestedCountry(null); setRequestStatus("idle") }} onSubmit={submitCountryRequest} />}
    </main>
  )
}

function CountryRequestModal({ country, status, isKo, onClose, onSubmit }: { country: LaunchCountry; status: RequestStatus; isKo: boolean; onClose: () => void; onSubmit: () => void }) {
  const title = isKo ? `${country.name}이(가) 더 빨리 나오길 원하시나요?` : `Want ${country.name} sooner?`
  const description = isKo ? "어디에 먼저 만들지 알려주세요. 많은 요청을 받은 나라를 우선적으로 만듭니다." : "Tell us where to build next. Your request helps us prioritise the next country with the depth it deserves."
  const submitLabel = isKo ? `${country.name} 우선 요청` : `Request ${country.name} next`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <section role="dialog" aria-modal="true" aria-labelledby="country-request-title" className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.14em] text-blue-700">CampCareer</p>
            <h2 id="country-request-title" className="mt-2 text-xl font-semibold tracking-tight text-slate-950">{title}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900" aria-label={isKo ? "닫기" : "Close"}>
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-4 text-sm leading-6 text-slate-600">{description}</p>
        {status === "success" ? (
          <p className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">{isKo ? "감사합니다 — 요청이 접수되었습니다." : "Thanks — your request is in."}</p>
        ) : (
          <div className="mt-6">
            <button type="button" onClick={onSubmit} disabled={status === "submitting"} className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-70">
              {status === "submitting" ? "Saving…" : submitLabel}
            </button>
            {status === "error" && <p className="mt-3 text-sm font-medium text-rose-700">{isKo ? "저장에 실패했습니다. 다시 시도해 주세요." : "We couldn't save your request. Please try again."}</p>}
          </div>
        )}
      </section>
    </div>
  )
}

function getCountryRequestBrowserId() {
  if (typeof window === "undefined") return ""
  const existing = window.localStorage.getItem(LAUNCH_REQUEST_BROWSER_ID_KEY)
  if (existing) return existing
  const id = window.crypto.randomUUID()
  window.localStorage.setItem(LAUNCH_REQUEST_BROWSER_ID_KEY, id)
  return id
}
