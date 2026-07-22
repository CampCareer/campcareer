"use client"

import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { STUDY_CATEGORIES } from '@/data/study-concepts'
import { IconPicker, type PickerOption } from '@/components/ui/icon-picker'
import { getStudyCategoryVisual } from '@/components/ui/au-career-category-visuals'
import { useRouter } from 'next/navigation'
import { localizePath } from '@/lib/i18n/config'
import { useRouteLocale, useRouteTranslations } from '@/lib/i18n/locale-provider'

type StudyLevel = 'all' | 'vocational' | 'bachelor' | 'postgraduate'
type FilterValues = { field: string; category: string; state: string; level: StudyLevel }

const AU_STATES = ['ACT', 'NSW', 'NT', 'QLD', 'SA', 'TAS', 'VIC', 'WA'] as const
export function AuStudyFilterBar({ initialValues }: { initialValues: FilterValues }) {
  const router = useRouter()
  const locale = useRouteLocale()
  const t = useRouteTranslations().australia.study.filters
  const [field, setField] = useState(initialValues.field)
  const [category, setCategory] = useState(initialValues.category)
  const [state, setState] = useState(initialValues.state)
  const [level, setLevel] = useState<StudyLevel>(initialValues.level)

  const categoryOptions = useMemo<PickerOption[]>(() => [
    { value: '', label: t.allCategories, description: t.allCategoriesDescription, icon: '✨', keywords: 'all categories' },
    ...STUDY_CATEGORIES.map((item) => {
      const visual = getStudyCategoryVisual(item.id)
      const label = locale === 'ko' ? item.labelKo : item.label
      return { value: item.id, label, description: format(t.categoryDescription, { category: label }), icon: '', iconComponent: visual.Icon, iconTone: visual.tone, keywords: `${item.id} ${item.label} ${item.labelKo}` }
    }),
  ], [locale, t])
  const stateOptions = useMemo<PickerOption[]>(() => [
    { value: 'ALL_STATES', label: t.allStates, description: t.allStatesDescription, icon: '🇦🇺', keywords: 'australia all' },
    ...AU_STATES.map((item) => ({ value: item, label: item, description: format(t.stateDescription, { state: item }), icon: '📍', keywords: item })),
  ], [t])
  const levelOptions = useMemo<PickerOption[]>(() => Object.entries({
    all: { label: t.allLevels, icon: '✨' },
    vocational: { label: t.certificateDiploma, icon: '🪪' },
    bachelor: { label: t.bachelor, icon: '🎓' },
    postgraduate: { label: t.postgraduate, icon: '📚' },
  } satisfies Record<StudyLevel, { label: string; icon: string }>).map(([value, item]) => ({
    value,
    label: item.label,
    description: value === 'all' ? t.allLevelsDescription : format(t.showLevel, { level: item.label }),
    icon: item.icon,
    keywords: `${value} ${item.label}`,
  })), [t])

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const query = new URLSearchParams()
    if (field.trim()) query.set('field', field.trim())
    if (category) query.set('category', category)
    if (state !== 'ALL_STATES') query.set('state', state)
    if (level !== 'all') query.set('level', level)
    router.push(`${localizePath('/au/study', locale)}${query.size ? `?${query}` : ''}`)
  }

  return <form onSubmit={submit} className="max-w-6xl rounded-3xl border border-slate-200/90 bg-white p-2.5 shadow-[0_18px_45px_rgba(15,23,42,.10)] sm:p-3">
    <div className="grid gap-1.5 md:grid-cols-2 xl:grid-cols-[minmax(0,1.25fr)_minmax(150px,1fr)_minmax(170px,1fr)_minmax(180px,1.05fr)_auto] xl:items-end">
      <div className="min-w-0"><IconPicker name="category" label={t.majorCategory} value={category} options={categoryOptions} onChange={setCategory} searchPlaceholder={t.searchCategories} testId="au-study-category" /></div>
      <div className="min-w-0"><IconPicker name="state" label={t.location} value={state} options={stateOptions} onChange={setState} searchPlaceholder={t.searchStates} testId="au-study-state" /></div>
      <div className="min-w-0"><IconPicker name="level" label={t.studyLevel} value={level} options={levelOptions} onChange={(value) => setLevel(value as StudyLevel)} searchPlaceholder={t.searchLevels} testId="au-study-level" /></div>
      <label className="relative min-w-0 rounded-xl px-2.5 pt-2.5 transition focus-within:bg-slate-50"><span className="mb-1 block text-[11px] font-semibold uppercase tracking-[.08em] text-slate-500">{t.subject}</span><Search className="pointer-events-none absolute bottom-3 left-5 h-4 w-4 text-slate-400" /><input value={field} onChange={(event) => setField(event.target.value)} maxLength={80} placeholder={t.subjectPlaceholder} className="h-8 w-full min-w-0 rounded-lg bg-transparent pl-7 pr-2 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400" /></label>
      <button className="h-12 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2">{t.search}</button>
    </div>
  </form>
}

function format(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''))
}
