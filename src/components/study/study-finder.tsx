"use client"

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { LAUNCH_COUNTRIES } from '@/data/launch-countries'
import { STUDY_CATEGORIES } from '@/data/study-concepts'
import { localizePath } from '@/lib/i18n/config'
import { IconPicker, type PickerOption, countryFlag } from '@/components/ui/icon-picker'
import { getStudyCategoryVisual } from '@/components/ui/au-career-category-visuals'

export function StudyFinder({ locale = 'en' }: { locale?: 'en' | 'ko' }) {
  const router = useRouter()
  const [country, setCountry] = useState('AU')
  const [category, setCategory] = useState('')
  const countryOptions = useMemo<PickerOption[]>(() => LAUNCH_COUNTRIES.map((item) => ({
    value: item.code,
    label: item.name,
    description: `Explore ${item.name} study options`,
    icon: countryFlag(item.code),
    keywords: `${item.code} ${item.slug}`,
  })), [])
  const categoryOptions = useMemo<PickerOption[]>(() => [
    { value: '', label: 'Choose a category', description: 'Browse all available study areas', icon: '✨', keywords: 'all categories' },
    ...STUDY_CATEGORIES.map((item) => {
      const visual = getStudyCategoryVisual(item.id)
      return {
        value: item.id,
        label: item.label,
        description: `Explore ${item.label} study options`,
        icon: '',
        iconComponent: visual.Icon,
        iconTone: visual.tone,
        keywords: `${item.id} ${item.label}`,
      }
    }),
  ], [])

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const query = new URLSearchParams(category ? { category } : {})
    if (country === 'AU') {
      router.push(`${localizePath('/au/study', locale)}${query.size ? `?${query}` : ''}`)
      return
    }
    router.push(`${localizePath('/study/search', locale)}?${new URLSearchParams({ country, ...(category ? { category } : {}) })}`)
  }

  return <form onSubmit={submit} className="max-w-5xl rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_18px_45px_rgba(15,23,42,.10)]">
    <div className="flex flex-col gap-2 lg:flex-row lg:items-end">
      <div className="min-w-0 flex-1"><IconPicker name="country" label="Where" value={country} options={countryOptions} onChange={setCountry} searchPlaceholder="Search countries" testId="study-country" /></div>
      <div className="min-w-0 flex-1"><IconPicker name="category" label="Major" value={category} options={categoryOptions} onChange={setCategory} searchPlaceholder="Search categories" testId="study-category" /></div>
      <button className="inline-flex h-12 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700">Search</button>
    </div>
  </form>
}
