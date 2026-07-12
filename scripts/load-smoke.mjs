import { performance } from "node:perf_hooks"

const baseUrl = (process.env.LOAD_BASE_URL ?? "http://127.0.0.1:3100").replace(/\/$/, "")
const totalRequests = positiveInteger(process.env.LOAD_REQUESTS, 200)
const concurrency = positiveInteger(process.env.LOAD_CONCURRENCY, 20)
const maxErrorRate = Number(process.env.LOAD_MAX_ERROR_RATE ?? 0.005)
const maxP95Ms = Number(process.env.LOAD_MAX_P95_MS ?? 500)
const paths = (process.env.LOAD_PATHS ?? "/,/ko,/api/v1/taxonomy/search?q=nursing&locale=en,/api/v2/recommendations/countries")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean)

const timings = []
let errors = 0
let cursor = 0
const startedAt = performance.now()

await Promise.all(Array.from({ length: Math.min(concurrency, totalRequests) }, async () => {
  while (true) {
    const requestNumber = cursor++
    if (requestNumber >= totalRequests) return
    const path = paths[requestNumber % paths.length]
    const started = performance.now()
    try {
      const response = path.includes("/api/v2/recommendations/countries")
        ? await fetch(`${baseUrl}${path}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              locale: "en",
              originCountry: "GLOBAL",
              targetConceptId: "nursing",
              firstYearBudget: { amount: 60_000, currency: "USD" },
              priority: "CAREER_OUTCOME",
            }),
          })
        : await fetch(`${baseUrl}${path}`)
      await response.arrayBuffer()
      if (!response.ok) errors++
    } catch {
      errors++
    } finally {
      timings.push(performance.now() - started)
    }
  }
}))

timings.sort((a, b) => a - b)
const durationSeconds = (performance.now() - startedAt) / 1000
const p95 = percentile(timings, 0.95)
const p99 = percentile(timings, 0.99)
const errorRate = errors / totalRequests
const report = {
  baseUrl,
  requests: totalRequests,
  concurrency,
  requestsPerSecond: Number((totalRequests / durationSeconds).toFixed(2)),
  p95Ms: Number(p95.toFixed(2)),
  p99Ms: Number(p99.toFixed(2)),
  errors,
  errorRate: Number(errorRate.toFixed(5)),
  thresholds: { maxP95Ms, maxErrorRate },
}

console.log(JSON.stringify(report, null, 2))
if (errorRate > maxErrorRate || p95 > maxP95Ms) process.exitCode = 1

function positiveInteger(value, fallback) {
  const parsed = Number(value ?? fallback)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback
}

function percentile(values, ratio) {
  if (!values.length) return Number.POSITIVE_INFINITY
  return values[Math.min(values.length - 1, Math.ceil(values.length * ratio) - 1)]
}
