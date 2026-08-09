import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { caProgramCityPath } from "../src/lib/programs/ca-program-city-routes"

test("Canada program city routes are bounded to published city profiles", () => {
  assert.equal(caProgramCityPath("Toronto"), "/cities/ca/toronto")
  assert.equal(caProgramCityPath(" vancouver "), "/cities/ca/vancouver")
  assert.equal(caProgramCityPath("Halifax"), null)
  assert.equal(caProgramCityPath(null), null)
})

test("Canada program cards and details link only resolvable city profiles", () => {
  const card = readFileSync("src/app/(workspace)/programs/ca-program-card.tsx", "utf8")
  const detail = readFileSync("src/app/(workspace)/programs/ca/[program]/page.tsx", "utf8")

  assert.ok(card.includes("caProgramCityPath"))
  assert.ok(card.includes("cityHref"))
  assert.ok(detail.includes("caProgramCityPath"))
  assert.ok(detail.includes("cityProfilePath"))
  assert.ok(detail.includes("City profile"))
})
