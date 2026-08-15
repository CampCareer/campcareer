"use client"

import { useMemo, useState, type FormEvent } from "react"
import { ArrowRight, Check, ChevronDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  getCountryOptions,
  getOccupationOptions,
  validateOverviewSearch,
  type CareerCheckLocale,
  type OverviewOption,
  type OverviewSearchErrors,
  type OverviewSearchValues,
} from "./home-overview-config"

const RECOMMENDED_OCCUPATION_IDS = [
  "registered-nurse",
  "software-developer",
  "electrician",
  "civil-engineer",
  "chef",
  "carpenter",
  "data-analyst",
  "early-childhood-educator",
] as const

type HomeSearchFormProps = {
  values: OverviewSearchValues
  locale: CareerCheckLocale
  onValuesChange: (values: OverviewSearchValues) => void
  onSubmit: (values: OverviewSearchValues) => void
  compact?: boolean
  integrated?: boolean
  className?: string
  /** Some workspace explorers only need a destination. */
  showOccupation?: boolean
  submitLabel?: string
}

export function HomeSearchForm({ values, locale, onValuesChange, onSubmit, compact = false, integrated = false, className, showOccupation = true, submitLabel }: HomeSearchFormProps) {
  const [errors, setErrors] = useState<OverviewSearchErrors>({})
  const countryOptions = useMemo(() => getCountryOptions(locale), [locale])
  const occupationOptions = useMemo(() => getOccupationOptions(locale), [locale])
  const copy = locale === "ko"
    ? { country: "국가", occupation: "직업", countryPlaceholder: "국가 선택", occupationPlaceholder: "직업 선택", submit: "검색", empty: "검색 결과가 없어요." }
    : { country: "Country", occupation: "Career", countryPlaceholder: "Choose a country", occupationPlaceholder: "Choose a career", submit: "Search", empty: "No matches found." }

  const update = (key: keyof OverviewSearchValues, value: string) => {
    onValuesChange({ ...values, [key]: value })
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validateOverviewSearch(values, locale)
    if (!showOccupation) delete nextErrors.occupation
    setErrors(nextErrors)
    if (!Object.keys(nextErrors).length) onSubmit(values)
  }

  if (integrated) {
    return (
      <form
        onSubmit={submit}
        noValidate
        className={cn(
          "flex w-full flex-col rounded-2xl border border-[hsl(var(--cc-border))] bg-white shadow-[0_14px_40px_rgba(24,24,27,0.06)] md:flex-row md:items-stretch",
          className,
        )}
      >
        <SearchSelect
          id="country"
          label={copy.country}
          value={values.country}
          options={countryOptions}
          placeholder={copy.countryPlaceholder}
          error={errors.country}
          emptyText={copy.empty}
          integrated
          className="border-b border-[hsl(var(--cc-border))] md:w-[36%] md:border-b-0 md:border-r"
          onChange={(value) => update("country", value)}
        />
        {showOccupation && (
          <SearchSelect
            id="occupation"
            label={copy.occupation}
            value={values.occupation}
            options={occupationOptions}
            placeholder={copy.occupationPlaceholder}
            error={errors.occupation}
            emptyText={copy.empty}
            recommendedIds={RECOMMENDED_OCCUPATION_IDS}
            recommendedLabel={locale === "ko" ? "추천 직종" : "Recommended careers"}
            resultsLabel={locale === "ko" ? "관련 직종" : "Related careers"}
            integrated
            className="border-b border-[hsl(var(--cc-border))] md:flex-1 md:border-b-0 md:border-r"
            onChange={(value) => update("occupation", value)}
          />
        )}
        <div className="p-2 md:flex md:items-stretch">
          <button
            type="submit"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand px-6 text-sm font-semibold text-white transition hover:bg-[hsl(var(--brand-press))] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/20 md:h-auto md:min-w-32"
          >
            {submitLabel ?? copy.submit} <ArrowRight className="size-4" />
          </button>
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={submit} noValidate className={cn("grid gap-3 md:items-end", showOccupation ? "md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]" : "md:grid-cols-[minmax(0,1fr)_auto]", className)}>
      <SearchSelect id="country" label={copy.country} value={values.country} options={countryOptions} placeholder={copy.countryPlaceholder} error={errors.country} emptyText={copy.empty} onChange={(value) => update("country", value)} />
      {showOccupation && <SearchSelect id="occupation" label={copy.occupation} value={values.occupation} options={occupationOptions} placeholder={copy.occupationPlaceholder} error={errors.occupation} emptyText={copy.empty} recommendedIds={RECOMMENDED_OCCUPATION_IDS} recommendedLabel={locale === "ko" ? "추천 직종" : "Recommended careers"} resultsLabel={locale === "ko" ? "관련 직종" : "Related careers"} onChange={(value) => update("occupation", value)} />}
      <button type="submit" className={cn("inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-white transition hover:bg-[hsl(var(--brand-press))] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/20", compact ? "md:min-w-36" : "md:min-w-44")}>
        {submitLabel ?? copy.submit} <ArrowRight className="size-4" />
      </button>
    </form>
  )
}

function SearchSelect({ id, label, value, options, placeholder, error, emptyText, recommendedIds, recommendedLabel, resultsLabel, integrated = false, className, onChange }: {
  id: string
  label: string
  value: string
  options: readonly OverviewOption[]
  placeholder: string
  error?: string
  emptyText: string
  recommendedIds?: readonly string[]
  recommendedLabel?: string
  resultsLabel?: string
  integrated?: boolean
  className?: string
  onChange: (value: string) => void
}) {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const selected = options.find((option) => option.value === value)
  const matches = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase()
    if (!normalized && recommendedIds) {
      const recommended = new Map(options.map((option) => [option.value, option]))
      return recommendedIds.map((id) => recommended.get(id)).filter((option): option is OverviewOption => Boolean(option))
    }
    if (!normalized) return options.slice(0, 12)
    return options.filter((option) => [option.label, ...(option.searchTerms ?? [])]
      .some((term) => term.toLocaleLowerCase().includes(normalized))).slice(0, 12)
  }, [options, query, recommendedIds])

  const choose = (option: OverviewOption) => {
    onChange(option.value)
    setQuery("")
    setOpen(false)
  }

  return (
    <div className={cn("relative min-w-0", integrated && "px-5 py-2.5", className)}>
      <label
        htmlFor={id}
        className={cn(
          "block font-semibold text-[#27272a]",
          integrated ? "text-[11px] uppercase tracking-[0.08em] text-[#8a8a90]" : "mb-1.5 text-sm",
        )}
      >
        {label}
      </label>
      <div className={cn("relative", integrated && "mt-0.5")}>
        <Search className={cn("pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-[#9ca3af]", integrated ? "left-0" : "left-3.5")} />
        <input
          id={id}
          type="search"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={`${id}-options`}
          aria-invalid={Boolean(error)}
          value={open ? query : selected?.label ?? ""}
          placeholder={placeholder}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value)
            setOpen(true)
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpen(false)
          }}
          className={cn(
            "w-full text-[15px] text-[#18181b] outline-none transition placeholder:text-[#a1a1aa]",
            integrated
              ? "h-8 border-0 bg-transparent py-0 pl-6 pr-7 focus:ring-0"
              : "h-12 rounded-xl border bg-white py-2 pl-10 pr-10 focus:border-brand focus:ring-4 focus:ring-brand/10",
            !integrated && (error ? "border-red-500" : "border-[#dededb]"),
          )}
        />
        <ChevronDown className={cn("pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-[#a1a1aa]", integrated ? "right-0" : "right-3.5")} />
      </div>
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error}</p>}
      {open && (
        <div id={`${id}-options`} role="listbox" className={cn("absolute z-40 mt-2 max-h-64 overflow-y-auto rounded-xl border border-[#e4e4e1] bg-white p-1.5 shadow-xl", integrated ? "left-0 right-0 md:min-w-[280px]" : "w-full")}>
          {(recommendedIds || query.trim()) && matches.length > 0 && (
            <p className="px-3 pb-1 pt-1.5 text-[11px] font-semibold tracking-[0.08em] text-[#8a8a90]">{query.trim() ? resultsLabel : recommendedLabel}</p>
          )}
          {matches.length ? matches.map((option) => (
            <button key={option.value} type="button" role="option" aria-selected={option.value === value} onMouseDown={(event) => event.preventDefault()} onClick={() => choose(option)} className="flex min-h-10 w-full items-center justify-between rounded-lg px-3 text-left text-sm text-[#27272a] transition hover:bg-[hsl(var(--brand-tint))]">
              <span>{option.label}</span>
              {option.value === value && <Check className="size-4 text-brand" />}
            </button>
          )) : <p className="px-3 py-3 text-sm text-[#71717a]">{emptyText}</p>}
        </div>
      )}
    </div>
  )
}
