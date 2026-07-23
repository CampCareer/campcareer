"use client"

import Link from "next/link"
import { useMemo, useState, type ReactNode } from "react"
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Building2, CalendarDays, Check, GraduationCap, Loader2, Sparkles, Target } from "lucide-react"
import { STUDY_CATEGORIES, STUDY_CONCEPTS } from "@/data/study-concepts"
import { cn } from "@/lib/utils"
import { useRouteLocale } from "@/lib/i18n/locale-provider"

export type GoalOccupation = { occ_code: string; occ_title: string; country: string }
export type GoalStudyConcept = { concept_slug: string; concept_label: string; concept_label_ko: string; category?: string }
export type GoalUniversity = { univ_slug: string; univ_name: string }
export type GoalCourse = { id: number; course_name: string; college_name: string; field_name: string }

export type GoalOption = {
  key: string
  sourceType: "saved_university" | "saved_course"
  sourceReference: string
  title: string
  providerName: string
  fieldName: string
  kind: "university" | "course"
  recommended?: boolean
}

export type GoalSetupData = {
  occupation: GoalOccupation | null
  studyConcept: GoalStudyConcept | null
  intakeMonth: string | null
  planTitle: string
  strategy: string
  options: GoalOption[]
}

type GoalSetupProps = {
  occupations: GoalOccupation[]
  studyConcepts: GoalStudyConcept[]
  universities: GoalUniversity[]
  courses: GoalCourse[]
  onComplete: (data: GoalSetupData) => Promise<boolean>
}

const RECOMMENDED_UNIVERSITIES: GoalUniversity[] = [
  { univ_slug: "the-university-of-melbourne", univ_name: "The University of Melbourne" },
  { univ_slug: "the-university-of-sydney", univ_name: "The University of Sydney" },
  { univ_slug: "the-university-of-new-south-wales", univ_name: "The University of New South Wales" },
  { univ_slug: "australian-national-university", univ_name: "Australian National University" },
  { univ_slug: "monash-university", univ_name: "Monash University" },
  { univ_slug: "the-university-of-queensland", univ_name: "The University of Queensland" },
  { univ_slug: "rmit-university", univ_name: "RMIT University" },
  { univ_slug: "deakin-university", univ_name: "Deakin University" },
]

const ALL_STUDY_CONCEPTS: GoalStudyConcept[] = STUDY_CONCEPTS.map((item) => ({
  concept_slug: item.slug,
  concept_label: item.label,
  concept_label_ko: item.labelKo,
  category: item.category,
}))

const INTAKE_MONTHS = [
  { value: "01", label: "January", labelKo: "1월" },
  { value: "02", label: "February", labelKo: "2월" },
  { value: "03", label: "March", labelKo: "3월" },
  { value: "04", label: "April", labelKo: "4월" },
  { value: "05", label: "May", labelKo: "5월" },
  { value: "06", label: "June", labelKo: "6월" },
  { value: "07", label: "July", labelKo: "7월" },
  { value: "08", label: "August", labelKo: "8월" },
  { value: "09", label: "September", labelKo: "9월" },
  { value: "10", label: "October", labelKo: "10월" },
  { value: "11", label: "November", labelKo: "11월" },
  { value: "12", label: "December", labelKo: "12월" },
]

