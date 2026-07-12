import { redirect } from "next/navigation"
import { getStudyConcept } from "@/data/study-concepts"
import { createClient } from "@/lib/supabase-server"
import { LeadRequestForm } from "./request-form"

export const dynamic = "force-dynamic"
export const metadata = { title: "Request application support", robots: { index: false, follow: false } }

export default async function ApplicationSupportRequestPage(props: { searchParams: Promise<{ concept?: string; country?: string; locale?: string }> }) {
  const searchParams = await props.searchParams
  const concept = getStudyConcept(searchParams.concept ?? "")
  const country = (searchParams.country ?? "").toUpperCase()
  if (!concept || !/^[A-Z]{2}$/.test(country)) redirect("/")

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    const next = `/support/request?concept=${encodeURIComponent(concept.id)}&country=${encodeURIComponent(country)}&locale=${encodeURIComponent(searchParams.locale ?? "en")}`
    redirect(`/login?next=${encodeURIComponent(next)}`)
  }

  return <LeadRequestForm conceptId={concept.id} conceptLabel={searchParams.locale === "ko-KR" ? concept.labelKo : concept.label} country={country} locale={searchParams.locale === "ko-KR" ? "ko-KR" : "en"} />
}
