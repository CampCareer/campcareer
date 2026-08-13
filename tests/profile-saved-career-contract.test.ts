import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

test("profile saved-job count uses the same saved career result contract as Home", () => {
  const profile = readFileSync("src/app/profile/page.tsx", "utf8")
  assert.match(profile, /from\("saved_career_results"\)/)
  assert.doesNotMatch(profile, /from\("saved_occupations"\)/)
})
