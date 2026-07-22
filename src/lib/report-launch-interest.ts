import { getReportProduct, type ReportProductId } from "@/lib/report-catalog"
import { isLocale, type Locale } from "@/lib/i18n/config"

export const REPORT_LAUNCH_INTEREST_PRODUCTS = [
  "australia-topic-deep-dive",
  "australia-study-roi-index-2026",
  "my-australia-roi-decision-report",
  "australia-expert-review",
] as const satisfies readonly ReportProductId[]

export type ReportLaunchInterestProductId = (typeof REPORT_LAUNCH_INTEREST_PRODUCTS)[number]

export type ReportLaunchInterestInput = {
  email: string
  productIds: ReportLaunchInterestProductId[]
  locale: Locale
  sourcePath: string
  consent: true
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isReportLaunchInterestProductId(value: unknown): value is ReportLaunchInterestProductId {
  return typeof value === "string" && (REPORT_LAUNCH_INTEREST_PRODUCTS as readonly string[]).includes(value)
}

export function parseReportLaunchInterest(payload: unknown):
  | { ok: true; value: ReportLaunchInterestInput }
  | { ok: false; code: "invalid_email" | "missing_product" | "consent_required" | "invalid_request" | "bot_detected" } {
  if (!payload || typeof payload !== "object") return { ok: false, code: "invalid_request" }
  const value = payload as Record<string, unknown>
  if (typeof value.website === "string" && value.website.trim()) return { ok: false, code: "bot_detected" }

  const email = typeof value.email === "string" ? value.email.trim().toLowerCase().slice(0, 320) : ""
  if (!EMAIL_RE.test(email)) return { ok: false, code: "invalid_email" }

  const productIds = Array.isArray(value.productIds)
    ? [...new Set(value.productIds.filter(isReportLaunchInterestProductId))].slice(0, REPORT_LAUNCH_INTEREST_PRODUCTS.length)
    : []
  if (productIds.length === 0) return { ok: false, code: "missing_product" }
  if (value.consent !== true) return { ok: false, code: "consent_required" }

  const locale = typeof value.locale === "string" && isLocale(value.locale) ? value.locale : "en"
  const sourcePath = typeof value.sourcePath === "string" && value.sourcePath.startsWith("/")
    ? value.sourcePath.slice(0, 500)
    : "/reports/australia"
  return { ok: true, value: { email, productIds, locale, sourcePath, consent: true } }
}

export function productLabels(productIds: readonly string[], locale: Locale) {
  return productIds
    .map((id) => getReportProduct(id))
    .filter((product): product is NonNullable<ReturnType<typeof getReportProduct>> => Boolean(product))
    .map((product) => locale === "ko" ? product.titleKo : product.title)
}

export function canResendReportLaunchConfirmation(lastSentAt: string | null, now = new Date()) {
  if (!lastSentAt) return true
  const sentAt = new Date(lastSentAt)
  return Number.isNaN(sentAt.getTime()) || now.getTime() - sentAt.getTime() >= 15 * 60 * 1000
}
