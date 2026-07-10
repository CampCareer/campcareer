import { createHash } from "crypto"
import { mkdir, readFile, writeFile } from "fs/promises"
import path from "path"

type Snapshot = {
  sourceCode: string
  sourceName: string
  sourceUrl: string
  datasetUrl: string | null
  retrievedAt: string | null
  lastChecked: string
  contentHash: string | null
  method: "official-api" | "official-download" | "official-web"
  licenseStatus: "commercial-allowed" | "pending-verification" | "restricted"
  commercialUseAllowed: boolean
  reviewStatus: "approved" | "review-required" | "blocked"
  status: "cataloged" | "ingested" | "blocked"
  note: string
}

const ROOT = process.cwd()
const DATA_DIR = path.join(ROOT, "src/data")
const RAW_DIR = path.join(ROOT, "data/raw/kr")
const checkedAt = new Date().toISOString().slice(0, 10)
const retrievedAt = new Date().toISOString()

function sha256(body: Uint8Array) {
  return createHash("sha256").update(body).digest("hex")
}

async function loadSnapshots() {
  return JSON.parse(await readFile(path.join(DATA_DIR, "kr-source-snapshots.json"), "utf8")) as Snapshot[]
}

async function main() {
  const serviceKey = process.env.DATA_GO_KR_SERVICE_KEY
  const careerNetKey = process.env.CAREERNET_API_KEY
  const boundaryUrl = process.env.KR_SIDO_BOUNDARY_URL
  const rentUrl = process.env.KR_RENT_API_URL
  const workforceUrl = process.env.KR_WORKFORCE_DATASET_URL

  const missing = [
    !serviceKey && "DATA_GO_KR_SERVICE_KEY",
    !careerNetKey && "CAREERNET_API_KEY",
  ].filter(Boolean)

  if (missing.length > 0) {
    console.log(`[kr-import] blocked: missing ${missing.join(", ")}. No data was generated.`)
    console.log("[kr-import] Configure keys and source URLs in the deployment environment, then rerun. Existing public files remain unchanged.")
    return
  }

  await mkdir(RAW_DIR, { recursive: true })
  const downloads: Array<{ sourceCode: string; url: string; filename: string }> = [
    ...(boundaryUrl ? [{ sourceCode: "MOIS-SIDO-BOUNDARY", url: boundaryUrl, filename: "sido-boundaries.geojson" }] : []),
    ...(rentUrl ? [{ sourceCode: "MOLIT-RENT", url: rentUrl, filename: "rent-response.json" }] : []),
    ...(workforceUrl ? [{ sourceCode: "MOEL-WF", url: workforceUrl, filename: "workforce-source.bin" }] : []),
  ]

  if (downloads.length === 0) {
    console.log("[kr-import] blocked: provide KR_SIDO_BOUNDARY_URL and one or more approved official dataset URLs. No data was generated.")
    return
  }

  const snapshots = await loadSnapshots()
  for (const item of downloads) {
    const response = await fetch(item.url, {
      headers: {
        "user-agent": "CampCareer Korea official-data importer/1.0 (+https://www.campcareer.com)",
        "Authorization": `Bearer ${serviceKey}`,
      },
    })
    if (!response.ok) throw new Error(`${item.sourceCode}: ${response.status} ${response.statusText}`)
    const body = new Uint8Array(await response.arrayBuffer())
    await writeFile(path.join(RAW_DIR, item.filename), body)
    const snapshot = snapshots.find((candidate) => candidate.sourceCode === item.sourceCode)
    if (snapshot) {
      snapshot.retrievedAt = retrievedAt
      snapshot.lastChecked = checkedAt
      snapshot.contentHash = sha256(body)
      snapshot.status = "ingested"
      // A successful response is not proof of a reusable commercial licence.
      // Human review must explicitly approve the source before numbers become public.
      snapshot.reviewStatus = "review-required"
    }
  }

  await writeFile(path.join(DATA_DIR, "kr-source-snapshots.json"), `${JSON.stringify(snapshots, null, 2)}\n`)
  console.log(`[kr-import] downloaded ${downloads.length} raw official responses. Public occupations remain unchanged until licence and schema review approve them.`)
}

main().catch((error) => {
  console.error("[kr-import] failed", error)
  process.exit(1)
})
