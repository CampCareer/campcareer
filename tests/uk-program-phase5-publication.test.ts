import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const page = readFileSync("src/app/(workspace)/programs/page.tsx", "utf8")
const header = readFileSync("src/app/(workspace)/programs/programs-header.tsx", "utf8")
const explorer = readFileSync("src/app/(workspace)/programs/uk-programs-explorer.tsx", "utf8")
const detail = readFileSync("src/app/(workspace)/programs/uk/[program]/page.tsx", "utf8")
const server = readFileSync("src/lib/programs/uk-programs.server.ts", "utf8")
const seo = readFileSync("src/lib/programs/uk-program-seo.ts", "utf8")
const sitemap = readFileSync("src/app/sitemap.ts", "utf8")

test("UK programme explorer is enabled on the shared Programs route", () => {
  assert.match(page, /searchUkPrograms/)
  assert.match(page, /filters\.country === "UK"/)
  assert.match(page, /<UkProgramsExplorer/)
  assert.match(header, /PUBLISHED_PROGRAM_COUNTRIES = new Set\(\["AU", "UK"\]\)/)
  assert.match(header, /Search UK programmes or institutions/)
})

test("UK programme server reads only canonical Phase 4 read models", () => {
  assert.match(server, /from\("program_explorer_uk_v1"\)/)
  assert.match(server, /from\("program_detail_uk_v1"\)/)
  assert.doesNotMatch(server, /program_catalog_uk_staging/)
  assert.match(server, /ukProgramSlug\(row\.institution_slug, sourceKey\)/)
})

test("UK SEO allowlist contains exactly the 75 indexable programme routes", () => {
  const match = seo.match(/const INDEXABLE_UK_PROGRAM_SLUGS = `\n([\s\S]*?)\n`\.trim\(\)\.split\("\\n"\)/)
  assert.ok(match)
  const slugs = match[1].trim().split("\n").filter(Boolean)
  assert.equal(slugs.length, 75)
  assert.ok(slugs.includes("aston-university-computer-science-bsc"))
  assert.ok(!slugs.includes("university-of-glasgow-community-development-ba-xl35-2026"))
  assert.equal(new Set(slugs).size, 75)
})

test("UK detail routes keep the review-only programme accessible but noindex", () => {
  assert.match(detail, /program\.indexable && isIndexableUkProgramSlug\(program\.slug\)/)
  assert.match(detail, /robots: \{ index: indexable, follow: true \}/)
  assert.match(detail, /Back to UK programmes/)
  assert.match(detail, /CAS.*student-specific post-offer evidence/)
})

test("UK publication UI does not expose internal pipeline tier labels", () => {
  assert.doesNotMatch(explorer, /Tier A|Tier B|Phase 3|Phase 4/)
  assert.doesNotMatch(detail, /Tier A|Tier B|Phase 3|Phase 4/)
})

test("global sitemap publishes only the UK SEO allowlist", () => {
  assert.match(sitemap, /INDEXABLE_UK_PROGRAM_PATHS/)
  assert.match(sitemap, /\.\.\.INDEXABLE_UK_PROGRAM_PATHS\.map/)
})
