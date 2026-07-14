"use client"

import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { useEffect, useState } from "react"

const CONSENT_COOKIE = "cc_analytics_consent=granted"

function hasMeasurementConsent() {
  return document.cookie.split("; ").some((item) => item === CONSENT_COOKIE)
}

/**
 * Do not initialise third-party measurement until the visitor has made an
 * affirmative choice. Custom events use the same cookie check in `track()`.
 */
export function ConsentGatedInsights() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const refresh = () => setEnabled(hasMeasurementConsent())
    refresh()
    window.addEventListener("campcareer-consent", refresh)
    return () => window.removeEventListener("campcareer-consent", refresh)
  }, [])

  if (!enabled) return null
  return <><Analytics /><SpeedInsights /></>
}
