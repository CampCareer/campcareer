import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const profiles = readFileSync(new URL("../supabase/migrations/20260810205453_nz_construction_profiles.sql", import.meta.url), "utf8")
const metrics = readFileSync(new URL("../supabase/migrations/20260810205525_nz_construction_metrics.sql", import.meta.url), "utf8")
const links = readFileSync(new URL("../supabase/migrations/20260810205552_nz_construction_links_and_programs.sql", import.meta.url), "utf8")

const constructionCareers = [
  ["carpenter", "331212", 28],
  ["electrician", "341111", 47],
  ["plumber", "334111", 45],
  ["wall-floor-tiler", "333411", 29],
  ["welder", "322313", 49],
  ["bricklayer", "331111", 28],
  ["hvac-technician", "342111", 30],
  ["construction-manager", "133111", 51],
] as const

test("NZ Construction covers the canonical eight trades careers", () => {
  for (const [id, code] of constructionCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "trades")
    assert.ok(editorial?.countries.NZ, `${id} must have NZ editorial content`)
    assert.ok(profiles.includes(`'${id}'`))
    assert.ok(profiles.includes(`'${code}'`))
  }
})

test("NZ Construction uses exact ANZSCO 1.3 mappings", () => {
  for (const [id, code] of constructionCareers) {
    assert.ok(profiles.includes(`'NZ:${id}'`))
    assert.ok(profiles.includes(`'ANZSCO','1.3','${code}'`))
  }
  assert.ok(!profiles.includes("'NZ:carpenter','NZ','carpenter','Carpenter and Joiner'"))
  assert.ok(!profiles.includes("'NZ:construction-manager','NZ','construction-manager','Project Builder'"))
})

test("NZ Construction opportunity scores preserve current Green List tiers", () => {
  for (const [id, , score] of constructionCareers) {
    assert.ok(metrics.includes(`'NZ:${id}'`))
    assert.ok(metrics.includes(`,${score},'career-opportunity-nz-v1'`))
  }

  assert.ok(metrics.includes("'NZ:construction-manager','2026-08-10',null,60.10,125000,20,0,0,0,8,10,0,10,3,51"))
  assert.ok(metrics.includes("Green List Tier 1 Straight to Residence"))
  assert.ok(metrics.includes("'NZ:electrician','2026-08-10',null,41.59,86500,15,0,0,0,15,8,0,8,1,47"))
  assert.ok(metrics.includes("'NZ:plumber','2026-08-10',null,35.34,73500,15,0,0,0,15,6,0,8,1,45"))
  assert.ok(metrics.includes("'NZ:welder','2026-08-10',null,38.22,79500,15,0,0,0,15,6,0,8,5,49"))
  assert.ok(metrics.includes("NZD 45.50/hour"))
})

test("NZ Construction does not pre-score the 24 August 2026 SMC change", () => {
  assert.ok(metrics.includes("'NZ:hvac-technician','2026-08-10',null,38.50,80080,0,0,0,0,15,8,0,5,2,30"))
  assert.ok(metrics.includes("begins 24 August 2026 and is not pre-scored"))
  assert.ok(links.includes("SMC Trades and Technician pathway from 24 August 2026"))
})

test("NZ Construction locks regulated and conditional licensing scopes", () => {
  assert.ok(profiles.includes("'NZ:electrician','NZ','electrician','Electrician (General)','ANZSCO','1.3','341111','NZD',true"))
  assert.ok(profiles.includes("'NZ:plumber','NZ','plumber','Plumber (General)','ANZSCO','1.3','334111','NZD',true"))
  assert.ok(profiles.includes("'NZ:hvac-technician','NZ','hvac-technician','Airconditioning and Refrigeration Mechanic','ANZSCO','1.3','342111','NZD',true"))
  assert.ok(metrics.includes("restricted building work requires appropriate LBP coverage"))
  assert.ok(metrics.includes("restricted masonry building work requires appropriate LBP coverage"))
})

test("NZ Construction publishes an official entry route for every career", () => {
  for (const profileKey of [
    "NZ:carpenter",
    "NZ:electrician",
    "NZ:plumber",
    "NZ:wall-floor-tiler",
    "NZ:welder",
    "NZ:bricklayer",
    "NZ:hvac-technician",
    "NZ:construction-manager",
  ]) {
    assert.ok(links.includes(`('${profileKey}','entry_program'`), `${profileKey} must have an entry link`)
  }
})

test("NZ Construction publishes only the two verified canonical tertiary programme links", () => {
  const programRefs = links.match(/nz-program:/g) ?? []
  assert.equal(programRefs.length, 2)
  assert.ok(links.includes("nz-program:d784bade-a956-9d8a-1dad-9dda49548dc9"))
  assert.ok(links.includes("nz-program:220963bf-9272-0deb-df24-cfd01f49a7bf"))
  assert.ok(!links.includes("'NZ:carpenter','nz-program:"))
  assert.ok(!links.includes("'NZ:electrician','nz-program:"))
  assert.ok(!links.includes("'NZ:plumber','nz-program:"))
})
