import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260810222540_ie_engineering_occupations.sql", import.meta.url),
  "utf8",
)

const engineeringCareers = [
  ["civil-engineer", "2121", 43],
  ["mechanical-engineer", "2122", 43],
  ["electrical-engineer", "2123", 43],
  ["manufacturing-engineer", "2127", 36],
  ["industrial-engineer", "2127", 36],
  ["chemical-engineer", "2127", 38],
  ["environmental-engineer", "2129", 19],
  ["engineering-technician", "3113", 33],
] as const

test("Ireland Engineering covers the canonical eight engineering careers", () => {
  for (const [id, soc] of engineeringCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "engineering")
    assert.ok(editorial?.countries.IE, `${id} must have Ireland editorial content`)
    assert.ok(migration.includes(`'IE:${id}'`))
    assert.ok(migration.includes(`'${soc}'`))
  }
})

test("Ireland Engineering preserves SOC 2010 professional and technician boundaries", () => {
  for (const marker of [
    "'IE:civil-engineer','IE','civil-engineer','Civil engineers','SOC','SOC 2010','2121'",
    "'IE:mechanical-engineer','IE','mechanical-engineer','Mechanical engineers','SOC','SOC 2010','2122'",
    "'IE:electrical-engineer','IE','electrical-engineer','Electrical engineers','SOC','SOC 2010','2123'",
    "'IE:manufacturing-engineer','IE','manufacturing-engineer','Production and process engineers — manufacturing engineering scope','SOC','SOC 2010','2127'",
    "'IE:industrial-engineer','IE','industrial-engineer','Production and process engineers — industrial engineering scope','SOC','SOC 2010','2127'",
    "'IE:chemical-engineer','IE','chemical-engineer','Production and process engineers — Chemical Engineer scope','SOC','SOC 2010','2127'",
    "'IE:environmental-engineer','IE','environmental-engineer','Engineering professionals n.e.c. — environmental engineering scope','SOC','SOC 2010','2129'",
    "'IE:engineering-technician','IE','engineering-technician','Engineering technicians','SOC','SOC 2010','3113'",
  ]) assert.ok(migration.includes(marker))

  assert.ok(migration.includes("distinct from craft Electrician SOC 5241"))
  assert.ok(migration.includes("kept separate from 3114 building/civil engineering technicians"))
})

test("Ireland Engineering uses conservative evidence-backed opportunity scoring", () => {
  for (const [id, , score] of engineeringCareers) {
    assert.ok(migration.includes(`'IE:${id}','2026-08-10'`))
    assert.ok(migration.includes(`,${score},'career-opportunity-ie-v1','provisional'`))
  }

  assert.ok(migration.includes("'IE:civil-engineer','2026-08-10',null,null,null,20,0,0,0,8,0,0,10,5,43"))
  assert.ok(migration.includes("'IE:mechanical-engineer','2026-08-10',null,null,null,20,0,0,0,8,0,0,10,5,43"))
  assert.ok(migration.includes("'IE:electrical-engineer','2026-08-10',null,null,null,20,0,0,0,8,0,0,10,5,43"))
  assert.ok(migration.includes("'IE:manufacturing-engineer','2026-08-10',null,null,null,15,0,0,0,8,0,0,8,5,36"))
  assert.ok(migration.includes("'IE:industrial-engineer','2026-08-10',null,null,null,15,0,0,0,8,0,0,8,5,36"))
  assert.ok(migration.includes("'IE:chemical-engineer','2026-08-10',null,null,null,15,0,0,0,8,0,0,10,5,38"))
  assert.ok(migration.includes("'IE:environmental-engineer','2026-08-10',null,null,null,0,0,0,0,8,0,0,6,5,19"))
  assert.ok(migration.includes("'IE:engineering-technician','2026-08-10',null,null,null,10,0,0,0,12,0,0,6,5,33"))
})

test("Ireland Engineering distinguishes exact CSEP from specialist-dependent and ordinary permit scopes", () => {
  for (const id of ["civil-engineer", "mechanical-engineer", "electrical-engineer"]) {
    assert.ok(migration.includes(`'IE:${id}','source','DETE — Critical Skills Occupations List'`))
  }
  for (const id of ["manufacturing-engineer", "industrial-engineer"]) {
    assert.ok(migration.includes(`'IE:${id}','source','DETE — Critical Skills specialist SOC 2127 scope'`))
  }
  assert.ok(migration.includes("'IE:chemical-engineer','source','DETE — Critical Skills Chemical Engineer scope'"))
  for (const id of ["environmental-engineer", "engineering-technician"]) {
    assert.ok(migration.includes(`'IE:${id}','source','DETE — Employment-permit occupation classification'`))
  }
})

test("Ireland Engineering does not infer environmental shortage from green-transition context", () => {
  assert.ok(migration.includes("does not name Environmental Engineer as a separate current shortage"))
  assert.ok(migration.includes("Green-transition demand context is not an exact occupation growth series"))
  assert.ok(migration.includes("'IE:environmental-engineer','2129','Engineering professionals n.e.c. — environmental engineering scope',null"))
})

test("Ireland Engineering exposes a verified technician work-based route without making it universal", () => {
  assert.ok(migration.includes("'IE:engineering-technician','entry_program','Generation Apprenticeship — Civil Engineering Technician L6'"))
  assert.ok(migration.includes("structured apprenticeships such as Civil Engineering Technician"))
})

test("Ireland Engineering keeps Engineers Ireland titles separate from universal statutory registration", () => {
  const profileRows = migration.split("\n").filter((line) => line.trimStart().startsWith("('IE:") && line.includes("'EUR',false,null,null,'profile_ready'"))
  assert.equal(profileRows.length, 8)
  assert.ok(migration.includes("registered professional title Engineering Technician"))
})

test("Ireland Engineering does not publish programme links while IE programme Tier A is empty", () => {
  assert.ok(!migration.includes("country_occupation_program_links"))
  assert.ok(!migration.includes("ie-program:"))
})
