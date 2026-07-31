"use client"

import Link from "next/link"
import { useMemo, useRef, useState } from "react"
import {
  ArrowUpRight,
  BadgeCheck,
  Banknote,
  Building2,
  Globe2,
  MapPin,
  ScrollText,
  Search,
  Sparkles,
  Stamp,
  Wallet,
} from "lucide-react"
import { LAUNCH_COUNTRIES } from "@/data/launch-countries"
import { getCountryExplorer } from "@/lib/workspace/country-explorer"
import { getCountryProfile } from "@/lib/workspace/country-profile"
import { VISA_CATALOG } from "@/lib/workspace/visa-catalog"
import { useSelectedCountry } from "@/components/workspace/country-context"
import { cn } from "@/lib/utils"

const POPULAR_CODES = ["AU", "CA", "US"] as const

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1570191913384-7b4ff11716e7?w=400&h=250&fit=crop&auto=format"

const heroImage = (url: string) => url.replace(/\?.*$/, "?w=1600&h=700&fit=crop&auto=format")

const KIND_STYLES: Record<string, string> = {
  Study: "bg-[#eef4ff] text-[#2563eb]",
  Work: "bg-[#fbf0e7] text-[#c2691e]",
  Skilled: "bg-[#f3f0fa] text-[#6d4fc4]",
  "Working holiday": "bg-[#edf5ea] text-[#3e7a2e]",
  Family: "bg-[#f5f3f0] text-[#6f6d68]",
  Temporary: "bg-[#f5f3f0] text-[#6f6d68]",
}

function formatMoney(value: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}

