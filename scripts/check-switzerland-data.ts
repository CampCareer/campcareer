import { readFileSync } from "node:fs"
import { join } from "node:path"
import { CH_CANTON_CODES } from "../src/app/map/states"

type RecordLike = Record<string, unknown>
const root = process.cwd()
const read = <T>(file: string): T => JSON.parse(readFileSync(join(root, file), "utf8")) as T
const regions = read<RecordLike[]>("src/data/ch-regions.json")
const cities = read<RecordLike[]>("src/data/ch-cities.json")
const institutions = read<RecordLike[]>("src/data/ch-universities.json")
const occupations = read<RecordLike[]>("src/data/ch-occupations.json")
const snapshots = read<RecordLike[]>("src/data/ch-source-snapshots.json")
const geometry = read<{ type?: string; features?: Array<{ properties?: RecordLike; geometry?: unknown }> }>("public/ch-cantons.geojson")
const issues: string[] = []
const expected = new Set(CH_CANTON_CODES)
const codes = regions.map((row) => String(row.code ?? ""))
const requiredAccreditedInstitutionSlugs = [
  "epfl", "eth-zurich", "university-of-basel", "university-of-bern", "university-of-fribourg", "university-of-geneva", "university-of-lausanne", "university-of-lucerne", "university-of-neuchatel", "university-of-st-gallen", "usi", "university-of-zurich",
  "bern-university-of-applied-sciences", "fhgr", "fhnw", "hes-so", "lucerne-university-of-applied-sciences", "kalaidos", "ost", "supsi", "zhaw", "zhdk",
  "hep-bejune", "hep-vaud", "hep-valais", "ivp-nms", "hfh", "phbern", "ph-fhnw", "phgr", "ph-luzern", "ph-st-gallen", "ph-schaffhausen", "ph-schwyz", "ph-thurgau", "ph-zurich", "ph-zug", "hlo", "supsi-dfa", "sfuvet",
]

if (geometry.type !== "FeatureCollection" || geometry.features?.length !== 26) issues.push("Swiss GeoJSON must contain exactly 26 canton features")
const geometryCodes = new Set((geometry.features ?? []).map((feature) => String(feature.properties?.code ?? "")))
for (const code of expected) {
  if (!codes.includes(code)) issues.push(`Missing canton registry row: ${code}`)
  if (!geometryCodes.has(code)) issues.push(`Missing canton geometry: ${code}`)
}
if (new Set(codes).size !== 26) issues.push("Canton codes must be unique")
const institutionSlugs = new Set(institutions.map((row) => String(row.slug ?? "")))
for (const slug of requiredAccreditedInstitutionSlugs) {
  if (!institutionSlugs.has(slug)) issues.push(`Missing swissuniversities HEdA institution: ${slug}`)
}
for (const row of [...cities, ...institutions]) {
  const canton = String(row.cantonCode ?? "")
  if (!expected.has(canton as typeof CH_CANTON_CODES[number])) issues.push(`Invalid canton reference: ${String(row.nameEn ?? row.slug ?? "unknown")}`)
  if (typeof row.sourceRowId !== "string" || !row.sourceRowId) issues.push(`Missing source row: ${String(row.nameEn ?? row.slug ?? "unknown")}`)
}
for (const row of snapshots) {
  if (!String(row.contentHash ?? "").startsWith("sha256:")) issues.push(`Snapshot hash missing: ${String(row.category ?? "unknown")}`)
  if (!Array.isArray(row.datasetUrls) || row.datasetUrls.length === 0) issues.push(`Dataset URL missing: ${String(row.category ?? "unknown")}`)
}
for (const row of occupations) {
  if (typeof row.medianMonthlyChf !== "number" || String(row.scope) !== "Switzerland-wide" || !String(row.sourceRowId ?? "")) issues.push(`Invalid official occupation-group observation: ${String(row.chIscoCode ?? "unknown")}`)
}

if (issues.length) {
  console.error("[switzerland-data] failed")
  issues.forEach((issue) => console.error(`- ${issue}`))
  process.exit(1)
}
console.log(`[switzerland-data] ${regions.length} cantons, ${cities.length} representative cities, ${institutions.length} accredited institutions, ${occupations.length} official occupation groups.`)
