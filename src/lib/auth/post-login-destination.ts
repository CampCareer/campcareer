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
    return bareNextPath === "/onboarding"
      ? getSafeOnboardingReturnPath(next, localizePath("/home", locale))
      : next
  }

  if (bareNextPath === "/onboarding") return next
  if (bareNextPath === "/career") return getCareerResultOnboardingPath(next, locale)

  return localizePath("/onboarding", locale)
}

/**
 * A guest saving a result has explicitly asked to resume that result. Keep the
 * small, validated selection through onboarding and return to the
 * personalised result, where the client can complete the pending save.
 */
function getCareerResultOnboardingPath(careerPath: string, locale: LocaleOption) {
  try {
    const career = new URL(careerPath, "https://campcareer.local")
    const onboarding = new URLSearchParams()
    const country = career.searchParams.get("country")
    const occupation = career.searchParams.get("occupation")

    if (country) onboarding.set("country", country)
    if (occupation) onboarding.set("occupation", occupation)
    career.searchParams.set("personalised", "1")
    onboarding.set("return_to", `${career.pathname}${career.search}`)
    return `${localizePath("/onboarding", locale)}?${onboarding}`
  } catch {
    return localizePath("/onboarding", locale)
  }
}

function getSafeOnboardingReturnPath(onboardingPath: string, fallback: string) {
  try {
    const parsed = new URL(onboardingPath, "https://campcareer.local")
    return getSafeNextPath(parsed.searchParams.get("return_to"), fallback)
  } catch {
    return fallback
  }
}
