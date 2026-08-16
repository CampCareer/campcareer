import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import {
  FIFO_REPORT_CHECKOUT_SESSION_KEY,
  parseFifoReportCheckoutIdentity,
} from "../src/lib/fifo/report-checkout-email"

const captureSource = readFileSync("src/app/fifo/report/fifo-report-email-capture.tsx", "utf8")
const pageSource = readFileSync("src/app/fifo/report/page.tsx", "utf8")

test("FIFO report purchase email normalizes independently from marketing consent", () => {
  const parsed = parseFifoReportCheckoutIdentity({
    email: "  Buyer@Example.COM ",
    marketingConsent: false,
  })

  assert.equal(parsed.ok, true)
  if (!parsed.ok) return
  assert.deepEqual(parsed.value, {
    email: "buyer@example.com",
    marketingConsent: false,
  })
})

test("marketing consent is optional and opt-in only", () => {
  const omitted = parseFifoReportCheckoutIdentity({ email: "buyer@example.com" })
  assert.equal(omitted.ok, true)
  if (omitted.ok) assert.equal(omitted.value.marketingConsent, false)

  const optedIn = parseFifoReportCheckoutIdentity({
    email: "buyer@example.com",
    marketingConsent: true,
  })
  assert.equal(optedIn.ok, true)
  if (optedIn.ok) assert.equal(optedIn.value.marketingConsent, true)
})

test("invalid purchase emails are rejected before checkout", () => {
  assert.deepEqual(parseFifoReportCheckoutIdentity({ email: "not-an-email" }), {
    ok: false,
    code: "invalid_email",
  })
  assert.deepEqual(parseFifoReportCheckoutIdentity(null), {
    ok: false,
    code: "invalid_request",
  })
})

test("email capture remains session-only until the payment flow is wired", () => {
  assert.equal(FIFO_REPORT_CHECKOUT_SESSION_KEY, "cc_fifo_report_checkout_v1")
  assert.match(captureSource, /window\.sessionStorage\.setItem/)
  assert.match(captureSource, /type="email"/)
  assert.match(captureSource, /autoComplete="email"/)
  assert.match(captureSource, /name="marketingConsent"/)
  assert.doesNotMatch(captureSource, /fetch\(|sendEmail|supabaseAdmin/)
  assert.match(pageSource, /<FifoReportEmailCapture \/>/)
})
