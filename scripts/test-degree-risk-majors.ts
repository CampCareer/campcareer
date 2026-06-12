/**
 * Verify all 10 major slugs × AU/IE return a row from the majors table.
 * Run: npx tsx scripts/test-degree-risk-majors.ts
 */
import * as dotenv from "dotenv"
import * as path from "path"
import { createClient } from "@supabase/supabase-js"

dotenv.config({ path: path.resolve(__dirname, "../.env.local") })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local")
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

const SLUGS = [
  "computer-science",
  "data-analytics",
  "software-engineering",
  "nursing",
  "civil-engineering",
  "business-management",
  "accounting",
  "ux-design",
  "psychology",
  "music",
] as const

const COUNTRIES = ["AU", "IE"] as const

async function main() {
  let passed = 0
  let failed = 0
  const failures: string[] = []

  for (const slug of SLUGS) {
    for (const country of COUNTRIES) {
      const { data, error } = await supabase
        .from("majors")
        .select("slug, country, overall_risk")
        .eq("slug", slug)
        .eq("country", country)
        .maybeSingle()

      if (error) {
        failed++
        const msg = `ERROR  ${slug} / ${country}: ${error.message}`
        failures.push(msg)
        console.error(msg)
        continue
      }

      if (!data) {
        failed++
        const msg = `FAIL   ${slug} / ${country}: no row returned`
        failures.push(msg)
        console.error(msg)
        continue
      }

      passed++
      console.log(`  OK   ${slug} / ${country} → risk=${data.overall_risk}`)
    }
  }

  console.log(`\n── Results ──`)
  console.log(`Passed: ${passed} / ${SLUGS.length * COUNTRIES.length}`)
  console.log(`Failed: ${failed}`)

  if (failures.length > 0) {
    console.log(`\nFailures:`)
    for (const f of failures) {
      console.log(`  ${f}`)
    }
    process.exit(1)
  }

  console.log(`\nAll ${SLUGS.length * COUNTRIES.length} combinations returned a row.`)
}

main().catch((err) => {
  console.error("Unhandled error:", err)
  process.exit(1)
})
