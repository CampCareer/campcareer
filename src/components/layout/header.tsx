"use client"

import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

const pageTitles: Record<string, string> = {
  "/":          "Dashboard",
  "/roi":       "ROI Explorer",
  "/compare":   "Country Compare",
  "/checklist": "Checklist",
  "/timeline":  "Timeline",
}

export function Header() {
  const pathname = usePathname()
  const title = pageTitles[pathname] ?? "CampCareer"

  return (
    <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0">
      <h1 className="font-semibold text-slate-800 text-sm">{title}</h1>
      <Button
        variant="outline"
        size="sm"
        className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
      >
        Sign In
      </Button>
    </header>
  )
}
