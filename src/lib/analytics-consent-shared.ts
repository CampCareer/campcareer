export const ANALYTICS_CONSENT_COOKIE = "cc_analytics_consent"

/**
 * Optional measurement is enabled only by the exact first-party consent cookie.
 * Keep this parser shared between browser and route-handler code so that a
 * client-side opt-in can never disagree with server-side event collection.
 */
export function hasMeasurementConsent(cookieHeader: string | null | undefined): boolean {
  return (cookieHeader ?? "")
    .split(/;\s*/)
    .some((item) => item === `${ANALYTICS_CONSENT_COOKIE}=granted`)
}
