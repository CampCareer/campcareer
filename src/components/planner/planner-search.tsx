"use client"

import { useEffect, useMemo, useState, type FormEvent } from "react"
import { createPortal } from "react-dom"
import { ArrowRight, Banknote, BookOpenCheck, CalendarDays, Clock3, FileText, GraduationCap, Languages, Map, Search, Target, X } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import type { PlannerArea } from "./planner-sidebar"

type SearchItem = {
  id: string
  label: string
  description: string
  keywords: string
  href: string
  icon: LucideIcon
  area?: PlannerArea
}

type PlannerSearchProps = {
  isKo: boolean
  onNavigate: (area: PlannerArea) => void
  onOpenPath: (path: string) => void
}

const RECENTS_KEY = "campcareer-myplan-search-recents"

export function PlannerSearch({ isKo, onNavigate, onOpenPath }: PlannerSearchProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [recentIds, setRecentIds] = useState<string[]>([])

  const items = useMemo<SearchItem[]>(() => [
    { id: "today", label: isKo ? "오늘" : "Today", description: isKo ? "플랜 전체 현황과 다음 행동" : "Your plan overview and next action", keywords: "today dashboard next best move readiness", href: "/myplan", icon: Target, area: "today" },
    { id: "pathway", label: isKo ? "나의 경로" : "My pathway", description: isKo ? "최대 세 개 경로와 현재 1순위" : "Compare up to three routes and choose a first option", keywords: "pathway route shortlist compare option", href: "/myplan/pathway", icon: GraduationCap, area: "pathway" },
    { id: "applications", label: isKo ? "지원 준비" : "Applications", description: isKo ? "마감일과 서류 체크리스트" : "Deadlines and application documents", keywords: "application deadline documents offer apply", href: "/myplan/applications", icon: CalendarDays, area: "applications" },
    { id: "money", label: isKo ? "자금 런웨이" : "Money runway", description: isKo ? "총 필요 자금과 저축 시나리오" : "Funding target and saving scenarios", keywords: "money budget funding savings scholarship cost", href: "/myplan/money", icon: Banknote, area: "money" },
    { id: "english", label: isKo ? "영어 목표" : "English target", description: isKo ? "목표 점수와 주간 학습 계획" : "Target score and weekly study plan", keywords: "english IELTS score test study", href: "/myplan/english", icon: Languages, area: "english" },
    { id: "research", label: isKo ? "리서치 데스크" : "Research desk", description: isKo ? "저장한 후보와 공식 근거" : "Saved options and official evidence", keywords: "research shortlist watching ruled out evidence", href: "/myplan/research", icon: BookOpenCheck, area: "research" },
    { id: "notes", label: isKo ? "노트" : "Notes", description: isKo ? "결정의 이유와 생각 기록" : "Keep the thinking behind your decisions", keywords: "notes writing journal decisions", href: "/myplan/notes", icon: FileText, area: "notes" },
    { id: "study", label: isKo ? "학업 비교" : "Compare study", description: isKo ? "호주 대학과 과정 비교" : "Compare Australian universities and courses", keywords: "study university course provider tuition compare", href: "/au/study", icon: GraduationCap },
    { id: "majors", label: isKo ? "전공 탐색" : "Explore fields", description: isKo ? "호주 전공과 커리어 방향 탐색" : "Explore Australian fields and career directions", keywords: "major field subject career nursing IT engineering", href: "/au/majors", icon: Target },
    { id: "maps", label: "Maps", description: isKo ? "지역별 직업·학업 정보 지도" : "Explore location-based study and career signals", keywords: "map city location state jobs study", href: "/maps", icon: Map },
    { id: "report", label: isKo ? "의사결정 리포트" : "Decision report", description: isKo ? "내 조건으로 ROI 리포트 준비" : "Prepare a personalised ROI decision report", keywords: "ROI report decision personalised recommendation", href: "/reports/my-australia?from=myplan", icon: FileText, area: "report" },
  ], [isKo])

  const recents = recentIds.map((id) => items.find((item) => item.id === id)).filter((item): item is SearchItem => Boolean(item))
  const normalizedQuery = query.trim().toLocaleLowerCase()
  const results = normalizedQuery
    ? items.filter((item) => `${item.label} ${item.description} ${item.keywords}`.toLocaleLowerCase().includes(normalizedQuery))
    : []

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const stored = JSON.parse(window.localStorage.getItem(RECENTS_KEY) ?? "[]")
      if (Array.isArray(stored)) setRecentIds(stored.filter((id): id is string => typeof id === "string").slice(0, 6))
    } catch {
      setRecentIds([])
    }
  }, [])

  useEffect(() => {
    if (!open) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open])

  function remember(item: SearchItem) {
    setRecentIds((current) => {
      const next = [item.id, ...current.filter((id) => id !== item.id)].slice(0, 6)
      if (typeof window !== "undefined") window.localStorage.setItem(RECENTS_KEY, JSON.stringify(next))
      return next
    })
  }

  function openItem(item: SearchItem) {
    remember(item)
    setOpen(false)
    setQuery("")
    if (item.area) onNavigate(item.area)
    else onOpenPath(item.href)
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (results.length === 1) openItem(results[0])
  }

  return <>
    <button type="button" onClick={() => setOpen(true)} className="grid size-8 place-items-center rounded-lg text-slate-500 transition hover:bg-white/70 hover:text-slate-900" title={isKo ? "페이지 검색" : "Search pages"} aria-label={isKo ? "페이지 검색" : "Search pages"}><Search className="size-4" /></button>
    {open && typeof document !== "undefined" && createPortal(<div className="fixed inset-0 z-[100] bg-slate-950/30 p-4 backdrop-blur-[2px] sm:p-6" role="presentation" onMouseDown={() => setOpen(false)}>
      <section role="dialog" aria-modal="true" aria-labelledby="planner-search-title" className="mx-auto mt-[12vh] w-full max-w-2xl overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,.24)]" onMouseDown={(event) => event.stopPropagation()}>
        <form onSubmit={submitSearch} className="flex items-center gap-3 border-b border-slate-100 px-5 py-4"><Search className="size-5 shrink-0 text-blue-600" /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder={isKo ? "My Plan에서 페이지 검색" : "Search My Plan pages"} aria-label={isKo ? "My Plan 페이지 검색" : "Search My Plan pages"} className="min-w-0 flex-1 bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400" /><kbd className="hidden rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-semibold text-slate-400 sm:inline">ESC</kbd><button type="button" onClick={() => setOpen(false)} className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label={isKo ? "검색 닫기" : "Close search"}><X className="size-4" /></button></form>
        <div className="max-h-[min(60vh,30rem)] overflow-y-auto p-3">
          {!normalizedQuery && <><div className="flex items-center gap-2 px-3 pb-2 pt-1 text-xs font-semibold uppercase tracking-[.14em] text-slate-400"><Clock3 className="size-3.5" />{isKo ? "최근 방문" : "Recents"}</div>{recents.length ? <div className="space-y-1">{recents.map((item) => <SearchResult key={`recent-${item.id}`} item={item} onClick={() => openItem(item)} />)}</div> : <p className="px-3 py-8 text-center text-sm text-slate-500">{isKo ? "아직 검색한 페이지가 없습니다." : "Pages you open will appear here."}</p>}</>}
          {normalizedQuery && <>{results.length ? <div className="space-y-1">{results.map((item) => <SearchResult key={item.id} item={item} onClick={() => openItem(item)} />)}</div> : <p className="px-3 py-10 text-center text-sm text-slate-500">{isKo ? "관련 페이지를 찾지 못했어요." : "No related pages found."}</p>}</>}
        </div>
        <p id="planner-search-title" className="border-t border-slate-100 px-5 py-3 text-[11px] text-slate-400">{isKo ? "페이지를 선택하면 최근 방문에 저장됩니다." : "Choose a page to save it to Recents."}</p>
      </section>
    </div>, document.body)}
  </>
}

function SearchResult({ item, onClick }: { item: SearchItem; onClick: () => void }) {
  const Icon = item.icon
  return <button type="button" onClick={onClick} className="group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-blue-50"><span className="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500 transition group-hover:bg-blue-100 group-hover:text-blue-700"><Icon className="size-4" /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-slate-900">{item.label}</span><span className="mt-0.5 block truncate text-xs text-slate-500">{item.description}</span></span><ArrowRight className="size-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-600" /></button>
}
