import assert from "node:assert/strict"
import { readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"
import { test } from "node:test"

const FIXTURES = "scripts/data-foundation/common-ingestion/tests/fixtures"

const readJson = (rel: string) => JSON.parse(readFileSync(rel, "utf8"))
const readJsonl = (rel: string) =>
  readFileSync(rel, "utf8").trim().split("\n").filter(Boolean).map((line) => JSON.parse(line))
const readCsv = (rel: string) => {
  const [header, ...rows] = readFileSync(rel, "utf8").trim().split("\n")
  const cols = header.split(",")
  const parseRow = (line: string): string[] => {
    const out: string[] = []
    let cur = ""
    let quoted = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (quoted) {
        if (ch === '"' && line[i + 1] === '"') {
          cur += '"'
          i++
        } else if (ch === '"') {
          quoted = false
        } else {
          cur += ch
        }
      } else if (ch === '"') {
        quoted = true
      } else if (ch === ",") {
        out.push(cur)
        cur = ""
      } else {
        cur += ch
      }
    }
    out.push(cur)
    return out
  }
  return rows.map((line) => {
    const out: Record<string, string> = {}
    parseRow(line).forEach((value, i) => (out[cols[i]] = value))
    return out
  })
}
const files = (dir: string) => new Set(readdirSync(dir))

const PACKAGES = [
  { dir: "data/candidates/programme/IE/2026-08-03", domain: "programme", country: "IE", status: "valid", count: 3 },
  { dir: "data/candidates/visa/AU/2026-08-03", domain: "visa", country: "AU", status: "invalid", count: 4 },
  { dir: "data/candidates/geography/GB/2026-08-03", domain: "geography", country: "GB", status: "invalid", count: 6 },
]

test("each candidate package contains exactly the required 8 files", () => {
  for (const pkg of PACKAGES) {
    const names = files(pkg.dir)
    for (const required of [
      "source_manifest.json",
      "candidate_records.jsonl",
      "validation_report.json",
      "duplicate_review_queue.csv",
      "unresolved_identity_queue.csv",
      "package_manifest.json",
      "SHA256SUMS.txt",
      "README.md",
    ]) {
      assert.ok(names.has(required), `${pkg.dir}: missing ${required}`)
    }
    assert.equal(names.size, 8, `${pkg.dir}: unexpected extra files`)
  }
})

test("candidate records: import_status is always candidate_only, no forbidden keys", () => {
  for (const pkg of PACKAGES) {
    const records = readJsonl(join(pkg.dir, "candidate_records.jsonl"))
    assert.equal(records.length, pkg.count)
    for (const rec of records) {
      assert.equal(rec.import_status, "candidate_only", rec.candidate_id)
      assert.equal(rec.candidate_schema_version, "1.0.0")
      assert.ok(rec.candidate_id.startsWith(`${rec.source_id}:`), rec.candidate_id)
      assert.ok(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rec.candidate_id))
      assert.equal(rec.payload.production_imported, undefined)
      assert.equal(rec.payload.canonical_uuid, undefined)
      assert.equal(rec.payload.auto_merged, undefined)
      assert.ok(["valid", "valid_with_warnings", "invalid", "blocked"].includes(rec.validation_status))
      assert.ok(["new_candidate", "exact_match", "duplicate_review", "unresolved"].includes(rec.identity_status))
    }
  }
})

test("package manifest and validation report agree on counts and policy", () => {
  for (const pkg of PACKAGES) {
    const report = readJson(join(pkg.dir, "validation_report.json"))
    const pm = readJson(join(pkg.dir, "package_manifest.json"))
    assert.equal(report.overall_status, pkg.status)
    assert.equal(pm.candidate_count, pkg.count)
    assert.equal(pm.import_status, "candidate_only")
    assert.equal(report.production_database_writes, 0)
    assert.equal(report.migration_count, 0)
    assert.equal(report.canonical_import_count, 0)
    assert.equal(report.fuzzy_match_count, 0)
    assert.equal(report.arbitrary_uuid_count, 0)
    assert.equal(report.null_to_zero_conversion_count, 0)
    assert.equal(report.uk_new_canonical_code_count, 0)
    assert.equal(report.country_code_database_compatibility, "blocked_pending_uk_to_gb_resolution")
    // SHA256SUMS covers every package file except itself
    const sums = new Set(readFileSync(join(pkg.dir, "SHA256SUMS.txt"), "utf8").split("\n").filter(Boolean).map((l) => l.split("  ")[1]))
    assert.equal(sums.size, 7)
    assert.ok(!sums.has("SHA256SUMS.txt"))
    for (const name of files(pkg.dir)) {
      if (name !== "SHA256SUMS.txt") assert.ok(sums.has(name), `${pkg.dir}: ${name} not checksummed`)
    }
  }
})

