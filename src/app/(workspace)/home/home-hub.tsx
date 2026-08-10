"use client"

import { forwardRef, useEffect, useRef, useState, type KeyboardEvent } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { LAUNCH_COUNTRIES } from "@/data/launch-countries"
import { cn } from "@/lib/utils"
import { HomeOverview } from "./home-overview"
import { HomeSearchForm } from "./home-search-form"
import styles from "./home-search-motion.module.css"
import {
  CATEGORY_OPTIONS,
  CITIZENSHIP_OPTIONS,
  COUNTRY_OPTIONS,
  DEFAULT_OVERVIEW_COUNTRY,
  getOverviewOptionLabel,
  getOverviewSearchQuery,
  isCanonicalOverviewQuery,
  readOverviewSearchValues,
  toOverviewSearchQuery,
  type OverviewSearchValues,
} from "./home-overview-config"

const heroImage = (url: string) => url.replace(/\?.*$/, "?w=1600&h=700&fit=crop&auto=format")

export function HomeHub({ showDashboardBackLink = false }: { showDashboardBackLink?: boolean }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [values, setValues] = useState<OverviewSearchValues>(() => readOverviewSearchValues(searchParams))
  const [editingSearch, setEditingSearch] = useState(false)
  const compactSearchRef = useRef<HTMLButtonElement>(null)
  const searchQuery = getOverviewSearchQuery(searchParams)

  useEffect(() => {
    const nextValues = readOverviewSearchValues(searchParams)
    setValues(nextValues)
    setEditingSearch(false)
    if (getOverviewSearchQuery(searchParams) && !isCanonicalOverviewQuery(searchParams)) {
      router.replace(`/?${toOverviewSearchQuery(nextValues).toString()}`, { scroll: false })
    }
  }, [router, searchParams])

  const selectedCountry = LAUNCH_COUNTRIES.find((country) => country.code === values.country)
    ?? LAUNCH_COUNTRIES.find((country) => country.code === DEFAULT_OVERVIEW_COUNTRY)!

  const submitSearch = (nextValues: OverviewSearchValues) => {
    router.push(`/?${toOverviewSearchQuery(nextValues).toString()}`, { scroll: false })
  }

  const closeCompactEditor = () => {
    setValues(readOverviewSearchValues(searchParams))
    setEditingSearch(false)
    requestAnimationFrame(() => compactSearchRef.current?.focus())
  }

  if (searchQuery) {
    return (
      <div className="bg-white">
        <section className="relative h-56 overflow-visible bg-[#1b1b1b] sm:h-72 lg:h-80">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage(selectedCountry.image)})` }}
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10" />
          <div className="relative mx-auto flex h-full w-full max-w-6xl items-end px-4 pb-4 sm:px-8 sm:pb-5 lg:px-10">
            <CompactSearch
              ref={compactSearchRef}
              values={searchQuery}
              expanded={editingSearch}
              onEdit={() => setEditingSearch(true)}
              className={styles.compactSearchArrive}
            />
          </div>
        </section>
        <div className="mx-auto w-full max-w-6xl px-4 pb-3 sm:px-8 lg:px-10">
          {editingSearch && (
            <div className="mt-3 rounded-2xl border border-[#e7e6e3] bg-white p-3 shadow-sm sm:p-4">
              <HomeSearchForm
                values={values}
                onValuesChange={setValues}
                onSubmit={submitSearch}
                onCancel={closeCompactEditor}
                autoFocus
              />
            </div>
          )}
          <HomeOverview query={searchQuery} />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <section className="relative overflow-visible bg-[#1b1b1b]">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage(selectedCountry.image)})` }}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-black/55" />

        <div className="relative mx-auto w-full max-w-6xl px-4 pb-24 pt-16 sm:px-8 sm:pb-28 sm:pt-20 lg:px-10 lg:pt-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl lg:text-[56px] lg:leading-[1.08]">
              Millions of careers.
              <span className="block">Build your future.</span>
            </h1>
            {showDashboardBackLink && <Link href="/" className="mt-5 inline-flex min-h-11 items-center rounded-xl border border-white/35 bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1b1b1b]">Back to dashboard</Link>}
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto -mt-12 w-full max-w-6xl px-4 pb-10 sm:px-8 lg:px-10">
        <div className="rounded-2xl border border-[#e7e6e3] bg-white p-3 shadow-[0_16px_40px_-28px_rgba(27,27,27,0.45)] sm:p-4">
          <HomeSearchForm values={values} onValuesChange={setValues} onSubmit={submitSearch} />
        </div>
      </div>
    </div>
  )
}

type CompactSearchProps = {
  values: OverviewSearchValues
  expanded: boolean
  onEdit: () => void
  className?: string
}

const CompactSearch = forwardRef<HTMLButtonElement, CompactSearchProps>(function CompactSearch({ values, expanded, onEdit, className }, ref) {
  const labels = [
    { name: "Passport", value: getOverviewOptionLabel(CITIZENSHIP_OPTIONS, values.citizenship) || "Not selected" },
    { name: "To", value: getOverviewOptionLabel(COUNTRY_OPTIONS, values.country) || "Not selected" },
    { name: "Career", value: getOverviewOptionLabel(CATEGORY_OPTIONS, values.category) || "Not selected" },
  ]

  return (
    <button
      ref={ref}
      type="button"
      aria-expanded={expanded}
      aria-label={`Edit overview search: ${labels.map((item) => item.value).join(", ")}`}
      onClick={onEdit}
      onKeyDown={(event: KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          onEdit()
        }
      }}
      className={cn(
        "flex min-h-12 w-full items-center gap-2 rounded-2xl border border-[#e7e6e3] bg-white px-2.5 py-2 text-left shadow-sm transition hover:border-[#cfcdc7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35 focus-visible:ring-offset-2 sm:gap-3 sm:px-3.5 sm:py-2.5",
        expanded && "border-blue-200",
        className
      )}
    >
      <span className="flex min-w-0 flex-1 items-center">
        {labels.map((item, index) => (
          <span key={item.name} className={cn("min-w-0 flex-1 truncate px-2 text-xs text-[#3a3935] sm:px-4 sm:text-sm", index > 0 && "border-l border-[#e7e6e3]")}>
            <span className="text-[10px] font-medium text-[#8a8882] sm:text-[11px]">{item.name}:</span>
            <span className="ml-1 font-semibold sm:font-medium">{item.value}</span>
          </span>
        ))}
      </span>
      <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700">
        <Search className="size-4" />
      </span>
    </button>
  )
})
