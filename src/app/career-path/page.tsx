'use client'

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase-client"
import { Map, Loader2, RefreshCw, ChevronDown, ChevronUp, Briefcase, Clock, Award, Lightbulb, ArrowRight } from "lucide-react"
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
  ie:'Ireland', au:'Australia', ca:'Canada', uk:'United Kingdom', us:'United States',
  IE:'Ireland', AU:'Australia', CA:'Canada', UK:'United Kingdom', US:'United States',
}

export default function CareerPathPage() {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [prefs, setPrefs] = useState<{ country: string; goal: string; english: string } | null>(null)

  // 폼 state
  const [field, setField] = useState('')
  const [currentStatus, setCurrentStatus] = useState<CurrentStatus>('student')
  const [experience, setExperience] = useState('1-3')
  const [goalText, setGoalText] = useState('')

  // 결과 state
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())

  // 저장된 경로 목록
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
        setPrefs({
          country: prefsRes.data.recommended_country ?? 'ie',
          goal: prefsRes.data.goal ?? 'visa',
          english: prefsRes.data.english ?? 'intermediate',
        })
      }
      if (pathsRes.data) setSavedPaths(pathsRes.data as SavedPath[])
      setPathsLoading(false)
    })
  }, [])

  async function handleGenerate() {
    if (!field.trim()) return
    setLoading(true)
    setError(null)
    setRoadmap(null)
    setCollapsed(new Set())

    try {
      const res = await fetch('/api/career-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country: prefs?.country ?? 'ie',
          field: field.trim(),
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

      // Supabase에 저장
      if (user) {
        const { data: saved } = await supabase.from('user_career_paths').insert({
          user_id: user.id,
          country: prefs?.country ?? 'ie',
          field: field.trim(),
          current_status: currentStatus,
          goal_text: goalText.trim() || null,
          roadmap: json.roadmap,
        }).select('id,country,field,roadmap,generated_at').single()
        if (saved) setSavedPaths(prev => [saved as SavedPath, ...prev])
      }
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
    setCollapsed(new Set())
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function deletePath(id: string) {
    await supabase.from('user_career_paths').delete().eq('id', id)
    setSavedPaths(prev => prev.filter(p => p.id !== id))
    if (roadmap) setRoadmap(null)
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">

      {/* 헤더 */}
      <div className="flex items-center gap-3">
        <Map className="w-6 h-6 text-indigo-500 shrink-0" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Career Route Map</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Your step-by-step path from graduation to{' '}
            {prefs?.goal === 'pr' ? 'permanent residency' : prefs?.goal === 'visa' ? 'working abroad' : 'your dream career'}.
          </p>
        </div>
      </div>

      {/* 설정 카드 */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* 국가 (read-only, prefs에서) */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">Target Country</label>
            <div className="h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center text-sm text-slate-700">
              {COUNTRY_NAME[prefs?.country ?? 'ie'] ?? 'Ireland'}
              <span className="ml-1.5 text-xs text-slate-400">(from your profile)</span>
            </div>
          </div>

          {/* 전공 */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">Field of Study</label>
            <input
              type="text"
              value={field}
              onChange={e => setField(e.target.value)}
              placeholder="e.g. Nursing, Computer Science…"
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
            />
          </div>

          {/* 현재 상황 */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">Current Status</label>
            <select
              value={currentStatus}
              onChange={e => setCurrentStatus(e.target.value as CurrentStatus)}
              className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
            >
              <option value="student">🎓 Currently a student</option>
              <option value="fresh_grad">🌱 Recent graduate (0–1 yr)</option>
              <option value="professional">💼 Working professional</option>
              <option value="career_changer">🔄 Career changer</option>
            </select>
          </div>

          {/* 경력 (professional/career_changer만) */}
          {(currentStatus === 'professional' || currentStatus === 'career_changer') && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">Years of Experience</label>
              <select
                value={experience}
                onChange={e => setExperience(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
              >
                <option value="0-1">Less than 1 year</option>
                <option value="1-3">1–3 years</option>
                <option value="3-5">3–5 years</option>
                <option value="5+">5+ years</option>
              </select>
            </div>
          )}
        </div>

        {/* 추가 목표 (선택) */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-600">
            Specific goal <span className="text-slate-400">(optional)</span>
          </label>
          <input
            type="text"
            value={goalText}
            onChange={e => setGoalText(e.target.value)}
            placeholder="e.g. Become a team lead at a tech company, achieve PR within 5 years…"
            className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
          />
        </div>

        {error && (
          <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">{error}</p>
        )}

        <button
          onClick={handleGenerate}
          disabled={loading || !field.trim()}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 text-sm"
        >
          {loading
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating your route map…</>
            : roadmap
            ? <><RefreshCw className="w-4 h-4" /> Regenerate Route Map</>
            : <><Map className="w-4 h-4" /> Generate My Route Map</>
          }
        </button>
      </div>

      {/* 로드맵 결과 */}
      {roadmap && (
        <div className="space-y-6">

          {/* 요약 바 */}
          <div className="bg-white border border-slate-200 rounded-2xl px-6 py-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-1">{roadmap.title}</h2>
            <p className="text-sm text-slate-500 mb-4">{roadmap.summary}</p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-700">{roadmap.total_duration}</span>
                <span className="text-xs text-slate-400">total</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-medium text-slate-700">{roadmap.stages.length} stages</span>
              </div>
            </div>
            {roadmap.pr_pathway && (
              <div className="mt-4 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
                <p className="text-xs font-semibold text-indigo-700 mb-0.5">PR / Long-term pathway</p>
                <p className="text-sm text-indigo-600">{roadmap.pr_pathway}</p>
              </div>
            )}
          </div>

          {/* 스테이지 카드들 (수직 타임라인) */}
          <div className="relative space-y-4">
            {/* 수직 연결선 */}
            <div className="absolute left-[23px] top-8 bottom-8 w-0.5 bg-slate-200 z-0 pointer-events-none" />

            {roadmap.stages.map((stage, idx) => {
              const c = COLOR_MAP[stage.color] ?? COLOR_MAP.indigo
              const isCollapsed = collapsed.has(stage.id)
              return (
                <div key={stage.id} className={`relative border rounded-2xl overflow-hidden shadow-sm ${c.border}`}>
                  {/* 헤더 */}
                  <button
                    onClick={() => toggleStage(stage.id)}
                    className={`w-full flex items-center justify-between px-5 py-4 ${c.bg} transition-colors`}
                  >
                    <div className="flex items-center gap-3">
                      {/* 번호 뱃지 */}
                      <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${
                        idx === 0 ? 'bg-indigo-500' : 'bg-slate-300'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-sm font-semibold ${c.text}`}>{stage.title}</span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c.badge}`}>
                            {stage.phase}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">{stage.duration}</p>
                      </div>
                    </div>
                    {isCollapsed
                      ? <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      : <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    }
                  </button>

                  {/* 내용 */}
                  {!isCollapsed && (
                    <div className="bg-white px-5 py-4 space-y-4">
                      <p className="text-sm text-slate-600">{stage.description}</p>

                      {/* 액션 리스트 */}
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Actions</p>
                        <ul className="space-y-1.5">
                          {stage.actions.map((action, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                              <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* 메타 정보 그리드 */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-slate-50 rounded-xl px-3 py-2.5">
                          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Visa</p>
                          <p className="text-xs font-medium text-slate-700">{stage.visa}</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl px-3 py-2.5">
                          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Milestone</p>
                          <p className="text-xs font-medium text-slate-700">{stage.milestone}</p>
                        </div>
                        {stage.salary_range && (
                          <div className="bg-slate-50 rounded-xl px-3 py-2.5">
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1">Salary Range</p>
                            <p className="text-xs font-medium text-slate-700">{stage.salary_range}</p>
                          </div>
                        )}
                      </div>

                      {/* 팁 */}
                      <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-700">{stage.tips}</p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Key considerations */}
          {roadmap.key_considerations.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl px-6 py-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="w-4 h-4 text-slate-400" />
                <h3 className="text-sm font-semibold text-slate-900">Key Considerations</h3>
              </div>
              <ul className="space-y-2">
                {roadmap.key_considerations.map((note, i) => (
                  <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                    <span className="text-slate-300 shrink-0">•</span>
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 저장된 경로 목록 */}
      {!pathsLoading && savedPaths.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-700">Your saved route maps</h3>
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
            {savedPaths.map(path => (
              <div key={path.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition-colors">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{path.roadmap.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {COUNTRY_NAME[path.country]} · {path.field} · {new Date(path.generated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <button
                    onClick={() => loadSavedPath(path)}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium px-2 py-1 rounded-lg hover:bg-indigo-50 transition-colors"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => deletePath(path.id)}
                    className="text-xs text-slate-400 hover:text-red-500 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
