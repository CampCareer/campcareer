import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260812012500_us_design_occupations.sql", import.meta.url),
  "utf8",
)

const designCareers = [
  ["graphic-designer", "27-1024", 42],
  ["ux-designer", "15-1255", 57],
  ["multimedia-designer", "27-1014", 50],
  ["animator", "27-1014", 50],
  ["interior-designer", "27-1025", 47],
  ["film-editor", "27-4032", 45],
  ["architect", "17-1011", 40],
  ["web-designer", "15-1255", 57],
] as const

function metricBlock(id: string) {
  const marker = `  ('US:${id}','2026-08-12'`
  const start = migration.indexOf(marker)
  if (start < 0) return undefined
  const next = migration.indexOf("\n  ('US:", start + marker.length)
  return migration.slice(start, next < 0 ? migration.length : next)
}

test("US Design covers the canonical eight Design careers", () => {
  assert.equal(designCareers.length, 8)
  for (const [id, soc] of designCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "design")
    assert.ok(editorial?.countries.US, `${id} must have US editorial content`)
    assert.ok(migration.includes(`'US:${id}'`))
    assert.ok(migration.includes(`'${soc}'`))
  }
})

test("US Design preserves shared-SOC scope boundaries instead of fabricating separate national statistics", () => {
  assert.ok(migration.includes("Web and Digital Interface Designers — UX scope"))
  assert.ok(migration.includes("Web and Digital Interface Designers — web-design scope"))
  assert.ok(migration.includes("Special Effects Artists and Animators — multimedia design scope"))
  assert.ok(migration.includes("Special Effects Artists and Animators — animator scope"))
  assert.ok(migration.includes("UX Designer and Web Designer intentionally share employment, pay, projection, industry and posting data"))
  assert.ok(migration.includes("Multimedia Designer and Animator intentionally share national labor metrics"))

  const ux = metricBlock("ux-designer")
  const web = metricBlock("web-designer")
  const multimedia = metricBlock("multimedia-designer")
  const animator = metricBlock("animator")
  assert.ok(ux && web && multimedia && animator)
  assert.match(ux, /113330,50\.00,104000,6\.98,\s*0,11,4,6,9,10,7,5,5,57/)
  assert.match(web, /113330,50\.00,104000,6\.98,\s*0,11,4,6,9,10,7,5,5,57/)
  assert.match(multimedia, /19970,49\.06,102045,1\.58,\s*0,13,4,2,9,10,3,4,5,50/)
  assert.match(animator, /19970,49\.06,102045,1\.58,\s*0,13,4,2,9,10,3,4,5,50/)
})

test("US Design v2 locks granular labor-market component calculations", () => {
  assert.ok(migration.includes("career-opportunity-us-v2 component model"))
  assert.ok(migration.includes("annual projected openings / 2024 EP employment"))
  assert.ok(migration.includes("BLS top-industry concentration proxy"))
  assert.ok(migration.includes("May-2024-to-May-2025 OEWS employment change"))
  assert.ok(migration.includes("all-occupation median hourly 24.51"))

  const expectedRows: Record<string, RegExp> = {
    "graphic-designer": /197830,30\.27,62962,2\.11,\s*0,11,4,1,9,5,3,4,5,42/,
    "ux-designer": /113330,50\.00,104000,6\.98,\s*0,11,4,6,9,10,7,5,5,57/,
    "multimedia-designer": /19970,49\.06,102045,1\.58,\s*0,13,4,2,9,10,3,4,5,50/,
    animator: /19970,49\.06,102045,1\.58,\s*0,13,4,2,9,10,3,4,5,50/,
    "interior-designer": /71500,32\.31,67205,3\.21,\s*0,13,3,6,9,5,4,4,3,47/,
    "film-editor": /25610,36\.26,75421,3\.91,\s*0,12,3,0,9,7,5,4,5,45/,
    architect: /106770,47\.73,99278,3\.88,\s*0,9,1,3,4,10,5,7,1,40/,
    "web-designer": /113330,50\.00,104000,6\.98,\s*0,11,4,6,9,10,7,5,5,57/,
  }

  for (const [id, , score] of designCareers) {
    const block = metricBlock(id)
    assert.ok(block)
    assert.match(block, expectedRows[id])
    assert.ok(block.includes(`,${score},'career-opportunity-us-v2','provisional'`))
  }
})

