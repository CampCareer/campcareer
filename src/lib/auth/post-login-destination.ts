import { DEFAULT_LOCALE, localizePath, type LocaleOption } from "@/lib/i18n/config"
import { getSafeNextPath } from "@/lib/auth/safe-next"

/**
 * Authentication is a retention layer, not an onboarding gateway.
 *
 * - An explicit safe `next` destination always wins.
 * - Without `next`, return to public Career discovery.
 * - Onboarding is reached only when the user explicitly requested it.
 */
export function getPostLoginDestination(
  requestedNext: string | null | undefined,
  fallbackLocale: LocaleOption = DEFAULT_LOCALE,
) {
  return getSafeNextPath(requestedNext, localizePath("/", fallbackLocale))
}
