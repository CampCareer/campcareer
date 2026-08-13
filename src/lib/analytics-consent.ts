import { ANALYTICS_CONSENT_COOKIE, hasMeasurementConsent } from "./analytics-consent-shared"

export { ANALYTICS_CONSENT_COOKIE } from "./analytics-consent-shared"

export type AnalyticsConsent = "granted" | "denied" | null

export function getAnalyticsConsent(): AnalyticsConsent {
  if (typeof document === "undefined") return null
  if (hasMeasurementConsent(document.cookie)) return "granted"
  return document.cookie.split(/;\s*/).some((item) => item === `${ANALYTICS_CONSENT_COOKIE}=denied`) ? "denied" : null
}

export function setAnalyticsConsent(value: Exclude<AnalyticsConsent, null>) {
  document.cookie = `${ANALYTICS_CONSENT_COOKIE}=${value}; path=/; max-age=${60 * 60 * 24 * 180}; samesite=lax`
  window.dispatchEvent(new Event("campcareer-consent"))
}

/** Create the server-managed, pseudonymous identifiers only after consent. */
export async function createOptionalMeasurementSession() {
  try {
    await fetch("/api/privacy/measurement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pathname: window.location.pathname, search: window.location.search }),
      keepalive: true,
    })
  } catch {
    // Measurement remains consent-gated even if the helper identifiers cannot
    // be created. A later navigation can retry without blocking the visitor.
  }
}

/** Clear the server-managed identifiers that exist only for optional measurement. */
export async function clearOptionalMeasurementCookies() {
  try {
    await fetch("/api/privacy/measurement", { method: "DELETE", keepalive: true })
  } catch {
    // The consent state is already denied locally; retrying deletion on a
    // future preference change is safer than blocking the visitor's choice.
  }
}
