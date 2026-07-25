"use client"

import { Banknote, BookOpenCheck, CalendarDays, Languages, LineChart, NotebookPen, Scale, Home, Sparkles, Target, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouteLocale } from "@/lib/i18n/locale-provider"
import { PlannerSearch } from "./planner-search"

export type PlannerArea = "home" | "today" | "pathway" | "applications" | "money" | "english" | "research" | "report" | "notes" | "compare"

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
  onOpenPath: (path: string) => void
}

export function PlannerSidebar({ activeArea, onNavigate, onOpenPath }: PlannerSidebarProps) {
  const locale = useRouteLocale()
  const isKo = locale === "ko"
  const items: SidebarItem[] = [
    { id: "home", icon: Home, label: isKo ? "홈" : "Home" },
    { id: "today", icon: Sparkles, label: isKo ? "오늘" : "Today" },
    { id: "pathway", icon: Target, label: isKo ? "나의 경로" : "My pathway" },
    { id: "compare", icon: Scale, label: isKo ? "비교" : "Compare" },
    { id: "applications", icon: CalendarDays, label: isKo ? "지원 준비" : "Applications" },
    { id: "money", icon: Banknote, label: isKo ? "자금 런웨이" : "Money runway" },
    { id: "english", icon: Languages, label: isKo ? "영어 목표" : "English target" },
    { id: "research", icon: BookOpenCheck, label: isKo ? "리서치 데스크" : "Research desk" },
    { id: "report", icon: LineChart, label: isKo ? "의사결정 리포트" : "Decision report" },
  ]

  return <aside className="hidden h-full w-72 shrink-0 flex-col border-r border-slate-200 bg-white px-3 py-4 text-slate-700 sm:flex">
    <div className="flex justify-end px-3 pb-5 pt-1"><PlannerSearch isKo={isKo} onNavigate={onNavigate} onOpenPath={onOpenPath} /></div>

    <nav aria-label={isKo ? "My Plan 실행 영역" : "My Plan action areas"} className="space-y-1">
      {items.map((item) => <SidebarButton key={item.id} item={item} active={activeArea === item.id} onClick={() => onNavigate(item.id)} />)}
    </nav>

    <div className="my-4 border-t border-slate-200" />
    <button type="button" onClick={() => onNavigate("notes")} className={cn("group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition", activeArea === "notes" ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700")}>
      <span className={cn("grid size-8 shrink-0 place-items-center rounded-lg", activeArea === "notes" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-blue-600")}><NotebookPen className="size-4" /></span>
      <span className="min-w-0 flex-1 text-sm font-semibold">{isKo ? "노트" : "Notes"}</span>
    </button>
  </aside>
}

type SidebarItem = { id: Exclude<PlannerArea, "notes">; icon: LucideIcon; label: string }

function SidebarButton({ item, active, onClick }: { item: SidebarItem; active: boolean; onClick: () => void }) {
  const Icon = item.icon
  return <button type="button" onClick={onClick} className={cn("group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition", active ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700")}><span className={cn("grid size-8 shrink-0 place-items-center rounded-lg", active ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-blue-600")}><Icon className="size-4" /></span><span className="min-w-0 flex-1 text-sm font-semibold">{item.label}</span></button>
}
