'use client'

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase-client"
import { useTranslations } from "@/lib/i18n/locale-provider"
import {
  Map, Loader2, RefreshCw, ChevronDown, ChevronUp,
  Briefcase, Clock, Award, Lightbulb, ArrowRight, Search, X,
} from "lucide-react"
import type { User } from "@supabase/supabase-js"

type CurrentStatus = 'student' | 'fresh_grad' | 'professional' | 'career_changer'
type StageColor = 'indigo' | 'violet' | 'blue' | 'emerald' | 'amber' | 'rose'

type Stage = {
  id: string
  title: string
  duration: string
  phase: string
  color: StageColor
  description: string
  actions: string[]
  visa: string
  milestone: string
  salary_range: string | null
  tips: string
}

type Roadmap = {
  title: string
  summary: string
  total_duration: string
  stages: Stage[]
  key_considerations: string[]
  pr_pathway: string | null
}

type SavedPath = {
  id: string
  country: string
  field: string
  roadmap: Roadmap
  generated_at: string
}

const COLOR_MAP: Record<StageColor, { border: string; bg: string; text: string; badge: string }> = {
  indigo:  { border: 'border-indigo-200',  bg: 'bg-indigo-50',  text: 'text-indigo-700',  badge: 'bg-indigo-100 text-indigo-700' },
  violet:  { border: 'border-violet-200',  bg: 'bg-violet-50',  text: 'text-violet-700',  badge: 'bg-violet-100 text-violet-700' },
  blue:    { border: 'border-blue-200',    bg: 'bg-blue-50',    text: 'text-blue-700',    badge: 'bg-blue-100 text-blue-700' },
  emerald: { border: 'border-emerald-200', bg: 'bg-emerald-50', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700' },
  amber:   { border: 'border-amber-200',   bg: 'bg-amber-50',   text: 'text-amber-700',   badge: 'bg-amber-100 text-amber-700' },
  rose:    { border: 'border-rose-200',    bg: 'bg-rose-50',    text: 'text-rose-700',    badge: 'bg-rose-100 text-rose-700' },
}

const COUNTRY_NAME: Record<string, string> = {
  ie: 'Ireland',  au: 'Australia', ca: 'Canada', uk: 'United Kingdom', us: 'United States',
  IE: 'Ireland',  AU: 'Australia', CA: 'Canada', UK: 'United Kingdom', US: 'United States',
}

const COUNTRIES_LIST = [
  { value: 'ie', label: '🇮🇪 Ireland' },
  { value: 'au', label: '🇦🇺 Australia' },
  { value: 'ca', label: '🇨🇦 Canada' },
  { value: 'uk', label: '🇬🇧 United Kingdom' },
  { value: 'us', label: '🇺🇸 United States' },
]

export default function CareerPathPage() {
  const supabase = createClient()
  const t = useTranslations()
  const tc = t.careerPath
  const [user, setUser] = useState<User | null>(null)
  const [prefs, setPrefs] = useState<{ country: string; goal: string; english: string } | null>(null)

  const [view, setView] = useState<'onboarding' | 'results'>('onboarding')

  const [field, setField] = useState('')
  const [country, setCountry] = useState('ie')
  const [currentStatus, setCurrentStatus] = useState<CurrentStatus>('student')
  const [experience, setExperience] = useState('1-3')
  const [goalText, setGoalText] = useState('')

  const [fieldInput, setFieldInput] = useState('')
  const [fieldOptions, setFieldOptions] = useState<string[]>([])
  const [fieldOpen, setFieldOpen] = useState(false)
  const fieldRef = useRef<HTMLDivElement>(null)

  const [roadmap, setRoadmap] = useState<Roadmap | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())

  const [savedPaths, setSavedPaths] = useState<SavedPath[]>([])
  const [pathsLoading, setPathsLoading] = useState(true)

  // 초기 로드
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user)
      if (!data.user) { setPathsLoading(false); return }

      const [prefsRes, pathsRes] = await Promise.all([
        supabase.from('user_preferences').select('recommended_country,goal,english').eq('id', data.user.id).maybeSingle(),
        supabase.from('user_career_paths').select('id,country,field,roadmap,generated_at').eq('user_id', data.user.id).order('generated_at', { ascending: false }),
      ])

      if (prefsRes.data) {
        const p = {
          country: prefsRes.data.recommended_country ?? 'ie',
          goal: prefsRes.data.goal ?? 'visa',
          english: prefsRes.data.english ?? 'intermediate',
        }
        setPrefs(p)
        setCountry(p.country)
      }
      if (pathsRes.data) {
        const paths = pathsRes.data as SavedPath[]
        setSavedPaths(paths)
        if (paths.length > 0) setView('results')
      }
      setPathsLoading(false)
    })
  }, [])

  // view=results 이지만 roadmap이 없으면 onboarding으로 fallback
  // loading 중에는 적용하지 않음 (regenerate 시 일시적 null 상태 방지)
  useEffect(() => {
    if (view === 'results' && !roadmap && !loading) {
      setView('onboarding')
    }
  }, [roadmap, view, loading])

  // field 자동완성 (250ms debounce)
  useEffect(() => {
    if (!fieldInput.trim()) {
      setFieldOptions([])
      setFieldOpen(false)
      return
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/roi/fields?q=${encodeURIComponent(fieldInput)}&country=${country}`)
        const json = await res.json()
        if (json.fields) {
          setFieldOptions(json.fields)
          if (json.fields.length > 0) setFieldOpen(true)
        }
      } catch {
        // ignore
      }
    }, 250)
    return () => clearTimeout(timer)
  }, [fieldInput, country])

  // 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (fieldRef.current && !fieldRef.current.contains(e.target as Node)) {
        setFieldOpen(false)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [])

  async function handleGenerate() {
    if (!fieldInput.trim()) return
    const trimmedField = fieldInput.trim()
    setField(trimmedField)
    setLoading(true)
    setError(null)
    setRoadmap(null)
    setCollapsed(new Set())

    try {
      const res = await fetch('/api/career-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country,
          field: trimmedField,
          currentStatus,
          experience: currentStatus === 'professional' || currentStatus === 'career_changer' ? experience : '0',
          goalText: goalText.trim(),
          goal: prefs?.goal ?? 'visa',
          english: prefs?.english ?? 'intermediate',
        }),
      })
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      setRoadmap(json.roadmap)

      if (user) {
        const { data: saved } = await supabase.from('user_career_paths').insert({
          user_id: user.id,
          country,
          field: trimmedField,
          current_status: currentStatus,
          goal_text: goalText.trim() || null,
          roadmap: json.roadmap,
        }).select('id,country,field,roadmap,generated_at').single()
        if (saved) setSavedPaths(prev => [saved as SavedPath, ...prev])
      }
      setView('results')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  function toggleStage(id: string) {
    setCollapsed(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  function loadSavedPath(path: SavedPath) {
    setRoadmap(path.roadmap)
    setField(path.field)
    setFieldInput(path.field)
    setCountry(path.country)
    setCollapsed(new Set())
    setView('results')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function deletePath(id: string) {
    await supabase.from('user_career_paths').delete().eq('id', id)
    setSavedPaths(prev => prev.filter(p => p.id !== id))
    if (roadmap) setRoadmap(null)
  }

  // ─── ONBOARDING VIEW ────────────────────────────────────────────────────────
  if (view === 'onboarding') {
    return (
      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <Map className="w-6 h-6 text-indigo-500" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{tc.pageTitle}</h1>
            <p className="text-sm text-slate-400 mt-0.5">
              {prefs?.goal === 'pr' ? tc.pageSubtitlePr : prefs?.goal === 'study' ? tc.pageSubtitleStudy : tc.pageSubtitleVisa}
            </p>
            <p className="text-sm text-slate-500 mt-0.5">
              {tc.onboardingSubtitle}
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">

          {/* 국가 칩 선택 */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-600">{tc.targetCountryLabel}</label>
            <div className="flex flex-wrap gap-2">
              {COUNTRIES_LIST.map(c => (
                <button
                  key={c.value}
                  onClick={() => { setCountry(c.value); setField(''); setFieldInput('') }}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors focus:outline-none
                    ${country === c.value
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* 전공 자동완성 */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">{tc.fieldLabel}</label>
            <div ref={fieldRef} className="relative">
              <div className="flex items-center border border-slate-200 rounded-xl bg-white focus-within:ring-2 focus-within:ring-indigo-300 px-3 h-10">
                <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
                <input
                  type="text"
                  value={fieldInput}
                  onChange={e => { setFieldInput(e.target.value); if (!e.target.value) setField('') }}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && fieldOptions.length > 0) {
                      setField(fieldOptions[0])
                      setFieldInput(fieldOptions[0])
                      setFieldOpen(false)
                    }
                  }}
                  placeholder={tc.fieldPlaceholder}
                  className="flex-1 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent"
                />
                {fieldInput && (
                  <button
                    onClick={() => { setFieldInput(''); setField(''); setFieldOptions([]); setFieldOpen(false) }}
                    className="text-slate-300 hover:text-slate-500 ml-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {fieldOpen && fieldOptions.length > 0 && (
                <div className="absolute z-50 top-full left-0 right-0 mt-1 rounded-xl border border-slate-200 bg-white shadow-xl max-h-48 overflow-y-auto">
                  {fieldOptions.map(f => (
                    <button
                      key={f}
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => { setField(f); setFieldInput(f); setFieldOpen(false) }}
                      className="w-full px-4 py-2.5 text-left text-sm hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 transition-colors"
                    >
                      {f.endsWith('.') ? f.slice(0, -1) : f}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Current Status + Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">{tc.statusLabel}</label>
              <select
                value={currentStatus}
                onChange={e => setCurrentStatus(e.target.value as CurrentStatus)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
              >
                <option value="student">{tc.status.student}</option>
                <option value="fresh_grad">{tc.status.freshGrad}</option>
                <option value="professional">{tc.status.professional}</option>
                <option value="career_changer">{tc.status.careerChanger}</option>
              </select>
            </div>
            {(currentStatus === 'professional' || currentStatus === 'career_changer') && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">{tc.experienceLabel}</label>
                <select
                  value={experience}
                  onChange={e => setExperience(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                >
                  <option value="0-1">{tc.experience.lessThanOne}</option>
                  <option value="1-3">{tc.experience.oneToThree}</option>
                  <option value="3-5">{tc.experience.threeToFive}</option>
                  <option value="5+">{tc.experience.fivePlus}</option>
                </select>
              </div>
            )}
          </div>

          {/* Specific goal */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">
              {tc.goalLabel} <span className="text-slate-400">{tc.goalOptional}</span>
            </label>
            <input
              type="text"
              value={goalText}
              onChange={e => setGoalText(e.target.value)}
              placeholder={tc.goalPlaceholder}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
            />
          </div>

          {error && (
            <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">{error}</p>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading || !fieldInput.trim()}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 text-sm"
          >
            {loading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> {tc.generatingButton}</>
              : roadmap
              ? <><Map className="w-4 h-4" /> {tc.regenerateButton}</>
              : <><Map className="w-4 h-4" /> {tc.generateButton}</>
            }
          </button>

          {savedPaths.length > 0 && !pathsLoading && (
            <div className="pt-2 border-t border-slate-100">
              <p className="text-xs text-slate-400 mb-2">{tc.previousRoutes}</p>
              <div className="space-y-1.5">
                {savedPaths.slice(0, 3).map(path => (
                  <button
                    key={path.id}
                    onClick={() => { loadSavedPath(path); setView('results') }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-indigo-50 text-sm text-slate-700 hover:text-indigo-700 transition-colors flex items-center justify-between"
                  >
                    <span className="truncate">{path.roadmap.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0 ml-2 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ─── RESULTS VIEW ────────────────────────────────────────────────────────────
  if (!roadmap) return null

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">

      {/* 헤더 바 */}
      <div className="bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-sm flex items-start justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-slate-900 truncate">{roadmap.title}</h2>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {roadmap.total_duration} {tc.totalDuration}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> {roadmap.stages.length} {tc.stages}
            </span>
            <span className="text-xs text-slate-500">
              {COUNTRY_NAME[country]} · {field}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setView('onboarding')}
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> {tc.findAnotherRoute}
          </button>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors disabled:opacity-50"
          >
            {loading
              ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
              : <RefreshCw className="w-3.5 h-3.5" />
            }
            {tc.regenerateButton}
          </button>
        </div>
      </div>

      {/* 메인 2단 그리드 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 왼쪽: 스테이지 2열 그리드 */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roadmap.stages.map((stage, idx) => {
              const c = COLOR_MAP[stage.color] ?? COLOR_MAP.indigo
              const isCollapsed = collapsed.has(stage.id)
              return (
                <div key={stage.id} className={`border rounded-2xl overflow-hidden shadow-sm ${c.border} flex flex-col`}>
                  <button
                    onClick={() => toggleStage(stage.id)}
                    className={`w-full flex items-start gap-3 px-4 py-4 ${c.bg} transition-colors text-left`}
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5
                      ${idx === 0 ? 'bg-indigo-500' : 'bg-slate-300'}`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                        <span className={`text-sm font-semibold ${c.text}`}>{stage.title}</span>
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c.badge}`}>
                        {stage.phase}
                      </span>
                      <p className="text-xs text-slate-400 mt-1">{stage.duration}</p>
                      <p className="text-xs text-slate-600 mt-1.5 font-medium line-clamp-2">🎯 {stage.milestone}</p>
                    </div>
                    <div className="shrink-0 mt-0.5">
                      {isCollapsed
                        ? <ChevronDown className="w-4 h-4 text-slate-400" />
                        : <ChevronUp className="w-4 h-4 text-slate-400" />}
                    </div>
                  </button>

                  {!isCollapsed && (
                    <div className="bg-white px-4 py-4 space-y-3 flex-1">
                      <p className="text-sm text-slate-600">{stage.description}</p>
                      <div>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">{tc.actionsLabel}</p>
                        <ul className="space-y-1">
                          {stage.actions.map((action, i) => (
                            <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                              <ArrowRight className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-slate-50 rounded-lg px-2.5 py-2">
                          <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">{tc.visaLabel}</p>
                          <p className="text-[11px] font-medium text-slate-700">{stage.visa}</p>
                        </div>
                        {stage.salary_range && (
                          <div className="bg-slate-50 rounded-lg px-2.5 py-2">
                            <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide mb-0.5">{tc.salaryLabel}</p>
                            <p className="text-[11px] font-medium text-slate-700">{stage.salary_range}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-lg px-2.5 py-2">
                        <Lightbulb className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-amber-700">{stage.tips}</p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* 오른쪽 사이드바 */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-6 space-y-4">

            {roadmap.pr_pathway && (
              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
                <p className="text-xs font-semibold text-indigo-700 mb-1.5 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" /> {tc.prPathwayTitle}
                </p>
                <p className="text-sm text-indigo-600 leading-relaxed">{roadmap.pr_pathway}</p>
              </div>
            )}

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <p className="text-xs font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" /> {tc.considerationsTitle}
              </p>
              <ul className="space-y-2">
                {roadmap.key_considerations.map((note, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                    <span className="text-slate-300 shrink-0 mt-0.5">•</span>{note}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <p className="text-xs font-semibold text-slate-700 mb-3">Route Summary</p>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Total duration</span>
                  <span className="font-medium text-slate-700">{roadmap.total_duration}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Stages</span>
                  <span className="font-medium text-slate-700">{roadmap.stages.length}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Country</span>
                  <span className="font-medium text-slate-700">{COUNTRY_NAME[country]}</span>
                </div>
              </div>
            </div>

            {savedPaths.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                <p className="text-xs font-semibold text-slate-700 mb-3">{tc.savedRoutesTitle}</p>
                <div className="space-y-1.5">
                  {savedPaths.map(path => (
                    <div key={path.id} className="flex items-center justify-between gap-2">
                      <button
                        onClick={() => loadSavedPath(path)}
                        title={tc.loadButton}
                        className="flex-1 text-left text-xs text-slate-600 hover:text-indigo-600 truncate transition-colors py-1"
                      >
                        {path.roadmap.title}
                      </button>
                      <button
                        onClick={() => deletePath(path.id)}
                        title={tc.deleteButton}
                        className="text-[10px] text-slate-400 hover:text-red-500 transition-colors shrink-0"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  )
}
