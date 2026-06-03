'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase-client'
import { CheckCircle2, Circle, Loader2, Sparkles, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'
import type { User } from '@supabase/supabase-js'

type ChecklistItem = {
  id: string
  category: string
  task: string
  required: boolean
  note?: string
}

type AffiliateLink = { label: string; url: string }

function getAffiliateLink(item: ChecklistItem, country: string): AffiliateLink | null {
  const id = item.id.toLowerCase()
  const task = item.task.toLowerCase()

  // IELTS / TOEFL
  if (id.includes('english_proficiency') || task.includes('ielts') || task.includes('toefl')) {
    return { label: 'Book IELTS', url: 'https://www.ielts.org/book-a-test' }
  }

  // 건강 보험
  if (id.includes('health_insurance') || task.includes('health insurance')) {
    const insuranceUrl: Record<string, string> = {
      IE: 'https://www.endsleigh.co.uk/international-student-insurance',
      UK: 'https://www.endsleigh.co.uk/international-student-insurance',
      AU: 'https://www.allianzcare.com.au/en/students.html',
      CA: 'https://guard.me',
      US: 'https://www.iso.com/international-student-insurance',
    }
    return {
      label: 'Get a quote',
      url: insuranceUrl[country.toUpperCase()] ?? 'https://www.endsleigh.co.uk/international-student-insurance',
    }
  }

  // 은행 계좌
  if (id.includes('bank_account') || task.includes('bank account') || task.includes('banking')) {
    return { label: 'Open with Wise', url: 'https://wise.com/open-account' }
  }

  // 비자 신청 공식 사이트
  if (id.includes('visa_application_form') || task.includes('visa application form')) {
    const visaUrl: Record<string, string> = {
      IE: 'https://www.visas.inis.gov.ie',
      UK: 'https://www.gov.uk/apply-uk-visa',
      AU: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500',
      CA: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit.html',
      US: 'https://travel.state.gov/content/travel/en/us-visas/study.html',
    }
    return {
      label: 'Official portal',
      url: visaUrl[country.toUpperCase()] ?? 'https://www.gov.uk/apply-uk-visa',
    }
  }

  // 숙소 검색
  if (id.includes('accommodation') || task.includes('accommodation')) {
    return { label: 'Find housing', url: 'https://www.uniplaces.com' }
  }

  return null
}

const COUNTRIES = [
  { value: 'IE', label: '🇮🇪 Ireland' },
  { value: 'AU', label: '🇦🇺 Australia' },
  { value: 'CA', label: '🇨🇦 Canada' },
  { value: 'UK', label: '🇬🇧 United Kingdom' },
  { value: 'US', label: '🇺🇸 United States' },
]

const VISA_TYPES = [
  { value: 'student',        label: '🎓 Student Visa' },
  { value: 'graduate-work',  label: '💼 Post-Study Work Visa' },
  { value: 'skilled-worker', label: '🏢 Skilled Worker Visa' },
]

export default function ChecklistPage() {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [country, setCountry] = useState('IE')
  const [visaType, setVisaType] = useState('student')
  const [items, setItems] = useState<ChecklistItem[]>([])
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const [fromCache, setFromCache] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user)
      if (!data.user) return

      // 마지막 저장된 체크리스트 자동 로드
      const { data: progress } = await supabase
        .from('user_checklist_progress')
        .select('country, visa_type, checked_items')
        .eq('user_id', data.user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .single()

      if (!progress) return

      // 마지막 나라/비자 세팅
      setCountry(progress.country)
      setVisaType(progress.visa_type)
      setCheckedIds(new Set(progress.checked_items as string[]))

      // 캐시에서 체크리스트 아이템 로드
      const { data: cached } = await supabase
        .from('checklist_cache')
        .select('items')
        .eq('country', progress.country)
        .eq('visa_type', progress.visa_type)
        .single()

      if (cached?.items) {
        setItems(cached.items as ChecklistItem[])
        setGenerated(true)
        setFromCache(true)
      }
    })
  }, [])

  // 유저 진행상황 로드
  useEffect(() => {
    if (!user || !generated) return
    supabase
      .from('user_checklist_progress')
      .select('checked_items')
      .eq('user_id', user.id)
      .eq('country', country)
      .eq('visa_type', visaType)
      .single()
      .then(({ data }) => {
        if (data?.checked_items) {
          setCheckedIds(new Set(data.checked_items as string[]))
        }
      })
  }, [user, generated, country, visaType])

  async function handleGenerate() {
    setLoading(true)
    setGenerated(false)
    setCheckedIds(new Set())
    setCollapsed(new Set())

    const res = await fetch('/api/checklist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ country, visa_type: visaType }),
    })
    const json = await res.json()

    if (json.items) {
      setItems(json.items)
      setFromCache(json.cached ?? false)
      setGenerated(true)

      // 저장된 진행상황 복원 (캐시 즉시 로드/재생성 시에도 체크 상태 유지)
      if (user) {
        const { data: prog } = await supabase
          .from('user_checklist_progress')
          .select('checked_items')
          .eq('user_id', user.id)
          .eq('country', country)
          .eq('visa_type', visaType)
          .maybeSingle()
        setCheckedIds(new Set((prog?.checked_items as string[] | undefined) ?? []))
      }
    }
    setLoading(false)
  }

  async function toggleCheck(id: string) {
    const next = new Set(checkedIds)
    if (next.has(id)) { next.delete(id) } else { next.add(id) }
    setCheckedIds(next)

    if (!user) return
    await supabase
      .from('user_checklist_progress')
      .upsert(
        {
          user_id: user.id,
          country,
          visa_type: visaType,
          checked_items: Array.from(next),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,country,visa_type' }
      )
  }

  function toggleCollapse(category: string) {
    setCollapsed(prev => {
      const next = new Set(prev)
      if (next.has(category)) { next.delete(category) } else { next.add(category) }
      return next
    })
  }

  // 카테고리별 그룹핑
  const grouped = items.reduce<Record<string, ChecklistItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {})

  const totalItems = items.length
  const checkedCount = checkedIds.size
  const progress = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">

      {/* 헤더 */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Application Checklist
        </h1>
        <p className="text-slate-500 text-sm mt-2">
          AI-generated visa checklist tailored to your destination and visa type.
        </p>
      </div>

      {/* 설정 카드 */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 국가 */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">Destination Country</label>
            <select
              value={country}
              onChange={e => { setCountry(e.target.value); setGenerated(false) }}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
            >
              {COUNTRIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* 비자 타입 */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">Visa Type</label>
            <select
              value={visaType}
              onChange={e => { setVisaType(e.target.value); setGenerated(false) }}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
            >
              {VISA_TYPES.map(v => (
                <option key={v.value} value={v.value}>{v.label}</option>
              ))}
            </select>
          </div>
        </div>

        {generated && (
          <p className="text-xs text-center text-slate-400 -mb-2">
            Your progress is auto-saved. Regenerate to refresh the checklist.
          </p>
        )}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 text-sm"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Generating checklist...</>
          ) : generated ? (
            <><Sparkles className="w-4 h-4" /> Regenerate Checklist</>
          ) : (
            <><Sparkles className="w-4 h-4" /> Generate Checklist</>
          )}
        </button>

        {fromCache && generated && (
          <p className="text-xs text-center text-slate-400">
            ⚡ Loaded from cache — instant result
          </p>
        )}
      </div>

      {/* 진행률 */}
      {generated && totalItems > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl px-6 py-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-700">Overall Progress</span>
            <span className="text-sm font-bold text-indigo-600">{checkedCount} / {totalItems}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-2">{progress}% complete</p>
        </div>
      )}

      {/* 체크리스트 */}
      {generated && (
        <div className="space-y-4">
          {Object.entries(grouped).map(([category, categoryItems]) => {
            const isCollapsed = collapsed.has(category)
            const doneCount = categoryItems.filter(i => checkedIds.has(i.id)).length
            const allDone = doneCount === categoryItems.length

            return (
              <div
                key={category}
                className={`border rounded-2xl overflow-hidden shadow-sm transition-opacity ${
                  allDone ? 'opacity-60' : ''
                } border-slate-200`}
              >
                {/* 카테고리 헤더 */}
                <button
                  onClick={() => toggleCollapse(category)}
                  className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                      allDone ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}>
                      {allDone ? '✓' : doneCount > 0 ? doneCount : ''}
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{category}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">{doneCount}/{categoryItems.length}</span>
                    {isCollapsed
                      ? <ChevronDown className="w-4 h-4 text-slate-400" />
                      : <ChevronUp className="w-4 h-4 text-slate-400" />
                    }
                  </div>
                </button>

                {/* 아이템 목록 */}
                {!isCollapsed && (
                  <ul className="bg-white divide-y divide-slate-100">
                    {categoryItems.map(item => (
                      <li key={item.id}>
                        <button
                          onClick={() => toggleCheck(item.id)}
                          className="w-full flex items-start gap-3 px-5 py-4 hover:bg-slate-50 transition-colors text-left"
                        >
                          {checkedIds.has(item.id)
                            ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                            : <Circle className="w-5 h-5 text-slate-300 shrink-0 mt-0.5" />
                          }
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-sm ${checkedIds.has(item.id) ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                                {item.task}
                              </span>
                              {!item.required && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-400 font-medium">
                                  Optional
                                </span>
                              )}
                            </div>
                            {item.note && (
                              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{item.note}</p>
                            )}
                            {(() => {
                              const affiliate = getAffiliateLink(item, country)
                              if (!affiliate) return null
                              return (
                                <a
                                  href={affiliate.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={e => e.stopPropagation()}
                                  className="inline-flex items-center gap-1 mt-1.5 text-[11px] font-medium text-indigo-600 hover:text-indigo-700 hover:underline"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  {affiliate.label}
                                </a>
                              )
                            })()}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
      )}

    </div>
  )
}
