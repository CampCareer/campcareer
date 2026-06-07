'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from '@/lib/i18n/locale-provider'

export function HeroSearch() {
  const t = useTranslations()
  const hs = t.landing.heroSearch
  const router = useRouter()
  const [field, setField] = useState('')
  const [country, setCountry] = useState('')

  const countryOptions = [
    { value: '', label: hs.countryAll },
    { value: 'US', label: '🇺🇸 United States' },
    { value: 'IE', label: '🇮🇪 Ireland' },
    { value: 'UK', label: '🇬🇧 United Kingdom' },
    { value: 'CA', label: '🇨🇦 Canada' },
    { value: 'AU', label: '🇦🇺 Australia' },
  ]

  function submit() {
    const params = new URLSearchParams()
    if (field.trim()) params.set('field', field.trim())
    if (country) params.set('country', country)
    router.push(`/roi-explorer?${params.toString()}`)
  }

  return (
    <div className="w-full max-w-2xl rounded-2xl shadow-lg bg-white/10 border border-white/20 backdrop-blur-md px-4 py-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={field}
          onChange={(e) => setField(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder={hs.fieldPlaceholder}
          className="flex-1 bg-white text-slate-900 placeholder:text-slate-400 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="bg-white text-slate-900 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
        >
          {countryOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <button
          onClick={submit}
          className="bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-xl px-5 py-3 text-sm transition-colors whitespace-nowrap"
        >
          {hs.button}
        </button>
      </div>
    </div>
  )
}
