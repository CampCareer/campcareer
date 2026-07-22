"use client"

export type PlannerTab = {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
  trashedAt: string | null
}

export const DEFAULT_TAB_TITLE = "Untitled"
export const PLANNER_TABS_KEY = "campcareer-planner-tabs"
export const PLANNER_ACTIVE_TAB_KEY = "campcareer-planner-active-tab"

export function loadTabs(): PlannerTab[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(PLANNER_TABS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.flatMap((item): PlannerTab[] => {
      if (!item || typeof item.id !== "string") return []
      const createdAt = typeof item.createdAt === "string" ? item.createdAt : new Date().toISOString()
      return [{
        id: item.id,
        title: typeof item.title === "string" ? item.title.slice(0, 160) : "",
        content: typeof item.content === "string" ? item.content.slice(0, 12000) : "",
        createdAt,
        updatedAt: typeof item.updatedAt === "string" ? item.updatedAt : createdAt,
        trashedAt: typeof item.trashedAt === "string" ? item.trashedAt : null,
      }]
    })
  } catch {
    return []
  }
}

export function saveTabs(tabs: PlannerTab[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(PLANNER_TABS_KEY, JSON.stringify(tabs))
}

export function loadActiveTabId(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(PLANNER_ACTIVE_TAB_KEY)
}

export function saveActiveTabId(id: string) {
  if (typeof window === "undefined") return
  localStorage.setItem(PLANNER_ACTIVE_TAB_KEY, id)
}

export function createTab(): PlannerTab {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    title: "",
    content: "",
    createdAt: now,
    updatedAt: now,
    trashedAt: null,
  }
}

export function plannerTabTitle(tab: Pick<PlannerTab, "title">) {
  return tab.title.trim() || DEFAULT_TAB_TITLE
}