export function GoalSetup({ occupations, studyConcepts, universities, courses, onComplete }: GoalSetupProps) {
  const locale = useRouteLocale()
  const isKo = locale === "ko"
  const [step, setStep] = useState(0)
  const [occupationCode, setOccupationCode] = useState("")
  const [conceptSlug, setConceptSlug] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [selectedOptionKeys, setSelectedOptionKeys] = useState<string[]>([])
  const [schoolUndecided, setSchoolUndecided] = useState(false)
  const [intakeMonth, setIntakeMonth] = useState(defaultIntakeMonth())
  const [title, setTitle] = useState(isKo ? "나의 호주 유학 경로" : "My Australia pathway")
  const [strategy, setStrategy] = useState("")
  const [titleTouched, setTitleTouched] = useState(false)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState("")

  const availableStudyConcepts = useMemo(() => {
    const merged = [...ALL_STUDY_CONCEPTS, ...studyConcepts]
    return merged.filter((item, index) => merged.findIndex((candidate) => candidate.concept_slug === item.concept_slug) === index)
  }, [studyConcepts])
  const occupation = occupations.find((item) => item.occ_code === occupationCode) ?? null
  const studyConcept = availableStudyConcepts.find((item) => item.concept_slug === conceptSlug) ?? null
  const options = useMemo<GoalOption[]>(() => {
    const mergedUniversities = [...universities, ...RECOMMENDED_UNIVERSITIES]
      .filter((item, index, all) => all.findIndex((candidate) => candidate.univ_slug === item.univ_slug) === index)
    return [
      ...mergedUniversities.map((item) => ({
        key: `university:${item.univ_slug}`,
        sourceType: "saved_university" as const,
        sourceReference: item.univ_slug,
        title: item.univ_name || item.univ_slug,
        providerName: item.univ_name || item.univ_slug,
        fieldName: "",
        kind: "university" as const,
        recommended: !universities.some((saved) => saved.univ_slug === item.univ_slug),
      })),
      ...courses.map((item) => ({
        key: `course:${item.id}`,
        sourceType: "saved_course" as const,
        sourceReference: String(item.id),
        title: item.course_name || item.field_name || item.college_name,
        providerName: item.college_name,
        fieldName: item.field_name,
        kind: "course" as const,
      })),
    ]
  }, [courses, universities])
  const selectedOptions = options.filter((option) => selectedOptionKeys.includes(option.key))

  function updateSuggestedTitle(nextOccupation: GoalOccupation | null, nextConcept: GoalStudyConcept | null, nextIntake = intakeMonth) {
    if (titleTouched) return
    const year = nextIntake?.slice(0, 4)
    const direction = nextOccupation?.occ_title || (nextConcept ? (isKo ? nextConcept.concept_label_ko || nextConcept.concept_label : nextConcept.concept_label) : "")
    const suggested = direction
      ? (isKo ? `${year ? `${year} ` : ""}${direction} 호주 경로` : `${year ? `${year} ` : ""}Australia ${direction} Path`)
      : (isKo ? "나의 호주 유학 경로" : "My Australia pathway")
    setTitle(suggested.slice(0, 160))
  }

  function selectOccupation(nextCode: string) {
    const next = occupationCode === nextCode ? "" : nextCode
    const nextOccupation = occupations.find((item) => item.occ_code === next) ?? null
    setOccupationCode(next)
    updateSuggestedTitle(nextOccupation, studyConcept)
  }

  function selectStudyConcept(nextSlug: string) {
    const next = conceptSlug === nextSlug ? "" : nextSlug
    const nextConcept = availableStudyConcepts.find((item) => item.concept_slug === next) ?? null
    setConceptSlug(next)
    setCategoryId(nextConcept?.category ?? "")
    updateSuggestedTitle(occupation, nextConcept)
  }

  function toggleOption(key: string) {
    setNotice("")
    setSchoolUndecided(false)
    setSelectedOptionKeys((current) => {
      if (current.includes(key)) return current.filter((item) => item !== key)
      if (current.length >= 3) {
        setNotice(isKo ? "후보는 최대 3개까지 선택할 수 있어요." : "Choose up to three options for this plan.")
        return current
      }
      return [...current, key]
    })
  }

  function toggleSchoolUndecided() {
    setSchoolUndecided((current) => !current)
    setSelectedOptionKeys([])
    setNotice("")
  }

  async function finish() {
    if (!title.trim()) {
      setNotice(isKo ? "플랜 제목을 입력해 주세요." : "Give your plan a title first.")
      return
    }
    setSaving(true)
    setNotice("")
    const success = await onComplete({ occupation, studyConcept, intakeMonth: intakeMonth ? `${intakeMonth}-01` : null, planTitle: title.trim(), strategy: strategy.trim(), options: selectedOptions })
    if (!success) {
      setNotice(isKo ? "저장하지 못했습니다. 다시 시도해 주세요." : "We could not save your plan. Please try again.")
      setSaving(false)
    }
  }

  const steps = isKo ? ["전공", "학교", "전략"] : ["Field", "Schools", "Strategy"]
  return <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#dcecff,_transparent_32%),#f7f9fc] px-5 py-7 sm:px-8 sm:py-10">
    <section className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between gap-4"><Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-700"><span className="grid size-9 place-items-center rounded-xl bg-blue-600 text-sm font-bold text-white">C</span>CampCareer</Link><p className="text-xs font-semibold uppercase tracking-[.15em] text-slate-400">My Plan · Australia</p></div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div className="rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-[0_24px_70px_rgba(37,99,235,.12)] backdrop-blur sm:p-9">
          <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{isKo ? "계획 전체가 아니라, 다음 목표부터 정해볼까요?" : "Set the next decision, not every decision at once."}</h1>

          <div className="mt-8 flex items-center gap-2" aria-label={isKo ? "목표 설정 단계" : "Goal setup steps"}>{steps.map((label, index) => <div key={label} className="flex min-w-0 items-center gap-2"><span className={cn("grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold", index <= step ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400")}>{index < step ? <Check className="size-3.5" /> : index + 1}</span><span className={cn("text-xs font-semibold", index === step ? "text-slate-900" : "text-slate-400")}>{label}</span>{index < steps.length - 1 && <span className="h-px w-7 bg-slate-200 sm:w-12" />}</div>)}</div>

          {step === 0 && <GoalStep isKo={isKo} occupations={occupations} studyConcepts={availableStudyConcepts} categoryId={categoryId} occupationCode={occupationCode} conceptSlug={conceptSlug} onSelectCategory={setCategoryId} onSelectOccupation={selectOccupation} onSelectConcept={selectStudyConcept} />}
          {step === 1 && <ShortlistStep isKo={isKo} options={options} selectedKeys={selectedOptionKeys} schoolUndecided={schoolUndecided} onToggle={toggleOption} onToggleSchoolUndecided={toggleSchoolUndecided} />}
          {step === 2 && <StrategyStep isKo={isKo} occupation={occupation} studyConcept={studyConcept} selectedOptions={selectedOptions} schoolUndecided={schoolUndecided} intakeMonth={intakeMonth} title={title} strategy={strategy} onIntakeChange={(value) => { setIntakeMonth(value); updateSuggestedTitle(occupation, studyConcept, value) }} onTitleChange={(value) => { setTitleTouched(true); setTitle(value) }} onStrategyChange={setStrategy} />}

          {notice && <p role="status" className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">{notice}</p>}
          <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-5"><button type="button" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0 || saving} className="inline-flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 disabled:invisible"><ArrowLeft className="size-4" />{isKo ? "이전" : "Back"}</button>{step < 2 ? <button type="button" onClick={() => { setNotice(""); setStep((current) => current + 1) }} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700">{isKo ? "계속" : "Continue"}<ArrowRight className="size-4" /></button> : <button type="button" onClick={() => void finish()} disabled={saving} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-70">{saving ? <Loader2 className="size-4 animate-spin" /> : <Target className="size-4" />}{isKo ? "My Plan 시작" : "Start My Plan"}</button>}</div>
        </div>

        <aside className="rounded-[1.75rem] border border-blue-100 bg-blue-950 p-6 text-blue-50 shadow-[0_20px_50px_rgba(30,64,175,.18)]"><p className="text-xs font-semibold uppercase tracking-[.16em] text-blue-200">{isKo ? "왜 시작하나요?" : "Why this matters"}</p><p className="mt-4 text-xl font-semibold leading-8">{isKo ? "좋은 계획은 할 일 목록보다, 선명한 선택에서 시작됩니다." : "A useful plan starts with a clear choice, not a long task list."}</p><div className="mt-7 space-y-4 text-sm leading-6 text-blue-100"><p>{isKo ? "전공과 학교는 지금 정하지 않아도 됩니다. 먼저 관심 방향만 잡고, 비교하면서 좁혀가세요." : "You do not need every answer today. Pick a direction, then narrow it as you compare."}</p><p>{isKo ? "제목과 전략은 언제든 바꿀 수 있습니다." : "You can revise the title and strategy whenever your plan changes."}</p></div></aside>
      </div>
    </section>
  </main>
}

function GoalStep({ isKo, occupations, studyConcepts, categoryId, occupationCode, conceptSlug, onSelectCategory, onSelectOccupation, onSelectConcept }: { isKo: boolean; occupations: GoalOccupation[]; studyConcepts: GoalStudyConcept[]; categoryId: string; occupationCode: string; conceptSlug: string; onSelectCategory: (category: string) => void; onSelectOccupation: (code: string) => void; onSelectConcept: (slug: string) => void }) {
  const australiaOccupations = occupations.filter((item) => !item.country || item.country === "AU")
  const visibleCategory = categoryId || STUDY_CATEGORIES[0].id
  const conceptsForCategory = studyConcepts.filter((item) => item.category === visibleCategory)
  return <div className="mt-8 space-y-8">
    <div>
      <div className="flex items-center gap-2"><GraduationCap className="size-5 text-blue-700" /><h2 className="text-xl font-semibold text-slate-950">{isKo ? "먼저 전공을 골라볼까요?" : "Start with a field"}</h2></div>
      <p className="mt-1 text-sm leading-6 text-slate-500">{isKo ? "카테고리를 고르면 지금 호주에서 비교할 수 있는 전공을 바로 보여드려요." : "Choose a category and we will show the fields you can compare in Australia."}</p>
      <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{STUDY_CATEGORIES.map((category) => <button key={category.id} type="button" onClick={() => onSelectCategory(category.id)} className={cn("rounded-xl border px-3 py-3 text-left text-xs font-semibold leading-5 transition", visibleCategory === category.id ? "border-blue-500 bg-blue-50 text-blue-900 shadow-sm" : "border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50/40")}>{isKo ? category.labelKo : category.label}</button>)}</div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">{conceptsForCategory.map((item) => <SelectionCard key={item.concept_slug} active={conceptSlug === item.concept_slug} onClick={() => onSelectConcept(item.concept_slug)} icon={<GraduationCap className="size-4" />} title={isKo ? item.concept_label_ko || item.concept_label : item.concept_label} detail={isKo ? "전공 선택" : "Study field"} />)}</div>
    </div>

    <div>
      <div className="flex items-center gap-2"><BriefcaseBusiness className="size-5 text-blue-700" /><h2 className="text-xl font-semibold text-slate-950">{isKo ? "목표 직업은 선택 사항이에요" : "Target career is optional"}</h2></div>
      <p className="mt-1 text-sm leading-6 text-slate-500">{isKo ? "직업을 아직 정하지 않았다면 건너뛰어도 됩니다. 전공을 먼저 비교해도 괜찮아요." : "You can skip this if you are still exploring. Your field can lead the first comparison."}</p>
      {australiaOccupations.length ? <div className="mt-4 grid gap-3 sm:grid-cols-2">{australiaOccupations.map((item) => <SelectionCard key={item.occ_code} active={occupationCode === item.occ_code} onClick={() => onSelectOccupation(item.occ_code)} icon={<BriefcaseBusiness className="size-4" />} title={item.occ_title || item.occ_code} detail={item.occ_code} />)}</div> : <EmptySavedState isKo={isKo} href="/au/jobs" label={isKo ? "호주 직업 둘러보기" : "Browse Australia careers"} />}
    </div>
  </div>
}

function ShortlistStep({ isKo, options, selectedKeys, schoolUndecided, onToggle, onToggleSchoolUndecided }: { isKo: boolean; options: GoalOption[]; selectedKeys: string[]; schoolUndecided: boolean; onToggle: (key: string) => void; onToggleSchoolUndecided: () => void }) {
  return <div className="mt-8"><div className="flex items-center justify-between gap-4"><div><h2 className="text-xl font-semibold text-slate-950">{isKo ? "학교를 대략 정해볼까요?" : "Choose a starting school"}</h2><p className="mt-1 text-sm leading-6 text-slate-500">{isKo ? "추천 대학과 저장한 학교 중 최대 3개를 골라 비교의 출발점으로 만드세요." : "Pick up to three recommendations or saved schools as a starting point for comparison."}</p></div><span className="shrink-0 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800">{schoolUndecided ? (isKo ? "학교 미정" : "Undecided") : `${selectedKeys.length}/3`}</span></div><div className="mt-5 grid gap-3 sm:grid-cols-2">{options.map((option) => <SelectionCard key={option.key} active={selectedKeys.includes(option.key)} onClick={() => onToggle(option.key)} icon={option.kind === "university" ? <Building2 className="size-4" /> : <GraduationCap className="size-4" />} title={option.title} detail={option.kind === "university" ? (option.recommended ? (isKo ? "추천 시작점 · 대학" : "Recommended starting point · University") : (isKo ? "저장한 대학" : "Saved university")) : `${option.providerName}${option.fieldName ? ` · ${option.fieldName}` : ""}`} />)}<SelectionCard active={schoolUndecided} onClick={onToggleSchoolUndecided} icon={<Sparkles className="size-4" />} title={isKo ? "학교는 아직 정하지 않음" : "I have not chosen a school yet"} detail={isKo ? "전공과 목표만 먼저 정하고 나중에 비교" : "Start with the field and decide after more research"} /></div>{!options.length && <EmptySavedState isKo={isKo} href="/au/study" label={isKo ? "학교·과정 비교하기" : "Compare study options"} />}</div>
}

function StrategyStep({ isKo, occupation, studyConcept, selectedOptions, schoolUndecided, intakeMonth, title, strategy, onIntakeChange, onTitleChange, onStrategyChange }: { isKo: boolean; occupation: GoalOccupation | null; studyConcept: GoalStudyConcept | null; selectedOptions: GoalOption[]; schoolUndecided: boolean; intakeMonth: string; title: string; strategy: string; onIntakeChange: (value: string) => void; onTitleChange: (value: string) => void; onStrategyChange: (value: string) => void }) {
  const direction = occupation?.occ_title || (studyConcept ? (isKo ? studyConcept.concept_label_ko || studyConcept.concept_label : studyConcept.concept_label) : "")
  const [year, month = "01"] = intakeMonth.split("-")
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 6 }, (_, index) => String(currentYear + index))
  const monthLabel = INTAKE_MONTHS.find((item) => item.value === month)
  const quickMonths = ["02", "05", "07", "10"]
  const updateMonth = (nextYear: string, nextMonth: string) => onIntakeChange(`${nextYear || String(currentYear + 1)}-${nextMonth}`)
  return <div className="mt-8"><div><h2 className="text-xl font-semibold text-slate-950">{isKo ? "계획의 방향을 적어주세요" : "Give your plan a direction"}</h2><p className="mt-1 text-sm leading-6 text-slate-500">{isKo ? "이 문장은 계획이 어려워질 때마다 다시 볼 기준이 됩니다." : "This is the line you will return to when the path gets complicated."}</p></div><div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-sm leading-6 text-blue-950"><p className="font-semibold">{isKo ? "현재 선택" : "Current direction"}</p><p className="mt-1">{direction || (isKo ? "아직 목표 직업 또는 전공을 선택하지 않았어요." : "A career or field has not been selected yet.")}{selectedOptions.length ? ` · ${selectedOptions.length} ${isKo ? "개 후보" : selectedOptions.length === 1 ? "option" : "options"}` : schoolUndecided ? ` · ${isKo ? "학교 미정" : "school undecided"}` : ""}</p></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold text-slate-700">{isKo ? "목표 입학 시기" : "Target intake"}<span className="mt-1 block text-xs font-normal text-slate-500">{isKo ? "연도와 월을 선택하거나 빠른 시작 시기를 눌러보세요." : "Choose a year and month, or use a quick intake."}</span><span className="mt-3 block rounded-2xl border border-blue-100 bg-blue-50/55 p-3"><span className="flex items-center justify-between gap-3"><span className="flex items-center gap-2"><span className="grid size-9 place-items-center rounded-xl bg-white text-blue-700 shadow-sm"><CalendarDays className="size-4" /></span><span className="text-sm font-semibold text-slate-900">{isKo ? `${year || currentYear + 1}년 ${Number(month)}월` : `${monthLabel?.label ?? "January"} ${year || currentYear + 1}`}</span></span><span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-blue-700">{isKo ? "예정" : "Planned"}</span></span><span className="mt-3 grid grid-cols-2 gap-2"><select aria-label={isKo ? "입학 연도" : "Intake year"} value={year || String(currentYear + 1)} onChange={(event) => updateMonth(event.target.value, month)} className="h-11 rounded-xl border border-blue-100 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"><option value="" disabled>{isKo ? "연도" : "Year"}</option>{years.map((item) => <option key={item} value={item}>{item}{isKo ? "년" : ""}</option>)}</select><select aria-label={isKo ? "입학 월" : "Intake month"} value={month} onChange={(event) => updateMonth(year, event.target.value)} className="h-11 rounded-xl border border-blue-100 bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"><option value="" disabled>{isKo ? "월" : "Month"}</option>{INTAKE_MONTHS.map((item) => <option key={item.value} value={item.value}>{isKo ? item.labelKo : item.label}</option>)}</select></span><span className="mt-3 flex flex-wrap gap-1.5">{quickMonths.map((quickMonth) => { const quickLabel = INTAKE_MONTHS.find((item) => item.value === quickMonth); return <button key={quickMonth} type="button" onClick={() => updateMonth(year, quickMonth)} className={cn("rounded-full border px-2.5 py-1 text-[11px] font-semibold transition", month === quickMonth ? "border-blue-500 bg-blue-600 text-white" : "border-blue-100 bg-white text-blue-700 hover:border-blue-300 hover:bg-blue-50")}>{isKo ? `${quickLabel?.labelKo} 시작` : `${quickLabel?.label} intake`}</button> })}</span></span></label><label className="text-sm font-semibold text-slate-700">{isKo ? "플랜 제목" : "Plan title"}<input value={title} onChange={(event) => onTitleChange(event.target.value.slice(0, 160))} maxLength={160} className="mt-3 h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></label></div><label className="mt-5 block text-sm font-semibold text-slate-700">{isKo ? "나의 전략" : "My strategy"}<span className="mt-1 block text-xs font-normal text-slate-500">{isKo ? "예: 비용은 통제하고, 취업 가능성이 높은 간호 루트를 우선한다." : "Example: Keep costs controlled and prioritise a nursing route with stronger employment outcomes."}</span><textarea value={strategy} onChange={(event) => onStrategyChange(event.target.value.slice(0, 500))} maxLength={500} rows={4} placeholder={isKo ? "내가 이 경로를 선택하는 기준을 적어보세요." : "Write the rule that will guide your decisions."} className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></label></div>
}

function SelectionCard({ active, onClick, icon, title, detail }: { active: boolean; onClick: () => void; icon: ReactNode; title: string; detail: string }) { return <button type="button" onClick={onClick} aria-pressed={active} className={cn("flex min-h-20 items-start gap-3 rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2", active ? "border-blue-500 bg-blue-50 shadow-[0_8px_18px_rgba(37,99,235,.10)]" : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/40")}><span className={cn("grid size-9 shrink-0 place-items-center rounded-xl", active ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500")}>{active ? <Check className="size-4" /> : icon}</span><span className="min-w-0"><span className="block truncate text-sm font-semibold text-slate-900">{title}</span><span className="mt-1 block line-clamp-2 text-xs leading-5 text-slate-500">{detail}</span></span></button> }
function EmptySavedState({ isKo, href, label }: { isKo: boolean; href: string; label: string }) { return <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-5 text-sm leading-6 text-slate-600"><p>{isKo ? "아직 저장한 직업이 없습니다. 직업은 나중에 선택해도 괜찮아요." : "No saved careers yet. You can choose a career later as your direction becomes clearer."}</p><Link href={href} className="mt-3 inline-flex items-center gap-1.5 font-semibold text-blue-700 hover:text-blue-800">{label}<ArrowRight className="size-4" /></Link></div> }
function defaultIntakeMonth() { const date = new Date(); date.setMonth(date.getMonth() + 12); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}` }
