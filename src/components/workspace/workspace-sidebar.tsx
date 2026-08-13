"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState, type CSSProperties } from "react"
import { ChevronDown, Globe2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { WORKSPACE_NAV_ITEMS } from "@/lib/workspace/navigation"
import { COMPARE_MODE_NAV_ITEMS, type CompareModeType } from "@/lib/compare-navigation"
import { LAUNCH_COUNTRIES } from "@/data/launch-countries"
import { localizePath } from "@/lib/i18n/config"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { resolveCareerCompareHref } from "@/lib/workspace/career-compare-context"
import {
  compareModeLabel,
  workspaceCountryLabel,
  workspaceNavLabel,
  workspaceSidebarCopy,
} from "@/lib/workspace/sidebar-i18n"
import { useSelectedCountry } from "./country-context"

type WorkspaceSidebarProps = {
  open: boolean
  onClose: () => void
}

export function WorkspaceSidebar({ open, onClose }: WorkspaceSidebarProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const locale = useRouteLocale()
  const copy = workspaceSidebarCopy(locale)
  const { selectedCountry, setSelectedCountry } = useSelectedCountry()
  const comparePath = localizePath("/compare", locale)
  const careerPath = localizePath("/career", locale)
  const isCompareRoute = pathname === comparePath || pathname.startsWith(comparePath + "/")
  const isCareerRoute = pathname === careerPath || pathname.startsWith(careerPath + "/")
  const currentCareerCompareHref = isCareerRoute
    ? resolveCareerCompareHref(searchParams.get("country") ?? "", searchParams.get("occupation") ?? "")
    : null
  const [compareOpen, setCompareOpen] = useState(isCompareRoute)
  const [compareType, setCompareType] = useState<CompareModeType>("program")
  const selectedCountryProfile = selectedCountry
    ? LAUNCH_COUNTRIES.find((country) => country.code === selectedCountry.code) ?? null
    : null
  const selectedCountryLabel = selectedCountryProfile
    ? workspaceCountryLabel(locale, selectedCountryProfile)
    : selectedCountry?.name ?? null

  useEffect(() => {
    if (!isCompareRoute) return
    setCompareOpen(true)
    const rawType = new URLSearchParams(window.location.search).get("type")
    const matched = COMPARE_MODE_NAV_ITEMS.find((item) => item.type === rawType)
    setCompareType(matched?.type ?? "program")
  }, [isCompareRoute])

  function handleCountryChange(code: string) {
    const country = LAUNCH_COUNTRIES.find((c) => c.code === code) ?? null
    setSelectedCountry(
      country ? { code: country.code, name: country.name, currency: country.currency } : null
    )
    onClose()
  }

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/25 sm:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-[#e7e6e3] bg-white transition-transform duration-200 sm:static sm:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4" aria-label="Workspace">
          {WORKSPACE_NAV_ITEMS.map((item) => {
            const itemHref = localizePath(item.href, locale)
            const isActive = pathname === itemHref || pathname.startsWith(itemHref + "/")
            const Icon = item.icon
            const baseLabel = workspaceNavLabel(locale, item)
            const label = item.id === "countries" && selectedCountryLabel ? selectedCountryLabel : baseLabel

            if (item.id === "compare") {
              return (
                <div key={item.id}>
                  <button
                    type="button"
                    onClick={() => setCompareOpen((current) => !current)}
                    aria-expanded={compareOpen}
                    aria-controls="workspace-compare-modes"
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] transition",
                      isActive
                        ? "font-semibold text-white"
                        : "font-medium text-[#1b1b1b] hover:bg-[var(--item-tint)]"
                    )}
                    style={
                      {
                        ["--item-tint" as string]: item.tint,
                        backgroundColor: isActive ? item.accent : undefined,
                      } as CSSProperties
                    }
                  >
                    <Icon
                      className="size-[17px] shrink-0 transition"
                      strokeWidth={2}
                      style={{ color: isActive ? "rgba(255,255,255,0.95)" : item.accent }}
                    />
                    <span className="min-w-0 flex-1 text-left">{baseLabel}</span>
                    <ChevronDown
                      className={cn(
                        "size-3.5 shrink-0 transition-transform",
                        isActive ? "text-white/80" : "text-[#9c9a94]",
                        compareOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {compareOpen && (
                    <div id="workspace-compare-modes" className="mt-1 space-y-0.5 pl-8">
                      {COMPARE_MODE_NAV_ITEMS.map((mode) => {
                        const modeActive = isCompareRoute && compareType === mode.type
                        const contextualHref = mode.type === "career" && currentCareerCompareHref
                          ? currentCareerCompareHref
                          : mode.href
                        return (
                          <Link
                            key={mode.type}
                            href={localizePath(contextualHref, locale)}
                            onClick={() => {
                              setCompareType(mode.type)
                              onClose()
                            }}
                            aria-current={modeActive ? "page" : undefined}
                            className={cn(
                              "flex min-h-9 items-center rounded-lg px-3 text-[12.5px] font-medium transition",
                              modeActive
                                ? "bg-[#f3f0fa] font-semibold text-[#6d4fc4]"
                                : "text-[#6f6d68] hover:bg-[#f8f7fb] hover:text-[#4f3895]"
                            )}
                          >
                            {compareModeLabel(locale, mode.type)}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            }

            return (
              <Link
                key={item.id}
                href={itemHref}
                onClick={onClose}
                aria-current={isActive ? "page" : undefined}
                title={item.id === "countries" && selectedCountryLabel ? `${baseLabel} · ${selectedCountryLabel}` : baseLabel}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] transition",
                  isActive
                    ? "font-semibold text-white"
                    : "font-medium text-[#1b1b1b] hover:bg-[var(--item-tint)]"
                )}
                style={
                  {
                    ["--item-tint" as string]: item.tint,
                    backgroundColor: isActive ? item.accent : undefined,
                  } as CSSProperties
                }
              >
                <Icon
                  className="size-[17px] shrink-0 transition"
                  strokeWidth={2}
                  style={
                    isActive
                      ? { color: "rgba(255,255,255,0.95)" }
                      : { color: item.accent }
                  }
                />
                <span className="flex min-w-0 items-center justify-between gap-1.5">
                  <span className="truncate">{label}</span>
                  {item.id === "countries" && selectedCountry && !isActive && (
                    <span
                      className="size-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: item.accent }}
                    />
                  )}
                </span>
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-[#f0efec] px-3 py-3">
          <label
            htmlFor="sidebar-country"
            className="flex items-center gap-2 px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#a3a19b]"
          >
            <Globe2 className="size-3.5 text-[#2563eb]" />
            {copy.country}
          </label>
          <div className="relative mt-1.5">
            <select
              id="sidebar-country"
              value={selectedCountry?.code ?? ""}
              onChange={(event) => handleCountryChange(event.target.value)}
              className="h-10 w-full appearance-none rounded-lg border border-[#d8d8d4] bg-white pr-8 pl-3 text-[13px] font-medium text-[#1b1b1b] outline-none transition focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10"
              aria-label={copy.selectedCountryAria}
            >
              <option value="">{copy.allCountries}</option>
              {LAUNCH_COUNTRIES.map((country) => (
                <option key={country.code} value={country.code}>
                  {workspaceCountryLabel(locale, country)}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-[#9c9a94]" />
          </div>
          <p className="mt-1.5 px-3 text-[11px] leading-4 text-[#a3a19b]">
            {selectedCountryLabel
              ? copy.followSelected(selectedCountryLabel)
              : copy.followDefault}
          </p>
        </div>

        <div className="border-t border-[#f0efec] px-3 py-3">
          <p className="flex items-center gap-2 px-3 text-[11px] font-medium tracking-wide text-[#a3a19b]">
            <span
              className="size-1.5 rounded-full"
              style={{ background: "linear-gradient(90deg,#2563eb,#6d4fc4,#c2691e,#3e7a2e)" }}
            />
            {copy.tagline}
          </p>
        </div>
      </aside>
    </>
  )
}
