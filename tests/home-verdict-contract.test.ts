import assert from "node:assert/strict"
import test from "node:test"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"

const homePath = resolve(process.cwd(), "src/app/(workspace)/home/home-hub.tsx")
const reportCatalogPath = resolve(process.cwd(), "src/lib/report-catalog.ts")
const fifoDataPath = resolve(process.cwd(), "src/lib/fifo/fifo-paths.ts")
const equipmentDataPath = resolve(process.cwd(), "src/lib/fifo/plant-equipment-paths.ts")
const scaffolderDataPath = resolve(process.cwd(), "src/lib/fifo/scaffolder-path.ts")
const riggerDataPath = resolve(process.cwd(), "src/lib/fifo/rigger-path.ts")
const home = readFileSync(homePath, "utf8")
const reportCatalog = readFileSync(reportCatalogPath, "utf8")
const fifoData = readFileSync(fifoDataPath, "utf8")
const equipmentData = readFileSync(equipmentDataPath, "utf8")
const scaffolderData = readFileSync(scaffolderDataPath, "utf8")
const riggerData = readFileSync(riggerDataPath, "utf8")

test("homepage uses the FIFO launch contract instead of the legacy public career verdict", () => {
  assert.ok(home.includes('headlineLead: "Find your fastest path into high-paying work"'))
  assert.ok(home.includes('reportEyebrow: "EDITION 1.0 · COMPLETE"'))
  assert.ok(home.includes('verifying: "Verifying"'))
  assert.ok(home.includes('verified: "VERIFIED"'))
  assert.ok(home.includes('panelBadge: "4 verified"'))
  assert.ok(!home.includes("getHardcodedPublicCareerVerdict"))
})

test("homepage presents the completed FIFO guide from the canonical product contract", () => {
  assert.ok(home.includes('FIFO_CONSTRUCTION_FAST_ENTRY_GUIDE'))
  assert.ok(home.includes('formatAud(FIFO_CONSTRUCTION_FAST_ENTRY_GUIDE.amountAudCents)'))
  assert.ok(home.includes('reportProof: "23 pages · Western Australia · Data reviewed 16 Aug 2026"'))
  assert.ok(home.includes('reportScope: "Role → Tickets → Application strategy"'))
  assert.ok(reportCatalog.includes('title: "FIFO Construction Fast Entry Guide 2026"'))
  assert.ok(reportCatalog.includes('amountAudCents: 2900'))
  assert.ok(reportCatalog.includes('contentStatus: "ready"'))
  assert.ok(reportCatalog.includes('edition: "1.0"'))
  assert.ok(reportCatalog.includes('dataReviewedOn: "2026-08-16"'))
  assert.ok(!home.includes("COMING SOON"))
  assert.ok(!home.includes("Australia FIFO Entry Report 2026"))
  assert.ok(!home.includes("Checkout opens when the first edition finishes verification."))
})

test("homepage publishes FIFO numbers only through the shared evidence-gated path model", () => {
  assert.ok(home.includes('import { HOME_FIFO_PATHS } from "@/lib/fifo/all-fifo-paths"'))
  assert.ok(home.includes('value={published ? String(published.score.total) : "—"}'))
  assert.ok(home.includes('value={published ? published.pay.display : copy.verifying}'))
  assert.ok(home.includes('published ? copy.verified : copy.research'))

  assert.match(fifoData, /slug: "drillers-offsider"[\s\S]*?status: "verified"/)
  assert.match(equipmentData, /slug: "dump-truck-operator"[\s\S]*?status: "verified"/)
  assert.match(scaffolderData, /slug: "scaffolder"[\s\S]*?status: "verified"/)
  assert.match(scaffolderData, /display: "A\$55–A\$65\/hr"/)
  assert.match(riggerData, /slug: "rigger"[\s\S]*?status: "verified"/)
  assert.match(riggerData, /display: "A\$55–A\$70\/hr"/)
  assert.match(equipmentData, /slug: "excavator-operator"[\s\S]*?status: "researching"/)
  assert.match(equipmentData, /slug: "loader-operator"[\s\S]*?status: "researching"/)
  assert.match(fifoData, /slug: "plant-operator"[\s\S]*?status: "researching"/)
})

test("homepage does not expose a fake checkout before commerce wiring is implemented", () => {
  assert.ok(!home.includes("checkoutUrl"))
  assert.ok(!home.includes("stripe"))
  assert.ok(!home.includes("Buy now"))
})