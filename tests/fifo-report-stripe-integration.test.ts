import assert from "node:assert/strict"
import { createHmac } from "node:crypto"
import { readFileSync } from "node:fs"
import test from "node:test"
import {
  classifyFifoStripeEvent,
  verifyStripeWebhookSignature,
} from "../src/lib/fifo/stripe-webhook"

const checkoutRoute = readFileSync("src/app/api/fifo/report/checkout/route.ts", "utf8")
const webhookRoute = readFileSync("src/app/api/fifo/report/webhook/route.ts", "utf8")
const stripeServer = readFileSync("src/lib/fifo/stripe-server.ts", "utf8")
const migration = readFileSync(
  "supabase/migrations/20260816172500_fifo_report_stripe_webhook_state.sql",
  "utf8",
)

function stripeSignature(payload: string, secret: string, timestamp: number) {
  const signature = createHmac("sha256", secret)
    .update(`${timestamp}.${payload}`, "utf8")
    .digest("hex")
  return `t=${timestamp},v1=${signature},v0=ignored`
}

test("Stripe webhook signature verification uses raw payload, v1 HMAC and five-minute recency", () => {
  const payload = JSON.stringify({ id: "evt_test", type: "checkout.session.completed" })
  const secret = "whsec_test_secret"
  const now = 1_800_000_000
  const header = stripeSignature(payload, secret, now - 30)

  assert.deepEqual(
    verifyStripeWebhookSignature({ payload, signatureHeader: header, secret, nowSeconds: now }),
    { ok: true, timestamp: now - 30 },
  )
  assert.deepEqual(
    verifyStripeWebhookSignature({ payload, signatureHeader: header, secret: "whsec_wrong", nowSeconds: now }),
    { ok: false, code: "invalid_signature" },
  )

  const staleTimestamp = now - 301
  const staleHeader = stripeSignature(payload, secret, staleTimestamp)
  assert.deepEqual(
    verifyStripeWebhookSignature({ payload, signatureHeader: staleHeader, secret, nowSeconds: now }),
    { ok: false, code: "timestamp_outside_tolerance" },
  )
})

test("paid FIFO Checkout Session maps only when product, amount and currency match", () => {
  const event = {
    id: "evt_fifo_paid",
    type: "checkout.session.completed",
    created: 1_800_000_000,
    data: {
      object: {
        id: "cs_test_fifo",
        amount_total: 2900,
        currency: "aud",
        payment_status: "paid",
        payment_intent: "pi_fifo",
        customer: "cus_fifo",
        metadata: {
          order_id: "8f9a0e3a-1d4e-4b40-a531-9b6da790e16a",
          product_id: "fifo-construction-fast-entry-guide-2026",
        },
      },
    },
  }

  const action = classifyFifoStripeEvent(event)
  assert.equal(action.kind, "apply")
  if (action.kind !== "apply") return
  assert.equal(action.paymentStatus, "paid")
  assert.equal(action.orderId, "8f9a0e3a-1d4e-4b40-a531-9b6da790e16a")
  assert.equal(action.checkoutSessionId, "cs_test_fifo")
  assert.equal(action.paymentIntentId, "pi_fifo")
  assert.equal(action.customerId, "cus_fifo")

  assert.deepEqual(
    classifyFifoStripeEvent({
      ...event,
      data: { object: { ...event.data.object, amount_total: 3900 } },
    }),
    { kind: "ignore", reason: "amount_mismatch" },
  )
})

test("failed and expired Stripe events never masquerade as paid", () => {
  const baseSession = {
    id: "cs_test_fifo",
    amount_total: 2900,
    currency: "aud",
    payment_status: "unpaid",
    metadata: {
      order_id: "8f9a0e3a-1d4e-4b40-a531-9b6da790e16a",
      product_id: "fifo-construction-fast-entry-guide-2026",
    },
  }

  const expired = classifyFifoStripeEvent({
    id: "evt_fifo_expired",
    type: "checkout.session.expired",
    created: 1_800_000_010,
    data: { object: baseSession },
  })
  assert.equal(expired.kind, "apply")
  if (expired.kind === "apply") assert.equal(expired.paymentStatus, "expired")

  const failed = classifyFifoStripeEvent({
    id: "evt_fifo_failed",
    type: "checkout.session.async_payment_failed",
    created: 1_800_000_011,
    data: { object: baseSession },
  })
  assert.equal(failed.kind, "apply")
  if (failed.kind === "apply") assert.equal(failed.paymentStatus, "failed")
})

test("checkout creation is server-only, uses one Stripe Price and an idempotency key", () => {
  assert.match(stripeServer, /STRIPE_SECRET_KEY/)
  assert.match(stripeServer, /STRIPE_FIFO_REPORT_PRICE_ID/)
  assert.match(stripeServer, /Idempotency-Key/)
  assert.match(stripeServer, /fifo-report-checkout:\$\{input\.checkoutAttemptId\}/)
  assert.match(stripeServer, /line_items\[0\]\[price\]/)
  assert.match(stripeServer, /metadata\[order_id\]/)
  assert.match(stripeServer, /payment_intent_data\[metadata\]\[order_id\]/)
  assert.doesNotMatch(stripeServer, /NEXT_PUBLIC_STRIPE/)

  assert.match(checkoutRoute, /checkout_attempt_conflict/)
  assert.match(checkoutRoute, /stripe_checkout_url/)
  assert.match(checkoutRoute, /reused: true/)
  assert.match(checkoutRoute, /\{CHECKOUT_SESSION_ID\}/)
})

test("webhook state transition is signature-gated, deduplicated and marks paid orders for delivery", () => {
  assert.match(webhookRoute, /const rawBody = await request\.text\(\)/)
  assert.match(webhookRoute, /verifyStripeWebhookSignature/)
  assert.match(webhookRoute, /STRIPE_WEBHOOK_SECRET/)
  assert.match(webhookRoute, /apply_fifo_report_stripe_event/)

  assert.match(migration, /create table if not exists public\.fifo_report_stripe_events/)
  assert.match(migration, /event_id text primary key/)
  assert.match(migration, /for update/)
  assert.match(migration, /stale_event/)
  assert.match(migration, /v_order\.payment_status not in \('refunded', 'disputed'\)/)
  assert.match(migration, /when v_new_payment_status = 'paid' and delivery_status = 'not_ready' then 'pending'/)
  assert.match(migration, /revoke all on function public\.apply_fifo_report_stripe_event/)
})
