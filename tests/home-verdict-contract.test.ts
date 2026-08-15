import assert from "node:assert/strict"
import test from "node:test"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"

const homePath = resolve(process.cwd(), "src/app/(workspace)/home/home-hub.tsx")
const home = readFileSync(homePath, "utf8")

test("homepage uses the FIFO launch contract instead of the legacy public career verdict", () => {
  assert.ok(home.includes('headlineLead: "Find your fastest path into high-paying work"'))
  assert.ok(home.includes('reportTitle: "Australia FIFO Entry Report 2026"'))
  assert.ok(home.includes('verifying: "Verifying"'))
  assert.ok(home.includes('research: "Researching"'))
  assert.ok(home.includes('reportEyebrow: "COMING SOON"'))
  assert.ok(!home.includes("getHardcodedPublicCareerVerdict"))
})

test("homepage does not publish unverified FIFO pay or entry scores", () => {
  assert.ok(home.includes('<Metric label={copy.score} value="—" />'))
  assert.ok(home.includes('<Metric label={copy.pay} value={copy.verifying} muted />'))
  assert.ok(!/A\$\d{2,3}k/.test(home))
  assert.ok(!/Entry Score\s*[:=]\s*\d+/i.test(home))
})

test("homepage does not expose checkout before report verification is complete", () => {
  assert.ok(home.includes('launch: "$29 launch price"'))
  assert.ok(home.includes('launchNote: "Checkout opens when the first edition finishes verification."'))
  assert.ok(!home.includes("checkoutUrl"))
  assert.ok(!home.includes("stripe"))
})
