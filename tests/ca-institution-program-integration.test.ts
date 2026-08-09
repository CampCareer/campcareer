import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

test("Canada institution detail uses the published program summary", () => {
  const route = readFileSync("src/app/(workspace)/institutions/[country]/[institution]/page.tsx", "utf8")
  const view = readFileSync("src/app/(workspace)/institutions/canadian-institution-program-detail.tsx", "utf8")

  assert.ok(route.includes("getCaInstitutionProgramSummary"))
  assert.ok(route.includes("CanadianInstitutionProgramDetailView"))
  assert.ok(view.includes("Published career programs"))
  assert.ok(view.includes("caProgramDetailPath"))
  assert.ok(view.includes("published 80-career Canada set"))
})

test("Canada institution program queries stay inside the public publication boundary", () => {
  const server = readFileSync("src/lib/programs/ca-programs.server.ts", "utf8")

  assert.ok(server.includes("getCaInstitutionProgramSummary"))
  assert.ok(server.includes("getCaPublishedProgramCountsByInstitution"))
  assert.ok(server.includes('.eq("publicly_listed", true)'))
  assert.ok(server.includes('.eq("institution_slug", slug)'))
})

test("Canada institution explorer overrides catalogue counts with published target counts", () => {
  const server = readFileSync("src/lib/institutions/institutions.server.ts", "utf8")
  const explorer = readFileSync("src/app/(workspace)/institutions/institutions-explorer.tsx", "utf8")

  assert.ok(server.includes("getCaPublishedProgramCountsByInstitution"))
  assert.ok(server.includes('countryCode === "CA"'))
  assert.ok(explorer.includes("published programs"))
  assert.ok(explorer.includes("No published target programs"))
  assert.ok(explorer.includes("reviewed 80-career publication set"))
})
