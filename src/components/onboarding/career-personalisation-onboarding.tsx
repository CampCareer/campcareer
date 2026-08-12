"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState, type ReactNode } from "react"
import { ArrowLeft, ArrowRight, BriefcaseBusiness, LoaderCircle, LockKeyhole } from "lucide-react"
import { CITIZENSHIP_OPTIONS } from "@/data/citizenship-countries"
import { CANONICAL_CAREER_BY_ID } from "@/data/career-comparison-catalog"
import { LAUNCH_COUNTRIES } from "@/data/launch-countries"
import { createClient } from "@/lib/supabase-client"

const DEGREE_OPTIONS = [
  ["high_school", "고등학교 졸업"],
  ["associate", "전문학사"],
  ["bachelor", "학사"],
  ["master", "석사"],
  ["doctorate", "박사"],
  ["other", "기타 / 아직 모르겠어요"],
] as const

const ENGLISH_OPTIONS = [
  ["basic", "기초 — 일상·업무 영어가 아직 부담스러워요"],
  ["intermediate", "중급 — 일상 대화와 간단한 업무가 가능해요"],
  ["working", "업무 가능 — 영어로 협업·면접을 준비할 수 있어요"],
  ["fluent", "유창 — 전문 업무와 면접을 영어로 할 수 있어요"],
] as const

type FormState = {
  citizenship: string
  experience: string
  degree: string
  english: string
  studyPath: "yes" | "no" | "considering" | ""
}

const initialForm: FormState = { citizenship: "", experience: "", degree: "", english: "", studyPath: "" }
const SELECT_CLASS = "h-12 w-full rounded-xl border border-[#dedfdb] bg-white px-3 text-sm font-normal text-slate-900 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"

