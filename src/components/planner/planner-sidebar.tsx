"use client"

import { Banknote, BookOpenCheck, CalendarDays, Languages, LineChart, NotebookPen, Sparkles, Target, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouteLocale } from "@/lib/i18n/locale-provider"

export type PlannerArea = "today" | "pathway" | "applications" | "money" | "english" | "research" | "report" | "notes"

type PlannerSidebarProps = {
  activeArea: PlannerArea
  readinessCount: number
  shortlistCount: number
  deadlinesSoon: number
  overdueDeadlines: number
  moneyGap: number | null
  currency: string
  englishExam: string
  englishGap: number | null
  researchToCheck: number
  noteCount: number
  healthAttentionCount: number
  reportReadinessCount: number
  reportReady: boolean
  onNavigate: (area: PlannerArea) => void
}

export function PlannerSidebar({ activeArea, onNavigate }: PlannerSidebarProps) {
  const locale = useRouteLocale()
  const isKo = locale === "ko"
  const items: SidebarItem[] = [
    { id: "today", icon: Sparkles, label: isKo ? "오늘" : "Today" },
    { id: "pathway", icon: Target, label: isKo ? "나의 경로" : "My pathway" },
    { id: "applications", icon: CalendarDays, label: isKo ? "지원 준비" : "Applications" },
    { id: "money", icon: Banknote, label: isKo ? "자금 런웨이" : "Money runway" },
    { id: "english", icon: Languages, label: isKo ? "영어 목표" : "English target" },
    { id: "research", icon: BookOpenCheck, label: isKo ? "리서치 데스크" : "Research desk" },
    { id: "report", icon: LineChart, label: isKo ? "의사결정 리포트" : "Decision report" },
  ]

  return <aside className="hidden h-full w-72 shrink-0 flex-col border-r border-blue-950/30 bg-[#071936] px-3 py-4 text-white sm:flex">
    <div className="px-3 pb-5 pt-1"><div className="flex items-center gap-2.5"><span className="grid size-8 place-items-center rounded-xl bg-blue-500 text-sm font-bold shadow-[0_8px_18px_rgba(37,99,235,.35)]">C</span><div><p className="text-sm font-semibold tracking-tight">CampCareer</p><p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[.16em] text-blue-300">My Plan · Australia</p></div></div></div>

    <nav aria-label={isKo ? "My Plan 실행 영역" : "My Plan action areas"} className="space-y-1">
      {items.map((item) => <SidebarButton key={item.id} item={item} active={activeArea === item.id} onClick={() => onNavigate(item.id)} />)}
    </nav>

    <div className="my-4 border-t border-white/10" />
    <button type="button" onClick={() => onNavigate("notes")} className={cn("group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition", activeArea === "notes" ? "bg-white/12 text-white" : "text-slate-300 hover:bg-white/8 hover:text-white")}>
      <span className={cn("grid size-8 shrink-0 place-items-center rounded-lg", activeArea === "notes" ? "bg-white/15 text-cyan-200" : "bg-white/6 text-slate-400 group-hover:text-blue-200")}><NotebookPen className="size-4" /></span>
      <span className="min-w-0 flex-1 text-sm font-semibold">{isKo ? "노트" : "Notes"}</span>
    </button>
  </aside>
}

type SidebarItem = { id: Exclude<PlannerArea, "notes">; icon: LucideIcon; label: string }

function SidebarButton({ item, active, onClick }: { item: SidebarItem; active: boolean; onClick: () => void }) {
  const Icon = item.icon
  return <button type="button" onClick={onClick} className={cn("group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition", active ? "bg-blue-500 text-white shadow-[0_10px_24px_rgba(0,0,0,.18)]" : "text-slate-300 hover:bg-white/8 hover:text-white")}><span className={cn("grid size-8 shrink-0 place-items-center rounded-lg", active ? "bg-white/15 text-cyan-100" : "bg-white/6 text-slate-400 group-hover:text-blue-200")}><Icon className="size-4" /></span><span className="min-w-0 flex-1 text-sm font-semibold">{item.label}</span></button>
}
