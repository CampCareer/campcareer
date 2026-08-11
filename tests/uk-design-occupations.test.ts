import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const profiles = readFileSync(new URL("../supabase/migrations/20260810200128_uk_design_profiles.sql", import.meta.url), "utf8")
const metrics = readFileSync(new URL("../supabase/migrations/20260810200154_uk_design_metrics.sql", import.meta.url), "utf8")
const links = readFileSync(new URL("../supabase/migrations/20260810200221_uk_design_links_and_programs.sql", import.meta.url), "utf8")
const migration = `${profiles}\n${metrics}\n${links}`

const designCareers = [
  ["graphic-designer", "2142", 22],
  ["ux-designer", "2141", 26],
  ["multimedia-designer", "2142", 22],
  ["animator", "2142", 26],
  ["interior-designer", "3421", 22],
  ["film-editor", "3416", 26],
  ["architect", "2451", 22],
  ["web-designer", "2141", 26],
] as const

test("UK Design cohort covers the canonical eight design careers", () => {
  for (const [id, soc] of designCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "design")
    assert.ok(editorial?.countries.UK, `${id} must have UK editorial content`)
    assert.ok(profiles.includes(`'${id}'`))
    assert.ok(profiles.includes(`'${soc}'`))
  }
})

test("UK Design preserves exact SOC sub-unit scopes", () => {
  for (const fragment of [
    "'UK:graphic-designer','2142/99'",
    "'UK:ux-designer','2141/02'",
    "'UK:multimedia-designer','2142/99'",
    "'UK:animator','2142/01'",
    "'UK:interior-designer','3421/00'",
    "'UK:film-editor','3416/03'",
    "'UK:architect','2451/01'",
    "'UK:web-designer','2141/03'",
  ]) assert.ok(links.includes(fragment))

  assert.ok(metrics.includes("digital animation scope"))
  assert.ok(metrics.includes("film/video post-production editor scope"))
})

test("UK Design opportunity scores keep shortage and immigration evidence separate", () => {
  for (const [id, , score] of designCareers) {
    assert.ok(metrics.includes(`'UK:${id}'`))
    assert.ok(metrics.includes(`,${score},'career-opportunity-uk-v1'`))
  }

  assert.ok(metrics.includes("'UK:graphic-designer','2026-08-10',null,17.13,33400,0,0,0,0,8,4,0,5,5,22"))
  assert.ok(metrics.includes("Graphic Designer hiring down about 28% year on year"))
  assert.ok(metrics.includes("'UK:ux-designer','2026-08-10',null,22.46,43800,0,0,0,0,8,8,0,5,5,26"))
  assert.ok(metrics.includes("'UK:interior-designer','2026-08-10',null,18.05,35200,0,0,0,0,8,6,0,3,5,22"))
  assert.ok(metrics.includes("'UK:film-editor','2026-08-10',null,19.54,38100,0,0,0,0,12,6,0,3,5,26"))
  assert.ok(metrics.includes("'UK:architect','2026-08-10',null,24.41,47600,0,0,0,0,6,10,0,5,1,22"))

  const scoreRows = metrics.split("\n").filter((line) => line.startsWith("('UK:"))
  assert.equal(scoreRows.length, 8)
  for (const row of scoreRows) assert.match(row, /,0,0,0,0,/)
})

test("UK Architect is the only statutorily registered Design profile", () => {
  assert.ok(profiles.includes("'UK:architect','UK','architect'"))
  assert.ok(profiles.includes("'2451','GBP',true,'Architects Registration Board'"))
  assert.ok(metrics.includes("Architect is a protected title and ARB registration is required"))
  for (const id of ["graphic-designer","ux-designer","multimedia-designer","animator","interior-designer","film-editor","web-designer"]) {
    const line = profiles.split("\n").find((item) => item.includes(`'UK:${id}'`))
    assert.ok(line)
    assert.ok(line.includes("'GBP',false,null,null"))
  }
})

test("UK Design publishes all eight official entry routes", () => {
  for (const marker of ["OCC0625","OCC0470","OCC0488","OCC1361","OCC0933","OCC0533"]) assert.ok(links.includes(marker))
})

test("UK Design publishes exactly eight verified canonical programme links", () => {
  const programRefs = links.match(/uk-program:/g) ?? []
  assert.equal(programRefs.length, 8)
  for (const marker of [
    "uk-program:dd1aa240-aeb3-481c-817e-6a68c71c670f",
    "uk-program:f7f17bb6-ffae-d808-a363-eddf25b5468f",
    "uk-program:3d6fd3dd-bc0e-2879-4d47-2c653821ef53",
    "uk-program:4d13860d-09b9-9ba9-e0f9-d5e0727111f9",
    "uk-program:f03cb1bf-df03-0fe0-c4dc-64d1319b3cdf",
    "uk-program:1cae92ac-ac2c-60bd-3e7c-64a9a0d7dcb8",
    "uk-program:1611511e-6c28-2598-0a87-8941cdaaf6b8",
    "uk-program:7e7dadd5-1276-1c94-b15f-87a34a9d4669",
  ]) assert.ok(links.includes(marker))
  assert.ok(links.includes("'UK:architect','uk-program:f7f17bb6-ffae-d808-a363-eddf25b5468f','progression'"))
})
