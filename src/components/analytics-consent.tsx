"use client"

import { useEffect, useState } from "react"

const CONSENT_COOKIE = "cc_analytics_consent"

function writeConsent(value: "granted" | "denied") {
  document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=${60 * 60 * 24 * 180}; samesite=lax`
  window.dispatchEvent(new Event("campcareer-consent"))
}

export function AnalyticsConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(!document.cookie.split("; ").some((item) => item.startsWith(`${CONSENT_COOKIE}=`)))
  }, [])

  if (!visible) return null

  return (
    <aside className="fixed inset-x-3 bottom-3 z-[1100] mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-4 shadow-xl sm:bottom-5" aria-label="Privacy choices">
      <p className="text-sm font-semibold text-slate-900">Help us improve CampCareer</p>
      <p className="mt-1 text-xs leading-5 text-slate-600">Optional product measurement helps us understand whether search, comparison, and partner links work. It never includes your email or free-text answers.</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={() => { writeConsent("denied"); setVisible(false) }} className="min-h-9 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-50">Essential only</button>
        <button type="button" onClick={() => { writeConsent("granted"); setVisible(false) }} className="min-h-9 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white hover:bg-blue-700">Allow measurement</button>
      </div>
    </aside>
  )
}
