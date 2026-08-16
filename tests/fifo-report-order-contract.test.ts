import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import {
  FIFO_REPORT_DELIVERY_STATUSES,
  FIFO_REPORT_MARKETING_CONSENT_VERSION,
  FIFO_REPORT_ORDERS_TABLE,
  FIFO_REPORT_PAYMENT_STATUSES,
  FIFO_REPORT_STORAGE_BUCKET,
  FIFO_REPORT_STORAGE_OBJECT_PATH,
  buildFifoReportOrderDraft,
  parseFifoReportCheckoutAttempt,
} from "../src/lib/fifo/report-order"

const migration = readFileSync(
  "supabase/migrations/20260816161500_fifo_report_order_persistence.sql",
  "utf8",
)

test("FIFO report order draft is canonical and marketing stays optional", () => {
  const draft = buildFifoReportOrderDraft({
    checkoutAttemptId: "8F9A0E3A-1D4E-4B40-A531-9B6DA790E16A",
    email: "  Buyer@Example.COM ",
    marketingConsent: false,
  })

  assert.equal(draft.ok, true)
  if (!draft.ok) return
  assert.deepEqual(draft.value, {
    checkoutAttemptId: "8f9a0e3a-1d4e-4b40-a531-9b6da790e16a",
    productId: "fifo-construction-fast-entry-guide-2026",
    productEdition: "1.0",
    email: "buyer@example.com",
    amountAudCents: 2900,
    currency: "AUD",
    paymentProvider: "stripe",
    paymentStatus: "pending",
    deliveryStatus: "not_ready",
    marketingOptInRequested: false,
    marketingConsentVersion: null,
  })
})

test("optional marketing preference is represented as a request, not a purchase requirement", () => {
  const draft = buildFifoReportOrderDraft({
    checkoutAttemptId: "2a824168-4188-46db-b4eb-c6a31cbcd44d",
    email: "buyer@example.com",
    marketingConsent: true,
  })

  assert.equal(draft.ok, true)
  if (!draft.ok) return
  assert.equal(draft.value.marketingOptInRequested, true)
  assert.equal(draft.value.marketingConsentVersion, FIFO_REPORT_MARKETING_CONSENT_VERSION)
})

test("checkout attempts reject invalid identifiers and invalid email before persistence", () => {
  assert.deepEqual(
    parseFifoReportCheckoutAttempt({ checkoutAttemptId: "not-a-uuid", email: "buyer@example.com" }),
    { ok: false, code: "invalid_checkout_attempt" },
  )
  assert.deepEqual(
    parseFifoReportCheckoutAttempt({
      checkoutAttemptId: "2a824168-4188-46db-b4eb-c6a31cbcd44d",
      email: "not-an-email",
    }),
    { ok: false, code: "invalid_email" },
  )
})

test("order status vocabulary is explicit for webhook and fulfilment transitions", () => {
  assert.deepEqual(FIFO_REPORT_PAYMENT_STATUSES, [
    "pending",
    "paid",
    "failed",
    "expired",
    "refunded",
    "disputed",
  ])
  assert.deepEqual(FIFO_REPORT_DELIVERY_STATUSES, [
    "not_ready",
    "pending",
    "delivered",
    "failed",
  ])
})

test("migration makes checkout and Stripe identifiers idempotency boundaries", () => {
  assert.equal(FIFO_REPORT_ORDERS_TABLE, "fifo_report_orders")
  assert.match(migration, /create table public\.fifo_report_orders/)
  assert.match(migration, /checkout_attempt_id uuid not null/)
  assert.match(migration, /create unique index fifo_report_orders_checkout_attempt_uidx/)
  assert.match(migration, /create unique index fifo_report_orders_stripe_session_uidx/)
  assert.match(migration, /create unique index fifo_report_orders_payment_intent_uidx/)
  assert.match(migration, /payment_status in \('pending', 'paid', 'failed', 'expired', 'refunded', 'disputed'\)/)
  assert.match(migration, /delivery_status in \('not_ready', 'pending', 'delivered', 'failed'\)/)
})

test("purchase records are server managed and the master PDF bucket is private", () => {
  assert.equal(FIFO_REPORT_STORAGE_BUCKET, "fifo-report-products")
  assert.equal(
    FIFO_REPORT_STORAGE_OBJECT_PATH,
    "fifo-construction-fast-entry-guide-2026/edition-1.0/CampCareer_FIFO_Construction_Fast_Entry_Guide_2026.pdf",
  )
  assert.match(migration, /alter table public\.fifo_report_orders enable row level security/)
  assert.match(migration, /revoke all privileges on table public\.fifo_report_orders from anon, authenticated/)
  assert.match(migration, /to service_role/)
  assert.match(migration, /'fifo-report-products'[\s\S]*false[\s\S]*20971520[\s\S]*application\/pdf/)
  assert.match(migration, /bucket_id = 'fifo-report-products'/)
})

test("order row documents that marketing preference is not a mailing-list subscription", () => {
  assert.match(migration, /This is not itself a mailing-list subscription/)
  assert.match(migration, /marketing_opt_in_requested = false[\s\S]*marketing_opt_in_requested_at is null/)
  assert.match(migration, /marketing_opt_in_requested = true[\s\S]*marketing_opt_in_requested_at is not null/)
})
