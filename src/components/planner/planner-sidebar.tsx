"use client"

import { useEffect, useRef, useState } from "react"
import { FileText, Plus, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PlannerTab } from "./planner-types"
import { DEFAULT_TAB_TITLE } from "./planner-types"

type PlannerSidebarProps = {
  tabs: PlannerTab[]
  activeTabId: string | null
  onSelect: (id: string) => void
  onAdd: () => void
  onRename: (id: string, title: string) => void
  onDelete: (id: string) => void
}

export function PlannerSidebar({
  tabs,
  activeTabId,
  onSelect,
  onAdd,
  onRename,
  onDelete,
}: PlannerSidebarProps) {
  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-slate-200 bg-slate-50">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3">
        <p className="text-xs font-semibold uppercase tracking-[.14em] text-slate-400">
          Planners
        </p>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex size-6 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
          title="New planner"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Tab list */}
      <div className="flex-1 overflow-y-auto px-2 pb-3">
        {tabs.length === 0 && (
          <p className="px-2 py-4 text-xs text-slate-400">
            No planners yet. Click + to create one.
          </p>
        )}
        {tabs.map((tab) => (
          <SidebarItem
            key={tab.id}
            tab={tab}
            isActive={tab.id === activeTabId}
            onSelect={() => onSelect(tab.id)}
            onRename={(title) => onRename(tab.id, title)}
            onDelete={() => onDelete(tab.id)}
          />
        ))}
      </div>

      {/* Bottom add */}
      <div className="border-t border-slate-200 px-3 py-2.5">
        <button
          type="button"
          onClick={onAdd}
          className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-200 hover:text-slate-800"
        >
          <Plus className="h-3.5 w-3.5" />
          New planner
        </button>
      </div>
    </aside>
  )
}

function SidebarItem({
  tab,
  isActive,
  onSelect,
  onRename,
  onDelete,
}: {
  tab: PlannerTab
  isActive: boolean
  onSelect: () => void
  onRename: (title: string) => void
  onDelete: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(tab.title)
  const inputRef = useRef<HTMLInputElement>(null)
  const [showDelete, setShowDelete] = useState(false)

  useEffect(() => {
    setDraft(tab.title)
  }, [tab.title])

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [editing])

  function commit() {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== tab.title) onRename(trimmed)
    else setDraft(tab.title)
    setEditing(false)
  }

  return (
    <div
      className={cn(
        "group relative flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition",
        isActive
          ? "bg-white font-semibold text-slate-900 shadow-sm"
          : "text-slate-600 hover:bg-white/60 hover:text-slate-900"
      )}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
    >
      <button
        type="button"
        onClick={onSelect}
        className="flex min-w-0 flex-1 items-center gap-2"
      >
        <FileText className="h-4 w-4 shrink-0 text-slate-400" />
        {editing ? (
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") commit()
              if (e.key === "Escape") {
                setDraft(tab.title)
                setEditing(false)
              }
            }}
            className="min-w-0 flex-1 rounded border border-blue-300 bg-white px-1 py-0.5 text-sm outline-none focus:ring-1 focus:ring-blue-200"
            maxLength={80}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="truncate">{tab.title}</span>
        )}
      </button>

      {/* Actions on hover */}
      {showDelete && !editing && (
        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setEditing(true)
            }}
            className="inline-flex size-5 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            title="Rename"
          >
            <span className="text-[10px]">Edit</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="inline-flex size-5 items-center justify-center rounded text-slate-400 hover:bg-red-50 hover:text-red-600"
            title="Delete"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  )
}
