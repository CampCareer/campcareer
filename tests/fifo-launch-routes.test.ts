import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const fifoData = readFileSync("src/lib/fifo/fifo-paths.ts", "utf8")
const fifoHub = readFileSync("src/app/fifo/fifo-launch-hub.tsx", "utf8")
const fifoPage = readFileSync("src/app/fifo/page.tsx", "utf8")
const fifoDetailPage = readFileSync("src/app/fifo/[slug]/page.tsx", "utf8")
const fifoResearchDetail = readFileSync("src/app/fifo/[slug]/fifo-job-detail.tsx", "utf8")
const fifoVerifiedDetail = readFileSync("src/app/fifo/[slug]/verified-fifo-job-detail.tsx", "utf8")
const landing = readFileSync("src/app/(workspace)/home/home-hub.tsx", "utf8")
const topNav = readFileSync("src/components/layout/top-nav.tsx", "utf8")
const footer = readFileSync("src/components/layout/site-footer.tsx", "utf8")

test("FIFO launch exposes one hub and three stable paths", () => {
  assert.match(fifoPage, /Australia FIFO Jobs & Entry Paths/)
  assert.match(fifoData, /slug: "drillers-offsider"/)
  assert.match(fifoData, /slug: "plant-operator"/)
  assert.match(fifoData, /slug: "scaffolder"/)
  assert.match(fifoDetailPage, /generateStaticParams/)
  assert.match(fifoDetailPage, /getFifoPath\(slug\)/)
})

test("homepage and FIFO chrome link into the launch routes", () => {
  assert.match(landing, /localizePath\("\/fifo", locale\)/)
  assert.match(landing, /localizePath\(`\/fifo\/\$\{path\.slug\}`/)
  assert.match(topNav, /normalizedPath\.startsWith\("\/fifo\/"\)/)
  assert.match(topNav, /const fifoDestination = localizePath\("\/fifo", pathLocale\)/)
  assert.match(footer, /const fifo = localizePath\("\/fifo", pathLocale\)/)
})

test("only the evidence-backed Driller's Offsider path is verified and indexable", () => {
  assert.match(fifoData, /slug: "drillers-offsider"[\s\S]*?status: "verified"/)
  assert.match(fifoData, /display: "A\$100k–A\$130k"/)
  assert.match(fifoData, /total: DRILLERS_OFFSIDER_SCORE/)
  assert.match(fifoVerifiedDetail, /research\.score\.total/)
  assert.match(fifoVerifiedDetail, /research\.sources\.map/)
  assert.match(fifoDetailPage, /robots: \{ index: isVerified, follow: true \}/)
  assert.match(fifoDetailPage, /path\.status === "verified" && path\.published/)
})

test("unverified Plant Operator and Scaffolder remain evidence-gated", () => {
  assert.match(fifoData, /slug: "plant-operator"[\s\S]*?status: "researching"/)
  assert.match(fifoData, /slug: "scaffolder"[\s\S]*?status: "researching"/)
  assert.match(fifoHub, /remain blank until their evidence passes the same gate/)
  assert.match(fifoResearchDetail, /This path is not rated yet/)
  assert.match(fifoResearchDetail, /unverified salary and score figures do not/)
})

test("Plant Operator is modeled as equipment-specific research rather than one generic score", () => {
  assert.match(fifoData, /final CampCareer model designed to separate equipment-specific entry paths/)
  assert.match(fifoData, /Plant Operator will not receive one generic score/)
})
