export const FIFO_REPORT_CHECKOUT_SESSION_KEY = "cc_fifo_report_checkout_v1"

export type FifoReportCheckoutIdentity = {
  email: string
  marketingConsent: boolean
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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
