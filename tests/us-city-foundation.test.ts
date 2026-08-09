import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const APPROVED = [
  ["new-york-ny", "new-york"],
  ["boston-ma", "boston"],
  ["los-angeles-ca", "los-angeles"],
  ["chicago-il", "chicago"],
  ["seattle-wa", "seattle"],
  ["san-diego-ca", "san-diego"],
  ["philadelphia-pa", "philadelphia"],
  ["tempe-az", "tempe"],
] as const

const migration = readFileSync(
  "supabase/migrations/20260808151041_normalize_us_tier_a_city_slugs_v1.sql",
  "utf8",
)
const scopeDoc = readFileSync("docs/data-foundation/us-city-scope-v1.md", "utf8")

test("US city normalization is bounded to the approved Tier A eight", () => {
  const pairs = [...migration.matchAll(/\('([^']+)', '([^']+)'\)/g)].map((match) => [match[1], match[2]])
  assert.deepEqual(pairs, APPROVED.map(([code, slug]) => [code, slug]))
  assert.equal(new Set(pairs.map(([, slug]) => slug)).size, APPROVED.length)

  for (const [code, slug] of APPROVED) {
    assert.ok(migration.includes(`'${code}'`))
    assert.ok(migration.includes(`'${slug}'`))
  }
})

test("US city normalization preserves named-city and provenance contracts", () => {
  assert.ok(migration.includes("g.canonical_geography_id is null"))
  assert.ok(migration.includes("scope_kind = 'city'"))
  assert.ok(migration.includes("'study_destination_scope', 'named_city'"))
  assert.ok(migration.includes("'publication_tier', 'A'"))
  assert.ok(migration.includes("'us_city_normalization_v1', true"))
  assert.ok(migration.includes("'canonical_name'"))
  assert.ok(migration.includes("'source'"))
  assert.ok(migration.includes("'slug'"))
  assert.ok(migration.includes("'public.cities_us'"))
  assert.ok(migration.includes("Do not infer metro, borough, or neighbouring municipality membership"))
})

test("US city scope document keeps metro inference out of phase 2", () => {
  assert.ok(scopeDoc.includes("Tempe stays Tempe"))
  assert.ok(scopeDoc.includes("Boston does not automatically absorb Cambridge"))
  assert.ok(scopeDoc.includes("Chicago does not automatically absorb Evanston"))
  assert.ok(scopeDoc.includes("New York"))
  assert.ok(scopeDoc.includes("Tier B cities remain non-public"))
})
