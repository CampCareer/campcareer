'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { ArrowRight, Check, Share2, Copy, CheckCheck } from 'lucide-react'

type Step = 1 | 2 | 3 | 4 | 5
type Goal = 'visa' | 'pr' | 'study'
type Budget = 'low' | 'mid' | 'high'
type English = 'advanced' | 'intermediate' | 'beginner'
type Environment = 'city' | 'town' | 'any'

function recommend(
  goal: Goal,
  budget: Budget,
  english: English,
  environment: Environment
): { country: string; flag: string; reasons: string[] } {
  const scores: Record<string, number> = { IE: 0, AU: 0, CA: 0, UK: 0, US: 0 }

  if (goal === 'visa')       { scores.AU += 3; scores.CA += 3; scores.UK += 2; scores.IE += 1 }
  else if (goal === 'pr')    { scores.CA += 4; scores.AU += 3; scores.IE += 2 }
  else                       { scores.IE += 3; scores.UK += 3; scores.US += 2; scores.AU += 1 }

  if (budget === 'low')      { scores.IE += 4; scores.CA += 2; scores.UK += 1 }
  else if (budget === 'mid') { scores.AU += 3; scores.CA += 3; scores.IE += 2; scores.UK += 2 }
  else                       { scores.US += 4; scores.UK += 3; scores.AU += 2 }

  if (english === 'beginner')          { scores.CA += 2; scores.IE += 2 }
  else if (english === 'intermediate') { scores.AU += 2; scores.IE += 2; scores.UK += 1 }
  else                                 { scores.US += 2; scores.UK += 2; scores.AU += 1 }

  if (environment === 'city')      { scores.UK += 2; scores.US += 2; scores.AU += 1 }
  else if (environment === 'town') { scores.IE += 3; scores.CA += 2; scores.AU += 1 }
  else                             { scores.CA += 1; scores.IE += 1 }

  const top = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]

  const COUNTRY_META: Record<string, { flag: string; reasons: Record<string, string[]> }> = {
    IE: { flag: '🇮🇪', reasons: {
      visa:  ['EU 취업 가능', 'Critical Skills 비자 경로', '낮은 학비'],
      pr:    ['EU 영주권 경로', 'Stamp 4 취득 가능', '낮은 생활비'],
      study: ['최저 학비 (€10k~)', 'HEA 졸업생 연봉 데이터', '영어권 EU 입문'],
    }},
    AU: { flag: '🇦🇺', reasons: {
      visa:  ['졸업 후 2~4년 취업 비자', 'CRICOS 인증 8,597개 코스', '높은 졸업생 연봉'],
      pr:    ['포인트제 영주권 (189/190)', '주정부 스폰서 가능', '숙련직 수요 높음'],
      study: ['QILT 기반 졸업생 성과 데이터', '다양한 전공 선택', '생활 환경 우수'],
    }},
    CA: { flag: '🇨🇦', reasons: {
      visa:  ['PGWP 최대 3년', 'Express Entry 이민 경로', '높은 정착 지원'],
      pr:    ['Express Entry 최단 영주권', '주정부 이민 프로그램', '안정적 이민 정책'],
      study: ['합리적 학비', '프랑스어권 선택 가능', '다문화 환경'],
    }},
    UK: { flag: '🇬🇧', reasons: {
      visa:  ['Graduate Route 2년 취업', '글로벌 기업 접근성', 'HESA 연봉 데이터'],
      pr:    ['Skilled Worker 비자', '5년 후 영주권', '런던 금융 허브'],
      study: ['Russell Group 명문대', '1년 석사 과정', 'HESA 졸업생 데이터'],
    }},
    US: { flag: '🇺🇸', reasons: {
      visa:  ['OPT 최대 3년 (STEM)', '실리콘밸리 취업 기회', '높은 졸업생 연봉'],
      pr:    ['EB-2/EB-3 취업 영주권', '다양한 이민 경로', '기술직 수요'],
      study: ['College Scorecard 데이터', '다양한 장학금', '세계 최고 수준 대학'],
    }},
  }

  const meta = COUNTRY_META[top]
  return { country: top, flag: meta.flag, reasons: meta.reasons[goal] }
}

