import { gzipSync } from "node:zlib"

const baseUrl = (process.env.MAP_BASE_URL ?? "http://127.0.0.1:3100").replace(/\/$/, "")
const countries = ["au", "us", "ca", "ie", "uk", "de", "nl", "be", "jp", "sg", "kr", "fr", "es"]
const failures = []
const report = []

await measure("initial-map", "/map", 700_000)
for (const country of countries) await measure(country, `/api/maps/data/${country}`, 200_000)

console.table(report)
if (failures.length) {
  console.error(`Payload budget failures:\n${failures.map((failure) => `- ${failure}`).join("\n")}`)
  process.exitCode = 1
}

async function measure(name, path, budget) {
  const response = await fetch(`${baseUrl}${path}`)
  if (!response.ok) {
    failures.push(`${name}: HTTP ${response.status}`)
    return
  }
  const raw = Buffer.from(await response.arrayBuffer())
  const gzipBytes = gzipSync(raw).byteLength
  report.push({ name, rawBytes: raw.byteLength, gzipBytes, budget, pass: gzipBytes <= budget })
  if (gzipBytes > budget) failures.push(`${name}: ${gzipBytes} gzip bytes exceeds ${budget}`)
}
