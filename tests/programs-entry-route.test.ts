import assert from "node:assert/strict"
import test from "node:test"
import { readFile } from "node:fs/promises"

test("the default programs route does not add a country query parameter on mount", async () => {
  const header = await readFile(
    new URL("../src/app/(workspace)/programs/programs-header.tsx", import.meta.url),
    "utf8",
  )

  assert.doesNotMatch(header, /if \(!countryExplicit\) replace\(/)
  assert.doesNotMatch(header, /countryExplicit/)
})
