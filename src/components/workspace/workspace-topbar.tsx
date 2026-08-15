"use client"

import Link from "next/link"
import { LanguageMenu } from "@/components/layout/language-menu"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { localizePath } from "@/lib/i18n/config"
import { WorkspaceUserMenu } from "./workspace-user-menu"

export function WorkspaceTopbar() {
  const locale = useRouteLocale()

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-[hsl(var(--cc-border))] bg-white">
      <div className="mx-auto flex h-16 w-full max-w-[1240px] items-center gap-3 px-6 max-sm:px-[18px]">
        <Link
          href={localizePath("/", locale)}
          className="campcareer-wordmark shrink-0 text-[hsl(var(--cc-ink))]"
          aria-label="CampCareer career search"
        >
          campcareer
        </Link>

        <div className="flex-1" />
        <LanguageMenu buttonClassName="text-[hsl(var(--cc-muted))] hover:bg-slate-100" />
        <WorkspaceUserMenu />
      </div>
    </header>
  )
}
