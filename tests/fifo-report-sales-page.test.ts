import assert from "node:assert/strict"
import test from "node:test"
import { readFileSync } from "node:fs"

const page = readFileSync("src/app/fifo/report/page.tsx", "utf8")
const sales = readFileSync("src/app/fifo/report/fifo-report-sales-page.tsx", "utf8")
const home = readFileSync("src/app/(workspace)/home/home-hub.tsx", "utf8")
const topNav = readFileSync("src/components/layout/top-nav.tsx", "utf8")
const sitemap = readFileSync("src/app/fifo/sitemap.ts", "utf8")

test("FIFO report has a dedicated indexable sales route with exact product identity", () => {
  assert.match(page, /title: "FIFO Construction Fast Entry Guide 2026"/)
  assert.match(page, /canonical: "\/fifo\/report"/)
  assert.match(page, /robots: \{ index: true, follow: true \}/)
  assert.match(sales, /FIFO_CONSTRUCTION_FAST_ENTRY_GUIDE/)
  assert.match(sales, /Complete digital guide/)
  assert.match(sales, /23 pages/)
  assert.match(sales, /Data reviewed 16 Aug 2026/)
})

test("sales copy stays grounded in the completed guide structure and evidence", () => {
  for (const section of [
    "FIFO Construction Reality Check",
    "Jobs You Can Actually Target",
    "The FIFO Ticket Map",
    "Fastest Entry Pathways",
    "Salary & Roster Reality",
    "Getting the First FIFO Job",
    "What Employers Are Actually Asking For",
    "Where to Train & What to Self-Fund",
    "From Arrival to Your First FIFO Job",
    "Sources & Data Date",
  ]) {
    assert.ok(sales.includes(section), `missing guide section: ${section}`)
  }

  assert.match(sales, /Role → Tickets → Application strategy/)
  assert.match(sales, /95%/)
  assert.match(sales, /A\$100–120/)
  assert.match(sales, /~9 days/)
  assert.match(sales, /Tickets make you eligible\. Experience makes you competitive\./)
})

test("homepage and FIFO navigation lead into the dedicated report route", () => {
  assert.match(home, /localizePath\("\/fifo\/report", locale\)/)
  assert.match(home, /reportCta: "See what is inside"/)
  assert.match(topNav, /localizePath\("\/fifo\/report", pathLocale\)/)
  assert.match(sitemap, /`\$\{SITE_URL\}\/fifo\/report`/)
})

test("step 4 does not expose an unfinished payment integration", () => {
  assert.match(sales, /disabled/)
  assert.match(sales, /Secure checkout will be enabled before release/)
  assert.doesNotMatch(sales, /stripe/i)
  assert.doesNotMatch(sales, /checkoutUrl/)
})
