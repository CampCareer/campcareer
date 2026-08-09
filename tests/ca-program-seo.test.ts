import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

test("Canada program sitemap is gated to public indexable detail rows", () => {
  const server = readFileSync("src/lib/programs/ca-programs.server.ts", "utf8")
  const sitemap = readFileSync("src/app/(workspace)/programs/ca/sitemap.ts", "utf8")

  assert.ok(server.includes('.eq("publicly_listed", true)'))
  assert.ok(server.includes('.eq("indexable_detail", true)'))
  assert.ok(server.includes("getIndexableCaProgramsForSitemap"))
  assert.ok(sitemap.includes("getIndexableCaProgramsForSitemap"))
  assert.ok(sitemap.includes('programsCanonicalPath("CA")'))
  assert.ok(sitemap.includes("caProgramDetailPath"))
})

test("robots advertises the dedicated Canada program sitemap", () => {
  const robots = readFileSync("src/app/robots.ts", "utf8")
  assert.ok(robots.includes("/sitemap.xml"))
  assert.ok(robots.includes("/programs/ca/sitemap.xml"))
})

test("Canada detail indexing remains controlled by the publication view gate", () => {
  const detail = readFileSync("src/app/(workspace)/programs/ca/[program]/page.tsx", "utf8")
  assert.ok(detail.includes("program.indexableDetail"))
  assert.ok(detail.includes("permanentRedirect(canonicalPath)"))
})
