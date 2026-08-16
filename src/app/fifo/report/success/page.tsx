import type { Metadata } from "next"
import { supabaseAdmin } from "@/lib/supabase-admin"
import { FifoReportSuccessPage, type FifoReportReturnStatus } from "./fifo-report-success-page"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
  title: "FIFO Guide Purchase Complete",
  description: "Confirmation page for a completed CampCareer FIFO guide checkout.",
  robots: { index: false, follow: false },
}

type SuccessSearchParams = Promise<{
  session_id?: string | string[]
}>

function validCheckoutSessionId(value: string): boolean {
  return /^cs_(?:test|live)_[A-Za-z0-9]+$/.test(value)
}

async function resolveReturnStatus(sessionId: string | null): Promise<FifoReportReturnStatus> {
  if (!sessionId || !validCheckoutSessionId(sessionId)) return "unverified"

  const { data, error } = await supabaseAdmin
    .from("fifo_report_orders")
    .select("payment_status,delivery_status")
    .eq("stripe_checkout_session_id", sessionId)
    .maybeSingle()

  if (error) {
    console.error("[fifo-report-success] order lookup failed", error.code ?? "unknown")
    return "processing"
  }
  if (!data) return "unverified"

  if (data.payment_status === "paid" && data.delivery_status === "delivered") return "delivered"
  if (data.payment_status === "paid") return "paid"
  if (data.payment_status === "pending") return "processing"
  return "problem"
}

export default async function Page({ searchParams }: { searchParams: SuccessSearchParams }) {
  const params = await searchParams
  const rawSessionId = Array.isArray(params.session_id) ? params.session_id[0] : params.session_id
  const status = await resolveReturnStatus(rawSessionId ?? null)

  return <FifoReportSuccessPage status={status} />
}
