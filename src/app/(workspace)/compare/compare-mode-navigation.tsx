import Link from "next/link"
import type { ComparisonPageType } from "@/lib/country-comparison"

export const COMPARE_MODE_NAV_ITEMS = [
  { type: "program", label: "Programs", href: "/compare?type=program" },
  { type: "country", label: "Countries", href: "/compare?type=country&goal=registered-nurse&profile=starting-from-scratch" },
  { type: "career", label: "Careers", href: "/compare?type=career&country=AU&profile=starting-from-scratch" },
] as const

type CompareModeNavigationProps = {
  activeType: ComparisonPageType
}

export function CompareModeNavigation({ activeType }: CompareModeNavigationProps) {
  return (
    <nav aria-label="Compare categories" className="mb-6 w-full max-w-md">
      <div className="grid grid-cols-3 gap-1 rounded-xl border border-[#e7e6e3] bg-[#fafaf9] p-1">
        {COMPARE_MODE_NAV_ITEMS.map((item) => {
          const isActive = item.type === activeType
          return (
            <Link
              key={item.type}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`inline-flex min-h-11 min-w-0 items-center justify-center whitespace-nowrap rounded-lg px-2 text-[13px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35 focus-visible:ring-offset-1 sm:px-3 ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-[#5f5d57] hover:bg-white hover:text-[#1b1b1b]"
              }`}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
