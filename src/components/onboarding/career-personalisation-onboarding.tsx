"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { ArrowRight, Check, LoaderCircle, Search } from "lucide-react"
import { LAUNCH_COUNTRIES } from "@/data/launch-countries"
import { getSafeNextPath } from "@/lib/auth/safe-next"
import { localizePath } from "@/lib/i18n/config"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { recordCareerFunnelEvent } from "@/lib/analytics"
import { getCountryOptions } from "@/lib/study-product/countries"
import { createClient } from "@/lib/supabase-client"

type Locale = "en" | "ko"
type FormState = {
  citizenship: string
  experience: string
  degree: string
  english: string
  studyPath: "yes" | "no" | "considering" | ""
}

type Choice = { value: string; label: string; detail?: string }

const initialForm: FormState = { citizenship: "", experience: "", degree: "", english: "", studyPath: "" }

function experienceBucket(value: number | null) {
  if (value == null) return ""
  if (value <= 0) return "0"
  if (value <= 3) return "3"
  if (value <= 7) return "7"
  return "8"
}

const copy = {
  ko: {
    back: "이전",
    next: "다음",
    save: "내 맞춤 결과 보기",
    saving: "저장 중…",
    saveError: "저장하지 못했어요. 잠시 후 다시 시도해 주세요.",
    selected: "선택됨",
    countrySearch: "국가 검색",
    countryEmpty: "일치하는 국가가 없어요.",
    countryQuestion: "어느 나라 국적이신가요?",
    experienceQuestion: "관련 실무 경력은 얼마나 있나요?",
    degreeQuestion: "현재 최종 학력은 무엇인가요?",
    englishQuestion: "지금 영어로 일하거나 공부할 수 있는 수준은 어떤가요?",
    studyQuestion: "필요하다면 현지 학업 경로도 고려할 수 있나요?",
    degreeOptions: [
      ["high_school", "고등학교 졸업"], ["associate", "전문학사"], ["bachelor", "학사"], ["master", "석사"], ["doctorate", "박사"], ["other", "기타 / 아직 모르겠어요"],
    ],
    englishOptions: [["basic", "기초"], ["intermediate", "중급"], ["working", "업무 가능"], ["fluent", "유창"]],
    studyOptions: [["yes", "가능해요"], ["considering", "조건을 보고 결정"], ["no", "어려워요"]],
    noExperience: "관련 경력 없음",
    experienceOptions: [["3", "1–3년"], ["7", "4–7년"], ["8", "8년 이상"]],
  },
  en: {
    back: "Back",
    next: "Continue",
    save: "See my tailored result",
    saving: "Saving…",
    saveError: "We could not save your details. Please try again.",
    selected: "Selected",
    countrySearch: "Search for your country",
    countryEmpty: "No country found.",
    countryQuestion: "What is your citizenship?",
    experienceQuestion: "How much relevant work experience do you have?",
    degreeQuestion: "What is your highest completed education?",
    englishQuestion: "How comfortable are you using English for work or study today?",
    studyQuestion: "Could you consider a local study route if it is needed?",
    degreeOptions: [
      ["high_school", "High school"], ["associate", "Associate degree"], ["bachelor", "Bachelor’s degree"], ["master", "Master’s degree"], ["doctorate", "Doctorate"], ["other", "Other / not sure yet"],
    ],
    englishOptions: [["basic", "Basic"], ["intermediate", "Intermediate"], ["working", "Working proficiency"], ["fluent", "Fluent"]],
    studyOptions: [["yes", "Yes, I can"], ["considering", "It depends"], ["no", "Not currently"]],
    noExperience: "No relevant experience",
    experienceOptions: [["3", "1–3 years"], ["7", "4–7 years"], ["8", "8+ years"]],
  },
} as const

