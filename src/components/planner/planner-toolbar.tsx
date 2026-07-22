"use client"

import { ChevronLeft, ChevronRight, PanelLeftClose, PanelLeftOpen, Plus } from "lucide-react"
import { ToolNavActions } from "@/components/layout/tool-nav-actions"
import { cn } from "@/lib/utils"
import { plannerTabTitle, type PlannerTab } from "./planner-types"

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
}: PlannerToolbarProps) {
  return (
    <header className="flex h-12 shrink-0 items-center gap-1 border-b border-slate-200/80 bg-white/95 px-2.5 backdrop-blur-sm">
      <div className="flex shrink-0 items-center">
        <button type="button" onClick={onToggleSidebar} className="hidden size-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 sm:inline-flex" title={sidebarOpen ? "Close plan navigation" : "Open plan navigation"} aria-label={sidebarOpen ? "Close plan navigation" : "Open plan navigation"}>
          {sidebarOpen ? <PanelLeftClose className="size-4" /> : <PanelLeftOpen className="size-4" />}
        </button>
        <button type="button" onClick={onBack} disabled={!canGoBack} className="inline-flex size-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:pointer-events-none disabled:opacity-30" title="Go back"><ChevronLeft className="size-4" /></button>
        <button type="button" onClick={onForward} disabled={!canGoForward} className="inline-flex size-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:pointer-events-none disabled:opacity-30" title="Go forward"><ChevronRight className="size-4" /></button>
      </div>

      <div role="tablist" aria-label="My Plan pages" className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto px-1 no-scrollbar">
        {tabs.map((tab) => <button key={tab.id} type="button" role="tab" aria-selected={tab.id === activeTabId} onClick={() => onSelectTab(tab.id)} className={cn("relative max-w-44 shrink-0 truncate px-2.5 py-1.5 text-sm transition", tab.id === activeTabId ? "font-semibold text-slate-900" : "text-slate-500 hover:text-slate-800")}>
          {plannerTabTitle(tab)}
          {tab.id === activeTabId && <span aria-hidden className="absolute inset-x-2.5 bottom-0 h-0.5 rounded-full bg-blue-600" />}
        </button>)}
        <button type="button" onClick={onNewTab} className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-800" title="New page" aria-label="New page"><Plus className="size-4" /></button>
      </div>

      <ToolNavActions minimal className="ml-1 shrink-0" />
    </header>
  )
}
