import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const delivery = readFileSync("src/lib/fifo/report-delivery.ts", "utf8")
const webhook = readFileSync("src/app/api/fifo/report/webhook/route.ts", "utf8")
const emailSend = readFileSync("src/lib/email/send.ts", "utf8")
const migration = readFileSync(
  "supabase/migrations/20260816205000_fifo_report_transactional_delivery.sql",
  "utf8",
)

test("paid FIFO delivery uses a private signed URL and stable idempotent transactional email", () => {
  assert.match(delivery, /FIFO_REPORT_STORAGE_BUCKET/)
  assert.match(delivery, /FIFO_REPORT_STORAGE_OBJECT_PATH/)
  assert.match(delivery, /createSignedUrl/)
  assert.match(delivery, /SIGNED_URL_TTL_SECONDS = 24 \* 60 \* 60/)
  assert.match(delivery, /reusableSignedUrl/)
  assert.match(delivery, /idempotencyKey: `\$\{DELIVERY_IDEMPOTENCY_PREFIX\}\/\$\{order\.id\}`/)
  assert.match(delivery, /This email is part of your purchase and is separate from any optional marketing preference/)
  assert.match(emailSend, /idempotencyKey\?: string/)
  assert.match(emailSend, /\{ idempotencyKey: msg\.idempotencyKey \}/)
})

test("delivery database functions block duplicate sends and keep terminal delivery state idempotent", () => {
  assert.match(migration, /create or replace function public\.claim_fifo_report_delivery/)
  assert.match(migration, /for update/)
  assert.match(migration, /delivery_status = 'delivered' or v_order\.delivered_at is not null/)
  assert.match(migration, /'already_delivered'/)
  assert.match(migration, /delivery_status = 'pending'[\s\S]*?'recently_attempted'/)
  assert.match(migration, /delivery_attempt_count = delivery_attempt_count \+ 1/)
  assert.match(migration, /create or replace function public\.complete_fifo_report_delivery/)
  assert.match(migration, /'already_completed', true/)
  assert.match(migration, /delivered_at = coalesce\(delivered_at, now\(\)\)/)
  assert.match(migration, /create or replace function public\.fail_fifo_report_delivery/)
  assert.match(migration, /delivery_status = 'delivered' or v_order\.delivered_at is not null[\s\S]*?'already_delivered'/)
  assert.match(migration, /to service_role/)
})

test("duplicate verified paid webhooks reconcile delivery but transient attempts request Stripe retry", () => {
  assert.match(webhook, /action\.paymentStatus === "paid" && \(applied \|\| duplicate\)/)
  assert.match(webhook, /reconciling duplicate paid event delivery/)
  assert.match(webhook, /delivery\.reason === "recently_attempted"/)
  assert.match(webhook, /deliveryPending: true/)
  assert.match(webhook, /503/)
})

test("delivery observability uses fixed low-cardinality codes instead of provider error text", () => {
  for (const code of [
    "order_lookup_failed",
    "signed_url_failed",
    "email_send_failed",
    "delivery_complete_failed",
    "delivery_complete_rejected",
  ]) {
    assert.match(delivery, new RegExp(`'${code}'`))
  }
  assert.match(delivery, /SAFE_DELIVERY_REASONS/)
  assert.match(delivery, /logDelivery\('claim_skipped', safeReason\)/)
  assert.match(delivery, /logDelivery\('attempt_delivered'\)/)
  assert.match(delivery, /throw new Error\('email_send_failed'\)/)
  assert.doesNotMatch(delivery, /catch \(error\)[\s\S]{0,160}throw error/)

  assert.match(webhook, /SAFE_DELIVERY_FAILURE_CODES/)
  assert.match(webhook, /safeDeliveryFailureCode\(deliveryError\)/)
  assert.doesNotMatch(webhook, /console\.error\([^\n]*message\.split/)
})
