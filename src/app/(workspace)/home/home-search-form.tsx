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

type HomeSearchFormProps = {
  values: OverviewSearchValues
  locale: CareerCheckLocale
  onValuesChange: (values: OverviewSearchValues) => void
  onSubmit: (values: OverviewSearchValues) => void
  compact?: boolean
  className?: string
}

export function HomeSearchForm({ values, locale, onValuesChange, onSubmit, compact = false, className }: HomeSearchFormProps) {
  const [errors, setErrors] = useState<OverviewSearchErrors>({})
  const countryOptions = useMemo(() => getCountryOptions(locale), [locale])
  const occupationOptions = useMemo(() => getOccupationOptions(locale), [locale])
  const copy = locale === "ko"
    ? { country: "어디에서", occupation: "어떤 일을", countryPlaceholder: "나라 선택", occupationPlaceholder: "직업 선택", submit: "내 가능성 확인", empty: "검색 결과가 없어요." }
    : { country: "Where", occupation: "What work", countryPlaceholder: "Choose a country", occupationPlaceholder: "Choose an occupation", submit: "Check my fit", empty: "No matches found." }

  const update = (key: keyof OverviewSearchValues, value: string) => {
    onValuesChange({ ...values, [key]: value })
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validateOverviewSearch(values, locale)
    setErrors(nextErrors)
    if (!Object.keys(nextErrors).length) onSubmit(values)
  }

  return (
    <form onSubmit={submit} noValidate className={cn("grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-end", className)}>
      <SearchSelect id="country" label={copy.country} value={values.country} options={countryOptions} placeholder={copy.countryPlaceholder} error={errors.country} emptyText={copy.empty} onChange={(value) => update("country", value)} />
      <SearchSelect id="occupation" label={copy.occupation} value={values.occupation} options={occupationOptions} placeholder={copy.occupationPlaceholder} error={errors.occupation} emptyText={copy.empty} onChange={(value) => update("occupation", value)} />
      <button type="submit" className={cn("inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#1d4ed8] px-5 text-sm font-semibold text-white transition hover:bg-[#1e40af] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600/20", compact ? "md:min-w-36" : "md:min-w-44")}>
        {copy.submit} <ArrowRight className="size-4" />
      </button>
    </form>
  )
}

function SearchSelect({ id, label, value, options, placeholder, error, emptyText, onChange }: {
  id: string
  label: string
  value: string
  options: readonly OverviewOption[]
  placeholder: string
  error?: string
  emptyText: string
  onChange: (value: string) => void
}) {
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const selected = options.find((option) => option.value === value)
  const matches = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase()
    if (!normalized) return options
    return options.filter((option) => [option.label, ...(option.searchTerms ?? [])]
      .some((term) => term.toLocaleLowerCase().includes(normalized)))
  }, [options, query])

  const choose = (option: OverviewOption) => {
    onChange(option.value)
    setQuery("")
    setOpen(false)
  }

  return (
    <div className="relative min-w-0">
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-[#27272a]">{label}</label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#9ca3af]" />
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
          className={cn("h-12 w-full rounded-xl border bg-white py-2 pl-10 pr-10 text-[15px] text-[#18181b] outline-none transition placeholder:text-[#a1a1aa] focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10", error ? "border-red-500" : "border-[#dededb]")}
        />
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-[#a1a1aa]" />
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-red-600">{error}</p>}
      {open && (
        <div id={`${id}-options`} role="listbox" className="absolute z-40 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-[#e4e4e1] bg-white p-1.5 shadow-xl">
          {matches.length ? matches.map((option) => (
            <button key={option.value} type="button" role="option" aria-selected={option.value === value} onMouseDown={(event) => event.preventDefault()} onClick={() => choose(option)} className="flex min-h-10 w-full items-center justify-between rounded-lg px-3 text-left text-sm text-[#27272a] transition hover:bg-blue-50">
              <span>{option.label}</span>
              {option.value === value && <Check className="size-4 text-blue-700" />}
            </button>
          )) : <p className="px-3 py-3 text-sm text-[#71717a]">{emptyText}</p>}
        </div>
      )}
    </div>
  )
}
