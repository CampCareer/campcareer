import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"

const fifoData = readFileSync("src/lib/fifo/fifo-paths.ts", "utf8")
const equipmentData = readFileSync("src/lib/fifo/plant-equipment-paths.ts", "utf8")
const scaffolderData = readFileSync("src/lib/fifo/scaffolder-path.ts", "utf8")
const allPaths = readFileSync("src/lib/fifo/all-fifo-paths.ts", "utf8")
const fifoHub = readFileSync("src/app/fifo/fifo-launch-hub.tsx", "utf8")
const fifoPage = readFileSync("src/app/fifo/page.tsx", "utf8")
const fifoDetailPage = readFileSync("src/app/fifo/[slug]/page.tsx", "utf8")
const fifoResearchDetail = readFileSync("src/app/fifo/[slug]/fifo-job-detail.tsx", "utf8")
const fifoVerifiedDetail = readFileSync("src/app/fifo/[slug]/verified-fifo-job-detail.tsx", "utf8")
const equipmentVerifiedDetail = readFileSync("src/app/fifo/[slug]/verified-equipment-job-detail.tsx", "utf8")
const scaffolderVerifiedDetail = readFileSync("src/app/fifo/[slug]/verified-scaffolder-job-detail.tsx", "utf8")
const landing = readFileSync("src/app/(workspace)/home/home-hub.tsx", "utf8")
const topNav = readFileSync("src/components/layout/top-nav.tsx", "utf8")
const footer = readFileSync("src/components/layout/site-footer.tsx", "utf8")

test("FIFO launch exposes the hub and six modeled paths", () => {
  assert.match(fifoPage, /Australia FIFO Jobs & Entry Paths/)
  assert.match(fifoData, /slug: "drillers-offsider"/)
  assert.match(fifoData, /slug: "plant-operator"/)
  assert.match(scaffolderData, /slug: "scaffolder"/)
  assert.match(equipmentData, /slug: "dump-truck-operator"/)
  assert.match(equipmentData, /slug: "excavator-operator"/)
  assert.match(equipmentData, /slug: "loader-operator"/)
  assert.match(allPaths, /SCAFFOLDER_PATH/)
  assert.match(fifoDetailPage, /ALL_FIFO_PATHS\.map/)
  assert.match(fifoDetailPage, /getAllFifoPath\(slug\)/)
})

test("homepage and FIFO chrome link into the launch routes", () => {
  assert.match(landing, /localizePath\("\/fifo", locale\)/)
  assert.match(landing, /localizePath\(`\/fifo\/\$\{path\.slug\}`/)
  assert.match(topNav, /normalizedPath\.startsWith\("\/fifo\/"\)/)
  assert.match(topNav, /const fifoDestination = localizePath\("\/fifo", pathLocale\)/)
  assert.match(footer, /const fifo = localizePath\("\/fifo", pathLocale\)/)
})

test("Driller's Offsider, Dump Truck Operator and Scaffolder are verified launch paths", () => {
  assert.match(fifoData, /slug: "drillers-offsider"[\s\S]*?status: "verified"/)
  assert.match(fifoData, /display: "A\$100k–A\$130k"/)
  assert.match(fifoData, /total: DRILLERS_OFFSIDER_SCORE/)

  assert.match(equipmentData, /slug: "dump-truck-operator"[\s\S]*?status: "verified"/)
  assert.match(equipmentData, /display: "A\$90k–A\$140k"/)
  assert.match(equipmentData, /total: DUMP_TRUCK_SCORE/)

  assert.match(scaffolderData, /slug: "scaffolder"[\s\S]*?status: "verified"/)
  assert.match(scaffolderData, /display: "A\$55–A\$65\/hr"/)
  assert.match(scaffolderData, /total: SCAFFOLDER_SCORE/)
  assert.match(scaffolderData, /CPCCLSF2001/)
  assert.match(scaffolderData, /CPCCLSF3001/)
  assert.match(scaffolderData, /CPCCLSF4001/)
  assert.match(scaffolderData, /SB ticket alone does not make someone FIFO-ready/)

  assert.match(fifoVerifiedDetail, /research\.score\.total/)
  assert.match(equipmentVerifiedDetail, /research\.score\.total/)
  assert.match(scaffolderVerifiedDetail, /Scaffolding has a three-step licence ladder/)
  assert.match(scaffolderVerifiedDetail, /Separate your first job from your first FIFO job/)
  assert.match(scaffolderVerifiedDetail, /research\.sources\.map/)
  assert.match(fifoDetailPage, /robots: \{ index: isVerified, follow: true \}/)
  assert.match(fifoDetailPage, /path\.slug === "dump-truck-operator"/)
  assert.match(fifoDetailPage, /path\.slug === "scaffolder"/)
})

test("broad Plant Operator, Excavator and Loader remain evidence-gated", () => {
  assert.match(fifoData, /slug: "plant-operator"[\s\S]*?status: "researching"/)
  assert.match(equipmentData, /slug: "excavator-operator"[\s\S]*?status: "researching"/)
  assert.match(equipmentData, /slug: "loader-operator"[\s\S]*?status: "researching"/)
  assert.match(fifoHub, /Broad Plant Operator, Excavator and Loader stay unrated/)
  assert.match(fifoResearchDetail, /This path is not rated yet/)
  assert.match(fifoResearchDetail, /unverified salary and score figures do not/)
})

test("Plant Operator is modeled as equipment-specific paths rather than one generic score", () => {
  assert.match(fifoData, /final CampCareer model designed to separate equipment-specific entry paths/)
  assert.match(fifoData, /Plant Operator will not receive one generic score/)
  assert.match(equipmentData, /repeatable new-to-industry route/)
  assert.match(equipmentData, /ticket alone does not solve the first-job problem/)
  assert.match(equipmentData, /will not equate a short course with job readiness/)
})
