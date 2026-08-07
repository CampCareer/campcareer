import "server-only"

import { readFile } from "node:fs/promises"
import path from "node:path"
import { Client } from "pg"

const CKAN_BASE = "https://data.gov.au/data/api/action/datastore_search"
const DATASET_URL = "https://data.gov.au/data/dataset/commonwealth-register-of-institutions-and-courses-for-overseas-students-cricos"
const LOCATIONS_RESOURCE = "45d29535-1360-4486-8242-3850e61b5524"
const COURSE_LOCATIONS_RESOURCE = "4cd2de02-8ba3-4eb2-bac2-fe272cae3f5f"
const SOURCE_LAST_MODIFIED = "2026-08-04T08:04:04.780467+00:00"
const PAGE_SIZE = 5000

type CkanRecord = Record<string, unknown>
type CkanResponse = {
  success: boolean
  result: {
    total: number
    records: CkanRecord[]
  }
}

function text(value: unknown) {
  if (value == null) return null
  const result = String(value).trim()
  return result || null
}

function integer(value: unknown) {
  const result = Number.parseInt(String(value ?? ""), 10)
  return Number.isFinite(result) ? result : null
}

async function fetchResource(resourceId: string) {
  const records: CkanRecord[] = []
  let offset = 0
  let total = Number.POSITIVE_INFINITY

  while (offset < total) {
    const url = new URL(CKAN_BASE)
    url.searchParams.set("resource_id", resourceId)
    url.searchParams.set("limit", String(PAGE_SIZE))
    url.searchParams.set("offset", String(offset))

    const response = await fetch(url, { headers: { Accept: "application/json" } })
    if (!response.ok) throw new Error(`CRICOS CKAN request failed (${response.status}) for ${resourceId}`)

    const payload = (await response.json()) as CkanResponse
    if (!payload.success) throw new Error(`CRICOS CKAN returned success=false for ${resourceId}`)

    total = payload.result.total
    records.push(...payload.result.records)
    offset += payload.result.records.length
    if (payload.result.records.length === 0) break
  }

  if (records.length !== total) {
    throw new Error(`CRICOS resource ${resourceId}: expected ${total} rows, received ${records.length}`)
  }
  return records
}

async function insertRows(
  client: Client,
  table: string,
  columns: string[],
  rows: unknown[][],
  chunkSize = 500,
) {
  for (let start = 0; start < rows.length; start += chunkSize) {
    const chunk = rows.slice(start, start + chunkSize)
    const params: unknown[] = []
    const values = chunk.map((row, rowIndex) => {
      const placeholders = row.map((value, columnIndex) => {
        params.push(value)
        return `$${rowIndex * columns.length + columnIndex + 1}`
      })
      return `(${placeholders.join(",")})`
    })
    await client.query(
      `insert into ${table} (${columns.join(",")}) values ${values.join(",")}`,
      params,
    )
  }
}

async function refreshDerivedData(client: Client) {
  const root = process.cwd()
  const files = [
    "supabase/migrations/20260807125832_materialize_au_cricos_campuses_v1.sql",
    "supabase/migrations/20260807125930_verify_au_cricos_programme_locations_v1.sql",
    "supabase/migrations/20260807130206_republish_sydney_cricos_campus_directory_v1.sql",
  ]

  for (const file of files) {
    const sql = await readFile(path.join(root, file), "utf8")
    await client.query(sql)
  }
}

async function main() {
  const connectionString = process.env.SUPABASE_DB_URL ?? process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error("Set SUPABASE_DB_URL or DATABASE_URL to a direct Postgres connection string.")
  }

  console.log("Fetching official CRICOS Locations and Course Locations…")
  const [locations, courseLocations] = await Promise.all([
    fetchResource(LOCATIONS_RESOURCE),
    fetchResource(COURSE_LOCATIONS_RESOURCE),
  ])

  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } })
  await client.connect()

  try {
    await client.query("begin")
    await client.query("truncate table ingest.cricos_course_locations_au, ingest.cricos_locations_au restart identity")

    const locationRows = locations.flatMap((row) => {
      const providerCode = text(row["CRICOS Provider Code"])
      const institutionName = text(row["Institution Name"])
      const locationName = text(row["Location Name"])
      if (!providerCode || !institutionName || !locationName) return []
      return [[
        integer(row._id), providerCode, institutionName, locationName, text(row["Location Type"]),
        text(row["Address Line 1"]), text(row["Address Line 2"]), text(row["Address Line 3"]), text(row["Address Line 4"]),
        text(row.City), text(row.State), text(row.Postcode), LOCATIONS_RESOURCE, SOURCE_LAST_MODIFIED,
      ]]
    })

    await insertRows(
      client,
      "ingest.cricos_locations_au",
      ["source_row_id","provider_code","institution_name","location_name","location_type","address_line_1","address_line_2","address_line_3","address_line_4","city","state","postcode","source_resource_id","source_last_modified"],
      locationRows,
    )

    const seen = new Set<string>()
    const courseLocationRows = courseLocations.flatMap((row) => {
      const providerCode = text(row["CRICOS Provider Code"])
      const institutionName = text(row["Institution Name"])
      const courseCode = text(row["CRICOS Course Code"])
      const locationName = text(row["Location Name"])
      if (!providerCode || !institutionName || !courseCode || !locationName) return []
      const locationCity = text(row["Location City"])
      const locationState = text(row["Location State"])
      const key = [providerCode, courseCode, locationName, locationCity ?? "", locationState ?? ""].join("|")
      if (seen.has(key)) return []
      seen.add(key)
      return [[integer(row._id), providerCode, institutionName, courseCode, locationName, locationCity, locationState, COURSE_LOCATIONS_RESOURCE, SOURCE_LAST_MODIFIED]]
    })

    await insertRows(
      client,
      "ingest.cricos_course_locations_au",
      ["source_row_id","provider_code","institution_name","course_code","location_name","location_city","location_state","source_resource_id","source_last_modified"],
      courseLocationRows,
    )

    await refreshDerivedData(client)
    await client.query("commit")

    const result = await client.query(`
      select
        (select count(*) from ingest.cricos_locations_au) as locations,
        (select count(*) from ingest.cricos_course_locations_au) as course_locations,
        (select count(*) from ingest.courses_au where cricos_status='active' and verified_city_slugs @> array['sydney']::text[]) as sydney_programs
    `)
    console.log("CRICOS location sync complete", { ...result.rows[0], source: DATASET_URL })
  } catch (error) {
    await client.query("rollback")
    throw error
  } finally {
    await client.end()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
