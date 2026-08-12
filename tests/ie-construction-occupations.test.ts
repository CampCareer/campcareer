import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260810202907_ie_construction_occupations.sql", import.meta.url),
  "utf8",
)

const constructionCareers = [
  ["carpenter", "5315", 37],
  ["electrician", "5241", 28],
  ["plumber", "5314", 29],
  ["wall-floor-tiler", "5322", 18],
  ["welder", "5215", 35],
  ["bricklayer", "5312", 22],
  ["hvac-technician", "5225", 20],
  ["construction-manager", "2436", 35],
] as const

test("Ireland Construction covers the canonical eight trades careers", () => {
  for (const [id, soc] of constructionCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "trades")
    assert.ok(editorial?.countries.IE, `${id} must have Ireland editorial content`)
    assert.ok(migration.includes(`'IE:${id}'`))
    assert.ok(migration.includes(`'${soc}'`))
  }
})

test("Ireland Construction preserves exact SOC 2010 scope and manager dual scope", () => {
  for (const marker of [
    "'IE:carpenter','5315','Carpenters and joiners'",
    "'IE:electrician','5241','Electricians and electrical fitters'",
    "'IE:plumber','5314','Plumbers and heating and ventilating engineers'",
    "'IE:wall-floor-tiler','5322','Floorers and wall tilers'",
    "'IE:welder','5215','Welding trades'",
    "'IE:bricklayer','5312','Bricklayers and masons'",
    "'IE:hvac-technician','5225','Air-conditioning and refrigeration engineers'",
    "'IE:construction-manager','2436','Construction project managers / Construction Planner / Construction Scheduler'",
    "'IE:construction-manager','1122','Site Manager'",
  ]) assert.ok(migration.includes(marker))
})

test("Ireland Construction uses conservative evidence-backed opportunity scoring", () => {
  for (const [id, , score] of constructionCareers) {
    assert.ok(migration.includes(`'IE:${id}','2026-08-10'`))
    assert.ok(migration.includes(`,${score},'career-opportunity-ie-v1','provisional'`))
  }

  assert.ok(migration.includes("'IE:carpenter','2026-08-10',null,null,null,15,0,0,0,12,0,0,6,4,37"))
  assert.ok(migration.includes("'IE:electrician','2026-08-10',null,null,null,8,0,0,0,12,0,0,6,2,28"))
  assert.ok(migration.includes("'IE:plumber','2026-08-10',null,null,null,8,0,0,0,12,0,0,6,3,29"))
  assert.ok(migration.includes("'IE:wall-floor-tiler','2026-08-10',null,null,null,0,0,0,0,8,0,0,6,4,18"))
  assert.ok(migration.includes("'IE:welder','2026-08-10',null,null,null,15,0,0,0,10,0,0,6,4,35"))
  assert.ok(migration.includes("'IE:bricklayer','2026-08-10',null,null,null,0,0,0,0,12,0,0,6,4,22"))
  assert.ok(migration.includes("'IE:hvac-technician','2026-08-10',null,null,null,0,0,0,0,12,0,0,6,2,20"))
  assert.ok(migration.includes("'IE:construction-manager','2026-08-10',null,null,null,15,0,0,0,6,0,0,10,4,35"))

  assert.ok(migration.includes("Construction SEO statutory minimum rates are not treated as median salary"))
  assert.ok(!migration.includes("23.74"))
})

test("Ireland Construction keeps permit access separate from shortage evidence", () => {
  for (const id of ["carpenter","electrician","plumber","wall-floor-tiler","welder","bricklayer","hvac-technician"]) {
    assert.ok(migration.includes(`'IE:${id}','source','DETE — General Employment Permit'`))
  }
  assert.ok(migration.includes("'IE:construction-manager','source','DETE — Critical Skills Occupations List'"))
  assert.ok(migration.includes("Critical Skills Occupations List includes SOC 2436 Construction project managers and SOC 1122 Site Manager"))
})

test("Ireland Construction models regulation at the correct sub-scope", () => {
  assert.ok(migration.includes("CRU Safe Electric and require REC scope"))
  assert.ok(migration.includes("regulated gas works require RGI registration"))
  assert.ok(migration.includes("F-gas installation/service/repair/recovery work requires appropriate personnel certification"))

  const profileRows = migration.split("\n").filter((line) => line.startsWith("('IE:") && line.includes("'EUR',false"))
  assert.equal(profileRows.length, 8)
})

test("Ireland Construction publishes only verified structured entry routes", () => {
  const entryRows = migration
    .split("\n")
    .filter((line) => line.startsWith("('IE:") && line.includes("'entry_program'"))
  assert.equal(entryRows.length, 6)

  for (const marker of [
    "Carpentry and Joinery craft route",
    "Electrical craft route",
    "Plumbing craft route",
    "Metal Fabrication craft route (related welding pathway)",
    "Brick and Stonelaying craft route",
    "Refrigeration craft route",
  ]) assert.ok(migration.includes(marker))

  assert.ok(!migration.includes("'IE:wall-floor-tiler','entry_program'"))
  assert.ok(!migration.includes("'IE:construction-manager','entry_program'"))
})

test("Ireland Construction does not publish programme links while IE programme Tier A is empty", () => {
  assert.ok(!migration.includes("country_occupation_program_links"))
  assert.ok(!migration.includes("ie-program:"))
})
