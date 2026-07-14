"use client"

import { track as vercelTrack } from "@vercel/analytics"

type EventValue = string | number | boolean | undefined

const ALLOWED_EVENTS = new Set([
  "landing_view",
  "recommendation_start",
  "recommendation_result_view",
  "evidence_action",
  "plan_save_requested",
  "plan_save_confirmed",
  "plan_returned",
  "partner_exit",
  "affiliate_click",
  "affiliate_offer_view",
  "feedback_submitted",
  "comparison_view",
  "comparison_personalized",
  "lead_request_submitted",
  // Existing low-cardinality product events retained during the migration.
  "finder_search",
  "decision_start",
  "seo_landing_view",
  "visa_alert_submitted",
])

export function track(eventName: string, params?: Record<string, EventValue>) {
  if (
    typeof window === "undefined" ||
    !ALLOWED_EVENTS.has(eventName) ||
    !document.cookie.split("; ").some((item) => item === "cc_analytics_consent=granted")
  ) return
  const properties = Object.fromEntries(
    Object.entries(params ?? {})
      .filter(([key, value]) => /^[a-z][a-z0-9_]{0,31}$/.test(key) && value !== undefined)
      .slice(0, 8)
      .map(([key, value]) => [key, typeof value === "string" ? value.slice(0, 80) : value]),
  ) as Record<string, string | number | boolean>

  vercelTrack(eventName, properties)
}
