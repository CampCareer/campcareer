"use client"

import Link from "next/link"
import { ExternalLink, MapPinned, ArrowLeft, BriefcaseBusiness } from "lucide-react"
import type { LocalizedText, RouteGuide, RouteLinkType, RouteLocale } from "@/data/route-guides"
import { routeGuideHref } from "@/data/route-guides"
import { recordRouteEvent } from "@/lib/analytics"

export function RouteMapExplorer({ guide, locale }: { guide: RouteGuide; locale: RouteLocale }) {
  const isKo = locale === "ko"
  const text = (value: LocalizedText) => value[locale]

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-slate-50 text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-6 sm:py-14">
          <Link href={`${locale === "ko" ? "/ko" : ""}${routeGuideHref(guide)}`} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-700 hover:underline">
            <ArrowLeft className="size-4" />
            {isKo ? "경로 결과로 돌아가기" : "Back to route result"}
          </Link>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">{text(guide.origin.name)} <span aria-hidden="true">→</span> {text(guide.destination.name)} <span aria-hidden="true">→</span> {text(guide.target)} · {isKo ? "지도 신호" : "map signals"}</p>
          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-fraunces)] text-4xl font-semibold tracking-tight sm:text-5xl">{isKo ? `${text(guide.target)} 관련 지역·고용주 신호를 먼저 확인하세요.` : `Start with regional and employer signals for ${text(guide.target)}.`}</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">{isKo ? "이 지도는 국가·대학 비교가 아닙니다. 현재 경로와 연결된 지역·고용주·구직 신호만 표시하고, 수치가 없는 곳은 수치처럼 보이게 만들지 않습니다." : "This is not a country or university comparison. It shows only regional, employer, and job-search signals connected to the current route, and never presents missing figures as facts."}</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:py-14">
        <section>
          <h2 className="text-2xl font-semibold">{isKo ? "지역 신호" : "Regional signals"}</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {guide.map.signals.map((signal) => (
              <article key={text(signal.region)} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <MapPinned className="size-5 text-blue-700" />
                <div className="mt-4 flex items-center justify-between gap-3">
                  <h3 className="text-xl font-semibold">{text(signal.region)}</h3>
                  <ReadinessBadge readiness={signal.readiness} locale={locale} />
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{text(signal.detail)}</p>
                <p className="mt-5 text-xs text-slate-500">{isKo ? "출처" : "Source"}: {signal.source.operator} · {isKo ? "확인일" : "Checked"}: {signal.source.checkedAt}</p>
                <MapSourceLink href={signal.source.url} linkType="map" guideId={guide.id} locale={locale}>{signal.source.name}</MapSourceLink>
              </article>
            ))}
          </div>

          <h2 className="mt-10 text-2xl font-semibold">{isKo ? "고용주와 구직 시작점" : "Employers and job-search starting points"}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{isKo ? "채용 건수를 주장하지 않습니다. 현재 역할과 필수 조건은 아래 고용주·구직 링크의 각 공고에서 확인하세요." : "We do not claim a vacancy count. Confirm current roles and required conditions in every listing from the employers and job boards below."}</p>
          <div className="mt-5 grid gap-3">
            {[...guide.employers, ...guide.jobs].map((item) => (
              <MapSourceLink key={item.url} href={item.url} linkType={item.linkType} guideId={guide.id} locale={locale} className="flex items-start justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 transition hover:border-blue-300 hover:shadow-sm">
                <span>
                  <span className="flex items-center gap-2 font-semibold"><BriefcaseBusiness className="size-4 text-blue-700" />{text(item.label)}</span>
                  <span className="mt-2 block text-sm leading-6 text-slate-600">{text(item.detail)}</span>
                  <span className="mt-2 block text-xs text-slate-500">{item.source.operator} · {isKo ? "확인일" : "Checked"}: {item.source.checkedAt}</span>
                </span>
                <ExternalLink className="mt-1 size-4 shrink-0 text-slate-400" />
              </MapSourceLink>
            ))}
          </div>
        </section>

        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl bg-slate-950 p-6 text-white">
            <p className="text-xs font-semibold uppercase tracking-wide text-sky-300">{isKo ? "데이터 준비 상태" : "Data readiness"}</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">{isKo ? "이 v1 지도는 지역별 채용 수나 추천 점수를 표시하지 않습니다. 검증된 지역·고용주 링크와 각 확인일을 먼저 공개합니다." : "This v1 map does not show regional vacancy counts or recommendation scores. It publishes verified regional and employer links with their checked dates first."}</p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950">
            <p className="font-semibold">{isKo ? "지원 전 다시 확인" : "Recheck before applying"}</p>
            <p className="mt-2">{isKo ? "직무, 근무지, 면허·등록, 고용주 요건, 비자 조건은 지원 전 실제 공고와 해당 기관에서 개별 확인해야 합니다." : "Confirm the role, location, licensing or registration, employer requirements, and visa conditions in the live listing and with the relevant organisation before applying."}</p>
          </div>
        </aside>
      </div>
    </main>
  )
}

function ReadinessBadge({ readiness, locale }: { readiness: "ready" | "partial" | "research_required"; locale: RouteLocale }) {
  const label = readiness === "ready" ? (locale === "ko" ? "준비됨" : "Ready") : readiness === "partial" ? (locale === "ko" ? "일부 준비" : "Partial") : (locale === "ko" ? "조사 필요" : "Research needed")
  const className = readiness === "ready" ? "bg-emerald-50 text-emerald-800" : readiness === "partial" ? "bg-amber-50 text-amber-900" : "bg-slate-100 text-slate-700"
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}>{label}</span>
}

function MapSourceLink({
  href,
  linkType,
  guideId,
  locale,
  className,
  children,
}: {
  href: string
  linkType: RouteLinkType
  guideId: string
  locale: RouteLocale
  className?: string
  children: React.ReactNode
}) {
  return <a href={href} target="_blank" rel="noreferrer" className={className ?? "mt-2 inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:underline"} onClick={() => recordRouteEvent("route_external_link_clicked", { route_id: guideId, locale, link_type: linkType, surface: "maps" })}>{children}</a>
}
