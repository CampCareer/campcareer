import { createHmac, timingSafeEqual } from "node:crypto"
import {
  FIFO_CONSTRUCTION_FAST_ENTRY_GUIDE,
  FIFO_CONSTRUCTION_FAST_ENTRY_GUIDE_PRODUCT_ID,
} from "../report-catalog"

export const FIFO_STRIPE_WEBHOOK_TOLERANCE_SECONDS = 300

export type StripeWebhookVerificationResult =
  | { ok: true; timestamp: number }
  | {
      ok: false
      code:
        | "missing_signature"
        | "invalid_signature"
        | "timestamp_outside_tolerance"
        | "invalid_timestamp"
    }

type StripeObject = Record<string, unknown>

type StripeSnapshotEvent = {
  id: string
  type: string
  created: number
  data: { object: StripeObject }
}

export type FifoStripePaymentAction = {
  kind: "apply"
  eventId: string
  eventType: string
  eventCreatedAt: string
  orderId: string | null
  checkoutSessionId: string | null
  paymentIntentId: string | null
  customerId: string | null
  paymentStatus: "pending" | "paid" | "failed" | "expired"
}

export type FifoStripeIgnoredAction = {
  kind: "ignore"
  reason:
    | "unsupported_event"
    | "invalid_event"
    | "wrong_product"
    | "amount_mismatch"
    | "currency_mismatch"
    | "missing_order_reference"
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function safeString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null
}

function safeMetadata(value: unknown): Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {}
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter((entry): entry is [string, string] => typeof entry[1] === "string"),
  )
}

function validOrderId(value: unknown): string | null {
  const candidate = safeString(value)
  return candidate && UUID_RE.test(candidate) ? candidate.toLowerCase() : null
}

function validStripeId(value: unknown, prefix: string): string | null {
  const candidate = safeString(value)
  return candidate?.startsWith(prefix) ? candidate : null
}

