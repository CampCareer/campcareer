import assert from "node:assert/strict"
import test from "node:test"
import { COMPARE_MODE_NAV_ITEMS, resolveCompareModeType } from "../src/lib/compare-navigation"

test("Compare sidebar navigation exposes the four canonical links", () => {
  assert.deepEqual(
    COMPARE_MODE_NAV_ITEMS,
    [
      { type: "program", label: "Programs", href: "/compare?type=program&country=AU&field=nursing" },
      { type: "country", label: "Countries", href: "/compare?type=country&goal=registered-nurse&profile=starting-from-scratch" },
      { type: "city", label: "Cities", href: "/compare?type=city&country=AU" },
      { type: "career", label: "Careers", href: "/compare?type=career&country=AU&profile=starting-from-scratch" },
    ],
  )
})

test("Compare sidebar navigation keeps one stable item per supported type", () => {
  assert.equal(new Set(COMPARE_MODE_NAV_ITEMS.map((item) => item.type)).size, 4)
  assert.equal(new Set(COMPARE_MODE_NAV_ITEMS.map((item) => item.href)).size, 4)
})

test("Compare mode resolver accepts Cities as a first-class mode", () => {
  assert.equal(resolveCompareModeType(null), "program")
  assert.equal(resolveCompareModeType("program"), "program")
  assert.equal(resolveCompareModeType("country"), "country")
  assert.equal(resolveCompareModeType("city"), "city")
  assert.equal(resolveCompareModeType("career"), "career")
  assert.equal(resolveCompareModeType("cities"), "unsupported")
})
