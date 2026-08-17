import {
  FIFO_CONSTRUCTION_FAST_ENTRY_GUIDE,
  FIFO_CONSTRUCTION_FAST_ENTRY_GUIDE_PRODUCT_ID,
} from "../report-catalog"
import { parseFifoReportCheckoutIdentity } from "./report-checkout-email"

export const FIFO_REPORT_ORDERS_TABLE = "fifo_report_orders" as const
export const FIFO_REPORT_STORAGE_BUCKET = "fifo-report-products" as const
export const FIFO_REPORT_STORAGE_OBJECT_PATH =
  "fifo-construction-fast-entry-guide-2026/edition-1.0/CampCareer_FIFO_Construction_Fast_Entry_Guide_2026.pdf" as const
export const FIFO_REPORT_MARKETING_CONSENT_VERSION = "fifo-report-marketing-v1" as const

export const FIFO_REPORT_PAYMENT_STATUSES = [
  "pending",
  "paid",
  "failed",
  "expired",
  "refunded",
  "disputed",
] as const

export const FIFO_REPORT_DELIVERY_STATUSES = [
  "not_ready",
  "pending",
  "delivered",
  "failed",
] as const

export type FifoReportPaymentStatus = (typeof FIFO_REPORT_PAYMENT_STATUSES)[number]
export type FifoReportDeliveryStatus = (typeof FIFO_REPORT_DELIVERY_STATUSES)[number]

export type FifoReportCheckoutAttempt = {
  checkoutAttemptId: string
  email: string
  marketingOptInRequested: boolean
}

export type FifoReportOrderDraft = {
  checkoutAttemptId: string
  productId: typeof FIFO_CONSTRUCTION_FAST_ENTRY_GUIDE_PRODUCT_ID
  productEdition: string
  email: string
  amountAudCents: number
  currency: "AUD"
  paymentProvider: "stripe"
  paymentStatus: "pending"
  deliveryStatus: "not_ready"
  marketingOptInRequested: boolean
  marketingConsentVersion: typeof FIFO_REPORT_MARKETING_CONSENT_VERSION | null
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function parseFifoReportCheckoutAttempt(payload: unknown):
  | { ok: true; value: FifoReportCheckoutAttempt }
  | { ok: false; code: "invalid_request" | "invalid_checkout_attempt" | "invalid_email" } {
  if (!payload || typeof payload !== "object") return { ok: false, code: "invalid_request" }
  const value = payload as Record<string, unknown>
  const checkoutAttemptId = typeof value.checkoutAttemptId === "string"
    ? value.checkoutAttemptId.trim().toLowerCase()
    : ""

  if (!UUID_RE.test(checkoutAttemptId)) return { ok: false, code: "invalid_checkout_attempt" }

  const identity = parseFifoReportCheckoutIdentity({
    email: value.email,
    marketingConsent: value.marketingConsent,
  })
  if (!identity.ok) return identity

  return {
    ok: true,
    value: {
      checkoutAttemptId,
      email: identity.value.email,
      marketingOptInRequested: identity.value.marketingConsent,
    },
  }
}

export function buildFifoReportOrderDraft(payload: unknown):
  | { ok: true; value: FifoReportOrderDraft }
  | { ok: false; code: "invalid_request" | "invalid_checkout_attempt" | "invalid_email" } {
  const parsed = parseFifoReportCheckoutAttempt(payload)
  if (!parsed.ok) return parsed

  const marketingOptInRequested = parsed.value.marketingOptInRequested

  return {
    ok: true,
    value: {
      checkoutAttemptId: parsed.value.checkoutAttemptId,
      productId: FIFO_CONSTRUCTION_FAST_ENTRY_GUIDE_PRODUCT_ID,
      productEdition: FIFO_CONSTRUCTION_FAST_ENTRY_GUIDE.edition ?? "1.0",
      email: parsed.value.email,
      amountAudCents: FIFO_CONSTRUCTION_FAST_ENTRY_GUIDE.amountAudCents,
      currency: "AUD",
      paymentProvider: "stripe",
      paymentStatus: "pending",
      deliveryStatus: "not_ready",
      marketingOptInRequested,
      marketingConsentVersion: marketingOptInRequested ? FIFO_REPORT_MARKETING_CONSENT_VERSION : null,
    },
  }
}
