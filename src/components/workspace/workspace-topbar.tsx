"use client"

import Link from "next/link"
import { LanguageMenu } from "@/components/layout/language-menu"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { localizePath } from "@/lib/i18n/config"
import { WorkspaceUserMenu } from "./workspace-user-menu"

export function WorkspaceTopbar() {
  const locale = useRouteLocale()

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[hsl(var(--cc-border))] bg-white/95 px-4 backdrop-blur-md sm:px-6">
      <Link
        href={localizePath("/", locale)}
        className="campcareer-wordmark text-[hsl(var(--cc-ink))]"
        aria-label="CampCareer career search"
      >
        campcareer
      </Link>

      <div className="flex-1" />
      <LanguageMenu />
      <WorkspaceUserMenu />
    </header>
  )
}
