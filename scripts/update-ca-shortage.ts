/**
 * occupations_ca 테이블에 shortage_rating 업데이트
 * 사용법: npx tsx scripts/update-ca-shortage.ts
 *
 * 데이터 소스: src/data/ca-shortage-ratings.json
 * (scripts/generate-ca-shortage.ts 로 생성)
 *
 * 실제 COPS(Canadian Occupational Projection System) 데이터로
 * 교체하려면 scripts/fetch-ca-shortage-cops.ts 를 먼저 실행.
 */
import { createClient } from "@supabase/supabase-js"
import fs from "fs"
import path from "path"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

const RATINGS_PATH = path.resolve("src/data/ca-shortage-ratings.json")
interface RatingRow {
  noc_code: string
  shortage_rating: number
  confidence: string
  rationale: string
}

async function main() {
  const ratings: RatingRow[] = JSON.parse(fs.readFileSync(RATINGS_PATH, "utf-8"))
  console.log(`Loading ${ratings.length} shortage ratings...`)

  const PAGE = 100
  let updated = 0
  for (let i = 0; i < ratings.length; i += PAGE) {
    const batch = ratings.slice(i, i + PAGE)
    const { error } = await supabase.from("occupations_ca").upsert(
      batch.map((r) => ({
        noc_code: r.noc_code,
        shortage_rating: r.shortage_rating,
        confidence: r.confidence,
      })),
      { onConflict: "noc_code" },
    )
    if (error) {
      console.error(`Batch ${i} failed:`, error)
    } else {
      updated += batch.length
      console.log(`  updated ${updated}/${ratings.length}`)
    }
  }

  // Verify
  const { data, error: verr } = await supabase
    .from("occupations_ca")
    .select("noc_code, shortage_rating")
    .not("shortage_rating", "is", null)
  if (verr) {
    console.error("Verify error:", verr)
  } else {
    console.log(`\nVerified: ${data?.length ?? 0} rows have shortage_rating set`)
    const byRating: Record<number, number> = {}
    for (const r of data ?? []) {
      byRating[r.shortage_rating] = (byRating[r.shortage_rating] ?? 0) + 1
    }
    for (let i = 1; i <= 5; i++) {
      console.log(`  rating ${i}: ${byRating[i] ?? 0}`)
    }
  }
}

main().catch(console.error)
