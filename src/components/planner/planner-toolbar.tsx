"use client"

import { ChevronLeft, ChevronRight, PanelLeftClose, PanelLeftOpen, Plus, X } from "lucide-react"
import { ToolNavActions } from "@/components/layout/tool-nav-actions"
import { cn } from "@/lib/utils"
import { plannerTabTitle, type PlannerTab } from "./planner-types"
import { PlannerSearch } from "./planner-search"
import type { PlannerArea } from "./planner-sidebar"

type PlannerToolbarProps = {
  tabs: PlannerTab[]
  activeTabId: string | null
  sidebarOpen: boolean
  canGoBack: boolean
  canGoForward: boolean
  onToggleSidebar: () => void
  onBack: () => void
  onForward: () => void
  onNewTab: () => void
  onSelectTab: (id: string) => void
  onCloseTab: (id: string) => void
  showControls?: boolean
  onAvatarClick?: () => void
}

export function PlannerToolbar({
  tabs,
  activeTabId,
  sidebarOpen,
  canGoBack,
  canGoForward,
  onToggleSidebar,
  onBack,
  onForward,
  onNewTab,
  onSelectTab,
  onCloseTab,
  showControls = true,
  onAvatarClick,
}: PlannerToolbarProps) {
  return (
    <header className="relative z-50 flex h-12 shrink-0 items-center gap-1 border-b border-slate-200 bg-white/80 px-2.5 backdrop-blur-sm">
      <div className={cn(!showControls && "sm:hidden")}><PlannerToolbarControls sidebarOpen={sidebarOpen} canGoBack={canGoBack} canGoForward={canGoForward} onToggleSidebar={onToggleSidebar} onBack={onBack} onForward={onForward} /></div>

      <div role="tablist" aria-label="My Plan pages" className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto px-1 no-scrollbar">
        {tabs.map((tab) => <div key={tab.id} className="group relative max-w-44 shrink-0">
          <button type="button" role="tab" aria-selected={tab.id === activeTabId} onClick={() => onSelectTab(tab.id)} className={cn("relative block w-full truncate py-1.5 pl-2.5 pr-8 text-left text-sm transition", tab.id === activeTabId ? "font-semibold text-slate-950" : "text-slate-500 hover:text-slate-700")}>
            {plannerTabTitle(tab)}
            {tab.id === activeTabId && <span aria-hidden className="absolute inset-x-2.5 bottom-0 h-0.5 rounded-full bg-blue-500" />}
          </button>
          <button type="button" onClick={() => onCloseTab(tab.id)} className="absolute right-1 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-md text-slate-400 opacity-0 transition hover:bg-slate-100 hover:text-slate-600 focus:opacity-100 group-hover:opacity-100" title={`Close ${plannerTabTitle(tab)}`} aria-label={`Close ${plannerTabTitle(tab)}`}><X className="size-3.5" /></button>
        </div>)}
        <button type="button" onClick={onNewTab} className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-600" title="New page" aria-label="New page"><Plus className="size-4" /></button>
      </div>

      <ToolNavActions minimal className="ml-1 shrink-0" onAvatarClick={onAvatarClick} />
    </header>
  )
}

export function PlannerToolbarControls({ sidebarOpen, canGoBack, canGoForward, onToggleSidebar, onBack, onForward, isKo, onNavigate, onOpenPath, dark = false }: { sidebarOpen: boolean; canGoBack: boolean; canGoForward: boolean; onToggleSidebar: () => void; onBack: () => void; onForward: () => void; isKo?: boolean; onNavigate?: (area: PlannerArea) => void; onOpenPath?: (path: string) => void; dark?: boolean }) {
  const buttonClass = dark ? "text-slate-300 hover:bg-white/10 hover:text-white" : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
  return <div className="flex shrink-0 items-center">
    <button type="button" onClick={onToggleSidebar} className={cn("hidden size-8 items-center justify-center rounded-md transition sm:inline-flex", buttonClass)} title={sidebarOpen ? "Close plan navigation" : "Open plan navigation"} aria-label={sidebarOpen ? "Close plan navigation" : "Open plan navigation"}>
      {sidebarOpen ? <PanelLeftClose className="size-4" /> : <PanelLeftOpen className="size-4" />}
    </button>
    <button type="button" onClick={onBack} disabled={!canGoBack} className={cn("inline-flex size-8 items-center justify-center rounded-md transition disabled:pointer-events-none disabled:opacity-30", buttonClass)} title="Go back" aria-label="Go back"><ChevronLeft className="size-4" /></button>
    <button type="button" onClick={onForward} disabled={!canGoForward} className={cn("inline-flex size-8 items-center justify-center rounded-md transition disabled:pointer-events-none disabled:opacity-30", buttonClass)} title="Go forward" aria-label="Go forward"><ChevronRight className="size-4" /></button>
    {sidebarOpen && isKo !== undefined && onNavigate && onOpenPath && <div className="ml-auto"><PlannerSearch isKo={isKo} onNavigate={onNavigate} onOpenPath={onOpenPath} /></div>}
  </div>
}
