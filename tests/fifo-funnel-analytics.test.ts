import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const analytics = readFileSync("src/lib/analytics.ts", "utf8")
const route = readFileSync("src/app/api/v1/discovery-events/route.ts", "utf8")
const funnel = readFileSync("src/components/analytics/fifo-funnel-analytics.tsx", "utf8")
const shell = readFileSync("src/components/layout/layout-shell.tsx", "utf8")

const FIFO_EVENTS = [
  "fifo_landing_view",
  "fifo_hub_opened",
  "fifo_hub_view",
  "fifo_path_opened",
  "fifo_path_view",
  "fifo_report_cta_clicked",
] as const

test("FIFO funnel uses one consent-gated event vocabulary on client and server", () => {
  for (const event of FIFO_EVENTS) {
    assert.match(analytics, new RegExp(`"${event}"`))
    assert.match(route, new RegExp(`"${event}"`))
  }
  assert.match(analytics, /cc_analytics_consent=granted/)
  assert.match(route, /request\.cookies\.get\("cc_analytics_consent"\)\?\.value !== "granted"/)
})

test("FIFO funnel persists only low-cardinality navigation context", () => {
  assert.match(route, /"path_slug"/)
  assert.match(route, /"target"/)
  assert.match(analytics, /path_slug\?: string/)
  assert.match(analytics, /target\?: "fifo_hub" \| "fifo_path" \| "fifo_report"/)
  assert.doesNotMatch(funnel, /email|full_name|free_text|query_string/i)
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
