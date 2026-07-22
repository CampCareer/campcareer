"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown, Copy, FileText, MoreHorizontal, Pencil, Plus, RotateCcw, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { plannerTabTitle, type PlannerTab } from "./planner-types"

type PlannerSidebarProps = {
  tabs: PlannerTab[]
  activeTabId: string | null
  onSelect: (id: string) => void
  onAdd: () => void
  onRename: (id: string, title: string) => void
  onDuplicate: (id: string) => void
  onMoveToTrash: (id: string) => void
  onRestore: (id: string) => void
  onDeletePermanently: (id: string) => void
}

export function PlannerSidebar({
  tabs,
  activeTabId,
  onSelect,
  onAdd,
  onRename,
  onDuplicate,
  onMoveToTrash,
  onRestore,
  onDeletePermanently,
}: PlannerSidebarProps) {
  const [trashOpen, setTrashOpen] = useState(false)
  const activeTabs = tabs.filter((tab) => !tab.trashedAt)
  const trashedTabs = tabs.filter((tab) => tab.trashedAt)

  return (
    <aside className="hidden h-full w-60 shrink-0 flex-col bg-slate-50/55 px-2.5 py-3 sm:flex">
      <div className="flex items-center justify-between px-2 py-1.5">
        <p className="text-xs font-semibold uppercase tracking-[.14em] text-slate-400">My pages</p>
        <button type="button" onClick={onAdd} className="inline-flex size-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-200/70 hover:text-slate-700" title="New page" aria-label="New page">
          <Plus className="size-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pt-2">
        {activeTabs.length === 0 ? (
          <button type="button" onClick={onAdd} className="w-full px-2 py-3 text-left text-xs leading-5 text-slate-400 transition hover:text-slate-700">
            Start with a new page.
          </button>
        ) : activeTabs.map((tab) => (
          <SidebarItem
            key={tab.id}
            tab={tab}
            isActive={tab.id === activeTabId}
            onSelect={() => onSelect(tab.id)}
            onRename={(title) => onRename(tab.id, title)}
            onDuplicate={() => onDuplicate(tab.id)}
            onMoveToTrash={() => onMoveToTrash(tab.id)}
          />
        ))}
      </div>

      <div className="mt-3 border-t border-slate-200/70 pt-2">
        <button type="button" onClick={() => setTrashOpen((open) => !open)} className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium text-slate-400 transition hover:bg-slate-200/60 hover:text-slate-700">
          <ChevronDown className={cn("size-3.5 transition-transform", trashOpen && "rotate-180")} />
          <Trash2 className="size-3.5" />
          <span className="flex-1 text-left">Trash</span>
          {trashedTabs.length > 0 && <span className="text-[11px]">{trashedTabs.length}</span>}
        </button>
        {trashOpen && (
          <div className="mt-1 space-y-0.5">
            {trashedTabs.length === 0 ? <p className="px-2 py-2 text-xs text-slate-400">No pages in Trash.</p> : trashedTabs.map((tab) => (
              <div key={tab.id} className="group flex items-center gap-1 px-2 py-1.5 text-xs text-slate-500">
                <FileText className="size-3.5 shrink-0 text-slate-400" />
                <span className="min-w-0 flex-1 truncate">{plannerTabTitle(tab)}</span>
                <button type="button" onClick={() => onRestore(tab.id)} className="opacity-0 transition group-hover:opacity-100 hover:text-blue-700" title="Restore" aria-label={`Restore ${plannerTabTitle(tab)}`}><RotateCcw className="size-3.5" /></button>
                <button type="button" onClick={() => onDeletePermanently(tab.id)} className="opacity-0 transition group-hover:opacity-100 hover:text-red-600" title="Delete permanently" aria-label={`Delete ${plannerTabTitle(tab)} permanently`}><Trash2 className="size-3.5" /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}

function SidebarItem({
  tab,
  isActive,
  onSelect,
  onRename,
  onDuplicate,
  onMoveToTrash,
}: {
  tab: PlannerTab
  isActive: boolean
  onSelect: () => void
  onRename: (title: string) => void
  onDuplicate: () => void
  onMoveToTrash: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [draft, setDraft] = useState(tab.title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => setDraft(tab.title), [tab.title])
  useEffect(() => { if (editing) { inputRef.current?.focus(); inputRef.current?.select() } }, [editing])

  function commit() {
    onRename(draft.trim())
    setEditing(false)
  }

  return (
    <div className={cn("group relative flex min-w-0 items-center gap-1 rounded-md px-2 py-1.5 text-sm transition", isActive ? "bg-white/90 text-slate-900 shadow-[0_1px_2px_rgba(15,23,42,.05)]" : "text-slate-600 hover:bg-white/60 hover:text-slate-900")}>
      <button type="button" onClick={onSelect} className="flex min-w-0 flex-1 items-center gap-2 text-left">
        <FileText className="size-4 shrink-0 text-slate-400" />
        {editing ? (
          <input ref={inputRef} value={draft} onChange={(event) => setDraft(event.target.value)} onBlur={commit} onKeyDown={(event) => { if (event.key === "Enter") commit(); if (event.key === "Escape") { setDraft(tab.title); setEditing(false) } }} onClick={(event) => event.stopPropagation()} maxLength={160} className="min-w-0 flex-1 bg-transparent text-sm outline-none" />
        ) : <span className="truncate">{plannerTabTitle(tab)}</span>}
      </button>
      {!editing && <div className="relative shrink-0"><button type="button" onClick={(event) => { event.stopPropagation(); setMenuOpen((open) => !open) }} className={cn("grid size-6 place-items-center rounded text-slate-400 transition hover:bg-slate-100 hover:text-slate-700", menuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100")} aria-label={`Page options for ${plannerTabTitle(tab)}`} aria-expanded={menuOpen}><MoreHorizontal className="size-4" /></button>{menuOpen && <div role="menu" className="absolute right-0 top-full z-30 mt-1 w-44 rounded-xl border border-slate-200 bg-white p-1.5 text-sm shadow-[0_14px_32px_rgba(15,23,42,.15)]"><button type="button" role="menuitem" onClick={() => { setMenuOpen(false); setEditing(true) }} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-slate-700 hover:bg-slate-50"><Pencil className="size-3.5" />Rename</button><button type="button" role="menuitem" onClick={() => { setMenuOpen(false); onDuplicate() }} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-slate-700 hover:bg-slate-50"><Copy className="size-3.5" />Duplicate</button><div className="my-1 border-t border-slate-100" /><button type="button" role="menuitem" onClick={() => { setMenuOpen(false); onMoveToTrash() }} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-red-600 hover:bg-red-50"><Trash2 className="size-3.5" />Move to Trash</button></div>}</div>}
    </div>
  )
}
