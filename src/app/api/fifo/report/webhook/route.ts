import { NextResponse } from "next/server"
import { deliverPaidFifoReport } from "@/lib/fifo/report-delivery"
import {
  classifyFifoStripeEvent,
  verifyStripeWebhookSignature,
} from "@/lib/fifo/stripe-webhook"
import { supabaseAdmin } from "@/lib/supabase-admin"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const NO_STORE_HEADERS = { "Cache-Control": "no-store" }
const MAX_WEBHOOK_BYTES = 1_048_576

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: NO_STORE_HEADERS })
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0)
  if (Number.isFinite(contentLength) && contentLength > MAX_WEBHOOK_BYTES) {
    return json({ error: "payload_too_large" }, 413)
  }

  const rawBody = await request.text()
  if (new TextEncoder().encode(rawBody).byteLength > MAX_WEBHOOK_BYTES) {
    return json({ error: "payload_too_large" }, 413)
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim() ?? ""
  if (!webhookSecret.startsWith("whsec_")) {
    return json({ error: "webhook_unavailable" }, 503)
  }

  const verification = verifyStripeWebhookSignature({
    payload: rawBody,
    signatureHeader: request.headers.get("stripe-signature"),
    secret: webhookSecret,
  })
  if (!verification.ok) {
    return json({ error: "invalid_signature" }, 400)
  }

  let payload: unknown
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return json({ error: "invalid_payload" }, 400)
  }

  const action = classifyFifoStripeEvent(payload)
  if (action.kind === "ignore") {
    return json({ received: true, ignored: true, reason: action.reason })
  }

  const { data, error } = await supabaseAdmin.rpc("apply_fifo_report_stripe_event", {
    p_event_id: action.eventId,
    p_event_type: action.eventType,
    p_event_created_at: action.eventCreatedAt,
    p_order_id: action.orderId,
    p_checkout_session_id: action.checkoutSessionId,
    p_payment_intent_id: action.paymentIntentId,
    p_customer_id: action.customerId,
    p_payment_status: action.paymentStatus,
  })

  if (error) {
    console.error("[fifo-report-webhook] state transition failed", error.code)
    return json({ error: "webhook_state_unavailable" }, 503)
  }

  const result = data && typeof data === "object" && !Array.isArray(data)
    ? data as Record<string, unknown>
    : {}
  const duplicate = result.duplicate === true
  const applied = result.applied === true
  const rpcOrderId = typeof result.order_id === "string" ? result.order_id : null
  const deliveryOrderId = rpcOrderId ?? action.orderId

  if (action.paymentStatus === "paid" && (applied || duplicate)) {
    if (!deliveryOrderId) {
      console.error("[fifo-report-webhook] paid event missing delivery order id")
      return json({ received: true, duplicate, applied, deliveryPending: true }, 503)
    }

    try {
      const delivery = await deliverPaidFifoReport(deliveryOrderId)
      if (!delivery.ok && delivery.reason === "recently_attempted") {
        return json({ received: true, duplicate, applied, deliveryPending: true }, 503)
      }
      if (!delivery.ok && delivery.reason !== "order_not_found" && delivery.reason !== "not_paid") {
        return json({ received: true, duplicate, applied, deliveryPending: true }, 503)
      }
    } catch (deliveryError) {
      const message = deliveryError instanceof Error ? deliveryError.message : "unknown"
      console.error("[fifo-report-webhook] delivery failed", message.split(":", 1)[0])
      // Payment state is already durable. Returning 503 asks Stripe to retry the
      // webhook so transient Storage/Resend/database delivery failures recover.
      return json({ received: true, duplicate, applied, deliveryPending: true }, 503)
    }
  }

  return json({
    received: true,
    duplicate,
    applied,
  })
}
