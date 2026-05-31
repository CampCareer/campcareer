'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { ArrowRight, Check } from 'lucide-react'

type Step = 1 | 2 | 3 | 4 | 5
type Goal = 'visa' | 'pr' | 'study'
type Budget = 'low' | 'mid' | 'high'
type English = 'advanced' | 'intermediate' | 'beginner'
type Environment = 'city' | 'town' | 'any'

const STEPS = [
  { step: 1, label: 'Goal' },
  { step: 2, label: 'Budget' },
  { step: 3, label: 'English' },
  { step: 4, label: 'Environment' },
]

// 추천 로직 — ROI 데이터 기반
function recommend(
  goal: Goal,
  budget: Budget,
  english: English,
  environment: Environment
): { country: string; flag: string; reasons: string[] } {
  const scores: Record<string, number> = { IE: 0, AU: 0, CA: 0, UK: 0, US: 0 }

  // Goal
  if (goal === 'visa') {
    scores.AU += 3; scores.CA += 3; scores.UK += 2; scores.IE += 1
  } else if (goal === 'pr') {
    scores.CA += 4; scores.AU += 3; scores.IE += 2
  } else {
    scores.IE += 3; scores.UK += 3; scores.US += 2; scores.AU += 1
  }

  // Budget
  if (budget === 'low') {
    scores.IE += 4; scores.CA += 2; scores.UK += 1
  } else if (budget === 'mid') {
    scores.AU += 3; scores.CA += 3; scores.IE += 2; scores.UK += 2
  } else {
    scores.US += 4; scores.UK += 3; scores.AU += 2
  }

  // English
  if (english === 'beginner') {
    scores.CA += 2; scores.IE += 2
  } else if (english === 'intermediate') {
    scores.AU += 2; scores.IE += 2; scores.UK += 1
  } else {
    scores.US += 2; scores.UK += 2; scores.AU += 1
  }

  // Environment
  if (environment === 'city') {
    scores.UK += 2; scores.US += 2; scores.AU += 1
  } else if (environment === 'town') {
    scores.IE += 3; scores.CA += 2; scores.AU += 1
  } else {
    scores.CA += 1; scores.IE += 1
  }

  const top = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]

  const COUNTRY_META: Record<string, { flag: string; reasons: Record<string, string[]> }> = {
    IE: {
      flag: '🇮🇪',
      reasons: {
        visa:  ['EU 취업 가능', 'Critical Skills 비자 경로', '낮은 학비'],
        pr:    ['EU 영주권 경로', 'Stamp 4 취득 가능', '낮은 생활비'],
        study: ['최저 학비 (€10k~)', 'HEA 졸업생 연봉 데이터', '영어권 EU 입문'],
      },
    },
    AU: {
      flag: '🇦🇺',
      reasons: {
        visa:  ['졸업 후 2~4년 취업 비자', 'CRICOS 인증 8,597개 코스', '높은 졸업생 연봉'],
        pr:    ['포인트제 영주권 (189/190)', '주정부 스폰서 가능', '숙련직 수요 높음'],
        study: ['QILT 기반 졸업생 성과 데이터', '다양한 전공 선택', '생활 환경 우수'],
      },
    },
    CA: {
      flag: '🇨🇦',
      reasons: {
        visa:  ['PGWP 최대 3년', 'Express Entry 이민 경로', '높은 정착 지원'],
        pr:    ['Express Entry 최단 영주권', '주정부 이민 프로그램', '안정적 이민 정책'],
        study: ['합리적 학비', '프랑스어권 선택 가능', '다문화 환경'],
      },
    },
    UK: {
      flag: '🇬🇧',
      reasons: {
        visa:  ['Graduate Route 2년 취업', '글로벌 기업 접근성', 'HESA 연봉 데이터'],
        pr:    ['Skilled Worker 비자', '5년 후 영주권', '런던 금융 허브'],
        study: ['Russell Group 명문대', '1년 석사 과정', 'HESA 졸업생 데이터'],
      },
    },
    US: {
      flag: '🇺🇸',
      reasons: {
        visa:  ['OPT 최대 3년 (STEM)', '실리콘밸리 취업 기회', '높은 졸업생 연봉'],
        pr:    ['EB-2/EB-3 취업 영주권', '다양한 이민 경로', '기술직 수요'],
        study: ['College Scorecard 데이터', '다양한 장학금', '세계 최고 수준 대학'],
      },
    },
  }

  const meta = COUNTRY_META[top]
  return {
    country: top,
    flag: meta.flag,
    reasons: meta.reasons[goal],
  }
}

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState<Step>(1)
  const [goal, setGoal] = useState<Goal | null>(null)
  const [budget, setBudget] = useState<Budget | null>(null)
  const [english, setEnglish] = useState<English | null>(null)
  const [environment, setEnvironment] = useState<Environment | null>(null)
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState<{ country: string; flag: string; reasons: string[] } | null>(null)

  // suppress unused warning — STEPS is referenced for future step indicator use
  void STEPS

  async function handleFinish(env: Environment) {
    if (!goal || !budget || !english) return
    setSaving(true)
    const rec = recommend(goal, budget, english, env)
    setResult(rec)
    setEnvironment(env)
    setStep(5 as Step)

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('user_preferences').upsert({
        id: user.id,
        goal,
        budget,
        english,
        environment: env,
        recommended_country: rec.country,
        completed_at: new Date().toISOString(),
      })
    }
    setSaving(false)
  }

  async function handleGoToDashboard() {
    router.push('/dashboard')
    router.refresh()
  }

  const progress = ((step - 1) / 4) * 100

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">

        {/* 로고 */}
        <div className="flex items-center gap-2.5 mb-10 justify-center">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">CC</span>
          </div>
          <span className="font-semibold text-white text-base tracking-tight">CampCareer</span>
        </div>

        {/* 결과 화면 */}
        {step === 5 && result ? (
          <div className="text-center space-y-6">
            <div className="text-7xl mb-2">{result.flag}</div>
            <div>
              <p className="text-slate-400 text-sm mb-2">Your best match is</p>
              <h1 className="text-4xl font-bold text-white">
                {{
                  IE: 'Ireland', AU: 'Australia', CA: 'Canada',
                  UK: 'United Kingdom', US: 'United States'
                }[result.country]}
              </h1>
            </div>

            <div className="bg-slate-800 rounded-2xl p-5 text-left space-y-3">
              {result.reasons.map((r, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <p className="text-sm text-slate-300">{r}</p>
                </div>
              ))}
            </div>

            <button
              onClick={handleGoToDashboard}
              disabled={saving}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
            >
              Go to my Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            {/* 진행률 바 */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500">{step} of 4</span>
                <span className="text-xs text-slate-500">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <div
                  className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Step 1 — Goal */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">What&apos;s your main goal?</h2>
                  <p className="text-slate-400 text-sm">This helps us find the best country for you</p>
                </div>
                {[
                  { value: 'visa' as Goal,  emoji: '💼', title: 'Work after graduation',  desc: 'Get a work visa and build your career abroad' },
                  { value: 'pr' as Goal,    emoji: '🏡', title: 'Permanent residency',    desc: 'Settle down and get a long-term visa or PR' },
                  { value: 'study' as Goal, emoji: '🎓', title: 'Academic excellence',    desc: 'Focus on the best education and ROI' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setGoal(opt.value); setStep(2) }}
                    className="w-full flex items-center gap-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-indigo-500 rounded-2xl p-4 transition-all text-left"
                  >
                    <span className="text-3xl">{opt.emoji}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">{opt.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Step 2 — Budget */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">What&apos;s your annual tuition budget?</h2>
                  <p className="text-slate-400 text-sm">Including tuition fees per year</p>
                </div>
                {[
                  { value: 'low' as Budget,  emoji: '💚', title: 'Under $15,000 / year',       desc: 'Budget-friendly options with great ROI' },
                  { value: 'mid' as Budget,  emoji: '💛', title: '$15,000 – $30,000 / year',   desc: 'Mid-range with strong career outcomes' },
                  { value: 'high' as Budget, emoji: '💙', title: 'Over $30,000 / year',         desc: 'Premium institutions, highest earning potential' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setBudget(opt.value); setStep(3) }}
                    className="w-full flex items-center gap-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-indigo-500 rounded-2xl p-4 transition-all text-left"
                  >
                    <span className="text-3xl">{opt.emoji}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">{opt.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Step 3 — English */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">What&apos;s your English level?</h2>
                  <p className="text-slate-400 text-sm">Be honest — this affects visa requirements</p>
                </div>
                {[
                  { value: 'advanced' as English,     emoji: '🟢', title: 'Advanced / Native',      desc: 'IELTS 7.0+ or equivalent' },
                  { value: 'intermediate' as English, emoji: '🟡', title: 'Intermediate',            desc: 'IELTS 5.5–6.5 or currently studying' },
                  { value: 'beginner' as English,     emoji: '🔴', title: 'Beginner / Preparing',    desc: 'Still building English skills' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => { setEnglish(opt.value); setStep(4) }}
                    className="w-full flex items-center gap-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-indigo-500 rounded-2xl p-4 transition-all text-left"
                  >
                    <span className="text-3xl">{opt.emoji}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">{opt.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Step 4 — Environment */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Where do you prefer to live?</h2>
                  <p className="text-slate-400 text-sm">City life or something quieter?</p>
                </div>
                {[
                  { value: 'city' as Environment, emoji: '🌆', title: 'Big city',                    desc: 'London, Sydney, Toronto, New York' },
                  { value: 'town' as Environment, emoji: '🏘️', title: 'Mid-size or college town',   desc: 'Lower cost, tight-knit community' },
                  { value: 'any' as Environment,  emoji: '🌍', title: 'No preference',               desc: 'Open to anything' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleFinish(opt.value)}
                    disabled={saving}
                    className="w-full flex items-center gap-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-indigo-500 rounded-2xl p-4 transition-all text-left disabled:opacity-50"
                  >
                    <span className="text-3xl">{opt.emoji}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">{opt.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
