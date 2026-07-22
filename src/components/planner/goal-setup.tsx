"use client"

import Link from "next/link"
import { useMemo, useState, type ReactNode } from "react"
import { ArrowLeft, ArrowRight, BriefcaseBusiness, Building2, CalendarDays, Check, GraduationCap, Loader2, Sparkles, Target } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouteLocale } from "@/lib/i18n/locale-provider"

export type GoalOccupation = { occ_code: string; occ_title: string; country: string }
export type GoalStudyConcept = { concept_slug: string; concept_label: string; concept_label_ko: string }
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

export function GoalSetup({ occupations, studyConcepts, universities, courses, onComplete }: GoalSetupProps) {
  const locale = useRouteLocale()
  const isKo = locale === "ko"
  const [step, setStep] = useState(0)
  const [occupationCode, setOccupationCode] = useState("")
  const [conceptSlug, setConceptSlug] = useState("")
  const [selectedOptionKeys, setSelectedOptionKeys] = useState<string[]>([])
  const [intakeMonth, setIntakeMonth] = useState(defaultIntakeMonth())
  const [title, setTitle] = useState(isKo ? "나의 호주 유학 경로" : "My Australia pathway")
  const [strategy, setStrategy] = useState("")
  const [titleTouched, setTitleTouched] = useState(false)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState("")

  const occupation = occupations.find((item) => item.occ_code === occupationCode) ?? null
  const studyConcept = studyConcepts.find((item) => item.concept_slug === conceptSlug) ?? null
  const options = useMemo<GoalOption[]>(() => [
    ...universities.map((item) => ({
      key: `university:${item.univ_slug}`,
      sourceType: "saved_university" as const,
      sourceReference: item.univ_slug,
      title: item.univ_name || item.univ_slug,
      providerName: item.univ_name || item.univ_slug,
      fieldName: "",
      kind: "university" as const,
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
  ], [courses, universities])
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
    const nextConcept = studyConcepts.find((item) => item.concept_slug === next) ?? null
    setConceptSlug(next)
    updateSuggestedTitle(occupation, nextConcept)
  }

  function toggleOption(key: string) {
    setNotice("")
    setSelectedOptionKeys((current) => {
      if (current.includes(key)) return current.filter((item) => item !== key)
      if (current.length >= 3) {
        setNotice(isKo ? "후보는 최대 3개까지 선택할 수 있어요." : "Choose up to three options for this plan.")
        return current
      }
      return [...current, key]
    })
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

  const steps = isKo ? ["목표", "후보", "전략"] : ["Goal", "Shortlist", "Strategy"]
  return <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#dcecff,_transparent_32%),#f7f9fc] px-5 py-7 sm:px-8 sm:py-10">
    <section className="mx-auto max-w-5xl">
      <div className="flex items-center justify-between gap-4"><Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-700"><span className="grid size-9 place-items-center rounded-xl bg-blue-600 text-sm font-bold text-white">C</span>CampCareer</Link><p className="text-xs font-semibold uppercase tracking-[.15em] text-slate-400">My Plan · Australia</p></div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div className="rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-[0_24px_70px_rgba(37,99,235,.12)] backdrop-blur sm:p-9">
          <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800"><Sparkles className="size-3.5" />{isKo ? "나만의 호주 경로" : "Your Australia path"}</p>
          <h1 className="mt-5 max-w-2xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{isKo ? "계획 전체가 아니라, 다음 목표부터 정해볼까요?" : "Set the next decision, not every decision at once."}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{isKo ? "저장한 후보를 출발점으로 목표와 방향을 정하면, 이후 My Plan이 준비 상황을 함께 관리합니다." : "Use the options you saved to set a direction. My Plan will turn it into the next actions and milestones."}</p>

          <div className="mt-8 flex items-center gap-2" aria-label={isKo ? "목표 설정 단계" : "Goal setup steps"}>{steps.map((label, index) => <div key={label} className="flex min-w-0 items-center gap-2"><span className={cn("grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold", index <= step ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400")}>{index < step ? <Check className="size-3.5" /> : index + 1}</span><span className={cn("text-xs font-semibold", index === step ? "text-slate-900" : "text-slate-400")}>{label}</span>{index < steps.length - 1 && <span className="h-px w-7 bg-slate-200 sm:w-12" />}</div>)}</div>

          {step === 0 && <GoalStep isKo={isKo} occupations={occupations} studyConcepts={studyConcepts} occupationCode={occupationCode} conceptSlug={conceptSlug} onSelectOccupation={selectOccupation} onSelectConcept={selectStudyConcept} />}
          {step === 1 && <ShortlistStep isKo={isKo} options={options} selectedKeys={selectedOptionKeys} onToggle={toggleOption} />}
          {step === 2 && <StrategyStep isKo={isKo} occupation={occupation} studyConcept={studyConcept} selectedOptions={selectedOptions} intakeMonth={intakeMonth} title={title} strategy={strategy} onIntakeChange={(value) => { setIntakeMonth(value); updateSuggestedTitle(occupation, studyConcept, value) }} onTitleChange={(value) => { setTitleTouched(true); setTitle(value) }} onStrategyChange={setStrategy} />}

          {notice && <p role="status" className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">{notice}</p>}
          <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-100 pt-5"><button type="button" onClick={() => setStep((current) => Math.max(0, current - 1))} disabled={step === 0 || saving} className="inline-flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-900 disabled:invisible"><ArrowLeft className="size-4" />{isKo ? "이전" : "Back"}</button>{step < 2 ? <button type="button" onClick={() => { setNotice(""); setStep((current) => current + 1) }} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700">{isKo ? "계속" : "Continue"}<ArrowRight className="size-4" /></button> : <button type="button" onClick={() => void finish()} disabled={saving} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-70">{saving ? <Loader2 className="size-4 animate-spin" /> : <Target className="size-4" />}{isKo ? "My Plan 시작" : "Start My Plan"}</button>}</div>
        </div>

        <aside className="rounded-[1.75rem] border border-blue-100 bg-blue-950 p-6 text-blue-50 shadow-[0_20px_50px_rgba(30,64,175,.18)]"><p className="text-xs font-semibold uppercase tracking-[.16em] text-blue-200">{isKo ? "왜 시작하나요?" : "Why this matters"}</p><p className="mt-4 text-xl font-semibold leading-8">{isKo ? "좋은 계획은 할 일 목록보다, 선명한 선택에서 시작됩니다." : "A useful plan starts with a clear choice, not a long task list."}</p><div className="mt-7 space-y-4 text-sm leading-6 text-blue-100"><p>{isKo ? "저장한 전공·대학·과정은 이후에도 Research desk에서 계속 확인할 수 있어요." : "Your saved fields, universities and courses stay available in your Research desk."}</p><p>{isKo ? "제목과 전략은 언제든 바꿀 수 있습니다." : "You can revise the title and strategy whenever your plan changes."}</p></div></aside>
      </div>
    </section>
  </main>
}

function GoalStep({ isKo, occupations, studyConcepts, occupationCode, conceptSlug, onSelectOccupation, onSelectConcept }: { isKo: boolean; occupations: GoalOccupation[]; studyConcepts: GoalStudyConcept[]; occupationCode: string; conceptSlug: string; onSelectOccupation: (code: string) => void; onSelectConcept: (slug: string) => void }) {
  const australiaOccupations = occupations.filter((item) => !item.country || item.country === "AU")
  return <div className="mt-8 space-y-8"><div><div className="flex items-center gap-2"><BriefcaseBusiness className="size-5 text-blue-700" /><h2 className="text-xl font-semibold text-slate-950">{isKo ? "목표 직업" : "Target career"}</h2></div><p className="mt-1 text-sm leading-6 text-slate-500">{isKo ? "저장해 둔 직업 중 현재 가장 가까운 목표를 선택하세요. 나중에 바꿀 수 있어요." : "Choose the saved career that is closest to your current goal. You can change it later."}</p>{australiaOccupations.length ? <div className="mt-4 grid gap-3 sm:grid-cols-2">{australiaOccupations.map((item) => <SelectionCard key={item.occ_code} active={occupationCode === item.occ_code} onClick={() => onSelectOccupation(item.occ_code)} icon={<BriefcaseBusiness className="size-4" />} title={item.occ_title || item.occ_code} detail={item.occ_code} />)}</div> : <EmptySavedState isKo={isKo} href="/au/jobs" label={isKo ? "호주 직업 둘러보기" : "Browse Australia careers"} />}</div><div><div className="flex items-center gap-2"><GraduationCap className="size-5 text-violet-700" /><h2 className="text-xl font-semibold text-slate-950">{isKo ? "학업 방향" : "Study direction"}</h2></div><p className="mt-1 text-sm leading-6 text-slate-500">{isKo ? "저장한 전공이 있다면 함께 선택해 경로의 기준으로 사용하세요." : "Bring a saved field into the plan so it can guide your study research."}</p>{studyConcepts.length ? <div className="mt-4 grid gap-3 sm:grid-cols-2">{studyConcepts.map((item) => <SelectionCard key={item.concept_slug} active={conceptSlug === item.concept_slug} onClick={() => onSelectConcept(item.concept_slug)} icon={<GraduationCap className="size-4" />} title={isKo ? item.concept_label_ko || item.concept_label : item.concept_label} detail={isKo ? "저장한 전공" : "Saved field"} />)}</div> : <EmptySavedState isKo={isKo} href="/au/majors" label={isKo ? "호주 전공 둘러보기" : "Browse Australia fields"} />}</div></div>
}

function ShortlistStep({ isKo, options, selectedKeys, onToggle }: { isKo: boolean; options: GoalOption[]; selectedKeys: string[]; onToggle: (key: string) => void }) {
  return <div className="mt-8"><div className="flex items-center justify-between gap-4"><div><h2 className="text-xl font-semibold text-slate-950">{isKo ? "관심 후보" : "Your shortlist"}</h2><p className="mt-1 text-sm leading-6 text-slate-500">{isKo ? "대학 또는 과정을 최대 3개까지 선택해 비교의 출발점으로 만드세요." : "Choose up to three universities or courses to become the starting point for comparisons."}</p></div><span className="shrink-0 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-800">{selectedKeys.length}/3</span></div>{options.length ? <div className="mt-5 grid gap-3 sm:grid-cols-2">{options.map((option) => <SelectionCard key={option.key} active={selectedKeys.includes(option.key)} onClick={() => onToggle(option.key)} icon={option.kind === "university" ? <Building2 className="size-4" /> : <GraduationCap className="size-4" />} title={option.title} detail={option.kind === "university" ? (isKo ? "저장한 대학" : "Saved university") : `${option.providerName}${option.fieldName ? ` · ${option.fieldName}` : ""}`} />)}</div> : <EmptySavedState isKo={isKo} href="/au/study" label={isKo ? "학교·과정 비교하기" : "Compare study options"} />}</div>
}

function StrategyStep({ isKo, occupation, studyConcept, selectedOptions, intakeMonth, title, strategy, onIntakeChange, onTitleChange, onStrategyChange }: { isKo: boolean; occupation: GoalOccupation | null; studyConcept: GoalStudyConcept | null; selectedOptions: GoalOption[]; intakeMonth: string; title: string; strategy: string; onIntakeChange: (value: string) => void; onTitleChange: (value: string) => void; onStrategyChange: (value: string) => void }) {
  const direction = occupation?.occ_title || (studyConcept ? (isKo ? studyConcept.concept_label_ko || studyConcept.concept_label : studyConcept.concept_label) : "")
  return <div className="mt-8"><div><h2 className="text-xl font-semibold text-slate-950">{isKo ? "계획의 방향을 적어주세요" : "Give your plan a direction"}</h2><p className="mt-1 text-sm leading-6 text-slate-500">{isKo ? "이 문장은 계획이 어려워질 때마다 다시 볼 기준이 됩니다." : "This is the line you will return to when the path gets complicated."}</p></div><div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-sm leading-6 text-blue-950"><p className="font-semibold">{isKo ? "현재 선택" : "Current direction"}</p><p className="mt-1">{direction || (isKo ? "아직 목표 직업 또는 전공을 선택하지 않았어요." : "A career or field has not been selected yet.")}{selectedOptions.length ? ` · ${selectedOptions.length} ${isKo ? "개 후보" : selectedOptions.length === 1 ? "option" : "options"}` : ""}</p></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold text-slate-700">{isKo ? "목표 입학 시기" : "Target intake"}<span className="mt-1 block text-xs font-normal text-slate-500">{isKo ? "아직 미정이라도 추정 시기를 적어두세요." : "An estimate is enough for now."}</span><span className="mt-2 flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3"><CalendarDays className="size-4 text-slate-400" /><input type="month" value={intakeMonth} onChange={(event) => onIntakeChange(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-800 outline-none" /></span></label><label className="text-sm font-semibold text-slate-700">{isKo ? "플랜 제목" : "Plan title"}<input value={title} onChange={(event) => onTitleChange(event.target.value.slice(0, 160))} maxLength={160} className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></label></div><label className="mt-5 block text-sm font-semibold text-slate-700">{isKo ? "나의 전략" : "My strategy"}<span className="mt-1 block text-xs font-normal text-slate-500">{isKo ? "예: 비용은 통제하고, 취업 가능성이 높은 간호 루트를 우선한다." : "Example: Keep costs controlled and prioritise a nursing route with stronger employment outcomes."}</span><textarea value={strategy} onChange={(event) => onStrategyChange(event.target.value.slice(0, 500))} maxLength={500} rows={4} placeholder={isKo ? "내가 이 경로를 선택하는 기준을 적어보세요." : "Write the rule that will guide your decisions."} className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></label></div>
}

function SelectionCard({ active, onClick, icon, title, detail }: { active: boolean; onClick: () => void; icon: ReactNode; title: string; detail: string }) { return <button type="button" onClick={onClick} aria-pressed={active} className={cn("flex min-h-20 items-start gap-3 rounded-2xl border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2", active ? "border-blue-500 bg-blue-50 shadow-[0_8px_18px_rgba(37,99,235,.10)]" : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/40")}><span className={cn("grid size-9 shrink-0 place-items-center rounded-xl", active ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500")}>{active ? <Check className="size-4" /> : icon}</span><span className="min-w-0"><span className="block truncate text-sm font-semibold text-slate-900">{title}</span><span className="mt-1 block line-clamp-2 text-xs leading-5 text-slate-500">{detail}</span></span></button> }
function EmptySavedState({ isKo, href, label }: { isKo: boolean; href: string; label: string }) { return <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-5 text-sm leading-6 text-slate-600"><p>{isKo ? "아직 저장한 후보가 없습니다. 탐색 중 마음에 드는 항목을 저장하면 여기에서 바로 고를 수 있어요." : "You have not saved an option yet. Save one while you explore and it will appear here."}</p><Link href={href} className="mt-3 inline-flex items-center gap-1.5 font-semibold text-blue-700 hover:text-blue-800">{label}<ArrowRight className="size-4" /></Link></div> }
function defaultIntakeMonth() { const date = new Date(); date.setMonth(date.getMonth() + 12); return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}` }