export function CareerPersonalisationOnboarding() {
  const router = useRouter()
  const params = useSearchParams()
  const locale = useRouteLocale()
  const t = copy[locale]
  const supabase = useMemo(() => createClient(), [])
  const [form, setForm] = useState<FormState>(initialForm)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [step, setStep] = useState(0)
  const [countryQuery, setCountryQuery] = useState("")
  const [leavingStep, setLeavingStep] = useState(false)

  const rawCountry = (params.get("country") ?? "").toUpperCase()
  const country = rawCountry === "NOT-SURE" || LAUNCH_COUNTRIES.some((item) => item.code === rawCountry) ? rawCountry : "NOT-SURE"
  const occupation = params.get("occupation") ?? ""
  const requestedReturnPath = params.get("return_to")
  const safeReturnPath = getSafeNextPath(requestedReturnPath, "")
  const onboardingParams = new URLSearchParams({ country: country.toLowerCase(), occupation })
  if (safeReturnPath) onboardingParams.set("return_to", safeReturnPath)
  const onboardingPath = `${localizePath("/onboarding", locale)}?${onboardingParams.toString()}`
  const returnPath = localizePath("/home", locale)
  const countries = useMemo(() => getCountryOptions(locale === "ko" ? "ko-KR" : "en"), [locale])
  const selectedCountry = countries.find((item) => item.code === form.citizenship)
  const filteredCountries = useMemo(() => {
    const query = countryQuery.trim().toLocaleLowerCase(locale === "ko" ? "ko-KR" : "en")
    if (!query) return countries.slice(0, 8)
    return countries.filter((item) => item.label.toLocaleLowerCase(locale === "ko" ? "ko-KR" : "en").includes(query) || item.code.toLowerCase().includes(query)).slice(0, 8)
  }, [countries, countryQuery, locale])

  const steps = useMemo(() => [
    { key: "citizenship", title: t.countryQuestion, complete: Boolean(form.citizenship) },
    { key: "experience", title: t.experienceQuestion, complete: form.experience !== "" },
    { key: "degree", title: t.degreeQuestion, complete: Boolean(form.degree) },
    { key: "english", title: t.englishQuestion, complete: Boolean(form.english) },
    { key: "studyPath", title: t.studyQuestion, complete: Boolean(form.studyPath) },
  ], [form, t])
  const activeStep = steps[step]

  useEffect(() => {
    let active = true
    void supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!active) return
      if (!user) {
        router.replace(`${localizePath("/login", locale)}?next=${encodeURIComponent(onboardingPath)}`)
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
          citizenship: data.citizenship_country === "OTHER" ? "" : data.citizenship_country ?? "",
          experience: experienceBucket(data.relevant_experience_years),
          degree: data.degree_level ?? "",
          english: data.english_level ?? "",
          studyPath: data.study_path_available === true ? "yes" : data.study_path_available === false ? "no" : "",
        })
      }
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [locale, onboardingPath, router, supabase])

  useEffect(() => setCountryQuery(""), [locale])

  const update = <Key extends keyof FormState>(key: Key, value: FormState[Key]) => {
    setForm((current) => ({ ...current, [key]: value }))
    setError("")
  }

  const submit = async () => {
    if (!steps.every((item) => item.complete) || !userId || saving) return
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
      setError(t.saveError)
      return
    }
    recordCareerFunnelEvent("career_personalisation_completed", {
      surface: "onboarding",
      locale,
      country: country.toLowerCase(),
      career: occupation,
    })
    router.push(getSafeNextPath(requestedReturnPath, returnPath))
  }

  if (loading) return <main className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-5"><LoaderCircle className="size-6 animate-spin text-slate-400" /></main>

  const isLastStep = step === steps.length - 1
  const moveToStep = (nextStep: number) => {
    if (leavingStep) return
    setLeavingStep(true)
    window.setTimeout(() => {
      setStep(nextStep)
      setLeavingStep(false)
    }, 150)
  }
  const next = () => {
    if (!activeStep.complete) return
    if (isLastStep) void submit()
    else moveToStep(step + 1)
  }
  return <main className="min-h-screen bg-white px-5 py-10 sm:px-8">
    <div className="mx-auto flex min-h-[calc(100svh-5rem)] max-w-xl flex-col justify-center">
      <section aria-labelledby="onboarding-question" className="min-h-[19rem] w-full sm:min-h-[20rem]">
        <div key={step} className={`cc-onboarding-step ${leavingStep ? "cc-onboarding-step--leaving" : ""}`}>
          <h1 id="onboarding-question" className="max-w-xl text-3xl font-semibold tracking-[-0.055em] text-slate-950 sm:text-4xl">{activeStep.title}</h1>
          <div className="mt-8">
          {activeStep.key === "citizenship" && <CountryQuestion query={countryQuery} selectedLabel={selectedCountry?.label} countries={filteredCountries} onQuery={setCountryQuery} onSelect={(value) => update("citizenship", value)} t={t} />}
          {activeStep.key === "experience" && <ChoiceGrid choices={[{ value: "0", label: t.noExperience }, ...t.experienceOptions.map(([value, label]) => ({ value, label }))]} value={form.experience} onChange={(value) => update("experience", value)} t={t} />}
          {activeStep.key === "degree" && <ChoiceGrid choices={t.degreeOptions.map(([value, label]) => ({ value, label }))} value={form.degree} onChange={(value) => update("degree", value)} t={t} />}
          {activeStep.key === "english" && <ChoiceGrid choices={t.englishOptions.map(([value, label]) => ({ value, label }))} value={form.english} onChange={(value) => update("english", value)} t={t} />}
          {activeStep.key === "studyPath" && <ChoiceGrid choices={t.studyOptions.map(([value, label]) => ({ value, label }))} value={form.studyPath} onChange={(value) => update("studyPath", value as FormState["studyPath"])} t={t} />}
          </div>
        </div>
        {error && <p className="mt-5 text-sm font-medium text-red-600">{error}</p>}
      </section>
      <div className="mt-9 flex items-center"><button type="button" disabled={!activeStep.complete || saving} onClick={next} className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#1d4ed8] px-5 text-sm font-semibold text-white transition hover:bg-[#1e40af] disabled:cursor-not-allowed disabled:opacity-40">{saving ? t.saving : isLastStep ? t.save : t.next} {!saving && <ArrowRight className="size-4" />}</button></div>
      <div className="mt-14 flex items-center justify-center gap-2" aria-label={`${step + 1} of ${steps.length}`}>{steps.map((item, index) => <span key={item.key} className={`h-2 rounded-full transition-all ${index === step ? "w-6 bg-slate-950" : "w-2 bg-slate-300"}`} />)}</div>
    </div>
  </main>
}

