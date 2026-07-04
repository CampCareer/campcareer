import { createClient } from "@supabase/supabase-js"
import fs from "fs"
import path from "path"
import dotenv from "dotenv"

dotenv.config({ path: path.resolve(".env.local") })

const STATE_PATH = path.resolve("src/data/ca-occupation-state.json")
const STATE_DATA: Record<string, Array<{
  noc_code: string
  median_wage_cad: number
  low_wage_cad: number | null
  high_wage_cad: number | null
  shortage_rating: number | null
  data_source: string
}>> = JSON.parse(fs.readFileSync(STATE_PATH, "utf-8"))

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  // Clear existing
  await supabase.from("occupation_state_ca").delete().neq("noc_code", "")

  let total = 0
  const PAGE = 200
  const rows: Array<{
    noc_code: string
    province: string
    median_wage_cad: number | null
    low_wage_cad: number | null
    high_wage_cad: number | null
    shortage_rating: number | null
    data_source: string | null
  }> = []

  for (const [province, occs] of Object.entries(STATE_DATA)) {
    for (const o of occs) {
      rows.push({
        noc_code: o.noc_code,
        province,
        median_wage_cad: o.median_wage_cad,
        low_wage_cad: o.low_wage_cad,
        high_wage_cad: o.high_wage_cad,
        shortage_rating: o.shortage_rating,
        data_source: o.data_source,
      })
    }
  }

  for (let i = 0; i < rows.length; i += PAGE) {
    const batch = rows.slice(i, i + PAGE)
    const { error } = await supabase.from("occupation_state_ca").upsert(batch, {
      onConflict: "noc_code, province",
    })
    if (error) {
      console.error(`Batch ${i} failed:`, error)
    } else {
      total += batch.length
      console.log(`  inserted ${total}/${rows.length}`)
    }
  }

  // Verify
  const { count } = await supabase
    .from("occupation_state_ca")
    .select("*", { count: "exact", head: true })
  console.log(`\nVerified: ${count} rows in occupation_state_ca`)
}

main().catch(console.error)
