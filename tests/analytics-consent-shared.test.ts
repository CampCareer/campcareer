import assert from "node:assert/strict"
import test from "node:test"

import { hasMeasurementConsent } from "../src/lib/analytics-consent-shared"

test("optional measurement requires an exact granted consent cookie", () => {
  assert.equal(hasMeasurementConsent(null), false)
  assert.equal(hasMeasurementConsent("cc_analytics_consent=denied"), false)
  assert.equal(hasMeasurementConsent("cc_analytics_consent=granted"), true)
  assert.equal(hasMeasurementConsent("session=abc; cc_analytics_consent=granted; theme=dark"), true)
  assert.equal(hasMeasurementConsent("cc_analytics_consent=granted-extra"), false)
})
