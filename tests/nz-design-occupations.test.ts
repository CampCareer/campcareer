import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const profiles = readFileSync(new URL("../supabase/migrations/20260811143810_nz_design_profiles.sql", import.meta.url), "utf8")
const metrics = readFileSync(new URL("../supabase/migrations/20260811143840_nz_design_metrics.sql", import.meta.url), "utf8")
const links = readFileSync(new URL("../supabase/migrations/20260811143910_nz_design_links_and_programs.sql", import.meta.url), "utf8")

const designCareers = [
  ["graphic-designer", "232411", 31],
  ["ux-designer", null, 28],
  ["multimedia-designer", "232413", 28],
  ["animator", "232412", 35],
  ["interior-designer", "232511", 26],
  ["film-editor", "212314", 30],
  ["architect", "232111", 20],
  ["web-designer", "232414", 33],
] as const

test("NZ Design covers the canonical eight careers", () => {
  for (const [id, code] of designCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "design")
    assert.ok(editorial?.countries.NZ, `${id} must have NZ editorial content`)
    assert.ok(profiles.includes(`'NZ:${id}'`))
    if (code) assert.ok(profiles.includes(`'${code}'`))
  }
})

test("NZ Design preserves reviewed ANZSCO scopes and classification boundaries", () => {
  assert.ok(profiles.includes("'NZ:graphic-designer','NZ','graphic-designer','Graphic Designer','ANZSCO','1.3','232411'"))
  assert.ok(profiles.includes("'NZ:ux-designer','NZ','ux-designer','User Experience Designer — digital design scope','NZ career scope','2026-08-11',null"))
  assert.ok(profiles.includes("'NZ:multimedia-designer','NZ','multimedia-designer','Multimedia Designer','ANZSCO','1.3','232413'"))
  assert.ok(profiles.includes("'NZ:animator','NZ','animator','Illustrator — Animator specialisation','ANZSCO','1.3','232412'"))
  assert.ok(profiles.includes("'NZ:interior-designer','NZ','interior-designer','Interior Designer','ANZSCO','1.3','232511'"))
  assert.ok(profiles.includes("'NZ:film-editor','NZ','film-editor','Film and Video Editor','ANZSCO','1.3','212314'"))
  assert.ok(profiles.includes("'NZ:architect','NZ','architect','Architect','ANZSCO','1.3','232111'"))
  assert.ok(profiles.includes("'NZ:web-designer','NZ','web-designer','Web Designer','ANZSCO','1.3','232414'"))

  assert.ok(links.includes("ANZSCO 2021 — User Experience Designer (ICT) 261113"))
  assert.ok(!profiles.includes("'NZ:ux-designer','NZ','ux-designer','User Experience Designer — digital design scope','ANZSCO','1.3'"), "UX must not be forced into an ANZSCO 1.3 code")
  assert.ok(metrics.includes("ANZSCO 2021 contains 261113 User Experience Designer (ICT)"))
})

test("NZ Design never conflates Multimedia Designer with Green List Multimedia Specialist", () => {
  assert.ok(metrics.includes("ANZSCO 232413 Multimedia Designer. This is distinct from ICT occupation 261211 Multimedia Specialist"))
  assert.ok(metrics.includes("current Green List includes Multimedia Specialist 261211, not Multimedia Designer 232413"))
  assert.ok(!links.includes("'NZ:multimedia-designer','261211'"))
  assert.ok(links.includes("'NZ:multimedia-designer','232413'"))
})

test("NZ Design opportunity scores keep policy demand and salary evidence separate", () => {
  const expected = [
    "'NZ:graphic-designer','2026-08-11',null,37.02,77000,0,0,0,0,15,6,0,5,5,31",
    "'NZ:ux-designer','2026-08-11',null,55.29,115000,0,0,0,0,10,10,0,3,5,28",
    "'NZ:multimedia-designer','2026-08-11',null,37.02,77000,0,0,0,0,12,6,0,5,5,28",
    "'NZ:animator','2026-08-11',null,53.13,110500,0,0,0,0,15,10,0,5,5,35",
    "'NZ:interior-designer','2026-08-11',null,35.58,74000,0,0,0,0,10,6,0,5,5,26",
    "'NZ:film-editor','2026-08-11',null,41.11,85500,0,0,0,0,12,8,0,5,5,30",
    "'NZ:architect','2026-08-11',null,45.91,95500,0,0,0,0,6,8,0,5,1,20",
    "'NZ:web-designer','2026-08-11',null,48.08,100000,0,0,0,0,15,8,0,5,5,33",
  ]
  for (const fragment of expected) assert.ok(metrics.includes(fragment))

  const scoreRows = metrics.split("\n").filter((line) => line.startsWith("('NZ:"))
  assert.equal(scoreRows.length, 8)
  for (const row of scoreRows) assert.match(row, /,0,0,0,0,/)
  assert.ok(metrics.includes("career-opportunity-nz-v1"))
})

test("NZ Architect is the only statutorily registered Design profile", () => {
  const architect = profiles.split("\n").find((line) => line.includes("'NZ:architect'"))
  assert.ok(architect?.includes("'NZD',true,'New Zealand Registered Architects Board'"))
  assert.ok(metrics.includes("current NZRAB registration is required"))

  for (const id of ["graphic-designer", "ux-designer", "multimedia-designer", "animator", "interior-designer", "film-editor", "web-designer"]) {
    const line = profiles.split("\n").find((value) => value.includes(`'NZ:${id}'`))
    assert.ok(line?.includes("'NZD',false,null,null"), `${id} must not be marked as statutorily registered`)
  }
})

test("NZ Design publishes an official entry route for every career", () => {
  for (const [id] of designCareers) assert.ok(links.includes(`('NZ:${id}','entry_program'`), `${id} must have an entry route`)
  assert.ok(links.includes("Tahatū — User Experience Designer"))
  assert.ok(links.includes("Tahatū — Bachelor degrees in Multimedia computing"))
  assert.ok(links.includes("Tahatū — Visual Effects Artist and Animator"))
  assert.ok(links.includes("NZRAB — Initial Registration"))
})

test("NZ Design programme links come only from the reviewed NZ canonical layer", () => {
  assert.ok(links.includes("program_occupation_canonical_nz_v1"))
  assert.ok(links.includes("program_catalog_canonical_nz_v1"))
  assert.ok(links.includes("pc.verification_tier = 'A'"))
  assert.ok(links.includes("pc.international_students_eligible is true"))
  assert.ok(links.includes("pc.code_signatory_status = 'confirmed'"))
  assert.ok(links.includes("coalesce(pc.canonical_admission_state,'') <> 'closed'"))
  assert.ok(!/nz-program:[0-9a-f]{8}-[0-9a-f-]{27,}/i.test(links), "generated programme UUIDs must not be hardcoded")
})
