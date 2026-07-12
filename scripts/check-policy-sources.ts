import { createHash } from "node:crypto"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { COUNTRY_ROI_INSIGHTS } from "../src/data/country-roi-mvp"

type Snapshot = {
  countryCode: string
  sourceName: string
  requestedUrl: string
  finalUrl: string
  contentHash: string
  etag: string | null
  lastModified: string | null
  checkedAt: string
  monitorMode: "content" | "headers_or_availability"
}

type ReviewItem = Snapshot & {
  previousContentHash: string
  detectedAt: string
  status: "review_required"
}

const ROOT = resolve(process.cwd())
const SNAPSHOT_PATH = resolve(ROOT, "data/policy-source-snapshots.json")
const REVIEW_PATH = resolve(ROOT, "data/policy-review-required.json")
const update = process.argv.includes("--update")

const sources = COUNTRY_ROI_INSIGHTS.map((country) => ({
  countryCode: country.code,
  sourceName: country.sources.policy.sourceName,
  url: country.sources.policy.sourceUrl,
})).filter((source): source is typeof source & { url: string } => Boolean(source.url))

async function main() {
const previous = await readSnapshots()
const previousByCountry = new Map(previous.map((snapshot) => [snapshot.countryCode, snapshot]))
const current: Snapshot[] = []
const reviewRequired: ReviewItem[] = []
const failures: string[] = []

for (const source of sources) {
  try {
    const response = await fetchWithTimeout(source.url)
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const normalized = normalizePolicyDocument(await response.text())
      const canMonitorContent = normalized.length >= 200 && !/radware page|loader page/i.test(normalized.slice(0, 500))
      const fingerprint = canMonitorContent
        ? normalized
        : [response.url, response.headers.get("etag"), response.headers.get("last-modified"), response.status].join("|")
    const snapshot: Snapshot = {
      countryCode: source.countryCode,
      sourceName: source.sourceName,
      requestedUrl: source.url,
      finalUrl: response.url,
        contentHash: createHash("sha256").update(fingerprint).digest("hex"),
      etag: response.headers.get("etag"),
      lastModified: response.headers.get("last-modified"),
        checkedAt: new Date().toISOString(),
        monitorMode: canMonitorContent ? "content" : "headers_or_availability",
    }
    current.push(snapshot)
    const old = previousByCountry.get(source.countryCode)
    if (old && old.contentHash !== snapshot.contentHash) {
      reviewRequired.push({
        ...snapshot,
        previousContentHash: old.contentHash,
        detectedAt: snapshot.checkedAt,
        status: "review_required",
      })
    }
  } catch (error) {
    failures.push(`${source.countryCode}: ${error instanceof Error ? error.message : String(error)}`)
  }
}

if (failures.length) {
  console.error(`Policy checks failed:\n${failures.map((failure) => `- ${failure}`).join("\n")}`)
  process.exitCode = 1
} else if (update || previous.length === 0) {
  await writeJson(SNAPSHOT_PATH, current)
  await writeJson(REVIEW_PATH, [])
  console.log(`Updated ${current.length} policy source snapshots.`)
} else if (reviewRequired.length) {
  await writeJson(REVIEW_PATH, reviewRequired)
  console.error(`${reviewRequired.length} policy sources changed and require editorial review.`)
  process.exitCode = 2
} else {
  await writeJson(REVIEW_PATH, [])
  console.log(`${current.length} policy sources are unchanged.`)
}
}

async function readSnapshots(): Promise<Snapshot[]> {
  try {
    return JSON.parse(await readFile(SNAPSHOT_PATH, "utf8")) as Snapshot[]
  } catch {
    return []
  }
}

async function fetchWithTimeout(url: string) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 20_000)
  try {
    return await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0 Safari/537.36 CampCareerPolicyMonitor/1.0",
        Accept: "text/html,application/xhtml+xml,application/pdf;q=0.8,*/*;q=0.5",
      },
    })
  } finally {
    clearTimeout(timeout)
  }
}

function normalizePolicyDocument(value: string) {
  return value
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--([\s\S]*?)-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim()
}

async function writeJson(path: string, value: unknown) {
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`, "utf8")
}

void main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
