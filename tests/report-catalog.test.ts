import assert from "node:assert/strict"
import test from "node:test"
import {
  FIFO_CONSTRUCTION_FAST_ENTRY_GUIDE,
  FIFO_CONSTRUCTION_FAST_ENTRY_GUIDE_PRODUCT_ID,
  PERSONALIZED_ROI_INPUTS,
  REPORT_CATALOG_COUNTRY,
  REPORT_CATALOG_CURRENCY,
  REPORT_PRODUCTS,
  TOPIC_REPORT_SCOPES,
  formatAud,
  getReportProduct,
} from "../src/lib/report-catalog"

test("the Australia report catalogue keeps the agreed AUD prices and scope", () => {
  assert.equal(REPORT_CATALOG_COUNTRY, "AU")
  assert.equal(REPORT_CATALOG_CURRENCY, "AUD")
  assert.equal(REPORT_PRODUCTS.length, 5)
  assert.equal(new Set(REPORT_PRODUCTS.map((product) => product.id)).size, REPORT_PRODUCTS.length)
  assert.deepEqual(REPORT_PRODUCTS.map((product) => product.amountAudCents), [2900, 900, 2900, 5900, 14900])
  assert.ok(REPORT_PRODUCTS.every((product) => product.country === "AU" && product.currency === "AUD"))
  assert.ok(REPORT_PRODUCTS.every((product) => product.salesStatus === "contracted"))
  assert.equal(formatAud(14900), "A$149")
})

test("the completed FIFO construction guide is the canonical A$29 digital product", () => {
  const product = getReportProduct(FIFO_CONSTRUCTION_FAST_ENTRY_GUIDE_PRODUCT_ID)

  assert.equal(product, FIFO_CONSTRUCTION_FAST_ENTRY_GUIDE)
  assert.equal(product?.title, "FIFO Construction Fast Entry Guide 2026")
  assert.equal(product?.amountAudCents, 2900)
  assert.equal(product?.fulfilment, "digital-report")
  assert.equal(product?.contentStatus, "ready")
  assert.equal(product?.salesStatus, "contracted")
  assert.equal(product?.edition, "1.0")
  assert.equal(product?.region, "Western Australia")
  assert.equal(product?.dataReviewedOn, "2026-08-16")
  assert.deepEqual(product?.pageCount, { min: 23, max: 23, target: 23 })
})

test("the topic, personalised upgrade, and expert-review contracts stay intact", () => {
  const topic = getReportProduct("australia-topic-deep-dive")
  const personalised = getReportProduct("my-australia-roi-decision-report")
  const expert = getReportProduct("australia-expert-review")

  assert.deepEqual(topic?.topicScopes, TOPIC_REPORT_SCOPES)
  assert.deepEqual(TOPIC_REPORT_SCOPES, ["field", "city", "university"])
  assert.deepEqual(personalised?.pageCount, { min: 18, max: 30, target: 24 })
  assert.deepEqual(personalised?.upgrade, {
    fromProductId: "australia-study-roi-index-2026",
    additionalAmountAudCents: 3000,
  })
  assert.deepEqual(expert?.expertSettlement, {
    expertPayoutAudCents: 10000,
    platformGrossAudCents: 4900,
  })
  assert.ok(PERSONALIZED_ROI_INPUTS.includes("maximum-budget"))
  assert.ok(PERSONALIZED_ROI_INPUTS.includes("risk-tolerance"))
})