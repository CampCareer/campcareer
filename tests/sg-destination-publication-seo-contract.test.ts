import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8")
const page = read("src/app/sg/page.tsx")
const sitemap = read("src/app/sitemap.ts")
const profile = read("src/components/country-profiles/singapore-study-destination-profile.tsx")
const decision = read("docs/data-foundation/sg-destination-decision-v1.md")

test("Phase 7 publishes /sg as the canonical Singapore study destination", () => {
  assert.match(page, /path: "\/sg"/)
  assert.match(page, /Study in Singapore/)
  assert.match(sitemap, /`\$\{SITE_URL\}\/sg`/)
  assert.doesNotMatch(page, /\/cities\/sg\//)
  assert.doesNotMatch(sitemap, /\/cities\/sg\//)
})

test("Phase 7 keeps Singapore as one city-state destination", () => {
  assert.match(decision, /city-state/i)
  assert.match(decision, /\/compare\?type=city&country=SG/)
  assert.match(page, /Singapore is a city-state/)
})

test("Phase 7 preserves programme verification and eligibility caveats", () => {
  assert.match(profile, /programme/i)
  assert.match(profile, /verification/i)
  assert.match(profile, /Eligibility conditions apply/)
  assert.match(profile, /not an unconditional allowance/)
})
