"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { localeFromPathname, localizePath, type LocaleOption } from "@/lib/i18n/config"
import { cn } from "@/lib/utils"

export function SiteFooter({ className }: { className?: string }) {
  const locale = useRouteLocale()
  const pathLocale = localeFromPathname(usePathname()) ?? locale
  const isKo = pathLocale === "ko"

  return (
    <footer className={cn("border-t border-slate-200 bg-slate-50", className)}>
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Link href="/" className="campcareer-wordmark text-slate-900">campcareer</Link>
            <p className="mt-3 text-sm leading-6 text-slate-500">{isKo ? "목적지와 하고 싶은 일에 필요한 검증된 유학·취업 정보를 찾습니다." : "Find source-backed study and work information for the destination and career you are considering."}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">{isKo ? "경로" : "Routes"}</h4>
            <ul className="mt-3 space-y-2.5">
              <FooterLink href="/" locale={pathLocale} canonical>{isKo ? "경로 검색" : "Search routes"}</FooterLink>
              <FooterLink href="/maps" locale={pathLocale} canonical>{isKo ? "지도" : "Maps"}</FooterLink>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">{isKo ? "정보" : "Info"}</h4>
            <ul className="mt-3 space-y-2.5">
              <FooterLink href="/sources" locale={pathLocale}>{isKo ? "출처" : "Sources"}</FooterLink>
              <FooterLink href="/methodology" locale={pathLocale}>{isKo ? "방법론" : "Methodology"}</FooterLink>
              <FooterLink href="/privacy" locale={pathLocale}>{isKo ? "개인정보처리방침" : "Privacy policy"}</FooterLink>
              <FooterLink href="/terms" locale={pathLocale}>{isKo ? "이용약관" : "Terms of service"}</FooterLink>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 text-xs text-slate-400 sm:flex-row">
          <span>&copy; {new Date().getFullYear()} CampCareer</span>
          <span>{isKo ? "검색부터, 근거를 바탕으로" : "Search first. Decide with evidence."}</span>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ href, locale, canonical = false, children }: { href: string; locale: LocaleOption; canonical?: boolean; children: React.ReactNode }) {
  return <li><Link href={canonical ? href : localizePath(href, locale)} className="text-sm text-slate-500 transition hover:text-slate-900">{children}</Link></li>
}
