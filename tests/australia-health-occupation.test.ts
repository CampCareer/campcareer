import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { AU_VOCATIONAL_PROGRAM_SHORTLIST } from "../src/data/au-vocational-program-shortlist"
import { getCanonicalCareer } from "../src/data/career-comparison-catalog"
import { getOccupationEditorial } from "../src/data/occupation-editorial"

const midwifeMigration = readFileSync(
  new URL("../supabase/migrations/20260807191500_australia_midwife_profile.sql", import.meta.url),
  "utf8",
)

const careWorkerMigration = readFileSync(
  new URL("../supabase/migrations/20260807195500_australia_care_worker_profile.sql", import.meta.url),
  "utf8",
)

const physiotherapistMigration = readFileSync(
  new URL("../supabase/migrations/20260807211500_australia_physiotherapist_profile.sql", import.meta.url),
  "utf8",
)

test("Australia Midwife uses the exact current OSCA occupation mapping", () => {
  const career = getCanonicalCareer("midwife")

  assert.ok(career)
  assert.equal(career.categoryId, "health")
  assert.match(midwifeMigration, /'AU:midwife'/)
  assert.match(midwifeMigration, /'265131', 'Midwife'/)
  assert.match(midwifeMigration, /'254111'/)
  assert.match(midwifeMigration, /'2651'/)
  assert.doesNotMatch(midwifeMigration, /251911/)
})

test("Australia Midwife has a complete regulated entry pathway", () => {
  const midwife = getOccupationEditorial("midwife")
  const australia = midwife?.countries.AU

  assert.ok(midwife)
  assert.ok(australia)
  assert.ok(midwife.tasks.length >= 6)
  assert.match(australia.entryPathway, /Bachelor of Midwifery/i)
  assert.match(australia.entryPathway, /postgraduate midwifery/i)
  assert.match(australia.entryPathway, /MidStart/)
  assert.match(australia.registration, /Nursing and Midwifery Board of Australia/)
  assert.match(australia.registration, /mandatory/i)
})

test("Australia Midwife profile keeps verified labour-market inputs and regional shortage evidence", () => {
  assert.match(midwifeMigration, /19400, 2114, 56, 109928/)
  assert.match(midwifeMigration, /197\.33333/)
  assert.match(midwifeMigration, /9\.23/)
  assert.match(midwifeMigration, /13\.91, 26\.74/)

  for (const region of ["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"]) {
    assert.match(midwifeMigration, new RegExp(`'AU:midwife', '${region}', '2026-05-01', 3`))
  }
})

test("Australia Midwife exposes current regulator, pathway and visa sources", () => {
  assert.match(midwifeMigration, /Approved programs of study/i)
  assert.match(midwifeMigration, /GradStart/)
  assert.match(midwifeMigration, /MidStart/)
  assert.match(midwifeMigration, /Core Skills Occupation List includes legacy ANZSCO 254111 Midwife/)
  assert.match(midwifeMigration, /Home Affairs — Skilled occupation list/)
})

test("Australia Care Worker uses a deliberately narrow OSCA rollup", () => {
  const career = getCanonicalCareer("care-worker")

  assert.ok(career)
  assert.equal(career.categoryId, "health")
  assert.match(careWorkerMigration, /'421231', 'Community Aged Care Support Worker'/)
  assert.match(careWorkerMigration, /'422231', 'Disability Support Worker'/)
  assert.match(careWorkerMigration, /Residential Aged Care Worker is excluded/)
  assert.doesNotMatch(careWorkerMigration, /'421331', 'Residential Aged Care Worker'/)
})

test("Australia Care Worker has a complete vocational and screening pathway", () => {
  const careWorker = getOccupationEditorial("care-worker")
  const australia = careWorker?.countries.AU

  assert.ok(careWorker)
  assert.ok(australia)
  assert.ok(careWorker.tasks.length >= 6)
  assert.match(australia.entryPathway, /CHC33021/)
  assert.match(australia.entryPathway, /Ageing and Disability/i)
  assert.match(australia.registration, /no single national Care Worker occupational licence/i)
  assert.match(australia.registration, /NDIS Worker Screening Clearance/i)
})

