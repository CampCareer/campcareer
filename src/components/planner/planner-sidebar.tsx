"use client"

import { Banknote, BookOpenCheck, CalendarDays, ChevronRight, Languages, LineChart, NotebookPen, Radar, Sparkles, Target, type LucideIcon } from "lucide-react"
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

export function PlannerSidebar({
  activeArea,
  readinessCount,
  shortlistCount,
  deadlinesSoon,
  overdueDeadlines,
  moneyGap,
  currency,
  englishExam,
  englishGap,
  researchToCheck,
  noteCount,
  healthAttentionCount,
  reportReadinessCount,
  reportReady,
  onNavigate,
}: PlannerSidebarProps) {
  const locale = useRouteLocale()
  const isKo = locale === "ko"
  const items: SidebarItem[] = [
    { id: "today", icon: Sparkles, label: isKo ? "오늘" : "Today", detail: healthAttentionCount ? (isKo ? `확인할 계획 신호 ${healthAttentionCount}개` : `${healthAttentionCount} plan signal${healthAttentionCount === 1 ? "" : "s"} to review`) : (isKo ? `핵심 준비 ${readinessCount}/9` : `${readinessCount}/9 essentials ready`) },
    { id: "pathway", icon: Target, label: isKo ? "나의 경로" : "My pathway", detail: shortlistCount ? (isKo ? `${shortlistCount}개 후보 저장됨` : `${shortlistCount} options saved`) : (isKo ? "후보를 선택해 보세요" : "Choose an option") },
    { id: "applications", icon: CalendarDays, label: isKo ? "지원 준비" : "Applications", detail: applicationDetail({ isKo, deadlinesSoon, overdueDeadlines }) },
    { id: "money", icon: Banknote, label: isKo ? "자금 런웨이" : "Money runway", detail: moneyGap == null ? (isKo ? "필요 자금 설정" : "Set your funding target") : (isKo ? `${formatMoney(moneyGap, currency, locale)} 부족` : `${formatMoney(moneyGap, currency, locale)} to fund`) },
    { id: "english", icon: Languages, label: isKo ? "영어 목표" : "English target", detail: englishGap == null ? (isKo ? "현재·목표 점수 입력" : "Add current and target scores") : englishGap === 0 ? (isKo ? `${englishExam || "IELTS"} 목표 달성` : `${englishExam || "IELTS"} target met`) : (isKo ? `${englishExam || "IELTS"} +${englishGap.toFixed(1)} 필요` : `${englishExam || "IELTS"} +${englishGap.toFixed(1)} needed`) },
    { id: "research", icon: BookOpenCheck, label: isKo ? "리서치 데스크" : "Research desk", detail: researchToCheck ? (isKo ? `확인할 정보 ${researchToCheck}개` : `${researchToCheck} checks to review`) : (isKo ? "핵심 정보 확인 완료" : "Core checks complete") },
    { id: "report", icon: LineChart, label: isKo ? "의사결정 리포트" : "Decision report", detail: reportReady ? (isKo ? "ROI 리포트 초안 준비 완료" : "ROI draft ready to prepare") : (isKo ? `ROI 준비 ${reportReadinessCount}/4` : `ROI readiness ${reportReadinessCount}/4`) },
  ]

  return <aside className="hidden h-full w-72 shrink-0 flex-col border-r border-blue-950/30 bg-[#071936] px-3 py-4 text-white sm:flex">
    <div className="px-3 pb-5 pt-1"><div className="flex items-center gap-2.5"><span className="grid size-8 place-items-center rounded-xl bg-blue-500 text-sm font-bold shadow-[0_8px_18px_rgba(37,99,235,.35)]">C</span><div><p className="text-sm font-semibold tracking-tight">CampCareer</p><p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[.16em] text-blue-300">My Plan · Australia</p></div></div></div>

    <nav aria-label={isKo ? "My Plan 실행 영역" : "My Plan action areas"} className="space-y-1">
      {items.map((item) => <SidebarButton key={item.id} item={item} active={activeArea === item.id} onClick={() => onNavigate(item.id)} />)}
    </nav>

    <div className="my-4 border-t border-white/10" />
    <button type="button" onClick={() => onNavigate("notes")} className={cn("group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition", activeArea === "notes" ? "bg-white/12 text-white" : "text-slate-300 hover:bg-white/8 hover:text-white")}>
      <span className={cn("grid size-8 shrink-0 place-items-center rounded-lg", activeArea === "notes" ? "bg-white/15 text-cyan-200" : "bg-white/6 text-slate-400 group-hover:text-blue-200")}><NotebookPen className="size-4" /></span>
      <span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{isKo ? "노트" : "Notes"}</span><span className="mt-0.5 block truncate text-xs text-slate-400">{noteCount ? (isKo ? `최근 기록 ${noteCount}개` : `${noteCount} recent notes`) : (isKo ? "생각과 결정을 기록하세요" : "Keep decisions and thoughts")}</span></span><ChevronRight className="size-4 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-slate-300" />
    </button>

    <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4"><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.13em] text-blue-200"><Radar className="size-3.5" />{isKo ? "결정 신호" : "Decision signal"}</div><p className="mt-3 text-sm font-semibold leading-6 text-white">{healthAttentionCount ? (isKo ? `지금 먼저 확인할 계획 신호가 ${healthAttentionCount}개 있습니다.` : `You have ${healthAttentionCount} plan signal${healthAttentionCount === 1 ? "" : "s"} to review first.`) : (isKo ? "정보를 모으는 중이라면, 다음에는 선택을 좁혀보세요." : "Once you have the information, use it to narrow the decision.")}</p><button type="button" onClick={() => onNavigate("today")} className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-cyan-200 transition hover:text-white">{isKo ? "오늘의 다음 행동 보기" : "See next best move"}<ChevronRight className="size-3.5" /></button></div>
  </aside>
}

