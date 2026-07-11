import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase-server"
import { claimPlanSaveIntent } from "@/lib/study-product/plan-service"

export const dynamic = "force-dynamic"

export default async function ClaimPlanPage(props: { searchParams: Promise<{ intent?: string; claim?: string }> }) {
  const searchParams = await props.searchParams;
  const intentId = searchParams.intent ?? ""
  const claimToken = searchParams.claim ?? ""
  if (!intentId || !claimToken) return <ClaimError message="This save link is incomplete." />

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    const next = `/plans/claim?intent=${encodeURIComponent(intentId)}&claim=${encodeURIComponent(claimToken)}`
    redirect(`/login?next=${encodeURIComponent(next)}`)
  }

  try {
    const planId = await claimPlanSaveIntent({ intentId, claimToken, userId: user.id })
    redirect(`/plans/${planId}?saved=1`)
  } catch (error) {
    return <ClaimError message={error instanceof Error ? error.message : "Unable to save this plan."} />
  }
}

function ClaimError({ message }: { message: string }) {
  return (
    <main className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="text-3xl font-semibold text-slate-950">We couldn&apos;t save this plan</h1>
      <p className="mt-4 text-sm leading-6 text-slate-600">{message}</p>
      <Link href="/" className="mt-8 inline-flex min-h-11 items-center rounded-xl bg-blue-600 px-5 text-sm font-bold text-white">Start a new comparison</Link>
    </main>
  )
}