test("geography GB package: UK input normalizes to GB with raw value preserved", () => {
  const pkgDir = "data/candidates/geography/GB/2026-08-03"
  const records = readJsonl(join(pkgDir, "candidate_records.jsonl"))
  const uk = records.find((r) => r.source_record_key === "UK:country:GB-002")
  assert.ok(uk)
  assert.equal(uk.country_code, "GB")
  assert.equal(uk.evidence.raw_country_code, "UK")
  assert.equal(uk.evidence.country_code_alias_applied, "UK")
  assert.equal(uk.evidence.country_code_alias_normalized, true)
  assert.ok(records.every((r) => r.country_code !== "UK"))
  const report = readJson(join(pkgDir, "validation_report.json"))
  assert.equal(report.uk_input_count, 1)
  assert.equal(report.uk_output_canonical_count, 1)
})

test("geography GB package: unknown sentinels become null (never 0)", () => {
  const pkgDir = "data/candidates/geography/GB/2026-08-03"
  const records = readJsonl(join(pkgDir, "candidate_records.jsonl"))
  const scot = records.find((r) => r.source_record_key === "GB:country:002")
  assert.ok(scot)
  assert.equal(scot.payload.area_km2, null)
  assert.equal(scot.payload.capital, null)
  assert.equal(scot.payload.unknown_marker, null)
  assert.deepEqual(scot.evidence.normalized_unknown_to_null.sort(), ["capital", "unknown_marker"])
  const report = readJson(join(pkgDir, "validation_report.json"))
  assert.equal(report.null_to_zero_conversion_count, 0)
})

test("duplicate review queue lists every member of a duplicate group (never auto-deletes)", () => {
  const geo = readCsv("data/candidates/geography/GB/2026-08-03/duplicate_review_queue.csv")
  const dupRows = geo.filter((r) => r.source_record_key === "GB:country:001")
  assert.equal(dupRows.length, 2) // both members queued
  assert.ok(dupRows.every((r) => r.resolution_status === "pending_review"))
  assert.ok(dupRows.every((r) => r.reason.includes("automatic deduplication is forbidden")))
  const visa = readCsv("data/candidates/visa/AU/2026-08-03/duplicate_review_queue.csv")
  assert.equal(visa.filter((r) => r.source_record_key === "AU:visa:subclass-189").length, 2)
})

test("unresolved identity queue flags records with undeclared sources", () => {
  const unresolved = readCsv("data/candidates/geography/GB/2026-08-03/unresolved_identity_queue.csv")
  assert.equal(unresolved.length, 1)
  assert.equal(unresolved[0].source_id, "not-a-declared-source")
  assert.equal(unresolved[0].resolution_status, "pending_resolution")
})

test("validation report lists all 11 rules", () => {
  const report = readJson("data/candidates/geography/GB/2026-08-03/validation_report.json")
  const ids = report.rules.map((r: { rule_id: string }) => r.rule_id)
  assert.deepEqual(ids, [
    "manifest_valid",
    "file_checksum",
    "schema_valid",
    "required_fields",
    "country_code_normalization",
    "date_valid",
    "source_lineage",
    "duplicate_source_key",
    "candidate_identity",
    "null_unknown",
    "import_safety",
  ])
})

test("fixture sources: programme-ie manifest validates clean, tier-3 warns only", () => {
  const programme = readJson(`${FIXTURES}/programme-ie/manifest.json`)
  const geo = readJson(`${FIXTURES}/geography-gb/manifest.json`)
  const visa = readJson(`${FIXTURES}/visa-au/manifest.json`)
  assert.equal(programme.package_source_count, 1)
  assert.equal(geo.package_source_count, 2)
  assert.equal(visa.package_source_count, 1)
  const t3 = geo.sources.find((s: { raw_storage_tier: string }) => s.raw_storage_tier === "t3")
  assert.ok(t3)
  assert.ok(t3.licence.toLowerCase().includes("restricted"))
})

test("no candidate package files contain forbidden content", () => {
  for (const pkg of PACKAGES) {
    const records = readJsonl(join(pkg.dir, "candidate_records.jsonl"))
    assert.ok(records.every((r) => r.country_code !== "UK"), `${pkg.dir}: canonical UK present`)
    const blob = readFileSync(join(pkg.dir, "candidate_records.jsonl"), "utf8")
    assert.ok(!blob.includes("canonical_uuid"), `${pkg.dir}: canonical_uuid present`)
    assert.ok(!blob.includes("production_imported"), `${pkg.dir}: production_imported present`)
    assert.ok(!blob.includes("auto_merged"), `${pkg.dir}: auto_merged present`)
  }
})