function CountryQuestion({ query, selectedLabel, countries, onQuery, onSelect, t }: { query: string; selectedLabel?: string; countries: ReturnType<typeof getCountryOptions>; onQuery: (value: string) => void; onSelect: (value: string) => void; t: (typeof copy)[Locale] }) {
  const [open, setOpen] = useState(false)
  const value = open ? query : selectedLabel ?? query

  return <div className="relative">
    <label className="relative block"><span className="sr-only">{t.countrySearch}</span><Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input autoFocus value={value} onFocus={(event) => { setOpen(true); if (selectedLabel && !query) { onQuery(selectedLabel); event.currentTarget.select() } }} onChange={(event) => { setOpen(true); onQuery(event.target.value) }} onKeyDown={(event) => { if (event.key === "Escape") { setOpen(false); onQuery("") } }} placeholder={t.countrySearch} className="h-14 w-full rounded-xl border border-[#d9dce2] bg-white py-3 pl-11 pr-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10" /></label>
    {open && query && <div className="absolute left-0 top-[calc(100%+0.5rem)] z-20 max-h-72 w-full overflow-y-auto rounded-xl border border-[#dfe4ec] bg-white shadow-[0_18px_36px_-20px_rgba(15,23,42,.34)]">
      {countries.length ? countries.map((country) => {
        const isSelected = country.label === selectedLabel
        return <button type="button" key={country.code} onMouseDown={(event) => event.preventDefault()} onClick={() => { onSelect(country.code); onQuery(""); setOpen(false) }} className={`flex min-h-12 w-full items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 text-left text-sm transition last:border-0 ${isSelected ? "bg-blue-50 text-blue-900" : "hover:bg-slate-50"}`}><span className="font-medium">{country.label}</span>{isSelected ? <Check className="size-4 text-blue-700" aria-label={t.selected} /> : <span className="text-xs font-semibold text-slate-400">{country.code}</span>}</button>
      }) : <p className="px-4 py-4 text-sm text-slate-500">{t.countryEmpty}</p>}
    </div>}
  </div>
}

function ChoiceGrid({ choices, value, onChange, t }: { choices: readonly Choice[]; value: string; onChange: (value: string) => void; t: (typeof copy)[Locale] }) {
  return <div className="grid gap-3 sm:grid-cols-2">
    {choices.map((choice) => {
      const selected = value === choice.value
      return <button type="button" key={choice.value} onClick={() => onChange(choice.value)} className={`min-h-20 rounded-2xl border px-5 py-4 text-left transition ${selected ? "border-blue-600 bg-blue-50 text-blue-900 ring-1 ring-blue-600" : "border-[#d9dce2] bg-white text-slate-800 hover:border-slate-400"}`}><span className="flex items-center justify-between gap-3"><span className="text-base font-semibold">{choice.label}</span>{selected && <Check className="size-4 shrink-0 text-blue-700" aria-label={t.selected} />}</span></button>
    })}
  </div>
}
