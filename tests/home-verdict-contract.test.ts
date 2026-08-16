import assert from "node:assert/strict"
import test from "node:test"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"

const homePath = resolve(process.cwd(), "src/app/(workspace)/home/home-hub.tsx")
const fifoDataPath = resolve(process.cwd(), "src/lib/fifo/fifo-paths.ts")
const equipmentDataPath = resolve(process.cwd(), "src/lib/fifo/plant-equipment-paths.ts")
const scaffolderDataPath = resolve(process.cwd(), "src/lib/fifo/scaffolder-path.ts")
const home = readFileSync(homePath, "utf8")
const fifoData = readFileSync(fifoDataPath, "utf8")
const equipmentData = readFileSync(equipmentDataPath, "utf8")
const scaffolderData = readFileSync(scaffolderDataPath, "utf8")

test("homepage uses the FIFO launch contract instead of the legacy public career verdict", () => {
  assert.ok(home.includes('headlineLead: "Find your fastest path into high-paying work"'))
  assert.ok(home.includes('reportTitle: "Australia FIFO Entry Report 2026"'))
  assert.ok(home.includes('verifying: "Verifying"'))
  assert.ok(home.includes('verified: "VERIFIED"'))
  assert.ok(home.includes('panelBadge: "3 verified"'))
  assert.ok(home.includes('reportEyebrow: "COMING SOON"'))
  assert.ok(!home.includes("getHardcodedPublicCareerVerdict"))
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
  assert.match(equipmentData, /slug: "excavator-operator"[\s\S]*?status: "researching"/)
  assert.match(equipmentData, /slug: "loader-operator"[\s\S]*?status: "researching"/)
  assert.match(fifoData, /slug: "plant-operator"[\s\S]*?status: "researching"/)
})

test("homepage does not expose checkout before report verification is complete", () => {
  assert.ok(home.includes('launch: "$29 launch price"'))
  assert.ok(home.includes('launchNote: "Checkout opens when the first edition finishes verification."'))
  assert.ok(!home.includes("checkoutUrl"))
  assert.ok(!home.includes("stripe"))
})
