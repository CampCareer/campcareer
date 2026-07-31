"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { CSSProperties } from "react"
import { ChevronDown, Globe2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { WORKSPACE_NAV_ITEMS } from "@/lib/workspace/navigation"
import { LAUNCH_COUNTRIES } from "@/data/launch-countries"
import { useSelectedCountry } from "./country-context"

type WorkspaceSidebarProps = {
  open: boolean
  onClose: () => void
}

export function WorkspaceSidebar({ open, onClose }: WorkspaceSidebarProps) {
  const pathname = usePathname()
  const { selectedCountry, setSelectedCountry } = useSelectedCountry()

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
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            const Icon = item.icon
            const label =
              item.id === "countries" && selectedCountry ? selectedCountry.name : item.label
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={onClose}
                aria-current={isActive ? "page" : undefined}
                title={item.id === "countries" && selectedCountry ? `${item.label} · ${selectedCountry.name}` : item.label}
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
            Country
          </label>
          <div className="relative mt-1.5">
            <select
              id="sidebar-country"
              value={selectedCountry?.code ?? ""}
              onChange={(event) => handleCountryChange(event.target.value)}
              className="h-10 w-full appearance-none rounded-lg border border-[#d8d8d4] bg-white pr-8 pl-3 text-[13px] font-medium text-[#1b1b1b] outline-none transition focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10"
              aria-label="Selected country"
            >
              <option value="">All countries</option>
              {LAUNCH_COUNTRIES.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-[#9c9a94]" />
          </div>
          <p className="mt-1.5 px-3 text-[11px] leading-4 text-[#a3a19b]">
            {selectedCountry
              ? `Visas, occupation and programs follow ${selectedCountry.name}.`
              : "Visas, occupation and programs follow the selected country."}
          </p>
        </div>

        <div className="border-t border-[#f0efec] px-3 py-3">
          <p className="flex items-center gap-2 px-3 text-[11px] font-medium tracking-wide text-[#a3a19b]">
            <span
              className="size-1.5 rounded-full"
              style={{ background: "linear-gradient(90deg,#2563eb,#6d4fc4,#c2691e,#3e7a2e)" }}
            />
            Plan. Compare. Go.
          </p>
        </div>
      </aside>
    </>
  )
}
