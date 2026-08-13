import assert from "node:assert/strict"
import test from "node:test"
import { LAUNCH_COUNTRIES } from "../src/data/launch-countries"
import { WORKSPACE_NAV_ITEMS } from "../src/lib/workspace/navigation"
import {
  compareModeLabel,
  workspaceCountryLabel,
  workspaceNavLabel,
  workspaceSidebarCopy,
} from "../src/lib/workspace/sidebar-i18n"

test("workspace navigation uses reviewed Korean shell labels", () => {
  const home = WORKSPACE_NAV_ITEMS.find((item) => item.id === "home")
  const programs = WORKSPACE_NAV_ITEMS.find((item) => item.id === "programs")
  assert.ok(home)
  assert.ok(programs)
  assert.equal(workspaceNavLabel("ko", home), "홈")
  assert.equal(workspaceNavLabel("ko", programs), "과정")
  assert.equal(compareModeLabel("ko", "program"), "과정")
  assert.equal(compareModeLabel("ko", "career"), "직업")
})

test("Korean country control does not fall back to English names", () => {
  const australia = LAUNCH_COUNTRIES.find((country) => country.code === "AU")
  const unitedKingdom = LAUNCH_COUNTRIES.find((country) => country.code === "UK")
  assert.ok(australia)
  assert.ok(unitedKingdom)
  assert.notEqual(workspaceCountryLabel("ko", australia), australia.name)
  assert.notEqual(workspaceCountryLabel("ko", unitedKingdom), unitedKingdom.name)
  assert.equal(workspaceCountryLabel("en", australia), "Australia")
})

test("workspace sidebar explanatory copy follows the active locale", () => {
  assert.equal(workspaceSidebarCopy("ko").allCountries, "전체 국가")
  assert.equal(workspaceSidebarCopy("en").allCountries, "All countries")
})