const COUNTRY_NAME: Record<string, string> = {
  IE: 'Ireland', AU: 'Australia', CA: 'Canada', UK: 'United Kingdom', US: 'United States'
}

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createClient()
  const [step, setStep] = useState<Step>(1)
  const [goal, setGoal] = useState<Goal | null>(null)
  const [budget, setBudget] = useState<Budget | null>(null)
  const [english, setEnglish] = useState<English | null>(null)
  const [saving, setSaving] = useState(false)
  const [result, setResult] = useState<{ country: string; flag: string; reasons: string[] } | null>(null)
  const [copied, setCopied] = useState(false)

  async function handleFinish(env: Environment) {
    if (!goal || !budget || !english) return
    setSaving(true)
    const rec = recommend(goal, budget, english, env)
    setResult(rec)
    setStep(5)
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

  function handleShare() {
    if (!result) return
    const text = `🎓 My best country for studying abroad is ${result.flag} ${COUNTRY_NAME[result.country]}!\n\n✅ ${result.reasons.join('\n✅ ')}\n\nFind your best country → campcareer.com`
    if (navigator.share) {
      navigator.share({ title: 'CampCareer', text })
    } else {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    }
  }

  function handleTwitterShare() {
    if (!result) return
    const text = `My best country for studying abroad is ${result.flag} ${COUNTRY_NAME[result.country]}!\n\n✅ ${result.reasons[0]}\n✅ ${result.reasons[1]}\n\nFind yours → campcareer.com`
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
  }

  const STEPS_TOTAL = 4
  const progress = step >= 5 ? 100 : ((step - 1) / STEPS_TOTAL) * 100

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* 상단 진행률 바 */}
      {step < 5 && (
        <div className="fixed top-0 inset-x-0 z-50">
          <div className="h-1.5 bg-slate-100">
            <div
              className="h-full bg-indigo-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* 결과 화면 */}
      {step === 5 && result ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
          <p className="text-slate-400 text-base mb-4">Your best match is</p>
          <div className="text-[96px] leading-none mb-6">{result.flag}</div>
          <h1 className="text-5xl font-bold text-slate-900 mb-10 tracking-tight">
            {COUNTRY_NAME[result.country]}
          </h1>

          <div className="w-full max-w-md bg-slate-50 rounded-3xl p-7 mb-10 text-left space-y-5">
            {result.reasons.map((r, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                  <Check className="w-4 h-4 text-indigo-600" />
                </div>
                <p className="text-base text-slate-700 font-medium">{r}</p>
              </div>
            ))}
          </div>

          {/* 공유 버튼 */}
          <div className="w-full max-w-md flex gap-3 mb-4">
            <button
              onClick={handleTwitterShare}
              className="flex-1 flex items-center justify-center gap-2 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-semibold py-3.5 rounded-2xl transition-colors text-sm bg-white"
            >
              <span className="font-black text-base" style={{ color: '#000' }}>𝕏</span>
              Share on X
            </button>
            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-semibold py-3.5 rounded-2xl transition-colors text-sm bg-white"
            >
              {copied
                ? <><CheckCheck className="w-4 h-4 text-emerald-500" /> Copied!</>
                : <><Copy className="w-4 h-4" /> Copy Result</>
              }
            </button>
          </div>

          <button
            onClick={() => { router.push('/dashboard'); router.refresh() }}
            disabled={saving}
            className="w-full max-w-md bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 rounded-2xl transition-colors flex items-center justify-center gap-3 text-lg"
          >
            Go to my Dashboard
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
          <div className="w-full max-w-lg">

            {/* Step 번호 */}
            <p className="text-sm font-medium text-slate-400 mb-6 text-center">
              {step} of {STEPS_TOTAL}
            </p>

            {/* Step 1 — Goal */}
            {step === 1 && (
              <div>
                <h2 className="text-4xl font-bold text-slate-900 mb-3 text-center leading-tight">
                  What&apos;s your<br />main goal?
                </h2>
                <p className="text-slate-400 text-center mb-10">
                  This helps us find the best country for you
                </p>
                <div className="space-y-4">
                  {[
                    { value: 'visa' as Goal,  emoji: '💼', title: 'Work after graduation', desc: 'Get a work visa and build your career abroad' },
                    { value: 'pr' as Goal,    emoji: '🏡', title: 'Permanent residency',   desc: 'Settle down and get a long-term visa or PR' },
                    { value: 'study' as Goal, emoji: '🎓', title: 'Academic excellence',   desc: 'Focus on the best education and ROI' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setGoal(opt.value); setStep(2) }}
                      className="w-full flex items-center gap-5 border-2 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 rounded-2xl p-5 transition-all text-left group"
                    >
                      <span className="text-4xl">{opt.emoji}</span>
                      <div>
                        <p className="text-lg font-semibold text-slate-800 group-hover:text-indigo-700">{opt.title}</p>
                        <p className="text-sm text-slate-400 mt-0.5">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2 — Budget */}
            {step === 2 && (
              <div>
                <h2 className="text-4xl font-bold text-slate-900 mb-3 text-center leading-tight">
                  What&apos;s your<br />annual tuition budget?
                </h2>
                <p className="text-slate-400 text-center mb-10">Tuition fees per year</p>
                <div className="space-y-4">
                  {[
                    { value: 'low' as Budget,  emoji: '💚', title: 'Under $15,000 / year',      desc: 'Budget-friendly options with great ROI' },
                    { value: 'mid' as Budget,  emoji: '💛', title: '$15,000 – $30,000 / year',  desc: 'Mid-range with strong career outcomes' },
                    { value: 'high' as Budget, emoji: '💙', title: 'Over $30,000 / year',       desc: 'Premium institutions, highest earning potential' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setBudget(opt.value); setStep(3) }}
                      className="w-full flex items-center gap-5 border-2 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 rounded-2xl p-5 transition-all text-left group"
                    >
                      <span className="text-4xl">{opt.emoji}</span>
                      <div>
                        <p className="text-lg font-semibold text-slate-800 group-hover:text-indigo-700">{opt.title}</p>
                        <p className="text-sm text-slate-400 mt-0.5">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3 — English */}
            {step === 3 && (
              <div>
                <h2 className="text-4xl font-bold text-slate-900 mb-3 text-center leading-tight">
                  What&apos;s your<br />English level?
                </h2>
                <p className="text-slate-400 text-center mb-10">Be honest — this affects visa requirements</p>
                <div className="space-y-4">
                  {[
                    { value: 'advanced' as English,     emoji: '🟢', title: 'Advanced / Native',    desc: 'IELTS 7.0+ or equivalent' },
                    { value: 'intermediate' as English, emoji: '🟡', title: 'Intermediate',          desc: 'IELTS 5.5–6.5 or currently studying' },
                    { value: 'beginner' as English,     emoji: '🔴', title: 'Beginner / Preparing',  desc: 'Still building English skills' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setEnglish(opt.value); setStep(4) }}
                      className="w-full flex items-center gap-5 border-2 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 rounded-2xl p-5 transition-all text-left group"
                    >
                      <span className="text-4xl">{opt.emoji}</span>
                      <div>
                        <p className="text-lg font-semibold text-slate-800 group-hover:text-indigo-700">{opt.title}</p>
                        <p className="text-sm text-slate-400 mt-0.5">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4 — Environment */}
            {step === 4 && (
              <div>
                <h2 className="text-4xl font-bold text-slate-900 mb-3 text-center leading-tight">
                  Where do you prefer<br />to live?
                </h2>
                <p className="text-slate-400 text-center mb-10">City life or something quieter?</p>
                <div className="space-y-4">
                  {[
                    { value: 'city' as Environment, emoji: '🌆', title: 'Big city',               desc: 'London, Sydney, Toronto, New York' },
                    { value: 'town' as Environment, emoji: '🏘️', title: 'Mid-size / college town', desc: 'Lower cost, tight-knit community' },
                    { value: 'any' as Environment,  emoji: '🌍', title: 'No preference',          desc: 'Open to anything' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleFinish(opt.value)}
                      disabled={saving}
                      className="w-full flex items-center gap-5 border-2 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 rounded-2xl p-5 transition-all text-left group disabled:opacity-50"
                    >
                      <span className="text-4xl">{opt.emoji}</span>
                      <div>
                        <p className="text-lg font-semibold text-slate-800 group-hover:text-indigo-700">{opt.title}</p>
                        <p className="text-sm text-slate-400 mt-0.5">{opt.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  )
}
