import assert from "node:assert/strict"
import test from "node:test"

import { VISA_CATALOG } from "../src/lib/workspace/visa-catalog"
import { applyBatch1VisaCatalog } from "../src/lib/workspace/visa-catalog-batch-1"
import { getVisaDetail } from "../src/lib/workspace/visa-detail-resolver"

const EXPECTED_COUNTS: Record<string, number> = {
  UK: 5,
  IE: 4,
  DE: 6,
  NL: 4,
  BE: 3,
  FR: 3,
  ES: 6,
  SG: 6,
  KR: 5,
  JP: 6,
}

const catalog = applyBatch1VisaCatalog(VISA_CATALOG)

test("completed visa countries have full detail coverage", () => {
  for (const [countryCode, expectedCount] of Object.entries(EXPECTED_COUNTS)) {
    const visas = catalog.filter((visa) => visa.countryCode === countryCode)
    assert.equal(visas.length, expectedCount, `${countryCode} catalog count`)

    for (const visa of visas) {
      const detail = getVisaDetail(visa.countryCode, visa.name)
      assert.ok(detail, `missing detail for ${visa.countryCode}:${visa.name}`)
      assert.ok(detail.requirements.length >= 4, `requirements incomplete for ${visa.name}`)
      assert.ok(detail.process.length >= 4, `process incomplete for ${visa.name}`)
      assert.match(visa.url, /^https:\/\//, `official source missing for ${visa.name}`)
      assert.equal(detail.successRate, "Not published", `unsupported success rate for ${visa.name}`)
    }
  }
})
