import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

test("Canada institution detail uses a static route and the published program summary", () => {
  const route = readFileSync("src/app/(workspace)/institutions/ca/[institution]/page.tsx", "utf8")
  const view = readFileSync("src/app/(workspace)/institutions/canadian-institution-program-detail.tsx", "utf8")

  assert.ok(route.includes("getCaInstitutionProgramSummary"))
  assert.ok(route.includes("CanadianInstitutionProgramDetailView"))
  assert.ok(view.includes("Published career programs"))
  assert.ok(view.includes("caProgramDetailPath"))
  assert.ok(view.includes("reviewed Canada publication set for the 80 target careers"))
})

test("Canada institution program queries stay inside the public publication boundary", () => {
  const server = readFileSync("src/lib/programs/ca-programs.server.ts", "utf8")

  assert.ok(server.includes("getCaInstitutionProgramSummary"))
  assert.ok(server.includes("getCaPublishedProgramCountsByInstitution"))
  assert.ok(server.includes('.eq("publicly_listed", true)'))
  assert.ok(server.includes('.eq("institution_slug", slug)'))
})

test("Canada institution explorer uses dedicated published-program counts", () => {
  const page = readFileSync("src/app/(workspace)/institutions/ca/page.tsx", "utf8")
  const explorer = readFileSync("src/app/(workspace)/institutions/ca/ca-institutions-explorer.tsx", "utf8")
  const server = readFileSync("src/lib/institutions/ca-institutions.server.ts", "utf8")

  assert.ok(page.includes("CaInstitutionsExplorer"))
  assert.ok(server.includes("getCaPublishedProgramCountsByInstitution"))
  assert.ok(server.includes("institution_explorer_ca_v1"))
  assert.ok(explorer.includes("published programs"))
  assert.ok(explorer.includes("No published target programs"))
  assert.ok(explorer.includes("reviewed 80-career Canada set"))
})

test("shared institution routes stay untouched by the Canada compatibility slice", () => {
  const sharedDetail = readFileSync("src/app/(workspace)/institutions/[country]/[institution]/page.tsx", "utf8")
  const sharedServer = readFileSync("src/lib/institutions/institutions.server.ts", "utf8")

  assert.ok(sharedDetail.includes("CanadianInstitutionDetailView"))
  assert.ok(!sharedDetail.includes("getCaInstitutionProgramSummary"))
  assert.ok(!sharedServer.includes("getCaPublishedProgramCountsByInstitution"))
})
