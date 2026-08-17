import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const analytics = readFileSync("src/lib/analytics.ts", "utf8")
const route = readFileSync("src/app/api/v1/discovery-events/route.ts", "utf8")
const funnel = readFileSync("src/components/analytics/fifo-funnel-analytics.tsx", "utf8")
const shell = readFileSync("src/components/layout/layout-shell.tsx", "utf8")
const checkout = readFileSync("src/app/fifo/report/fifo-report-email-capture.tsx", "utf8")
const returnAnalytics = readFileSync("src/app/fifo/report/success/fifo-report-return-analytics.tsx", "utf8")
const successPage = readFileSync("src/app/fifo/report/success/page.tsx", "utf8")

const FIFO_EVENTS = [
  "fifo_landing_view",
  "fifo_hub_opened",
  "fifo_hub_view",
  "fifo_path_opened",
  "fifo_path_view",
  "fifo_report_cta_clicked",
] as const

const FIFO_COMMERCE_EVENTS = [
  "fifo_report_view",
  "fifo_checkout_started",
  "fifo_checkout_redirected",
  "fifo_checkout_cancelled",
  "fifo_checkout_completed",
  "fifo_checkout_processing",
  "fifo_checkout_failed",
  "fifo_checkout_unverified",
] as const

test("FIFO funnel uses one consent-gated event vocabulary on client and server", () => {
  for (const event of [...FIFO_EVENTS, ...FIFO_COMMERCE_EVENTS]) {
    assert.match(analytics, new RegExp(`"${event}"`))
    assert.match(route, new RegExp(`"${event}"`))
  }
  assert.match(analytics, /cc_analytics_consent=granted/)
  assert.match(route, /request\.cookies\.get\("cc_analytics_consent"\)\?\.value !== "granted"/)
})

test("FIFO funnel persists only low-cardinality navigation and commerce context", () => {
  assert.match(route, /"path_slug"/)
  assert.match(route, /"target"/)
  assert.match(route, /"status"/)
  assert.match(route, /"reason"/)
  assert.match(analytics, /path_slug\?: string/)
  assert.match(analytics, /target\?: "fifo_hub" \| "fifo_path" \| "fifo_report"/)
  assert.match(analytics, /surface: "fifo_report" \| "fifo_report_success"/)
  assert.match(analytics, /status\?: "delivered" \| "paid" \| "processing" \| "problem" \| "unverified"/)
  assert.match(analytics, /reason\?: "checkout_response" \| "checkout_network" \| "return_state"/)

  const contextKeys = route.match(/const CONTEXT_KEYS = \[[\s\S]*?\] as const/)?.[0] ?? ""
  assert.ok(contextKeys)
  assert.doesNotMatch(contextKeys, /email|stripe|session|order|attempt|checkout_url|marketing/i)
  assert.doesNotMatch(funnel, /email|full_name|free_text|query_string/i)
})

test("report checkout emits commerce state without attaching purchase identity", () => {
  assert.match(checkout, /recordFifoCommerceEvent\("fifo_report_view"/)
  assert.match(checkout, /recordFifoCommerceEvent\("fifo_checkout_cancelled"/)
  assert.match(checkout, /recordFifoCommerceEvent\("fifo_checkout_started"/)
  assert.match(checkout, /recordFifoCommerceEvent\("fifo_checkout_redirected"/)
  assert.match(checkout, /reason: "checkout_response"/)
  assert.match(checkout, /reason: "checkout_network"/)

  const contextContract = analytics.match(/export type FifoCommerceAnalyticsContext = \{[\s\S]*?\n\}/)?.[0] ?? ""
  assert.ok(contextContract)
  assert.doesNotMatch(contextContract, /email|stripe|session|order|attempt|checkout_url|marketing/i)
})

test("success analytics derives completion only from the server-resolved return status", () => {
  assert.match(successPage, /<FifoReportReturnAnalytics status=\{status\} \/>/)
  assert.match(returnAnalytics, /status === "delivered" \|\| status === "paid"/)
  assert.match(returnAnalytics, /return "fifo_checkout_completed"/)
  assert.match(returnAnalytics, /return "fifo_checkout_processing"/)
  assert.match(returnAnalytics, /return "fifo_checkout_failed"/)
  assert.match(returnAnalytics, /return "fifo_checkout_unverified"/)
  assert.doesNotMatch(returnAnalytics, /session_id|stripe|email|order_id|checkoutAttemptId/)
})

test("public shell mounts the FIFO funnel observer and tracks funnel transitions", () => {
  assert.match(shell, /<FifoFunnelAnalytics \/>/)
  assert.match(funnel, /surfaceForPath/)
  assert.match(funnel, /fifo_report_cta_clicked/)
  assert.match(funnel, /destination === "\/fifo\/report"/)
  assert.match(funnel, /pathname === "\/fifo\/report"/)
  assert.match(funnel, /fifo_hub_opened/)
  assert.match(funnel, /fifo_path_opened/)
})
