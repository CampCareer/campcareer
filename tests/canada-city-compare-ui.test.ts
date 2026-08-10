import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

test("Canada city compare keeps both city values side by side on mobile", () => {
  const matrix = readFileSync("src/app/(workspace)/compare/canada-cities-compare-matrix.tsx", "utf8")

  assert.ok(matrix.includes('grid grid-cols-2 border-t border-[#ecebe7]'))
  assert.ok(matrix.includes("col-span-2"))
  assert.ok(matrix.includes("md:grid-cols-[220px_minmax(0,1fr)_minmax(0,1fr)]"))
  assert.ok(matrix.includes("md:hidden"))
  assert.ok(matrix.includes("break-words"))
})

test("city selector exposes a readable mobile swap control", () => {
  const selector = readFileSync("src/app/(workspace)/compare/city-compare-selector.tsx", "utf8")

  assert.ok(selector.includes('aria-label="Swap compared cities"'))
  assert.ok(selector.includes('sm:hidden">Swap cities</span>'))
  assert.ok(selector.includes("focus:ring-4"))
  assert.ok(selector.includes("min-w-0"))
})

test("Canada city compare decision signals handle ties without inventing a winner", () => {
  const matrix = readFileSync("src/app/(workspace)/compare/canada-cities-compare-matrix.tsx", "utf8")

  assert.ok(matrix.includes("Current published midpoints are effectively the same"))
  assert.ok(matrix.includes("Published target-program counts are equal"))
  assert.ok(matrix.includes("programmeDifference === 0"))
  assert.ok(matrix.includes("Math.abs(livingDifference) < 1"))
})

test("Canada city compare distinguishes national rules and published coverage limits", () => {
  const matrix = readFileSync("src/app/(workspace)/compare/canada-cities-compare-matrix.tsx", "utf8")

  assert.ok(matrix.includes("this is not a city differentiator"))
  assert.ok(matrix.includes("The work-hours row is a national rule"))
  assert.ok(matrix.includes("No shared target careers in current published coverage"))
  assert.ok(matrix.includes("it does not require the same program identity to exist in both cities"))
})
