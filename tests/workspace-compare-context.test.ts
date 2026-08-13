import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { resolveCareerCompareHref } from "../src/lib/workspace/career-compare-context"

test("workspace career compare preserves a supported current career", () => {
  assert.equal(
    resolveCareerCompareHref("AU", "software-developer"),
    "/compare?type=career&country=AU&profile=starting-from-scratch&careers=software-engineer",
  )
})

test("workspace compare sidebar uses the contextual career resolver instead of static defaults", () => {
  const sidebar = readFileSync("src/components/workspace/workspace-sidebar.tsx", "utf8")
  assert.match(sidebar, /resolveCareerCompareHref/)
  assert.match(sidebar, /mode\.type === "career" && currentCareerCompareHref/)
})
