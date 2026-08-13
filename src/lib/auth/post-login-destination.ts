import { DEFAULT_LOCALE, localeFromPathname, localizePath, withoutLocalePrefix, type LocaleOption } from "@/lib/i18n/config"
import { getSafeNextPath } from "@/lib/auth/safe-next"

/**
 * New members need the initial personalisation once. Returning members should
 * resume Home instead of being sent through the same setup after every sign-in.
 * An explicit in-app onboarding link still works while the user has a session.
 */
export function getPostLoginDestination(
  requestedNext: string | null | undefined,
  hasCompletedPersonalisation: boolean,
  fallbackLocale: LocaleOption = DEFAULT_LOCALE,
) {
  const next = getSafeNextPath(requestedNext, localizePath("/home", fallbackLocale))
  const locale = localeFromPathname(next) ?? fallbackLocale
  const bareNextPath = withoutLocalePrefix(next).split("?")[0]

  if (hasCompletedPersonalisation) {
    return bareNextPath === "/onboarding" ? localizePath("/home", locale) : next
  }

  return bareNextPath === "/onboarding" ? next : localizePath("/onboarding", locale)
}