test("Australia Care Worker keeps verified JSA labour-market and all-state shortage inputs", () => {
  assert.match(careWorkerMigration, /376300, 1761, 46, 91572/)
  assert.match(careWorkerMigration, /3520\.33333/)
  assert.match(careWorkerMigration, /-0\.19/)
  assert.match(careWorkerMigration, /10\.75, 18\.12/)

  for (const region of ["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"]) {
    assert.match(careWorkerMigration, new RegExp(`'AU:care-worker', '${region}', '2026-05-01', 3`))
  }
})

test("Australia Care Worker connects CHC33021 directly and keeps aged-care visa scope conditional", () => {
  const program = AU_VOCATIONAL_PROGRAM_SHORTLIST.find(
    (item) => item.id === "au-vet:training-gov:CHC33021"
  )

  assert.ok(program)
  assert.equal(program.conceptId, "aged-care")
  assert.equal(program.courseCode, "CHC33021")
  assert.equal(program.registrationStatus, "CURRENT")
  assert.match(careWorkerMigration, /'au-vet:training-gov:CHC33021', 'direct'/)
  assert.match(careWorkerMigration, /Aged Care Industry Labour Agreement/)
  assert.match(careWorkerMigration, /disability-sector employers cannot use that agreement/)
})

test("Australia Physiotherapist uses the exact current OSCA mapping", () => {
  const career = getCanonicalCareer("physiotherapist")

  assert.ok(career)
  assert.equal(career.categoryId, "health")
  assert.match(physiotherapistMigration, /'AU:physiotherapist'/)
  assert.match(physiotherapistMigration, /'262431', 'Physiotherapist'/)
  assert.match(physiotherapistMigration, /'252511'/)
  assert.match(physiotherapistMigration, /'2624'/)
})

test("Australia Physiotherapist has a regulated accredited entry pathway", () => {
  const physiotherapist = getOccupationEditorial("physiotherapist")
  const australia = physiotherapist?.countries.AU

  assert.ok(physiotherapist)
  assert.ok(australia)
  assert.ok(physiotherapist.tasks.length >= 6)
  assert.match(australia.entryPathway, /Bachelor|Master|Doctor of Physiotherapy/i)
  assert.match(australia.entryPathway, /Australian Physiotherapy Council/)
  assert.match(australia.registration, /Physiotherapy Board of Australia/)
  assert.match(australia.registration, /mandatory/i)
})

test("Australia Physiotherapist keeps direct JSA labour-market, growth and shortage inputs", () => {
  assert.match(physiotherapistMigration, /46600, 1888, 50, 98176/)
  assert.match(physiotherapistMigration, /1205\.66667/)
  assert.match(physiotherapistMigration, /4\.42/)
  assert.match(physiotherapistMigration, /19\.69, 35\.10/)
  assert.match(physiotherapistMigration, /20, 15, 5, 6, 13, 5, 10, 10, 2, 86/)

  for (const region of ["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"]) {
    assert.match(physiotherapistMigration, new RegExp(`'AU:physiotherapist', '${region}', '2026-05-01', 3`))
  }
})

test("Australia Physiotherapist connects canonical study and visa evidence", () => {
  assert.match(physiotherapistMigration, /Australian Physiotherapy Council — Education providers and accreditation/)
  assert.match(physiotherapistMigration, /Core Skills Occupation List includes legacy ANZSCO 252511 Physiotherapist/)
  assert.match(physiotherapistMigration, /'au-program:804', 'direct'/)
  assert.match(physiotherapistMigration, /'au-program:19250', 'direct'/)
  assert.match(physiotherapistMigration, /'au-program:4744', 'graduate_entry'/)
})
