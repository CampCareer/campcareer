import assert from "node:assert/strict"
import test from "node:test"
import { COMPARE_MODE_NAV_ITEMS } from "../src/app/(workspace)/compare/compare-mode-navigation"

test("Compare mode navigation exposes the three canonical links", () => {
  assert.deepEqual(
    COMPARE_MODE_NAV_ITEMS,
    [
      { type: "program", label: "Programs", href: "/compare?type=program" },
      { type: "country", label: "Countries", href: "/compare?type=country&goal=registered-nurse&profile=starting-from-scratch" },
      { type: "career", label: "Careers", href: "/compare?type=career&country=AU&profile=starting-from-scratch" },
    ],
  )
})

test("Compare mode navigation keeps one stable item per supported type", () => {
  assert.equal(new Set(COMPARE_MODE_NAV_ITEMS.map((item) => item.type)).size, 3)
  assert.equal(new Set(COMPARE_MODE_NAV_ITEMS.map((item) => item.href)).size, 3)
})
