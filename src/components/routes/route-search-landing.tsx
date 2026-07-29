"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ArrowRight, MapPinned, Search, ShieldCheck } from "lucide-react"
import { ROUTE_GUIDES, routeGuideHref, type RouteLocale } from "@/data/route-guides"
import { localizePath } from "@/lib/i18n/config"

export function RouteSearchLanding({ locale }: { locale: RouteLocale }) {
  const isKo = locale === "ko"
  const router = useRouter()
  const firstGuide = ROUTE_GUIDES[0]
  const [origin, setOrigin] = useState(firstGuide.origin.slug)
  const [destination, setDestination] = useState(firstGuide.destination.slug)
  const [target, setTarget] = useState(firstGuide.slug)
  const selectedGuide = ROUTE_GUIDES.find(
    (guide) => guide.origin.slug === origin && guide.destination.slug === destination && guide.slug === target,
  ) ?? firstGuide

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    router.push(localizePath(routeGuideHref(selectedGuide), locale))
  }

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-slate-950 text-white">
      <section className="mx-auto max-w-6xl px-5 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
          {isKo ? "국경을 넘는 커리어 경로" : "Cross-border career routes"}
        </p>
        <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl">
          {isKo ? "어디서 왔고, 어디서 어떤 일을 하고 싶은지. 그 경로를 찾습니다." : "Find the route from where you are to the work you want."}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
          {isKo
            ? "CampCareer는 국가 순위를 매기지 않습니다. 시민권, 목적지, 직종 하나를 기준으로 비자 조건, 준비, 구직 링크, 관련 교육, 지도를 한 경로로 연결합니다."
            : "CampCareer does not rank countries. We connect one citizenship, one destination, and one occupation to visa conditions, preparation, jobs, training, and a map."}
        </p>

        <form onSubmit={submit} className="mt-10 rounded-2xl border border-white/15 bg-white p-4 text-slate-950 shadow-2xl sm:p-5">
          <div className="grid gap-3 md:grid-cols-[1fr_1fr_1.2fr_auto] md:items-end">
            <RouteSelect
              label={isKo ? "시민권" : "Citizenship"}
              value={origin}
              onChange={setOrigin}
              options={ROUTE_GUIDES.map((guide) => ({ value: guide.origin.slug, label: guide.origin.name[locale] }))}
            />
            <RouteSelect
              label={isKo ? "목적지" : "Destination"}
              value={destination}
              onChange={setDestination}
              options={ROUTE_GUIDES.map((guide) => ({ value: guide.destination.slug, label: guide.destination.name[locale] }))}
            />
            <RouteSelect
              label={isKo ? "직종 또는 산업" : "Occupation or industry"}
              value={target}
              onChange={setTarget}
              options={ROUTE_GUIDES.map((guide) => ({ value: guide.slug, label: guide.target[locale] }))}
            />
            <button type="submit" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700">
              <Search className="size-4" />
              {isKo ? "경로 보기" : "Open route"}
            </button>
          </div>
          <p className="mt-4 text-xs leading-5 text-slate-500">
            {isKo
              ? "지금은 검증을 끝낸 경로만 검색됩니다. 근거가 부족한 국가·직종 조합은 공개하지 않습니다."
              : "Only routes that have completed evidence review are searchable. We do not publish unsupported country or occupation combinations."}
          </p>
        </form>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          <PromiseCard icon={<ShieldCheck className="size-5" />} title={isKo ? "공식 근거" : "Official evidence"} body={isKo ? "비자와 근무 조건은 공식 기관 링크와 확인일을 함께 보여줍니다." : "Visa and work-condition claims include an official link and checked date."} />
          <PromiseCard icon={<Search className="size-5" />} title={isKo ? "바로 행동" : "Actionable next steps"} body={isKo ? "구직, 준비 순서, 관련 교육을 실제 링크로 연결합니다." : "Jobs, preparation order, and relevant training lead to real links."} />
          <PromiseCard icon={<MapPinned className="size-5" />} title={isKo ? "지역 맥락" : "Regional context"} body={isKo ? "목적지 전체가 아니라 실제 일자리가 있는 지역을 지도에서 확인합니다." : "Explore the regions where the work is, rather than a country in the abstract."} />
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-4 text-sm">
          <Link href={localizePath(routeGuideHref(firstGuide), locale)} className="inline-flex items-center gap-2 font-semibold text-white hover:text-sky-200">
            {isKo ? "첫 검증 경로: 한국 -> 호주 광업" : "First verified route: Korea -> Australia mining"}
            <ArrowRight className="size-4" />
          </Link>
          <Link href={localizePath("/maps?country=au&state=WA", locale)} className="inline-flex items-center gap-2 font-semibold text-sky-300 hover:text-white">
            <MapPinned className="size-4" />
            {isKo ? "지도 열기" : "Open map"}
          </Link>
        </div>
      </section>
    </div>
  )
}

function RouteSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: Array<{ value: string; label: string }>
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  )
}

function PromiseCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="text-sky-300">{icon}</div>
      <h2 className="mt-4 font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-300">{body}</p>
    </article>
  )
}
