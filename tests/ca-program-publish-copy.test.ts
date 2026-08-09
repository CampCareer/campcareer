import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

test("Canada program filters use product language instead of internal pipeline labels", () => {
  const source = readFileSync("src/app/(workspace)/programs/ca-programs-filters.tsx", "utf8")

  assert.ok(!source.includes("Phase 3"))
  assert.ok(!source.includes("Approved"))
  assert.ok(!source.includes("unknown을 유지"))
  assert.ok(!source.includes("Unknown is preserved"))

  assert.ok(source.includes("Program city"))
  assert.ok(source.includes("All program cities"))
  assert.ok(source.includes("Source evidence"))
  assert.ok(source.includes("All reviewed programs"))
})
