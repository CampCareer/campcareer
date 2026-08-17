import { NextRequest, NextResponse } from "next/server"
import { siteUrl } from "@/lib/email/links"
import { buildFifoReportOrderDraft } from "@/lib/fifo/report-order"
import {
  createFifoStripeCheckoutSession,
  requiredFifoStripePriceId,
} from "@/lib/fifo/stripe-server"
import { supabaseAdmin } from "@/lib/supabase-admin"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const NO_STORE_HEADERS = { "Cache-Control": "no-store" }
const MAX_BODY_BYTES = 4_096

const ORDER_SELECT = [
  "id",
  "checkout_attempt_id",
  "product_id",
  "product_edition",
  "email",
  "amount_aud_cents",
  "currency",
  "payment_status",
  "delivery_status",
  "stripe_price_id",
  "stripe_checkout_session_id",
  "stripe_checkout_url",
  "stripe_payment_intent_id",
  "stripe_customer_id",
  "marketing_opt_in_requested",
  "marketing_consent_version",
].join(",")

type OrderRow = {
  id: string
  checkout_attempt_id: string
  product_id: string
  product_edition: string
  email: string
  amount_aud_cents: number
  currency: string
  payment_status: string
  delivery_status: string
  stripe_price_id: string | null
  stripe_checkout_session_id: string | null
  stripe_checkout_url: string | null
  stripe_payment_intent_id: string | null
  stripe_customer_id: string | null
  marketing_opt_in_requested: boolean
  marketing_consent_version: string | null
}

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: NO_STORE_HEADERS })
}

async function readBody(request: Request): Promise<unknown | null> {
  const contentLength = Number(request.headers.get("content-length") ?? 0)
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) return null
  const raw = await request.text()
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function orderMatchesAttempt(
  order: OrderRow,
  draft: Extract<ReturnType<typeof buildFifoReportOrderDraft>, { ok: true }>["value"],
): boolean {
  return (
    order.checkout_attempt_id === draft.checkoutAttemptId &&
    order.product_id === draft.productId &&
    order.product_edition === draft.productEdition &&
    order.email === draft.email &&
    order.amount_aud_cents === draft.amountAudCents &&
    order.currency === draft.currency &&
    order.marketing_opt_in_requested === draft.marketingOptInRequested &&
    order.marketing_consent_version === draft.marketingConsentVersion
  )
}

async function findOrder(checkoutAttemptId: string): Promise<OrderRow | null> {
  const { data, error } = await supabaseAdmin
    .from("fifo_report_orders")
    .select(ORDER_SELECT)
    .eq("checkout_attempt_id", checkoutAttemptId)
    .maybeSingle()

  if (error) throw new Error(`FIFO order lookup failed: ${error.code ?? "unknown"}`)
  return data as OrderRow | null
}

async function ensureOrder(
  draft: Extract<ReturnType<typeof buildFifoReportOrderDraft>, { ok: true }>["value"],
  stripePriceId: string,
): Promise<OrderRow> {
  const existing = await findOrder(draft.checkoutAttemptId)
  if (existing) {
    if (!orderMatchesAttempt(existing, draft)) throw new Error("checkout_attempt_conflict")
    return existing
  }

  const nowIso = new Date().toISOString()
  const row = {
    checkout_attempt_id: draft.checkoutAttemptId,
    product_id: draft.productId,
    product_edition: draft.productEdition,
    email: draft.email,
    amount_aud_cents: draft.amountAudCents,
    currency: draft.currency,
    payment_provider: draft.paymentProvider,
    payment_status: draft.paymentStatus,
    delivery_status: draft.deliveryStatus,
    stripe_price_id: stripePriceId,
    marketing_opt_in_requested: draft.marketingOptInRequested,
    marketing_opt_in_requested_at: draft.marketingOptInRequested ? nowIso : null,
    marketing_consent_version: draft.marketingConsentVersion,
    digital_delivery_consent_at: nowIso,
    digital_withdrawal_acknowledged_at: nowIso,
    digital_delivery_consent_version: draft.digitalDeliveryConsentVersion,
    terms_version: draft.termsVersion,
    privacy_version: draft.privacyVersion,
    updated_at: nowIso,
  }

  const { data, error } = await supabaseAdmin
    .from("fifo_report_orders")
    .insert(row)
    .select(ORDER_SELECT)
    .single()

  if (!error && data) return data as unknown as OrderRow
  if (error?.code === "23505") {
    const raced = await findOrder(draft.checkoutAttemptId)
    if (!raced || !orderMatchesAttempt(raced, draft)) throw new Error("checkout_attempt_conflict")
    return raced
  }

  throw new Error(`FIFO order insert failed: ${error?.code ?? "unknown"}`)
}

export async function POST(request: NextRequest) {
  const requestOrigin = request.headers.get("origin")
  if (requestOrigin && requestOrigin !== request.nextUrl.origin) {
    return json({ error: "invalid_origin" }, 403)
  }

  const payload = await readBody(request)
  const parsed = buildFifoReportOrderDraft(payload)
  if (!parsed.ok) return json({ error: parsed.code }, 422)

  let stripePriceId: string
  try {
    stripePriceId = requiredFifoStripePriceId()
  } catch {
    return json({ error: "checkout_unavailable" }, 503)
  }

  try {
    const order = await ensureOrder(parsed.value, stripePriceId)
    if (order.stripe_price_id && order.stripe_price_id !== stripePriceId) {
      return json({ error: "checkout_configuration_changed" }, 409)
    }

    if (order.stripe_checkout_session_id && order.stripe_checkout_url) {
      return json({
        ok: true,
        reused: true,
        checkoutSessionId: order.stripe_checkout_session_id,
        checkoutUrl: order.stripe_checkout_url,
      })
    }

    const origin = siteUrl()
    const checkout = await createFifoStripeCheckoutSession({
      orderId: order.id,
      checkoutAttemptId: parsed.value.checkoutAttemptId,
      email: parsed.value.email,
      productEdition: parsed.value.productEdition,
      priceId: stripePriceId,
      successUrl: `${origin}/fifo/report/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}/fifo/report?checkout=cancelled`,
    })

    const { error: updateError } = await supabaseAdmin
      .from("fifo_report_orders")
      .update({
        stripe_price_id: stripePriceId,
        stripe_checkout_session_id: checkout.id,
        stripe_checkout_url: checkout.url,
        stripe_payment_intent_id: checkout.paymentIntentId,
        stripe_customer_id: checkout.customerId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", order.id)

    if (updateError) {
      console.error("[fifo-report-checkout] order update failed", updateError.code)
      return json({ error: "checkout_state_unavailable" }, 503)
    }

    return json({
      ok: true,
      reused: false,
      checkoutSessionId: checkout.id,
      checkoutUrl: checkout.url,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown"
    if (message === "checkout_attempt_conflict") return json({ error: message }, 409)
    console.error("[fifo-report-checkout] checkout creation failed", message)
    return json({ error: "checkout_unavailable" }, 503)
  }
}
