"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export type SelectedCountry = {
  code: string
  name: string
  currency: string
}

type CountryContextValue = {
  selectedCountry: SelectedCountry | null
  setSelectedCountry: (country: SelectedCountry | null) => void
}

const STORAGE_KEY = "campcareer:selected-country"

const CountryContext = createContext<CountryContextValue | null>(null)

export function CountryProvider({ children }: { children: ReactNode }) {
  const [selectedCountry, setSelectedCountryState] = useState<SelectedCountry | null>(null)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) setSelectedCountryState(JSON.parse(raw) as SelectedCountry)
    } catch {
      // Ignore corrupted or blocked storage.
    }
  }, [])

  function setSelectedCountry(country: SelectedCountry | null) {
    setSelectedCountryState(country)
    try {
      if (country) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(country))
      } else {
        window.localStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      // Ignore storage errors (private mode etc.).
    }
  }

  return (
    <CountryContext.Provider value={{ selectedCountry, setSelectedCountry }}>
      {children}
    </CountryContext.Provider>
  )
}

export function useSelectedCountry(): CountryContextValue {
  const context = useContext(CountryContext)
  if (!context) throw new Error("useSelectedCountry must be used within a CountryProvider")
  return context
}
