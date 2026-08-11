"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { LanguageMenu } from "@/components/layout/language-menu"
import { getWorkspaceNavItem } from "@/lib/workspace/navigation"
import { withoutLocalePrefix } from "@/lib/i18n/config"
import { useSelectedCountry } from "./country-context"
import { WorkspaceUserMenu } from "./workspace-user-menu"

type WorkspaceTopbarProps = {
  onMenuClick: () => void
}

const NAV_ID_BY_PATH: Record<string, string> = {
  "/": "home",
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
  const current = getWorkspaceNavItem(NAV_ID_BY_PATH[pathname])
  const { selectedCountry } = useSelectedCountry()
  const breadcrumb =
    current?.id === "countries" && selectedCountry ? selectedCountry.name : current?.label

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-[#e7e6e3] bg-white/85 px-4 backdrop-blur-md sm:px-6">
      {pathname !== "/" && (
        <button
          type="button"
          onClick={onMenuClick}
          className="-ml-1 grid size-8 place-items-center rounded-lg text-[#6f6d68] transition hover:bg-[#f6f6f4] hover:text-[#1b1b1b] sm:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="size-5" />
        </button>
      )}

      <Link href="/" className="campcareer-wordmark text-[#1b1b1b]" aria-label="campcareer home">
        campcareer
      </Link>

      {breadcrumb && pathname !== "/" && (
        <span className="hidden text-[13px] font-medium text-[#a3a19b] sm:block">
          / {breadcrumb}
        </span>
      )}

      <div className="flex-1" />

      <LanguageMenu />
      <WorkspaceUserMenu minimal />
    </header>
  )
}
