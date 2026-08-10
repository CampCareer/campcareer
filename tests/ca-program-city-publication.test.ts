import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

test("Canada city publication summaries use only the public program boundary", () => {
  const server = readFileSync("src/lib/programs/ca-program-city-publication.server.ts", "utf8")

  assert.ok(server.includes('from("ca_program_publication_v1")'))
  assert.ok(server.includes('.eq("publicly_listed", true)'))
  assert.ok(server.includes('.ilike("city", name)'))
  assert.ok(server.includes("CA_PUBLISHED_CITY_SLUGS"))
})

test("Canada city comparison publication layer compares shared target careers, not legacy city programme ids", () => {
  const server = readFileSync("src/lib/programs/ca-program-city-publication.server.ts", "utf8")

  assert.ok(server.includes("getCaPublishedCityPairSummary"))
  assert.ok(server.includes("sharedCareerIds"))
  assert.ok(server.includes("sharedCareerCount"))
  assert.ok(!server.includes("city_programme_directory_ca_v1"))
})
