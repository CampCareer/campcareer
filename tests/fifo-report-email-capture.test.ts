import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import {
  FIFO_REPORT_CHECKOUT_ATTEMPT_SESSION_KEY,
  FIFO_REPORT_CHECKOUT_SESSION_KEY,
  parseFifoReportCheckoutAttemptId,
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

test("checkout attempt IDs are UUID-only idempotency keys", () => {
  assert.equal(FIFO_REPORT_CHECKOUT_ATTEMPT_SESSION_KEY, "cc_fifo_report_checkout_attempt_v1")
  assert.equal(
    parseFifoReportCheckoutAttemptId("123e4567-e89b-42d3-a456-426614174000"),
    "123e4567-e89b-42d3-a456-426614174000",
  )
  assert.equal(parseFifoReportCheckoutAttemptId("not-a-uuid"), null)
  assert.equal(parseFifoReportCheckoutAttemptId(null), null)
})

test("purchase form keeps identity local until submit and then calls only the server checkout boundary", () => {
  assert.equal(FIFO_REPORT_CHECKOUT_SESSION_KEY, "cc_fifo_report_checkout_v1")
  assert.match(captureSource, /window\.sessionStorage\.setItem/)
  assert.match(captureSource, /window\.crypto\.randomUUID/)
  assert.match(captureSource, /fetch\("\/api\/fifo\/report\/checkout"/)
  assert.match(captureSource, /checkoutAttemptId/)
  assert.match(captureSource, /type="email"/)
  assert.match(captureSource, /autoComplete="email"/)
  assert.match(captureSource, /name="digitalDeliveryConsent"/)
  assert.match(captureSource, /digitalDeliveryConsent: true/)
  assert.match(captureSource, /Terms of Service/)
  assert.match(captureSource, /Privacy Policy/)
  assert.match(captureSource, /name="marketingConsent"/)
  assert.match(captureSource, /checkout.*cancelled/)
  assert.doesNotMatch(captureSource, /sendEmail|supabaseAdmin|STRIPE_SECRET_KEY|checkout\.stripe\.com/)
  assert.match(pageSource, /<FifoReportEmailCapture \/>/)
})
