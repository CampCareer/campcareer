import assert from "node:assert/strict"
import test from "node:test"
import { buildLegacyCompareRedirect } from "../src/lib/comparison/legacy-redirect"

test("legacy compare URLs keep only v1 decision inputs", () => {
  assert.equal(
    buildLegacyCompareRedirect({ major: "computer-science", countries: "au,ca,uk", currency: "USD", schoolA: "opaque-id" }, "en"),
    "/compare?major=computer-science&countries=au%2Cca%2Cuk&currency=USD",
  )
  assert.equal(
    buildLegacyCompareRedirect({ career: ["carpenter", "ignored"], origin: "kr" }, "ko"),
    "/ko/compare?career=carpenter&origin=kr",
  )
})
