"use client"

import { forwardRef, useEffect, useRef, useState, type KeyboardEvent } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { LAUNCH_COUNTRIES } from "@/data/launch-countries"
import { cn } from "@/lib/utils"
import { HomeResults } from "./home-results"
import { HomeSearchForm } from "./home-search-form"
import styles from "./home-search-motion.module.css"
import {
  COUNTRY_OPTIONS,
  DEFAULT_COUNTRY,
  FIELD_OPTIONS,
  getOptionLabel,
  getPathwaySearchQuery,
  ORIGIN_OPTIONS,
  readFormValues,
  STATUS_OPTIONS,
  toHomeSearchQuery,
  type PathwaySearchValues,
} from "./home-search-config"

const heroImage = (url: string) => url.replace(/\?.*$/, "?w=1600&h=700&fit=crop&auto=format")

export function HomeHub({ showDashboardBackLink = false }: { showDashboardBackLink?: boolean }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [values, setValues] = useState<PathwaySearchValues>(() => readFormValues(searchParams))
  const [editingSearch, setEditingSearch] = useState(false)
  const compactSearchRef = useRef<HTMLButtonElement>(null)
  const searchQuery = getPathwaySearchQuery(searchParams)

  useEffect(() => {
    setValues(readFormValues(searchParams))
    setEditingSearch(false)
  }, [searchParams])

  const selectedCountry = LAUNCH_COUNTRIES.find((country) => country.code === values.country)
    ?? LAUNCH_COUNTRIES.find((country) => country.code === DEFAULT_COUNTRY)!

  const submitSearch = (nextValues: PathwaySearchValues) => {
    router.push(`/home?${toHomeSearchQuery(nextValues).toString()}`, { scroll: false })
  }

  const closeCompactEditor = () => {
    setValues(readFormValues(searchParams))
    setEditingSearch(false)
    requestAnimationFrame(() => compactSearchRef.current?.focus())
  }

  if (searchQuery) {
    return (
      <div className="bg-white">
        <section className="relative h-28 overflow-visible bg-[#1b1b1b] sm:h-40">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage(selectedCountry.image)})` }}
          />
          <div aria-hidden="true" className="absolute inset-0 bg-black/55" />
          <div className="relative mx-auto flex h-full w-full max-w-6xl items-end px-4 pb-3 sm:px-8 sm:pb-4 lg:px-10">
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
          <HomeResults query={searchQuery} />
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
              Explore, Compare, Find Your Future
            </h1>
            <p className="mt-5 max-w-2xl text-[16px] leading-7 text-white/90 sm:text-[17px]">
              Compare realistic study, work and visa routes with the conditions, timing, risks and official checks you need.
            </p>
            {showDashboardBackLink && <Link href="/home" className="mt-5 inline-flex min-h-11 items-center rounded-xl border border-white/35 bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#1b1b1b]">Back to dashboard</Link>}
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
  values: PathwaySearchValues
  expanded: boolean
  onEdit: () => void
  className?: string
}

const CompactSearch = forwardRef<HTMLButtonElement, CompactSearchProps>(function CompactSearch({ values, expanded, onEdit, className }, ref) {
  const labels = [
    { name: "Starting from", value: getOptionLabel(ORIGIN_OPTIONS, values.origin) || "Starting country not set" },
    { name: "Destination", value: getOptionLabel(COUNTRY_OPTIONS, values.country) },
    { name: "Target field", value: getOptionLabel(FIELD_OPTIONS, values.field) },
    { name: "Current situation", value: getOptionLabel(STATUS_OPTIONS, values.status) },
  ]

  return (
    <button
      ref={ref}
      type="button"
      aria-expanded={expanded}
      aria-label={`Edit pathway search: ${labels.map((item) => item.value).join(", ")}`}
      onClick={onEdit}
      onKeyDown={(event: KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          onEdit()
        }
      }}
      className={cn(
        "flex min-h-12 w-full items-center gap-3 rounded-2xl border border-[#e7e6e3] bg-white px-3 py-2 text-left shadow-sm transition hover:border-[#cfcdc7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35 focus-visible:ring-offset-2 sm:px-3.5 sm:py-2.5",
        expanded && "border-blue-200",
        className
      )}
    >
      <span className="grid min-w-0 flex-1 grid-cols-2 gap-x-3 gap-y-1 sm:grid-cols-4 sm:gap-0">
        {labels.map((item, index) => (
          <span key={item.name} className={cn("min-w-0 text-sm text-[#3a3935] sm:px-4", index > 0 && "sm:border-l sm:border-[#e7e6e3]")}>
            <span className="block truncate text-[11px] font-medium text-[#8a8882]">{item.name}</span>
            <span className="block truncate font-medium">{item.value}</span>
          </span>
        ))}
      </span>
      <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700">
        <Search className="size-4" />
      </span>
    </button>
  )
})
