import { NextResponse } from "next/server"
import { quoteReportOrder } from "@/lib/report-order-pricing-server"
import { getReportProduct } from "@/lib/report-catalog"
import { createClient } from "@/lib/supabase-server"

export const runtime = "nodejs"

function json(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } })
}

/**
 * Pricing is intentionally a quote only: it creates neither an order nor a
 * checkout session. Until a product passes its evidence/fulfilment gate this
 * endpoint returns an explicit not-for-sale state.
 */
export async function POST(request: Request) {
  const requestOrigin = request.headers.get("origin")
  if (requestOrigin && requestOrigin !== new URL(request.url).origin) {
    return json({ error: "Invalid request origin." }, 403)
  }

  const payload = await request.json().catch(() => null)
  const productId = typeof payload?.productId === "string" ? payload.productId : ""
  const product = getReportProduct(productId)
  if (!product) return json({ error: "Unknown report product." }, 400)

  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) return json({ error: "Sign in to view your report price." }, 401)

  const { data: orders, error: ordersError } = await supabase
    .from("report_orders")
    .select("id, product_id, status")
    .eq("user_id", user.id)

  if (ordersError) {
    console.error("[reports] unable to load order eligibility", ordersError.message)
    return json({ error: "We could not check report eligibility." }, 503)
  }

  const quote = quoteReportOrder(productId, orders ?? [])
  if (!quote.ok) {
    return json({
      productId,
      available: false,
      salesStatus: product.salesStatus,
      reason: quote.reason,
    }, 409)
  }

  return json({
    productId: quote.productId,
    available: true,
    amountAudCents: quote.amountAudCents,
    currency: "AUD",
    pricingMode: quote.pricingMode,
    sourceOrderId: quote.sourceOrderId,
  })
}
