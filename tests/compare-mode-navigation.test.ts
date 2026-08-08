import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { COMPARE_MODE_NAV_ITEMS, resolveCompareModeType } from "../src/lib/compare-navigation"

test("Compare sidebar navigation exposes four canonical path-mode links", () => {
  assert.deepEqual(
    COMPARE_MODE_NAV_ITEMS,
    [
      { type: "program", label: "Programs", href: "/compare/programs?country=AU&field=nursing" },
      { type: "country", label: "Countries", href: "/compare/countries?goal=registered-nurse&profile=starting-from-scratch" },
      { type: "city", label: "Cities", href: "/compare/cities?country=AU" },
      { type: "career", label: "Careers", href: "/compare/careers?country=AU&profile=starting-from-scratch" },
    ],
  )
})

test("Compare sidebar navigation keeps one stable item per supported type", () => {
  assert.equal(new Set(COMPARE_MODE_NAV_ITEMS.map((item) => item.type)).size, 4)
  assert.equal(new Set(COMPARE_MODE_NAV_ITEMS.map((item) => item.href)).size, 4)
})

test("legacy query type resolver still accepts Cities as a first-class mode", () => {
  assert.equal(resolveCompareModeType(null), "program")
  assert.equal(resolveCompareModeType("program"), "program")
  assert.equal(resolveCompareModeType("country"), "country")
  assert.equal(resolveCompareModeType("city"), "city")
  assert.equal(resolveCompareModeType("career"), "career")
  assert.equal(resolveCompareModeType("cities"), "unsupported")
})

test("legacy city compare route redirects to canonical Compare Cities and is not in the sitemap", () => {
  const legacyRoute = readFileSync("src/app/(workspace)/cities/au/compare/page.tsx", "utf8")
  const sitemapSource = readFileSync("src/app/sitemap.ts", "utf8")

  assert.ok(legacyRoute.includes("buildCityCompareCanonicalHref"))
  assert.ok(!sitemapSource.includes("/cities/au/compare"))
})

test("canonical compare route supports Cities and legacy root redirects", () => {
  const canonicalRoute = readFileSync("src/app/(workspace)/compare/[mode]/page.tsx", "utf8")
  const legacyRoot = readFileSync("src/app/(workspace)/compare/page.tsx", "utf8")

  assert.ok(canonicalRoute.includes('["programs", "countries", "cities", "careers"]'))
  assert.ok(canonicalRoute.includes("getAuCityComparison"))
  assert.ok(legacyRoot.includes("canonicalCompareModeFromLegacyType"))
  assert.ok(legacyRoot.includes("permanentRedirect"))
})
