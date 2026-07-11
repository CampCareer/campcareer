import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"
import path from "path"
import fs from "fs"

dotenv.config({ path: path.resolve(__dirname, "../.env.local") })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase env vars")
  process.exit(1)
}
const supabase = createClient(supabaseUrl, supabaseKey)

const OUTLOOK_MAP: Record<string, number> = {
  "Very good": 5,
  Good: 4,
  Moderate: 3,
  Limited: 2,
  "Very limited": 1,
}

async function main() {
  // Load province outlook data
  const raw = fs.readFileSync(
    path.resolve(__dirname, "../src/data/ca-province-outlook.json"),
    "utf8"
  )
  const parsed = JSON.parse(raw)
  const outlookData: Record<string, Record<string, { outlook: string; rating: number | null }>> =
    parsed.data

  // Fetch existing occupation_state_ca rows
  const allRows: { noc_code: string; province: string; shortage_rating: number | null }[] = []
  let from = 0
  const pageSize = 1000
  while (true) {
    const { data: page, error } = await supabase
      .from("occupation_state_ca")
      .select("noc_code, province, shortage_rating")
      .range(from, from + pageSize - 1)
      .order("noc_code")
    if (error) {
      console.error("Error fetching rows:", error)
      process.exit(1)
    }
    allRows.push(...page)
    if (page.length < pageSize) break
    from += pageSize
  }

  console.log(`Fetched ${allRows.length} existing rows`)

  // Build map of existing ratings
  const existingMap = new Map<string, number | null>()
  for (const row of allRows) {
    existingMap.set(`${row.noc_code}-${row.province}`, row.shortage_rating)
  }

  const updated = 0
  let unchanged = 0
  let undetermined = 0
  const batchSize = 200
  const updates: { noc_code: string; province: string; shortage_rating: number | null }[] = []

  for (const [noc, provData] of Object.entries(outlookData)) {
    for (const [prov, info] of Object.entries(provData)) {
      const key = `${noc}-${prov}`
      const existing = existingMap.get(key)

      let newRating: number | null
      if (info.rating !== null) {
        newRating = info.rating
      } else {
        newRating = existing ?? null
        undetermined++
      }

      if (newRating !== existing) {
        updates.push({ noc_code: noc, province: prov, shortage_rating: newRating })
      } else {
        unchanged++
      }
    }
  }

  const totalPairs = Object.values(outlookData).reduce(
    (a, b) => a + Object.keys(b).length,
    0
  )
  console.log(`Total (NOC, Province) pairs: ${totalPairs}`)
  console.log(`To update: ${updates.length}`)
  console.log(`Unchanged: ${unchanged}`)
  console.log(`Undetermined (kept existing): ${undetermined}`)

  if (updates.length === 0) {
    console.log("No updates needed.")
    return
  }

  // Batch update
  for (let i = 0; i < updates.length; i += batchSize) {
    const batch = updates.slice(i, i + batchSize)
    const { error } = await supabase.from("occupation_state_ca").upsert(batch, {
      onConflict: "noc_code, province",
      ignoreDuplicates: false,
    })
    if (error) {
      console.error(`Batch ${i / batchSize + 1} error:`, error)
    } else {
      console.log(`Batch ${i / batchSize + 1}: ${batch.length} rows updated`)
    }
    await new Promise((r) => setTimeout(r, 200))
  }

  // Verify
  const { data: verify, error: verifyError } = await supabase
    .from("occupation_state_ca")
    .select("noc_code, province, shortage_rating")
    .in("noc_code", ["21231", "83101", "00010"])
    .order("noc_code")
    .order("province")

  if (!verifyError && verify) {
    console.log("\n=== Verification ===")
    for (const r of verify) {
      console.log(`NOC ${r.noc_code} | ${r.province} | shortage ${r.shortage_rating}`)
    }
  }

  console.log("\nDone!")
}

main().catch(console.error)
