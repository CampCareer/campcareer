"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRouteLocale, useRouteTranslations } from "@/lib/i18n/locale-provider"
import { localeFromPathname, localizePath, type LocaleOption } from "@/lib/i18n/config"
import { cn } from "@/lib/utils"
import { LogoMark } from "@/components/logo-mark"

export function SiteFooter({ className }: { className?: string }) {
  const t = useRouteTranslations()
  const locale = useRouteLocale()
  const pathLocale = localeFromPathname(usePathname()) ?? locale
  const isKo = pathLocale === "ko"

  return (
    <footer className={cn("border-t border-slate-200 bg-slate-50", className)}>
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href={localizePath("/", pathLocale)} className="flex items-center gap-2">
              <LogoMark size={24} />
              <span className="text-base font-semibold text-slate-900">CampCareer</span>
            </Link>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              {isKo
                ? "호주 유학의 모든 것을 데이터로 비교하세요."
                : "Compare everything about studying in Australia with data."}
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900">
              {isKo ? "탐색" : "Explore"}
            </h4>
            <ul className="mt-3 space-y-2.5">
              <FooterLink href="/au/majors" locale={pathLocale}>
                {isKo ? "전공 목록" : "All majors"}
              </FooterLink>
              <FooterLink href="/au/study/compare" locale={pathLocale}>
                {isKo ? "대학 비교" : "Compare universities"}
              </FooterLink>
              <FooterLink href="/au/study" locale={pathLocale}>
                {isKo ? "유학 옵션" : "Study options"}
              </FooterLink>
              <FooterLink href="/map?country=au" locale={pathLocale}>
                {isKo ? "지도에서 보기" : "View on map"}
              </FooterLink>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900">
              {isKo ? "도구" : "Tools"}
            </h4>
            <ul className="mt-3 space-y-2.5">
              <FooterLink href="/home" locale={pathLocale}>
                {isKo ? "My Plan" : "My Plan"}
              </FooterLink>
              <FooterLink href="/reports/australia" locale={pathLocale}>
                {isKo ? "보고서 준비" : "Report preparation"}
              </FooterLink>
              <FooterLink href="/blog" locale={pathLocale}>
                {isKo ? "블로그" : "Blog"}
              </FooterLink>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900">
              {isKo ? "정보" : "Info"}
            </h4>
            <ul className="mt-3 space-y-2.5">
              <FooterLink href="/methodology" locale={pathLocale}>
                {isKo ? "방법론" : "Methodology"}
              </FooterLink>
              <FooterLink href="/privacy" locale={pathLocale}>
                {isKo ? "개인정보처리방침" : "Privacy policy"}
              </FooterLink>
              <FooterLink href="/terms" locale={pathLocale}>
                {isKo ? "이용약관" : "Terms of service"}
              </FooterLink>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 text-xs text-slate-400 sm:flex-row">
          <span>&copy; {new Date().getFullYear()} CampCareer</span>
          <span>{isKo ? "데이터 기반 유학 플랫폼" : "Data-driven study platform"}</span>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({
  href,
  locale,
  children,
}: {
  href: string
  locale: LocaleOption
  children: React.ReactNode
}) {
  return (
    <li>
      <Link
        href={localizePath(href, locale)}
        className="text-sm text-slate-500 transition hover:text-slate-900"
      >
        {children}
      </Link>
    </li>
  )
}
