"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { LanguageMenu } from "@/components/layout/language-menu"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { getWorkspaceNavItem } from "@/lib/workspace/navigation"
import { localizePath, withoutLocalePrefix } from "@/lib/i18n/config"
import { useSelectedCountry } from "./country-context"
import { WorkspaceUserMenu } from "./workspace-user-menu"

type WorkspaceTopbarProps = {
  onMenuClick: () => void
}

const NAV_ID_BY_PATH: Record<string, string> = {
  "/home": "home",
  "/maps": "map",
  "/compare": "compare",
  "/countries": "countries",
  "/visas": "visas",
  "/occupation": "occupation",
  "/programs": "programs",
  "/courses": "programs",
}

export function WorkspaceTopbar({ onMenuClick }: WorkspaceTopbarProps) {
  const pathname = withoutLocalePrefix(usePathname())
  const locale = useRouteLocale()
  const current = getWorkspaceNavItem(NAV_ID_BY_PATH[pathname])
  const { selectedCountry } = useSelectedCountry()
  const breadcrumb =
    current?.id === "countries" && selectedCountry ? selectedCountry.name : current?.label

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[#e7e6e3] bg-[#f7f7f5]/90 px-4 backdrop-blur-md sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="-ml-1 inline-flex size-9 items-center justify-center rounded-lg text-xs font-semibold text-[#5f5d57] transition hover:bg-[#f0f0ed] hover:text-[#1b1b1b] sm:hidden"
        aria-label={locale === "ko" ? "카테고리 메뉴 열기" : "Open navigation menu"}
      >
        <Menu className="size-4" />
      </button>
      <Link href={localizePath("/home", locale)} className="campcareer-wordmark text-[#1b1b1b]" aria-label="campcareer home">
        campcareer
      </Link>

      {breadcrumb && pathname !== "/home" && (
        <span className="hidden text-[13px] font-medium text-[#a3a19b] sm:block">
          / {breadcrumb}
        </span>
      )}

      <div className="flex-1" />

      <LanguageMenu />
      <WorkspaceUserMenu />
    </header>
  )
}
