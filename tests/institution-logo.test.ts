import assert from "node:assert/strict"
import test from "node:test"
import { safeInstitutionLogoUrl } from "../src/lib/institutions/institution-logo"

test("institution logo URLs accept secure official assets only", () => {
  assert.equal(
    safeInstitutionLogoUrl("https://www.sydney.edu.au/favicon.ico"),
    "https://www.sydney.edu.au/favicon.ico",
  )
  assert.equal(safeInstitutionLogoUrl("http://example.edu/logo.png"), null)
  assert.equal(safeInstitutionLogoUrl("data:image/svg+xml;base64,abc"), null)
  assert.equal(safeInstitutionLogoUrl("not-a-url"), null)
  assert.equal(safeInstitutionLogoUrl(null), null)
})
