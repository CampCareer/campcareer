import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const profiles = readFileSync(new URL("../supabase/migrations/20260810203551_uk_transport_profiles.sql", import.meta.url), "utf8")
const metrics = readFileSync(new URL("../supabase/migrations/20260810203627_uk_transport_metrics.sql", import.meta.url), "utf8")
const links = readFileSync(new URL("../supabase/migrations/20260810203652_uk_transport_links_and_programs.sql", import.meta.url), "utf8")
const migration = `${profiles}\n${metrics}\n${links}`

const transportCareers = [
  ["truck-driver", "8211", 23],
  ["logistics-coordinator", "4134", 27],
  ["aircraft-maintenance-technician", "5234", 28],
  ["commercial-pilot", "3511", 20],
  ["marine-engineer", "3512", 52],
  ["deck-officer", "3512", 49],
  ["warehouse-manager", "1242", 26],
  ["automotive-service-technician", "5231", 41],
] as const

test("UK Transport cohort covers the canonical eight transport careers", () => {
  for (const [id, soc] of transportCareers) {
    const career = getCanonicalCareer(id)
    const editorial = getOccupationEditorial(id)
    assert.ok(career, `${id} must exist in the canonical career catalogue`)
    assert.equal(career.categoryId, "transport")
    assert.ok(editorial?.countries.UK, `${id} must have UK editorial content`)
    assert.ok(profiles.includes(`'${id}'`))
    assert.ok(profiles.includes(`'${soc}'`))
  }
})

test("UK Transport preserves exact coordinator, maritime and warehouse SOC scopes", () => {
  assert.ok(links.includes("'UK:logistics-coordinator','4134/00'"))
  assert.ok(metrics.includes("excludes logistics managers SOC 1243 and stock-control SOC 4133"))
  assert.ok(!links.includes("'UK:logistics-coordinator','1243'"))
  assert.ok(!links.includes("'UK:logistics-coordinator','4133'"))

  assert.ok(links.includes("'UK:marine-engineer','3512/02'"))
  assert.ok(metrics.includes("Mechanical Engineer SOC 2122 is excluded"))
  assert.ok(links.includes("'UK:deck-officer','3512/01'"))

  assert.ok(links.includes("'UK:warehouse-manager','1242'"))
  assert.ok(metrics.includes("operative SOC mapping is not substituted for the manager code"))
  assert.ok(!links.includes("'UK:warehouse-manager','9252'"))
})

test("UK Transport anchors aircraft maintenance to core 5234 without borrowing adjacent TSL access", () => {
  assert.ok(links.includes("'UK:aircraft-maintenance-technician','5234/00'"))
  assert.ok(links.includes("'UK:aircraft-maintenance-technician','3112/01'"))
  assert.ok(links.includes("'UK:aircraft-maintenance-technician','3113/01'"))
  assert.ok(metrics.includes("their immigration treatment is not borrowed for the core score"))
  assert.ok(metrics.includes("very limited shortage evidence for SOC 5234 and recommended no TSL access"))
  assert.ok(metrics.includes("'UK:aircraft-maintenance-technician','2026-08-10',14000,23.08,45000,0,0,0,0,15,8,0,3,2,28"))
})

test("UK Transport opportunity scores separate current law from MAC recommendations", () => {
  for (const [id, , score] of transportCareers) {
    assert.ok(metrics.includes(`'UK:${id}'`))
    assert.ok(metrics.includes(`,${score},'career-opportunity-uk-v1'`))
  }

  assert.ok(metrics.includes("'UK:truck-driver','2026-08-10',null,null,39141,0,0,0,0,15,6,0,0,2,23"))
  assert.ok(metrics.includes("SOC 8211 is in Home Office Table 6 and is not eligible for Skilled Worker sponsorship"))

  assert.ok(metrics.includes("'UK:marine-engineer','2026-08-10',7000,29.90,58300,20,0,0,0,15,10,0,3,4,52"))
  assert.ok(metrics.includes("'UK:deck-officer','2026-08-10',7000,29.90,58300,20,0,0,0,15,10,0,3,1,49"))
  assert.ok(metrics.includes("strong shortage evidence and a clear shortfall of domestic workers"))
  assert.ok(metrics.includes("recommended access for 18 months"))
  assert.ok(metrics.includes("have not yet added SOC 3512 to the legal TSL"))

  assert.ok(metrics.includes("'UK:automotive-service-technician','2026-08-10',125000,18.21,35500,5,0,0,0,15,6,0,10,5,41"))
  assert.ok(metrics.includes("SOC 5231 remains on the current interim TSL"))
  assert.ok(metrics.includes("recommended no future TSL access"))
})

test("UK Transport encodes professional licensing burdens", () => {
  assert.ok(profiles.includes("'UK:truck-driver','UK','truck-driver','Heavy and large goods vehicle drivers','SOC','SOC 2020','8211','GBP',true,'DVLA / DVSA'"))
  assert.ok(profiles.includes("'UK:aircraft-maintenance-technician','UK','aircraft-maintenance-technician'"))
  assert.ok(profiles.includes("true,'UK Civil Aviation Authority'"))
  assert.ok(profiles.includes("'UK:commercial-pilot','UK','commercial-pilot'"))
  assert.ok(profiles.includes("'UK:deck-officer','UK','deck-officer'"))
  assert.ok(profiles.includes("true,'Maritime and Coastguard Agency'"))
  assert.ok(metrics.includes("Driver CPC"))
  assert.ok(metrics.includes("Part-66 Aircraft Maintenance Licence"))
  assert.ok(metrics.includes("valid Class 1 medical"))
  assert.ok(metrics.includes("Certificate of Competency"))
})

test("UK Transport publishes all eight official entry routes and only one verified university programme", () => {
  for (const marker of ["large-goods-vehicle-lgv-driver-c-plus-e-v1-4","OCC0647A","OCC1315","commercial-pilot-licence-for-aeroplanes-guidance","OCC0364","OCC0842","OCC0647B","OCC0033"]) {
    assert.ok(links.includes(marker))
  }

  const programRefs = links.match(/uk-program:/g) ?? []
  assert.equal(programRefs.length, 1)
  assert.ok(links.includes("'UK:warehouse-manager','uk-program:28523c4e-d9d5-fc17-6285-31d09babbd46','direct'"))
  for (const id of ["truck-driver","logistics-coordinator","aircraft-maintenance-technician","commercial-pilot","marine-engineer","deck-officer","automotive-service-technician"]) {
    assert.ok(!links.includes(`'UK:${id}','uk-program:`))
  }
  assert.ok(migration.includes("career-opportunity-uk-v1"))
})
