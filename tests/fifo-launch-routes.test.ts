import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const fifoData = readFileSync("src/lib/fifo/fifo-paths.ts", "utf8")
const fifoHub = readFileSync("src/app/fifo/fifo-hub.tsx", "utf8")
const fifoPage = readFileSync("src/app/fifo/page.tsx", "utf8")
const fifoDetailPage = readFileSync("src/app/fifo/[slug]/page.tsx", "utf8")
const fifoDetail = readFileSync("src/app/fifo/[slug]/fifo-job-detail.tsx", "utf8")
const landing = readFileSync("src/app/(workspace)/home/home-hub.tsx", "utf8")
const topNav = readFileSync("src/components/layout/top-nav.tsx", "utf8")
const footer = readFileSync("src/components/layout/site-footer.tsx", "utf8")

test("FIFO launch exposes one hub and three stable research paths", () => {
  assert.match(fifoPage, /Australia FIFO Jobs & Entry Paths/)
  assert.match(fifoData, /slug: "drillers-offsider"/)
  assert.match(fifoData, /slug: "plant-operator"/)
  assert.match(fifoData, /slug: "scaffolder"/)
  assert.match(fifoDetailPage, /generateStaticParams/)
  assert.match(fifoDetailPage, /getFifoPath\(slug\)/)
})

test("homepage and FIFO chrome link into the new research routes", () => {
  assert.match(landing, /localizePath\("\/fifo", locale\)/)
  assert.match(landing, /localizePath\(`\/fifo\/\$\{path\.slug\}`/)
  assert.match(topNav, /normalizedPath\.startsWith\("\/fifo\/"\)/)
  assert.match(topNav, /const fifoDestination = localizePath\("\/fifo", pathLocale\)/)
  assert.match(footer, /const fifo = localizePath\("\/fifo", pathLocale\)/)
})

test("unverified FIFO detail pages remain evidence-gated and non-indexable", () => {
  assert.match(fifoDetailPage, /robots: \{ index: false, follow: true \}/)
  assert.match(fifoHub, /Scores and pay stay blank until the evidence is strong enough to publish/)
  assert.match(fifoDetail, /This path is not rated yet/)
  assert.match(fifoDetail, /unverified salary and score figures do not/)
  assert.doesNotMatch(fifoData, /A\$\d{2,3}(?:,\d{3}|k)/i)
  assert.doesNotMatch(fifoData, /entryScore:\s*\d+/i)
})

test("Plant Operator is modeled as equipment-specific research rather than one generic score", () => {
  assert.match(fifoData, /final CampCareer model designed to separate equipment-specific entry paths/)
  assert.match(fifoData, /Plant Operator will not receive one generic score/)
})
