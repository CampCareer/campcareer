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

test("paid FIFO delivery uses a private signed URL and idempotent transactional email", () => {
  assert.match(delivery, /FIFO_REPORT_STORAGE_BUCKET/)
  assert.match(delivery, /FIFO_REPORT_STORAGE_OBJECT_PATH/)
  assert.match(delivery, /createSignedUrl/)
  assert.match(delivery, /SIGNED_URL_TTL_SECONDS = 24 \* 60 \* 60/)
  assert.match(delivery, /idempotencyKey: `\$\{DELIVERY_IDEMPOTENCY_PREFIX\}\/\$\{order\.id\}`/)
  assert.match(delivery, /This email is part of your purchase and is separate from any optional marketing preference/)
  assert.match(emailSend, /idempotencyKey\?: string/)
  assert.match(emailSend, /\{ idempotencyKey: msg\.idempotencyKey \}/)
})

test("delivery database functions claim once, persist completion and record failures", () => {
  assert.match(migration, /add column if not exists delivery_signed_url text/)
  assert.match(migration, /create or replace function public\.claim_fifo_report_delivery/)
  assert.match(migration, /for update/)
  assert.match(migration, /delivery_attempt_count = delivery_attempt_count \+ 1/)
  assert.match(migration, /recently_attempted/)
  assert.match(migration, /create or replace function public\.complete_fifo_report_delivery/)
  assert.match(migration, /delivery_status = 'delivered'/)
  assert.match(migration, /create or replace function public\.fail_fifo_report_delivery/)
  assert.match(migration, /delivery_status = 'failed'/)
  assert.match(migration, /to service_role/)
})

test("verified paid webhook invokes delivery and requests retry on transient delivery failure", () => {
  assert.match(webhook, /deliverPaidFifoReport/)
  assert.match(webhook, /action\.paymentStatus === "paid"/)
  assert.match(webhook, /deliveryPending: true/)
  assert.match(webhook, /503/)
})
