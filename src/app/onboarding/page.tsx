import { Suspense } from "react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { CareerPersonalisationOnboarding } from "@/components/onboarding/career-personalisation-onboarding"
import { getSafeNextPath } from "@/lib/auth/safe-next"
import { CareerOnboardingReturnCapture } from "@/components/onboarding/career-onboarding-return"
import { localizePath, localeForUi, type LocaleOption } from "@/lib/i18n/config"
import { createClient } from "@/lib/supabase-server"

type OnboardingPageProps = {
  searchParams: Promise<{
    country?: string | string[]
    occupation?: string | string[]
    return_to?: string | string[]
    returnTo?: string | string[]
  }>
}

const firstValue = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const [supabase, requestHeaders, params] = await Promise.all([createClient(), headers(), searchParams])
  const { data: { user } } = await supabase.auth.getUser()
  const routeLocale = requestHeaders.get("x-campcareer-route-locale") as LocaleOption | null
  const locale = localeForUi(routeLocale ?? "en")
  const country = firstValue(params.country)
  const occupation = firstValue(params.occupation)
  const explicitReturnTo = getSafeNextPath(
    firstValue(params.return_to) ?? firstValue(params.returnTo),
    "",
  ) || null
  const derivedReturnTo = country && occupation
    ? `${localizePath("/career", locale)}?country=${encodeURIComponent(country.toUpperCase())}&occupation=${encodeURIComponent(occupation)}&personalised=1`
    : null
  const returnTo = explicitReturnTo ?? derivedReturnTo

  if (!user) {
    const onboardingParams = new URLSearchParams()
    if (country) onboardingParams.set("country", country)
    if (occupation) onboardingParams.set("occupation", occupation)
    if (returnTo) onboardingParams.set("return_to", returnTo)
    const onboardingPath = `${localizePath("/onboarding", locale)}${onboardingParams.size ? `?${onboardingParams}` : ""}`
    redirect(`${localizePath("/login", locale)}?next=${encodeURIComponent(onboardingPath)}`)
  }

  return <>
    <CareerOnboardingReturnCapture returnTo={returnTo} />
    <Suspense fallback={<main className="min-h-[70vh] bg-[#fafafa]" />}><CareerPersonalisationOnboarding /></Suspense>
  </>
}
