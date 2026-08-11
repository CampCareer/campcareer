import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const profiles = readFileSync(new URL("../supabase/migrations/20260811204810_nz_transport_profiles.sql", import.meta.url), "utf8")
const metrics = readFileSync(new URL("../supabase/migrations/20260811204840_nz_transport_metrics.sql", import.meta.url), "utf8")
const links = readFileSync(new URL("../supabase/migrations/20260811204910_nz_transport_links_and_programs.sql", import.meta.url), "utf8")
const migration = `${profiles}\n${metrics}\n${links}`

const transportCareers = [
  ["truck-driver", "733111", 27],
  ["logistics-coordinator", null, 26],
  ["aircraft-maintenance-technician", "3231", 47],
  ["commercial-pilot", "231111", 22],
  ["marine-engineer", "231212", 26],
  ["deck-officer", "231214", 22],
  ["warehouse-manager", "133611", 30],
  ["automotive-service-technician", "321211", 44],
] as const

test("NZ Transport cohort covers the canonical eight transport careers", () => {
  for (const [id] of transportCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "transport")
    assert.ok(editorial?.countries.NZ, `${id} must have NZ editorial content`)
    assert.ok(profiles.includes(`'NZ:${id}'`))
  }
})

test("NZ Transport preserves conservative ANZSCO 1.3 classification boundaries", () => {
  assert.ok(profiles.includes("'NZ:truck-driver','NZ','truck-driver','Truck Driver (General)','ANZSCO','1.3','733111'"))
  assert.ok(profiles.includes("'NZ:logistics-coordinator','NZ','logistics-coordinator','Logistics Specialist — coordinator scope','NZ career scope','2026-08-11',null"))
  assert.ok(profiles.includes("'NZ:aircraft-maintenance-technician','NZ','aircraft-maintenance-technician','Aircraft Maintenance Engineer — avionics/mechanical/structures roll-up','ANZSCO','1.3','3231'"))
  assert.ok(profiles.includes("'NZ:commercial-pilot','NZ','commercial-pilot','Aeroplane Pilot — commercial pilot scope','ANZSCO','1.3','231111'"))
  assert.ok(profiles.includes("'NZ:marine-engineer','NZ','marine-engineer','Ship''s Engineer (Marine Engineer)','ANZSCO','1.3','231212'"))
  assert.ok(profiles.includes("'NZ:deck-officer','NZ','deck-officer','Ship''s Officer (Deck Officer)','ANZSCO','1.3','231214'"))
  assert.ok(profiles.includes("'NZ:warehouse-manager','NZ','warehouse-manager','Supply and Distribution Manager — warehouse/distribution scope','ANZSCO','1.3','133611'"))
  assert.ok(profiles.includes("'NZ:automotive-service-technician','NZ','automotive-service-technician','Motor Mechanic (General) — automotive light technician scope','ANZSCO','1.3','321211'"))

  assert.ok(!profiles.includes("'NZ:logistics-coordinator','NZ','logistics-coordinator','Supply and Distribution Manager"))
  assert.ok(!profiles.includes("231114"), "commercial pilot must not roll in Helicopter Pilot 231114")
  assert.ok(!profiles.includes("321212"), "automotive canonical profile must not roll in Diesel Motor Mechanic 321212")
  assert.ok(!profiles.includes("321213"), "automotive canonical profile must not roll in Motorcycle Mechanic 321213")
})

test("NZ Transport applies Green List credit only to the reviewed AME roll-up and Motor Mechanic General", () => {
  for (const code of ["323111", "323112", "323113"]) assert.ok(metrics.includes(code))
  assert.ok(metrics.includes("All three aircraft-maintenance occupations in this roll-up are on the current Green List Tier 1"))
  assert.ok(metrics.includes("Motor Mechanic (General) 321211 is on the current Green List Tier 2"))

  for (const id of ["truck-driver", "logistics-coordinator", "commercial-pilot", "marine-engineer", "deck-officer", "warehouse-manager"]) {
    const row = metrics.split("\n").find((line) => line.startsWith(`('NZ:${id}'`))
    assert.ok(row, `${id} metric row must exist`)
    assert.match(row, /,0,0,0,0,/)
  }
})

