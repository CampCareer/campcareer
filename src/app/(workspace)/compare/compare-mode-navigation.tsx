import Link from "next/link"
import { Check, ChevronDown } from "lucide-react"
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
  const activeItem = COMPARE_MODE_NAV_ITEMS.find((item) => item.type === activeType)

  return (
    <nav aria-label="Compare category" className="relative z-30 mb-3 inline-block">
      <details className="group relative">
        <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-xl border border-[#deddd9] bg-white px-3.5 text-sm transition hover:bg-[#fafaf9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35 [&::-webkit-details-marker]:hidden">
          <span className="font-semibold text-[#1b1b1b]">Compare</span>
          {activeItem ? (
            <>
              <span aria-hidden="true" className="text-[#b0ada6]">·</span>
              <span className="font-medium text-[#6f6d68]">{activeItem.label}</span>
            </>
          ) : null}
          <ChevronDown aria-hidden="true" className="ml-1 size-4 text-[#6f6d68] transition-transform group-open:rotate-180" />
        </summary>

        <div className="absolute left-0 top-full z-40 mt-2 w-56 rounded-2xl border border-[#deddd9] bg-white p-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.12)]">
          {COMPARE_MODE_NAV_ITEMS.map((item) => {
            const isActive = item.type === activeType
            return (
              <Link
                key={item.type}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className="flex min-h-11 items-center justify-between rounded-xl px-3 text-sm font-semibold text-[#34332f] transition hover:bg-[#f6f6f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35"
              >
                <span>{item.label}</span>
                {isActive ? <Check aria-hidden="true" className="size-4 text-blue-600" /> : null}
              </Link>
            )
          })}
        </div>
      </details>
    </nav>
  )
}
