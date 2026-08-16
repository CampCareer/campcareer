import "server-only"
import {
  FIFO_CONSTRUCTION_FAST_ENTRY_GUIDE,
  FIFO_CONSTRUCTION_FAST_ENTRY_GUIDE_PRODUCT_ID,
} from "../report-catalog"

const STRIPE_CHECKOUT_SESSIONS_URL = "https://api.stripe.com/v1/checkout/sessions"
const STRIPE_TIMEOUT_MS = 12_000

export type StripeCheckoutSessionResult = {
  id: string
  url: string
  paymentIntentId: string | null
  customerId: string | null
}

export type FifoStripeCheckoutRequest = {
  orderId: string
  checkoutAttemptId: string
  email: string
  productEdition: string
  priceId: string
  successUrl: string
  cancelUrl: string
}

function requiredStripeSecretKey(): string {
  const value = process.env.STRIPE_SECRET_KEY?.trim() ?? ""
  if (!value.startsWith("sk_")) {
    throw new Error("STRIPE_SECRET_KEY is required for FIFO report checkout.")
  }
  return value
}

export function requiredFifoStripePriceId(): string {
  const value = process.env.STRIPE_FIFO_REPORT_PRICE_ID?.trim() ?? ""
  if (!value.startsWith("price_")) {
    throw new Error("STRIPE_FIFO_REPORT_PRICE_ID is required for FIFO report checkout.")
  }
  return value
}

export function buildFifoStripeCheckoutParams(input: FifoStripeCheckoutRequest): URLSearchParams {
  const body = new URLSearchParams()
  body.set("mode", "payment")
  body.set("success_url", input.successUrl)
  body.set("cancel_url", input.cancelUrl)
  body.set("customer_email", input.email)
  body.set("client_reference_id", input.orderId)
  body.set("line_items[0][price]", input.priceId)
  body.set("line_items[0][quantity]", "1")
  body.set("metadata[order_id]", input.orderId)
  body.set("metadata[checkout_attempt_id]", input.checkoutAttemptId)
  body.set("metadata[product_id]", FIFO_CONSTRUCTION_FAST_ENTRY_GUIDE_PRODUCT_ID)
  body.set("metadata[product_edition]", input.productEdition)
  body.set("payment_intent_data[metadata][order_id]", input.orderId)
  body.set("payment_intent_data[metadata][checkout_attempt_id]", input.checkoutAttemptId)
  body.set("payment_intent_data[metadata][product_id]", FIFO_CONSTRUCTION_FAST_ENTRY_GUIDE_PRODUCT_ID)
  body.set("payment_intent_data[metadata][product_edition]", input.productEdition)
  return body
}

function readStripeId(value: unknown, prefix: string): string | null {
  return typeof value === "string" && value.startsWith(prefix) ? value : null
}

export async function createFifoStripeCheckoutSession(
  input: FifoStripeCheckoutRequest,
): Promise<StripeCheckoutSessionResult> {
  if (!input.email || !input.orderId || !input.checkoutAttemptId) {
    throw new Error("FIFO checkout request is incomplete.")
  }
  if (input.priceId !== requiredFifoStripePriceId()) {
    throw new Error("FIFO checkout price does not match the configured Stripe price.")
  }

  const secretKey = requiredStripeSecretKey()
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), STRIPE_TIMEOUT_MS)

  try {
    const response = await fetch(STRIPE_CHECKOUT_SESSIONS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "Idempotency-Key": `fifo-report-checkout:${input.checkoutAttemptId}`,
      },
      body: buildFifoStripeCheckoutParams(input).toString(),
      cache: "no-store",
      signal: controller.signal,
    })

    let payload: unknown = null
    try {
      payload = await response.json()
    } catch {
      // The status code is enough for a safe operational error below.
    }

    if (!response.ok) {
      throw new Error(`Stripe Checkout Session creation failed with HTTP ${response.status}.`)
    }
    if (!payload || typeof payload !== "object") {
      throw new Error("Stripe Checkout Session response was invalid.")
    }

    const session = payload as Record<string, unknown>
    const id = readStripeId(session.id, "cs_")
    const url = typeof session.url === "string" && session.url.startsWith("https://") ? session.url : null
    if (!id || !url) throw new Error("Stripe Checkout Session response was missing a usable session URL.")

    return {
      id,
      url,
      paymentIntentId: readStripeId(session.payment_intent, "pi_"),
      customerId: readStripeId(session.customer, "cus_"),
    }
  } finally {
    clearTimeout(timeout)
  }
}

export function expectedFifoStripeAmountAudCents(): number {
  return FIFO_CONSTRUCTION_FAST_ENTRY_GUIDE.amountAudCents
}
