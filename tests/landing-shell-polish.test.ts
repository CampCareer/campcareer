import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const landing = readFileSync("src/app/(workspace)/home/home-hub.tsx", "utf8")
const search = readFileSync("src/app/(workspace)/home/home-search-form.tsx", "utf8")
const topNav = readFileSync("src/components/layout/top-nav.tsx", "utf8")
const shell = readFileSync("src/components/layout/layout-shell.tsx", "utf8")
const canonicalCareer = readFileSync("src/app/(workspace)/career/[country]/[career]/page.tsx", "utf8")
const legacyCareer = readFileSync("src/app/(workspace)/career/career-result-page.tsx", "utf8")

test("landing search is centered and explains the locked CampCareer Score contract", () => {
  assert.match(landing, /mx-auto mt-9 max-w-4xl/)
  assert.match(landing, /CampCareer Score \/ 100/)
  assert.match(landing, /Demand 40%/)
  assert.match(landing, /Pay 30%/)
  assert.match(landing, /Entry 30%/)
  assert.match(landing, /required evidence is not ready/)
})

test("landing dropdowns close when the user clicks outside the active selector", () => {
  assert.match(search, /useRef<HTMLDivElement>/)
  assert.match(search, /document\.addEventListener\("pointerdown", closeOnOutsidePointer\)/)
  assert.match(search, /!rootRef\.current\?\.contains\(target\)/)
  assert.match(search, /document\.removeEventListener\("pointerdown", closeOnOutsidePointer\)/)
})

test("public navigation and Career pages keep one opaque white canvas", () => {
  assert.match(topNav, /border-\[hsl\(var\(--cc-border\)\)\] bg-white/)
  assert.doesNotMatch(topNav, /bg-white\/95|backdrop-blur/)
  assert.match(shell, /flex min-h-screen flex-col bg-white/)
  assert.match(shell, /<main className="flex-1 bg-white">/)
  assert.match(canonicalCareer, /cc-result-motion min-h-\[calc\(100vh-4rem\)\] bg-white/)
  assert.match(legacyCareer, /cc-result-motion min-h-\[calc\(100vh-4rem\)\] bg-white/)
})
