import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260811103416_ie_design_occupations.sql", import.meta.url),
  "utf8",
)

const designCareers = [
  ["graphic-designer", "3421", 19],
  ["ux-designer", "2137", 23],
  ["multimedia-designer", null, 21],
  ["animator", "3411", 21],
  ["interior-designer", "3422", 19],
  ["film-editor", "3416", 19],
  ["architect", "2431", 15],
  ["web-designer", "2137", 23],
] as const

function metricRow(id: string) {
  return migration.split("\n").find((line) => line.includes(`('IE:${id}','2026-08-11'`))
}

function profileRow(id: string) {
  return migration.split("\n").find((line) => line.includes(`('IE:${id}','IE','${id}'`))
}

test("Ireland Design covers the canonical eight careers", () => {
  assert.equal(designCareers.length, 8)
  for (const [id] of designCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "design")
    assert.ok(editorial?.countries.IE, `${id} must have Ireland editorial content`)
    assert.ok(migration.includes(`'IE:${id}'`))
  }
})

test("Ireland Design preserves bounded SOC 2010 scopes", () => {
  assert.ok(profileRow("graphic-designer")?.includes("'3421','EUR'"))
  assert.ok(profileRow("ux-designer")?.includes("'2137','EUR'"))
  assert.ok(profileRow("animator")?.includes("'3411','EUR'"))
  assert.ok(profileRow("interior-designer")?.includes("'3422','EUR'"))
  assert.ok(profileRow("film-editor")?.includes("'3416','EUR'"))
  assert.ok(profileRow("architect")?.includes("'2431','EUR'"))
  assert.ok(profileRow("web-designer")?.includes("'2137','EUR'"))

  assert.ok(profileRow("multimedia-designer")?.includes("'SOC','SOC 2010',null,'EUR'"))
  assert.ok(migration.includes("'IE:multimedia-designer','3421','Graphic designers — visual/multimedia design scope'"))
  assert.ok(migration.includes("'IE:multimedia-designer','2137','Web design and development professionals — web/digital multimedia scope'"))
})

test("Ireland Design keeps salary vacancy growth and shortage unscored", () => {
  for (const [id] of designCareers) {
    const row = metricRow(id)
    assert.ok(row, `${id} metric row must exist`)
    assert.match(row, /'2026-08-11',null,null,null,0,0,0,0,/)
    assert.ok(row.includes("'career-opportunity-ie-v1','provisional'"))
  }
})

test("Ireland Design separates direct conditional and ordinary permit treatment", () => {
  assert.match(metricRow("ux-designer")!, /null,null,null,0,0,0,0,8,0,0,10,5,23/)
  assert.match(metricRow("web-designer")!, /null,null,null,0,0,0,0,8,0,0,10,5,23/)
  assert.match(metricRow("multimedia-designer")!, /null,null,null,0,0,0,0,8,0,0,8,5,21/)
  assert.match(metricRow("animator")!, /null,null,null,0,0,0,0,8,0,0,8,5,21/)
  assert.match(metricRow("graphic-designer")!, /null,null,null,0,0,0,0,8,0,0,6,5,19/)
  assert.match(metricRow("interior-designer")!, /null,null,null,0,0,0,0,8,0,0,6,5,19/)
  assert.match(metricRow("film-editor")!, /null,null,null,0,0,0,0,8,0,0,6,5,19/)
  assert.match(metricRow("architect")!, /null,null,null,0,0,0,0,4,0,0,10,1,15/)

  assert.ok(migration.includes("SOC 2137 Web design and development professionals is explicitly on the current Critical Skills Occupations List"))
  assert.ok(migration.includes("Generic Graphic Designer is not itself named on the current Critical Skills list"))
  assert.ok(migration.includes("Generic Animator is broader than those named employments"))
})

test("Ireland Design preserves animation specialism boundaries", () => {
  assert.ok(migration.includes("'IE:animator','3411','Animation Background and Design Artist in 2D or 3D animation — conditional CSEP specialism'"))
  assert.ok(migration.includes("'IE:animator','3421','Animation layout / character / location / prop design — conditional CSEP specialisms'"))
  assert.ok(migration.includes("Art Director 2473 and Games Rigger 3417 are separate occupations"))
  assert.ok(migration.includes("Specific 3421 animation design roles are CSEP-eligible, but that specialist treatment is not borrowed by generic graphic design"))
})

test("Ireland Design keeps Interior Designer separate from Architect", () => {
  assert.ok(migration.includes("Interior Designer is not promoted to Architect SOC 2431 and does not borrow architect CSEP or statutory registration treatment"))
  assert.ok(profileRow("interior-designer")?.includes("'3422','EUR',false,null,null"))
})

test("Ireland Design applies statutory registration only to Architect", () => {
  for (const [id] of designCareers) {
    const row = profileRow(id)
    assert.ok(row)
    if (id === "architect") {
      assert.ok(row.includes("'2431','EUR',true,'Royal Institute of the Architects of Ireland — statutory Registration Body'"))
    } else {
      assert.ok(row.includes("'EUR',false,null,null"))
    }
  }

  assert.ok(migration.includes("The Building Control Act 2007 protects the title Architect in Ireland"))
  assert.ok(migration.includes("prescribed five-year architecture qualification plus at least two years of approved postgraduate professional training"))
  assert.ok(migration.includes("'IE:architect','entry_program','RIAI — route to Registration as an Architect'"))
})

test("Ireland Design publishes no Tier B programme relations", () => {
  assert.ok(!migration.includes("insert into public.country_occupation_program_links"))
  assert.ok(!migration.includes("ie-program:"))
})
