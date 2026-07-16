"use client"

import { useEffect, useRef, useState } from "react"
import { Check, Search } from "lucide-react"

export type PickerOption = {
  value: string
  label: string
  description: string
  icon: string
  keywords?: string
}

export function countryFlag(code: string) {
  const emojiCode = code.toUpperCase() === "UK" ? "GB" : code.toUpperCase()
  return emojiCode.replace(/./g, (letter) => String.fromCodePoint(127397 + letter.charCodeAt(0)))
}

export function majorEmoji(category: string) {
  return ({ trades: "🛠️", health: "🩺", technology: "💻", engineering: "⚙️", business: "📈", education: "📚", environment: "🌿", design: "🎨", hospitality: "🍽️", transport: "✈️" } as Record<string, string>)[category] ?? "🎓"
}

export function IconPicker({
  name,
  label,
  value,
  options,
  onChange,
  searchPlaceholder,
  testId,
}: {
  name: string
  label: string
  value: string
  options: PickerOption[]
  onChange: (value: string) => void
  searchPlaceholder?: string
  testId: string
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const rootRef = useRef<HTMLDivElement>(null)
  const selected = options.find((option) => option.value === value) ?? options[0]
  const filtered = options.filter((option) => `${option.label} ${option.description} ${option.keywords ?? ""}`.toLowerCase().includes(query.toLowerCase()))

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onPointerDown)
    return () => document.removeEventListener("mousedown", onPointerDown)
  }, [])

  return <div ref={rootRef} className="relative rounded-xl px-2 pt-2.5">
    <input type="hidden" name={name} value={value} />
    <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[.08em] text-slate-500">{label}</span>
    <button type="button" aria-label={label} aria-expanded={open} aria-haspopup="listbox" onClick={() => { setQuery(""); setOpen((current) => !current) }} className={`flex h-8 w-full items-center gap-2 rounded-lg px-1 text-left text-sm font-medium transition ${open ? "bg-slate-50 text-slate-950" : "text-slate-800 hover:text-slate-950"}`}>
      <span aria-hidden="true" className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-slate-100 text-base">{selected.icon}</span>
      <span className="truncate">{selected.label}</span>
    </button>
    {open && <div className="absolute left-0 top-[calc(100%+0.75rem)] z-30 w-[min(25rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_18px_45px_rgba(15,23,42,.16)]">
      {searchPlaceholder && <label className="mb-2 flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-slate-500"><Search className="h-4 w-4" /><span className="sr-only">{searchPlaceholder}</span><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder={searchPlaceholder} className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400" /></label>}
      <div role="listbox" aria-label={`${label} options`} className="max-h-80 space-y-1 overflow-y-auto p-1">{filtered.map((option) => <button key={option.value} type="button" role="option" aria-selected={option.value === value} data-testid={`${testId}-option-${option.value}`} onClick={() => { onChange(option.value); setOpen(false) }} className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-slate-50 aria-selected:bg-blue-50">
        <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-100 text-xl">{option.icon}</span>
        <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-slate-900">{option.label}</span><span className="block truncate text-xs text-slate-500">{option.description}</span></span>
        {option.value === value && <Check className="h-4 w-4 shrink-0 text-blue-700" aria-hidden="true" />}
      </button>)}</div>
    </div>}
  </div>
}
