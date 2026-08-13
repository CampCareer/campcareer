import { Suspense } from "react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { CareerPersonalisationOnboarding } from "@/components/onboarding/career-personalisation-onboarding"
import { getSafeNextPath } from "@/lib/auth/safe-next"
import { localizePath, localeForUi, type LocaleOption } from "@/lib/i18n/config"
import { createClient } from "@/lib/supabase-server"

type OnboardingPageProps = {
  searchParams: Promise<{ country?: string | string[]; occupation?: string | string[]; return_to?: string | string[] }>
}

const firstValue = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value

export default async function OnboardingPage({ searchParams }: OnboardingPageProps) {
  const [supabase, requestHeaders, params] = await Promise.all([createClient(), headers(), searchParams])
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    const routeLocale = requestHeaders.get("x-campcareer-route-locale") as LocaleOption | null
    const locale = localeForUi(routeLocale ?? "en")
    const onboardingParams = new URLSearchParams()
    const country = firstValue(params.country)
    const occupation = firstValue(params.occupation)
    const returnTo = getSafeNextPath(firstValue(params.return_to), "")
    if (country) onboardingParams.set("country", country)
    if (occupation) onboardingParams.set("occupation", occupation)
    if (returnTo) onboardingParams.set("return_to", returnTo)
    const onboardingPath = `${localizePath("/onboarding", locale)}${onboardingParams.size ? `?${onboardingParams}` : ""}`
    redirect(`${localizePath("/login", locale)}?next=${encodeURIComponent(onboardingPath)}`)
  }

  return <Suspense fallback={<main className="min-h-[70vh] bg-[#fafafa]" />}><CareerPersonalisationOnboarding /></Suspense>
}
