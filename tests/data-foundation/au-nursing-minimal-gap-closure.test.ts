import assert from "node:assert/strict"
import { readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"
import { test } from "node:test"

const packageDir = join(process.cwd(), "data/canonical-candidates/au-nursing/2026-08-02")
const readJsonl = (name: string) => readFileSync(join(packageDir, name), "utf8").trim().split("\n").map((line) => JSON.parse(line))

test("AU nursing candidate package resolves only the allowlisted products", () => {
  const allowed = new Set(["qut-bachelor-nursing", "unisc-bachelor-nursing-science", "unisc-graduate-entry-nursing-science"])
  const identities = readJsonl("programme_identity.jsonl")
  assert.equal(identities.length, 3)
  assert.deepEqual(new Set(identities.map((row) => row.productProgramId)), allowed)
  assert.ok(identities.every((row) => row.resolutionStatus === "resolved" && row.fuzzyMatch === false && row.generatedUuid === false))
})

test("candidate values are source-linked and null-safe", () => {
  const snapshots = new Set(readJsonl("source_snapshots.jsonl").map((row) => row.snapshotId))
  const observations = readJsonl("metric_observations.jsonl")
  assert.ok(observations.length > 0)
  assert.ok(observations.every((row) => snapshots.has(row.sourceSnapshotId) && row.value != null))
  const updates = readJsonl("programme_candidate_updates.jsonl")
  assert.equal(updates.length, 3)
  assert.ok(updates.every((row) => row.missingFields.includes("accreditation") && row.professionalOutcome === null))
  for (const row of updates) {
    for (const key of ["institutionName", "programmeName", "qualification", "campus", "location", "duration", "annualTuition", "entryRequirements"]) {
      assert.ok(row[key] === null || row[key].sourceIds.every((id: string) => snapshots.has(id)), `${row.productProgramId}:${key}`)
    }
  }
})

test("package is candidate-only and contains no unexpected files", () => {
  const names = new Set(readdirSync(packageDir))
  for (const required of ["programme_identity.jsonl", "sources.jsonl", "source_snapshots.jsonl", "metric_observations.jsonl", "programme_candidate_updates.jsonl", "gap_matrix.json", "conflict_register.json", "validation_report.json", "README.md"]) assert.ok(names.has(required), required)
  assert.equal(JSON.parse(readFileSync(join(packageDir, "validation_report.json"), "utf8")).productionDatabaseWrites, 0)
})
