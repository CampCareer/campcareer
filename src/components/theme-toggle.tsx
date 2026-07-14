"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setPreference } = useTheme()
  const next = resolvedTheme === "dark" ? "light" : "dark"

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => setPreference(next)}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className={className ?? "text-slate-500 hover:bg-slate-100 hover:text-slate-900"}
    >
      {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}
