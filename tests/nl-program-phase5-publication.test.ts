import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const page = readFileSync("src/app/(workspace)/programs/page.tsx", "utf8")
const header = readFileSync("src/app/(workspace)/programs/programs-header.tsx", "utf8")
const explorer = readFileSync("src/app/(workspace)/programs/nl-programs-explorer.tsx", "utf8")
const detail = readFileSync("src/app/(workspace)/programs/nl/[program]/page.tsx", "utf8")
const server = readFileSync("src/lib/programs/nl-programs.server.ts", "utf8")
const seo = readFileSync("src/lib/programs/nl-program-seo.ts", "utf8")
const sitemap = readFileSync("src/app/sitemap.ts", "utf8")

test("NL programme explorer is enabled on the shared Programs route", () => {
  assert.match(page, /searchNlPrograms/)
  assert.match(page, /filters\.country === "NL"/)
  assert.match(page, /<NlProgramsExplorer/)
  assert.match(header, /"NL"/)
  assert.match(header, /Search Netherlands programmes or institutions/)
})

test("NL programme server reads the canonical Phase 4 detail model, not staging", () => {
  const detailReads = server.match(/from\("program_detail_nl_v1"\)/g) ?? []
  assert.equal(detailReads.length, 2)
  assert.doesNotMatch(server, /program_catalog_nl_staging/)
  assert.match(server, /nlProgramSlug\(row\.institution_slug, sourceKey\)/)
  assert.match(server, /source_program_key/)
})

test("NL SEO allowlist contains exactly the 26 indexable programme routes", () => {
  const match = seo.match(/const INDEXABLE_NL_PROGRAM_SLUGS = `\n([\s\S]*?)\n`\.trim\(\)\.split\("\\n"\)/)
  assert.ok(match)
  const slugs = match[1].trim().split("\n").filter(Boolean)
  assert.equal(slugs.length, 26)
  assert.ok(slugs.includes("maastricht-university-maastricht-data-science-ai"))
  assert.ok(slugs.includes("university-of-amsterdam-uva-business-analytics"))
  assert.equal(new Set(slugs).size, 26)
})

test("NL detail routes preserve current admission state and indexability", () => {
  assert.match(detail, /program\.indexable && isIndexableNlProgramSlug\(program\.slug\)/)
  assert.match(detail, /robots: \{ index: indexable, follow: true \}/)
  assert.match(detail, /Back to Netherlands programmes/)
  assert.match(detail, /Recognised sponsor status, programme recognition and current admission availability are separate facts/)
})

test("NL publication UI does not expose internal pipeline tier labels", () => {
  assert.doesNotMatch(explorer, /Tier A|Tier B|Tier C|Phase 3|Phase 4/)
  assert.doesNotMatch(detail, /Tier A|Tier B|Tier C|Phase 3|Phase 4/)
})

test("global sitemap publishes only the NL SEO allowlist", () => {
  assert.match(sitemap, /INDEXABLE_NL_PROGRAM_PATHS/)
  assert.match(sitemap, /\.\.\.INDEXABLE_NL_PROGRAM_PATHS\.map/)
})