function eventCreatedAt(created: number): string | null {
  if (!Number.isInteger(created) || created <= 0) return null
  const date = new Date(created * 1000)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

function compareHexConstantTime(expectedHex: string, receivedHex: string): boolean {
  if (!/^[0-9a-f]+$/i.test(receivedHex) || receivedHex.length !== expectedHex.length) return false
  const expected = Buffer.from(expectedHex, "hex")
  const received = Buffer.from(receivedHex, "hex")
  return expected.length === received.length && timingSafeEqual(expected, received)
}

export function verifyStripeWebhookSignature({
  payload,
  signatureHeader,
  secret,
  nowSeconds = Math.floor(Date.now() / 1000),
  toleranceSeconds = FIFO_STRIPE_WEBHOOK_TOLERANCE_SECONDS,
}: {
  payload: string
  signatureHeader: string | null
  secret: string
  nowSeconds?: number
  toleranceSeconds?: number
}): StripeWebhookVerificationResult {
  if (!signatureHeader) return { ok: false, code: "missing_signature" }

  const parts = signatureHeader.split(",").map((part) => part.trim())
  const timestampRaw = parts.find((part) => part.startsWith("t="))?.slice(2) ?? ""
  const signatures = parts
    .filter((part) => part.startsWith("v1="))
    .map((part) => part.slice(3))
    .filter(Boolean)

  const timestamp = Number(timestampRaw)
  if (!Number.isInteger(timestamp) || timestamp <= 0) return { ok: false, code: "invalid_timestamp" }
  if (signatures.length === 0) return { ok: false, code: "invalid_signature" }

  const signedPayload = `${timestamp}.${payload}`
  const expected = createHmac("sha256", secret).update(signedPayload, "utf8").digest("hex")
  const matches = signatures.some((signature) => compareHexConstantTime(expected, signature))
  if (!matches) return { ok: false, code: "invalid_signature" }

  if (Math.abs(nowSeconds - timestamp) > toleranceSeconds) {
    return { ok: false, code: "timestamp_outside_tolerance" }
  }

  return { ok: true, timestamp }
}

function parseEvent(payload: unknown): StripeSnapshotEvent | null {
  if (!payload || typeof payload !== "object") return null
  const value = payload as Record<string, unknown>
  if (
    typeof value.id !== "string" ||
    !value.id.startsWith("evt_") ||
    typeof value.type !== "string" ||
    !Number.isInteger(value.created) ||
    !value.data ||
    typeof value.data !== "object" ||
    !("object" in value.data) ||
    !value.data.object ||
    typeof value.data.object !== "object" ||
    Array.isArray(value.data.object)
  ) {
    return null
  }

  return {
    id: value.id,
    type: value.type,
    created: value.created as number,
    data: { object: value.data.object as StripeObject },
  }
}

function classifyCheckoutSession(event: StripeSnapshotEvent): FifoStripePaymentAction | FifoStripeIgnoredAction {
  const object = event.data.object
  const metadata = safeMetadata(object.metadata)
  if (metadata.product_id !== FIFO_CONSTRUCTION_FAST_ENTRY_GUIDE_PRODUCT_ID) {
    return { kind: "ignore", reason: "wrong_product" }
  }

  if (object.amount_total !== FIFO_CONSTRUCTION_FAST_ENTRY_GUIDE.amountAudCents) {
    return { kind: "ignore", reason: "amount_mismatch" }
  }
  if (typeof object.currency !== "string" || object.currency.toLowerCase() !== "aud") {
    return { kind: "ignore", reason: "currency_mismatch" }
  }

  const createdAt = eventCreatedAt(event.created)
  const orderId = validOrderId(metadata.order_id ?? object.client_reference_id)
  const checkoutSessionId = validStripeId(object.id, "cs_")
  const paymentIntentId = validStripeId(object.payment_intent, "pi_")
  const customerId = validStripeId(object.customer, "cus_")
  if (!createdAt || (!orderId && !checkoutSessionId && !paymentIntentId)) {
    return { kind: "ignore", reason: "missing_order_reference" }
  }

  let paymentStatus: FifoStripePaymentAction["paymentStatus"] = "pending"
  if (event.type === "checkout.session.expired") paymentStatus = "expired"
  else if (event.type === "checkout.session.async_payment_failed") paymentStatus = "failed"
  else if (object.payment_status === "paid") paymentStatus = "paid"

  return {
    kind: "apply",
    eventId: event.id,
    eventType: event.type,
    eventCreatedAt: createdAt,
    orderId,
    checkoutSessionId,
    paymentIntentId,
    customerId,
    paymentStatus,
  }
}

function classifyPaymentIntent(event: StripeSnapshotEvent): FifoStripePaymentAction | FifoStripeIgnoredAction {
  const object = event.data.object
  const metadata = safeMetadata(object.metadata)
  if (metadata.product_id !== FIFO_CONSTRUCTION_FAST_ENTRY_GUIDE_PRODUCT_ID) {
    return { kind: "ignore", reason: "wrong_product" }
  }

  const amount = typeof object.amount_received === "number" ? object.amount_received : object.amount
  if (amount !== FIFO_CONSTRUCTION_FAST_ENTRY_GUIDE.amountAudCents) {
    return { kind: "ignore", reason: "amount_mismatch" }
  }
  if (typeof object.currency !== "string" || object.currency.toLowerCase() !== "aud") {
    return { kind: "ignore", reason: "currency_mismatch" }
  }

  const createdAt = eventCreatedAt(event.created)
  const orderId = validOrderId(metadata.order_id)
  const paymentIntentId = validStripeId(object.id, "pi_")
  const customerId = validStripeId(object.customer, "cus_")
  if (!createdAt || (!orderId && !paymentIntentId)) {
    return { kind: "ignore", reason: "missing_order_reference" }
  }

  return {
    kind: "apply",
    eventId: event.id,
    eventType: event.type,
    eventCreatedAt: createdAt,
    orderId,
    checkoutSessionId: null,
    paymentIntentId,
    customerId,
    paymentStatus: event.type === "payment_intent.succeeded" ? "paid" : "failed",
  }
}

export function classifyFifoStripeEvent(payload: unknown): FifoStripePaymentAction | FifoStripeIgnoredAction {
  const event = parseEvent(payload)
  if (!event) return { kind: "ignore", reason: "invalid_event" }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded" ||
    event.type === "checkout.session.async_payment_failed" ||
    event.type === "checkout.session.expired"
  ) {
    return classifyCheckoutSession(event)
  }

  if (event.type === "payment_intent.succeeded" || event.type === "payment_intent.payment_failed") {
    return classifyPaymentIntent(event)
  }

  return { kind: "ignore", reason: "unsupported_event" }
}