type SidebarItem = { id: Exclude<PlannerArea, "notes">; icon: LucideIcon; label: string; detail: string }

function SidebarButton({ item, active, onClick }: { item: SidebarItem; active: boolean; onClick: () => void }) {
  const Icon = item.icon
  return <button type="button" onClick={onClick} className={cn("group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition", active ? "bg-blue-500 text-white shadow-[0_10px_24px_rgba(0,0,0,.18)]" : "text-slate-300 hover:bg-white/8 hover:text-white")}><span className={cn("grid size-8 shrink-0 place-items-center rounded-lg", active ? "bg-white/15 text-cyan-100" : "bg-white/6 text-slate-400 group-hover:text-blue-200")}><Icon className="size-4" /></span><span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{item.label}</span><span className={cn("mt-0.5 block truncate text-xs", active ? "text-blue-100" : "text-slate-400")}>{item.detail}</span></span><ChevronRight className={cn("size-4 transition", active ? "text-blue-100" : "text-slate-500 group-hover:translate-x-0.5 group-hover:text-slate-300")} /></button>
}

function applicationDetail({ isKo, deadlinesSoon, overdueDeadlines }: { isKo: boolean; deadlinesSoon: number; overdueDeadlines: number }) {
  if (overdueDeadlines) return isKo ? `기한 지난 일정 ${overdueDeadlines}개` : `${overdueDeadlines} overdue ${overdueDeadlines === 1 ? "date" : "dates"}`
  if (deadlinesSoon) return isKo ? `30일 내 마감 ${deadlinesSoon}개` : `${deadlinesSoon} due in 30 days`
  return isKo ? "다음 마감일 추가" : "Add your next deadline"
}

function formatMoney(value: number, currency: string, locale: string) { try { return new Intl.NumberFormat(locale === "ko" ? "ko-KR" : "en-AU", { style: "currency", currency: currency || "AUD", maximumFractionDigits: 0 }).format(value) } catch { return `${currency || "AUD"} ${Math.round(value).toLocaleString()}` } }
