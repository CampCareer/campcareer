"use client"

export type PlannerTab = {
  id: string
  title: string
  createdAt: string
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
    return Array.isArray(parsed) ? parsed : []
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
  return {
    id: crypto.randomUUID(),
    title: DEFAULT_TAB_TITLE,
    createdAt: new Date().toISOString(),
  }
}
