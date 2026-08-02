"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { ChevronDown, Plus, X } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  COUNTRY_COMPARE_MAX_LOCATIONS,
  addCountrySlot,
  buildCountryCompareHref,
  cancelEmptyCountrySlot,
  completeCountryLocations,
  getCountryCompareCityOption,
  removeCountrySlot,
  replaceCityInSlot,
  replaceCountryInSlot,
  slotsFromCountryLocations,
  parseCountryComparisonState,
  type CountryCompareLocation,
  type CountryCompareSlot,
} from "@/lib/country-comparison"
import {
  COUNTRY_COMPARE_CATALOG,
  getCountryCompareCities,
  getCountryCompareCity,
  getCountryCompareCountry,
  type CountryCompareCode,
} from "@/data/country-comparison/locations"
import {
  getRegisteredNurseCountryShell,
} from "@/data/country-comparison/registered-nurse"
import {
  formatCountryComparisonRow,
  REGISTERED_NURSE_MATRIX_ROWS,
} from "@/data/country-comparison/registered-nurse-rows"

type CountriesCompareMatrixProps = {
  initialLocations: readonly CountryCompareLocation[]
}

type MatrixRow = {
  key: string
  label: string
  section: string
  values: readonly string[]
}

const NOT_AVAILABLE = "Not available"
const NOTE = "Verified country, city and pathway data will appear here as it becomes available."

export default function CountriesCompareMatrix({ initialLocations }: CountriesCompareMatrixProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlKey = searchParams.toString()
  const writtenUrlKey = useRef<string | null>(null)
  const parsed = useMemo(() => parseCountryComparisonState(searchParams), [searchParams])
  const [slots, setSlots] = useState<CountryCompareSlot[]>(() => slotsFromCountryLocations(initialLocations))

  useEffect(() => {
    if (writtenUrlKey.current === urlKey) {
      writtenUrlKey.current = null
      return
    }
    setSlots(slotsFromCountryLocations(parsed.locations))
  }, [parsed.locations, urlKey])

  const completeCount = completeCountryLocations(slots).length
  const hasIncompleteSlot = slots.some((slot) => !(slot.countryCode && slot.citySlug))
  const canAddCountry = completeCount >= 2 && completeCount < COUNTRY_COMPARE_MAX_LOCATIONS && !hasIncompleteSlot
  const rows = useMemo(() => buildMatrixRows(slots), [slots])
  const sharedSelectorProps = {
    selectedCountryCodes: slots.flatMap((current) => current.countryCode ? [current.countryCode] : []),
    onCountryChange: handleCountryChange,
    onCityChange: handleCityChange,
    onRemove: handleRemove,
    onCancel: handleCancel,
  }

  function syncUrl(nextSlots: readonly CountryCompareSlot[]) {
    const href = buildCountryCompareHref(completeCountryLocations(nextSlots))
    writtenUrlKey.current = new URL(href, "https://campcareer.local").searchParams.toString()
    router.replace(href, { scroll: false })
  }

  function commit(nextSlots: CountryCompareSlot[]) {
    setSlots(nextSlots)
    syncUrl(nextSlots)
  }

  function handleCountryChange(index: number, rawCountryCode: string) {
    const country = getCountryCompareCountry(rawCountryCode)
    if (!country) return
    commit(replaceCountryInSlot(slots, index, country.productCode))
  }

  function handleCityChange(index: number, rawCitySlug: string) {
    const slot = slots[index]
    if (!slot.countryCode) return
    const city = getCountryCompareCity(slot.countryCode, rawCitySlug)
    if (!city) return
    commit(replaceCityInSlot(slots, index, city))
  }

  function handleRemove(index: number) {
    commit(removeCountrySlot(slots, index))
  }

  function handleAdd() {
    setSlots(addCountrySlot(slots))
  }

  function handleCancel(index: number) {
    setSlots(cancelEmptyCountrySlot(slots, index))
  }

  const selectionHeader = (
    <CompactCountrySelection
      slots={slots}
      {...sharedSelectorProps}
    />
  )

  return (
    <section className="mt-7" aria-labelledby="country-comparison-heading">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="country-comparison-heading" className="text-xl font-semibold tracking-[-0.02em] text-[#1b1b1b]">Comparison</h2>
          <p className="mt-1 text-sm leading-6 text-[#6f6d68]">Select a country and city for each comparison column.</p>
        </div>
        {completeCount >= 2 && <p className="text-sm font-medium text-[#5f5d57]">{completeCount} countries</p>}
      </div>

      {completeCount === 0 && (
        <>
          {selectionHeader}
          <p className="mt-5 text-sm font-medium text-[#4a4842]" role="status">Select two countries and cities to start comparing.</p>
        </>
      )}
      {completeCount === 1 && (
        <>
          {selectionHeader}
          <p className="mt-5 text-sm font-medium text-[#4a4842]" role="status">Select one more country and city to compare.</p>
        </>
      )}

      {completeCount >= 2 && (
        <>
          <DesktopCountryMatrix
            rows={rows}
            slots={slots}
            canAddCountry={canAddCountry}
            onAddCountry={handleAdd}
            {...sharedSelectorProps}
          />
          <MobileCountryMatrix
            rows={rows}
            slots={slots}
            canAddCountry={canAddCountry}
            onAddCountry={handleAdd}
            {...sharedSelectorProps}
          />
          <p className="mt-4 text-xs leading-5 text-[#6f6d68]">{NOTE}</p>
        </>
      )}
    </section>
  )
}

