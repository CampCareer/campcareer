"use client"

import { BookOpenCheck, CalendarDays, Languages, LineChart, Scale, Home, Target, Wallet, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouteLocale } from "@/lib/i18n/locale-provider"

export type PlannerArea = "home" | "compare" | "applications" | "budget" | "english" | "research" | "report"

type PlannerSidebarProps = {
  activeArea: PlannerArea
  readinessCount: number
  shortlistCount: number
  deadlinesSoon: number
  overdueDeadlines: number
  budgetGap: number | null
  currency: string
  englishExam: string
  englishGap: number | null
  researchToCheck: number
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
    { id: "compare", icon: Scale, label: isKo ? "비교" : "Compare" },
    { id: "applications", icon: CalendarDays, label: isKo ? "지원 관리" : "Applications" },
    { id: "budget", icon: Wallet, label: isKo ? "예산" : "Budget" },
    { id: "english", icon: Languages, label: isKo ? "영어 학습" : "English" },
    { id: "research", icon: BookOpenCheck, label: isKo ? "리서치" : "Research" },
    { id: "report", icon: LineChart, label: isKo ? "리포트" : "Report" },
  ]

  return <aside className="hidden h-full w-72 shrink-0 flex-col border-r border-slate-200 bg-white px-3 py-4 text-slate-700 sm:flex">
    <nav aria-label={isKo ? "My Plan 실행 영역" : "My Plan action areas"} className="space-y-1">
      {items.map((item) => <SidebarButton key={item.id} item={item} active={activeArea === item.id} onClick={() => onNavigate(item.id)} />)}
    </nav>

    <div className="my-4 border-t border-slate-200" />
  </aside>
}

type SidebarItem = { id: PlannerArea; icon: LucideIcon; label: string }

function SidebarButton({ item, active, onClick }: { item: SidebarItem; active: boolean; onClick: () => void }) {
  const Icon = item.icon
  return <button type="button" onClick={onClick} className={cn("group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition", active ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700")}><span className={cn("grid size-8 shrink-0 place-items-center rounded-lg", active ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-blue-600")}><Icon className="size-4" /></span><span className="min-w-0 flex-1 text-sm font-semibold">{item.label}</span></button>
}
