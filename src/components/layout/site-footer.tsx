"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { localeFromPathname, localizePath, type LocaleOption } from "@/lib/i18n/config"
import { cn } from "@/lib/utils"
import { LogoMark } from "@/components/logo-mark"

export function SiteFooter({ className }: { className?: string }) {
  const locale = useRouteLocale()
  const pathLocale = localeFromPathname(usePathname()) ?? locale
  const isKo = pathLocale === "ko"

  return (
    <footer className={cn("border-t border-slate-200 bg-slate-50", className)}>
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href={localizePath("/", pathLocale)} className="flex items-center gap-2">
              <LogoMark size={24} />
              <span className="text-base font-semibold text-slate-900">CampCareer</span>
            </Link>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              {isKo
                ? "시민권에서 해외 직종으로 이어지는 검증된 경로를 찾습니다."
                : "Find verified routes from citizenship to work abroad."}
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-slate-900">
              {isKo ? "경로" : "Routes"}
            </h4>
            <ul className="mt-3 space-y-2.5">
              <FooterLink href="/" locale={pathLocale}>
                {isKo ? "경로 검색" : "Search routes"}
              </FooterLink>
              <FooterLink href="/maps" locale={pathLocale}>
                {isKo ? "지도" : "Maps"}
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
          <span>{isKo ? "출신국에서 해외 직종으로" : "From citizenship to work abroad"}</span>
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
