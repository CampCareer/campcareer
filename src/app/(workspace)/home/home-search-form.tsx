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
import { ArrowRight, Check, ChevronDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  COUNTRY_OPTIONS,
  FIELD_OPTIONS,
  getOptionLabel,
  NO_FIELD_STATUS,
  ORIGIN_OPTIONS,
  STATUS_OPTIONS,
  validateForm,
  type FormErrors,
  type OpenMenu,
  type PathwaySearchValues,
  type SelectOption,
} from "./home-search-config"

type HomeSearchFormProps = {
  values: PathwaySearchValues
  onValuesChange: (values: PathwaySearchValues) => void
  onSubmit: (values: PathwaySearchValues) => void
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
  const [errors, setErrors] = useState<FormErrors>({})
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null)
  const originRef = useRef<HTMLInputElement>(null)
  const countryRef = useRef<HTMLInputElement>(null)
  const fieldRef = useRef<HTMLInputElement>(null)
  const statusRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (autoFocus) originRef.current?.focus()
  }, [autoFocus])

  const updateValue = (key: keyof PathwaySearchValues, value: string) => {
    const nextValues = { ...values, [key]: value }
    if (key === "status") {
      nextValues.field = value === NO_FIELD_STATUS
        ? "not-sure"
        : values.field === "not-sure" ? "" : values.field
    }
    if (key === "field") {
      nextValues.status = value === "not-sure"
        ? NO_FIELD_STATUS
        : values.status === NO_FIELD_STATUS ? "" : values.status
    }
    onValuesChange(nextValues)
    setErrors((current) => {
      if (!current[key] && !(key === "status" && current.field) && !(key === "field" && current.status)) return current
      const next = { ...current }
      delete next[key]
      if (key === "status") delete next.field
      if (key === "field") delete next.status
      return next
    })
  }

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validateForm(values)

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      const firstInvalid = (Object.keys(nextErrors) as Array<keyof PathwaySearchValues>)[0]
      const refs: Record<keyof PathwaySearchValues, RefObject<HTMLInputElement | HTMLButtonElement | null>> = {
        origin: originRef,
        country: countryRef,
        field: fieldRef,
        status: statusRef,
      }
      refs[firstInvalid]?.current?.focus()
      return
    }

    onSubmit(values)
  }

  return (
    <form onSubmit={submit} className={cn("grid gap-3 md:grid-cols-2", className)} noValidate>
      <SearchSelect
        id="origin"
        label="Starting from"
        value={values.origin}
        options={ORIGIN_OPTIONS}
        open={openMenu === "origin"}
        error={errors.origin}
        inputRef={originRef}
        onOpenChange={(open) => setOpenMenu(open ? "origin" : null)}
        onChange={(value) => updateValue("origin", value)}
        onEscape={onCancel}
        placeholder="Where are you a citizen?"
      />
      <SearchSelect
        id="country"
        label="Destination"
        value={values.country}
        options={COUNTRY_OPTIONS}
        open={openMenu === "country"}
        error={errors.country}
        inputRef={countryRef}
        onOpenChange={(open) => setOpenMenu(open ? "country" : null)}
        onChange={(value) => updateValue("country", value)}
        onEscape={onCancel}
        placeholder="Where do you want to go?"
      />
      <SearchSelect
        id="field"
        label="Target field"
        value={values.field}
        options={FIELD_OPTIONS}
        open={openMenu === "field"}
        error={errors.field}
        inputRef={fieldRef}
        onOpenChange={(open) => setOpenMenu(open ? "field" : null)}
        onChange={(value) => updateValue("field", value)}
        onEscape={onCancel}
        placeholder="What career are you aiming for?"
      />
      <SelectMenu
        id="status"
        label="Current situation"
        value={values.status}
        options={STATUS_OPTIONS}
        open={openMenu === "status"}
        error={errors.status}
        buttonRef={statusRef}
        onOpenChange={(open) => setOpenMenu(open ? "status" : null)}
        onChange={(value) => updateValue("status", value)}
        onEscape={onCancel}
        placeholder="Where are you now?"
      />
      <div className="flex gap-2 md:col-span-2">
        <button
          type="submit"
          className="inline-flex h-12 min-w-36 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/35 focus-visible:ring-offset-2"
        >
          Find my pathways <ArrowRight className="size-4" />
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
  id: keyof PathwaySearchValues
  label: string
  value: string
  options: readonly SelectOption[]
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
  const matches = useMemo(() => {
    const normalizedQuery = query?.trim().toLocaleLowerCase() ?? ""
    return normalizedQuery ? options.filter((option) => option.label.toLocaleLowerCase().includes(normalizedQuery)) : options
  }, [options, query])
  const errorId = `${id}-error`
  const activeOption = matches[activeIndex]

  const choose = (option: SelectOption) => {
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
    <div className="relative min-w-0">
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
          value={query ?? getOptionLabel(options, value)}
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

type SelectMenuProps = BaseMenuProps & {
  buttonRef: RefObject<HTMLButtonElement | null>
}

function SelectMenu({
  id,
  label,
  value,
  options,
  open,
  error,
  buttonRef,
  onOpenChange,
  onChange,
  onEscape,
  placeholder,
}: SelectMenuProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const errorId = `${id}-error`
  const activeOption = options[activeIndex]

  const choose = (option: SelectOption) => {
    onChange(option.value)
    setActiveIndex(0)
    onOpenChange(false)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Escape") {
      event.preventDefault()
      if (onEscape) onEscape()
      else onOpenChange(false)
      return
    }
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault()
      onOpenChange(true)
      const direction = event.key === "ArrowDown" ? 1 : -1
      setActiveIndex((index) => (index + direction + options.length) % options.length)
      return
    }
    if (event.key === "Enter" && open && activeOption) {
      event.preventDefault()
      choose(activeOption)
    }
  }

  return (
    <div className="relative min-w-0">
      <label id={`${id}-label`} htmlFor={id} className="mb-1 block text-sm font-semibold text-[#1b1b1b]">{label}</label>
      <button
        ref={buttonRef}
        id={id}
        type="button"
        aria-labelledby={`${id}-label ${id}`}
        aria-haspopup="listbox"
        aria-controls={`${id}-options`}
        aria-expanded={open}
        aria-describedby={error ? errorId : undefined}
        onClick={() => {
          setActiveIndex(0)
          onOpenChange(!open)
        }}
        onKeyDown={handleKeyDown}
        className={cn(
          "flex h-12 w-full items-center justify-between gap-3 rounded-xl border bg-white px-3.5 text-left text-[15px] outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10",
          error ? "border-red-500" : "border-[#e0dfdb]"
        )}
      >
        <span className={value ? "text-[#1b1b1b]" : "text-[#a3a19b]"}>{getOptionLabel(options, value) || placeholder}</span>
        <ChevronDown className={cn("size-4 shrink-0 text-[#8c8a84] transition", open && "rotate-180")} />
      </button>
      <FieldError id={errorId} message={error} />
      {open && <OptionList id={`${id}-options`} fieldId={id} options={options} value={value} activeIndex={activeIndex} emptyText="No situation found." onActiveChange={setActiveIndex} onSelect={choose} />}
    </div>
  )
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? <p id={id} className="pt-1.5 text-xs font-medium text-red-600">{message}</p> : null
}

type OptionListProps = {
  id: string
  fieldId: keyof PathwaySearchValues
  options: readonly SelectOption[]
  value: string
  activeIndex: number
  emptyText: string
  onActiveChange: (index: number) => void
  onSelect: (option: SelectOption) => void
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
