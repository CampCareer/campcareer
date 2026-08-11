import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260811135626_us_construction_occupations.sql", import.meta.url),
  "utf8",
)

const constructionCareers = [
  ["carpenter", "47-2031", 30],
  ["electrician", "47-2111", 32],
  ["plumber", "47-2152", 29],
  ["wall-floor-tiler", "47-2044", 38],
  ["welder", "51-4121", 26],
  ["bricklayer", "47-2021", 29],
  ["hvac-technician", "49-9021", 29],
  ["construction-manager", "11-9021", 34],
] as const

function metricRow(id: string) {
  return migration.split("\n").find((line) => line.includes(`('US:${id}','2026-08-11'`))
}

test("US Construction covers the canonical eight careers", () => {
  assert.equal(constructionCareers.length, 8)
  for (const [id, soc] of constructionCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "trades")
    assert.ok(editorial?.countries.US, `${id} must have US editorial content`)
    assert.ok(migration.includes(`'US:${id}'`))
    assert.ok(migration.includes(`'${soc}'`))
  }
})

test("US Construction preserves exact SOC 2018 scopes", () => {
  for (const marker of [
    "'US:carpenter','US','carpenter','Carpenters','SOC','SOC 2018','47-2031'",
    "'US:electrician','US','electrician','Electricians','SOC','SOC 2018','47-2111'",
    "'US:plumber','US','plumber','Plumbers, pipefitters, and steamfitters — plumber scope','SOC','SOC 2018','47-2152'",
    "'US:wall-floor-tiler','US','wall-floor-tiler','Tile and stone setters','SOC','SOC 2018','47-2044'",
    "'US:welder','US','welder','Welders, cutters, solderers, and brazers — welder scope','SOC','SOC 2018','51-4121'",
    "'US:bricklayer','US','bricklayer','Brickmasons and blockmasons','SOC','SOC 2018','47-2021'",
    "'US:hvac-technician','US','hvac-technician','Heating, air conditioning, and refrigeration mechanics and installers','SOC','SOC 2018','49-9021'",
    "'US:construction-manager','US','construction-manager','Construction managers','SOC','SOC 2018','11-9021'",
  ]) assert.ok(migration.includes(marker))

  assert.ok(migration.includes("constrained to plumber work"))
  assert.ok(migration.includes("canonical wall/floor tiler excludes carpet and general floor-layer occupations"))
  assert.ok(migration.includes("constrained to welder work"))
})

test("US Construction does not invent a national shortage list", () => {
  for (const [id] of constructionCareers) {
    assert.match(metricRow(id)!, /,0,0,0,0,/)
  }
  assert.ok(migration.includes("no national shortage-occupation list used for this cohort"))
  assert.ok(migration.includes("Strong projected growth is not converted into a formal national shortage designation"))
})

test("US Construction stores current BLS national pay and projections", () => {
  const expected = [
    ["carpenter", 959000, 59310, "4 percent"],
    ["electrician", 818700, 62350, "9 percent"],
    ["plumber", 504500, 62970, "4 percent"],
    ["wall-floor-tiler", 52600, 52240, "10 percent"],
    ["welder", 457300, 51000, "2 percent"],
    ["bricklayer", 74100, 60800, "3 percent"],
    ["hvac-technician", 425200, 59810, "8 percent"],
    ["construction-manager", 550300, 106980, "9 percent"],
  ] as const

  for (const [id, employment, salary, growthText] of expected) {
    const row = metricRow(id)
    assert.ok(row)
    assert.ok(row.includes(`'2026-08-11',${employment},`))
    assert.ok(row.includes(`,${salary},0,0,0,0,`))
    assert.ok(migration.includes(growthText))
  }
})

test("US Construction locks US v1 component scores", () => {
  const expectedRows: Record<string, RegExp> = {
    carpenter: /959000,28\.51,59310,0,0,0,0,12,4,5,4,5,30/,
    electrician: /818700,null,62350,0,0,0,0,12,6,8,4,2,32/,
    plumber: /504500,null,62970,0,0,0,0,12,6,5,4,2,29/,
    "wall-floor-tiler": /52600,null,52240,0,0,0,0,15,4,10,4,5,38/,
    welder: /457300,24\.52,51000,0,0,0,0,12,4,2,4,4,26/,
    bricklayer: /74100,null,60800,0,0,0,0,12,6,2,4,5,29/,
    "hvac-technician": /425200,28\.75,59810,0,0,0,0,10,4,8,4,3,29/,
    "construction-manager": /550300,null,106980,0,0,0,0,6,10,8,5,5,34/,
  }

  for (const [id, , score] of constructionCareers) {
    const row = metricRow(id)
    assert.ok(row)
    assert.match(row, expectedRows[id])
    assert.ok(row.includes(`,${score},'career-opportunity-us-v1','provisional'`))
  }
})

test("US Construction keeps immigration routes conditional", () => {
  for (const id of ["carpenter", "electrician", "plumber", "wall-floor-tiler", "welder", "bricklayer", "hvac-technician"]) {
    assert.match(metricRow(id)!, /,4,[2345],\d+,'career-opportunity-us-v1'/)
  }
  assert.match(metricRow("construction-manager")!, /,5,5,34,'career-opportunity-us-v1'/)
  assert.ok(migration.includes("H-2B is limited to temporary nonagricultural need"))
  assert.ok(migration.includes("PERM can support permanent employer sponsorship"))
  assert.ok(migration.includes("H-1B is only possible where the specific job qualifies as a specialty occupation"))
})

test("US Construction preserves state and federal credential boundaries", () => {
  for (const [id, soc] of constructionCareers) {
    const row = migration.split("\n").find((line) => line.includes(`('US:${id}','US','${id}'`))
    assert.ok(row)
    assert.ok(row.includes(`'${soc}','USD',false,null,null`))
  }

  assert.ok(migration.includes("most states require electricians to be licensed"))
  assert.ok(migration.includes("most states require plumbers to be licensed"))
  assert.ok(migration.includes("EPA Section 608 certification is federally required"))
  assert.ok(migration.includes("state/local licensing may also apply"))
})

test("US Construction publishes only the reviewed Tier A programme relations", () => {
  const programmeRows = migration
    .split("\n")
    .filter((line) => line.trimStart().startsWith("('US:construction-manager'") && line.includes("'related','2026-08-11'"))
  assert.equal(programmeRows.length, 3)
  assert.ok(migration.includes("'umich-bse-civil-engineering','related'"))
  assert.ok(migration.includes("'uw-bs-civil-engineering','related'"))
  assert.ok(migration.includes("'utaustin-bs-civil-engineering','related'"))

  for (const id of ["carpenter", "electrician", "plumber", "wall-floor-tiler", "welder", "bricklayer", "hvac-technician"]) {
    assert.ok(!migration.includes(`('US:${id}','umich-`))
    assert.ok(!migration.includes(`('US:${id}','uw-`))
    assert.ok(!migration.includes(`('US:${id}','utaustin-`))
  }
})
