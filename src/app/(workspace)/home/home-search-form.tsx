"use client"

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type RefObject,
} from "react"
import { ArrowRight, Check, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  CATEGORY_OPTIONS,
  CITIZENSHIP_OPTIONS,
  COUNTRY_OPTIONS,
  getOverviewOptionLabel,
  validateOverviewSearch,
  type OverviewOpenMenu,
  type OverviewOption,
  type OverviewSearchErrors,
  type OverviewSearchValues,
} from "./home-overview-config"

type HomeSearchFormProps = {
  values: OverviewSearchValues
  onValuesChange: (values: OverviewSearchValues) => void
  onSubmit: (values: OverviewSearchValues) => void
  onCancel?: () => void
  autoFocus?: boolean
  className?: string
}

export function HomeSearchForm({
  values,
  onValuesChange,
  onSubmit,
  onCancel,
  autoFocus = false,
  className,
}: HomeSearchFormProps) {
  const [errors, setErrors] = useState<OverviewSearchErrors>({})
  const [openMenu, setOpenMenu] = useState<OverviewOpenMenu>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const citizenshipRef = useRef<HTMLInputElement>(null)
  const countryRef = useRef<HTMLInputElement>(null)
  const categoryRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus) citizenshipRef.current?.focus()
  }, [autoFocus])

  useEffect(() => {
    if (!openMenu) return

    const closeOnOutsidePointerDown = (event: PointerEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return

      const activeMenu = formRef.current?.querySelector(`[data-home-search-menu="${openMenu}"]`)
      if (!activeMenu?.contains(target)) setOpenMenu(null)
    }

    document.addEventListener("pointerdown", closeOnOutsidePointerDown)
    return () => document.removeEventListener("pointerdown", closeOnOutsidePointerDown)
  }, [openMenu])

  const updateValue = (key: keyof OverviewSearchValues, value: string) => {
    onValuesChange({ ...values, [key]: value })
    setErrors((current) => {
      if (!current[key]) return current
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validateOverviewSearch(values)

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      const firstInvalid = (Object.keys(nextErrors) as Array<keyof OverviewSearchValues>)[0]
      const refs: Partial<Record<keyof OverviewSearchValues, RefObject<HTMLInputElement | HTMLButtonElement | null>>> = {
        citizenship: citizenshipRef,
        country: countryRef,
        category: categoryRef,
      }
      refs[firstInvalid]?.current?.focus()
      return
    }

    onSubmit(values)
  }

  return (
    <form ref={formRef} onSubmit={submit} className={cn("grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.35fr)_auto] lg:items-end", className)} noValidate>
      <SearchSelect
        id="citizenship"
        label="Passport"
        value={values.citizenship}
        options={CITIZENSHIP_OPTIONS}
        open={openMenu === "citizenship"}
        error={errors.citizenship}
        inputRef={citizenshipRef}
        onOpenChange={(open) => setOpenMenu(open ? "citizenship" : null)}
        onChange={(value) => updateValue("citizenship", value)}
        onEscape={onCancel}
        placeholder="Select your passport"
      />
      <SearchSelect
        id="country"
        label="To"
        value={values.country}
        options={COUNTRY_OPTIONS}
        open={openMenu === "country"}
        error={errors.country}
        inputRef={countryRef}
        onOpenChange={(open) => setOpenMenu(open ? "country" : null)}
        onChange={(value) => updateValue("country", value)}
        onEscape={onCancel}
        placeholder="Select a destination"
      />
      <SearchSelect
        id="category"
        label="Career"
        value={values.category}
        options={CATEGORY_OPTIONS}
        open={openMenu === "category"}
        error={errors.category}
        inputRef={categoryRef}
        onOpenChange={(open) => setOpenMenu(open ? "category" : null)}
        onChange={(value) => updateValue("category", value)}
        onEscape={onCancel}
        placeholder="Select a career"
      />
      <div className="flex gap-2 lg:col-span-1">
        <button
          type="submit"
          className="inline-flex h-12 min-w-36 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35 focus-visible:ring-offset-2"
        >
          Find my future <ArrowRight className="size-4" />
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-12 items-center justify-center rounded-xl px-3 text-sm font-semibold text-[#5f5d57] transition hover:bg-[#f6f6f4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35 focus-visible:ring-offset-2"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

type BaseMenuProps = {
  id: keyof OverviewSearchValues
  label: string
  value: string
  options: readonly OverviewOption[]
  open: boolean
  error?: string
  onOpenChange: (open: boolean) => void
  onChange: (value: string) => void
  onEscape?: () => void
  placeholder: string
}

type SearchSelectProps = BaseMenuProps & {
  inputRef: RefObject<HTMLInputElement | null>
}

function SearchSelect({
  id,
  label,
  value,
  options,
  open,
  error,
  inputRef,
  onOpenChange,
  onChange,
  onEscape,
  placeholder,
}: SearchSelectProps) {
  const [query, setQuery] = useState<string | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (!open) {
      setQuery(null)
      setActiveIndex(0)
    }
  }, [open])

  const matches = useMemo(() => {
    const normalizedQuery = query?.trim().toLocaleLowerCase() ?? ""
    return normalizedQuery ? options.filter((option) => option.label.toLocaleLowerCase().includes(normalizedQuery)) : options
  }, [options, query])
  const errorId = `${id}-error`
  const activeOption = matches[activeIndex]

  const choose = (option: OverviewOption) => {
    onChange(option.value)
    setQuery(null)
    setActiveIndex(0)
    onOpenChange(false)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      event.preventDefault()
      if (onEscape) onEscape()
      else {
        setQuery(null)
        onOpenChange(false)
      }
      return
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      onOpenChange(true)
      if (matches.length) {
        const direction = event.key === "ArrowDown" ? 1 : -1
        setActiveIndex((index) => (index + direction + matches.length) % matches.length)
      }
      return
    }
    if (event.key === "Enter" && open && activeOption) {
      event.preventDefault()
      choose(activeOption)
    }
  }

  return (
    <div data-home-search-menu={id} className="relative min-w-0">
      <label htmlFor={id} className="mb-1 block text-sm font-semibold text-[#1b1b1b]">{label}</label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#9c9a94]" />
        <input
          ref={inputRef}
          id={id}
          type="search"
          role="combobox"
          aria-autocomplete="list"
          aria-controls={`${id}-options`}
          aria-activedescendant={open && activeOption ? `${id}-option-${activeOption.value}` : undefined}
          aria-expanded={open}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          value={query ?? getOverviewOptionLabel(options, value)}
          onClick={() => {
            setActiveIndex(0)
            onOpenChange(true)
          }}
          onChange={(event) => {
            setQuery(event.target.value)
            setActiveIndex(0)
            onOpenChange(true)
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "h-12 w-full appearance-none rounded-xl border bg-white py-2 pr-4 pl-10 text-[15px] text-[#1b1b1b] outline-none transition placeholder:text-[#a3a19b] focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10",
            error ? "border-red-500" : "border-[#e0dfdb]"
          )}
        />
      </div>
      <FieldError id={errorId} message={error} />
      {open && <OptionList id={`${id}-options`} fieldId={id} options={matches} value={value} activeIndex={activeIndex} emptyText={`No ${label.toLocaleLowerCase()} found.`} onActiveChange={setActiveIndex} onSelect={choose} />}
    </div>
  )
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? <p id={id} className="pt-1.5 text-xs font-medium text-red-600">{message}</p> : null
}