export function CareerPersonalisationOnboarding() {
  const router = useRouter()
  const params = useSearchParams()
  const supabase = useMemo(() => createClient(), [])
  const [form, setForm] = useState<FormState>(initialForm)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const rawCountry = (params.get("country") ?? "").toUpperCase()
  const country = rawCountry === "NOT-SURE" || LAUNCH_COUNTRIES.some((item) => item.code === rawCountry) ? rawCountry : "NOT-SURE"
  const occupation = params.get("occupation") ?? ""
  const countryName = country === "NOT-SURE" ? "아직 정하지 않음" : LAUNCH_COUNTRIES.find((item) => item.code === country)?.name ?? country
  const occupationName = CANONICAL_CAREER_BY_ID.get(occupation)?.labelKo ?? "선택한 직종"
  const returnPath = `/career?country=${encodeURIComponent(country.toLowerCase())}&occupation=${encodeURIComponent(occupation)}&personalised=1`

  useEffect(() => {
    let active = true
    void supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!active) return
      if (!user) {
        router.replace(`/login?next=${encodeURIComponent(`/onboarding?country=${country.toLowerCase()}&occupation=${occupation}`)}`)
        return
      }
      setUserId(user.id)
      const { data } = await supabase
        .from("user_preferences")
        .select("citizenship_country,relevant_experience_years,degree_level,english_level,study_path_available")
        .eq("id", user.id)
        .maybeSingle()
      if (active && data) {
        setForm({
          citizenship: data.citizenship_country ?? "",
          experience: data.relevant_experience_years == null ? "" : String(data.relevant_experience_years),
          degree: data.degree_level ?? "",
          english: data.english_level ?? "",
          studyPath: data.study_path_available === true ? "yes" : data.study_path_available === false ? "no" : "",
        })
      }
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [country, occupation, router, supabase])

  const update = <Key extends keyof FormState>(key: Key, value: FormState[Key]) => setForm((current) => ({ ...current, [key]: value }))
  const complete = Boolean(form.citizenship && form.experience !== "" && form.degree && form.english && form.studyPath)

  const submit = async () => {
    if (!complete || !userId || saving) return
    setSaving(true)
    setError("")
    const experience = Number(form.experience)
    const { error: saveError } = await supabase.from("user_preferences").upsert({
      id: userId,
      citizenship_country: form.citizenship,
      target_country: country === "NOT-SURE" ? null : country,
      target_occupation: occupation || null,
      relevant_experience_years: Number.isFinite(experience) ? experience : 0,
      degree_level: form.degree,
      english_level: form.english,
      study_path_available: form.studyPath === "yes" ? true : form.studyPath === "no" ? false : null,
      career_personalisation_completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: "id" })
    if (saveError) {
      setSaving(false)
      setError("저장하지 못했어요. 잠시 후 다시 시도해 주세요.")
      return
    }
    router.push(returnPath)
  }

  if (loading) return <main className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-5"><LoaderCircle className="size-6 animate-spin text-slate-400" /></main>

  return <main className="min-h-[calc(100vh-3.5rem)] bg-[#fafafa] px-5 py-10 sm:px-8 sm:py-16"><div className="mx-auto max-w-2xl">
    <Link href={`/career?country=${country.toLowerCase()}&occupation=${encodeURIComponent(occupation)}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-900"><ArrowLeft className="size-4" /> 무료 결과로 돌아가기</Link>
    <div className="mt-6 rounded-3xl border border-[#e4e5e1] bg-white p-6 shadow-[0_20px_45px_-38px_rgba(15,23,42,.4)] sm:p-9">
      <p className="text-xs font-bold tracking-[0.12em] text-blue-700">PERSONAL CAREER CHECK</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-[-0.055em] text-slate-950">내 조건으로 해외 커리어 경로를 좁혀볼게요.</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">2분 안에 끝나요. 무료 시장 정보에 개인 조건을 더해, 먼저 확인할 비자·자격·교육의 막힘 요소를 정리합니다.</p>

      <div className="mt-6 flex flex-wrap gap-2 rounded-2xl bg-[#f6f7f8] p-4 text-sm text-slate-700"><span className="inline-flex items-center gap-1.5 font-semibold"><BriefcaseBusiness className="size-4 text-blue-700" /> {occupationName}</span><span className="text-slate-300">·</span><span>{countryName}</span></div>

      <div className="mt-8 space-y-7">
        <Field label="국적" hint="비자·워킹홀리데이·자격 인정 경로를 가르는 기본 조건이에요."><select value={form.citizenship} onChange={(event) => update("citizenship", event.target.value)} className={SELECT_CLASS}><option value="">국적을 선택해 주세요</option>{CITIZENSHIP_OPTIONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></Field>
        <Field label="관련 경력" hint="목표 직종과 직접 연결되는 실무 경력만 대략 선택해 주세요."><select value={form.experience} onChange={(event) => update("experience", event.target.value)} className={SELECT_CLASS}><option value="">경력 선택</option>{[0, 1, 2, 3, 5, 7, 10, 15, 20].map((year) => <option key={year} value={year}>{year === 0 ? "관련 경력 없음" : `${year}년`}</option>)}</select></Field>
        <Field label="최종 학력"><select value={form.degree} onChange={(event) => update("degree", event.target.value)} className={SELECT_CLASS}><option value="">학력을 선택해 주세요</option>{DEGREE_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field>
        <Field label="영어 수준"><select value={form.english} onChange={(event) => update("english", event.target.value)} className={SELECT_CLASS}><option value="">현재 수준을 선택해 주세요</option>{ENGLISH_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></Field>
        <fieldset><legend className="text-sm font-semibold text-slate-900">학업·유학 경로가 가능한가요?</legend><p className="mt-1 text-xs leading-5 text-slate-500">현지 교육을 거치는 경로도 현실적인 선택지인지 판단하는 데만 사용해요.</p><div className="mt-3 grid gap-2 sm:grid-cols-3">{([['yes', '가능해요'], ['considering', '조건을 보고 결정'], ['no', '어려워요']] as const).map(([value, label]) => <button key={value} type="button" onClick={() => update("studyPath", value)} className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${form.studyPath === value ? "border-blue-600 bg-blue-50 text-blue-800" : "border-[#dedfdb] bg-white text-slate-600 hover:border-slate-300"}`}>{label}</button>)}</div></fieldset>
      </div>

      {error && <p className="mt-5 text-sm font-medium text-red-600">{error}</p>}
      <button disabled={!complete || saving} onClick={() => void submit()} className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1d4ed8] px-5 text-sm font-semibold text-white transition hover:bg-[#1e40af] disabled:cursor-not-allowed disabled:opacity-40">{saving ? "저장 중…" : "내 조건으로 결과 보기"} {!saving && <ArrowRight className="size-4" />}</button>
      <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500"><LockKeyhole className="mt-0.5 size-3.5 shrink-0" /> 입력한 정보는 내 계정의 개인화 결과에만 사용되며, 다른 사용자에게 공개되지 않습니다.</p>
    </div>
  </div></main>
}

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return <label className="block text-sm font-semibold text-slate-900"><span>{label}</span>{hint && <span className="mt-1 block text-xs font-normal leading-5 text-slate-500">{hint}</span>}<span className="mt-2.5 block">{children}</span></label>
}
