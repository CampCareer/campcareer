import assert from "node:assert/strict"
import test from "node:test"
import { REPORT_PRODUCTS, type ReportProduct } from "../src/lib/report-catalog"
import { quoteReportOrder, quoteReportProduct } from "../src/lib/report-order-pricing"

const personalised = REPORT_PRODUCTS.find((product) => product.id === "my-australia-roi-decision-report")!

test("report pricing remains closed while the catalogue is contracted", () => {
  assert.deepEqual(quoteReportOrder("my-australia-roi-decision-report", []), { ok: false, reason: "not_on_sale" })
  assert.deepEqual(quoteReportOrder("not-a-report", []), { ok: false, reason: "unknown_product" })
})

test("only a completed ROI Index order earns the A$30 personalised-report upgrade", () => {
  const availableProduct: ReportProduct = { ...personalised, salesStatus: "available" }

  assert.deepEqual(quoteReportProduct(availableProduct, []), {
    ok: true,
    productId: "my-australia-roi-decision-report",
    amountAudCents: 5900,
    pricingMode: "full_price",
    sourceOrderId: null,
  })
  assert.deepEqual(quoteReportProduct(availableProduct, [{ id: "index-order", product_id: "australia-study-roi-index-2026", status: "paid" }]), {
    ok: true,
    productId: "my-australia-roi-decision-report",
    amountAudCents: 3000,
    pricingMode: "upgrade",
    sourceOrderId: "index-order",
  })
  assert.equal(quoteReportProduct(availableProduct, [{ id: "refunded-index", product_id: "australia-study-roi-index-2026", status: "refunded" }]).ok, true)
  const refundedQuote = quoteReportProduct(availableProduct, [{ id: "refunded-index", product_id: "australia-study-roi-index-2026", status: "refunded" }])
  assert.deepEqual(refundedQuote, {
    ok: true,
    productId: "my-australia-roi-decision-report",
    amountAudCents: 5900,
    pricingMode: "full_price",
    sourceOrderId: null,
  })
})