function CompactCountrySelection({
  slots,
  ...selectorProps
}: {
  slots: readonly CountryCompareSlot[]
  selectedCountryCodes: readonly CountryCompareCode[]
  onCountryChange: (index: number, countryCode: string) => void
  onCityChange: (index: number, citySlug: string) => void
  onRemove: (index: number) => void
  onCancel: (index: number) => void
}) {
  return (
    <div className="mt-5 grid gap-2 border-y border-[#e7e6e3] py-2 md:grid-cols-2 md:gap-4" aria-label="Country comparison columns">
      {slots.map((slot, index) => (
        <CountryColumnControls
          key={`${index}-${slot.countryCode ?? "empty"}-${slot.citySlug ?? "empty"}`}
          index={index}
          slot={slot}
          compact
          {...selectorProps}
        />
      ))}
    </div>
  )
}

function CountryColumnControls({
  index,
  slot,
  selectedCountryCodes,
  onCountryChange,
  onCityChange,
  onRemove,
  onCancel,
  compact = false,
}: {
  index: number
  slot: CountryCompareSlot
  selectedCountryCodes: readonly CountryCompareCode[]
  onCountryChange: (index: number, countryCode: string) => void
  onCityChange: (index: number, citySlug: string) => void
  onRemove: (index: number) => void
  onCancel: (index: number) => void
  compact?: boolean
}) {
  const country = slot.countryCode ? getCountryCompareCountry(slot.countryCode) : null
  const city = country && slot.citySlug ? getCountryCompareCityOption(country.productCode, slot.citySlug) : null
  const countryLabelId = `country-column-${index}`
  const cityLabelId = `city-column-${index}`
  const countryName = country?.countryName ?? "Select country"
  const cityName = city?.cityName ?? (country ? "Select city" : "Select a country first")

  return (
    <div className={`flex min-w-0 items-center gap-2 ${compact ? "py-1" : "flex-col items-stretch gap-3"}`}>
      <div className="min-w-0 flex-1">
        <div className={`grid gap-2 ${compact ? "sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]" : "grid-cols-1"}`}>
          <div className="relative min-w-0 rounded-lg border border-[#d8d6d0] bg-white transition focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/20">
            <div aria-hidden="true" className="pointer-events-none flex min-h-11 items-center gap-2 px-3">
              <span className="truncate text-sm font-semibold text-[#1b1b1b]">{countryName}</span>
              {country && <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.08em] text-[#6f6d68]">{country.productCode}</span>}
              <ChevronDown className="ml-auto size-4 shrink-0 text-[#6f6d68]" aria-hidden="true" />
            </div>
            <select
              id={countryLabelId}
              aria-label={`Country ${index + 1}`}
              value={slot.countryCode ?? ""}
              onChange={(event) => onCountryChange(index, event.target.value)}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            >
              <option value="">Select country</option>
              {COUNTRY_COMPARE_CATALOG.map((option) => (
                <option key={option.productCode} value={option.productCode} disabled={option.productCode !== slot.countryCode && selectedCountryCodes.includes(option.productCode)}>
                  {option.countryName} ({option.productCode})
                </option>
              ))}
            </select>
          </div>

          <div className="relative min-w-0 rounded-lg border border-[#d8d6d0] bg-white transition focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/20">
            <div aria-hidden="true" className={`pointer-events-none flex min-h-11 items-center gap-2 px-3 ${!country ? "text-[#99958d]" : ""}`}>
              <span className="truncate text-sm font-semibold">{cityName}</span>
              <ChevronDown className="ml-auto size-4 shrink-0 text-[#6f6d68]" aria-hidden="true" />
            </div>
            <select
              id={cityLabelId}
              aria-label={`City for ${country?.countryName ?? `country ${index + 1}`}`}
              value={city?.citySlug ?? ""}
              disabled={!country}
              onChange={(event) => onCityChange(index, event.target.value)}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
            >
              <option value="">{country ? "Select city" : "Select a country first"}</option>
              {(country ? getCountryCompareCities(country.productCode) : []).map((option) => (
                <option key={option.citySlug} value={option.citySlug}>{option.cityName}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {slot.countryCode && slot.citySlug ? (
        <button
          type="button"
          onClick={() => onRemove(index)}
          aria-label={`Remove ${country?.countryName ?? "country"} and ${city?.cityName ?? "city"} from comparison`}
          className="inline-flex min-h-11 shrink-0 items-center rounded-xl px-2 text-sm font-semibold text-[#5f5d57] transition hover:bg-[#f5f4f1] hover:text-[#1b1b1b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35"
        >
          <X aria-hidden="true" className="mr-1.5 size-4" /> Remove
        </button>
      ) : slot.optional ? (
        <button
          type="button"
          onClick={() => onCancel(index)}
          aria-label={`Cancel country ${index + 1}`}
          className="inline-flex min-h-11 shrink-0 items-center rounded-xl px-2 text-sm font-semibold text-[#5f5d57] transition hover:bg-[#f5f4f1] hover:text-[#1b1b1b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35"
        >
          Cancel
        </button>
      ) : null}
    </div>
  )
}

function DesktopCountryMatrix({
  rows,
  slots,
  canAddCountry,
  onAddCountry,
  ...selectorProps
}: {
  rows: readonly MatrixRow[]
  slots: readonly CountryCompareSlot[]
  canAddCountry: boolean
  onAddCountry: () => void
  selectedCountryCodes: readonly CountryCompareCode[]
  onCountryChange: (index: number, countryCode: string) => void
  onCityChange: (index: number, citySlug: string) => void
  onRemove: (index: number) => void
  onCancel: (index: number) => void
}) {
  return (
    <div className="mt-6 hidden overflow-x-auto rounded-2xl border border-[#e7e6e3] bg-white md:block">
      {canAddCountry && (
        <div className="flex justify-end border-b border-[#e7e6e3] px-3 py-2">
          <button
            type="button"
            onClick={onAddCountry}
            aria-label="Add another country"
            className="inline-flex size-11 items-center justify-center rounded-lg border border-[#d8d6d0] text-blue-700 transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35 focus-visible:ring-offset-2"
          >
            <Plus aria-hidden="true" className="size-4" />
          </button>
        </div>
      )}
      <table className="w-full min-w-[760px] border-collapse text-left text-sm" style={{ minWidth: `${180 + slots.length * 220}px` }}>
        <thead className="bg-[#fafaf9]">
          <tr>
            <th scope="col" className="sticky left-0 z-20 w-44 border-b border-[#e7e6e3] bg-[#fafaf9] px-4 py-4 font-semibold text-[#4a4842]">Compare</th>
            {slots.map((slot, index) => {
              return (
                <th key={`${index}-${slot.countryCode ?? "empty"}-${slot.citySlug ?? "empty"}`} scope="col" className="min-w-52 border-b border-l border-[#e7e6e3] px-3 py-3 align-top">
                  <CountryColumnControls index={index} slot={slot} {...selectorProps} />
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <MatrixDesktopRow key={row.key} row={row} isSectionStart={index === 0 || rows[index - 1].section !== row.section} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function MatrixDesktopRow({ row, isSectionStart }: { row: MatrixRow; isSectionStart: boolean }) {
  return (
    <>
      {isSectionStart && (
        <tr>
          <th colSpan={row.values.length + 1} className="border-b border-[#e7e6e3] bg-[#f5f4f1] px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.1em] text-[#6f6d68]">{row.section}</th>
        </tr>
      )}
      <tr>
        <th scope="row" className="sticky left-0 z-10 border-b border-[#e7e6e3] bg-[#fafaf9] px-4 py-3 font-medium text-[#4a4842]">{row.label}</th>
        {row.values.map((value, index) => <td key={`${row.key}-${index}`} className="align-top border-b border-l border-[#e7e6e3] px-4 py-3 text-sm font-semibold leading-5 text-[#1b1b1b]">{value}</td>)}
      </tr>
    </>
  )
}

function MobileCountryMatrix({
  rows,
  slots,
  canAddCountry,
  onAddCountry,
  ...selectorProps
}: {
  rows: readonly MatrixRow[]
  slots: readonly CountryCompareSlot[]
  canAddCountry: boolean
  onAddCountry: () => void
  selectedCountryCodes: readonly CountryCompareCode[]
  onCountryChange: (index: number, countryCode: string) => void
  onCityChange: (index: number, citySlug: string) => void
  onRemove: (index: number) => void
  onCancel: (index: number) => void
}) {
  return (
    <div className="mt-6 md:hidden" aria-label="Country comparison details">
      <div className="rounded-2xl border border-[#e7e6e3] bg-white px-3 py-2" aria-label="Country comparison columns">
        <div className="flex items-center justify-between gap-3 border-b border-[#e7e6e3] pb-2">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[#6f6d68]">Compared countries</p>
          {canAddCountry && (
            <button
              type="button"
              onClick={onAddCountry}
              aria-label="Add another country"
              className="inline-flex size-11 items-center justify-center rounded-lg border border-[#d8d6d0] text-blue-700 transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35 focus-visible:ring-offset-2"
            >
              <Plus aria-hidden="true" className="size-4" />
            </button>
          )}
        </div>
        <div className="divide-y divide-[#e7e6e3]">
          {slots.map((slot, index) => (
            <CountryColumnControls
              key={`${index}-${slot.countryCode ?? "empty"}-${slot.citySlug ?? "empty"}`}
              index={index}
              slot={slot}
              compact
              {...selectorProps}
            />
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {Array.from(new Set(rows.map((row) => row.section))).map((section) => (
          <section key={section} aria-labelledby={`mobile-country-section-${section.toLowerCase().replaceAll(" ", "-")}`}>
            <h3 id={`mobile-country-section-${section.toLowerCase().replaceAll(" ", "-")}`} className="text-xs font-semibold uppercase tracking-[0.1em] text-[#6f6d68]">{section}</h3>
            <div className="mt-2 space-y-4">
              {rows.filter((row) => row.section === section).map((row) => (
                <div key={row.key}>
                  <p className="text-sm font-semibold text-[#4a4842]">{row.label}</p>
                  <div className="mt-2 space-y-2">
                    {slots.map((slot, index) => {
                      if (!slot.countryCode || !slot.citySlug) return null
                      const country = getCountryCompareCountry(slot.countryCode)
                      const city = getCountryCompareCity(slot.countryCode, slot.citySlug)
                      return (
                        <div key={`${row.key}-${slot.countryCode}-${slot.citySlug}`} className="rounded-xl border border-[#e7e6e3] bg-white p-3">
                          <p className="text-xs font-semibold text-[#6f6d68]">{country?.productCode} · {city?.cityName}</p>
                          <p className="mt-1 text-sm font-semibold leading-5 text-[#1b1b1b]">{row.values[index]}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

function buildMatrixRows(slots: readonly CountryCompareSlot[]): MatrixRow[] {
  return REGISTERED_NURSE_MATRIX_ROWS.map((row) => ({
    key: row.fieldKey,
    section: row.section,
    label: row.label,
    values: slots.map((slot) => {
      if (!slot.countryCode || !slot.citySlug) return NOT_AVAILABLE
      const country = getRegisteredNurseCountryShell(slot.countryCode)
      const city = getCountryCompareCity(slot.countryCode, slot.citySlug)
      return country
        ? formatCountryComparisonRow(row, { country, city, cityCost: null })
        : NOT_AVAILABLE
    }),
  }))
}
