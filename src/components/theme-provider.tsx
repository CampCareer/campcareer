"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"

export type ThemePreference = "light" | "dark" | "system"
type ResolvedTheme = "light" | "dark"

type ThemeContextValue = {
  preference: ThemePreference
  resolvedTheme: ResolvedTheme
  setPreference: (preference: ThemePreference) => void
}

const STORAGE_KEY = "campcareer-theme"

const ThemeContext = createContext<ThemeContextValue>({
  preference: "system",
  resolvedTheme: "light",
  setPreference: () => {},
})

function resolveTheme(preference: ThemePreference): ResolvedTheme {
  if (preference === "dark") return "dark"
  if (preference === "light") return "light"
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function applyTheme(theme: ResolvedTheme) {
  document.documentElement.classList.toggle("dark", theme === "dark")
  document.documentElement.style.colorScheme = theme
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>("system")
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light")

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    const next: ThemePreference = stored === "light" || stored === "dark" || stored === "system"
      ? stored
      : "system"
    const resolved = resolveTheme(next)
    setPreferenceState(next)
    setResolvedTheme(resolved)
    applyTheme(resolved)

  }, [])

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => {
      if (preference !== "system") return
      const updated = resolveTheme("system")
      setResolvedTheme(updated)
      applyTheme(updated)
    }
    media.addEventListener("change", handleChange)
    return () => media.removeEventListener("change", handleChange)
  }, [preference])

  const setPreference = useCallback((next: ThemePreference) => {
    const resolved = resolveTheme(next)
    window.localStorage.setItem(STORAGE_KEY, next)
    setPreferenceState(next)
    setResolvedTheme(resolved)
    applyTheme(resolved)
  }, [])

  return (
    <ThemeContext.Provider value={{ preference, resolvedTheme, setPreference }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
