"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { localeFromPathname, localizePath, type LocaleOption } from "@/lib/i18n/config"
import { cn } from "@/lib/utils"

export function SiteFooter({ className }: { className?: string }) {
  const locale = useRouteLocale()
  const pathname = usePathname()
  const pathLocale = localeFromPathname(pathname) ?? locale
  const isKo = pathLocale === "ko"

  return (
    <footer className={cn("border-t border-[hsl(var(--cc-border))] bg-white", className)}>
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Link href={localizePath("/", pathLocale)} className="campcareer-wordmark text-[hsl(var(--cc-ink))]">campcareer</Link>
            <p className="mt-3 max-w-sm text-sm leading-6 text-[hsl(var(--cc-muted))]">
              {isKo ? "커리어의 가치를 판단하고, 그곳까지 가는 실제 경로를 보여드립니다." : "Know if a career is worth it, then see the path to get there."}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[hsl(var(--cc-ink))]">{isKo ? "제품" : "Product"}</h4>
            <ul className="mt-3 space-y-2.5">
              <FooterLink href="/" locale={pathLocale}>{isKo ? "커리어 평가" : "Evaluate a career"}</FooterLink>
              <FooterLink href="/programs" locale={pathLocale}>{isKo ? "프로그램" : "Programs"}</FooterLink>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[hsl(var(--cc-ink))]">{isKo ? "정보" : "Info"}</h4>
            <ul className="mt-3 space-y-2.5">
              {pathLocale === "en" && <FooterLink href="/blog" locale={pathLocale}>Career guides</FooterLink>}
              <FooterLink href="/sources" locale={pathLocale}>{isKo ? "출처" : "Sources"}</FooterLink>
              <FooterLink href="/methodology" locale={pathLocale}>{isKo ? "방법론" : "Methodology"}</FooterLink>
              <FooterLink href="/privacy" locale={pathLocale}>{isKo ? "개인정보처리방침" : "Privacy policy"}</FooterLink>
              <FooterLink href="/terms" locale={pathLocale}>{isKo ? "이용약관" : "Terms of service"}</FooterLink>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-[hsl(var(--cc-border))] pt-6 text-xs text-[hsl(var(--cc-muted))] sm:flex-row">
          <span>&copy; {new Date().getFullYear()} CampCareer</span>
          <span>{isKo ? "짧은 판단. 명확한 근거. 다음 행동." : "Short verdicts. Plain evidence. Clear next steps."}</span>
        </div>
      </div>
    </footer>
  )
}

function FooterLink({ href, locale, children }: { href: string; locale: LocaleOption; children: React.ReactNode }) {
  return <li><Link href={localizePath(href, locale)} className="text-sm text-[hsl(var(--cc-muted))] transition hover:text-[hsl(var(--cc-ink))]">{children}</Link></li>
}
