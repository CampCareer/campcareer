"use client"

import { track as vercelTrack } from "@vercel/analytics"
import { hasMeasurementConsent } from "./analytics-consent-shared"

type EventValue = string | number | boolean | undefined

const ALLOWED_EVENTS = new Set([
  "route_search_started",
  "route_search_submitted",
  "route_result_viewed",
  "route_external_link_clicked",
  "route_request_submitted",
  "map_opened_from_route",
  "guide_interest_submitted",
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
  "report_launch_view",
  "report_launch_interest_started",
  "report_launch_interest_submitted",
  "report_workspace_open",
  "career_landing_view",
  "career_search_started",
  "career_search_submitted",
  "career_result_viewed",
  "career_result_unavailable",
  "career_evidence_opened",
  "career_result_saved",
  "career_personalisation_started",
  "career_personalisation_completed",
])

function clientHasMeasurementConsent() {
  return typeof window !== "undefined" && hasMeasurementConsent(document.cookie)
}

export function track(eventName: string, params?: Record<string, EventValue>) {
  if (!clientHasMeasurementConsent() || !ALLOWED_EVENTS.has(eventName)) return
  const properties = Object.fromEntries(
    Object.entries(params ?? {})
      .filter(([key, value]) => /^[a-z][a-z0-9_]{0,31}$/.test(key) && value !== undefined)
      .slice(0, 8)
      .map(([key, value]) => [key, typeof value === "string" ? value.slice(0, 80) : value]),
  ) as Record<string, string | number | boolean>

  vercelTrack(eventName, properties)
}

export function recordDiscoveryEvent(
  eventName: "recommendation_start" | "recommendation_result_view",
  context: { surface: "landing" | "country_results"; country: string; major: string; goal: string },
) {
  track(eventName, context)
  if (!clientHasMeasurementConsent()) return

  void fetch("/api/v1/discovery-events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventName, context }),
    keepalive: true,
  }).catch(() => undefined)
}

export function recordReportEvent(
  eventName: "report_launch_view" | "report_workspace_open",
  context: { surface: "report_launch" | "report_workspace"; country: "AU"; locale: "en" | "ko" },
) {
  track(eventName, context)
  if (!clientHasMeasurementConsent()) return

  void fetch("/api/v1/discovery-events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventName, context }),
    keepalive: true,
  }).catch(() => undefined)
}

export type RouteAnalyticsEvent =
  | "route_search_started"
  | "route_search_submitted"
  | "route_result_viewed"
  | "route_external_link_clicked"
  | "route_request_submitted"
  | "map_opened_from_route"
  | "guide_interest_submitted"

/**
 * Route events deliberately accept only a small, non-identifying context.
 * Never pass an email address, free-text field, or a full URL query here.
 */
export function recordRouteEvent(
  eventName: RouteAnalyticsEvent,
  context: {
    route_id?: string
    locale?: "en" | "ko"
    link_type?: "visa" | "course" | "job" | "employer" | "map"
    surface?: "landing" | "route_result" | "maps"
  },
) {
  track(eventName, context)
  if (!clientHasMeasurementConsent()) return

  void fetch("/api/v1/discovery-events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventName, context }),
    keepalive: true,
  }).catch(() => undefined)
}

export type CareerFunnelEvent =
  | "career_landing_view"
  | "career_search_started"
  | "career_search_submitted"
  | "career_result_viewed"
  | "career_result_unavailable"
  | "career_evidence_opened"
  | "career_result_saved"
  | "career_personalisation_started"
  | "career_personalisation_completed"

/**
 * The new landing-to-decision funnel deliberately records only low-cardinality
 * route context. It never includes citizenship, free text, email, or a full URL.
 */
export function recordCareerFunnelEvent(
  eventName: CareerFunnelEvent,
  context: {
    surface: "landing" | "career_result" | "onboarding"
    locale: "en" | "ko"
    country?: string
    career?: string
    result_status?: "released" | "under_review" | "comparison_unavailable" | "unavailable"
    link_type?: "official_resource"
  },
) {
  track(eventName, context)
  if (!clientHasMeasurementConsent()) return

  void fetch("/api/v1/discovery-events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventName, context }),
    keepalive: true,
  }).catch(() => undefined)
}
