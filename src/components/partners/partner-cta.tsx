"use client"

import { ArrowRight } from "lucide-react"
import { useTranslations } from "@/lib/i18n/locale-provider"
import { WISE, AIRALO, type Partner } from "@/lib/partners"

// 제휴 클릭을 GA4 이벤트로 집계 (gtag 는 layout.tsx 에서 로드됨).
function trackAffiliateClick(partnerId: string) {
  const w = window as unknown as { gtag?: (...args: unknown[]) => void }
  w.gtag?.("event", "affiliate_click", { partner: partnerId })
}

// 작은 Wise 마크 — 인라인 SVG (logo-mark.tsx 컨벤션). 공식 브랜드 SVG 로 교체 가능.
function WiseLogo({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect width="28" height="28" rx="8" fill="#163300" />
      <path
        d="M9 8h4.8l-2 3.2H15l-2 3.2h3.2L13.4 20H8.2l2.4-3.8H7.4l2-3.2H6.2L9 8z"
        fill="#9FE870"
      />
    </svg>
  )
}

// 범용 제휴 CTA 카드 — 로고 + 한 줄 가치제안 + 제휴 버튼.
// rel="sponsored" + 제휴 고지로 affiliate 위생을 지킨다.
export function PartnerCta({
  partner,
  logo,
  title,
  description,
  cta,
}: {
  partner: Partner
  logo: React.ReactNode
  title: string
  description: string
  cta: string
}) {
  const t = useTranslations()
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <div className="flex items-center gap-2">
        {logo}
        <span className="text-sm font-semibold text-slate-900">{partner.name}</span>
        <span className="ml-auto text-[10px] font-medium uppercase tracking-wide text-slate-400">
          {t.map.affiliateNote}
        </span>
      </div>
      <p className="mt-2.5 text-sm font-semibold text-slate-800 leading-snug">{title}</p>
      <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{description}</p>
      <a
        href={partner.href}
        target="_blank"
        rel="sponsored noopener noreferrer"
        onClick={() => trackAffiliateClick(partner.id)}
        className="mt-3 flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-bold transition-opacity hover:opacity-90"
        style={{ backgroundColor: partner.accent, color: partner.accentText }}
      >
        {cta}
        <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  )
}

// Wise 전용 래퍼 — 카드에서는 <WiseCta /> 한 줄로 끝낸다.
export function WiseCta() {
  const t = useTranslations()
  return (
    <PartnerCta
      partner={WISE}
      logo={<WiseLogo />}
      title={t.map.wiseCtaTitle}
      description={t.map.wiseCtaDesc}
      cta={t.map.wiseCtaButton}
    />
  )
}

function AiraloLogo({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      <rect width="28" height="28" rx="8" fill="#00B6BA" />
      <path d="M8 20V8h2.8l3.2 7.2L17.2 8H20v12h-2.4v-9.2l-3.6 7.6h-2l-3.6-7.6V20H8z" fill="white" />
    </svg>
  )
}

export function AiraloCta() {
  const t = useTranslations()
  return (
    <PartnerCta
      partner={AIRALO}
      logo={<AiraloLogo />}
      title={t.map.airaloCtaTitle}
      description={t.map.airaloCtaDesc}
      cta={t.map.airaloCtaButton}
    />
  )
}