type OptionListProps = {
  id: string
  fieldId: keyof OverviewSearchValues
  options: readonly OverviewOption[]
  value: string
  activeIndex: number
  emptyText: string
  onActiveChange: (index: number) => void
  onSelect: (option: OverviewOption) => void
}

function OptionList({ id, fieldId, options, value, activeIndex, emptyText, onActiveChange, onSelect }: OptionListProps) {
  return (
    <div id={id} role="listbox" className="absolute left-0 top-[calc(100%+0.5rem)] z-30 max-h-64 w-full overflow-y-auto rounded-xl border border-[#e0dfdb] bg-white p-1.5 shadow-lg">
      {options.length ? options.map((option, index) => {
        const selected = option.value === value
        return (
          <button
            key={option.value}
            id={`${fieldId}-option-${option.value}`}
            type="button"
            role="option"
            aria-selected={selected}
            onMouseDown={(event) => event.preventDefault()}
            onMouseEnter={() => onActiveChange(index)}
            onClick={() => onSelect(option)}
            className={cn(
              "flex min-h-10 w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition",
              selected ? "bg-blue-50 font-medium text-blue-700" : "text-[#3a3935] hover:bg-[#f6f6f4]",
              activeIndex === index && !selected && "bg-[#f6f6f4]"
            )}
          >
            <span>{option.label}</span>
            {selected && <Check className="size-4 shrink-0" />}
          </button>
        )
      }) : <p className="px-3 py-2 text-sm text-[#6f6d68]">{emptyText}</p>}
    </div>
  )
}
