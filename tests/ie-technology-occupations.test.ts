import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260810215425_ie_technology_occupations.sql", import.meta.url),
  "utf8",
)

const technologyCareers = [
  ["software-developer", "2136", 43],
  ["data-analyst", null, 21],
  ["data-engineer", "2135", 38],
  ["cybersecurity-analyst", "2139", 38],
  ["network-administrator", "3131", 23],
  ["cloud-engineer", "2139", 38],
  ["database-administrator", "3131", 19],
  ["ict-support-technician", "3132", 23],
] as const

test("Ireland Technology covers the canonical eight technology careers", () => {
  for (const [id, soc] of technologyCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "technology")
    assert.ok(editorial?.countries.IE, `${id} must have Ireland editorial content`)
    assert.ok(migration.includes(`'IE:${id}'`))
    if (soc) assert.ok(migration.includes(`'${soc}'`))
  }
})

test("Ireland Technology preserves SOC 2010 scope and does not force Data Analyst into one code", () => {
  for (const marker of [
    "'IE:software-developer','IE','software-developer','Programmers and software development professionals','SOC','SOC 2010','2136'",
    "'IE:data-engineer','IE','data-engineer','IT business analysts, architects and systems designers — data engineering / architecture scope','SOC','SOC 2010','2135'",
    "'IE:cybersecurity-analyst','IE','cybersecurity-analyst','Information technology and telecommunications professionals n.e.c. — cyber-security analyst scope','SOC','SOC 2010','2139'",
    "'IE:network-administrator','IE','network-administrator','IT operations technicians — network administration scope','SOC','SOC 2010','3131'",
    "'IE:cloud-engineer','IE','cloud-engineer','Information technology and telecommunications professionals n.e.c. — cloud / DevOps infrastructure engineering scope','SOC','SOC 2010','2139'",
    "'IE:database-administrator','IE','database-administrator','IT operations technicians — database administration scope','SOC','SOC 2010','3131'",
    "'IE:ict-support-technician','IE','ict-support-technician','IT user support technicians','SOC','SOC 2010','3132'",
  ]) assert.ok(migration.includes(marker))

  assert.ok(migration.includes("'IE:data-analyst','IE','data-analyst','Data analyst — cross-SOC analytics scope; verified big-data specialist employment retained separately','SOC','SOC 2010',null"))
  assert.ok(migration.includes("'IE:data-analyst','2423','Management consultants and business analysts — big-data analytics specialist employment'"))
})

test("Ireland Technology uses conservative evidence-backed opportunity scoring", () => {
  for (const [id, , score] of technologyCareers) {
    assert.ok(migration.includes(`'IE:${id}','2026-08-10'`))
    assert.ok(migration.includes(`,${score},'career-opportunity-ie-v1','provisional'`))
  }

  assert.ok(migration.includes("'IE:software-developer','2026-08-10',null,null,null,20,0,0,0,8,0,0,10,5,43"))
  assert.ok(migration.includes("'IE:data-analyst','2026-08-10',null,null,null,0,0,0,0,8,0,0,8,5,21"))
  assert.ok(migration.includes("'IE:data-engineer','2026-08-10',null,null,null,15,0,0,0,8,0,0,10,5,38"))
  assert.ok(migration.includes("'IE:cybersecurity-analyst','2026-08-10',null,null,null,15,0,0,0,8,0,0,10,5,38"))
  assert.ok(migration.includes("'IE:network-administrator','2026-08-10',null,null,null,0,0,0,0,12,0,0,6,5,23"))
  assert.ok(migration.includes("'IE:cloud-engineer','2026-08-10',null,null,null,15,0,0,0,8,0,0,10,5,38"))
  assert.ok(migration.includes("'IE:database-administrator','2026-08-10',null,null,null,0,0,0,0,8,0,0,6,5,19"))
  assert.ok(migration.includes("'IE:ict-support-technician','2026-08-10',null,null,null,0,0,0,0,12,0,0,6,5,23"))

  assert.ok(migration.includes("9.8% annual average growth for the broad IT occupation group"))
  assert.ok(migration.includes("growth remains 0"))
})

test("Ireland Technology keeps Critical Skills and ordinary GEP scopes separate", () => {
  for (const id of ["software-developer", "data-engineer", "cybersecurity-analyst", "cloud-engineer"]) {
    assert.ok(migration.includes(`'IE:${id}','source','DETE — Critical Skills Occupations List'`))
  }
  assert.ok(migration.includes("'IE:data-analyst','source','DETE — Critical Skills big-data analytics specialist scope'"))
  for (const id of ["network-administrator", "database-administrator", "ict-support-technician"]) {
    assert.ok(migration.includes(`'IE:${id}','source','DETE — Employment-permit occupation classification'`))
  }
})

test("Ireland Technology publishes only exact verified work-based entry routes", () => {
  assert.ok(migration.includes("'IE:cybersecurity-analyst','entry_program','Generation Apprenticeship — Cybersecurity Associate L6'"))
  assert.ok(migration.includes("'IE:network-administrator','entry_program','Generation Apprenticeship — Computer Networking Associate L6'"))
  const entryRows = migration.split("\n").filter((line) => line.trimStart().startsWith("('IE:") && line.includes("'entry_program'"))
  assert.equal(entryRows.length, 2)
})

test("Ireland Technology has no universal statutory-registration claims", () => {
  const profileRows = migration.split("\n").filter((line) => line.trimStart().startsWith("('IE:") && line.includes("'EUR',false,null,null,'profile_ready'"))
  assert.equal(profileRows.length, 8)
})

test("Ireland Technology does not publish programme links while IE programme Tier A is empty", () => {
  assert.ok(!migration.includes("country_occupation_program_links"))
  assert.ok(!migration.includes("ie-program:"))
})
