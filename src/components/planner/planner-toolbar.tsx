"use client"

import { useEffect, useRef, useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
} from "lucide-react"
import { cn } from "@/lib/utils"

type PlannerToolbarProps = {
  title: string
  sidebarOpen: boolean
  canGoBack: boolean
  canGoForward: boolean
  onToggleSidebar: () => void
  onBack: () => void
  onForward: () => void
  onNewTab: () => void
  onRename: (title: string) => void
}

export function PlannerToolbar({
  title,
  sidebarOpen,
  canGoBack,
  canGoForward,
  onToggleSidebar,
  onBack,
  onForward,
  onNewTab,
  onRename,
}: PlannerToolbarProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setDraft(title)
  }, [title])

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  function commit() {
    const trimmed = draft.trim()
    if (trimmed) onRename(trimmed)
    else setDraft(title)
    setEditing(false)
  }

  return (
    <header className="flex h-11 shrink-0 items-center gap-1 border-b border-slate-200 bg-white px-2">
      {/* Sidebar toggle */}
      <button
        type="button"
        onClick={onToggleSidebar}
        className="inline-flex size-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
        title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {sidebarOpen ? (
          <PanelLeftClose className="h-4 w-4" />
        ) : (
          <PanelLeftOpen className="h-4 w-4" />
        )}
      </button>

      {/* Back / Forward */}
      <div className="flex items-center">
        <button
          type="button"
          onClick={onBack}
          disabled={!canGoBack}
          className="inline-flex size-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:pointer-events-none disabled:opacity-30"
          title="Go back"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={onForward}
          disabled={!canGoForward}
          className="inline-flex size-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 disabled:pointer-events-none disabled:opacity-30"
          title="Go forward"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Divider */}
      <div className="mx-1 h-5 w-px bg-slate-200" />

      {/* Editable title */}
      {editing ? (
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit()
            if (e.key === "Escape") {
              setDraft(title)
              setEditing(false)
            }
          }}
          className="h-7 flex-1 rounded-md border border-blue-300 bg-white px-2 text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-blue-100"
          maxLength={80}
        />
      ) : (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="max-w-[200px] truncate rounded-md px-2 py-1 text-left text-sm font-semibold text-slate-900 transition hover:bg-slate-100 sm:max-w-[320px]"
          title="Click to rename"
        >
          {title}
        </button>
      )}

      {/* Right side: New tab */}
      <div className="ml-auto flex items-center gap-1">
        <button
          type="button"
          onClick={onNewTab}
          className="inline-flex h-7 items-center gap-1.5 rounded-lg bg-slate-950 px-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">New</span>
        </button>
      </div>
    </header>
  )
}
