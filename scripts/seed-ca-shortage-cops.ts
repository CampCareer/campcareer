/**
 * COPS shortage ratings를 occupations_ca 테이블에 반영
 *
 * 1차: shortage_rating + confidence 업데이트 (기존 컬럼)
 * 2차: COPS projection 컬럼 업데이트 (migration 후 실행 가능)
 *
 * 사용법: npx tsx scripts/seed-ca-shortage-cops.ts
 */

import { createClient } from "@supabase/supabase-js"
import fs from "fs"
import path from "path"
import dotenv from "dotenv"

dotenv.config({ path: path.resolve(".env.local") })

const RATINGS_PATH = path.resolve("src/data/ca-shortage-ratings.json")
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local")
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

interface ShortageEntry {
  noc_code: string
  shortage_rating: number
  confidence: "high" | "medium" | "low"
  rationale: string
  cops_future_outlook: string | null
  cops_recent_outlook: string | null
  projected_job_openings: number | null
  projected_job_seekers: number | null
  employment_growth: number | null
}

async function main() {
  const ratings: ShortageEntry[] = JSON.parse(fs.readFileSync(RATINGS_PATH, "utf-8"))
  console.log(`Read ${ratings.length} shortage ratings from ${RATINGS_PATH}`)

  // Step 1: Update shortage_rating + confidence (existing columns)
  let updated = 0
  let errors = 0
  for (const r of ratings) {
    const { error } = await supabase
      .from("occupations_ca")
      .update({
        shortage_rating: r.shortage_rating,
        confidence: r.confidence,
      })
      .eq("noc_code", r.noc_code)

    if (error) {
      console.error(`  Error updating ${r.noc_code}:`, error.message)
      errors++
    } else {
      updated++
    }
  }
  console.log(`\nStep 1 (shortage_rating + confidence): updated ${updated}, errors ${errors}`)

  // Step 2: Try updating COPS columns (may fail if migration not run yet)
  let copsUpdated = 0
  let copsErrors = 0
  for (const r of ratings) {
    const { error } = await supabase
      .from("occupations_ca")
      .update({
        cops_future_outlook: r.cops_future_outlook,
        cops_recent_outlook: r.cops_recent_outlook,
        projected_job_openings: r.projected_job_openings,
        projected_job_seekers: r.projected_job_seekers,
        employment_growth: r.employment_growth,
      })
      .eq("noc_code", r.noc_code)

    if (error) {
      copsErrors++
      if (copsErrors === 1) {
        console.error(`\nStep 2 (COPS columns): ${error.message}`)
        console.error("  → Run migration supabase/migrations/20260704000001_occupations_ca_cops.sql first")
      }
      break // one error means all will fail
    } else {
      copsUpdated++
    }
  }
  if (copsUpdated > 0) {
    console.log(`Step 2 (COPS columns): updated ${copsUpdated}, errors ${copsErrors}`)
  }

  // Summary
  const byRating: Record<number, number> = {}
  for (const r of ratings) {
    byRating[r.shortage_rating] = (byRating[r.shortage_rating] ?? 0) + 1
  }
  console.log(`\nCOPS shortage rating distribution:`)
  for (let i = 1; i <= 5; i++) {
    console.log(`  rating ${i}: ${byRating[i] ?? 0}`)
  }
}

main().catch(console.error)
