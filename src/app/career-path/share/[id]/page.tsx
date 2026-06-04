'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase-client"
import { Map, Clock, Award, ArrowRight, Lightbulb, Briefcase } from "lucide-react"
import { useParams } from "next/navigation"

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

export default function ShareCareerPathPage() {
  const params = useParams()
  const id = params.id as string
  const supabase = createClient()

  const [roadmap, setRoadmap] = useState<Roadmap | null>(null)
  const [meta, setMeta] = useState<{ country: string; field: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    supabase
      .from('user_career_paths')
      .select('roadmap, country, field, is_public')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data || !data.is_public) {
          setNotFound(true)
        } else {
          setRoadmap(data.roadmap as Roadmap)
          setMeta({ country: data.country, field: data.field })
        }
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (notFound || !roadmap) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="text-slate-500 mb-4">This route map is not available.</p>
        <Link
          href="/career-path"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm"
        >
          Create your own <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* 상단 배너 — CTA */}
      <div className="bg-indigo-600 text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Map className="w-4 h-4" />
          <span className="text-sm font-medium">CampCareer — Study Abroad Career Map</span>
        </div>
        <Link
          href="/career-path"
          className="inline-flex items-center gap-1.5 bg-white text-indigo-600 font-semibold px-4 py-1.5 rounded-lg text-xs hover:bg-indigo-50 transition-colors"
        >
          Create mine <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">

        {/* 헤더 */}
        <div className="bg-white border border-slate-200 rounded-2xl px-6 py-5 shadow-sm">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs text-slate-400 mb-1">
                {COUNTRY_NAME[meta?.country ?? ''] ?? meta?.country} · {meta?.field}
              </p>
              <h1 className="text-xl font-bold text-slate-900">{roadmap.title}</h1>
              <p className="text-sm text-slate-500 mt-1">{roadmap.summary}</p>
              <div className="flex items-center gap-4 mt-3">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {roadmap.total_duration}
                </span>
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> {roadmap.stages.length} stages
                </span>
              </div>
            </div>
            <Link
              href="/career-path"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors shrink-0"
            >
              Create my own map <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* PR pathway */}
        {roadmap.pr_pathway && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl px-5 py-4">
            <p className="text-xs font-semibold text-indigo-700 mb-1">PR / Long-term Pathway</p>
            <p className="text-sm text-indigo-600">{roadmap.pr_pathway}</p>
          </div>
        )}

        {/* 스테이지 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roadmap.stages.map((stage, idx) => {
            const c = COLOR_MAP[stage.color] ?? COLOR_MAP.indigo
            return (
              <div key={stage.id} className={`border rounded-2xl overflow-hidden shadow-sm ${c.border}`}>
                <div className={`px-4 py-4 ${c.bg} flex items-start gap-3`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${idx === 0 ? 'bg-indigo-500' : 'bg-slate-300'}`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                      <span className={`text-sm font-semibold ${c.text}`}>{stage.title}</span>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c.badge}`}>{stage.phase}</span>
                    <p className="text-xs text-slate-400 mt-1">{stage.duration}</p>
                    <p className="text-xs text-slate-600 mt-1.5 font-medium">🎯 {stage.milestone}</p>
                  </div>
                </div>
                <div className="bg-white px-4 py-3 space-y-2">
                  <ul className="space-y-1">
                    {stage.actions.map((action, i) => (
                      <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                        <ArrowRight className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                        {action}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-start gap-2 bg-amber-50 border border-amber-100 rounded-lg px-2.5 py-2 mt-2">
                    <Lightbulb className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-amber-700">{stage.tips}</p>
                  </div>
                </div>
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
                  <span className="text-slate-300 shrink-0">•</span>{note}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 하단 CTA */}
        <div className="bg-indigo-600 rounded-2xl px-6 py-8 text-center">
          <h2 className="text-lg font-bold text-white mb-2">Want your own career route map?</h2>
          <p className="text-indigo-200 text-sm mb-5">
            AI-powered, personalized to your field, country, and current status.
          </p>
          <Link
            href="/career-path"
            className="inline-flex items-center gap-2 bg-white text-indigo-600 font-bold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors"
          >
            Create my Career Route Map <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  )
}