function SourceLink({ label, url }: { label: string; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-1 text-[11.5px] font-medium text-[#9c9a94] transition hover:text-[#2563eb]"
    >
      {label} <ArrowUpRight className="size-3" />
    </a>
  )
}

function StatCard({
  icon,
  label,
  value,
  hint,
  accent,
  href,
}: {
  icon: React.ReactNode
  label: string
  value: string
  hint?: string
  accent: string
  href?: string
}) {
  const content = (
    <>
      <div className="flex items-center gap-2">
        <span className={cn("grid size-8 place-items-center rounded-lg", accent)}>{icon}</span>
        <p className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-[#a3a19b]">
          {label}
        </p>
      </div>
      <p className="mt-3 text-[24px] font-semibold tracking-[-0.02em] text-[#1b1b1b]">{value}</p>
      {hint && <p className="mt-1 text-[12.5px] leading-5 text-[#6f6d68]">{hint}</p>}
    </>
  )
  if (href) {
    return (
      <Link
        href={href}
        className="group block rounded-xl border border-[#e7e6e3] bg-white p-4 transition hover:-translate-y-0.5 hover:border-[#6d4fc4]/40 hover:shadow-lg hover:shadow-[#6d4fc4]/5"
      >
        {content}
      </Link>
    )
  }
  return <div className="rounded-xl border border-[#e7e6e3] bg-white p-4">{content}</div>
}

export function CountriesExplorer({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const { selectedCountry, setSelectedCountry } = useSelectedCountry()

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const countries = LAUNCH_COUNTRIES.filter((country) => {
      if (!q) return true
      if (country.name.toLowerCase().includes(q)) return true
      if (country.currency.toLowerCase().includes(q)) return true
      const explorer = getCountryExplorer(country.code)
      return explorer?.regions.some(
        (region) =>
          region.name.toLowerCase().includes(q) ||
          region.cities.some((city) => city.toLowerCase().includes(q))
      )
    })
    return countries
  }, [query])

  function pickCountry(code: string, name: string, currency: string) {
    setSelectedCountry({ code, name, currency })
    setQuery(name)
    setOpen(false)
  }

  function pick(code: (typeof LAUNCH_COUNTRIES)[number]) {
    pickCountry(code.code, code.name, code.currency)
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) {
      if (event.key === "Escape") setOpen(false)
      return
    }
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActiveIndex((i) => (i + 1) % results.length)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex((i) => (i - 1 + results.length) % results.length)
    } else if (event.key === "Enter") {
      event.preventDefault()
      pick(results[activeIndex])
    } else if (event.key === "Escape") {
      setOpen(false)
    }
  }

  const code = selectedCountry?.code ?? ""
  const countryData = LAUNCH_COUNTRIES.find((c) => c.code === code)
  const explorer = code ? getCountryExplorer(code) : null
  const profile = code ? getCountryProfile(code) : null
  const visas = useMemo(
    () => (code ? VISA_CATALOG.filter((visa) => visa.countryCode === code) : []),
    [code]
  )

  const popular = LAUNCH_COUNTRIES.filter((c) => (POPULAR_CODES as readonly string[]).includes(c.code))
  const cityCount = explorer?.regions.reduce((n, r) => n + r.cities.length, 0) ?? 0
  const bgImage = countryData ? heroImage(countryData.image) : heroImage(DEFAULT_IMAGE)

  return (
    <div>
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20"
        />
        <div className="relative mx-auto w-full max-w-6xl px-4 pb-32 pt-16 sm:px-8 sm:pt-20 lg:px-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">
            Countries
          </p>
          {countryData ? (
            <>
              <h1 className="mt-2 text-[34px] font-semibold leading-tight tracking-[-0.025em] text-white sm:text-[44px]">
                {countryData.name}
              </h1>
              <p className="mt-2 text-[14px] font-medium text-white/85">
                {countryData.code} · {explorer?.regions.length ?? 0} regions · {cityCount} cities ·{" "}
                {countryData.currency}
              </p>
            </>
          ) : (
            <>
              <h1 className="mt-2 text-[34px] font-semibold leading-tight tracking-[-0.025em] text-white sm:text-[44px]">
                Explore countries
              </h1>
              <p className="mt-2 text-[14px] font-medium text-white/85">
                Pick a destination to open its dashboard
              </p>
            </>
          )}
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-4 pb-10 sm:px-8 lg:px-10">
        <div className="-mt-9">
          <div className="rounded-2xl border border-[#e7e6e3] bg-white p-2 shadow-xl shadow-black/10">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 z-10 size-4 -translate-y-1/2 text-[#9c9a94]" />
              <input
                ref={inputRef}
                type="search"
                role="combobox"
                value={query}
                onFocus={() => setOpen(true)}
                onBlur={() => window.setTimeout(() => setOpen(false), 120)}
                onChange={(event) => {
                  setQuery(event.target.value)
                  setOpen(true)
                  setActiveIndex(0)
                }}
                onKeyDown={onKeyDown}
                placeholder="Search by country, currency, region or city…"
                aria-label="Search countries"
                aria-expanded={open}
                aria-controls="country-suggestions"
                aria-activedescendant={open ? `country-option-${activeIndex}` : undefined}
                className="h-12 w-full appearance-none rounded-xl border border-transparent bg-[#fafaf8] pr-12 pl-11 text-[15px] text-[#1b1b1b] outline-none transition placeholder:text-[#a3a19b] focus:border-[#2563eb] focus:ring-4 focus:ring-[#2563eb]/10 [&::-webkit-search-cancel-button]:hidden"
              />
              {open && results.length > 0 && (
                <div className="absolute inset-x-0 top-[calc(100%+6px)] z-20 overflow-hidden rounded-xl border border-[#e7e6e3] bg-white shadow-xl shadow-black/5">
                  <p className="border-b border-[#f0efec] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#a3a19b]">
                    {results.length} {results.length === 1 ? "destination" : "destinations"}
                  </p>
                  <ul role="listbox" id="country-suggestions" className="max-h-72 overflow-y-auto">
                    {results.map((country, index) => (
                      <li key={country.code}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={activeIndex === index}
                          id={`country-option-${index}`}
                          onMouseDown={(event) => {
                            event.preventDefault()
                            pick(country)
                          }}
                          onMouseEnter={() => setActiveIndex(index)}
                          className={cn(
                            "flex w-full items-center gap-3 px-4 py-2.5 text-left transition",
                            activeIndex === index ? "bg-[#eef4ff]" : "hover:bg-[#fafaf8]"
                          )}
                        >
                          <img
                            src={country.image}
                            alt=""
                            width={40}
                            height={28}
                            className="size-8 shrink-0 rounded-md object-cover"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center gap-1.5">
                              <span
                                className={cn(
                                  "truncate text-[13.5px] font-medium",
                                  activeIndex === index ? "text-[#2563eb]" : "text-[#1b1b1b]"
                                )}
                              >
                                {country.name}
                              </span>
                              {selectedCountry?.code === country.code && (
                                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#edf5ea] px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-[#3e7a2e]">
                                  <BadgeCheck className="size-2.5" /> Active
                                </span>
                              )}
                            </span>
                            <span className="block text-[11.5px] text-[#a3a19b]">
                              {country.currency}
                            </span>
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2 px-1">
            <span className="text-[12px] font-medium text-[#a3a19b]">Popular:</span>
            {popular.map((country) => (
              <button
                key={country.code}
                type="button"
                onMouseDown={(event) => {
                  event.preventDefault()
                  pick(country)
                }}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition",
                  selectedCountry?.code === country.code
                    ? "border-[#2563eb] bg-[#eef4ff] text-[#2563eb]"
                    : "border-[#e0dfdb] bg-white text-[#4d4c48] hover:border-[#2563eb] hover:text-[#2563eb]"
                )}
              >
                <Globe2 className="size-3" /> {country.name}
              </button>
            ))}
          </div>
        </div>

        {countryData && explorer && profile ? (
          <div className="mt-8">
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard
                icon={<Stamp className="size-4 text-[#6d4fc4]" />}
                accent="bg-[#f3f0fa]"
                label="Visa options"
                value={String(visas.length)}
                hint={`${visas.length} ${visas.length === 1 ? "pathway" : "pathways"} to study, work or settle`}
                href="/visas"
              />
              <StatCard
                icon={<Banknote className="size-4 text-[#2563eb]" />}
                accent="bg-[#eef4ff]"
                label="Average salary"
                value={
                  profile.salary
                    ? formatMoney(profile.salary.value, profile.salary.currency)
                    : "—"
                }
                hint={profile.salary ? profile.salary.unit : "Source pending — data coming soon"}
              />
              <StatCard
                icon={<Wallet className="size-4 text-[#c2691e]" />}
                accent="bg-[#fbf0e7]"
                label="Living costs"
                value={
                  profile.livingCost
                    ? formatMoney(profile.livingCost.value, profile.livingCost.currency)
                    : "—"
                }
                hint={profile.livingCost ? profile.livingCost.unit : "Source pending — data coming soon"}
              />
            </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <div className="min-w-0 rounded-xl border border-[#e7e6e3] bg-white lg:col-span-2">
              <div className="flex items-center justify-between border-b border-[#f0efec] px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <ScrollText className="size-4 text-[#6d4fc4]" />
                  <h3 className="text-[14.5px] font-semibold text-[#1b1b1b]">Visa options</h3>
                </div>
                <span className="text-[11.5px] font-medium text-[#a3a19b]">
                  {visas.length} pathways
                </span>
              </div>
              <ul className="divide-y divide-[#f0efec]">
                {visas.map((visa) => (
                  <li key={visa.name} className="flex items-start gap-3 px-5 py-3.5">
                    <span
                      className={cn(
                        "mt-0.5 inline-flex shrink-0 rounded-md px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide",
                        KIND_STYLES[visa.kind] ?? KIND_STYLES.Temporary
                      )}
                    >
                      {visa.kind}
                    </span>
                    <span className="min-w-0 flex-1">
                      <a
                        href={visa.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex items-center gap-1 text-[13.5px] font-semibold text-[#1b1b1b] transition hover:text-[#2563eb]"
                      >
                        {visa.name}
                        <ArrowUpRight className="size-3.5 text-[#c4c2bc] transition group-hover:text-[#2563eb]" />
                      </a>
                      <span className="mt-0.5 block text-[12.5px] leading-5 text-[#6f6d68]">
                        {visa.note}
                      </span>
                    </span>
                    <span className="shrink-0 pt-0.5 text-[11px] font-medium text-[#c4c2bc]">
                      {visa.authority}
                    </span>
                  </li>
                ))}
              </ul>
              {visas.length === 0 && (
                <p className="px-5 py-8 text-center text-[13px] text-[#a3a19b]">
                  Visa pathways for {countryData.name} are being catalogued.
                </p>
              )}
            </div>

            <div className="flex min-w-0 flex-col gap-4">
              <div className="rounded-xl border border-[#e7e6e3] bg-white">
                <div className="flex items-center gap-2.5 border-b border-[#f0efec] px-5 py-4">
                  <Sparkles className="size-4 text-[#2563eb]" />
                  <h3 className="text-[14.5px] font-semibold text-[#1b1b1b]">
                    Salary &amp; work opportunities
                  </h3>
                </div>
                <div className="px-5 py-4">
                  {profile.salary ? (
                    <>
                      <p className="text-[26px] font-semibold tracking-[-0.02em] text-[#1b1b1b]">
                        {formatMoney(profile.salary.value, profile.salary.currency)}
                      </p>
                      <p className="text-[12px] font-medium text-[#6f6d68]">{profile.salary.unit}</p>
                      <p className="mt-1 text-[11.5px] leading-4.5 text-[#a3a19b]">
                        {profile.salary.note}
                      </p>
                      <div className="mt-2">
                        <SourceLink label={profile.salary.source} url={profile.salary.url} />
                      </div>
                    </>
                  ) : (
                    <p className="text-[13px] leading-5.5 text-[#a3a19b]">
                      Average salary data for {countryData.name} is being sourced.
                    </p>
                  )}
                </div>
                {profile.workOpportunities && (
                  <div className="border-t border-[#f0efec] px-5 py-4">
                    <p className="text-[12.5px] font-semibold text-[#1b1b1b]">
                      {profile.workOpportunities.headline}
                    </p>
                    <ul className="mt-2.5 space-y-2">
                      {profile.workOpportunities.items.map((item) => (
                        <li key={item.title} className="flex items-center gap-2">
                          <span className="size-1.5 shrink-0 rounded-full bg-[#2563eb]" />
                          <span className="min-w-0">
                            <span className="block truncate text-[12.5px] font-medium text-[#4d4c48]">
                              {item.title}
                            </span>
                          </span>
                          <span className="ml-auto shrink-0 text-[11px] font-medium text-[#c4c2bc]">
                            {item.detail}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3">
                      <SourceLink label={profile.workOpportunities.source} url={profile.workOpportunities.url} />
                    </div>
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-[#e7e6e3] bg-white">
                <div className="flex items-center gap-2.5 border-b border-[#f0efec] px-5 py-4">
                  <Building2 className="size-4 text-[#c2691e]" />
                  <h3 className="text-[14.5px] font-semibold text-[#1b1b1b]">Living costs</h3>
                </div>
                <div className="px-5 py-4">
                  {profile.livingCost ? (
                    <>
                      <p className="text-[26px] font-semibold tracking-[-0.02em] text-[#1b1b1b]">
                        {formatMoney(profile.livingCost.value, profile.livingCost.currency)}
                      </p>
                      <p className="text-[12px] font-medium text-[#6f6d68]">
                        {profile.livingCost.unit}
                      </p>
                      <p className="mt-1 text-[11.5px] leading-4.5 text-[#a3a19b]">
                        {profile.livingCost.note}
                      </p>
                      <div className="mt-2">
                        <SourceLink label={profile.livingCost.source} url={profile.livingCost.url} />
                      </div>
                    </>
                  ) : (
                    <p className="text-[13px] leading-5.5 text-[#a3a19b]">
                      Rent and cost-of-living data for {countryData.name} is being sourced.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-[#e7e6e3] bg-white">
            <div className="flex items-center gap-2.5 border-b border-[#f0efec] px-5 py-4">
              <MapPin className="size-4 text-[#3e7a2e]" />
              <h3 className="text-[14.5px] font-semibold text-[#1b1b1b]">Regions &amp; cities</h3>
              <span className="ml-auto text-[11.5px] font-medium text-[#a3a19b]">
                {explorer.regions.reduce((n, r) => n + r.cities.length, 0)} cities
              </span>
            </div>
            <div className="grid gap-x-8 gap-y-5 px-5 py-5 sm:grid-cols-2">
              {explorer.regions.map((region) => (
                <div key={region.name}>
                  <h4 className="flex items-center gap-1.5 text-[13px] font-semibold text-[#1b1b1b]">
                    <MapPin className="size-3.5 text-[#9c9a94]" />
                    {region.name}
                    <span className="text-[11px] font-medium text-[#c4c2bc]">{region.cities.length}</span>
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {region.cities.map((city) => (
                      <span
                        key={city}
                        className="rounded-md border border-[#e7e6e3] bg-[#fafaf8] px-2.5 py-1 text-[12px] font-medium text-[#4d4c48]"
                      >
                        {city}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center justify-center rounded-xl border border-dashed border-[#e7e6e3] bg-white/50 px-6 py-16 text-center">
          <span className="grid size-12 place-items-center rounded-2xl bg-[#eef4ff]">
            <Globe2 className="size-5 text-[#2563eb]" />
          </span>
          <h3 className="mt-4 text-[16px] font-semibold text-[#1b1b1b]">
            Pick a country to open its dashboard
          </h3>
          <p className="mt-1.5 max-w-md text-[13px] leading-5.5 text-[#6f6d68]">
            Each country dashboard shows visa options, average salary, living costs and work
            opportunities — pick one from the search bar or a popular chip above.
          </p>
        </div>
      )}
      </div>
    </div>
  )
}
