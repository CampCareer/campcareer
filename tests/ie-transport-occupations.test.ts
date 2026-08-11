import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const migration = readFileSync(
  new URL("../supabase/migrations/20260811112406_ie_transport_occupations.sql", import.meta.url),
  "utf8",
)

const transportCareers = [
  ["truck-driver", "8211", 38],
  ["logistics-coordinator", "4134", 21],
  ["aircraft-maintenance-technician", "5235", 23],
  ["commercial-pilot", "3512", 10],
  ["marine-engineer", "3513", 14],
  ["deck-officer", "3513", 14],
  ["warehouse-manager", "1162", 19],
  ["automotive-service-technician", "5231", 23],
] as const

function metricRow(id: string) {
  return migration.split("\n").find((line) => line.includes(`('IE:${id}','2026-08-11'`))
}

test("Ireland Transport covers the canonical eight careers", () => {
  assert.equal(transportCareers.length, 8)
  for (const [id, soc] of transportCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "transport")
    assert.ok(editorial?.countries.IE, `${id} must have Ireland editorial content`)
    assert.ok(migration.includes(`'IE:${id}'`))
    assert.ok(migration.includes(`'${soc}'`))
  }
})

test("Ireland Transport preserves SOC 2010 boundaries", () => {
  for (const marker of [
    "'IE:truck-driver','IE','truck-driver','Large goods vehicle drivers — professional HGV driver scope','SOC','SOC 2010','8211'",
    "'IE:logistics-coordinator','IE','logistics-coordinator','Transport and distribution clerks and assistants — logistics coordinator scope','SOC','SOC 2010','4134'",
    "'IE:aircraft-maintenance-technician','IE','aircraft-maintenance-technician','Aircraft maintenance and related trades — aircraft maintenance technician scope','SOC','SOC 2010','5235'",
    "'IE:commercial-pilot','IE','commercial-pilot','Aircraft pilots and flight engineers — commercial pilot scope','SOC','SOC 2010','3512'",
    "'IE:marine-engineer','IE','marine-engineer','Ship and hovercraft officers — marine engineering officer scope','SOC','SOC 2010','3513'",
    "'IE:deck-officer','IE','deck-officer','Ship and hovercraft officers — deck/navigation officer scope','SOC','SOC 2010','3513'",
    "'IE:warehouse-manager','IE','warehouse-manager','Managers and directors in storage and warehousing — warehouse manager scope','SOC','SOC 2010','1162'",
    "'IE:automotive-service-technician','IE','automotive-service-technician','Vehicle technicians, mechanics and electricians — automotive service technician scope','SOC','SOC 2010','5231'",
  ]) assert.ok(migration.includes(marker))

  assert.ok(migration.includes("kept separate from shore-based Mechanical Engineer 2122"))
  assert.ok(migration.includes("rather than elementary storage 9260 or fork-lift driving 8222"))
})

test("Ireland Transport scores only the direct HGV shortage", () => {
  assert.match(metricRow("truck-driver")!, /null,null,null,20,0,0,0,12,0,0,6,0,38/)
  for (const id of ["logistics-coordinator", "aircraft-maintenance-technician", "commercial-pilot", "marine-engineer", "deck-officer", "warehouse-manager", "automotive-service-technician"]) {
    assert.match(metricRow(id)!, /null,null,null,0,0,0,0,/)
  }
  assert.ok(migration.includes("directly identifies HGV drivers as a current Transport and Logistics shortage"))
  assert.ok(migration.includes("shortage evidence for stock-control and transport/distribution administrative occupations is inconclusive"))
})

test("Ireland Transport preserves employment-permit boundaries", () => {
  assert.ok(migration.includes("category CE or C1E"))
  assert.ok(migration.includes("equivalent category recognised through an RSA mutual-recognition agreement"))
  for (const id of ["logistics-coordinator", "aircraft-maintenance-technician", "commercial-pilot", "marine-engineer", "deck-officer", "warehouse-manager"]) {
    assert.ok(metricRow(id)?.includes(",6,"), `${id} should retain ordinary GEP visa credit`)
  }
  assert.ok(migration.includes("renewed a General Employment Permit quota for Car/Motor Mechanic, Auto Electrician and Vehicle Technician"))
  assert.match(metricRow("automotive-service-technician")!, /,6,5,23,/)
})

test("Ireland Transport preserves licensing and certification boundaries", () => {
  const regulated = ["truck-driver", "commercial-pilot", "marine-engineer", "deck-officer"]
  const unregulatedBroad = ["logistics-coordinator", "aircraft-maintenance-technician", "warehouse-manager", "automotive-service-technician"]

  for (const id of regulated) {
    const row = migration.split("\n").find((line) => line.includes(`('IE:${id}','IE','${id}'`))
    assert.ok(row?.includes("'EUR',true,"), `${id} should be registration/licence gated`)
  }
  for (const id of unregulatedBroad) {
    const row = migration.split("\n").find((line) => line.includes(`('IE:${id}','IE','${id}'`))
    assert.ok(row?.includes("'EUR',false,"), `${id} should not be universally registration gated`)
  }

  assert.ok(migration.includes("valid Driver CPC card"))
  assert.ok(migration.includes("commercial-level licence, normally a CPL or ATPL with the applicable Class 1 medical standard"))
  assert.ok(migration.includes("Certificates of Competency for service on merchant ships and fishing vessels"))
  assert.ok(migration.includes("universal personal registration is not asserted"))
})

test("Ireland Transport publishes structured entry routes without Tier C programme promotion", () => {
  assert.ok(migration.includes("'IE:truck-driver','entry_program','RSA — professional truck Driver CPC route'"))
  assert.ok(migration.includes("'IE:aircraft-maintenance-technician','entry_program','Generation Apprenticeship — Aircraft Mechanics craft route'"))
  assert.ok(migration.includes("'IE:commercial-pilot','entry_program','IAA — How to become a pilot'"))
  assert.ok(migration.includes("'IE:warehouse-manager','entry_program','Generation Apprenticeship — Supply Chain Manager Level 9'"))
  assert.ok(migration.includes("'IE:automotive-service-technician','entry_program','Generation Apprenticeship — Motor Mechanics craft route'"))
  assert.ok(!migration.includes("ie-program:"))
  assert.ok(migration.includes("delete from public.country_occupation_program_links"))
})

test("Ireland Transport keeps salary vacancy and growth unscored", () => {
  for (const [id, , score] of transportCareers) {
    const row = metricRow(id)
    assert.ok(row)
    assert.match(row, /'2026-08-11',null,null,null,/)
    assert.ok(row.includes(`,${score},'career-opportunity-ie-v1','provisional'`))
  }
})