test("US Design stores raw demand, concentration, wage and momentum evidence behind the scores", () => {
  for (const marker of [
    "'annual_projected_openings',20000",
    "'annual_projected_openings',9100",
    "'annual_projected_openings',5000",
    "'annual_projected_openings',7800",
    "'annual_projected_openings',3600",
    "'annual_openings_intensity_pct',7.52",
    "'annual_openings_intensity_pct',8.96",
    "'oews_employment_momentum_pct',-11.26",
    "'oews_employment_momentum_pct',2.76",
    "'top_industry_share_pct',85.74",
    "'top_industry_share_pct',11.77",
    "'all_occupations_median_hourly_2025',24.51",
  ]) assert.ok(migration.includes(marker))

  assert.ok(migration.includes("'live_nlx_postings',8947"))
  assert.ok(migration.includes("'live_nlx_postings',3710"))
  assert.ok(migration.includes("'live_nlx_postings',419"))
  assert.ok(migration.includes("'live_nlx_postings',null"))
  assert.ok(migration.includes("no value is fabricated"))
})

test("US Design does not label OEWS employment momentum as vacancy YoY", () => {
  assert.ok(migration.includes("NOT vacancy YoY"))
  assert.ok(migration.includes("Employment-stock momentum proxy, not vacancy YoY"))
  assert.ok(migration.includes("not a historical vacancy YoY series"))

  for (const id of designCareers.map(([id]) => id)) {
    const block = metricBlock(id)
    assert.ok(block)
    assert.match(block, /\n\s*0,/)
  }
  assert.ok(migration.includes("No authoritative federal Graphic Designer shortage designation"))
  assert.ok(migration.includes("No authoritative federal Architect shortage designation"))
})

test("US Design models Architect licensure as a real entry burden", () => {
  const architectProfile = migration
    .split("\n")
    .find((line) => line.trimStart().startsWith("('US:architect','US','architect'"))
  assert.ok(architectProfile)
  assert.ok(architectProfile.includes("'USD',true,'State architecture licensing boards (NCARB pathway)'"))
  assert.ok(migration.includes("NCARB AXP requires 3,740 documented hours across six experience areas"))
  assert.ok(migration.includes("Nationwide state/DC licensure boundary plus documented experience and examination"))

  for (const id of ["graphic-designer","ux-designer","multimedia-designer","animator","interior-designer","film-editor","web-designer"]) {
    const line = migration.split("\n").find((item) => item.trimStart().startsWith(`('US:${id}','US','${id}'`))
    assert.ok(line)
    assert.ok(line.includes("'USD',false"))
  }
})

test("US Design publishes official evidence, current posting evidence and only reviewed Tier A programme relations", () => {
  const sourceRows = migration
    .split("\n")
    .filter((line) => line.trimStart().startsWith("('US:") && line.includes("'source'"))
  const jobRows = migration
    .split("\n")
    .filter((line) => line.trimStart().startsWith("('US:") && line.includes("'job_search'"))
  const programmeRows = migration
    .split("\n")
    .filter((line) => line.trimStart().startsWith("('US:") && line.includes("'2026-08-12')"))
    .filter((line) => line.includes("nyu-") || line.includes("cornell-") || line.includes("utaustin-") || line.includes("uw-") || line.includes("wisc-"))

  assert.equal(sourceRows.length, 42)
  assert.equal(jobRows.length, 5)
  assert.equal(programmeRows.length, 9)
  assert.ok(migration.includes("('US:architect','cornell-barch-architecture','direct','2026-08-12')"))
  assert.ok(migration.includes("('US:interior-designer','utaustin-bsid-interior-design','direct','2026-08-12')"))
  assert.ok(migration.includes("('US:multimedia-designer','nyu-bs-integrated-design-media','direct','2026-08-12')"))
  assert.ok(!migration.includes("('US:graphic-designer','nyu-"))
  assert.ok(!migration.includes("('US:film-editor','nyu-"))
  assert.ok(!migration.includes("'common_pathway'"))
})
