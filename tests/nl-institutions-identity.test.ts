import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const readRepoFile = (path: string) =>
  readFileSync(new URL(`../${path}`, import.meta.url), "utf8")

const identity = readRepoFile(
  "supabase/migrations/20260808211830_nl_institution_identity_foundation.sql",
)

test("NL identity foundation assigns 13 official BRIN codes and preserves legacy provider joins", () => {
  const identityRows = identity.match(/\('nl-\d{2}', '\d{2}[A-Z]{2}'\)/g) ?? []

  assert.equal(identityRows.length, 13)
  assert.match(identity, /'NL_BRIN'/)
  assert.match(identity, /'NL_PROVIDER_ID'/)
  assert.match(identity, /institution_identity_nl_v1/)
  assert.match(identity, /bf1da9c6-c688-4873-91b1-b12c9ac2c132/)
})

test("NL BRIN cohort matches the 13 public research-university identities in scope", () => {
  for (const code of [
    "21PB", "21PC", "21PD", "21PE", "21PF", "21PG", "21PH",
    "21PI", "21PJ", "21PK", "21PL", "21PM", "21PN",
  ]) {
    assert.match(identity, new RegExp(`'${code}'`))
  }
})

test("NL identity normalization avoids inferred ownership and requires official HTTPS websites", () => {
  assert.match(identity, /institution_kind = 'university'/)
  assert.match(identity, /ownership_type = null/)
  assert.match(identity, /website_url = r\.website_url/)
  assert.match(identity, /without HTTPS official website/)
  assert.match(identity, /with inferred ownership_type/)
})
