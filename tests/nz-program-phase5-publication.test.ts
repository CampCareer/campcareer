import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const page = readFileSync("src/app/(workspace)/programs/page.tsx", "utf8")
const header = readFileSync("src/app/(workspace)/programs/programs-header.tsx", "utf8")
const explorer = readFileSync("src/app/(workspace)/programs/nz-programs-explorer.tsx", "utf8")
const detail = readFileSync("src/app/(workspace)/programs/nz/[program]/page.tsx", "utf8")
const server = readFileSync("src/lib/programs/nz-programs.server.ts", "utf8")
const seo = readFileSync("src/lib/programs/nz-program-seo.ts", "utf8")
const sitemap = readFileSync("src/app/sitemap.ts", "utf8")

test("NZ programme explorer is enabled on the shared Programs route", () => {
  assert.match(page, /searchNzPrograms/)
  assert.match(page, /filters\.country === "NZ"/)
  assert.match(page, /<NzProgramsExplorer/)
  assert.match(header, /"NZ"/)
  assert.match(header, /Search New Zealand programmes or universities/)
})

test("NZ programme server reads the canonical Phase 4 detail model, not staging", () => {
  const detailReads = server.match(/from\("program_detail_nz_v1"\)/g) ?? []
  assert.equal(detailReads.length, 2)
  assert.doesNotMatch(server, /program_catalog_nz_staging/)
  assert.match(server, /nzProgramSlug\(row\.institution_slug, sourceKey\)/)
  assert.match(server, /source_program_key/)
})

test("NZ SEO allowlist contains exactly the 24 indexable programme routes", () => {
  const match = seo.match(/const INDEXABLE_NZ_PROGRAM_SLUGS = `\n([\s\S]*?)\n`\.trim\(\)\.split\("\\n"\)/)
  assert.ok(match)
  const slugs = match[1].trim().split("\n").filter(Boolean)
  assert.equal(slugs.length, 24)
  assert.ok(slugs.includes("auckland-university-of-technology-aut-bhsc-nursing"))
  assert.ok(slugs.includes("massey-university-massey-bav-air-transport-pilot"))
  assert.ok(slugs.includes("university-of-auckland-uoa-bsc-data-science"))
  assert.ok(slugs.includes("victoria-university-of-wellington-vuw-bdi-interaction-design"))
  assert.equal(new Set(slugs).size, 24)
})

test("NZ detail routes preserve admission, Code, visa and location boundaries", () => {
  assert.match(detail, /program\.indexable && isIndexableNzProgramSlug\(program\.slug\)/)
  assert.match(detail, /robots: \{ index: indexable, follow: true \}/)
  assert.match(detail, /Back to New Zealand programmes/)
  assert.match(detail, /Provider Code context/)
  assert.match(detail, /qualification-level context, not a guarantee/)
  assert.match(detail, /Programme-specific campus and city are intentionally omitted/)
})

test("NZ publication UI does not expose internal pipeline tier labels", () => {
  assert.doesNotMatch(explorer, /Tier A|Tier B|Tier C|Phase 3|Phase 4/)
  assert.doesNotMatch(detail, /Tier A|Tier B|Tier C|Phase 3|Phase 4/)
})

test("global sitemap publishes only the NZ SEO allowlist", () => {
  assert.match(sitemap, /INDEXABLE_NZ_PROGRAM_PATHS/)
  assert.match(sitemap, /\.\.\.INDEXABLE_NZ_PROGRAM_PATHS\.map/)
})
