"use client"

import { BookOpenCheck, CalendarDays, Languages, LineChart, Scale, Home, Wallet, CheckCircle2, AlertTriangle, type LucideIcon } from "lucide-react"
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

export function PlannerSidebar({
  activeArea,
  readinessCount,
  shortlistCount,
  deadlinesSoon,
  overdueDeadlines,
  budgetGap,
  currency,
  englishExam,
  englishGap,
  researchToCheck,
  healthAttentionCount,
  reportReadinessCount,
  reportReady,
  onNavigate,
}: PlannerSidebarProps) {
  const locale = useRouteLocale()
  const isKo = locale === "ko"

  const items: SidebarItem[] = [
    { id: "home", icon: Home, label: isKo ? "홈" : "Home" },
    { id: "compare", icon: Scale, label: isKo ? "비교" : "Compare", badge: shortlistCount > 0 ? shortlistCount : undefined },
    { id: "applications", icon: CalendarDays, label: isKo ? "지원 관리" : "Applications", badge: overdueDeadlines > 0 ? overdueDeadlines : deadlinesSoon > 0 ? deadlinesSoon : undefined, badgeVariant: overdueDeadlines > 0 ? "danger" : deadlinesSoon > 0 ? "warning" : undefined },
    { id: "budget", icon: Wallet, label: isKo ? "예산" : "Budget", hint: budgetGap != null ? (budgetGap > 0 ? `+${currency}${Math.round(budgetGap).toLocaleString()}` : `${currency}${Math.round(budgetGap).toLocaleString()}`) : undefined, hintVariant: budgetGap != null && budgetGap < 0 ? "danger" : budgetGap != null && budgetGap > 0 ? "success" : undefined },
    { id: "english", icon: Languages, label: isKo ? "영어 학습" : "English", hint: englishGap != null ? (englishGap === 0 ? (isKo ? "목표 달성" : "Target met") : `+${englishGap} ${isKo ? "점 필요" : "pts needed"}`) : undefined, hintVariant: englishGap === 0 ? "success" : englishGap != null && englishGap > 0 ? "warning" : undefined },
    { id: "research", icon: BookOpenCheck, label: isKo ? "리서치" : "Research", badge: researchToCheck > 0 ? researchToCheck : undefined },
    { id: "report", icon: LineChart, label: isKo ? "리포트" : "Report", badge: reportReady ? "✓" : reportReadinessCount > 0 ? `${reportReadinessCount}` : undefined, badgeVariant: reportReady ? "success" : undefined },
  ]

  return (
    <aside className="flex h-full w-72 shrink-0 flex-col border-r border-slate-200 bg-white px-3 pt-14 pb-4 sm:pt-4 text-slate-700">
      {/* ── Readiness bar ── */}
      <div className="mb-3 rounded-xl bg-slate-50 px-3 py-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            {isKo ? "플랜 준비도" : "Readiness"}
          </span>
          <span className="text-[11px] font-bold text-slate-600">{readinessCount}/9</span>
        </div>
        <div className="mt-1.5 flex gap-1">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className={cn("h-1 flex-1 rounded-full", i < readinessCount ? "bg-blue-500" : "bg-slate-200")} />
          ))}
        </div>
        {healthAttentionCount > 0 && (
          <p className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-amber-600">
            <AlertTriangle className="size-3" />
            {isKo ? `${healthAttentionCount}개 관심 항목` : `${healthAttentionCount} attention`}
          </p>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav aria-label={isKo ? "My Plan 실행 영역" : "My Plan action areas"} className="space-y-0.5">
        {items.map((item) => (
          <SidebarButton key={item.id} item={item} active={activeArea === item.id} onClick={() => onNavigate(item.id)} isKo={isKo} />
        ))}
      </nav>

      <div className="my-4 border-t border-slate-200" />
    </aside>
  )
}

type BadgeVariant = "default" | "danger" | "warning" | "success"

type SidebarItem = {
  id: PlannerArea
  icon: LucideIcon
  label: string
  badge?: number | string
  badgeVariant?: BadgeVariant
  hint?: string
  hintVariant?: BadgeVariant
}

const BADGE_CLASSES: Record<BadgeVariant, string> = {
  default: "bg-blue-100 text-blue-700",
  danger: "bg-red-100 text-red-700",
  warning: "bg-amber-100 text-amber-700",
  success: "bg-emerald-100 text-emerald-700",
}

function SidebarButton({ item, active, onClick, isKo }: { item: SidebarItem; active: boolean; onClick: () => void; isKo: boolean }) {
  const Icon = item.icon
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition",
        active ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700",
      )}
    >
      <span className={cn(
        "grid size-8 shrink-0 place-items-center rounded-lg",
        active ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-blue-600",
      )}>
        <Icon className="size-4" />
      </span>
      <span className="min-w-0 flex-1 text-sm font-semibold">{item.label}</span>
      {item.badge != null && (
        <span className={cn("shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none", BADGE_CLASSES[item.badgeVariant ?? "default"])}>
          {item.badge}
        </span>
      )}
      {!item.badge && item.hint && (
        <span className={cn("shrink-0 truncate text-[11px] font-medium", item.hintVariant === "danger" ? "text-red-600" : item.hintVariant === "success" ? "text-emerald-600" : item.hintVariant === "warning" ? "text-amber-600" : "text-slate-400")}>
          {item.hint}
        </span>
      )}
    </button>
  )
}
