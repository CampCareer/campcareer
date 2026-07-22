import { getReportProduct, type ReportProduct, type ReportProductId } from "@/lib/report-catalog"

export type ReportOrderForPricing = {
  id: string
  product_id: string
  status: string
}

export type ReportPriceQuote =
  | { ok: true; productId: ReportProductId; amountAudCents: number; pricingMode: "full_price" | "upgrade"; sourceOrderId: string | null }
  | { ok: false; reason: "unknown_product" | "not_on_sale" }

const ENTITLING_ORDER_STATUSES = new Set(["paid", "generating", "ready"])

/**
 * The only place the A$30 upgrade is calculated. A future checkout must call
 * this on the server after looking up the signed-in user's own orders.
 */
export function quoteReportOrder(productId: string, orders: readonly ReportOrderForPricing[]): ReportPriceQuote {
  const product = getReportProduct(productId)
  if (!product) return { ok: false, reason: "unknown_product" }
  return quoteReportProduct(product, orders)
}

export function quoteReportProduct(product: ReportProduct, orders: readonly ReportOrderForPricing[]): ReportPriceQuote {
  if (product.salesStatus !== "available") return { ok: false, reason: "not_on_sale" }

  const sourceOrder = product.upgrade
    ? orders.find((order) => order.product_id === product.upgrade!.fromProductId && ENTITLING_ORDER_STATUSES.has(order.status))
    : undefined

  if (product.upgrade && sourceOrder) {
    return {
      ok: true,
      productId: product.id,
      amountAudCents: product.upgrade.additionalAmountAudCents,
      pricingMode: "upgrade",
      sourceOrderId: sourceOrder.id,
    }
  }

  return {
    ok: true,
    productId: product.id,
    amountAudCents: product.amountAudCents,
    pricingMode: "full_price",
    sourceOrderId: null,
  }
}
