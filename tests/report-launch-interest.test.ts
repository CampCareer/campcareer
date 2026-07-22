import assert from "node:assert/strict"
import test from "node:test"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import {
  canResendReportLaunchConfirmation,
  parseReportLaunchInterest,
} from "../src/lib/report-launch-interest"

test("report launch interest accepts only consented, bounded Australia report choices", () => {
  const result = parseReportLaunchInterest({
    email: "  PERSON@example.com ",
    productIds: ["australia-study-roi-index-2026", "australia-study-roi-index-2026", "my-australia-roi-decision-report"],
    locale: "ko",
    sourcePath: "/ko/reports/australia",
    consent: true,
    website: "",
  })
  assert.equal(result.ok, true)
  if (!result.ok) return
  assert.equal(result.value.email, "person@example.com")
  assert.deepEqual(result.value.productIds, ["australia-study-roi-index-2026", "my-australia-roi-decision-report"])
  assert.equal(result.value.locale, "ko")
  assert.equal(result.value.sourcePath, "/ko/reports/australia")
})

test("report launch interest rejects absent consent, invalid products, and honeypot input", () => {
  assert.deepEqual(parseReportLaunchInterest({ email: "person@example.com", productIds: ["nope"], consent: true }), { ok: false, code: "missing_product" })
  assert.deepEqual(parseReportLaunchInterest({ email: "person@example.com", productIds: ["australia-expert-review"], consent: false }), { ok: false, code: "consent_required" })
  assert.deepEqual(parseReportLaunchInterest({ email: "person@example.com", productIds: ["australia-expert-review"], consent: true, website: "spam" }), { ok: false, code: "bot_detected" })
})

test("report launch confirmation resend is throttled for fifteen minutes", () => {
  const now = new Date("2026-07-22T09:00:00.000Z")
  assert.equal(canResendReportLaunchConfirmation(null, now), true)
  assert.equal(canResendReportLaunchConfirmation("2026-07-22T08:50:01.000Z", now), false)
  assert.equal(canResendReportLaunchConfirmation("2026-07-22T08:45:00.000Z", now), true)
})

test("report launch interest is private to the server and has automated expiry fields", () => {
  const migration = readFileSync(resolve(process.cwd(), "supabase/migrations/20260722081510_report_launch_interest.sql"), "utf8")
  assert.match(migration, /alter table public\.report_launch_interests enable row level security/i)
  assert.match(migration, /revoke all on table public\.report_launch_interests from anon, authenticated/i)
  assert.match(migration, /grant all privileges on table public\.report_launch_interests to service_role/i)
  assert.match(migration, /retention_expires_at timestamptz not null/i)
})
