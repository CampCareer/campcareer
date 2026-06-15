'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from '@/lib/i18n/locale-provider'
import { X } from 'lucide-react'

function trimDot(s: string): string {
  return s.endsWith('.') ? s.slice(0, -1) : s
}

export function HeroSearch() {
  const t = useTranslations()
  const hs = t.landing.heroSearch
  const router = useRouter()

  const [field, setField] = useState('')
  const [country, setCountry] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(-1)
  const [noResults, setNoResults] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const countryOptions = [
    { value: '',   label: hs.countryAll },
    { value: 'us', label: '🇺🇸 United States' },
    { value: 'ie', label: '🇮🇪 Ireland' },
    { value: 'uk', label: '🇬🇧 United Kingdom' },
    { value: 'ca', label: '🇨🇦 Canada' },
    { value: 'au', label: '🇦🇺 Australia' },
  ]

  // Debounced field autocomplete (~250 ms)
  useEffect(() => {
    const trimmed = field.trim()
    if (trimmed.length < 2) {
      setSuggestions([])
      setOpen(false)
      setNoResults(false)
      return
    }
    setNoResults(false)
    const timer = setTimeout(async () => {
      try {
        const countryParam = country || 'us'
        const res = await fetch(
          `/api/roi/fields?q=${encodeURIComponent(trimmed)}&country=${countryParam}`
        )
        const json = await res.json()
        const fields: string[] = (json.fields ?? []).map((f: string) => trimDot(f)).filter(Boolean)
        setSuggestions(fields)
        setOpen(fields.length > 0)
        setActiveIdx(-1)
        setNoResults(fields.length === 0)
      } catch {
        setSuggestions([])
        setOpen(false)
        setNoResults(false)
      }
    }, 250)
    return () => clearTimeout(timer)
  }, [field, country])

  // Click-outside close
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const canSubmit = field.trim().length >= 2

  function submit() {
    if (!canSubmit) return
    setOpen(false)
    const params = new URLSearchParams()
    params.set('field', field.trim())
    if (country) params.set('country', country)
    params.set('source', 'hero')
    router.push(`/dashboard?${params.toString()}`)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      setOpen(false)
      return
    }
    if (e.key === 'Enter') {
      if (open && activeIdx >= 0 && suggestions[activeIdx]) {
        setField(suggestions[activeIdx])
        setOpen(false)
        setActiveIdx(-1)
      } else {
        submit()
      }
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx(prev => Math.min(prev + 1, suggestions.length - 1))
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx(prev => Math.max(prev - 1, -1))
      return
    }
  }

  return (
    <div
      ref={containerRef}
      className="w-full max-w-2xl rounded-2xl shadow-lg bg-white/10 border border-white/20 backdrop-blur-md px-4 py-4"
    >
      <div className="flex flex-col sm:flex-row gap-3">

        {/* Field input with autocomplete dropdown */}
        <div className="relative flex-1">
          <div className="flex items-center bg-white text-slate-900 rounded-xl px-4 py-3 gap-2 focus-within:ring-2 focus-within:ring-blue-400 transition-shadow">
            <input
              type="text"
              value={field}
              onChange={e => setField(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={hs.fieldPlaceholder}
              role="combobox"
              aria-label="Field of study"
              aria-autocomplete="list"
              aria-expanded={open}
              aria-haspopup="listbox"
              aria-controls="hero-field-listbox"
              className="flex-1 text-sm placeholder:text-slate-400 outline-none bg-transparent"
            />
            {field && (
              <button
                type="button"
                onClick={() => { setField(''); setSuggestions([]); setOpen(false) }}
                aria-label="Clear field input"
                className="text-slate-300 hover:text-slate-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Autocomplete dropdown */}
          {open && suggestions.length > 0 && (
            <div id="hero-field-listbox" role="listbox" className="absolute z-50 top-full left-0 right-0 mt-1 rounded-xl border border-slate-200 bg-white shadow-xl max-h-56 overflow-y-auto">
              {suggestions.map((s, i) => (
                <button
                  key={s}
                  type="button"
                  onMouseDown={e => e.preventDefault()}
                  onClick={() => { setField(s); setOpen(false); setActiveIdx(-1) }}
                  className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                    i === activeIdx
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Hint when input is too short to search */}
          {!canSubmit && field.length > 0 && (
            <p className="text-xs text-white/60 mt-1 pl-1">{hs.fieldHint}</p>
          )}
          {/* No suggestions after API returns empty */}
          {noResults && (
            <p className="text-xs text-white/60 mt-1 pl-1">{hs.noSuggestions}</p>
          )}
        </div>

        {/* Country select */}
        <select
          value={country}
          onChange={e => { setCountry(e.target.value); setSuggestions([]); setOpen(false) }}
          className="bg-white text-slate-900 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
        >
          {countryOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Submit button — disabled until field has ≥ 2 chars */}
        <button
          type="button"
          onClick={submit}
          disabled={!canSubmit}
          className={`font-semibold rounded-xl px-5 py-3 text-sm transition-colors whitespace-nowrap ${
            canSubmit
              ? 'bg-blue-500 hover:bg-blue-400 text-white cursor-pointer'
              : 'bg-white/20 text-white/50 cursor-not-allowed'
          }`}
        >
          {hs.button}
        </button>

      </div>
    </div>
  )
}