test("NZ Transport opportunity score rows remain stable", () => {
  for (const fragment of [
    "'NZ:truck-driver','2026-08-11',null,41.11,85500,0,0,0,0,15,8,0,3,1,27",
    "'NZ:logistics-coordinator','2026-08-11',null,36.78,76500,0,0,0,0,12,6,0,3,5,26",
    "'NZ:aircraft-maintenance-technician','2026-08-11',null,54.57,113500,20,0,0,0,6,10,0,10,1,47",
    "'NZ:commercial-pilot','2026-08-11',null,81.25,169000,0,0,0,0,6,10,0,5,1,22",
    "'NZ:marine-engineer','2026-08-11',null,52.88,110000,0,0,0,0,10,10,0,5,1,26",
    "'NZ:deck-officer','2026-08-11',null,43.03,89500,0,0,0,0,8,8,0,5,1,22",
    "'NZ:warehouse-manager','2026-08-11',null,44.23,92000,0,0,0,0,12,8,0,5,5,30",
    "'NZ:automotive-service-technician','2026-08-11',null,34.50,71760,15,0,0,0,12,4,0,8,5,44",
  ]) assert.ok(metrics.includes(fragment))
})

test("NZ Transport marks only legally licensed canonical scopes as registration-required", () => {
  for (const id of ["truck-driver", "aircraft-maintenance-technician", "commercial-pilot", "marine-engineer", "deck-officer"]) {
    const row = profiles.split("\n").find((line) => line.startsWith(`('NZ:${id}'`))
    assert.ok(row?.includes("'NZD',true,"), `${id} must be marked registration-required`)
  }
  for (const id of ["logistics-coordinator", "warehouse-manager", "automotive-service-technician"]) {
    const row = profiles.split("\n").find((line) => line.startsWith(`('NZ:${id}'`))
    assert.ok(row?.includes("'NZD',false,"), `${id} must not be marked universally registered`)
  }
})

test("NZ Transport publishes an official entry route for all eight careers", () => {
  for (const marker of ["T00980-heavy-truck-driver", "T00084-logistics-specialist", "T00810-aircraft-maintenance-engineer", "T00973-pilot", "T00996-marine-engineer", "T00993-deckhand", "T00026-transportation-storage-and-distribution-manager", "T00813-automotive-technician"]) {
    assert.ok(links.includes(marker))
  }
  assert.ok(links.includes("CAA New Zealand — Maintenance engineer licensing"))
  assert.ok(links.includes("CAA New Zealand — Part 61 Subpart E Commercial Pilot Licences"))
  assert.ok(links.includes("Maritime New Zealand — Getting certified"))
  assert.ok(links.includes("NZTA — Heavy vehicle licences"))
})

test("NZ Transport programme links use only the reviewed canonical NZ programme layer", () => {
  assert.ok(links.includes("program_occupation_canonical_nz_v1"))
  assert.ok(links.includes("program_catalog_canonical_nz_v1"))
  assert.ok(links.includes("pc.verification_tier = 'A'"))
  assert.ok(links.includes("pc.international_students_eligible is true"))
  assert.ok(links.includes("pc.code_signatory_status = 'confirmed'"))
  assert.ok(links.includes("coalesce(pc.canonical_admission_state,'') <> 'closed'"))
  assert.equal((links.match(/nz-program:[0-9a-f-]{20,}/g) ?? []).length, 0)
})

test("NZ Transport migration remains source-complete and does not revive legacy transport policy", () => {
  assert.ok(migration.includes("https://www.immigration.govt.nz/opsmanual/77204.htm"))
  assert.ok(migration.includes("career-opportunity-nz-v1"))
  assert.ok(metrics.includes("earlier transport-sector residence settings are not treated as current shortage evidence"))
  assert.ok(metrics.includes("Deckhand annual pay range") && metrics.includes("feeder proxy"))
})
