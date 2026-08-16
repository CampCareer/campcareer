export const FIFO_REPORT_CHECKOUT_SESSION_KEY = "cc_fifo_report_checkout_v1"
export const FIFO_REPORT_CHECKOUT_ATTEMPT_SESSION_KEY = "cc_fifo_report_checkout_attempt_v1"

export type FifoReportCheckoutIdentity = {
  email: string
  marketingConsent: boolean
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function parseFifoReportCheckoutIdentity(payload: unknown):
  | { ok: true; value: FifoReportCheckoutIdentity }
  | { ok: false; code: "invalid_email" | "invalid_request" } {
  if (!payload || typeof payload !== "object") return { ok: false, code: "invalid_request" }

  const value = payload as Record<string, unknown>
  const email = typeof value.email === "string" ? value.email.trim().toLowerCase().slice(0, 320) : ""
  if (!EMAIL_RE.test(email)) return { ok: false, code: "invalid_email" }

  return {
    ok: true,
    value: {
      email,
      marketingConsent: value.marketingConsent === true,
    },
  }
}

export function parseFifoReportCheckoutAttemptId(value: unknown): string | null {
  return typeof value === "string" && UUID_RE.test(value) ? value : null
}
