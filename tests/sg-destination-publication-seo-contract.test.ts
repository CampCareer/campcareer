import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8")
const page = read("src/app/(workspace)/countries/sg/page.tsx")
const sitemap = read("src/app/sitemap.ts")
const profile = read("src/components/country-profiles/singapore-study-destination-profile.tsx")
const decision = read("docs/data-foundation/sg-destination-decision-v1.md")

test("Singapore publishes one canonical country destination", () => {
  assert.match(page, /canonical: "\/countries\/sg"/)
  assert.match(page, /Study and Work in Singapore/)
  assert.match(sitemap, /CANONICAL_COUNTRY_SLUGS/)
  assert.doesNotMatch(sitemap, /\$\{SITE_URL\}\/sg/)
  assert.doesNotMatch(page, /\/cities\/sg\//)
  assert.doesNotMatch(sitemap, /\/cities\/sg\//)
})

test("Phase 7 keeps Singapore as one city-state destination", () => {
  assert.match(decision, /city-state/i)
  assert.match(decision, /\/compare\?type=city&country=SG/)
  assert.match(decision, /Singapore country\/city-state/)
})

test("Phase 7 preserves programme verification and eligibility caveats", () => {
  assert.match(profile, /programme/i)
  assert.match(profile, /profile\.programmeCoverage\.detail/)
  assert.match(profile, /Eligibility conditions apply/)
  assert.match(profile, /not an unconditional allowance/)
})
